import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteLocation, UserRole } from '../../types';
import { AppLogo } from '../common/AppLogo';
import {
  Search,
  Shield,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ScanLine,
  SlidersHorizontal,
  Activity,
  X,
  Play,
  Menu,
  UserCircle,
  QrCode,
  LogOut,
  UserCog
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    selectedSite,
    setSelectedSite,
    selectedDateRange,
    setSelectedDateRange,
    currentRole,
    setCurrentRole,
    currentUser,
    logout,
    setActiveTab,
    setIsCommandPaletteOpen,
    setIsScanQrModalOpen,
    openQrGenerator,
    isDemoActive,
    setIsDemoActive,
    demoStep,
    runDemoStep,
    syncRecords,
    setIsMobileSidebarOpen,
    addAuditLog
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSimulatorCollapsed, setIsSimulatorCollapsed] = useState(false);

  const pendingSyncCount = syncRecords.filter(r => r.status === 'Pending').length;

  const demoStepsList = [
    { step: 1, label: '01: W-104 Initial Attempt (64% Fail)' },
    { step: 3, label: '03: LiteRT Diagnostic Logged' },
    { step: 6, label: '06: Open AI Safety Assistant' },
    { step: 7, label: '07: Query Gas Leak Remediation' },
    { step: 10, label: '10: Filter 18 Affected Personnel' },
    { step: 11, label: '11: Dispatch SCN-GAS-04 Module' },
    { step: 14, label: '14: Worker Reassessment Pass (91%)' },
    { step: 16, label: '16: Cryptographic QR Verification' }
  ];

  const currentStepObj = demoStepsList.find(s => s.step === demoStep) || {
    step: demoStep,
    label: `Phase ${demoStep}: Operational Safety Flow`
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 select-none">
      {/* Simulation & Scenario Controller Bar (Collapsible, Enterprise Control Deck) */}
      {isDemoActive && (
        <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 py-2 text-xs transition-all">
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                <Activity className="w-3 h-3 text-amber-400" />
                Scenario Simulation Deck
              </span>

              {!isSimulatorCollapsed && (
                <span className="text-slate-300 font-medium hidden sm:inline text-xs">
                  Active Sequence: <strong className="text-white font-mono">{currentStepObj.label}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSimulatorCollapsed ? (
                <>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => runDemoStep(Math.max(1, demoStep - 1))}
                      disabled={demoStep <= 1}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <select
                      value={demoStep}
                      onChange={e => runDemoStep(Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono cursor-pointer focus:outline-hidden"
                    >
                      {demoStepsList.map(s => (
                        <option key={s.step} value={s.step}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => runDemoStep(Math.min(19, demoStep + 1))}
                      disabled={demoStep >= 19}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                      title="Next Step"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsSimulatorCollapsed(true)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1"
                  >
                    Minimize
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsSimulatorCollapsed(false)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
                >
                  <span>Expand Controls (Step {demoStep})</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => setIsDemoActive(false)}
                className="text-slate-400 hover:text-white p-1 ml-1"
                title="Exit Scenario Controller"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header Bar */}
      <div className="topbar-header px-3 sm:px-4 lg:px-6 py-2">
        <div className="topbar-nav-row">
          {/* ROW 1 Group (Left Contextual Controls): Logo + Division + Period + Search */}
          <div className="topbar-group-primary">
            {/* Mobile Navigation Drawer Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(prev => !prev)}
              className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors shrink-0 flex-none"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* 1. Logo / Branding */}
            <div className="topbar-logo flex items-center gap-2.5 sm:gap-3 shrink-0 flex-none pr-3 border-r border-slate-200">
              <AppLogo size="md" className="shrink-0" />
              <div className="shrink-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black tracking-tight text-slate-900 text-sm sm:text-base font-sans whitespace-nowrap">
                    SymbioMine
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand text-white font-bold uppercase tracking-wider whitespace-nowrap">
                    AR
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 whitespace-nowrap">
                  Industrial Safety Operations
                </p>
              </div>
            </div>

            {/* Division Selector */}
            <div className="topbar-filter-division pl-1 sm:pl-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide shrink-0">Division:</span>
              <select
                value={selectedSite}
                onChange={e => setSelectedSite(e.target.value as SiteLocation)}
                className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-slate-400 transition-colors cursor-pointer"
              >
                <option value="All Sites">All Sectors</option>
                <option value="Jharkhand Underground">Jharkhand Underground</option>
                <option value="Dhanbad Surface">Dhanbad Surface</option>
                <option value="Singrauli OpenCast">Singrauli OpenCast</option>
              </select>
            </div>

            {/* Period Selector */}
            <div className="topbar-filter-period">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide shrink-0">Period:</span>
              <select
                value={selectedDateRange}
                onChange={e => setSelectedDateRange(e.target.value)}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Quarter to Date">Quarter to Date</option>
                <option value="Year to Date">Year to Date</option>
              </select>
            </div>

            {/* Search Bar - MOST FLEXIBLE ELEMENT */}
            <div className="topbar-search-bar">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 transition-colors cursor-pointer text-left"
                title="Search workers, certificates (Ctrl+K)"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Search workers, certificates...</span>
                </span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-600 shadow-2xs shrink-0 ml-1">
                  Ctrl+K
                </kbd>
              </button>
            </div>
          </div>

          {/* ROW 2 Group (Actions, Telemetry & Profile): QR Studio + Verify Credential + Simulation + Mesh + Notifications + Profile */}
          <div className="topbar-group-secondary">
            {/* Quick Inbuilt QR Generator Studio */}
            <button
              onClick={() => openQrGenerator()}
              className="topbar-action-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0 whitespace-nowrap flex-none"
              title="Open Inbuilt QR Code Generator & Studio"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>QR Studio</span>
            </button>

            {/* Quick QR Validation Action */}
            <button
              onClick={() => setIsScanQrModalOpen(true)}
              className="topbar-action-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap flex-none"
              title="Open Webcam QR Verification Modal"
            >
              <ScanLine className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Verify Credential</span>
            </button>

            {/* Simulation Toggle */}
            {!isDemoActive && (
              <button
                onClick={() => {
                  setIsDemoActive(true);
                  runDemoStep(1);
                }}
                className="topbar-action-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap flex-none"
                title="Launch Guided Industrial Simulation"
              >
                <Play className="w-3 h-3 text-amber-600 fill-amber-600 shrink-0" />
                <span>Simulation</span>
              </button>
            )}

            {/* Mesh Telemetry Indicator */}
            <div className="topbar-mesh-status flex-none shrink-0 whitespace-nowrap flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="font-medium text-[11px] whitespace-nowrap">Mesh Online</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px] text-slate-600 tabular-nums whitespace-nowrap">
                {150 - pendingSyncCount}/150 Synced
              </span>
            </div>

            {/* Operational Alerts Menu */}
            <div className="relative shrink-0 flex-none">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors relative cursor-pointer flex items-center justify-center"
                title="Operational Alerts"
              >
                <Bell className="w-4 h-4 shrink-0" />
                {pendingSyncCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-lg shadow-xl p-3.5 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-900">
                    <span className="uppercase text-[11px] tracking-wider text-slate-700">Operational Alerts (3)</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">Active Mesh</span>
                  </div>
                  <div className="space-y-2.5 mt-2.5">
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-amber-950">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-800 font-semibold mb-0.5">
                        <span>CRITICAL AUDIT NOTICE</span>
                        <span>10m ago</span>
                      </div>
                      <p className="font-bold text-xs">Gas Emergency Competency Deficit</p>
                      <p className="text-[11px] text-amber-900 mt-0.5 leading-snug">
                        18 underground workers below 60% threshold in Blind Heading Ingress.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-semibold mb-0.5">
                        <span>TELEMETRY BUFFER</span>
                        <span>24m ago</span>
                      </div>
                      <p className="font-bold text-xs">Substation Sync Buffer</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {pendingSyncCount} offline tablets waiting at Heading 9 Wi-Fi docking station.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-semibold mb-0.5">
                        <span>INTEGRITY AUDIT</span>
                        <span>1h ago</span>
                      </div>
                      <p className="font-bold text-xs">Integrity Flag Flagged</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Worker W-118 logged with randomized scenario token mismatch.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Selector */}
            <div className="topbar-profile relative pl-2 border-l border-slate-200 shrink-0 flex-none ml-auto">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 text-left cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors whitespace-nowrap"
              >
                <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                  <UserCircle className="w-4 h-4 text-slate-200" />
                </div>
                <div className="block shrink-0">
                  <p className="text-xs font-semibold text-slate-900 leading-none">{currentUser?.name || 'S. Mukherjee'}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider leading-tight mt-0.5">
                    {currentRole}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <p className="font-bold text-slate-900">{currentUser?.name || 'S. Mukherjee'}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser?.email || 'superadmin@symbiomine.ar'}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>ID: {currentUser?.id || 'ADM-001'}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 rounded border border-emerald-200">Active Session</span>
                    </div>
                  </div>

                  {/* Super Admin Quick Actions */}
                  {currentRole === 'SUPER ADMIN' && (
                    <div className="p-1 border-b border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('admin-management');
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                      >
                        <UserCog className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Admin Management Directory</span>
                      </button>
                    </div>
                  )}

                  {/* Security Clearance Information */}
                  <div className="p-2.5 space-y-1.5 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <span>Clearance:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Security Guard:</span>
                      <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Hardware Token MFA
                      </span>
                    </div>
                  </div>

                  {/* Sign Out / Lock Session Action */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 text-rose-700 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      <span>Sign Out / Lock Terminal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
