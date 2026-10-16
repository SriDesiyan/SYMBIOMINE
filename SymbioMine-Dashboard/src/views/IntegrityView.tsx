import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  FileSearch,
  Lock,
  Clock,
  Fingerprint,
  Activity,
  Layers,
  Search
} from 'lucide-react';

export const IntegrityView: React.FC = () => {
  const { integrityFlags, resolveIntegrityFlag, setSelectedWorker, workers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedFlagLog, setSelectedFlagLog] = useState<any | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredFlags = integrityFlags.filter(f => {
    const matchSearch =
      f.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.flagType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filterStatus !== 'All' && f.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFlags.length / pageSize));
  const paginatedFlags = filteredFlags.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || filterStatus !== 'All';

  const openCount = integrityFlags.filter(f => f.status === 'Open Flag').length;
  const clearedCount = integrityFlags.filter(f => f.status === 'Cleared').length;

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Assessment Integrity &amp; Anti-Fraud Heuristics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time verification logs tracking randomized scenario tokens, completion velocity anomalies, and credential integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-semibold tabular-nums ${
            openCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {openCount} Open Exceptions
          </span>
        </div>
      </div>

      {/* 2. Integrity Indicator KPI Cards (Desktop: Exactly 4 cards per row, equal height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Token Validity</span>
              <Lock className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-700 tabular-nums">1 Flag</span>
              <span className="text-xs font-mono text-rose-700 font-bold">Investigation</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Replay cache hash mismatch
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Velocity Anomalies</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 tabular-nums">1 Flag</span>
              <span className="text-xs font-mono text-amber-700 font-bold">&le; 8s Sequence</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Unrealistic step transit speed
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Biometric Match</span>
              <Fingerprint className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-800 tabular-nums">0 Flags</span>
              <span className="text-xs font-mono text-emerald-700 font-bold">100% Match</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            Operator signature verified
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Concurrent Sessions</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-800 tabular-nums">0 Flags</span>
              <span className="text-xs font-mono text-emerald-700 font-bold">Single Bound</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            Hardware tablet lock enforced
          </div>
        </div>
      </div>

      {/* 3. Unified Table Container: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Container Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              Integrity Audit Exceptions ({filteredFlags.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Heuristic flags raised by edge diagnostic engine requiring safety supervisor review and forensic resolution.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2.5 py-1 rounded-md border font-semibold tabular-nums ${
              openCount > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {filteredFlags.length} of {integrityFlags.length} Exceptions
            </span>
          </div>
        </div>

        {/* Integrated Filter Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, ID, or forensic flag description..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              <select
                value={filterStatus}
                onChange={e => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
              >
                <option value="All">All Exceptions</option>
                <option value="Open Flag">Open Flag</option>
                <option value="Under Review">Under Review</option>
                <option value="Cleared">Cleared</option>
                <option value="Reassessment Requested">Reassessment Requested</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer px-1 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[1080px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Flag ID</th>
                <th className="py-2.5 px-3 min-w-[160px]">Candidate Worker</th>
                <th className="py-2.5 px-3 min-w-[150px]">Anomaly Category</th>
                <th className="py-2.5 px-3 min-w-[240px]">Forensic Description</th>
                <th className="py-2.5 px-3 w-24 min-w-[90px]">Severity</th>
                <th className="py-2.5 px-3 w-28 min-w-[110px]">Status</th>
                <th className="py-2.5 px-3 w-56 min-w-[210px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedFlags.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-800 text-xs">No Integrity Exceptions Found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">All monitored sessions conform to biometric, velocity, and cryptographic requirements.</p>
                  </td>
                </tr>
              ) : (
                paginatedFlags.map(flag => {
                  const workerObj = workers.find(w => w.id === flag.workerId);
                  const isOpen = flag.status === 'Open Flag';

                  return (
                    <tr key={flag.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {flag.id}
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => workerObj && setSelectedWorker(workerObj)}
                          className="font-bold text-slate-900 hover:text-amber-800 cursor-pointer block text-left leading-tight"
                        >
                          {flag.workerName}
                        </button>
                        <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{flag.workerId}</span>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-900">
                        {flag.flagType}
                      </td>

                      <td className="py-3 px-3 text-slate-600 max-w-sm">
                        <span className="line-clamp-1">{flag.description}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            (flag.severity || flag.riskScore)?.toUpperCase() === 'HIGH'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {flag.severity || flag.riskScore}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            isOpen
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {flag.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 flex-nowrap shrink-0">
                          <button
                            onClick={() => setSelectedFlagLog(flag)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-xs shrink-0"
                          >
                            Forensic Trace
                          </button>

                          {isOpen && (
                            <button
                              onClick={() => resolveIntegrityFlag(flag.id, 'Supervised Retest Scheduled')}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md cursor-pointer transition-colors shrink-0"
                            >
                              Mandate Retest
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <strong className="text-slate-900 font-mono">{paginatedFlags.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, filteredFlags.length)}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{filteredFlags.length}</strong> exceptions (Total: {integrityFlags.length})
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-40 text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer text-xs shadow-xs"
            >
              Previous
            </button>

            <span className="px-2.5 text-xs font-mono font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-40 text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer text-xs shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Trace Details Modal */}
      {selectedFlagLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm font-sans tracking-wide">
                  Integrity Forensic Telemetry Trace
                </h3>
              </div>
              <button
                onClick={() => setSelectedFlagLog(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Flag Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedFlagLog.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Worker Candidate:</span>
                  <span className="font-bold text-slate-900">{selectedFlagLog.workerName} ({selectedFlagLog.workerId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Anomaly Classification:</span>
                  <span className="font-medium text-slate-900">{selectedFlagLog.flagType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Incident Timestamp:</span>
                  <span className="font-mono text-slate-700">{selectedFlagLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Severity Assessment:</span>
                  <span className="font-bold text-rose-700">{selectedFlagLog.severity || selectedFlagLog.riskScore}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Sensor / Execution Telemetry Diagnostic
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  {selectedFlagLog.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold block">Recommended Supervisor Procedure:</span>
                <p className="text-[11px] leading-relaxed">
                  Invalidate prior assessment token. Assign an invigilated proctored session with live device telemetry feed.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400">DGMS Anti-Collusion Engine</span>
              <button
                onClick={() => setSelectedFlagLog(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
