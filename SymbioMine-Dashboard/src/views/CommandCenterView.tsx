import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DonutChart } from '../components/analytics/DonutChart';
import {
  deriveWorkforceMetrics,
  DOMAIN_PERFORMANCE,
  MODULE_PERFORMANCE,
  SKILL_DEFICITS,
  OPERATIONAL_EVENTS,
  REMEDIATION_FUNNEL,
  REMEDIATION_ATTEMPTS,
  REMEDIATION_STATUS,
  CYCLE_TREND,
  AI_STATUS,
  PASS_MARK,
  type RiskSeverity,
  type RemediationStage
} from '../services/seedMetrics';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  CheckCircle2,
  CircleAlert,
  CircleDot,
  Info,
  ShieldCheck,
  TriangleAlert
} from 'lucide-react';

/* ---------- small presentational helpers ---------- */

const Delta: React.FC<{ value: number; suffix?: string; invert?: boolean }> = ({ value, suffix = '%', invert }) => {
  const good = invert ? value < 0 : value >= 0;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono font-bold tabular-nums ${good ? 'text-safe' : 'text-crit'}`}>
      <Icon className="w-3 h-3" />
      {value > 0 ? '+' : ''}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
};

const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data,
  color,
  width = 84,
  height = 24
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 3 - ((v - min) / span) * (height - 6)}`);
  const last = pts[pts.length - 1].split(',');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="30-day trend sparkline">
      <polyline fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" points={pts.join(' ')} />
      <circle cx={last[0]} cy={last[1]} r={2.25} fill={color} />
    </svg>
  );
};

const SEVERITY_STYLE: Record<RiskSeverity, string> = {
  Critical: 'bg-red-50 text-crit border-red-200',
  High: 'bg-orange-50 text-brand border-orange-200',
  Medium: 'bg-amber-50 text-warn border-amber-200'
};

const STAGE_TONE: Record<RemediationStage['tone'], string> = {
  slate: 'bg-slate-500',
  red: 'bg-crit',
  orange: 'bg-brand',
  amber: 'bg-warn',
  green: 'bg-safe'
};

const EVENT_DOT: Record<string, string> = {
  critical: 'bg-crit',
  warning: 'bg-warn',
  success: 'bg-safe',
  info: 'bg-slate-400'
};

const riskForDomain = (avg: number, passRate: number): RiskSeverity | 'Low' =>
  passRate < 70 || avg < 72 ? 'Critical' : passRate < 80 ? 'High' : avg < 80 ? 'Medium' : 'Low';

export const CommandCenterView: React.FC = () => {
  const { setActiveTab, workers, remediationQueue } = useApp();
  const m = useMemo(() => deriveWorkforceMetrics(workers), [workers]);

  const tiers = [
    { label: 'Excellent', range: '90–100%', value: m.excellent, color: '#159447' },
    { label: 'Proficient', range: '80–89%', value: m.proficient, color: '#5BB37F' },
    { label: 'Competent', range: '60–79%', value: m.competent, color: '#D98A00' },
    { label: 'Remediation Required', range: '< 60%', value: m.remediationRequired, color: '#D92D3A' }
  ];
  const tierPct = (v: number) => ((v / m.total) * 100).toFixed(1);

  const weakest = [...DOMAIN_PERFORMANCE].sort((a, b) => a.passRate - b.passRate)[0];
  const weakestModule = [...MODULE_PERFORMANCE].sort((a, b) => a.passRate - b.passRate)[0];
  const topDeficit = SKILL_DEFICITS[0];
  const queue = remediationQueue.slice(0, 6);
  const totalRemediationCases = REMEDIATION_STATUS.pending + REMEDIATION_STATUS.active + REMEDIATION_STATUS.completed;

  return (
    <div className="w-full space-y-4 view-enter">
      {/* ===== Header ===== */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="text-xl font-bold text-navy-950 tracking-tight">Workforce Safety Command Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            {m.total} personnel · 3 active modules · 5 questions × 20 marks = 100 · pass mark ≥ {PASS_MARK}%
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-white border border-slate-200 text-[11px] font-semibold text-navy-950">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-safe" />
            </span>
            Live telemetry
          </span>
          <div className="inline-flex items-center divide-x divide-slate-200 rounded-sm bg-white border border-slate-200 text-[11px]">
            <span className="px-2.5 py-1.5 flex items-center gap-1.5 font-semibold text-navy-950"><Bot className="w-3.5 h-3.5 text-brand" />AI agent <CircleDot className="w-2.5 h-2.5 text-safe" /></span>
            <span className="px-2.5 py-1.5 text-slate-600">MCP <b className="text-safe">{AI_STATUS.mcp}</b></span>
            <span className="px-2.5 py-1.5 text-slate-600"><b className="text-navy-950 tabular-nums">{AI_STATUS.tools}</b> tools</span>
            <span className="px-2.5 py-1.5 text-slate-500">Sync {AI_STATUS.lastSync}</span>
          </div>
        </div>
      </header>

      {/* ===== Metric strip (single panel, not 4 cards) ===== */}
      <section className="panel grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100" aria-label="Key workforce metrics">
        {[
          { label: 'Active workers', value: m.total, sub: `${m.total} of ${m.total} on roster`, tone: 'text-navy-950', bar: 'bg-navy-700', pct: 100, delta: null as null | number },
          { label: 'Certified', value: m.certified, sub: `${m.certificationRate}% of workforce`, tone: 'text-safe', bar: 'bg-safe', pct: m.certificationRate, delta: CYCLE_TREND.certificationDelta },
          { label: 'In remediation', value: m.inRemediation, sub: `${m.remediationRate}% · failed ≥ 1 module`, tone: 'text-crit', bar: 'bg-crit', pct: m.remediationRate, delta: CYCLE_TREND.remediationDelta },
          { label: 'Mean competency', value: `${m.meanScore}%`, sub: `Pass mark ≥ ${PASS_MARK}%`, tone: 'text-navy-950', bar: 'bg-brand', pct: m.meanScore, delta: CYCLE_TREND.meanDelta }
        ].map(k => (
          <div key={k.label} className="px-4 py-3 relative">
            <p className="eyebrow">{k.label}</p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className={`text-2xl font-bold font-mono tabular-nums ${k.tone}`}>{k.value}</span>
              {k.delta !== null && <span className="text-[11px]"><Delta value={k.delta} invert={k.label === 'In remediation'} /></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{k.sub}</p>
            <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${k.bar} bar-grow`} style={{ width: `${Math.min(100, k.pct)}%` }} /></div>
          </div>
        ))}
      </section>

      {/* ===== Analytics + risks ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section className="panel lg:col-span-8 flex flex-col">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Workforce competency distribution</h2>
              <p className="panel-sub">Share of {m.total} evaluated workers by score band · worker count and % of workforce</p>
            </div>
            <button onClick={() => setActiveTab('competency')} className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0">
              Competency analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
            <div className="md:col-span-5 flex justify-center">
              <DonutChart
                data={tiers.map(t => ({ label: t.label, value: t.value, color: t.color, range: t.range, pct: `${tierPct(t.value)}%` }))}
                totalValue={m.total}
                centerTitle={`${m.total}`}
                centerSubtitle="EVALUATED"
                size={168}
                strokeWidth={22}
              />
            </div>
            <div className="md:col-span-7 table-container overflow-x-auto">
              <table className="w-full text-xs min-w-[280px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 text-left whitespace-nowrap">
                    <th className="pb-1.5 font-semibold">Band</th>
                    <th className="pb-1.5 font-semibold">Score</th>
                    <th className="pb-1.5 font-semibold text-right">Workers</th>
                    <th className="pb-1.5 font-semibold text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                  {tiers.map(t => (
                    <tr key={t.label} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 font-semibold text-navy-950"><span className="inline-block w-2.5 h-2.5 rounded-sm mr-2 align-middle" style={{ background: t.color }} />{t.label}</td>
                      <td className="py-2 font-mono text-slate-500">{t.range}</td>
                      <td className="py-2 text-right font-mono font-bold tabular-nums text-navy-950">{t.value}</td>
                      <td className="py-2 text-right font-mono tabular-nums text-slate-500">{tierPct(t.value)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-300">
                    <td className="py-2 font-bold text-navy-950">Total</td>
                    <td />
                    <td className="py-2 text-right font-mono font-bold tabular-nums text-navy-950">{tiers.reduce((s, t) => s + t.value, 0)}</td>
                    <td className="py-2 text-right font-mono tabular-nums text-slate-500">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="eyebrow mb-1.5">Workforce by score band (% of {m.total})</p>
            <div className="relative">
              <div className="flex h-7 rounded-sm overflow-hidden" role="img" aria-label="Stacked distribution of workers by score band">
                {[...tiers].reverse().map(t => (
                  <div
                    key={t.label}
                    className="flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all hover:brightness-110"
                    style={{ width: `${(t.value / m.total) * 100}%`, background: t.color }}
                    title={`${t.label} (${t.range}): ${t.value} workers · ${tierPct(t.value)}%`}
                  >
                    {t.value}
                  </div>
                ))}
              </div>
              <div className="flex text-[10px] font-mono text-slate-400 mt-1">
                {[...tiers].reverse().map(t => (
                  <span key={t.label} className="truncate" style={{ width: `${(t.value / m.total) * 100}%` }}>{t.range}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60">
            {[
              { l: 'Pass rate', v: `${m.passRate}%`, d: CYCLE_TREND.passRateDelta, inv: false },
              { l: 'Certification rate', v: `${m.certificationRate}%`, d: CYCLE_TREND.certificationDelta, inv: false },
              { l: 'Average score', v: `${m.meanScore}%`, d: CYCLE_TREND.meanDelta, inv: false },
              { l: 'Remediation rate', v: `${m.remediationRate}%`, d: CYCLE_TREND.remediationDelta, inv: true }
            ].map(x => (
              <div key={x.l} className="px-4 py-2.5">
                <p className="eyebrow">{x.l}</p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-base font-bold font-mono tabular-nums text-navy-950">{x.v}</span>
                  <span className="text-[10px]"><Delta value={x.d} invert={x.inv} /></span>
                </p>
              </div>
            ))}
          </div>
          <p className="px-4 py-1.5 text-[10px] text-slate-400 border-t border-slate-100">Trend shown vs previous assessment cycle. Remediation rate counts the {m.inRemediation} workers in the pipeline ({m.remediationRequired} below pass mark + {m.inRemediation - m.remediationRequired} who failed ≥ 1 module).</p>
        </section>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <section className="panel flex-1">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Priority skill deficiencies</h2>
                <p className="panel-sub">Ranked by workers affected</p>
              </div>
            </div>
            <ol className="divide-y divide-slate-100">
              {SKILL_DEFICITS.map(d => (
                <li key={d.rank} className="px-4 py-3 flex gap-3 hover:bg-slate-50 transition-colors">
                  <span className={`font-mono text-2xl font-bold leading-none tabular-nums ${d.rank === 1 ? 'text-crit' : 'text-slate-300'}`}>{String(d.rank).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-navy-950 truncate">{d.skill}</p>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border shrink-0 ${SEVERITY_STYLE[d.severity]}`}>{d.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5"><b className="text-navy-950 tabular-nums">{d.workers}</b> workers · {d.module}</p>
                    <p className={`text-[10px] font-mono mt-0.5 ${d.change.startsWith('-') ? 'text-crit' : 'text-safe'}`}>{d.change}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="px-4 py-2.5 border-t border-slate-100">
              <button onClick={() => setActiveTab('remediation')} className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer">
                View remediation <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </section>

          {/* AI decision-support */}
          <section className="rounded-md bg-navy-950 text-white border border-navy-900 overflow-hidden">
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <span className="eyebrow !text-brand-light flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" />AI safety insight</span>
              <span className="text-[10px] font-semibold text-slate-400">via MCP · read-only</span>
            </div>
            <div className="px-4 pb-4">
              <p className="mt-1 text-xs font-bold flex items-center gap-1.5 text-white"><TriangleAlert className="w-3.5 h-3.5 text-brand-light" />High-risk pattern detected</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                {topDeficit.skill} failures increased 12.4% over the previous assessment cycle. <b className="text-white">{topDeficit.workers} workers</b> require targeted remediation.
              </p>
              <p className="mt-1.5 text-[11px] text-slate-400">Recommended: assign the Gas Emergency Response simulation to affected workers.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setActiveTab('workers')} className="px-3 py-1.5 rounded-sm border border-white/20 hover:bg-white/10 text-[11px] font-bold cursor-pointer transition-colors">View workers</button>
                <button onClick={() => setActiveTab('ai-approvals')} className="px-3 py-1.5 rounded-sm bg-brand hover:bg-brand-light text-[11px] font-bold cursor-pointer transition-colors">Start remediation</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ===== Safety domain performance ===== */}
      <section className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Safety domain performance</h2>
            <p className="panel-sub">Average score, pass rate and critical breaches per domain · marker on score bar = {PASS_MARK}% pass mark · trend vs prior 30 days</p>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-sm bg-red-50 text-crit border border-red-200 shrink-0 flex items-center gap-1">
            <CircleAlert className="w-3 h-3" />Weakest: {weakest.domain}
          </span>
        </div>
        <div className="table-container overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[780px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2 px-4 font-semibold min-w-[170px]">Safety domain</th>
                <th className="py-2 px-4 font-semibold min-w-[170px] w-[22%]">Average score</th>
                <th className="py-2 px-4 font-semibold text-right min-w-[80px]">Pass rate</th>
                <th className="py-2 px-4 font-semibold text-right min-w-[110px]">Critical breaches</th>
                <th className="py-2 px-4 font-semibold min-w-[80px]">Risk</th>
                <th className="py-2 px-4 font-semibold min-w-[140px]">30-day trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DOMAIN_PERFORMANCE.map(d => {
                const isWeakest = d.domain === weakest.domain;
                const risk = riskForDomain(d.avgScore, d.passRate);
                return (
                  <tr key={d.domain} className={`transition-colors ${isWeakest ? 'bg-red-50/70 hover:bg-red-50' : 'hover:bg-slate-50'}`}>
                    <td className={`py-2.5 px-4 font-semibold ${isWeakest ? 'text-crit border-l-2 border-crit' : 'text-navy-950'}`}>{d.domain}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold tabular-nums w-11 text-navy-950">{d.avgScore.toFixed(1)}%</span>
                        <div className="relative flex-1 h-1.5 bg-slate-200 rounded-full">
                          <div className={`h-full rounded-full bar-grow ${isWeakest ? 'bg-crit' : d.avgScore >= 80 ? 'bg-safe' : 'bg-warn'}`} style={{ width: `${d.avgScore}%` }} />
                          <span className="absolute -top-0.5 -bottom-0.5 w-px bg-navy-950/60" style={{ left: `${PASS_MARK}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-navy-950">{d.passRate.toFixed(1)}%</td>
                    <td className={`py-2.5 px-4 text-right font-mono font-bold tabular-nums ${d.breaches >= 15 ? 'text-crit' : 'text-navy-950'}`}>{d.breaches}</td>
                    <td className="py-2.5 px-4">
                      {risk === 'Low' ? (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border bg-emerald-50 text-safe border-emerald-200">Low</span>
                      ) : (
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border ${SEVERITY_STYLE[risk]}`}>{risk}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <Sparkline data={d.weekly} color={d.trend30d < 0 ? '#D92D3A' : '#159447'} />
                        <span className="text-[11px]"><Delta value={d.trend30d} /></span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== Module performance + remediation workflow ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section className="panel lg:col-span-5 overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Module performance</h2>
              <p className="panel-sub">3 AR modules · 5 Qs × 20 marks · pass ≥ {PASS_MARK}</p>
            </div>
            <button onClick={() => setActiveTab('scenarios')} className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0">Curriculum <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="table-container overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[380px]">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-4 font-semibold">Module</th>
                  <th className="py-2 px-2 font-semibold text-right">Score</th>
                  <th className="py-2 px-2 font-semibold text-right">Pass</th>
                  <th className="py-2 px-2 font-semibold text-right">Remed.</th>
                  <th className="py-2 px-4 font-semibold text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODULE_PERFORMANCE.map(mod => {
                  const weak = mod.id === weakestModule.id;
                  return (
                    <tr key={mod.id} className={weak ? 'bg-red-50/70' : 'hover:bg-slate-50 transition-colors'}>
                      <td className={`py-2.5 px-4 font-semibold ${weak ? 'text-crit border-l-2 border-crit' : 'text-navy-950'}`}>{mod.short}<span className="block text-[10px] font-mono font-normal text-slate-400">{mod.id}</span></td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums">{mod.avgScore}%</td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums">{mod.passRate}%</td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600">{mod.remediation}</td>
                      <td className="py-2.5 px-4 text-right text-[11px]"><Delta value={mod.trend} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-[10px] text-crit font-semibold border-t border-slate-100 flex items-center gap-1.5"><TriangleAlert className="w-3 h-3" />{weakestModule.name} is the weakest module ({weakestModule.passRate}% pass rate).</p>
        </section>

        <section className="panel lg:col-span-7 overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Remediation workflow</h2>
              <p className="panel-sub">{totalRemediationCases} cases this cycle · 3-attempt policy before supervisor escalation</p>
            </div>
            <button onClick={() => setActiveTab('remediation')} className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0">Open queue <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="p-4 space-y-2">
            {REMEDIATION_FUNNEL.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-36 text-[11px] font-semibold text-slate-600 shrink-0">{String(i + 1).padStart(2, '0')} · {s.label}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className={`h-full ${STAGE_TONE[s.tone]} bar-grow flex items-center justify-end pr-1.5`} style={{ width: `${Math.max(8, (s.count / REMEDIATION_FUNNEL[0].count) * 100)}%` }}>
                    <span className="text-[10px] font-mono font-bold text-white tabular-nums">{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60">
            {REMEDIATION_ATTEMPTS.map(a => (
              <div key={a.attempt} className="px-4 py-2">
                <p className="eyebrow">{a.attempt}</p>
                <p className="font-mono font-bold text-navy-950 tabular-nums">{a.count}<span className="text-[10px] text-slate-400 font-normal"> workers</span></p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== Events + queue ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section className="panel lg:col-span-5">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Recent operational events</h2>
              <p className="panel-sub">Latest safety and system activity</p>
            </div>
          </div>
          {OPERATIONAL_EVENTS.length === 0 ? (
            <p className="p-4 text-xs font-semibold text-safe flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />No critical safety alerts</p>
          ) : (
            <ol className="relative px-4 py-3 space-y-3 before:absolute before:left-[27px] before:top-5 before:bottom-5 before:w-px before:bg-slate-200">
              {OPERATIONAL_EVENTS.map((e, i) => (
                <li key={i} className="relative flex gap-3">
                  <span className={`relative z-10 mt-1 w-2.5 h-2.5 rounded-full ring-4 ring-white shrink-0 ${EVENT_DOT[e.type]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-semibold text-navy-950 truncate">{e.title}</p>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{e.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="panel lg:col-span-7 overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Remediation queue</h2>
              <p className="panel-sub">Failed → remediation → simulation → re-assessment → certified</p>
            </div>
            <button onClick={() => setActiveTab('remediation')} className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0">All cases <ArrowRight className="w-3 h-3" /></button>
          </div>
          {queue.length === 0 ? (
            <p className="p-4 text-xs font-semibold text-safe flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />No remediation cases — workforce currently compliant</p>
          ) : (
            <div className="table-container overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[520px]">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-4 font-semibold min-w-[130px]">Worker</th>
                    <th className="py-2 px-2 font-semibold min-w-[140px]">Failed skill</th>
                    <th className="py-2 px-2 font-semibold text-right min-w-[65px]">Score</th>
                    <th className="py-2 px-2 font-semibold text-center min-w-[70px]">Attempt</th>
                    <th className="py-2 px-4 font-semibold min-w-[115px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-4 font-semibold text-navy-950">{q.workerName}<span className="block text-[10px] font-mono font-normal text-slate-400">{q.workerId}</span></td>
                      <td className="py-2 px-2 text-slate-600 max-w-[200px] truncate">{q.skillGap}</td>
                      <td className={`py-2 px-2 text-right font-mono font-bold tabular-nums ${q.lastAttemptScore < PASS_MARK ? 'text-crit' : 'text-navy-950'}`}>{q.lastAttemptScore}%</td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums">{q.attemptCount}/3</td>
                      <td className="py-2 px-4"><span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border ${q.status === 'Supervisor Review Required' ? 'bg-red-50 text-crit border-red-200' : q.status === 'Reassessment Ready' ? 'bg-emerald-50 text-safe border-emerald-200' : 'bg-amber-50 text-warn border-amber-200'}`}>{q.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <p className="text-[10px] text-slate-400 flex items-center gap-1.5 pb-2">
        <Info className="w-3 h-3" />
        Workforce totals are derived from the roster. Domain, module and event series are demo seed data (services/seedMetrics.ts) pending backend integration.
        <ShieldCheck className="w-3 h-3 ml-2" />DGMS standard: pass ≥ {PASS_MARK}%.
      </p>
    </div>
  );
};
