/**
 * CardioSuite AI - Module 3: Cardiac Drug Collision & Safety Engine
 * Knowledge Graph Evaluator, Multi-Hazard Collision Matrix (QT, Bleeding, Hyperkalemia, Bradycardia),
 * Prescription Photo OCR Simulator & Safer Clinical Alternatives.
 */

class DrugCollisionSafetyEngine {
  constructor() {
    this.drugsDb = [];
    this.collisionsDb = [];
    this.selectedDrugs = []; // array of drug objects
    this.activeCollisions = []; // triggered collision alerts
    this.hazardScores = {
      qtProlongation: 0,
      bleedingRisk: 0,
      hyperkalemiaRisk: 0,
      bradycardiaRisk: 0
    };

    this.onStateChanged = null;
    this.init();
  }

  async init() {
    if (window.CARDIO_DATA && window.CARDIO_DATA.drugsDb) {
      this.drugsDb = window.CARDIO_DATA.drugsDb.drugs || [];
      this.collisionsDb = window.CARDIO_DATA.drugsDb.collisions || [];
      return;
    }
    try {
      const resp = await fetch('data/cardiac_drugs_db.json');
      const data = await resp.json();
      this.drugsDb = data.drugs || [];
      this.collisionsDb = data.collisions || [];
    } catch (err) {
      console.warn("Could not fetch cardiac_drugs_db.json via network, using embedded fallback", err);
    }
  }

  loadDrugsDatabase(drugs, collisions) {
    this.drugsDb = drugs;
    this.collisionsDb = collisions;
    this.evaluateCollisions();
  }

  addDrugById(drugId) {
    const found = this.drugsDb.find(d => d.id === drugId);
    if (!found) return false;
    if (this.selectedDrugs.some(d => d.id === drugId)) return false; // already present
    this.selectedDrugs.push(found);
    this.evaluateCollisions();
    return true;
  }

  removeDrugById(drugId) {
    this.selectedDrugs = this.selectedDrugs.filter(d => d.id !== drugId);
    this.evaluateCollisions();
  }

  clearDrugs() {
    this.selectedDrugs = [];
    this.evaluateCollisions();
  }

  setPatientMedications(drugIds = []) {
    this.selectedDrugs = [];
    drugIds.forEach(id => {
      const found = this.drugsDb.find(d => d.id === id);
      if (found) this.selectedDrugs.push(found);
    });
    this.evaluateCollisions();
  }

  searchDrugs(query) {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    return this.drugsDb.filter(d => {
      return (
        d.name.toLowerCase().includes(q) ||
        d.class.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.brand_names.some(b => b.toLowerCase().includes(q))
      );
    });
  }

  filterByCategory(category) {
    if (!category || category === 'All') return this.drugsDb;
    return this.drugsDb.filter(d => d.category === category);
  }

  evaluateCollisions() {
    this.activeCollisions = [];
    this.hazardScores = {
      qtProlongation: 0,
      bleedingRisk: 0,
      hyperkalemiaRisk: 0,
      bradycardiaRisk: 0
    };

    const selectedIds = this.selectedDrugs.map(d => d.id);

    // Evaluate individual baseline drug risk points
    this.selectedDrugs.forEach(d => {
      const rp = d.risk_profile;
      if (rp) {
        if (rp.qt_prolongation === 'Extreme') this.hazardScores.qtProlongation += 4;
        else if (rp.qt_prolongation === 'High') this.hazardScores.qtProlongation += 2.5;
        else if (rp.qt_prolongation === 'Moderate') this.hazardScores.qtProlongation += 1.5;

        if (rp.bleeding === 'Extreme') this.hazardScores.bleedingRisk += 4;
        else if (rp.bleeding === 'High') this.hazardScores.bleedingRisk += 2.5;
        else if (rp.bleeding === 'Moderate') this.hazardScores.bleedingRisk += 1.5;

        if (rp.hyperkalemia === 'Extreme') this.hazardScores.hyperkalemiaRisk += 4;
        else if (rp.hyperkalemia === 'High') this.hazardScores.hyperkalemiaRisk += 2.5;
        else if (rp.hyperkalemia === 'Moderate') this.hazardScores.hyperkalemiaRisk += 1.5;

        if (rp.bradycardia === 'Extreme') this.hazardScores.bradycardiaRisk += 4;
        else if (rp.bradycardia === 'High') this.hazardScores.bradycardiaRisk += 2.5;
        else if (rp.bradycardia === 'Moderate') this.hazardScores.bradycardiaRisk += 1.5;
      }
    });

    // Check Pairwise Collisions from Knowledge Graph
    for (let i = 0; i < selectedIds.length; i++) {
      for (let j = i + 1; j < selectedIds.length; j++) {
        const idA = selectedIds[i];
        const idB = selectedIds[j];

        const match = this.collisionsDb.find(c =>
          (c.drug1 === idA && c.drug2 === idB) ||
          (c.drug1 === idB && c.drug2 === idA)
        );

        if (match) {
          const drugObj1 = this.drugsDb.find(d => d.id === match.drug1);
          const drugObj2 = this.drugsDb.find(d => d.id === match.drug2);

          this.activeCollisions.push({
            ...match,
            drug1Name: drugObj1 ? drugObj1.name : match.drug1,
            drug2Name: drugObj2 ? drugObj2.name : match.drug2
          });

          // Add collision specific points to hazard scores
          if (match.primary_hazard.includes('QT')) {
            this.hazardScores.qtProlongation += (match.tisdale_risk_points || 10) * 0.5;
          }
          if (match.primary_hazard.includes('Bleeding') || match.primary_hazard.includes('Hemorrhage')) {
            this.hazardScores.bleedingRisk += (match.bleeding_hazard_score || 4) * 1.5;
          }
          if (match.primary_hazard.includes('Hyperkalemia') || match.primary_hazard.includes('Electrolyte')) {
            this.hazardScores.hyperkalemiaRisk += (match.hyperkalemia_score || 4) * 1.5;
          }
          if (match.primary_hazard.includes('Bradycardia') || match.primary_hazard.includes('Block')) {
            this.hazardScores.bradycardiaRisk += (match.bradycardia_score || 4) * 1.5;
          }
        }
      }
    }

    // Round scores
    this.hazardScores.qtProlongation = Math.min(10, parseFloat(this.hazardScores.qtProlongation.toFixed(1)));
    this.hazardScores.bleedingRisk = Math.min(10, parseFloat(this.hazardScores.bleedingRisk.toFixed(1)));
    this.hazardScores.hyperkalemiaRisk = Math.min(10, parseFloat(this.hazardScores.hyperkalemiaRisk.toFixed(1)));
    this.hazardScores.bradycardiaRisk = Math.min(10, parseFloat(this.hazardScores.bradycardiaRisk.toFixed(1)));

    if (this.onStateChanged) {
      this.onStateChanged({
        selectedDrugs: this.selectedDrugs,
        activeCollisions: this.activeCollisions,
        hazardScores: this.hazardScores,
        interactionMatrix: this.generateInteractionMatrix()
      });
    }
  }

  generateInteractionMatrix() {
    const drugs = this.selectedDrugs;
    const n = drugs.length;
    const matrix = [];

    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          row.push({ status: 'self', collision: null });
        } else {
          const idA = drugs[i].id;
          const idB = drugs[j].id;
          const col = this.collisionsDb.find(c =>
            (c.drug1 === idA && c.drug2 === idB) ||
            (c.drug1 === idB && c.drug2 === idA)
          );
          if (col) {
            row.push({
              status: col.severity === 'Contraindicated' ? 'contraindicated' : (col.severity === 'Major' ? 'major' : 'moderate'),
              collision: col
            });
          } else {
            row.push({ status: 'safe', collision: null });
          }
        }
      }
      matrix.push({ drug: drugs[i], cells: row });
    }
    return matrix;
  }

  simulatePrescriptionOCR(imageFile, callback) {
    // High-fidelity clinical OCR simulation with realistic delay, text extraction & bounding boxes
    const matchedPrescriptions = [
      {
        rawText: "Rx: Amiodarone 200mg tab po daily - #30 ref 2",
        drugId: "amiodarone",
        confidence: 99.6,
        dosage: "200 mg PO daily",
        coords: { x: 18, y: 32, w: 64, h: 14 }
      },
      {
        rawText: "Rx: Azithromycin 500mg tab po day 1 then 250mg days 2-5",
        drugId: "azithromycin",
        confidence: 99.6,
        dosage: "500 mg initial, 250 mg daily",
        coords: { x: 20, y: 54, w: 62, h: 14 }
      },
      {
        rawText: "Rx: Citalopram 20mg tab po daily morning",
        drugId: "citalopram",
        confidence: 99.6,
        dosage: "20 mg daily",
        coords: { x: 22, y: 72, w: 58, h: 12 }
      }
    ];

    setTimeout(() => {
      callback({
        status: "success",
        fileName: imageFile ? imageFile.name : "clinical_prescription_photo.jpg",
        extractedEntities: matchedPrescriptions,
        scannedCount: matchedPrescriptions.length
      });
    }, 1400);
  }
}

window.DrugCollisionSafetyEngine = DrugCollisionSafetyEngine;
