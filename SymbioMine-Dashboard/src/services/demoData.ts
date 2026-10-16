/**
 * SYMBIOMINE - Industrial Safety Intelligence
 * Comprehensive Enterprise Demo Dataset (150 workers, 3 sites, 3 shifts, 6 domains)
 * Clearly marked as DEMO ENVIRONMENT
 */

import {
  Worker,
  AssessmentRecord,
  Certificate,
  IntegrityFlagRecord,
  ScenarioModule,
  SyncRecord,
  RemediationQueueItem,
  AuditLogItem,
  SafetyDomain
} from '../types';

export const SITES = [
  'Jharkhand Underground',
  'Dhanbad Surface',
  'Singrauli OpenCast'
] as const;

export const SHIFTS = ['Shift A', 'Shift B', 'Shift C'] as const;

export const DEPARTMENTS = [
  'Extraction',
  'Maintenance',
  'Safety & Ventilation',
  'Haulage & Transport',
  'Drilling & Blasting'
] as const;

export const SAFETY_DOMAINS: SafetyDomain[] = [
  'Hazard Identification',
  'PPE & Equipment',
  'Gas Leak & Confined Space',
  'Fire & Emergency Response',
  'LOTO',
  'Fall / Work-at-Height Safety'
];

/**
 * SEED / DEMO TIER MODEL (replace with backend aggregates later)
 * Pass mark = 60 / 100 (5 questions x 20 marks). Tiers:
 *   Expert 90-100 (42) | Proficient 80-89 (58) | Competent 60-79 (32) | Remediation <60 (18)  => 150
 * Certified = Expert + Proficient (100). Remediation pipeline = 18 below pass mark
 * + 30 Competent-tier workers who failed >=1 module attempt (48). 2 Competent workers await credential issue.
 */
const WORKER_TIERS: Array<'Expert' | 'Proficient' | 'Competent' | 'Remediation Required'> = (() => {
  const tiers = Array.from({ length: 150 }).map((_, i) => {
    const rank = (i * 7) % 150; // 7 is coprime with 150 => bijective permutation of 0..149
    return rank < 42 ? 'Expert' : rank < 100 ? 'Proficient' : rank < 132 ? 'Competent' : 'Remediation Required';
  }) as Array<'Expert' | 'Proficient' | 'Competent' | 'Remediation Required'>;
  // W-104 (index 4) is the fixed demo-scenario worker and must sit in the Competent tier (68%).
  if (tiers[4] !== 'Competent') {
    const j = tiers.findIndex((t, i) => i !== 4 && t === 'Competent');
    tiers[j] = tiers[4];
    tiers[4] = 'Competent';
  }
  return tiers;
})();

const REMEDIATION_COMPETENT_INDEXES: Set<number> = (() => {
  const competent = WORKER_TIERS.map((t, i) => (t === 'Competent' && i !== 4 ? i : -1)).filter(i => i >= 0);
  return new Set([4, ...competent.slice(0, 29)]); // W-104 + 29 others = 30 of 32 Competent-tier workers
})();

// Generate 150 Workers
const workerNames = [
  'Rajesh Soren', 'Amitabh Roy', 'Sunil Kumar Mahato', 'Vikramaditya Baski', 'Pradeep Tudu',
  'Devendra Besra', 'Anil Hansda', 'Sanjay Murmu', 'Ravi Prakash Tirkey', 'Manoj Kispotta',
  'Deepak Soren', 'Kiran Tigga', 'Binod Ekka', 'Santosh Minz', 'Ramesh Gope',
  'Ashok Mandal', 'Pramod Saw', 'Gopal Mahto', 'Mukesh Yadav', 'Suraj Paswan',
  'Alok Pandey', 'Vijay Tiwari', 'Abhishek Mishra', 'Chandan Singh', 'Dharmendra Sharma',
  'Rakesh Verma', 'Ajay Kumar', 'Gautam Das', 'Ranjit Ghosh', 'Subrata Sen',
  'Arunav Bannerjee', 'Tapas Chakraborty', 'Sujit Bhowmick', 'Nilratan Mondal', 'Bikash Paul',
  'Partha Maji', 'Swapan Roy', 'Tarun Malakar', 'Bishnu Karmakar', 'Subhash De',
  'Manish Ojha', 'Brijesh Tripathi', 'Harish Chandra', 'Kishan Lal', 'Naveen Chauhan',
  'Dinesh Lodhi', 'Mahesh Rathore', 'Satish Ahirwar', 'Umesh Kevat', 'Shivraj Gond',
  'Mangal Baiga', 'Sukhram Kol', 'Lalji Sahariya', 'Ratan Bhil', 'Mohan Meena',
  'Kalu Ram', 'Jagdish Rawat', 'Bhawani Gurjar', 'Pappu Lal', 'Gordhan Rajput',
  'Hemant Prajapat', 'Narendra Kumawat', 'Mukut Dhakar', 'Bheeva Bheel', 'Dalu Ram',
  'Inderjeet Singh', 'Gurmeet Singh', 'Jasbir Sandhu', 'Manpreet Gill', 'Kuldeep Dhillon',
  'Pritam Toppo', 'Bipul Kerketta', 'Sushil Khoya', 'Cyril Dhanwar', 'Alphonse Barla',
  'Ignatius Lakra', 'Fabian Beck', 'Victor Xess', 'Norbert Dungdung', 'Pravin Lugun',
  'Jitendra Horo', 'Benjamin Surin', 'Gabriel Kandulna', 'Sylvester Kujur', 'Anthony Mundu',
  'Ganesh Soren', 'Laxman Marandi', 'Babulal Hembram', 'Chotu Murmu', 'Ramdas Kisku',
  'Chunnu Hansda', 'Somra Tudu', 'Hopna Besra', 'Barku Baski', 'Pandu Soren',
  'Shashi Bhushan', 'Nandkishore Prasad', 'Sudhir Ranjan', 'Binay Kant', 'Akhilesh Dubey',
  'Siddharth Gautam', 'Kunal Kishore', 'Prashant Kumar', 'Rohit Sinha', 'Saurabh Sahay',
  'Vipul Mathur', 'Anurag Saxena', 'Nitin Nigam', 'Tarun Bhatnagar', 'Pawan Kulshrestha',
  'Kailash Joshi', 'Bhupendra Rawal', 'Devendra Bhatt', 'Girish Upadhyay', 'Yogesh Pant',
  'Nandan Negi', 'Pankaj Bisht', 'Birendra Rawat', 'Chandan Goswami', 'Manish Gairola',
  'Puran Singh', 'Khemraj Thapa', 'Tek Bahadur', 'Dilip Gurung', 'Padam Shrestha',
  'Prem Tamang', 'Bhakta Newar', 'Lila Rai', 'Narayan Magar', 'Surya Subba',
  'Lalit Mohan', 'Jaganath Kar', 'Sudhanshu Sahu', 'Pranab Mohanty', 'Rabindra Nayak',
  'Girish Swain', 'Bichitra Patra', 'Trilochan Jena', 'Dillip Sethi', 'Pitambar Barik',
  'Upendra Behera', 'Niranjan Muduli', 'Sarat Pradhan', 'Basanta Samal', 'Kailash Rout'
];

export const INITIAL_WORKERS: Worker[] = Array.from({ length: 150 }).map((_, index) => {
  const idNumber = 100 + index;
  const id = `W-${idNumber}`;
  const name = workerNames[index % workerNames.length];
  const site = SITES[index % SITES.length];
  const department = DEPARTMENTS[index % DEPARTMENTS.length];
  const shift = SHIFTS[index % SHIFTS.length];

  // Specific assignment for W-104 to strictly match DEMO SCENARIO
  if (id === 'W-104') {
    return {
      id: 'W-104',
      name: 'Rajesh Soren',
      site: 'Jharkhand Underground',
      department: 'Extraction',
      shift: 'Shift B',
      role: 'Continuous Miner Operator',
      competencyLevel: 'Competent',
      overallScore: 68,
      trainingStatus: 'Remediation Pending',
      certificationStatus: 'Under Review',
      lastAssessmentDate: '2026-09-20',
      integrityStatus: 'Clear',
      domainScores: {
        'Hazard Identification': 72,
        'PPE & Equipment': 91,
        'Gas Leak & Confined Space': 64,
        'Fire & Emergency Response': 58,
        'LOTO': 84,
        'Fall / Work-at-Height Safety': 76
      },
      activeRemediationAttempt: 1,
      badgeNumber: 'BDG-JH-9411',
      phone: '+91 94311 08821'
    };
  }

  // Distribution for the other 149 workers (tier-driven, 60% pass mark)
  const competencyLevel: Worker['competencyLevel'] = WORKER_TIERS[index];
  const scoreBase =
    competencyLevel === 'Expert' ? 90 + ((index * 3) % 11) :
    competencyLevel === 'Proficient' ? 80 + ((index * 3) % 10) :
    competencyLevel === 'Competent' ? 60 + ((index * 7) % 20) :
    40 + ((index * 5) % 20);
  const isAttention = competencyLevel === 'Remediation Required' || REMEDIATION_COMPETENT_INDEXES.has(index);

  const certificationStatus: Worker['certificationStatus'] =
    competencyLevel === 'Expert' || competencyLevel === 'Proficient'
      ? (index % 11 === 0 ? 'Expiring Soon' : 'Valid')
      : 'Under Review';

  const integrityStatus: Worker['integrityStatus'] = 
    index === 18 || index === 43 ? 'Integrity Flag' : 
    index === 82 ? 'Under Review' : 'Clear';

  return {
    id,
    name,
    site,
    department,
    shift,
    role: index % 4 === 0 ? 'Continuous Miner Operator' :
          index % 4 === 1 ? 'Ventilation Officer' :
          index % 4 === 2 ? 'Haulage Driver' : 'Roof Bolter & Support Tech',
    competencyLevel,
    overallScore: scoreBase,
    trainingStatus: isAttention ? 'Remediation Pending' : 'Up to date',
    certificationStatus,
    lastAssessmentDate: `2026-09-${(10 + (index % 11)).toString().padStart(2, '0')}`,
    integrityStatus,
    domainScores: {
      'Hazard Identification': Math.min(100, Math.max(50, scoreBase + ((index % 7) - 3) * 2)),
      'PPE & Equipment': Math.min(100, Math.max(50, scoreBase + ((index % 5) - 1) * 3)),
      'Gas Leak & Confined Space': Math.min(100, Math.max(45, scoreBase - ((index % 9) * 2))),
      'Fire & Emergency Response': Math.min(100, Math.max(48, scoreBase + ((index % 6) - 4) * 2)),
      'LOTO': Math.min(100, Math.max(55, scoreBase + ((index % 8) - 2) * 2)),
      'Fall / Work-at-Height Safety': Math.min(100, Math.max(52, scoreBase + ((index % 4) - 2) * 2))
    },
    badgeNumber: `BDG-${site.substring(0, 2).toUpperCase()}-${1000 + index}`,
    phone: `+91 943${(100000 + index * 411).toString().slice(0, 7)}`
  };
});

// Real-looking Action Timeline for W-104 Gas Leak Assessment (from prompt: 09:31:02 to 09:31:47)
export const W104_ASSESSMENT_RECORD: AssessmentRecord = {
  id: 'ASM-2026-0920-W104',
  workerId: 'W-104',
  workerName: 'Rajesh Soren',
  scenarioId: 'SCN-GAS-04',
  scenarioName: 'Methane Ingress & Blind Heading Evacuation',
  domain: 'Gas Leak & Confined Space',
  attempt: 1,
  score: 64,
  passThreshold: 60,
  passed: true,
  date: '2026-09-20 09:31:47',
  responseDurationSeconds: 45,
  criticalViolations: 1,
  mcqScore: 70,
  actionSequenceAccuracy: 62,
  weakDomain: 'Fire & Emergency Response (Emergency Evacuation Protocol)',
  liteRtInsight: 'LiteRT on-device inference: Delay in multi-gas monitor check (8s excess) and premature heading re-entry attempt before secondary exhaust verification.',
  timeline: [
    {
      id: 'tl-1',
      timestamp: '09:31:02',
      elapsedSeconds: 0,
      event: 'Scenario Started — Blind Heading Ingress Level 3',
      type: 'milestone'
    },
    {
      id: 'tl-2',
      timestamp: '09:31:14',
      elapsedSeconds: 12,
      event: 'Gas Hazard Identified via AR Multi-gas Monitor (CH4 > 1.25%)',
      type: 'hazard'
    },
    {
      id: 'tl-3',
      timestamp: '09:31:22',
      elapsedSeconds: 20,
      event: 'Incorrect Entry Decision (Proceeded toward face without auxiliary fan check)',
      type: 'violation',
      isError: true,
      notes: 'Critical Rule CR-04 breached: Never penetrate past warning beacon when CH4 exceeds 1.0%'
    },
    {
      id: 'tl-4',
      timestamp: '09:31:31',
      elapsedSeconds: 29,
      event: 'Emergency Response Initiated (Self-rescuer SCSR donned, alarm triggered)',
      type: 'action'
    },
    {
      id: 'tl-5',
      timestamp: '09:31:47',
      elapsedSeconds: 45,
      event: 'Exit Selected & Heading Evacuation Completed',
      type: 'milestone'
    }
  ]
};

// Additional 12 representative assessment records
export const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  W104_ASSESSMENT_RECORD,
  {
    id: 'ASM-2026-0920-W101',
    workerId: 'W-101',
    workerName: 'Amitabh Roy',
    scenarioId: 'SCN-LOTO-02',
    scenarioName: 'High-Voltage Substation Isolation & Lockout',
    domain: 'LOTO',
    attempt: 1,
    score: 92,
    passThreshold: 60,
    passed: true,
    date: '2026-09-20 11:15:30',
    responseDurationSeconds: 62,
    criticalViolations: 0,
    mcqScore: 95,
    actionSequenceAccuracy: 90,
    timeline: [
      { id: 't1', timestamp: '11:15:30', elapsedSeconds: 0, event: 'Isolation Permit Inspected', type: 'milestone' },
      { id: 't2', timestamp: '11:15:45', elapsedSeconds: 15, event: 'Zero Energy State Verified with Calibrated Voltmeter', type: 'action' },
      { id: 't3', timestamp: '11:16:10', elapsedSeconds: 40, event: 'Padlock and Danger Tag Affixed', type: 'action' },
      { id: 't4', timestamp: '11:16:32', elapsedSeconds: 62, event: 'Permit Sign-off Completed', type: 'milestone' }
    ]
  },
  {
    id: 'ASM-2026-0919-W102',
    workerId: 'W-102',
    workerName: 'Sunil Kumar Mahato',
    scenarioId: 'SCN-PPE-01',
    scenarioName: 'Pre-Shift Dust & Noise Mask Fit Protocol',
    domain: 'PPE & Equipment',
    attempt: 1,
    score: 88,
    passThreshold: 60,
    passed: true,
    date: '2026-09-19 14:22:10',
    responseDurationSeconds: 38,
    criticalViolations: 0,
    mcqScore: 90,
    actionSequenceAccuracy: 86,
    timeline: [
      { id: 't1', timestamp: '14:22:10', elapsedSeconds: 0, event: 'Respirator Seal Check Initiated', type: 'milestone' },
      { id: 't2', timestamp: '14:22:25', elapsedSeconds: 15, event: 'Positive/Negative Pressure Test Passed', type: 'action' },
      { id: 't3', timestamp: '14:22:48', elapsedSeconds: 38, event: 'Cap Lamp & Battery Securing Verified', type: 'milestone' }
    ]
  },
  {
    id: 'ASM-2026-0918-W118',
    workerId: 'W-118',
    workerName: 'Mukesh Yadav',
    scenarioId: 'SCN-FALL-03',
    scenarioName: 'Highwall Bench Inspection & Harness Anchorage',
    domain: 'Fall / Work-at-Height Safety',
    attempt: 2,
    score: 61,
    passThreshold: 60,
    passed: true,
    date: '2026-09-18 16:40:15',
    responseDurationSeconds: 54,
    criticalViolations: 1,
    mcqScore: 65,
    actionSequenceAccuracy: 58,
    weakDomain: 'Fall / Work-at-Height Safety',
    timeline: [
      { id: 't1', timestamp: '16:40:15', elapsedSeconds: 0, event: 'Bench Edge Approach Initiated', type: 'milestone' },
      { id: 't2', timestamp: '16:40:32', elapsedSeconds: 17, event: 'Anchorage Attached to Non-Certified Strut', type: 'violation', isError: true },
      { id: 't3', timestamp: '16:41:09', elapsedSeconds: 54, event: 'Session Terminated for Fall Hazard', type: 'milestone' }
    ]
  }
];

// Active Remediation Queue (including W-104 and other workers needing Gas / LOTO / PPE training)
export const INITIAL_REMEDIATION_QUEUE: RemediationQueueItem[] = [
  {
    id: 'REM-W104',
    workerId: 'W-104',
    workerName: 'Rajesh Soren',
    site: 'Jharkhand Underground',
    skillGap: 'Gas Emergency Response',
    recommendedModule: 'Gas Leak & Confined Space — Emergency Response (VR/AR Simulator v2.4)',
    attemptCount: 1,
    status: 'Remediation Pending',
    lastAttemptScore: 64
  },
  {
    id: 'REM-W118',
    workerId: 'W-118',
    workerName: 'Mukesh Yadav',
    site: 'Singrauli OpenCast',
    skillGap: 'Fall Protection & Anchorage',
    recommendedModule: 'Highwall Harness & Anchor Point Certification',
    attemptCount: 2,
    status: 'Remediation Pending',
    lastAttemptScore: 61
  },
  {
    id: 'REM-W106',
    workerId: 'W-106',
    workerName: 'Anil Hansda',
    site: 'Jharkhand Underground',
    skillGap: 'Gas Emergency Response',
    recommendedModule: 'Gas Leak & Confined Space — Emergency Response (VR/AR Simulator v2.4)',
    attemptCount: 1,
    status: 'Remediation Pending',
    lastAttemptScore: 66
  },
  {
    id: 'REM-W111',
    workerId: 'W-111',
    workerName: 'Kiran Tigga',
    site: 'Jharkhand Underground',
    skillGap: 'Gas Emergency Response',
    recommendedModule: 'Gas Leak & Confined Space — Emergency Response (VR/AR Simulator v2.4)',
    attemptCount: 1,
    status: 'Remediation Pending',
    lastAttemptScore: 63
  },
  {
    id: 'REM-W124',
    workerId: 'W-124',
    workerName: 'Chandan Singh',
    site: 'Dhanbad Surface',
    skillGap: 'LOTO Sequence & Verification',
    recommendedModule: 'LOTO Electrical Lockout Sequence Mastery',
    attemptCount: 1,
    status: 'Training Assigned',
    lastAttemptScore: 68,
    assignedDate: '2026-09-21'
  },
  {
    id: 'REM-W132',
    workerId: 'W-132',
    workerName: 'Sujit Bhowmick',
    site: 'Dhanbad Surface',
    skillGap: 'PPE Selection for Acid Wash',
    recommendedModule: 'Chemical Resistant PPE Selection & Airway Seal',
    attemptCount: 2,
    status: 'Remediation Pending',
    lastAttemptScore: 69
  }
];

// Certificates List
export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-2026-LOTO-W101',
    workerId: 'W-101',
    workerName: 'Amitabh Roy',
    moduleName: 'High-Voltage LOTO Isolation Standard',
    competencyLevel: 'Expert',
    issueDate: '2026-09-20',
    expiryDate: '2027-09-20',
    digitalSignature: '9f82c411b0e3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    issuer: 'DGMS / SymbioMine Certification Board',
    verificationStatus: 'Valid',
    qrPayload: 'SYMBIOMINE::CERT-2026-LOTO-W101::W-101::VALID::SHA256:e3b0c44298fc1c14'
  },
  {
    id: 'CERT-2026-PPE-W102',
    workerId: 'W-102',
    workerName: 'Sunil Kumar Mahato',
    moduleName: 'Underground Dust & Gas PPE Competency',
    competencyLevel: 'Proficient',
    issueDate: '2026-09-19',
    expiryDate: '2027-09-19',
    digitalSignature: '8a11bc3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc0183711',
    sha256Hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    issuer: 'DGMS / SymbioMine Certification Board',
    verificationStatus: 'Valid',
    qrPayload: 'SYMBIOMINE::CERT-2026-PPE-W102::W-102::VALID::SHA256:2c26b46b68ffc68f'
  },
  {
    id: 'CERT-2025-GAS-W103',
    workerId: 'W-103',
    workerName: 'Vikramaditya Baski',
    moduleName: 'Confined Space Methane Ingress Response',
    competencyLevel: 'Competent',
    issueDate: '2025-10-05',
    expiryDate: '2026-10-05',
    digitalSignature: '44d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01837119f82c411',
    sha256Hash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    issuer: 'DGMS / SymbioMine Certification Board',
    verificationStatus: 'Expiring Soon',
    qrPayload: 'SYMBIOMINE::CERT-2025-GAS-W103::W-103::VALID::SHA256:fcde2b2edba56bf4'
  },
  {
    id: 'CERT-2025-FALL-W118',
    workerId: 'W-118',
    workerName: 'Mukesh Yadav',
    moduleName: 'Highwall Working-at-Height Protocol',
    competencyLevel: 'Remediation Required',
    issueDate: '2025-08-14',
    expiryDate: '2026-08-14',
    digitalSignature: '3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01837119f82c4',
    sha256Hash: '12b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b812',
    issuer: 'DGMS / SymbioMine Certification Board',
    verificationStatus: 'Expired',
    qrPayload: 'SYMBIOMINE::CERT-2025-FALL-W118::W-118::EXPIRED::SHA256:12b0c44298fc1c14'
  }
];

// Integrity Flags
export const INITIAL_INTEGRITY_FLAGS: IntegrityFlagRecord[] = [
  {
    id: 'INT-FLAG-01',
    workerId: 'W-118',
    workerName: 'Mukesh Yadav',
    assessmentId: 'ASM-2026-0918-W118',
    timestamp: '2026-09-18 16:41:20',
    flagType: 'Randomized scenario mismatch',
    description: 'AR variant token mismatch: Attempted to submit pre-cached scenario seed #04 instead of newly randomized seed #19 generated by the Unity worker client.',
    riskScore: 'Medium',
    status: 'Open Flag'
  },
  {
    id: 'INT-FLAG-02',
    workerId: 'W-143',
    workerName: 'Harish Chandra',
    assessmentId: 'ASM-2026-0917-W143',
    timestamp: '2026-09-17 10:14:05',
    flagType: 'Head tracking occlusion',
    description: 'ARCore 6DoF camera optical feed occluded for >14 consecutive seconds during the mandatory gas detector calibration step.',
    riskScore: 'Low',
    status: 'Under Review',
    supervisorNotes: 'Checking if physical sensor guard on worker rugged tablet was misaligned in low seam.'
  },
  {
    id: 'INT-FLAG-03',
    workerId: 'W-182',
    workerName: 'Jaganath Kar',
    assessmentId: 'ASM-2026-0915-W182',
    timestamp: '2026-09-15 13:08:44',
    flagType: 'Response time anomaly',
    description: 'Ten consecutive safety-critical hazard identification prompts confirmed in under 180ms each, significantly below physiological perception baseline.',
    riskScore: 'High',
    status: 'Reassessment Requested',
    reviewedBy: 'Safety Admin (S. Mukherjee)'
  }
];

// Scenarios Configuration
export const SCENARIO_MODULES: ScenarioModule[] = [
  {
    id: 'SCN-GAS-04',
    name: 'Gas Leak & Confined Space — Blind Heading Evacuation',
    domain: 'Gas Leak & Confined Space',
    hazardType: 'Methane (CH4) & Carbon Monoxide (CO) Ingress',
    difficulty: 'Advanced',
    environment: 'Underground Seam 3, Heading 12B',
    requiredActions: [
      'Multi-gas monitor pre-calibration check',
      'Airflow direction smoke-tube verification',
      'SCSR donning within 20 seconds of alarm',
      'Secondary egress route selection avoiding return airway'
    ],
    criticalRules: [
      'CR-01: Zero spark tools permitted in active ingress zone',
      'CR-04: Evacuate immediately if CH4 > 1.0% or CO > 50 ppm',
      'CR-07: Never re-enter blind heading without auxiliary fan confirmation'
    ],
    passThreshold: 60,
    randomizationVariants: 6,
    trainingMode: true,
    assessmentMode: true,
    languageAvailability: ['Hindi', 'Bengali', 'Santali', 'English'],
    version: 'v2.4.1',
    lastApprovedBy: 'Director of Mines Safety (DGMS Authorized)',
    status: 'Active',
    estimatedMinutes: 25,
    targetRoles: ['Continuous Miner Operator', 'Ventilation Officer', 'Mining Sirdar'],
    learningObjectives: [
      'Accurate multi-gas detector calibration within 60s of shift commencement',
      'Instant recognition of methane acoustic sensor warning tones',
      'Rapid SCSR oxygen pack donning strictly under 20 seconds',
      'Safe egress pathway selection against intake air current'
    ],
    criticalPassCriteria: [
      'Immediate evacuation upon detection of CH4 > 1.0%',
      '100% adherence to zero electrical switching in combustible seam',
      'SCSR donning completed with sealed nose clip verified'
    ]
  },
  {
    id: 'SCN-LOTO-02',
    name: 'High-Voltage Switchgear Zero Energy Isolation',
    domain: 'LOTO',
    hazardType: 'Electrical Arc Flash & Stored Capacitance',
    difficulty: 'Intermediate',
    environment: 'Substation #2 Surface / Pit Substation',
    requiredActions: [
      'Lockout permit cross-verification',
      'Breaker rack-out and visual disconnect check',
      'Live-Dead-Live voltmeter verification',
      'Personal padlock and danger tag installation'
    ],
    criticalRules: [
      'CR-02: Live-Dead-Live sequence must be followed without exception',
      'CR-05: Grounding truck must be racked in before touch access'
    ],
    passThreshold: 60,
    randomizationVariants: 4,
    trainingMode: true,
    assessmentMode: true,
    languageAvailability: ['Hindi', 'English'],
    version: 'v2.1.0',
    lastApprovedBy: 'Chief Electrical Inspector of Mines',
    status: 'Active',
    estimatedMinutes: 20,
    targetRoles: ['Substation Electrician', 'Maintenance Fitter', 'Plant Technician'],
    learningObjectives: [
      'Zero-voltage electrical isolation sequence execution',
      'High-voltage PPE and blast shield donning',
      'Padlock and hasp placement on master isolation handle'
    ],
    criticalPassCriteria: [
      'Live-Dead-Live meter verification prior to conductor contact',
      'Residual capacitive discharge earthing confirmation'
    ]
  },
  {
    id: 'SCN-FALL-03',
    name: 'Highwall Bench Inspection & Edge Anchorage',
    domain: 'Fall / Work-at-Height Safety',
    hazardType: 'Slope Failure & Crest Fall Hazard',
    difficulty: 'Advanced',
    environment: 'Singrauli OpenCast Bench Level +120m',
    requiredActions: [
      'Full body harness inspection (webbing & D-ring)',
      'Certified anchor point testing (5000 lbs rating)',
      'Dual lanyard 100% tie-off discipline',
      'Rockfall crack zone standoff boundary enforcement'
    ],
    criticalRules: [
      'CR-03: Never unclip both lanyards simultaneously when within 2m of crest',
      'CR-06: Anchorage must never be made to mobile heavy equipment'
    ],
    passThreshold: 60,
    randomizationVariants: 5,
    trainingMode: true,
    assessmentMode: true,
    languageAvailability: ['Hindi', 'English'],
    version: 'v1.9.4',
    lastApprovedBy: 'Senior Safety Officer',
    status: 'Active',
    estimatedMinutes: 30,
    targetRoles: ['Drill Rig Operator', 'Blaster', 'Geotechnical Surveyor'],
    learningObjectives: [
      'Harness stitch and buckle integrity pre-check',
      'Dual lanyard anchorage alternation on certified life-lines',
      'Tension crack perimeter marking and standoff distance'
    ],
    criticalPassCriteria: [
      'Continuous 100% tie-off maintain within 2m crest margin',
      'Zero attachment to mobile earthmoving assets'
    ]
  },
  {
    id: 'SCN-FIRE-01',
    name: 'Conveyor Belt Friction Fire Response & Water Deluge',
    domain: 'Fire & Emergency Response',
    hazardType: 'Conveyor Fire & Toxic Combustion Smoke',
    difficulty: 'Intermediate',
    environment: 'Main Decline Belt Transfer Point #4',
    requiredActions: [
      'Emergency pull-cord belt stoppage',
      'Deluge valve manual actuator release',
      'Class B/C dry powder extinguisher discharge at belt drive',
      'Control room dispatch radio notification with exact chainage'
    ],
    criticalRules: [
      'CR-08: Always stay upwind of belt smoke plume during extinguisher deployment'
    ],
    passThreshold: 60,
    randomizationVariants: 3,
    trainingMode: true,
    assessmentMode: true,
    languageAvailability: ['Hindi', 'Bengali', 'English'],
    version: 'v2.0.2',
    lastApprovedBy: 'Mine Manager',
    status: 'Active',
    estimatedMinutes: 15,
    targetRoles: ['Conveyor Attendant', 'Shaft Incline Patrol', 'Safety Steward'],
    learningObjectives: [
      'Rapid emergency pull-wire stop actuation',
      'Water deluge solenoid trip and nozzle check',
      'Extinguisher PASS protocol under smoke visibility restrictions'
    ],
    criticalPassCriteria: [
      'Actuate emergency stop within 10 seconds of ignition detection',
      'Position upwind of smoke plume during suppression'
    ]
  },
  {
    id: 'SCN-PPE-01',
    name: 'Hazardous Chemical & Respirator Fit Discipline',
    domain: 'PPE & Equipment',
    hazardType: 'Respirable Crystalline Silica & Acid Electrolyte',
    difficulty: 'Basic',
    environment: 'Battery Charging & Acid Storage Shed',
    requiredActions: [
      'Half-face respirator positive & negative seal check',
      'Chemical splash goggles with anti-fog sealing',
      'Nitrile apron and heavy rubber chemical gloves',
      'Emergency eyewash shower locating'
    ],
    criticalRules: [
      'CR-09: No entry permitted without documented fit test verification'
    ],
    passThreshold: 60,
    randomizationVariants: 3,
    trainingMode: true,
    assessmentMode: true,
    languageAvailability: ['Hindi', 'Santali', 'English'],
    version: 'v1.8.0',
    lastApprovedBy: 'Occupational Health Physician',
    status: 'Active',
    estimatedMinutes: 15,
    targetRoles: ['Battery Mechanic', 'Workshop Helper', 'Laboratory Tech'],
    learningObjectives: [
      'Negative and positive pressure seal test on elastomeric respirators',
      'Chemical acid apron and face shield donning order',
      'Eyewash flush pedal operation within 10 seconds of splash'
    ],
    criticalPassCriteria: [
      'Zero unsealed face respirator ingress into battery charging chamber',
      'Full chemical visor deployment before battery cap removal'
    ]
  }
];

export const TRAINING_MODULES = SCENARIO_MODULES;

// Offline-First Synchronization Records
export const INITIAL_SYNC_RECORDS: SyncRecord[] = [
  {
    id: 'SYNC-901',
    deviceId: 'TAB-JH-UG-01',
    workerId: 'W-101',
    workerName: 'Amitabh Roy',
    syncTimestamp: '2026-09-21 10:42:15',
    status: 'Synchronized',
    recordsCount: 4,
    networkTransport: 'Surface Wi-Fi Mesh',
    payloadSizeKb: 420
  },
  {
    id: 'SYNC-902',
    deviceId: 'TAB-JH-UG-04',
    workerId: 'W-104',
    workerName: 'Rajesh Soren',
    syncTimestamp: '2026-09-20 09:32:05',
    status: 'Synchronized',
    recordsCount: 3,
    networkTransport: 'Substation Docking Station',
    payloadSizeKb: 680
  },
  {
    id: 'SYNC-903',
    deviceId: 'TAB-DH-SF-08',
    workerId: 'W-124',
    workerName: 'Chandan Singh',
    syncTimestamp: '2026-09-21 08:15:00',
    status: 'Synchronized',
    recordsCount: 2,
    networkTransport: 'Direct Gateway',
    payloadSizeKb: 290
  },
  {
    id: 'SYNC-904',
    deviceId: 'TAB-SG-OC-14',
    workerId: 'W-118',
    workerName: 'Mukesh Yadav',
    syncTimestamp: '2026-09-18 16:45:11',
    status: 'Synchronized',
    recordsCount: 5,
    networkTransport: 'Direct Gateway',
    payloadSizeKb: 810
  },
  // Pending sync records (to total 8 pending out of 150)
  {
    id: 'SYNC-PEND-01',
    deviceId: 'TAB-JH-UG-12',
    workerId: 'W-107',
    workerName: 'Anil Hansda',
    syncTimestamp: 'Pending local sync (Heading 9 Incline)',
    status: 'Pending',
    recordsCount: 2,
    networkTransport: 'Substation Docking Station',
    payloadSizeKb: 340
  },
  {
    id: 'SYNC-PEND-02',
    deviceId: 'TAB-JH-UG-19',
    workerId: 'W-112',
    workerName: 'Santosh Minz',
    syncTimestamp: 'Pending local sync (Incline 4 Shaft)',
    status: 'Pending',
    recordsCount: 1,
    networkTransport: 'Substation Docking Station',
    payloadSizeKb: 180
  }
];

// Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-8801',
    timestamp: '2026-09-21 09:15:20',
    user: 'S. Mukherjee',
    role: 'SAFETY ADMIN',
    action: 'ASSIGN_REMEDIATION',
    target: 'Worker W-124 (Chandan Singh)',
    previousState: 'Remediation Pending',
    newState: 'Training Assigned (SCN-LOTO-02)',
    ipAddress: '10.14.2.45'
  },
  {
    id: 'AUD-8802',
    timestamp: '2026-09-20 18:22:11',
    user: 'R. K. Verma',
    role: 'SUPERVISOR',
    action: 'REVIEW_INTEGRITY_FLAG',
    target: 'Assessment ASM-2026-0918-W118',
    previousState: 'Open Flag',
    newState: 'Under Review',
    ipAddress: '10.14.3.12'
  },
  {
    id: 'AUD-8803',
    timestamp: '2026-09-20 11:20:00',
    user: 'SYSTEM_AUTOSYNC',
    role: 'SUPER ADMIN',
    action: 'INGEST_OFFLINE_ASSESSMENT',
    target: 'Worker W-104 (Rajesh Soren)',
    previousState: 'Offline Ingress Cache',
    newState: 'Synchronized & Processed (Score: 64)',
    ipAddress: '10.14.0.1'
  }
];

// Domain Benchmark Statistics
export const DOMAIN_BENCHMARKS = [
  {
    domain: 'Gas Leak & Confined Space' as SafetyDomain,
    averageScore: 71.4,
    passRate: 64.2,
    criticalViolationsCount: 19,
    workersNeedingAttention: 34,
    trendPct: -12.4,
    history: [82, 79, 75, 74, 71.4]
  },
  {
    domain: 'PPE & Equipment' as SafetyDomain,
    averageScore: 89.2,
    passRate: 92.5,
    criticalViolationsCount: 4,
    workersNeedingAttention: 21,
    trendPct: 4.1,
    history: [84, 86, 88, 88, 89.2]
  },
  {
    domain: 'LOTO' as SafetyDomain,
    averageScore: 82.6,
    passRate: 81.0,
    criticalViolationsCount: 8,
    workersNeedingAttention: 17,
    trendPct: 1.8,
    history: [78, 80, 81, 82, 82.6]
  },
  {
    domain: 'Hazard Identification' as SafetyDomain,
    averageScore: 84.8,
    passRate: 85.3,
    criticalViolationsCount: 7,
    workersNeedingAttention: 14,
    trendPct: 2.5,
    history: [80, 81, 83, 84, 84.8]
  },
  {
    domain: 'Fire & Emergency Response' as SafetyDomain,
    averageScore: 76.5,
    passRate: 72.8,
    criticalViolationsCount: 14,
    workersNeedingAttention: 28,
    trendPct: -5.6,
    history: [81, 80, 78, 77, 76.5]
  },
  {
    domain: 'Fall / Work-at-Height Safety' as SafetyDomain,
    averageScore: 78.1,
    passRate: 75.0,
    criticalViolationsCount: 11,
    workersNeedingAttention: 23,
    trendPct: -2.1,
    history: [79, 80, 78, 79, 78.1]
  }
];

// Most Frequent Failed Procedures (Ranking strictly on frequency)
export const MOST_FREQUENT_FAILED_PROCEDURES = [
  {
    rank: 1,
    procedure: 'Gas Leak — Delay in Auxiliary Fan Check Before Heading Entry',
    domain: 'Gas Leak & Confined Space',
    failedCount: 34,
    shiftsAffected: ['Shift A', 'Shift B', 'Shift C'],
    criticalSeverity: 'CRITICAL',
    ruleReference: 'CR-04 / DGMS Reg 141'
  },
  {
    rank: 2,
    procedure: 'SCSR Self-Rescuer Chemical Donning Under 20 Seconds',
    domain: 'Fire & Emergency Response',
    failedCount: 26,
    shiftsAffected: ['Shift B', 'Shift C'],
    criticalSeverity: 'CRITICAL',
    ruleReference: 'CR-01 / Mine Safety Cir 12'
  },
  {
    rank: 3,
    procedure: 'Highwall Harness 100% Dual-Lanyard Attachment Transition',
    domain: 'Fall / Work-at-Height Safety',
    failedCount: 22,
    shiftsAffected: ['Shift A', 'Shift B'],
    criticalSeverity: 'HIGH',
    ruleReference: 'CR-03 / OpenCast SOP 09'
  },
  {
    rank: 4,
    procedure: 'Respirator Positive Pressure Seal Test Prior to Dust Incline',
    domain: 'PPE & Equipment',
    failedCount: 21,
    shiftsAffected: ['Shift A'],
    criticalSeverity: 'MODERATE',
    ruleReference: 'CR-09 / DGMS Reg 124'
  },
  {
    rank: 5,
    procedure: 'LOTO Live-Dead-Live Electrical Meter Pre-Test Step',
    domain: 'LOTO',
    failedCount: 17,
    shiftsAffected: ['Shift C'],
    criticalSeverity: 'CRITICAL',
    ruleReference: 'CR-02 / CEA Safety Reg 44'
  }
];
