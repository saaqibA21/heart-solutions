const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const stethPath = path.join(rootDir, 'CardioSuite', 'js', 'stethoscope_ai.js');
let code = fs.readFileSync(stethPath, 'utf8');

// 1. Add bluetooth and worklet properties in constructor
if (!code.includes('this.workletNode = null;')) {
  code = code.replace(
    'this.syntheticIntervalId = null;',
    `this.syntheticIntervalId = null;
    this.workletNode = null;
    this.workletLoaded = false;
    this.bluetoothDevice = null;
    this.isBluetoothActive = false;`
  );
}

// 2. Add AudioWorklet loader and Web Bluetooth connection methods
const newAudioMethods = `
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
      const resp = await fetch(\`/api/pcg/\${conditionId}\`);
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
`;

if (!code.includes('connectBluetoothStethoscope')) {
  code = code.replace(
    '  ensureAudioContext() {',
    `${newAudioMethods}\n  ensureAudioContext() {`
  );
}

// Write to CardioSuite/js/stethoscope_ai.js and js/stethoscope_ai.js
fs.writeFileSync(stethPath, code, 'utf8');
fs.writeFileSync(path.join(rootDir, 'js', 'stethoscope_ai.js'), code, 'utf8');
console.log('-> Upgraded stethoscope_ai.js with AudioWorklet & Web Bluetooth.');
