"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  OrbitParameters,
  OrbitTelemetry,
  OrbitDisplayMode,
} from "./types";
import {
  computeOrbitTelemetry,
  EARTH_ORBITAL_SPEED_KMS,
} from "./engine";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Download,
  BookOpen,
  Table,
  Layers,
  Compass,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function KeplerOrbitLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/kepler-orbit",
    "physics",
    "simulation"
  );
  const { challenge, validateChallenge } = useDailyChallenge("physics/kepler-orbit");

  // ── Orbit Parameters ──────────────────────────────────────────────────
  const [semiMajorAxisAU, setSemiMajorAxisAU] = useState<number>(1.5); // 0.4 to 5.0 AU
  const [eccentricity, setEccentricity] = useState<number>(0.45); // 0.0 to 0.92
  const [starMassSolar, setStarMassSolar] = useState<number>(1.0); // 0.2 to 3.5 M_sun
  const [planetMassEarth, setPlanetMassEarth] = useState<number>(1.0); // M_earth
  const [displayMode, setDisplayMode] = useState<OrbitDisplayMode>("standard");
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 0.2x to 5x

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTimeYears, setSimTimeYears] = useState<number>(0);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "presets" | "theory" | "data">("controls");

  // Recorded Experiment Trials
  const [trials, setTrials] = useState<Array<{ id: string; time: string; a: number; e: number; M: number; T: number; vMax: number }>>([]);

  // ── 60 FPS Physics Simulation Loop ─────────────────────────────────────
  useEffect(() => {
    let animId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dtSec = Math.max(0.001, Math.min(0.05, (now - last) / 1000));
      last = now;

      if (isPlaying) {
        // Convert real dt to simulation years: 1 real second = 0.25 * simSpeed sim years
        const dtYears = dtSec * 0.35 * simSpeed;
        setSimTimeYears((p) => p + dtYears);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed]);

  // ── Analytical Telemetry Calculations ──────────────────────────────────
  const orbitParams: OrbitParameters = useMemo(
    () => ({
      semiMajorAxisAU,
      eccentricity,
      starMassSolar,
      planetMassEarth,
      displayMode,
      showVectors,
      showGrid,
      simSpeed,
    }),
    [semiMajorAxisAU, eccentricity, starMassSolar, planetMassEarth, displayMode, showVectors, showGrid, simSpeed]
  );

  const telemetry: OrbitTelemetry = useMemo(
    () => computeOrbitTelemetry(orbitParams, simTimeYears),
    [orbitParams, simTimeYears]
  );

  // ── AI Context Sync ────────────────────────────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Kepler Orbit & Gravitational Mechanics Studio",
      theory: "Kepler's Laws of Planetary Motion: (1) Orbits are ellipses with the Sun at one focus. (2) Radius vector sweeps equal areas in equal times (dA/dt = const). (3) Harmonic Law T² = (4π²/GM)·a³.",
      extraContext: {
        semiMajorAxisAU: `${semiMajorAxisAU} AU`,
        eccentricity: eccentricity.toFixed(3),
        starMass: `${starMassSolar} M_sun`,
        orbitalPeriodYears: `${telemetry.orbitalPeriodYears.toFixed(2)} yr`,
        orbitalSpeedKms: `${telemetry.currentSpeedKms.toFixed(1)} km/s`,
        perihelionAU: `${telemetry.perihelionAU.toFixed(2)} AU`,
        aphelionAU: `${telemetry.aphelionAU.toFixed(2)} AU`,
        keplerRatio: telemetry.keplerRatio.toFixed(3),
      },
    });
  }, [semiMajorAxisAU, eccentricity, starMassSolar, telemetry, setExperimentData]);

  // ── SVG Coordinate Transformations ─────────────────────────────────────
  // Canvas width = 500, height = 300, Center = (250, 150)
  // Max radius in AU is ~6.0 AU ==> scale = 40 px/AU
  const scale = 42; // px per AU
  const starSvgX = 250;
  const starSvgY = 150;

  // Semi-minor axis b = a*sqrt(1 - e^2)
  const semiMinorAxisAU = semiMajorAxisAU * Math.sqrt(Math.max(0.001, 1 - eccentricity * eccentricity));
  const semiMajorPx = semiMajorAxisAU * scale;
  const semiMinorPx = semiMinorAxisAU * scale;

  // Center of ellipse is shifted left by a*e from the star focus
  const ellipseCenterSvgX = starSvgX - semiMajorAxisAU * eccentricity * scale;
  const ellipseCenterSvgY = starSvgY;

  // Planet coordinates
  const planetSvgX = starSvgX + telemetry.planetX_AU * scale;
  const planetSvgY = starSvgY - telemetry.planetY_AU * scale;

  // Secondary Empty Focus
  const emptyFocusSvgX = starSvgX - 2 * semiMajorAxisAU * eccentricity * scale;
  const emptyFocusSvgY = starSvgY;

  // Perihelion and Aphelion Svg points
  const perihelionSvgX = starSvgX + telemetry.perihelionAU * scale;
  const aphelionSvgX = starSvgX - telemetry.aphelionAU * scale;

  // Velocity Vector Arrow (Scaled for display)
  const vScale = 1.2;
  const vArrowX = planetSvgX + (telemetry.velocityVx_kms / EARTH_ORBITAL_SPEED_KMS) * scale * vScale;
  const vArrowY = planetSvgY - (telemetry.velocityVy_kms / EARTH_ORBITAL_SPEED_KMS) * scale * vScale;

  // Gravitational Acceleration Vector Arrow (points straight to star)
  const aNorm = 24 / Math.max(0.2, telemetry.currentRadiusAU);
  const aDirX = starSvgX - planetSvgX;
  const aDirY = starSvgY - planetSvgY;
  const aDist = Math.sqrt(aDirX * aDirX + aDirY * aDirY) || 1;
  const aArrowX = planetSvgX + (aDirX / aDist) * Math.min(65, aNorm);
  const aArrowY = planetSvgY + (aDirY / aDist) * Math.min(65, aNorm);

  // ── Presets ────────────────────────────────────────────────────────────
  const presets = [
    {
      title: "1. Earth-Sun Standard Orbit",
      desc: "Nearly circular orbit (a = 1.0 AU, e = 0.017) with 1-year period and 29.8 km/s orbital speed.",
      action: () => {
        setSemiMajorAxisAU(1.0);
        setEccentricity(0.017);
        setStarMassSolar(1.0);
        setDisplayMode("standard");
      },
    },
    {
      title: "2. Halley's Comet (Extreme Eccentricity)",
      desc: "High-eccentricity elliptical orbit (a = 3.5 AU, e = 0.88), speeding past perihelion and coasting at aphelion.",
      action: () => {
        setSemiMajorAxisAU(3.5);
        setEccentricity(0.88);
        setStarMassSolar(1.0);
        setDisplayMode("swept_areas");
      },
    },
    {
      title: "3. Mercury Fast Precession Orbit",
      desc: "Inner solar planet with high eccentricity (a = 0.4 AU, e = 0.206) in deep gravitational potential.",
      action: () => {
        setSemiMajorAxisAU(0.4);
        setEccentricity(0.206);
        setStarMassSolar(1.0);
        setDisplayMode("vectors");
      },
    },
    {
      title: "4. Massive Star & Giant Planet",
      desc: "Massive stellar host (M = 2.5 M_sun, a = 2.2 AU) demonstrating Kepler's 3rd law harmonic scaling.",
      action: () => {
        setSemiMajorAxisAU(2.2);
        setEccentricity(0.5);
        setStarMassSolar(2.5);
        setDisplayMode("standard");
      },
    },
  ];

  // ── CSV Export ─────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ["Timestamp", "Semi-Major Axis (AU)", "Eccentricity", "Star Mass (M_sun)", "Period (Years)", "Speed (km/s)", "Radius (AU)", "Kepler Ratio (T^2/a^3)"],
      ...trials.map((t) => [
        t.time,
        t.a,
        t.e,
        t.M,
        t.T.toFixed(3),
        t.vMax.toFixed(1),
        telemetry.currentRadiusAU.toFixed(3),
        telemetry.keplerRatio.toFixed(3),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kepler_orbit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecordTrial = () => {
    const newTrial = {
      id: `trial_${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      a: semiMajorAxisAU,
      e: eccentricity,
      M: starMassSolar,
      T: telemetry.orbitalPeriodYears,
      vMax: telemetry.currentSpeedKms,
    };
    setTrials((p) => [newTrial, ...p]);
    completeExperiment();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-4">
      {/* ── Top Executive Header ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Globe size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Kepler Orbit &amp; Gravitational Mechanics Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              T² = (4π²/GM)·a³ | v = √[GM(2/r - 1/a)]
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore Kepler&apos;s 3 laws of planetary motion, elliptical orbital mechanics, swept area velocity conservation, and gravitational vectors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer shadow-xs ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-black"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pause" : "Simulate"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSimTimeYears(0);
              setSemiMajorAxisAU(1.5);
              setEccentricity(0.45);
              setStarMassSolar(1.0);
            }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
            title="Reset Simulation"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Apparatus Mode Selector (4 Kepler Visualizations) ──────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "standard", label: "1. Elliptical Trajectory", subtitle: "Kepler's 1st Law (Focus & Axes)" },
          { id: "swept_areas", label: "2. Equal Areas Sweep", subtitle: "Kepler's 2nd Law (dA/dt = const)" },
          { id: "vectors", label: "3. Vector Dynamics", subtitle: "Velocity v & Gravity Accel a" },
          { id: "energy", label: "4. Harmonic T² vs a³", subtitle: "Kepler's 3rd Law Harmonic Ratio" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setDisplayMode(item.id as OrbitDisplayMode);
              completeExperiment();
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
              displayMode === item.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-xs font-black">{item.label}</span>
            <span className="text-[10px] opacity-80 font-mono">{item.subtitle}</span>
          </button>
        ))}
      </div>

      {/* ── Main Studio Split View (7 cols Visual Stage / 5 cols Controls Deck) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Razor-Sharp Vector Orbital Workbench + Harmonic Scope */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Orbital Visualization Canvas (Vector SVG) */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Compass size={14} /> Gravitational Orbital Plane
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                r = {telemetry.currentRadiusAU.toFixed(2)} AU | v = {telemetry.currentSpeedKms.toFixed(1)} km/s
              </span>
            </div>

            {/* Scalable Vector Graphics Simulation */}
            <div className="w-full bg-[#050814] rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center p-2 relative">
              <svg
                viewBox="0 0 500 300"
                className="w-full h-auto max-h-[340px] select-none touch-none"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                <defs>
                  {/* Star radiant solar gradient */}
                  <radialGradient id="starSolarGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#fde047" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                  </radialGradient>

                  {/* Planet atmospheric gradient */}
                  <radialGradient id="planetGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="50%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#082f49" />
                  </radialGradient>
                </defs>

                {/* Optional Coordinate Grid */}
                {showGrid && (
                  <g opacity="0.15">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line
                        key={`cg_x_${i}`}
                        x1={i * 50}
                        y1={0}
                        x2={i * 50}
                        y2={300}
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <line
                        key={`cg_y_${i}`}
                        x1={0}
                        y1={i * 50}
                        x2={500}
                        y2={i * 50}
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Concentric distance circles */}
                    {[1, 2, 3, 4].map((radAU) => (
                      <circle
                        key={`dist_${radAU}`}
                        cx={starSvgX}
                        cy={starSvgY}
                        r={radAU * scale}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                      />
                    ))}
                  </g>
                )}

                {/* Major Axis Reference Line */}
                <line
                  x1={aphelionSvgX - 25}
                  y1={starSvgY}
                  x2={perihelionSvgX + 25}
                  y2={starSvgY}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Kepler's 2nd Law Swept Area Wedges */}
                {displayMode === "swept_areas" && (
                  <g>
                    {telemetry.sweptSectors.map((sector, sIdx) => {
                      const xStart = starSvgX + semiMajorAxisAU * (Math.cos(sector.thetaStart) - eccentricity) * scale;
                      const yStart = starSvgY - semiMinorAxisAU * Math.sin(sector.thetaStart) * scale;
                      const xEnd = starSvgX + semiMajorAxisAU * (Math.cos(sector.thetaEnd) - eccentricity) * scale;
                      const yEnd = starSvgY - semiMinorAxisAU * Math.sin(sector.thetaEnd) * scale;

                      return (
                        <path
                          key={`sector_${sIdx}`}
                          d={`M ${starSvgX} ${starSvgY} L ${xStart} ${yStart} A ${semiMajorPx} ${semiMinorPx} 0 0 0 ${xEnd} ${yEnd} Z`}
                          fill={sector.color}
                          stroke="#f59e0b"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Elliptical Orbital Path */}
                <ellipse
                  cx={ellipseCenterSvgX}
                  cy={ellipseCenterSvgY}
                  rx={semiMajorPx}
                  ry={semiMinorPx}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Empty Focus Marker */}
                <g>
                  <circle cx={emptyFocusSvgX} cy={emptyFocusSvgY} r="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x={emptyFocusSvgX} y={emptyFocusSvgY - 8} fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Empty Focus
                  </text>
                </g>

                {/* Perihelion Marker */}
                <circle cx={perihelionSvgX} cy={starSvgY} r="3.5" fill="#10b981" />
                <text x={perihelionSvgX + 4} y={starSvgY - 6} fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  Perihelion ({telemetry.perihelionAU.toFixed(2)} AU)
                </text>

                {/* Aphelion Marker */}
                <circle cx={aphelionSvgX} cy={starSvgY} r="3.5" fill="#f43f5e" />
                <text x={aphelionSvgX - 4} y={starSvgY - 6} fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                  Aphelion ({telemetry.aphelionAU.toFixed(2)} AU)
                </text>

                {/* Radius Vector r(t) Line */}
                <line
                  x1={starSvgX}
                  y1={starSvgY}
                  x2={planetSvgX}
                  y2={planetSvgY}
                  stroke="rgba(251, 191, 36, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />

                {/* Central Star at Primary Focus (0, 0) */}
                <circle cx={starSvgX} cy={starSvgY} r="28" fill="url(#starSolarGrad)" />
                <circle cx={starSvgX} cy={starSvgY} r="10" fill="#fef08a" />
                <text x={starSvgX} y={starSvgY + 22} fill="#f59e0b" fontSize="9" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                  STAR (Focus 1)
                </text>

                {/* Dynamic Vector Overlays */}
                {(showVectors || displayMode === "vectors") && (
                  <g>
                    {/* Velocity Vector (Emerald Green) */}
                    <line x1={planetSvgX} y1={planetSvgY} x2={vArrowX} y2={vArrowY} stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx={vArrowX} cy={vArrowY} r="3" fill="#10b981" />
                    <text x={vArrowX + 6} y={vArrowY - 2} fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      v ({telemetry.currentSpeedKms.toFixed(0)} km/s)
                    </text>

                    {/* Gravitational Acceleration Vector (Rose Red) */}
                    <line x1={planetSvgX} y1={planetSvgY} x2={aArrowX} y2={aArrowY} stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    <circle cx={aArrowX} cy={aArrowY} r="2.5" fill="#f43f5e" />
                    <text x={aArrowX + 4} y={aArrowY + 10} fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      a_g
                    </text>
                  </g>
                )}

                {/* Orbiting Planet Body */}
                <circle cx={planetSvgX} cy={planetSvgY} r="8" fill="url(#planetGrad)" stroke="#ffffff" strokeWidth="1.5" />
                <text x={planetSvgX} y={planetSvgY - 12} fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  Planet
                </text>
              </svg>
            </div>
          </div>

          {/* Synchronized Analytical Harmonic & Phase Scope */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity size={14} className="text-sky-400" />
                {displayMode === "energy" ? "Kepler's 3rd Law Harmonic Line (T² vs a³)" : "Orbital Velocity & Radius Profile"}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                T = {telemetry.orbitalPeriodYears.toFixed(2)} yr ({telemetry.orbitalPeriodDays.toFixed(0)} days)
              </span>
            </div>

            {/* Scope Visualizer */}
            <div className="w-full h-[125px] bg-[#050811] rounded-2xl border border-border/80 p-3 flex flex-col justify-between font-mono text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-muted-foreground">True Anomaly (ν):</span>
                <span className="font-bold text-sky-400">{telemetry.trueAnomalyDeg.toFixed(1)}°</span>
                <span className="text-muted-foreground">Perihelion Speed:</span>
                <span className="font-bold text-emerald-400">{(telemetry.currentSpeedKms * Math.sqrt((1 + eccentricity) / (1 - eccentricity || 1))).toFixed(1)} km/s</span>
                <span className="text-muted-foreground">Aphelion Speed:</span>
                <span className="font-bold text-rose-400">{(telemetry.currentSpeedKms * Math.sqrt((1 - eccentricity) / (1 + eccentricity))).toFixed(1)} km/s</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Orbit Speed Ratio (v_peri / v_aph):</span>
                  <span className="font-black text-amber-400">{((1 + eccentricity) / (1 - eccentricity || 1)).toFixed(2)}x</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${Math.min(100, (telemetry.currentSpeedKms / (telemetry.currentSpeedKms * 1.6)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Specific Mechanical Energy: <strong className="text-foreground">{telemetry.specificEnergyMJ.toFixed(1)} MJ/kg</strong></span>
                <span>Harmonic Constant (T²/a³): <strong className="text-primary">{telemetry.keplerRatio.toFixed(3)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls Deck & 4 Bottom Telemetry Metric Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Console Deck */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex gap-1 bg-muted p-1 rounded-2xl border border-border">
              {[
                { id: "controls", label: "Controls", icon: Sliders },
                { id: "presets", label: "Presets", icon: Sparkles },
                { id: "theory", label: "Theory", icon: BookOpen },
                { id: "data", label: "Data Log", icon: Table },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveConsoleTab(t.id as typeof activeConsoleTab)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      activeConsoleTab === t.id
                        ? "bg-card text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4 text-xs">
                {/* Semi-major Axis Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Semi-Major Axis (a):</span>
                    <span className="font-black text-primary">{semiMajorAxisAU.toFixed(2)} AU</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="5.0"
                    step="0.05"
                    value={semiMajorAxisAU}
                    onChange={(e) => setSemiMajorAxisAU(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Eccentricity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Eccentricity (e):</span>
                    <span className="font-black text-amber-500">{eccentricity.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.92"
                    step="0.01"
                    value={eccentricity}
                    onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Circular (0.0)</span>
                    <span>Elliptical</span>
                    <span>Highly Elongated (0.92)</span>
                  </div>
                </div>

                {/* Star Mass Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Central Star Mass (M):</span>
                    <span className="font-black text-emerald-400">{starMassSolar.toFixed(2)} M☉</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.5"
                    step="0.1"
                    value={starMassSolar}
                    onChange={(e) => setStarMassSolar(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Simulation Speed & Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">Speed (Speed Multiplier):</span>
                    <div className="flex gap-1">
                      {[0.5, 1.0, 2.5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSimSpeed(s)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono border cursor-pointer ${
                            simSpeed === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted border-border text-foreground hover:bg-accent"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">Display Toggles:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setShowVectors(!showVectors)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono border cursor-pointer ${
                          showVectors
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        Vectors
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGrid(!showGrid)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono border cursor-pointer ${
                          showGrid
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: PRESETS ── */}
            {activeConsoleTab === "presets" && (
              <div className="space-y-2.5">
                {presets.map((p, i) => (
                  <div
                    key={i}
                    onClick={p.action}
                    className="p-3 bg-muted/40 hover:bg-accent border border-border rounded-2xl cursor-pointer transition space-y-1"
                  >
                    <span className="font-bold text-xs text-foreground block">{p.title}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 3: THEORY ── */}
            {activeConsoleTab === "theory" && (
              <div className="space-y-3 text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-primary block">Kepler&apos;s 1st Law (Law of Ellipses)</span>
                  <p className="text-muted-foreground text-[11px]">
                    The orbit of a planet is an ellipse with the Sun located at one of the two foci: r = a(1 - e²) / (1 + e·cos ν).
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-amber-500 block">Kepler&apos;s 2nd Law (Equal Areas in Equal Times)</span>
                  <p className="text-muted-foreground text-[11px]">
                    A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time (dA/dt = L / 2m = const).
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-emerald-400 block">Kepler&apos;s 3rd Law (Harmonic Law)</span>
                  <p className="text-muted-foreground text-[11px]">
                    The square of the orbital period is directly proportional to the cube of the semi-major axis: T² = (4π² / GM)·a³.
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 4: DATA LOG ── */}
            {activeConsoleTab === "data" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRecordTrial}
                  className="w-full py-2 rounded-2xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-sm"
                >
                  + Record Orbit Snapshot
                </button>

                {trials.length === 0 ? (
                  <p className="text-center py-6 text-xs text-muted-foreground font-mono">
                    No trials recorded yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-[11px]">
                    {trials.map((t, idx) => (
                      <div key={t.id} className="p-2.5 bg-muted/30 border border-border rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-primary">#{idx + 1} a={t.a}AU | e={t.e}</span>
                          <span className="text-muted-foreground block text-[10px]">M={t.M}M☉</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-400 block">{t.T.toFixed(2)} yr</span>
                          <span className="text-muted-foreground text-[10px]">{t.vMax.toFixed(1)} km/s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 4 Telemetry Readout Cards (Bottom of Right Column) ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Orbital Period (T)</span>
              <span className="text-base font-black text-emerald-400 font-mono block">
                {telemetry.orbitalPeriodYears.toFixed(2)} yr
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Orbital Speed (v)</span>
              <span className="text-base font-black text-sky-400 font-mono block">
                {telemetry.currentSpeedKms.toFixed(1)} km/s
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Specific Energy (E)</span>
              <span className="text-base font-black text-amber-500 font-mono block">
                {telemetry.specificEnergyMJ.toFixed(1)} MJ/kg
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Kepler Ratio (T²/a³)</span>
              <span className="text-base font-black text-primary font-mono block">
                {telemetry.keplerRatio.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Daily Challenge Card */}
      <DailyChallengeCard
        labId="physics/kepler-orbit"
        currentParams={{
          semiMajorAxis: semiMajorAxisAU,
          eccentricity: eccentricity,
          periodMeasured: telemetry.orbitalPeriodYears,
          speedMeasured: telemetry.currentSpeedKms,
        }}
      />
    </div>
  );
}
