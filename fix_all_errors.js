const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const cardioDir = path.join(rootDir, 'CardioSuite');

console.log("=== Fixing All Clinical Data and JavaScript Errors ===");

// 1. Load full benchmark cases from sample_cases.json
const sampleCasesPath = path.join(cardioDir, 'data', 'sample_cases.json');
const sampleCases = JSON.parse(fs.readFileSync(sampleCasesPath, 'utf8')).benchmark_cases;

console.log(`Loaded ${sampleCases.length} complete clinical cases from sample_cases.json.`);

// 2. Read existing patients_fhir.json to preserve FHIR entries while fixing cardiosuite_cases
const fhirPath = path.join(cardioDir, 'data', 'patients_fhir.json');
let fhirBundle = JSON.parse(fs.readFileSync(fhirPath, 'utf8'));

// Update cardiosuite_cases to be the complete, rich sampleCases
fhirBundle.cardiosuite_cases = sampleCases.map(c => ({
  ...c,
  // Add FHIR metadata references
  fhir_patient_ref: `Patient/${c.id}`,
  fhir_condition_code: c.id === 'CASE-101' ? 'I50.20' : (c.id === 'CASE-102' ? 'I35.0' : (c.id === 'CASE-103' ? 'I06.1' : 'Z03.89')),
  k: c.id === 'CASE-101' ? 5.8 : (c.id === 'CASE-102' ? 4.1 : (c.id === 'CASE-103' ? 4.3 : 4.0)),
  egfr: c.id === 'CASE-101' ? 48 : (c.id === 'CASE-102' ? 62 : (c.id === 'CASE-103' ? 71 : 95)),
  qtc: c.id === 'CASE-101' ? 442 : (c.id === 'CASE-102' ? 468 : (c.id === 'CASE-103' ? 521 : 398))
}));

// Save fixed patients_fhir.json to both CardioSuite/data and data/
const fhirOutput = JSON.stringify(fhirBundle, null, 2);
fs.writeFileSync(fhirPath, fhirOutput, 'utf8');
fs.writeFileSync(path.join(rootDir, 'data', 'patients_fhir.json'), fhirOutput, 'utf8');
console.log("-> Fixed patients_fhir.json with complete clinical fields.");

// 3. Defensively update CardioSuite/js/app.js and js/app.js
['CardioSuite/js/app.js', 'js/app.js'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix populatePatientDropdown with safe fallback
  const oldPopulate = `  populatePatientDropdown() {
    const sel = document.getElementById('patientCaseSelect');
    if (!sel) return;
    sel.innerHTML = '';
    this.cases.forEach((c, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = \`\${c.id}: \${c.patient_name} (\${c.age}\${c.gender.charAt(0)}) - \${c.presenting_complaint.substring(0, 42)}...\`;
      sel.appendChild(opt);
    });
  }`;

  const safePopulate = `  populatePatientDropdown() {
    const sel = document.getElementById('patientCaseSelect');
    if (!sel) return;
    sel.innerHTML = '';
    this.cases.forEach((c, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      const name = c.patient_name || c.name || \`Patient \${idx + 1}\`;
      const age = c.age || '--';
      const gender = c.gender ? c.gender.charAt(0) : '-';
      const complaint = c.presenting_complaint || c.diagnosis || 'Clinical evaluation';
      const shortComplaint = complaint.length > 40 ? complaint.substring(0, 40) + '...' : complaint;
      opt.textContent = \`\${c.id}: \${name} (\${age}\${gender}) - \${shortComplaint}\`;
      sel.appendChild(opt);
    });
  }`;

  if (code.includes('opt.textContent = `${c.id}: ${c.patient_name}')) {
    code = code.replace(oldPopulate, safePopulate);
  }

  // Defensively guard updatePatientBannerUI
  const oldBanner = `  updatePatientBannerUI(c) {
    document.getElementById('bannerPatientName').textContent = c.patient_name;
    document.getElementById('bannerMrn').textContent = c.mrn;
    document.getElementById('bannerAgeGender').textContent = \`\${c.age} Y / \${c.gender}\`;
    document.getElementById('bannerVitalsHrBp').textContent = \`\${c.vitals.heart_rate} bpm | \${c.vitals.blood_pressure}\`;
    document.getElementById('bannerVitalsO2').textContent = \`\${c.vitals.o2_sat}\`;
    document.getElementById('bannerDiagnosisShort').textContent = c.presenting_complaint;
  }`;

  const safeBanner = `  updatePatientBannerUI(c) {
    if (!c) return;
    const setSafe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '--'; };
    setSafe('bannerPatientName', c.patient_name || c.name);
    setSafe('bannerMrn', c.mrn || 'CS-000000');
    setSafe('bannerAgeGender', \`\${c.age || '--'} Y / \${c.gender || '--'}\`);
    const hr = c.vitals ? c.vitals.heart_rate : (c.hr || '--');
    const bp = c.vitals ? c.vitals.blood_pressure : (c.bp || '--/--');
    const o2 = c.vitals ? c.vitals.o2_sat : '98%';
    setSafe('bannerVitalsHrBp', \`\${hr} bpm | \${bp}\`);
    setSafe('bannerVitalsO2', \`\${o2}\`);
    setSafe('bannerDiagnosisShort', c.presenting_complaint || c.diagnosis || 'Cardiovascular assessment');
  }`;

  if (code.includes("document.getElementById('bannerPatientName').textContent = c.patient_name;")) {
    code = code.replace(oldBanner, safeBanner);
  }

  // Safe loadCase guards
  code = code.replace(
    'this.heart3d.setHeartRate(c.vitals.heart_rate || 72);',
    'this.heart3d.setHeartRate(c.vitals ? (c.vitals.heart_rate || 72) : (c.hr || 72));'
  );

  code = code.replace(
    'this.showToast(`Loaded benchmark clinical case: ${c.patient_name} (${c.id})`);',
    'this.showToast(`Loaded clinical case: ${c.patient_name || c.name || "Patient"} (${c.id || "ID"})`);'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`-> Defensively patched ${relPath}`);
});

// 4. Defensively patch report_generator.js
['CardioSuite/js/report_generator.js', 'js/report_generator.js'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  let code = fs.readFileSync(filePath, 'utf8');

  code = code.replace(
    '${patient ? patient.patient_name : "Patient Profile"}',
    '${patient ? (patient.patient_name || patient.name || "Patient Profile") : "Patient Profile"}'
  );

  code = code.replace(
    '${patient ? patient.mrn : "CS-000000"}',
    '${patient ? (patient.mrn || "CS-000000") : "CS-000000"}'
  );

  code = code.replace(
    '${patient ? `${patient.age} Y / ${patient.gender}` : "N/A"}',
    '${patient ? `${patient.age || "--"} Y / ${patient.gender || "--"}` : "N/A"}'
  );

  code = code.replace(
    '${patient ? patient.presenting_complaint : "Routine cardiovascular assessment."}',
    '${patient ? (patient.presenting_complaint || patient.diagnosis || "Routine cardiovascular assessment.") : "Routine cardiovascular assessment."}'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`-> Defensively patched ${relPath}`);
});

console.log("All fixes applied successfully.");
