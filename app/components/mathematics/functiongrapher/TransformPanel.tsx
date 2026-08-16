"use client";

import React from "react";
import { GraphFunction } from "./types";
import { TransformParams, DEFAULT_TRANSFORM, getTransformedExpression } from "./lib/evaluator";
import { Sliders, RotateCcw, ArrowRight, Sparkles, FlipVertical, FlipHorizontal } from "lucide-react";

interface TransformPanelProps {
  primaryFunction: GraphFunction | null;
  onUpdateTransform: (id: string, newTransform: TransformParams) => void;
}

export default function TransformPanel({
  primaryFunction,
  onUpdateTransform,
}: TransformPanelProps) {
  if (!primaryFunction) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground shadow-md">
        <Sliders className="mx-auto mb-2 opacity-30 text-primary" size={28} />
        <p className="text-sm font-semibold">No active function selected.</p>
        <p className="text-xs opacity-75 mt-1">Plot or select a function above to explore transformations.</p>
      </div>
    );
  }

  const transform = primaryFunction.transform || DEFAULT_TRANSFORM;

  const updateParam = (key: keyof TransformParams, value: number) => {
    onUpdateTransform(primaryFunction.id, {
      ...transform,
      [key]: Number(value.toFixed(2)),
    });
  };

  const handleReset = () => {
    onUpdateTransform(primaryFunction.id, DEFAULT_TRANSFORM);
  };

  const formulaDisplay = getTransformedExpression(
    primaryFunction.rawExpression,
    transform
  );

  // Generate plain English explanation of applied transformations
  const getExplanation = () => {
    const parts: string[] = [];
    const { a, b, h, k } = transform;

    if (a !== 1) {
      if (a === -1) parts.push("Reflected over x-axis");
      else if (a < 0) parts.push(`Reflected over x-axis and stretched vertically by ${Math.abs(a)}×`);
      else if (a > 1) parts.push(`Stretched vertically by ${a}×`);
      else if (a > 0 && a < 1) parts.push(`Compressed vertically by ${a}×`);
    }

    if (b !== 1) {
      if (b === -1) parts.push("Reflected over y-axis");
      else if (b < 0) parts.push(`Reflected over y-axis and compressed horizontally by ${Math.abs(b)}×`);
      else if (Math.abs(b) > 1) parts.push(`Compressed horizontally by ${b}×`);
      else if (Math.abs(b) < 1 && b > 0) parts.push(`Stretched horizontally by ${(1 / b).toFixed(1)}×`);
    }

    if (h !== 0) {
      parts.push(h > 0 ? `Shifted right by ${h} units` : `Shifted left by ${Math.abs(h)} units`);
    }

    if (k !== 0) {
      parts.push(k > 0 ? `Shifted up by ${k} units` : `Shifted down by ${Math.abs(k)} units`);
    }

    return parts.length > 0 ? parts.join(", ") : "Standard base function (no transformation applied)";
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Transformations Engine
          </span>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-95"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Target Function & Transformed Formula Card */}
      <div className="p-4 bg-muted/60 border border-border rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            Transformed Equation
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-card border border-border">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: primaryFunction.color }}
            />
            <span className="font-mono text-[11px] font-bold text-foreground">
              {primaryFunction.name}
            </span>
          </div>
        </div>

        <div className="font-mono text-sm font-black text-primary truncate">
          {formulaDisplay}
        </div>

        <div className="text-[11px] font-medium text-muted-foreground leading-relaxed border-t border-border pt-2 flex items-start gap-1.5">
          <Sparkles size={13} className="text-primary shrink-0 mt-0.5" />
          <span>{getExplanation()}</span>
        </div>
      </div>

      {/* Sliders Grid: a, b, h, k in a·f(b(x - h)) + k */}
      <div className="space-y-4">
        {/* a: Vertical Stretch & Reflection */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 font-mono text-center leading-5 text-xs font-black">
                a
              </span>
              <span>Vertical Scale / Stretch</span>
            </label>
            <span className="font-mono font-black text-primary">{transform.a}</span>
          </div>
          <input
            type="range"
            min="-4"
            max="4"
            step="0.1"
            value={transform.a}
            onChange={(e) => updateParam("a", parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>Inverted (-4)</span>
            <span>Zero (0)</span>
            <span>Stretched (+4)</span>
          </div>
        </div>

        {/* b: Horizontal Frequency & Compression */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-600 font-mono text-center leading-5 text-xs font-black">
                b
              </span>
              <span>Horizontal Frequency / Compression</span>
            </label>
            <span className="font-mono font-black text-primary">{transform.b}</span>
          </div>
          <input
            type="range"
            min="-4"
            max="4"
            step="0.1"
            value={transform.b}
            onChange={(e) => updateParam("b", parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>Flip (-4)</span>
            <span>Standard (1)</span>
            <span>Fast (+4)</span>
          </div>
        </div>

        {/* h: Horizontal Shift */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 font-mono text-center leading-5 text-xs font-black">
                h
              </span>
              <span>Horizontal Shift (Left / Right)</span>
            </label>
            <span className="font-mono font-black text-primary">{transform.h}</span>
          </div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.5"
            value={transform.h}
            onChange={(e) => updateParam("h", parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>Left (-8)</span>
            <span>Origin (0)</span>
            <span>Right (+8)</span>
          </div>
        </div>

        {/* k: Vertical Shift */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 font-mono text-center leading-5 text-xs font-black">
                k
              </span>
              <span>Vertical Shift (Up / Down)</span>
            </label>
            <span className="font-mono font-black text-primary">{transform.k}</span>
          </div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.5"
            value={transform.k}
            onChange={(e) => updateParam("k", parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>Down (-8)</span>
            <span>Origin (0)</span>
            <span>Up (+8)</span>
          </div>
        </div>
      </div>

      {/* Quick Transformation Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Quick Transformation Presets
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateParam("a", transform.a * -1)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all active:scale-95 shadow-sm"
          >
            <FlipVertical size={14} className="text-indigo-500" />
            <span>Invert Y (a = -a)</span>
          </button>
          <button
            onClick={() => updateParam("b", transform.b * -1)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all active:scale-95 shadow-sm"
          >
            <FlipHorizontal size={14} className="text-purple-500" />
            <span>Invert X (b = -b)</span>
          </button>
          <button
            onClick={() => updateParam("a", 2)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all active:scale-95 shadow-sm"
          >
            <span>Stretch 2×</span>
          </button>
          <button
            onClick={() => updateParam("h", transform.h + 2)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-all active:scale-95 shadow-sm"
          >
            <span>Shift Right +2</span>
          </button>
        </div>
      </div>
    </div>
  );
}
