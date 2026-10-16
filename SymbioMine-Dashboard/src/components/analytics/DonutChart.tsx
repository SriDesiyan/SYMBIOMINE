import React, { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  range?: string;
  pct?: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  totalValue?: number;
  centerTitle?: string;
  centerSubtitle?: string;
  size?: number;
  strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  totalValue,
  centerTitle,
  centerSubtitle,
  size = 180,
  strokeWidth = 24
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = totalValue || data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {data.map((item, index) => {
          const itemPercentage = item.value / (total || 1);
          const strokeDasharray = `${itemPercentage * circumference} ${circumference}`;
          const strokeDashoffset = -accumulatedOffset;
          accumulatedOffset += itemPercentage * circumference;

          const isHovered = hoveredIdx === index;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                filter: isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'none'
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 leading-tight tabular-nums">
          {hoveredIdx !== null ? data[hoveredIdx].value : centerTitle || total}
        </span>
        <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider mt-0.5 max-w-[100px] leading-tight">
          {hoveredIdx !== null ? data[hoveredIdx].label : centerSubtitle || 'Total Evaluated'}
        </span>
      </div>
    </div>
  );
};
