"use client";

import React, { useState } from "react";
import { DomainRange, GraphOverlayOptions } from "./types";
import {
  Grid,
  Maximize,
  RotateCcw,
  Sliders,
  Eye,
  Activity,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";

interface GraphControlsProps {
  domain: DomainRange;
  onDomainChange: (newDomain: DomainRange) => void;
  overlays: GraphOverlayOptions;
  onToggleOverlay: (key: keyof GraphOverlayOptions) => void;
  onAutoFit: () => void;
}

export default function GraphControls({
  domain,
  onDomainChange,
  overlays,
  onToggleOverlay,
  onAutoFit,
}: GraphControlsProps) {
  const [localDomain, setLocalDomain] = useState<DomainRange>(domain);

  // Keep local fields in sync when domain changes externally
  React.useEffect(() => {
    setLocalDomain(domain);
  }, [domain]);

  const handleApplyDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      localDomain.xMin < localDomain.xMax &&
      localDomain.yMin < localDomain.yMax
    ) {
      onDomainChange(localDomain);
    }
  };

  const handlePreset = (preset: "standard" | "trig" | "tight" | "wide") => {
    switch (preset) {
      case "standard":
        onDomainChange({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
        break;
      case "trig":
        onDomainChange({
          xMin: Number((-2 * Math.PI).toFixed(2)),
          xMax: Number((2 * Math.PI).toFixed(2)),
          yMin: -3,
          yMax: 3,
        });
        break;
      case "tight":
        onDomainChange({ xMin: -4, xMax: 4, yMin: -4, yMax: 4 });
        break;
      case "wide":
        onDomainChange({ xMin: -25, xMax: 25, yMin: -25, yMax: 25 });
        break;
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Viewport & Layers
          </span>
        </div>
        <button
          onClick={onAutoFit}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <Maximize size={12} />
          <span>Auto-Fit</span>
        </button>
      </div>

      {/* Domain & Range Numerical Inputs */}
      <form onSubmit={handleApplyDomain} className="space-y-3">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Window Bounds
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* X Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground flex justify-between">
              <span>X-Min</span>
              <span>X-Max</span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                value={localDomain.xMin}
                onChange={(e) =>
                  setLocalDomain({ ...localDomain, xMin: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
              />
              <span className="text-muted-foreground text-xs font-bold">to</span>
              <input
                type="number"
                step="any"
                value={localDomain.xMax}
                onChange={(e) =>
                  setLocalDomain({ ...localDomain, xMax: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
              />
            </div>
          </div>

          {/* Y Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground flex justify-between">
              <span>Y-Min</span>
              <span>Y-Max</span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                value={localDomain.yMin}
                onChange={(e) =>
                  setLocalDomain({ ...localDomain, yMin: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
              />
              <span className="text-muted-foreground text-xs font-bold">to</span>
              <input
                type="number"
                step="any"
                value={localDomain.yMax}
                onChange={(e) =>
                  setLocalDomain({ ...localDomain, yMax: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1.5 bg-muted border border-border rounded-xl font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold text-foreground transition-colors shadow-sm active:scale-98"
        >
          Apply Domain & Range
        </button>
      </form>

      {/* Preset Ranges */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Standard Views
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePreset("standard")}
            className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground text-center transition-colors"
          >
            Standard [-10, 10]
          </button>
          <button
            onClick={() => handlePreset("trig")}
            className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground text-center transition-colors"
          >
            Trig [-2π, 2π]
          </button>
          <button
            onClick={() => handlePreset("tight")}
            className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground text-center transition-colors"
          >
            Focused [-4, 4]
          </button>
          <button
            onClick={() => handlePreset("wide")}
            className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground text-center transition-colors"
          >
            Wide [-25, 25]
          </button>
        </div>
      </div>

      {/* Overlay Toggles */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Display Overlays
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Grid Toggle */}
          <button
            onClick={() => onToggleOverlay("showGrid")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showGrid
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Grid Lines</span>
            <Grid size={14} />
          </button>

          {/* Axes Toggle */}
          <button
            onClick={() => onToggleOverlay("showAxes")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showAxes
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Coordinate Axes</span>
            <Compass size={14} />
          </button>

          {/* Roots Overlay */}
          <button
            onClick={() => onToggleOverlay("showRoots")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showRoots
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Roots (x=0)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {/* Extrema Overlay */}
          <button
            onClick={() => onToggleOverlay("showExtrema")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showExtrema
                ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Extrema (Min/Max)</span>
            <Activity size={14} />
          </button>

          {/* Tangent Line */}
          <button
            onClick={() => onToggleOverlay("showTangent")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showTangent
                ? "bg-pink-500/15 border-pink-500 text-pink-600 dark:text-pink-400 shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Tangent Line</span>
            <span className="w-3 h-0.5 bg-pink-500 rounded" />
          </button>

          {/* Integral Shading */}
          <button
            onClick={() => onToggleOverlay("showIntegralShading")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              overlays.showIntegralShading
                ? "bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Area Shading</span>
            <Layers size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
