"use client";

import React, { useMemo } from "react";
import { QuadraticForm, QuadraticParams, QuadraticRoots } from "./types";
import {
  calculateQuadraticRoots,
  formatQuadraticStandard,
  formatQuadraticVertex,
} from "./lib/polynomialMath";
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DiscriminantPanelProps {
  form: QuadraticForm;
  onChangeForm: (form: QuadraticForm) => void;
  params: QuadraticParams;
  onUpdateParams: (updates: Partial<QuadraticParams>) => void;
  showVertex: boolean;
  onToggleVertex: () => void;
  showAxisOfSymmetry: boolean;
  onToggleAxisOfSymmetry: () => void;
  showRoots: boolean;
  onToggleRoots: () => void;
  showFocusDirectrix: boolean;
  onToggleFocusDirectrix: () => void;
  showTangent: boolean;
  onToggleTangent: () => void;
  tangentX: number;
  onUpdateTangentX: (x: number) => void;
  onAnalyzeDiscriminant?: () => void;
}

export default function DiscriminantPanel({
  form,
  onChangeForm,
  params,
  onUpdateParams,
  showVertex,
  onToggleVertex,
  showAxisOfSymmetry,
  onToggleAxisOfSymmetry,
  showRoots,
  onToggleRoots,
  showFocusDirectrix,
  onToggleFocusDirectrix,
  showTangent,
  onToggleTangent,
  tangentX,
  onUpdateTangentX,
  onAnalyzeDiscriminant,
}: DiscriminantPanelProps) {
  const { a, b, c, h, k, r1, r2 } = params;

  const roots: QuadraticRoots = useMemo(
    () => calculateQuadraticRoots(a, b, c),
    [a, b, c]
  );

  // Standard Form slider updates
  const handleStandardSlider = (key: "a" | "b" | "c", val: number) => {
    const nextParams: Partial<QuadraticParams> = { [key]: val };
    const safeA = key === "a" ? (Math.abs(val) < 0.05 ? 0.1 : val) : a;
    const safeB = key === "b" ? val : b;
    const safeC = key === "c" ? val : c;

    // Sync vertex form
    const nextH = -safeB / (2 * safeA);
    const nextK = safeC - (safeB * safeB) / (4 * safeA);
    nextParams.h = Number(nextH.toFixed(2));
    nextParams.k = Number(nextK.toFixed(2));

    onUpdateParams(nextParams);
    onAnalyzeDiscriminant?.();
  };

  // Vertex Form slider updates: y = a(x - h)^2 + k -> ax^2 - 2ahx + ah^2 + k
  const handleVertexSlider = (key: "a" | "h" | "k", val: number) => {
    const nextA = key === "a" ? (Math.abs(val) < 0.05 ? 0.1 : val) : a;
    const nextH = key === "h" ? val : h;
    const nextK = key === "k" ? val : k;

    const nextB = -2 * nextA * nextH;
    const nextC = nextA * nextH * nextH + nextK;

    onUpdateParams({
      a: Number(nextA.toFixed(2)),
      b: Number(nextB.toFixed(2)),
      c: Number(nextC.toFixed(2)),
      h: Number(nextH.toFixed(2)),
      k: Number(nextK.toFixed(2)),
    });
    onAnalyzeDiscriminant?.();
  };

  // Presets
  const applyPreset = (presetA: number, presetB: number, presetC: number) => {
    const safeA = Math.abs(presetA) < 0.05 ? 1 : presetA;
    const nextH = -presetB / (2 * safeA);
    const nextK = presetC - (presetB * presetB) / (4 * safeA);

    onUpdateParams({
      a: presetA,
      b: presetB,
      c: presetC,
      h: Number(nextH.toFixed(2)),
      k: Number(nextK.toFixed(2)),
    });
    onAnalyzeDiscriminant?.();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Quadratic & Discriminant Studio
          </span>
        </div>

        {/* Form Switcher Pill Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => onChangeForm("standard")}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              form === "standard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => onChangeForm("vertex")}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              form === "vertex"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Vertex
          </button>
        </div>
      </div>

      {/* ── Active Equation Display ────────────────────────── */}
      <div className="p-3.5 bg-muted/50 border border-border rounded-2xl space-y-1.5 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
          {form === "standard" ? "Standard Form (ax² + bx + c)" : "Vertex Form (a(x - h)² + k)"}
        </span>
        <div className="text-base sm:text-lg font-black font-mono text-primary bg-background/70 py-2 px-3 rounded-xl border border-border/80">
          {form === "standard"
            ? formatQuadraticStandard(a, b, c)
            : formatQuadraticVertex(a, h, k)}
        </div>
      </div>

      {/* ── Sliders Console ────────────────────────────────── */}
      <div className="space-y-3.5">
        {form === "standard" ? (
          <>
            {/* a slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Leading Coeff <span className="text-primary font-mono">(a)</span>
                </span>
                <span className="font-mono text-primary">{a.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={a}
                onChange={(e) => handleStandardSlider("a", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* b slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Linear Coeff <span className="text-blue-500 font-mono">(b)</span>
                </span>
                <span className="font-mono text-blue-500">{b.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.2"
                value={b}
                onChange={(e) => handleStandardSlider("b", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* c slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Constant <span className="text-emerald-500 font-mono">(c)</span>
                </span>
                <span className="font-mono text-emerald-500">{c.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.2"
                value={c}
                onChange={(e) => handleStandardSlider("c", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </>
        ) : (
          <>
            {/* Vertex form sliders: a, h, k */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Width & Orientation <span className="text-primary font-mono">(a)</span>
                </span>
                <span className="font-mono text-primary">{a.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={a}
                onChange={(e) => handleVertexSlider("a", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Horizontal Shift <span className="text-blue-500 font-mono">(h)</span>
                </span>
                <span className="font-mono text-blue-500">{h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.2"
                value={h}
                onChange={(e) => handleVertexSlider("h", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">
                  Vertical Shift <span className="text-emerald-500 font-mono">(k)</span>
                </span>
                <span className="font-mono text-emerald-500">{k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.2"
                value={k}
                onChange={(e) => handleVertexSlider("k", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </>
        )}
      </div>

      {/* ── Discriminant Analysis Card ───────────────────────── */}
      <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span>Discriminant (Δ = b² - 4ac)</span>
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              roots.type === "two_real"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : roots.type === "one_real"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            }`}
          >
            {roots.type === "two_real"
              ? "2 Real Roots (Δ > 0)"
              : roots.type === "one_real"
              ? "1 Repeated Root (Δ = 0)"
              : "2 Complex Roots (Δ < 0)"}
          </span>
        </div>

        {/* Numeric Step Evaluation */}
        <div className="font-mono text-xs bg-background/60 p-2.5 rounded-xl border border-border/80 space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">b² - 4ac:</span>
            <span className="font-bold text-foreground">
              ({b.toFixed(1)})² - 4({a.toFixed(1)})({c.toFixed(1)}) ={" "}
              <strong className="text-primary">{roots.discriminant.toFixed(2)}</strong>
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-border/60">
            <span className="text-muted-foreground">Roots x₁, x₂:</span>
            <span className="font-bold text-foreground">
              {roots.type === "two_real" && (
                <span className="text-emerald-600 dark:text-emerald-400">
                  x₁ = {roots.r1Formatted}, x₂ = {roots.r2Formatted}
                </span>
              )}
              {roots.type === "one_real" && (
                <span className="text-blue-600 dark:text-blue-400">
                  x = {roots.r1Formatted}
                </span>
              )}
              {roots.type === "two_complex" && (
                <span className="text-amber-600 dark:text-amber-400">
                  x = {roots.r1Formatted}, {roots.r2Formatted}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Complex Plane Argand Diagram (if roots are complex) */}
        {roots.type === "two_complex" && (
          <div className="p-2.5 rounded-xl bg-background/80 border border-amber-500/20 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-amber-500 font-bold">
              <span>Complex Plane Representation (Argand)</span>
              <span>Re ± Im · i</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              Real Part α = -b/(2a) = <strong>{roots.r1Real.toFixed(2)}</strong> | Imaginary Part β = √(4ac-b²)/(2|a|) = <strong>±{roots.r1Imag.toFixed(2)}i</strong>
            </div>
          </div>
        )}
      </div>

      {/* ── Feature Visibility Toggles ───────────────────────── */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Geometric Overlays
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={onToggleVertex}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showVertex
                ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Vertex (h, k)</span>
            <span className={`w-2 h-2 rounded-full ${showVertex ? "bg-blue-500" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleAxisOfSymmetry}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showAxisOfSymmetry
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Axis of Symmetry</span>
            <span className={`w-2 h-2 rounded-full ${showAxisOfSymmetry ? "bg-primary" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleRoots}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showRoots
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Roots (x-intercepts)</span>
            <span className={`w-2 h-2 rounded-full ${showRoots ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
          </button>

          <button
            onClick={onToggleFocusDirectrix}
            className={`p-2 rounded-xl border font-bold flex items-center justify-between transition-all ${
              showFocusDirectrix
                ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Focus & Directrix</span>
            <span className={`w-2 h-2 rounded-full ${showFocusDirectrix ? "bg-rose-500" : "bg-muted-foreground/40"}`} />
          </button>
        </div>
      </div>

      {/* ── Presets Strip ────────────────────────────────────── */}
      <div className="pt-2 border-t border-border space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Parabola Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => applyPreset(1, 0, 0)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Standard y = x²
          </button>
          <button
            onClick={() => applyPreset(1, -2, -3)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            2 Real Roots (x² - 2x - 3)
          </button>
          <button
            onClick={() => applyPreset(1, -4, 4)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Tangent Root (x - 2)²
          </button>
          <button
            onClick={() => applyPreset(1, 0, 4)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Complex Roots (x² + 4)
          </button>
          <button
            onClick={() => applyPreset(-0.5, 2, 1)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
          >
            Inverted Parabola
          </button>
        </div>
      </div>
    </div>
  );
}
