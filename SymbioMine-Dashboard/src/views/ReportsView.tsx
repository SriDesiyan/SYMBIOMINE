import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Shield,
  CheckCircle2,
  Calendar,
  Building,
  Users,
  X,
  FileCheck2,
  AlertCircle,
  Search,
  Eye,
  FileSpreadsheet,
  FileCode2
} from 'lucide-react';

interface ArchivedDossier {
  id: string;
  title: string;
  site: string;
  format: 'PDF' | 'CSV' | 'JSON';
  generatedDate: string;
  generatedBy: string;
  sha256Hash: string;
  status: 'Statutory Certified' | 'DGMS Lodged' | 'Archived';
  fileSize: string;
}

const INITIAL_DOSSIERS: ArchivedDossier[] = [
  {
    id: 'DOS-2026-0922-DGMS',
    title: 'DGMS Regulatory Compliance Dossier (Q3-2026)',
    site: 'Jharkhand Underground Heading 9',
    format: 'PDF',
    generatedDate: '2026-09-22 09:15',
    generatedBy: 'Safety Director (S. Roy)',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Statutory Certified',
    fileSize: '2.4 MB'
  },
  {
    id: 'DOS-2026-0921-WKR',
    title: 'Workforce Competency Telemetry Master Audit',
    site: 'All Sites (Consolidated)',
    format: 'CSV',
    generatedDate: '2026-09-21 16:40',
    generatedBy: 'Assessor Edge Core',
    sha256Hash: '8a11bc3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc0183711',
    status: 'DGMS Lodged',
    fileSize: '412 KB'
  },
  {
    id: 'DOS-2026-0920-SHF',
    title: 'Shift Safety Readiness Certification — Shift B',
    site: 'Jharkhand Underground Heading 9',
    format: 'PDF',
    generatedDate: '2026-09-20 07:05',
    generatedBy: 'Shift Supervisor (A. Banerjee)',
    sha256Hash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    status: 'Statutory Certified',
    fileSize: '1.8 MB'
  },
  {
    id: 'DOS-2026-0919-EXP',
    title: 'Expired & At-Risk Credential Register',
    site: 'Dhanbad Surface Operations',
    format: 'JSON',
    generatedDate: '2026-09-19 14:22',
    generatedBy: 'DGMS Credential Gateway',
    sha256Hash: '44d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01837119f82c411',
    status: 'DGMS Lodged',
    fileSize: '188 KB'
  },
  {
    id: 'DOS-2026-0918-LOTO',
    title: 'High-Voltage LOTO Procedural Compliance Filing',
    site: 'Substation #2 Surface',
    format: 'PDF',
    generatedDate: '2026-09-18 11:30',
    generatedBy: 'Electrical Engineer (R. Sen)',
    sha256Hash: '12b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b812',
    status: 'Archived',
    fileSize: '3.1 MB'
  },
  {
    id: 'DOS-2026-0915-GAS',
    title: 'Methane Ingress & Blind Heading Evacuation Report',
    site: 'Jharkhand Underground Heading 9',
    format: 'PDF',
    generatedDate: '2026-09-15 17:15',
    generatedBy: 'Ventilation Officer',
    sha256Hash: '9f82c411b0e3344d187cf45a8b291c78491a56e9c0114b3d8819203a74efbc01',
    status: 'Statutory Certified',
    fileSize: '2.9 MB'
  }
];

export const ReportsView: React.FC = () => {
  const { workers, certificates, remediationQueue, selectedSite } = useApp();

  const [reportType, setReportType] = useState('DGMS Regulatory Compliance Dossier');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeModalDossierTitle, setActiveModalDossierTitle] = useState('DGMS Regulatory Compliance Dossier');

  // Archive Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const reportOptions = [
    {
      id: 'dgms',
      title: 'DGMS Regulatory Compliance Dossier',
      description: 'Official statutory compliance filing detailing overall assessment coverage, minimum 60% pass mark adherence, and safety breach logs.',
      stat: 'Statutory Standard (Rule 1961)'
    },
    {
      id: 'workforce-audit',
      title: 'Workforce Competency Audit Report',
      description: 'Granular assessment telemetry for all 150 mining personnel, domain breakdown scores, and active remedial training pipeline.',
      stat: '150 Personnel Evaluated'
    },
    {
      id: 'shift-readiness',
      title: 'Shift Safety Readiness Certification',
      description: 'Pre-shift operational readiness assessment certifying active shift rosters against high-risk underground hazard gates.',
      stat: 'Generated Daily per Shift'
    },
    {
      id: 'at-risk-certs',
      title: 'Expired & At-Risk Credential Register',
      description: 'Regulatory register of all personnel credentials expiring within 30 days or held in suspense under forensic audit investigation.',
      stat: `${certificates.filter(c => c.verificationStatus !== 'Valid').length} Records Flagged`
    }
  ];

  const filteredDossiers = INITIAL_DOSSIERS.filter(d => {
    const matchSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (formatFilter !== 'All' && d.format !== formatFilter) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDossiers.length / pageSize));
  const paginatedDossiers = filteredDossiers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setFormatFilter('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || formatFilter !== 'All';

  const handleExport = (fmtOverride?: 'PDF' | 'CSV' | 'JSON', titleOverride?: string) => {
    const formatToUse = fmtOverride || reportFormat;
    const titleToUse = titleOverride || reportType;

    if (formatToUse === 'CSV') {
      const csvData =
        'Report:,' + titleToUse + '\n' +
        'Generated:,' + new Date().toISOString() + '\n' +
        'Site:,' + selectedSite + '\n\n' +
        'Worker ID,Name,Role,Competency Score,Certification Status\n' +
        workers.map(w => `${w.id},"${w.name}","${w.role}",${w.overallScore}%,${w.certificationStatus}`).join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `symbiomine_report_${Date.now()}.csv`;
      a.click();
    } else if (formatToUse === 'JSON') {
      const jsonData = JSON.stringify({
        report: titleToUse,
        generatedAt: new Date().toISOString(),
        site: selectedSite,
        totalWorkers: workers.length,
        averageScore: (workers.reduce((a, b) => a + b.overallScore, 0) / workers.length).toFixed(1),
        records: workers
      }, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `symbiomine_report_${Date.now()}.json`;
      a.click();
    } else {
      setActiveModalDossierTitle(titleToUse);
      setShowPreviewModal(true);
    }
  };

  const openDossierPreview = (title: string) => {
    setActiveModalDossierTitle(title);
    setShowPreviewModal(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Safety Reporting &amp; Statutory Regulatory Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit-grade compliance reporting aligned with Directorate General of Mines Safety (DGMS) statutory frameworks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            {(['PDF', 'CSV', 'JSON'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setReportFormat(fmt)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs ${
                  reportFormat === fmt ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate {reportFormat}</span>
          </button>
        </div>
      </div>

      {/* 2. Reports Options Grid (2x2 consistent 12-col layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportOptions.map(rep => {
          const isSelected = reportType === rep.title;
          return (
            <div
              key={rep.id}
              onClick={() => setReportType(rep.title)}
              className={`p-5 rounded-xl border text-xs cursor-pointer transition-all shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/60 border-amber-400 ring-1 ring-amber-400/40'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{rep.title}</h3>
                      <span className="text-[11px] font-mono text-amber-800 font-semibold">{rep.stat}</span>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                    isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="text-slate-600 mt-3 text-xs leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Outputs: PDF / CSV / JSON</span>
                <span className="font-semibold text-slate-800">DGMS Verified Form</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Selected Report Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-sans">
                Active Dossier: {reportType}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target facility: <strong className="text-slate-800">{selectedSite}</strong> &bull; Compiled from live telemetry ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openDossierPreview(reportType)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Full Print Dossier</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-sans">Workforce Scope</span>
            <span className="font-mono font-bold text-slate-900 text-base tabular-nums mt-0.5 block">{workers.length} Personnel</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Full underground cohort</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-sans">Statutory Pass Mark Adherence</span>
            <span className="font-mono font-bold text-emerald-800 text-base tabular-nums mt-0.5 block">100% Locked (&ge; 60%)</span>
            <span className="text-[10px] text-emerald-700 mt-1 block font-medium">DGMS Rule 1961 strict policy</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-sans">Audit Signature Status</span>
            <span className="font-mono font-bold text-slate-900 text-base mt-0.5 block">SHA-256 Digest</span>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">Immutable ledger verified</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Authority: Ministry of Labour &amp; Employment, Mines Act 1952</span>
          <span className="font-mono text-emerald-800 font-bold">Standard Compliant</span>
        </div>
      </div>

      {/* 4. Unified Dossier Archive Table: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              Statutory Dossier Audit Log &amp; Historical Filings ({filteredDossiers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable register of generated compliance packages, cryptographic digests, and statutory lodging records.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500 shrink-0">
            <strong className="text-slate-900 tabular-nums">{filteredDossiers.length}</strong> of {INITIAL_DOSSIERS.length} Archived Dossiers
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by dossier ID, title, site, or author..."
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
              <span className="text-slate-500 font-semibold">Format:</span>
              <select
                value={formatFilter}
                onChange={e => {
                  setFormatFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
              >
                <option value="All">All Formats ({INITIAL_DOSSIERS.length})</option>
                <option value="PDF">PDF Reports</option>
                <option value="CSV">CSV Telemetry</option>
                <option value="JSON">JSON Manifests</option>
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
          <table className="w-full text-left text-xs min-w-[1140px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-32 min-w-[120px]">Dossier ID</th>
                <th className="py-2.5 px-3 min-w-[220px]">Statutory Filing Title</th>
                <th className="py-2.5 px-3 w-44 min-w-[160px]">Jurisdiction / Site</th>
                <th className="py-2.5 px-3 w-44 min-w-[160px]">Timestamp &amp; Assessor</th>
                <th className="py-2.5 px-3 w-24 min-w-[90px]">Format</th>
                <th className="py-2.5 px-3 w-36 min-w-[140px]">SHA-256 Digest</th>
                <th className="py-2.5 px-3 w-36 min-w-[140px]">Status</th>
                <th className="py-2.5 px-3 w-40 min-w-[150px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDossiers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <FileText className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                    <p className="font-semibold text-xs text-slate-800">No Matching Dossiers</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Try adjusting your search criteria or resetting filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedDossiers.map(dossier => (
                  <tr key={dossier.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {dossier.id}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-[220px]">
                      <span className="block truncate">{dossier.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">{dossier.fileSize}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      {dossier.site}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-700 block">{dossier.generatedDate}</span>
                      <span className="text-[10px] text-slate-500 block">{dossier.generatedBy}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700">
                        {dossier.format === 'PDF' && <FileText className="w-3.5 h-3.5 text-rose-600" />}
                        {dossier.format === 'CSV' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
                        {dossier.format === 'JSON' && <FileCode2 className="w-3.5 h-3.5 text-sky-600" />}
                        <span>{dossier.format}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                      <span className="truncate block max-w-[120px]" title={dossier.sha256Hash}>
                        {dossier.sha256Hash.substring(0, 16)}...
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                        dossier.status === 'Statutory Certified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : dossier.status === 'DGMS Lodged'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {dossier.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 flex-nowrap shrink-0">
                        <button
                          onClick={() => openDossierPreview(dossier.title)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0"
                        >
                          <Eye className="w-3 h-3 text-slate-600" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleExport(dossier.format, dossier.title)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-xs flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3 h-3 text-slate-600" />
                          <span>Fetch</span>
                        </button>
                      </div>
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
              Showing <strong className="text-slate-900 font-mono">{paginatedDossiers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, filteredDossiers.length)}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{filteredDossiers.length}</strong> (Total: {INITIAL_DOSSIERS.length})
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
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
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

      {/* Printable Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
            {/* Modal Bar */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Statutory Compliance Dossier &bull; Print Preview
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-800 bg-white">
              {/* Document Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  Government of India &bull; Ministry of Labour &amp; Employment
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1 font-serif">
                  DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
                </h2>
                <h3 className="text-xs font-bold font-mono text-slate-700 mt-0.5">
                  {activeModalDossierTitle}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  Issued under the Mines Act, 1952 &bull; Metalliferous Mines Regulations
                </span>
              </div>

              {/* Dossier Meta Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Mining Lease / Site:</span>
                  <span className="font-bold text-slate-900">{selectedSite}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Report Generation Timestamp:</span>
                  <span className="font-mono text-slate-800">{new Date().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Authorized Safety Assessor:</span>
                  <span className="font-bold text-slate-900">SymbioMine Edge Audit Core v2.4</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Regulatory Compliance Standard:</span>
                  <span className="font-mono font-bold text-emerald-800">DGMS Standard: &ge; 60% Mandatory</span>
                </div>
              </div>

              {/* Summary Stats Table */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">
                  Workforce Competency Verification Summary
                </h4>
                <div className="table-container overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border border-slate-200 min-w-[500px]">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Metric</th>
                      <th className="p-2 text-right">Count / Value</th>
                      <th className="p-2">Statutory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-medium">Total Mining Cohort Evaluated</td>
                      <td className="p-2 text-right font-mono font-bold tabular-nums">{workers.length} Workers</td>
                      <td className="p-2 text-emerald-800 font-semibold">100% Coverage</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Cohort Average Competency Score</td>
                      <td className="p-2 text-right font-mono font-bold tabular-nums">
                        {(workers.reduce((a, b) => a + b.overallScore, 0) / workers.length).toFixed(1)}%
                      </td>
                      <td className="p-2 text-emerald-800 font-semibold">&gt; 60% Statutory Minimum</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Active Remedial Training Pipeline</td>
                      <td className="p-2 text-right font-mono font-bold tabular-nums">{remediationQueue.length} Personnel</td>
                      <td className="p-2 text-amber-800 font-semibold">Under Supervised Remediation</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Ledger Hash Authenticated Records</td>
                      <td className="p-2 text-right font-mono font-bold tabular-nums">{certificates.length} Cryptographic Tokens</td>
                      <td className="p-2 text-emerald-800 font-semibold">SHA-256 Ledger Certified</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>

              {/* Official Seal / Signature Area */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 block">Ledger Verification Digest:</span>
                  <span className="font-mono text-[10px] text-slate-700 block">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="font-semibold text-slate-800 block">DGMS Inspecting Officer</span>
                  <span className="text-[10px] block">Digital Signature &amp; Stamp</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
