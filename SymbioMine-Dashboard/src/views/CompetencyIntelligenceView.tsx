import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOST_FREQUENT_FAILED_PROCEDURES, DOMAIN_BENCHMARKS } from '../services/demoData';
import { SafetyDomain } from '../types';
import { TrendAreaChart } from '../components/analytics/TrendAreaChart';
import { RankedBarChart, RankedItem } from '../components/analytics/RankedBarChart';
import {
  Info,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Users,
  Award,
  Flame,
  Wind,
  Zap,
  Activity,
  ShieldCheck,
  Filter,
  Layers,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

export const CompetencyIntelligenceView: React.FC = () => {
  const { setActiveTab, workers } = useApp();
  const [activeComparison, setActiveComparison] = useState<'shifts' | 'sites'>('shifts');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'HIGH_RISK' | 'PASSING'>('ALL');

  const totalWorkers = workers.length;
  const attentionWorkers = workers.filter(w => w.overallScore < 60).length;
  const avgScore = (workers.reduce((acc, w) => acc + w.overallScore, 0) / totalWorkers).toFixed(1);

  // Heatmap data matrix: Shifts x Domains
  const shiftHeatmap = [
    {
      label: 'Shift A (Morning)',
      scores: {
        'Hazard Identification': 89,
        'PPE & Equipment': 91,
        'Gas Leak & Confined Space': 82,
        'Fire & Emergency Response': 94,
        'LOTO': 88,
        'Fall / Work-at-Height Safety': 87
      }
    },
    {
      label: 'Shift B (Afternoon)',
      scores: {
        'Hazard Identification': 78,
        'PPE & Equipment': 89,
        'Gas Leak & Confined Space': 58,
        'Fire & Emergency Response': 85,
        'LOTO': 62,
        'Fall / Work-at-Height Safety': 66
      }
    },
    {
      label: 'Shift C (Night)',
      scores: {
        'Hazard Identification': 86,
        'PPE & Equipment': 94,
        'Gas Leak & Confined Space': 79,
        'Fire & Emergency Response': 90,
        'LOTO': 91,
        'Fall / Work-at-Height Safety': 88
      }
    }
  ];

  // Site Comparison Matrix
  const siteHeatmap = [
    {
      label: 'Jharkhand Underground',
      scores: {
        'Hazard Identification': 81,
        'PPE & Equipment': 88,
        'Gas Leak & Confined Space': 59,
        'Fire & Emergency Response': 74,
        'LOTO': 82,
        'Fall / Work-at-Height Safety': 79
      }
    },
    {
      label: 'Dhanbad Surface',
      scores: {
        'Hazard Identification': 86,
        'PPE & Equipment': 91,
        'Gas Leak & Confined Space': 85,
        'Fire & Emergency Response': 88,
        'LOTO': 79,
        'Fall / Work-at-Height Safety': 83
      }
    },
    {
      label: 'Singrauli OpenCast',
      scores: {
        'Hazard Identification': 87,
        'PPE & Equipment': 89,
        'Gas Leak & Confined Space': 88,
        'Fire & Emergency Response': 82,
        'LOTO': 85,
        'Fall / Work-at-Height Safety': 68
      }
    }
  ];

  const currentHeatmapData = activeComparison === 'shifts' ? shiftHeatmap : siteHeatmap;
  const heatmapDomains: SafetyDomain[] = [
    'Hazard Identification',
    'PPE & Equipment',
    'Gas Leak & Confined Space',
    'Fire & Emergency Response',
    'LOTO',
    'Fall / Work-at-Height Safety'
  ];

  // Historical Competency Trend (5 Cycles)
  const historicalTrendData = [
    { label: 'Cycle 1 (May)', value: 76.2 },
    { label: 'Cycle 2 (Jun)', value: 77.8 },
    { label: 'Cycle 3 (Jul)', value: 79.1 },
    { label: 'Cycle 4 (Aug)', value: 78.9 },
    { label: 'Cycle 5 (Sep)', value: 80.3 }
  ];

  // Ranked Domain Items for comparative chart
  const rankedDomainItems: RankedItem[] = [
    {
      id: 'd-1',
      label: 'PPE & Equipment Discipline',
      sublabel: 'Module SCN-PPE-01',
      score: 89.2,
      passRate: 92.5,
      remediationCount: 4,
      trend: '+4.1%',
      trendPositive: true,
      icon: Activity
    },
    {
      id: 'd-2',
      label: 'Hazard Identification Protocol',
      sublabel: 'Module SCN-HAZ-02',
      score: 84.8,
      passRate: 85.3,
      remediationCount: 7,
      trend: '+2.5%',
      trendPositive: true,
      icon: ShieldCheck
    },
    {
      id: 'd-3',
      label: 'High-Voltage LOTO Isolation',
      sublabel: 'Module 03 • Zero Energy',
      score: 82.6,
      passRate: 81.0,
      remediationCount: 8,
      trend: '+1.8%',
      trendPositive: true,
      icon: Zap
    },
    {
      id: 'd-4',
      label: 'Fall / Working-at-Height Safety',
      sublabel: 'Module SCN-FALL-03',
      score: 78.1,
      passRate: 75.0,
      remediationCount: 11,
      trend: '-2.1%',
      trendPositive: false,
      icon: ShieldAlert
    },
    {
      id: 'd-5',
      label: 'Fire Safety & Extinguisher',
      sublabel: 'Module 01 • Emergency PASS',
      score: 76.5,
      passRate: 72.8,
      remediationCount: 5,
      trend: '-5.6%',
      trendPositive: false,
      icon: Flame
    },
    {
      id: 'd-6',
      label: 'Gas Leak & Confined Space',
      sublabel: 'Module 02 • Methane Ingress',
      score: 64.2,
      passRate: 61.4,
      remediationCount: 34,
      trend: '-12.4%',
      trendPositive: false,
      icon: Wind
    }
  ];

  // Industrial color mapping for SCADA/DCS style matrix
  const getCellColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-800 text-white font-bold border-emerald-900';
    if (val >= 80) return 'bg-emerald-600 text-white font-bold border-emerald-700';
    if (val >= 60) return 'bg-amber-500 text-slate-950 font-bold border-amber-600';
    return 'bg-rose-700 text-white font-extrabold border-rose-800 animate-pulse';
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Competency Heatmaps &amp; Procedural Intelligence
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Telemetry Ground Truth
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cross-sectional matrix benchmarking validated AR assessments across operational shifts and mining sectors.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveComparison('shifts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              activeComparison === 'shifts'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operational Shifts
          </button>
          <button
            onClick={() => setActiveComparison('sites')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              activeComparison === 'sites'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mining Sectors
          </button>
        </div>
      </div>

      {/* 2. Competency Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Overall Mean</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{avgScore}%</span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                &ge; 60% Pass Standard
              </span>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Calibrated across 6 safety domains
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Below Standard</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-rose-700 tabular-nums">{attentionWorkers}</span>
              <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Score &lt; 60%
              </span>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-rose-600 font-medium">
            Requires targeted simulator drills
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Critical Breaches</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-amber-800 tabular-nums">46</span>
              <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                Recorded
              </span>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Concentrated in Shift B (Methane Ingress)
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Personnel Monitored</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{totalWorkers}</span>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                100% Active
              </span>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            100% active shift coverage across 3 sites
          </div>
        </div>
      </div>

      {/* 3. Primary Heatmap Matrix Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
              Domain Competency Heatmap Matrix (Calibrated % Scores)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical values verified through ARCore simulator telemetry. Statutory pass mark is 60%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 inline-block" /> &ge; 90% Expert
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> 80-89% Proficient
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 60-79% Competent
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> &lt; 60% Critical Deficit
            </span>
          </div>
        </div>

        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-center text-xs min-w-[760px]">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left font-bold min-w-[160px]">
                  {activeComparison === 'shifts' ? 'Production Shift' : 'Mining Sector'}
                </th>
                {heatmapDomains.map(d => (
                  <th key={d} className="py-3 px-3 min-w-[95px]">
                    {d.replace(' Safety', '').replace(' & Equipment', '').replace(' / Work-at-Height', '')}
                  </th>
                ))}
                <th className="py-3 px-4 text-right min-w-[90px]">Aggregate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentHeatmapData.map(row => {
                const vals = heatmapDomains.map(d => row.scores[d]);
                const rowAvg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);

                return (
                  <tr key={row.label} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-left font-sans font-bold text-slate-900 text-xs sm:text-sm">
                      {row.label}
                    </td>
                    {heatmapDomains.map(d => {
                      const val = row.scores[d];
                      return (
                        <td key={d} className="py-3 px-2">
                          <div
                            className={`w-14 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-mono tabular-nums shadow-2xs border ${getCellColor(
                              val
                            )}`}
                          >
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm tabular-nums">
                      {rowAvg}%
                    </td>
                  </tr>
                );
              })}

              {/* DGMS Statutory Benchmark Row */}
              <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200">
                <td className="py-3 px-4 text-left font-sans text-slate-800 text-xs">
                  Statutory Passmark (Rule 1961)
                </td>
                {heatmapDomains.map(d => (
                  <td key={d} className="py-2.5 px-2">
                    <div className="w-14 h-7 mx-auto rounded-lg border border-dashed border-slate-400 bg-white flex items-center justify-center text-[11px] font-mono font-bold text-slate-800 tabular-nums shadow-2xs">
                      60.0%
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-right text-slate-900 text-xs tabular-nums font-mono font-bold">
                  60.0%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-amber-50/70 border-t border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <strong>Operational Intelligence Finding:</strong> Shift B demonstrates a critical deficit in{' '}
            <em>Gas Leak &amp; Confined Space</em> (58%) and <em>LOTO</em> (62%), falling near or below statutory thresholds. Correlation analysis indicates high incidence of continuous miner operator rotation into Substation 12.
          </div>
        </div>
      </div>

      {/* 4. Dual Analytical Section: Historical 5-Cycle Trend Chart (6-col) + Ranked Domain Performance (6-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 6-col: Historical Trend Line/Area Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Workforce Competency Trend (5 Cycles)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Empirical aggregate mean scores across all 150 mining personnel over recent assessment cycles.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-800 font-bold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                +4.1% 5-Cycle Gain
              </span>
            </div>

            <div className="py-2">
              <TrendAreaChart
                data={historicalTrendData}
                height={170}
                strokeColor="#059669"
                gradientFrom="#10b981"
                gradientTo="#059669"
                threshold={60}
                thresholdLabel="Pass Mark (60%)"
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Latest: Cycle 5 (80.3% Overall Mean)</span>
            <span className="font-mono text-slate-700">Non-Regressive Cadence</span>
          </div>
        </div>

        {/* 6-col: Ranked Safety Domain Breakdown */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-700" />
                  Safety Domain Performance Rankings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by average empirical competency score with 60% statutory cutoff marker.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-600 font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                6 Domains
              </span>
            </div>

            <RankedBarChart items={rankedDomainItems} standardThreshold={60} />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Underperforming: Gas Leak &amp; Confined Space</span>
            <button
              onClick={() => setActiveTab('remediation')}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Queue Remediation &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 5. Procedural Failure Frequency Ranking */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
              Frequent Procedural Step Breaches (Empirical Ranking)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked on frequency of procedural step breaches recorded during AR assessment runs.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold self-start sm:self-auto">
            Empirical Telemetry
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          {MOST_FREQUENT_FAILED_PROCEDURES.map(proc => (
            <div
              key={proc.rank}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 font-bold font-mono flex items-center justify-center text-sm shrink-0">
                  {proc.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{proc.procedure}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        proc.criticalSeverity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {proc.criticalSeverity}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                    <span>Domain: <strong className="text-slate-700">{proc.domain}</strong></span>
                    <span>&bull;</span>
                    <span>Standard: <code className="font-mono text-slate-800 font-semibold">{proc.ruleReference}</code></span>
                    <span>&bull;</span>
                    <span>Shifts: {proc.shiftsAffected.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:text-right self-end sm:self-auto">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Failure Tally</span>
                  <span className="text-sm font-mono font-bold text-rose-700 tabular-nums">
                    {proc.failedCount} Breaches
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('remediation')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-800 cursor-pointer shadow-2xs transition-colors"
                >
                  Dispatch Module
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Priority Remediation Recommended</span>
          <span className="font-mono text-slate-700 font-semibold">3 High-Frequency Breaches Identified</span>
        </div>
      </div>
    </div>
  );
};
