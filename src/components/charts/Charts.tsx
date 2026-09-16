import React from 'react';

interface TrendLineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  unit?: string;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  height = 180,
  color = '#00f0ff',
  unit = '',
}) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 10);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = maxVal - minVal || 1;

  const width = 600;
  const paddingX = 40;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * chartWidth;
    const y = height - paddingY - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Gradient area path
  const areaPath = `M ${points[0].x},${height - paddingY} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${height - paddingY} Z`;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((pct, idx) => {
          const y = paddingY + pct * chartHeight;
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#1e293b"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          );
        })}

        {/* Shaded Area */}
        <path d={areaPath} fill={`url(#grad-${color})`} />

        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#080e1a"
              stroke={color}
              strokeWidth="2.5"
            />
            {/* Tooltip text */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-300 select-none"
            >
              {p.value}
              {unit}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            className="text-[11px] font-medium fill-slate-400 select-none"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({ data, height = 180 }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex items-end justify-between gap-3 pt-6" style={{ height }}>
      {data.map((item, idx) => {
        const heightPct = Math.max(8, Math.round((item.value / maxVal) * 100));
        return (
          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
            <span className="text-[11px] font-bold text-slate-300 mb-1.5 opacity-80 group-hover:opacity-100 transition">
              {item.value}
            </span>
            <div className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end h-[75%]">
              <div
                className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: item.color || '#3b82f6',
                  boxShadow: `0 0 12px ${item.color || '#3b82f6'}40`,
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-2 truncate max-w-[60px]">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
