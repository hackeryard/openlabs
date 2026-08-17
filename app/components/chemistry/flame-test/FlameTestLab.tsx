"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Zap,
  BookOpen,
  Atom,
} from "lucide-react";

export interface MetalSalt {
  id: string;
  name: string;
  ion: string;
  flameColor: string;
  flameHex: string;
  emissionLines: { wavelength: number; color: string; intensity: number }[];
  groundLevel: number;
  excitedLevel: number;
}

export const METAL_SALTS: MetalSalt[] = [
  {
    id: "na",
    name: "Sodium Chloride",
    ion: "Na⁺",
    flameColor: "Intense Bright Yellow / Orange",
    flameHex: "#f59e0b",
    emissionLines: [
      { wavelength: 589.0, color: "#facc15", intensity: 1.0 },
      { wavelength: 589.6, color: "#eab308", intensity: 0.9 },
    ],
    groundLevel: 1,
    excitedLevel: 3,
  },
  {
    id: "k",
    name: "Potassium Chloride",
    ion: "K⁺",
    flameColor: "Lilac / Violet",
    flameHex: "#c084fc",
    emissionLines: [
      { wavelength: 404.4, color: "#a855f7", intensity: 0.7 },
      { wavelength: 766.5, color: "#be123c", intensity: 0.9 },
    ],
    groundLevel: 1,
    excitedLevel: 4,
  },
  {
    id: "cu",
    name: "Copper(II) Chloride",
    ion: "Cu²⁺",
    flameColor: "Vibrant Blue-Green / Emerald",
    flameHex: "#10b981",
    emissionLines: [
      { wavelength: 510.5, color: "#10b981", intensity: 0.95 },
      { wavelength: 521.8, color: "#34d399", intensity: 0.8 },
      { wavelength: 578.2, color: "#fbbf24", intensity: 0.6 },
    ],
    groundLevel: 2,
    excitedLevel: 4,
  },
  {
    id: "sr",
    name: "Strontium Chloride",
    ion: "Sr²⁺",
    flameColor: "Crimson / Deep Red",
    flameHex: "#ef4444",
    emissionLines: [
      { wavelength: 660.0, color: "#dc2626", intensity: 1.0 },
      { wavelength: 680.0, color: "#b91c1c", intensity: 0.8 },
      { wavelength: 460.7, color: "#38bdf8", intensity: 0.5 },
    ],
    groundLevel: 1,
    excitedLevel: 3,
  },
  {
    id: "ba",
    name: "Barium Chloride",
    ion: "Ba²⁺",
    flameColor: "Apple Green / Pale Chartreuse",
    flameHex: "#84cc16",
    emissionLines: [
      { wavelength: 524.2, color: "#84cc16", intensity: 0.9 },
      { wavelength: 513.7, color: "#4ade80", intensity: 0.75 },
    ],
    groundLevel: 1,
    excitedLevel: 4,
  },
  {
    id: "li",
    name: "Lithium Chloride",
    ion: "Li⁺",
    flameColor: "Carmine Magenta / Hot Pink",
    flameHex: "#ec4899",
    emissionLines: [
      { wavelength: 670.8, color: "#e11d48", intensity: 1.0 },
      { wavelength: 610.4, color: "#f97316", intensity: 0.6 },
    ],
    groundLevel: 1,
    excitedLevel: 2,
  },
  {
    id: "ca",
    name: "Calcium Chloride",
    ion: "Ca²⁺",
    flameColor: "Brick Red / Orange-Red",
    flameHex: "#f97316",
    emissionLines: [
      { wavelength: 622.0, color: "#ea580c", intensity: 0.85 },
      { wavelength: 422.7, color: "#60a5fa", intensity: 0.6 },
    ],
    groundLevel: 1,
    excitedLevel: 3,
  },
];

export default function FlameTestLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "chemistry/flame-test",
    "chemistry",
    "simulation"
  );

  // Bunsen Air Collar (0 = closed/luminous yellow, 100 = open/oxidizing non-luminous blue)
  const [airIntake, setAirIntake] = useState<number>(85);
  const [activeSalt, setActiveSalt] = useState<MetalSalt | null>(null);
  const [isWireInFlame, setIsWireInFlame] = useState<boolean>(false);

  // Bohr Shell Excitation State
  const [electronState, setElectronState] = useState<"ground" | "excited" | "relaxing">("ground");
  const [emittedPhotons, setEmittedPhotons] = useState<{ id: number; color: string; x: number; y: number }[]>([]);

  // Time ticker
  const [time, setTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // AI Chat Registration
  useEffect(() => {
    setExperimentData({
      title: "Flame Test & Atomic Emission Spectrometry Studio",
      theory: "Thermal excitation of valence electrons in metal cations promotes them to higher energy orbitals. Spontaneous relaxation releases discrete photons (E = hc/λ) matching element-specific spectrographic emission lines.",
      extraContext: { activeSalt: activeSalt?.name, airIntake, isWireInFlame },
    });
  }, [activeSalt, airIntake, isWireInFlame, setExperimentData]);

  // Animation Loop for Flame Particle Physics
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (now: number) => {
      const t = (now - start) / 1000;
      setTime(t);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep dark lab backdrop
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      // Bunsen Burner Base & Barrel
      const burnerX = w * 0.4;
      const burnerBaseY = h - 30;
      const burnerTopY = h - 140;

      // Cast Base
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(burnerX - 45, burnerBaseY, 90, 20, 4);
      ctx.fill();

      // Metal Barrel
      const barrelGrad = ctx.createLinearGradient(burnerX - 14, 0, burnerX + 14, 0);
      barrelGrad.addColorStop(0, "#475569");
      barrelGrad.addColorStop(0.5, "#94a3b8");
      barrelGrad.addColorStop(1, "#334155");
      ctx.fillStyle = barrelGrad;
      ctx.fillRect(burnerX - 14, burnerTopY, 28, burnerBaseY - burnerTopY);

      // Air Collar
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(burnerX - 16, burnerBaseY - 35, 32, 18);
      // Air Hole Gap
      const holeW = (airIntake / 100) * 16;
      ctx.fillStyle = "#020617";
      ctx.fillRect(burnerX - holeW / 2, burnerBaseY - 32, holeW, 12);

      // ─── 1. FLAME RENDERING ────────────────────────────────
      // Base flame color based on air intake (Blue oxidizing vs Yellow luminous)
      const isOxidizing = airIntake > 40;
      const baseFlameColor = isOxidizing ? "#38bdf8" : "#fbbf24";
      const flameCoreColor = isOxidizing ? "#60a5fa" : "#fef08a";

      // Metal excitation override if wire is in flame
      const activeColor = isWireInFlame && activeSalt ? activeSalt.flameHex : baseFlameColor;

      ctx.save();
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = isWireInFlame ? 35 : 18;

      // Procedural oscillating flame shapes
      for (let f = 0; f < 3; f++) {
        const flameHeight = 110 + Math.sin(t * 12 + f) * 14;
        const flameWidth = 26 + Math.cos(t * 8 + f) * 6;

        ctx.fillStyle = f === 2 ? flameCoreColor : activeColor;
        ctx.globalAlpha = f === 2 ? 0.9 : 0.75;

        ctx.beginPath();
        ctx.moveTo(burnerX - flameWidth, burnerTopY);
        ctx.quadraticCurveTo(
          burnerX - flameWidth * 1.3 + Math.sin(t * 10) * 8,
          burnerTopY - flameHeight * 0.6,
          burnerX + Math.sin(t * 14) * 6,
          burnerTopY - flameHeight
        );
        ctx.quadraticCurveTo(
          burnerX + flameWidth * 1.3 - Math.sin(t * 10) * 8,
          burnerTopY - flameHeight * 0.6,
          burnerX + flameWidth,
          burnerTopY
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // ─── 2. NICHROME WIRE & LOOP ───────────────────────────
      const wireX = isWireInFlame ? burnerX + 8 : burnerX + 130;
      const wireY = isWireInFlame ? burnerTopY - 50 : burnerTopY + 20;

      ctx.save();
      // Handle
      ctx.fillStyle = "#78350f";
      ctx.fillRect(wireX + 70, wireY - 6, 80, 12);

      // Metallic Stem
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wireX + 70, wireY);
      ctx.lineTo(wireX, wireY);
      ctx.stroke();

      // Wire Loop
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wireX - 8, wireY, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Salt deposit on loop
      if (activeSalt) {
        ctx.fillStyle = isWireInFlame ? activeSalt.flameHex : "#ffffff";
        ctx.beginPath();
        ctx.arc(wireX - 8, wireY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [airIntake, activeSalt, isWireInFlame]);

  // Handle Dipping Nichrome Wire into Flame
  const handleDipWire = (salt: MetalSalt) => {
    setActiveSalt(salt);
    setIsWireInFlame(true);
    setElectronState("excited");

    // Trigger photon emissions
    const photons = salt.emissionLines.map((line, idx) => ({
      id: Date.now() + idx,
      color: line.color,
      x: 240,
      y: 120,
    }));
    setEmittedPhotons(photons);

    setTimeout(() => {
      setElectronState("relaxing");
    }, 900);

    completeExperiment();
  };

  const handleWithdrawWire = () => {
    setIsWireInFlame(false);
    setElectronState("ground");
    setEmittedPhotons([]);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Flame Test &amp; Atomic Emission Spectrometry
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Analytical Chemistry
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Bunsen air collar combustion, metal cation electron shell excitation, photon emission, and discrete spectroscope lines
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Bunsen Burner & Wire Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Bunsen Burner Combustion Viewport
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isWireInFlame ? (
                <button
                  onClick={handleWithdrawWire}
                  className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Withdraw Wire
                </button>
              ) : (
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  Select a metal salt tray below to test
                </span>
              )}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex justify-center p-2 bg-slate-950 rounded-2xl border border-border/80 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={560}
              height={300}
              className="w-full max-w-[560px] h-[300px]"
            />
          </div>

          {/* Air Intake Collar Slider Control */}
          <div className="p-4 bg-muted/30 rounded-2xl border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">Bunsen Burner Air Collar:</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {airIntake > 50 ? "Open: Non-luminous hot blue flame" : "Closed: Luminous sooty yellow flame"}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-1/2">
              <span className="font-mono font-bold text-[10px] text-muted-foreground">0%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={airIntake}
                onChange={(e) => setAirIntake(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="font-mono font-bold text-[10px] text-muted-foreground">100%</span>
            </div>
          </div>

          {/* Metal Salt Selection Tray */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block font-mono">
              Metal Salt Reagent Tray (Click to Dip Nichrome Wire):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {METAL_SALTS.map((salt) => {
                const isActive = activeSalt?.id === salt.id && isWireInFlame;

                return (
                  <button
                    key={salt.id}
                    onClick={() => handleDipWire(salt)}
                    style={{ borderColor: isActive ? salt.flameHex : undefined }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? "bg-muted/60 ring-2 shadow-md"
                        : "bg-muted/30 hover:bg-accent border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-foreground">{salt.ion}</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                        style={{ backgroundColor: salt.flameHex }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium mt-1 truncate">
                      {salt.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Bohr Shell Model & Emission Spectroscope (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Atom size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Atomic Energy Levels &amp; Spectroscope
              </span>
            </div>
          </div>

          {/* Bohr Shell Transition Visualizer */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
              Bohr Orbit Electron Jump &amp; Relaxation:
            </span>

            <div className="flex justify-center py-2">
              <svg width="220" height="150" viewBox="0 0 220 150">
                {/* Nucleus */}
                <circle cx="110" cy="75" r="10" fill="#ef4444" />
                <text x="110" y="78" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                  {activeSalt ? activeSalt.ion : "+"}
                </text>

                {/* Energy Shells n=1, 2, 3, 4 */}
                {[26, 44, 62].map((rad, idx) => (
                  <circle
                    key={idx}
                    cx="110"
                    cy="75"
                    r={rad}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Transitioning Electron */}
                {(() => {
                  const orbitR =
                    electronState === "excited"
                      ? 62
                      : electronState === "relaxing"
                      ? 44
                      : 26;
                  const col = activeSalt ? activeSalt.flameHex : "#38bdf8";

                  return (
                    <circle
                      cx={110 + orbitR}
                      cy={75}
                      r="5"
                      fill={col}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      className="transition-all duration-500 shadow-md"
                    />
                  );
                })()}

                {/* Photon Wave Packet */}
                {electronState === "relaxing" && activeSalt && (
                  <path
                    d="M 154 75 Q 165 65 175 75 T 195 75"
                    fill="none"
                    stroke={activeSalt.flameHex}
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>

            <div className="text-center font-mono text-xs">
              <span className="text-muted-foreground">State: </span>
              <span className="font-bold text-foreground uppercase">
                {electronState === "excited"
                  ? "Thermally Excited (Higher Orbital)"
                  : electronState === "relaxing"
                  ? "Relaxing -> Photon Emitted (E = hc/λ)"
                  : "Ground State"}
              </span>
            </div>
          </div>

          {/* Optical Emission Spectroscope Viewport */}
          <div className="p-4 bg-slate-950 border border-border/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                Discrete Spectroscope Emission Pattern:
              </span>
              <span className="text-[10px] font-mono text-slate-400">400nm &mdash; 700nm</span>
            </div>

            {/* Spectroscope Bar */}
            <div className="relative h-12 bg-black rounded-xl border border-slate-700 overflow-hidden">
              {/* Reference Continuous Faint Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-emerald-900/30 to-red-900/30 opacity-40 pointer-events-none" />

              {/* Element Spectral Lines */}
              {isWireInFlame &&
                activeSalt?.emissionLines.map((line, idx) => {
                  const leftPercent = ((line.wavelength - 380) / (750 - 380)) * 100;

                  return (
                    <div
                      key={idx}
                      style={{
                        left: `${leftPercent}%`,
                        backgroundColor: line.color,
                        boxShadow: `0 0 8px ${line.color}`,
                        opacity: line.intensity,
                      }}
                      className="absolute top-0 bottom-0 w-1 transition-all duration-300"
                    />
                  );
                })}
            </div>

            {/* Line Wavelength Labels */}
            {isWireInFlame && activeSalt ? (
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-300">
                {activeSalt.emissionLines.map((line, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                    {line.wavelength.toFixed(1)} nm
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-slate-500 block text-center">
                Awaiting sample in flame...
              </span>
            )}
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
              <h3 className="text-sm font-bold text-foreground">Why do different metal cations produce distinct flame colors and spectral lines?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Each element has unique quantized electron energy levels, emitting photons of specific frequencies (E = hν) upon relaxation",
            "Because different metals burn at different temperatures",
            "Because sodium contains yellow pigment molecules",
            "Because atmospheric nitrogen reflects metal ions differently",
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
