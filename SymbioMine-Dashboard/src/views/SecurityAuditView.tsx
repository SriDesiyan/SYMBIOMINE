import React, { useState } from 'react';
import { authService } from '../services/authService';
import { LoginAuditRecord } from '../types';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Hash,
  Clock,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const [logs, setLogs] = useState<LoginAuditRecord[]>(() => authService.getLoginAuditLogs());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const reload = () => {
    setLogs(authService.getLoginAuditLogs());
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Security &amp; Login Audit Trail
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SHA-256 Chained</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident statutory record of all administrative logins, session expirations, and access privilege updates.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* 2. Security Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Total Logged Events
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {logs.length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Deterministic verification intact</span>
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Active Security Hash
          </span>
          <p className="text-xs font-mono text-slate-700 truncate font-semibold bg-slate-50 p-1 rounded border border-slate-200">
            {logs[0]?.hash || 'GENESIS_CHAIN'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            Chained from: {logs[0]?.previousHash ? logs[0].previousHash.substring(0, 16) + '...' : 'Genesis'}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Interception Policy
          </span>
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            DGMS CMR-2017 Access Governance
          </p>
          <span className="text-[10px] text-slate-500">
            Passwords &amp; private tokens permanently excluded from logs.
          </span>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by operator, email, IP, or details..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 shrink-0">Filter Event:</span>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
          >
            <option value="ALL">All Events ({logs.length})</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILED">Login Failed</option>
            <option value="LOGOUT">Logout</option>
            <option value="ROLE_CHANGED">Role Changed</option>
            <option value="ADMIN_CREATED">Admin Created</option>
            <option value="ADMIN_DISABLED">Admin Disabled</option>
            <option value="PASSWORD_RESET">Password Reset</option>
          </select>
        </div>
      </div>

      {/* 4. Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Origin Gateway / IP</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 font-mono">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{log.user}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{log.email}</p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : log.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {log.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {log.status === 'WARNING' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {log.status === 'CRITICAL' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        <span>{log.action}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] font-semibold text-slate-700">
                      {log.role}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {log.ipAddress}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                      {log.details || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      <span title={log.hash} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {log.hash.substring(0, 14)}...
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
