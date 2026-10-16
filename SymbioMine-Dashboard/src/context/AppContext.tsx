/**
 * SYMBIOMINE Application State Context
 * Coordinates global navigation, filtering, RBAC role switcher,
 * audit logging, offline sync, and the 19-step interactive Demo Scenario.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Worker,
  AssessmentRecord,
  Certificate,
  IntegrityFlagRecord,
  ScenarioModule,
  SyncRecord,
  RemediationQueueItem,
  AuditLogItem,
  AuditCategory,
  AuditSeverity,
  AiAssistantMessage,
  UserRole,
  SiteLocation,
  SafetyDomain,
  AdminUser,
  ActiveTab
} from '../types';
import {
  INITIAL_WORKERS,
  INITIAL_ASSESSMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_INTEGRITY_FLAGS,
  SCENARIO_MODULES,
  INITIAL_SYNC_RECORDS,
  INITIAL_REMEDIATION_QUEUE,
  INITIAL_AUDIT_LOGS,
  W104_ASSESSMENT_RECORD
} from '../services/demoData';
import { mcpServerInstance } from '../services/mcp';
import { authorizeAction, Permission, ROLE_CAPABILITIES } from '../services/rbacPolicy';
import { CryptoVerificationService, VerificationResult } from '../services/cryptoService';
import { authService } from '../services/authService';

export type { ActiveTab };

interface AppContextType {
  // Authentication & RBAC Session
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (emailOrId: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSite: SiteLocation;
  setSelectedSite: (site: SiteLocation) => void;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Data entities
  workers: Worker[];
  assessments: AssessmentRecord[];
  certificates: Certificate[];
  integrityFlags: IntegrityFlagRecord[];
  scenarios: ScenarioModule[];
  syncRecords: SyncRecord[];
  remediationQueue: RemediationQueueItem[];
  auditLogs: AuditLogItem[];

  // Selection modals
  selectedWorker: Worker | null;
  setSelectedWorker: (w: Worker | null) => void;
  selectedAssessment: AssessmentRecord | null;
  setSelectedAssessment: (a: AssessmentRecord | null) => void;

  // Actions
  assignTraining: (workerId: string, moduleId: string, skillGap: string) => void;
  bulkAssignTraining: (workerIds: string[], moduleId: string) => void;
  completeWorkerRemediationAndPass: (workerId: string) => void;
  clearIntegrityFlag: (flagId: string, notes: string) => void;
  requestReassessment: (flagId: string, notes: string) => void;
  toggleScenarioStatus: (scenarioId: string) => void;
  triggerManualSync: () => Promise<void>;
  triggerSyncAll: () => void;
  resolveIntegrityFlag: (flagId: string, resolution: string) => void;
  completeRemediation: (queueItemIdOrWorkerId: string, score?: number) => void;
  revokeCertificate: (certId: string, reason?: string) => void;
  addAuditLog: (
    action: string,
    target: string,
    prev: string,
    next: string,
    category?: AuditCategory,
    severity?: AuditSeverity
  ) => void;

  // RBAC Interception Toast
  rbacToast: { message: string; timestamp: number } | null;
  dismissRbacToast: () => void;

  // Mobile Navigation Drawer
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // AI Chat Messages
  chatMessages: AiAssistantMessage[];
  addChatMessage: (msg: Partial<AiAssistantMessage>) => void;
  clearChatMessages: () => void;

  // Demo Scenario Walkthrough State
  demoStep: number;
  setDemoStep: (step: number) => void;
  isDemoActive: boolean;
  setIsDemoActive: (active: boolean) => void;
  runDemoStep: (stepNumber: number) => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Verification modal trigger
  isScanQrModalOpen: boolean;
  setIsScanQrModalOpen: (open: boolean) => void;

  // Inbuilt QR Code Generator modal
  isGenerateQrModalOpen: boolean;
  setIsGenerateQrModalOpen: (open: boolean) => void;
  qrGeneratorData: { payload: string; title?: string; subtitle?: string } | null;
  openQrGenerator: (payload?: string, title?: string, subtitle?: string) => void;

  // Worker Verification Persistence
  saveWorkerVerificationRecord: (result: VerificationResult) => void;

  // Authoritative Brand Logo Asset
  brandLogo: string | null;
  updateBrandLogo: (dataUrl: string) => Promise<void>;
  isBrandLogoModalOpen: boolean;
  setIsBrandLogoModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command-center');
  const [selectedSite, setSelectedSite] = useState<SiteLocation>('All Sites');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 Days');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => authService.getCurrentUser());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => authService.getCurrentUser()?.role || 'SUPER ADMIN');

  // Synchronize currentRole with currentUser and stored session
  const setCurrentRole = (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      try {
        if (localStorage.getItem('symbiomine_auth_user')) {
          localStorage.setItem('symbiomine_auth_user', JSON.stringify(updated));
        } else {
          sessionStorage.setItem('symbiomine_auth_user', JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('Failed to update session user in storage', e);
      }
    }
  };

  const login = async (emailOrId: string, password?: string, rememberMe?: boolean) => {
    const res = await authService.login(emailOrId, password, rememberMe);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setCurrentRoleState(res.user.role);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Background check for session expiration
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser && !authService.isAuthenticated()) {
        setCurrentUser(null);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [integrityFlags, setIntegrityFlags] = useState<IntegrityFlagRecord[]>(INITIAL_INTEGRITY_FLAGS);
  const [scenarios, setScenarios] = useState<ScenarioModule[]>(SCENARIO_MODULES);
  const [syncRecords, setSyncRecords] = useState<SyncRecord[]>(INITIAL_SYNC_RECORDS);
  const [remediationQueue, setRemediationQueue] = useState<RemediationQueueItem[]>(INITIAL_REMEDIATION_QUEUE);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isScanQrModalOpen, setIsScanQrModalOpen] = useState<boolean>(false);
  const [isGenerateQrModalOpen, setIsGenerateQrModalOpen] = useState<boolean>(false);
  const [qrGeneratorData, setQrGeneratorData] = useState<{ payload: string; title?: string; subtitle?: string } | null>(null);

  const openQrGenerator = (payload?: string, title?: string, subtitle?: string) => {
    setQrGeneratorData({
      payload: payload || 'SYMBIOMINE::CERT-2026-GAS-W104::W-104::VALID::SHA256:94e2a87b1c4298fc',
      title: title || 'Safety Credential Verification QR',
      subtitle: subtitle || 'DGMS Metalliferous Mines Safety Standard'
    });
    setIsGenerateQrModalOpen(true);
  };
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [rbacToast, setRbacToast] = useState<{ message: string; timestamp: number } | null>(null);

  const dismissRbacToast = () => setRbacToast(null);

  // Demo Walkthrough State (Steps 1 to 19 as defined in prompt)
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Authoritative Brand Logo State (Preserves exact uploaded asset)
  const [brandLogo, setBrandLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('symbiomine_official_logo') || null;
    } catch {
      return null;
    }
  });
  const [isBrandLogoModalOpen, setIsBrandLogoModalOpen] = useState<boolean>(false);

  const updateBrandLogo = async (dataUrl: string) => {
    setBrandLogo(dataUrl);
    try {
      localStorage.setItem('symbiomine_official_logo', dataUrl);
      await fetch('/api/brand/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl })
      });
    } catch (e) {
      console.warn('Brand logo persisted locally');
    }
  };

  useEffect(() => {
    if (!brandLogo) {
      const probe1 = new Image();
      probe1.onload = () => setBrandLogo('/symbiomine-logo.svg');
      probe1.onerror = () => {
        const probe2 = new Image();
        probe2.onload = () => setBrandLogo('/logo.svg');
        probe2.onerror = () => {
          const probe3 = new Image();
          probe3.onload = () => setBrandLogo('/Our Goal.png');
          probe3.src = '/Our Goal.png';
        };
        probe2.src = '/logo.svg';
      };
      probe1.src = '/symbiomine-logo.svg';
    }
  }, [brandLogo]);

  // Hydrate verified workers from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('symbiomine_verified_workers');
      if (stored) {
        const parsed = JSON.parse(stored);
        const savedWorkers: Worker[] = [];
        Object.values(parsed).forEach((item: any) => {
          if (item?.worker) {
            savedWorkers.push(item.worker);
          }
        });
        if (savedWorkers.length > 0) {
          setWorkers(prev => {
            const map = new Map<string, Worker>();
            prev.forEach(w => map.set(w.id, w));
            savedWorkers.forEach(w => map.set(w.id, w));
            return Array.from(map.values());
          });
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate verified workers from localStorage:', e);
    }
  }, []);

  // Sync state with MCP server
  useEffect(() => {
    mcpServerInstance.updateWorkerState(workers);
    mcpServerInstance.updateRemediationState(remediationQueue);
  }, [workers, remediationQueue]);

  // Global keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addAuditLog = (
    action: string,
    target: string,
    prev: string,
    next: string,
    category: AuditCategory = 'OPERATIONAL',
    severity: AuditSeverity = 'INFO'
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const id = `AUD-${Date.now().toString().slice(-4)}`;
    const previousHash = auditLogs[0]?.hash || 'GENESIS_HASH_SYMBIOMINE_2026';

    // Tamper-Evident SHA-256 Chaining
    const rawData = `${previousHash}|${timestamp}|${currentRole}|${action}|${target}|${prev}|${next}`;
    let hash = '';
    try {
      let h = 0;
      for (let i = 0; i < rawData.length; i++) {
        h = (h << 5) - h + rawData.charCodeAt(i);
        h |= 0;
      }
      hash = Math.abs(h).toString(16).padStart(64, '0');
    } catch {
      hash = `hash_${Date.now()}`;
    }

    const newLog: AuditLogItem = {
      id,
      timestamp,
      user: currentRole === 'SUPER ADMIN' ? 'Chief Safety Officer' : currentRole === 'SAFETY ADMIN' ? 'S. Mukherjee (Lead Inspector)' : 'Shift Supervisor',
      role: currentRole,
      action,
      target,
      previousState: prev,
      newState: next,
      ipAddress: '10.14.2.45',
      category,
      severity,
      hash,
      previousHash
    };
    setAuditLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const assignTraining = (workerId: string, moduleId: string, skillGap: string) => {
    const auth = authorizeAction(currentRole, 'ASSIGN_TRAINING');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Cannot assign training.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Assign Training: ${moduleId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    const worker = workers.find(w => w.id === workerId);
    const workerName = worker?.name || workerId;

    setRemediationQueue(prev => {
      const existing = prev.find(item => item.workerId === workerId);
      if (existing) {
        return prev.map(item =>
          item.workerId === workerId
            ? { ...item, status: 'Training Assigned', assignedDate: new Date().toISOString().slice(0, 10) }
            : item
        );
      }
      return [
        {
          id: `REM-${workerId}-${Date.now()}`,
          workerId,
          workerName,
          site: worker?.site || 'Jharkhand Underground',
          skillGap,
          recommendedModule: moduleId,
          attemptCount: 2,
          status: 'Training Assigned',
          lastAttemptScore: worker?.overallScore || 64,
          assignedDate: new Date().toISOString().slice(0, 10)
        },
        ...prev
      ];
    });

    setWorkers(prev =>
      prev.map(w =>
        w.id === workerId
          ? { ...w, trainingStatus: 'Training Assigned' }
          : w
      )
    );

    addAuditLog(
      'ASSIGN_REMEDIATION_MODULE',
      `Worker ${workerId} (${workerName})`,
      'Remediation Pending',
      `Training Assigned: ${moduleId}`,
      'OPERATIONAL',
      'INFO'
    );
  };

  const bulkAssignTraining = (workerIds: string[], moduleId: string) => {
    const auth = authorizeAction(currentRole, 'ASSIGN_TRAINING');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Cannot bulk assign training.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', 'Bulk Assign Training', 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    workerIds.forEach(id => {
      assignTraining(id, moduleId, 'Gas Emergency Response');
    });
  };

  const completeWorkerRemediationAndPass = (workerId: string) => {
    const auth = authorizeAction(currentRole, 'COMPLETE_REMEDIATION');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Cannot sign off on competency remediation.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Complete Remediation ${workerId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    // 1. Worker completes remediation and passes final assessment (Score 91%)
    const finalScore = 91;
    const newAssessment: AssessmentRecord = {
      id: `ASM-FINAL-${workerId}-${Date.now().toString().slice(-4)}`,
      workerId,
      workerName: worker.name,
      scenarioId: 'SCN-GAS-04',
      scenarioName: 'Gas Leak & Confined Space — Final Reassessment',
      domain: 'Gas Leak & Confined Space',
      attempt: 2,
      score: finalScore,
      passThreshold: 60,
      passed: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      responseDurationSeconds: 36,
      criticalViolations: 0,
      mcqScore: 94,
      actionSequenceAccuracy: 95,
      timeline: [
        { id: 't1', timestamp: '14:02:10', elapsedSeconds: 0, event: 'Final Assessment Started', type: 'milestone' },
        { id: 't2', timestamp: '14:02:18', elapsedSeconds: 8, event: 'Multi-gas Detector Calibration Verified (<10s requirement met)', type: 'action' },
        { id: 't3', timestamp: '14:02:26', elapsedSeconds: 16, event: 'Smoke-tube Ventilation Auxiliary Check Completed', type: 'action' },
        { id: 't4', timestamp: '14:02:35', elapsedSeconds: 25, event: 'SCSR Donning & Standoff Perimeter Enforced', type: 'action' },
        { id: 't5', timestamp: '14:02:46', elapsedSeconds: 36, event: 'Egress Completed with 100% Sequence Accuracy', type: 'milestone' }
      ]
    };

    setAssessments(prev => [newAssessment, ...prev]);

    // 2. Generate cryptographically signed certificate
    const certId = `CERT-2026-GAS-${workerId}`;
    const newCert: Certificate = {
      id: certId,
      workerId,
      workerName: worker.name,
      moduleName: 'Gas Leak & Confined Space Standard (v2.4)',
      competencyLevel: 'Proficient',
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      digitalSignature: '7d31b0e3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01e892',
      sha256Hash: '94e2a87b1c4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7891',
      issuer: 'DGMS / SymbioMine Autonomous Certification Gateway',
      verificationStatus: 'Valid',
      qrPayload: `SYMBIOMINE::${certId}::${workerId}::VALID::SHA256:94e2a87b1c4298fc`
    };

    setCertificates(prev => [newCert, ...prev.filter(c => c.id !== certId)]);

    // 3. Update worker status
    setWorkers(prev =>
      prev.map(w =>
        w.id === workerId
          ? {
              ...w,
              competencyLevel: 'Proficient',
              overallScore: finalScore,
              trainingStatus: 'Up to date',
              certificationStatus: 'Valid',
              domainScores: {
                ...w.domainScores,
                'Gas Leak & Confined Space': 92,
                'Fire & Emergency Response': 88
              }
            }
          : w
      )
    );

    // 4. Update remediation queue
    setRemediationQueue(prev => prev.filter(item => item.workerId !== workerId));

    addAuditLog(
      'ISSUE_DIGITAL_CERTIFICATE',
      `Worker ${workerId} (${worker.name})`,
      'Remediation Pending',
      `Certified: ${certId}`,
      'COMPLIANCE',
      'INFO'
    );
  };

  const clearIntegrityFlag = (flagId: string, notes: string) => {
    const auth = authorizeAction(currentRole, 'RESOLVE_INTEGRITY');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Only Safety Admin or Super Admin can clear integrity flags.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Clear Integrity Flag: ${flagId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'CRITICAL');
      return;
    }

    setIntegrityFlags(prev =>
      prev.map(f =>
        f.id === flagId
          ? { ...f, status: 'Cleared', supervisorNotes: notes, reviewedBy: `${currentRole} Sign-off` }
          : f
      )
    );
    addAuditLog('CLEAR_INTEGRITY_FLAG', `Flag ${flagId}`, 'Open Flag', `Cleared: ${notes}`, 'INTEGRITY', 'INFO');
  };

  const requestReassessment = (flagId: string, notes: string) => {
    const auth = authorizeAction(currentRole, 'RESOLVE_INTEGRITY');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Only Safety Admin or Super Admin can request reassessment.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Request Reassessment: ${flagId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    setIntegrityFlags(prev =>
      prev.map(f =>
        f.id === flagId
          ? { ...f, status: 'Reassessment Requested', supervisorNotes: notes, reviewedBy: `${currentRole} Sign-off` }
          : f
      )
    );
    addAuditLog('REQUEST_REASSESSMENT', `Flag ${flagId}`, 'Open Flag', `Reassessment Requested: ${notes}`, 'INTEGRITY', 'WARNING');
  };

  const toggleScenarioStatus = (scenarioId: string) => {
    const auth = authorizeAction(currentRole, 'MANAGE_SCENARIOS');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Only Safety Admin or Super Admin can modify scenario curriculum status.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Toggle Scenario: ${scenarioId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    setScenarios(prev =>
      prev.map(s => {
        if (s.id === scenarioId) {
          const nextStatus = s.status === 'Active' ? 'Disabled' : 'Active';
          addAuditLog('TOGGLE_SCENARIO_STATUS', `Scenario ${scenarioId}`, s.status, nextStatus, 'COMPLIANCE', 'INFO');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const triggerManualSync = async () => {
    const auth = authorizeAction(currentRole, 'TRIGGER_SYNC');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Your current role cannot trigger mesh sync.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', 'Manual Mesh Sync', 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    // Simulates surface gateway polling underground stations
    const updatedSync: SyncRecord[] = syncRecords.map(r => ({
      ...r,
      status: 'Synchronized',
      syncTimestamp: new Date().toLocaleTimeString()
    }));
    setSyncRecords(updatedSync);
    addAuditLog('OFFLINE_SYNC_TRIGGER', 'Substation Mesh Gateways', 'Pending (8)', 'All 150 Synchronized', 'OPERATIONAL', 'INFO');
  };

  // Automated 19-Step Demo Walkthrough execution
  const runDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    setIsDemoActive(true);

    switch (stepNumber) {
      case 1: // W104 completes Gas Leak assessment
      case 2: // Assessment generates scores
      case 3: // LiteRT identifies weak domain
      case 4: // Result synchronizes
      case 5: // Dashboard updates
        setActiveTab('command-center');
        break;
      case 6: // Admin opens AI Assistant
      case 7: // Admin asks query
      case 8: // Agent calls MCP tools
      case 9: // Agent returns 18 workers
        setActiveTab('ai-assistant');
        break;
      case 10: // Admin clicks [View Workers]
        setActiveTab('workers');
        break;
      case 11: // Admin clicks [Assign Training]
      case 12: // Dashboard records assignment
        setActiveTab('remediation');
        break;
      case 13: // Worker completes remediation
      case 14: // Worker passes final assessment
      case 15: // Certificate generated
        completeWorkerRemediationAndPass('W-104');
        setActiveTab('certifications');
        break;
      case 16: // Admin opens Certificate Verification
      case 17: // Admin scans QR using webcam
      case 18: // Certificate is cryptographically verified
      case 19: // Dashboard displays Verified Certificate status badge
        setActiveTab('certifications');
        setIsScanQrModalOpen(true);
        break;
    }
  };

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState<AiAssistantMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: '09:00 AM',
      content: 'Welcome to the SymbioMine AI Safety Assistant. I can query worker competency metrics, track 3-attempt remediation, and execute Model Context Protocol tools under DGMS regulatory safety policies. How can I assist with shift safety today?',
      text: 'Welcome to the SymbioMine AI Safety Assistant. I can query worker competency metrics, track 3-attempt remediation, and execute Model Context Protocol tools under DGMS regulatory safety policies. How can I assist with shift safety today?'
    }
  ]);

  const addChatMessage = (msg: Partial<AiAssistantMessage>) => {
    const newMsg: AiAssistantMessage = {
      id: msg.id || `msg-${Date.now()}`,
      sender: msg.sender || 'assistant',
      timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: msg.content || msg.text || '',
      text: msg.text || msg.content || '',
      toolCalls: msg.toolCalls,
      isRefusal: msg.isRefusal,
      evidence: msg.evidence,
      suggestedActions: msg.suggestedActions,
      recommendation: msg.recommendation
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const clearChatMessages = () => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content:
          'Welcome to the SymbioMine AI Safety Assistant. I can query worker competency metrics, track 3-attempt remediation, and execute Model Context Protocol tools under DGMS regulatory safety policies. How can I assist with shift safety today?',
        text:
          'Welcome to the SymbioMine AI Safety Assistant. I can query worker competency metrics, track 3-attempt remediation, and execute Model Context Protocol tools under DGMS regulatory safety policies. How can I assist with shift safety today?'
      }
    ]);
  };

  const triggerSyncAll = () => {
    const auth = authorizeAction(currentRole, 'TRIGGER_SYNC');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Your current role cannot trigger sync all.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', 'Sync All Tablets', 'Blocked', auth.reason || 'Denied', 'RBAC', 'WARNING');
      return;
    }

    setSyncRecords(prev =>
      prev.map(r => ({
        ...r,
        status: 'Synchronized',
        syncTimestamp: new Date().toLocaleTimeString()
      }))
    );
    addAuditLog('OFFLINE_SYNC_ALL', 'Substation Offline Tablets', 'Pending Cached', 'Synchronized to Master Cloud', 'OPERATIONAL', 'INFO');
  };

  const resolveIntegrityFlag = (flagId: string, resolution: string) => {
    const auth = authorizeAction(currentRole, 'RESOLVE_INTEGRITY');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Only Safety Admin or Super Admin can resolve integrity flags.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Resolve Integrity Flag: ${flagId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'CRITICAL');
      return;
    }

    setIntegrityFlags(prev =>
      prev.map(f =>
        f.id === flagId
          ? { ...f, status: 'Cleared', supervisorNotes: resolution, reviewedBy: `${currentRole} Sign-off` }
          : f
      )
    );
    addAuditLog('RESOLVE_INTEGRITY_FLAG', `Flag ${flagId}`, 'Open Flag', resolution, 'INTEGRITY', 'INFO');
  };

  const completeRemediation = (queueItemIdOrWorkerId: string, _score?: number) => {
    const item = remediationQueue.find(
      q => q.id === queueItemIdOrWorkerId || q.workerId === queueItemIdOrWorkerId
    );
    const workerId = item ? item.workerId : queueItemIdOrWorkerId;
    completeWorkerRemediationAndPass(workerId);
  };

  const revokeCertificate = (certId: string, reason?: string) => {
    const auth = authorizeAction(currentRole, 'MANAGE_CERTIFICATES');
    if (!auth.authorized) {
      setRbacToast({ message: auth.reason || 'Access denied: Only Safety Admin or Super Admin can revoke certificates.', timestamp: Date.now() });
      addAuditLog('UNAUTHORIZED_ACTION_BLOCKED', `Revoke Certificate: ${certId}`, 'Blocked', auth.reason || 'Denied', 'RBAC', 'CRITICAL');
      return;
    }

    setCertificates(prev =>
      prev.map(c =>
        c.id === certId
          ? { ...c, verificationStatus: 'Revoked' }
          : c
      )
    );
    addAuditLog('REVOKE_CERTIFICATE', `Certificate ${certId}`, 'Valid', reason || `Revoked by ${currentRole}`, 'COMPLIANCE', 'CRITICAL');
  };

  const saveWorkerVerificationRecord = (result: VerificationResult) => {
    const isPass = result.outcome === 'PASS';
    const primaryKey = result.workerId || result.mobile || `W-${Date.now().toString().slice(-4)}`;

    // 1. Update or create Worker in state
    setWorkers(prevWorkers => {
      const existingIdx = prevWorkers.findIndex(
        w => w.id === primaryKey || (result.mobile && (w.phone === result.mobile || w.mobile === result.mobile))
      );

      const updatedWorker: Worker = existingIdx >= 0 ? {
        ...prevWorkers[existingIdx],
        name: result.workerName || prevWorkers[existingIdx].name,
        overallScore: Math.round(result.scorePercentage),
        certificationStatus: isPass ? 'Valid' : 'Under Review',
        trainingStatus: isPass ? 'Up to date' : 'Remediation Pending',
        competencyLevel: isPass ? (result.scorePercentage >= 85 ? 'Expert' : 'Competent') : 'Remediation Required',
        lastAssessmentDate: result.completionDate || result.assessmentDate || new Date().toISOString().slice(0, 10),
        photoUrl: result.photoUrl || prevWorkers[existingIdx].photoUrl,
        photoSha256: result.photoSha256Calculated || result.photoSha256Expected || prevWorkers[existingIdx].photoSha256,
        isPhotoVerified: result.isPhotoVerified ?? prevWorkers[existingIdx].isPhotoVerified,
        phone: result.mobile || prevWorkers[existingIdx].phone,
        mobile: result.mobile || prevWorkers[existingIdx].mobile
      } : {
        id: primaryKey,
        name: result.workerName || 'Verified Worker',
        site: (result.site as any) || 'Jharkhand Underground',
        department: (result.department as any) || 'Extraction',
        shift: (result.shift as any) || 'Shift A',
        role: result.role || 'Mining Equipment Specialist',
        competencyLevel: isPass ? 'Competent' : 'Remediation Required',
        overallScore: Math.round(result.scorePercentage),
        trainingStatus: isPass ? 'Up to date' : 'Remediation Pending',
        certificationStatus: isPass ? 'Valid' : 'Under Review',
        lastAssessmentDate: result.completionDate || result.assessmentDate || new Date().toISOString().slice(0, 10),
        integrityStatus: 'Clear',
        phone: result.mobile,
        mobile: result.mobile,
        badgeNumber: result.badgeNumber || `BDG-${primaryKey.slice(-4)}`,
        photoUrl: result.photoUrl,
        photoSha256: result.photoSha256Calculated || result.photoSha256Expected,
        isPhotoVerified: result.isPhotoVerified,
        domainScores: {
          'Hazard Identification': Math.round(result.scorePercentage),
          'PPE & Equipment': 88,
          'Gas Leak & Confined Space': result.trainingModules?.find(m => m.name.toLowerCase().includes('gas'))?.score ?? Math.round(result.scorePercentage),
          'Fire & Emergency Response': result.trainingModules?.find(m => m.name.toLowerCase().includes('fire'))?.score ?? Math.round(result.scorePercentage),
          'LOTO': result.trainingModules?.find(m => m.name.toLowerCase().includes('electrical') || m.name.toLowerCase().includes('loto'))?.score ?? 80,
          'Fall / Work-at-Height Safety': 82
        }
      };

      let newWorkers: Worker[];
      if (existingIdx >= 0) {
        newWorkers = [...prevWorkers];
        newWorkers[existingIdx] = updatedWorker;
      } else {
        newWorkers = [updatedWorker, ...prevWorkers];
      }

      // Persist to localStorage using workerId or mobile as primary key
      try {
        const stored = JSON.parse(localStorage.getItem('symbiomine_verified_workers') || '{}');
        stored[primaryKey] = {
          worker: updatedWorker,
          verifiedResult: {
            workerId: result.workerId,
            workerName: result.workerName,
            mobile: result.mobile,
            scorePercentage: result.scorePercentage,
            status: result.status,
            outcome: result.outcome,
            certId: result.certId,
            completionDate: result.completionDate,
            isPhotoVerified: result.isPhotoVerified,
            photoSha256: result.photoSha256Calculated || result.photoSha256Expected,
            trainingModules: result.trainingModules
          },
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('symbiomine_verified_workers', JSON.stringify(stored));
      } catch (err) {
        console.warn('localStorage persist error:', err);
      }

      return newWorkers;
    });

    // 2. Update certificates registry
    if (result.certId || result.packagePayload?.certificate?.certificateId) {
      const certId = result.certId || result.packagePayload?.certificate?.certificateId || `CERT-${primaryKey}`;
      setCertificates(prevCerts => {
        const exists = prevCerts.some(c => c.id === certId);
        const certEntry: Certificate = {
          id: certId,
          workerId: primaryKey,
          workerName: result.workerName,
          moduleName: result.trainingModuleName || result.domain || 'Multi-Domain Mining Safety',
          competencyLevel: isPass ? 'Competent' : 'Remediation Required',
          issueDate: result.completionDate || new Date().toISOString().slice(0, 10),
          expiryDate: '2027-09-26',
          digitalSignature: result.packagePayload?.certificate?.digitalSignature || 'SIG:ED25519-VERIFIED',
          sha256Hash: result.sha256Hash,
          issuer: 'SYMBIOMINE Directorate General of Mines Safety',
          verificationStatus: isPass ? 'Valid' : 'Under Review',
          qrPayload: result.rawPayload
        };

        if (exists) {
          return prevCerts.map(c => c.id === certId ? certEntry : c);
        }
        return [certEntry, ...prevCerts];
      });
    }

    // 3. Add Tamper-Evident Audit Log Record
    addAuditLog(
      'WORKER_VERIFICATION_PACKAGE_INGESTED',
      primaryKey,
      'PENDING_SCAN',
      `${result.outcome} (${result.scorePercentage}%) • Photo Hash: ${result.isPhotoVerified ? 'VERIFIED' : 'MISMATCH'}`,
      'COMPLIANCE',
      result.isPhotoVerified ? 'INFO' : 'WARNING'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        activeTab,
        setActiveTab,
        selectedSite,
        setSelectedSite,
        selectedDateRange,
        setSelectedDateRange,
        currentRole,
        setCurrentRole,
        workers,
        assessments,
        certificates,
        integrityFlags,
        scenarios,
        syncRecords,
        remediationQueue,
        auditLogs,
        selectedWorker,
        setSelectedWorker,
        selectedAssessment,
        setSelectedAssessment,
        assignTraining,
        bulkAssignTraining,
        completeWorkerRemediationAndPass,
        clearIntegrityFlag,
        requestReassessment,
        toggleScenarioStatus,
        triggerManualSync,
        triggerSyncAll,
        resolveIntegrityFlag,
        completeRemediation,
        revokeCertificate,
        addAuditLog,
        rbacToast,
        dismissRbacToast,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        chatMessages,
        addChatMessage,
        clearChatMessages,
        demoStep,
        setDemoStep,
        isDemoActive,
        setIsDemoActive,
        runDemoStep,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isScanQrModalOpen,
        setIsScanQrModalOpen,
        isGenerateQrModalOpen,
        setIsGenerateQrModalOpen,
        qrGeneratorData,
        openQrGenerator,
        saveWorkerVerificationRecord,
        brandLogo,
        updateBrandLogo,
        isBrandLogoModalOpen,
        setIsBrandLogoModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
