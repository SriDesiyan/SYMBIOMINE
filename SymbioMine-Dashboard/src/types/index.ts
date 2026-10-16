/**
 * SYMBIOMINE - Industrial Safety Competency & Certification Intelligence Platform
 * Global Type Definitions
 */

export type UserRole = 
  | 'SUPER ADMIN' 
  | 'ADMINISTRATOR'
  | 'ADMIN' 
  | 'TRAINING ADMIN'
  | 'TRAINING ADMIN / OPERATOR' 
  | 'AUDITOR' 
  | 'VIEWER / AUDITOR' 
  | 'WORKER'
  | 'SAFETY ADMIN' 
  | 'SUPERVISOR' 
  | 'VIEWER';

export interface AdminUser {
  id: string; // e.g. "ADM-001"
  name: string; // e.g. "S. Mukherjee"
  email: string; // e.g. "superadmin@symbiomine.ar"
  role: UserRole;
  department: string;
  avatar?: string;
  status: 'Active' | 'Suspended' | 'Pending Activation';
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
  mfaEnabled: boolean;
  phone?: string;
}

export interface LoginAuditRecord {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  role: UserRole;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SESSION_TIMEOUT' | 'ROLE_CHANGED' | 'ADMIN_CREATED' | 'ADMIN_DISABLED' | 'ADMIN_DELETED' | 'PASSWORD_RESET';
  ipAddress: string;
  userAgent?: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
  details?: string;
  hash: string;
  previousHash: string;
}

export type ActiveTab =
  | 'command-center'
  | 'workers'
  | 'competency'
  | 'remediation'
  | 'assessments'
  | 'certifications'
  | 'integrity'
  | 'scenarios'
  | 'ai-assistant'
  | 'mcp-tools'
  | 'ai-approvals'
  | 'qr-verification'
  | 'sync-center'
  | 'reports'
  | 'system-health'
  | 'admin-management'
  | 'security-audit';

export type SiteLocation = 
  | 'Jharkhand Underground' 
  | 'Dhanbad Surface' 
  | 'Singrauli OpenCast' 
  | 'All Sites';

export type ShiftType = 'Shift A' | 'Shift B' | 'Shift C';

export type SafetyDomain = 
  | 'Hazard Identification'
  | 'PPE & Equipment'
  | 'Gas Leak & Confined Space'
  | 'Fire & Emergency Response'
  | 'LOTO'
  | 'Fall / Work-at-Height Safety';

export type CompetencyLevel = 
  | 'Expert' 
  | 'Proficient' 
  | 'Competent' 
  | 'Basic Pass' 
  | 'Remediation Required';

export type CertificationStatus = 
  | 'Valid' 
  | 'Expiring Soon' 
  | 'Expired' 
  | 'Under Review' 
  | 'Revoked';

export type IntegrityStatus = 'Clear' | 'Integrity Flag' | 'Under Review';

export interface Worker {
  id: string; // e.g. W-104
  name: string;
  site: 'Jharkhand Underground' | 'Dhanbad Surface' | 'Singrauli OpenCast';
  department: 'Extraction' | 'Maintenance' | 'Safety & Ventilation' | 'Haulage & Transport' | 'Drilling & Blasting';
  shift: ShiftType;
  role: string;
  competencyLevel: CompetencyLevel;
  overallScore: number; // 0 - 100
  trainingStatus: 'Up to date' | 'Remediation Pending' | 'Training Assigned' | 'In Progress';
  certificationStatus: CertificationStatus;
  lastAssessmentDate: string;
  integrityStatus: IntegrityStatus;
  domainScores: Record<SafetyDomain, number>;
  activeRemediationAttempt?: number;
  phone?: string;
  mobile?: string;
  badgeNumber?: string;
  photoUrl?: string;
  photoSha256?: string;
  isPhotoVerified?: boolean;
}

export interface SymbiomineModuleScore {
  id: string;
  name: string;
  score: number;
  isPassed: boolean;
}

export interface SymbiomineWorkerPackage {
  type: 'SYMBIOMINE_WORKER';
  version: number;
  worker: {
    workerId: string;
    name: string;
    mobile: string;
  };
  training: {
    module: string;
    score: number;
    totalScore: number;
    percentage: number;
    result: 'PASS' | 'FAIL' | string;
    modules?: SymbiomineModuleScore[];
  };
  certificate: {
    certificateId: string;
    status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'UNDER_REVIEW' | string;
    completionDate: string;
    digitalSignature?: string;
    canonicalSha256?: string;
  };
  photo: {
    format: string; // e.g. "image/jpeg"
    photoId: string;
    sha256: string;
    data: string; // Base64 encoded binary
  };
  timestamp?: number;
  transferId?: string;
}

export interface SymbiomineWorkerTransfer {
  type: 'SYMBIOMINE_WORKER_TRANSFER';
  version: number;
  transferId: string;
  chunkIndex: number;
  totalChunks: number;
  payload: string;
  workerMeta?: Partial<SymbiomineWorkerPackage>;
}

export interface TimelineAction {
  id: string;
  timestamp: string; // e.g. "09:31:02"
  elapsedSeconds: number;
  event: string;
  type: 'action' | 'hazard' | 'decision' | 'violation' | 'milestone';
  isError?: boolean;
  notes?: string;
}

export interface AssessmentRecord {
  id: string;
  workerId: string;
  workerName: string;
  scenarioId: string;
  scenarioName: string;
  domain: SafetyDomain;
  attempt: number; // 1, 2, or 3
  score: number;
  passThreshold: number;
  passed: boolean;
  date: string;
  timestamp?: string;
  breachedRules?: string[];
  responseDurationSeconds: number;
  criticalViolations: number;
  mcqScore: number; // 0 - 100
  actionSequenceAccuracy: number; // 0 - 100
  weakDomain?: string;
  integrityFlag?: string;
  timeline: TimelineAction[];
  liteRtInsight?: string;
}

export interface Certificate {
  id: string; // e.g. "CERT-2026-GLCS-W104"
  workerId: string;
  workerName: string;
  moduleName: string;
  competencyLevel: CompetencyLevel;
  issueDate: string;
  expiryDate: string;
  digitalSignature: string; // ED25519 / RSA hex
  sha256Hash: string;
  issuer: string;
  verificationStatus: 'Valid' | 'Under Review' | 'Revoked' | 'Expired' | 'Expiring Soon';
  status?: 'Valid' | 'Under Review' | 'Revoked' | 'Expired' | 'Expiring Soon' | string;
  qrPayload: string;
}

export type CertificateRecord = Certificate;

export interface IntegrityFlagRecord {
  id: string;
  workerId: string;
  workerName: string;
  assessmentId: string;
  timestamp: string;
  flagType: 
    | 'Randomized scenario mismatch'
    | 'Identity re-verification issue'
    | 'Response time anomaly'
    | 'Repeated sequence error'
    | 'Head tracking occlusion';
  description: string;
  riskScore: 'Low' | 'Medium' | 'High';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Open Flag' | 'Under Review' | 'Cleared' | 'Reassessment Requested';
  supervisorNotes?: string;
  reviewedBy?: string;
}

export type IntegrityFlag = IntegrityFlagRecord;

export interface ScenarioModule {
  id: string;
  name: string;
  domain: SafetyDomain;
  hazardType: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  environment: string;
  requiredActions: string[];
  criticalRules: string[];
  passThreshold: number;
  randomizationVariants: number;
  trainingMode: boolean;
  assessmentMode: boolean;
  languageAvailability: string[];
  version: string;
  lastApprovedBy: string;
  status: 'Active' | 'Under Revision' | 'Disabled';
  estimatedMinutes?: number;
  targetRoles?: string[];
  learningObjectives?: string[];
  criticalPassCriteria?: string[];
}

export interface SyncRecord {
  id: string;
  deviceId: string;
  workerId: string;
  workerName: string;
  syncTimestamp: string;
  status: 'Synchronized' | 'Pending' | 'Failed' | 'Completed';
  recordsCount: number;
  networkTransport: 'Surface Wi-Fi Mesh' | 'Substation Docking Station' | 'Direct Gateway';
  payloadSizeKb: number;
}

export interface RemediationQueueItem {
  id: string;
  workerId: string;
  workerName: string;
  site: string;
  skillGap: string;
  recommendedModule: string;
  attemptCount: number; // 1, 2, or 3
  attemptNumber?: number;
  status: 'Remediation Pending' | 'Training Assigned' | 'Reassessment Ready' | 'Supervisor Review Required';
  lastAttemptScore: number;
  assignedDate?: string;
  moduleName?: string;
  failedScenarioId?: string;
  lastScore?: number;
  attemptStage?: string;
}

export type AuditCategory = 'SECURITY' | 'RBAC' | 'COMPLIANCE' | 'OPERATIONAL' | 'INTEGRITY';
export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  target: string;
  previousState: string;
  newState: string;
  ipAddress: string;
  category?: AuditCategory;
  severity?: AuditSeverity;
  hash?: string;
  previousHash?: string;
}

export interface SystemHealthState {
  apiStatus: 'Operational' | 'Degraded' | 'Down';
  databaseStatus: 'Operational' | 'Degraded' | 'Down';
  mcpStatus: 'Connected' | 'Reconnecting' | 'Down';
  aiServiceStatus: 'Operational' | 'Rate Limited' | 'Degraded';
  syncQueue: number;
  storageUsagePct: number;
  backgroundJobs: number;
  lastBackup: string;
  activeWorkersCount: number;
}

export interface McpToolCall {
  toolName: string;
  parameters: Record<string, unknown>;
  timestamp: string;
  resultSummary: string;
  executionTimeMs?: number;
  citations?: string[];
  data?: any;
}

export interface AiAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  text?: string;
  isRefusal?: boolean;
  evidence?: {
    metric: string;
    value: string;
    source: string;
  }[];
  recommendation?: string;
  suggestedActions?: {
    label: string;
    actionKey: string;
    params?: Record<string, unknown>;
  }[];
  toolCalls?: McpToolCall[];
  isProcessing?: boolean;
}
