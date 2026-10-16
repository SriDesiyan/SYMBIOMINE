import React from 'react';
import { useApp } from '../context/AppContext';
import { ScanLine, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const statusStyle = (s: string) =>
  s === 'Valid' ? 'text-safe bg-emerald-50 border-emerald-200'
  : s === 'Revoked' || s === 'Expired' ? 'text-crit bg-red-50 border-red-200'
  : 'text-warn bg-amber-50 border-amber-200';

export const QrVerificationView: React.FC = () => {
  const { certificates, setIsScanQrModalOpen } = useApp();
  const recent = certificates.slice(0, 8);
  const valid = certificates.filter(c => c.verificationStatus === 'Valid').length;
  const invalid = certificates.filter(c => c.verificationStatus === 'Revoked' || c.verificationStatus === 'Expired').length;

  return (
    <div className="w-full space-y-4 view-enter">
      <div>
        <p className="eyebrow">Compliance</p>
        <h1 className="text-xl font-bold text-navy-950 tracking-tight">QR Badge Verification</h1>
        <p className="text-xs text-slate-500 mt-1">Verify a worker credential offline using its signed QR payload. Outcome is logged to the audit trail.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="panel lg:col-span-7 p-6 flex flex-col items-center justify-center text-center bg-navy-950 border-navy-900">
          <div className="w-24 h-24 rounded-sm border-2 border-dashed border-brand/70 flex items-center justify-center text-brand-light">
            <ScanLine className="w-12 h-12" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">Verification Console</h2>
          <p className="mt-1 text-xs text-slate-400 max-w-md">Scan a credential QR or paste a payload. The console checks signature, SHA-256 anchor, status, and expiry — no network required.</p>
          <button
            onClick={() => setIsScanQrModalOpen(true)}
            className="mt-5 px-5 py-2.5 rounded-sm bg-brand hover:bg-brand-light text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ScanLine className="w-4 h-4" /> Start verification
          </button>
          <div className="mt-5 grid grid-cols-3 gap-6 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-300"><ShieldCheck className="w-4 h-4 text-emerald-400" />Credential verified</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><ShieldAlert className="w-4 h-4 text-amber-400" />Needs review</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><ShieldX className="w-4 h-4 text-red-400" />Invalid credential</div>
          </div>
        </section>

        <section className="panel lg:col-span-5">
          <div className="panel-header"><div><h2 className="panel-title">Credential registry</h2><p className="panel-sub">Issued credentials eligible for verification</p></div></div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="py-3"><p className="text-xl font-bold text-navy-950 tabular-nums">{certificates.length}</p><p className="eyebrow">Issued</p></div>
            <div className="py-3"><p className="text-xl font-bold text-safe tabular-nums">{valid}</p><p className="eyebrow">Valid</p></div>
            <div className="py-3"><p className="text-xl font-bold text-crit tabular-nums">{invalid}</p><p className="eyebrow">Invalid</p></div>
          </div>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="panel-header"><div><h2 className="panel-title">Verifiable credentials</h2><p className="panel-sub">Most recent {recent.length}</p></div></div>
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2 px-4 w-32 min-w-[120px]">Credential ID</th>
                <th className="py-2 px-4 min-w-[180px]">Worker</th>
                <th className="py-2 px-4 min-w-[180px]">Module</th>
                <th className="py-2 px-4 w-28 min-w-[110px]">Issued</th>
                <th className="py-2 px-4 w-28 min-w-[110px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-slate-500">No credentials issued yet.</td></tr>
              ) : recent.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-4 font-mono text-slate-700 whitespace-nowrap">{c.id}</td>
                  <td className="py-2 px-4 font-semibold text-navy-950">{c.workerName} <span className="text-slate-400 font-mono font-normal">{c.workerId}</span></td>
                  <td className="py-2 px-4 text-slate-600">{c.moduleName}</td>
                  <td className="py-2 px-4 font-mono text-slate-500 whitespace-nowrap">{c.issueDate}</td>
                  <td className="py-2 px-4 whitespace-nowrap"><span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border inline-block ${statusStyle(c.verificationStatus)}`}>{c.verificationStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
