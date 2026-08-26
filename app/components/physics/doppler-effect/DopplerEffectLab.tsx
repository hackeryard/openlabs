"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  DopplerParameters,
  DopplerTelemetry,
  DopplerMedium,
  DopplerDisplayMode,
} from "./types";
import {
  computeDopplerTelemetry,
  SPEED_OF_SOUND,
} from "./engine";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Download,
  BookOpen,
  Table,
  Volume2,
  VolumeX,
  Radio,
  Compass,
  Zap,
  Wind,
  Layers,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";

export default function DopplerEffectLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/doppler-effect",
    "physics",
    "simulation"
  );
  const { challenge, validateChallenge } = useDailyChallenge("physics/doppler-effect");

  // ── Simulation Parameters ─────────────────────────────────────────────
  const [sourceSpeedMs, setSourceSpeedMs] = useState<number>(180); // 0 to 650 m/s
  const [sourceFrequencyHz, setSourceFrequencyHz] = useState<number>(440); // 100 to 800 Hz
  const [medium, setMedium] = useState<DopplerMedium>("air");
  const [observerX, setObserverX] = useState<number>(0); // -200 to +200 m
  const [observerY, setObserverY] = useState<number>(60); // 10 to 120 m offset
  const [displayMode, setDisplayMode] = useState<DopplerDisplayMode>("wavefronts");
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showMachCone, setShowMachCone] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "presets" | "theory" | "data">("controls");

  // Canvas ref for smooth 60fps rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Time and animation tracking refs
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const ringsRef = useRef<Array<{ x: number; y: number; tBirth: number; r: number }>>([]);
  const lastEmitTimeRef = useRef<number>(0);
  const isDraggingObserverRef = useRef<boolean>(false);

  // Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Recorded Trials
  const [trials, setTrials] = useState<Array<{ id: string; time: string; v_s: number; f_0: number; f_obs: number; mach: number }>>([]);

  // ── Audio Pitch Synthesizer Setup ─────────────────────────────────────
  useEffect(() => {
    if (!audioEnabled) {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(sourceFrequencyHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // Audio autoplay handled
    }

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [audioEnabled, sourceFrequencyHz]);

  // ── Telemetry Calculations ───────────────────────────────────────────
  const dopplerParams: DopplerParameters = useMemo(
    () => ({
      sourceSpeedMs,
      sourceFrequencyHz,
      medium,
      observerX,
      observerY,
      displayMode,
      audioEnabled,
      showVectors,
      showMachCone,
      simSpeed,
    }),
    [sourceSpeedMs, sourceFrequencyHz, medium, observerX, observerY, displayMode, audioEnabled, showVectors, showMachCone, simSpeed]
  );

  const [telemetry, setTelemetry] = useState<DopplerTelemetry>(() =>
    computeDopplerTelemetry(dopplerParams, 0)
  );

  // ── 60 FPS HTML5 Canvas Physics Engine Loop ───────────────────────────
  useEffect(() => {
    let animId: number;

    const render = (now: number) => {
      const dtSec = Math.max(0.001, Math.min(0.05, (now - lastTimeRef.current) / 1000));
      lastTimeRef.current = now;

      if (isPlaying) {
        timeRef.current += dtSec * simSpeed;
      }

      const simTime = timeRef.current;
      const currentTelem = computeDopplerTelemetry(dopplerParams, simTime);
      setTelemetry(currentTelem);

      // Update Audio frequency pitch in real-time
      if (audioEnabled && oscRef.current && audioCtxRef.current) {
        try {
          oscRef.current.frequency.setTargetAtTime(currentTelem.observedFrequencyHz, audioCtxRef.current.currentTime, 0.04);
        } catch {}
      }

      const c = SPEED_OF_SOUND[medium];

      // Emit new wavefronts
      const emitInterval = 0.09;
      if (isPlaying && simTime - lastEmitTimeRef.current >= emitInterval) {
        lastEmitTimeRef.current = simTime;
        ringsRef.current.push({
          x: currentTelem.sourceX,
          y: currentTelem.sourceY,
          tBirth: simTime,
          r: 0,
        });
        if (ringsRef.current.length > 40) {
          ringsRef.current.shift();
        }
      }

      // Update ring radii
      if (isPlaying) {
        ringsRef.current.forEach((ring) => {
          ring.r = (simTime - ring.tBirth) * c;
        });
      }

      // ── Main Canvas Drawing ──────────────────────────────────────────
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // Clear background
          ctx.fillStyle = "#030717";
          ctx.fillRect(0, 0, width, height);

          // Coordinate transform: Span 600m (-300 to +300), Center at (width/2, height/2)
          const scale = width / 600;
          const toScreenX = (x: number) => width / 2 + x * scale;
          const toScreenY = (y: number) => height / 2 - y * scale;

          // 1. Grid
          ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
          ctx.lineWidth = 1;
          for (let x = -300; x <= 300; x += 50) {
            const sx = toScreenX(x);
            ctx.beginPath();
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, height);
            ctx.stroke();
          }
          for (let y = -150; y <= 150; y += 50) {
            const sy = toScreenY(y);
            ctx.beginPath();
            ctx.moveTo(0, sy);
            ctx.lineTo(width, sy);
            ctx.stroke();
          }

          // Trajectory center axis
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, toScreenY(0));
          ctx.lineTo(width, toScreenY(0));
          ctx.stroke();
          ctx.setLineDash([]);

          // 2. Draw expanding wavefront rings
          ringsRef.current.forEach((ring) => {
            const rx = toScreenX(ring.x);
            const ry = toScreenY(ring.y);
            const rPx = ring.r * scale;

            if (rPx > 0 && rPx < width) {
              const alpha = Math.max(0.06, 0.75 - rPx / (width * 0.7));
              ctx.strokeStyle = currentTelem.machNumber >= 1.0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(96, 165, 250, ${alpha})`;
              ctx.lineWidth = currentTelem.machNumber >= 1.0 ? 1.8 : 1.2;
              ctx.beginPath();
              ctx.arc(rx, ry, rPx, 0, Math.PI * 2);
              ctx.stroke();
            }
          });

          // 3. Supersonic Mach Cone
          if (currentTelem.machNumber >= 1.0 && currentTelem.machAngleDeg && (showMachCone || displayMode === "shock_cone")) {
            const srcX = toScreenX(currentTelem.sourceX);
            const srcY = toScreenY(0);
            const muRad = (currentTelem.machAngleDeg * Math.PI) / 180;
            const coneLen = 350;

            const upX = srcX - coneLen * Math.cos(muRad);
            const upY = srcY - coneLen * Math.sin(muRad);
            const lowX = srcX - coneLen * Math.cos(muRad);
            const lowY = srcY + coneLen * Math.sin(muRad);

            // Shaded shock cone zone
            ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
            ctx.beginPath();
            ctx.moveTo(srcX, srcY);
            ctx.lineTo(upX, upY);
            ctx.lineTo(lowX, lowY);
            ctx.closePath();
            ctx.fill();

            // Tangent shock lines
            ctx.strokeStyle = "#f43f5e";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(srcX, srcY);
            ctx.lineTo(upX, upY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(srcX, srcY);
            ctx.lineTo(lowX, lowY);
            ctx.stroke();

            // Label
            ctx.fillStyle = "#f43f5e";
            ctx.font = "bold 11px monospace";
            ctx.fillText(`Mach Cone (μ = ${currentTelem.machAngleDeg.toFixed(1)}°)`, srcX - 110, srcY - 20);
          }

          // 4. Line of sight from source to observer
          const obsScreenX = toScreenX(observerX);
          const obsScreenY = toScreenY(observerY);
          const srcScreenX = toScreenX(currentTelem.sourceX);
          const srcScreenY = toScreenY(0);

          ctx.strokeStyle = currentTelem.approaching ? "rgba(16, 185, 129, 0.45)" : "rgba(244, 63, 94, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(srcScreenX, srcScreenY);
          ctx.lineTo(obsScreenX, obsScreenY);
          ctx.stroke();
          ctx.setLineDash([]);

          // 5. Observer Station
          ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(obsScreenX, obsScreenY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(obsScreenX, obsScreenY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = "bold 10px monospace";
          ctx.fillStyle = "#10b981";
          ctx.textAlign = "center";
          ctx.fillText(`Observer (${currentTelem.observedFrequencyHz.toFixed(0)} Hz)`, obsScreenX, obsScreenY + 26);
          ctx.textAlign = "start";

          // 6. Source Vehicle / Aircraft
          // Jet flame
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.moveTo(srcScreenX - 16, srcScreenY - 4);
          ctx.lineTo(srcScreenX - 26, srcScreenY);
          ctx.lineTo(srcScreenX - 16, srcScreenY + 4);
          ctx.closePath();
          ctx.fill();

          // Vehicle body
          ctx.fillStyle = "#38bdf8";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(srcScreenX + 14, srcScreenY);
          ctx.lineTo(srcScreenX - 12, srcScreenY - 8);
          ctx.lineTo(srcScreenX - 6, srcScreenY);
          ctx.lineTo(srcScreenX - 12, srcScreenY + 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Center dot
          ctx.fillStyle = "#facc15";
          ctx.beginPath();
          ctx.arc(srcScreenX, srcScreenY, 3, 0, Math.PI * 2);
          ctx.fill();

          // Velocity vector
          if (showVectors) {
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(srcScreenX + 14, srcScreenY);
            ctx.lineTo(srcScreenX + 38, srcScreenY);
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = "#facc15";
            ctx.beginPath();
            ctx.moveTo(srcScreenX + 38, srcScreenY);
            ctx.lineTo(srcScreenX + 32, srcScreenY - 3);
            ctx.lineTo(srcScreenX + 32, srcScreenY + 3);
            ctx.closePath();
            ctx.fill();

            ctx.font = "bold 10px monospace";
            ctx.fillText(`v_s = ${sourceSpeedMs} m/s`, srcScreenX + 15, srcScreenY - 12);
          }
        }
      }

      // ── Oscilloscope Wave Scope Drawing ──────────────────────────────
      const scope = scopeCanvasRef.current;
      if (scope) {
        const sCtx = scope.getContext("2d");
        if (sCtx) {
          const sw = scope.width;
          const sh = scope.height;

          sCtx.fillStyle = "#030611";
          sCtx.fillRect(0, 0, sw, sh);

          // Grid lines
          sCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          sCtx.lineWidth = 1;
          for (let i = 0; i < sw; i += 40) {
            sCtx.beginPath();
            sCtx.moveTo(i, 0);
            sCtx.lineTo(i, sh);
            sCtx.stroke();
          }
          sCtx.beginPath();
          sCtx.moveTo(0, sh / 2);
          sCtx.lineTo(sw, sh / 2);
          sCtx.stroke();

          // Waveform
          sCtx.strokeStyle = currentTelem.approaching ? "#10b981" : "#f43f5e";
          sCtx.lineWidth = 2;
          sCtx.beginPath();

          const freqRatio = currentTelem.observedFrequencyHz / 440;
          for (let x = 0; x < sw; x++) {
            const y = sh / 2 + Math.sin(x * 0.05 * freqRatio + simTime * 18) * (sh * 0.35);
            if (x === 0) sCtx.moveTo(x, y);
            else sCtx.lineTo(x, y);
          }
          sCtx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed, dopplerParams, medium, sourceSpeedMs, observerX, observerY, showMachCone, showVectors, displayMode, audioEnabled]);

  // ── AI Context Sync ───────────────────────────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Doppler Effect & Sonic Boom Physics Studio",
      theory: "Acoustic & Optical Doppler Effect: f' = f₀ · [c / (c ∓ v_s·cos θ)]. For supersonic velocities (M ≥ 1), wavefronts coalesce into a shock wave Mach cone with half-angle sin(μ) = 1/M = c/v_s.",
      extraContext: {
        sourceSpeed: `${sourceSpeedMs} m/s`,
        sourceFrequency: `${sourceFrequencyHz} Hz`,
        observedFrequency: `${telemetry.observedFrequencyHz.toFixed(1)} Hz`,
        machNumber: `Mach ${telemetry.machNumber.toFixed(2)}`,
        machAngle: telemetry.machAngleDeg ? `${telemetry.machAngleDeg.toFixed(1)}°` : "N/A (Subsonic)",
        medium: medium,
        frequencyShift: `${telemetry.frequencyShiftPercent >= 0 ? "+" : ""}${telemetry.frequencyShiftPercent.toFixed(1)}%`,
      },
    });
  }, [sourceSpeedMs, sourceFrequencyHz, telemetry, medium, setExperimentData]);

  // ── Presets ───────────────────────────────────────────────────────────
  const presets = [
    {
      title: "1. Ambulance Siren Drive-By",
      desc: "Subsonic vehicle (v_s = 40 m/s, ~144 km/h) passing an observer on Earth, demonstrating clear pitch drop.",
      action: () => {
        setSourceSpeedMs(40);
        setSourceFrequencyHz(500);
        setMedium("air");
        setObserverY(50);
        setDisplayMode("wavefronts");
      },
    },
    {
      title: "2. High-Speed Rail Interceptor",
      desc: "High-speed bullet train (v_s = 120 m/s, Mach 0.35) compressing frontal wavelengths by 35%.",
      action: () => {
        setSourceSpeedMs(120);
        setSourceFrequencyHz(400);
        setMedium("air");
        setObserverY(40);
        setDisplayMode("wavefronts");
      },
    },
    {
      title: "3. Transonic Sound Barrier (Mach 1.0)",
      desc: "Aircraft moving at the exact speed of sound (v_s = 343 m/s), causing infinite wavefront pileup at the nose.",
      action: () => {
        setSourceSpeedMs(343);
        setSourceFrequencyHz(300);
        setMedium("air");
        setObserverY(60);
        setDisplayMode("shock_cone");
      },
    },
    {
      title: "4. Supersonic Jet & Sonic Boom (Mach 1.6)",
      desc: "Supersonic fighter jet (v_s = 550 m/s, Mach 1.6) generating an active Mach shock wave cone (μ = 38.7°).",
      action: () => {
        setSourceSpeedMs(550);
        setSourceFrequencyHz(250);
        setMedium("air");
        setObserverY(70);
        setDisplayMode("shock_cone");
      },
    },
    {
      title: "5. Martian Atmosphere Acoustic Propagation",
      desc: "Martian cold CO2 atmosphere (c = 240 m/s) where Mach 1 is reached at significantly lower vehicle speeds.",
      action: () => {
        setSourceSpeedMs(240);
        setSourceFrequencyHz(440);
        setMedium("mars");
        setObserverY(50);
        setDisplayMode("shock_cone");
      },
    },
  ];

  // ── CSV Export ────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ["Timestamp", "Source Speed (m/s)", "Source Freq (Hz)", "Observed Freq (Hz)", "Mach Number", "Medium", "Sound Speed (m/s)", "Shift (%)"],
      ...trials.map((t) => [
        t.time,
        t.v_s,
        t.f_0,
        t.f_obs.toFixed(1),
        t.mach.toFixed(2),
        medium,
        SPEED_OF_SOUND[medium],
        telemetry.frequencyShiftPercent.toFixed(1),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `doppler_effect_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecordTrial = () => {
    const newTrial = {
      id: `trial_${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      v_s: sourceSpeedMs,
      f_0: sourceFrequencyHz,
      f_obs: telemetry.observedFrequencyHz,
      mach: telemetry.machNumber,
    };
    setTrials((p) => [newTrial, ...p]);
    completeExperiment();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-4">
      {/* ── Top Executive Header ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-500">
              <Radio size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Doppler Effect &amp; Sonic Boom Physics Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              f&apos; = f₀[c / (c ∓ v_s·cos θ)] | M = v_s / c | sin μ = 1/M
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore 2D acoustic wave propagation, frontal compression, sonic barrier shock waves, Mach cones, and real-time audio pitch shifts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
              audioEnabled
                ? "bg-emerald-500 hover:bg-emerald-600 text-black border-emerald-400 shadow-xs"
                : "bg-muted hover:bg-accent text-muted-foreground border-border"
            }`}
            title="Toggle Live Audio Frequency Pitch Synthesizer"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{audioEnabled ? "Audio ON" : "Audio Mute"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
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
              timeRef.current = 0;
              ringsRef.current = [];
              setSourceSpeedMs(180);
              setSourceFrequencyHz(440);
              setMedium("air");
              setObserverX(0);
              setObserverY(60);
            }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
            title="Reset Simulation"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Apparatus Mode Selector (4 Doppler Visualizations) ──────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "wavefronts", label: "1. Wavefront Propagation", subtitle: "Wavelength compression & expansion" },
          { id: "shock_cone", label: "2. Sonic Boom & Mach Cone", subtitle: "Supersonic shock wave envelope" },
          { id: "spectral_shift", label: "3. Redshift / Blueshift", subtitle: "Optical & relativistic Doppler" },
          { id: "audio_scope", label: "4. Audio Frequency Pitch", subtitle: "Acoustic synthesizer & wave harmonics" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setDisplayMode(item.id as DopplerDisplayMode);
              completeExperiment();
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
              displayMode === item.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-xs font-black">{item.label}</span>
            <span className="text-[10px] opacity-80 font-mono">{item.subtitle}</span>
          </button>
        ))}
      </div>

      {/* ── Main Studio Split View (7 cols Visual Stage / 5 cols Controls Deck) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: HTML5 Canvas Wavefront Workbench + Live Oscilloscope */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main 60 FPS Canvas Simulation */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Compass size={14} /> 2D Acoustic Wavefront Grid ({medium.toUpperCase()} &bull; c = {telemetry.soundSpeedMs} m/s)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {telemetry.approaching ? "Approaching (Blueshift)" : "Receding (Redshift)"} | f&apos; = {telemetry.observedFrequencyHz.toFixed(1)} Hz
              </span>
            </div>

            {/* High-Performance Canvas Stage */}
            <div className="w-full bg-[#030717] rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center p-1 relative">
              <canvas
                ref={canvasRef}
                width={560}
                height={300}
                className="w-full h-auto max-h-[340px] select-none cursor-crosshair rounded-xl block"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = ((e.clientX - rect.left) / rect.width) * 600 - 300;
                  const clickY = 150 - ((e.clientY - rect.top) / rect.height) * 300;
                  setObserverX(Math.max(-250, Math.min(250, clickX)));
                  setObserverY(Math.max(10, Math.min(130, Math.abs(clickY))));
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">
              💡 Tip: Click anywhere on the grid stage to reposition the Observer listener station.
            </p>
          </div>

          {/* Synchronized Live Waveform / Spectrogram Scope */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" />
                Live Acoustic Waveform &amp; Frequency Pitch Telemetry
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">
                Source: {sourceFrequencyHz} Hz &bull; Observed: {telemetry.observedFrequencyHz.toFixed(1)} Hz
              </span>
            </div>

            {/* Canvas Scope */}
            <div className="w-full bg-[#030611] rounded-2xl border border-border/80 p-3 flex flex-col justify-between font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px] flex-wrap gap-2">
                <div>
                  <span className="text-muted-foreground">Sound Speed (c): </span>
                  <strong className="text-sky-400">{telemetry.soundSpeedMs} m/s</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency Shift (Δf): </span>
                  <strong className={telemetry.frequencyShiftPercent >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {telemetry.frequencyShiftPercent >= 0 ? "+" : ""}{telemetry.frequencyShiftPercent.toFixed(1)}%
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Frontal λ: </span>
                  <strong className="text-amber-400">{telemetry.wavelengthFrontM.toFixed(2)} m</strong>
                </div>
              </div>

              {/* Canvas Waveform */}
              <div className="w-full h-10 overflow-hidden rounded-lg">
                <canvas ref={scopeCanvasRef} width={500} height={40} className="w-full h-full block" />
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Distance: <strong className="text-foreground">{telemetry.distanceToObserverM.toFixed(1)} m</strong></span>
                <span>Flight Regime: <strong className={telemetry.machNumber >= 1.0 ? "text-rose-400" : "text-emerald-400"}>{telemetry.machNumber >= 1.0 ? "SUPERSONIC (Shock Wave Active)" : "SUBSONIC (Continuous Flow)"}</strong></span>
              </div>
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
                { id: "data", label: "Data Log", icon: Table },
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

            {/* ── TAB 1: CONTROLS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4 text-xs">
                {/* Source Speed Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Source Velocity (v_s):</span>
                    <span className="font-black text-sky-400">{sourceSpeedMs} m/s ({((sourceSpeedMs * 3600) / 1000).toFixed(0)} km/h)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="650"
                    step="5"
                    value={sourceSpeedMs}
                    onChange={(e) => setSourceSpeedMs(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Stationary (0)</span>
                    <span>Subsonic</span>
                    <span>Mach 1.0 (343)</span>
                    <span>Mach 1.9 (650)</span>
                  </div>
                </div>

                {/* Source Frequency Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Source Frequency (f₀):</span>
                    <span className="font-black text-emerald-400">{sourceFrequencyHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="10"
                    value={sourceFrequencyHz}
                    onChange={(e) => setSourceFrequencyHz(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Medium Selector */}
                <div className="space-y-1.5">
                  <span className="font-bold text-foreground block">Propagation Medium:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "air", label: "Air (343 m/s)" },
                      { id: "mars", label: "Mars (240 m/s)" },
                      { id: "water", label: "Water (1482 m/s)" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMedium(m.id as DopplerMedium)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold font-mono border cursor-pointer transition ${
                          medium === m.id
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Observer Offset Y Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-foreground">Observer Perpendicular Offset (y_o):</span>
                    <span className="font-black text-amber-500">{observerY} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="110"
                    step="5"
                    value={observerY}
                    onChange={(e) => setObserverY(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowVectors(!showVectors)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold font-mono border cursor-pointer ${
                      showVectors
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-muted border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    Velocity Vectors
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMachCone(!showMachCone)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold font-mono border cursor-pointer ${
                      showMachCone
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-muted border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    Mach Shock Cone
                  </button>
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
              <div className="space-y-3 text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-sky-400 block">Classical Acoustic Doppler Effect</span>
                  <p className="text-muted-foreground text-[11px]">
                    When a wave source moves relative to a stationary medium, emitted wavefronts compress ahead of the source (shorter wavelength λ_f = (c - v_s)/f₀) and expand behind (λ_b = (c + v_s)/f₀).
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-rose-400 block">Supersonic Shock Wave &amp; Mach Cone</span>
                  <p className="text-muted-foreground text-[11px]">
                    When v_s ≥ c (Mach number M ≥ 1), the source outruns its own spherical wavefronts. The constructive superposition forms a high-pressure conical shock envelope with half-angle sin(μ) = 1/M.
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 4: DATA LOG ── */}
            {activeConsoleTab === "data" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRecordTrial}
                  className="w-full py-2 rounded-2xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-sm"
                >
                  + Record Telemetry Snapshot
                </button>

                {trials.length === 0 ? (
                  <p className="text-center py-6 text-xs text-muted-foreground font-mono">
                    No snapshots recorded yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-[11px]">
                    {trials.map((t, idx) => (
                      <div key={t.id} className="p-2.5 bg-muted/30 border border-border rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-sky-400">#{idx + 1} v_s={t.v_s}m/s</span>
                          <span className="text-muted-foreground block text-[10px]">f₀={t.f_0}Hz</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-400 block">{t.f_obs.toFixed(1)} Hz</span>
                          <span className="text-muted-foreground text-[10px]">Mach {t.mach.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 4 Telemetry Readout Cards (Bottom of Right Column) ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Observed Frequency (f&apos;)</span>
              <span className="text-base font-black text-emerald-400 font-mono block">
                {telemetry.observedFrequencyHz.toFixed(1)} Hz
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Mach Number (M)</span>
              <span className={`text-base font-black font-mono block ${telemetry.machNumber >= 1.0 ? "text-rose-400" : "text-sky-400"}`}>
                Mach {telemetry.machNumber.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Mach Cone Angle (μ)</span>
              <span className="text-base font-black text-amber-500 font-mono block">
                {telemetry.machAngleDeg ? `${telemetry.machAngleDeg.toFixed(1)}°` : "N/A (Subsonic)"}
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Frequency Shift (Δf)</span>
              <span className={`text-base font-black font-mono block ${telemetry.frequencyShiftPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {telemetry.frequencyShiftPercent >= 0 ? "+" : ""}{telemetry.frequencyShiftPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Daily Challenge Card */}
      <DailyChallengeCard
        labId="physics/doppler-effect"
        currentParams={{
          sourceSpeed: sourceSpeedMs,
          sourceFrequency: sourceFrequencyHz,
          observedFrequency: telemetry.observedFrequencyHz,
          machNumber: telemetry.machNumber,
        }}
      />
    </div>
  );
}
