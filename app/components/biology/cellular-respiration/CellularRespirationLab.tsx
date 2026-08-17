"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  BookOpen,
  Activity,
  ShieldAlert,
  Flame,
  Gauge,
} from "lucide-react";

export type MetabolicInhibitor = "none" | "rotenone" | "antimycin" | "cyanide" | "oligomycin" | "dnp_uncoupler";

export default function CellularRespirationLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "biology/cellular-respiration",
    "biology",
    "simulation"
  );

  // Substrate Influx & Oxygen Control
  const [glucoseInput, setGlucoseInput] = useState<number>(85); // 10% to 100%
  const [isAerobic, setIsAerobic] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Metabolic Poison / Inhibitor
  const [inhibitor, setInhibitor] = useState<MetabolicInhibitor>("none");

  // Proton & ATP Metrics
  const [atpProducedCount, setAtpProducedCount] = useState<number>(0);
  const [rotorAngle, setRotorAngle] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Complex Inhibition Status
  const isComplexIBlocked = inhibitor === "rotenone";
  const isComplexIIIBlocked = inhibitor === "antimycin";
  const isComplexIVBlocked = inhibitor === "cyanide" || !isAerobic;
  const isSynthaseBlocked = inhibitor === "oligomycin";
  const isUncoupled = inhibitor === "dnp_uncoupler";

  // Is Electron Transport active?
  const isETCActive = isPlaying && !isComplexIBlocked && !isComplexIIIBlocked && !isComplexIVBlocked;

  // Proton Motive Force (Δp in mV = ΔΨ - 59ΔpH)
  const protonMotiveForceMV = useMemo(() => {
    if (isUncoupled) return 25; // Dissipated by DNP
    if (!isETCActive) return 40;
    return Math.round((glucoseInput / 100) * 180 + (isSynthaseBlocked ? 35 : 0));
  }, [isUncoupled, isETCActive, glucoseInput, isSynthaseBlocked]);

  // ATP Production Rate (nmol/min)
  const atpProductionRate = useMemo(() => {
    if (isSynthaseBlocked || isUncoupled || !isAerobic) return 2; // Basal substrate-level phosphorylation only
    if (!isETCActive) return 4;
    return Math.round((glucoseInput / 100) * 32);
  }, [isSynthaseBlocked, isUncoupled, isAerobic, isETCActive, glucoseInput]);

  // Oxygen Consumption Rate
  const oxygenConsumptionRate = useMemo(() => {
    if (!isAerobic || isComplexIVBlocked || isComplexIBlocked || isComplexIIIBlocked) return 0;
    if (isUncoupled) return 100; // Maximum uncoupled respiration!
    if (isSynthaseBlocked) return 15; // Respiratory control back-pressure
    return Math.round((glucoseInput / 100) * 80);
  }, [isAerobic, isComplexIVBlocked, isComplexIBlocked, isComplexIIIBlocked, isUncoupled, isSynthaseBlocked, glucoseInput]);

  // 60FPS High-Fidelity Cristae Membrane & Rotary Turbine Animation
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Proton {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    const protons: Proton[] = [];
    for (let i = 0; i < 45; i++) {
      protons.push({
        x: 30 + Math.random() * (canvas.width - 60),
        y: Math.random() < 0.75 ? 25 + Math.random() * 95 : 205 + Math.random() * 75,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });
    }

    const render = (now: number) => {
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep dark mitochondrial matrix backdrop
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      // Inner Mitochondrial Membrane (Bilayer across middle)
      const memY = 140;
      const memH = 40;

      // Intermembrane Space (Top, High H+ Gradient)
      ctx.fillStyle = "rgba(59, 130, 246, 0.09)";
      ctx.fillRect(0, 0, w, memY);

      // Mitochondrial Matrix (Bottom, Low H+)
      ctx.fillStyle = "rgba(16, 185, 129, 0.05)";
      ctx.fillRect(0, memY + memH, w, h - (memY + memH));

      // Lipid Bilayer Membrane Body
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, memY, w, memH);

      // Hydrophobic tail hatch pattern
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1.5;
      for (let x = 10; x < w; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, memY + 4);
        ctx.lineTo(x + 4, memY + memH - 4);
        ctx.stroke();
      }

      // ─── 1. ETC COMPLEXES (I, II, III, IV) ─────────────────
      const complexes = [
        { id: "I", name: "Complex I\n(NADH-Q)", x: 80, w: 50, blocked: isComplexIBlocked, pumps: true },
        { id: "II", name: "Complex II\n(Succinate)", x: 155, w: 45, blocked: false, pumps: false },
        { id: "III", name: "Complex III\n(Cyt bc₁)", x: 225, w: 52, blocked: isComplexIIIBlocked, pumps: true },
        { id: "IV", name: "Complex IV\n(Cyt c Ox)", x: 305, w: 50, blocked: isComplexIVBlocked, pumps: true },
      ];

      complexes.forEach((c) => {
        ctx.save();
        ctx.fillStyle = c.blocked ? "#b91c1c" : isETCActive ? "#4f46e5" : "#475569";
        ctx.shadowColor = c.blocked ? "#ef4444" : isETCActive ? "#6366f1" : "transparent";
        ctx.shadowBlur = isETCActive ? 12 : 0;

        ctx.beginPath();
        ctx.roundRect(c.x, memY - 12, c.w, memH + 24, 10);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        const lines = c.name.split("\n");
        ctx.fillText(lines[0], c.x + c.w / 2, memY + memH / 2 - 2);
        ctx.fillText(lines[1], c.x + c.w / 2, memY + memH / 2 + 10);

        // Proton pumping arrow if active
        if (isETCActive && c.pumps) {
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(c.x + c.w / 2, memY + memH + 8);
          ctx.lineTo(c.x + c.w / 2, memY - 18);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Mobile Carriers: Ubiquinone (Q) & Cytochrome c
      if (isETCActive) {
        // Coenzyme Q in membrane
        const qX = 140 + Math.sin(t * 5) * 45;
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(qX, memY + memH / 2, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.font = "bold 7px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Q", qX, memY + memH / 2);

        // Cytochrome c in Intermembrane Space
        const cytX = 275 + Math.sin(t * 6) * 35;
        ctx.fillStyle = "#ec4899";
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cytX, memY - 18, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 6px sans-serif";
        ctx.fillText("Cyt c", cytX, memY - 18);
      }

      // ─── 2. ROTATING ATP SYNTHASE TURBINE ──────────────────
      const synthaseX = 455;
      ctx.save();
      // F0 Channel in membrane
      ctx.fillStyle = isSynthaseBlocked ? "#e11d48" : "#818cf8";
      ctx.fillRect(synthaseX - 14, memY - 16, 28, memH + 32);

      // F1 Catalytic Head in Matrix
      const headY = memY + memH + 38;
      const spinOmega = isPlaying && !isSynthaseBlocked && !isUncoupled && isETCActive ? t * 5 : 0;

      ctx.translate(synthaseX, headY);
      ctx.rotate(spinOmega);

      // Rotor Blades
      const bladeGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
      bladeGrad.addColorStop(0, "#fbbf24");
      bladeGrad.addColorStop(0.7, "#d97706");
      bladeGrad.addColorStop(1, "#78350f");

      ctx.fillStyle = bladeGrad;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = !isSynthaseBlocked && isETCActive ? 14 : 0;

      for (let b = 0; b < 3; b++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 20, 13, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "black 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ATP SYNTHASE (F₀F₁)", synthaseX, headY + 54);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 8px monospace";
      ctx.fillText("ADP + Pi -> ATP", synthaseX, headY + 66);

      // ─── 3. DNP UNCOUPLER CHANNEL IF ACTIVE ────────────────
      if (isUncoupled) {
        ctx.save();
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 4;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(385, memY - 5, 20, memH + 10);
        ctx.fillStyle = "#ea580c";
        ctx.font = "bold 7px sans-serif";
        ctx.fillText("DNP PORE", 395, memY - 12);
        ctx.restore();
      }

      // ─── 4. PROTON GRADIENT PARTICLES ──────────────────────
      for (let i = 0; i < protons.length; i++) {
        const p = protons[i];
        p.x += p.vx;
        p.y += p.vy;

        // Boundary containment
        if (p.x < 15 || p.x > w - 15) p.vx *= -1;
        if (p.y < 15) p.vy = Math.abs(p.vy);
        if (p.y > h - 25) p.vy = -Math.abs(p.vy);

        // Render H+ sphere
        ctx.save();
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 6px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H⁺", p.x, p.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isAerobic, isPlaying, isETCActive, isComplexIBlocked, isComplexIIIBlocked, isComplexIVBlocked, isSynthaseBlocked, isUncoupled]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Cellular Respiration & Mitochondrial Electron Transport Studio",
      theory: "Chemiosmotic ATP synthesis: Complexes I, III, and IV pump protons into the intermembrane space creating an electrochemical gradient (PMF = ΔΨ - 59ΔpH). Returning proton flow through F0F1 ATP Synthase drives rotary conformational catalysis. Specific poisons illustrate respiratory control mechanisms.",
      extraContext: { glucoseInput, isAerobic, inhibitor, protonMotiveForceMV, atpProductionRate, oxygenConsumptionRate },
    });
  }, [glucoseInput, isAerobic, inhibitor, protonMotiveForceMV, atpProductionRate, oxygenConsumptionRate, setExperimentData]);

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
                Cellular Respiration &amp; Mitochondrial Electron Transport
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Cellular Bioenergetics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Inner cristae membrane complexes I-IV, mobile Q/Cyt c carriers, chemiosmotic proton gradient, rotary ATP Synthase, and metabolic poisons
            </p>
          </div>
        </div>

        {/* Oxygen Availability Toggle */}
        <button
          onClick={() => {
            setIsAerobic(!isAerobic);
            completeExperiment();
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm ${
            isAerobic
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-rose-500/20 border-rose-500 text-rose-500"
          }`}
        >
          <Activity size={14} />
          <span>{isAerobic ? "Aerobic Mode (+O₂ Available)" : "Anaerobic Hypoxia (No O₂)"}</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Inner Mitochondrial Membrane & ATP Synthase Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Inner Mitochondrial Cristae Viewport
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl font-black">
                ATP Rate: {atpProductionRate} ATP / Glucose
              </span>
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

          {/* Glucose Substrate Influx Slider */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="font-bold text-foreground">Glucose Substrate Influx:</span>
              <span className="font-black text-amber-500">{glucoseInput}% Substrate Rate</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={glucoseInput}
              onChange={(e) => setGlucoseInput(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Right: Metabolic Poisons & Bioenergetic Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Bioenergetic Telemetry &amp; Inhibitors
              </span>
            </div>
          </div>

          {/* Bioenergetic Telemetry Gauges */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
              <span className="text-[10px] text-primary uppercase font-sans font-bold">Proton Motive Force (&Delta;p)</span>
              <span className="text-base font-black text-primary block">{protonMotiveForceMV} mV</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">O₂ Consumption Rate</span>
              <span className="text-sm font-black text-foreground block">{oxygenConsumptionRate} nmol/min</span>
            </div>
          </div>

          {/* Metabolic Poisons & Inhibitors Selection */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">
              Apply Metabolic Poison / Inhibitor:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {[
                { id: "none", name: "No Inhibitor (Normal)", desc: "Full 32 ATP yield" },
                { id: "rotenone", name: "Rotenone (Blocks I)", desc: "Inhibits NADH transfer" },
                { id: "antimycin", name: "Antimycin A (Blocks III)", desc: "Stops Cyt bc₁ complex" },
                { id: "cyanide", name: "Cyanide / CO (Blocks IV)", desc: "Blocks O₂ binding" },
                { id: "oligomycin", name: "Oligomycin (Blocks F₀)", desc: "Plugs ATP Synthase" },
                { id: "dnp_uncoupler", name: "DNP Uncoupler", desc: "Dissipates Δp as heat" },
              ].map((inh) => (
                <button
                  key={inh.id}
                  onClick={() => {
                    setInhibitor(inh.id as MetabolicInhibitor);
                    completeExperiment();
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    inhibitor === inh.id
                      ? "bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30 text-rose-400 shadow-sm"
                      : "bg-muted/30 hover:bg-accent border-border text-foreground"
                  }`}
                >
                  <span className="font-bold block truncate">{inh.name}</span>
                  <span className="text-[10px] text-muted-foreground block truncate">{inh.desc}</span>
                </button>
              ))}
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
              <h3 className="text-sm font-bold text-foreground">Why does the chemical uncoupler DNP (2,4-Dinitrophenol) cause rapid oxygen consumption with zero ATP synthesis?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "DNP shuttles protons across the inner membrane, collapsing the proton gradient (PMF) into pure thermal heat and removing respiratory control, so complexes run at maximum speed without driving ATP Synthase",
            "Because DNP destroys all glucose molecules instantly",
            "Because DNP freezes oxygen into liquid form",
            "Because ATP Synthase reverses and consumes all body water",
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
