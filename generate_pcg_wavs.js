const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const cardioDir = path.join(rootDir, 'CardioSuite');

const outDirs = [
  path.join(cardioDir, 'data', 'pcg_samples'),
  path.join(rootDir, 'data', 'pcg_samples')
];

outDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log("=== Generating Medical-Grade 44.1kHz PCG Audio Samples ===");

// Helper to write a 16-bit mono WAV buffer
function createWavBuffer(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    // Clamp sample between -1 and 1
    const s = Math.max(-1, Math.min(1, samples[i]));
    const int16 = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(int16), 44 + i * 2);
  }

  return buffer;
}

const SAMPLE_RATE = 44100;

// 1. Normal S1/S2 (Physiological lub-dub, HR 72, duration 3.0s)
function generateNormalS1S2() {
  const durationSec = 3.0;
  const totalSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(totalSamples);
  const beatInterval = 60 / 72; // ~0.833s

  for (let beat = 0; beat < 4; beat++) {
    const beatStart = beat * beatInterval;
    // S1 at beatStart (55 Hz damped sine + 90 Hz transient)
    const s1Start = beatStart;
    const s1Len = 0.12;
    for (let t = 0; t < s1Len; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s1Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        const env = Math.exp(-t * 35) * Math.sin(t / s1Len * Math.PI);
        const val = 0.65 * Math.sin(2 * Math.PI * 55 * t) + 0.25 * Math.sin(2 * Math.PI * 95 * t);
        samples[idx] += val * env;
      }
    }

    // S2 at beatStart + 0.32s (85 Hz damped sine + 120 Hz transient)
    const s2Start = beatStart + 0.32;
    const s2Len = 0.09;
    for (let t = 0; t < s2Len; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s2Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        const env = Math.exp(-t * 45) * Math.sin(t / s2Len * Math.PI);
        const val = 0.55 * Math.sin(2 * Math.PI * 85 * t) + 0.35 * Math.sin(2 * Math.PI * 125 * t);
        samples[idx] += val * env;
      }
    }
  }

  return createWavBuffer(samples);
}

// 2. Aortic Stenosis (Harsh Midsystolic Diamond Ejection Murmur)
function generateAorticStenosis() {
  const durationSec = 3.0;
  const totalSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(totalSamples);
  const beatInterval = 60 / 72;

  for (let beat = 0; beat < 4; beat++) {
    const beatStart = beat * beatInterval;
    // S1
    for (let t = 0; t < 0.11; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((beatStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.5 * Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 35);
      }
    }

    // Diamond Murmur (Crescendo-Decrescendo between 0.08s and 0.30s)
    const murmurStart = beatStart + 0.06;
    const murmurLen = 0.24;
    for (let t = 0; t < murmurLen; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((murmurStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        // Diamond envelope: sin curve
        const env = Math.sin((t / murmurLen) * Math.PI);
        // Harsh turbulent frequency mixture (140-340 Hz)
        const noise = (Math.random() * 2 - 1) * 0.45;
        const tone1 = Math.sin(2 * Math.PI * 180 * t) * 0.3;
        const tone2 = Math.sin(2 * Math.PI * 260 * t) * 0.25;
        samples[idx] += (noise + tone1 + tone2) * env * 0.85;
      }
    }

    // Diminished A2 / Single S2
    const s2Start = beatStart + 0.33;
    for (let t = 0; t < 0.07; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s2Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.3 * Math.sin(2 * Math.PI * 90 * t) * Math.exp(-t * 50);
      }
    }
  }

  return createWavBuffer(samples);
}

// 3. Mitral Regurgitation (Holosystolic Blowing Murmur + S3 Gallop)
function generateMitralRegurg() {
  const durationSec = 3.0;
  const totalSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(totalSamples);
  const beatInterval = 60 / 78;

  for (let beat = 0; beat < 4; beat++) {
    const beatStart = beat * beatInterval;
    // Soft S1 (obscured by jet)
    for (let t = 0; t < 0.10; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((beatStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.35 * Math.sin(2 * Math.PI * 55 * t) * Math.exp(-t * 30);
      }
    }

    // Holosystolic Plateau Murmur (0.03s to 0.31s)
    const murmurStart = beatStart + 0.03;
    const murmurLen = 0.28;
    for (let t = 0; t < murmurLen; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((murmurStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        // Flat plateau envelope with slight fade in/out
        const env = Math.min(1, t / 0.03) * Math.min(1, (murmurLen - t) / 0.03);
        // High-velocity blowing jet (220-450 Hz)
        const noise = (Math.random() * 2 - 1) * 0.55;
        const tone = Math.sin(2 * Math.PI * 310 * t) * 0.2;
        samples[idx] += (noise + tone) * env * 0.75;
      }
    }

    // S2
    const s2Start = beatStart + 0.32;
    for (let t = 0; t < 0.08; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s2Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.5 * Math.sin(2 * Math.PI * 88 * t) * Math.exp(-t * 40);
      }
    }

    // S3 Gallop in early diastole (0.15s after S2)
    const s3Start = s2Start + 0.15;
    for (let t = 0; t < 0.08; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s3Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.3 * Math.sin(2 * Math.PI * 45 * t) * Math.exp(-t * 40);
      }
    }
  }

  return createWavBuffer(samples);
}

// 4. Aortic Regurgitation (Early Diastolic Decrescendo Murmur)
function generateAorticRegurg() {
  const durationSec = 3.0;
  const totalSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(totalSamples);
  const beatInterval = 60 / 90;

  for (let beat = 0; beat < 5; beat++) {
    const beatStart = beat * beatInterval;
    // S1
    for (let t = 0; t < 0.10; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((beatStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.5 * Math.sin(2 * Math.PI * 65 * t) * Math.exp(-t * 35);
      }
    }

    // Accentuated S2 (0.28s)
    const s2Start = beatStart + 0.28;
    for (let t = 0; t < 0.08; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((s2Start + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        samples[idx] += 0.65 * Math.sin(2 * Math.PI * 105 * t) * Math.exp(-t * 45);
      }
    }

    // Early Diastolic Decrescendo Murmur starting immediately after S2
    const murmurStart = s2Start + 0.04;
    const murmurLen = 0.26;
    for (let t = 0; t < murmurLen; t += 1 / SAMPLE_RATE) {
      const idx = Math.floor((murmurStart + t) * SAMPLE_RATE);
      if (idx < totalSamples) {
        // Decrescendo exponential envelope
        const env = Math.exp(-t * 12);
        // High-pitched blowing reflux (200-480 Hz)
        const noise = (Math.random() * 2 - 1) * 0.5;
        const tone = Math.sin(2 * Math.PI * 340 * t) * 0.25;
        samples[idx] += (noise + tone) * env * 0.7;
      }
    }
  }

  return createWavBuffer(samples);
}

const wavFiles = [
  { name: 'pcg_normal.wav', buf: generateNormalS1S2() },
  { name: 'pcg_aortic_stenosis.wav', buf: generateAorticStenosis() },
  { name: 'pcg_mitral_regurg.wav', buf: generateMitralRegurg() },
  { name: 'pcg_aortic_regurg.wav', buf: generateAorticRegurg() }
];

wavFiles.forEach(wf => {
  outDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, wf.name), wf.buf);
  });
  console.log(`-> Generated ${wf.name} (${(wf.buf.length / 1024).toFixed(1)} KB)`);
});

console.log("All PCG audio samples generated successfully.");
