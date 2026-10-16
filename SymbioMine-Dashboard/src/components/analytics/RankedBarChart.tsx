import React from 'react';

export interface RankedItem {
  id: string;
  label: string;
  sublabel?: string;
  score: number;
  passRate: number;
  remediationCount: number;
  trend: string;
  trendPositive: boolean;
  requiredStandard?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface RankedBarChartProps {
  items: RankedItem[];
  standardThreshold?: number;
  onItemClick?: (item: RankedItem) => void;
}

export const RankedBarChart: React.FC<RankedBarChartProps> = ({
  items,
  standardThreshold = 60,
  onItemClick
}) => {
  return (
    <div className="w-full space-y-3">
      {items.map((item, index) => {
        const isLow = item.score < standardThreshold;
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                  0{index + 1}
                </span>
                {Icon && <Icon className="w-4 h-4 text-slate-600" />}
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span className="text-[10px] font-mono text-slate-400 ml-1.5 font-normal">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block font-sans">Pass Rate</span>
                  <span className="font-bold text-slate-800 tabular-nums">{item.passRate}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block font-sans">Remediation</span>
                  <span className="font-bold text-rose-700 tabular-nums">{item.remediationCount}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block font-sans">Mean</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{item.score}%</span>
                </div>
              </div>
            </div>

            {/* Visual comparative bar with threshold marker */}
            <div className="relative w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.score >= 85
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                    : item.score >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : item.score >= 60
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-600 to-rose-500'
                }`}
                style={{ width: `${item.score}%` }}
              />
              {/* 60% standard marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
                style={{ left: `${standardThreshold}%` }}
                title={`Pass standard ${standardThreshold}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
