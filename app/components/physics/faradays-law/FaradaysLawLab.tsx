"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import VectorFieldRenderer, { FieldSource } from "@/app/components/shared/VectorFieldRenderer";
import CircuitFlowRenderer, { CircuitPath } from "@/app/components/shared/CircuitFlowRenderer";
import GraphPlotter, { PlotSeries } from "@/app/components/shared/GraphPlotter";
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
  Gauge,
  BookOpen,
  Magnet,
  Activity,
} from "lucide-react";

export default function FaradaysLawLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/faradays-law",
    "physics",
    "simulation"
  );

  // Mode: "linear_magnet" (Free Drag) vs "ac_dynamo" (Rotating Magnet AC Generator)
  const [labMode, setLabMode] = useState<"linear_magnet" | "ac_dynamo">("linear_magnet");

  // Linear Mode State
  const [magnetX, setMagnetX] = useState<number>(140);
  const [magnetPolarity, setMagnetPolarity] = useState<"N-S" | "S-N">("N-S");
  const [coilTurns, setCoilTurns] = useState<number>(3); // 1 to 4 turns
  const [coilRadius, setCoilRadius] = useState<number>(45); // Area A
  const [loadDevice, setLoadDevice] = useState<"galvanometer" | "lightbulb">("lightbulb");

  // AC Dynamo Generator State
  const [rotationSpeedRPM, setRotationSpeedRPM] = useState<number>(60);
  const [dynamoAngle, setDynamoAngle] = useState<number>(0);
  const [isDynamoRunning, setIsDynamoRunning] = useState<boolean>(true);

  // Dynamic Oscilloscope EMF History
  const [oscilloscopeHistory, setOscilloscopeHistory] = useState<{ x: number; y: number }[]>([]);

  // Drag tracking for velocity / dPhi/dt
  const isDraggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(140);
  const lastTimeRef = useRef<number>(performance.now());
  const [inducedEMF, setInducedEMF] = useState<number>(0);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const coilCenterX = 380;
  const coilCenterY = 175;

  // Pointer drag events for Linear Magnet
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || labMode !== "linear_magnet") return;
    const now = performance.now();
    const dt = Math.max(0.016, (now - lastTimeRef.current) / 1000);
    const dx = e.clientX - lastXRef.current;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;

    // Magnet velocity (px/sec)
    const velocity = dx / dt;

    setMagnetX((prev) => {
      const nextX = Math.max(60, Math.min(520, prev + dx));
      // Flux derivative: dPhi/dt = -N * B * v * (Area / BaseArea)
      const distToCoil = Math.abs(nextX - coilCenterX);
      const proximity = Math.max(0, 1 - distToCoil / 220);
      const polarityFactor = magnetPolarity === "N-S" ? 1 : -1;
      const areaFactor = coilRadius / 45;
      const emf = -coilTurns * (velocity / 90) * proximity * polarityFactor * areaFactor * 2.8;

      const clampedEmf = Math.max(-12, Math.min(12, emf));
      setInducedEMF(clampedEmf);
      return nextX;
    });

    completeExperiment();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setTimeout(() => setInducedEMF(0), 120);
  };

  // AC Dynamo Generator Animation Loop
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastT) / 1000;
      lastT = now;

      if (labMode === "ac_dynamo" && isDynamoRunning) {
        const omega = (rotationSpeedRPM * 2 * Math.PI) / 60;
        setDynamoAngle((prev) => {
          const nextAngle = (prev + omega * dt) % (Math.PI * 2);
          // AC EMF = -N * B * A * omega * sin(omega * t)
          const acEmf = coilTurns * (coilRadius / 45) * (rotationSpeedRPM / 30) * 4.5 * Math.sin(nextAngle);
          setInducedEMF(acEmf);
          return nextAngle;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [labMode, isDynamoRunning, rotationSpeedRPM, coilTurns, coilRadius]);

  // Oscilloscope Trace Recording
  useEffect(() => {
    const interval = setInterval(() => {
      setOscilloscopeHistory((prev) => {
        const nextX = prev.length > 0 ? prev[prev.length - 1].x + 1 : 0;
        const newPt = { x: nextX, y: inducedEMF };
        if (prev.length > 60) return [...prev.slice(1), newPt];
        return [...prev, newPt];
      });
    }, 45);

    return () => clearInterval(interval);
  }, [inducedEMF]);

  // Field Sources for VectorFieldRenderer
  const fieldSources: FieldSource[] = useMemo(() => {
    if (labMode === "linear_magnet") {
      const northX = magnetPolarity === "N-S" ? magnetX + 45 : magnetX - 45;
      const southX = magnetPolarity === "N-S" ? magnetX - 45 : magnetX + 45;
      return [
        { x: northX, y: coilCenterY, strength: 1.4, type: "pole" },
        { x: southX, y: coilCenterY, strength: -1.4, type: "pole" },
      ];
    } else {
      // AC Dynamo rotating dipole around (180, coilCenterY)
      const dynamoCenter = { x: 180, y: coilCenterY };
      const rad = 45;
      const nx = dynamoCenter.x + Math.cos(dynamoAngle) * rad;
      const ny = dynamoCenter.y + Math.sin(dynamoAngle) * rad;
      const sx = dynamoCenter.x - Math.cos(dynamoAngle) * rad;
      const sy = dynamoCenter.y - Math.sin(dynamoAngle) * rad;

      return [
        { x: nx, y: ny, strength: 1.4, type: "pole" },
        { x: sx, y: sy, strength: -1.4, type: "pole" },
      ];
    }
  }, [labMode, magnetX, magnetPolarity, coilCenterY, dynamoAngle]);

  // Circuit Flow Paths around Coil & Lightbulb / Galvanometer
  const circuitPaths: CircuitPath[] = useMemo(() => {
    const speed = inducedEMF !== 0 ? inducedEMF * 0.75 : 0;

    return [
      {
        id: "coil-circuit",
        points: [
          { x: coilCenterX - 45, y: coilCenterY - 60 },
          { x: coilCenterX + 45, y: coilCenterY - 60 },
          { x: coilCenterX + 45, y: 310 },
          { x: 480, y: 310 },
          { x: 480, y: 330 },
          { x: 380, y: 330 },
          { x: 280, y: 330 },
          { x: 280, y: 310 },
          { x: coilCenterX - 45, y: 310 },
          { x: coilCenterX - 45, y: coilCenterY - 60 },
        ],
        wireWidth: 3.5,
        color: "rgba(148, 163, 184, 0.5)",
        particleColor: "#f59e0b",
        particleCount: 16,
        speed,
        particleSize: 4.5,
      },
    ];
  }, [inducedEMF, coilCenterX, coilCenterY]);

  // Oscilloscope Series
  const oscSeries: PlotSeries[] = useMemo(() => {
    return [
      {
        id: "emf-oscilloscope",
        name: "Induced EMF ε(t)",
        color: "#38bdf8",
        data: oscilloscopeHistory,
        showPoints: false,
        strokeWidth: 2.5,
      },
    ];
  }, [oscilloscopeHistory]);

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Electromagnetic Induction & Faraday's Law Studio",
      theory: "Faraday's Law of Induction: Changing magnetic flux through a conducting loop induces an electromotive force (EMF = -N dΦB/dt). Lenz's law dictates that the induced current generates an opposing magnetic field.",
      extraContext: { labMode, magnetX, coilTurns, coilRadius, inducedEMF: inducedEMF.toFixed(2), rotationSpeedRPM },
    });
  }, [labMode, magnetX, coilTurns, coilRadius, inducedEMF, rotationSpeedRPM, setExperimentData]);

  // Lightbulb Glow Power (P = V^2 / R)
  const bulbGlowOpacity = Math.min(1, Math.pow(Math.abs(inducedEMF) / 8, 2));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Magnet size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Electromagnetic Induction &amp; Faraday&apos;s Law Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Electromagnetism Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Bar magnet translation, rotating AC dynamo generator, vector magnetic field streamlines, incandescent bulb radiance, and live oscilloscope
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          <button
            onClick={() => {
              setLabMode("linear_magnet");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              labMode === "linear_magnet"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Linear Drag Magnet
          </button>
          <button
            onClick={() => {
              setLabMode("ac_dynamo");
              completeExperiment();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              labMode === "ac_dynamo"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AC Dynamo Generator
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Induction Chamber Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {labMode === "linear_magnet" ? "Interactive Magnet Coil Stage" : "Rotating AC Dynamo Viewport"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {labMode === "linear_magnet" ? (
                <button
                  onClick={() => setMagnetPolarity(magnetPolarity === "N-S" ? "S-N" : "N-S")}
                  className="px-3 py-1 bg-muted hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
                >
                  Flip Poles ({magnetPolarity})
                </button>
              ) : (
                <button
                  onClick={() => setIsDynamoRunning(!isDynamoRunning)}
                  className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all"
                >
                  {isDynamoRunning ? "Pause Dynamo" : "Spin Dynamo"}
                </button>
              )}
            </div>
          </div>

          {/* Canvas Scene */}
          <div className="relative h-[360px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-2xl select-none">
            {/* Magnetic Vector Field Lines */}
            <VectorFieldRenderer width={560} height={360} sources={fieldSources} className="absolute inset-0 z-0" />

            {/* Circuit Flow Renderer */}
            <CircuitFlowRenderer width={560} height={360} paths={circuitPaths} className="absolute inset-0 z-10" />

            {/* Multi-Turn Copper Coil Loops */}
            <div
              style={{ left: `${coilCenterX - coilRadius}px`, top: `${coilCenterY - 65}px` }}
              className="absolute z-20 pointer-events-none flex flex-col items-center gap-2"
            >
              {Array.from({ length: coilTurns }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  style={{ width: `${coilRadius * 2}px` }}
                  className="h-7 rounded-full border-4 border-amber-600 shadow-md bg-amber-500/10"
                />
              ))}
              <span className="text-[9px] font-mono font-black text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                {coilTurns} Turn{coilTurns > 1 ? "s" : ""} &bull; Area {coilRadius * 2}mm
              </span>
            </div>

            {/* Magnet Representation */}
            {labMode === "linear_magnet" ? (
              <div
                style={{ left: `${magnetX - 50}px`, top: `${coilCenterY - 20}px` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute w-28 h-12 rounded-xl shadow-2xl z-30 cursor-grab active:cursor-grabbing flex border-2 border-white/40 overflow-hidden touch-none"
              >
                {magnetPolarity === "N-S" ? (
                  <>
                    <div className="w-1/2 bg-rose-600 flex items-center justify-center font-black text-white text-xs font-mono">
                      N
                    </div>
                    <div className="w-1/2 bg-blue-600 flex items-center justify-center font-black text-white text-xs font-mono">
                      S
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-1/2 bg-blue-600 flex items-center justify-center font-black text-white text-xs font-mono">
                      S
                    </div>
                    <div className="w-1/2 bg-rose-600 flex items-center justify-center font-black text-white text-xs font-mono">
                      N
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Rotating Dynamo Magnet
              <div
                style={{
                  left: `120px`,
                  top: `${coilCenterY - 20}px`,
                  transform: `rotate(${dynamoAngle}rad)`,
                }}
                className="absolute w-28 h-12 rounded-xl shadow-2xl z-30 flex border-2 border-white/40 overflow-hidden origin-center pointer-events-none"
              >
                <div className="w-1/2 bg-rose-600 flex items-center justify-center font-black text-white text-xs font-mono">
                  N
                </div>
                <div className="w-1/2 bg-blue-600 flex items-center justify-center font-black text-white text-xs font-mono">
                  S
                </div>
              </div>
            )}

            {/* Load Device: Incandescent Lightbulb or Galvanometer */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              {loadDevice === "lightbulb" ? (
                <div className="relative flex flex-col items-center">
                  {/* Glowing Radiance Aura */}
                  <div
                    style={{
                      opacity: bulbGlowOpacity,
                      transform: `scale(${1 + bulbGlowOpacity * 0.6})`,
                    }}
                    className="absolute -top-12 w-28 h-28 rounded-full bg-amber-400/40 blur-xl pointer-events-none transition-all duration-75"
                  />
                  {/* Lightbulb Shell */}
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-500/60 flex items-center justify-center relative shadow-lg">
                    <Lightbulb
                      size={28}
                      style={{
                        color: bulbGlowOpacity > 0.1 ? "#fbbf24" : "#64748b",
                        filter: bulbGlowOpacity > 0.1 ? `drop-shadow(0 0 12px #f59e0b)` : "none",
                      }}
                      className="transition-all duration-75"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-300 mt-1">
                    Load: Filament Bulb ({Math.abs(inducedEMF).toFixed(2)} V)
                  </span>
                </div>
              ) : (
                <div className="w-40 h-20 bg-slate-900 border-2 border-slate-700 rounded-t-3xl flex flex-col items-center justify-end p-2 shadow-2xl relative overflow-hidden">
                  <div className="w-28 h-12 border-t-2 border-dashed border-slate-500 rounded-t-full relative">
                    <div
                      style={{
                        transform: `rotate(${Math.max(-60, Math.min(60, inducedEMF * 5.5))}deg)`,
                      }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-rose-500 origin-bottom transition-transform duration-75 shadow-md"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-black text-slate-300 mt-1">
                    Galvanometer ({inducedEMF.toFixed(2)} mV)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Coil & Load Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/20 border border-border/60 rounded-2xl text-xs">
            {/* Coil Turns */}
            <div className="space-y-1">
              <span className="font-bold text-foreground block">Coil Turns (N):</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((t) => (
                  <button
                    key={t}
                    onClick={() => setCoilTurns(t)}
                    className={`flex-1 py-1.5 rounded-xl font-bold font-mono border transition-all ${
                      coilTurns === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Coil Radius / Area */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Coil Radius:</span>
                <span className="font-black text-amber-500">{coilRadius} mm</span>
              </div>
              <input
                type="range"
                min="30"
                max="65"
                value={coilRadius}
                onChange={(e) => setCoilRadius(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Load Device Selector */}
            <div className="space-y-1">
              <span className="font-bold text-foreground block">Load Circuit:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLoadDevice("lightbulb")}
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-all ${
                    loadDevice === "lightbulb"
                      ? "bg-amber-500/20 border-amber-500 text-amber-400"
                      : "bg-muted/40 border-border text-foreground hover:bg-accent"
                  }`}
                >
                  Lightbulb
                </button>
                <button
                  onClick={() => setLoadDevice("galvanometer")}
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-all ${
                    loadDevice === "galvanometer"
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                      : "bg-muted/40 border-border text-foreground hover:bg-accent"
                  }`}
                >
                  Meter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Oscilloscope & Quantitative Metrics (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Live Waveform &amp; Quantitative Metrics
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
              <span className="text-[10px] text-primary uppercase font-sans font-bold">Instantaneous EMF (&Epsilon;)</span>
              <span className="text-base font-black text-primary block">{inducedEMF.toFixed(2)} V</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Magnetic Flux (&Phi;B)</span>
              <span className="text-sm font-black text-foreground block">
                {(coilTurns * (coilRadius / 45) * 1.2).toFixed(2)} &mu;Wb
              </span>
            </div>
          </div>

          {/* Real-Time Oscilloscope Plot */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground uppercase">
              <span>Live Induced EMF Waveform:</span>
              <span className="text-sky-500">&Epsilon; = &minus;N(d&Phi;/dt)</span>
            </div>

            <GraphPlotter
              width={380}
              height={190}
              series={oscSeries}
              xMin={oscilloscopeHistory.length > 0 ? oscilloscopeHistory[0].x : 0}
              xMax={oscilloscopeHistory.length > 0 ? oscilloscopeHistory[oscilloscopeHistory.length - 1].x + 5 : 60}
              yMin={-12}
              yMax={12}
              xLabel="Time Sample (t)"
              yLabel="Induced EMF (V)"
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
              <h3 className="text-sm font-bold text-foreground">Why does rotating a magnet at higher RPM increase the peak induced voltage of an AC generator?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because higher rotational frequency increases the time derivative of magnetic flux (dΦ/dt = ω·BA·sin(ωt)), directly scaling peak EMF (ε = N·ω·BA)",
            "Because the magnet becomes physically heavier at higher RPM",
            "Because copper coils expand and decrease electrical resistance",
            "Because the magnetic field changes polarity faster without altering voltage",
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
