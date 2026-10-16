import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonutChart } from '../components/analytics/DonutChart';
import { QuestionPerformanceBar, QuestionStat } from '../components/analytics/QuestionPerformanceBar';
import {
  Search,
  Play,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  X,
  FileCheck,
  TrendingUp,
  Activity,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const { assessments, setSelectedAssessment, setSelectedWorker, workers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [resultFilter, setResultFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalAssessments = assessments.length;
  const passedAssessments = assessments.filter(a => a.score >= 60).length;
  const failedAssessments = totalAssessments - passedAssessments;
  const passRate = ((passedAssessments / (totalAssessments || 1)) * 100).toFixed(1);

  // Pass vs Fail Donut data
  const passFailDonutData = [
    { label: 'Passed (≥60%)', value: passedAssessments, color: '#059669', pct: `${passRate}%` },
    { label: 'Failed (<60%)', value: failedAssessments, color: '#e11d48', pct: `${(100 - Number(passRate)).toFixed(1)}%` }
  ];

  // Question Performance Data (SymbioMine Assessment Bank)
  const questionStats: QuestionStat[] = [
    {
      id: 'q-1',
      qNumber: 'Q1',
      title: 'Multi-gas Detector Calibration & CH4 Alarm Verification',
      accuracyRate: 94,
      attemptsCount: 150,
      isFlaggedWeak: false,
      ruleCode: 'CR-01'
    },
    {
      id: 'q-2',
      qNumber: 'Q2',
      title: 'Oxygen Self-Rescuer (SCSR) Chemical Donning Order',
      accuracyRate: 82,
      attemptsCount: 150,
      isFlaggedWeak: false,
      ruleCode: 'CR-02'
    },
    {
      id: 'q-3',
      qNumber: 'Q3',
      title: 'Auxiliary Fan Smoke-Tube Check Prior to Face Ingress',
      accuracyRate: 68,
      attemptsCount: 150,
      isFlaggedWeak: true,
      ruleCode: 'CR-04'
    },
    {
      id: 'q-4',
      qNumber: 'Q4',
      title: 'Live-Dead-Live High-Voltage Voltmeter Verification',
      accuracyRate: 91,
      attemptsCount: 150,
      isFlaggedWeak: false,
      ruleCode: 'CR-05'
    },
    {
      id: 'q-5',
      qNumber: 'Q5',
      title: 'Secondary Intake Egress Pathway Selection Standoff',
      accuracyRate: 76,
      attemptsCount: 150,
      isFlaggedWeak: false,
      ruleCode: 'CR-07'
    }
  ];

  const filteredAssessments = assessments.filter(a => {
    const matchSearch =
      a.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.scenarioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (domainFilter !== 'All' && a.domain !== domainFilter) return false;
    if (resultFilter === 'Passed' && a.score < 60) return false;
    if (resultFilter === 'Failed' && a.score >= 60) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssessments.length / pageSize));
  const paginatedAssessments = filteredAssessments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setDomainFilter('All');
    setResultFilter('All');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || domainFilter !== 'All' || resultFilter !== 'All';

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Assessment Analytics &amp; Action Replay Records
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              60% Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit-grade execution telemetry captured by Unity ARCore with second-by-second step verification and question diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 font-bold tabular-nums shadow-2xs">
            Total Telemetry Runs: <strong className="text-slate-900">{assessments.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Top Analytics Grid: Pass/Fail Donut (5-col) + Question-Level Breakdown (7-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 5-col: Pass vs Fail Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cohort Assessment Outcome
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated against the statutory &ge; 60% standard.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-700 font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                {passRate}% Pass Rate
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              <DonutChart
                data={passFailDonutData}
                totalValue={totalAssessments}
                centerTitle={`${passRate}%`}
                centerSubtitle="OVERALL PASS RATE"
                size={160}
                strokeWidth={20}
              />

              <div className="space-y-3 w-full sm:w-auto">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Passed (&ge; 60%)
                    </span>
                    <span className="font-mono font-extrabold text-emerald-900 tabular-nums">
                      {passedAssessments} runs
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-medium block mt-0.5">
                    {passRate}% of total evaluations
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-rose-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      Failed (&lt; 60%)
                    </span>
                    <span className="font-mono font-extrabold text-rose-900 tabular-nums">
                      {failedAssessments} runs
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-rose-700 font-medium block mt-0.5">
                    {(100 - Number(passRate)).toFixed(1)}% remediation queued
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>DGMS Metalliferous Standard (60%)</span>
            <span className="font-mono text-slate-700">100 Marks Baseline</span>
          </div>
        </div>

        {/* 7-col: Question-Level Performance Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-700" />
                  Question-Level Performance Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statutory 5-question MCQ bank accuracy with automated weakness detection.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-800 font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200">
                1 Deficit Flagged
              </span>
            </div>

            <QuestionPerformanceBar questions={questionStats} passThreshold={60} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Critical Deficit: Q3 (Auxiliary Fan Check at 68%)</span>
            <span className="font-mono text-amber-800 font-bold">Review Recommended</span>
          </div>
        </div>
      </div>

      {/* 3. Unified Table Container: Header -> Filter -> Table -> Pagination */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Container Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
              Telemetric Evaluation Docket ({filteredAssessments.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified AR runtime assessments, sequence timing, breach frequencies, and pass thresholds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-semibold tabular-nums">
              {filteredAssessments.length} of {assessments.length} Runs
            </span>
          </div>
        </div>

        {/* Integrated Filter Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, ID, or scenario title..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Domain:</span>
            <select
              value={domainFilter}
              onChange={e => {
                setDomainFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 cursor-pointer"
            >
              <option value="All">All Domains</option>
              <option value="Gas Leak & Confined Space">Gas Leak &amp; Confined Space</option>
              <option value="LOTO">LOTO Isolation</option>
              <option value="Fall / Work-at-Height Safety">Fall / Work-at-Height</option>
              <option value="Fire & Emergency Response">Fire &amp; Emergency</option>
              <option value="PPE & Equipment">PPE &amp; Equipment</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Outcome:</span>
            <select
              value={resultFilter}
              onChange={e => {
                setResultFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 cursor-pointer"
            >
              <option value="All">All Results</option>
              <option value="Passed">Passed (&ge; 60%)</option>
              <option value="Failed">Unsuccessful (&lt; 60%)</option>
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

        {/* Table */}
        <div className="table-container overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[1130px]">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-32 min-w-[120px]">Assessment ID</th>
                <th className="py-3 px-4 min-w-[160px]">Worker Candidate</th>
                <th className="py-3 px-4 min-w-[220px]">Scenario &amp; Domain</th>
                <th className="py-3 px-4 w-20 min-w-[80px] text-center">Attempt</th>
                <th className="py-3 px-4 w-24 min-w-[90px] text-right">Score</th>
                <th className="py-3 px-4 w-20 min-w-[80px] text-right">Duration</th>
                <th className="py-3 px-4 w-20 min-w-[80px] text-right">Breaches</th>
                <th className="py-3 px-4 w-24 min-w-[90px] text-right">Seq. Acc.</th>
                <th className="py-3 px-4 w-28 min-w-[100px] text-center">Status</th>
                <th className="py-3 px-4 w-28 min-w-[110px] text-right">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedAssessments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <ClipboardCheck className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-800 font-sans">No Assessment Records Match Filter</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-sans">Modify your search query or reset filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-xs font-sans"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedAssessments.map(asm => {
                  const workerObj = workers.find(w => w.id === asm.workerId);
                  const isPassed = asm.score >= 60;

                  return (
                    <tr
                      key={asm.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedAssessment(asm)}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {asm.id}
                        <span className="block text-[10px] text-slate-400 font-normal">{asm.date.slice(0, 10)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (workerObj) setSelectedWorker(workerObj);
                          }}
                          className="font-bold text-slate-900 group-hover:text-amber-900 cursor-pointer block font-sans text-left"
                        >
                          {asm.workerName}
                        </button>
                        <span className="text-[10px] text-slate-400 block">{asm.workerId}</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-semibold text-slate-900 block truncate max-w-[200px]">{asm.scenarioName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">{asm.domain}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                          #{asm.attempt}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-bold text-sm tabular-nums ${isPassed ? 'text-emerald-800' : 'text-rose-700'}`}>
                          {asm.score}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal block font-sans"> / 60% standard</span>
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 text-xs">
                        {asm.responseDurationSeconds}s
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <span className={asm.criticalViolations > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'}>
                          {asm.criticalViolations}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 text-xs">
                        {asm.actionSequenceAccuracy}%
                      </td>

                      <td className="py-3.5 px-4 text-center font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPassed
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedAssessment(asm);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs font-sans shrink-0"
                        >
                          <Play className="w-3 h-3 text-amber-600 fill-amber-600" />
                          <span>Timeline</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredAssessments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredAssessments.length)} of {filteredAssessments.length} runs
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
            >
              Prev
            </button>
            <span className="px-2 font-mono font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
