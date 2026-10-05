// app/components/physics/general-relativity/GravitationalWavesPanel.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { computeGravitationalWaveChirp, computeSchwarzschildRadiusKm } from "./engine";
import { BinaryChirpParams } from "./types";
import {
  Waves,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Info,
  Layers,
  Radio,
} from "lucide-react";

interface GravitationalWavesPanelProps {
  soundEnabled: boolean;
}

export default function GravitationalWavesPanel({
  soundEnabled,
}: GravitationalWavesPanelProps) {
  const [m1, setM1] = useState<number>(36.0); // GW150914 primary
  const [m2, setM2] = useState<number>(29.0); // GW150914 secondary
  const [timeFraction, setTimeFraction] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPenrose, setShowPenrose] = useState<boolean>(false);
  const [infallingTau, setInfallingTau] = useState<number>(0.6); // Proper time for Penrose worldline

  const animFrameRef = useRef<number | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbitCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Context for GW Chirp
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chirpOscRef = useRef<OscillatorNode | null>(null);
  const chirpGainRef = useRef<GainNode | null>(null);

  // Compute live chirp parameters
  const chirp: BinaryChirpParams = computeGravitationalWaveChirp(m1, m2, timeFraction);

  // Start or update Web Audio Chirp synthesizer
  useEffect(() => {
    if (!soundEnabled || !isPlaying) {
      if (chirpGainRef.current) {
        chirpGainRef.current.gain.setTargetAtTime(0, 0, 0.05);
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!chirpOscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(chirp.currentFreqHz, ctx.currentTime);
        gain.gain.setValueAtTime(0.02 * chirp.strainAmplitude, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        chirpOscRef.current = osc;
        chirpGainRef.current = gain;
      } else {
        chirpOscRef.current.frequency.setTargetAtTime(chirp.currentFreqHz, ctx.currentTime, 0.03);
        if (chirpGainRef.current) {
          chirpGainRef.current.gain.setTargetAtTime(
            Math.min(0.08, 0.03 * chirp.strainAmplitude),
            ctx.currentTime,
            0.03
          );
        }
      }
    } catch {
      // Audio not supported
    }

    return () => {
      // Cleanup on unmount
    };
  }, [chirp.currentFreqHz, chirp.strainAmplitude, soundEnabled, isPlaying]);

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      if (chirpOscRef.current) {
        try {
          chirpOscRef.current.stop();
          chirpOscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Animation Loop for Chirp Progression
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTimeFraction((prev) => {
          const next = prev + dt * 0.28;
          if (next >= 1.0) {
            return 0; // Loop chirp cycle
          }
          return next;
        });
      }

      // Draw Orbit Canvas
      drawOrbitCanvas();
      // Draw Waveform Canvas
      drawWaveformCanvas();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  });

  // ── Draw Dual Binary Inspiral Orbit ───────────────────────────────────────
  const drawOrbitCanvas = () => {
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Separation shrinks as timeFraction approaches 0.9 (merger)
    const initialSep = 90;
    const finalSep = 18;
    const sep =
      timeFraction < 0.9
        ? initialSep - Math.pow(timeFraction / 0.9, 1.8) * (initialSep - finalSep)
        : finalSep * Math.exp(-(timeFraction - 0.9) * 20);

    // Orbital angle
    const angle = chirp.phase;

    // Draw concentric gravitational wave ripples
    ctx.lineWidth = 1.2;
    for (let r = (timeFraction * 80) % 25; r < Math.min(w, h) * 0.6; r += 24) {
      const alpha = Math.max(0, 0.4 - r / (Math.min(w, h) * 0.65));
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (timeFraction < 0.92) {
      // Body 1
      const r1 = sep * (m2 / (m1 + m2));
      const x1 = cx + Math.cos(angle) * r1;
      const y1 = cy + Math.sin(angle) * r1;

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(x1, y1, Math.max(5, (m1 / 30) * 8), 0, Math.PI * 2);
      ctx.fill();

      // Body 2
      const r2 = sep * (m1 / (m1 + m2));
      const x2 = cx - Math.cos(angle) * r2;
      const y2 = cy - Math.sin(angle) * r2;

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(x2, y2, Math.max(4, (m2 / 30) * 7), 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Merged Single Kerr Black Hole Ringing Down
      const mergedR = 12 + Math.sin(chirp.phase) * 2;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, mergedR * 2);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, "#38bdf8");
      grad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, mergedR * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, mergedR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Overlay Status Text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText(
      timeFraction < 0.86
        ? "INSPIRAL PHASE (Post-Newtonian)"
        : timeFraction < 0.93
        ? "MERGER (Numerical Relativity Peak)"
        : "RINGDOWN (Kerr Quasi-Normal Modes)",
      12,
      20
    );
  };

  // ── Draw Relativistic Strain Waveform h(t) ────────────────────────────────
  const drawWaveformCanvas = () => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    const midY = h / 2;

    // Draw zero strain baseline
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Draw full simulated waveform curve across time
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    const sampleSteps = 240;
    for (let i = 0; i < sampleSteps; i++) {
      const frac = i / sampleSteps;
      const x = (i / sampleSteps) * w;
      const pt = computeGravitationalWaveChirp(m1, m2, frac);

      // Sinusoidal wave scaled by strain amplitude
      const amp = pt.strainAmplitude * (h * 0.42);
      const y = midY + Math.sin(pt.phase) * amp;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Color gradient for the wave line
    const waveGrad = ctx.createLinearGradient(0, 0, w, 0);
    waveGrad.addColorStop(0, "#38bdf8");
    waveGrad.addColorStop(0.85, "#facc15");
    waveGrad.addColorStop(0.93, "#f43f5e");
    waveGrad.addColorStop(1, "#a855f7");

    ctx.strokeStyle = waveGrad;
    ctx.stroke();

    // Draw current progress cursor
    const cursorX = timeFraction * w;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cursorX, 10);
    ctx.lineTo(cursorX, h - 10);
    ctx.stroke();

    // Cursor indicator dot
    const currentY = midY + Math.sin(chirp.phase) * (chirp.strainAmplitude * h * 0.42);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cursorX, currentY, 4.5, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Binary Black Hole Inspiral & Gravitational Waves
            </h3>
            <p className="text-[11px] text-foreground font-semibold">
              LIGO/Virgo Chirp Strain h(t) & Conformal Penrose Geometry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPenrose(!showPenrose)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
              showPenrose
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-muted text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showPenrose ? "Show Binary Simulation" : "Penrose Conformal Diagram"}
          </button>
        </div>
      </div>

      {!showPenrose ? (
        <>
          {/* Main Visual Dual Panel: Orbit on Left, Waveform on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Dual Black Hole Orbital Canvas */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Orbital Plane & Gravitational Wave Emission
              </span>
              <div className="relative rounded-xl overflow-hidden border border-border bg-slate-950 aspect-[4/3] flex items-center justify-center">
                <canvas
                  ref={orbitCanvasRef}
                  width={340}
                  height={255}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Waveform Strain Canvas h(t) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Gravitational Strain Waveform h₊(t)
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  f = {chirp.currentFreqHz.toFixed(0)} Hz
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-border bg-slate-950 aspect-[4/3] flex items-center justify-center">
                <canvas
                  ref={waveformCanvasRef}
                  width={340}
                  height={255}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Telemetry Matrix for Gravitational Waves */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Chirp Mass (ℳ)
              </span>
              <span className="text-sm font-mono font-bold text-sky-400">
                {chirp.chirpMassSolar.toFixed(1)} M☉
              </span>
              <span className="text-[10px] text-muted-foreground">
                (m₁m₂)^(3/5) / (m₁+m₂)^(1/5)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                GW Frequency
              </span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {chirp.currentFreqHz.toFixed(1)} Hz
              </span>
              <span className="text-[10px] text-muted-foreground">
                2 × f_orbital (Quadrupole)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Peak GW Power
              </span>
              <span className="text-sm font-mono font-bold text-rose-400">
                {(chirp.luminosityWatts / 1e49).toFixed(2)} × 10⁴⁹ W
              </span>
              <span className="text-[10px] text-muted-foreground">
                Exceeds all visible stars combined!
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Remnant Horizon
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {chirp.eventHorizonCombinedKm.toFixed(0)} km
              </span>
              <span className="text-[10px] text-muted-foreground">
                Final Schwarzschild r_s
              </span>
            </div>
          </div>

          {/* Controls: Masses, Playback & Presets */}
          <div className="p-3 rounded-xl bg-card border border-border flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? "Pause Inspiral" : "Resume Inspiral"}
                </button>
                <button
                  onClick={() => setTimeFraction(0)}
                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs"
                  title="Restart Inspiral Loop"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Historical GW Event Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground text-[11px] font-semibold">Preset:</span>
                <button
                  onClick={() => {
                    setM1(36.0);
                    setM2(29.0);
                    setTimeFraction(0);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                    m1 === 36.0 && m2 === 29.0
                      ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  GW150914 (36 + 29 M☉)
                </button>
                <button
                  onClick={() => {
                    setM1(1.4);
                    setM2(1.3);
                    setTimeFraction(0);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                    m1 === 1.4 && m2 === 1.3
                      ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  GW170817 (Neutron Stars)
                </button>
              </div>
            </div>

            {/* Mass Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Primary Mass (m₁):</span>
                  <span className="font-mono font-bold text-sky-400">{m1.toFixed(1)} M☉</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="70"
                  step="0.5"
                  value={m1}
                  onChange={(e) => setM1(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Secondary Mass (m₂):</span>
                  <span className="font-mono font-bold text-rose-400">{m2.toFixed(1)} M☉</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="70"
                  step="0.5"
                  value={m2}
                  onChange={(e) => setM2(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Penrose-Carter Conformal Diagram Sub-panel */
        <div className="flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-border flex flex-col md:flex-row gap-4 items-center">
            {/* SVG Penrose Diagram */}
            <div className="w-full md:w-1/2 aspect-square max-w-[320px] relative border border-border/60 rounded-xl bg-slate-900/80 p-2 flex items-center justify-center">
              <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {/* Asymptotically Flat Diamond (Schwarzschild Exterior + Interior) */}
                {/* Region I: Exterior Universe */}
                <polygon
                  points="0,0 80,-80 120,0 80,80"
                  fill="rgba(56, 189, 248, 0.08)"
                  stroke="rgba(56, 189, 248, 0.4)"
                  strokeWidth="1.2"
                />
                {/* Region II: Black Hole Interior */}
                <polygon
                  points="-80,-80 0,0 80,-80 0,-100"
                  fill="rgba(244, 63, 94, 0.15)"
                  stroke="rgba(244, 63, 94, 0.5)"
                  strokeWidth="1.2"
                />

                {/* Singularity line (r=0) - Jagged wavy line at top */}
                <path
                  d="M -80 -80 Q -60 -90 -40 -80 T 0 -80 T 40 -80 T 80 -80"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeDasharray="2,2"
                />
                <text x="0" y="-86" fill="#f43f5e" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  Spacelike Singularity (r = 0)
                </text>

                {/* Future Event Horizon (r = r_s) at 45 degrees */}
                <line x1="0" y1="0" x2="80" y2="-80" stroke="#facc15" strokeWidth="2" />
                <text x="45" y="-35" fill="#facc15" fontSize="8" fontFamily="sans-serif" transform="rotate(-45 45 -35)">
                  Event Horizon r = r_s
                </text>

                {/* Future Null Infinity (Script I+) */}
                <line x1="80" y1="-80" x2="120" y2="0" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="105" y="-45" fill="#38bdf8" fontSize="9" fontFamily="serif" fontWeight="bold">
                  ℐ⁺
                </text>

                {/* Past Null Infinity (Script I-) */}
                <line x1="120" y1="0" x2="80" y2="80" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="105" y="45" fill="#38bdf8" fontSize="9" fontFamily="serif" fontWeight="bold">
                  ℐ⁻
                </text>

                {/* Spatial Infinity (i0) */}
                <circle cx="120" cy="0" r="3" fill="#ffffff" />
                <text x="125" y="4" fill="#ffffff" fontSize="9" fontFamily="sans-serif">
                  i⁰
                </text>

                {/* Distant Observer Worldline (statically at large r) */}
                <path d="M 95 60 Q 80 0 95 -60" fill="none" stroke="#22c55e" strokeWidth="1.8" />
                <text x="96" y="-62" fill="#22c55e" fontSize="7" fontFamily="sans-serif">
                  Distant Observer
                </text>

                {/* Infalling Astronaut Worldline based on slider infallingTau */}
                {/* Starts from past, crosses horizon into singularity */}
                <path
                  d="M 50 50 Q 25 15 15 -10 T 5 -50 T 0 -80"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.2"
                />
                {/* Current astronaut position marker */}
                {(() => {
                  const t = infallingTau;
                  // Interpolate along path
                  const ax = 50 * (1 - t) + 0 * t;
                  const ay = 50 * (1 - t) + -80 * t;
                  return (
                    <g>
                      <circle cx={ax} cy={ay} r="4" fill="#a855f7" />
                      {/* 45 degree light cone at astronaut */}
                      <path
                        d={`M ${ax - 10} ${ay - 10} L ${ax} ${ay} L ${ax + 10} ${ay - 10}`}
                        fill="rgba(250, 204, 21, 0.25)"
                        stroke="#facc15"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })()}

                {/* Center bifurcation point */}
                <circle cx="0" cy="0" r="2.5" fill="#facc15" />
              </svg>
            </div>

            {/* Explanation & Slider */}
            <div className="flex-1 flex flex-col gap-2.5 text-xs">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-400" />
                Causal Conformal Structure of Black Holes
              </h4>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                In a <strong>Penrose-Carter Diagram</strong>, infinite spacetime is mapped into a finite diamond using conformal transformations while strictly preserving light rays at <strong>45° angles</strong>.
              </p>

              <div className="p-2.5 rounded-lg bg-card border border-border flex flex-col gap-1 text-[11px]">
                <span className="font-semibold text-sky-400">Causal Boundary Points:</span>
                <div>• <strong className="text-foreground">ℐ⁺ (Future Null Infinity):</strong> Destination of all outgoing light rays.</div>
                <div>• <strong className="text-foreground">i⁰ (Spatial Infinity):</strong> Asymptotic flat space at r → ∞.</div>
                <div>• <strong className="text-amber-400">r = r_s (Event Horizon):</strong> 45° boundary where future light cones tilt inward.</div>
                <div>• <strong className="text-rose-400">r = 0 (Singularity):</strong> A moment in the astronaut's future time, not a point in space!</div>
              </div>

              {/* Slider for Infalling Astronaut Proper Time */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Astronaut Infalling Proper Time (τ):</span>
                  <span className="font-mono font-bold text-purple-400">
                    {infallingTau < 0.5 ? "Outside Horizon (r > r_s)" : "Inside Horizon (r < r_s)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={infallingTau}
                  onChange={(e) => setInfallingTau(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                />
              </div>

              <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300">
                💡 Notice how the yellow light cone tilts: once inside the horizon, every timelike path (inside the cone) must inevitably terminate at the horizontal red singularity line!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
