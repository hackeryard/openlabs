"use client";

import React, { useState } from "react";
import { SimulationTelemetry } from "./types";
import { Activity, Pause, Play, RotateCcw, Zap } from "lucide-react";

interface DataPoint {
  t: number;
  emf: number;
  flux: number;
  current: number;
}

interface OscilloscopePanelProps {
  history: DataPoint[];
  telemetry: SimulationTelemetry;
  isPaused: boolean;
  onTogglePause: () => void;
  onClear: () => void;
}

export default function OscilloscopePanel({
  history,
  telemetry,
  isPaused,
  onTogglePause,
  onClear,
}: OscilloscopePanelProps) {
  const [showEMF, setShowEMF] = useState(true);
  const [showFlux, setShowFlux] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);

  // SVG viewport bounds
  const width = 500;
  const height = 220;
  const padding = 25;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const midY = padding + plotH / 2;

  // Scaling
  const maxPoints = 80;
  const recentHistory = history.slice(-maxPoints);

  // Voltage scaling range (-15V to +15V default auto-clamped)
  const maxVoltage = 16;

  // Generate SVG polyline path strings
  const emfPath = recentHistory
    .map((pt, idx) => {
      const x = padding + (idx / (maxPoints - 1)) * plotW;
      const y = midY - (pt.emf / maxVoltage) * (plotH / 2);
      return `${x},${Math.max(padding, Math.min(height - padding, y))}`;
    })
    .join(" ");

  const fluxPath = recentHistory
    .map((pt, idx) => {
      const x = padding + (idx / (maxPoints - 1)) * plotW;
      const y = midY - (pt.flux * 800) * (plotH / 2); // Scale flux to visible height
      return `${x},${Math.max(padding, Math.min(height - padding, y))}`;
    })
    .join(" ");

  const currentPath = recentHistory
    .map((pt, idx) => {
      const x = padding + (idx / (maxPoints - 1)) * plotW;
      const y = midY - (pt.current * 4) * (plotH / 2);
      return `${x},${Math.max(padding, Math.min(height - padding, y))}`;
    })
    .join(" ");

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Multi-Channel Digital Oscilloscope
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPaused
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-muted hover:bg-accent text-foreground border border-border"
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            {isPaused ? "Resume Trace" : "Freeze Trace"}
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all"
            title="Clear Trace"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Metric Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-0.5">
          <span className="text-[10px] text-primary uppercase font-sans font-bold block">
            Instantaneous EMF (ε)
          </span>
          <span className="text-sm sm:text-base font-black text-primary block">
            {telemetry.inducedEMF.toFixed(2)} V
          </span>
        </div>

        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-0.5">
          <span className="text-[10px] text-amber-500 uppercase font-sans font-bold block">
            Magnetic Flux (ΦB)
          </span>
          <span className="text-sm sm:text-base font-black text-amber-500 block">
            {(telemetry.magneticFluxWb * 1e6).toFixed(1)} μWb
          </span>
        </div>

        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 space-y-0.5">
          <span className="text-[10px] text-emerald-500 uppercase font-sans font-bold block">
            RMS Voltage (VRMS)
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-400 block">
            {(telemetry.vRMS ?? Math.abs(telemetry.inducedEMF) / Math.SQRT2).toFixed(2)} V
          </span>
        </div>

        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 space-y-0.5">
          <span className="text-[10px] text-purple-400 uppercase font-sans font-bold block">
            Dissipated Power
          </span>
          <span className="text-sm sm:text-base font-black text-purple-400 block">
            {telemetry.powerDissipatedW.toFixed(2)} W
          </span>
        </div>
      </div>

      {/* SVG Oscilloscope Screen */}
      <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid Division Lines */}
          <g stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => {
              const x = padding + (i / 8) * plotW;
              return <line key={`gx-${i}`} x1={x} y1={padding} x2={x} y2={height - padding} />;
            })}
            {Array.from({ length: 7 }).map((_, i) => {
              const y = padding + (i / 6) * plotH;
              return <line key={`gy-${i}`} x1={padding} y1={y} x2={width - padding} y2={y} />;
            })}
          </g>

          {/* Zero Voltage Center Reference Line */}
          <line
            x1={padding}
            y1={midY}
            x2={width - padding}
            y2={midY}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Channel Waveform Traces */}
          {showFlux && recentHistory.length > 1 && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinejoin="round"
              points={fluxPath}
            />
          )}

          {showCurrent && recentHistory.length > 1 && (
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinejoin="round"
              points={currentPath}
            />
          )}

          {showEMF && recentHistory.length > 1 && (
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
              points={emfPath}
            />
          )}

          {/* Scale Labels */}
          <text x={padding + 4} y={padding + 12} fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            +15V
          </text>
          <text x={padding + 4} y={midY - 4} fill="#64748b" fontSize="9" fontFamily="monospace">
            0V (GND)
          </text>
          <text x={padding + 4} y={height - padding - 4} fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            -15V
          </text>
        </svg>

        {/* Channel Legend & Toggle Badges */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-2 text-[10px] font-mono">
          <button
            onClick={() => setShowEMF(!showEMF)}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              showEMF
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "bg-slate-900 text-slate-500 border border-slate-800"
            }`}
          >
            CH1: EMF ε(t)
          </button>
          <button
            onClick={() => setShowFlux(!showFlux)}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              showFlux
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-slate-900 text-slate-500 border border-slate-800"
            }`}
          >
            CH2: Flux Φ(t)
          </button>
          <button
            onClick={() => setShowCurrent(!showCurrent)}
            className={`px-2 py-0.5 rounded-md font-bold transition-all ${
              showCurrent
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-900 text-slate-500 border border-slate-800"
            }`}
          >
            CH3: Current I(t)
          </button>
        </div>
      </div>
    </div>
  );
}
