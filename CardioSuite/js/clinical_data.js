var _globalScope = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
_globalScope.CARDIO_DATA = {
  "drugsDb": {
    "version": "2.4.0",
    "metadata": {
      "title": "CardioSuite Clinical Cardiac Drug & Collision Knowledge Base",
      "updated": "2026-09-19",
      "categories": [
        "Antiarrhythmics",
        "Anticoagulants",
        "Antiplatelets",
        "Heart Failure & RAAS Blockers",
        "Beta Blockers",
        "Calcium Channel Blockers",
        "Diuretics & MRAs",
        "Inotropes & Cardiac Glycosides",
        "Colliding Antibiotics & Macrolides",
        "Colliding NSAIDs",
        "Colliding Psychotropics & SSRIs",
        "Colliding Antifungals & Azoles"
      ]
    },
    "drugs": [
      {
        "id": "amiodarone",
        "name": "Amiodarone",
        "brand_names": [
          "Cordarone",
          "Pacerone",
          "Nexterone"
        ],
        "class": "Class III Antiarrhythmic",
        "category": "Antiarrhythmics",
        "common_dosages": [
          "100 mg",
          "200 mg",
          "400 mg daily"
        ],
        "indications": [
          "Ventricular Arrhythmias",
          "Atrial Fibrillation / Flutter rhythm control"
        ],
        "risk_profile": {
          "qt_prolongation": "Extreme",
          "bleeding": "Low",
          "hyperkalemia": "None",
          "bradycardia": "High"
        },
        "pharmacokinetics": {
          "half_life": "40-58 days",
          "metabolism": "CYP3A4, CYP2C8, P-glycoprotein inhibitor",
          "narrow_therapeutic_index": true
        }
      },
      {
        "id": "sotalol",
        "name": "Sotalol",
        "brand_names": [
          "Betapace",
          "Sorine"
        ],
        "class": "Class III Antiarrhythmic / Non-selective Beta Blocker",
        "category": "Antiarrhythmics",
        "common_dosages": [
          "80 mg",
          "120 mg",
          "160 mg twice daily"
        ],
        "indications": [
          "Ventricular Arrhythmias",
          "Maintenance of normal sinus rhythm in AFib"
        ],
        "risk_profile": {
          "qt_prolongation": "Extreme",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "High"
        },
        "pharmacokinetics": {
          "half_life": "12 hours",
          "metabolism": "Renal elimination unchanged",
          "narrow_therapeutic_index": true
        }
      },
      {
        "id": "flecainide",
        "name": "Flecainide",
        "brand_names": [
          "Tambocor"
        ],
        "class": "Class IC Antiarrhythmic",
        "category": "Antiarrhythmics",
        "common_dosages": [
          "50 mg",
          "100 mg",
          "150 mg twice daily"
        ],
        "indications": [
          "Paroxysmal AFib without structural heart disease",
          "PSVT"
        ],
        "risk_profile": {
          "qt_prolongation": "Moderate",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "Moderate"
        },
        "pharmacokinetics": {
          "half_life": "20 hours",
          "metabolism": "CYP2D6",
          "narrow_therapeutic_index": true
        }
      },
      {
        "id": "warfarin",
        "name": "Warfarin",
        "brand_names": [
          "Coumadin",
          "Jantoven"
        ],
        "class": "Vitamin K Antagonist (Oral Anticoagulant)",
        "category": "Anticoagulants",
        "common_dosages": [
          "1 mg",
          "2 mg",
          "2.5 mg",
          "5 mg",
          "7.5 mg daily titrated to INR"
        ],
        "indications": [
          "Mechanical Heart Valves",
          "Atrial Fibrillation thromboembolism prophylaxis",
          "DVT/PE"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "Extreme",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "20-60 hours",
          "metabolism": "CYP2C9, CYP3A4, CYP1A2",
          "narrow_therapeutic_index": true
        }
      },
      {
        "id": "apixaban",
        "name": "Apixaban",
        "brand_names": [
          "Eliquis"
        ],
        "class": "Direct Oral Anticoagulant (DOAC / Factor Xa Inhibitor)",
        "category": "Anticoagulants",
        "common_dosages": [
          "2.5 mg",
          "5 mg twice daily"
        ],
        "indications": [
          "Non-valvular Atrial Fibrillation stroke prevention",
          "DVT/PE treatment/prophylaxis"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "12 hours",
          "metabolism": "CYP3A4 and P-gp substrate",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "rivaroxaban",
        "name": "Rivaroxaban",
        "brand_names": [
          "Xarelto"
        ],
        "class": "Direct Factor Xa Inhibitor (DOAC)",
        "category": "Anticoagulants",
        "common_dosages": [
          "10 mg",
          "15 mg",
          "20 mg daily with food"
        ],
        "indications": [
          "Non-valvular AFib",
          "Venous Thromboembolism",
          "CAD/PAD risk reduction"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "5-9 hours (young), 11-13 hours (elderly)",
          "metabolism": "CYP3A4 and P-gp substrate",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "aspirin",
        "name": "Aspirin",
        "brand_names": [
          "Bayer",
          "Ecotrin",
          "Empirin"
        ],
        "class": "Antiplatelet / Irreversible COX-1 Inhibitor",
        "category": "Antiplatelets",
        "common_dosages": [
          "81 mg",
          "325 mg daily"
        ],
        "indications": [
          "Secondary prevention of MI, stroke, TIA",
          "Post-PCI / Coronary Stenting"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "15-20 minutes (salicylate 2-30 hours)",
          "metabolism": "Hepatic conjugation",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "clopidogrel",
        "name": "Clopidogrel",
        "brand_names": [
          "Plavix"
        ],
        "class": "P2Y12 Platelet Receptor Inhibitor",
        "category": "Antiplatelets",
        "common_dosages": [
          "75 mg daily"
        ],
        "indications": [
          "Dual Antiplatelet Therapy (DAPT) post-PCI",
          "Recent MI / Stroke / PAD"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "6 hours (active metabolite 30 min)",
          "metabolism": "Prodrug activated by CYP2C19",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "ticagrelor",
        "name": "Ticagrelor",
        "brand_names": [
          "Brilinta"
        ],
        "class": "Reversible P2Y12 Platelet Inhibitor",
        "category": "Antiplatelets",
        "common_dosages": [
          "60 mg",
          "90 mg twice daily"
        ],
        "indications": [
          "Acute Coronary Syndrome (ACS)",
          "High-risk post-MI"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "Extreme",
          "hyperkalemia": "None",
          "bradycardia": "Moderate"
        },
        "pharmacokinetics": {
          "half_life": "7-9 hours",
          "metabolism": "CYP3A4",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "carvedilol",
        "name": "Carvedilol",
        "brand_names": [
          "Coreg",
          "Coreg CR"
        ],
        "class": "Non-selective Beta & Alpha-1 Blocker",
        "category": "Beta Blockers",
        "common_dosages": [
          "3.125 mg",
          "6.25 mg",
          "12.5 mg",
          "25 mg twice daily"
        ],
        "indications": [
          "Heart Failure with Reduced Ejection Fraction (HFrEF)",
          "Hypertension",
          "Post-MI LV dysfunction"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "High"
        },
        "pharmacokinetics": {
          "half_life": "7-10 hours",
          "metabolism": "CYP2D6, CYP2C9",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "metoprolol_succinate",
        "name": "Metoprolol Succinate",
        "brand_names": [
          "Toprol-XL"
        ],
        "class": "Cardioselective Beta-1 Blocker (Extended Release)",
        "category": "Beta Blockers",
        "common_dosages": [
          "25 mg",
          "50 mg",
          "100 mg",
          "200 mg daily"
        ],
        "indications": [
          "Heart Failure (HFrEF NYHA II-IV)",
          "Angina Pectoris",
          "Hypertension"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "High"
        },
        "pharmacokinetics": {
          "half_life": "3-7 hours (plasma)",
          "metabolism": "CYP2D6",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "lisinopril",
        "name": "Lisinopril",
        "brand_names": [
          "Prinivil",
          "Zestril"
        ],
        "class": "Angiotensin-Converting Enzyme (ACE) Inhibitor",
        "category": "Heart Failure & RAAS Blockers",
        "common_dosages": [
          "5 mg",
          "10 mg",
          "20 mg",
          "40 mg daily"
        ],
        "indications": [
          "HFrEF",
          "Hypertension",
          "Post-Myocardial Infarction"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "High",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "12 hours",
          "metabolism": "Excreted unchanged in urine",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "sacubitril_valsartan",
        "name": "Sacubitril / Valsartan",
        "brand_names": [
          "Entresto"
        ],
        "class": "Angiotensin Receptor-Neprilysin Inhibitor (ARNI)",
        "category": "Heart Failure & RAAS Blockers",
        "common_dosages": [
          "24/26 mg",
          "49/51 mg",
          "97/103 mg twice daily"
        ],
        "indications": [
          "HFrEF NYHA Class II-IV guideline-directed medical therapy",
          "Heart Failure with Preserved Ejection Fraction (HFpEF)"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "High",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "Sacubitrilat 11.5h, Valsartan 9.9h",
          "metabolism": "Enzymatic cleavage",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "spironolactone",
        "name": "Spironolactone",
        "brand_names": [
          "Aldactone"
        ],
        "class": "Mineralocorticoid Receptor Antagonist (MRA / Potassium-Sparing Diuretic)",
        "category": "Diuretics & MRAs",
        "common_dosages": [
          "12.5 mg",
          "25 mg",
          "50 mg daily"
        ],
        "indications": [
          "HFrEF mortality reduction",
          "Resistant Hypertension",
          "Hyperaldosteronism"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "Extreme",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "Active metabolites (Canrenone) 16.5 hours",
          "metabolism": "Hepatic conversion",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "eplerenone",
        "name": "Eplerenone",
        "brand_names": [
          "Inspra"
        ],
        "class": "Selective Mineralocorticoid Receptor Antagonist",
        "category": "Diuretics & MRAs",
        "common_dosages": [
          "25 mg",
          "50 mg daily"
        ],
        "indications": [
          "HFrEF post-MI with LV dysfunction",
          "Hypertension"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "Extreme",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "4-6 hours",
          "metabolism": "CYP3A4",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "digoxin",
        "name": "Digoxin",
        "brand_names": [
          "Lanoxin",
          "Digitek"
        ],
        "class": "Cardiac Glycoside (Na+/K+-ATPase Inhibitor)",
        "category": "Inotropes & Cardiac Glycosides",
        "common_dosages": [
          "0.0625 mg",
          "0.125 mg",
          "0.25 mg daily"
        ],
        "indications": [
          "Atrial Fibrillation rate control in HFrEF",
          "Symptomatic HFrEF"
        ],
        "risk_profile": {
          "qt_prolongation": "Moderate",
          "bleeding": "None",
          "hyperkalemia": "Moderate",
          "bradycardia": "Extreme"
        },
        "pharmacokinetics": {
          "half_life": "36-48 hours",
          "metabolism": "Renal clearance, P-gp substrate",
          "narrow_therapeutic_index": true,
          "target_serum_level": "0.5 - 0.9 ng/mL"
        }
      },
      {
        "id": "diltiazem",
        "name": "Diltiazem",
        "brand_names": [
          "Cardizem",
          "Tiazac",
          "Dilacor"
        ],
        "class": "Non-dihydropyridine Calcium Channel Blocker",
        "category": "Calcium Channel Blockers",
        "common_dosages": [
          "120 mg",
          "180 mg",
          "240 mg",
          "300 mg daily (CD/XR)"
        ],
        "indications": [
          "AFib/Flutter rate control with preserved EF",
          "Angina",
          "Hypertension"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "Extreme"
        },
        "pharmacokinetics": {
          "half_life": "3-4.5 hours (extended formulation longer)",
          "metabolism": "CYP3A4 substrate & moderate inhibitor",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "verapamil",
        "name": "Verapamil",
        "brand_names": [
          "Calan",
          "Verelan",
          "Isoptin"
        ],
        "class": "Non-dihydropyridine Calcium Channel Blocker",
        "category": "Calcium Channel Blockers",
        "common_dosages": [
          "120 mg",
          "180 mg",
          "240 mg daily (ER)"
        ],
        "indications": [
          "Supraventricular Tachycardia",
          "AFib rate control",
          "Hypertrophic Cardiomyopathy"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "Extreme"
        },
        "pharmacokinetics": {
          "half_life": "2.8-7.4 hours",
          "metabolism": "CYP3A4, CYP1A2, P-gp inhibitor",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "empagliflozin",
        "name": "Empagliflozin",
        "brand_names": [
          "Jardiance"
        ],
        "class": "SGLT2 Inhibitor",
        "category": "Heart Failure & RAAS Blockers",
        "common_dosages": [
          "10 mg",
          "25 mg daily"
        ],
        "indications": [
          "HFrEF & HFpEF hospitalization reduction",
          "Type 2 Diabetes mellitus",
          "CKD"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "12.4 hours",
          "metabolism": "UGT glucuronidation",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "furosemide",
        "name": "Furosemide",
        "brand_names": [
          "Lasix"
        ],
        "class": "Loop Diuretic",
        "category": "Diuretics & MRAs",
        "common_dosages": [
          "20 mg",
          "40 mg",
          "80 mg once or twice daily"
        ],
        "indications": [
          "Fluid overload / Pulmonary congestion in Heart Failure",
          "Edema",
          "Hypertension"
        ],
        "risk_profile": {
          "qt_prolongation": "Moderate",
          "bleeding": "None",
          "hyperkalemia": "Low",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "0.5 - 2 hours",
          "metabolism": "Renal and hepatic glucuronidation",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "azithromycin",
        "name": "Azithromycin",
        "brand_names": [
          "Zithromax",
          "Z-Pak"
        ],
        "class": "Macrolide Antibiotic",
        "category": "Colliding Antibiotics & Macrolides",
        "common_dosages": [
          "250 mg",
          "500 mg daily"
        ],
        "indications": [
          "Community-Acquired Pneumonia",
          "Exacerbations of COPD",
          "Bacterial Pharyngitis"
        ],
        "risk_profile": {
          "qt_prolongation": "High",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "Low"
        },
        "pharmacokinetics": {
          "half_life": "68 hours",
          "metabolism": "Biliary excretion",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "clarithromycin",
        "name": "Clarithromycin",
        "brand_names": [
          "Biaxin",
          "Biaxin XL"
        ],
        "class": "Macrolide Antibiotic / Potent CYP3A4 Inhibitor",
        "category": "Colliding Antibiotics & Macrolides",
        "common_dosages": [
          "250 mg",
          "500 mg twice daily"
        ],
        "indications": [
          "Helicobacter pylori eradication",
          "Respiratory tract infections"
        ],
        "risk_profile": {
          "qt_prolongation": "Extreme",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "Low"
        },
        "pharmacokinetics": {
          "half_life": "3-7 hours",
          "metabolism": "CYP3A4 substrate & potent inhibitor",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "ciprofloxacin",
        "name": "Ciprofloxacin",
        "brand_names": [
          "Cipro"
        ],
        "class": "Fluoroquinolone Antibiotic",
        "category": "Colliding Antibiotics & Macrolides",
        "common_dosages": [
          "250 mg",
          "500 mg",
          "750 mg twice daily"
        ],
        "indications": [
          "Complicated UTI",
          "Intra-abdominal infections"
        ],
        "risk_profile": {
          "qt_prolongation": "High",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "4 hours",
          "metabolism": "CYP1A2 inhibitor",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "ibuprofen",
        "name": "Ibuprofen",
        "brand_names": [
          "Advil",
          "Motrin"
        ],
        "class": "Nonsteroidal Anti-inflammatory Drug (NSAID)",
        "category": "Colliding NSAIDs",
        "common_dosages": [
          "200 mg",
          "400 mg",
          "600 mg",
          "800 mg 3-4 times daily"
        ],
        "indications": [
          "Acute pain",
          "Inflammatory arthritis",
          "Fever"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "Moderate",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "1.8-2 hours",
          "metabolism": "CYP2C9",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "naproxen",
        "name": "Naproxen",
        "brand_names": [
          "Aleve",
          "Naprosyn"
        ],
        "class": "Nonsteroidal Anti-inflammatory Drug (NSAID)",
        "category": "Colliding NSAIDs",
        "common_dosages": [
          "220 mg",
          "250 mg",
          "500 mg twice daily"
        ],
        "indications": [
          "Musculoskeletal pain",
          "Gout",
          "Osteoarthritis"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "High",
          "hyperkalemia": "Moderate",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "12-17 hours",
          "metabolism": "CYP2C9, CYP1A2",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "fluconazole",
        "name": "Fluconazole",
        "brand_names": [
          "Diflucan"
        ],
        "class": "Triazole Antifungal / CYP2C9 & CYP3A4 Inhibitor",
        "category": "Colliding Antifungals & Azoles",
        "common_dosages": [
          "150 mg single dose",
          "100-400 mg daily"
        ],
        "indications": [
          "Candidiasis",
          "Cryptococcal meningitis prophylaxis"
        ],
        "risk_profile": {
          "qt_prolongation": "High",
          "bleeding": "None",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "30 hours",
          "metabolism": "Strong CYP2C9 inhibitor, moderate CYP3A4 inhibitor",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "citalopram",
        "name": "Citalopram",
        "brand_names": [
          "Celexa"
        ],
        "class": "Selective Serotonin Reuptake Inhibitor (SSRI)",
        "category": "Colliding Psychotropics & SSRIs",
        "common_dosages": [
          "10 mg",
          "20 mg",
          "40 mg daily"
        ],
        "indications": [
          "Major Depressive Disorder",
          "Generalized Anxiety Disorder"
        ],
        "risk_profile": {
          "qt_prolongation": "High",
          "bleeding": "Moderate",
          "hyperkalemia": "None",
          "bradycardia": "None"
        },
        "pharmacokinetics": {
          "half_life": "35 hours",
          "metabolism": "CYP2C19, CYP3A4",
          "narrow_therapeutic_index": false
        }
      },
      {
        "id": "potassium_chloride",
        "name": "Potassium Chloride",
        "brand_names": [
          "K-Dur",
          "Klor-Con",
          "Micro-K"
        ],
        "class": "Electrolyte Supplement",
        "category": "Diuretics & MRAs",
        "common_dosages": [
          "10 mEq",
          "20 mEq",
          "40 mEq daily"
        ],
        "indications": [
          "Hypokalemia prevention or treatment during diuretic therapy"
        ],
        "risk_profile": {
          "qt_prolongation": "None",
          "bleeding": "None",
          "hyperkalemia": "Extreme",
          "bradycardia": "High"
        },
        "pharmacokinetics": {
          "half_life": "Immediate systemic electrolyte",
          "metabolism": "Renal excretion",
          "narrow_therapeutic_index": true
        }
      }
    ],
    "collisions": [
      {
        "id": "COL-001",
        "drug1": "amiodarone",
        "drug2": "azithromycin",
        "primary_hazard": "Fatal Arrhythmia / QT Prolongation",
        "severity": "Contraindicated",
        "tisdale_risk_points": 14,
        "mechanism": "Additive block of rapid delayed rectifier cardiac potassium currents (IKr / hERG channel), triggering marked QTc prolongation (>500 ms) and precipitate Polymorphic Ventricular Tachycardia (Torsades de Pointes).",
        "clinical_manifestation": "Syncope, palpitations, sudden cardiac arrest, ventricular fibrillation.",
        "safer_alternatives": [
          "Substitute Azithromycin with Doxycycline or Amoxicillin/Clavulanate for respiratory infections.",
          "If atypical pneumonia coverage is mandatory, conduct daily baseline 12-lead ECG monitoring and maintain serum K+ > 4.5 mEq/L and Mg2+ > 2.0 mg/dL."
        ],
        "regulatory_alert": "FDA Black Box & ACC/AHA Class III Harm Warning"
      },
      {
        "id": "COL-002",
        "drug1": "amiodarone",
        "drug2": "clarithromycin",
        "primary_hazard": "Fatal Arrhythmia / QT Prolongation",
        "severity": "Contraindicated",
        "tisdale_risk_points": 16,
        "mechanism": "Potent CYP3A4 inhibition by Clarithromycin markedly reduces Amiodarone clearance while synergistically prolonging ventricular repolarization (additive hERG channel blockade).",
        "clinical_manifestation": "Profound QTc prolongation (>520ms), high risk of fatal Torsades de Pointes, severe bradycardia.",
        "safer_alternatives": [
          "Avoid co-administration. Use Cefuroxime, Doxycycline, or Aztreonam as alternative anti-infective therapy."
        ],
        "regulatory_alert": "Strictly Contraindicated (CredibleMeds Known Risk List 1)"
      },
      {
        "id": "COL-003",
        "drug1": "sotalol",
        "drug2": "citalopram",
        "primary_hazard": "Fatal Arrhythmia / QT Prolongation",
        "severity": "Contraindicated",
        "tisdale_risk_points": 13,
        "mechanism": "Both agents cause concentration-dependent QT interval prolongation via potassium channel IKr delay. Co-prescribing elevates TdP risk by >6-fold.",
        "clinical_manifestation": "Dizziness, Torsades de Pointes, ventricular tachycardia.",
        "safer_alternatives": [
          "Switch antidepressant to Sertraline or Bupropion (lowest QT prolongation risk in class)."
        ],
        "regulatory_alert": "FDA Drug Safety Communication - Avoid Citalopram with QT-prolonging antiarrhythmics"
      },
      {
        "id": "COL-004",
        "drug1": "warfarin",
        "drug2": "aspirin",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Major",
        "bleeding_hazard_score": 4,
        "mechanism": "Dual inhibition of hemostasis: Warfarin inhibits vitamin K-dependent clotting factors (II, VII, IX, X), while Aspirin irreversibly disables platelet TXA2-mediated aggregation. Gastric mucosal injury compounds bleeding risk.",
        "clinical_manifestation": "Gastrointestinal hemorrhage, intracranial bleed, hematuria, extensive hematomas.",
        "safer_alternatives": [
          "Discontinue Aspirin unless patient has recent PCI/stent within 1-3 months (per 2024 ESC/ACC AFib guidelines, DOAC monotherapy is preferred).",
          "Add Proton Pump Inhibitor (PPI: Pantoprazole 40mg daily) for gastroprotection if combination is strictly indicated."
        ],
        "regulatory_alert": "High Bleeding Risk Warning (HAS-BLED Score += 2)"
      },
      {
        "id": "COL-005",
        "drug1": "warfarin",
        "drug2": "ibuprofen",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Contraindicated",
        "bleeding_hazard_score": 5,
        "mechanism": "Ibuprofen displaces Warfarin from plasma albumin binding sites and competitively inhibits CYP2C9 metabolism, raising free Warfarin concentrations and INR, while causing direct gastric mucosal erosions.",
        "clinical_manifestation": "Massive upper GI bleeding, dangerously elevated INR (>6.0), hemorrhagic stroke.",
        "safer_alternatives": [
          "Use Acetaminophen (Paracetamol) up to 2g/day or topical analgesics (Capsaicin, Lidocaine patch).",
          "If anti-inflammatory therapy is critical, consult rheumatology and consider short-course intra-articular corticosteroid."
        ],
        "regulatory_alert": "Absolute Contraindication in Anticoagulated Patients"
      },
      {
        "id": "COL-006",
        "drug1": "apixaban",
        "drug2": "ibuprofen",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Major",
        "bleeding_hazard_score": 4,
        "mechanism": "NSAID antiplatelet effect and GI mucosal injury synergize with Factor Xa inhibition, increasing major bleeding risk 3- to 4-fold without offering antidote titration via INR.",
        "clinical_manifestation": "Melena, hematemesis, severe drop in hemoglobin.",
        "safer_alternatives": [
          "Acetaminophen 500-1000 mg Q8H PRN, topical NSAID gel (Diclofenac 1% with minimal systemic absorption), or physical therapy."
        ],
        "regulatory_alert": "Boxed Bleeding Warning"
      },
      {
        "id": "COL-007",
        "drug1": "warfarin",
        "drug2": "fluconazole",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Major",
        "bleeding_hazard_score": 4,
        "mechanism": "Potent inhibition of CYP2C9 by Fluconazole blocks the clearance of the more potent S-warfarin enantiomer, causing rapid, severe spike in INR.",
        "clinical_manifestation": "INR doubling within 48 hours, spontaneous epistaxis, gross hematuria, retroperitoneal hematoma.",
        "safer_alternatives": [
          "If Fluconazole is unavoidable, preemptively reduce Warfarin dose by 50% and check INR at 48 and 72 hours.",
          "Consider topical antifungal or alternative class where appropriate."
        ],
        "regulatory_alert": "Critical Pharmacokinetic Interaction Alert"
      },
      {
        "id": "COL-008",
        "drug1": "spironolactone",
        "drug2": "lisinopril",
        "primary_hazard": "Electrolyte Shock / Severe Hyperkalemia",
        "severity": "Major",
        "hyperkalemia_score": 4,
        "mechanism": "Dual blockade of aldosterone pathway (ACE inhibitor lowers circulating aldosterone; Spironolactone directly blocks mineralocorticoid receptor in distal nephron cortical collecting tubule). Impairs potassium excretion.",
        "clinical_manifestation": "Serum K+ > 5.5 - 6.5 mEq/L, peaked T waves, PR prolongation, widening QRS, sine-wave arrest, muscle flaccidity.",
        "safer_alternatives": [
          "Monitor serum creatinine & K+ at baseline, 1 week, 4 weeks, and quarterly.",
          "Ensure eGFR > 30 mL/min/1.73m2. Do not exceed Spironolactone 25 mg daily without nephrology co-management.",
          "If K+ rises > 5.5 mEq/L, add potassium binder (Patiromer or Sodium Zirconium Cyclosilicate)."
        ],
        "regulatory_alert": "RALES Trial Warning: Routine K+ & Creatinine surveillance mandatory"
      },
      {
        "id": "COL-009",
        "drug1": "spironolactone",
        "drug2": "potassium_chloride",
        "primary_hazard": "Electrolyte Shock / Severe Hyperkalemia",
        "severity": "Contraindicated",
        "hyperkalemia_score": 5,
        "mechanism": "Administering exogenous potassium to a patient whose renal potassium excretion is blocked by an MRA is the leading cause of iatrogenic lethal hyperkalemic cardiac arrest.",
        "clinical_manifestation": "Lethal ventricular arrhythmias (ventricular fibrillation, asystole) triggered by sudden hyperkalemia (K+ > 6.5 mEq/L).",
        "safer_alternatives": [
          "Immediately discontinue Potassium supplements upon initiating Spironolactone or Eplerenone.",
          "Supplement potassium only if documented hypokalemia (< 3.5 mEq/L) occurs despite MRA therapy."
        ],
        "regulatory_alert": "Strict Contraindication (High Mortality Hazard)"
      },
      {
        "id": "COL-010",
        "drug1": "sacubitril_valsartan",
        "drug2": "spironolactone",
        "primary_hazard": "Electrolyte Shock / Severe Hyperkalemia",
        "severity": "Moderate",
        "hyperkalemia_score": 3,
        "mechanism": "Valsartan ARB component inhibits AT1 receptors while Sacubitril preserves natriuretic peptides, mildly elevating hyperkalemia risk when combined with MRA.",
        "clinical_manifestation": "Progressive hyperkalemia, especially in patients with baseline CKD stage 3b+.",
        "safer_alternatives": [
          "Titrate cautiously with serial K+ checks every 2 weeks during dose uptitration.",
          "Maintain dietary low-potassium counselling."
        ],
        "regulatory_alert": "PARADIGM-HF Guideline Protocol Monitoring"
      },
      {
        "id": "COL-011",
        "drug1": "carvedilol",
        "drug2": "diltiazem",
        "primary_hazard": "Profound Bradycardia / Heart Block",
        "severity": "Contraindicated",
        "bradycardia_score": 5,
        "mechanism": "Synergistic negative inotropic, chronotropic, and dromotropic depression of the Sinoatrial (SA) and Atrioventricular (AV) nodes. Calcium channel blockade plus beta-adrenergic receptor blockade.",
        "clinical_manifestation": "Profound sinus bradycardia (HR < 40 bpm), complete 3rd degree AV block, cardiogenic shock, syncope.",
        "safer_alternatives": [
          "Avoid combination. In HFrEF patients, beta-blocker (Carvedilol or Metoprolol Succinate) is mandatory guideline-directed medical therapy; Diltiazem is contraindicated.",
          "If additional rate control is needed in AFib, consider low-dose Digoxin under expert supervision."
        ],
        "regulatory_alert": "AHA/ACC Heart Failure Guideline Contraindication"
      },
      {
        "id": "COL-012",
        "drug1": "metoprolol_succinate",
        "drug2": "verapamil",
        "primary_hazard": "Profound Bradycardia / Heart Block",
        "severity": "Contraindicated",
        "bradycardia_score": 5,
        "mechanism": "Direct additive suppression of AV nodal conduction velocity and myocardial contractility. Verapamil also inhibits metoprolol CYP2D6 clearance.",
        "clinical_manifestation": "Severe hemodynamic instability, high-grade AV block, pulmonary edema.",
        "safer_alternatives": [
          "Never combine oral Verapamil and Metoprolol in heart failure or conduction disease.",
          "Use Dihydropyridine CCB (Amlodipine) if additional blood pressure reduction is required, as it does not suppress nodal conduction."
        ],
        "regulatory_alert": "Boxed Contraindication"
      },
      {
        "id": "COL-013",
        "drug1": "amiodarone",
        "drug2": "digoxin",
        "primary_hazard": "Digoxin Toxicity & Severe Bradycardia",
        "severity": "Major",
        "bradycardia_score": 4,
        "mechanism": "Amiodarone inhibits renal and biliary P-glycoprotein efflux of Digoxin, doubling serum Digoxin levels, while both agents exert additive negative chronotropic effects on the AV node.",
        "clinical_manifestation": "Nausea, xanthopsia (yellow-green halos), ventricular bigeminy, junctional escape rhythm, complete heart block.",
        "safer_alternatives": [
          "Immediately reduce Digoxin dose by 50% when initiating Amiodarone.",
          "Obtain baseline and 1-week serum Digoxin level (target 0.5 - 0.8 ng/mL) and frequent ECG rhythm strips."
        ],
        "regulatory_alert": "High Alert Medication Interaction"
      },
      {
        "id": "COL-014",
        "drug1": "aspirin",
        "drug2": "clopidogrel",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Moderate",
        "bleeding_hazard_score": 3,
        "mechanism": "Dual Antiplatelet Therapy (DAPT) produces synergistic inhibition of primary platelet plug formation via both COX-1 and ADP P2Y12 pathways.",
        "clinical_manifestation": "Ecchymosis, epistaxis, prolonged bleeding from venipuncture, GI ulceration.",
        "safer_alternatives": [
          "Standard guideline indication for 6-12 months post-ACS / Drug-Eluting Stent, but avoid extending beyond recommended duration without explicit ischemic indication.",
          "Add PPI (Pantoprazole) to mitigate gastrointestinal ulceration risk."
        ],
        "regulatory_alert": "DAPT Consensus Guideline Regimen with Bleeding Precaution"
      },
      {
        "id": "COL-015",
        "drug1": "lisinopril",
        "drug2": "ibuprofen",
        "primary_hazard": "Acute Renal Failure & Antihypertensive Failure",
        "severity": "Major",
        "hyperkalemia_score": 3,
        "mechanism": "NSAIDs inhibit renal prostaglandin synthesis, causing vasoconstriction of the afferent glomerular arteriole. ACE inhibitors dilate the efferent arteriole. Together, glomerular filtration pressure collapses ('Triple Whammy' risk with diuretics).",
        "clinical_manifestation": "Acute kidney injury (abrupt rise in serum creatinine), fluid retention, worsening heart failure, elevated blood pressure.",
        "safer_alternatives": [
          "Avoid systemic NSAIDs in all patients with Heart Failure, CKD, or taking ACEi/ARBs.",
          "Utilize non-nephrotoxic analgesics: Acetaminophen or topical therapy."
        ],
        "regulatory_alert": "Nephrotoxic Synergy Alert"
      },
      {
        "id": "COL-016",
        "drug1": "sacubitril_valsartan",
        "drug2": "ibuprofen",
        "primary_hazard": "Acute Renal Failure & Decompensated Heart Failure",
        "severity": "Major",
        "hyperkalemia_score": 3,
        "mechanism": "NSAIDs inhibit renal vasodilating prostaglandins (afferent arteriole constriction), while valsartan blocks AT1 vasoconstriction (efferent arteriole dilation), precipitating acute decline in glomerular filtration rate (GFR).",
        "clinical_manifestation": "Rapid decline in renal function, fluid retention, pulmonary congestion, hyperkalemia.",
        "safer_alternatives": [
          "Avoid NSAIDs in all HFrEF patients receiving ARNI therapy.",
          "Use Acetaminophen (Paracetamol) or topical analgesics (Capsaicin / Lidocaine patch)."
        ],
        "regulatory_alert": "HFSA / ESC Heart Failure Guideline Warning"
      },
      {
        "id": "COL-017",
        "drug1": "furosemide",
        "drug2": "ibuprofen",
        "primary_hazard": "Diuretic Resistance & Acute Kidney Injury",
        "severity": "Major",
        "hyperkalemia_score": 2,
        "mechanism": "Inhibition of renal prostaglandins by NSAIDs blunts furosemide-induced natriuresis and loop diuretic response, while precipitating pre-renal azotemia ('Triple Whammy' with RAAS blockers).",
        "clinical_manifestation": "Oliguria, peripheral and pulmonary edema recurrence, acute creatinine surge.",
        "safer_alternatives": [
          "Discontinue NSAID; substitute with Acetaminophen.",
          "If congestion worsens, optimize loop diuretic dose under nephrology/cardiology guidance."
        ],
        "regulatory_alert": "Triple Whammy Nephrotoxicity Alert"
      },
      {
        "id": "COL-018",
        "drug1": "apixaban",
        "drug2": "aspirin",
        "primary_hazard": "Major Hemorrhage / Bleeding",
        "severity": "Major",
        "bleeding_hazard_score": 4,
        "mechanism": "Synergistic inhibition of primary platelet aggregation (Aspirin) and secondary coagulation cascade thrombin generation (Factor Xa inhibition by Apixaban).",
        "clinical_manifestation": "Major gastrointestinal bleed, intracranial hemorrhage, extensive spontaneous ecchymoses.",
        "safer_alternatives": [
          "Per 2024 ESC/AHA guidelines, discontinue Aspirin after 12 months post-ACS/PCI and continue DOAC monotherapy.",
          "Add gastroprotective PPI (Pantoprazole 40mg daily) if dual therapy is temporarily required."
        ],
        "regulatory_alert": "Elevated Bleeding Hazard Warning"
      },
      {
        "id": "COL-019",
        "drug1": "amiodarone",
        "drug2": "citalopram",
        "primary_hazard": "Fatal Arrhythmia / QT Prolongation",
        "severity": "Contraindicated",
        "tisdale_risk_points": 15,
        "mechanism": "Both agents independently delay ventricular repolarization by blocking human ether-a-go-go-related gene (hERG) K+ channels. Concomitant use causes profound additive QTc prolongation.",
        "clinical_manifestation": "Polymorphic ventricular tachycardia (Torsades de Pointes), syncope, sudden cardiac death.",
        "safer_alternatives": [
          "Switch antidepressant to Sertraline or Bupropion (lowest arrhythmogenic risk profile in class)."
        ],
        "regulatory_alert": "FDA Drug Safety Advisory: Extreme QTc Risk"
      },
      {
        "id": "COL-020",
        "drug1": "carvedilol",
        "drug2": "digoxin",
        "primary_hazard": "Profound Bradycardia & AV Block",
        "severity": "Moderate",
        "bradycardia_score": 3,
        "mechanism": "Dual suppression of AV nodal conduction velocity and SA node automaticity. Both agents exert negative chronotropic and dromotropic actions.",
        "clinical_manifestation": "Symptomatic sinus bradycardia (< 50 bpm), first- or second-degree AV block, fatigue, presyncope.",
        "safer_alternatives": [
          "Monitor resting heart rate and ECG PR interval during dose titration.",
          "Target Digoxin serum trough concentration 0.5 - 0.8 ng/mL."
        ],
        "regulatory_alert": "Guideline-Directed Rate Control Precaution"
      },
      {
        "id": "COL-021",
        "drug1": "warfarin",
        "drug2": "clarithromycin",
        "primary_hazard": "Severe Hemorrhage / Dramatic INR Spike",
        "severity": "Major",
        "bleeding_hazard_score": 5,
        "mechanism": "Clarithromycin inhibits CYP3A4-mediated Warfarin clearance and eradicates vitamin K-synthesizing intestinal microflora, producing rapid, unpredictable surges in INR and major bleeding risk.",
        "clinical_manifestation": "Gross hematuria, gastrointestinal bleeding, spontaneous bruising, INR > 7.0.",
        "safer_alternatives": [
          "Avoid macrolides in anticoagulated patients. Use Amoxicillin, Cefuroxime, or Doxycycline for respiratory infections.",
          "If Clarithromycin is strictly necessary, preemptively reduce Warfarin dose by 30-50% and perform INR surveillance every 48 hours."
        ],
        "regulatory_alert": "Critical Anticoagulation Interaction Warning"
      }
    ]
  },
  "cases": [
    {
      "id": "CASE-101",
      "patient_name": "Robert Chen",
      "age": 67,
      "gender": "Male",
      "mrn": "CS-948201",
      "admission_date": "2026-09-18",
      "presenting_complaint": "Progressive exertional dyspnea (NYHA III), orthopnea, bilateral lower extremity 2+ pitting edema, and severe knee osteoarthritis pain.",
      "clinical_history": "Ischemic cardiomyopathy s/p anterior STEMI (2022), Hypertension, Stage 3a Chronic Kidney Disease (baseline eGFR 48 mL/min).",
      "vitals": {
        "heart_rate": 78,
        "blood_pressure": "138/84 mmHg",
        "o2_sat": "94% on room air",
        "respiratory_rate": 20
      },
      "echo_preset": {
        "preset_id": "severe_hf",
        "title": "Dilated LV with Severely Depressed Systolic Function",
        "target_ef": 27.5,
        "edv_ml": 218,
        "esv_ml": 158,
        "stroke_volume_ml": 60,
        "cardiac_output_lpm": 4.68,
        "classification": "Severely Reduced / Heart Failure",
        "wall_motion": "Diffuse global hypokinesia with apical akinesia",
        "mitral_inflow": "Restrictive filling pattern (E/A > 2.0)",
        "lvedd_mm": 64,
        "lvesd_mm": 54
      },
      "acoustic_preset": {
        "preset_id": "mitral_regurg",
        "title": "Mitral Regurgitation (Functional / Secondary)",
        "condition": "Mitral Regurgitation",
        "timing": "Holosystolic (Plateau)",
        "frequency_band": "High frequency blowing murmur (200 - 450 Hz)",
        "intensity": "Grade 3/6",
        "location": "Cardiac Apex radiating to left axilla",
        "s1_s2_status": "Soft S1 obscured by regurgitant jet; prominent S3 gallop audible in early diastole",
        "triage_urgency": "Urgent",
        "referral_action": "Urgent Comprehensive Transthoracic Echocardiogram & Heart Failure clinic review within 48-72 hours."
      },
      "prescriptions": [
        {
          "drug_id": "sacubitril_valsartan",
          "dose": "49/51 mg BID",
          "route": "Oral",
          "prescriber": "Cardiology Dept"
        },
        {
          "drug_id": "spironolactone",
          "dose": "25 mg daily",
          "route": "Oral",
          "prescriber": "Cardiology Dept"
        },
        {
          "drug_id": "carvedilol",
          "dose": "12.5 mg BID",
          "route": "Oral",
          "prescriber": "Cardiology Dept"
        },
        {
          "drug_id": "furosemide",
          "dose": "40 mg BID",
          "route": "Oral",
          "prescriber": "Cardiology Dept"
        },
        {
          "drug_id": "ibuprofen",
          "dose": "600 mg TID PRN",
          "route": "Oral (Self-purchased OTC for knee osteoarthritis)",
          "prescriber": "Self / Over-The-Counter"
        },
        {
          "drug_id": "potassium_chloride",
          "dose": "20 mEq daily",
          "route": "Oral",
          "prescriber": "Primary Care Clinic"
        }
      ],
      "collision_alerts": [
        "COL-009",
        "COL-010",
        "COL-015"
      ],
      "primary_risk_flag": "Extreme Hyperkalemia & Acute Renal Failure Hazard (MRA + ARNI + KCl + NSAID)",
      "physician_notes": "Patient started self-medicating with Ibuprofen 600mg TID for knee pain 10 days ago, while taking Spironolactone and Potassium supplements concurrently. Serum K+ is at high risk of fatal elevation."
    },
    {
      "id": "CASE-102",
      "patient_name": "Eleanor Vance",
      "age": 74,
      "gender": "Female",
      "mrn": "CS-783109",
      "admission_date": "2026-09-17",
      "presenting_complaint": "Recurrent lightheadedness, near-syncope while climbing stairs, and angina on exertion.",
      "clinical_history": "Known calcific aortic valve disease, Permanent Atrial Fibrillation, prior transient ischemic attack (2024), Hypertension.",
      "vitals": {
        "heart_rate": 72,
        "blood_pressure": "112/82 mmHg",
        "o2_sat": "97% on room air",
        "respiratory_rate": 16
      },
      "echo_preset": {
        "preset_id": "preserved_as",
        "title": "Concentric LV Hypertrophy with Preserved LVEF & Calcified Aortic Valve",
        "target_ef": 58.2,
        "edv_ml": 115,
        "esv_ml": 48,
        "stroke_volume_ml": 67,
        "cardiac_output_lpm": 4.82,
        "classification": "Normal (Preserved Systolic Function)",
        "wall_motion": "Concentric hypertrophy, preserved global radial contractility",
        "mitral_inflow": "Impaired relaxation (Grade I diastolic dysfunction)",
        "lvedd_mm": 45,
        "lvesd_mm": 28
      },
      "acoustic_preset": {
        "preset_id": "aortic_stenosis",
        "title": "Severe Aortic Stenosis (Harsh Ejection Systolic Murmur)",
        "condition": "Aortic Stenosis",
        "timing": "Midsystolic Crescendo-Decrescendo",
        "frequency_band": "Harsh, low-to-medium frequency diamond murmur (100 - 350 Hz)",
        "intensity": "Grade 4/6 with palpable systolic thrill",
        "location": "2nd right intercostal space with radiation to bilateral carotid arteries",
        "s1_s2_status": "Single or paradoxically split S2; diminished aortic component A2",
        "triage_urgency": "Emergency / Critical",
        "referral_action": "Emergent Heart Valve Team evaluation for Transcatheter Aortic Valve Implantation (TAVI) or Surgical AVR; strict warning against vasodilators."
      },
      "prescriptions": [
        {
          "drug_id": "warfarin",
          "dose": "4 mg daily (INR target 2.0-3.0)",
          "route": "Oral",
          "prescriber": "Anticoagulation Clinic"
        },
        {
          "drug_id": "aspirin",
          "dose": "81 mg daily",
          "route": "Oral",
          "prescriber": "Primary Care"
        },
        {
          "drug_id": "metoprolol_succinate",
          "dose": "50 mg daily",
          "route": "Oral",
          "prescriber": "Cardiology"
        },
        {
          "drug_id": "clarithromycin",
          "dose": "500 mg BID (day 3 of 7 for bronchitis)",
          "route": "Oral",
          "prescriber": "Urgent Care Clinic"
        }
      ],
      "collision_alerts": [
        "COL-004",
        "COL-002"
      ],
      "primary_risk_flag": "Major Hemorrhage (Warfarin + Aspirin) & Arrhythmia/CYP3A4 Inhibition (Clarithromycin)",
      "physician_notes": "Symptomatic severe aortic stenosis (syncope + angina triad) mandates urgent valve intervention. Urgent care prescribed Clarithromycin which inhibits Warfarin clearance and prolongs QT. Dual antithrombotic therapy confers unacceptably high intracranial bleeding hazard."
    },
    {
      "id": "CASE-103",
      "patient_name": "Marcus Aurelius Thorne",
      "age": 58,
      "gender": "Male",
      "mrn": "CS-415892",
      "admission_date": "2026-09-19",
      "presenting_complaint": "Sudden onset rapid palpitations, presyncope, and chest tightness lasting 45 minutes.",
      "clinical_history": "Paroxysmal Atrial Fibrillation with rapid ventricular response, prior catheter ablation (2023), non-obstructive coronary disease.",
      "vitals": {
        "heart_rate": 114,
        "blood_pressure": "108/68 mmHg",
        "o2_sat": "96% on room air",
        "respiratory_rate": 18
      },
      "echo_preset": {
        "preset_id": "moderate_dysfunction",
        "title": "Mild LV Dilation with Moderately Reduced Ejection Fraction",
        "target_ef": 36.4,
        "edv_ml": 162,
        "esv_ml": 103,
        "stroke_volume_ml": 59,
        "cardiac_output_lpm": 6.72,
        "classification": "Moderately Reduced",
        "wall_motion": "Hypokinesia of inferior and posterior walls",
        "mitral_inflow": "Elevated filling pressure with left atrial volume index 44 mL/m2",
        "lvedd_mm": 56,
        "lvesd_mm": 44
      },
      "acoustic_preset": {
        "preset_id": "aortic_regurg",
        "title": "Aortic Regurgitation (Early Diastolic Decrescendo Murmur)",
        "condition": "Aortic Regurgitation",
        "timing": "Early Diastolic Decrescendo",
        "frequency_band": "High-pitched blowing murmur (180 - 500 Hz)",
        "intensity": "Grade 2/6",
        "location": "3rd left intercostal space (Erb's point) with patient leaning forward in expiration",
        "s1_s2_status": "Accentuated A2; wide pulse pressure (40 mmHg) with peripheral bounding pulses",
        "triage_urgency": "Urgent",
        "referral_action": "Schedule Elective Valvular Echocardiography with regurgitant volume quantification and aortic root dimensions."
      },
      "prescriptions": [
        {
          "drug_id": "amiodarone",
          "dose": "200 mg daily",
          "route": "Oral",
          "prescriber": "Electrophysiologist"
        },
        {
          "drug_id": "azithromycin",
          "dose": "500 mg day 1, 250 mg days 2-5 (for sinusitis)",
          "route": "Oral",
          "prescriber": "Walk-In Clinic"
        },
        {
          "drug_id": "apixaban",
          "dose": "5 mg BID",
          "route": "Oral",
          "prescriber": "Electrophysiologist"
        },
        {
          "drug_id": "citalopram",
          "dose": "20 mg daily",
          "route": "Oral",
          "prescriber": "Psychiatry"
        }
      ],
      "collision_alerts": [
        "COL-001",
        "COL-003"
      ],
      "primary_risk_flag": "Fatal Torsades de Pointes Risk (Amiodarone + Azithromycin + Citalopram Triple QT prolonging agents)",
      "physician_notes": "CRITICAL PHARMACOVIGILANCE HAZARD: Patient is taking three potent hERG potassium channel blocking drugs simultaneously. Immediate ECG QTc measurement and discontinuation of Azithromycin & Citalopram required."
    },
    {
      "id": "CASE-104",
      "patient_name": "Samantha Wright",
      "age": 42,
      "gender": "Female",
      "mrn": "CS-109432",
      "admission_date": "2026-09-15",
      "presenting_complaint": "Annual executive cardiovascular health screening. Completely asymptomatic, active marathon runner.",
      "clinical_history": "No known cardiovascular disease. Mild family history of premature CAD (maternal uncle at age 62).",
      "vitals": {
        "heart_rate": 56,
        "blood_pressure": "118/74 mmHg",
        "o2_sat": "99% on room air",
        "respiratory_rate": 14
      },
      "echo_preset": {
        "preset_id": "normal_echo",
        "title": "Vigorous Normal Biventricular Systolic Function",
        "target_ef": 64.8,
        "edv_ml": 128,
        "esv_ml": 45,
        "stroke_volume_ml": 83,
        "cardiac_output_lpm": 4.65,
        "classification": "Normal (Optimal Cardiac Performance)",
        "wall_motion": "Homogeneous hyperdynamic symmetric concentric wall thickening",
        "mitral_inflow": "Normal young adult filling pattern (E/A ratio 1.6)",
        "lvedd_mm": 47,
        "lvesd_mm": 29
      },
      "acoustic_preset": {
        "preset_id": "normal_heart_sounds",
        "title": "Normal Heart Sounds (Physiological S1 & S2 Lub-Dub)",
        "condition": "Normal S1/S2 Lub-Dub",
        "timing": "Clear Physiological Intervals",
        "frequency_band": "Crisp acoustic valve closure impulses (S1: 30-100Hz, S2: 40-150Hz)",
        "intensity": "Normal physiological intensity",
        "location": "All four classical cardiac auscultation areas",
        "s1_s2_status": "Normal physiological split of S2 during inspiration; zero pathological murmurs, clicks, or rubs",
        "triage_urgency": "Routine",
        "referral_action": "No cardiology referral indicated. Routine annual preventive health maintenance."
      },
      "prescriptions": [
        {
          "drug_id": "empagliflozin",
          "dose": "10 mg daily (Metabolic optimization)",
          "route": "Oral",
          "prescriber": "Endocrinology"
        }
      ],
      "collision_alerts": [],
      "primary_risk_flag": "No Drug Collision Detected (Optimal Safety Profile)",
      "physician_notes": "Exemplary cardiovascular baseline. Normal ejection fraction, pristine physiological auscultation, and no pharmacological hazards."
    }
  ]
};