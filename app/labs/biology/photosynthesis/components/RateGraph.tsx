import React from "react";

interface RateGraphProps {
  data: number[]; // Array of rate values 0-100
}

export default function RateGraph({ data }: RateGraphProps) {
  const width = 300;
  const height = 100;
  const points = data.length > 0 ? data : [0];
  const maxDataPoints = 60; // 60 points representing last 30s at 2fps for example

  // Scale data to SVG coordinates
  const scaleX = (index: number) => (index / (maxDataPoints - 1)) * width;
  const scaleY = (value: number) => height - (value / 100) * height;

  const linePath = points
    .map((val, index) => {
      // shift the graph left if we don't have max points yet, or just fill from left to right
      // Let's draw from left to right. If less than maxDataPoints, it just ends early.
      const x = scaleX(index);
      const y = scaleY(val);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Create area path by closing the line path down to the bottom
  const areaPath = points.length > 0 
    ? `${linePath} L ${scaleX(points.length - 1)} ${height} L 0 ${height} Z`
    : "";

  return (
    <div className="w-full h-full min-h-[120px] flex flex-col relative">
      <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>Photosynthetic Rate</span>
        <span className="text-emerald-600">
          {points.length > 0 ? points[points.length - 1].toFixed(1) : 0}%
        </span>
      </div>
      <div className="flex-grow relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid lines */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Area fill */}
          <path d={areaPath} fill="url(#gradient)" className="opacity-20" />
          
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
