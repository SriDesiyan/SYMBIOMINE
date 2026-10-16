import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { AppLogo } from '../common/AppLogo';
import { hasTabPermission } from '../../services/rbacPolicy';
import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  GraduationCap,
  ClipboardCheck,
  BadgeCheck,
  ShieldCheck,
  Boxes,
  Bot,
  RefreshCw,
  FileBarChart,
  Settings,
  ChevronRight,
  Radio,
  Wrench,
  ClipboardSignature,
  ScanLine,
  X,
  ShieldAlert,
  UserCog,
  LogOut
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'default' | 'warning' | 'alert';
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    currentUser,
    logout,
    remediationQueue,
    integrityFlags,
    syncRecords,
    workers,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();

  const pendingRemediations = remediationQueue.filter(r => r.status === 'Remediation Pending').length;
  const openIntegrityFlags = integrityFlags.filter(f => f.status === 'Open Flag').length;
  const pendingSync = syncRecords.filter(s => s.status === 'Pending').length;

  const rawNavGroups: NavGroup[] = [
    {
      groupName: 'Operations',
      items: [
        { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
        { id: 'workers', label: 'Workforce Roster', icon: Users, badge: `${workers.length}` },
        {
          id: 'remediation',
          label: 'Training & Remediation',
          icon: GraduationCap,
          badge: pendingRemediations > 0 ? `${pendingRemediations}` : undefined,
          badgeType: 'warning'
        },
        { id: 'competency', label: 'Competency Analytics', icon: ChartNoAxesCombined }
      ]
    },
    {
      groupName: 'Compliance',
      items: [
        { id: 'assessments', label: 'Assessment Records', icon: ClipboardCheck },
        { id: 'certifications', label: 'Digital Credentials', icon: BadgeCheck },
        { id: 'qr-verification', label: 'QR Verification', icon: ScanLine },
        {
          id: 'integrity',
          label: 'Assessment Integrity',
          icon: ShieldCheck,
          badge: openIntegrityFlags > 0 ? `${openIntegrityFlags}` : undefined,
          badgeType: 'alert'
        }
      ]
    },
    {
      groupName: 'AI & Governance',
      items: [
        { id: 'ai-assistant', label: 'AI Safety Assistant', icon: Bot },
        { id: 'mcp-tools', label: 'MCP / Agent Tools', icon: Wrench },
        { id: 'ai-approvals', label: 'AI Approvals', icon: ClipboardSignature, badge: '3', badgeType: 'warning' }
      ]
    },
    {
      groupName: 'Curriculum',
      items: [{ id: 'scenarios', label: 'Curriculum & Scenarios', icon: Boxes }]
    },
    {
      groupName: 'System',
      items: [
        {
          id: 'sync-center',
          label: 'Mesh Sync Center',
          icon: RefreshCw,
          badge: pendingSync > 0 ? `${pendingSync}` : 'OK',
          badgeType: pendingSync > 0 ? 'warning' : 'default'
        },
        { id: 'reports', label: 'Statutory Reports', icon: FileBarChart },
        { id: 'system-health', label: 'Safety Policy & System', icon: Settings },
        { id: 'admin-management', label: 'Admin Management', icon: UserCog },
        { id: 'security-audit', label: 'Security & Login Audit', icon: ShieldAlert }
      ]
    }
  ];

  // Dynamically filter navigation groups based on logged-in administrator's permissions
  const authorizedNavGroups = rawNavGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasTabPermission(currentRole, item.id))
    }))
    .filter(group => group.items.length > 0);

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-navy-950 text-slate-300">
      {/* Substation Context Banner with High-Clarity Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-navy-950">
        <div className="flex items-center gap-3 min-w-0">
          <AppLogo size="sm" className="shrink-0" />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm font-black text-white tracking-wider uppercase font-sans whitespace-nowrap">
                SymbioMine
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-brand text-white uppercase whitespace-nowrap">
                AR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate font-mono mt-1 font-semibold uppercase tracking-wider">
              Mine Safety Portal
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Operator Role Context Card */}
      <div className="px-3.5 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] text-slate-400 font-mono block">Operator:</span>
          <p className="font-bold text-white truncate">{currentUser?.name || 'S. Mukherjee'}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
            {currentRole}
          </span>
          <button
            type="button"
            onClick={logout}
            title="Sign Out / Lock Terminal (Return to Login)"
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Sections (Strictly Permission Filtered) */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto" aria-label="Main Navigation">
        {authorizedNavGroups.map(group => (
          <div key={group.groupName} className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              {group.groupName}
            </div>

            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-colors duration-150 cursor-pointer group ${
                    isActive
                      ? 'bg-brand/15 text-white font-semibold border-l-2 border-brand pl-2.5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-brand-light' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border tabular-nums ${
                          item.badgeType === 'alert'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-bold'
                            : item.badgeType === 'warning'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-brand-light shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Substation Telemetry Footer */}
      <div className="p-3 border-t border-white/10 bg-navy-950 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-300">Heading 12 Mesh Node</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Engine: LiteRT Edge ML</span>
          <span>ARCore 2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (persistent) */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-800/80 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (overlay on mobile devices) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
