import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Search,
  Plus,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Zap,
  Eye,
  Edit3,
  HelpCircle,
  Play,
  Send,
  Sparkles,
  Volume2,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  Award,
  Cpu,
  Smartphone,
  CheckCheck
} from 'lucide-react';

// ==========================================
// 1. DATA MODELS & INTERFACES
// ==========================================

export interface SafetyQuestion {
  id: string;
  moduleId: 'MOD-01' | 'MOD-02' | 'MOD-03';
  moduleName: string;
  questionNumber: number;
  questionText: string;
  questionTextHindi: string;
  questionTextSantali: string;
  questionType: 'Scenario MCQ' | 'Image-based MCQ' | 'Safety procedure MCQ' | 'Visual identification' | 'AR decision question';
  options: {
    id: string;
    text: string;
    textHindi: string;
    textSantali: string;
    isCorrect: boolean;
    isHazardous?: boolean;
  }[];
  correctAnswerText: string;
  marks: number; // Always 20
  hasAudio: boolean;
  audioLanguages: ('EN' | 'HI' | 'SAT')[];
  safetyValidation: 'VALIDATED' | 'REVIEW_REQUIRED';
  safetyValidationNotes: string;
  status: 'Published' | 'Draft' | 'Under Review';
  arActionMapping?: string;
}

export interface TrainingModuleRecord {
  id: 'MOD-01' | 'MOD-02' | 'MOD-03';
  code: string;
  name: string;
  scenarioTitle: string;
  hazardType: string;
  domain: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badgeColor: string;
  questionsCount: number; // 5
  marksPerQuestion: number; // 20
  totalMarks: number; // 100
  passMark: number; // 60
  passPercentage: number; // 60%
  languages: string[];
  arStatus: 'AR Ready' | 'Compiling' | 'Draft';
  arEngine: string;
  arAssets: string[];
  status: 'Active' | 'Under Revision' | 'Draft';
  difficulty: 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  learningObjectives: string[];
  requiredSafetyActions: string[];
  criticalRules: string[];
  offlinePackageStatus: string;
  targetRoles: string[];
  aiSafetyScore: number;
}

// ==========================================
// 2. AUTHORITATIVE 3-MODULE DATASET (60% PASS MARK)
// ==========================================

export const AUTHORITATIVE_MODULES: TrainingModuleRecord[] = [
  {
    id: 'MOD-01',
    code: 'MOD-01-FIRE',
    name: 'Fire Safety & Extinguisher',
    scenarioTitle: 'Conveyor Belt Friction Ignition & Deluge Emergency Suppression',
    hazardType: 'Combustible Coal Dust & Conveyor Friction Fire',
    domain: 'Fire & Emergency Response',
    icon: Flame,
    iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    questionsCount: 5,
    marksPerQuestion: 20,
    totalMarks: 100,
    passMark: 60,
    passPercentage: 60,
    languages: ['EN', 'HI', 'SAT'],
    arStatus: 'AR Ready',
    arEngine: 'Unity 2023.3 LTS + ARCore 2.4 (6DoF Optical Tracking)',
    arAssets: [
      'extinguisher_abc_drypowder_v2.glb',
      'deluge_valve_actuator_rig.glb',
      'thermal_gradient_particle_fx.unitypackage',
      'underground_conveyor_transfer_bay.mesh'
    ],
    status: 'Active',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    description: 'Practical procedural training in early-stage conveyor friction fire suppression, rapid emergency stop pull-wire actuation, selection of non-conductive extinguishing agents, and upwind tactical positioning.',
    learningObjectives: [
      'Identify fire classifications (Class A solid, Class B flammable liquids, Electrical) under DGMS CMR 2017.',
      'Execute the PASS sequence (Pull pin, Aim nozzle, Squeeze handle, Sweep base) within 15 seconds.',
      'Mandatory selection of Dry Chemical Powder or CO2 for energized hazards — zero water application.',
      'Maintain continuous upwind positioning to prevent smoke inhalation and heat flashover.'
    ],
    requiredSafetyActions: [
      'Emergency pull-wire stop trip within 8 seconds of smoke detection',
      'Manual deluge valve release valve lock verification',
      'Discharge extinguisher strictly at the burning coal base (not flame crest)',
      'Radio broadcast to Surface Control Station with conveyor chainage location'
    ],
    criticalRules: [
      'CR-F01: Strictly prohibited to apply water on energized electrical drives or switchgear.',
      'CR-F02: Must remain upwind in intake air current; never stand in the return air smoke plume.',
      'CR-F03: Maintain minimum 2.5-meter standoff distance from pressurized extinguisher discharge.'
    ],
    offlinePackageStatus: 'Mesh Synchronized (420 KB Offline Bundle Cached)',
    targetRoles: ['Conveyor Attendant', 'Shaft Incline Patrol', 'Safety Steward', 'Belt Splicer'],
    aiSafetyScore: 98.4
  },
  {
    id: 'MOD-02',
    code: 'MOD-02-GAS',
    name: 'Gas Leak & Lockout Tagout',
    scenarioTitle: 'Methane Ingress Blind Heading & Pneumatic/Mechanical Valve LOTO',
    hazardType: 'Methane (CH4 > 1.0%), Carbon Monoxide & Stored Pressure',
    domain: 'Gas Leak & Confined Space',
    icon: Wind,
    iconColor: 'text-sky-600 bg-sky-50 border-sky-200',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    questionsCount: 5,
    marksPerQuestion: 20,
    totalMarks: 100,
    passMark: 60,
    passPercentage: 60,
    languages: ['EN', 'HI', 'SAT'],
    arStatus: 'AR Ready',
    arEngine: 'Unity 2023.3 LTS + ARCore 2.4 (Optical Gas Shader Simulation)',
    arAssets: [
      'multigas_detector_sensor_probe.glb',
      'scsr_oxygen_pack_donning_rig.glb',
      'loto_heavy_steel_hasp_keyed.glb',
      'pneumatic_isolation_blind_valve.glb'
    ],
    status: 'Active',
    difficulty: 'Advanced',
    durationMinutes: 20,
    description: 'Immersive simulation on responding to underground methane ingress, rapid SCSR donning protocol, zero-ignition discipline in blind headings, and multi-lock hasp isolation on mechanical gas lines.',
    learningObjectives: [
      'Accurate bump-test and reading verification on optical multi-gas detectors.',
      'Immediate SCSR oxygen pack donning under 20 seconds with airtight noseclip seal.',
      'Zero-tolerance electrical switching or friction sparking when CH4 exceeds 1.0%.',
      'Execution of 5-point Lockout/Tagout on hazardous pressure lines with individual safety padlocks.'
    ],
    requiredSafetyActions: [
      'Continuous acoustic monitor confirmation before entering crosscuts',
      'SCSR hood and oxygen canister ignition pin pull within 20 seconds',
      'Bleed valve residual pressure release before flange loosening',
      'Personal padlock affixation on master lockout hasp with danger tag'
    ],
    criticalRules: [
      'CR-G01: Evacuate immediately if CH4 exceeds 1.0% or CO exceeds 50 ppm.',
      'CR-G02: Never re-enter unventilated blind heading without auxiliary fan confirmation.',
      'CR-G03: Each authorized technician must retain their own exclusive padlock key.'
    ],
    offlinePackageStatus: 'Mesh Synchronized (510 KB Offline Bundle Cached)',
    targetRoles: ['Continuous Miner Operator', 'Ventilation Officer', 'Mining Sirdar', 'Mechanical Fitter'],
    aiSafetyScore: 99.1
  },
  {
    id: 'MOD-03',
    code: 'MOD-03-ELEC',
    name: 'Electrical Safety & Zero Energy',
    scenarioTitle: '3.3kV Substation Isolation, Live-Dead-Live & Residual Earth Discharge',
    hazardType: 'High-Voltage Arc Flash & Stored Capacitive Energy',
    domain: 'LOTO / Electrical Safety',
    icon: Zap,
    iconColor: 'text-amber-500 bg-amber-50 border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    questionsCount: 5,
    marksPerQuestion: 20,
    totalMarks: 100,
    passMark: 60,
    passPercentage: 60,
    languages: ['EN', 'HI', 'SAT'],
    arStatus: 'AR Ready',
    arEngine: 'Unity 2023.3 LTS + ARCore 2.4 (Voltmeter Volumetric Arc Rig)',
    arAssets: [
      'high_voltage_3kv_breaker_truck.glb',
      'calibrated_live_dead_live_meter.glb',
      'insulated_grounding_discharge_rod.glb',
      'category_4_arc_flash_shield.glb'
    ],
    status: 'Active',
    difficulty: 'Advanced',
    durationMinutes: 20,
    description: 'Rigorous high-voltage electrical safety procedure: verifying visual disconnect air gaps, executing the statutory Live-Dead-Live meter verification, discharge grounding, and zero energy certification.',
    learningObjectives: [
      'Execute statutory 3-step Live-Dead-Live voltmeter verification without step omission.',
      'Discharge hazardous capacitive stored energy using insulated grounding trucks.',
      'Enforce personal lock and tag on circuit breaker racking mechanisms.',
      'Wear Category 4 (40 cal/cm²) Arc Flash PPE and blast face shield during rack-out.'
    ],
    requiredSafetyActions: [
      'Lockout permit cross-check with Chief Electrical Inspector protocol',
      'Breaker rack-out to disconnected position and shutter lock',
      'Live-Dead-Live test: Known live test -> Target bus test -> Known live confirmation',
      'Application of discharge earthing stick to busbars before conductor touch'
    ],
    criticalRules: [
      'CR-E01: Conductor touch strictly prohibited prior to voltmeter dead confirmation and earth grounding.',
      'CR-E02: Never use multimeters exceeding rated category or with damaged test leads.',
      'CR-E03: Never bypass substation interlocks or safety door ground switches.'
    ],
    offlinePackageStatus: 'Mesh Synchronized (460 KB Offline Bundle Cached)',
    targetRoles: ['Substation Electrician', 'Maintenance Fitter', 'Plant Technician', 'Electrical Sirdar'],
    aiSafetyScore: 97.8
  }
];

// ==========================================
// 3. AUTHORITATIVE 15-QUESTION BANK (5 / MODULE)
// ==========================================

export const INITIAL_QUESTION_BANK: SafetyQuestion[] = [
  // --- MODULE 01: Fire Safety & Extinguisher (5 Questions) ---
  {
    id: 'Q-MOD01-01',
    moduleId: 'MOD-01',
    moduleName: 'Fire Safety & Extinguisher',
    questionNumber: 1,
    questionText: 'When encountering a fire near a live electrical conveyor drive, which extinguishing agent is mandatory to prevent lethal electrocution?',
    questionTextHindi: 'बिजली के चालू कन्वेयर ड्राइव के पास आग लगने पर बिजली के झटके से बचने के लिए किस अग्निशामक का उपयोग अनिवार्य है?',
    questionTextSantali: 'ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱰᱨᱟᱭᱤᱵᱽ ᱴᱷᱮᱱ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱥᱟᱢᱟᱱ ᱞᱟᱹᱠᱛᱤᱭᱟᱱᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'Pressurized plain water stream', textHindi: 'दबावयुक्त सादा पानी की धार', textSantali: 'ᱪᱟᱯ ᱫᱟᱜ ᱫᱷᱟᱨᱟ', isCorrect: false, isHazardous: true },
      { id: 'B', text: 'CO2 (Carbon Dioxide) or Dry Chemical Powder (Non-conductive)', textHindi: 'CO2 या सूखा रासायनिक पाउडर (गैर-चालक)', textSantali: 'CO2 ᱟᱨᱵᱟᱝ ᱨᱚᱦᱚᱲ ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱜᱩᱸᱰᱟᱹ', isCorrect: true },
      { id: 'C', text: 'Aqueous Film Forming Foam (AFFF)', textHindi: 'एक्वियस फिल्म फार्मिंग फोम (AFFF)', textSantali: 'ᱯᱷᱮᱬ (Foam)', isCorrect: false },
      { id: 'D', text: 'Wet sand bucket applied directly to energized terminals', textHindi: 'गीली रेत की बाल्टी', textSantali: 'ᱞᱚᱦᱚᱫ ᱵᱟᱹᱞᱤ', isCorrect: false }
    ],
    correctAnswerText: 'CO2 (Carbon Dioxide) or Dry Chemical Powder (Non-conductive)',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Strictly enforces non-conductive suppression media for electrical hazards per DGMS CMR-2017.',
    status: 'Published',
    arActionMapping: 'Tool selection -> Holster CO2 extinguisher -> Point at electrical cabinet'
  },
  {
    id: 'Q-MOD01-02',
    moduleId: 'MOD-01',
    moduleName: 'Fire Safety & Extinguisher',
    questionNumber: 2,
    questionText: 'In the international PASS fire extinguisher operation standard, what does the letter "A" mandate the operator to do?',
    questionTextHindi: 'PASS अग्निशामक संचालन मानक में अक्षर "A" ऑपरेटर को क्या करने का निर्देश देता है?',
    questionTextSantali: 'PASS ᱱᱤᱭᱟᱹᱢ ᱨᱮ "A" ᱟᱠᱷᱚᱨ ᱫᱚ ᱪᱮᱫ ᱮ ᱢᱮᱱᱟ?',
    questionType: 'Visual identification',
    options: [
      { id: 'A', text: 'Aim the nozzle directly at the upper tips of the flames', textHindi: 'लपटों के सबसे ऊपरी सिरे पर निशाना लगाएं', textSantali: 'ᱥᱮᱸᱜᱮᱞ ᱪᱮᱛᱟᱱ ᱨᱮ ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ', isCorrect: false },
      { id: 'B', text: 'Aim the nozzle low, directly at the BASE of the fire', textHindi: 'नोजल को नीचे, सीधे आग के आधार (बेस) पर लक्षित करें', textSantali: 'ᱱᱚᱡᱚᱞ ᱫᱚ ᱞᱟᱛᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱵᱩᱰᱟᱹ ᱨᱮ ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ', isCorrect: true },
      { id: 'C', text: 'Activate the main emergency ventilation fan immediately', textHindi: 'मुख्य वेंटिलेशन पंखा चालू करें', textSantali: 'ᱢᱩᱬᱩᱛ ᱯᱷᱮᱱ ᱪᱟᱹᱞᱩᱭ ᱢᱮ', isCorrect: false },
      { id: 'D', text: 'Apply full throttle air blast into the burning coal', textHindi: 'हवा का तेज झोंका लगाएं', textSantali: 'ᱦᱚᱭ ᱮᱢᱟᱜ ᱢᱮ', isCorrect: false }
    ],
    correctAnswerText: 'Aim the nozzle low, directly at the BASE of the fire',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Prevents dangerous dispersion of burning fuel by aiming strictly at the fuel base.',
    status: 'Published',
    arActionMapping: 'AR Reticle alignment -> Base of virtual flame hitbox'
  },
  {
    id: 'Q-MOD01-03',
    moduleId: 'MOD-01',
    moduleName: 'Fire Safety & Extinguisher',
    questionNumber: 3,
    questionText: 'During a conveyor belt friction fire in an underground gallery, what is the FIRST priority safety action before deploying suppression media?',
    questionTextHindi: 'भूमिगत गैलरी में कन्वेयर बेल्ट में आग लगने पर शमन माध्यम लगाने से पहले पहली प्राथमिकता क्या है?',
    questionTextSantali: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜᱼᱟ?',
    questionType: 'Scenario MCQ',
    options: [
      { id: 'A', text: 'Pull the emergency trip-wire to stop the belt & radio Surface Control', textHindi: 'बेल्ट रोकने के लिए इमरजेंसी ट्रिप-वायर खींचें और कंट्रोल रूम को सूचित करें', textSantali: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱛᱟᱨ ᱚᱨ ᱠᱟᱛᱮ ᱵᱮᱞᱴ ᱛᱷᱩᱠᱟᱹᱢ ᱢᱮ ᱟᱨ ᱠᱚᱱᱴᱨᱚᱞ ᱨᱩᱢ ᱠᱷᱚᱵᱚᱨ ᱮᱢᱟᱭ ᱢᱮ', isCorrect: true },
      { id: 'B', text: 'Pour mineral oil on the drive pulley to reduce friction', textHindi: 'पुली पर तेल डालें', textSantali: 'ᱯᱩᱞᱤ ᱨᱮ ᱥᱩᱱᱩᱢ ᱫᱩᱞ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'C', text: 'Enter the return airway without breathing apparatus to check smoke density', textHindi: 'बिना श्वास उपकरण के रिटर्न एयरवे में जाएं', textSantali: 'ᱵᱤᱱᱟᱹ ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱛᱮ ᱫᱷᱩᱶᱟᱹ ᱧᱮᱞ ᱪᱟᱞᱟᱜ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Switch off all underground mine ventilation main fans immediately', textHindi: 'सभी मुख्य पंखे बंद कर दें', textSantali: 'ᱥᱟᱱᱟᱢ ᱯᱷᱮᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱜ ᱢᱮ', isCorrect: false }
    ],
    correctAnswerText: 'Pull the emergency trip-wire to stop the belt & radio Surface Control',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Correct mechanical shutdown stops fuel propagation along the decline airway.',
    status: 'Published',
    arActionMapping: 'Interact with AR pull-wire cord -> Red alarm trigger'
  },
  {
    id: 'Q-MOD01-04',
    moduleId: 'MOD-01',
    moduleName: 'Fire Safety & Extinguisher',
    questionNumber: 4,
    questionText: 'What is the mandatory airflow orientation when discharging a fire extinguisher in a ventilated mine airway?',
    questionTextHindi: 'हवादार खदान वायुमार्ग में अग्निशामक यंत्र का उपयोग करते समय हवा की अनिवार्य दिशा क्या होनी चाहिए?',
    questionTextSantali: 'ᱦᱚᱭ ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱡᱚᱦᱚᱜ ᱚᱠᱟ ᱥᱮᱫ ᱛᱤᱸᱜᱩ ᱦᱩᱭᱩᱜᱼᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'Stand UPWIND (air current at your back, blowing smoke away from you)', textHindi: 'हवा के अनुकूल (Upwind) खड़े हों ताकि धुआं आपसे दूर जाए', textSantali: 'ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱥᱮᱫ (Upwind) ᱛᱤᱸᱜᱩᱱ ᱢᱮ ᱡᱮᱢᱚᱱ ᱫᱷᱩᱶᱟᱹ ᱥᱟᱺᱜᱤᱧ ᱪᱟᱞᱟᱜ', isCorrect: true },
      { id: 'B', text: 'Stand DOWNWIND directly in the advancing toxic smoke plume', textHindi: 'धुएं के ठीक सामने (Downwind) खड़े हों', textSantali: 'ᱫᱷᱩᱶᱟᱹ ᱥᱟᱢᱟᱝ ᱨᱮ ᱛᱤᱸᱜᱩᱱ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'C', text: 'Lie flat between the conveyor idlers beneath the flames', textHindi: 'आग के नीचे लेट जाएं', textSantali: 'ᱥᱮᱸᱜᱮᱞ ᱞᱟᱛᱟᱨ ᱨᱮ ᱜᱤᱛᱤᱡ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Stand inside the auxiliary exhaust duct intake hood', textHindi: 'एग्जॉस्ट डक्ट के अंदर खड़े हों', textSantali: 'ᱰᱟᱠᱴ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱛᱤᱸᱜᱩᱱ ᱢᱮ', isCorrect: false }
    ],
    correctAnswerText: 'Stand UPWIND (air current at your back, blowing smoke away from you)',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Adheres to life safety positioning to avoid rapid asphyxiation from carbon monoxide.',
    status: 'Published',
    arActionMapping: 'Player spatial positioning relative to airflow vector'
  },
  {
    id: 'Q-MOD01-05',
    moduleId: 'MOD-01',
    moduleName: 'Fire Safety & Extinguisher',
    questionNumber: 5,
    questionText: 'Identify the statutory color coding band and classification symbol for an ABC Dry Powder Extinguisher.',
    questionTextHindi: 'ABC सूखा पाउडर अग्निशामक के लिए वैधानिक रंग कोडिंग बैंड और वर्गीकरण प्रतीक की पहचान करें।',
    questionTextSantali: 'ABC ᱨᱚᱦᱚᱲ ᱯᱟᱣᱰᱟᱨ ᱟᱹᱜᱽᱱᱤᱥᱟᱢᱟᱠ ᱨᱮᱭᱟᱜ ᱨᱚᱝ ᱟᱨ ᱪᱤᱱᱦᱟᱹ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    questionType: 'Image-based MCQ',
    options: [
      { id: 'A', text: 'Solid Signal Red cylinder with Cream band (Foam Spray)', textHindi: 'क्रीम बैंड (फोम स्प्रे)', textSantali: 'ᱠᱨᱤᱢ ᱵᱮᱱᱰ (Foam)', isCorrect: false },
      { id: 'B', text: 'Signal Red body with French BLUE color code band (ABC Powder)', textHindi: 'नीले (Blue) रंग का बैंड (ABC ड्राई पाउडर)', textSantali: 'ᱞᱤᱞ (Blue) ᱨᱚᱝ ᱨᱮᱭᱟᱜ ᱵᱮᱱᱰ (ABC Powder)', isCorrect: true },
      { id: 'C', text: 'Signal Red cylinder with Black band (Carbon Dioxide)', textHindi: 'काला बैंड (CO2)', textSantali: 'ᱦᱮᱸᱫᱮ ᱵᱮᱱᱰ (CO2)', isCorrect: false },
      { id: 'D', text: 'Bright Yellow container with Emerald Green label', textHindi: 'पीला कंटेनर', textSantali: 'ᱥᱟᱥᱟᱝ ᱰᱟᱵᱽᱵᱟ', isCorrect: false }
    ],
    correctAnswerText: 'Signal Red body with French BLUE color code band (ABC Powder)',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Matches IS 15683 and DGMS statutory equipment marking standards.',
    status: 'Published',
    arActionMapping: 'Visual texture inspection of 3D extinguisher asset'
  },

  // --- MODULE 02: Gas Leak & Lockout Tagout (5 Questions) ---
  {
    id: 'Q-MOD02-01',
    moduleId: 'MOD-02',
    moduleName: 'Gas Leak & Lockout Tagout',
    questionNumber: 1,
    questionText: 'When an underground multi-gas monitor sounds a continuous warble alarm for Methane (CH4 > 1.0%), what is the immediate statutory protocol?',
    questionTextHindi: 'जब भूमिगत मल्टी-गैस मॉनिटर मीथेन (CH4 > 1.0%) के लिए अलार्म बजाता है, तो तत्काल वैधानिक प्रोटोकॉल क्या है?',
    questionTextSantali: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ (CH4 > 1.0%) ᱰᱷᱮᱨ ᱞᱮᱱᱠᱷᱟᱱ ᱟᱞᱟᱨᱢ ᱥᱟᱰᱮ ᱡᱚᱦᱚᱜ ᱞᱚᱜᱚᱱ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
    questionType: 'AR decision question',
    options: [
      { id: 'A', text: 'Continue working until concentration reaches 2.5% LEL', textHindi: 'काम जारी रखें जब तक गैस 2.5% न हो जाए', textSantali: 'ᱠᱟᱹᱢᱤ ᱪᱟᱹᱞᱩ ᱫᱚᱦᱚᱭ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'B', text: 'Immediately de-energize machinery, don SCSR, and evacuate heading intake-way', textHindi: 'तुरंत मशीनों की बिजली काटें, SCSR पहनें और बाहर निकलें', textSantali: 'ᱞᱚᱜᱚᱱ ᱢᱟᱹᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱢᱮ, SCSR ᱦᱚᱨᱚᱜ ᱢᱮ ᱟᱨ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ', isCorrect: true },
      { id: 'C', text: 'Toggle auxiliary electrical fan switch on and off inside the face', textHindi: 'फेस के अंदर बिजली का स्विच ऑन-ऑफ करें', textSantali: 'ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱚᱱ-ᱚᱯᱷ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Ignite a flame safety lamp to manually burn off the accumulation', textHindi: 'माचिस जलाकर परीक्षण करें', textSantali: 'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱠᱟᱛᱮ ᱪᱮᱠ ᱢᱮ', isCorrect: false, isHazardous: true }
    ],
    correctAnswerText: 'Immediately de-energize machinery, don SCSR, and evacuate heading intake-way',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Prevents catastrophic fire damp explosion. Zero ignition source enforcement.',
    status: 'Published',
    arActionMapping: 'Kill power switch -> Don SCSR headgear -> Waypoint route'
  },
  {
    id: 'Q-MOD02-02',
    moduleId: 'MOD-02',
    moduleName: 'Gas Leak & Lockout Tagout',
    questionNumber: 2,
    questionText: 'What is the maximum permissible donning and sealing time for a Self-Contained Self-Rescuer (SCSR) upon toxic alarm trigger?',
    questionTextHindi: 'विषाक्त अलार्म बजने पर सेल्फ-कंटेन्ड सेल्फ-रेस्क्यूअर (SCSR) पहनने का अधिकतम अनुमेय समय क्या है?',
    questionTextSantali: 'SCSR ᱚᱠᱥᱤᱡᱚᱱ ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱨᱮᱭᱟᱜ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱰᱷᱮᱨ ᱚᱠᱛᱚ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱱᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'Under 20 SECONDS with nose clip securely clamped and sealed mouthpiece', textHindi: '20 सेकंड के भीतर (नाक की क्लिप और माउथपीस सील के साथ)', textSantali: '᱒᱐ ᱥᱮᱠᱮᱱᱰ ᱵᱷᱤᱛᱨᱤ ᱨᱮ (ᱢᱩᱸ ᱠᱞᱤᱯ ᱟᱨ ᱢᱚᱪᱟ ᱥᱤᱞ ᱥᱟᱶ)', isCorrect: true },
      { id: 'B', text: '90 seconds after resting on the heading bench', textHindi: '90 सेकंड बाद', textSantali: '᱙᱐ ᱥᱮᱠᱮᱱᱰ ᱛᱟᱭᱚᱢ', isCorrect: false },
      { id: 'C', text: '5 minutes once you reach the main shaft bottom station', textHindi: '5 मिनट में', textSantali: '᱕ ᱢᱤᱱᱤᱴ ᱨᱮ', isCorrect: false },
      { id: 'D', text: 'Only when breathing becomes completely impossible', textHindi: 'जब सांस रुकने लगे', textSantali: 'ᱡᱚᱠᱷᱚᱱ ᱥᱟᱦᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱩᱭᱩᱜ', isCorrect: false, isHazardous: true }
    ],
    correctAnswerText: 'Under 20 SECONDS with nose clip securely clamped and sealed mouthpiece',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: 20-second statutory benchmark under DGMS guidelines for chemical oxygen packs.',
    status: 'Published',
    arActionMapping: 'AR timer countdown -> Pin pull gesture -> Mouthpiece seal'
  },
  {
    id: 'Q-MOD02-03',
    moduleId: 'MOD-02',
    moduleName: 'Gas Leak & Lockout Tagout',
    questionNumber: 3,
    questionText: 'In Lockout/Tagout (LOTO) isolation on high-pressure methane drainage lines, who holds the exclusive key to the personal safety padlock?',
    questionTextHindi: 'लॉकआउट/टैगआउट (LOTO) में व्यक्तिगत सुरक्षा पैडलॉक की एकमात्र चाबी किसके पास होती है?',
    questionTextSantali: 'LOTO ᱨᱮ ᱱᱤᱡᱮᱨᱟᱜ ᱛᱟᱞᱟ ᱪᱟᱹᱵᱷᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱢᱩᱫᱽ ᱨᱮ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱛᱟᱦᱮᱸᱱᱟ?',
    questionType: 'Scenario MCQ',
    options: [
      { id: 'A', text: 'The shift supervisor on surface who retains a master override ring', textHindi: 'सतह पर शिफ्ट सुपरवाइजर के पास', textSantali: 'ᱥᱤᱯᱷᱴ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱡᱚᱨ ᱴᱷᱮᱱ', isCorrect: false },
      { id: 'B', text: 'The individual authorized technician performing the maintenance work', textHindi: 'रखरखाव कार्य करने वाला व्यक्तिगत अधिकृत तकनीशियन', textSantali: 'ᱠᱟᱹᱢᱤ ᱠᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱴᱷᱮᱱ ᱱᱤᱡᱮ', isCorrect: true },
      { id: 'C', text: 'The padlock is left unlocked with an informational tag only', textHindi: 'ताला खुला छोड़ दिया जाता है', textSantali: 'ᱛᱟᱞᱟ ᱡᱷᱤᱡ ᱜᱮ ᱛᱟᱦᱮᱸᱱᱟ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Stored on the common workshop pegboard for any team member', textHindi: 'वर्कशॉप बोर्ड पर लटका रहता है', textSantali: 'ᱠᱟᱹᱢᱤ ᱚᱲᱟᱜ ᱵᱳᱨᱰ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ', isCorrect: false }
    ],
    correctAnswerText: 'The individual authorized technician performing the maintenance work',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Single-worker, single-key isolation integrity principle strictly enforced.',
    status: 'Published',
    arActionMapping: 'Padlock placement on virtual hasp -> Key retain'
  },
  {
    id: 'Q-MOD02-04',
    moduleId: 'MOD-02',
    moduleName: 'Gas Leak & Lockout Tagout',
    questionNumber: 4,
    questionText: 'Which step is mandatory BEFORE unbolting a pressurized gas valve flange during a pipe replacement procedure?',
    questionTextHindi: 'पाइप बदलने के दौरान प्रेशराइज्ड गैस वाल्व फ्लैंज को खोलने से पहले कौन सा कदम अनिवार्य है?',
    questionTextSantali: 'ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱨᱮᱭᱟᱜ ᱵᱷᱟᱞᱵᱽ ᱡᱷᱤᱡ ᱢᱟᱲᱟᱝ ᱨᱮ ᱚᱠᱟ ᱠᱟᱹᱢᱤ ᱡᱟᱹᱨᱩᱲᱟ?',
    questionType: 'Visual identification',
    options: [
      { id: 'A', text: 'Loosen all flange bolts rapidly while pressure is still indicated on gauge', textHindi: 'दबाव रहते हुए ही सभी नट-बोल्ट ढीले करें', textSantali: 'ᱪᱟᱯ ᱛᱟᱦᱮᱸᱱ ᱨᱮᱜᱮ ᱱᱟᱴ ᱵᱳᱞᱴᱩ ᱡᱷᱤᱡ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'B', text: 'Close upstream valve, vent stored pressure via bleed valve & verify 0 PSI', textHindi: 'अपस्ट्रीम वाल्व बंद करें, ब्लीड वाल्व से दबाव निकालें और 0 PSI सत्यापित करें', textSantali: 'ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱦᱚᱭ ᱚᱰᱚᱠ ᱢᱮ ᱟᱨ ᱐ PSI ᱪᱮᱠ ᱢᱮ', isCorrect: true },
      { id: 'C', text: 'Strike the flange casing with a steel sledgehammer to release gasket seal', textHindi: 'हथौड़े से फ्लैंज पर वार करें', textSantali: 'ᱦᱟᱛᱩᱲᱤ ᱛᱮ ᱠᱩᱴᱟᱹᱢ ᱢᱮ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Sniff the joint perimeter with your nose to check for escaping odor', textHindi: 'नाक से सूंघकर परीक्षण करें', textSantali: 'ᱢᱩᱸ ᱛᱮ ᱥᱚᱸ ᱠᱟᱛᱮ ᱧᱮᱞ ᱢᱮ', isCorrect: false }
    ],
    correctAnswerText: 'Close upstream valve, vent stored pressure via bleed valve & verify 0 PSI',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Prevents high-pressure gas jet injection and projectile flange ejection.',
    status: 'Published',
    arActionMapping: 'Bleed valve rotation -> Pressure gauge to 0 -> Flange wrench'
  },
  {
    id: 'Q-MOD02-05',
    moduleId: 'MOD-02',
    moduleName: 'Gas Leak & Lockout Tagout',
    questionNumber: 5,
    questionText: 'Under DGMS Coal Mines Regulations 2017, what action is strictly forbidden when encountering a non-ventilated blind heading?',
    questionTextHindi: 'DGMS कोयला खान विनियम 2017 के तहत, गैर-हवादार ब्लाइंड हेडिंग मिलने पर क्या कार्रवाई सख्त वर्जित है?',
    questionTextSantali: 'DGMS ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱦᱚᱭ ᱵᱟᱝ ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱵᱞᱟᱭᱤᱱᱰ ᱦᱮᱰᱤᱝ ᱨᱮ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'Installing an illuminated Danger barricade at the heading entrance', textHindi: 'प्रवेश द्वार पर खतरा चेतावनी बोर्ड लगाना', textSantali: 'ᱵᱚᱞᱚᱱ ᱫᱩᱣᱟᱹᱨ ᱨᱮ ᱠᱷᱚᱛᱨᱟ ᱵᱳᱨᱰ ᱞᱟᱜᱟᱣ', isCorrect: false },
      { id: 'B', text: 'Entering past the danger fence without auxiliary fan ventilation active', textHindi: 'सहायक पंखे की पुष्टि के बिना खतरे के घेरे के पार प्रवेश करना', textSantali: 'ᱯᱷᱮᱱ ᱵᱟᱝ ᱪᱟᱹᱞᱩ ᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱ', isCorrect: true },
      { id: 'C', text: 'Testing gas concentrations from the fresh intake crosscut standoff position', textHindi: 'सुरक्षित दूरी से गैस परीक्षण करना', textSantali: 'ᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱜᱮᱥ ᱪᱮᱠ ᱢᱮ', isCorrect: false },
      { id: 'D', text: 'Reporting stagnant air immediately to the Shift Overman', textHindi: 'ओवरमैन को सूचना देना', textSantali: 'ᱚᱵᱷᱟᱨᱢᱮᱱ ᱠᱷᱚᱵᱚᱨ ᱮᱢ', isCorrect: false }
    ],
    correctAnswerText: 'Entering past the danger fence without auxiliary fan ventilation active',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Strict zero-entry protocol for stagnant/blackdamp blind headings.',
    status: 'Published',
    arActionMapping: 'Barricade fence placement -> Proximity warning audio'
  },

  // --- MODULE 03: Electrical Safety & Zero Energy (5 Questions) ---
  {
    id: 'Q-MOD03-01',
    moduleId: 'MOD-03',
    moduleName: 'Electrical Safety & Zero Energy',
    questionNumber: 1,
    questionText: 'What is the mandatory 3-step sequence for verifying Zero Energy State on 3.3kV switchgear before any physical contact?',
    questionTextHindi: 'शारीरिक संपर्क से पहले 3.3kV स्विचगियर पर शून्य ऊर्जा स्थिति को सत्यापित करने के लिए अनिवार्य 3-चरणीय क्रम क्या है?',
    questionTextSantali: '᱓.᱓kV ᱵᱤᱡᱽᱞᱤ ᱥᱟᱢᱟᱱ ᱡᱚᱴᱮᱫ ᱢᱟᱲᱟᱝ ᱨᱮ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱓ ᱫᱷᱟᱯ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'Single measurement on target circuit only with an uncalibrated multimeter', textHindi: 'केवल एक बार लक्ष्य सर्किट पर परीक्षण', textSantali: 'ᱢᱤᱫ ᱫᱷᱟᱣ ᱥᱩᱢᱩᱝ ᱪᱮᱠ', isCorrect: false },
      { id: 'B', text: 'Live-Dead-Live: Test known live source -> Test target circuit -> Re-test known live source', textHindi: 'Live-Dead-Live: ज्ञात लाइव स्रोत -> लक्षित सर्किट -> पुनः ज्ञात लाइव स्रोत परीक्षण', textSantali: 'Live-Dead-Live: ᱪᱟᱹᱞᱩ ᱞᱟᱭᱤᱱ -> ᱠᱟᱹᱢᱤ ᱞᱟᱭᱤᱱ -> ᱫᱚᱦᱲᱟ ᱪᱟᱹᱞᱩ ᱞᱟᱭᱤᱱ ᱴᱮᱥᱴ', isCorrect: true },
      { id: 'C', text: 'Briefly tap the busbar with the back of a standard leather work glove', textHindi: 'हाथ के पिछले हिस्से से छूकर देखें', textSantali: 'ᱛᱤ ᱛᱮ ᱡᱚᱴᱮᱫ ᱠᱟᱛᱮ ᱧᱮᱞ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Trust the visual indicator flag on the door without instrument testing', textHindi: 'बिना मीटर के केवल पैनल इंडिकेटर पर भरोसा करें', textSantali: 'ᱥᱩᱢᱩᱝ ᱞᱟᱭᱤᱴ ᱧᱮᱞ ᱠᱟᱛᱮ ᱯᱟᱹᱛᱭᱟᱹᱣ', isCorrect: false }
    ],
    correctAnswerText: 'Live-Dead-Live: Test known live source -> Test target circuit -> Re-test known live source',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Live-Dead-Live instrument proof is the universal statutory standard for electrical isolation.',
    status: 'Published',
    arActionMapping: 'Probe to Live Test Box -> Busbar Probe (0V) -> Live Test Box Proof'
  },
  {
    id: 'Q-MOD03-02',
    moduleId: 'MOD-03',
    moduleName: 'Electrical Safety & Zero Energy',
    questionNumber: 2,
    questionText: 'Why must a certified insulated grounding discharge rod or earthing truck be applied after racking out the 3.3kV vacuum breaker?',
    questionTextHindi: '3.3kV वैक्यूम ब्रेकर को बाहर निकालने के बाद अर्थिंग डिस्चार्ज रॉड लगाना क्यों आवश्यक है?',
    questionTextSantali: '᱓.᱓kV ᱵᱨᱮᱠᱟᱨ ᱚᱰᱚᱠ ᱛᱟᱭᱚᱢ ᱟᱨᱛᱷᱤᱝ ᱨᱚᱰ ᱞᱟᱜᱟᱣ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
    questionType: 'Scenario MCQ',
    options: [
      { id: 'A', text: 'To keep the internal breaker contacts warm and prevent moisture buildup', textHindi: 'ब्रेकर को गर्म रखने के लिए', textSantali: 'ᱵᱨᱮᱠᱟᱨ ᱞᱚᱞᱚ ᱫᱚᱦᱚᱭ ᱞᱟᱹᱜᱤᱫ', isCorrect: false },
      { id: 'B', text: 'To safely drain residual capacitive stored energy & induce earth fault protection', textHindi: 'अवशिष्ट कैपेसिटिव ऊर्जा को सुरक्षित रूप से डिस्चार्ज करने के लिए', textSantali: 'ᱡᱚᱢᱟ ᱠᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱫᱟᱲᱮ (Capacitive energy) ᱦᱟᱥᱟ ᱨᱮ ᱤᱬᱤᱡ ᱞᱟᱹᱜᱤᱫ', isCorrect: true },
      { id: 'C', text: 'To bypass the transformer overcurrent protection circuitry', textHindi: 'ट्रांसफार्मर सुरक्षा को बायपास करने के लिए', textSantali: 'ᱴᱨᱟᱱᱥᱯᱷᱚᱨᱢᱟᱨ ᱵᱟᱭᱯᱟᱥ ᱞᱟᱹᱜᱤᱫ', isCorrect: false },
      { id: 'D', text: 'To calibrate the primary ammeter dials', textHindi: 'मीटर को कैलिब्रेट करने के लिए', textSantali: 'ᱢᱤᱴᱟᱨ ᱥᱟᱡᱟᱣ ᱞᱟᱹᱜᱤᱫ', isCorrect: false }
    ],
    correctAnswerText: 'To safely drain residual capacitive stored energy & induce earth fault protection',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Capacitive cables can retain lethal stored voltage hours after breaker opening.',
    status: 'Published',
    arActionMapping: 'Grounding stick touch to all 3 phases -> Earth clamp bolt'
  },
  {
    id: 'Q-MOD03-03',
    moduleId: 'MOD-03',
    moduleName: 'Electrical Safety & Zero Energy',
    questionNumber: 3,
    questionText: 'What is the minimum arc-flash PPE rating required when racking in/out a 3.3kV underground vacuum circuit breaker?',
    questionTextHindi: '3.3kV अंडरग्राउंड वैक्यूम सर्किट ब्रेकर को रैक इन/आउट करते समय न्यूनतम आर्क-फ्लैश पीपीई रेटिंग क्या है?',
    questionTextSantali: '᱓.᱓kV ᱥᱟᱨᱠᱤᱴ ᱵᱨᱮᱠᱟᱨ ᱨᱮ ᱠᱟᱹᱢᱤ ᱡᱚᱦᱚᱜ ᱚᱠᱟ Arc Flash PPE ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
    questionType: 'Visual identification',
    options: [
      { id: 'A', text: 'Standard cotton dust coat and clear safety glasses (1.2 cal/cm²)', textHindi: 'साधारण सूती कोट और चश्मा', textSantali: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱩᱨᱛᱟ ᱟᱨ ᱪᱚᱥᱢᱟ', isCorrect: false },
      { id: 'B', text: 'High-visibility safety vest with standard ear defenders only', textHindi: 'हाई-विजिबिलिटी वेस्ट', textSantali: 'ᱥᱩᱢᱩᱝ ᱵᱷᱮᱥᱴ (Vest)', isCorrect: false },
      { id: 'C', text: 'Category 4 Arc Flash Suit (40 cal/cm²) + Balaclava, Face Shield & Class 4 Insulated Gloves', textHindi: 'श्रेणी 4 आर्क फ्लैश सूट (40 cal/cm²) + फेस शील्ड और क्लास 4 दस्ताने', textSantali: 'Category 4 Arc Flash Suit (40 cal/cm²) + ᱢᱮᱫᱦᱟ ᱥᱤᱞᱰ ᱟᱨ ᱛᱤ-ᱢᱳᱡᱟ', isCorrect: true },
      { id: 'D', text: 'Welding leather apron with tinted goggles only', textHindi: 'लेदर एप्रन', textSantali: 'ᱪᱟᱢᱲᱟ ᱮᱯᱨᱚᱱ', isCorrect: false }
    ],
    correctAnswerText: 'Category 4 Arc Flash Suit (40 cal/cm²) + Balaclava, Face Shield & Class 4 Insulated Gloves',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Complies with NFPA 70E and DGMS Electrical Safety Circulars for high energy panels.',
    status: 'Published',
    arActionMapping: 'PPE inspection check -> Suit donning verification overlay'
  },
  {
    id: 'Q-MOD03-04',
    moduleId: 'MOD-03',
    moduleName: 'Electrical Safety & Zero Energy',
    questionNumber: 4,
    questionText: 'If an electrical arc fire erupts inside a live sub-station transformer chamber, which extinguishing medium is STRICTLY PROHIBITED?',
    questionTextHindi: 'यदि किसी सब-स्टेशन ट्रांसफार्मर में आग लग जाती है, तो किस शमन माध्यम का उपयोग सख्त वर्जित है?',
    questionTextSantali: 'ᱵᱤᱡᱽᱞᱤ ᱴᱨᱟᱱᱥᱯᱷᱚᱨᱢᱟᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱚᱠᱟ ᱡᱤᱱᱤᱥ ᱵᱮᱵᱷᱟᱨ ᱜᱮ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?',
    questionType: 'AR decision question',
    options: [
      { id: 'A', text: 'Pressurized water jet or water mist spray (Extreme electrocution danger)', textHindi: 'पानी की धार या पानी का स्प्रे (घातक करंट का खतरा)', textSantali: 'ᱫᱟᱜ ᱫᱷᱟᱨᱟ ᱟᱨᱵᱟᱝ ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣ (ᱜᱚᱡ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱛᱚᱨ)', isCorrect: true },
      { id: 'B', text: 'Fixed Carbon Dioxide (CO2) total flooding system', textHindi: 'CO2 गैस सिस्टम', textSantali: 'CO2 ᱜᱮᱥ ᱥᱤᱥᱴᱚᱢ', isCorrect: false },
      { id: 'C', text: 'ABC-rated dry chemical extinguishing agent', textHindi: 'ABC सूखा रासायनिक पाउडर', textSantali: 'ABC ᱨᱚᱦᱚᱲ ᱯᱟᱣᱰᱟᱨ', isCorrect: false },
      { id: 'D', text: 'Clean chemical fire suppression agent (FE-36 / Novec 1230)', textHindi: 'क्लीन एजेंट', textSantali: 'ᱠᱞᱤᱱ ᱮᱡᱮᱱᱴ', isCorrect: false }
    ],
    correctAnswerText: 'Pressurized water jet or water mist spray (Extreme electrocution danger)',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Water is highly conductive; water application causes instant flashover and electrocution.',
    status: 'Published',
    arActionMapping: 'Danger alert on water hose selection -> Safe CO2 lever'
  },
  {
    id: 'Q-MOD03-05',
    moduleId: 'MOD-03',
    moduleName: 'Electrical Safety & Zero Energy',
    questionNumber: 5,
    questionText: 'When multiple maintenance technicians work simultaneously on a shared high-voltage conveyor drive, what guarantees personal lockout security?',
    questionTextHindi: 'जब कई तकनीशियन एक साथ हाई-वोल्टेज कन्वेयर ड्राइव पर काम करते हैं, तो क्या व्यक्तिगत सुरक्षा की गारंटी देता है?',
    questionTextSantali: 'ᱟᱭᱢᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱠᱟᱹᱢᱤ ᱡᱚᱦᱚᱜ ᱚᱠᱟ ᱡᱤᱱᱤᱥ ᱥᱟᱱᱟᱢ ᱠᱚᱣᱟᱜ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱮᱢᱟᱭᱟ?',
    questionType: 'Safety procedure MCQ',
    options: [
      { id: 'A', text: 'A verbal agreement between workers that the shift leader will not re-energize', textHindi: 'आपसी मौखिक समझौता', textSantali: 'ᱢᱚᱪᱟ ᱨᱚᱯᱚᱲ', isCorrect: false },
      { id: 'B', text: 'A multi-lock scissor hasp with EACH worker affixing their OWN personal padlock & danger tag', textHindi: 'मल्टी-लॉक हैस्प जिस पर प्रत्येक कार्यकर्ता अपना ताला और टैग लगाए', textSantali: 'ᱢᱟᱞᱴᱤ-ᱞᱚᱠ ᱦᱮᱥᱯ ᱡᱟᱦᱟᱸ ᱨᱮ ᱡᱚᱛᱚ ᱦᱚᱲ ᱟᱯᱱᱟᱨᱟᱜ ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱠᱚ', isCorrect: true },
      { id: 'C', text: 'A single shared master lock with the key left sitting on top of the transformer', textHindi: 'ट्रांसफार्मर के ऊपर रखी एक ही चाबी', textSantali: 'ᱢᱤᱫᱴᱟᱝ ᱜᱮ ᱪᱟᱹᱵᱷᱤ ᱪᱮᱛᱟᱱ ᱨᱮ ᱫᱚᱦᱚ', isCorrect: false, isHazardous: true },
      { id: 'D', text: 'Sounding the conveyor horn for 2 seconds prior to reclosing breaker', textHindi: 'केवल 2 सेकंड हॉर्न बजाना', textSantali: '᱒ ᱥᱮᱠᱮᱱᱰ ᱦᱚᱨᱱ ᱵᱟᱡᱟᱣ', isCorrect: false }
    ],
    correctAnswerText: 'A multi-lock scissor hasp with EACH worker affixing their OWN personal padlock & danger tag',
    marks: 20,
    hasAudio: true,
    audioLanguages: ['EN', 'HI', 'SAT'],
    safetyValidation: 'VALIDATED',
    safetyValidationNotes: '✓ Safety Validated: Equipment cannot be re-energized until the final worker removes their individual lock.',
    status: 'Published',
    arActionMapping: 'Multi-hasp clamp -> Snap 4 padlocks -> Verify locked interlock'
  }
];

// ==========================================
// 4. CONNECTED MCP TOOLS SPECIFICATION
// ==========================================

export const CONNECTED_MCP_TOOLS = [
  {
    name: 'Safety Knowledge MCP',
    endpoint: 'mcp://symbiomine.kernel/safety-knowledge',
    status: 'Operational (Policy Locked)',
    capabilities: 'DGMS Coal Mines Regs 2017, IS 15683, NFPA 70E, Mine Circulars 2026',
    callsCount: 1240,
    latencyMs: 14
  },
  {
    name: 'Assessment MCP',
    endpoint: 'mcp://symbiomine.kernel/assessment-engine',
    status: 'Operational (Active)',
    capabilities: '5 Questions/Module, 20 Marks/Q, 60% Passing Gate, Seed Nonce Verification',
    callsCount: 3820,
    latencyMs: 9
  },
  {
    name: 'Worker Performance MCP',
    endpoint: 'mcp://symbiomine.kernel/worker-performance',
    status: 'Operational (Active)',
    capabilities: 'Roster Competency Tracking, Skill Gap Ingestion, 3-Attempt Remediation Protocol',
    callsCount: 890,
    latencyMs: 18
  },
  {
    name: 'AR Scenario MCP',
    endpoint: 'mcp://symbiomine.kernel/ar-scenarios',
    status: 'Operational (Active)',
    capabilities: 'Unity ARCore 6DoF Mesh Generation, Procedural Hazard Seeding, Asset Integrity Check',
    callsCount: 1560,
    latencyMs: 22
  },
  {
    name: 'Certificate Verification MCP',
    endpoint: 'mcp://symbiomine.kernel/certificate-audit',
    status: 'Operational (Active)',
    capabilities: 'Ed25519 Cryptographic Signatures, SHA-256 Ledger Audit, QR Code Verification',
    callsCount: 640,
    latencyMs: 12
  },
  {
    name: 'Analytics MCP',
    endpoint: 'mcp://symbiomine.kernel/psychometrics',
    status: 'Operational (Active)',
    capabilities: 'Item Discrimination Index, Distractor Ambiguity Detection, Multilingual Alignment',
    callsCount: 450,
    latencyMs: 16
  }
];

// ==========================================
// 5. MAIN COMPONENT: ScenarioManagementView
// ==========================================

export const ScenarioManagementView: React.FC = () => {
  const { setActiveTab, assignTraining, workers } = useApp();

  // Active view tabs
  const [activeViewTab, setActiveViewTab] = useState<'modules' | 'questions' | 'ai-governance' | 'validator'>('modules');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedValidationFilter, setSelectedValidationFilter] = useState<string>('All');

  // Drawer & Modal States
  const [selectedModuleForDrawer, setSelectedModuleForDrawer] = useState<TrainingModuleRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isArPreviewOpen, setIsArPreviewOpen] = useState(false);
  const [previewingModule, setPreviewingModule] = useState<TrainingModuleRecord | null>(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isCreateScenarioModalOpen, setIsCreateScenarioModalOpen] = useState(false);
  const [isAiReportModalOpen, setIsAiReportModalOpen] = useState(false);
  const [selectedReportModule, setSelectedReportModule] = useState<TrainingModuleRecord | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchModule, setDispatchModule] = useState<TrainingModuleRecord | null>(null);
  const [selectedWorkerForDispatch, setSelectedWorkerForDispatch] = useState<string>('W-104');

  // Question Bank State
  const [questionBank] = useState<SafetyQuestion[]>(INITIAL_QUESTION_BANK);
  const [editingQuestion, setEditingQuestion] = useState<SafetyQuestion | null>(null);

  // Audio Playback Simulation
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // AI Assistant In-Page State
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0);
  const [aiPendingRecommendations, setAiPendingRecommendations] = useState<any[]>([
    {
      id: 'REC-01',
      moduleId: 'MOD-01',
      moduleName: 'Fire Safety & Extinguisher',
      targetQuestionId: 'Q-MOD01-01',
      type: 'DISTRACTOR_SAFETY_IMPROVEMENT',
      title: 'Clarify non-conductive distractor wording in Santali audio',
      description: 'The Santali audio translation for Option B in Question 1 should explicitly use the word "ᱵᱤᱡᱽᱞᱤ ᱵᱟᱝ ᱪᱟᱞᱟᱜ" (non-conductive) to avoid confusion with general chemical extinguishers.',
      originalText: 'ᱨᱚᱦᱚᱲ ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱜᱩᱸᱰᱟᱹ',
      suggestedText: 'ᱵᱤᱡᱽᱞᱤ ᱵᱟᱝ ᱪᱟᱞᱟᱜ ᱨᱚᱦᱚᱲ ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱜᱩᱸᱰᱟᱹ (CO2 & Dry Powder)',
      status: 'REQUIRES_APPROVAL',
      safetyImpact: 'High (Prevents electrocution misconception)',
      confidenceScore: 99.4
    },
    {
      id: 'REC-02',
      moduleId: 'MOD-02',
      moduleName: 'Gas Leak & Lockout Tagout',
      targetQuestionId: 'Q-MOD02-02',
      type: 'PROCEDURAL_CLARIFICATION',
      title: 'Add visual indicator requirement to SCSR 20s test',
      description: 'Add positive visual confirmation of the green breathing bag inflation indicator inside the AR donning sequence to reinforce chemical oxygen generation verification.',
      originalText: 'Nose clip clamped and mouthpiece sealed',
      suggestedText: 'Nose clip clamped, mouthpiece sealed & green breathing bag inflation verified',
      status: 'REQUIRES_APPROVAL',
      safetyImpact: 'Medium (Enhanced procedural fidelity)',
      confidenceScore: 98.2
    }
  ]);

  // Handle Audio Simulation
  const togglePlayAudio = (id: string, lang: 'EN' | 'HI' | 'SAT' = 'EN') => {
    if (playingAudioId === `${id}-${lang}`) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(`${id}-${lang}`);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 3500);
    }
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questionBank.filter(q => {
      const matchSearch =
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionTextHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.moduleName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (selectedModuleFilter !== 'All' && q.moduleId !== selectedModuleFilter) return false;
      if (selectedTypeFilter !== 'All' && q.questionType !== selectedTypeFilter) return false;
      if (selectedValidationFilter !== 'All' && q.safetyValidation !== selectedValidationFilter) return false;

      return true;
    });
  }, [questionBank, searchQuery, selectedModuleFilter, selectedTypeFilter, selectedValidationFilter]);

  // Open Drawer for Module
  const handleOpenDrawer = (mod: TrainingModuleRecord) => {
    setSelectedModuleForDrawer(mod);
    setIsDrawerOpen(true);
  };

  // Open AR Preview
  const handleOpenArPreview = (mod: TrainingModuleRecord) => {
    setPreviewingModule(mod);
    setIsArPreviewOpen(true);
  };

  // Open Dispatch Modal
  const handleOpenDispatch = (mod: TrainingModuleRecord) => {
    setDispatchModule(mod);
    setIsDispatchModalOpen(true);
  };

  // Confirm Dispatch
  const handleConfirmDispatch = () => {
    if (dispatchModule) {
      assignTraining(selectedWorkerForDispatch, dispatchModule.code, dispatchModule.name);
      setIsDispatchModalOpen(false);
      setActiveTab('remediation');
    }
  };

  // AI Recommendation Actions
  const handleApproveRecommendation = (recId: string) => {
    setAiPendingRecommendations(prev => prev.filter(r => r.id !== recId));
  };

  const handleRejectRecommendation = (recId: string) => {
    setAiPendingRecommendations(prev => prev.filter(r => r.id !== recId));
  };

  // Trigger Live AI Safety Analysis
  const handleRunAiAudit = () => {
    setAiAnalysisRunning(true);
    setAiAnalysisProgress(10);
    const interval = setInterval(() => {
      setAiAnalysisProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setAiAnalysisRunning(false);
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  return (
    <div className="w-full space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & MAIN ACTIONS                                              */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-amber-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                SAFETY SCENARIO MANAGEMENT
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage AR training scenarios, assessment questions, pass criteria, localization and AI-assisted safety content.
              </p>
            </div>
          </div>
        </div>

        {/* Right-side Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateScenarioModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>CREATE SCENARIO</span>
          </button>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsAddQuestionModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>ADD MCQ</span>
          </button>

          <button
            onClick={() => setActiveViewTab('ai-governance')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI SAFETY ASSISTANT</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 COMPACT KPI CARDS (STRICT 60% PASS MARK & 3 MODULES)                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Active Modules */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden min-h-[110px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              ACTIVE MODULES
            </span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">3</span>
            <span className="text-xs font-bold text-emerald-700 font-sans">Production Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Fire, Gas &amp; LOTO, Electrical Safety
          </p>
        </div>

        {/* KPI 2: Total Scenarios */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden min-h-[110px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              TOTAL SCENARIOS
            </span>
            <span className="p-1.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              <Smartphone className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">3</span>
            <span className="text-xs font-bold text-sky-700 font-sans">Unity ARCore</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            6DoF Surface Anchored &bull; LiteRT Edge
          </p>
        </div>

        {/* KPI 3: Total MCQs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden min-h-[110px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              TOTAL MCQs
            </span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">15</span>
            <span className="text-xs font-bold text-amber-700 font-sans">5 Questions / Module</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            20 Marks / Question &bull; 100 Marks Total
          </p>
        </div>

        {/* KPI 4: Pass Mark */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden min-h-[110px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              PASS MARK
            </span>
            <span className="p-1.5 rounded-md bg-slate-900 text-amber-400 border border-slate-800">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-800 font-mono">60%</span>
            <span className="text-xs font-bold text-slate-700 font-sans">60 / 100 Marks</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Synced with Worker Android App Gate
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS                                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveViewTab('modules')}
            className={`py-3.5 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'modules'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Active Modules ({AUTHORITATIVE_MODULES.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('questions')}
            className={`py-3.5 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'questions'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Question Bank ({questionBank.length})</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
              20 Marks / Q
            </span>
          </button>

          <button
            onClick={() => setActiveViewTab('ai-governance')}
            className={`py-3.5 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'ai-governance'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-500" />
            <span>AI Safety Assistant (MCP)</span>
            {aiPendingRecommendations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                {aiPendingRecommendations.length} Action Needed
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewTab('validator')}
            className={`py-3.5 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'validator'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety Content Validator</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
              DGMS 10-Point Rule
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mesh Sync v2.4.1 Active</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB 1: MODULE MANAGEMENT TABLE                                         */}
      {/* ========================================================================= */}
      {activeViewTab === 'modules' && (
        <div className="space-y-4">
          {/* Main Full-Width Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                  Safety Training Curriculum &amp; Scenario Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized directly with worker Android headsets and rugged mobile units.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
                  3 of 3 Active &bull; Pass Mark: 60%
                </span>
              </div>
            </div>

            <div className="table-container overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[1240px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-20 min-w-[70px]">MODULE</th>
                    <th className="py-3 px-4 min-w-[340px]">SCENARIO</th>
                    <th className="py-3 px-3 text-center min-w-[110px] whitespace-nowrap">MCQ</th>
                    <th className="py-3 px-3 text-center min-w-[90px] whitespace-nowrap">QUESTIONS</th>
                    <th className="py-3 px-3 text-center min-w-[80px] whitespace-nowrap">MARKS</th>
                    <th className="py-3 px-3 text-center min-w-[100px] whitespace-nowrap">PASS MARK</th>
                    <th className="py-3 px-3 text-center min-w-[130px] whitespace-nowrap">LANGUAGES</th>
                    <th className="py-3 px-3 text-center min-w-[120px] whitespace-nowrap">AR STATUS</th>
                    <th className="py-3 px-3 text-center min-w-[100px] whitespace-nowrap">STATUS</th>
                    <th className="py-3 px-4 text-right min-w-[430px] whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AUTHORITATIVE_MODULES.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Module Code */}
                        <td className="py-4 px-3.5 text-center">
                          <span className="font-mono font-black text-slate-900 text-sm bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                            {mod.id.replace('MOD-', '')}
                          </span>
                        </td>

                        {/* 2. Scenario Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg border shrink-0 ${mod.iconColor}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm block leading-snug">
                                {mod.name}
                              </span>
                              <span className="text-xs text-slate-500 block mt-0.5 leading-snug">
                                {mod.scenarioTitle}
                              </span>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.2 rounded border border-slate-200">
                                  {mod.code}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  {mod.domain} &bull; {mod.durationMinutes} min
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. MCQ */}
                        <td className="py-4 px-3 text-center whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded">
                            {mod.questionsCount} Questions
                          </span>
                        </td>

                        {/* 4. Questions */}
                        <td className="py-4 px-3 text-center whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {mod.questionsCount}
                          </span>
                        </td>

                        {/* 5. Marks */}
                        <td className="py-4 px-3 text-center whitespace-nowrap font-mono font-bold text-slate-900 text-xs">
                          {mod.totalMarks}
                        </td>

                        {/* 6. Pass Mark */}
                        <td className="py-4 px-3 text-center whitespace-nowrap font-mono font-black text-emerald-800 text-xs">
                          <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {mod.passPercentage}%
                          </span>
                        </td>

                        {/* 7. Languages */}
                        <td className="py-4 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              EN
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              HI
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              SAT
                            </span>
                            <span title="Audio stream included in all 3 languages">
                              <Volume2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                            </span>
                          </div>
                        </td>

                        {/* 8. AR Status */}
                        <td className="py-4 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-50 text-sky-800 border-sky-200">
                            <Smartphone className="w-3 h-3 text-sky-600" />
                            <span>{mod.arStatus}</span>
                          </span>
                        </td>

                        {/* 9. Status */}
                        <td className="py-4 px-3 text-center whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                            {mod.status}
                          </span>
                        </td>

                        {/* 10. Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap min-w-[430px]">
                          <div className="flex items-center justify-end gap-2 flex-nowrap">
                            <button
                              onClick={() => handleOpenDrawer(mod)}
                              className="px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              <span>VIEW</span>
                            </button>

                            <button
                              onClick={() => handleOpenDrawer(mod)}
                              className="px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              <span>EDIT</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedModuleFilter(mod.id);
                                setActiveViewTab('questions');
                              }}
                              className="px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>QUESTIONS</span>
                            </button>

                            <button
                              onClick={() => handleOpenArPreview(mod)}
                              className="px-2.5 py-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <Play className="w-3.5 h-3.5 text-sky-700 fill-current shrink-0" />
                              <span>AR PREVIEW</span>
                            </button>

                            <button
                              onClick={() => handleOpenDispatch(mod)}
                              className="px-3 py-1.5 text-xs font-bold text-amber-400 bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <Send className="w-3.5 h-3.5 shrink-0" />
                              <span>DISPATCH</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Statutory Baseline:</span>
                <span>All 3 modules enforce mandatory 60% pass threshold &bull; 5 MCQs &times; 20 Marks = 100 Marks</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-800 font-bold">DGMS Coal Mines Regulations 2017 Certified</span>
              </div>
            </div>
          </div>

          {/* Bottom Summary & Agent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Recent AI Safety Analysis Panel */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                    RECENT AI SAFETY ANALYSIS
                  </h3>
                </div>
                <button
                  onClick={handleRunAiAudit}
                  disabled={aiAnalysisRunning}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${aiAnalysisRunning ? 'animate-spin text-amber-600' : ''}`} />
                  <span>{aiAnalysisRunning ? `Analyzing ${aiAnalysisProgress}%...` : 'Run Live Safety Scan'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* Module 1 Report Item */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Fire Safety Question Bank</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        v2.4 Verified
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> 5 questions analyzed
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> 5 correct-answer mappings
                      </span>
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <AlertTriangle className="w-3 h-3" /> 1 visual distractor reviewed
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReportModule(AUTHORITATIVE_MODULES[0]);
                      setIsAiReportModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-md cursor-pointer transition-colors shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <span>VIEW REPORT</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Module 2 Report Item */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Gas Leak &amp; Lockout Tagout</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        100% Passed
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> 5 questions validated
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> Zero-ignition rule verified
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> SCSR 20s timegate approved
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReportModule(AUTHORITATIVE_MODULES[1]);
                      setIsAiReportModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-md cursor-pointer transition-colors shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <span>VIEW REPORT</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Module 3 Report Item */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Electrical Safety &amp; Zero Energy</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        100% Passed
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> 5 questions validated
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> Live-Dead-Live sequence verified
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" /> Zero water on 3.3kV verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReportModule(AUTHORITATIVE_MODULES[2]);
                      setIsAiReportModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-md cursor-pointer transition-colors shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <span>VIEW REPORT</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Architecture & Worker Sync Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                    WORKER ANDROID APP SYNC STATUS
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span><strong>Unified 3-Module Curriculum:</strong> Admin portal and worker app share the exact 3 core training modules.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span><strong>Strict 60% Passing Standard:</strong> Scores from on-device 5-MCQ assessments calculate towards the certified 60/100 requirement.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span><strong>Multilingual Voice Audio:</strong> Localized audio in English, Hindi, and Santali (Ol Chiki) stream directly to ear defenders.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-900 block font-sans">Mesh Node Sync State</span>
                  <span className="text-xs font-mono font-bold text-amber-950">Heading 12 Underground Substation &bull; 100% In-Sync</span>
                </div>
                <button
                  onClick={() => setActiveTab('sync-center')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                >
                  Sync Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: MCQ QUESTION MANAGEMENT (QUESTION BANK)                         */}
      {/* ========================================================================= */}
      {activeViewTab === 'questions' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4">
          {/* Header & Filter Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
                  Enterprise Question Bank ({filteredQuestions.length} Questions)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 Questions per module &bull; 20 Marks each &bull; 100 Total Marks &bull; Passing Mark: 60% (60/100)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddQuestionModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ ADD QUESTION</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold shrink-0">Module:</span>
                <select
                  value={selectedModuleFilter}
                  onChange={e => setSelectedModuleFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="All">All Modules (3)</option>
                  <option value="MOD-01">Module 01: Fire Safety & Extinguisher</option>
                  <option value="MOD-02">Module 02: Gas Leak & Lockout Tagout</option>
                  <option value="MOD-03">Module 03: Electrical Safety & Zero Energy</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold shrink-0">Type:</span>
                <select
                  value={selectedTypeFilter}
                  onChange={e => setSelectedTypeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="All">All Question Types</option>
                  <option value="Scenario MCQ">Scenario MCQ</option>
                  <option value="Image-based MCQ">Image-based MCQ</option>
                  <option value="Safety procedure MCQ">Safety procedure MCQ</option>
                  <option value="Visual identification">Visual identification</option>
                  <option value="AR decision question">AR decision question</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold shrink-0">Validation:</span>
                <select
                  value={selectedValidationFilter}
                  onChange={e => setSelectedValidationFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="VALIDATED">✓ SAFETY VALIDATED</option>
                  <option value="REVIEW_REQUIRED">⚠ REVIEW REQUIRED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Question List Accordion / Dense Cards */}
          <div className="p-4 sm:p-5 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-800">No Matching Questions</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Try changing the filters or search keywords.</p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors space-y-3"
                >
                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-white border border-slate-300 px-2 py-0.5 rounded">
                        {q.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded">
                        {q.moduleName}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {q.questionType}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {q.marks} Marks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {q.safetyValidation === 'VALIDATED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ SAFETY VALIDATED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>⚠ REVIEW REQUIRED</span>
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                        {q.status}
                      </span>
                    </div>
                  </div>

                  {/* Question Text (Multilingual) */}
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        <span className="text-slate-400 mr-1.5 font-mono">Q{q.questionNumber}.</span>
                        {q.questionText}
                      </h3>

                      {/* Audio Playback Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {(['EN', 'HI', 'SAT'] as const).map(lang => {
                          const isPlaying = playingAudioId === `${q.id}-${lang}`;
                          return (
                            <button
                              key={lang}
                              onClick={() => togglePlayAudio(q.id, lang)}
                              className={`px-2 py-1 rounded text-[10px] font-bold font-mono flex items-center gap-1 transition-colors cursor-pointer border ${
                                isPlaying
                                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>{lang}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hindi & Santali Translations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-slate-400 block">HINDI (HI):</span>
                        <p className="mt-0.5 text-[11px] leading-relaxed">{q.questionTextHindi}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold font-mono text-amber-700 block">SANTALI / OL CHIKI (SAT):</span>
                        <p className="mt-0.5 text-[11px] leading-relaxed font-sans">{q.questionTextSantali}</p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map(opt => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg text-xs border flex items-start gap-2.5 ${
                          opt.isCorrect
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-semibold'
                            : opt.isHazardous
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 font-mono ${
                            opt.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : opt.isHazardous
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="leading-snug">{opt.text}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-sans">{opt.textSantali}</p>
                        </div>
                        {opt.isCorrect && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase shrink-0">
                            CORRECT
                          </span>
                        )}
                        {opt.isHazardous && (
                          <span className="text-[10px] font-mono font-bold text-rose-700 uppercase shrink-0">
                            HAZARDOUS
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Validation Notes & Actions Footer */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{q.safetyValidationNotes}</span>
                    </p>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setIsAddQuestionModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Edit Question</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 3: AGENTIC AI & MCP SAFETY ASSISTANT                               */}
      {/* ========================================================================= */}
      {activeViewTab === 'ai-governance' && (
        <div className="space-y-6">
          {/* AI Banner */}
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight font-sans">
                    AI SAFETY ASSISTANT &bull; AGENTIC CURRICULUM GOVERNANCE
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Autonomous safety analysis, ambiguity detection, distractor validation, and multilingual alignment for DGMS Coal Mines Regulations 2017.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 bg-amber-950/80 border border-amber-700/80 px-3 py-1.5 rounded-lg font-bold">
                  HUMAN-IN-THE-LOOP ACTIVE
                </span>
              </div>
            </div>

            {/* AI Governance Workflow Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-800 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-[10px] font-mono text-amber-400 block font-bold">STEP 01</span>
                <span className="font-bold text-slate-200 block mt-0.5">AI ANALYSIS</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Scans 15 questions &amp; AR assets</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-[10px] font-mono text-amber-400 block font-bold">STEP 02</span>
                <span className="font-bold text-slate-200 block mt-0.5">AI RECOMMENDATION</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Generates safety improvements</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-[10px] font-mono text-sky-400 block font-bold">STEP 03</span>
                <span className="font-bold text-slate-200 block mt-0.5">ADMIN REVIEW</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Safety officer inspection</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">STEP 04</span>
                <span className="font-bold text-slate-200 block mt-0.5">ADMIN APPROVAL</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Explicit authorization gate</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">STEP 05</span>
                <span className="font-bold text-slate-200 block mt-0.5">PUBLISH &amp; MESH</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Synced to worker tablets</span>
              </div>
            </div>
          </div>

          {/* Pending AI Recommendations Requiring Human Approval */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI SAFETY RECOMMENDATIONS &bull; REQUIRES ADMIN APPROVAL</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The AI agent cannot directly publish safety-critical changes without explicit administrator sign-off.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                {aiPendingRecommendations.length} Pending Approval
              </span>
            </div>

            {aiPendingRecommendations.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900">All AI Recommendations Processed</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Question bank and AR scenarios are fully aligned with DGMS safety benchmarks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiPendingRecommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          {rec.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {rec.moduleName} &bull; {rec.targetQuestionId}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                          Confidence: {rec.confidenceScore}%
                        </span>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900 text-amber-100 font-mono">
                        REQUIRES ADMIN APPROVAL
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{rec.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">Current Text:</span>
                          <span className="font-medium text-slate-800 mt-0.5 block">{rec.originalText}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                          <span className="text-[10px] font-bold uppercase text-emerald-700 block font-sans">AI Recommended Enhancement:</span>
                          <span className="font-bold text-emerald-950 mt-0.5 block">{rec.suggestedText}</span>
                        </div>
                      </div>
                    </div>

                    {/* Approve / Reject Controls */}
                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Safety Impact: <strong className="text-slate-800">{rec.safetyImpact}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectRecommendation(rec.id)}
                          className="px-3 py-1.5 text-xs font-bold text-rose-800 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>REJECT</span>
                        </button>

                        <button
                          onClick={() => handleApproveRecommendation(rec.id)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>APPROVE &amp; PUBLISH</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MCP Tools Catalog (Connected System Data) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-700" />
                  <span>CONNECTED MCP SAFETY TOOLS (MODEL CONTEXT PROTOCOL)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Governed endpoints used by the AI Agent to inspect safety standards, question banks, and worker records.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                6 of 6 MCP Tools Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONNECTED_MCP_TOOLS.map(t => (
                <div
                  key={t.name}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{t.name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                      {t.latencyMs}ms
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">{t.capabilities}</p>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="truncate max-w-[180px]">{t.endpoint}</span>
                    <span className="text-slate-700 font-semibold">{t.callsCount} calls</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 4: SAFETY CONTENT VALIDATOR (10-POINT DGMS RULESET)                */}
      {/* ========================================================================= */}
      {activeViewTab === 'validator' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>SAFETY CONTENT VALIDATION ENGINE &bull; 10-POINT MANDATE</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every MCQ and AR simulation must satisfy all 10 automated safety rules before publication to worker units.
              </p>
            </div>

            <button
              onClick={handleRunAiAudit}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>EXECUTE FULL AUDIT ON ALL 15 QUESTIONS</span>
            </button>
          </div>

          {/* 10 Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'R-01', title: '1. Safety-Critical Relevance', desc: 'Question directly addresses statutory mine hazards under DGMS CMR 2017.', status: 'PASSED' },
              { id: 'R-02', title: '2. Correct Answer Safety Logic', desc: 'Correct option follows standard operating safety procedures without compromise.', status: 'PASSED' },
              { id: 'R-03', title: '3. Option Visual & Text Alignment', desc: '3D AR models and UI icons match their technical labels exactly.', status: 'PASSED' },
              { id: 'R-04', title: '4. Zero Dangerous Recommendation', desc: 'No lethal or unauthorized action is presented as a recommended behavior.', status: 'PASSED' },
              { id: 'R-05', title: '5. Extinguisher Media vs Fire Class', desc: 'Dry Chemical / CO2 enforced for energized gear; zero water on live panels.', status: 'PASSED' },
              { id: 'R-06', title: '6. High Voltage Water Prohibition', desc: 'Electrical safety scenarios block water suppression options with critical alarms.', status: 'PASSED' },
              { id: 'R-07', title: '7. Gas Leak Zero-Ignition Gate', desc: 'Methane scenarios strictly forbid flame testing and unventilated blind entries.', status: 'PASSED' },
              { id: 'R-08', title: '8. Lockout Safe Isolation Verification', desc: 'LOTO procedures enforce individual padlocks and zero pressure bleed checks.', status: 'PASSED' },
              { id: 'R-09', title: '9. Live-Dead-Live Electrical Proof', desc: 'Electrical questions enforce the 3-step voltmeter verification sequence.', status: 'PASSED' },
              { id: 'R-10', title: '10. Trilingual Text & Audio Semantic Match', desc: 'English, Hindi, and Santali versions convey identical safety mandates.', status: 'PASSED' }
            ].map(r => (
              <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{r.title}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DRAWER / MODAL: SCENARIO MANAGEMENT PANEL                              */}
      {/* ========================================================================= */}
      {isDrawerOpen && selectedModuleForDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div>
              <div className="p-5 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                      MODULE MANAGEMENT PANEL &bull; {selectedModuleForDrawer.code}
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight leading-tight mt-0.5">
                      {selectedModuleForDrawer.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-5 text-xs">
                {/* 1. Module Information Grid */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                    MODULE INFORMATION
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Module Code</span>
                      <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">{selectedModuleForDrawer.code}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Safety Domain</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">{selectedModuleForDrawer.domain}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Difficulty</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedModuleForDrawer.difficulty}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Duration</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedModuleForDrawer.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                {/* 2. Assessment Specification (Strict 60% Passing) */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                    ASSESSMENT CONFIGURATION
                  </h3>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Questions</span>
                      <span className="text-sm font-black font-mono text-emerald-950 mt-0.5 block">5 Questions</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Marks / Question</span>
                      <span className="text-sm font-black font-mono text-emerald-950 mt-0.5 block">20 Marks</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Total Marks</span>
                      <span className="text-sm font-black font-mono text-emerald-950 mt-0.5 block">100 Marks</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Pass Requirement</span>
                      <span className="text-sm font-black font-mono text-emerald-950 mt-0.5 block">60% (60/100)</span>
                    </div>
                  </div>
                </div>

                {/* 3. AR Scenario Specification */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                    AR SCENARIO &bull; PROCEDURAL SIMULATION
                  </h3>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-slate-700 leading-relaxed">{selectedModuleForDrawer.description}</p>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                        3D AR Asset Bundles (Unity ARCore 6DoF):
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedModuleForDrawer.arAssets.map(a => (
                          <span key={a} className="font-mono text-[10px] bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-700">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-sans">ARCore Engine</span>
                        <span className="font-bold text-slate-800 text-xs block mt-0.5">Optical 6DoF Surface Anchored</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-sans">Offline Mesh Package</span>
                        <span className="font-bold text-emerald-800 text-xs block mt-0.5">{selectedModuleForDrawer.offlinePackageStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Learning Objectives & Required Safety Actions */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                    MANDATED LEARNING OBJECTIVES
                  </h3>
                  <ul className="space-y-1.5 text-slate-700">
                    {selectedModuleForDrawer.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Languages & Localized Audio */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                    LANGUAGES &amp; LOCALIZATION (WITH AUDIO SUPPORT)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <span className="font-bold text-slate-900 block text-xs">English (EN)</span>
                      <span className="text-[10px] font-mono text-emerald-700 block mt-0.5">✓ Audio Ready</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <span className="font-bold text-slate-900 block text-xs">Hindi (HI)</span>
                      <span className="text-[10px] font-mono text-emerald-700 block mt-0.5">✓ Audio Ready</span>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-center">
                      <span className="font-bold text-amber-950 block text-xs">Santali (SAT)</span>
                      <span className="text-[10px] font-mono text-amber-800 block mt-0.5">✓ Ol Chiki Audio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleOpenArPreview(selectedModuleForDrawer);
                  }}
                  className="px-3 py-2 bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PREVIEW AR</span>
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setSelectedModuleFilter(selectedModuleForDrawer.id);
                    setActiveViewTab('questions');
                  }}
                  className="px-3 py-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MANAGE QUESTIONS</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: AR SIMULATION PREVIEW                                            */}
      {/* ========================================================================= */}
      {isArPreviewOpen && previewingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsArPreviewOpen(false)}
          />

          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-slate-100 z-10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                    UNITY ARCORE 6DoF SIMULATION PREVIEW &bull; {previewingModule.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Engine: {previewingModule.arEngine}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsArPreviewOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated 3D AR Viewport */}
            <div className="relative bg-slate-900 min-h-[380px] flex items-center justify-center overflow-hidden border-b border-slate-800">
              {/* Wireframe Grid Background */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Central AR Simulation HUD */}
              <div className="relative z-10 text-center space-y-3 p-6 max-w-md bg-slate-950/90 border border-slate-700/80 rounded-2xl backdrop-blur-md">
                <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40 flex items-center justify-center mx-auto animate-pulse">
                  <previewingModule.icon className="w-8 h-8" />
                </div>

                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block bg-amber-950/80 border border-amber-700/80 px-2 py-0.5 rounded mx-auto max-w-fit">
                  ARCORE SURFACE ANCHOR LOCKED (0, 0, 0)
                </span>

                <h4 className="text-base font-bold text-white leading-tight">
                  {previewingModule.scenarioTitle}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Hazard active: <span className="text-amber-400 font-semibold">{previewingModule.hazardType}</span>
                </p>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Latency: 12.4ms (LiteRT)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    60 FPS &bull; 100% Tracking
                  </span>
                </div>
              </div>

              {/* Simulated AR Optical Corner Markers */}
              <div className="absolute top-4 left-4 border-t-2 border-l-2 border-sky-400 w-8 h-8 opacity-80" />
              <div className="absolute top-4 right-4 border-t-2 border-r-2 border-sky-400 w-8 h-8 opacity-80" />
              <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-sky-400 w-8 h-8 opacity-80" />
              <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-sky-400 w-8 h-8 opacity-80" />
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">
                Offline Bundle: {previewingModule.offlinePackageStatus}
              </span>
              <button
                onClick={() => setIsArPreviewOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: ADD / EDIT MCQ QUESTION                                        */}
      {/* ========================================================================= */}
      {isAddQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddQuestionModalOpen(false)}
          />

          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-900 z-10 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  {editingQuestion ? `EDIT MCQ QUESTION: ${editingQuestion.id}` : 'ADD NEW MCQ ASSESSMENT QUESTION'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddQuestionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Training Module</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                    <option value="MOD-01">Module 01: Fire Safety & Extinguisher</option>
                    <option value="MOD-02">Module 02: Gas Leak & Lockout Tagout</option>
                    <option value="MOD-03">Module 03: Electrical Safety & Zero Energy</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Question Type</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                    <option value="Safety procedure MCQ">Safety procedure MCQ</option>
                    <option value="Scenario MCQ">Scenario MCQ</option>
                    <option value="Visual identification">Visual identification</option>
                    <option value="Image-based MCQ">Image-based MCQ</option>
                    <option value="AR decision question">AR decision question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Question Text (English)</label>
                <textarea
                  rows={2}
                  defaultValue={editingQuestion?.questionText || ''}
                  placeholder="Enter the safety-critical question prompt..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Hindi Translation (HI)</label>
                  <textarea
                    rows={2}
                    defaultValue={editingQuestion?.questionTextHindi || ''}
                    placeholder="हिंदी अनुवाद..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Santali / Ol Chiki (SAT)</label>
                  <textarea
                    rows={2}
                    defaultValue={editingQuestion?.questionTextSantali || ''}
                    placeholder="ᱥᱟᱱᱛᱟᱲᱤ ᱛᱚᱨᱡᱚᱢᱟ..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-sans"
                  />
                </div>
              </div>

              {/* Safety Content Validation Alert */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold font-mono text-emerald-800 uppercase block">
                  Automated Safety Pre-Check Active:
                </span>
                <p className="text-[11px] text-emerald-950 leading-snug">
                  ✓ Non-hazardous distractor logic enforced &bull; 20 Marks allocation fixed &bull; Multilingual audio generation verified.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Passing Weight: 20 Marks</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsAddQuestionModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Save Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODAL: DISPATCH TO WORKER REMEDIATION                                 */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && dispatchModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDispatchModalOpen(false)}
          />

          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-slate-900 z-10 flex flex-col">
            <div className="p-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  DISPATCH SCENARIO TO REMEDIATION
                </h3>
              </div>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-sans">Target Training Module</span>
                <p className="font-bold text-slate-900 text-sm">{dispatchModule.name}</p>
                <p className="text-[11px] text-slate-600">{dispatchModule.code} &bull; Pass Mark: 60%</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Worker for Assignment</label>
                <select
                  value={selectedWorkerForDispatch}
                  onChange={e => setSelectedWorkerForDispatch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 cursor-pointer"
                >
                  {workers.slice(0, 10).map(w => (
                    <option key={w.id} value={w.id}>
                      {w.id} - {w.name} ({w.role} - {w.site})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="px-4 py-1.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODAL: CREATE SCENARIO                                                */}
      {/* ========================================================================= */}
      {isCreateScenarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCreateScenarioModalOpen(false)}
          />

          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900 z-10 flex flex-col">
            <div className="p-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  CREATE NEW SAFETY SCENARIO
                </h3>
              </div>
              <button onClick={() => setIsCreateScenarioModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Scenario Title</label>
                <input
                  type="text"
                  placeholder="e.g., Roof Bolting Safety & Strata Failure Response"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Safety Domain</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                    <option>Fall / Work-at-Height Safety</option>
                    <option>PPE & Equipment</option>
                    <option>Haulage & Transport</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Pass Requirement</label>
                  <input
                    type="text"
                    disabled
                    value="60% (60/100 Marks)"
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsCreateScenarioModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsCreateScenarioModalOpen(false);
                }}
                className="px-4 py-1.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800"
              >
                Draft Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. MODAL: AI ANALYSIS AUDIT REPORT                                       */}
      {/* ========================================================================= */}
      {isAiReportModalOpen && selectedReportModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAiReportModalOpen(false)}
          />

          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900 z-10 flex flex-col">
            <div className="p-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  AI SAFETY AUDIT REPORT &bull; {selectedReportModule.code}
                </h3>
              </div>
              <button onClick={() => setIsAiReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono text-emerald-800 block">Overall AI Safety Score</span>
                <span className="text-2xl font-black font-mono text-emerald-950">{selectedReportModule.aiSafetyScore}%</span>
                <p className="text-[11px] text-emerald-900 mt-1">
                  100% compliance with DGMS CMR 2017 &bull; All 5 questions validated for zero dangerous distractors.
                </p>
              </div>

              <div className="space-y-1 text-slate-700">
                <span className="font-bold text-xs text-slate-900 block">Audit Findings:</span>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                  <p>✓ All 5 correct-answer mappings verified non-hazardous.</p>
                  <p>✓ Trilingual text &amp; audio waveforms match semantic safety intent.</p>
                  <p>✓ Zero-energy lockout principle verified without ambiguity.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setIsAiReportModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
