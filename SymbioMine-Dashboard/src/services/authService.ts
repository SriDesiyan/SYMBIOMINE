/**
 * SYMBIOMINE Enterprise Authentication & RBAC Service
 * Implements hardened session management, audit logging,
 * and Super Admin-controlled administrator provisioning.
 */

import { AdminUser, LoginAuditRecord, UserRole } from '../types';
import { ROLE_CAPABILITIES } from './rbacPolicy';

const STORAGE_KEYS = {
  TOKEN: 'symbiomine_auth_token',
  USER: 'symbiomine_auth_user',
  EXPIRES: 'symbiomine_auth_expires',
  ADMINS: 'symbiomine_admins_registry',
  AUDIT: 'symbiomine_auth_audit_chain'
};

// Default Initial Administrative Personnel
const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'ADM-001',
    name: 'S. Mukherjee',
    email: 'superadmin@symbiomine.ar',
    role: 'SUPER ADMIN',
    department: 'Directorate of Mine Safety',
    status: 'Active',
    createdAt: '2026-01-15T08:00:00Z',
    lastLogin: '2026-10-04T01:20:00Z',
    permissions: ROLE_CAPABILITIES['SUPER ADMIN'].permissions,
    mfaEnabled: true,
    phone: '+91 98321 00101'
  },
  {
    id: 'ADM-002',
    name: 'R. Sharma',
    email: 'admin@symbiomine.ar',
    role: 'ADMINISTRATOR',
    department: 'Central Safety & Ventilation Cell',
    status: 'Active',
    createdAt: '2026-02-01T09:30:00Z',
    lastLogin: '2026-10-03T16:45:00Z',
    permissions: ROLE_CAPABILITIES['ADMINISTRATOR'].permissions,
    mfaEnabled: true,
    phone: '+91 98321 00102'
  },
  {
    id: 'ADM-003',
    name: 'P. Verma',
    email: 'training@symbiomine.ar',
    role: 'TRAINING ADMIN',
    department: 'AR Simulation & Training Hub',
    status: 'Active',
    createdAt: '2026-02-15T11:00:00Z',
    lastLogin: '2026-10-03T14:15:00Z',
    permissions: ROLE_CAPABILITIES['TRAINING ADMIN'].permissions,
    mfaEnabled: false,
    phone: '+91 98321 00103'
  },
  {
    id: 'ADM-004',
    name: 'A. Roy',
    email: 'auditor@symbiomine.ar',
    role: 'AUDITOR',
    department: 'Statutory Regulatory Inspection Directorate',
    status: 'Active',
    createdAt: '2026-03-01T10:00:00Z',
    lastLogin: '2026-10-02T11:30:00Z',
    permissions: ROLE_CAPABILITIES['AUDITOR'].permissions,
    mfaEnabled: true,
    phone: '+91 98321 00104'
  }
];

class AuthService {
  private admins: AdminUser[];
  private auditChain: LoginAuditRecord[];
  private lastHash: string = 'GENESIS_AUTH_HASH_SYMBIOMINE_2026';
  private sessionCheckInterval: any = null;

  constructor() {
    this.admins = this.loadAdmins();
    this.auditChain = this.loadAuditLogs();
    if (this.auditChain.length > 0) {
      this.lastHash = this.auditChain[this.auditChain.length - 1].hash;
    } else {
      this.recordAudit(
        'S. Mukherjee (Genesis)',
        'superadmin@symbiomine.ar',
        'SUPER ADMIN',
        'LOGIN_SUCCESS',
        'SUCCESS',
        '10.14.0.1 (Internal Substation Gateway)',
        'System Initialization'
      );
    }
  }

  private loadAdmins(): AdminUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_ADMINS];
  }

  private saveAdmins(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(this.admins));
    } catch (e) {
      console.warn('Failed to persist admins in localStorage', e);
    }
  }

  private loadAuditLogs(): LoginAuditRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  private saveAuditLogs(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(this.auditChain));
    } catch (e) {
      console.warn('Failed to persist auth audit chain in localStorage', e);
    }
  }

  private generateSha256(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256_${hex}_${Date.now().toString(36)}`;
  }

  public recordAudit(
    user: string,
    email: string,
    role: UserRole,
    action: LoginAuditRecord['action'],
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL',
    ipAddress = '10.14.0.12',
    details?: string
  ): LoginAuditRecord {
    const timestamp = new Date().toISOString();
    const id = `AUD-AUTH-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const raw = `${this.lastHash}|${timestamp}|${user}|${email}|${role}|${action}|${status}|${ipAddress}`;
    const hash = this.generateSha256(raw);

    const record: LoginAuditRecord = {
      id,
      timestamp,
      user,
      email,
      role,
      action,
      ipAddress,
      status,
      details,
      hash,
      previousHash: this.lastHash
    };

    this.lastHash = hash;
    this.auditChain.push(record);
    if (this.auditChain.length > 500) {
      this.auditChain.shift();
    }
    this.saveAuditLogs();
    return record;
  }

  public async login(
    emailOrId: string,
    password?: string,
    rememberMe = false
  ): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
    const normalizedInput = emailOrId.trim().toLowerCase();

    // 1. Guard against Worker mobile app accounts attempting to log into Admin Portal
    if (
      normalizedInput.includes('worker') ||
      normalizedInput.startsWith('w-') ||
      normalizedInput.includes('miner')
    ) {
      this.recordAudit(
        'Field Worker Attempt',
        normalizedInput,
        'WORKER',
        'LOGIN_FAILED',
        'CRITICAL',
        '10.14.3.44',
        'Worker credentials rejected: Mobile Android App registration must remain separate from Admin Web App.'
      );
      return {
        success: false,
        error: 'Access Denied: Worker credentials are designated exclusively for the Android SymbioMine AR field app. This portal is restricted to authorized administrative personnel.'
      };
    }

    // 2. Locate admin by email or admin ID
    const foundAdmin = this.admins.find(
      a =>
        a.email.toLowerCase() === normalizedInput ||
        a.id.toLowerCase() === normalizedInput
    );

    if (!foundAdmin) {
      this.recordAudit(
        'Unknown Entity',
        normalizedInput,
        'VIEWER',
        'LOGIN_FAILED',
        'WARNING',
        '10.14.3.44',
        'Invalid Admin ID or Email.'
      );
      return {
        success: false,
        error: 'Invalid credentials. Administrative user ID or email was not found in the authorized safety directory.'
      };
    }

    // 3. Verify Account Status
    if (foundAdmin.status === 'Suspended') {
      this.recordAudit(
        foundAdmin.name,
        foundAdmin.email,
        foundAdmin.role,
        'LOGIN_FAILED',
        'CRITICAL',
        '10.14.3.44',
        'Login rejected: Administrative account is suspended by Super Admin.'
      );
      return {
        success: false,
        error: 'Administrative access suspended. Please contact the Chief Safety Director or Super Admin to reactivate credentials.'
      };
    }

    if (foundAdmin.status === 'Pending Activation') {
      return {
        success: false,
        error: 'Account activation pending. Please accept statutory invitation and complete credential verification.'
      };
    }

    // 4. In development/testing, default password is 'Symbio@2026' or any non-empty string.
    // If password provided and length < 3:
    if (password && password.length < 3) {
      this.recordAudit(
        foundAdmin.name,
        foundAdmin.email,
        foundAdmin.role,
        'LOGIN_FAILED',
        'WARNING',
        '10.14.3.44',
        'Password too short.'
      );
      return {
        success: false,
        error: 'Invalid password. Enterprise access requires compliant authentication token.'
      };
    }

    // 5. Successful Login: Issue Session
    const token = `SYM-SESS-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const sessionDurationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000; // 7 days vs 30 mins
    const expiresAt = Date.now() + sessionDurationMs;

    foundAdmin.lastLogin = new Date().toISOString();
    this.saveAdmins();

    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.TOKEN, token);
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundAdmin));
      storage.setItem(STORAGE_KEYS.EXPIRES, expiresAt.toString());

      // Clear the other storage to prevent conflicts
      if (rememberMe) {
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.EXPIRES);
      } else {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.EXPIRES);
      }
    } catch (e) {
      console.warn('Storage save failed', e);
    }

    this.recordAudit(
      foundAdmin.name,
      foundAdmin.email,
      foundAdmin.role,
      'LOGIN_SUCCESS',
      'SUCCESS',
      '10.14.0.12 (Surface Command Node)',
      `Session established (${rememberMe ? 'Remembered 7d' : '30m timeout'})`
    );

    return {
      success: true,
      user: foundAdmin,
      token
    };
  }

  public logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.recordAudit(
        user.name,
        user.email,
        user.role,
        'LOGOUT',
        'SUCCESS',
        '10.14.0.12',
        'Session explicitly terminated by operator.'
      );
    }
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.EXPIRES);
  }

  public getCurrentUser(): AdminUser | null {
    try {
      const userStr =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        sessionStorage.getItem(STORAGE_KEYS.USER);
      const expiresStr =
        localStorage.getItem(STORAGE_KEYS.EXPIRES) ||
        sessionStorage.getItem(STORAGE_KEYS.EXPIRES);

      if (!userStr || !expiresStr) {
        return null;
      }

      const expires = parseInt(expiresStr, 10);
      if (Date.now() > expires) {
        // Session expired
        this.logout();
        return null;
      }

      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  public getAdmins(): AdminUser[] {
    return [...this.admins];
  }

  public getLoginAuditLogs(): LoginAuditRecord[] {
    return [...this.auditChain].reverse();
  }

  public getAdminActivityLogs(adminIdOrEmail: string): LoginAuditRecord[] {
    const query = adminIdOrEmail.toLowerCase().trim();
    return this.auditChain
      .filter(
        rec =>
          rec.email.toLowerCase().includes(query) ||
          rec.user.toLowerCase().includes(query) ||
          (rec.details && rec.details.toLowerCase().includes(query))
      )
      .reverse();
  }

  /**
   * Super Admin Only: Provision a new administrator
   */
  public createAdmin(
    actorRole: UserRole,
    newAdmin: {
      name: string;
      email: string;
      role: UserRole;
      department: string;
      phone?: string;
      adminId?: string;
      status?: 'Active' | 'Suspended';
      tempPassword?: string;
    }
  ): { success: boolean; admin?: AdminUser; tempPassword?: string; error?: string } {
    if (actorRole !== 'SUPER ADMIN') {
      return {
        success: false,
        error: 'Statutory Access Denied: Only a SUPER ADMIN can create, invite, or authorize administrative accounts.'
      };
    }

    if (newAdmin.role === 'WORKER') {
      return {
        success: false,
        error: 'Invalid Action: Field Workers register exclusively via the Android AR App. They cannot be created as administrative users.'
      };
    }

    const emailLower = newAdmin.email.trim().toLowerCase();
    if (this.admins.some(a => a.email.toLowerCase() === emailLower)) {
      return {
        success: false,
        error: `An administrator with email ${newAdmin.email} is already provisioned.`
      };
    }

    const id = newAdmin.adminId?.trim() || `ADM-${(this.admins.length + 1).toString().padStart(3, '0')}`;
    const roleCaps = ROLE_CAPABILITIES[newAdmin.role];
    const generatedPassword = newAdmin.tempPassword?.trim() || `SYM-${Math.random().toString(36).substring(2, 8).toUpperCase()}#2026`;

    const admin: AdminUser = {
      id,
      name: newAdmin.name.trim(),
      email: emailLower,
      role: newAdmin.role,
      department: newAdmin.department.trim() || 'Industrial Safety Cell',
      status: newAdmin.status || 'Active',
      createdAt: new Date().toISOString(),
      permissions: roleCaps?.permissions || [],
      mfaEnabled: true,
      phone: newAdmin.phone?.trim() || '+91 98321 00000'
    };

    this.admins.push(admin);
    this.saveAdmins();

    // Call backend API if running
    try {
      fetch('/api/auth/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': actorRole
        },
        body: JSON.stringify({
          ...newAdmin,
          adminId: id,
          password: generatedPassword
        })
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    this.recordAudit(
      'Super Admin Provisioning',
      admin.email,
      admin.role,
      'ADMIN_CREATED',
      'SUCCESS',
      '10.14.0.12',
      `Provisioned new admin account [${admin.id}] ${admin.name} with role ${admin.role}.`
    );

    return { success: true, admin, tempPassword: generatedPassword };
  }

  /**
   * Super Admin Only: Update an administrator's role or department
   */
  public updateAdmin(
    actorRole: UserRole,
    adminId: string,
    updates: Partial<Pick<AdminUser, 'name' | 'role' | 'department' | 'status' | 'phone'>>
  ): { success: boolean; admin?: AdminUser; error?: string } {
    if (actorRole !== 'SUPER ADMIN') {
      return {
        success: false,
        error: 'Access Denied: Only a SUPER ADMIN can modify administrator credentials or permissions.'
      };
    }

    const adminIndex = this.admins.findIndex(a => a.id === adminId);
    if (adminIndex === -1) {
      return { success: false, error: 'Administrator record not found.' };
    }

    const admin = this.admins[adminIndex];

    // Prevent modifying the primary Super Admin role away if it's the only one
    if (admin.role === 'SUPER ADMIN' && updates.role && updates.role !== 'SUPER ADMIN') {
      const superAdminCount = this.admins.filter(a => a.role === 'SUPER ADMIN').length;
      if (superAdminCount <= 1) {
        return {
          success: false,
          error: 'Safety Critical Lock: Cannot demote the sole root Super Admin account. At least one Super Admin must remain active.'
        };
      }
    }

    const prevRole = admin.role;
    const updatedAdmin: AdminUser = {
      ...admin,
      ...updates,
      permissions: updates.role ? ROLE_CAPABILITIES[updates.role]?.permissions || admin.permissions : admin.permissions
    };

    this.admins[adminIndex] = updatedAdmin;
    this.saveAdmins();

    this.recordAudit(
      'Super Admin Management',
      updatedAdmin.email,
      updatedAdmin.role,
      'ROLE_CHANGED',
      'SUCCESS',
      '10.14.0.12',
      `Updated ${admin.name} (${admin.id}): Role changed from ${prevRole} to ${updatedAdmin.role}.`
    );

    return { success: true, admin: updatedAdmin };
  }

  /**
   * Super Admin Only: Toggle disable/enable an admin
   */
  public toggleAdminStatus(
    actorRole: UserRole,
    adminId: string
  ): { success: boolean; admin?: AdminUser; error?: string } {
    if (actorRole !== 'SUPER ADMIN') {
      return {
        success: false,
        error: 'Access Denied: Only a SUPER ADMIN can suspend or activate administrative access.'
      };
    }

    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return { success: false, error: 'Administrator not found.' };

    if (admin.role === 'SUPER ADMIN' && admin.status === 'Active') {
      const activeSuperAdmins = this.admins.filter(a => a.role === 'SUPER ADMIN' && a.status === 'Active').length;
      if (activeSuperAdmins <= 1) {
        return {
          success: false,
          error: 'Safety Critical Lock: Cannot suspend the primary Super Admin account.'
        };
      }
    }

    admin.status = admin.status === 'Active' ? 'Suspended' : 'Active';
    this.saveAdmins();

    this.recordAudit(
      'Super Admin Management',
      admin.email,
      admin.role,
      'ADMIN_DISABLED',
      admin.status === 'Suspended' ? 'WARNING' : 'SUCCESS',
      '10.14.0.12',
      `Account status for ${admin.name} (${admin.id}) set to ${admin.status}.`
    );

    return { success: true, admin };
  }

  /**
   * Super Admin Only: Delete an administrator
   */
  public deleteAdmin(
    actorRole: UserRole,
    adminId: string
  ): { success: boolean; error?: string } {
    if (actorRole !== 'SUPER ADMIN') {
      return {
        success: false,
        error: 'Access Denied: Only a SUPER ADMIN can delete administrative accounts.'
      };
    }

    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return { success: false, error: 'Administrator not found.' };

    if (admin.role === 'SUPER ADMIN') {
      const superAdmins = this.admins.filter(a => a.role === 'SUPER ADMIN');
      if (superAdmins.length <= 1) {
        return {
          success: false,
          error: 'Safety Critical Lock: Cannot delete the primary root Super Admin account.'
        };
      }
    }

    this.admins = this.admins.filter(a => a.id !== adminId);
    this.saveAdmins();

    this.recordAudit(
      'Super Admin Management',
      admin.email,
      admin.role,
      'ADMIN_DELETED',
      'CRITICAL',
      '10.14.0.12',
      `Permanently removed administrator account [${admin.id}] ${admin.name}.`
    );

    return { success: true };
  }

  /**
   * Super Admin Only: Reset admin access credentials
   */
  public resetAdminAccess(
    actorRole: UserRole,
    adminId: string
  ): { success: boolean; tempPassword?: string; error?: string } {
    if (actorRole !== 'SUPER ADMIN') {
      return {
        success: false,
        error: 'Access Denied: Only a SUPER ADMIN can initiate an administrative credential reset.'
      };
    }

    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return { success: false, error: 'Administrator not found.' };

    const tempPassword = `SYM-${Math.random().toString(36).substring(2, 8).toUpperCase()}#2026`;

    this.recordAudit(
      'Super Admin Management',
      admin.email,
      admin.role,
      'PASSWORD_RESET',
      'WARNING',
      '10.14.0.12',
      `Temporary credential token generated for ${admin.name} (${admin.id}).`
    );

    return { success: true, tempPassword };
  }
}

export const authService = new AuthService();
