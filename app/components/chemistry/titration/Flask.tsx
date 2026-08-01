"use client";

import React, { useEffect, useState } from "react";

interface FlaskProps {
  color: string;
  isSwirling: boolean;
}

export default function Flask({ color, isSwirling }: FlaskProps) {
  const [swirlClass, setSwirlClass] = useState("");

  useEffect(() => {
    if (isSwirling) {
      setSwirlClass("animate-[wiggle_0.5s_ease-in-out_infinite]");
    } else {
      setSwirlClass("");
    }
  }, [isSwirling]);

  return (
    <g transform="translate(0, 0)">
      <g className={swirlClass} style={{ transformOrigin: "60px 150px" }}>
        {/* Flask Body */}
        <path 
          d="M 45 0 L 75 0 L 75 40 L 100 130 A 20 20 0 0 1 80 150 L 40 150 A 20 20 0 0 1 20 130 L 45 40 Z" 
          fill="rgba(255,255,255,0.1)" 
          stroke="#9ca3af" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Liquid Fill */}
        <path 
          d="M 33 80 L 87 80 L 98 128 A 18 18 0 0 1 80 148 L 40 148 A 18 18 0 0 1 22 128 Z" 
          fill={color} 
          className="transition-colors duration-500 ease-in-out"
        />

        {/* Glare/Reflection */}
        <path 
          d="M 40 145 A 15 15 0 0 1 25 125 L 47 45" 
          fill="none" 
          stroke="rgba(255,255,255,0.4)" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        
        {/* Volume markings */}
        <line x1="72" y1="90" x2="80" y2="90" stroke="#9ca3af" strokeWidth="1" />
        <text x="85" y="93" fontSize="8" fill="#6b7280">25ml</text>
      </g>
      {/* White Tile Base as SVG Rect */}
      <rect x="-10" y="155" width="140" height="12" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
    </g>
  );
}
