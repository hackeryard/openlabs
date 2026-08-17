"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import ParticlePhysicsEngine, { Particle } from "@/app/components/shared/ParticlePhysicsEngine";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Droplets,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Activity,
  Beaker,
  Scale,
} from "lucide-react";

export type OsmosisExperimentMode = "u_tube" | "cell_suspension" | "dialysis_bag";

export interface SoluteSpecies {
  id: string;
  name: string;
  vanTHoff: number; // i factor
  color: string;
  radius: number;
  permeable: boolean;
}

export const SOLUTE_SPECIES: SoluteSpecies[] = [
  { id: "sucrose", name: "Sucrose (Impermeable C₁₂H₂₂O₁₁)", vanTHoff: 1.0, color: "#f59e0b", radius: 9, permeable: false },
  { id: "nacl", name: "Sodium Chloride (Dissociates Na⁺ + Cl⁻)", vanTHoff: 2.0, color: "#ec4899", radius: 5.5, permeable: false },
  { id: "glucose", name: "Glucose (C₆H₁₂O₆)", vanTHoff: 1.0, color: "#38bdf8", radius: 7.5, permeable: false },
  { id: "urea", name: "Urea (Small Permeable Solute)", vanTHoff: 1.0, color: "#a855f7", radius: 4.5, permeable: true },
];

export default function OsmosisTonicityLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/osmosis-tonicity",
    "biology",
    "simulation"
  );

  // Experiment Mode: U-Tube Osmometer vs Cell Suspension vs Dialysis Bag
  const [mode, setMode] = useState<OsmosisExperimentMode>("u_tube");
  const [selectedSoluteId, setSelectedSoluteId] = useState<string>("sucrose");

  // Concentrations (% or mM)
  const [leftConcentration, setLeftConcentration] = useState<number>(10); // Inside Cell / Left U-Tube
  const [rightConcentration, setRightConcentration] = useState<number>(45); // Extracellular Bath / Right U-Tube
  const [temperatureC, setTemperatureC] = useState<number>(25); // 5°C to 45°C
  const [cellType, setCellType] = useState<"animal_rbc" | "plant_cell">("animal_rbc");
  const [poreSizeNM, setPoreSizeNM] = useState<number>(12);

  // Live Fluid Level Shift in U-Tube (mm height differential)
  const [meniscusHeightDelta, setMeniscusHeightDelta] = useState<number>(0);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const solute = SOLUTE_SPECIES.find((s) => s.id === selectedSoluteId) || SOLUTE_SPECIES[0];

  // Osmotic Pressure Difference: ΔΠ = i * ΔC * R * T (atm)
  const osmoticPressureAtm = useMemo(() => {
    const tempK = temperatureC + 273.15;
    const R = 0.0821; // L atm / (mol K)
    const deltaMolarity = Math.abs(rightConcentration - leftConcentration) * 0.01;
    return (solute.vanTHoff * deltaMolarity * R * tempK).toFixed(2);
  }, [leftConcentration, rightConcentration, temperatureC, solute]);

  // Tonicity State Determination (Extracellular relative to Intracellular)
  const tonicityState = useMemo(() => {
    const delta = rightConcentration - leftConcentration;
    if (delta > 8) return "hypertonic";
    if (delta < -8) return "hypotonic";
    return "isotonic";
  }, [leftConcentration, rightConcentration]);

  // Morphological State
  const cellStatus = useMemo(() => {
    if (cellType === "animal_rbc") {
      if (tonicityState === "hypotonic") return "Swollen / Hemolysed (Burst Lysis)";
      if (tonicityState === "hypertonic") return "Crenated (Shriveled Spiky Echinocyte)";
      return "Normal Biconcave Erythrocyte";
    } else {
      if (tonicityState === "hypotonic") return "Turgid (High Wall Turgor Pressure)";
      if (tonicityState === "hypertonic") return "Plasmolyzed (Plasma Membrane Detached)";
      return "Flaccid (Isotonic Equilibrium)";
    }
  }, [cellType, tonicityState]);

  // Dynamic Meniscus Height in U-Tube Osmometer
  useEffect(() => {
    // Target height differential proportional to concentration difference
    const targetDelta = (rightConcentration - leftConcentration) * 0.9;
    const interval = setInterval(() => {
      setMeniscusHeightDelta((prev) => prev + (targetDelta - prev) * 0.1);
    }, 50);

    return () => clearInterval(interval);
  }, [leftConcentration, rightConcentration]);

  // Particles for ParticlePhysicsEngine
  const membraneX = 280;
  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    let id = 0;

    // Left Chamber Particles
    const leftSoluteCount = Math.floor(leftConcentration * 0.35);
    const leftWaterCount = 36;

    for (let i = 0; i < leftSoluteCount; i++) {
      list.push({
        id: id++,
        x: 30 + Math.random() * (membraneX - 60),
        y: 40 + Math.random() * 250,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: solute.radius,
        mass: 3.5,
        color: solute.color,
        label: solute.id === "nacl" ? "Na⁺" : "S",
      });
    }

    for (let i = 0; i < leftWaterCount; i++) {
      list.push({
        id: id++,
        x: 30 + Math.random() * (membraneX - 60),
        y: 40 + Math.random() * 250,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 4,
        mass: 1,
        color: "#38bdf8",
      });
    }

    // Right Chamber Particles
    const rightSoluteCount = Math.floor(rightConcentration * 0.35);
    const rightWaterCount = 36;

    for (let i = 0; i < rightSoluteCount; i++) {
      list.push({
        id: id++,
        x: membraneX + 30 + Math.random() * (560 - membraneX - 60),
        y: 40 + Math.random() * 250,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: solute.radius,
        mass: 3.5,
        color: solute.color,
        label: solute.id === "nacl" ? "Cl⁻" : "S",
      });
    }

    for (let i = 0; i < rightWaterCount; i++) {
      list.push({
        id: id++,
        x: membraneX + 30 + Math.random() * (560 - membraneX - 60),
        y: 40 + Math.random() * 250,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 4,
        mass: 1,
        color: "#38bdf8",
      });
    }

    return list;
  }, [leftConcentration, rightConcentration, membraneX, solute]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Osmosis, Diffusion & Cell Tonicity Studio",
      theory: "Osmosis is the spontaneous net movement of solvent molecules through a selectively permeable membrane toward higher solute concentration. Van 't Hoff equation: ΔΠ = i ΔM R T. Tonicity governs cell volume, hemolysis/crenation in RBCs, and turgor pressure in plant cells.",
      extraContext: { mode, solute: solute.name, leftConcentration, rightConcentration, tonicityState, cellType, cellStatus, osmoticPressureAtm },
    });
  }, [mode, solute, leftConcentration, rightConcentration, tonicityState, cellType, cellStatus, osmoticPressureAtm, setExperimentData]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm shrink-0">
            <Droplets size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Osmosis, Diffusion &amp; Cell Tonicity Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                Cellular Physiology Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              U-tube osmometer liquid height displacement, Van &apos;t Hoff osmotic pressure, RBC hemolysis/crenation, and plant turgor pressure
            </p>
          </div>
        </div>

        {/* Experiment Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => {
              setMode("u_tube");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "u_tube"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            U-Tube Osmometer
          </button>
          <button
            onClick={() => {
              setMode("cell_suspension");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "cell_suspension"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cell Suspension
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive U-Tube / Membrane Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Beaker size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {mode === "u_tube" ? "Porous Membrane U-Tube Chamber" : "Cellular Tonicity Suspension Medium"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-3 py-1 rounded-xl font-black uppercase border ${
                tonicityState === "hypotonic"
                  ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                  : tonicityState === "hypertonic"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              }`}>
                {tonicityState} Solution
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative h-[320px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-inner select-none">
            {/* Water Meniscus Columns in U-Tube Mode */}
            {mode === "u_tube" && (
              <>
                {/* Left Arm Liquid Level */}
                <div
                  style={{ height: `${120 - meniscusHeightDelta * 0.8}px` }}
                  className="absolute bottom-0 left-6 w-28 bg-blue-500/20 border-t-2 border-blue-400/60 rounded-t-xl transition-all duration-75 flex items-start justify-center pt-1"
                >
                  <span className="text-[9px] font-mono font-bold text-blue-300">
                    h₁ ({(100 - meniscusHeightDelta * 0.8).toFixed(1)}mm)
                  </span>
                </div>

                {/* Right Arm Liquid Level */}
                <div
                  style={{ height: `${120 + meniscusHeightDelta * 0.8}px` }}
                  className="absolute bottom-0 right-6 w-28 bg-blue-500/20 border-t-2 border-blue-400/60 rounded-t-xl transition-all duration-75 flex items-start justify-center pt-1"
                >
                  <span className="text-[9px] font-mono font-bold text-blue-300">
                    h₂ ({(100 + meniscusHeightDelta * 0.8).toFixed(1)}mm)
                  </span>
                </div>
              </>
            )}

            {/* Particle Physics Engine */}
            <ParticlePhysicsEngine
              width={560}
              height={320}
              particles={particles}
              membraneX={membraneX}
              membranePores={[
                { y: 70, size: poreSizeNM },
                { y: 130, size: poreSizeNM },
                { y: 190, size: poreSizeNM },
                { y: 250, size: poreSizeNM },
              ]}
              temperatureFactor={Math.sqrt((temperatureC + 273.15) / 298.15)}
            />

            {/* Chamber Labels */}
            <div className="absolute top-3 left-4 text-[10px] font-mono font-bold text-sky-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
              Left (Inside): {leftConcentration}% [{solute.name.split(" ")[0]}]
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-mono font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
              Right (Bath): {rightConcentration}% [{solute.name.split(" ")[0]}]
            </div>
          </div>

          {/* Solute Species Selector */}
          <div className="space-y-1.5 p-3 bg-muted/20 border border-border/60 rounded-2xl">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
              Select Solute Molecule (Van &apos;t Hoff Factor i):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SOLUTE_SPECIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSoluteId(s.id);
                    completeExperiment();
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-bold transition-all border ${
                    selectedSoluteId === s.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 hover:bg-accent border-border text-foreground"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{s.name.split(" ")[0]}</span>
                    <span className="text-[9px] font-mono opacity-80">i={s.vanTHoff}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Concentration Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Left / Intracellular Solute */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Intracellular (Left) Solute:</span>
                <span className="font-black text-sky-500">{leftConcentration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={leftConcentration}
                onChange={(e) => {
                  setLeftConcentration(parseInt(e.target.value, 10));
                  completeExperiment();
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Right / Extracellular Solute */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Extracellular Bath Solute:</span>
                <span className="font-black text-amber-500">{rightConcentration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={rightConcentration}
                onChange={(e) => {
                  setRightConcentration(parseInt(e.target.value, 10));
                  completeExperiment();
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Cellular Response & Quantitative Osmometry (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Cellular Response &amp; Osmometry
              </span>
            </div>

            {/* Cell Type Toggle */}
            <div className="flex gap-1 bg-muted p-1 rounded-xl">
              <button
                onClick={() => setCellType("animal_rbc")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  cellType === "animal_rbc" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                RBC
              </button>
              <button
                onClick={() => setCellType("plant_cell")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  cellType === "plant_cell" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Plant Cell
              </button>
            </div>
          </div>

          {/* Morphological SVG Visualizer */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <svg width="220" height="150" viewBox="0 0 220 150">
              {cellType === "animal_rbc" ? (
                // Animal Red Blood Cell
                (() => {
                  if (tonicityState === "hypotonic") {
                    // Hemolysed / Burst
                    return (
                      <g>
                        <circle cx="110" cy="75" r="52" fill="#ef4444" opacity="0.85" />
                        <circle cx="110" cy="75" r="50" fill="none" stroke="#fca5a5" strokeWidth="3" strokeDasharray="6 4" />
                        {/* Spilled Hemoglobin Particles */}
                        <circle cx="50" cy="50" r="4" fill="#b91c1c" />
                        <circle cx="170" cy="40" r="3.5" fill="#b91c1c" />
                        <circle cx="175" cy="110" r="4" fill="#b91c1c" />
                        <text x="110" y="80" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                          LYSED / BURST
                        </text>
                      </g>
                    );
                  } else if (tonicityState === "hypertonic") {
                    // Crenated
                    return (
                      <g>
                        <polygon
                          points="110,35 125,55 150,60 135,80 145,105 120,100 110,120 100,100 75,105 85,80 70,60 95,55"
                          fill="#b91c1c"
                        />
                        <text x="110" y="80" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                          CRENATED
                        </text>
                      </g>
                    );
                  } else {
                    // Normal biconcave
                    return (
                      <g>
                        <ellipse cx="110" cy="75" rx="46" ry="34" fill="#dc2626" />
                        <ellipse cx="110" cy="75" rx="20" ry="14" fill="#991b1b" />
                        <text x="110" y="79" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                          NORMAL RBC
                        </text>
                      </g>
                    );
                  }
                })()
              ) : (
                // Plant Cell with Vacuole & Wall
                (() => {
                  const vacuoleRadius = tonicityState === "hypotonic" ? 38 : tonicityState === "hypertonic" ? 14 : 26;

                  return (
                    <g>
                      {/* Cell Wall */}
                      <rect x="45" y="25" width="130" height="100" rx="8" fill="#14532d" stroke="#22c55e" strokeWidth="4" />
                      {/* Plasma Membrane */}
                      <rect
                        x={tonicityState === "hypertonic" ? 60 : 52}
                        y={tonicityState === "hypertonic" ? 40 : 32}
                        width={tonicityState === "hypertonic" ? 100 : 116}
                        height={tonicityState === "hypertonic" ? 70 : 86}
                        rx="6"
                        fill="#166534"
                        className="transition-all duration-300"
                      />
                      {/* Central Vacuole */}
                      <circle cx="110" cy="75" r={vacuoleRadius} fill="#38bdf8" opacity="0.8" className="transition-all duration-300" />
                      <text x="110" y="79" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        {tonicityState === "hypotonic" ? "TURGID" : tonicityState === "hypertonic" ? "PLASMOLYZED" : "FLACCID"}
                      </text>
                    </g>
                  );
                })()
              )}
            </svg>

            <span className="font-mono font-black text-xs text-foreground">
              Cell Status: {cellStatus}
            </span>
          </div>

          {/* Quantitative Osmometry Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
              <span className="text-[10px] text-primary uppercase font-sans font-bold">Osmotic Pressure (&Delta;&Pi;)</span>
              <span className="text-base font-black text-primary block">{osmoticPressureAtm} atm</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">U-Tube Meniscus &Delta;h</span>
              <span className="text-sm font-black text-foreground block">
                {Math.abs(meniscusHeightDelta).toFixed(1)} mm H₂O
              </span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Water Flux Vector</span>
              <span className="text-sm font-black text-sky-500 block">
                {tonicityState === "hypotonic" ? "Inward (Into Cell)" : tonicityState === "hypertonic" ? "Outward (Exiting)" : "Equilibrium"}
              </span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Temperature T</span>
              <span className="text-sm font-black text-amber-500 block">{temperatureC}&deg;C ({temperatureC + 273} K)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Quiz */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-primary block">Conceptual Quick Check</span>
              <h3 className="text-sm font-bold text-foreground">Why does a 1.0 M NaCl solution generate twice the osmotic pressure of a 1.0 M Glucose solution at identical temperature?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because NaCl dissociates into 2 ions (Na⁺ + Cl⁻, Van 't Hoff factor i = 2), doubling the effective particle concentration colligatively relative to non-dissociating glucose (i = 1)",
            "Because sodium atoms are twice as dense as carbon",
            "Because glucose cannot dissolve in pure water",
            "Because chloride ions evaporate out of solution",
          ].map((opt, idx) => {
            const isSelected = selectedQuizAnswer === idx;
            const isCorrect = idx === 0;
            let btnStyle = "bg-muted/40 hover:bg-accent border-border text-foreground";
            if (quizAnswered) {
              if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-500 font-bold";
              else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold";
              else btnStyle = "bg-muted/20 opacity-50 border-border text-muted-foreground";
            } else if (isSelected) {
              btnStyle = "bg-primary text-primary-foreground border-primary font-bold";
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!quizAnswered) {
                    setSelectedQuizAnswer(idx);
                    setQuizAnswered(true);
                  }
                }}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {quizAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
