"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { TrigLabState, TrigFunction } from "./types";
import { degToRad, normalizeDeg } from "./lib/trigMath";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  FastForward,
  Activity,
} from "lucide-react";

interface WaveUnfoldingCanvasProps {
  state: TrigLabState;
  onChangeAngle: (deg: number) => void;
  onUpdateState: (updates: Partial<TrigLabState>) => void;
}

export default function WaveUnfoldingCanvas({
  state,
  onChangeAngle,
  onUpdateState,
}: WaveUnfoldingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 320 });
  const [activeFunc, setActiveFunc] = useState<"sin" | "cos" | "tan">("sin");
  const [showAllCurves, setShowAllCurves] = useState(false);

  // ResizeObserver for responsive SVG dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height: Math.max(260, height) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;

  // Domain of wave: 0 to 4pi (0° to 720°)
  const MAX_RAD = 4 * Math.PI;
  const currentRad = degToRad(state.angleDeg);

  // Margins
  const margin = { top: 25, right: 30, bottom: 40, left: 45 };
  const plotWidth = Math.max(100, width - margin.left - margin.right);
  const plotHeight = Math.max(100, height - margin.top - margin.bottom);

  // Scales
  const scaleX = useCallback(
    (rad: number) => margin.left + (rad / MAX_RAD) * plotWidth,
    [margin.left, MAX_RAD, plotWidth]
  );

  const scaleY = useCallback(
    (val: number) => {
      // Y range: -1.8 to +1.8
      const yMin = -1.8;
      const yMax = 1.8;
      const normalized = (val - yMin) / (yMax - yMin);
      return margin.top + (1 - normalized) * plotHeight;
    },
    [margin.top, plotHeight]
  );

  // Compute curve paths
  const generatePath = useCallback(
    (fnType: "sin" | "cos" | "tan") => {
      const step = 0.04;
      let d = "";
      let inSegment = false;

      for (let r = 0; r <= MAX_RAD; r += step) {
        let val = 0;
        if (fnType === "sin") val = Math.sin(r);
        else if (fnType === "cos") val = Math.cos(r);
        else if (fnType === "tan") {
          val = Math.tan(r);
          if (Math.abs(val) > 2.5) {
            inSegment = false;
            continue;
          }
        }

        const sx = scaleX(r);
        const sy = scaleY(val);

        if (!inSegment) {
          d += `M ${sx.toFixed(1)} ${sy.toFixed(1)} `;
          inSegment = true;
        } else {
          d += `L ${sx.toFixed(1)} ${sy.toFixed(1)} `;
        }
      }
      return d;
    },
    [MAX_RAD, scaleX, scaleY]
  );

  const sinPath = useMemo(() => generatePath("sin"), [generatePath]);
  const cosPath = useMemo(() => generatePath("cos"), [generatePath]);
  const tanPath = useMemo(() => generatePath("tan"), [generatePath]);

  // Current active value for the marker head
  const currentVal =
    activeFunc === "sin"
      ? Math.sin(currentRad)
      : activeFunc === "cos"
      ? Math.cos(currentRad)
      : Math.tan(currentRad);

  const headX = scaleX(currentRad % MAX_RAD);
  const headY = scaleY(Math.max(-2, Math.min(2, currentVal)));

  // Major Radian X Ticks
  const xTicks = [
    { rad: 0, label: "0" },
    { rad: Math.PI / 2, label: "π/2" },
    { rad: Math.PI, label: "π" },
    { rad: (3 * Math.PI) / 2, label: "3π/2" },
    { rad: 2 * Math.PI, label: "2π" },
    { rad: (5 * Math.PI) / 2, label: "5π/2" },
    { rad: 3 * Math.PI, label: "3π" },
    { rad: (7 * Math.PI) / 2, label: "7π/2" },
    { rad: 4 * Math.PI, label: "4π" },
  ];

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
      {/* ── Top Bar: Curve Selector & Playback Controls ─────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-2">
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border">
          <button
            onClick={() => setActiveFunc("sin")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFunc === "sin"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            sin(θ)
          </button>
          <button
            onClick={() => setActiveFunc("cos")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFunc === "cos"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            cos(θ)
          </button>
          <button
            onClick={() => setActiveFunc("tan")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFunc === "tan"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            tan(θ)
          </button>
        </div>

        {/* Animation Playback Bar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateState({ isPlaying: !state.isPlaying })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              state.isPlaying
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {state.isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{state.isPlaying ? "Pause" : "Rotate"}</span>
          </button>

          <button
            onClick={() => onUpdateState({ isPlaying: false, angleDeg: 0 })}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95"
            title="Reset wave position to 0"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setShowAllCurves(!showAllCurves)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              showAllCurves
                ? "bg-primary/10 border-primary/30 text-primary font-bold"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Overlay all 3 functions on the same canvas"
          >
            <Activity size={13} />
            <span className="hidden sm:inline">All Waves</span>
          </button>
        </div>
      </div>

      {/* ── Main SVG Wave Plot Canvas ──────────────────────── */}
      <div ref={containerRef} className="flex-1 w-full min-h-[220px] relative select-none">
        <svg width={width} height={height} className="w-full h-full">
          <defs>
            <linearGradient id="waveFillSin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {/* Horizontal Grid lines at y = -1, 0, +1 */}
          <line
            x1={margin.left}
            y1={scaleY(1)}
            x2={width - margin.right}
            y2={scaleY(1)}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="3 3"
          />
          <line
            x1={margin.left}
            y1={scaleY(-1)}
            x2={width - margin.right}
            y2={scaleY(-1)}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="3 3"
          />

          {/* Central X-Axis (y = 0) */}
          <line
            x1={margin.left}
            y1={scaleY(0)}
            x2={width - margin.right}
            y2={scaleY(0)}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />

          {/* Vertical Y-Axis (x = 0) */}
          <line
            x1={scaleX(0)}
            y1={margin.top}
            x2={scaleX(0)}
            y2={height - margin.bottom}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />

          {/* Y-Axis Tick Labels */}
          <text x={margin.left - 8} y={scaleY(1) + 4} textAnchor="end" className="text-[10px] font-bold fill-muted-foreground">1</text>
          <text x={margin.left - 8} y={scaleY(0) + 4} textAnchor="end" className="text-[10px] font-bold fill-muted-foreground">0</text>
          <text x={margin.left - 8} y={scaleY(-1) + 4} textAnchor="end" className="text-[10px] font-bold fill-muted-foreground">-1</text>

          {/* X-Axis Radian Ticks */}
          {xTicks.map((tick) => {
            const tx = scaleX(tick.rad);
            if (tx > width - margin.right) return null;
            return (
              <g key={tick.rad}>
                <line
                  x1={tx}
                  y1={scaleY(0) - 4}
                  x2={tx}
                  y2={scaleY(0) + 4}
                  stroke="currentColor"
                  strokeOpacity="0.4"
                />
                <text
                  x={tx}
                  y={height - margin.bottom + 16}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-muted-foreground font-mono"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Full Curve Traces */}
          {(activeFunc === "sin" || showAllCurves) && (
            <path
              d={sinPath}
              fill="none"
              stroke="#10b981"
              strokeWidth={activeFunc === "sin" ? "3" : "1.5"}
              strokeOpacity={activeFunc === "sin" ? "1" : "0.4"}
            />
          )}

          {(activeFunc === "cos" || showAllCurves) && (
            <path
              d={cosPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={activeFunc === "cos" ? "3" : "1.5"}
              strokeOpacity={activeFunc === "cos" ? "1" : "0.4"}
            />
          )}

          {(activeFunc === "tan" || showAllCurves) && (
            <path
              d={tanPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={activeFunc === "tan" ? "2.5" : "1.2"}
              strokeOpacity={activeFunc === "tan" ? "1" : "0.35"}
            />
          )}

          {/* Active Value Vertical Trace Laser Guide */}
          <line
            x1={headX}
            y1={margin.top}
            x2={headX}
            y2={height - margin.bottom}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="2 2"
          />

          {/* Horizontal Trace Line to Y-Axis */}
          <line
            x1={scaleX(0)}
            y1={headY}
            x2={headX}
            y2={headY}
            stroke={
              activeFunc === "sin"
                ? "#10b981"
                : activeFunc === "cos"
                ? "#3b82f6"
                : "#f59e0b"
            }
            strokeOpacity="0.5"
            strokeDasharray="3 3"
          />

          {/* Active Head Marker Dot */}
          <circle
            cx={headX}
            cy={headY}
            r="5.5"
            fill={
              activeFunc === "sin"
                ? "#10b981"
                : activeFunc === "cos"
                ? "#3b82f6"
                : "#f59e0b"
            }
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* ── Bottom Wave Period Readout ──────────────────────── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {activeFunc}(θ) ={" "}
            <strong className="text-foreground font-mono">
              {Math.abs(currentVal) < 1e-4 ? "0.000" : currentVal.toFixed(3)}
            </strong>
          </span>
        </div>
        <span className="font-mono text-[11px]">
          Period T = 2π ({activeFunc === "tan" ? "π" : "2π"})
        </span>
      </div>
    </div>
  );
}
