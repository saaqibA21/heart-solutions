/**
 * CardioSuite AI - AudioWorklet Processor
 * Runs on dedicated real-time audio thread (off main thread)
 * Implements: Butterworth 25-400Hz Bandpass + Envelope Follower + S1/S2 Peak Detection
 * Based on: PhysioNet PCG Signal Processing Standards
 */

class CardioAudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.sampleRate = sampleRate; // AudioWorklet global
    this.blockCount = 0;
    this.peakHoldSamples = 0;
    this.silenceCount = 0;
    this.lastPeakTime = 0;
    this.peakThreshold = 0.015;
    this.envelopeValue = 0;
    this.envelopeAttack = 0.001;
    this.envelopeRelease = 0.005;
    this.adaptiveThresholdHistory = new Float32Array(50).fill(0.015);
    this.adaptiveIdx = 0;
    this.isPaused = false;
    
    // Butterworth 25-400 Hz bandpass at 44100 Hz
    // Computed via bilinear transform: 2nd-order HPF (25Hz) cascaded with 2nd-order LPF (400Hz)
    // HPF coefficients (25 Hz cutoff, 44100 Hz SR)
    this.hpf = {
      b0: 0.99644,  b1: -1.99288, b2: 0.99644,
      a1: -1.99284, a2: 0.99292,
      x1: 0, x2: 0, y1: 0, y2: 0
    };
    // LPF coefficients (400 Hz cutoff, 44100 Hz SR)  
    this.lpf = {
      b0: 0.00078,  b1: 0.00156, b2: 0.00078,
      a1: -1.92124, a2: 0.92336,
      x1: 0, x2: 0, y1: 0, y2: 0
    };
    
    // Spectrogram buffer: 512 samples
    this.spectrogramBuffer = new Float32Array(512);
    this.spectrogramFill = 0;

    this.port.onmessage = (e) => {
      if (e.data.type === 'SET_PAUSED') this.isPaused = e.data.value;
      if (e.data.type === 'SET_THRESHOLD') this.peakThreshold = e.data.value;
    };
  }

  // Biquad Direct Form II Transposed
  processBiquad(filter, input) {
    const out = filter.b0 * input + filter.x1;
    filter.x1 = filter.b1 * input - filter.a1 * out + filter.x2;
    filter.x2 = filter.b2 * input - filter.a2 * out;
    return out;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0] || input[0].length === 0) return true;
    if (this.isPaused) return true;

    const inputChannel = input[0];
    const outputChannel = output[0];
    const blockSize = inputChannel.length;
    
    let rmsSum = 0;
    let blockPeak = 0;
    
    for (let i = 0; i < blockSize; i++) {
      // Two-stage bandpass: HPF then LPF
      let filtered = this.processBiquad(this.hpf, inputChannel[i]);
      filtered = this.processBiquad(this.lpf, filtered);
      
      outputChannel[i] = filtered;
      
      // Spectrogram buffer
      this.spectrogramBuffer[this.spectrogramFill % 512] = filtered;
      this.spectrogramFill++;
      
      // RMS accumulation
      rmsSum += filtered * filtered;
      
      // Envelope follower
      const absVal = Math.abs(filtered);
      if (absVal > this.envelopeValue) {
        this.envelopeValue += this.envelopeAttack * (absVal - this.envelopeValue);
      } else {
        this.envelopeValue += this.envelopeRelease * (absVal - this.envelopeValue);
      }
      
      if (this.envelopeValue > blockPeak) blockPeak = this.envelopeValue;
    }
    
    const rms = Math.sqrt(rmsSum / blockSize);
    this.blockCount++;
    
    // Adaptive threshold update every 50 blocks
    this.adaptiveThresholdHistory[this.adaptiveIdx % 50] = rms;
    this.adaptiveIdx++;
    const adaptiveThreshold = Array.from(this.adaptiveThresholdHistory).reduce((a, b) => a + b, 0) / 50 * 2.5;
    
    // S1/S2 Peak detection
    const timeSinceLastPeak = this.blockCount - this.lastPeakTime;
    const minPeakInterval = Math.floor(this.sampleRate / (300 / 60) / blockSize); // 300bpm max
    
    let peakType = null;
    if (blockPeak > Math.max(this.peakThreshold, adaptiveThreshold) && timeSinceLastPeak > minPeakInterval) {
      // Classify S1 vs S2 by inter-peak timing
      const intervalMs = (timeSinceLastPeak * blockSize / this.sampleRate) * 1000;
      if (intervalMs > 100 && intervalMs < 500) {
        peakType = 'S2'; // Shorter gap = systole -> S2
      } else if (intervalMs >= 500) {
        peakType = 'S1'; // Longer gap = diastole -> S1
      } else {
        peakType = 'S1'; // Default first peak
      }
      this.lastPeakTime = this.blockCount;
      this.peakHoldSamples = 10;
    }
    
    // Post metrics to main thread every 4 blocks
    if (this.blockCount % 4 === 0) {
      this.port.postMessage({
        type: 'AUDIO_METRICS',
        rms: rms,
        envelope: this.envelopeValue,
        peak: blockPeak,
        threshold: adaptiveThreshold,
        peakType: peakType,
        blockCount: this.blockCount,
        spectrogramSlice: Array.from(this.spectrogramBuffer.slice(
          Math.max(0, this.spectrogramFill - 128) % 512,
          this.spectrogramFill % 512
        ))
      });
    }
    
    return true; // Keep processor alive
  }
}

registerProcessor('cardio-audio-processor', CardioAudioProcessor);
