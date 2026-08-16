"use client";

import React, { useState } from "react";
import { WaveTransform } from "./types";
import { Sliders, RotateCcw, Sparkles, Volume2, Waves } from "lucide-react";

interface WaveTransformPanelProps {
  transform: WaveTransform;
  onUpdateTransform: (updates: Partial<WaveTransform>) => void;
  onIncrementTransformCount?: () => void;
}

export default function WaveTransformPanel({
  transform,
  onUpdateTransform,
  onIncrementTransformCount,
}: WaveTransformPanelProps) {
  const {
    func,
    amplitude,
    frequency,
    phaseShift,
    verticalShift,
    showHarmonic,
    harmonicAmplitude,
    harmonicMultiple,
  } = transform;

  const handleSliderChange = (key: keyof WaveTransform, val: number | boolean) => {
    onUpdateTransform({ [key]: val });
    onIncrementTransformCount?.();
  };

  const handleReset = () => {
    onUpdateTransform({
      func: "sin",
      amplitude: 1,
      frequency: 1,
      phaseShift: 0,
      verticalShift: 0,
      showHarmonic: false,
      harmonicAmplitude: 0.5,
      harmonicMultiple: 2,
    });
  };

  const periodVal = (2 * Math.PI) / (frequency || 1);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Wave Transformation Sandbox
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

      {/* ── Equation Card ──────────────────────────────────── */}
      <div className="p-4 bg-muted/60 border border-border rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            Active Equation
          </span>
          <span className="text-[11px] font-mono font-bold text-primary">
            Period T = {(periodVal / Math.PI).toFixed(2)}π
          </span>
        </div>

        <div className="text-base sm:text-lg font-black text-foreground font-mono tracking-tight bg-background/60 p-2.5 rounded-xl border border-border/80 text-center">
          y = {amplitude !== 1 ? `${amplitude.toFixed(2)} · ` : ""}
          {func}({frequency !== 1 ? `${frequency.toFixed(2)}` : ""}
          {phaseShift !== 0 ? `(x - ${phaseShift.toFixed(2)})` : "x"})
          {verticalShift > 0
            ? ` + ${verticalShift.toFixed(2)}`
            : verticalShift < 0
            ? ` - ${Math.abs(verticalShift).toFixed(2)}`
            : ""}
          {showHarmonic && (
            <span className="text-purple-500 font-bold block sm:inline sm:ml-1 text-sm">
              + {harmonicAmplitude.toFixed(2)} · {func}({harmonicMultiple}x)
            </span>
          )}
        </div>
      </div>

      {/* ── Sliders Console ────────────────────────────────── */}
      <div className="space-y-4">
        {/* Amplitude A */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">
              Amplitude <span className="text-emerald-500 font-mono">(A)</span>
            </span>
            <span className="font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {amplitude.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.05"
            value={amplitude}
            onChange={(e) => handleSliderChange("amplitude", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Frequency B */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">
              Frequency Factor <span className="text-blue-500 font-mono">(B)</span>
            </span>
            <span className="font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
              {frequency.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.05"
            value={frequency}
            onChange={(e) => handleSliderChange("frequency", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Phase Shift C */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">
              Phase Shift <span className="text-amber-500 font-mono">(C)</span>
            </span>
            <span className="font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {phaseShift.toFixed(2)} rad
            </span>
          </div>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step="0.1"
            value={phaseShift}
            onChange={(e) => handleSliderChange("phaseShift", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Vertical Shift D */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">
              Vertical Shift <span className="text-rose-500 font-mono">(D)</span>
            </span>
            <span className="font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
              {verticalShift.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={verticalShift}
            onChange={(e) => handleSliderChange("verticalShift", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>

      {/* ── Harmonic Superposition Toggle ──────────────────── */}
      <div className="pt-3 border-t border-border space-y-3">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/80 cursor-pointer hover:bg-muted transition-colors">
          <div className="flex items-center gap-2.5">
            <Waves className="w-4 h-4 text-purple-500" />
            <div>
              <span className="text-xs font-bold text-foreground block">
                Add 2nd Harmonic
              </span>
              <span className="text-[10px] text-muted-foreground">
                Fourier synthesis (A₂ · sin(2x))
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={showHarmonic}
            onChange={(e) => handleSliderChange("showHarmonic", e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
          />
        </label>

        {showHarmonic && (
          <div className="space-y-2.5 pl-2 pr-1 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Harmonic Amplitude:</span>
                <span className="font-mono text-purple-500">{harmonicAmplitude.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={harmonicAmplitude}
                onChange={(e) => handleSliderChange("harmonicAmplitude", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
