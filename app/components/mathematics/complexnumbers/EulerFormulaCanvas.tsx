"use client";

import React, { useState, useMemo, useEffect } from "react";
import { computeEulerTaylorSeries } from "./lib/complexMath";
import {
  Sparkles,
  Sliders,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Layers,
  BookOpen,
} from "lucide-react";

interface EulerFormulaCanvasProps {
  angleDeg: number;
  onChangeAngleDeg: (deg: number) => void;
  radius: number;
  onChangeRadius: (r: number) => void;
  onEulerExplored?: () => void;
}

export default function EulerFormulaCanvas({
  angleDeg,
  onChangeAngleDeg,
  radius,
  onChangeRadius,
  onEulerExplored,
}: EulerFormulaCanvasProps) {
  const [taylorTerms, setTaylorTerms] = useState<number>(6);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [showWaves, setShowWaves] = useState<boolean>(true);

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      onChangeAngleDeg((angleDeg + 2 * rotationSpeed) % 720);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, rotationSpeed, angleDeg, onChangeAngleDeg]);

  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = radius * Math.cos(rad);
  const sinVal = radius * Math.sin(rad);

  // Compute Taylor series partial sums
  const { points: taylorPoints, sum: taylorSum } = useMemo(
    () => computeEulerTaylorSeries(radius, rad, taylorTerms),
    [radius, rad, taylorTerms]
  );

  // SVG Geometry
  const width = 540;
  const height = 450;
  const originX = width / 2;
  const originY = height / 2;
  const domainMaxR = 3.5;

  const toPx = (re: number, im: number) => ({
    x: originX + (re / domainMaxR) * (width / 2 - 35),
    y: originY - (im / domainMaxR) * (height / 2 - 35),
  });

  const tipPos = toPx(cosVal, sinVal);

  const handleAnglePreset = (deg: number) => {
    onChangeAngleDeg(deg);
    onEulerExplored?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Euler Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Euler Trajectory: r·e^(iθ) = r(cos θ + i·sin θ)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAutoRotating((r) => !r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isAutoRotating
                  ? "bg-amber-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isAutoRotating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoRotating ? "Pause" : "Rotate Phasor"}</span>
            </button>

            <button
              onClick={() => {
                setIsAutoRotating(false);
                onChangeAngleDeg(0);
              }}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Angle"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SVG Euler Trajectory */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] select-none"
          >
            <defs>
              <clipPath id="euler-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#euler-clip)">
              {/* Circle of radius r */}
              <circle
                cx={originX}
                cy={originY}
                r={(radius / domainMaxR) * (width / 2 - 35)}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="2"
              />

              {/* Coordinate Axes */}
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

              {/* Horizontal Cosine projection line (Emerald) */}
              <line
                x1={originX}
                y1={originY}
                x2={tipPos.x}
                y2={originY}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Vertical Sine projection line (Cyan) */}
              <line
                x1={tipPos.x}
                y1={originY}
                x2={tipPos.x}
                y2={tipPos.y}
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Taylor Series Vector Spiral */}
              {taylorPoints.map((pt, idx) => {
                if (idx === 0) return null;
                const prev = taylorPoints[idx - 1];
                const p0 = toPx(prev.re, prev.im);
                const p1 = toPx(pt.re, pt.im);

                return (
                  <line
                    key={`taylor-seg-${idx}`}
                    x1={p0.x}
                    y1={p0.y}
                    x2={p1.x}
                    y2={p1.y}
                    stroke="#ec4899"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* Euler Phasor Vector (Gold/Amber) */}
              <line
                x1={originX}
                y1={originY}
                x2={tipPos.x}
                y2={tipPos.y}
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx={tipPos.x}
                cy={tipPos.y}
                r="7.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Point Label */}
              <text
                x={tipPos.x + (cosVal >= 0 ? 10 : -10)}
                y={tipPos.y + (sinVal >= 0 ? -10 : 16)}
                textAnchor={cosVal >= 0 ? "start" : "end"}
                className="fill-amber-500 font-mono text-[11px] font-black"
              >
                {radius !== 1 ? `${radius}·` : ""}e^(iθ) = {cosVal.toFixed(2)}{" "}
                {sinVal >= 0 ? `+ ${sinVal.toFixed(2)}i` : `- ${Math.abs(sinVal).toFixed(2)}i`}
              </text>
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">
              Real (r·cos θ)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {cosVal.toFixed(3)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-cyan-500 block">
              Imaginary (r·sin θ)
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {sinVal.toFixed(3)} i
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-primary block">
              Taylor Approximation
            </span>
            <span className="font-mono font-bold text-primary text-xs">
              {taylorSum.re.toFixed(2)} + {taylorSum.im.toFixed(2)}i
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Euler Sliders & Phasor Controls (5 cols) ─── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Phasor Angle & Radius Controls
            </span>
          </div>
        </div>

        {/* Angle Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Rotation Angle (θ)</span>
            <span className="font-mono text-primary font-black">
              {angleDeg}° ({((angleDeg / 180)).toFixed(2)}π rad)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="720"
            step="1"
            value={angleDeg}
            onChange={(e) => {
              onChangeAngleDeg(parseInt(e.target.value, 10));
              onEulerExplored?.();
            }}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Radius Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Modulus / Amplitude (r)</span>
            <span className="font-mono text-primary font-black">r = {radius.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={radius}
            onChange={(e) => onChangeRadius(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Landmark Angles */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Exact Landmark Angles
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold font-mono">
            <button
              onClick={() => handleAnglePreset(0)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              θ = 0 (1)
            </button>
            <button
              onClick={() => handleAnglePreset(90)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              θ = π/2 (i)
            </button>
            <button
              onClick={() => handleAnglePreset(180)}
              className="p-2 rounded-xl bg-primary text-primary-foreground font-black text-center shadow-sm"
            >
              θ = π (-1)
            </button>
            <button
              onClick={() => handleAnglePreset(270)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              θ = 3π/2 (-i)
            </button>
            <button
              onClick={() => handleAnglePreset(360)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              θ = 2π (1)
            </button>
            <button
              onClick={() => handleAnglePreset(45)}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-center"
            >
              θ = π/4
            </button>
          </div>
        </div>

        {/* Taylor Series Order */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Taylor Expansion Order (N)</span>
            <span className="font-mono text-primary font-black">{taylorTerms} terms</span>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            step="1"
            value={taylorTerms}
            onChange={(e) => setTaylorTerms(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Euler's Identity Spotlight Card */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-2 text-xs">
          <h4 className="font-extrabold text-primary flex items-center gap-1.5">
            <Sparkles size={15} />
            <span>Euler&apos;s Identity (at θ = π)</span>
          </h4>
          <div className="font-mono text-sm font-black text-foreground bg-background/80 p-2.5 rounded-xl text-center border border-border/80">
            e^(i·π) + 1 = 0
          </div>
        </div>
      </div>
    </div>
  );
}
