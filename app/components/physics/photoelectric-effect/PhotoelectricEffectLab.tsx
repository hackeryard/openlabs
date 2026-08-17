"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import GraphPlotter, { PlotSeries } from "@/app/components/shared/GraphPlotter";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Sun,
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
  Zap,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

export interface TargetMetal {
  id: string;
  name: string;
  symbol: string;
  workFunctionEV: number; // Φ (eV)
  thresholdWavelengthNM: number;
  color: string;
}

export const TARGET_METALS: TargetMetal[] = [
  { id: "cs", name: "Cesium", symbol: "Cs", workFunctionEV: 2.14, thresholdWavelengthNM: 579, color: "#e2e8f0" },
  { id: "k", name: "Potassium", symbol: "K", workFunctionEV: 2.30, thresholdWavelengthNM: 539, color: "#cbd5e1" },
  { id: "na", name: "Sodium", symbol: "Na", workFunctionEV: 2.36, thresholdWavelengthNM: 525, color: "#facc15" },
  { id: "zn", name: "Zinc", symbol: "Zn", workFunctionEV: 4.30, thresholdWavelengthNM: 288, color: "#94a3b8" },
  { id: "pt", name: "Platinum", symbol: "Pt", workFunctionEV: 5.65, thresholdWavelengthNM: 219, color: "#64748b" },
];

export default function PhotoelectricEffectLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/photoelectric-effect",
    "physics",
    "simulation"
  );

  const [wavelengthNM, setWavelengthNM] = useState<number>(350); // 200nm to 750nm
  const [intensity, setIntensity] = useState<number>(60); // 10% to 100%
  const [selectedMetalId, setSelectedMetalId] = useState<string>("na");
  const [stoppingVoltage, setStoppingVoltage] = useState<number>(0); // 0V to 5V retarding

  // History trace for K_max vs Frequency graph
  const [tracedPoints, setTracedPoints] = useState<{ x: number; y: number }[]>([]);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const metal = TARGET_METALS.find((m) => m.id === selectedMetalId) || TARGET_METALS[2];

  // Photon Energy E = hc / λ (eV) -> 1240 / λ(nm)
  const photonEnergyEV = useMemo(() => {
    return 1240 / Math.max(1, wavelengthNM);
  }, [wavelengthNM]);

  // Frequency f = c / λ (x10^14 Hz)
  const frequency10_14Hz = useMemo(() => {
    return (300 / Math.max(1, wavelengthNM)) * 10;
  }, [wavelengthNM]);

  // Maximum Kinetic Energy: K_max = E - Φ
  const kMaxEV = useMemo(() => {
    return Math.max(0, photonEnergyEV - metal.workFunctionEV);
  }, [photonEnergyEV, metal.workFunctionEV]);

  // True Stopping Potential: Vs = K_max / e (Volts)
  const theoreticalVs = useMemo(() => {
    return kMaxEV;
  }, [kMaxEV]);

  // Are electrons ejected?
  const isEjectionActive = photonEnergyEV > metal.workFunctionEV;

  // Track points on the live graph
  useEffect(() => {
    setTracedPoints((prev) => {
      const exists = prev.some((p) => Math.abs(p.x - frequency10_14Hz) < 0.2);
      if (!exists && prev.length < 35) {
        return [...prev, { x: frequency10_14Hz, y: kMaxEV }].sort((a, b) => a.x - b.x);
      }
      return prev;
    });
  }, [frequency10_14Hz, kMaxEV]);

  // Graph Series
  const graphSeries: PlotSeries[] = useMemo(() => {
    return [
      {
        id: "kmax-trace",
        name: `K_max vs Frequency (${metal.name})`,
        color: "#38bdf8",
        data: tracedPoints,
        showPoints: true,
        pointRadius: 4,
      },
    ];
  }, [tracedPoints, metal.name]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Photoelectric Effect & Quantum Photons Studio",
      theory: "Einstein's Photoelectric Law (K_max = hν - Φ): Photons below threshold frequency produce zero electron emission regardless of intensity. Retarding stopping potential (Vs = K_max/e) halts photoelectrons.",
      extraContext: { metal: metal.name, wavelengthNM, photonEnergyEV: photonEnergyEV.toFixed(2), kMaxEV: kMaxEV.toFixed(2), stoppingVoltage },
    });
  }, [metal, wavelengthNM, photonEnergyEV, kMaxEV, stoppingVoltage, setExperimentData]);

  // Wavelength to RGB color utility
  const photonColor = useMemo(() => {
    if (wavelengthNM < 380) return "#a855f7"; // UV / violet
    if (wavelengthNM < 450) return "#6366f1";
    if (wavelengthNM < 490) return "#38bdf8";
    if (wavelengthNM < 560) return "#10b981";
    if (wavelengthNM < 590) return "#facc15";
    if (wavelengthNM < 630) return "#f97316";
    return "#ef4444";
  }, [wavelengthNM]);

  // High-Fidelity 60FPS Phototube Canvas Animation
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface ParticleState {
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "photon" | "electron";
      life: number;
    }

    const particles: ParticleState[] = [];

    const render = (now: number) => {
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Vacuum Phototube Glass Envelope
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      const tubeX = 80;
      const tubeY = 40;
      const tubeW = w - 160;
      const tubeH = h - 80;

      // Glass Glow
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(tubeX, tubeY, tubeW, tubeH, 32);
      ctx.stroke();

      // Cathode Plate (Left Metal Target)
      const cathodeX = tubeX + 40;
      ctx.fillStyle = metal.color;
      ctx.fillRect(cathodeX, tubeY + 30, 16, tubeH - 60);

      // Anode Collector Plate (Right)
      const anodeX = tubeX + tubeW - 56;
      ctx.fillStyle = "#64748b";
      ctx.fillRect(anodeX, tubeY + 30, 14, tubeH - 60);

      // Labels
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`Cathode (${metal.symbol})`, cathodeX + 8, tubeY + 20);
      ctx.fillText("Anode Collector", anodeX + 7, tubeY + 20);

      // ─── 1. SPAWN INCOMING PHOTONS ────────────────────────
      if (Math.random() < intensity / 80) {
        particles.push({
          x: tubeX - 30,
          y: tubeY + 50 + Math.random() * (tubeH - 100),
          vx: 5.5,
          vy: (Math.random() - 0.5) * 0.8,
          type: "photon",
          life: 1,
        });
      }

      // ─── 2. UPDATE & RENDER PARTICLES ──────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.type === "photon") {
          p.x += p.vx;
          p.y += p.vy;

          // Draw Photon wave packet
          ctx.strokeStyle = photonColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 12, p.y + Math.sin(p.x * 0.4) * 4);
          ctx.stroke();

          // Photon hits cathode
          if (p.x >= cathodeX) {
            if (isEjectionActive) {
              // Eject Photoelectron with kinetic energy speed
              const electronSpeed = Math.sqrt(kMaxEV) * 3.5;
              particles.push({
                x: cathodeX + 16,
                y: p.y,
                vx: electronSpeed + Math.random() * 0.5,
                vy: (Math.random() - 0.5) * 1.5,
                type: "electron",
                life: 1,
              });
            }
            particles.splice(i, 1);
          }
        } else if (p.type === "electron") {
          // Retarding electric field deceleration from stopping potential
          const retardingAccel = stoppingVoltage * 0.7;
          p.vx -= retardingAccel * 0.16;

          p.x += p.vx;
          p.y += p.vy;

          // Render Electron (Blue glowing dot)
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Electron hits anode or is turned back by stopping potential
          if (p.x >= anodeX || p.vx < -0.5 || p.x < cathodeX || p.y < tubeY || p.y > tubeY + tubeH) {
            particles.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [photonColor, intensity, metal, isEjectionActive, kMaxEV, stoppingVoltage]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
            <Sun size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Photoelectric Effect &amp; Quantum Photons Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Quantum Physics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Monochromatic photon beam frequency sweep, metal cathode work functions, photoelectron ejection, and stopping potential
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Vacuum Phototube Canvas & Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Vacuum Phototube Chamber
              </span>
            </div>

            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isEjectionActive
                ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-500 border-rose-500/30"
            }`}>
              {isEjectionActive ? "Photoelectrons Ejected" : "No Emission (E < Φ)"}
            </span>
          </div>

          {/* Canvas Viewport */}
          <div className="flex justify-center p-2 bg-slate-950 rounded-2xl border border-border/80 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={560}
              height={270}
              className="w-full max-w-[560px] h-[270px]"
            />
          </div>

          {/* Sliders Control Deck */}
          <div className="space-y-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Wavelength Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Light Wavelength (λ):</span>
                <span className="font-black" style={{ color: photonColor }}>
                  {wavelengthNM} nm &bull; E = {photonEnergyEV.toFixed(2)} eV
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="750"
                value={wavelengthNM}
                onChange={(e) => {
                  setWavelengthNM(parseInt(e.target.value, 10));
                  completeExperiment();
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>200nm (UV)</span>
                <span>400nm (Violet)</span>
                <span>550nm (Green)</span>
                <span>750nm (Red)</span>
              </div>
            </div>

            {/* Stopping Voltage & Intensity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
              {/* Retarding Stopping Potential */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-foreground">Stopping Potential (Vs):</span>
                  <span className="font-black text-amber-500">{stoppingVoltage.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.05"
                  value={stoppingVoltage}
                  onChange={(e) => setStoppingVoltage(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Light Intensity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-foreground">Beam Intensity:</span>
                  <span className="font-black text-sky-500">{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Target Metal Selector & K_max vs Frequency Plot (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Target Cathode Metals &amp; K_max Plot
              </span>
            </div>
          </div>

          {/* Metal Selectors */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">
              Select Target Metal (Work Function Φ):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGET_METALS.map((m) => {
                const isSelected = selectedMetalId === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMetalId(m.id);
                      setTracedPoints([]);
                      completeExperiment();
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-primary/20 border-primary ring-2 ring-primary/40 shadow-sm"
                        : "bg-muted/30 hover:bg-accent border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-foreground">{m.symbol}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-500">{m.workFunctionEV} eV</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live K_max vs Frequency Graph */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground uppercase">
              <span>Live K_max vs Frequency (f):</span>
              <span className="text-primary">Slope = h (Planck&apos;s const)</span>
            </div>

            <GraphPlotter
              width={380}
              height={190}
              series={graphSeries}
              xMin={3.0}
              xMax={16.0}
              yMin={0}
              yMax={4.5}
              xLabel="Frequency f (x10¹⁴ Hz)"
              yLabel="K_max (eV)"
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
              <h3 className="text-sm font-bold text-foreground">Why does increasing the light intensity of red light (below threshold frequency) NEVER eject photoelectrons?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Each individual photon delivers energy E = hν; if a single photon's energy is below the work function Φ, electron ejection cannot occur regardless of photon flux",
            "Because red photons are too large to fit into metal lattices",
            "Because higher intensity lowers photon velocity",
            "Because intensity only affects electron mass",
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
