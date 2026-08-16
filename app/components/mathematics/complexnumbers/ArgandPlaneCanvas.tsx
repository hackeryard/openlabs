"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { ComplexNumber, ComplexOperation } from "./types";
import {
  toPolar,
  toCartesian,
  addComplex,
  subtractComplex,
  multiplyComplex,
  divideComplex,
  powerComplex,
  sqrtComplex,
  logComplex,
  linearCombination,
  conjugateComplex,
} from "./lib/complexMath";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Compass,
  Sliders,
  Layers,
} from "lucide-react";

interface ArgandPlaneCanvasProps {
  z1: ComplexNumber;
  onChangeZ1: (z: ComplexNumber) => void;
  z2: ComplexNumber;
  onChangeZ2: (z: ComplexNumber) => void;
  operation: ComplexOperation;
  onChangeOperation: (op: ComplexOperation) => void;
  powerN: number;
  onChangePowerN: (n: number) => void;
  combAlpha: number;
  onChangeCombAlpha: (a: number) => void;
  combBeta: number;
  onChangeCombBeta: (b: number) => void;
  showConjugate: boolean;
  onToggleConjugate: () => void;
  showParallelogram: boolean;
  onToggleParallelogram: () => void;
  showAxisProjections: boolean;
  onToggleAxisProjections: () => void;
  onOperationEvaluated?: () => void;
}

export default function ArgandPlaneCanvas({
  z1,
  onChangeZ1,
  z2,
  onChangeZ2,
  operation,
  onChangeOperation,
  powerN,
  onChangePowerN,
  combAlpha,
  onChangeCombAlpha,
  combBeta,
  onChangeCombBeta,
  showConjugate,
  onToggleConjugate,
  showParallelogram,
  onToggleParallelogram,
  showAxisProjections,
  onToggleAxisProjections,
  onOperationEvaluated,
}: ArgandPlaneCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [coordInputMode, setCoordInputMode] = useState<"cartesian" | "polar">("cartesian");
  const [draggingPoint, setDraggingPoint] = useState<"z1" | "z2" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Polar representations
  const p1 = useMemo(() => toPolar(z1), [z1]);
  const p2 = useMemo(() => toPolar(z2), [z2]);

  // Computed results
  const resultZ: ComplexNumber | null = useMemo(() => {
    switch (operation) {
      case "add":
        return addComplex(z1, z2);
      case "subtract":
        return subtractComplex(z1, z2);
      case "multiply":
        return multiplyComplex(z1, z2);
      case "divide":
        return divideComplex(z1, z2);
      case "power":
        return powerComplex(z1, powerN);
      case "sqrt":
        return sqrtComplex(z1);
      case "log":
        return logComplex(z1);
      case "linear_comb":
        return linearCombination(z1, z2, combAlpha, combBeta);
    }
  }, [z1, z2, operation, powerN, combAlpha, combBeta]);

  const pResult = useMemo(() => (resultZ ? toPolar(resultZ) : null), [resultZ]);
  const z1Conj = useMemo(() => conjugateComplex(z1), [z1]);
  const z2Conj = useMemo(() => conjugateComplex(z2), [z2]);

  // Coordinate scales
  const width = 600;
  const height = 450;
  const domainRadius = 6 / zoomLevel;

  const xScale = useCallback(
    (re: number) => ((re + domainRadius) / (2 * domainRadius)) * width,
    [domainRadius, width]
  );

  const yScale = useCallback(
    (im: number) => height - ((im + domainRadius) / (2 * domainRadius)) * height,
    [domainRadius, height]
  );

  const screenToWorld = useCallback(
    (clientX: number, clientY: number): ComplexNumber => {
      if (!svgRef.current) return { re: 0, im: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * width;
      const svgY = ((clientY - rect.top) / rect.height) * height;
      const worldRe = (svgX / width) * (2 * domainRadius) - domainRadius;
      const worldIm = -((svgY / height) * (2 * domainRadius) - domainRadius);
      return {
        re: Number(worldRe.toFixed(2)),
        im: Number(worldIm.toFixed(2)),
      };
    },
    [domainRadius, width, height]
  );

  const originX = xScale(0);
  const originY = yScale(0);

  // Pointer drag interactions
  const handlePointerDown = (ptType: "z1" | "z2") => {
    setDraggingPoint(ptType);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingPoint) return;
    const world = screenToWorld(e.clientX, e.clientY);
    const snap = (v: number) => (Math.abs(v - Math.round(v)) < 0.1 ? Math.round(v) : v);

    const snappedZ: ComplexNumber = {
      re: Number(snap(world.re).toFixed(2)),
      im: Number(snap(world.im).toFixed(2)),
    };

    if (draggingPoint === "z1") onChangeZ1(snappedZ);
    else if (draggingPoint === "z2") onChangeZ2(snappedZ);
    onOperationEvaluated?.();
  };

  const handlePointerUp = () => {
    setDraggingPoint(null);
  };

  // Polar sliders update handler
  const handlePolarChangeZ1 = (newR: number, newDeg: number) => {
    const rad = (newDeg * Math.PI) / 180;
    onChangeZ1(toCartesian({ r: newR, theta: rad }));
    onOperationEvaluated?.();
  };

  const handlePolarChangeZ2 = (newR: number, newDeg: number) => {
    const rad = (newDeg * Math.PI) / 180;
    onChangeZ2(toCartesian({ r: newR, theta: rad }));
    onOperationEvaluated?.();
  };

  const singleOperandOps = ["power", "sqrt", "log"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Argand Plane Canvas (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Argand Complex Plane (Re × Im)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z * 1.25, 3))}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Zoom In"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z / 1.25, 0.5))}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Zoom Out"
            >
              <Minimize2 size={13} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SVG Argand Plane */}
        <div className="flex-1 flex items-center justify-center min-h-[340px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[460px] cursor-crosshair select-none touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              <clipPath id="argand-clip">
                <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
              </clipPath>
            </defs>

            <g clipPath="url(#argand-clip)">
              {/* Unit Circle guide |z| = 1 */}
              <circle
                cx={originX}
                cy={originY}
                r={(1 / (2 * domainRadius)) * width}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Grid axes */}
              <line
                x1={0}
                y1={originY}
                x2={width}
                y2={originY}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <line
                x1={originX}
                y1={0}
                x2={originX}
                y2={height}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
              />

              {/* Axis labels */}
              <text
                x={width - 25}
                y={originY - 8}
                className="fill-muted-foreground font-mono text-[10px] font-black"
              >
                +Re
              </text>
              <text
                x={originX + 8}
                y={20}
                className="fill-muted-foreground font-mono text-[10px] font-black"
              >
                +i Im
              </text>

              {/* Projections to axes for z1 */}
              {showAxisProjections && (
                <g className="opacity-40">
                  <line
                    x1={xScale(z1.re)}
                    y1={originY}
                    x2={xScale(z1.re)}
                    y2={yScale(z1.im)}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={originX}
                    y1={yScale(z1.im)}
                    x2={xScale(z1.re)}
                    y2={yScale(z1.im)}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                </g>
              )}

              {/* Parallelogram addition / linear comb rule */}
              {showParallelogram && (operation === "add" || operation === "linear_comb") && resultZ && (
                <polygon
                  points={`${originX},${originY} ${xScale(z1.re)},${yScale(z1.im)} ${xScale(resultZ.re)},${yScale(resultZ.im)} ${xScale(z2.re)},${yScale(z2.im)}`}
                  fill="#6366f1"
                  fillOpacity="0.15"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Complex Conjugates z1*, z2* */}
              {showConjugate && (
                <g>
                  <line
                    x1={originX}
                    y1={originY}
                    x2={xScale(z1Conj.re)}
                    y2={yScale(z1Conj.im)}
                    stroke="#06b6d4"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <circle
                    cx={xScale(z1Conj.re)}
                    cy={yScale(z1Conj.im)}
                    r="4.5"
                    fill="#06b6d4"
                    fillOpacity="0.5"
                  />
                  <text
                    x={xScale(z1Conj.re) + 8}
                    y={yScale(z1Conj.im) + 4}
                    className="fill-muted-foreground font-mono text-[9px] font-bold"
                  >
                    z̄₁ ({z1Conj.re}, {z1Conj.im}i)
                  </text>
                </g>
              )}

              {/* Vector z1 (Cyan) */}
              <line
                x1={originX}
                y1={originY}
                x2={xScale(z1.re)}
                y2={yScale(z1.im)}
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                cx={xScale(z1.re)}
                cy={yScale(z1.im)}
                r="7"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={() => handlePointerDown("z1")}
              />
              <text
                x={xScale(z1.re) + 8}
                y={yScale(z1.im) - 6}
                className="fill-cyan-500 font-mono text-[10px] font-black"
              >
                z₁ = {z1.re} {z1.im >= 0 ? `+ ${z1.im}i` : `- ${Math.abs(z1.im)}i`}
              </text>

              {/* Vector z2 (Pink) - when active */}
              {!singleOperandOps.includes(operation) && (
                <g>
                  <line
                    x1={originX}
                    y1={originY}
                    x2={xScale(z2.re)}
                    y2={yScale(z2.im)}
                    stroke="#ec4899"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={xScale(z2.re)}
                    cy={yScale(z2.im)}
                    r="7"
                    fill="#ec4899"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={() => handlePointerDown("z2")}
                  />
                  <text
                    x={xScale(z2.re) + 8}
                    y={yScale(z2.im) - 6}
                    className="fill-pink-500 font-mono text-[10px] font-black"
                  >
                    z₂ = {z2.re} {z2.im >= 0 ? `+ ${z2.im}i` : `- ${Math.abs(z2.im)}i`}
                  </text>
                </g>
              )}

              {/* Result Vector (Gold / Amber) */}
              {resultZ && (
                <g>
                  <line
                    x1={originX}
                    y1={originY}
                    x2={xScale(resultZ.re)}
                    y2={yScale(resultZ.im)}
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={xScale(resultZ.re)}
                    cy={yScale(resultZ.im)}
                    r="7"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={xScale(resultZ.re) + 8}
                    y={yScale(resultZ.im) + 14}
                    className="fill-amber-500 font-mono text-[10px] font-black"
                  >
                    Result = {resultZ.re.toFixed(2)}{" "}
                    {resultZ.im >= 0 ? `+ ${resultZ.im.toFixed(2)}i` : `- ${Math.abs(resultZ.im).toFixed(2)}i`}
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-cyan-500 block">
              z₁ Polar (r, θ)
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              {p1.r.toFixed(2)} ∠ {((p1.theta * 180) / Math.PI).toFixed(0)}°
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-pink-500 block">
              z₂ Polar (r, θ)
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              {p2.r.toFixed(2)} ∠ {((p2.theta * 180) / Math.PI).toFixed(0)}°
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-amber-500 block">
              Result Polar (r, θ)
            </span>
            <span className="font-mono font-bold text-amber-500 text-xs">
              {pResult ? `${pResult.r.toFixed(2)} ∠ ${((pResult.theta * 180) / Math.PI).toFixed(0)}°` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Operations & Full Sliders Console (5 cols) ─ */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Operations & Coordinates Console
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setCoordInputMode("cartesian")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                coordInputMode === "cartesian"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              a + bi
            </button>
            <button
              onClick={() => setCoordInputMode("polar")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                coordInputMode === "polar"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              r ∠ θ
            </button>
          </div>
        </div>

        {/* Operation Selector Buttons */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Complex Operation
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {(
              [
                ["add", "Addition (z₁ + z₂)"],
                ["subtract", "Subtraction (z₁ - z₂)"],
                ["multiply", "Multiply (z₁ · z₂)"],
                ["divide", "Division (z₁ / z₂)"],
                ["power", "Integer Power (z₁ⁿ)"],
                ["sqrt", "Square Root (√z₁)"],
                ["log", "Natural Log (Ln z₁)"],
                ["linear_comb", "Linear Comb (αz₁ + βz₂)"],
              ] as [ComplexOperation, string][]
            ).map(([op, label]) => (
              <button
                key={op}
                onClick={() => {
                  onChangeOperation(op);
                  onOperationEvaluated?.();
                }}
                className={`p-2 rounded-xl text-left transition-all text-xs ${
                  operation === op
                    ? "bg-primary text-primary-foreground shadow-md font-black"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Parameter sliders for special ops */}
        {operation === "power" && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Exponent (n)</span>
              <span className="font-mono text-primary font-black">n = {powerN}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="8"
              step="1"
              value={powerN}
              onChange={(e) => onChangePowerN(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}

        {operation === "linear_comb" && (
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border text-xs font-bold">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Alpha (α)</span>
                <span className="font-mono">{combAlpha.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={combAlpha}
                onChange={(e) => onChangeCombAlpha(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Beta (β)</span>
                <span className="font-mono">{combBeta.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={combBeta}
                onChange={(e) => onChangeCombBeta(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}

        {/* Vector z1 Sliders */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 block">
            Vector z₁ {coordInputMode === "cartesian" ? "(Re & Im)" : "(Modulus & Angle)"}
          </span>

          {coordInputMode === "cartesian" ? (
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Re(z₁)</span>
                  <span className="font-mono">{z1.re}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={z1.re}
                  onChange={(e) => onChangeZ1({ ...z1, re: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Im(z₁)</span>
                  <span className="font-mono">{z1.im}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={z1.im}
                  onChange={(e) => onChangeZ1({ ...z1, im: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Radius |z₁|</span>
                  <span className="font-mono">{p1.r.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={p1.r}
                  onChange={(e) =>
                    handlePolarChangeZ1(
                      parseFloat(e.target.value),
                      (p1.theta * 180) / Math.PI
                    )
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Angle θ₁</span>
                  <span className="font-mono">{((p1.theta * 180) / Math.PI).toFixed(0)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={((p1.theta * 180) / Math.PI).toFixed(0)}
                  onChange={(e) =>
                    handlePolarChangeZ1(p1.r, parseFloat(e.target.value))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Feature Toggles */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Visual Layer Toggles
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={onToggleConjugate}
              className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
                showConjugate
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Conjugate (z̄)</span>
              <span className={`w-2 h-2 rounded-full ${showConjugate ? "bg-primary" : "bg-muted-foreground/40"}`} />
            </button>

            <button
              onClick={onToggleParallelogram}
              className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
                showParallelogram
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Parallelogram</span>
              <span className={`w-2 h-2 rounded-full ${showParallelogram ? "bg-primary" : "bg-muted-foreground/40"}`} />
            </button>

            <button
              onClick={onToggleAxisProjections}
              className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all col-span-2 ${
                showAxisProjections
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Axis Projections (Re & Im lines)</span>
              <span className={`w-2 h-2 rounded-full ${showAxisProjections ? "bg-primary" : "bg-muted-foreground/40"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
