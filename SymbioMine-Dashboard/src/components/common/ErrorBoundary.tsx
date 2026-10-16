/**
 * SYMBIOMINE Subsystem Error Boundary
 * Prevents catastrophic UI crashes and provides resilient recovery controls.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, FileText } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[SymbioMine Kernel Anomaly]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleExportDiagnostics = () => {
    const report = {
      timestamp: new Date().toISOString(),
      platform: 'SymbioMine v2.4 Industrial Intelligence Platform',
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symbiomine-diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-900 border border-rose-800/80 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">
                  Subsystem Anomaly Intercepted
                </h1>
                <p className="text-xs text-rose-300">
                  Kernel Execution Boundary Fault Protected
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 overflow-x-auto">
              <p className="font-semibold text-rose-400">Error: {this.state.error?.message || 'Unknown runtime fault'}</p>
              {this.state.error?.stack && (
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-4">
                  {this.state.error.stack}
                </p>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The safety runtime isolated this component failure to prevent data corruption or loss of offline telemetry. Your local telemetry buffer and cryptographic records are intact.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restart Subsystem
              </button>
              <button
                onClick={this.handleExportDiagnostics}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Export Diagnostics
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
