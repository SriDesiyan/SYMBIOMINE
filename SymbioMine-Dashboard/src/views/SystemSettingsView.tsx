import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/common/AppLogo';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Database,
  Cpu,
  ShieldAlert,
  Server,
  Key
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { currentRole, setIsBrandLogoModalOpen } = useApp();

  const [passMark, setPassMark] = useState<number>(60);
  const [attemptLimit, setAttemptLimit] = useState<number>(3);
  const [certValidityMonths, setCertValidityMonths] = useState<number>(12);
  const [lockStatus, setLockStatus] = useState<boolean>(true);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockStatus) {
      setSaveNotice('Regulatory Policy Lock is ENGAGED. The pass mark cannot be modified below 60% pursuant to DGMS regulations.');
      setTimeout(() => setSaveNotice(null), 5000);
      return;
    }
    setSaveNotice('Settings updated successfully.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            System Settings &amp; Statutory Safety Policy Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage compliance thresholds, store-and-forward edge buffers, and LiteRT INT8 runtime models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audit Engine: Deterministic</span>
          </span>
        </div>
      </div>

      {saveNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* 2. Strict Regulatory Safety Lock Banner */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Statutory Safety Policy Lock
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                DGMS Standard: 60% Competency Pass Mark is legally mandated. Modification is strictly restricted.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLockStatus(!lockStatus)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
              lockStatus
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-rose-700 text-white hover:bg-rose-800'
            }`}
          >
            {lockStatus ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{lockStatus ? 'Regulatory Lock Engaged' : 'Policy Override Active'}</span>
          </button>
        </div>
      </div>

      {/* 3. 12-Column Grid: Settings Form (8-col) + Edge Storage & Diagnostic (4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 8-col: Policy Configuration Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Statutory Policy Parameters
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure threshold rules applied across offline LiteRT evaluations and sync queues.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Mandatory Assessment Pass Mark (%)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="100"
                    disabled={lockStatus}
                    value={passMark}
                    onChange={e => setPassMark(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold disabled:opacity-60 disabled:bg-slate-100 tabular-nums focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Fixed at &ge; 60% (60 / 100 marks: 5 questions &times; 20 marks). AI assistants and shift supervisors cannot lower this value.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Maximum Remediation Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={attemptLimit}
                    onChange={e => setAttemptLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold tabular-nums focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Attempt 1 (Standard), Attempt 2 (Remedial), Attempt 3 (Final Reassessment).
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Credential Validity Cadence (Months)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="36"
                    value={certValidityMonths}
                    onChange={e => setCertValidityMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold tabular-nums focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Standard statutory annual re-certification cycle (12 Months).
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    LiteRT Edge ML Model Version
                  </label>
                  <input
                    type="text"
                    disabled
                    value="LiteRT-MineSafety-v2.4.1-int8.tflite"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600 font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Quantized for zero-latency execution on offline field tablets.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Active Operator RBAC: <strong className="text-slate-800">{currentRole}</strong>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg cursor-pointer transition-colors shadow-xs text-xs"
                >
                  Save Policy Configuration
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            Audit Engine Signature: Ed25519 Hardware Vault Enforced
          </div>
        </div>

        {/* 4-col: Substation Edge Storage & Cache Health */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Edge Storage &amp; Cache Allocation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Local telemetry caches and offline package allocations.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Official APK Logo Asset</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                    AUTHORITATIVE
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <AppLogo size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-xs truncate">SymbioMine [AR]</p>
                    <p className="text-[10px] text-slate-500 font-mono">Source: Our Goal.png</p>
                  </div>
                  <button
                    onClick={() => setIsBrandLogoModalOpen(true)}
                    className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">IndexedDB Buffer</span>
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">4.2 MB / 50 MB</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Offline assessment queue storage</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">AR Scenario Assets</span>
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">142 MB Cached</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Pre-cached Unity 3D simulator models</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Ledger Latency</span>
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="font-mono font-bold text-emerald-800 tabular-nums text-sm">12ms (SHA-256)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Local cryptographic hash generation</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            Status: Substation 12 Node Synchronized
          </div>
        </div>
      </div>
    </div>
  );
};
