/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './views/LoginView';
import { CommandCenterView } from './views/CommandCenterView';
import { WorkersView } from './views/WorkersView';
import { CompetencyIntelligenceView } from './views/CompetencyIntelligenceView';
import { TrainingRemediationView } from './views/TrainingRemediationView';
import { AssessmentsView } from './views/AssessmentsView';
import { CertificationsView } from './views/CertificationsView';
import { IntegrityView } from './views/IntegrityView';
import { ScenarioManagementView } from './views/ScenarioManagementView';
import { AiSafetyAssistantView } from './views/AiSafetyAssistantView';
import { SyncCenterView } from './views/SyncCenterView';
import { ReportsView } from './views/ReportsView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { McpToolsView } from './views/McpToolsView';
import { AiApprovalsView } from './views/AiApprovalsView';
import { QrVerificationView } from './views/QrVerificationView';
import { AdminManagementView } from './views/AdminManagementView';
import { SecurityAuditView } from './views/SecurityAuditView';
import { AccessDenied } from './components/common/AccessDenied';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { QRScannerModal } from './components/certification/QRScannerModal';
import { QRCodeGeneratorModal } from './components/certification/QRCodeGeneratorModal';
import { WorkerDetailModal } from './components/workers/WorkerDetailModal';
import { AssessmentDetailModal } from './components/assessments/AssessmentDetailModal';
import { BrandAssetModal } from './components/common/BrandAssetModal';
import { hasTabPermission } from './services/rbacPolicy';
import { ShieldAlert, X } from 'lucide-react';

const RootContent: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    setIsCommandPaletteOpen,
    rbacToast,
    dismissRbacToast
  } = useApp();

  // Keyboard shortcut for Command Palette: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  // Auto-dismiss RBAC toast after 6 seconds
  useEffect(() => {
    if (!rbacToast) return;
    const timer = setTimeout(() => {
      dismissRbacToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [rbacToast, dismissRbacToast]);

  // 1. Unauthenticated Gate: Redirect to /login
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 2. Route / Module Permission Validation
  const isAuthorizedForCurrentTab = hasTabPermission(currentRole, activeTab);

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans antialiased text-slate-900">
      {/* Persistent Left Navigation Sidebar (Permission-filtered) */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational Header */}
        <TopBar />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto bg-surface p-4 sm:p-5 lg:px-6 lg:py-5 w-full" role="main">
          <div className="w-full">
            {!isAuthorizedForCurrentTab ? (
              <AccessDenied
                role={currentRole}
                attemptedTab={activeTab}
                onReturn={() => setActiveTab('command-center')}
                onSwitchRole={(newRole) => setCurrentRole(newRole)}
              />
            ) : (
              <>
                {activeTab === 'command-center' && <CommandCenterView />}
                {activeTab === 'workers' && <WorkersView />}
                {activeTab === 'competency' && <CompetencyIntelligenceView />}
                {activeTab === 'remediation' && <TrainingRemediationView />}
                {activeTab === 'assessments' && <AssessmentsView />}
                {activeTab === 'certifications' && <CertificationsView />}
                {activeTab === 'integrity' && <IntegrityView />}
                {activeTab === 'scenarios' && <ScenarioManagementView />}
                {activeTab === 'ai-assistant' && <AiSafetyAssistantView />}
                {activeTab === 'mcp-tools' && <McpToolsView />}
                {activeTab === 'ai-approvals' && <AiApprovalsView />}
                {activeTab === 'qr-verification' && <QrVerificationView />}
                {activeTab === 'sync-center' && <SyncCenterView />}
                {activeTab === 'reports' && <ReportsView />}
                {activeTab === 'system-health' && <SystemSettingsView />}
                {activeTab === 'admin-management' && <AdminManagementView />}
                {activeTab === 'security-audit' && <SecurityAuditView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Security / RBAC Interception Toast */}
      {rbacToast && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 border border-amber-500/80 rounded-lg p-3.5 shadow-2xl text-slate-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              RBAC Access Control Guard
            </p>
            <p className="text-xs text-slate-200 mt-0.5 leading-snug">
              {rbacToast.message}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Interception recorded in tamper-evident compliance audit trail.
            </p>
          </div>
          <button
            onClick={dismissRbacToast}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss access control notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Modals */}
      <CommandPaletteModal />
      <QRScannerModal />
      <QRCodeGeneratorModal />
      <WorkerDetailModal />
      <AssessmentDetailModal />
      <BrandAssetModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RootContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
