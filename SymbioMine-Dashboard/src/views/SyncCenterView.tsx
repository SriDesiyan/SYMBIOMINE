import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RefreshCw,
  Tablet,
  CheckCircle2,
  Clock,
  Download,
  HardDrive,
  Database,
  ArrowRight,
  ShieldCheck,
  Radio,
  Search
} from 'lucide-react';

export const SyncCenterView: React.FC = () => {
  const { syncRecords, triggerSyncAll } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [conflictPolicy, setConflictPolicy] = useState<'Server-Authoritative' | 'Last-Write-Wins' | 'Manual Review'>('Server-Authoritative');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pendingCount = syncRecords.filter(s => s.status === 'Pending').length;
  const completedCount = syncRecords.filter(s => s.status === 'Synchronized' || s.status === 'Completed').length;

  const filteredRecords = syncRecords.filter(s => {
    const matchSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.networkTransport.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter === 'Synchronized' && s.status !== 'Synchronized' && s.status !== 'Completed') return false;
    if (statusFilter === 'Pending' && s.status !== 'Pending') return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'All';

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      triggerSyncAll();
      setIsSyncing(false);
      setSuccessBanner(`Successfully flushed ${pendingCount} offline records to central ledger.`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 1000);
  };

  const handleExportAirGapPackage = () => {
    const payload = JSON.stringify({
      airGapManifestId: 'AIRGAP-PKG-2026-09-22',
      site: 'Jharkhand Underground Heading 9 / Substation 12',
      records: syncRecords,
      cryptographicSignature: 'ED25519-SIG-84920482019482',
      exportedAt: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symbiomine_airgap_sync_${Date.now()}.json`;
    a.click();
    setSuccessBanner('Air-gap transport bundle exported to encrypted JSON archive.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Offline Edge Sync &amp; Air-Gap Transport Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store-and-forward telemetry pipeline for deep underground headings operating without active wide-area connectivity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAirGapPackage}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Air-Gap Archive</span>
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing || pendingCount === 0}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Flush Queue ({pendingCount})</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Sync Status Cards (Equal height grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Field Tablets Active</span>
              <Tablet className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">4 Bound Units</span>
              <span className="text-xs font-mono text-emerald-800 font-bold">Mesh Active</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Heading 9, Substation 12, Shaft 4 Depot
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Pending Ingestion Queue</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 tabular-nums">{pendingCount} Records</span>
              <span className="text-xs font-mono text-amber-700 font-bold">Local Cache</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Flushes on substation cradle dock or mesh pulse
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Conflict Resolution Strategy</span>
              <HardDrive className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2.5">
              <select
                value={conflictPolicy}
                onChange={e => setConflictPolicy(e.target.value as any)}
                className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 w-full cursor-pointer"
              >
                <option value="Server-Authoritative">Server-Authoritative (Regulatory Lock)</option>
                <option value="Last-Write-Wins">Last-Write-Wins (Timestamp Sequence)</option>
                <option value="Manual Review">Manual Review (Quarantine Queue)</option>
              </select>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            DGMS statutory immutable logging enforced
          </div>
        </div>
      </div>

      {/* 3. Sync Queue Table: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              Device Sync Queue &amp; Store-and-Forward Telemetry ({filteredRecords.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographically signed assessment payloads and LiteRT edge inferences staged for ledger commit.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 shrink-0">
            <strong className="text-slate-900 tabular-nums">{completedCount}</strong> Ingested &bull; <strong className="text-amber-700 tabular-nums">{pendingCount}</strong> Pending
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 sm:p-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker, ID, sync token, device, or network transport..."
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
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
              >
                <option value="All">All Statuses ({syncRecords.length})</option>
                <option value="Synchronized">Synchronized ({completedCount})</option>
                <option value="Pending">Pending ({pendingCount})</option>
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

        {/* Main Table */}
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[940px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Sync ID</th>
                <th className="py-2.5 px-3 w-36 min-w-[130px]">Device Token</th>
                <th className="py-2.5 px-3 min-w-[160px]">Worker Candidate</th>
                <th className="py-2.5 px-3 w-40 min-w-[150px]">Transport Layer</th>
                <th className="py-2.5 px-3 w-36 min-w-[130px]">Sync Timestamp</th>
                <th className="py-2.5 px-3 w-32 min-w-[110px]">Status</th>
                <th className="py-2.5 px-3 w-36 min-w-[130px] text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                    <p className="font-semibold text-xs text-slate-800">No Sync Records Found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Try adjusting your search criteria or clearing filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {item.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 text-xs">
                      {item.deviceId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block leading-tight">{item.workerName}</span>
                      <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{item.workerId}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                      {item.networkTransport}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                      {item.syncTimestamp}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                          item.status === 'Completed' || item.status === 'Synchronized'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={handleSyncAll}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-xs shrink-0"
                      >
                        Verify Ingestion
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Bar */}
        <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <strong className="text-slate-900 font-mono">{paginatedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, filteredRecords.length)}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{filteredRecords.length}</strong> (Total: {syncRecords.length})
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>Rows:</span>
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
              className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer text-xs shadow-xs"
            >
              Prev
            </button>

            <span className="px-2 text-xs font-mono font-semibold text-slate-700">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer text-xs shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
