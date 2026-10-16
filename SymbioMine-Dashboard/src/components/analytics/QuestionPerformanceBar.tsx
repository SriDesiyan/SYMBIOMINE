import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface QuestionStat {
  id: string;
  qNumber: string;
  title: string;
  accuracyRate: number;
  attemptsCount: number;
  isFlaggedWeak: boolean;
  ruleCode?: string;
}

interface QuestionPerformanceBarProps {
  questions: QuestionStat[];
  passThreshold?: number;
}

export const QuestionPerformanceBar: React.FC<QuestionPerformanceBarProps> = ({
  questions,
  passThreshold = 60
}) => {
  return (
    <div className="w-full space-y-2.5">
      {questions.map(q => {
        const isLow = q.accuracyRate < 60 || q.isFlaggedWeak;

        return (
          <div
            key={q.id}
            className={`p-3 rounded-xl border transition-all ${
              isLow
                ? 'bg-amber-50/50 border-amber-200/90'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {q.qNumber}
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[280px] sm:max-w-md">
                  {q.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isLow ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-700" />
                    <span>Review Required</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Passing</span>
                  </span>
                )}
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                  {q.accuracyRate}%
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  q.accuracyRate >= 85
                    ? 'bg-emerald-600'
                    : q.accuracyRate >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${q.accuracyRate}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
