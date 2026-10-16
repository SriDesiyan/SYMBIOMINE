/**
 * SYMBIOMINE Role-Based Access Control (RBAC) Matrix
 * Governs capability boundaries across industrial safety roles.
 */

import { UserRole, ActiveTab } from '../types';

export type Permission =
  | 'MANAGE_CERTIFICATES'
  | 'MANAGE_SCENARIOS'
  | 'RESOLVE_INTEGRITY'
  | 'ASSIGN_TRAINING'
  | 'COMPLETE_REMEDIATION'
  | 'TRIGGER_SYNC'
  | 'VIEW_AUDIT_LOGS'
  | 'EXPORT_REPORTS'
  | 'OVERRIDE_CONFIG'
  | 'EXECUTE_AI_DIRECTIVES'
  | 'MANAGE_ADMINS'
  | 'VIEW_SECURITY_AUDIT';

export interface RoleCapability {
  role: UserRole;
  title: string;
  description: string;
  badgeColor: string;
  permissions: Permission[];
  authorizedTabs: ActiveTab[];
}

export const ROLE_CAPABILITIES: Record<UserRole, RoleCapability> = {
  'SUPER ADMIN': {
    role: 'SUPER ADMIN',
    title: 'Enterprise Safety Director & Super Admin',
    description: 'Unrestricted administrative authority across all mine divisions, admin credentials provisioning, security audit, and statutory safety policies.',
    badgeColor: 'bg-purple-900/80 text-purple-200 border-purple-700',
    permissions: [
      'MANAGE_CERTIFICATES',
      'MANAGE_SCENARIOS',
      'RESOLVE_INTEGRITY',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'TRIGGER_SYNC',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
      'OVERRIDE_CONFIG',
      'EXECUTE_AI_DIRECTIVES',
      'MANAGE_ADMINS',
      'VIEW_SECURITY_AUDIT'
    ],
    authorizedTabs: [
      'command-center',
      'workers',
      'competency',
      'remediation',
      'assessments',
      'certifications',
      'integrity',
      'scenarios',
      'ai-assistant',
      'mcp-tools',
      'ai-approvals',
      'qr-verification',
      'sync-center',
      'reports',
      'system-health',
      'admin-management',
      'security-audit'
    ]
  },
  'ADMINISTRATOR': {
    role: 'ADMINISTRATOR',
    title: 'Industrial Safety Administrator',
    description: 'Workforce management, training monitoring, assessment records, certificates, and QR verification.',
    badgeColor: 'bg-indigo-900/80 text-indigo-200 border-indigo-700',
    permissions: [
      'MANAGE_CERTIFICATES',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS'
    ],
    authorizedTabs: [
      'command-center',
      'workers',
      'remediation',
      'competency',
      'assessments',
      'certifications',
      'qr-verification'
    ]
  },
  'ADMIN': {
    role: 'ADMIN',
    title: 'Industrial Safety Administrator',
    description: 'Workforce management, training monitoring, assessment records, certificates, and QR verification.',
    badgeColor: 'bg-indigo-900/80 text-indigo-200 border-indigo-700',
    permissions: [
      'MANAGE_CERTIFICATES',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS'
    ],
    authorizedTabs: [
      'command-center',
      'workers',
      'remediation',
      'competency',
      'assessments',
      'certifications',
      'qr-verification'
    ]
  },
  'TRAINING ADMIN': {
    role: 'TRAINING ADMIN',
    title: 'Training Administrator',
    description: 'Training modules, scenario management, MCQ/question bank, assessment configuration, and training performance.',
    badgeColor: 'bg-emerald-900/80 text-emerald-200 border-emerald-700',
    permissions: [
      'MANAGE_SCENARIOS',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS'
    ],
    authorizedTabs: [
      'command-center',
      'scenarios',
      'assessments',
      'competency',
      'remediation'
    ]
  },
  'TRAINING ADMIN / OPERATOR': {
    role: 'TRAINING ADMIN / OPERATOR',
    title: 'Training Administrator',
    description: 'Training modules, scenario management, MCQ/question bank, assessment configuration, and training performance.',
    badgeColor: 'bg-emerald-900/80 text-emerald-200 border-emerald-700',
    permissions: [
      'MANAGE_SCENARIOS',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS'
    ],
    authorizedTabs: [
      'command-center',
      'scenarios',
      'assessments',
      'competency',
      'remediation'
    ]
  },
  'AUDITOR': {
    role: 'AUDITOR',
    title: 'Statutory Safety Auditor',
    description: 'Assessment records, digital credentials, QR verification, audit logs, and read-only compliance information.',
    badgeColor: 'bg-amber-900/80 text-amber-200 border-amber-700',
    permissions: [
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
      'VIEW_SECURITY_AUDIT'
    ],
    authorizedTabs: [
      'command-center',
      'assessments',
      'certifications',
      'qr-verification',
      'reports',
      'security-audit'
    ]
  },
  'VIEWER / AUDITOR': {
    role: 'VIEWER / AUDITOR',
    title: 'Statutory Safety Auditor',
    description: 'Assessment records, digital credentials, QR verification, audit logs, and read-only compliance information.',
    badgeColor: 'bg-amber-900/80 text-amber-200 border-amber-700',
    permissions: [
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
      'VIEW_SECURITY_AUDIT'
    ],
    authorizedTabs: [
      'command-center',
      'assessments',
      'certifications',
      'qr-verification',
      'reports',
      'security-audit'
    ]
  },
  'WORKER': {
    role: 'WORKER',
    title: 'Field Mining Worker (Android App Only)',
    description: 'Designated exclusively for the Android SymbioMine AR field app. Web admin portal access is strictly prohibited by security policy.',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    permissions: [],
    authorizedTabs: []
  },
  // Legacy Aliases for Seamless Backward Compatibility
  'SAFETY ADMIN': {
    role: 'SAFETY ADMIN',
    title: 'Statutory Safety Officer (DGMS Certified)',
    description: 'Full supervisory control over competency assessments, certificates, forensic flags, and remediation.',
    badgeColor: 'bg-emerald-900/80 text-emerald-200 border-emerald-700',
    permissions: [
      'MANAGE_CERTIFICATES',
      'MANAGE_SCENARIOS',
      'RESOLVE_INTEGRITY',
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'TRIGGER_SYNC',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
      'EXECUTE_AI_DIRECTIVES',
      'VIEW_SECURITY_AUDIT'
    ],
    authorizedTabs: [
      'command-center',
      'workers',
      'competency',
      'remediation',
      'assessments',
      'certifications',
      'integrity',
      'scenarios',
      'ai-assistant',
      'mcp-tools',
      'ai-approvals',
      'qr-verification',
      'sync-center',
      'reports',
      'system-health',
      'security-audit'
    ]
  },
  'SUPERVISOR': {
    role: 'SUPERVISOR',
    title: 'Underground Shift Supervisor',
    description: 'Manages shift roster, assigns targeted remediation, and triggers mesh sync.',
    badgeColor: 'bg-blue-900/80 text-blue-200 border-blue-700',
    permissions: [
      'ASSIGN_TRAINING',
      'COMPLETE_REMEDIATION',
      'TRIGGER_SYNC',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
      'EXECUTE_AI_DIRECTIVES'
    ],
    authorizedTabs: [
      'command-center',
      'workers',
      'remediation',
      'competency',
      'assessments',
      'certifications',
      'scenarios',
      'qr-verification',
      'sync-center'
    ]
  },
  'VIEWER': {
    role: 'VIEWER',
    title: 'Safety Observer',
    description: 'Read-only visibility into operational dashboards without dispatch authority.',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    permissions: [],
    authorizedTabs: [
      'command-center',
      'reports'
    ]
  }
};

/**
 * Checks if a specific role has a given permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const cap = ROLE_CAPABILITIES[role];
  if (!cap) return false;
  return cap.permissions.includes(permission);
}

/**
 * Checks if a specific role is allowed to view a specific tab
 */
export function hasTabPermission(role: UserRole, tab: ActiveTab): boolean {
  const cap = ROLE_CAPABILITIES[role];
  if (!cap) return false;
  return cap.authorizedTabs.includes(tab);
}

/**
 * Validates action authorization and returns structured reason on failure
 */
export function authorizeAction(
  role: UserRole,
  permission: Permission
): { authorized: boolean; reason?: string } {
  if (hasPermission(role, permission)) {
    return { authorized: true };
  }

  const roleName = ROLE_CAPABILITIES[role]?.title || role;
  return {
    authorized: false,
    reason: `Access Denied: Current role (${roleName}) lacks authorization for [${permission}]. Statutory policy requires escalation to Super Admin.`
  };
}

/**
 * Guard: only Super Admin can manage or provision administrators
 */
export function canManageAdmins(role: UserRole): boolean {
  return role === 'SUPER ADMIN';
}

/**
 * Guard: only Super Admin can create/grant Super Admin privileges
 */
export function canCreateSuperAdmin(role: UserRole): boolean {
  return role === 'SUPER ADMIN';
}
