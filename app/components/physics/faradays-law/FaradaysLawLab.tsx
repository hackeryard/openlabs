"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Activity,
  Download,
  Magnet,
  Volume2,
  VolumeX,
  Lightbulb,
  Gauge,
  Layers,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";

export type ApparatusMode = "magnet_coil" | "dynamo" | "transformer";
export type CoreType = "air" | "iron";
export type IndicatorDevice = "bulb" | "meter";

export default function FaradaysLawLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "physics/faradays-law",
    "physics",
    "simulation"
  );
  const { challenge, validateChallenge } = useDailyChallenge("physics/faradays-law");

  // ── Apparatus Mode ────────────────────────────────────────────────────
  const [mode, setMode] = useState<ApparatusMode>("magnet_coil");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"controls" | "presets" | "theory">("controls");

  // ── 1. Magnet & Coil Parameters ────────────────────────────────────────
  const [magnetPos, setMagnetPos] = useState<number>(140); // 40 to 520 px
  const [magnetPolarity, setMagnetPolarity] = useState<"N-S" | "S-N">("N-S");
  const [magnetStrength, setMagnetStrength] = useState<number>(1.2); // Tesla (0.2 to 2.5)
  const [coilTurns, setCoilTurns] = useState<number>(4); // 1, 2, 4, 8
  const [coreType, setCoreType] = useState<CoreType>("iron");
  const [isAutoPlunging, setIsAutoPlunging] = useState<boolean>(false);
  const [plungeSpeed, setPlungeSpeed] = useState<number>(1.2); // Hz (0.3 to 3.0)
  const [indicator, setIndicator] = useState<IndicatorDevice>("bulb");

  // ── 2. AC Dynamo Parameters ────────────────────────────────────────────
  const [dynamoRPM, setDynamoRPM] = useState<number>(900); // 0 to 3000 RPM
  const [dynamoAngle, setDynamoAngle] = useState<number>(0);
  const [isDCOutput, setIsDCOutput] = useState<boolean>(false); // AC Slip Rings vs DC Commutator
  const [dynamoTurns, setDynamoTurns] = useState<number>(120);

  // ── 3. Transformer Parameters ──────────────────────────────────────────
  const [primaryTurns, setPrimaryTurns] = useState<number>(200);
  const [secondaryTurns, setSecondaryTurns] = useState<number>(50);
  const [primaryVolts, setPrimaryVolts] = useState<number>(120); // V RMS
  const [transformerFreq, setTransformerFreq] = useState<number>(60); // Hz

  // ── Audio Feedback Synth ───────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // ── Canvas & Tracking Refs ─────────────────────────────────────────────
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const historyRef = useRef<Array<{ t: number; v: number; flux: number }>>([]);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(140);
  const manualVelocityRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(performance.now());

  // Core Gain
  const coreGain = coreType === "iron" ? 5.5 : 1.0;

  // ── Analytical Telemetry Engine ────────────────────────────────────────
  const telemetry = useMemo(() => {
    if (mode === "magnet_coil") {
      const coilCenterX = 370;
      const distM = (magnetPos - coilCenterX) * 0.001;
      const coilAreaM2 = Math.PI * Math.pow(0.04, 2);
      const sign = magnetPolarity === "N-S" ? 1 : -1;

      // Axial field profile
      const L = 0.06;
      const R = 0.015;
      const d1 = distM + L / 2;
      const d2 = distM - L / 2;
      const t1 = d1 / Math.sqrt(d1 * d1 + R * R);
      const t2 = d2 / Math.sqrt(d2 * d2 + R * R);
      const bField = (magnetStrength / 2) * Math.abs(t1 - t2);
      const fluxWb = sign * bField * coilAreaM2 * coreGain;

      // Derivative dPhi/dt from motion velocity
      const dx = 0.001;
      const b1 = (magnetStrength / 2) * Math.abs((distM + dx + L / 2) / Math.sqrt((distM + dx + L / 2) ** 2 + R * R) - (distM + dx - L / 2) / Math.sqrt((distM + dx - L / 2) ** 2 + R * R));
      const b0 = (magnetStrength / 2) * Math.abs((distM - dx + L / 2) / Math.sqrt((distM - dx + L / 2) ** 2 + R * R) - (distM - dx - L / 2) / Math.sqrt((distM - dx - L / 2) ** 2 + R * R));
      const dPhiDx = sign * ((b1 - b0) / (2 * dx)) * coilAreaM2 * coreGain;

      const vMS = manualVelocityRef.current * 0.001;
      const dPhiDt = dPhiDx * vMS;
      const inducedEMF = -coilTurns * dPhiDt;
      const currentA = inducedEMF / 10;
      const powerW = Math.abs(inducedEMF * currentA);

      return {
        emf: inducedEMF,
        fluxWb,
        dPhiDt,
        currentA,
        powerW,
        vRMS: Math.abs(inducedEMF) / Math.SQRT2,
        frequencyHz: isAutoPlunging ? plungeSpeed : Math.abs(manualVelocityRef.current) / 100,
      };
    } else if (mode === "dynamo") {
      const omega = (dynamoRPM * 2 * Math.PI) / 60;
      const areaM2 = 0.005;
      const fieldB = 1.2;
      const peakEMF = dynamoTurns * fieldB * areaM2 * omega;
      const fluxWb = fieldB * areaM2 * Math.cos(dynamoAngle);
      const dPhiDt = -fieldB * areaM2 * omega * Math.sin(dynamoAngle);

      let emf = peakEMF * Math.sin(dynamoAngle);
      if (isDCOutput) emf = Math.abs(emf);

      const vRMS = peakEMF / Math.SQRT2;
      const currentA = emf / 15;
      const powerW = Math.abs(emf * currentA);

      return {
        emf,
        fluxWb,
        dPhiDt,
        currentA,
        powerW,
        vRMS,
        frequencyHz: dynamoRPM / 60,
      };
    } else {
      // Transformer
      const ratio = secondaryTurns / primaryTurns;
      const vSecRMS = primaryVolts * ratio * 0.98;
      const peakSec = vSecRMS * Math.SQRT2;
      const omega = 2 * Math.PI * transformerFreq;
      const t = performance.now() / 1000;
      const emf = peakSec * Math.sin(omega * t);
      const currentA = emf / 20;

      return {
        emf,
        fluxWb: (primaryVolts / (primaryTurns * omega)) * Math.cos(omega * t),
        dPhiDt: -(primaryVolts / primaryTurns) * Math.sin(omega * t),
        currentA,
        powerW: Math.abs(emf * currentA),
        vRMS: vSecRMS,
        frequencyHz: transformerFreq,
      };
    }
  }, [
    mode,
    magnetPos,
    magnetPolarity,
    coreGain,
    magnetStrength,
    coilTurns,
    isAutoPlunging,
    plungeSpeed,
    dynamoRPM,
    dynamoAngle,
    isDCOutput,
    dynamoTurns,
    secondaryTurns,
    primaryTurns,
    primaryVolts,
    transformerFreq,
  ]);

  // ── Web Audio Synth Setup ──────────────────────────────────────────────
  const toggleSound = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      oscNodeRef.current = osc;
      gainNodeRef.current = gain;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(!soundEnabled);
  };

  useEffect(() => {
    if (!soundEnabled || !gainNodeRef.current || !oscNodeRef.current || !audioCtxRef.current) return;
    const absEMF = Math.abs(telemetry.emf);
    const targetGain = Math.min(0.18, (absEMF / 14) * 0.15);
    const targetFreq = mode === "dynamo"
      ? Math.max(30, Math.min(450, (dynamoRPM / 60) * 10))
      : mode === "transformer"
      ? transformerFreq * 2
      : Math.max(50, Math.min(300, absEMF * 22 + 50));

    gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    oscNodeRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.05);
  }, [soundEnabled, telemetry.emf, mode, dynamoRPM, transformerFreq]);

  // ── AI Context Sync ────────────────────────────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Electromagnetic Induction & Faraday's Law Studio",
      theory: "Faraday's Law of Induction states ε = -N (dΦB/dt). Lenz's Law dictates that induced current creates an opposing magnetic field.",
      extraContext: {
        mode,
        emf: telemetry.emf.toFixed(2),
        flux: (telemetry.fluxWb * 1e6).toFixed(1) + " μWb",
        vRMS: telemetry.vRMS?.toFixed(1) + " V",
        turns: mode === "magnet_coil" ? coilTurns : mode === "dynamo" ? dynamoTurns : secondaryTurns,
        core: coreType,
      },
    });
  }, [mode, telemetry, coilTurns, dynamoTurns, secondaryTurns, coreType, setExperimentData]);

  // ── Pointer Drag for Bar Magnet ────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "magnet_coil") return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || mode !== "magnet_coil") return;
    const now = performance.now();
    const dt = Math.max(0.008, (now - lastDragTimeRef.current) / 1000);
    const dx = e.clientX - dragStartXRef.current;

    manualVelocityRef.current = dx / dt;
    dragStartXRef.current = e.clientX;
    lastDragTimeRef.current = now;

    setMagnetPos((prev) => Math.max(60, Math.min(520, prev + dx)));
    completeExperiment();

    if (challenge && challenge.targetParam === "fluxChanged") {
      validateChallenge(Math.abs(dx), "fluxChanged");
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // ── 60 FPS Animation & Rendering Loop ──────────────────────────────────
  useEffect(() => {
    let animId: number;

    const loop = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - lastTimeRef.current) / 1000));
      lastTimeRef.current = now;

      if (isPlaying) {
        // Auto Plunger SHM
        if (mode === "magnet_coil") {
          if (isAutoPlunging) {
            const omega = 2 * Math.PI * plungeSpeed;
            const center = 280;
            const amp = 100;
            const targetX = center + Math.sin(omega * (now / 1000)) * amp;
            manualVelocityRef.current = omega * amp * Math.cos(omega * (now / 1000));
            setMagnetPos(targetX);
          } else if (!isDraggingRef.current) {
            manualVelocityRef.current *= 0.88;
          }
        }

        // Dynamo Rotation
        else if (mode === "dynamo" && dynamoRPM > 0) {
          const omega = (dynamoRPM * 2 * Math.PI) / 60;
          setDynamoAngle((prev) => (prev + omega * dt) % (Math.PI * 2));
        }

        // Oscilloscope recording
        historyRef.current.push({
          t: now / 1000,
          v: telemetry.emf,
          flux: telemetry.fluxWb,
        });
        if (historyRef.current.length > 120) {
          historyRef.current.shift();
        }
      }

      drawStage();
      drawScope();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, mode, isAutoPlunging, plungeSpeed, dynamoRPM, telemetry]);

  // ── Draw Interactive Main Stage Canvas ─────────────────────────────────
  const drawStage = () => {
    const canvas = stageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const simTime = performance.now() / 1000;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Sleek Dark Background with Dot Matrix Grid
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
    for (let x = 16; x < w; x += 22) {
      for (let y = 16; y < h; y += 22) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    const coilCenterX = 370;
    const coilCenterY = 145;

    // ── 1. MAGNET & COIL MODE ──
    if (mode === "magnet_coil") {
      // ── 1. VIBRANT ANIMATED MAGNETIC DIPOLE WAVES & FIELD LOOPS ──
      const northSign = magnetPolarity === "N-S" ? -1 : 1; // -1 = Left (N), +1 = Right (S)
      const northPoleX = magnetPos + (northSign * 45);
      const southPoleX = magnetPos - (northSign * 45);

      // A. Propagating Magnetic Flux Waves (Concentric wave fronts radiating from poles)
      const wavePhase = (simTime * 2.5) % 1;
      for (let r = 0; r < 4; r++) {
        const rad = ((r + wavePhase) / 4) * 160 + 20;
        const alpha = (1 - rad / 180) * 0.35 * (magnetStrength / 1.5);
        if (alpha > 0.02) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(northPoleX, coilCenterY, rad, -Math.PI * 0.75, Math.PI * 0.75, false);
          ctx.stroke();

          ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
          ctx.beginPath();
          ctx.arc(southPoleX, coilCenterY, rad, Math.PI * 0.25, Math.PI * 1.75, false);
          ctx.stroke();
        }
      }

      // B. Continuous Magnetic Dipole Field Streamline Loops (North to South)
      const loopShells = [35, 65, 105, 155];
      loopShells.forEach((shellRadius, sIdx) => {
        // Top loop
        ctx.strokeStyle = sIdx % 2 === 0 ? "rgba(56, 189, 248, 0.75)" : "rgba(147, 197, 253, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -(simTime * 40 * (magnetPolarity === "N-S" ? 1 : -1));

        ctx.beginPath();
        ctx.moveTo(northPoleX, coilCenterY - 12);
        ctx.bezierCurveTo(
          northPoleX + (northSign * shellRadius * 0.8),
          coilCenterY - shellRadius * 1.6,
          southPoleX - (northSign * shellRadius * 0.8),
          coilCenterY - shellRadius * 1.6,
          southPoleX,
          coilCenterY - 12
        );
        ctx.stroke();

        // Bottom loop
        ctx.beginPath();
        ctx.moveTo(northPoleX, coilCenterY + 12);
        ctx.bezierCurveTo(
          northPoleX + (northSign * shellRadius * 0.8),
          coilCenterY + shellRadius * 1.6,
          southPoleX - (northSign * shellRadius * 0.8),
          coilCenterY + shellRadius * 1.6,
          southPoleX,
          coilCenterY + 12
        );
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // C. Axial Core-Penetrating Magnetic Flux Beam
      const beamGrad = ctx.createLinearGradient(magnetPos - 80, coilCenterY, magnetPos + 220, coilCenterY);
      beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.6)");
      beamGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.85)");
      beamGrad.addColorStop(1, "rgba(56, 189, 248, 0.15)");
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.min(northPoleX, southPoleX) - 40, coilCenterY);
      ctx.lineTo(Math.max(northPoleX, southPoleX) + 240, coilCenterY);
      ctx.stroke();

      // Axial flux directional arrows
      for (let ax = 0; ax < 4; ax++) {
        const arrowX = magnetPos + 40 + ax * 50;
        if (arrowX < w - 20) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.moveTo(arrowX, coilCenterY);
          ctx.lineTo(arrowX - 8, coilCenterY - 5);
          ctx.lineTo(arrowX - 8, coilCenterY + 5);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Soft Iron Core
      if (coreType === "iron") {
        ctx.fillStyle = "#334155";
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(coilCenterX - 45, coilCenterY - 14, 90, 28, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("SOFT IRON CORE", coilCenterX, coilCenterY + 3);
      }

      // Copper Solenoid Windings
      for (let i = 0; i < coilTurns; i++) {
        const spacing = 80 / (coilTurns + 1);
        const cx = coilCenterX - 40 + (i + 1) * spacing;
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.ellipse(cx, coilCenterY, 7, 36, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Lenz's Law Vector Arrow
      if (Math.abs(telemetry.dPhiDt) > 0.0001) {
        const dir = telemetry.dPhiDt > 0 ? -1 : 1;
        ctx.strokeStyle = "#10b981";
        ctx.fillStyle = "#10b981";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(coilCenterX - 40 * dir, coilCenterY - 48);
        ctx.lineTo(coilCenterX + 40 * dir, coilCenterY - 48);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(coilCenterX + 40 * dir, coilCenterY - 48);
        ctx.lineTo(coilCenterX + 40 * dir - 8 * dir, coilCenterY - 53);
        ctx.lineTo(coilCenterX + 40 * dir - 8 * dir, coilCenterY - 43);
        ctx.closePath();
        ctx.fill();

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("B_ind (Lenz Opposing Field)", coilCenterX, coilCenterY - 56);
      }

      // Bar Magnet
      const magW = 100;
      const magH = 32;
      ctx.save();
      ctx.translate(magnetPos, coilCenterY);

      if (magnetPolarity === "N-S") {
        ctx.fillStyle = "#e11d48";
        ctx.fillRect(-magW / 2, -magH / 2, magW / 2, magH);
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(0, -magH / 2, magW / 2, magH);
      } else {
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(-magW / 2, -magH / 2, magW / 2, magH);
        ctx.fillStyle = "#e11d48";
        ctx.fillRect(0, -magH / 2, magW / 2, magH);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 2;
      ctx.strokeRect(-magW / 2, -magH / 2, magW, magH);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(magnetPolarity === "N-S" ? "N" : "S", -magW / 4, 4);
      ctx.fillText(magnetPolarity === "N-S" ? "S" : "N", magW / 4, 4);
      ctx.restore();

      // Drag Hint
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`x = ${(magnetPos - coilCenterX).toFixed(0)}mm | B₀ = ${magnetStrength.toFixed(1)}T`, magnetPos, coilCenterY + 30);
    }

    // ── 2. AC DYNAMO MODE ──
    else if (mode === "dynamo") {
      // Animated Magnetic Field Lines from North to South Stator
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -(simTime * 30);
      for (let y = -40; y <= 40; y += 20) {
        ctx.beginPath();
        ctx.moveTo(110, coilCenterY + y);
        ctx.lineTo(w - 110, coilCenterY + y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Stator Magnets
      ctx.fillStyle = "#be123c";
      ctx.fillRect(50, coilCenterY - 60, 60, 120);
      ctx.fillStyle = "#1d4ed8";
      ctx.fillRect(w - 110, coilCenterY - 60, 60, 120);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("N", 80, coilCenterY + 5);
      ctx.fillText("S", w - 80, coilCenterY + 5);

      // Rotating Rotor
      ctx.save();
      ctx.translate(w / 2, coilCenterY);
      ctx.rotate(dynamoAngle);

      ctx.strokeStyle = "#f59e0b";
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(-70, -36, 140, 72, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${dynamoTurns}T Loop`, 0, 3);
      ctx.restore();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(isDCOutput ? "⚡ Split-Ring Commutator (Pulsating DC)" : "⚡ Dual Slip Rings (Sinusoidal AC)", w / 2, coilCenterY + 95);
    }

    // ── 3. TRANSFORMER MODE ──
    else {
      const coreW = 230;
      const coreH = 150;
      const thick = 32;

      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(w / 2 - coreW / 2, coilCenterY - coreH / 2, coreW, coreH, 10);
      ctx.fill();
      ctx.stroke();

      // Circulating Magnetic Core Flux Stream
      ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -(simTime * 45);
      ctx.beginPath();
      ctx.roundRect(w / 2 - coreW / 2 + thick / 2, coilCenterY - coreH / 2 + thick / 2, coreW - thick, coreH - thick, 6);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(w / 2 - coreW / 2 + thick, coilCenterY - coreH / 2 + thick, coreW - thick * 2, coreH - thick * 2);

      // Primary Coils
      for (let i = 0; i < 6; i++) {
        const y = coilCenterY - coreH / 2 + thick + 10 + i * 14;
        ctx.fillStyle = "#d97706";
        ctx.fillRect(w / 2 - coreW / 2 - 6, y, thick + 12, 7);
      }

      // Secondary Coils
      for (let i = 0; i < 9; i++) {
        const y = coilCenterY - coreH / 2 + thick + 8 + i * 10;
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(w / 2 + coreW / 2 - thick - 6, y, thick + 12, 5);
      }

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`Primary: ${primaryTurns}T (${primaryVolts}V)`, w / 2 - 75, coilCenterY + 95);

      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Secondary: ${secondaryTurns}T (${telemetry.vRMS?.toFixed(1)}V)`, w / 2 + 75, coilCenterY + 95);
    }

    // ── Output Load Device (Bottom Center) ──
    const loadX = 370;
    const loadY = 275;
    const glow = Math.min(1, Math.pow(Math.abs(telemetry.emf) / 12, 1.8));

    if (indicator === "bulb") {
      // Glow Aura
      if (glow > 0.05) {
        const rad = ctx.createRadialGradient(loadX, loadY, 2, loadX, loadY, 40 * glow);
        rad.addColorStop(0, "rgba(251, 191, 36, 0.85)");
        rad.addColorStop(1, "transparent");
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(loadX, loadY, 40 * glow, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = glow > 0.05 ? "#fbbf24" : "#475569";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(loadX, loadY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`BULB (${Math.abs(telemetry.emf).toFixed(1)}V)`, loadX, loadY + 22);
    } else {
      // Meter
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(loadX - 40, loadY - 16, 80, 32, 5);
      ctx.fill();
      ctx.stroke();

      const needle = Math.max(-0.8, Math.min(0.8, telemetry.currentA * 7));
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(loadX, loadY + 10);
      ctx.lineTo(loadX + Math.sin(needle) * 20, loadY + 10 - Math.cos(needle) * 20);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${(telemetry.currentA * 1000).toFixed(0)} mA`, loadX, loadY + 24);
    }
  };

  // ── Draw Real-Time Oscilloscope Waveform ────────────────────────────────
  const drawScope = () => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark Scope Background
    ctx.fillStyle = "#060913";
    ctx.fillRect(0, 0, w, h);

    const padL = 35;
    const padR = 15;
    const padT = 12;
    const padB = 16;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const midY = padT + plotH / 2;

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const x = padL + (i / 6) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }

    // Zero Reference Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(padL, midY);
    ctx.lineTo(padL + plotW, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    const history = historyRef.current;
    if (history.length < 2) return;

    const maxVal = 14;
    const timeToPx = (idx: number) => padL + (idx / (history.length - 1)) * plotW;
    const valToPx = (v: number) => midY - (v / maxVal) * (plotH / 2);

    // Plot Induced EMF Curve
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = timeToPx(i);
      const y = Math.max(padT, Math.min(padT + plotH, valToPx(pt.v)));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Scale Tags
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("+14V", padL - 4, padT + 6);
    ctx.fillText("0V", padL - 4, midY + 3);
    ctx.fillText("-14V", padL - 4, padT + plotH);
  };

  // ── Guided Presets Definition ──────────────────────────────────────────
  const presets = [
    {
      title: "Faraday's Original Discovery (1831)",
      desc: "Manual bar magnet plunge into a multi-turn solenoid with soft-iron core.",
      action: () => {
        setMode("magnet_coil");
        setCoilTurns(4);
        setCoreType("iron");
        setMagnetStrength(1.5);
        setIsAutoPlunging(false);
      },
    },
    {
      title: "Hydroelectric Dynamo (900 RPM)",
      desc: "Continuous AC sinusoidal power generation from rotating coil armature.",
      action: () => {
        setMode("dynamo");
        setDynamoRPM(900);
        setIsDCOutput(false);
      },
    },
    {
      title: "DC Split-Ring Generator (1200 RPM)",
      desc: "Full-wave rectified pulsating direct current from commutator contacts.",
      action: () => {
        setMode("dynamo");
        setDynamoRPM(1200);
        setIsDCOutput(true);
      },
    },
    {
      title: "Step-Down Transformer (120V → 30V)",
      desc: "Mutual induction through iron core with 4:1 primary-to-secondary turns ratio.",
      action: () => {
        setMode("transformer");
        setPrimaryTurns(200);
        setSecondaryTurns(50);
        setPrimaryVolts(120);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-4">
      {/* ── Top Executive Header ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Magnet size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Electromagnetic Induction Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              ε = -N (dΦ/dt)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore Faraday&apos;s Law, Lenz&apos;s opposing flux, AC dynamos, and iron-core transformers in real time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
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
              setMagnetPos(140);
              manualVelocityRef.current = 0;
              historyRef.current = [];
            }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition cursor-pointer border border-border"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border transition cursor-pointer ${
              soundEnabled
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Audio Hum"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* ── Apparatus Mode Selector ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { id: "magnet_coil", label: "1. Bar Magnet & Solenoid Plunger", subtitle: "Manual / Auto Drag & Coil Turns" },
          { id: "dynamo", label: "2. AC Dynamo & DC Generator", subtitle: "Rotational RPM & Commutator" },
          { id: "transformer", label: "3. Mutual Induction Transformer", subtitle: "Iron Core & Voltage Ratio" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id as ApparatusMode);
              completeExperiment();
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
              mode === item.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-xs font-black">{item.label}</span>
            <span className="text-[10px] opacity-80 font-mono">{item.subtitle}</span>
          </button>
        ))}
      </div>

      {/* ── Main Studio Split View (7 cols Canvas / 5 cols Controls) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Workbench Stage + Real-Time Scope + Metrics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Canvas */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Zap size={14} /> Interactive Workbench
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {mode === "magnet_coil" ? "Grab & drag magnet horizontally" : "Real-time 60 FPS"}
              </span>
            </div>

            <canvas
              ref={stageCanvasRef}
              width={600}
              height={300}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-[260px] sm:h-[300px] rounded-2xl cursor-grab active:cursor-grabbing border border-border/60 select-none touch-none"
            />
          </div>

          {/* Real-Time Oscilloscope Canvas */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity size={14} className="text-sky-400" /> Live Voltage Oscilloscope ε(t)
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                {telemetry.emf.toFixed(2)} V Instantaneous
              </span>
            </div>

            <canvas
              ref={scopeCanvasRef}
              width={600}
              height={120}
              className="w-full h-[110px] rounded-2xl border border-border/60 select-none"
            />
          </div>

        </div>

        {/* Right Column: Console Deck & Bottom Telemetry Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Console Deck (Tabs for Controls, Presets, Theory) */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
          {/* Deck Tabs */}
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
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    activeTab === t.id
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
          {activeTab === "controls" && (
            <div className="space-y-4 text-xs">
              {/* Mode 1 Controls */}
              {mode === "magnet_coil" && (
                <div className="space-y-4">
                  {/* Quick Toggles */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMagnetPolarity(magnetPolarity === "N-S" ? "S-N" : "N-S")}
                      className="py-2.5 px-3 rounded-xl bg-muted hover:bg-accent border border-border font-mono font-bold cursor-pointer text-center"
                    >
                      Flip Polarity ({magnetPolarity})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAutoPlunging(!isAutoPlunging)}
                      className={`py-2.5 px-3 rounded-xl border font-bold cursor-pointer transition text-center ${
                        isAutoPlunging
                          ? "bg-sky-500/20 border-sky-500 text-sky-400"
                          : "bg-muted border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {isAutoPlunging ? "Auto Plunge ON" : "Auto Plunge OFF"}
                    </button>
                  </div>

                  {/* Coil Turns */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-foreground block">Coil Turns (N):</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 4, 8].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCoilTurns(n)}
                          className={`flex-1 py-2 rounded-xl font-mono font-bold border cursor-pointer transition ${
                            coilTurns === n
                              ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                              : "bg-muted border-border text-foreground hover:bg-accent"
                          }`}
                        >
                          {n} Turns
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Core Material */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-foreground block">Core Material:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCoreType("iron")}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer transition ${
                          coreType === "iron"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        Soft Iron Core (5.5x Gain)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoreType("air")}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer transition ${
                          coreType === "air"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        Air Core (1x)
                      </button>
                    </div>
                  </div>

                  {/* Magnet Field Strength */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-foreground">Magnet Field (B₀):</span>
                      <span className="font-black text-rose-500">{magnetStrength.toFixed(1)} T</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.5"
                      step="0.1"
                      value={magnetStrength}
                      onChange={(e) => setMagnetStrength(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Indicator Toggle */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-foreground block">Load Instrument:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIndicator("bulb")}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                          indicator === "bulb"
                            ? "bg-amber-500/20 border-amber-500 text-amber-400"
                            : "bg-muted border-border text-foreground"
                        }`}
                      >
                        💡 Filament Lightbulb
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndicator("meter")}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                          indicator === "meter"
                            ? "bg-sky-500/20 border-sky-500 text-sky-400"
                            : "bg-muted border-border text-foreground"
                        }`}
                      >
                        🧭 Galvanometer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2 Controls */}
              {mode === "dynamo" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-bold text-foreground block">Output Commutation:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsDCOutput(false)}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                          !isDCOutput ? "bg-sky-500/20 border-sky-500 text-sky-400" : "bg-muted border-border text-foreground"
                        }`}
                      >
                        AC Slip Rings
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDCOutput(true)}
                        className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                          isDCOutput ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-muted border-border text-foreground"
                        }`}
                      >
                        DC Commutator
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-foreground">Turbine RPM:</span>
                      <span className="font-black text-sky-400">{dynamoRPM} RPM</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      value={dynamoRPM}
                      onChange={(e) => setDynamoRPM(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-foreground">Armature Turns (N):</span>
                      <span className="font-black text-amber-500">{dynamoTurns}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="400"
                      step="10"
                      value={dynamoTurns}
                      onChange={(e) => setDynamoTurns(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Mode 3 Controls */}
              {mode === "transformer" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="font-bold text-amber-500">Np (Primary):</span>
                        <span className="font-black text-amber-500">{primaryTurns}</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="400"
                        step="25"
                        value={primaryTurns}
                        onChange={(e) => setPrimaryTurns(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="font-bold text-sky-400">Ns (Secondary):</span>
                        <span className="font-black text-sky-400">{secondaryTurns}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="400"
                        step="10"
                        value={secondaryTurns}
                        onChange={(e) => setSecondaryTurns(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-foreground">Input Voltage (Vp):</span>
                      <span className="font-black text-emerald-400">{primaryVolts} V RMS</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="240"
                      value={primaryVolts}
                      onChange={(e) => setPrimaryVolts(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: PRESETS ── */}
          {activeTab === "presets" && (
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
          {activeTab === "theory" && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="font-bold text-primary block">Faraday&apos;s Law of Induction</span>
                <p className="text-muted-foreground text-[11px]">
                  ε = -N (dΦB / dt). The induced voltage in any closed loop equals the rate of change of magnetic flux through the loop.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="font-bold text-emerald-400 block">Lenz&apos;s Law</span>
                <p className="text-muted-foreground text-[11px]">
                  The negative sign signifies that the induced current generates an opposing magnetic field resisting the change in flux, enforcing energy conservation.
                </p>
              </div>
            </div>
          )}
          </div>

          {/* 4 Telemetry Readout Cards (Bottom of Right Column) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Induced EMF</span>
              <span className="text-base font-black text-sky-400 font-mono block">
                {telemetry.emf.toFixed(2)} V
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Magnetic Flux</span>
              <span className="text-base font-black text-amber-500 font-mono block">
                {(telemetry.fluxWb * 1e6).toFixed(1)} μWb
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">RMS Voltage</span>
              <span className="text-base font-black text-emerald-400 font-mono block">
                {(telemetry.vRMS ?? 0).toFixed(2)} V
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-2xl space-y-0.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Power Output</span>
              <span className="text-base font-black text-purple-400 font-mono block">
                {telemetry.powerW.toFixed(2)} W
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Daily Challenge Card */}
      <DailyChallengeCard
        labId="physics/faradays-law"
        currentParams={{
          fluxChanged: Math.abs(telemetry.fluxWb * 1e6),
          emfGenerated: Math.abs(telemetry.emf),
          turnsExplored: coilTurns,
          rotationSpeed: dynamoRPM,
        }}
      />
    </div>
  );
}
