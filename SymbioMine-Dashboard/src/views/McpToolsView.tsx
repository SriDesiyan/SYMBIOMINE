import React from 'react';
import { useApp } from '../context/AppContext';
import { CONTROLLED_MCP_TOOLS } from '../services/mcpRegistry';
import { AI_STATUS } from '../services/seedMetrics';
import { Wrench, Lock, ShieldCheck, ArrowRight, CircleDot } from 'lucide-react';

const CATEGORY_LABEL: Record<string, string> = {
  workers: 'Workforce',
  assessments: 'Assessments',
  competency: 'Competency',
  skill_gaps: 'Skill Gaps',
  training: 'Training',
  certification: 'Certification',
  integrity: 'Integrity',
  reports: 'Reports'
};

const humanize = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const McpToolsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const grouped = CONTROLLED_MCP_TOOLS.reduce<Record<string, typeof CONTROLLED_MCP_TOOLS>>((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});
  const critical = CONTROLLED_MCP_TOOLS.filter(t => t.isSafetyCritical).length;

  return (
    <div className="w-full space-y-4 view-enter">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">AI &amp; Governance</p>
          <h1 className="text-xl font-bold text-navy-950 tracking-tight">MCP / Agent Tools</h1>
          <p className="text-xs text-slate-500 mt-1">Authorized capabilities the AI Safety Assistant may invoke. Read-only unless an administrator approves an action.</p>
        </div>
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="px-3 py-2 rounded-sm bg-brand hover:bg-brand-light text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          Open AI Safety Assistant <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="panel grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
        {[
          { l: 'Agent', v: AI_STATUS.agent, ok: true },
          { l: 'MCP Connection', v: AI_STATUS.mcp, ok: true },
          { l: 'Tools Available', v: `${CONTROLLED_MCP_TOOLS.length}`, ok: null },
          { l: 'Safety-Critical (Approval)', v: `${critical}`, ok: null }
        ].map(s => (
          <div key={s.l} className="px-4 py-3">
            <p className="eyebrow">{s.l}</p>
            <p className="mt-1 text-lg font-bold text-navy-950 tabular-nums flex items-center gap-2">
              {s.ok && <CircleDot className="w-3 h-3 text-safe" />}
              {s.v}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([cat, tools]) => (
          <section key={cat} className="panel overflow-hidden">
            <div className="panel-header">
              <div>
                <h2 className="panel-title flex items-center gap-2"><Wrench className="w-3.5 h-3.5 text-brand" />{CATEGORY_LABEL[cat] ?? humanize(cat)}</h2>
                <p className="panel-sub">{tools.length} authorized {tools.length === 1 ? 'tool' : 'tools'}</p>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {tools.map(t => (
                <li key={t.name} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-navy-950">{humanize(t.name)}</span>
                    {t.isSafetyCritical ? (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-red-50 text-crit border border-red-200 inline-flex items-center gap-1"><Lock className="w-3 h-3" />Approval</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-50 text-safe border border-emerald-200 inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Read-only</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
