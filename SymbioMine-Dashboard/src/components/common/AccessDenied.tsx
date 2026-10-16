import React from 'react';
import { UserRole, ActiveTab } from '../../types';
import { ROLE_CAPABILITIES } from '../../services/rbacPolicy';
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from 'lucide-react';

interface AccessDeniedProps {
  role: UserRole;
  attemptedTab: ActiveTab;
  onReturn: () => void;
  onSwitchRole?: (role: UserRole) => void;
}

const TAB_TITLES: Record<ActiveTab, string> = {
  'command-center': 'Command Center',
  'workers': 'Workforce Roster',
  'competency': 'Competency Analytics',
  'remediation': 'Training & Remediation',
  'assessments': 'Assessment Records',
  'certifications': 'Digital Credentials',
  'integrity': 'Assessment Integrity',
  'scenarios': 'Curriculum & Scenarios',
  'ai-assistant': 'AI Safety Assistant',
  'mcp-tools': 'MCP / Agent Tools',
  'ai-approvals': 'AI Approvals',
  'qr-verification': 'QR Verification',
  'sync-center': 'Mesh Sync Center',
  'reports': 'Statutory Reports',
  'system-health': 'Safety Policy & System',
  'admin-management': 'Admin Management & Provisioning',
  'security-audit': 'Security & Login Audit'
};

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  role,
  attemptedTab,
  onReturn,
  onSwitchRole
}) => {
  const currentCapability = ROLE_CAPABILITIES[role];
  const targetTitle = TAB_TITLES[attemptedTab] || attemptedTab;

  return (
    <div className="w-full min-h-[600px] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 text-white flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
              RBAC Statutory Access Guard
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Access Restricted — Insufficient Operational Permissions
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Attempted Module:</span>
              <span className="font-bold text-slate-900 font-mono">{targetTitle}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Your Active Role:</span>
              <span className="inline-flex items-center gap-1.5 font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px]">
                <Lock className="w-3 h-3 text-slate-600" />
                {role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Statutory Mandate:</span>
              <span className="text-slate-600 font-mono text-[11px]">DGMS CMR-2017 &bull; Clause 104</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              Your authenticated session (<strong className="text-slate-900">{currentCapability?.title || role}</strong>)
              does not possess the administrative clearance required to access or execute directives in{' '}
              <strong className="text-slate-900">{targetTitle}</strong>.
            </p>
            <p className="text-slate-500 text-[11px]">
              This interception has been recorded in the tamper-evident cryptographic security audit chain.
              To request privilege elevation, submit an authorization request to the Chief Safety Director or Super Admin.
            </p>
          </div>



          {/* Return button */}
          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onReturn}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Command Center</span>
            </button>

            <span className="text-[10px] text-slate-400 font-mono">
              Audit ID: #SEC-INTERCEPT-{Date.now().toString(36)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
