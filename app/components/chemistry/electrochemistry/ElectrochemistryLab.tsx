"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import CircuitFlowRenderer, { CircuitPath } from "@/app/components/shared/CircuitFlowRenderer";
import FeedbackPulse from "@/app/components/FeedbackPulse";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Zap,
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
  BatteryCharging,
  Gauge,
  Activity,
  Flame,
} from "lucide-react";

export interface HalfCellMetal {
  id: string;
  name: string;
  symbol: string;
  standardPotential: number; // E° reduction (V)
  color: string;
  ionCharge: number;
}

export const METALS: HalfCellMetal[] = [
  { id: "mg", name: "Magnesium", symbol: "Mg", standardPotential: -2.37, color: "#94a3b8", ionCharge: 2 },
  { id: "al", name: "Aluminum", symbol: "Al", standardPotential: -1.66, color: "#cbd5e1", ionCharge: 3 },
  { id: "zn", name: "Zinc", symbol: "Zn", standardPotential: -0.76, color: "#a1a1aa", ionCharge: 2 },
  { id: "fe", name: "Iron", symbol: "Fe", standardPotential: -0.44, color: "#78716c", ionCharge: 2 },
  { id: "pb", name: "Lead", symbol: "Pb", standardPotential: -0.13, color: "#64748b", ionCharge: 2 },
  { id: "cu", name: "Copper", symbol: "Cu", standardPotential: +0.34, color: "#f97316", ionCharge: 2 },
  { id: "ag", name: "Silver", symbol: "Ag", standardPotential: +0.80, color: "#e2e8f0", ionCharge: 1 },
];

export default function ElectrochemistryLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "chemistry/electrochemistry",
    "chemistry",
    "simulation"
  );

  // Selected Anode (Oxidation) & Cathode (Reduction)
  const [anodeMetalId, setAnodeMetalId] = useState<string>("zn");
  const [cathodeMetalId, setCathodeMetalId] = useState<string>("cu");

  // Cell Mode: Galvanic (Spontaneous) vs Electrolytic (External EMF applied)
  const [mode, setMode] = useState<"galvanic" | "electrolytic">("galvanic");
  const [externalVoltage, setExternalVoltage] = useState<number>(3.0); // For electrolytic mode

  // Load Resistance (Ohms)
  const [resistance, setResistance] = useState<number>(10);
  const internalResistance = 2.0; // Cell electrolyte & salt bridge internal resistance (Ohms)

  // Ion Molarities (Nernst equation)
  const [anodeMolarity, setAnodeMolarity] = useState<number>(1.0);
  const [cathodeMolarity, setCathodeMolarity] = useState<number>(1.0);

  // Mass Transfer Progress
  const [reactionProgress, setReactionProgress] = useState<number>(0);
  const [isReactionRunning, setIsReactionRunning] = useState<boolean>(true);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const anode = METALS.find((m) => m.id === anodeMetalId) || METALS[2];
  const cathode = METALS.find((m) => m.id === cathodeMetalId) || METALS[5];

  // Standard Cell EMF: E°cell = E°cathode - E°anode
  const standardEMF = useMemo(() => {
    return cathode.standardPotential - anode.standardPotential;
  }, [anode, cathode]);

  // Nernst Equation Open-Circuit EMF: E = E° - (0.0592 / n) * log10(Q)
  const openCircuitEMF = useMemo(() => {
    if (mode === "electrolytic") {
      return Math.max(0, externalVoltage - Math.abs(standardEMF));
    }
    const n = Math.min(anode.ionCharge, cathode.ionCharge);
    const Q = Math.max(0.001, anodeMolarity / Math.max(0.001, cathodeMolarity));
    const nernstShift = (0.0592 / n) * Math.log10(Q);
    return Math.max(0, standardEMF - nernstShift);
  }, [standardEMF, anodeMolarity, cathodeMolarity, anode.ionCharge, cathode.ionCharge, mode, externalVoltage]);

  // Total Circuit Resistance (R_load + r_int)
  const totalResistance = useMemo(() => {
    return Math.max(0.1, resistance + internalResistance);
  }, [resistance, internalResistance]);

  // Current (Amps) = EMF / (R_load + r_int)
  const currentAmps = useMemo(() => {
    if (!isReactionRunning || openCircuitEMF <= 0) return 0;
    return openCircuitEMF / totalResistance;
  }, [openCircuitEMF, totalResistance, isReactionRunning]);

  // Terminal Voltage (Volts across the load resistor): V_terminal = I * R_load = EMF - I * r_int
  const terminalVoltage = useMemo(() => {
    if (!isReactionRunning || currentAmps <= 0) return 0;
    return currentAmps * resistance;
  }, [currentAmps, resistance, isReactionRunning]);

  // Internal Voltage Drop: V_drop = I * r_int
  const internalVoltageDrop = useMemo(() => {
    if (!isReactionRunning || currentAmps <= 0) return 0;
    return currentAmps * internalResistance;
  }, [currentAmps, internalResistance, isReactionRunning]);

  // Power Dissipated (Watts): P = V_terminal * I
  const powerWatts = useMemo(() => {
    return terminalVoltage * currentAmps;
  }, [terminalVoltage, currentAmps]);

  // Mass Transfer Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReactionRunning && currentAmps > 0) {
      interval = setInterval(() => {
        setReactionProgress((prev) => (prev + currentAmps * 0.08) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isReactionRunning, currentAmps]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Electrochemical Galvanic & Electrolytic Cells Studio",
      theory: "Galvanic cells convert spontaneous redox chemical energy into electrical current (E°cell = E°red - E°ox). Terminal voltage changes with load resistance according to Ohm's law and cell internal resistance: V_terminal = E_cell - I * r_int.",
      extraContext: {
        anode: anode.name,
        cathode: cathode.name,
        standardEMF: standardEMF.toFixed(2),
        openCircuitEMF: openCircuitEMF.toFixed(2),
        terminalVoltage: terminalVoltage.toFixed(2),
        currentAmps: currentAmps.toFixed(3),
        resistance,
        mode,
      },
    });
  }, [anode, cathode, standardEMF, openCircuitEMF, terminalVoltage, currentAmps, resistance, mode, setExperimentData]);

  // Circuit Flow Paths
  const circuitPaths: CircuitPath[] = useMemo(() => {
    const direction = mode === "galvanic" ? 1 : -1;
    const speed = currentAmps > 0 ? currentAmps * 2.5 * direction : 0;

    return [
      {
        id: "external-wire",
        points: [
          { x: 180, y: 150 }, // Anode strip top
          { x: 180, y: 50 },
          { x: 300, y: 50 },  // Voltmeter center
          { x: 420, y: 50 },
          { x: 420, y: 150 }, // Cathode strip top
        ],
        wireWidth: 3.5,
        color: "rgba(148, 163, 184, 0.6)",
        particleColor: "#38bdf8",
        particleCount: 14,
        speed,
        particleSize: 4.5,
      },
    ];
  }, [currentAmps, mode]);

  // Bulb brightness factor (0 to 1)
  const bulbBrightness = Math.min(1, powerWatts / 0.15);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Electrochemical Galvanic &amp; Electrolytic Cells Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Physical Electrochemistry
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Spontaneous redox potential, internal cell resistance ($r_&#123;\text&#123;int&#125;&#125; = 2\text&#123; &#125;\Omega$), terminal load voltage, Nernst shift, and electrode mass transfer
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => {
              setMode("galvanic");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "galvanic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Galvanic (Spontaneous)
          </button>
          <button
            onClick={() => {
              setMode("electrolytic");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "electrolytic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Electrolytic (Driven)
          </button>
        </div>
      </div>

      {/* Main Interactive Electrochemical Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Dual Beakers & Cell Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <BatteryCharging size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Electrochemical Cell Viewport
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 bg-muted rounded-xl font-bold text-muted-foreground text-[11px]">
                E°cell: {standardEMF >= 0 ? `+${standardEMF.toFixed(2)}` : standardEMF.toFixed(2)} V
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl font-bold text-[11px]">
                EMF: {openCircuitEMF.toFixed(2)} V
              </span>
              <span className="px-3 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl font-black text-xs shadow-sm">
                V (Terminal): {terminalVoltage.toFixed(2)} V
              </span>
            </div>
          </div>

          {/* SVG & Circuit Animation Canvas */}
          <div className="relative h-[340px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-inner select-none">
            {/* Voltmeter / Power Supply Gauge at Top Center */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-32 bg-slate-900 border-2 border-amber-500/40 rounded-2xl flex flex-col items-center justify-center p-2 shadow-xl backdrop-blur">
                <div className="flex items-center gap-1 text-[9px] font-extrabold text-muted-foreground uppercase">
                  <Gauge size={10} className="text-amber-400" />
                  <span>{mode === "galvanic" ? "Load Voltmeter" : "DC Power Supply"}</span>
                </div>
                <div className="text-base font-black font-mono text-amber-400 mt-0.5">
                  {terminalVoltage.toFixed(2)} V
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  Load: {resistance} &Omega; &bull; {currentAmps.toFixed(3)} A
                </div>
              </div>
            </div>

            {/* Glowing Lightbulb Load on Wire */}
            <div className="absolute top-2 right-20 z-20 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                {/* Glow ring */}
                {powerWatts > 0.005 && (
                  <div
                    className="absolute rounded-full bg-amber-400/40 blur-md pointer-events-none transition-all duration-300"
                    style={{
                      width: `${24 + bulbBrightness * 36}px`,
                      height: `${24 + bulbBrightness * 36}px`,
                      opacity: 0.3 + bulbBrightness * 0.7,
                    }}
                  />
                )}
                <div
                  className="p-1.5 rounded-full border bg-slate-900 shadow-md transition-colors duration-300"
                  style={{
                    borderColor: powerWatts > 0.005 ? "#f59e0b" : "#475569",
                  }}
                >
                  <Lightbulb
                    size={20}
                    className="transition-all duration-300"
                    style={{
                      color: powerWatts > 0.005 ? "#fbbf24" : "#64748b",
                      filter: powerWatts > 0.005 ? `drop-shadow(0 0 6px #f59e0b)` : "none",
                    }}
                  />
                </div>
              </div>
              <span className="text-[8px] font-mono font-bold text-slate-400 mt-1">
                {(powerWatts * 1000).toFixed(0)} mW Load
              </span>
            </div>

            {/* Circuit Flow Wire Layer */}
            <CircuitFlowRenderer width={580} height={340} paths={circuitPaths} className="absolute inset-0 z-10" />

            {/* Left Beaker (Anode - Oxidation) */}
            <div className="absolute bottom-5 left-12 w-40 h-48 border-2 border-slate-700 border-t-0 rounded-b-3xl bg-slate-900/70 flex flex-col justify-end p-2 overflow-hidden shadow-lg">
              {/* Solution */}
              <div className="h-3/4 w-full bg-blue-500/20 rounded-b-2xl border-t border-blue-500/30 flex items-center justify-center p-1 text-center">
                <span className="text-[10px] font-mono font-bold text-blue-400">
                  {anode.symbol}²⁺ Sol. ({anodeMolarity} M)
                </span>
              </div>

              {/* Anode Metal Strip (Shrinking with oxidation) */}
              <div
                style={{
                  backgroundColor: anode.color,
                  width: `${Math.max(14, 26 - (reactionProgress / 100) * 8)}px`,
                }}
                className="absolute top-6 left-1/2 -translate-x-1/2 h-38 rounded-t-md border border-white/20 shadow-md flex items-center justify-center"
              >
                <span className="text-[9px] font-black text-black font-mono rotate-90 whitespace-nowrap">
                  {anode.symbol} (Anode -)
                </span>
              </div>
            </div>

            {/* Inverted U-Tube Salt Bridge */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-20 border-t-8 border-l-8 border-r-8 border-amber-500/40 rounded-t-3xl pointer-events-none flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30 shadow-sm">
                Salt Bridge (KNO₃)
              </span>
            </div>

            {/* Right Beaker (Cathode - Reduction) */}
            <div className="absolute bottom-5 right-12 w-40 h-48 border-2 border-slate-700 border-t-0 rounded-b-3xl bg-slate-900/70 flex flex-col justify-end p-2 overflow-hidden shadow-lg">
              {/* Solution */}
              <div className="h-3/4 w-full bg-orange-500/20 rounded-b-2xl border-t border-orange-500/30 flex items-center justify-center p-1 text-center">
                <span className="text-[10px] font-mono font-bold text-orange-400">
                  {cathode.symbol}²⁺ Sol. ({cathodeMolarity} M)
                </span>
              </div>

              {/* Cathode Metal Strip (Growing with reduction deposition) */}
              <div
                style={{
                  backgroundColor: cathode.color,
                  width: `${Math.min(34, 26 + (reactionProgress / 100) * 8)}px`,
                }}
                className="absolute top-6 left-1/2 -translate-x-1/2 h-38 rounded-t-md border border-white/20 shadow-md flex items-center justify-center"
              >
                <span className="text-[9px] font-black text-black font-mono rotate-90 whitespace-nowrap">
                  {cathode.symbol} (Cathode +)
                </span>
              </div>
            </div>
          </div>

          {/* Metal Strip Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Anode Half-Cell Selector */}
            <div className="space-y-1.5 p-3 bg-muted/20 border border-border/60 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-500 uppercase font-mono block">
                Select Anode Metal (Oxidation):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {METALS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setAnodeMetalId(m.id);
                      completeExperiment();
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-mono font-bold transition-all border ${
                      anodeMetalId === m.id
                        ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-sm"
                        : "bg-muted/40 hover:bg-accent border-border text-foreground"
                    }`}
                  >
                    {m.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Cathode Half-Cell Selector */}
            <div className="space-y-1.5 p-3 bg-muted/20 border border-border/60 rounded-2xl">
              <span className="text-[10px] font-bold text-orange-500 uppercase font-mono block">
                Select Cathode Metal (Reduction):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {METALS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCathodeMetalId(m.id);
                      completeExperiment();
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-mono font-bold transition-all border ${
                      cathodeMetalId === m.id
                        ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-sm"
                        : "bg-muted/40 hover:bg-accent border-border text-foreground"
                    }`}
                  >
                    {m.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Nernst Concentration, Load Dynamics & Live Metrics (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-primary" />
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Load Resistance &amp; Nernst Controls
                </span>
              </div>

              <button
                onClick={() => setIsReactionRunning(!isReactionRunning)}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {isReactionRunning ? <Pause size={13} /> : <Play size={13} />}
                <span>{isReactionRunning ? "Pause Cell" : "Run Cell"}</span>
              </button>
            </div>

            {/* Dynamic Telemetry Metric Cards Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block font-mono">
                  Terminal Voltage
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {terminalVoltage.toFixed(2)} V
                </span>
              </div>

              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block font-mono">
                  Open EMF (E)
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {openCircuitEMF.toFixed(2)} V
                </span>
              </div>

              <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-sky-600 dark:text-sky-400 block font-mono">
                  Current (I)
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {(currentAmps * 1000).toFixed(0)} mA
                </span>
              </div>

              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block font-mono">
                  Power (P)
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {(powerWatts * 1000).toFixed(1)} mW
                </span>
              </div>

              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-rose-600 dark:text-rose-400 block font-mono">
                  Internal Drop
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {internalVoltageDrop.toFixed(2)} V
                </span>
              </div>

              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <span className="text-[9px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block font-mono">
                  r_int (Cell)
                </span>
                <span className="text-sm font-black font-mono text-foreground mt-0.5 block">
                  {internalResistance.toFixed(1)} &Omega;
                </span>
              </div>
            </div>

            {/* Half-Reaction Equations */}
            <div className="space-y-1.5 p-3 bg-muted/30 border border-border/60 rounded-2xl font-mono text-xs">
              <div>
                <span className="text-[9px] text-blue-500 font-bold uppercase block">Anode Oxidation:</span>
                <span className="font-bold text-foreground text-[11px]">
                  {anode.symbol} (s) &rarr; {anode.symbol}²⁺ (aq) + 2e⁻ (E° = {(-anode.standardPotential).toFixed(2)} V)
                </span>
              </div>
              <div className="pt-1.5 border-t border-border/60">
                <span className="text-[9px] text-orange-500 font-bold uppercase block">Cathode Reduction:</span>
                <span className="font-bold text-foreground text-[11px]">
                  {cathode.symbol}²⁺ (aq) + 2e⁻ &rarr; {cathode.symbol} (s) (E° = {cathode.standardPotential.toFixed(2)} V)
                </span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3 pt-1">
              {/* Resistance Slider */}
              <div className="space-y-1 p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-foreground font-bold flex items-center gap-1">
                    <Sliders size={13} className="text-amber-500" />
                    Load Resistance ($R_&#123;\text&#123;load&#125;&#125;$):
                  </span>
                  <span className="font-black text-amber-500">{resistance} &Omega;</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={resistance}
                  onChange={(e) => setResistance(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>1 &Omega; (Max Current / Low V)</span>
                  <span>100 &Omega; (Min Current / High V)</span>
                </div>
              </div>

              {/* Anode [M²⁺] */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground font-sans">Anode [{anode.symbol}²⁺]:</span>
                  <span className="font-bold text-foreground">{anodeMolarity.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.01"
                  value={anodeMolarity}
                  onChange={(e) => setAnodeMolarity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Cathode [M²⁺] */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground font-sans">Cathode [{cathode.symbol}²⁺]:</span>
                  <span className="font-bold text-foreground">{cathodeMolarity.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.01"
                  value={cathodeMolarity}
                  onChange={(e) => setCathodeMolarity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Theoretical Physics Formula Note */}
          <div className="p-3 bg-muted/40 border border-border rounded-2xl text-[11px] text-muted-foreground font-mono space-y-1">
            <div className="text-[10px] font-bold uppercase text-foreground">Terminal Voltage Equation:</div>
            <div>$V_&#123;\text&#123;terminal&#125;&#125; = \mathcal&#123;E&#125;_&#123;\text&#123;cell&#125;&#125; \cdot \frac&#123;R_&#123;\text&#123;load&#125;&#125;&#125;&#123;R_&#123;\text&#123;load&#125;&#125; + r_&#123;\text&#123;int&#125;&#125;&#125; = I \cdot R_&#123;\text&#123;load&#125;&#125;$</div>
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
              <h3 className="text-sm font-bold text-foreground">What happens to the terminal voltage of a galvanic cell when the circuit load resistance decreases?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Current increases, leading to a larger internal voltage drop (I · r_int) and lower terminal voltage across the load",
            "Terminal voltage increases because resistance pushes electrons faster",
            "Terminal voltage stays exactly constant regardless of any resistance change",
            "The cell reverses polarity and becomes electrolytic",
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

      {/* Lab Feedback Widget */}
      <FeedbackPulse labId="chemistry/electrochemistry" />
    </div>
  );
}
