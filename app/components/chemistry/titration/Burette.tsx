"use client";

import React from "react";

interface BuretteProps {
  currentVolume: number; // The current reading on the burette (0 to 50)
  maxVolume?: number; // Usually 50mL
  isDropping: boolean; // Triggers drop animation at the tip
}

export default function Burette({ currentVolume, maxVolume = 50, isDropping }: BuretteProps) {
  // SVG coordinates and sizes
  const height = 400;
  const width = 40;
  const topPadding = 20;
  const bottomPadding = 40;
  const usableHeight = height - topPadding - bottomPadding;
  
  // Map volume (0-50) to Y coordinate (0 is at topPadding, 50 is at bottom)
  // Higher volume reading means liquid level is lower.
  // Wait, if currentVolume = 0, liquid is at the very top (full).
  // If currentVolume = 50, liquid is at the bottom (empty).
  const fillY = topPadding + (currentVolume / maxVolume) * usableHeight;
  const fillHeight = height - bottomPadding - fillY;

  return (
    <g>
      {/* Burette Glass Tube */}
      <rect x="5" y="0" width="30" height={height} rx="2" fill="rgba(255,255,255,0.2)" stroke="#9ca3af" strokeWidth="2" />
      
      {/* Liquid Fill */}
      {fillHeight > 0 && (
        <rect 
          x="7" 
          y={fillY} 
          width="26" 
          height={fillHeight} 
          fill="rgba(200, 230, 255, 0.4)" 
          className="transition-all duration-300 ease-linear"
        />
      )}

      {/* Volume Markings (every 5 mL) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const vol = i * 5;
        const yPos = topPadding + (vol / maxVolume) * usableHeight;
        return (
          <g key={vol}>
            <line x1="5" y1={yPos} x2="15" y2={yPos} stroke="#9ca3af" strokeWidth="1" />
            <text x="38" y={yPos + 4} fontSize="10" fill="#6b7280" textAnchor="start">{vol}</text>
          </g>
        );
      })}

      {/* Tap/Stopcock */}
      <rect x="15" y={height} width="10" height="20" fill="#9ca3af" />
      <rect x="5" y={height + 5} width="30" height="10" fill="#4b5563" rx="2" />
      
      {/* Burette Tip */}
      <polygon points={`15,${height+20} 25,${height+20} 22,${height+40} 18,${height+40}`} fill="#9ca3af" />
      
      {/* Drop Animation (Falls into the flask positioned below) */}
      {isDropping && (
        <circle cx="20" cy={height + 45} r="3" fill="rgba(200, 230, 255, 0.6)">
          <animate attributeName="cy" from={height + 45} to={height + 140} dur="0.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="1" to="0" dur="0.3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Volume Readout */}
      <text x="45" y={fillY > 20 ? fillY : 20} fontSize="14" fill="#6b7280" fontWeight="bold" fontFamily="monospace">
        {currentVolume.toFixed(2)} mL
      </text>
    </g>
  );
}
