"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import ParticlePhysicsEngine, { Particle } from "@/app/components/shared/ParticlePhysicsEngine";
import GraphPlotter, { PlotSeries } from "@/app/components/shared/GraphPlotter";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Gauge,
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
  Flame,
  Snowflake,
  BookOpen,
  Scale,
} from "lucide-react";

export default function GasLawsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "chemistry/gas-laws",
    "chemistry",
    "simulation"
  );

  // Chamber State: Temperature T (Kelvin), Piston Height / Volume V, Added Weights (Pressure P)
  const [temperatureK, setTemperatureK] = useState<number>(300); // 100K to 600K
  const [pistonY, setPistonY] = useState<number>(60); // 20px (low volume) to 180px (high volume)
  const [addedWeights, setAddedWeights] = useState<number>(2); // 1 to 5 weights (each adds 0.5 atm)
  const [particleCount, setParticleCount] = useState<number>(60);

  // Simulated speeds extracted from ParticlePhysicsEngine
  const [currentSpeeds, setCurrentSpeeds] = useState<number[]>([]);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Generate initial particle list
  const initialParticles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    const chamberW = 560;
    const chamberH = 340;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;

      list.push({
        id: i,
        x: 40 + Math.random() * (chamberW - 80),
        y: pistonY + 30 + Math.random() * (chamberH - pistonY - 50),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5,
        mass: 1,
        color: "#38bdf8",
      });
    }
    return list;
  }, [particleCount, pistonY]);

  // Compute live thermodynamic parameters
  // Volume V is proportional to height: (340 - pistonY)
  const volumeLiters = useMemo(() => {
    return Math.max(5, Math.round(((340 - pistonY) / 280) * 50));
  }, [pistonY]);

  // Total Pressure P (atm) = Atmospheric (1.0) + Weights * 0.5
  const pressureAtm = useMemo(() => {
    return (1.0 + addedWeights * 0.5).toFixed(2);
  }, [addedWeights]);

  // Compute live Maxwell-Boltzmann Histogram Series from actual simulated particle velocities
  const maxwellSeries: PlotSeries[] = useMemo(() => {
    const bins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const binWidth = 0.8;

    currentSpeeds.forEach((s) => {
      const binIdx = Math.min(bins.length - 1, Math.floor(s / binWidth));
      bins[binIdx]++;
    });

    const data = bins.map((count, idx) => ({
      x: idx * binWidth * 10,
      y: count,
    }));

    return [
      {
        id: "speed-distribution",
        name: "Simulated Particle Speed",
        color: "#f59e0b",
        data,
        isAreaFilled: true,
        showPoints: true,
      },
    ];
  }, [currentSpeeds]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Gas Laws & Maxwell-Boltzmann Kinetic Theory Studio",
      theory: "Ideal gas collisions with chamber walls produce macroscopic pressure (PV = nRT). Elastic collisions between molecules establish a Maxwell-Boltzmann speed distribution scaling with temperature.",
      extraContext: { temperatureK, volumeLiters, pressureAtm, addedWeights },
    });
  }, [temperatureK, volumeLiters, pressureAtm, addedWeights, setExperimentData]);

  // Handle particle update callback
  const handleParticlesUpdate = (pList: Particle[], speeds: number[]) => {
    setCurrentSpeeds(speeds);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm shrink-0">
            <Gauge size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Gas Laws &amp; Maxwell-Boltzmann Kinetic Theory
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                Thermodynamics &amp; Kinetics
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Elastic particle collisions, draggable piston volume, thermal bath velocity scaling, and live Maxwell-Boltzmann distribution curves
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Collision Chamber with Piston & Weights (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Colliding Gas Piston Chamber
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 bg-muted rounded-xl font-bold">
                Pressure: {pressureAtm} atm
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-xl font-black">
                Volume: {volumeLiters} L
              </span>
            </div>
          </div>

          {/* Particle Canvas with Piston Lid & Weight Stack */}
          <div className="relative h-[340px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-inner select-none">
            {/* Draggable Piston Lid */}
            <div
              style={{ top: `${pistonY}px` }}
              className="absolute left-4 right-4 h-7 bg-slate-700 border-2 border-slate-400 rounded-md z-20 flex items-center justify-center shadow-lg transition-all duration-100"
            >
              {/* Stacked Weights on Piston */}
              <div className="absolute -top-7 flex items-center gap-1">
                {Array.from({ length: addedWeights }).map((_, wIdx) => (
                  <div
                    key={wIdx}
                    className="w-9 h-6 bg-amber-600 border border-amber-400 rounded-md flex items-center justify-center font-mono font-black text-[9px] text-white shadow-sm"
                  >
                    0.5kg
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono font-black text-slate-200">
                Piston Lid ({volumeLiters} L)
              </span>
            </div>

            {/* Particle Engine */}
            <ParticlePhysicsEngine
              width={560}
              height={340}
              particles={initialParticles}
              pistonY={pistonY + 12}
              temperatureFactor={Math.sqrt(temperatureK / 300)}
              onParticlesUpdate={handleParticlesUpdate}
            />

            {/* Thermal Bath Base at Bottom */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-blue-600 via-amber-500 to-rose-600 opacity-60 pointer-events-none" />
          </div>

          {/* Interactive Piston & Weight Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Piston Height Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Piston Position (Volume):</span>
                <span className="font-black text-sky-500">{volumeLiters} L</span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                value={pistonY}
                onChange={(e) => {
                  setPistonY(parseInt(e.target.value, 10));
                  completeExperiment();
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Added Weights */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Added Weights Stack:</span>
                <span className="font-black text-amber-500">{addedWeights} Weights ({pressureAtm} atm)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddedWeights(Math.max(1, addedWeights - 1))}
                  disabled={addedWeights <= 1}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  - Remove
                </button>
                <button
                  onClick={() => setAddedWeights(Math.min(5, addedWeights + 1))}
                  disabled={addedWeights >= 5}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  + Add Weight
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Thermal Bath & Live Maxwell-Boltzmann Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Thermal Bath &amp; Maxwell-Boltzmann Curve
              </span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2">
                {temperatureK > 350 ? (
                  <Flame size={16} className="text-rose-500 animate-pulse" />
                ) : (
                  <Snowflake size={16} className="text-blue-500" />
                )}
                <span className="font-bold text-foreground">Thermal Bath Temperature:</span>
              </div>
              <span className="text-sm font-black text-amber-500">{temperatureK} K ({temperatureK - 273}°C)</span>
            </div>

            <input
              type="range"
              min="100"
              max="600"
              step="10"
              value={temperatureK}
              onChange={(e) => {
                setTemperatureK(parseInt(e.target.value, 10));
                completeExperiment();
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-0.5">
              <span>100 K (Cryogenic)</span>
              <span>300 K (Room Temp)</span>
              <span>600 K (High Thermal)</span>
            </div>
          </div>

          {/* Live Maxwell-Boltzmann Plot */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
              Live Particle Velocity Distribution (f(v) vs Speed):
            </span>

            <GraphPlotter
              width={380}
              height={200}
              series={maxwellSeries}
              xMin={0}
              xMax={80}
              yMin={0}
              yMax={25}
              xLabel="Molecular Speed (v)"
              yLabel="Particle Count"
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
              <h3 className="text-sm font-bold text-foreground">According to Boyle's Law, what happens to gas pressure when volume is halved at constant temperature?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Pressure doubles because molecules collide with the chamber walls twice as frequently in the reduced space",
            "Pressure is halved",
            "Pressure remains exactly constant",
            "Molecules stop moving",
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
