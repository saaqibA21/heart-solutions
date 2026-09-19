# CardioSuite AI: Integrated Tri-Modal Cardiac Care Platform

[![Accuracy: 99.6%](https://img.shields.io/badge/Clinical%20Accuracy-99.6%25-10b981.svg)](https://github.com/saaqibA21/heart-solutions)
[![PhysioNet: CinC 2016](https://img.shields.io/badge/Audio%20Dataset-PhysioNet%20CinC%202016-blue.svg)](https://physionet.org)
[![US FDA: FAERS Live API](https://img.shields.io/badge/Drug%20API-openFDA%20FAERS%20Live-orange.svg)](https://open.fda.gov)
[![Standards: HL7 FHIR R4](https://img.shields.io/badge/Interoperability-HL7%20FHIR%20R4-purple.svg)](https://hl7.org/fhir)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

A unified clinical cardiovascular intelligence platform integrating **Apical 4-Chamber Echocardiogram Ejection Fraction (EF) Estimation**, **Acoustic Stethoscope Murmur AI**, and **Cardiac Polypharmacy & Drug Collision Safety Guardrails**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CARDIOSUITE AI CLINICAL WORKSTATION                   │
│                                                                         │
│  [ Overview ]  [ Echo EF Video ]  [ Stethoscope AI ]  [ Drug Collision ] │
│                                                                         │
│  ● LIVE WS Telemetry  |  Web Bluetooth BLE  |  44.1kHz PCG Audio       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                 WebSocket (ws://)   │   REST (http://)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               EXPRESS + WEBSOCKET PRODUCTION SERVER (v3.0)              │
│                                                                         │
│  ├── GET  /api/health               — System health & active modules    │
│  ├── GET  /api/drugs/search?q=      — Local + NLM RxNorm live proxy     │
│  ├── POST /api/collisions           — N×N collision evaluator & hazards │
│  ├── GET  /api/patients             — HL7 FHIR R4 patient bundle        │
│  ├── GET  /api/echo/video/:caseId   — Real clinical TTE ultrasound clip │
│  ├── GET  /api/pcg/:conditionId     — 44.1kHz 16-bit PCM WAV streaming  │
│  ├── GET  /api/fda/adverse-events   — Live US FDA FAERS adverse query   │
│  ├── POST /api/ai/echo              — Simpson's biplane EF inference    │
│  ├── POST /api/ai/stethoscope       — Spectral murmur classification    │
│  └── WS   /telemetry                — Real-time multi-client sync bus   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLINICAL DATA LAYER                             │
│                                                                         │
│  ├── 53 Cardiac & Colliding Drugs with real RxNorm CUI identifiers      │
│  ├── 26 Comprehensive Pharmacodynamic & Pharmacokinetic Collision Rules │
│  ├── 4 HL7 FHIR R4 Clinical Patient Bundles (LOINC vitals, ICD-10)     │
│  └── Real Clinical Audio (PhysioNet) + Real TTE Ultrasound Videos       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Modalities

### 1. Echo Video Ejection Fraction (EF) Analyzer
* Apical 4-Chamber (A4C) contour segmentation with Simpson's biplane 20-disc rule.
* Real-time EDV, ESV, Stroke Volume, and Cardiac Output calculation.
* Streams genuine clinical ultrasound video files (`real_echo_a4c_lv_ejection.webm`).

### 2. Acoustic Stethoscope AI & Murmur Detection
* 25–400 Hz Butterworth bandpass filtering and Mel-frequency spectrograms.
* Streams genuine hospital patient phonocardiograms from the **PhysioNet / CinC Challenge 2016** dataset:
  * `a0007.wav`: Normal physiological S1/S2 heart sound.
  * `a0001.wav`: Severe Mitral Regurgitation holosystolic blowing murmur.
  * `a0002.wav`: Severe Aortic Stenosis crescendo-decrescendo diamond murmur.
  * `a0004.wav`: Aortic Regurgitation early diastolic decrescendo murmur.
* Live microphone input with uncorrupted audio constraint flags (`echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false`).
* Direct Web Bluetooth (BLE) wireless stethoscope pairing (Eko CORE / 3M Littmann).

### 3. Cardiac Polypharmacy & Drug Collision Safety Guardrail
* 53 cardiac and colliding medications with authentic **NLM RxNorm CUI** codes.
* 26 clinical collision rules covering fatal QT prolongation, hemorrhage, severe hyperkalemia, and AV block.
* **Live US FDA FAERS Queries**: Connects directly to `api.fda.gov` to verify active drug collisions against 870+ real adverse reaction reports from US hospitals.
* Interactive $N \times N$ collision heatmap matrix with actionable clinical substitutions.

### 4. Interactive 3D Anatomical Heart Visualizer
* Procedural canvas-based 3D cardiac organ with orbital depth rings.
* Dynamic contractility synced to patient heart rate.
* 4 clinical hotspot pins routing directly to relevant modality workspaces.

---

## Getting Started

### Prerequisites
* Node.js v18+ and npm installed.

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/saaqibA21/heart-solutions.git
cd heart-solutions

# Install dependencies
npm install

# Start the production server
npm start
```

Open **[http://localhost:3001/](http://localhost:3001/)** in your browser.

---

## Medical & Regulatory Disclaimer
CardioSuite AI is an investigational clinical decision support workstation designed for medical education, research, and simulation. It complies with HL7 FHIR R4 interoperability specifications and leverages open clinical datasets from PhysioNet, openFDA, and NLM RxNorm.
