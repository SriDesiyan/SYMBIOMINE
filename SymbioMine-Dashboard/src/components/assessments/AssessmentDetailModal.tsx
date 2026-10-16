import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  Cpu
} from 'lucide-react';

export const AssessmentDetailModal: React.FC = () => {
  const { selectedAssessment, setSelectedAssessment } = useApp();

  if (!selectedAssessment) return null;

  const asm = selectedAssessment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-bold">
                {asm.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                asm.passed
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              }`}>
                {asm.passed ? 'STATUTORY PASS' : 'UNSUCCESSFUL / REMEDIATION'}
              </span>
            </div>
            <h3 className="text-base font-bold tracking-tight text-white mt-1.5">{asm.scenarioName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate: <span className="text-white font-semibold">{asm.workerName}</span> ({asm.workerId}) &bull; Domain: {asm.domain}
            </p>
          </div>

          <button
            onClick={() => setSelectedAssessment(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Metric Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessment Score</span>
            <span className={`text-base font-mono font-bold tabular-nums ${asm.passed ? 'text-emerald-800' : 'text-rose-700'}`}>
              {asm.score}% <span className="text-[10px] text-slate-400 font-normal">/ {asm.passThreshold}%</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Cadence</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">Attempt {asm.attempt} of 3</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Duration</span>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5 tabular-nums">{asm.responseDurationSeconds}s</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Critical Breaches</span>
            <span className={`text-xs font-bold font-mono block mt-0.5 tabular-nums ${asm.criticalViolations > 0 ? 'text-rose-700' : 'text-emerald-800'}`}>
              {asm.criticalViolations}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Sequence Accuracy</span>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5 tabular-nums">{asm.actionSequenceAccuracy}%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {/* LiteRT Diagnostic */}
          {asm.liteRtInsight && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 font-mono text-[11px] uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-amber-700" />
                <span>LiteRT Edge Competency Telemetry Diagnostic</span>
              </div>
              <p className="text-amber-900 leading-relaxed text-xs">{asm.liteRtInsight}</p>
            </div>
          )}

          {/* Action Replay Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 font-sans">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Second-by-Second Execution Timeline</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-500">Captured via Unity ARCore Sensor Stream</span>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-3">
              {asm.timeline.map((item, idx) => {
                const isViolation = item.type === 'violation' || item.isError;
                const isHazard = item.type === 'hazard';
                const isMilestone = item.type === 'milestone';

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Dot on line */}
                    <div
                      className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                        isViolation
                          ? 'border-rose-600 text-rose-600'
                          : isHazard
                          ? 'border-amber-500 text-amber-500'
                          : isMilestone
                          ? 'border-slate-800 text-slate-800'
                          : 'border-emerald-600 text-emerald-600'
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          isViolation ? 'bg-rose-600' : isHazard ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      />
                    </div>

                    <div
                      className={`p-3 rounded border text-xs transition-colors ${
                        isViolation
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                          : isHazard
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-600 tabular-nums">
                          {item.timestamp} <span className="font-normal opacity-70">(+{item.elapsedSeconds}s)</span>
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                            isViolation
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : isHazard
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <p className="font-semibold mt-1 text-xs">{item.event}</p>

                      {item.notes && (
                        <p className="mt-1.5 text-[11px] font-medium text-rose-900 bg-rose-100/60 p-2 rounded border border-rose-200">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            Cryptographic log ID: SHA256:{asm.id.slice(-8)} &bull; Deterministic Audit Stream
          </span>
          <button
            onClick={() => setSelectedAssessment(null)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer text-xs transition-colors shadow-2xs"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
