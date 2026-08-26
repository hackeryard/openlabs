"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Snowflake,
  Sliders,
  Activity,
  Download,
  Gauge,
  BookOpen,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export type ThermodynamicCycle = "carnot" | "otto" | "diesel" | "stirling";
export type WorkingGas = "monatomic" | "diatomic" | "polyatomic";

export const GAS_CONSTANTS: Record<WorkingGas, { name: string; gamma: number; label: string }> = {
  monatomic: { name: "Monatomic (He/Ar)", gamma: 1.667, label: "γ = 1.67 (Helium/Argon)" },
  diatomic: { name: "Diatomic (Air/N₂/O₂)", gamma: 1.400, label: "γ = 1.40 (Air/Nitrogen)" },
  polyatomic: { name: "Polyatomic (CO₂)", gamma: 1.333, label: "γ = 1.33 (Carbon Dioxide)" },
};

export default function ThermodynamicsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/thermodynamics",
    "physics",
    "simulation"
  );
  const { challenge, validateChallenge } = useDailyChallenge("physics/thermodynamics");

  // ── Engine Cycle State ────────────────────────────────────────────────
  const [cycleType, setCycleType] = useState<ThermodynamicCycle>("carnot");
  const [tempHotK, setTempHotK] = useState<number>(750); // 400 to 1200 K
  const [tempColdK, setTempColdK] = useState<number>(300); // 200 to 450 K
  const [compressionRatio, setCompressionRatio] = useState<number>(9.0); // 4 to 20
  const [workingGas, setWorkingGas] = useState<WorkingGas>("diatomic");
  const [rpmSpeed, setRpmSpeed] = useState<number>(45); // RPM
  const [manualStroke, setManualStroke] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "presets" | "theory">("controls");

  // ── 60 FPS Animation Timer ─────────────────────────────────────────────
  useEffect(() => {
    let animId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000));
      last = now;

      if (isPlaying && manualStroke === null) {
        setSimTime((p) => p + dt);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, manualStroke]);

  // ── Physics Calculations ──────────────────────────────────────────────
  const gamma = GAS_CONSTANTS[workingGas].gamma;
  const cyclePeriod = 60 / Math.max(1, rpmSpeed);
  const cycleTime = manualStroke !== null ? (manualStroke + 0.5) * (cyclePeriod / 4) : simTime % cyclePeriod;
  const cycleFrac = cycleTime / cyclePeriod; // 0.0 to 1.0
  const currentStroke = Math.floor(cycleFrac * 4) % 4; // 0, 1, 2, 3
  const strokeFrac = (cycleFrac * 4) % 1; // 0.0 to 1.0

  // Precision Slider-Crank Kinematics
  const crankAngle = cycleFrac * Math.PI * 4; // Radians
  const crankRadius = 36;
  const rodLength = 95;
  const crankY = crankRadius * Math.cos(crankAngle);
  const rodAngle = Math.asin((crankRadius * Math.sin(crankAngle)) / rodLength);
  const pistonDisplacement = crankRadius - crankY + (rodLength - rodLength * Math.cos(rodAngle));

  const minPistonY = cycleType === "diesel" ? 42 : cycleType === "otto" ? 52 : 62;
  const maxStrokeTravel = cycleType === "diesel" ? 100 : 90;
  const pistonY = minPistonY + (pistonDisplacement / (2 * crankRadius)) * maxStrokeTravel;

  // Real-time Physics Properties
  const currentPhysics = useMemo(() => {
    const vMin = 1.0;
    const vMax = vMin * compressionRatio;
    const vNorm = (pistonY - minPistonY) / maxStrokeTravel;
    const currentV_L = vMin + vNorm * (vMax - vMin);

    let currentT_K = tempColdK;
    let strokeTitle = "";
    let strokeDetail = "";
    let strokeColor = "#38bdf8";

    if (cycleType === "carnot") {
      if (currentStroke === 0) {
        currentT_K = tempHotK;
        strokeTitle = "1. Isothermal Expansion (Qin at TH)";
        strokeDetail = "Cylinder absorbs thermal heat Qin from TH hot reservoir at constant temperature.";
        strokeColor = "#f97316";
      } else if (currentStroke === 1) {
        currentT_K = tempHotK - strokeFrac * (tempHotK - tempColdK);
        strokeTitle = "2. Adiabatic Expansion (Work Out)";
        strokeDetail = "Thermally isolated cylinder expands adiabatically, gas cools TH → TC doing boundary work.";
        strokeColor = "#eab308";
      } else if (currentStroke === 2) {
        currentT_K = tempColdK;
        strokeTitle = "3. Isothermal Compression (Qout at TC)";
        strokeDetail = "Piston compresses gas while contacting TC cold sink, rejecting heat Qout.";
        strokeColor = "#38bdf8";
      } else {
        currentT_K = tempColdK + strokeFrac * (tempHotK - tempColdK);
        strokeTitle = "4. Adiabatic Compression (Work In)";
        strokeDetail = "Thermally isolated cylinder compresses adiabatically, warming gas back to TH.";
        strokeColor = "#a855f7";
      }
    } else if (cycleType === "otto") {
      if (currentStroke === 0) {
        currentT_K = tempColdK + strokeFrac * (tempColdK * Math.pow(compressionRatio, gamma - 1) - tempColdK);
        strokeTitle = "1. Adiabatic Compression Stroke";
        strokeDetail = "Both poppet valves sealed. Piston compresses fuel-air mixture to clearance volume.";
        strokeColor = "#a855f7";
      } else if (currentStroke === 1) {
        currentT_K = tempHotK;
        strokeTitle = "2. Spark Ignition & Isochoric Combustion";
        strokeDetail = "⚡ Spark plug discharges electric arc at TDC. Instantaneous constant-volume heat release (Qin).";
        strokeColor = "#ef4444";
      } else if (currentStroke === 2) {
        currentT_K = tempHotK - strokeFrac * (tempHotK - tempHotK / Math.pow(compressionRatio, gamma - 1));
        strokeTitle = "3. Power Expansion Stroke";
        strokeDetail = "Superheated high-pressure combustion gas expands adiabatically, driving flywheel.";
        strokeColor = "#f97316";
      } else {
        currentT_K = tempColdK;
        strokeTitle = "4. Exhaust Blowdown & Heat Release";
        strokeDetail = "Exhaust poppet valve opens. Hot burnt combustion gas exhausts to atmosphere (Qout).";
        strokeColor = "#38bdf8";
      }
    } else if (cycleType === "diesel") {
      if (currentStroke === 0) {
        currentT_K = tempColdK + strokeFrac * (tempColdK * Math.pow(compressionRatio, gamma - 1) - tempColdK);
        strokeTitle = "1. High-Compression Air Stroke";
        strokeDetail = "Pure air is compressed at extreme ratio r=18, heating above diesel auto-ignition threshold.";
        strokeColor = "#a855f7";
      } else if (currentStroke === 1) {
        currentT_K = tempHotK;
        strokeTitle = "2. Fuel Injection & Constant-Pressure Burn";
        strokeDetail = "💉 Injector sprays aerosol diesel mist. Fuel auto-ignites isobarically at constant peak pressure.";
        strokeColor = "#f59e0b";
      } else if (currentStroke === 2) {
        currentT_K = tempHotK - strokeFrac * (tempHotK - tempColdK * 1.5);
        strokeTitle = "3. Power Expansion Stroke";
        strokeDetail = "High-torque expansion forces piston down, transferring heavy mechanical work to crankshaft.";
        strokeColor = "#f97316";
      } else {
        currentT_K = tempColdK;
        strokeTitle = "4. Exhaust Release & Scavenging";
        strokeDetail = "Exhaust valve vents remaining waste gas to ambient cold sink (Qout).";
        strokeColor = "#38bdf8";
      }
    } else {
      // Stirling
      if (currentStroke === 0) {
        currentT_K = tempHotK;
        strokeTitle = "1. Isothermal Expansion (Hot Cylinder)";
        strokeDetail = "Working gas expands isothermally in contact with hot heat source wall.";
        strokeColor = "#f97316";
      } else if (currentStroke === 1) {
        currentT_K = tempHotK - strokeFrac * (tempHotK - tempColdK);
        strokeTitle = "2. Isochoric Regenerator Heat Transfer";
        strokeDetail = "Gas shuttles across wire mesh regenerator matrix, depositing internal heat into matrix.";
        strokeColor = "#eab308";
      } else if (currentStroke === 2) {
        currentT_K = tempColdK;
        strokeTitle = "3. Isothermal Compression (Cold Cylinder)";
        strokeDetail = "Piston compresses cooled working gas at constant cold sink temperature TC.";
        strokeColor = "#38bdf8";
      } else {
        currentT_K = tempColdK + strokeFrac * (tempHotK - tempColdK);
        strokeTitle = "4. Isochoric Regenerator Pre-Heating";
        strokeDetail = "Gas shuttles back through regenerator matrix, reclaiming stored thermal energy.";
        strokeColor = "#a855f7";
      }
    }

    const currentP_kPa = Math.max(10, (1.0 * 8.314 * currentT_K) / (currentV_L * 0.001 * 1000));

    // Efficiencies
    const carnotMax = (1 - tempColdK / tempHotK) * 100;
    let eff = carnotMax;
    if (cycleType === "otto") {
      eff = (1 - 1 / Math.pow(compressionRatio, gamma - 1)) * 100;
    } else if (cycleType === "diesel") {
      const rc = 2.0;
      const term = (Math.pow(rc, gamma) - 1) / (gamma * (rc - 1));
      eff = (1 - (1 / Math.pow(compressionRatio, gamma - 1)) * term) * 100;
    } else if (cycleType === "stirling") {
      eff = carnotMax * 0.88;
    }

    const heatIn = 1.0 * 8.314 * tempHotK * Math.log(2.2);
    const work = heatIn * (eff / 100);

    return {
      currentV_L,
      currentP_kPa,
      currentT_K,
      strokeTitle,
      strokeDetail,
      strokeColor,
      efficiencyPercent: eff,
      carnotMaxEfficiency: carnotMax,
      netWorkJoules: work,
      heatInJoules: heatIn,
    };
  }, [
    cycleType,
    currentStroke,
    strokeFrac,
    tempHotK,
    tempColdK,
    compressionRatio,
    gamma,
    pistonY,
    minPistonY,
    maxStrokeTravel,
  ]);

  // AI Sync
  useEffect(() => {
    setExperimentData({
      title: "Thermodynamic Heat Engines & Carnot Cycle Studio",
      theory: "First and Second Laws of Thermodynamics: Net work W = Qin - Qout. Carnot limit is η_max = 1 - (TC / TH).",
      extraContext: {
        cycleType,
        efficiency: `${currentPhysics.efficiencyPercent.toFixed(1)}%`,
        carnotLimit: `${currentPhysics.carnotMaxEfficiency.toFixed(1)}%`,
        activeStroke: currentPhysics.strokeTitle,
        tempHotK: `${tempHotK} K`,
        tempColdK: `${tempColdK} K`,
      },
    });
  }, [cycleType, currentPhysics, tempHotK, tempColdK, setExperimentData]);

  // Dynamic Gas Kinetic Molecules
  const molecules = useMemo(() => {
    const isHot = currentPhysics.currentT_K > (tempHotK + tempColdK) / 2;
    const count = 36;
    return Array.from({ length: count }).map((_, i) => {
      const seed = (i * 97) % 100;
      const x = 55 + (seed / 100) * 100;
      const yMin = pistonY + 18;
      const yMax = 195;
      const y = yMin + ((i * 37) % 100 / 100) * (yMax - yMin);
      return { x, y, isHot };
    });
  }, [pistonY, currentPhysics.currentT_K, tempHotK, tempColdK]);

  // ── P-V Diagram Coordinates Calculation ────────────────────────────────
  const pvPlot = useMemo(() => {
    const vMin = 1.0;
    const vMax = vMin * compressionRatio;
    const pMax = 1200;
    const pMin = 40;

    const padL = 50;
    const padR = 25;
    const padT = 20;
    const padB = 30;
    const w = 550;
    const h = 160;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const vToX = (v: number) => padL + ((v - vMin) / (vMax - vMin || 1)) * plotW;
    const pToY = (p: number) => padT + plotH - ((p - pMin) / (pMax - pMin || 1)) * plotH;

    let pts: Array<{ v: number; p: number; label: string }> = [];

    if (cycleType === "carnot") {
      pts = [
        { v: vMin, p: 950, label: "1 (TH Start)" },
        { v: vMin * 1.8, p: 550, label: "2 (Adiabat Start)" },
        { v: vMax, p: 130, label: "3 (TC Start)" },
        { v: vMin * 2.2, p: 240, label: "4 (Adiabat Comp)" },
      ];
    } else if (cycleType === "otto") {
      pts = [
        { v: vMin, p: 1050, label: "3 (Spark Peak)" },
        { v: vMax, p: 280, label: "4 (Blowdown)" },
        { v: vMax, p: 90, label: "1 (Intake BDC)" },
        { v: vMin, p: 400, label: "2 (Compression TDC)" },
      ];
    } else if (cycleType === "diesel") {
      pts = [
        { v: vMin, p: 1100, label: "2 (Injection Start)" },
        { v: vMin * 2.2, p: 1100, label: "3 (Injection End)" },
        { v: vMax, p: 240, label: "4 (Exhaust Release)" },
        { v: vMax, p: 80, label: "1 (Intake BDC)" },
      ];
    } else {
      pts = [
        { v: vMin, p: 900, label: "1 (TH Exp)" },
        { v: vMax, p: 420, label: "2 (Regen Cool)" },
        { v: vMax, p: 160, label: "3 (TC Comp)" },
        { v: vMin, p: 340, label: "4 (Regen Heat)" },
      ];
    }

    const pathD = `M ${vToX(pts[0].v)} ${pToY(pts[0].p)} ` +
      pts.slice(1).map((pt) => `L ${vToX(pt.v)} ${pToY(pt.p)}`).join(" ") + " Z";

    const curX = vToX(currentPhysics.currentV_L);
    const curY = pToY(currentPhysics.currentP_kPa);

    return { w, h, padL, padR, padT, padB, plotW, plotH, pts, pathD, curX, curY, pMax, pMin, vMin, vMax };
  }, [cycleType, compressionRatio, currentPhysics]);

  // Presets
  const presets = [
    {
      title: "1. Carnot Ideal Cycle (750 K → 300 K)",
      desc: "Maximum theoretical reversible heat engine (2 Isotherms + 2 Adiabats).",
      action: () => {
        setCycleType("carnot");
        setTempHotK(750);
        setTempColdK(300);
        setRpmSpeed(45);
      },
    },
    {
      title: "2. Formula 1 High-RPM Otto Engine",
      desc: "4-Stroke spark-ignition with mechanical poppet valves and spark plug.",
      action: () => {
        setCycleType("otto");
        setCompressionRatio(12);
        setTempHotK(950);
        setTempColdK(320);
        setRpmSpeed(120);
      },
    },
    {
      title: "3. Heavy Marine Diesel Engine",
      desc: "High compression ratio r = 18 with diesel fuel injector and auto-ignition.",
      action: () => {
        setCycleType("diesel");
        setCompressionRatio(18);
        setTempHotK(1100);
        setTempColdK(310);
        setRpmSpeed(60);
      },
    },
    {
      title: "4. Closed-Cycle Stirling Engine",
      desc: "Regenerative closed cycle with wire mesh regenerator matrix heat storage.",
      action: () => {
        setCycleType("stirling");
        setTempHotK(550);
        setTempColdK(220);
        setRpmSpeed(50);
      },
    },
  ];

  // Kinematic Wrist & Crank coordinates for SVG
  const wristPinX = 105;
  const wristPinY = pistonY + 11;
  const flywheelCenterX = 275;
  const flywheelCenterY = 105;
  const crankPinX = flywheelCenterX + Math.sin(crankAngle) * crankRadius;
  const crankPinY = flywheelCenterY - Math.cos(crankAngle) * crankRadius;

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-4">
      {/* ── Executive Header ───────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Flame size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Thermodynamic Heat Engines &amp; Carnot Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              η = 1 - (Tc/Th) | W = ∮ P dV
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ultra-sharp interactive mechanical engine, slider-crank kinematics, spark ignition, diesel injection, and P-V indicator loops.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setManualStroke(null);
              setIsPlaying(!isPlaying);
            }}
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
              setSimTime(0);
              setManualStroke(null);
              setTempHotK(750);
              setTempColdK(300);
            }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* ── Apparatus Mode Selector (4 Engine Cycles) ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "carnot", label: "1. Carnot Ideal Cycle", subtitle: "Reversible Limit (Diathermal Base)" },
          { id: "otto", label: "2. Otto 4-Stroke Cycle", subtitle: "Spark Plug & Poppet Valves" },
          { id: "diesel", label: "3. Diesel Engine Cycle", subtitle: "High-Pressure Fuel Injector" },
          { id: "stirling", label: "4. Stirling Engine", subtitle: "Wire Mesh Regenerator Matrix" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setCycleType(item.id as ThermodynamicCycle);
              setManualStroke(null);
              completeExperiment();
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
              cycleType === item.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-xs font-black">{item.label}</span>
            <span className="text-[10px] opacity-80 font-mono">{item.subtitle}</span>
          </button>
        ))}
      </div>

      {/* ── Interactive 4-Stroke Timeline Ribbon ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((strokeIdx) => {
          const isActive = currentStroke === strokeIdx;
          const strokeNames =
            cycleType === "otto"
              ? ["1. Compression", "2. Spark Combustion", "3. Power Stroke", "4. Exhaust"]
              : cycleType === "diesel"
              ? ["1. Air Compression", "2. Fuel Injection", "3. Power Stroke", "4. Exhaust"]
              : cycleType === "carnot"
              ? ["1. Isothermal (TH)", "2. Adiabatic Exp", "3. Isothermal (TC)", "4. Adiabatic Comp"]
              : ["1. Isothermal Exp", "2. Regen Cooling", "3. Isothermal Comp", "4. Regen Heating"];

          return (
            <button
              key={strokeIdx}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setManualStroke(strokeIdx);
              }}
              className={`p-2.5 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between ${
                isActive
                  ? "bg-amber-500/15 border-amber-500 text-amber-400 font-black shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xs font-bold font-mono">{strokeNames[strokeIdx]}</span>
              {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* ── Main Studio Split View (7 cols Visual Stage / 5 cols Controls Deck) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Razor-Sharp Vector Mechanical Stage + Vector Indicator Diagram */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Engine Workbench (Ultra-Crisp Vector SVG) */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Flame size={14} /> {cycleType.toUpperCase()} MECHANICAL CHAMBER
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                {currentPhysics.strokeTitle}
              </span>
            </div>

            {/* High-Definition Scalable Vector Graphics Simulation */}
            <div className="w-full bg-[#080d1a] rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center p-2">
              <svg
                viewBox="0 0 400 270"
                className="w-full h-auto max-h-[300px] select-none touch-none"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                <defs>
                  {/* Gas thermal atmospheric glow */}
                  <linearGradient id="gasHeatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={currentPhysics.currentT_K > 500 ? "#ea580c" : "#0284c7"}
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="100%"
                      stopColor={currentPhysics.currentT_K > 500 ? "#ef4444" : "#2563eb"}
                      stopOpacity="0.75"
                    />
                  </linearGradient>

                  {/* Piston metallic chrome gradient */}
                  <linearGradient id="pistonGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>

                  {/* Bronze connecting rod */}
                  <linearGradient id="rodGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>

                  {/* Flywheel rim */}
                  <radialGradient id="flywheelGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="#0f172a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                  </radialGradient>
                </defs>

                {/* Subtle Matrix Grid in Background */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line
                    key={`gx_${i}`}
                    x1={i * 24}
                    y1={0}
                    x2={i * 24}
                    y2={270}
                    stroke="rgba(56, 189, 248, 0.04)"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={`gy_${i}`}
                    x1={0}
                    y1={i * 24}
                    x2={400}
                    y2={i * 24}
                    stroke="rgba(56, 189, 248, 0.04)"
                    strokeWidth="1"
                  />
                ))}

                {/* ── 1. DYNAMIC THERMAL GAS CHAMBER ── */}
                <rect
                  x="48"
                  y={pistonY + 14}
                  width="114"
                  height={Math.max(10, 200 - (pistonY + 14))}
                  fill="url(#gasHeatGrad)"
                  rx="2"
                />

                {/* Kinetic Gas Molecules */}
                {molecules.map((m, idx) => (
                  <circle
                    key={`mol_${idx}`}
                    cx={m.x}
                    cy={m.y}
                    r="2.8"
                    fill={m.isHot ? "#fde047" : "#38bdf8"}
                    opacity="0.85"
                  />
                ))}

                {/* ── 2. CYLINDER HOUSING & TRANSPARENT GLASS TUBE ── */}
                <rect
                  x="45"
                  y="36"
                  width="120"
                  height="164"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="4"
                  rx="4"
                />

                {/* Mounting Flanges */}
                <rect x="38" y="32" width="7" height="12" fill="#cbd5e1" rx="2" />
                <rect x="165" y="32" width="7" height="12" fill="#cbd5e1" rx="2" />
                <rect x="38" y="190" width="7" height="12" fill="#cbd5e1" rx="2" />
                <rect x="165" y="190" width="7" height="12" fill="#cbd5e1" rx="2" />

                {/* ── 3. MODE-SPECIFIC CYLINDER HEAD ── */}

                {/* OTTO: Spark Plug + Poppet Valves */}
                {cycleType === "otto" && (
                  <g>
                    {/* Intake Valve */}
                    <rect
                      x="64"
                      y={currentStroke === 3 ? "30" : "22"}
                      width="18"
                      height="10"
                      fill={currentStroke === 3 ? "#38bdf8" : "#475569"}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      rx="2"
                    />
                    <line x1="73" y1="8" x2="73" y2="30" stroke="#94a3b8" strokeWidth="3.5" />

                    {/* Exhaust Valve */}
                    <rect
                      x="128"
                      y={currentStroke === 3 ? "30" : "22"}
                      width="18"
                      height="10"
                      fill={currentStroke === 3 ? "#f97316" : "#475569"}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      rx="2"
                    />
                    <line x1="137" y1="8" x2="137" y2="30" stroke="#94a3b8" strokeWidth="3.5" />

                    {/* Center Spark Plug */}
                    <rect x="99" y="6" width="12" height="24" fill="#f8fafc" rx="2" />
                    <rect x="102" y="30" width="6" height="6" fill="#f59e0b" />

                    {/* Spark Flash on Stroke 1 */}
                    {currentStroke === 1 && (
                      <g>
                        <circle cx="105" cy="38" r="18" fill="#fde047" opacity="0.85" />
                        <circle cx="105" cy="38" r="8" fill="#ef4444" />
                        <text
                          x="105"
                          y="18"
                          fill="#ef4444"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          ⚡ SPARK IGNITION
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* DIESEL: High Pressure Injector */}
                {cycleType === "diesel" && (
                  <g>
                    <polygon points="96,6 114,6 108,34 102,34" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                    {currentStroke === 1 && (
                      <g>
                        <polygon points="105,34 75,85 135,85" fill="rgba(251, 191, 36, 0.8)" />
                        <text
                          x="105"
                          y="18"
                          fill="#fbbf24"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          💉 DIESEL INJECTION (Qin)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* CARNOT: Ideal Diathermal Cylinder */}
                {cycleType === "carnot" && (
                  <g>
                    <text
                      x="105"
                      y="24"
                      fill="#38bdf8"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      IDEAL DIATHERMAL CYLINDER
                    </text>
                    {(currentStroke === 1 || currentStroke === 3) && (
                      <g>
                        <rect x="52" y="196" width="106" height="10" fill="#334155" stroke="#64748b" strokeWidth="1.5" rx="3" />
                        <text
                          x="105"
                          y="204"
                          fill="#ffffff"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          ADIABATIC INSULATOR BASE
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* STIRLING: Regenerator Matrix */}
                {cycleType === "stirling" && (
                  <g>
                    <rect
                      x="52"
                      y="18"
                      width="106"
                      height="16"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      rx="3"
                    />
                    <text
                      x="105"
                      y="29"
                      fill="#eab308"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      REGENERATOR MATRIX MESH
                    </text>
                  </g>
                )}

                {/* ── 4. MACHINED PISTON HEAD ── */}
                <rect
                  x="48"
                  y={pistonY}
                  width="114"
                  height="20"
                  fill="url(#pistonGrad)"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  rx="4"
                />
                {/* Piston Seal Rings */}
                <line x1="48" y1={pistonY + 5} x2="162" y2={pistonY + 5} stroke="#334155" strokeWidth="2" />
                <line x1="48" y1={pistonY + 12} x2="162" y2={pistonY + 12} stroke="#334155" strokeWidth="2" />
                {/* Wrist Pin Bearing */}
                <circle cx={wristPinX} cy={wristPinY} r="4.5" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />

                {/* ── 5. CONNECTING ROD & FLYWHEEL KINEMATICS ── */}
                {/* Connecting Rod */}
                <line
                  x1={wristPinX}
                  y1={wristPinY}
                  x2={crankPinX}
                  y2={crankPinY}
                  stroke="url(#rodGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Heavy Rotating Flywheel */}
                <circle
                  cx={flywheelCenterX}
                  cy={flywheelCenterY}
                  r={crankRadius + 20}
                  fill="url(#flywheelGrad)"
                  stroke="#38bdf8"
                  strokeWidth="5"
                />

                {/* Flywheel Spokes */}
                {[0, 1, 2, 3].map((s) => {
                  const spkAngle = crankAngle + (s * Math.PI) / 2;
                  return (
                    <line
                      key={`spk_${s}`}
                      x1={flywheelCenterX}
                      y1={flywheelCenterY}
                      x2={flywheelCenterX + Math.sin(spkAngle) * (crankRadius + 18)}
                      y2={flywheelCenterY - Math.cos(spkAngle) * (crankRadius + 18)}
                      stroke="#64748b"
                      strokeWidth="3"
                    />
                  );
                })}

                {/* Flywheel Hub & Pin Bearings */}
                <circle cx={flywheelCenterX} cy={flywheelCenterY} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={crankPinX} cy={crankPinY} r="5" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />

                {/* ── 6. THERMAL HEAT RESERVOIRS AT BASE ── */}
                {/* Hot Source (TH) */}
                <rect
                  x="42"
                  y="210"
                  width="60"
                  height="45"
                  fill={currentStroke === 0 ? "#ea580c" : "#7c2d12"}
                  stroke="#f97316"
                  strokeWidth={currentStroke === 0 ? 2.5 : 1}
                  rx="8"
                />
                <text x="72" y="228" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  HOT (TH)
                </text>
                <text x="72" y="244" fill="#ffffff" fontSize="10" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                  {tempHotK} K
                </text>

                {/* Cold Sink (TC) */}
                <rect
                  x="108"
                  y="210"
                  width="60"
                  height="45"
                  fill={currentStroke === 2 ? "#0284c7" : "#0c4a6e"}
                  stroke="#38bdf8"
                  strokeWidth={currentStroke === 2 ? 2.5 : 1}
                  rx="8"
                />
                <text x="138" y="228" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  COLD (TC)
                </text>
                <text x="138" y="244" fill="#ffffff" fontSize="10" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                  {tempColdK} K
                </text>

                {/* Mechanical Telemetry Overlay */}
                <text x="235" y="22" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  FLYWHEEL: {rpmSpeed} RPM
                </text>
                <text x="235" y="38" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  P = {currentPhysics.currentP_kPa.toFixed(0)} kPa
                </text>
                <text x="235" y="54" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  T = {currentPhysics.currentT_K.toFixed(0)} K
                </text>
              </svg>
            </div>

            {/* Stroke Explanation Callout */}
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center gap-2 text-xs">
              <Info size={14} className="text-primary shrink-0" />
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {currentPhysics.strokeDetail}
              </p>
            </div>
          </div>

          {/* Synchronized Razor-Sharp Vector P-V Indicator Diagram */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity size={14} className="text-sky-400" />
                {cycleType.toUpperCase()} P-V INDICATOR LOOP
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                P = {currentPhysics.currentP_kPa.toFixed(0)} kPa | V = {currentPhysics.currentV_L.toFixed(1)} L
              </span>
            </div>

            <div className="w-full bg-[#050811] rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center p-2">
              <svg
                viewBox={`0 0 ${pvPlot.w} ${pvPlot.h}`}
                className="w-full h-auto max-h-[160px] select-none"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                {/* Grid division lines */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line
                    key={`pv_gx_${i}`}
                    x1={pvPlot.padL + (i / 6) * pvPlot.plotW}
                    y1={pvPlot.padT}
                    x2={pvPlot.padL + (i / 6) * pvPlot.plotW}
                    y2={pvPlot.padT + pvPlot.plotH}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={`pv_gy_${i}`}
                    x1={pvPlot.padL}
                    y1={pvPlot.padT + (i / 4) * pvPlot.plotH}
                    x2={pvPlot.padL + pvPlot.plotW}
                    y2={pvPlot.padT + (i / 4) * pvPlot.plotH}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                ))}

                {/* Shaded Work Loop Area */}
                <path
                  d={pvPlot.pathD}
                  fill={
                    cycleType === "diesel"
                      ? "rgba(245, 158, 11, 0.25)"
                      : cycleType === "otto"
                      ? "rgba(239, 68, 68, 0.25)"
                      : "rgba(56, 189, 248, 0.25)"
                  }
                  stroke={cycleType === "diesel" ? "#f59e0b" : cycleType === "otto" ? "#ef4444" : "#38bdf8"}
                  strokeWidth="2.5"
                />

                {/* Corner Point Markers */}
                {pvPlot.pts.map((pt, i) => {
                  const px = pvPlot.padL + ((pt.v - pvPlot.vMin) / (pvPlot.vMax - pvPlot.vMin || 1)) * pvPlot.plotW;
                  const py = pvPlot.padT + pvPlot.plotH - ((pt.p - pvPlot.pMin) / (pvPlot.pMax - pvPlot.pMin || 1)) * pvPlot.plotH;
                  return (
                    <g key={`pt_${i}`}>
                      <circle cx={px} cy={py} r="4.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
                      <text x={px + 6} y={py - 3} fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {i + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Real-time State Tracer Dot */}
                <circle cx={pvPlot.curX} cy={pvPlot.curY} r="6.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />

                {/* Axis Labels */}
                <text x={pvPlot.padL - 6} y={pvPlot.padT + 8} fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                  {pvPlot.pMax} kPa
                </text>
                <text x={pvPlot.padL - 6} y={pvPlot.padT + pvPlot.plotH / 2} fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                  P
                </text>
                <text x={pvPlot.padL - 6} y={pvPlot.padT + pvPlot.plotH} fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                  {pvPlot.pMin} kPa
                </text>
                <text x={pvPlot.padL + pvPlot.plotW / 2} y={pvPlot.padT + pvPlot.plotH + 18} fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  Volume V [L] (Enclosed Loop Area = Work Wnet = {currentPhysics.netWorkJoules.toFixed(0)} J)
                </text>
              </svg>
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

            {/* ── TAB 1: DYNAMIC CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4 text-xs">
                {/* Temperatures TH and TC */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-amber-500">Hot Temp (TH):</span>
                      <span className="font-black text-amber-500">{tempHotK} K</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="1200"
                      step="25"
                      value={tempHotK}
                      onChange={(e) => setTempHotK(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-sky-400">Cold Temp (TC):</span>
                      <span className="font-black text-sky-400">{tempColdK} K</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="450"
                      step="10"
                      value={tempColdK}
                      onChange={(e) => setTempColdK(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                  </div>
                </div>

                {/* Compression Ratio */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Compression Ratio (r):</span>
                    <span className="font-black text-primary">{compressionRatio.toFixed(1)}:1</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="22"
                    step="0.5"
                    value={compressionRatio}
                    onChange={(e) => setCompressionRatio(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Working Gas */}
                <div className="space-y-1.5">
                  <span className="font-bold text-foreground block">Gas Molecule Mixture:</span>
                  <div className="flex gap-1.5">
                    {(["monatomic", "diatomic", "polyatomic"] as WorkingGas[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setWorkingGas(g)}
                        className={`flex-1 py-1.5 rounded-xl font-bold uppercase text-[10px] border cursor-pointer ${
                          workingGas === g
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        {g} (γ={GAS_CONSTANTS[g].gamma.toFixed(2)})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine RPM */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Engine Speed:</span>
                    <span className="font-black text-emerald-400">{rpmSpeed} RPM</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="5"
                    value={rpmSpeed}
                    onChange={(e) => setRpmSpeed(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
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
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-primary block">Carnot&apos;s Theorem</span>
                  <p className="text-muted-foreground text-[11px]">
                    η_carnot = 1 - (TC / TH). Maximum theoretical reversible limit for any heat engine operating between TH and TC.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-amber-500 block">Otto vs. Diesel vs. Stirling</span>
                  <p className="text-muted-foreground text-[11px]">
                    <strong>Otto:</strong> Spark ignition (constant volume combustion).<br />
                    <strong>Diesel:</strong> Fuel spray auto-ignition (constant pressure combustion).<br />
                    <strong>Stirling:</strong> Closed external combustion with internal regenerator heat storage.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── 4 Telemetry Readout Cards (Bottom of Right Column) ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Thermal Efficiency</span>
              <span className="text-base font-black text-emerald-400 font-mono block">
                {currentPhysics.efficiencyPercent.toFixed(1)}%
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Carnot Limit (ηmax)</span>
              <span className="text-base font-black text-primary font-mono block">
                {currentPhysics.carnotMaxEfficiency.toFixed(1)}%
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Net Work Output</span>
              <span className="text-base font-black text-sky-400 font-mono block">
                {currentPhysics.netWorkJoules.toFixed(0)} J
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Heat Input (Qin)</span>
              <span className="text-base font-black text-amber-500 font-mono block">
                {currentPhysics.heatInJoules.toFixed(0)} J
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Daily Challenge Card */}
      <DailyChallengeCard
        labId="physics/thermodynamics"
        currentParams={{
          cyclesCompleted: Math.floor(simTime / (60 / rpmSpeed)),
          efficiencyMeasured: currentPhysics.efficiencyPercent,
          workOutput: currentPhysics.netWorkJoules,
        }}
      />
    </div>
  );
}
