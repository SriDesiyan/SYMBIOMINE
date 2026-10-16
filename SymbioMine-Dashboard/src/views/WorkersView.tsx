import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Worker, SiteLocation, ShiftType, CompetencyLevel } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Award,
  GraduationCap,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export const WorkersView: React.FC = () => {
  const { workers, setSelectedWorker, selectedSite, assignTraining } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [siteFilter, setSiteFilter] = useState<string>('All');
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<keyof Worker>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Bulk selection
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  const [assignSuccessBanner, setAssignSuccessBanner] = useState<string | null>(null);

  // Active filters count
  const isFiltered = searchQuery !== '' || siteFilter !== 'All' || shiftFilter !== 'All' || levelFilter !== 'All' || statusFilter !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSiteFilter('All');
    setShiftFilter('All');
    setLevelFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  // Filtering
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchSearch =
        w.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        w.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        w.role.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        w.badgeNumber?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (siteFilter !== 'All' && w.site !== siteFilter) return false;
      if (selectedSite !== 'All Sites' && w.site !== selectedSite) return false;
      if (shiftFilter !== 'All' && w.shift !== shiftFilter) return false;
      if (levelFilter !== 'All' && w.competencyLevel !== levelFilter) return false;
      if (statusFilter !== 'All' && w.trainingStatus !== statusFilter) return false;

      return true;
    });
  }, [workers, debouncedSearchQuery, siteFilter, selectedSite, shiftFilter, levelFilter, statusFilter]);

  // Sorting
  const sortedWorkers = useMemo(() => {
    return [...filteredWorkers].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredWorkers, sortField, sortAsc]);

  // Paginated
  const totalPages = Math.ceil(sortedWorkers.length / pageSize) || 1;
  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedWorkers.slice(start, start + pageSize);
  }, [sortedWorkers, currentPage, pageSize]);

  const handleSort = (field: keyof Worker) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedWorkerIds(paginatedWorkers.map(w => w.id));
    } else {
      setSelectedWorkerIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedWorkerIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkAssignRemediation = () => {
    selectedWorkerIds.forEach(id => {
      assignTraining(id, 'SCN-GAS-04', 'Gas Emergency Response & Evacuation');
    });
    setAssignSuccessBanner(`Successfully assigned Module SCN-GAS-04 to ${selectedWorkerIds.length} worker(s). Offline sync tokens queued.`);
    setSelectedWorkerIds([]);
    setTimeout(() => setAssignSuccessBanner(null), 5000);
  };

  const handleExportCsv = () => {
    const headers = [
      'Worker ID',
      'Name',
      'Site',
      'Department',
      'Shift',
      'Role',
      'Competency Level',
      'Overall Score',
      'Training Status',
      'Certification Status',
      'Last Assessment',
      'Integrity Status'
    ];

    const rows = sortedWorkers.map(w => [
      w.id,
      `"${w.name}"`,
      `"${w.site}"`,
      `"${w.department}"`,
      w.shift,
      `"${w.role}"`,
      w.competencyLevel,
      w.overallScore,
      w.trainingStatus,
      w.certificationStatus,
      w.lastAssessmentDate,
      w.integrityStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `symbiomine_workforce_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Workforce Competency Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise registry of active mining workforce, verified LiteRT assessment records, and remediation pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {assignSuccessBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{assignSuccessBanner}</span>
          </div>
          <button onClick={() => setAssignSuccessBanner(null)} className="text-emerald-800 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unified Table Container: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* 1. Table Container Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              Workforce Personnel Registry ({filteredWorkers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live roster of certified miners, latest LiteRT edge scores, and statutory status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-semibold tabular-nums">
              {filteredWorkers.length} of {workers.length} Personnel
            </span>
          </div>
        </div>

        {/* 2. Integrated Filter Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="flex-1 min-w-[220px] relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by worker name, ID (e.g. W-104), role, badge..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Site Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Site:</span>
              <select
                value={siteFilter}
                onChange={e => {
                  setSiteFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 cursor-pointer"
              >
                <option value="All">All Sites</option>
                <option value="Jharkhand Underground">Jharkhand Underground</option>
                <option value="Dhanbad Surface">Dhanbad Surface</option>
                <option value="Singrauli OpenCast">Singrauli OpenCast</option>
              </select>
            </div>

            {/* Shift */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Shift:</span>
              <select
                value={shiftFilter}
                onChange={e => {
                  setShiftFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 cursor-pointer"
              >
                <option value="All">All Shifts</option>
                <option value="Shift A">Shift A (Morning)</option>
                <option value="Shift B">Shift B (Afternoon)</option>
                <option value="Shift C">Shift C (Night)</option>
              </select>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Level:</span>
              <select
                value={levelFilter}
                onChange={e => {
                  setLevelFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Expert">Excellent (90-100%)</option>
                <option value="Proficient">Proficient (80-89%)</option>
                <option value="Competent">Competent (60-79%)</option>
                <option value="Remediation Required">Remediation Required (&lt; 60%)</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Up to date">Up to date</option>
                <option value="Remediation Pending">Remediation Pending</option>
                <option value="Training Assigned">Training Assigned</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 underline cursor-pointer font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Selected Workers Action Banner */}
          {selectedWorkerIds.length > 0 && (
            <div className="p-2.5 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 font-mono">{selectedWorkerIds.length}</span>
                <span>personnel selected in roster</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkAssignRemediation}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                >
                  Assign Gas Remediation (SCN-GAS-04)
                </button>
                <button
                  onClick={() => setSelectedWorkerIds([])}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
                >
                  Deselect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Table */}
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[1140px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-10 min-w-[40px]">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedWorkers.length > 0 &&
                      paginatedWorkers.every(w => selectedWorkerIds.includes(w.id))
                    }
                    className="rounded text-slate-900 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('id')}
                  className="py-2.5 px-3 w-28 min-w-[100px] cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Worker ID</span>
                    {sortField === 'id' ? (
                      sortAsc ? <ArrowUp className="w-3 h-3 text-slate-800" /> : <ArrowDown className="w-3 h-3 text-slate-800" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-2.5 px-3 min-w-[200px] cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Name &amp; Role</span>
                    {sortField === 'name' ? (
                      sortAsc ? <ArrowUp className="w-3 h-3 text-slate-800" /> : <ArrowDown className="w-3 h-3 text-slate-800" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th className="py-2.5 px-3 min-w-[180px]">Sector / Department</th>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Shift</th>
                <th
                  onClick={() => handleSort('overallScore')}
                  className="py-2.5 px-3 w-32 min-w-[120px] cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Score &amp; Level</span>
                    {sortField === 'overallScore' ? (
                      sortAsc ? <ArrowUp className="w-3 h-3 text-slate-800" /> : <ArrowDown className="w-3 h-3 text-slate-800" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th className="py-2.5 px-3 w-36 min-w-[130px]">Training Status</th>
                <th className="py-2.5 px-3 w-32 min-w-[110px]">Certification</th>
                <th className="py-2.5 px-3 w-28 min-w-[110px]">Last Assessed</th>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Integrity</th>
                <th className="py-2.5 px-3 w-24 min-w-[90px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedWorkers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold text-slate-800">
                        No personnel records match your filter criteria
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Try modifying search keywords, selecting a different site, or resetting all filters.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWorkers.map(w => {
                  const isSelected = selectedWorkerIds.includes(w.id);
                  const isPassing = w.overallScore >= 60;

                  return (
                    <tr
                      key={w.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-slate-100/60' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(w.id)}
                          className="rounded text-slate-900 cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="hover:text-amber-800 cursor-pointer"
                        >
                          {w.id}
                        </button>
                      </td>

                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="font-bold text-slate-900 hover:text-amber-800 cursor-pointer block text-left leading-tight"
                        >
                          {w.name}
                        </button>
                        <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                          {w.role} &bull; <span className="font-mono text-[10px] text-slate-400">Badge: {w.badgeNumber}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-slate-800 font-medium block leading-tight">{w.site}</span>
                        <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{w.department}</span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {w.shift}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs tabular-nums px-1.5 py-0.5 rounded ${
                              isPassing
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {w.overallScore}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                          {w.competencyLevel}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            w.trainingStatus === 'Up to date'
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : w.trainingStatus === 'Remediation Pending'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {w.trainingStatus}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            w.certificationStatus === 'Valid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : w.certificationStatus === 'Expiring Soon'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {w.certificationStatus}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {w.lastAssessmentDate}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            w.integrityStatus === 'Clear' ? 'text-emerald-800' : 'text-rose-700 font-semibold'
                          }`}
                        >
                          {w.integrityStatus === 'Clear' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          )}
                          <span>{w.integrityStatus}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] cursor-pointer transition-colors shrink-0"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <strong className="text-slate-900 font-mono">{paginatedWorkers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, sortedWorkers.length)}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{sortedWorkers.length}</strong> personnel (Total: {workers.length})
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
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
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
    </div>
  );
};
