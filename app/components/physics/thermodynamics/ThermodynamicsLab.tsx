"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import ParticlePhysicsEngine, { Particle } from "@/app/components/shared/ParticlePhysicsEngine";
import GraphPlotter, { PlotSeries } from "@/app/components/shared/GraphPlotter";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Flame,
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
  Gauge,
  Snowflake,
  BookOpen,
  FastForward,
  Activity,
} from "lucide-react";

export type ThermodynamicCycleType = "carnot" | "otto" | "diesel";

export default function ThermodynamicsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/thermodynamics",
    "physics",
    "simulation"
  );

  // Engine Cycle Selector
  const [cycleType, setCycleType] = useState<ThermodynamicCycleType>("carnot");

  // Reservoir Temperatures
  const [tempHotK, setTempHotK] = useState<number>(600); // 400K to 900K
  const [tempColdK, setTempColdK] = useState<number>(300); // 200K to 400K
  const [compressionRatio, setCompressionRatio] = useState<number>(8); // For Otto/Diesel

  // Diagram View: P-V vs T-S
  const [diagramMode, setDiagramMode] = useState<"pv" | "ts">("pv");

  // 4-Stroke Cycle State: 0 to 3
  const [cycleStroke, setCycleStroke] = useState<number>(0);
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [flywheelAngle, setFlywheelAngle] = useState<number>(0);

  // Indicator trace histories
  const [traceHistory, setTraceHistory] = useState<{ x: number; y: number }[]>([]);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Efficiency Calculations
  const efficiency = useMemo(() => {
    if (cycleType === "carnot") {
      return Math.max(0, 1 - tempColdK / tempHotK);
    } else if (cycleType === "otto") {
      const gamma = 1.4; // Air diatomic
      return 1 - 1 / Math.pow(compressionRatio, gamma - 1);
    } else {
      // Diesel (cutoff ratio rc = 2)
      const gamma = 1.4;
      const rc = 2.0;
      const term = (Math.pow(rc, gamma) - 1) / (gamma * (rc - 1));
      return 1 - (1 / Math.pow(compressionRatio, gamma - 1)) * term;
    }
  }, [cycleType, tempColdK, tempHotK, compressionRatio]);

  // Stroke Descriptions
  const strokeNames = useMemo(() => {
    if (cycleType === "carnot") {
      return [
        "1. Isothermal Expansion (TH Heat Absorption Qin)",
        "2. Adiabatic Expansion (Gas Cools TH -> TC, Work Out)",
        "3. Isothermal Compression (TC Heat Rejection Qout)",
        "4. Adiabatic Compression (Gas Warms TC -> TH)",
      ];
    } else if (cycleType === "otto") {
      return [
        "1. Adiabatic Compression (Piston Compresses Mixture)",
        "2. Isochoric Combustion (Constant Volume Spark Ignition)",
        "3. Adiabatic Power Stroke (High Pressure Expansion)",
        "4. Isochoric Heat Rejection (Exhaust Valve Blowdown)",
      ];
    } else {
      return [
        "1. Adiabatic Compression (High Compression Ratio)",
        "2. Isobaric Fuel Injection (Constant Pressure Combustion)",
        "3. Adiabatic Expansion (Power Stroke)",
        "4. Isochoric Heat Rejection (Exhaust Release)",
      ];
    }
  }, [cycleType]);

  // Piston Height & Gas Volume
  const pistonHeight = useMemo(() => {
    if (cycleStroke === 0) return 60 + cycleProgress * 65;
    if (cycleStroke === 1) return 125 + cycleProgress * 55;
    if (cycleStroke === 2) return 180 - cycleProgress * 65;
    return 115 - cycleProgress * 55;
  }, [cycleStroke, cycleProgress]);

  const currentVolume = useMemo(() => {
    return Math.max(8, Math.round((pistonHeight / 200) * 45));
  }, [pistonHeight]);

  const currentTemp = useMemo(() => {
    if (cycleStroke === 0) return tempHotK;
    if (cycleStroke === 2) return tempColdK;
    if (cycleStroke === 1) return tempHotK - cycleProgress * (tempHotK - tempColdK);
    return tempColdK + cycleProgress * (tempHotK - tempColdK);
  }, [cycleStroke, cycleProgress, tempHotK, tempColdK]);

  const currentPressure = useMemo(() => {
    return Math.max(1, (currentTemp / (currentVolume * 5.5))).toFixed(2);
  }, [currentTemp, currentVolume]);

  const currentEntropy = useMemo(() => {
    if (cycleStroke === 0) return 20 + cycleProgress * 15;
    if (cycleStroke === 1) return 35; // Adiabatic S constant
    if (cycleStroke === 2) return 35 - cycleProgress * 15;
    return 20; // Adiabatic S constant
  }, [cycleStroke, cycleProgress]);

  // Chamber Particles
  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    const isHot = currentTemp > (tempHotK + tempColdK) / 2;
    const pColor = isHot ? "#fb923c" : "#38bdf8";

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      list.push({
        id: i,
        x: 30 + Math.random() * 500,
        y: pistonHeight + 20 + Math.random() * (300 - pistonHeight - 40),
        vx: Math.cos(angle) * 2.2,
        vy: Math.sin(angle) * 2.2,
        radius: 4.5,
        mass: 1,
        color: pColor,
      });
    }
    return list;
  }, [pistonHeight, currentTemp, tempHotK, tempColdK]);

  // Cycle Stepper Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCycleProgress((prev) => {
          if (prev >= 1) {
            setCycleStroke((s) => (s + 1) % 4);
            return 0;
          }
          return prev + 0.08;
        });

        setFlywheelAngle((prev) => (prev + 0.12) % (Math.PI * 2));

        // Add to live indicator trace history
        setTraceHistory((prev) => {
          const ptX = diagramMode === "pv" ? currentVolume : currentEntropy;
          const ptY = diagramMode === "pv" ? parseFloat(currentPressure) : currentTemp;
          const newPt = { x: ptX, y: ptY };
          if (prev.length > 55) return [...prev.slice(1), newPt];
          return [...prev, newPt];
        });
      }, 65);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentVolume, currentPressure, currentEntropy, currentTemp, diagramMode]);

  // Graph Series
  const diagramSeries: PlotSeries[] = useMemo(() => {
    return [
      {
        id: "thermo-cycle",
        name: diagramMode === "pv" ? "P-V Indicator Loop" : "T-S State Diagram",
        color: "#f59e0b",
        data: traceHistory,
        isAreaFilled: true,
        showPoints: false,
        strokeWidth: 3,
      },
    ];
  }, [traceHistory, diagramMode]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Thermodynamic Heat Engines & Carnot Cycle Studio",
      theory: "Heat engine thermodynamics: Carnot, Otto, and Diesel cycles. Enclosed area on P-V indicator diagram equals net work output (Wnet = ∮ P dV). T-S diagram illustrates entropy transfer during isothermal and isentropic stages.",
      extraContext: { cycleType, tempHotK, tempColdK, efficiency: (efficiency * 100).toFixed(1), stroke: strokeNames[cycleStroke] },
    });
  }, [cycleType, tempHotK, tempColdK, efficiency, cycleStroke, strokeNames, setExperimentData]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Thermodynamic Heat Engines &amp; Carnot Cycle
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Classical Thermodynamics
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Carnot, Otto, and Diesel engine cycles, mechanical flywheel crankshaft, P-V &amp; T-S indicator diagrams, and thermal efficiency limits
            </p>
          </div>
        </div>

        {/* Engine Type Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          {(["carnot", "otto", "diesel"] as ThermodynamicCycleType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setCycleType(type);
                setTraceHistory([]);
                completeExperiment();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                cycleType === type
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type} Cycle
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Engine Cylinder & Flywheel Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Cylinder &amp; Crankshaft Viewport
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-amber-500">
              {strokeNames[cycleStroke]}
            </span>
          </div>

          {/* Engine Cylinder & Rotating Flywheel Canvas */}
          <div className="relative h-[320px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-inner select-none">
            {/* Piston Lid */}
            <div
              style={{ top: `${pistonHeight}px` }}
              className="absolute left-6 right-28 h-7 bg-slate-700 border-2 border-slate-400 rounded-md z-20 flex items-center justify-center shadow-lg transition-all duration-75"
            >
              <span className="text-[10px] font-mono font-black text-slate-200">
                Piston ({currentVolume} L &bull; {currentPressure} atm &bull; {currentTemp.toFixed(0)} K)
              </span>
            </div>

            {/* Particle Chamber Engine */}
            <ParticlePhysicsEngine
              width={460}
              height={320}
              particles={particles}
              pistonY={pistonHeight + 10}
              temperatureFactor={currentTemp / 300}
            />

            {/* Rotating Crankshaft Flywheel at Right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-slate-600 bg-slate-900 shadow-xl flex items-center justify-center">
              <div
                style={{ transform: `rotate(${flywheelAngle}rad)` }}
                className="w-20 h-2 bg-amber-500 rounded-full origin-center shadow-md flex items-center justify-between px-1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Thermal Boundary at Bottom */}
            <div
              className={`absolute bottom-0 inset-x-0 h-6 border-t transition-all duration-300 flex items-center justify-center ${
                currentTemp > (tempHotK + tempColdK) / 2
                  ? "bg-rose-600/40 border-rose-500 text-rose-400"
                  : "bg-blue-600/40 border-blue-500 text-blue-400"
              }`}
            >
              <span className="text-[10px] font-mono font-black uppercase">
                {currentTemp > (tempHotK + tempColdK) / 2
                  ? `Thermal Influx: Qin @ TH (${tempHotK} K)`
                  : `Thermal Rejection: Qout @ TC (${tempColdK} K)`}
              </span>
            </div>
          </div>

          {/* Reservoir Temperature Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Hot Reservoir */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Hot Reservoir (TH):</span>
                <span className="font-black text-rose-500">{tempHotK} K</span>
              </div>
              <input
                type="range"
                min="400"
                max="900"
                step="10"
                value={tempHotK}
                onChange={(e) => setTempHotK(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Cold Reservoir */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Cold Reservoir (TC):</span>
                <span className="font-black text-blue-500">{tempColdK} K</span>
              </div>
              <input
                type="range"
                min="200"
                max="400"
                step="10"
                value={tempColdK}
                onChange={(e) => setTempColdK(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Diagram & Efficiency Metrics (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Thermodynamic State Indicator
              </span>
            </div>

            <div className="flex gap-1 bg-muted p-1 rounded-xl">
              <button
                onClick={() => {
                  setDiagramMode("pv");
                  setTraceHistory([]);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  diagramMode === "pv" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                P-V
              </button>
              <button
                onClick={() => {
                  setDiagramMode("ts");
                  setTraceHistory([]);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  diagramMode === "ts" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                T-S
              </button>
            </div>
          </div>

          {/* Efficiency Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
              <span className="text-[10px] text-primary uppercase font-sans font-bold">Thermal Efficiency (&eta;)</span>
              <span className="text-base font-black text-primary block">
                {(efficiency * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Cycle Classification</span>
              <span className="text-xs font-black text-foreground capitalize block">{cycleType} Engine</span>
            </div>
          </div>

          {/* Live Indicator Plot */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground uppercase">
              <span>{diagramMode === "pv" ? "Live P-V Diagram (Area = Wnet):" : "Live T-S Entropy Diagram:"}</span>
            </div>

            <GraphPlotter
              width={380}
              height={195}
              series={diagramSeries}
              xMin={diagramMode === "pv" ? 5 : 15}
              xMax={diagramMode === "pv" ? 50 : 40}
              yMin={diagramMode === "pv" ? 0 : 200}
              yMax={diagramMode === "pv" ? 18 : 950}
              xLabel={diagramMode === "pv" ? "Volume V (Liters)" : "Entropy S (J/K)"}
              yLabel={diagramMode === "pv" ? "Pressure P (atm)" : "Temperature T (K)"}
            />
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
              <h3 className="text-sm font-bold text-foreground">Why does the Carnot Cycle appear as a perfect rectangle on a Temperature-Entropy (T-S) diagram?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because the cycle consists of two isothermal processes (horizontal lines of constant T) and two reversible adiabatic/isentropic processes (vertical lines of constant S)",
            "Because friction forces entropy to remain constant at all times",
            "Because ideal gases have zero entropy",
            "Because P-V diagrams are always circular",
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
