import React, { useState } from 'react';

export interface TrendDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  periodLabel?: string;
}

interface TrendAreaChartProps {
  data: TrendDataPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  strokeColor?: string;
  threshold?: number;
  thresholdLabel?: string;
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({
  data,
  height = 160,
  valuePrefix = '',
  valueSuffix = '%',
  strokeColor = '#059669',
  gradientFrom = '#10b981',
  gradientTo = '#10b981',
  threshold = 60,
  thresholdLabel = 'Pass Mark (60%)'
}) => {
  const [activePoint, setActivePoint] = useState<TrendDataPoint | null>(null);

  if (!data || data.length === 0) return null;

  const width = 500;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values, threshold ? threshold - 10 : 50, 40);
  const maxVal = Math.max(...values, 100);

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${getX(0)},${padding.top + chartHeight} ${points} ${getX(data.length - 1)},${padding.top + chartHeight}`;

  const thresholdY = threshold ? getY(threshold) : null;

  return (
    <div className="w-full relative select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.3" />
            <stop offset="100%" stopColor={gradientTo} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[minVal, minVal + (maxVal - minVal) / 2, maxVal].map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                {Math.round(val)}{valueSuffix}
              </text>
            </g>
          );
        })}

        {/* Threshold line */}
        {thresholdY !== null && (
          <g>
            <line
              x1={padding.left}
              y1={thresholdY}
              x2={width - padding.right}
              y2={thresholdY}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text
              x={width - padding.right}
              y={thresholdY - 4}
              fill="#d97706"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              textAnchor="end"
              fontWeight="bold"
            >
              {thresholdLabel}
            </text>
          </g>
        )}

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#trendGradient)" />

        {/* Line stroke */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.value);
          const isActive = activePoint?.label === d.label;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setActivePoint(d)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 6 : 4}
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth={isActive ? 3 : 2}
                className="transition-all duration-200"
              />
              {/* X Axis Labels */}
              <text
                x={cx}
                y={height - 8}
                fill="#64748b"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating active point tooltip */}
      {activePoint && (
        <div className="absolute top-0 right-2 px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-mono shadow-md flex items-center gap-1.5 animate-in fade-in duration-150">
          <span className="text-slate-400 font-sans">{activePoint.label}:</span>
          <span className="font-bold text-emerald-400">{valuePrefix}{activePoint.value}{valueSuffix}</span>
        </div>
      )}
    </div>
  );
};
