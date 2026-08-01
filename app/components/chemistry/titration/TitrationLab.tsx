"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

import ControlPanel from "./ControlPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import DataTable from "./DataTable";
import type { TitrationParams, IndicatorType } from "./engine";
import { calculatePH, calculatePotential, getIndicatorColor } from "./engine";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { Beaker } from "lucide-react";

export default function TitrationLab() {
  const { completeExperiment, xpResult } = useLab("chemistry/titration", "chemistry", "simulation");
  const { challenge, validateChallenge, result: challengeResult } = useDailyChallenge("chemistry/titration");

  const [params, setParams] = useState<TitrationParams>({
    type: "strong-acid-strong-base",
    titrantConcentration: 0.1,
    analyteVolume: 25,
    analyteConcentration: 0.1
  });
  
  const [practiceMode, setPracticeMode] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorType>("phenolphthalein");
  const [isDropping, setIsDropping] = useState(false);
  const [volumeAdded, setVolumeAdded] = useState(0); // mL
  const [data, setData] = useState<{ volume: number; value: number; color: string }[]>([]);
  const [showEqPopup, setShowEqPopup] = useState(false);
  
  const eqVolumeRef = useRef(0);
  const prevValueRef = useRef(0);
  const hasDetectedEqRef = useRef(false);

  // Practice mode random concentration
  useEffect(() => {
    if (practiceMode) {
      const randomConc = Math.round((Math.random() * 0.15 + 0.05) * 1000) / 1000;
      setParams(p => ({ ...p, analyteConcentration: randomConc }));
    }
  }, [practiceMode]);

  // Calculate Equivalence Volume for color checks
  const eqVolume = useMemo(() => {
    if (params.type === 'redox') {
      return (params.analyteConcentration * params.analyteVolume * 5) / params.titrantConcentration;
    } else {
      return (params.analyteConcentration * params.analyteVolume) / params.titrantConcentration;
    }
  }, [params]);

  eqVolumeRef.current = eqVolume;

  const handleReset = () => {
    setVolumeAdded(0);
    setData([]);
    setIsDropping(false);
    setShowEqPopup(false);
    hasDetectedEqRef.current = false;
    prevValueRef.current = params.type === 'redox' ? 0.77 : calculatePH(params, 0);
  };

  const handleDrop = (amount: number) => {
    setVolumeAdded(prev => {
      const nextVol = Math.min(prev + amount, 50); // 50mL max capacity
      return nextVol;
    });
  };

  // Sync state and generate data point when volume changes
  useEffect(() => {
    const isRedox = params.type === 'redox';
    const value = isRedox 
      ? calculatePotential(params, volumeAdded) 
      : calculatePH(params, volumeAdded);
    
    const color = getIndicatorColor(indicator, value, params.type, volumeAdded, eqVolumeRef.current);

    // Only add data points if volume actually increased (prevents duplicate 0 points)
    if (volumeAdded > 0 && (data.length === 0 || data[data.length - 1].volume !== volumeAdded)) {
      setData(prev => [...prev, { volume: volumeAdded, value, color }]);
      
      // Check for Equivalence Point crossing
      if (!hasDetectedEqRef.current) {
        if (isRedox) {
          // Sharp jump in potential
          if (value > 1.2 && prevValueRef.current < 1.2) {
            triggerEquivalence();
          }
        } else {
          // Sharp jump/drop in pH
          const crossedEq = (prevValueRef.current < 7 && value >= 7) || (prevValueRef.current > 7 && value <= 7);
          if (crossedEq || Math.abs(volumeAdded - eqVolumeRef.current) < 0.05) {
            triggerEquivalence();
          }
        }
      }
      prevValueRef.current = value;
    } else if (volumeAdded === 0 && data.length === 0) {
      // Initial point
      setData([{ volume: 0, value, color }]);
      prevValueRef.current = value;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volumeAdded]);

  const triggerEquivalence = () => {
    hasDetectedEqRef.current = true;
    setShowEqPopup(true);
    completeExperiment();
    
    if (challenge && challenge.targetParam === "volumeUsed") {
      validateChallenge(volumeAdded, "volumeUsed");
    }
  };

  const handlePracticeSubmit = (calculated: number) => {
    const actual = params.analyteConcentration;
    const diff = Math.abs(actual - calculated);
    const tolerance = actual * 0.05; // 5% error margin

    if (diff <= tolerance) {
      alert(`Correct! The exact concentration was ${actual.toFixed(3)} M. Outstanding work!`);
      completeExperiment();
      if (challenge && challenge.targetParam === "calculatedConcentration") {
        validateChallenge(calculated, "calculatedConcentration");
      }
    } else {
      alert(`Incorrect. You submitted ${calculated} M, but the actual was ${actual.toFixed(3)} M. Try another one!`);
    }
  };

  const currentColor = data.length > 0 ? data[data.length - 1].color : 'rgba(255,255,255,0.1)';

  return (
    <div className="flex flex-col min-h-full lg:h-full w-full overflow-y-auto lg:overflow-hidden bg-background">
      <div className="bg-card border-b border-border px-4 py-2 flex justify-between items-center z-10 flex-shrink-0 shadow-sm">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Beaker className="text-blue-500" size={20} />
          Virtual Titration Lab
          <span className="text-sm font-normal text-muted-foreground hidden sm:inline">— Precision volumetric analysis</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 lg:min-h-0 p-2 lg:p-3 gap-3 bg-muted/20">
        
        <ControlPanel 
          params={params} 
          setParams={setParams} 
          indicator={indicator} 
          setIndicator={setIndicator}
          onDrop={handleDrop}
          isDropping={isDropping}
          setIsDropping={setIsDropping}
          onReset={handleReset}
          practiceMode={practiceMode}
          setPracticeMode={setPracticeMode}
          onPracticeSubmit={handlePracticeSubmit}
        />
        
        {/* Visual Lab Setup (Center) */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-0 py-4 lg:py-0 overflow-hidden rounded-2xl bg-gradient-to-b from-background to-muted/30 shadow-sm border border-border/50">
          {/* Unified Lab Apparatus SVG */}
          <svg viewBox="50 10 100 650" className="w-auto h-[350px] lg:h-[90%] max-w-[250px] drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
            {/* --- BURETTE --- */}
            <g transform="translate(80, 20)">
              {/* Glass Tube */}
              <rect x="5" y="0" width="30" height="400" rx="2" fill="rgba(255,255,255,0.2)" stroke="#9ca3af" strokeWidth="2" />
              
              {/* Liquid Fill */}
              {(400 - 40 - (20 + (volumeAdded / 50) * 340)) > 0 && (
                <rect 
                  x="7" 
                  y={20 + (volumeAdded / 50) * 340} 
                  width="26" 
                  height={400 - 40 - (20 + (volumeAdded / 50) * 340)} 
                  fill="rgba(200, 230, 255, 0.4)" 
                  className="transition-all duration-300 ease-linear"
                />
              )}

              {/* Volume Markings (every 5 mL) */}
              {Array.from({ length: 11 }).map((_, i) => {
                const vol = i * 5;
                const yPos = 20 + (vol / 50) * 340;
                return (
                  <g key={vol}>
                    <line x1="5" y1={yPos} x2="15" y2={yPos} stroke="#9ca3af" strokeWidth="1" />
                    <text x="38" y={yPos + 4} fontSize="10" fill="#6b7280" textAnchor="start">{vol}</text>
                  </g>
                );
              })}

              {/* Tap/Stopcock */}
              <rect x="15" y="400" width="10" height="20" fill="#9ca3af" />
              <rect x="5" y="405" width="30" height="10" fill="#4b5563" rx="2" />
              
              {/* Burette Tip */}
              <polygon points="15,420 25,420 22,440 18,440" fill="#9ca3af" />

              {/* Volume Readout */}
              <text x="45" y={Math.max(20 + (volumeAdded / 50) * 340, 20)} fontSize="14" fill="#6b7280" fontWeight="bold" fontFamily="monospace">
                {volumeAdded.toFixed(2)} mL
              </text>
            </g>

            {/* --- DROP ANIMATION --- */}
            {isDropping && (
              <circle cx="100" cy="460" r="3" fill="rgba(200, 230, 255, 0.6)">
                <animate attributeName="cy" from="460" to="580" dur="0.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="1" to="0" dur="0.3s" repeatCount="indefinite" />
              </circle>
            )}

            {/* --- FLASK --- */}
            <g transform="translate(40, 500)">
              <g className={isDropping ? "animate-[wiggle_0.5s_ease-in-out_infinite]" : ""} style={{ transformOrigin: "60px 150px" }}>
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
                  fill={currentColor} 
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
          </svg>

          {/* Equivalence Popup */}
          {showEqPopup && (
            <div className="absolute top-1/4 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl shadow-lg backdrop-blur-md animate-in fade-in zoom-in duration-300">
              <h3 className="font-bold text-lg mb-1">Endpoint Reached!</h3>
              <p className="text-sm">Titrant Volume Used: <span className="font-mono">{volumeAdded.toFixed(2)} mL</span></p>
              <button 
                onClick={() => setShowEqPopup(false)}
                className="mt-3 text-xs uppercase font-bold tracking-wider opacity-70 hover:opacity-100 transition-opacity"
              >
                Dismiss & Continue Titrating
              </button>
            </div>
          )}

        </div>

        {/* Right Column (Analytics & Data) */}
        <div className="flex flex-col gap-4 w-full lg:w-[400px] flex-shrink-0 lg:min-h-0 lg:overflow-y-auto lg:h-full lg:pr-1">
          <AnalyticsPanel 
            data={data}
            params={params}
            practiceMode={practiceMode}
          />
          <DataTable data={data} titrationType={params.type} indicator={indicator} />
        </div>
      </div>
    </div>
  );
}
