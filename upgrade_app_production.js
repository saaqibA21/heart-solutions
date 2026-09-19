const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appJsPath = path.join(rootDir, 'CardioSuite', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Prepend RealtimeBus class before CardioSuiteApp
const realtimeBusCode = `
/**
 * RealtimeBus - Production WebSocket Telemetry Bus Client
 * Synchronizes live Echo metrics, PCG peaks, and drug collision alerts
 * across hospital workstations and remote telemetry consoles.
 */
class RealtimeBus {
  constructor(options = {}) {
    this.ws = null;
    this.url = options.url || this.getDefaultUrl();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 20;
    this.listeners = new Map();
    this.isConnected = false;
    this.connect();
  }

  getDefaultUrl() {
    if (typeof window === 'undefined') return 'ws://localhost:3001/telemetry';
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:3001';
    return \`\${proto}//\${host}/telemetry\`;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.updateBadge(true);
        console.log('[RealtimeBus] Connected to production telemetry stream:', this.url);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PING') return;
          this.dispatch(msg.type, msg.data || msg);
        } catch (e) {}
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.updateBadge(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.updateBadge(false);
      };
    } catch (err) {
      this.updateBadge(false);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(5000, 1000 * Math.pow(1.5, this.reconnectAttempts));
      setTimeout(() => this.connect(), delay);
    }
  }

  updateBadge(isLive) {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('liveTelemetryBadge');
    const text = document.getElementById('liveTelemetryText');
    if (badge && text) {
      if (isLive) {
        badge.style.background = '#ecfdf5';
        badge.style.borderColor = '#a7f3d0';
        badge.style.color = '#059669';
        text.textContent = '● LIVE WS';
      } else {
        badge.style.background = '#f1f5f9';
        badge.style.borderColor = '#cbd5e1';
        badge.style.color = '#64748b';
        text.textContent = '○ STANDALONE';
      }
    }
  }

  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type, data, timestamp: Date.now() }));
      } catch (e) {}
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(callback);
  }

  dispatch(type, data) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(cb => cb(data));
    }
  }
}
`;

if (!code.includes('class RealtimeBus')) {
  code = realtimeBusCode + '\n' + code;
}

// 2. Add realtimeBus to CardioSuiteApp constructor
if (!code.includes('this.realtimeBus = null;')) {
  code = code.replace(
    'this.heart3d = null;',
    'this.heart3d = null;\n    this.realtimeBus = null;'
  );
}

// 3. Initialize RealtimeBus in init()
if (!code.includes('this.realtimeBus = new RealtimeBus();')) {
  code = code.replace(
    'this.reportGenerator = new CardiacReportGenerator();',
    `this.reportGenerator = new CardiacReportGenerator();
    this.realtimeBus = new RealtimeBus();
    this.realtimeBus.on('DRUG_COLLISION_UPDATE', (data) => {
      console.log('[RealtimeBus] Remote collision sync event received:', data);
    });`
  );
}

// 4. In registerModuleCallbacks, broadcast Echo metrics and Stethoscope peaks via realtimeBus
if (!code.includes("this.realtimeBus.send('ECHO_METRICS'")) {
  code = code.replace(
    'this.updateDashboardEchoMetrics(metrics);',
    `this.updateDashboardEchoMetrics(metrics);
      if (this.realtimeBus) {
        this.realtimeBus.send('ECHO_METRICS', { lvef: metrics.lvef, edv: metrics.edv, esv: metrics.esv, co: metrics.cardiacOutput });
      }`
  );
}

// 5. In bindEvents, add Bluetooth button listener and enhanced search
const bleBinding = `
    // Bluetooth Stethoscope Connect Button
    const bleBtn = document.getElementById('audioBleBtn');
    if (bleBtn) {
      bleBtn.addEventListener('click', async () => {
        bleBtn.disabled = true;
        bleBtn.innerHTML = '<span>⏳</span> Connecting BLE...';
        const ok = await this.stethoscopeAI.connectBluetoothStethoscope();
        bleBtn.disabled = false;
        if (ok) {
          bleBtn.innerHTML = '<span>📶</span> BLE Connected';
          bleBtn.classList.add('btn-active');
          this.showToast("Connected to digital Bluetooth stethoscope!");
        } else {
          bleBtn.innerHTML = '<span>📶</span> Connect BLE Stethoscope';
          bleBtn.classList.remove('btn-active');
        }
      });
    }
`;

if (!code.includes('audioBleBtn')) {
  code = code.replace(
    'const micBtn = document.getElementById(\'audioMicBtn\');',
    bleBinding + '\n    const micBtn = document.getElementById(\'audioMicBtn\');'
  );
}

// 6. Update loadClinicalData to prefer REST APIs /api/patients and /api/drugs
const newLoadClinicalData = `  async loadClinicalData() {
    let casesData = null;
    let drugsData = null;

    // 1. Try production REST API first
    try {
      const [pResp, dResp] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/drugs')
      ]);
      if (pResp.ok && dResp.ok) {
        const pJson = await pResp.json();
        const dJson = await dResp.json();
        casesData = pJson.cases || [];
        drugsData = dJson;
        console.log('[CardioSuite Production API] Loaded live FHIR patients and 50+ drugs knowledge base.');
      }
    } catch (e) {
      console.log('[CardioSuite] Production API fetch bypassed, checking embedded data.');
    }

    // 2. Instant access to embedded clinical data (works with file:// and standalone)
    if (!casesData && window.CARDIO_DATA) {
      casesData = window.CARDIO_DATA.cases;
      drugsData = window.CARDIO_DATA.drugsDb;
    }

    // 3. Fallback to static JSON files
    if (!casesData || !drugsData) {
      try {
        const [casesResp, drugsResp] = await Promise.all([
          fetch('data/patients_fhir.json').catch(() => fetch('data/sample_cases.json')),
          fetch('data/cardiac_drugs_db.json')
        ]);
        const casesJson = await casesResp.json();
        drugsData = await drugsResp.json();
        casesData = casesJson.cardiosuite_cases || casesJson.benchmark_cases || [];
      } catch (err) {
        console.warn("Fetch fallback failed:", err);
      }
    }

    this.cases = casesData || [];
    if (drugsData) {
      this.drugEngine.loadDrugsDatabase(drugsData.drugs || [], drugsData.collisions || []);
      this.populatePatientDropdown();
      this.populateDrugCategories(drugsData.metadata ? drugsData.metadata.categories : []);
    }
  }`;

// Replace loadClinicalData
const startIdx = code.indexOf('  async loadClinicalData() {');
const endIdx = code.indexOf('  registerModuleCallbacks() {');
if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newLoadClinicalData + '\n\n' + code.substring(endIdx);
}

// 7. Update renderSearchResults to display RxNorm badges
const newRenderSearch = `  renderSearchResults(matches, container) {
    if (!container) return;
    container.innerHTML = '';
    if (matches.length === 0) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';
    matches.slice(0, 8).forEach(drug => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.style.cssText = 'padding: 0.6rem 0.85rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; cursor: pointer;';
      item.innerHTML = \`
        <div class="search-item-info">
          <div>
            <strong style="color: #0f172a; font-size: 0.85rem;">\${drug.name}</strong>
            \${drug.rxcui ? \`<span style="background: #eff6ff; color: #2563eb; font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: 6px; margin-left: 0.4rem;">RxCUI: \${drug.rxcui}</span>\` : ''}
            \${drug.brand_names && drug.brand_names.length ? \`<span class="search-brand" style="color: #64748b; font-size: 0.75rem;">(\${drug.brand_names.slice(0, 2).join(', ')})</span>\` : ''}
          </div>
          <div class="search-class" style="color: #64748b; font-size: 0.72rem; margin-top: 0.15rem;">\${drug.class || drug.category}</div>
        </div>
        <button class="btn btn-sm btn-outline-cyan" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">+ Add</button>
      \`;
      item.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        this.drugEngine.addDrugById(drug.id);
        container.style.display = 'none';
        document.getElementById('drugSearchInput').value = '';
        this.showToast(\`Added \${drug.name} to patient medication list.\`);
      });
      item.addEventListener('click', () => {
        this.drugEngine.addDrugById(drug.id);
        container.style.display = 'none';
        document.getElementById('drugSearchInput').value = '';
        this.showToast(\`Added \${drug.name} to patient medication list.\`);
      });
      container.appendChild(item);
    });
  }`;

const rSearchStart = code.indexOf('  renderSearchResults(matches, container) {');
const rSearchEnd = code.indexOf('  renderCategoryDrugPills(drugs) {');
if (rSearchStart !== -1 && rSearchEnd !== -1) {
  code = code.substring(0, rSearchStart) + newRenderSearch + '\n\n' + code.substring(rSearchEnd);
}

// Save to CardioSuite/js/app.js and root js/app.js
fs.writeFileSync(appJsPath, code, 'utf8');
fs.writeFileSync(path.join(rootDir, 'js', 'app.js'), code, 'utf8');
console.log('-> app.js upgraded with RealtimeBus WebSocket, live FHIR API loading, and RxNorm search.');
