// app/components/physics/general-relativity/TwinParadoxPanel.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Rocket, Clock, Globe, ArrowRight, Activity } from "lucide-react";

interface Destination {
  name: string;
  distanceLy: number;
  description: string;
}

const DESTINATIONS: Destination[] = [
  {
    name: "Alpha Centauri",
    distanceLy: 4.37,
    description: "Closest stellar neighbor system to our Sun.",
  },
  {
    name: "Sirius (Dog Star)",
    distanceLy: 8.6,
    description: "Brightest star in Earth's night sky.",
  },
  {
    name: "Vega",
    distanceLy: 25.0,
    description: "Luminous blue-white star in constellation Lyra.",
  },
  {
    name: "Galactic Center (Sagittarius A*)",
    distanceLy: 26000,
    description: "Supermassive black hole core of our Milky Way galaxy.",
  },
];

export default function TwinParadoxPanel() {
  const [speedFractionC, setSpeedFractionC] = useState<number>(0.95); // v/c
  const [selectedDestIndex, setSelectedDestIndex] = useState<number>(0);

  const destination = DESTINATIONS[selectedDestIndex];

  // Lorentz factor gamma = 1 / sqrt(1 - v^2/c^2)
  const lorentzGamma = useMemo(() => {
    const denom = Math.max(0.0001, 1 - speedFractionC * speedFractionC);
    return 1 / Math.sqrt(denom);
  }, [speedFractionC]);

  // Round trip distance
  const roundTripLy = destination.distanceLy * 2;

  // Earth perspective elapsed time: t_earth = 2 * d / v
  const earthElapsedYears = roundTripLy / speedFractionC;

  // Traveler perspective elapsed proper time: tau = t_earth / gamma
  const travelerElapsedYears = earthElapsedYears / lorentzGamma;

  // Age differential
  const ageDifferenceYears = earthElapsedYears - travelerElapsedYears;

  return (
    <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-sky-400" />
            Special Relativistic Twin Paradox & Minkowski Worldlines
          </h3>
          <p className="text-xs text-muted-foreground">
            Kinematic time dilation: Δτ = Δt √(1 - v² / c²) = Δt / γ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            γ = {lorentzGamma.toFixed(3)}x
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            v = {(speedFractionC * 100).toFixed(1)}% c
          </span>
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-muted-foreground flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            Cruise Velocity (v / c)
          </span>
          <span className="font-mono font-bold text-sky-400">
            {(speedFractionC * 100).toFixed(2)}% of Light Speed
          </span>
        </div>
        <input
          type="range"
          min="0.50"
          max="0.999"
          step="0.005"
          value={speedFractionC}
          onChange={(e) => setSpeedFractionC(parseFloat(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      {/* Destination Selector */}
      <div>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Interstellar Mission Destination (Round Trip)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESTINATIONS.map((dest, idx) => (
            <button
              key={dest.name}
              onClick={() => setSelectedDestIndex(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedDestIndex === idx
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-muted/30 border-border/70 hover:border-border hover:bg-muted/50"
              }`}
            >
              <span className="text-xs font-bold text-foreground block truncate">
                {dest.name}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {dest.distanceLy.toLocaleString()} ly
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Twin Aging Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Earth Bound Twin */}
        <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Earthbound Twin Elapsed Time
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {earthElapsedYears >= 1000
              ? `${(earthElapsedYears / 1000).toFixed(1)}k years`
              : `${earthElapsedYears.toFixed(2)} years`}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Stationary inertial reference frame (t)
          </span>
        </div>

        {/* Traveling Rocket Twin */}
        <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Rocket className="w-3.5 h-3.5 text-sky-400" />
            Traveling Astronaut Proper Time
          </span>
          <span className="text-xl font-bold font-mono text-sky-400">
            {travelerElapsedYears >= 1000
              ? `${(travelerElapsedYears / 1000).toFixed(1)}k years`
              : `${travelerElapsedYears.toFixed(2)} years`}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Dilated spaceship wristwatch time (τ = t / γ)
          </span>
        </div>

        {/* Age Difference upon Reunion */}
        <div className="p-3.5 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Age Difference Upon Return
          </span>
          <span className="text-xl font-bold font-mono text-rose-400">
            {ageDifferenceYears >= 1000
              ? `${(ageDifferenceYears / 1000).toFixed(1)}k years`
              : `${ageDifferenceYears.toFixed(2)} years`}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Astronaut is younger than Earth twin by this delta
          </span>
        </div>
      </div>

      {/* Paradox Resolution Note */}
      <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Why is this not symmetrical?</strong>
        <p className="mt-1">
          While velocity is relative in special relativity, the traveling twin must fire thrusters to decelerate, turn around, and accelerate back to Earth. This physical acceleration breaks symmetry: the traveler shifts between different inertial reference frames (changing their plane of simultaneity), while the Earth twin remains in a single inertial frame throughout.
        </p>
      </div>
    </div>
  );
}
