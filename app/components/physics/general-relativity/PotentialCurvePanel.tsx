// app/components/physics/general-relativity/PotentialCurvePanel.tsx
"use client";

import React, { useMemo } from "react";
import { computeEffectivePotentialCurve } from "./engine";

interface PotentialCurvePanelProps {
  currentProbeRs: number;
  rsKm: number;
  angularMomentumL?: number;
}

export default function PotentialCurvePanel({
  currentProbeRs,
  rsKm,
  angularMomentumL = 3.6,
}: PotentialCurvePanelProps) {
  const curvePoints = useMemo(
    () => computeEffectivePotentialCurve(rsKm, angularMomentumL),
    [rsKm, angularMomentumL]
  );

  // SVG dimensions
  const svgWidth = 340;
  const svgHeight = 150;
  const padLeft = 35;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  // Domain: r in [1.0, 9.0] r_s
  // Range: V in [0.0, 1.4]
  const minR = 1.0;
  const maxR = 8.5;
  const minV = 0.0;
  const maxV = 1.35;

  const mapX = (r: number) => padLeft + ((r - minR) / (maxR - minR)) * plotW;
  const mapY = (v: number) => padTop + plotH - ((v - minV) / (maxV - minV)) * plotH;

  // Generate SVG path for the potential curve
  const pathD = useMemo(() => {
    return curvePoints
      .map((pt, i) => {
        const x = mapX(pt.rRs);
        const y = mapY(Math.max(minV, Math.min(maxV, pt.potential)));
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [curvePoints]);

  // Current probe position on curve
  const probeTerm1 = Math.max(0, 1 - 1 / Math.max(1.0001, currentProbeRs));
  const probeTerm2 = 1 + (angularMomentumL * angularMomentumL) / (currentProbeRs * currentProbeRs);
  const currentV = probeTerm1 * probeTerm2;
  const probeX = Math.max(padLeft, Math.min(svgWidth - padRight, mapX(currentProbeRs)));
  const probeY = Math.max(padTop, Math.min(svgHeight - padBottom, mapY(Math.max(minV, Math.min(maxV, currentV)))));

  // Orbit classification based on current radius
  let orbitType = "Stable Bound Orbit";
  let orbitColor = "#22c55e"; // Green

  if (currentProbeRs < 1.5) {
    orbitType = "Event Horizon Infall (Absorbed)";
    orbitColor = "#ef4444"; // Red
  } else if (currentProbeRs <= 2.2) {
    orbitType = "Zoom-Whirl Near-Horizon Orbit";
    orbitColor = "#f59e0b"; // Amber
  } else if (currentProbeRs <= 3.0) {
    orbitType = "Sub-ISCO Unstable Orbit";
    orbitColor = "#f97316"; // Orange
  } else if (currentProbeRs <= 5.0) {
    orbitType = "Relativistic Precession (Rosette)";
    orbitColor = "#38bdf8"; // Sky
  }

  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          Effective Potential Well <code className="text-sky-400 font-mono">V_eff(r)</code>
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
          style={{ borderColor: `${orbitColor}40`, backgroundColor: `${orbitColor}15`, color: orbitColor }}
        >
          {orbitType}
        </span>
      </div>

      {/* SVG Potential Curve Graph */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-[150px] bg-muted/30 rounded-xl border border-border/60 overflow-hidden"
      >
        {/* Gridlines */}
        <line
          x1={padLeft}
          y1={padTop + plotH}
          x2={svgWidth - padRight}
          y2={padTop + plotH}
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1"
        />
        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={padTop + plotH}
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1"
        />

        {/* Photon Sphere Marker (1.5 r_s) */}
        <line
          x1={mapX(1.5)}
          y1={padTop}
          x2={mapX(1.5)}
          y2={padTop + plotH}
          stroke="#facc15"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x={mapX(1.5) - 10} y={padTop + 10} fill="#facc15" fontSize="8" fontFamily="monospace">
          1.5 r_s
        </text>

        {/* ISCO Marker (3.0 r_s) */}
        <line
          x1={mapX(3.0)}
          y1={padTop}
          x2={mapX(3.0)}
          y2={padTop + plotH}
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x={mapX(3.0) - 8} y={padTop + 10} fill="#38bdf8" fontSize="8" fontFamily="monospace">
          ISCO
        </text>

        {/* Potential Curve Path */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.2" />

        {/* Current Probe Marker Point */}
        <circle cx={probeX} cy={probeY} r="5" fill="#ffffff" stroke={orbitColor} strokeWidth="2.5" />
        <circle cx={probeX} cy={probeY} r="9" fill="none" stroke={orbitColor} strokeWidth="1" opacity="0.6" />

        {/* Axis Labels */}
        <text x={svgWidth - 25} y={padTop + plotH + 16} fill="rgba(148, 163, 184, 0.7)" fontSize="9" fontFamily="sans-serif">
          r / r_s
        </text>
        <text x={padLeft - 28} y={padTop + 8} fill="rgba(148, 163, 184, 0.7)" fontSize="9" fontFamily="sans-serif">
          V_eff
        </text>

        {/* Radial tick marks */}
        {[2, 4, 6, 8].map((tick) => (
          <text
            key={tick}
            x={mapX(tick)}
            y={padTop + plotH + 14}
            fill="rgba(148, 163, 184, 0.7)"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {tick}
          </text>
        ))}
      </svg>

      <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
        <span>● Photon Sphere: Peak Barrier (1.5 r_s)</span>
        <span>● ISCO: Stable Boundary (3.0 r_s)</span>
      </div>
    </div>
  );
}
