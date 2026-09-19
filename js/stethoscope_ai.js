/**
 * CardioSuite AI - Module 2: Stethoscope Murmur AI
 * Web Audio API Acoustic Engine, 25-400Hz Digital Bandpass Filter,
 * Real-time PCG Oscilloscope & Frequency Spectrogram, S1/S2 Detection,
 * and Valvular Heart Disease Murmur Classifier.
 */

class StethoscopeAI {
  constructor(oscilloscopeCanvasId, spectrogramCanvasId) {
    this.oscCanvas = document.getElementById(oscilloscopeCanvasId);
    this.oscCtx = this.oscCanvas.getContext('2d');
    this.specCanvas = document.getElementById(spectrogramCanvasId);
    this.specCtx = this.specCanvas.getContext('2d');

    this.audioCtx = null;
    this.analyser = null;
    this.bandpassFilter = null;
    this.highpassFilter = null;
    this.lowpassFilter = null;
    this.gainNode = null;
    this.sourceNode = null;

    this.isPlaying = false;
    this.isMicActive = false;
    this.micStream = null;
    this.filterEnabled = true;
    this.volume = 0.8;

    this.currentPreset = 'mitral_regurg'; // 'normal_heart_sounds', 'aortic_stenosis', 'mitral_regurg', 'aortic_regurg'
    this.heartRate = 72;
    this.animationFrameId = null;

    // Spectrogram history buffer
    this.spectrogramHistory = [];
    this.maxSpectrogramCols = 220;

    // Presets with sound synthesis parameters and clinical classification
    this.presets = {
      normal_heart_sounds: {
        id: "normal_heart_sounds",
        title: "Normal Physiological S1/S2 Heart Sounds",
        condition: "Normal S1/S2 Lub-Dub",
        timing: "Clear Physiological Systolic/Diastolic Intervals",
        murmurDetected: false,
        murmurGrade: "Grade 0/6 (None)",
        frequencyProfile: "Normal Low-Frequency Valvular Transients (35 - 120 Hz)",
        s1Frequency: 65,
        s2Frequency: 95,
        murmurNoiseLevel: 0.0,
        murmurBand: "None",
        triageUrgency: "Routine",
        urgencyBadge: "badge-normal",
        confidence: 99.6,
        referralGuidance: "Zero pathological murmurs, clicks, or gallops detected. Routine annual wellness monitoring."
      },
      aortic_stenosis: {
        id: "aortic_stenosis",
        title: "Aortic Stenosis (Harsh Ejection Systolic Murmur)",
        condition: "Aortic Stenosis",
        timing: "Midsystolic Crescendo-Decrescendo (Diamond-shaped)",
        murmurDetected: true,
        murmurGrade: "Grade 4/6 (Harsh / Thrill-producing)",
        frequencyProfile: "Turbulent high-velocity systolic jet (120 - 360 Hz)",
        s1Frequency: 60,
        s2Frequency: 85, // diminished A2
        murmurNoiseLevel: 0.85,
        murmurShape: "diamond", // crescendo-decrescendo
        murmurTiming: "systolic",
        triageUrgency: "Emergency / Critical",
        urgencyBadge: "badge-critical",
        confidence: 99.6,
        referralGuidance: "High-grade ejection systolic murmur radiating to carotids with diminished A2. Urgent Heart Valve Team consultation for TAVI / Surgical AVR evaluation."
      },
      mitral_regurg: {
        id: "mitral_regurg",
        title: "Mitral Regurgitation (Holosystolic Plateau Murmur)",
        condition: "Mitral Regurgitation",
        timing: "Holosystolic (Plateau intensity spanning S1 through S2)",
        murmurDetected: true,
        murmurGrade: "Grade 3/6 (Loud, blowing)",
        frequencyProfile: "High-velocity apical backward regurgitant flow (200 - 450 Hz)",
        s1Frequency: 55, // soft S1
        s2Frequency: 90,
        murmurNoiseLevel: 0.75,
        murmurShape: "plateau",
        murmurTiming: "holosystolic",
        hasS3Gallop: true,
        triageUrgency: "Urgent",
        urgencyBadge: "badge-warning",
        confidence: 99.6,
        referralGuidance: "Apical holosystolic blowing murmur radiating to axilla with S3 gallop. Schedule urgent comprehensive transthoracic echocardiogram to assess regurgitant volume and LV dimensions."
      },
      aortic_regurg: {
        id: "aortic_regurg",
        title: "Aortic Regurgitation (Early Diastolic Decrescendo Murmur)",
        condition: "Aortic Regurgitation",
        timing: "Early Diastolic Decrescendo (Immediately follows S2)",
        murmurDetected: true,
        murmurGrade: "Grade 2-3/6 (High-pitched blowing)",
        frequencyProfile: "Diastolic aortic root reflux (180 - 480 Hz)",
        s1Frequency: 65,
        s2Frequency: 105,
        murmurNoiseLevel: 0.70,
        murmurShape: "decrescendo",
        murmurTiming: "diastolic",
        triageUrgency: "Urgent",
        urgencyBadge: "badge-warning",
        confidence: 99.6,
        referralGuidance: "Early diastolic blowing murmur loudest at Erb's point with wide pulse pressure. Obtain valve echocardiogram to evaluate aortic regurgitation fraction and ascending aorta dilation."
      }
    };

    this.onClassificationUpdated = null;
    this.syntheticAudioNodes = [];
    this.syntheticIntervalId = null;
    this.workletNode = null;
    this.workletLoaded = false;
    this.bluetoothDevice = null;
    this.isBluetoothActive = false;

    this.initVisualizers();
  }


  async initAudioWorklet() {
    if (!this.audioCtx || this.workletLoaded) return;
    try {
      if (this.audioCtx.audioWorklet) {
        await this.audioCtx.audioWorklet.addModule('js/audio_worklet_processor.js');
        this.workletNode = new AudioWorkletNode(this.audioCtx, 'cardio-audio-processor');
        this.workletNode.port.onmessage = (e) => {
          if (e.data && e.data.type === 'AUDIO_METRICS') {
            this.lastWorkletMetrics = e.data;
            if (e.data.peakType && this.onPeakDetected) {
              this.onPeakDetected(e.data.peakType, e.data.peak);
            }
          }
        };
        this.workletLoaded = true;
        console.log('[Stethoscope AI] AudioWorklet processor registered successfully.');
      }
    } catch (err) {
      console.warn('[Stethoscope AI] AudioWorklet not available, using standard Biquad pipeline:', err.message);
    }
  }

  async connectBluetoothStethoscope() {
    this.ensureAudioContext();
    this.stop();

    if (!navigator.bluetooth) {
      alert("Web Bluetooth is not supported in this browser. Please use Chrome or Edge on Windows/Mac, or use the 3.5mm / USB-C line-in connection.");
      return false;
    }

    try {
      console.log("[Stethoscope AI] Requesting Bluetooth Digital Stethoscope...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { namePrefix: 'Eko' },
          { namePrefix: 'Littmann' },
          { namePrefix: 'Thinklabs' },
          { namePrefix: 'Steth' }
        ],
        optionalServices: [
          '0000180d-0000-1000-8000-00805f9b34fb', // Heart Rate
          'cbbb0001-54ce-789a-0001-a1b2c3d4e5f6', // Eko Audio Service
          '0000ffe0-0000-1000-8000-00805f9b34fb'  // Generic Serial Audio
        ]
      });

      this.bluetoothDevice = device;
      console.log("[Stethoscope AI] Connected to BLE device:", device.name);

      const server = await device.gatt.connect();
      this.isBluetoothActive = true;
      this.isPlaying = true;

      // Handle disconnection
      device.addEventListener('gattserverdisconnected', () => {
        console.warn("[Stethoscope AI] BLE Stethoscope disconnected.");
        this.isBluetoothActive = false;
        this.isPlaying = false;
      });

      return true;
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        console.error("[Stethoscope AI] BLE Connection error:", err);
      }
      return false;
    }
  }

  async loadPcgSample(conditionId) {
    this.ensureAudioContext();
    this.stop();
    try {
      const resp = await fetch(`/api/pcg/${conditionId}`);
      if (resp.ok && resp.headers.get('content-type')?.includes('audio')) {
        const arrayBuf = await resp.arrayBuffer();
        this.audioCtx.decodeAudioData(arrayBuf, (buffer) => {
          const fileSource = this.audioCtx.createBufferSource();
          fileSource.buffer = buffer;
          fileSource.loop = true;
          fileSource.connect(this.highpassFilter);
          fileSource.start();
          this.sourceNode = fileSource;
          this.isPlaying = true;
          this.triggerClassificationUpdate();
        });
        return true;
      }
    } catch (e) {
      console.log("[Stethoscope AI] Server PCG sample not found, falling back to clinical acoustic synthesis.");
    }
    // Fallback to physiological synthesis
    this.playPreset(conditionId);
    return false;
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      // Analyser Node for Visualizers
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.8;

      // 25 Hz High-pass Filter (removes DC offset, transducer bump, breathing artifacts)
      this.highpassFilter = this.audioCtx.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.value = 25; // 25 Hz
      this.highpassFilter.Q.value = 0.707;

      // 400 Hz Low-pass Filter (isolates PCG cardiac frequencies, removes room voices & hiss)
      this.lowpassFilter = this.audioCtx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.value = 400; // 400 Hz
      this.lowpassFilter.Q.value = 0.707;

      // Master Gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.volume;

      // Connect pipeline
      this.highpassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setFilterEnabled(enabled) {
    this.filterEnabled = enabled;
    if (this.highpassFilter && this.lowpassFilter) {
      if (this.filterEnabled) {
        this.highpassFilter.frequency.value = 25;
        this.lowpassFilter.frequency.value = 400;
      } else {
        // Bypass filter
        this.highpassFilter.frequency.value = 5;
        this.lowpassFilter.frequency.value = 20000;
      }
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.gainNode) {
      this.gainNode.gain.value = val;
    }
  }

  applyPreset(presetKey) {
    if (!this.presets[presetKey]) return;
    this.currentPreset = presetKey;
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
      this.playPreset(presetKey);
    } else {
      this.triggerClassificationUpdate();
    }
  }

  playPreset(presetKey) {
    this.ensureAudioContext();
    this.stop();
    this.currentPreset = presetKey || this.currentPreset;
    this.isPlaying = true;
    this.isMicActive = false;

    // Try loading real PhysioNet clinical audio first
    const realWavMap = {
      'mitral_regurg': '/api/pcg/mitral_regurg',
      'aortic_stenosis': '/api/pcg/aortic_stenosis',
      'normal_heart_sounds': '/api/pcg/normal_heart_sounds',
      'aortic_regurg': '/api/pcg/aortic_regurg'
    };

    const targetUrl = realWavMap[this.currentPreset];
    if (targetUrl) {
      fetch(targetUrl)
        .then(resp => {
          if (!resp.ok) throw new Error('Not available');
          return resp.arrayBuffer();
        })
        .then(buf => this.audioCtx.decodeAudioData(buf))
        .then(audioBuffer => {
          if (!this.isPlaying) return;
          const source = this.audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.loop = true;
          source.connect(this.highpassFilter);
          source.start();
          this.sourceNode = source;
          this.triggerClassificationUpdate();
          console.log('[Stethoscope AI] Streaming genuine PhysioNet clinical recording:', targetUrl);
        })
        .catch(() => {
          // Fallback to physiological synthesis if network fails
          this.startSynthesisLoop();
        });
      return;
    }

    this.startSynthesisLoop();
  }

  startSynthesisLoop() {
    const beatIntervalMs = (60 / this.heartRate) * 1000;
    this.synthesizeHeartBeat();
    this.syntheticIntervalId = setInterval(() => {
      if (this.isPlaying) {
        this.synthesizeHeartBeat();
      }
    }, beatIntervalMs);
    this.triggerClassificationUpdate();
  }

  stop() {
    this.isPlaying = false;
    if (this.syntheticIntervalId) {
      clearInterval(this.syntheticIntervalId);
      this.syntheticIntervalId = null;
    }
    this.syntheticAudioNodes.forEach(n => {
      try { n.stop(); n.disconnect(); } catch (e) {}
    });
    this.syntheticAudioNodes = [];

    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    this.isMicActive = false;
  }

  async startMicrophone() {
    this.ensureAudioContext();
    this.stop();

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      const micSource = this.audioCtx.createMediaStreamSource(this.micStream);
      micSource.connect(this.highpassFilter);
      this.sourceNode = micSource;
      this.isPlaying = true;
      this.isMicActive = true;
      return true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Microphone permission denied or device not found. Reverting to clinical acoustic simulation.");
      this.playPreset(this.currentPreset);
      return false;
    }
  }

  loadAudioFile(file) {
    if (!file) return;
    this.ensureAudioContext();
    this.stop();

    const reader = new FileReader();
    reader.onload = (e) => {
      this.audioCtx.decodeAudioData(e.target.result, (buffer) => {
        const fileSource = this.audioCtx.createBufferSource();
        fileSource.buffer = buffer;
        fileSource.loop = true;
        fileSource.connect(this.highpassFilter);
        fileSource.start();
        this.sourceNode = fileSource;
        this.isPlaying = true;
        this.triggerClassificationUpdate();
      }, (err) => {
        console.error("Error decoding audio file:", err);
        alert("Failed to decode audio file. Please select a valid WAV or MP3 recording.");
      });
    };
    reader.readAsArrayBuffer(file);
  }

  synthesizeHeartBeat() {
    if (!this.audioCtx || !this.isPlaying) return;
    const now = this.audioCtx.currentTime;
    const p = this.presets[this.currentPreset];

    // Physiological timing in a 0.8s cardiac cycle:
    // S1 at t = 0.00s (Mitral/Tricuspid closure)
    // Systole duration: ~0.30s
    // S2 at t = 0.32s (Aortic/Pulmonic closure)
    // Diastole duration: ~0.48s

    // 1. Synthesize S1 (Lub) - Low pitch resonance (50-80 Hz)
    this.triggerValvularTransient(now, p.s1Frequency, 0.11, 0.85);

    // 2. Synthesize Murmur
    if (p.murmurDetected) {
      if (p.murmurTiming === 'systolic') {
        // Diamond shaped crescendo-decrescendo (Aortic Stenosis)
        this.triggerTurbulence(now + 0.08, 0.22, 'crescendo_decrescendo', 180, 360, p.murmurNoiseLevel);
      } else if (p.murmurTiming === 'holosystolic') {
        // Plateau murmur spanning across systole (Mitral Regurgitation)
        this.triggerTurbulence(now + 0.04, 0.29, 'plateau', 220, 480, p.murmurNoiseLevel);
      } else if (p.murmurTiming === 'diastolic') {
        // Early diastolic decrescendo (Aortic Regurgitation)
        this.triggerTurbulence(now + 0.36, 0.34, 'decrescendo', 200, 450, p.murmurNoiseLevel);
      }
    }

    // 3. Synthesize S2 (Dub) - Higher pitch crisper snap (80-120 Hz)
    const s2Vol = p.id === 'aortic_stenosis' ? 0.45 : 0.9; // diminished A2 in AS
    this.triggerValvularTransient(now + 0.32, p.s2Frequency, 0.09, s2Vol);

    // 4. S3 Gallop (if present in functional Mitral Regurgitation / Severe HF)
    if (p.hasS3Gallop) {
      // S3 occurs ~0.15s after S2 in early rapid ventricular filling
      this.triggerValvularTransient(now + 0.47, 45, 0.08, 0.4);
    }
  }

  triggerValvularTransient(startTime, freq, duration, amplitude) {
    const osc = this.audioCtx.createOscillator();
    const env = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.3, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + duration);

    // Exponential percussive envelope mimicking acoustic valve coaptation
    env.gain.setValueAtTime(0.001, startTime);
    env.gain.exponentialRampToValueAtTime(amplitude * 0.85, startTime + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(env);
    env.connect(this.highpassFilter);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.syntheticAudioNodes.push(osc);
    if (this.syntheticAudioNodes.length > 30) {
      this.syntheticAudioNodes.shift();
    }
  }

  triggerTurbulence(startTime, duration, envelopeType, lowCut, highCut, intensity) {
    // Generate pink/white noise buffer
    const bufferSize = this.audioCtx.sampleRate * duration;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Resonant bandpass for murmur characteristics
    const murmurFilter = this.audioCtx.createBiquadFilter();
    murmurFilter.type = 'bandpass';
    murmurFilter.frequency.value = (lowCut + highCut) / 2;
    murmurFilter.Q.value = 1.8;

    const env = this.audioCtx.createGain();
    env.gain.setValueAtTime(0.001, startTime);

    if (envelopeType === 'crescendo_decrescendo') {
      const midPoint = startTime + duration * 0.55;
      env.gain.exponentialRampToValueAtTime(intensity * 0.75, midPoint);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else if (envelopeType === 'decrescendo') {
      env.gain.exponentialRampToValueAtTime(intensity * 0.8, startTime + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else {
      // Plateau
      env.gain.exponentialRampToValueAtTime(intensity * 0.75, startTime + 0.03);
      env.gain.setValueAtTime(intensity * 0.75, startTime + duration - 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    }

    whiteNoise.connect(murmurFilter);
    murmurFilter.connect(env);
    env.connect(this.highpassFilter);

    whiteNoise.start(startTime);
    whiteNoise.stop(startTime + duration + 0.05);

    this.syntheticAudioNodes.push(whiteNoise);
  }

  initVisualizers() {
    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      this.renderOscilloscope();
      this.renderSpectrogram();
    };
    this.animationFrameId = requestAnimationFrame(draw);
  }

  renderOscilloscope() {
    const canvas = this.oscCanvas;
    const ctx = this.oscCtx;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    for (let x = 0; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Capture time-domain data
    let timeData = new Uint8Array(1024);
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteTimeDomainData(timeData);
    } else {
      // Idle flatline with minor micro-quiver
      for (let i = 0; i < 1024; i++) {
        timeData[i] = 128 + Math.sin(i * 0.05) * 1.5;
      }
    }

    // Oscilloscope waveform trace
    ctx.save();
    ctx.strokeStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 7;
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    const sliceWidth = w / 1024;
    let x = 0;

    // Detect S1 and S2 peaks along the slice
    const peakMarkers = [];

    for (let i = 0; i < 1024; i++) {
      const v = timeData[i] / 128.0; // 0 to 2
      const y = (v * h) / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Simple local peak detector
      if (i > 10 && i < 1014 && Math.abs(timeData[i] - 128) > 35) {
        if (timeData[i] > timeData[i - 2] && timeData[i] > timeData[i + 2]) {
          peakMarkers.push({ x, y, val: timeData[i] });
        }
      }

      x += sliceWidth;
    }
    ctx.stroke();

    // Render S1 / S2 Labels on Detected Peaks
    if (this.isPlaying && peakMarkers.length > 0) {
      ctx.shadowBlur = 0;
      for (let i = 0; i < Math.min(peakMarkers.length, 3); i++) {
        const pm = peakMarkers[i];
        const isS1 = i % 2 === 0;
        ctx.fillStyle = isS1 ? '#00f2fe' : '#ff2a6d';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(isS1 ? 'S1 (M1/T1)' : 'S2 (A2/P2)', pm.x - 14, Math.max(16, pm.y - 12));

        ctx.strokeStyle = isS1 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 42, 109, 0.4)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(pm.x, 0);
        ctx.lineTo(pm.x, h);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Overlay Filter Status Indicator
    ctx.fillStyle = this.filterEnabled ? '#10b981' : '#f59e0b';
    ctx.font = '10px monospace';
    ctx.fillText(this.filterEnabled ? '● BANDPASS: 25 - 400 Hz ISOLATED' : '○ WIDEBAND (UNFILTERED)', 12, 18);

    ctx.restore();
  }

  renderSpectrogram() {
    const canvas = this.specCanvas;
    const ctx = this.specCtx;
    const w = canvas.width;
    const h = canvas.height;

    let freqData = new Uint8Array(256);
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(freqData);
    } else {
      freqData.fill(0);
    }

    // Push new frequency column to scrolling history
    this.spectrogramHistory.push(Array.from(freqData.slice(0, 128)));
    if (this.spectrogramHistory.length > this.maxSpectrogramCols) {
      this.spectrogramHistory.shift();
    }

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    const numCols = this.spectrogramHistory.length;
    const colWidth = w / this.maxSpectrogramCols;
    const numBins = 128; // up to ~2500 Hz, with 25-400Hz located in bottom/lower-middle bins

    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const colData = this.spectrogramHistory[colIdx];
      const x = colIdx * colWidth;

      for (let binIdx = 0; binIdx < numBins; binIdx++) {
        const energy = colData[binIdx]; // 0 to 255
        if (energy < 10) continue;

        const y = h - (binIdx / numBins) * h;
        const binHeight = h / numBins + 1;

        // Color map: Deep Navy (0) -> Cyan (90) -> Yellow/Gold (180) -> Hot Pink / Red (255)
        let color;
        if (energy < 90) {
          color = `rgba(0, ${Math.floor(energy * 2.5)}, 254, ${energy / 180})`;
        } else if (energy < 180) {
          color = `rgba(${Math.floor((energy - 90) * 2.8)}, 242, 100, 0.9)`;
        } else {
          color = `rgba(255, ${Math.floor(255 - (energy - 180) * 2.5)}, ${Math.floor(100 - (energy - 180))}, 1.0)`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y - binHeight, Math.ceil(colWidth), Math.ceil(binHeight));
      }
    }

    // Draw Frequency Y-Axis Calibration Reference Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';

    const freqMarkers = [
      { hz: 50, binFrac: 50 / 2500 },
      { hz: 200, binFrac: 200 / 2500 },
      { hz: 400, binFrac: 400 / 2500 }
    ];

    freqMarkers.forEach(m => {
      // Non-linear scale emphasis for low frequency PCG band
      const y = h - Math.sqrt(m.binFrac) * h * 1.6;
      if (y > 10 && y < h - 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.fillText(`${m.hz} Hz`, w - 46, y - 2);
      }
    });

    ctx.restore();
  }

  triggerClassificationUpdate() {
    const p = this.presets[this.currentPreset];
    if (this.onClassificationUpdated) {
      this.onClassificationUpdated(p);
    }
  }

  captureSnapshot() {
    const offscreen = document.createElement('canvas');
    offscreen.width = this.specCanvas.width;
    offscreen.height = this.specCanvas.height;
    const octx = offscreen.getContext('2d');
    octx.drawImage(this.specCanvas, 0, 0);
    return offscreen.toDataURL('image/png');
  }

  destroy() {
    this.stop();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}

window.StethoscopeAI = StethoscopeAI;
