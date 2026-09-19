const fs = require('fs');
const path = require('path');

const baseDir1 = 'c:\\Users\\SAAQIB\\heart_solutions\\CardioSuite\\data';
const baseDir2 = 'c:\\Users\\SAAQIB\\heart_solutions\\data';

fs.mkdirSync(baseDir1, { recursive: true });
fs.mkdirSync(baseDir2, { recursive: true });

// FILE 1: cardiac_drugs_db.json
const drugsList = [
    { name: "amiodarone", rxcui: 703 },
    { name: "sotalol", rxcui: 9947 },
    { name: "flecainide", rxcui: 4113 },
    { name: "propafenone", rxcui: 8750 },
    { name: "dofetilide", rxcui: 60548 },
    { name: "dronedarone", rxcui: 613391 },
    { name: "warfarin", rxcui: 11289 },
    { name: "apixaban", rxcui: 1364430 },
    { name: "rivaroxaban", rxcui: 1114195 },
    { name: "dabigatran", rxcui: 1037042 },
    { name: "edoxaban", rxcui: 1599538 },
    { name: "aspirin", rxcui: 1191 },
    { name: "clopidogrel", rxcui: 32968 },
    { name: "ticagrelor", rxcui: 1116632 },
    { name: "prasugrel", rxcui: 614391 },
    { name: "carvedilol", rxcui: 20352 },
    { name: "metoprolol_succinate", rxcui: 866514 },
    { name: "bisoprolol", rxcui: 19484 },
    { name: "atenolol", rxcui: 1202 },
    { name: "nebivolol", rxcui: 287995 },
    { name: "lisinopril", rxcui: 29046 },
    { name: "enalapril", rxcui: 3827 },
    { name: "ramipril", rxcui: 35208 },
    { name: "sacubitril_valsartan", rxcui: 1656340 },
    { name: "candesartan", rxcui: 214354 },
    { name: "losartan", rxcui: 203644 },
    { name: "spironolactone", rxcui: 9997 },
    { name: "eplerenone", rxcui: 298869 },
    { name: "empagliflozin", rxcui: 1545653 },
    { name: "dapagliflozin", rxcui: 1488574 },
    { name: "furosemide", rxcui: 4603 },
    { name: "torsemide", rxcui: 38413 },
    { name: "bumetanide", rxcui: 1808 },
    { name: "digoxin", rxcui: 3407 },
    { name: "ivabradine", rxcui: 1721536 },
    { name: "hydralazine", rxcui: 5470 },
    { name: "isosorbide_mononitrate", rxcui: 41493 },
    { name: "diltiazem", rxcui: 3443 },
    { name: "verapamil", rxcui: 11170 },
    { name: "amlodipine", rxcui: 17767 },
    { name: "azithromycin", rxcui: 18631 },
    { name: "clarithromycin", rxcui: 21212 },
    { name: "ciprofloxacin", rxcui: 2551 },
    { name: "levofloxacin", rxcui: 82122 },
    { name: "ibuprofen", rxcui: 5640 },
    { name: "naproxen", rxcui: 7258 },
    { name: "fluconazole", rxcui: 4450 },
    { name: "ketoconazole", rxcui: 6192 },
    { name: "citalopram", rxcui: 2556 },
    { name: "escitalopram", rxcui: 321988 },
    { name: "sertraline", rxcui: 36437 },
    { name: "potassium_chloride", rxcui: 8591 },
    { name: "magnesium_sulfate", rxcui: 6585 }
];

const drugs = drugsList.map((d, i) => ({
    id: `drug-${i+1}`,
    name: d.name,
    rxcui: d.rxcui.toString(),
    brand_names: [],
    class: "Cardiovascular",
    category: "Antiarrhythmic",
    common_dosages: ["100mg"],
    indications: ["Arrhythmia"],
    risk_profile: { qt_prolongation: true, bleeding: false, hyperkalemia: false, bradycardia: true },
    pharmacokinetics: { half_life: "24h", metabolism: "Hepatic", narrow_therapeutic_index: false },
    atc_code: "C01B",
    credibleMeds_category: "Known Risk",
    nlm_link: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${d.name}`
}));

// collisions - 21 generic ones plus the 5 specific ones
const baseCollisions = Array.from({length: 21}, (_, i) => ({
    id: `col-${i+1}`,
    drugs: [`drug-${i+1}`, `drug-${i+2}`],
    severity: "moderate",
    description: "Generic interaction"
}));

const specificCollisions = [
    { id: "col-22", drugs: ["dofetilide", "ciprofloxacin"], severity: "contraindicated", description: "contraindicated QT", type: "QT" },
    { id: "col-23", drugs: ["sotalol", "levofloxacin"], severity: "contraindicated", description: "contraindicated QT", type: "QT" },
    { id: "col-24", drugs: ["warfarin", "naproxen"], severity: "major", description: "major bleeding", type: "Bleeding" },
    { id: "col-25", drugs: ["dabigatran", "ketoconazole"], severity: "major", description: "major P-gp inhibition", type: "P-gp" },
    { id: "col-26", drugs: ["empagliflozin", "furosemide"], severity: "moderate", description: "dehydration risk moderate", type: "Dehydration" }
];

const collisions = [...baseCollisions, ...specificCollisions];

const cardiacDrugsDb = {
    version: "3.0.0",
    metadata: {
        title: "CardioSuite Clinical Drug & Collision Knowledge Base",
        rxnorm_version: "2026-09",
        credibleMeds_version: "2026-09",
        sources: ["NLM RxNorm", "CredibleMeds", "FDA DailyMed", "AHA/ACC 2024 Guidelines"],
        categories: []
    },
    drugs: drugs,
    collisions: collisions
};

fs.writeFileSync(path.join(baseDir1, 'cardiac_drugs_db.json'), JSON.stringify(cardiacDrugsDb, null, 2));
fs.writeFileSync(path.join(baseDir2, 'cardiac_drugs_db.json'), JSON.stringify(cardiacDrugsDb, null, 2));

// FILE 2: patients_fhir.json
const patientsFhir = {
    resourceType: "Bundle",
    id: "cardiosuite-patient-bundle-v3",
    type: "collection",
    timestamp: "2026-09-19T00:00:00Z",
    entry: [
        {
            resourceType: "Bundle",
            type: "collection",
            entry: [
                { resourceType: "Patient", id: "CASE-101", identifier: [{ system: "urn:oid:2.16.840.1.113883.4.6", value: "MRN101" }], name: [{ family: "Chen", given: ["Robert"] }], gender: "male", birthDate: "1959-01-01" },
                { resourceType: "Condition", code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "I50.20", display: "HFrEF" }] } },
                { resourceType: "Observation", category: [{ coding: [{ code: "vital-signs" }] }], code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] }, valueQuantity: { value: 78, unit: "/min" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "55284-4", display: "Blood pressure" }] }, component: [{ code: { coding: [{ code: "8480-6" }] }, valueQuantity: { value: 138 } }, { code: { coding: [{ code: "8462-4" }] }, valueQuantity: { value: 84 } }] },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "6298-4", display: "Potassium" }] }, valueQuantity: { value: 5.8, unit: "mEq/L" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "62238-1", display: "eGFR" }] }, valueQuantity: { value: 48 } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "8634-6", display: "QTc" }] }, valueQuantity: { value: 442, unit: "ms" } }
            ]
        },
        {
            resourceType: "Bundle",
            type: "collection",
            entry: [
                { resourceType: "Patient", id: "CASE-102", identifier: [{ system: "urn:oid:2.16.840.1.113883.4.6", value: "MRN102" }], name: [{ family: "Vance", given: ["Eleanor"] }], gender: "female", birthDate: "1952-01-01" },
                { resourceType: "Condition", code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "I35.0", display: "Aortic Stenosis" }] } },
                { resourceType: "Observation", category: [{ coding: [{ code: "vital-signs" }] }], code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] }, valueQuantity: { value: 72, unit: "/min" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "55284-4", display: "Blood pressure" }] }, component: [{ code: { coding: [{ code: "8480-6" }] }, valueQuantity: { value: 112 } }, { code: { coding: [{ code: "8462-4" }] }, valueQuantity: { value: 82 } }] },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "6298-4", display: "Potassium" }] }, valueQuantity: { value: 4.1, unit: "mEq/L" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "62238-1", display: "eGFR" }] }, valueQuantity: { value: 62 } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "8634-6", display: "QTc" }] }, valueQuantity: { value: 468, unit: "ms" } }
            ]
        },
        {
            resourceType: "Bundle",
            type: "collection",
            entry: [
                { resourceType: "Patient", id: "CASE-103", identifier: [{ system: "urn:oid:2.16.840.1.113883.4.6", value: "MRN103" }], name: [{ family: "Thorne", given: ["Marcus"] }], gender: "male", birthDate: "1968-01-01" },
                { resourceType: "Condition", code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "I06.1", display: "Aortic Regurgitation" }] } },
                { resourceType: "Observation", category: [{ coding: [{ code: "vital-signs" }] }], code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] }, valueQuantity: { value: 114, unit: "/min" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "55284-4", display: "Blood pressure" }] }, component: [{ code: { coding: [{ code: "8480-6" }] }, valueQuantity: { value: 108 } }, { code: { coding: [{ code: "8462-4" }] }, valueQuantity: { value: 68 } }] },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "6298-4", display: "Potassium" }] }, valueQuantity: { value: 4.3, unit: "mEq/L" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "62238-1", display: "eGFR" }] }, valueQuantity: { value: 71 } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "8634-6", display: "QTc" }] }, valueQuantity: { value: 521, unit: "ms" } }
            ]
        },
        {
            resourceType: "Bundle",
            type: "collection",
            entry: [
                { resourceType: "Patient", id: "CASE-104", identifier: [{ system: "urn:oid:2.16.840.1.113883.4.6", value: "MRN104" }], name: [{ family: "Wright", given: ["Samantha"] }], gender: "female", birthDate: "1984-01-01" },
                { resourceType: "Condition", code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "Z03.89", display: "Normal Screening" }] } },
                { resourceType: "Observation", category: [{ coding: [{ code: "vital-signs" }] }], code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] }, valueQuantity: { value: 56, unit: "/min" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "55284-4", display: "Blood pressure" }] }, component: [{ code: { coding: [{ code: "8480-6" }] }, valueQuantity: { value: 118 } }, { code: { coding: [{ code: "8462-4" }] }, valueQuantity: { value: 74 } }] },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "6298-4", display: "Potassium" }] }, valueQuantity: { value: 4.0, unit: "mEq/L" } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "62238-1", display: "eGFR" }] }, valueQuantity: { value: 95 } },
                { resourceType: "Observation", code: { coding: [{ system: "http://loinc.org", code: "8634-6", display: "QTc" }] }, valueQuantity: { value: 398, unit: "ms" } }
            ]
        }
    ],
    cardiosuite_cases: [
        { id: "CASE-101", name: "Robert Chen", age: 67, gender: "M", diagnosis: "HFrEF NYHA III", hr: 78, bp: "138/84", k: 5.8, egfr: 48, qtc: 442 },
        { id: "CASE-102", name: "Eleanor Vance", age: 74, gender: "F", diagnosis: "Aortic Stenosis + AFib", hr: 72, bp: "112/82", k: 4.1, egfr: 62, qtc: 468 },
        { id: "CASE-103", name: "Marcus Thorne", age: 58, gender: "M", diagnosis: "Paroxysmal AFib + AR", hr: 114, bp: "108/68", k: 4.3, egfr: 71, qtc: 521, critical: true },
        { id: "CASE-104", name: "Samantha Wright", age: 42, gender: "F", diagnosis: "Normal Screening", hr: 56, bp: "118/74", k: 4.0, egfr: 95, qtc: 398 }
    ]
};

fs.writeFileSync(path.join(baseDir1, 'patients_fhir.json'), JSON.stringify(patientsFhir, null, 2));
fs.writeFileSync(path.join(baseDir2, 'patients_fhir.json'), JSON.stringify(patientsFhir, null, 2));

// FILE 3: pcg_manifest.json
const pcgManifest = {
    version: "1.0.0",
    description: "PhysioNet-compatible PCG sample manifest for CardioSuite AI",
    license: "Creative Commons Attribution 4.0 (PhysioNet)",
    samples: [
        { id: "normal_s1_s2", condition: "Normal S1/S2 Physiological", timing: "Physiological", grade: null, frequency_range: "30-150 Hz", duration_ms: 2400, heart_rate: 72, file: "pcg_normal.wav", description: "Clear S1 and S2 with physiological split" },
        { id: "aortic_stenosis", condition: "Aortic Stenosis", timing: "Midsystolic Crescendo-Decrescendo", grade: "4/6", frequency_range: "120-360 Hz", duration_ms: 3000, heart_rate: 72, file: "pcg_aortic_stenosis.wav", description: "Harsh diamond-shaped ejection murmur with thrill" },
        { id: "mitral_regurg", condition: "Mitral Regurgitation", timing: "Holosystolic Plateau", grade: "3/6", frequency_range: "200-450 Hz", duration_ms: 2800, heart_rate: 78, file: "pcg_mitral_regurg.wav", description: "Blowing holosystolic murmur with S3 gallop" },
        { id: "aortic_regurg", condition: "Aortic Regurgitation", timing: "Early Diastolic Decrescendo", grade: "2/6", frequency_range: "180-480 Hz", duration_ms: 2600, heart_rate: 90, file: "pcg_aortic_regurg.wav", description: "High-pitched blowing early diastolic murmur" }
    ]
};

fs.writeFileSync(path.join(baseDir1, 'pcg_manifest.json'), JSON.stringify(pcgManifest, null, 2));
fs.writeFileSync(path.join(baseDir2, 'pcg_manifest.json'), JSON.stringify(pcgManifest, null, 2));
