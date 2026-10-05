// app/components/physics/general-relativity/SpectrometerPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import { SPECTRAL_LINES, wavelengthToRGB } from "./engine";
import { SpectralLine } from "./types";
import { Radio, Zap, ArrowRight, Sun } from "lucide-react";

interface SpectrometerPanelProps {
  gravitationalRedshiftZ: number;
  probeRadiusRs: number;
  timeDilationFactor: number;
}

export default function SpectrometerPanel({
  gravitationalRedshiftZ,
  probeRadiusRs,
  timeDilationFactor,
}: SpectrometerPanelProps) {
  const [selectedLineId, setSelectedLineId] = useState<string>("h-alpha");

  const activeLine = useMemo<SpectralLine>(() => {
    return SPECTRAL_LINES.find((l) => l.id === selectedLineId) || SPECTRAL_LINES[0];
  }, [selectedLineId]);

  // Observed shifted wavelength: lambda_obs = lambda_rest * (1 + z)
  const observedWavelengthNm = activeLine.restWavelengthNm * (1 + gravitationalRedshiftZ);
  const observedColorHex = wavelengthToRGB(observedWavelengthNm);

  // Blackbody temperature shift (assuming 5800K solar surface)
  const baseTempK = 5778;
  const observedTempK = baseTempK / (1 + gravitationalRedshiftZ);

  // Spectral bar position helper (380nm to 750nm mapped to 0% - 100%)
  const getSpectrumPercent = (wl: number) => {
    return Math.max(0, Math.min(100, ((wl - 380) / (750 - 380)) * 100));
  };

  return (
    <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-sky-400" />
            Gravitational Redshift & Laboratory Spectrometer
          </h3>
          <p className="text-xs text-muted-foreground">
            Wavelength elongation: λ_obs = λ_emit √(1 - r_s / r)⁻¹ = λ_emit (1 + z)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            z = {gravitationalRedshiftZ.toFixed(4)}
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            r = {probeRadiusRs.toFixed(2)} r_s
          </span>
        </div>
      </div>

      {/* Spectral Line Selector Pills */}
      <div>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Reference Atomic Emission Line
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SPECTRAL_LINES.map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedLineId === line.id
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-muted/30 border-border/70 hover:border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: line.restColorHex }}
                  />
                  {line.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {line.restWavelengthNm.toFixed(1)} nm
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Spectrum Comparison: Rest Frame vs Observed Frame */}
      <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/80">
        {/* Continuous Rainbow Reference Bar */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
            <span>Ultraviolet (380 nm)</span>
            <span>Visible Spectrum</span>
            <span>Infrared (750 nm)</span>
          </div>
          <div
            className="w-full h-7 rounded-lg shadow-inner relative overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #4c1d95, #2563eb, #06b6d4, #10b981, #eab308, #ea580c, #dc2626)",
            }}
          >
            {/* Rest Wavelength Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
              style={{ left: `${getSpectrumPercent(activeLine.restWavelengthNm)}%` }}
              title={`Rest: ${activeLine.restWavelengthNm} nm`}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white border border-black shadow" />
            </div>

            {/* Shifted Observed Wavelength Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-yellow-300 shadow-lg pointer-events-none"
              style={{ left: `${getSpectrumPercent(observedWavelengthNm)}%` }}
              title={`Observed: ${observedWavelengthNm.toFixed(1)} nm`}
            >
              <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-yellow-300 border border-black shadow animate-pulse" />
            </div>
          </div>
        </div>

        {/* Numerical Spectroscopic Readout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Rest Emission Line */}
          <div className="p-3 rounded-xl bg-card border border-border flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Rest Emission Wavelength (λ_emit)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-foreground">
                {activeLine.restWavelengthNm.toFixed(2)} nm
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded font-medium text-white shadow-sm"
                style={{ backgroundColor: activeLine.restColorHex }}
              >
                Rest Color
              </span>
            </div>
          </div>

          {/* Observed Gravitationally Shifted Line */}
          <div className="p-3 rounded-xl bg-card border border-border flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              Observed Shifted Wavelength (λ_obs)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-rose-400">
                {observedWavelengthNm.toFixed(2)} nm
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded font-medium text-white shadow-sm"
                style={{ backgroundColor: observedColorHex }}
              >
                {observedWavelengthNm > 750 ? "Infrared (IR)" : "Shifted Color"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Relativistic Thermodynamic & Historical Significance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Thermal Blackbody Temperature Shift
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-amber-400">
              {observedTempK.toFixed(0)} K
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              (from 5,778 K rest emission)
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Radiation cooling factor T_obs = T_emit / (1 + z) causes accretion disk light to redshift into radio/microwave bands.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border">
          <span className="text-[11px] font-medium text-muted-foreground mb-1 block">
            Pound-Rebka Experiment (1959)
          </span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Robert Pound and Glen Rebka verified gravitational redshift in Harvard’s Jefferson Tower over a vertical drop of just 22.5 meters using Mössbauer spectroscopy, confirming fractional shift Δf/f = gh/c² ≈ 2.5×10⁻¹⁵.
          </p>
        </div>
      </div>
    </div>
  );
}
