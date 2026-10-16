import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminUser, UserRole, LoginAuditRecord } from '../types';
import { authService } from '../services/authService';
import { ROLE_CAPABILITIES } from '../services/rbacPolicy';
import {
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  X,
  RefreshCw,
  Search,
  Activity,
  Copy,
  Check,
  Building2,
  Phone,
  Clock,
  Mail,
  User
} from 'lucide-react';

export const AdminManagementView: React.FC = () => {
  const { currentRole, addAuditLog } = useApp();

  const [admins, setAdmins] = useState<AdminUser[]>(() => authService.getAdmins());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetResult, setResetResult] = useState<{ admin: AdminUser; tempPassword: string } | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [activityAdmin, setActivityAdmin] = useState<AdminUser | null>(null);
  const [activityLogs, setActivityLogs] = useState<LoginAuditRecord[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states for Create Admin
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAdminId, setNewAdminId] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('ADMINISTRATOR');
  const [newDept, setNewDept] = useState<string>('Directorate of Mine Safety');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'Active' | 'Suspended'>('Active');

  const isSuperAdmin = currentRole === 'SUPER ADMIN';

  const showNotice = (type: 'success' | 'error', message: string) => {
    setFeedbackNotice({ type, message });
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const reloadList = () => {
    setAdmins(authService.getAdmins());
  };

  const handleOpenCreateModal = () => {
    const nextIndex = admins.length + 1;
    const defaultId = `ADM-${nextIndex.toString().padStart(3, '0')}`;
    const defaultTempPass = `SYM-${Math.random().toString(36).substring(2, 8).toUpperCase()}#2026`;
    setNewName('');
    setNewEmail('');
    setNewAdminId(defaultId);
    setNewRole('ADMINISTRATOR');
    setNewDept('Central Mine Safety Operations');
    setNewPhone('');
    setNewPassword(defaultTempPass);
    setNewStatus('Active');
    setIsCreateModalOpen(true);
  };

  // 1. Create Admin
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showNotice('error', 'Only a SUPER ADMIN can provision new administrators.');
      return;
    }

    const res = authService.createAdmin(currentRole, {
      name: newName,
      email: newEmail,
      adminId: newAdminId,
      role: newRole,
      department: newDept,
      phone: newPhone,
      tempPassword: newPassword,
      status: newStatus
    });

    if (!res.success || !res.admin) {
      showNotice('error', res.error || 'Failed to provision admin.');
      return;
    }

    addAuditLog(
      'CREATE_ADMIN',
      `Admin [${res.admin.id}] ${newEmail}`,
      'None',
      `Role: ${newRole}`,
      'SECURITY',
      'INFO'
    );

    showNotice(
      'success',
      `Administrator ${newName} (${res.admin.id}) provisioned successfully with role ${newRole}.`
    );
    setIsCreateModalOpen(false);
    reloadList();
  };

  // 2. Toggle Status (Disable/Enable)
  const handleToggleStatus = (admin: AdminUser) => {
    if (!isSuperAdmin) {
      showNotice('error', 'Only a SUPER ADMIN can modify account access status.');
      return;
    }

    const res = authService.toggleAdminStatus(currentRole, admin.id);
    if (!res.success) {
      showNotice('error', res.error || 'Failed to update status.');
      return;
    }

    const newStatusVal = admin.status === 'Active' ? 'Suspended' : 'Active';
    addAuditLog(
      'TOGGLE_ADMIN_STATUS',
      `Admin ${admin.id} (${admin.name})`,
      admin.status,
      newStatusVal,
      'SECURITY',
      'WARNING'
    );

    showNotice('success', `Account access for ${admin.name} set to ${newStatusVal}.`);
    reloadList();
  };

  // 3. Reset Password / Credential Token
  const handleResetPassword = (admin: AdminUser) => {
    if (!isSuperAdmin) {
      showNotice('error', 'Only a SUPER ADMIN can initiate credential resets.');
      return;
    }

    const res = authService.resetAdminAccess(currentRole, admin.id);
    if (!res.success || !res.tempPassword) {
      showNotice('error', res.error || 'Failed to reset credentials.');
      return;
    }

    // Call backend API if running
    try {
      fetch(`/api/auth/admins/${admin.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole
        }
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    addAuditLog(
      'RESET_ADMIN_CREDENTIAL',
      `Admin ${admin.id} (${admin.name})`,
      'Active Token',
      'New Single-Use Temporary Token',
      'SECURITY',
      'WARNING'
    );

    setResetResult({
      admin,
      tempPassword: res.tempPassword
    });
    setCopiedKey(false);
    setIsResetModalOpen(true);
  };

  // 4. Delete / Revoke Access Admin
  const handleConfirmDelete = () => {
    if (!deleteTarget || !isSuperAdmin) return;

    const res = authService.deleteAdmin(currentRole, deleteTarget.id);
    if (!res.success) {
      showNotice('error', res.error || 'Failed to revoke administrator access.');
      setIsDeleteModalOpen(false);
      return;
    }

    // Call backend API
    try {
      fetch(`/api/auth/admins/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': currentRole }
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    addAuditLog(
      'DELETE_ADMIN',
      `Admin ${deleteTarget.id} (${deleteTarget.name})`,
      deleteTarget.role,
      'REVOKED',
      'SECURITY',
      'CRITICAL'
    );

    showNotice('success', `Administrator account [${deleteTarget.id}] ${deleteTarget.name} has been permanently revoked.`);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    reloadList();
  };

  // 5. Save Role & Details Update
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin || !isSuperAdmin) return;

    const res = authService.updateAdmin(currentRole, editingAdmin.id, {
      name: editingAdmin.name,
      role: editingAdmin.role,
      department: editingAdmin.department,
      phone: editingAdmin.phone,
      status: editingAdmin.status
    });

    if (!res.success) {
      showNotice('error', res.error || 'Failed to update administrator.');
      return;
    }

    // Call backend API
    try {
      fetch(`/api/auth/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole
        },
        body: JSON.stringify(editingAdmin)
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    addAuditLog(
      'UPDATE_ADMIN_ROLE',
      `Admin ${editingAdmin.id} (${editingAdmin.name})`,
      'Previous Privileges',
      `Assigned Role: ${editingAdmin.role}`,
      'SECURITY',
      'INFO'
    );

    showNotice('success', `Updated credentials and role for ${editingAdmin.name}.`);
    setIsEditModalOpen(false);
    setEditingAdmin(null);
    reloadList();
  };

  // 6. View Activity Logs
  const handleViewActivity = (admin: AdminUser) => {
    setActivityAdmin(admin);
    const logs = authService.getAdminActivityLogs(admin.email);
    setActivityLogs(logs);
    setIsActivityModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  // Normalized display label for roles
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'SUPER ADMIN':
        return 'Super Admin';
      case 'ADMINISTRATOR':
      case 'ADMIN':
        return 'Administrator';
      case 'TRAINING ADMIN':
      case 'TRAINING ADMIN / OPERATOR':
        return 'Training Admin';
      case 'AUDITOR':
      case 'VIEWER / AUDITOR':
        return 'Auditor';
      default:
        return role;
    }
  };

  const getRoleBadgeStyle = (role: UserRole): string => {
    switch (role) {
      case 'SUPER ADMIN':
        return 'bg-purple-50 text-purple-900 border-purple-300 font-bold';
      case 'ADMINISTRATOR':
      case 'ADMIN':
        return 'bg-blue-50 text-blue-900 border-blue-300 font-bold';
      case 'TRAINING ADMIN':
      case 'TRAINING ADMIN / OPERATOR':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold';
      case 'AUDITOR':
      case 'VIEWER / AUDITOR':
        return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchQuery.toLowerCase());

    const roleName = getRoleDisplayName(admin.role).toUpperCase();
    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      admin.role === selectedRoleFilter ||
      roleName === selectedRoleFilter.toUpperCase();

    const matchesStatus =
      selectedStatusFilter === 'ALL' || admin.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'Active').length;
  const superAdminCount = admins.filter(a => a.role === 'SUPER ADMIN').length;

  return (
    <div className="w-full space-y-5">
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Admin Management
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise administration directory. Provision administrative personnel, manage access roles, and audit security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => reloadList()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            disabled={!isSuperAdmin}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={isSuperAdmin ? 'Add Administrator' : 'Only Super Admin can provision admins'}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackNotice && (
        <div
          role="alert"
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Operational Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Total Administrators</p>
          <p className="text-xl font-black text-slate-900 mt-1">{totalAdmins}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Provisioned in system</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Active Accounts</p>
          <p className="text-xl font-black text-emerald-700 mt-1">{activeAdmins}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Enabled for operations</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Super Admins</p>
          <p className="text-xl font-black text-purple-700 mt-1">{superAdminCount}</p>
          <p className="text-[10px] text-purple-600 mt-0.5">Root governance tier</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Auth Protocol</p>
          <p className="text-xl font-black text-slate-900 mt-1">256-Bit</p>
          <p className="text-[10px] text-slate-400 mt-0.5">SHA-256 Hashed + DGMS</p>
        </div>
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search administrators by name, ID, email, or department..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 shrink-0">Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Roles ({admins.length})</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Administrator">Administrator</option>
              <option value="Training Admin">Training Admin</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 shrink-0">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Administrators Table: NAME | ADMIN ID | EMAIL | ROLE | STATUS | LAST LOGIN | ACTIONS */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">ADMIN ID</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LAST LOGIN</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No administrators match the query.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map(admin => {
                  const roleDisplayName = getRoleDisplayName(admin.role);
                  const roleBadgeClass = getRoleBadgeStyle(admin.role);

                  return (
                    <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. NAME */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                            {admin.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 leading-tight truncate">{admin.name}</p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{admin.department}</p>
                            {admin.phone && (
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{admin.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. ADMIN ID */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[11px] font-bold text-slate-800">
                          {admin.id}
                        </span>
                      </td>

                      {/* 3. EMAIL */}
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {admin.email}
                      </td>

                      {/* 4. ROLE */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono border uppercase tracking-wider ${roleBadgeClass}`}
                        >
                          {roleDisplayName}
                        </span>
                      </td>

                      {/* 5. STATUS */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            admin.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              admin.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{admin.status}</span>
                        </span>
                      </td>

                      {/* 6. LAST LOGIN */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'}
                      </td>

                      {/* 7. ACTIONS */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Edit / Change Role */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdmin({ ...admin });
                              setIsEditModalOpen(true);
                            }}
                            disabled={!isSuperAdmin}
                            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Edit Administrator & Role"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleResetPassword(admin)}
                            disabled={!isSuperAdmin}
                            className="p-1.5 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Reset Temporary Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(admin)}
                            disabled={!isSuperAdmin || (admin.role === 'SUPER ADMIN' && admin.status === 'Active')}
                            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title={admin.status === 'Active' ? 'Deactivate Administrator' : 'Activate Administrator'}
                          >
                            {admin.status === 'Active' ? (
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>

                          {/* View Account Activity */}
                          <button
                            type="button"
                            onClick={() => handleViewActivity(admin)}
                            className="p-1.5 rounded text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="View Account Activity & Logs"
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>

                          {/* Revoke Access (Delete) */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(admin);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={!isSuperAdmin || admin.role === 'SUPER ADMIN'}
                            className="p-1.5 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Revoke Administrator Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Create Administrator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm font-mono uppercase tracking-wider">
                  Provision New Administrator
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. R. K. Sen"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Admin ID *
                  </label>
                  <input
                    type="text"
                    value={newAdminId}
                    onChange={e => setNewAdminId(e.target.value)}
                    placeholder="e.g. ADM-005"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="e.g. rksen@symbiomine.ar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="TRAINING ADMIN">Training Admin</option>
                    <option value="AUDITOR">Auditor</option>
                    {isSuperAdmin && <option value="SUPER ADMIN">Super Admin</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'Active' | 'Suspended')}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Temporary Password / PIN *
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Temporary password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Single-use initial credential. Administrator will be prompted to reset upon first login.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    placeholder="e.g. Mine Safety Cell"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98321 00000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Capability Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-700 font-mono uppercase">
                  Capabilities for {getRoleDisplayName(newRole)}:
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {ROLE_CAPABILITIES[newRole]?.description || 'Statutory administrative operations access.'}
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand hover:bg-brand-light text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Provision Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Role & Profile Modal */}
      {isEditModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Edit Administrator &amp; Change Role
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Administrator Name
                </label>
                <input
                  type="text"
                  value={editingAdmin.name}
                  onChange={e =>
                    setEditingAdmin({ ...editingAdmin, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  ID: {editingAdmin.id} &bull; Email: {editingAdmin.email}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Role
                </label>
                <select
                  value={editingAdmin.role}
                  onChange={e =>
                    setEditingAdmin({ ...editingAdmin, role: e.target.value as UserRole })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="SUPER ADMIN">Super Admin</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="TRAINING ADMIN">Training Admin</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  value={editingAdmin.status}
                  onChange={e =>
                    setEditingAdmin({ ...editingAdmin, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editingAdmin.department}
                  onChange={e =>
                    setEditingAdmin({ ...editingAdmin, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={editingAdmin.phone || ''}
                  onChange={e =>
                    setEditingAdmin({ ...editingAdmin, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Reset Password Result Modal */}
      {isResetModalOpen && resetResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Temporary Password Generated</span>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              A temporary password has been generated for <strong>{resetResult.admin.name}</strong> ({resetResult.admin.email}).
            </p>

            <div className="p-3.5 bg-slate-900 rounded-xl flex items-center justify-between gap-3 text-white font-mono">
              <span className="text-sm font-bold tracking-wider text-amber-400">{resetResult.tempPassword}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(resetResult.tempPassword)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer text-slate-200"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Deliver this temporary password to the authorized administrator over a secure channel. This action has been logged in the tamper-evident audit chain.
            </p>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Account Activity & Audit Modal */}
      {isActivityModalOpen && activityAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Activity className="w-4 h-4" />
                <span>Account Activity &bull; {activityAdmin.name}</span>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="shrink-0 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-slate-900">{activityAdmin.name} ({activityAdmin.id})</p>
              <p className="text-slate-500 font-mono text-[11px]">{activityAdmin.email} &bull; {activityAdmin.role}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Last authenticated: {activityAdmin.lastLogin ? new Date(activityAdmin.lastLogin).toLocaleString() : 'Never'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activityLogs.length === 0 ? (
                <p className="text-center py-8 text-slate-400">
                  No recorded security actions for this administrator yet.
                </p>
              ) : (
                activityLogs.map(log => (
                  <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 font-mono text-[11px]">{log.action}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-slate-600 text-[11px]">{log.details}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>IP: {log.ipAddress}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsActivityModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Revoke Access Confirmation Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-slate-200">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">
                Revoke Administrator Access
              </h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to permanently revoke credentials and delete administrator account <strong>[{deleteTarget.id}] {deleteTarget.name}</strong> ({deleteTarget.email})?
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px]">
              This action terminates all active sessions, revokes all role permissions, and creates a critical audit event.
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
