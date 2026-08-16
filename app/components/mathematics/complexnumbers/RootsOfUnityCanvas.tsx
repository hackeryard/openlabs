"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ComplexNumber } from "./types";
import { computeGeneralRoots, toPolar } from "./lib/complexMath";
import {
  Sparkles,
  Sliders,
  RotateCcw,
  Play,
  Pause,
  Layers,
  BookOpen,
} from "lucide-react";

interface RootsOfUnityCanvasProps {
  rootsN: number;
  onChangeRootsN: (n: number) => void;
  targetW: ComplexNumber;
  onChangeTargetW: (w: ComplexNumber) => void;
  onRootsExplored?: () => void;
}

export default function RootsOfUnityCanvas({
  rootsN,
  onChangeRootsN,
  targetW,
  onChangeTargetW,
  onRootsExplored,
}: RootsOfUnityCanvasProps) {
  const [selectedRootIdx, setSelectedRootIdx] = useState<number>(0);
  const [activePower, setActivePower] = useState<number>(1);
  const [isCycling, setIsCycling] = useState<boolean>(false);
  const [cycleSpeedMs, setCycleSpeedMs] = useState<number>(600);
  const [showInscribedPolygon, setShowInscribedPolygon] = useState<boolean>(true);

  // Compute roots of z^n = W
  const roots: ComplexNumber[] = useMemo(
    () => computeGeneralRoots(targetW, rootsN),
    [targetW, rootsN]
  );

  const polarW = useMemo(() => toPolar(targetW), [targetW]);
  const rootRadius = roots.length > 0 ? Math.hypot(roots[0].re, roots[0].im) : 1;

  // SVG geometry
  const width = 540;
  const height = 450;
  const originX = width / 2;
  const originY = height / 2;
  const maxDomainR = Math.max(2.5, rootRadius * 1.4);

  const getRootPx = (root: ComplexNumber) => ({
    x: originX + (root.re / maxDomainR) * (width / 2 - 30),
    y: originY - (root.im / maxDomainR) * (height / 2 - 30),
  });

  const targetWPx = getRootPx(targetW);

  // Polygon vertices
  const polygonPoints = useMemo(() => {
    return roots
      .map((r) => {
        const p = getRootPx(r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");
  }, [roots, maxDomainR, width, height]);

  // Current power index
  const currentPowerIdx = (selectedRootIdx * activePower) % Math.max(1, rootsN);
  const currentPowerRoot = roots[currentPowerIdx];

  // Cycling power animation loop
  useEffect(() => {
    if (!isCycling) return;
    const interval = setInterval(() => {
      setActivePower((p) => (p % rootsN) + 1);
    }, cycleSpeedMs);
    return () => clearInterval(interval);
  }, [isCycling, rootsN, cycleSpeedMs]);

  const handleSelectRoot = (idx: number) => {
    setSelectedRootIdx(idx);
    setActivePower(1);
    onRootsExplored?.();
  };

  const handlePresetW = (re: number, im: number, suggestedN?: number) => {
    onChangeTargetW({ re, im });
    if (suggestedN) onChangeRootsN(suggestedN);
    setSelectedRootIdx(0);
    setActivePower(1);
    onRootsExplored?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: SVG Roots of Unity Polygon (7 cols) ───────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Equation: z^{rootsN} = {targetW.re} {targetW.im >= 0 ? `+ ${targetW.im}i` : `- ${Math.abs(targetW.im)}i`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCycling((c) => !c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isCycling
                  ? "bg-amber-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isCycling ? <Pause size={13} /> : <Play size={13} />}
              <span>{isCycling ? "Pause" : "Cycle Powers"}</span>
            </button>

            <button
              onClick={() => {
                setActivePower(1);
                setIsCycling(false);
              }}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Power"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SVG Plot */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] select-none"
          >
            <defs>
              <clipPath id="roots-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#roots-clip)">
              {/* Root Radius Circle |z| = |W|^(1/n) */}
              <circle
                cx={originX}
                cy={originY}
                r={(rootRadius / maxDomainR) * (width / 2 - 30)}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="2"
              />

              {/* Axes */}
              <line
                x1={20}
                y1={originY}
                x2={width - 20}
                y2={originY}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <line
                x1={originX}
                y1={20}
                x2={originX}
                y2={height - 20}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Inscribed Polygon */}
              {showInscribedPolygon && roots.length > 2 && (
                <polygon
                  points={polygonPoints}
                  fill="#6366f1"
                  fillOpacity="0.12"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              )}

              {/* Target W Marker (Pink) */}
              <g>
                <line
                  x1={originX}
                  y1={originY}
                  x2={targetWPx.x}
                  y2={targetWPx.y}
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                <circle
                  cx={targetWPx.x}
                  cy={targetWPx.y}
                  r="6"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={targetWPx.x + 8}
                  y={targetWPx.y - 6}
                  className="fill-pink-500 font-mono text-[10px] font-black"
                >
                  W = {targetW.re} + {targetW.im}i
                </text>
              </g>

              {/* Active Power Vector Line */}
              {currentPowerRoot && (
                <line
                  x1={originX}
                  y1={originY}
                  x2={getRootPx(currentPowerRoot).x}
                  y2={getRootPx(currentPowerRoot).y}
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Root Vertices */}
              {roots.map((r, idx) => {
                const pos = getRootPx(r);
                const isSelected = idx === selectedRootIdx;
                const isCurrentPower = idx === currentPowerIdx;

                return (
                  <g
                    key={`root-${idx}`}
                    className="cursor-pointer"
                    onClick={() => handleSelectRoot(idx)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isCurrentPower ? 8 : isSelected ? 6.5 : 5}
                      fill={isCurrentPower ? "#f59e0b" : isSelected ? "#06b6d4" : "#6366f1"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    <text
                      x={pos.x + (r.re >= 0 ? 10 : -10)}
                      y={pos.y + (r.im >= 0 ? -8 : 12)}
                      textAnchor={r.re >= 0 ? "start" : "end"}
                      className={`font-mono text-[10px] font-black ${
                        isCurrentPower
                          ? "fill-amber-500 font-extrabold text-[12px]"
                          : isSelected
                          ? "fill-cyan-500"
                          : "fill-muted-foreground"
                      }`}
                    >
                      z_{idx}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-primary block">
              Root Modulus |z|
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              {rootRadius.toFixed(3)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-amber-500 block">
              Active Selection (z_{selectedRootIdx})
            </span>
            <span className="font-mono font-black text-amber-500 text-xs">
              z_{currentPowerIdx}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Angular Step (Δθ)
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              {(360 / rootsN).toFixed(1)}° (2π/{rootsN})
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Target Equation & Roots Console (5 cols) ─── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Target Equation & Root Order
            </span>
          </div>
        </div>

        {/* Target Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Equation Presets (zⁿ = W)
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold font-mono">
            <button
              onClick={() => handlePresetW(1, 0, 5)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z⁵ = 1
            </button>
            <button
              onClick={() => handlePresetW(-1, 0, 4)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z⁴ = -1
            </button>
            <button
              onClick={() => handlePresetW(0, 1, 3)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z³ = i
            </button>
            <button
              onClick={() => handlePresetW(0, -8, 3)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z³ = -8i
            </button>
            <button
              onClick={() => handlePresetW(16, 0, 4)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z⁴ = 16
            </button>
            <button
              onClick={() => handlePresetW(-2, 2, 6)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              z⁶ = -2+2i
            </button>
          </div>
        </div>

        {/* Sliders for Target W */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 block">
            Custom Target Constant W = Re + Im·i
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>Re(W)</span>
                <span className="font-mono">{targetW.re}</span>
              </div>
              <input
                type="range"
                min="-16"
                max="16"
                step="0.5"
                value={targetW.re}
                onChange={(e) =>
                  onChangeTargetW({ ...targetW, re: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>Im(W)</span>
                <span className="font-mono">{targetW.im}</span>
              </div>
              <input
                type="range"
                min="-16"
                max="16"
                step="0.5"
                value={targetW.im}
                onChange={(e) =>
                  onChangeTargetW({ ...targetW, im: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Number of Roots Slider */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">
              Root Order <span className="font-mono text-primary">(n)</span>
            </span>
            <span className="font-mono text-primary font-black">{rootsN} roots</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={rootsN}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChangeRootsN(val);
              setSelectedRootIdx(0);
              setActivePower(1);
              onRootsExplored?.();
            }}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Roots Table */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Calculated Roots (k = 0 to {rootsN - 1})
          </span>

          <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {roots.map((r, k) => {
              const isCurrent = k === currentPowerIdx;
              return (
                <div
                  key={`tbl-root-${k}`}
                  onClick={() => handleSelectRoot(k)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-black shadow-sm"
                      : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>z_{k}</span>
                  <span className="text-[11px]">
                    {r.re.toFixed(3)} {r.im >= 0 ? `+ ${r.im.toFixed(3)}i` : `- ${Math.abs(r.im).toFixed(3)}i`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
