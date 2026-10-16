import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateRecord } from '../types';
import { QRCodeView } from '../components/common/QRCodeView';
import {
  Search,
  QrCode,
  CheckCircle2,
  Clock,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Award,
  X,
  Copy,
  Check,
  FileCheck,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';

export const CertificationsView: React.FC = () => {
  const { certificates, setIsScanQrModalOpen, revokeCertificate, openQrGenerator } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalCerts = certificates.length;
  const validCount = certificates.filter(c => c.verificationStatus === 'Valid').length;
  const expiringCount = certificates.filter(c => c.verificationStatus === 'Expiring Soon').length;
  const nonValidCount = certificates.filter(c => c.verificationStatus === 'Expired' || c.verificationStatus === 'Revoked').length;

  const filteredCerts = certificates.filter(c => {
    const matchSearch =
      c.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.moduleName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'All' && c.verificationStatus !== statusFilter) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCerts.length / pageSize));
  const paginatedCerts = filteredCerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'All';

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Cryptographic Safety Credential Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            DGMS-recognized digital competency credentials secured with SHA-256 ledger digests and verifiable QR payloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openQrGenerator()}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Generate QR Token</span>
          </button>

          <button
            onClick={() => setIsScanQrModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verify Credential QR</span>
          </button>
        </div>
      </div>

      {/* 2. Summary KPI Cards (Desktop: Exactly 4 cards per row, equal height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Total Credentials</span>
              <BadgeCheck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">{totalCerts}</span>
              <span className="text-xs font-mono text-slate-500">Minted</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            SHA-256 ledger authenticated
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Valid &amp; Active</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-800 tabular-nums">{validCount}</span>
              <span className="text-xs font-mono text-emerald-700 font-bold">
                {((validCount / totalCerts) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            Full compliance verified
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Expiring Soon</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 tabular-nums">{expiringCount}</span>
              <span className="text-xs font-mono text-amber-700 font-bold">Next 30 Days</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-amber-700 font-medium">
            Renewal assessment required
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Revoked / Expired</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-700 tabular-nums">{nonValidCount}</span>
              <span className="text-xs font-mono text-rose-700 font-bold">Suspended</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-rose-600 font-medium">
            Restricted site clearance
          </div>
        </div>
      </div>

      {/* 3. Unified Table Container: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Container Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              Digital Safety Credential Registry ({filteredCerts.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live cryptographic verification ledger of worker competencies, token digests, and expiry timelines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-semibold tabular-nums">
              {filteredCerts.length} of {certificates.length} Credentials
            </span>
          </div>
        </div>

        {/* Integrated Filter Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, ID, or certificate token..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 cursor-pointer"
              >
                <option value="All">All Credentials ({certificates.length})</option>
                <option value="Valid">Valid</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Expired">Expired</option>
                <option value="Revoked">Revoked</option>
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
          <table className="w-full text-left text-xs min-w-[1140px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-32 min-w-[120px]">Certificate ID</th>
                <th className="py-2.5 px-3 min-w-[160px]">Candidate</th>
                <th className="py-2.5 px-3 min-w-[180px]">Standard Module</th>
                <th className="py-2.5 px-3 w-28 min-w-[110px]">Level</th>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Issue Date</th>
                <th className="py-2.5 px-3 w-28 min-w-[100px]">Valid Until</th>
                <th className="py-2.5 px-3 w-36 min-w-[140px]">Ledger Digest</th>
                <th className="py-2.5 px-3 w-32 min-w-[120px]">Status</th>
                <th className="py-2.5 px-3 w-48 min-w-[180px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500 text-xs">
                    No certificate records match current filters.
                  </td>
                </tr>
              ) : (
                paginatedCerts.map(cert => {
                  const isValid = cert.verificationStatus === 'Valid';
                  const isExpiring = cert.verificationStatus === 'Expiring Soon';
                  const isRevoked = cert.verificationStatus === 'Revoked';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {cert.id}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block leading-tight">{cert.workerName}</span>
                        <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{cert.workerId}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-900 block leading-tight">{cert.moduleName}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{cert.issuer}</span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {cert.competencyLevel}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                        {cert.issueDate}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                        {cert.expiryDate}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                        <button
                          onClick={() => handleCopyHash(cert.sha256Hash)}
                          className="hover:text-slate-900 inline-flex items-center gap-1 text-slate-500 hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer"
                          title="Click to copy SHA-256 digest"
                        >
                          <span>{cert.sha256Hash.slice(0, 12)}...</span>
                          {copiedHash === cert.sha256Hash ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isValid
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isExpiring
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isRevoked
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isValid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isExpiring && <Clock className="w-3 h-3 text-amber-600" />}
                          {isRevoked && <Ban className="w-3 h-3 text-rose-600" />}
                          <span>{cert.verificationStatus.toUpperCase()}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 flex-nowrap shrink-0">
                          <button
                            onClick={() => {
                              const payload =
                                cert.qrPayload ||
                                `SYMBIOMINE::${cert.id}::${cert.workerId}::${cert.verificationStatus.toUpperCase()}::SHA256:${cert.sha256Hash}`;
                              openQrGenerator(payload, `Credential: ${cert.id}`, `${cert.workerName} (${cert.workerId})`);
                            }}
                            className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1 shrink-0"
                            title="Generate QR code token"
                          >
                            <QrCode className="w-3 h-3 text-amber-600" />
                            <span>QR</span>
                          </button>

                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors shadow-xs shrink-0"
                          >
                            Inspect
                          </button>
                          {isValid && (
                            <button
                              onClick={() => revokeCertificate(cert.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md cursor-pointer transition-colors shrink-0"
                            >
                              Revoke
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
              Showing <strong className="text-slate-900 font-mono">{paginatedCerts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, filteredCerts.length)}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{filteredCerts.length}</strong> credentials (Total: {certificates.length})
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

      {/* Credential Inspection Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm font-sans tracking-wide">
                  DGMS Credential Verification
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Verification Status</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedCert.verificationStatus}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Worker Name:</span>
                  <span className="font-bold text-slate-900">{selectedCert.workerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Worker ID:</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedCert.workerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Module Passed:</span>
                  <span className="font-medium text-slate-900">{selectedCert.moduleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Competency Level:</span>
                  <span className="font-bold text-slate-900">{selectedCert.competencyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="text-slate-700">{selectedCert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issue Date:</span>
                  <span className="font-mono text-slate-700">{selectedCert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valid Until:</span>
                  <span className="font-mono text-slate-700">{selectedCert.expiryDate}</span>
                </div>
              </div>

              {/* SHA-256 Box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  SHA-256 Immutable Cryptographic Digest
                </span>
                <div className="font-mono text-[11px] text-slate-700 break-all select-all">
                  {selectedCert.sha256Hash}
                </div>
              </div>

              {/* Inbuilt Generated QR Code */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">
                  Inbuilt Cryptographic QR Token
                </span>
                <QRCodeView
                  value={
                    selectedCert.qrPayload ||
                    `SYMBIOMINE::${selectedCert.id}::${selectedCert.workerId}::${selectedCert.verificationStatus.toUpperCase()}::SHA256:${selectedCert.sha256Hash}`
                  }
                  size={140}
                  level="H"
                  showDownloadButton={true}
                  showCopyButton={true}
                  fileName={`symbiomine-cert-${selectedCert.id}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const payload =
                      selectedCert.qrPayload ||
                      `SYMBIOMINE::${selectedCert.id}::${selectedCert.workerId}::${selectedCert.verificationStatus.toUpperCase()}::SHA256:${selectedCert.sha256Hash}`;
                    setSelectedCert(null);
                    openQrGenerator(payload, `Credential: ${selectedCert.id}`, `${selectedCert.workerName} (${selectedCert.workerId})`);
                  }}
                  className="mt-2.5 text-[11px] text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Full QR Code Studio &amp; Export SVG</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
