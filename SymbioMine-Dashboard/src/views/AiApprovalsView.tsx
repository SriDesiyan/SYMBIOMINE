import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Approval {
  id: string;
  action: string;
  requestedBy: string;
  scope: string;
  risk: 'High' | 'Medium';
  time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const SEED: Approval[] = [
  { id: 'APR-0412', action: 'Assign Gas Emergency Response simulation', requestedBy: 'AI Safety Assistant', scope: '34 workers', risk: 'High', time: '09:44', status: 'Pending' },
  { id: 'APR-0411', action: 'Dispatch PPE Selection & Fit refresher', requestedBy: 'AI Safety Assistant', scope: '21 workers', risk: 'Medium', time: '09:12', status: 'Pending' },
  { id: 'APR-0410', action: 'Escalate repeated assessment failures to supervisor', requestedBy: 'AI Safety Assistant', scope: '2 workers', risk: 'High', time: '08:40', status: 'Pending' }
];

export const AiApprovalsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [items, setItems] = useState<Approval[]>(SEED);
  const pending = items.filter(i => i.status === 'Pending');

  const decide = (id: string, status: 'Approved' | 'Rejected') =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));

  return (
    <div className="w-full space-y-4 view-enter">
      <div>
        <p className="eyebrow">AI &amp; Governance</p>
        <h1 className="text-xl font-bold text-navy-950 tracking-tight">AI Approvals</h1>
        <p className="text-xs text-slate-500 mt-1">The AI agent proposes; an administrator decides. Nothing is dispatched to workers without approval.</p>
      </div>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Approval queue</h2>
            <p className="panel-sub">{pending.length} pending · {items.length - pending.length} decided this session</p>
          </div>
          <button onClick={() => setActiveTab('ai-assistant')} className="text-xs font-bold text-brand hover:underline cursor-pointer">Open assistant</button>
        </div>
        {pending.length === 0 && items.length > 0 && (
          <div className="px-4 py-3 text-xs font-semibold text-safe flex items-center gap-2 bg-emerald-50/60 border-b border-emerald-100">
            <CheckCircle2 className="w-4 h-4" /> No pending AI actions. All requests have been reviewed.
          </div>
        )}
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[880px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2 px-4 w-28 min-w-[100px]">Request</th>
                <th className="py-2 px-4 min-w-[260px]">Action</th>
                <th className="py-2 px-4 w-28 min-w-[100px]">Scope</th>
                <th className="py-2 px-4 w-24 min-w-[80px]">Risk</th>
                <th className="py-2 px-4 w-24 min-w-[80px]">Time</th>
                <th className="py-2 px-4 w-32 min-w-[110px]">Status</th>
                <th className="py-2 px-4 w-44 min-w-[160px] text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(i => (
                <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-4 font-mono text-slate-600 whitespace-nowrap">{i.id}</td>
                  <td className="py-2 px-4"><span className="font-semibold text-navy-950">{i.action}</span><span className="block text-[10px] text-slate-400">{i.requestedBy}</span></td>
                  <td className="py-2 px-4 tabular-nums whitespace-nowrap">{i.scope}</td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border inline-block ${i.risk === 'High' ? 'bg-red-50 text-crit border-red-200' : 'bg-amber-50 text-warn border-amber-200'}`}>{i.risk}</span>
                  </td>
                  <td className="py-2 px-4 font-mono text-slate-500 whitespace-nowrap">{i.time}</td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${i.status === 'Approved' ? 'text-safe' : i.status === 'Rejected' ? 'text-slate-500' : 'text-warn'}`}>
                      {i.status === 'Pending' ? <Clock className="w-3 h-3" /> : i.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {i.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right whitespace-nowrap">
                    {i.status === 'Pending' ? (
                      <div className="inline-flex gap-1.5 flex-nowrap shrink-0">
                        <button onClick={() => decide(i.id, 'Approved')} className="px-2.5 py-1 rounded-sm bg-brand hover:bg-brand-light text-white font-bold cursor-pointer transition-colors shrink-0">Approve</button>
                        <button onClick={() => decide(i.id, 'Rejected')} className="px-2.5 py-1 rounded-sm border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition-colors shrink-0">Reject</button>
                      </div>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
