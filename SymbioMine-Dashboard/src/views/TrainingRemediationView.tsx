import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRAINING_MODULES } from '../services/demoData';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  ShieldCheck,
  Clock,
  Activity,
  Search,
  ArrowRight,
  Filter,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const TrainingRemediationView: React.FC = () => {
  const {
    remediationQueue,
    assignTraining,
    completeRemediation,
    workers,
    setSelectedWorker,
    runDemoStep,
    demoStep
  } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState<string>('SCN-GAS-04');
  const [targetWorkerId, setTargetWorkerId] = useState<string>('W-104');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search, filter, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Remediation counts
  const totalRemediation = 48;
  const activeRemediation = 18;
  const pendingRemediation = 20;
  const completedRemediation = 10;

  const filteredQueue = remediationQueue.filter(item => {
    const matchSearch =
      item.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.skillGap && item.skillGap.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.moduleName && item.moduleName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQueue.length / pageSize));
  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'All';
  const pendingWorkers = workers.filter(w => w.trainingStatus === 'Remediation Pending');

  const handleSingleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const mod = TRAINING_MODULES.find(m => m.id === selectedModuleId);
    if (mod && targetWorkerId) {
      assignTraining(targetWorkerId, mod.id, mod.name);
      setSuccessMessage(`Module "${mod.name}" successfully assigned to worker ${targetWorkerId}. Offline edge package queued for Substation 12.`);
      setTimeout(() => setSuccessMessage(null), 4000);

      if (demoStep === 10 || demoStep === 11) {
        runDemoStep(12);
      }
    }
  };

  const handleBulkAssign = () => {
    pendingWorkers.forEach(w => {
      assignTraining(w.id, 'SCN-GAS-04', 'Gas Emergency Response & Evacuation');
    });
    setSuccessMessage(`Bulk assigned Module SCN-GAS-04 to all ${pendingWorkers.length} personnel currently in remediation queue.`);
    setTimeout(() => setSuccessMessage(null), 4000);

    if (demoStep === 10 || demoStep === 11) {
      runDemoStep(12);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Safety Training &amp; Remediation Pipeline
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
              3-Attempt Framework
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Governed 3-attempt remediation protocol, ARCore simulator package dispatch, and verification workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl font-bold tabular-nums shadow-2xs">
            Queue: {totalRemediation} Total Records
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-800 hover:text-emerald-950 cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Structured Remediation Status KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Remediation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-400" />
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Total Remediation</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{totalRemediation}</span>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                32.0% of Roster
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Workers with sub-60% module scores</p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Subject to DGMS CMR 2017 Rules
          </div>
        </div>

        {/* Active In Simulation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Active in Training</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-amber-700 tabular-nums">{activeRemediation}</span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                In Simulation
              </span>
            </div>
            <p className="text-xs text-amber-700 mt-1 font-medium">Underground Substation 12 docks</p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Attempt 2 Drills in progress
          </div>
        </div>

        {/* Pending Dispatch */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500" />
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Pending Dispatch</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-rose-700 tabular-nums">{pendingRemediation}</span>
              <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                Action Required
              </span>
            </div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Requires module assignment</p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-rose-600 font-medium">
            Substation dock buffer queued
          </div>
        </div>

        {/* Completed Clearance */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Completed Clearance</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-emerald-800 tabular-nums">{completedRemediation}</span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                Cleared
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Passed Attempt 2 (&ge; 60%)</p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            Credentials reinstated
          </div>
        </div>
      </div>

      {/* 3. Governed 3-Attempt Protocol Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">
                Statutory 3-Attempt Remediation Framework
              </h3>
              <p className="text-xs text-slate-400">DGMS Coal Mines Regulations 2017 &bull; Tech Cir 2024-03</p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold self-start sm:self-auto">
            Pass Standard: &ge; 60%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-100">Attempt 1: Standard Assessment</span>
              <span className="text-[10px] font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">Initial</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Standard AR scenario run. Passing mark (&ge; 60%) immediately mints signed digital credential.
            </p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-amber-500/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-300">Attempt 2: Targeted Remediation</span>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/60 font-semibold">Active</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Triggered automatically on fail (&lt; 60%). LiteRT maps procedural deficits to targeted simulator drills.
            </p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-100">Attempt 3: Final Audit Reassessment</span>
              <span className="text-[10px] font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">Audit Grade</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Randomized tokenized scenario. Persistent failure mandates formal underground work suspension.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Main Grid: Remediation Queue Table (8-col) + Module Dispatcher (4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 8-col: Remediation Queue Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Table Header */}
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                  Active Remediation Docket ({filteredQueue.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personnel queued for targeted simulation following sub-60% assessment scores.
                </p>
              </div>

              {pendingWorkers.length > 0 && (
                <button
                  onClick={handleBulkAssign}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                >
                  Bulk Queue ({pendingWorkers.length} Personnel)
                </button>
              )}
            </div>

            {/* Filter Toolbar */}
            <div className="p-3 sm:p-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search worker name, ID, or skill gap..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={e => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                  >
                    <option value="All">All Records ({remediationQueue.length})</option>
                    <option value="Remediation Pending">Pending</option>
                    <option value="Training Assigned">Assigned</option>
                    <option value="Reassessment Ready">Cleared / Ready</option>
                  </select>
                </div>

                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer px-1 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="table-container overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 min-w-[160px]">Worker &amp; ID</th>
                    <th className="py-3 px-4 min-w-[200px]">Failed Procedural Step</th>
                    <th className="py-3 px-4 w-20 min-w-[80px] text-right">Score</th>
                    <th className="py-3 px-4 w-32 min-w-[120px]">Stage</th>
                    <th className="py-3 px-4 w-36 min-w-[140px]">Status</th>
                    <th className="py-3 px-4 w-24 min-w-[90px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedQueue.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                        <p className="font-semibold text-xs text-slate-800">No Remediation Records</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">All evaluated personnel satisfy or exceed the 60% competency standard.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedQueue.map(item => {
                      const workerObj = workers.find(w => w.id === item.workerId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <button
                              onClick={() => workerObj && setSelectedWorker(workerObj)}
                              className="font-bold text-slate-900 hover:text-amber-800 cursor-pointer block leading-tight text-left"
                            >
                              {item.workerName}
                            </button>
                            <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{item.workerId}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-900 block leading-tight">
                              {item.skillGap || item.moduleName || 'Gas Emergency Response'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {item.recommendedModule || item.failedScenarioId || 'SCN-GAS-04'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-rose-700 tabular-nums text-sm">
                            {item.lastAttemptScore ?? item.lastScore ?? 64}%
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-700 text-xs whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 inline-block">
                              {item.attemptStage || `Attempt ${item.attemptCount} / 3`}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'Reassessment Ready'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : item.status === 'Training Assigned'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {item.status !== 'Reassessment Ready' ? (
                              <button
                                onClick={() => completeRemediation(item.id, 88)}
                                className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
                              >
                                Clear &rarr;
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-mono text-[11px] font-semibold">Cleared</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredQueue.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, filteredQueue.length)} of {filteredQueue.length} items
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
              >
                Prev
              </button>
              <span className="px-2 font-mono font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* 4-col: Simulator Module Dispatcher */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                Simulator Module Dispatcher
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted AR assignment to edge tablet docks.
              </p>
            </div>

            <form onSubmit={handleSingleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                  Select Mining Candidate
                </label>
                <select
                  value={targetWorkerId}
                  onChange={e => setTargetWorkerId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400 cursor-pointer"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.id}) &bull; {w.overallScore}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                  Approved Curriculum Module
                </label>
                <select
                  value={selectedModuleId}
                  onChange={e => setSelectedModuleId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-400 cursor-pointer"
                >
                  {TRAINING_MODULES.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id}) &bull; Standard: 60%
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Dispatch Protocol</span>
                <p className="text-[11px] leading-relaxed">
                  Generates an encrypted store-and-forward package synced with Substation 12 docking station.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enqueue Remediation Drill</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Offline Edge Synced</span>
            <span className="font-mono text-slate-700 font-semibold">AES-256 GCM Package</span>
          </div>
        </div>
      </div>
    </div>
  );
};
