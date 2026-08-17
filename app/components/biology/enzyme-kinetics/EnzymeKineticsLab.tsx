"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import GraphPlotter, { PlotSeries } from "@/app/components/shared/GraphPlotter";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Activity,
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
  FlaskConical,
  Flame,
} from "lucide-react";

export type EnzymeInhibitorType = "none" | "competitive" | "non_competitive" | "uncompetitive";
export type KineticsPlotMode = "michaelis_menten" | "lineweaver_burk" | "eadie_hofstee";

export default function EnzymeKineticsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/enzyme-kinetics",
    "biology",
    "simulation"
  );

  // Substrate Concentration & Inhibitor
  const [substrateConc, setSubstrateConc] = useState<number>(45); // 0 to 100 mM
  const [inhibitorType, setInhibitorType] = useState<EnzymeInhibitorType>("none");
  const [inhibitorConc, setInhibitorConc] = useState<number>(20); // 0 to 60 mM

  // Environmental Parameters
  const [temperatureC, setTemperatureC] = useState<number>(37); // 10°C to 75°C
  const [phLevel, setPhLevel] = useState<number>(7.4); // 2 to 12

  // Plot Mode
  const [plotMode, setPlotMode] = useState<KineticsPlotMode>("michaelis_menten");
  const [curveHistory, setCurveHistory] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Baseline V_max = 85 μmol/min, K_m = 25 mM
  const { effectiveVmax, effectiveKm, isDenatured } = useMemo(() => {
    const denatured = temperatureC > 58 || phLevel < 4 || phLevel > 10.5;

    // Bell curves for temperature and pH
    const tempFactor = Math.max(0, 1 - Math.pow((temperatureC - 37) / 22, 2));
    const phFactor = Math.max(0, 1 - Math.pow((phLevel - 7.4) / 3.4, 2));
    const envMultiplier = denatured ? 0.03 : tempFactor * phFactor;

    let vmax = 85 * envMultiplier;
    let km = 25;

    if (inhibitorType === "competitive") {
      // Competitive: K_m increases, V_max unchanged
      km = 25 * (1 + inhibitorConc / 12);
    } else if (inhibitorType === "non_competitive") {
      // Non-competitive: V_max decreases, K_m unchanged
      vmax = vmax / (1 + inhibitorConc / 15);
    } else if (inhibitorType === "uncompetitive") {
      // Uncompetitive: both V_max and K_m decrease
      const alpha = 1 + inhibitorConc / 18;
      vmax = vmax / alpha;
      km = km / alpha;
    }

    return { effectiveVmax: Math.max(0.1, vmax), effectiveKm: Math.max(0.5, km), isDenatured: denatured };
  }, [temperatureC, phLevel, inhibitorType, inhibitorConc]);

  // Live Velocity: V = (Vmax * [S]) / (Km + [S])
  const currentVelocity = useMemo(() => {
    if (substrateConc <= 0) return 0;
    return (effectiveVmax * substrateConc) / (effectiveKm + substrateConc);
  }, [effectiveVmax, effectiveKm, substrateConc]);

  // Record points along the selected kinetics plot
  useEffect(() => {
    setCurveHistory((prev) => {
      let xVal = substrateConc;
      let yVal = currentVelocity;

      if (plotMode === "michaelis_menten") {
        xVal = substrateConc;
        yVal = currentVelocity;
      } else if (plotMode === "lineweaver_burk") {
        xVal = 1 / Math.max(1, substrateConc);
        yVal = 1 / Math.max(0.2, currentVelocity);
      } else if (plotMode === "eadie_hofstee") {
        xVal = currentVelocity / Math.max(1, substrateConc);
        yVal = currentVelocity;
      }

      const exists = prev.some((p) => Math.abs(p.x - xVal) < (plotMode === "lineweaver_burk" ? 0.005 : 1.2));
      if (!exists && prev.length < 40) {
        return [...prev, { x: xVal, y: yVal }].sort((a, b) => a.x - b.x);
      }
      return prev;
    });
  }, [substrateConc, currentVelocity, plotMode]);

  // Graph Series
  const graphSeries: PlotSeries[] = useMemo(() => {
    const titles = {
      michaelis_menten: "Michaelis-Menten (V vs [S])",
      lineweaver_burk: "Lineweaver-Burk (1/V vs 1/[S])",
      eadie_hofstee: "Eadie-Hofstee (V vs V/[S])",
    };

    return [
      {
        id: "kinetics-series",
        name: titles[plotMode],
        color: "#10b981",
        data: curveHistory,
        showPoints: true,
        pointRadius: 3.5,
        strokeWidth: 2.5,
      },
    ];
  }, [curveHistory, plotMode]);

  // 60FPS Microscopic Induced-Fit & Allosteric Active Site Animation
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface ParticleM {
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "substrate" | "inhibitor" | "product1" | "product2";
    }

    const particles: ParticleM[] = [];

    const render = (now: number) => {
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep dark bio-fluid backdrop
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      const enzymeX = w / 2;
      const enzymeY = h / 2;

      // ─── 1. ENZYME MACROMOLECULE WITH ACTIVE & ALLOSTERIC SITES
      ctx.save();
      ctx.translate(enzymeX, enzymeY);

      if (isDenatured) {
        // Denatured unfolded polypeptide tangle
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
          const ang = (i / 20) * Math.PI * 2;
          const r = 55 + Math.sin(t * 8 + i * 2) * 20;
          const px = Math.cos(ang) * r;
          const py = Math.sin(ang) * (r * 0.4);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DENATURED (CONFORMATION LOST)", 0, 4);
      } else {
        // Functional Globular Enzyme
        const isAllostericOccupied = inhibitorType === "non_competitive";
        const enzymeGrad = ctx.createRadialGradient(-10, -10, 10, 0, 0, 85);
        enzymeGrad.addColorStop(0, "#34d399");
        enzymeGrad.addColorStop(0.6, "#059669");
        enzymeGrad.addColorStop(1, "#064e3b");

        ctx.fillStyle = enzymeGrad;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 16;

        // Globular Body with Catalytic Cleft (Top) and Allosteric Pocket (Bottom)
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0.45, Math.PI * 1.8);
        ctx.lineTo(0, isAllostericOccupied ? -4 : -20); // Deformed cleft if allosteric occupied
        ctx.closePath();
        ctx.fill();

        // Active Site Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CATALYTIC CLEFT", 0, -28);

        // Allosteric Site Label (Bottom)
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 8px sans-serif";
        ctx.fillText("ALLOSTERIC POCKET", 0, 58);
      }
      ctx.restore();

      // ─── 2. SPAWN & COLLIDE SUBSTRATES / INHIBITORS ─────────
      const targetCount = Math.floor(substrateConc / 2.5);
      const speedFactor = Math.sqrt((temperatureC + 273) / 310);

      while (particles.length < targetCount) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * (1.2 + Math.random()) * speedFactor,
          vy: Math.sin(angle) * (1.2 + Math.random()) * speedFactor,
          type: "substrate",
        });
      }

      // Inhibitors
      if (inhibitorType !== "none") {
        const targetInhibitors = Math.floor(inhibitorConc / 3.5);
        const curInh = particles.filter((p) => p.type === "inhibitor").length;
        if (curInh < targetInhibitors) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 2 * speedFactor,
            vy: (Math.random() - 0.5) * 2 * speedFactor,
            type: "inhibitor",
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 10 || p.x > w - 10) p.vx *= -1;
        if (p.y < 10 || p.y > h - 10) p.vy *= -1;

        // Collision with Active Site
        const dist = Math.sqrt(Math.pow(p.x - enzymeX, 2) + Math.pow(p.y - enzymeY, 2));

        if (!isDenatured && dist < 36 && p.type === "substrate" && inhibitorType !== "non_competitive") {
          // Catalytic reaction split into P1 & P2
          p.type = "product1";
          p.vx = (Math.random() - 0.5) * 3;
          p.vy = (Math.random() - 0.5) * 3;

          particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            type: "product2",
          });
        }

        // Draw particle
        ctx.save();
        if (p.type === "substrate") {
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "inhibitor") {
          ctx.fillStyle = "#f59e0b";
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 8;
          ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
        } else {
          ctx.fillStyle = p.type === "product1" ? "#c084fc" : "#a855f7";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [substrateConc, inhibitorType, inhibitorConc, isDenatured, temperatureC]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Enzyme Kinetics & Catalysis Studio",
      theory: "Michaelis-Menten enzyme kinetics: Substrate saturation (V = Vmax[S]/(Km + [S])), competitive vs non-competitive vs uncompetitive inhibition, and Lineweaver-Burk / Eadie-Hofstee transformations. Thermal and pH denaturation disrupt tertiary structure.",
      extraContext: { substrateConc, inhibitorType, inhibitorConc, effectiveVmax: effectiveVmax.toFixed(1), effectiveKm: effectiveKm.toFixed(1), currentVelocity: currentVelocity.toFixed(1), temperatureC, phLevel },
    });
  }, [substrateConc, inhibitorType, inhibitorConc, effectiveVmax, effectiveKm, currentVelocity, temperatureC, phLevel, setExperimentData]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Enzyme Kinetics &amp; Catalysis Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Biochemistry Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Brownian induced-fit substrate binding, allosteric &amp; competitive inhibition, temperature/pH denaturation, and live Michaelis-Menten &amp; Lineweaver-Burk plots
            </p>
          </div>
        </div>

        {/* Plot Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          {(["michaelis_menten", "lineweaver_burk", "eadie_hofstee"] as KineticsPlotMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setPlotMode(mode);
                setCurveHistory([]);
                completeExperiment();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                plotMode === mode
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Active Site Collision Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Enzyme Catalytic Cleft &amp; Induced-Fit Viewport
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-xl font-black">
                Rate V: {currentVelocity.toFixed(1)} &mu;mol/min
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex justify-center p-2 bg-slate-950 rounded-2xl border border-border/80 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={560}
              height={260}
              className="w-full max-w-[560px] h-[260px]"
            />
          </div>

          {/* Substrate & Inhibitor Sliders */}
          <div className="space-y-3 p-4 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Substrate Concentration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Substrate Concentration [S]:</span>
                <span className="font-black text-sky-500">{substrateConc} mM</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={substrateConc}
                onChange={(e) => {
                  setSubstrateConc(parseInt(e.target.value, 10));
                  completeExperiment();
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Inhibitor Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-border/60">
              {[
                { id: "none", label: "No Inhibitor" },
                { id: "competitive", label: "Competitive (Active Site)" },
                { id: "non_competitive", label: "Non-Competitive (Allosteric)" },
                { id: "uncompetitive", label: "Uncompetitive ([ES] Complex)" },
              ].map((inh) => (
                <button
                  key={inh.id}
                  onClick={() => {
                    setInhibitorType(inh.id as EnzymeInhibitorType);
                    setCurveHistory([]);
                    completeExperiment();
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    inhibitorType === inh.id
                      ? "bg-amber-500/20 border-amber-500 text-amber-500 shadow-sm"
                      : "bg-muted/40 hover:bg-accent border-border text-foreground"
                  }`}
                >
                  {inh.label}
                </button>
              ))}
            </div>

            {/* Inhibitor Concentration Slider */}
            {inhibitorType !== "none" && (
              <div className="space-y-1 pt-1 animate-in fade-in">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-amber-500">Inhibitor Concentration [I]:</span>
                  <span className="font-black text-amber-500">{inhibitorConc} mM</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={inhibitorConc}
                  onChange={(e) => setInhibitorConc(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Environmental Controls & Dynamic Kinetics Plot (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Kinetics &amp; Denaturation
              </span>
            </div>
          </div>

          {/* Temperature & pH Environmental Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/20 border border-border/60 rounded-2xl">
            {/* Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">Temp:</span>
                <span className="font-black text-amber-500">{temperatureC}&deg;C</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                value={temperatureC}
                onChange={(e) => {
                  setTemperatureC(parseInt(e.target.value, 10));
                  setCurveHistory([]);
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* pH */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-foreground">pH:</span>
                <span className="font-black text-indigo-500">{phLevel.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.2"
                value={phLevel}
                onChange={(e) => {
                  setPhLevel(parseFloat(e.target.value));
                  setCurveHistory([]);
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Kinetic Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">V_max (Max Velocity)</span>
              <span className="text-sm font-black text-emerald-500 block">{effectiveVmax.toFixed(1)} &mu;mol/min</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">K_m (Affinity Constant)</span>
              <span className="text-sm font-black text-sky-500 block">{effectiveKm.toFixed(1)} mM</span>
            </div>
          </div>

          {/* Live Kinetics Graph */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground uppercase">
              <span>{plotMode.replace("_", " ").toUpperCase()} PLOT:</span>
            </div>

            <GraphPlotter
              width={380}
              height={175}
              series={graphSeries}
              xMin={plotMode === "michaelis_menten" ? 0 : plotMode === "lineweaver_burk" ? 0 : 0}
              xMax={plotMode === "michaelis_menten" ? 100 : plotMode === "lineweaver_burk" ? 0.12 : 4.5}
              yMin={0}
              yMax={plotMode === "michaelis_menten" ? 95 : plotMode === "lineweaver_burk" ? 0.22 : 90}
              xLabel={plotMode === "michaelis_menten" ? "[S] Substrate (mM)" : plotMode === "lineweaver_burk" ? "1 / [S] (mM⁻¹)" : "V / [S] (min⁻¹)"}
              yLabel={plotMode === "michaelis_menten" ? "Velocity V (μmol/min)" : plotMode === "lineweaver_burk" ? "1 / V (min/μmol)" : "Velocity V (μmol/min)"}
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
              <h3 className="text-sm font-bold text-foreground">Why can an uncompetitive inhibitor NOT be out-competed by increasing substrate concentration?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because uncompetitive inhibitors bind exclusively to the enzyme-substrate [ES] complex after substrate binding; higher [S] creates more [ES] targets, locking both Vmax and Km into lower values",
            "Because uncompetitive inhibitors destroy the substrate molecules",
            "Because competitive inhibitors evaporate at 37°C",
            "Because enzymes only bind uncompetitive inhibitors in pure water",
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
