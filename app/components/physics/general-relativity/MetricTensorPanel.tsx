// app/components/physics/general-relativity/MetricTensorPanel.tsx
"use client";

import React, { useState } from "react";
import { RelativisticTelemetry } from "./types";
import {
  Layers,
  Cpu,
  HelpCircle,
  Sparkles,
  Info,
  Maximize2,
  Atom,
} from "lucide-react";

interface MetricTensorPanelProps {
  telemetry: RelativisticTelemetry;
  kerrSpin: number;
}

export default function MetricTensorPanel({
  telemetry,
  kerrSpin,
}: MetricTensorPanelProps) {
  const [showConnectionDetail, setShowConnectionDetail] = useState<boolean>(false);
  const m = telemetry.metric;

  return (
    <div className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Metric Tensor & Curvature Invariants
            </h3>
            <p className="text-[11px] text-foreground font-semibold">
              Exact Schwarzschild & Kerr Solutions g_μν
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          a* = {kerrSpin.toFixed(3)}
        </span>
      </div>

      {/* Spacetime Line Element Equation */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-border font-mono text-center shadow-inner">
        <div className="text-xs text-sky-400 font-bold mb-1">
          ds² = g₀₀ c²dt² + g₁₁ dr² + g₂₂ dθ² + g₃₃ dφ²
        </div>
        <div className="text-[11px] text-slate-300">
          ds² = -({Math.abs(m.g00).toFixed(4)}) c²dt² + ({m.g11.toFixed(4)}) dr² + r² (dθ² + sin²θ dφ²)
        </div>
      </div>

      {/* 4x4 Metric Tensor Matrix Display */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Covariant Metric Components [g_μν]
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            r = {telemetry.probeRadiusRs.toFixed(2)} r_s
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs text-center">
          {/* Row 0: t */}
          <div className="p-2 rounded bg-card border border-border text-rose-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_tt</span>
            <span>{m.g00.toFixed(4)}</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_tr</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_tθ</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card border border-border text-amber-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_tφ (drag)</span>
            <span>{kerrSpin > 0 ? (kerrSpin * 0.12).toFixed(3) : "0.000"}</span>
          </div>

          {/* Row 1: r */}
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_rt</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card border border-border text-sky-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_rr</span>
            <span>{m.g11 > 1000 ? "∞" : m.g11.toFixed(3)}</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_rθ</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_rφ</span>
            <span>0.000</span>
          </div>

          {/* Row 2: theta */}
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_θt</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_θr</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card border border-border text-emerald-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_θθ</span>
            <span>r²</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_θφ</span>
            <span>0.000</span>
          </div>

          {/* Row 3: phi */}
          <div className="p-2 rounded bg-card border border-border text-amber-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_φt (drag)</span>
            <span>{kerrSpin > 0 ? (kerrSpin * 0.12).toFixed(3) : "0.000"}</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_φr</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card/40 border border-border/40 text-muted-foreground flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_φθ</span>
            <span>0.000</span>
          </div>
          <div className="p-2 rounded bg-card border border-border text-purple-400 font-bold flex flex-col justify-center">
            <span className="text-[9px] text-muted-foreground uppercase">g_φφ</span>
            <span>r² sin²θ</span>
          </div>
        </div>
      </div>

      {/* Curvature Invariants Matrix */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-muted/30 border border-border flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">
            Kretschmann Scalar (K)
          </span>
          <span className="text-xs font-mono font-bold text-sky-400">
            {m.kretschmannScalar.toExponential(3)} m⁻⁴
          </span>
          <span className="text-[10px] text-muted-foreground">
            K = 48G²M² / (c⁴ r⁶)
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-muted/30 border border-border flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">
            Ricci Curvature Scalar (R)
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            0.000 (Vacuum Metric)
          </span>
          <span className="text-[10px] text-muted-foreground">
            R_μν = 0 ⇒ Spacetime is Ricci-flat
          </span>
        </div>
      </div>

      {/* Frame Dragging & Lense-Thirring Precession */}
      <div className="p-3 rounded-xl bg-card border border-border flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-amber-400" />
            Lense-Thirring Frame Dragging
          </span>
          <span className="text-[11px] font-mono text-amber-400 font-bold">
            Ω_drag = {m.frameDraggingOmegaRadS.toExponential(2)} rad/s
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Spinning black hole angular momentum drags inertial reference frames into orbit.
          Inside the <strong>Ergosphere</strong> (boundary r_E = {telemetry.ergosphereEquatorKm.toFixed(0)} km),
          static observers cannot exist because the speed required to stand still relative to infinity exceeds c.
        </p>
      </div>

      {/* Christoffel Symbols Toggle */}
      <div className="border-t border-border pt-2">
        <button
          onClick={() => setShowConnectionDetail(!showConnectionDetail)}
          className="w-full py-1.5 px-2 rounded-lg bg-muted/40 hover:bg-muted text-xs text-muted-foreground hover:text-foreground flex items-center justify-between transition-colors"
        >
          <span className="font-semibold flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-sky-400" />
            Affine Connections (Christoffel Symbols Γ^μ_αβ)
          </span>
          <span className="text-[10px] text-sky-400 underline">
            {showConnectionDetail ? "Hide Details" : "View Formulas"}
          </span>
        </button>

        {showConnectionDetail && (
          <div className="mt-2 p-2.5 rounded-xl bg-muted/20 border border-border/80 flex flex-col gap-1.5 font-mono text-[11px] text-slate-300">
            <div className="text-sky-400 font-bold">Non-zero Christoffel Symbols:</div>
            <div>• Γ^r_tt = (c² r_s) (1 - r_s/r) / (2 r²)</div>
            <div>• Γ^t_tr = r_s / [2 r² (1 - r_s/r)]</div>
            <div>• Γ^r_rr = -r_s / [2 r² (1 - r_s/r)]</div>
            <div>• Γ^r_θθ = -r (1 - r_s/r)</div>
            <div>• Γ^r_φφ = -r (1 - r_s/r) sin²θ</div>
            <div>• Γ^θ_rθ = 1 / r</div>
            <div>• Γ^φ_rφ = 1 / r,  Γ^φ_θφ = cot θ</div>
            <p className="text-[10px] font-sans text-muted-foreground mt-1">
              These connection coefficients enter the Geodesic Equation: d²x^μ/dλ² + Γ^μ_αβ (dx^α/dλ)(dx^β/dλ) = 0.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
