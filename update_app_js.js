const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'CardioSuite', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Add this.heart3d in constructor
if (!content.includes('this.heart3d = null;')) {
  content = content.replace(
    'this.reportGenerator = null;',
    'this.reportGenerator = null;\n    this.heart3d = null;'
  );
}

// 2. Initialize heart3d in init()
if (!content.includes('new AnatomicalHeartVisualizer')) {
  const initTarget = "this.reportGenerator = new CardiacReportGenerator();";
  const initReplacement = `this.reportGenerator = new CardiacReportGenerator();
    if (typeof AnatomicalHeartVisualizer !== 'undefined' && document.getElementById('heart3dCanvas')) {
      this.heart3d = new AnatomicalHeartVisualizer('heart3dCanvas');
      this.heart3d.onHotspotSelected = (spot) => {
        this.showToast(\`Selected \${spot.name}: Opening \${spot.modality.toUpperCase()} analysis...\`);
        this.switchTab(spot.modality);
      };
    }`;
  content = content.replace(initTarget, initReplacement);
}

// 3. Update bindEvents to support pills, CTAs, and condition cards
if (!content.includes('consultNowCtaBtn')) {
  const bindTarget = "this.switchTab(targetTab);\n      });\n    });";
  const bindReplacement = `this.switchTab(targetTab);\n      });\n    });

    // Pill navigation support
    document.querySelectorAll('.nav-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Consult Now CTA Button
    const consultBtn = document.getElementById('consultNowCtaBtn');
    if (consultBtn) {
      consultBtn.addEventListener('click', () => {
        this.switchTab('report');
        this.showToast("Initiating Clinical Consultation Review & Report Generation...");
      });
    }

    // Condition card rows navigation
    document.querySelectorAll('.condition-card-row[data-goto-tab]').forEach(row => {
      row.addEventListener('click', () => {
        const tab = row.getAttribute('data-goto-tab');
        this.switchTab(tab);
      });
    });

    // Top reference nav links
    const helpLink = document.getElementById('navHelpLink');
    if (helpLink) {
      helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast("CardioSuite AI Guide: Click on 3D Heart hotspots or use navigation pills to explore modalities.");
      });
    }`;
  content = content.replace(bindTarget, bindReplacement);
}

// 4. Update switchTab to update both nav-tab-btn and nav-pill-btn
content = content.replace(
  "document.querySelectorAll('.nav-tab-btn').forEach(btn => {",
  "document.querySelectorAll('.nav-tab-btn, .nav-pill-btn').forEach(btn => {"
);

// 5. Update loadCase to set heart rate
if (!content.includes('this.heart3d.setHeartRate')) {
  const loadTarget = "this.updateDashboardOverview(c);";
  const loadReplacement = `this.updateDashboardOverview(c);

    // Update 3D Anatomical Heart visualizer contractility
    if (this.heart3d && c.vitals) {
      this.heart3d.setHeartRate(c.vitals.heart_rate || 72);
    }`;
  content = content.replace(loadTarget, loadReplacement);
}

// 6. Update updateDashboardOverview
const updateDashTarget = `  updateDashboardOverview(c) {
    document.getElementById('dashHistorySummary').textContent = c.clinical_history;
    document.getElementById('dashComplaintSummary').textContent = c.presenting_complaint;
    document.getElementById('dashPhysicianNotes').textContent = c.physician_notes || "None";
    document.getElementById('dashPrimaryRiskFlag').textContent = c.primary_risk_flag || "Routine review";
  }`;

const updateDashReplacement = `  updateDashboardOverview(c) {
    const setSafeText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setSafeText('dashHistorySummary', c.clinical_history);
    setSafeText('dashComplaintSummary', c.presenting_complaint);
    setSafeText('dashPhysicianNotes', c.physician_notes || "None");
    setSafeText('dashPrimaryRiskFlag', c.primary_risk_flag || "Routine review");

    // Reference Dashboard Indicators
    setSafeText('dashParamTemp', '36.6');
    setSafeText('dashParamSleep', '8');
    setSafeText('dashParamBp', c.vitals ? c.vitals.blood_pressure : '120/80');
    setSafeText('dashParamPulse', c.vitals ? c.vitals.heart_rate : '72');

    if (c.echo_preset) {
      setSafeText('dashCapsuleEf', \`\${c.echo_preset.target_ef}%\`);
      setSafeText('dashCapsuleEdv', \`\${c.echo_preset.edv_ml}\`);
      setSafeText('dashCapsuleEsv', \`\${c.echo_preset.esv_ml}\`);
      setSafeText('dashCapsuleCo', \`\${c.echo_preset.cardiac_output_lpm}\`);
      setSafeText('dashEchoSnippet', c.echo_preset.title);
      const echoBadge = document.getElementById('dashEchoBadge');
      if (echoBadge) {
        echoBadge.textContent = c.echo_preset.classification;
        echoBadge.className = \`condition-badge \${c.echo_preset.target_ef < 40 ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
      }
    }

    if (c.acoustic_preset) {
      setSafeText('dashStethSnippet', \`\${c.acoustic_preset.condition} (\${c.acoustic_preset.timing})\`);
      const stethBadge = document.getElementById('dashStethBadge');
      if (stethBadge) {
        stethBadge.textContent = c.acoustic_preset.triage_urgency;
        stethBadge.className = \`condition-badge \${c.acoustic_preset.triage_urgency.includes('Emergency') || c.acoustic_preset.triage_urgency.includes('Urgent') ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
      }
    }

    setSafeText('dashProfileName', c.patient_name);
    setSafeText('dashProfileDemographics', \`\${c.age} Y, \${c.gender} | MRN: \${c.mrn}\`);
    setSafeText('dashProfileCondition', c.echo_preset ? c.echo_preset.classification : "Evaluated");
    setSafeText('dashProfileValve', c.acoustic_preset ? c.acoustic_preset.condition : "Evaluated");
    setSafeText('dashProfileDrugRisk', c.primary_risk_flag ? (c.primary_risk_flag.includes("No") ? "Safe / Optimal" : "High Hazard") : "Evaluating");
    setSafeText('dashPhysicianNotesShort', c.physician_notes || c.clinical_history || "");
    
    const avatarEl = document.getElementById('dashPatientAvatar');
    if (avatarEl && c.patient_name) {
      avatarEl.textContent = c.patient_name.split(' ').map(n => n[0]).join('');
    }

    const colCount = c.collision_alerts ? c.collision_alerts.length : 0;
    setSafeText('dashDrugSnippet', colCount > 0 ? \`\${colCount} High-Risk Drug Collisions\` : "Optimal Medication Safety");
    const drugBadge = document.getElementById('dashDrugBadge');
    if (drugBadge) {
      drugBadge.textContent = colCount > 0 ? \`\${colCount} Collisions\` : "Safe";
      drugBadge.className = \`condition-badge \${colCount > 0 ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
    }
  }`;

content = content.replace(updateDashTarget, updateDashReplacement);

// 7. Update updateDashboardEchoMetrics
const oldEchoDash = `  updateDashboardEchoMetrics(metrics) {
    const dashEf = document.getElementById('dashEchoEf');
    if (dashEf) dashEf.textContent = \`\${metrics.lvef}%\`;

    const dashBadge = document.getElementById('dashEchoBadge');
    if (dashBadge) {
      dashBadge.textContent = metrics.classification;
      dashBadge.className = \`badge \${metrics.classBadge}\`;
    }
  }`;

const newEchoDash = `  updateDashboardEchoMetrics(metrics) {
    const setSafe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setSafe('dashEchoEf', \`\${metrics.lvef}%\`);
    setSafe('dashCapsuleEf', \`\${metrics.lvef}%\`);
    setSafe('dashCapsuleEdv', \`\${metrics.edv}\`);
    setSafe('dashCapsuleEsv', \`\${metrics.esv}\`);
    setSafe('dashCapsuleCo', \`\${metrics.cardiacOutput}\`);

    const dashBadge = document.getElementById('dashEchoBadge');
    if (dashBadge) {
      dashBadge.textContent = metrics.classification;
      dashBadge.className = \`condition-badge \${metrics.lvef < 40 ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
    }
  }`;

content = content.replace(oldEchoDash, newEchoDash);

// 8. Update updateDashboardAcousticMetrics
const oldAcousticDash = `  updateDashboardAcousticMetrics(profile) {
    const dashAcoustic = document.getElementById('dashStethCondition');
    if (dashAcoustic) dashAcoustic.textContent = profile.condition;

    const dashBadge = document.getElementById('dashStethBadge');
    if (dashBadge) {
      dashBadge.textContent = profile.triageUrgency;
      dashBadge.className = \`badge \${profile.urgencyBadge}\`;
    }
  }`;

const newAcousticDash = `  updateDashboardAcousticMetrics(profile) {
    const setSafe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setSafe('dashStethCondition', profile.condition);
    setSafe('dashProfileValve', profile.condition);
    setSafe('dashStethSnippet', \`\${profile.condition} (\${profile.timing})\`);

    const dashBadge = document.getElementById('dashStethBadge');
    if (dashBadge) {
      dashBadge.textContent = profile.triageUrgency;
      dashBadge.className = \`condition-badge \${profile.triageUrgency.includes('Emergency') || profile.triageUrgency.includes('Urgent') ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
    }
  }`;

content = content.replace(oldAcousticDash, newAcousticDash);

// 9. Update updateDashboardDrugMetrics
const oldDrugDash = `  updateDashboardDrugMetrics(state) {
    const dashCollisions = document.getElementById('dashDrugCollisions');
    if (dashCollisions) {
      dashCollisions.textContent = \`\${state.activeCollisions.length} Collisions\`;
    }

    const dashBadge = document.getElementById('dashDrugBadge');
    if (dashBadge) {
      if (state.activeCollisions.length === 0) {
        dashBadge.textContent = "Safe";
        dashBadge.className = "badge badge-normal";
      } else {
        dashBadge.textContent = \`\${state.activeCollisions.length} Alerts\`;
        dashBadge.className = "badge badge-critical";
      }
    }
  }`;

const newDrugDash = `  updateDashboardDrugMetrics(state) {
    const count = state.activeCollisions ? state.activeCollisions.length : 0;
    const setSafe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    setSafe('dashDrugCollisions', \`\${count} Collisions\`);
    setSafe('dashDrugSnippet', count > 0 ? \`\${count} High-Risk Collisions\` : "Optimal Medication Safety");

    const dashBadge = document.getElementById('dashDrugBadge');
    if (dashBadge) {
      dashBadge.textContent = count > 0 ? \`\${count} Alerts\` : "Safe";
      dashBadge.className = \`condition-badge \${count > 0 ? 'tag-badge-danger' : 'tag-badge-warning'}\`;
    }

    const dashProfileDrugRisk = document.getElementById('dashProfileDrugRisk');
    if (dashProfileDrugRisk) {
      dashProfileDrugRisk.textContent = count > 0 ? \`\${count} Active Alerts\` : "Safe / Optimal";
      dashProfileDrugRisk.className = count > 0 ? 'tag-badge-danger' : 'tag-badge-warning';
    }
  }`;

content = content.replace(oldDrugDash, newDrugDash);

// Save to CardioSuite/js/app.js
fs.writeFileSync(appJsPath, content, 'utf8');
console.log("-> CardioSuite/js/app.js updated successfully.");

// Copy to root js/app.js
fs.writeFileSync(path.join(__dirname, 'js', 'app.js'), content, 'utf8');
console.log("-> root js/app.js updated successfully.");
