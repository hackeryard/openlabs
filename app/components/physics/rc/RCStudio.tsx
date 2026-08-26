"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Zap,
  Download,
  ChevronRight,
  Radio,
  Power,
  Layers,
  Clock,
  Waves,
  Cpu,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────
export type CircuitSignalMode = "dc_switch" | "square_wave" | "ac_sine";
export type SwitchPosition = "charge" | "discharge" | "open";

export interface GuidedPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  signalMode: CircuitSignalMode;
  switchPos: SwitchPosition;
  rOhms: number;
  cMicroFarads: number;
  vSource: number;
  freqHz: number;
  explanation: string;
}

export const GUIDED_PRESETS: GuidedPreset[] = [
  {
    id: "charge_tau_63",
    title: "Standard RC Charging & τ (63.2% Rule)",
    subtitle: "Observe capacitor voltage reach 63.2% of supply in exactly 1τ",
    tag: "Fundamental",
    signalMode: "dc_switch",
    switchPos: "charge",
    rOhms: 10000,
    cMicroFarads: 100,
    vSource: 10,
    freqHz: 1,
    explanation: "The RC time constant τ = R × C = 10,000Ω × 100μF = 1.00s. In 1τ, the capacitor reaches 63.2% (6.32V). At 5τ (5.0s), it reaches 99.3% full charge.",
  },
  {
    id: "discharge_tau_37",
    title: "Capacitor Exponential Discharge (36.8% Rule)",
    subtitle: "Voltage decay following V(t) = V₀ · e^(-t/τ)",
    tag: "Decay",
    signalMode: "dc_switch",
    switchPos: "discharge",
    rOhms: 5000,
    cMicroFarads: 200,
    vSource: 12,
    freqHz: 1,
    explanation: "When switched to the discharge ground loop, stored electrostatic energy dissipates through the resistor as heat: V(t) = V₀ e^(-t/τ). In 1τ (1.0s), voltage drops to 36.8% (4.42V).",
  },
  {
    id: "square_wave_integrator",
    title: "Continuous Square Wave & Wave Shaping",
    subtitle: "Integrator wave shaping when pulse period T ~ τ",
    tag: "Pulse Circuit",
    signalMode: "square_wave",
    switchPos: "charge",
    rOhms: 4000,
    cMicroFarads: 50,
    vSource: 8,
    freqHz: 2.5,
    explanation: "Applying a continuous 2.5Hz square wave with τ = 200ms produces symmetric exponential charge/discharge waveforms, demonstrating active wave integration.",
  },
  {
    id: "low_pass_cutoff",
    title: "RC Low-Pass Filter Cutoff (f_c = 1 / 2πRC)",
    subtitle: "Frequency-dependent attenuation of high frequencies",
    tag: "AC Filter",
    signalMode: "ac_sine",
    switchPos: "charge",
    rOhms: 1592,
    cMicroFarads: 100,
    vSource: 10,
    freqHz: 1.0,
    explanation: "For R = 1592Ω and C = 100μF, cutoff frequency fc = 1 / (2πRC) = 1.00 Hz. At cutoff, output voltage drops to 70.7% (-3dB) with a 45° phase lag.",
  },
  {
    id: "fast_micro_transient",
    title: "High-Speed Microsecond Transient",
    subtitle: "Rapid charge transfer with small capacitance",
    tag: "High Speed",
    signalMode: "square_wave",
    switchPos: "charge",
    rOhms: 1000,
    cMicroFarads: 10,
    vSource: 5,
    freqHz: 20,
    explanation: "With small capacitance (10μF) and 1kΩ resistance, τ = 10ms. The circuit rapidly tracks input transitions with sharp wavefronts.",
  },
];

export default function RCStudio() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab("physics/rclab", "physics", "simulation");

  // ── Circuit Parameters ───────────────────────────────────────────────
  const [signalMode, setSignalMode] = useState<CircuitSignalMode>("dc_switch");
  const [switchPos, setSwitchPos] = useState<SwitchPosition>("charge");
  const [rOhms, setROhms] = useState<number>(10000); // 100 .. 100,000 Ohms
  const [cMicroFarads, setCMicroFarads] = useState<number>(100); // 1 .. 1,000 uF
  const [vSource, setVSource] = useState<number>(10); // 1 .. 24 V
  const [freqHz, setFreqHz] = useState<number>(1.0); // 0.1 .. 20 Hz

  // Simulation Playback State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Overlays
  const [showElectrons, setShowElectrons] = useState<boolean>(true);
  const [showFieldLines, setShowFieldLines] = useState<boolean>(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"controls" | "signal" | "presets">("controls");

  // Effective Capacitance in Farads
  const cFarads = useMemo(() => Math.max(1e-6, cMicroFarads * 1e-6), [cMicroFarads]);

  // Theoretical Calculations
  const theoreticalMetrics = useMemo(() => {
    const R = Math.max(1, rOhms);
    const C = cFarads;
    const tau = R * C; // seconds
    const maxI = vSource / R; // Amperes
    const maxCharge = C * vSource; // Coulombs
    const maxEnergy = 0.5 * C * vSource * vSource; // Joules
    const cutoffFreq = 1 / (2 * Math.PI * tau); // Hz

    return {
      tau: Number(tau.toFixed(3)),
      tauMs: Number((tau * 1000).toFixed(1)),
      maxI_mA: Number((maxI * 1000).toFixed(2)),
      maxCharge_uC: Number((maxCharge * 1e6).toFixed(1)),
      maxEnergy_mJ: Number((maxEnergy * 1000).toFixed(2)),
      cutoffFreq: Number(cutoffFreq.toFixed(2)),
    };
  }, [rOhms, cFarads, vSource]);

  // Instantaneous State
  const [currentState, setCurrentState] = useState<{
    t: number;
    vin: number;
    vc: number;
    vr: number;
    i: number;
    q: number;
    uc: number;
    pr: number;
    chargeCycles: number;
  }>({
    t: 0,
    vin: vSource,
    vc: 0,
    vr: vSource,
    i: vSource / rOhms,
    q: 0,
    uc: 0,
    pr: (vSource * vSource) / rOhms,
    chargeCycles: 0,
  });

  // Telemetry History
  const historyRef = useRef<{ t: number; vin: number; vc: number; vr: number; i_mA: number; uc_mJ: number }[]>([]);
  const electronPhaseRef = useRef<number>(0);

  // Canvas Refs
  const circuitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Synchronize AI Chatbot Knowledge Context
  useEffect(() => {
    setExperimentData({
      title: "RC Circuit & Transient Simulation Studio",
      theory: `Time constant τ = R·C. Charging: Vc(t) = Vs(1 - e^(-t/τ)), I(t) = (Vs/R)e^(-t/τ). Discharging: Vc(t) = V0·e^(-t/τ). Energy stored: Uc = ½C·Vc². Low-pass cutoff: fc = 1/(2πRC).`,
      extraContext: `R = ${rOhms}Ω, C = ${cMicroFarads}μF, Vs = ${vSource}V. Calculated τ = ${theoreticalMetrics.tau}s (${theoreticalMetrics.tauMs}ms), Cutoff fc = ${theoreticalMetrics.cutoffFreq}Hz. Signal Mode: ${signalMode}, Switch: ${switchPos}.`,
    });
  }, [rOhms, cMicroFarads, vSource, signalMode, switchPos, theoreticalMetrics, setExperimentData]);

  // Reset Simulation
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);

    setCurrentState({
      t: 0,
      vin: signalMode === "dc_switch" && switchPos === "charge" ? vSource : 0,
      vc: 0,
      vr: signalMode === "dc_switch" && switchPos === "charge" ? vSource : 0,
      i: signalMode === "dc_switch" && switchPos === "charge" ? vSource / rOhms : 0,
      q: 0,
      uc: 0,
      pr: 0,
      chargeCycles: 0,
    });

    historyRef.current = [{
      t: 0,
      vin: signalMode === "dc_switch" && switchPos === "charge" ? vSource : 0,
      vc: 0,
      vr: signalMode === "dc_switch" && switchPos === "charge" ? vSource : 0,
      i_mA: signalMode === "dc_switch" && switchPos === "charge" ? (vSource / rOhms) * 1000 : 0,
      uc_mJ: 0,
    }];
  }, [signalMode, switchPos, vSource, rOhms]);

  // Apply Preset
  const handleApplyPreset = (preset: GuidedPreset) => {
    setSignalMode(preset.signalMode);
    setSwitchPos(preset.switchPos);
    setROhms(preset.rOhms);
    setCMicroFarads(preset.cMicroFarads);
    setVSource(preset.vSource);
    setFreqHz(preset.freqHz);
    setTimeout(() => handleReset(), 50);
  };

  // Reset when parameters change while stopped
  useEffect(() => {
    if (!isRunning) {
      handleReset();
    }
  }, [rOhms, cMicroFarads, vSource, signalMode, switchPos, handleReset, isRunning]);

  // ── Physics Integration Loop (Continuous Differential Solver) ─────────
  useEffect(() => {
    if (!isRunning || isPaused) return;

    let localState = { ...currentState };
    lastTimeRef.current = performance.now();

    const R = rOhms;
    const C = cFarads;

    const stepSimulation = (now: number) => {
      const realDt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const subSteps = 16;
      const dt = (realDt * playbackSpeed) / subSteps;

      for (let s = 0; s < subSteps; s++) {
        localState.t += dt;

        // Instantaneous Source Voltage Vin(t)
        let vin = 0;
        if (signalMode === "dc_switch") {
          if (switchPos === "charge") vin = vSource;
          else if (switchPos === "discharge") vin = 0;
          else if (switchPos === "open") vin = localState.vc;
        } else if (signalMode === "square_wave") {
          const period = 1 / Math.max(0.01, freqHz);
          const phase = (localState.t % period) / period;
          vin = phase < 0.5 ? vSource : 0;
        } else if (signalMode === "ac_sine") {
          vin = vSource * Math.sin(2 * Math.PI * freqHz * localState.t);
        }

        localState.vin = vin;

        // Differential Equation: dVc/dt = (Vin - Vc) / (R * C)
        if (switchPos !== "open" || signalMode !== "dc_switch") {
          const dVc_dt = (vin - localState.vc) / (R * C);
          localState.vc += dVc_dt * dt;
        }

        localState.vr = vin - localState.vc;
        localState.i = localState.vr / R;
        localState.q = C * localState.vc;
        localState.uc = 0.5 * C * localState.vc * localState.vc;
        localState.pr = localState.i * localState.i * R;

        // Advance Electron Flow Phase
        electronPhaseRef.current += localState.i * dt * 500;

        // XP Challenge Trigger: reached >95% full charge in DC mode
        if (signalMode === "dc_switch" && switchPos === "charge" && localState.vc >= vSource * 0.95) {
          if (localState.chargeCycles === 0) {
            localState.chargeCycles = 1;
            completeExperiment();
          }
        }
      }

      setCurrentState({ ...localState });

      // Telemetry Buffer
      historyRef.current.push({
        t: Number(localState.t.toFixed(3)),
        vin: Number(localState.vin.toFixed(2)),
        vc: Number(localState.vc.toFixed(2)),
        vr: Number(localState.vr.toFixed(2)),
        i_mA: Number((localState.i * 1000).toFixed(2)),
        uc_mJ: Number((localState.uc * 1000).toFixed(3)),
      });

      if (historyRef.current.length > 350) {
        historyRef.current.shift();
      }

      rafRef.current = requestAnimationFrame(stepSimulation);
    };

    rafRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    isRunning,
    isPaused,
    rOhms,
    cFarads,
    vSource,
    signalMode,
    switchPos,
    freqHz,
    playbackSpeed,
    completeExperiment,
  ]);

  // ── Render Tactile Circuit Schematic Stage ───────────────────────────
  useEffect(() => {
    const canvas = circuitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Dark Laboratory Breadboard Background
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, w * 0.7);
      bgGrad.addColorStop(0, "#0c1322");
      bgGrad.addColorStop(1, "#060911");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Grid Dots
      ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
      for (let x = 20; x < w; x += 24) {
        for (let y = 20; y < h; y += 24) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Circuit Geometry
      const topY = 65;
      const botY = 225;
      const leftX = 75;
      const rightX = w - 75;
      const midX = (leftX + rightX) * 0.5;

      // 2. Thick Copper Traces (Circuit Wires)
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Outer Loop
      ctx.beginPath();
      ctx.moveTo(leftX, topY);
      ctx.lineTo(rightX, topY);
      ctx.lineTo(rightX, botY);
      ctx.lineTo(leftX, botY);
      ctx.lineTo(leftX, topY);
      ctx.stroke();

      // Middle Discharge Path
      ctx.beginPath();
      ctx.moveTo(midX, topY);
      ctx.lineTo(midX, botY);
      ctx.stroke();

      // Inner Glowing Wire Core
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 3. DC Power Supply Unit (Left Branch)
      const srcY = (topY + botY) * 0.5;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.fillRect(leftX - 32, srcY - 32, 64, 64);
      ctx.strokeRect(leftX - 32, srcY - 32, 64, 64);

      if (signalMode === "dc_switch") {
        // Digital LED Display
        ctx.fillStyle = "#000000";
        ctx.fillRect(leftX - 24, srcY - 24, 48, 18);
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${vSource.toFixed(1)}V`, leftX, srcY - 11);

        // Binding Posts (+) Red & (-) Black
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(leftX - 12, srcY + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(leftX + 12, srcY + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "8px monospace";
        ctx.fillText("DC SOURCE", leftX, srcY + 26);
      } else {
        // AC / Pulse Wave Display
        ctx.fillStyle = "#000000";
        ctx.fillRect(leftX - 24, srcY - 24, 48, 20);
        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${freqHz}Hz`, leftX, srcY - 10);

        ctx.fillStyle = "#a855f7";
        ctx.font = "8px monospace";
        ctx.fillText("GEN", leftX, srcY + 16);
      }

      // 4. Knife-Blade SPDT Switch (Top Branch)
      const swX = leftX + 90;
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#334155";
      ctx.fillRect(swX - 35, topY - 18, 70, 36);
      ctx.strokeRect(swX - 35, topY - 18, 70, 36);

      // Brass Terminal Contacts
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(swX - 20, topY, 4, 0, Math.PI * 2); // Input
      ctx.arc(swX + 20, topY, 4, 0, Math.PI * 2); // Charge
      ctx.arc(swX, topY + 12, 3.5, 0, Math.PI * 2); // Discharge
      ctx.fill();

      // Knife Blade Arm
      ctx.strokeStyle = switchPos === "charge" ? "#10b981" : switchPos === "discharge" ? "#38bdf8" : "#f59e0b";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(swX - 20, topY);
      if (switchPos === "charge") {
        ctx.lineTo(swX + 20, topY);
      } else if (switchPos === "discharge") {
        ctx.lineTo(swX, topY + 12);
      } else {
        ctx.lineTo(swX + 8, topY - 14);
      }
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(switchPos.toUpperCase(), swX, topY - 21);

      // 5. Precision Axial Resistor (Top Right Branch)
      const resX = rightX - 110;
      ctx.fillStyle = "#fde047";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1.5;
      ctx.fillRect(resX - 32, topY - 10, 64, 20);
      ctx.strokeRect(resX - 32, topY - 10, 64, 20);

      // Resistor Color Bands
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(resX - 18, topY - 10, 5, 20);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(resX - 4, topY - 10, 5, 20);
      ctx.fillStyle = "#eab308";
      ctx.fillRect(resX + 10, topY - 10, 5, 20);

      ctx.fillStyle = "#fde047";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${rOhms >= 1000 ? `${(rOhms / 1000).toFixed(1)}kΩ` : `${rOhms}Ω`}`, resX, topY - 14);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`VR: ${currentState.vr.toFixed(2)}V`, resX, topY + 22);

      // 6. Electrolytic Capacitor (Right Branch)
      const capY = (topY + botY) * 0.5;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.fillRect(rightX - 22, capY - 32, 44, 64);
      ctx.strokeRect(rightX - 22, capY - 32, 44, 64);

      // Capacitor Metal Plates
      const plateW = 34;
      const plateGap = 12;
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(rightX - plateW * 0.5, capY - plateGap, plateW, 4);
      ctx.fillRect(rightX - plateW * 0.5, capY + plateGap - 4, plateW, 4);

      // Dielectric Field Lines
      if (showFieldLines && Math.abs(currentState.vc) > 0.2) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 1;
        for (let fi = -12; fi <= 12; fi += 6) {
          ctx.beginPath();
          ctx.moveTo(rightX + fi, capY - plateGap + 4);
          ctx.lineTo(rightX + fi, capY + plateGap - 4);
          ctx.stroke();
        }
      }

      // Charge Signs (+ and -)
      if (Math.abs(currentState.vc) > 0.4) {
        ctx.fillStyle = currentState.vc > 0 ? "#38bdf8" : "#f43f5e";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("++++", rightX, capY - plateGap - 4);
        ctx.fillText("----", rightX, capY + plateGap + 10);
      }

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${cMicroFarads}μF`, rightX + 28, capY - 5);
      ctx.fillText(`VC: ${currentState.vc.toFixed(2)}V`, rightX + 28, capY + 10);

      // 7. Dynamic Electron Stream
      if (showElectrons) {
        const isDischarging = signalMode === "dc_switch" && switchPos === "discharge";
        const loopLeftX = isDischarging ? midX : leftX;
        const loopRightX = rightX;
        const loopTopY = topY;
        const loopBotY = botY;

        const loopWidth = loopRightX - loopLeftX;
        const loopHeight = loopBotY - loopTopY;
        const activePerimeter = loopWidth * 2 + loopHeight * 2;

        const electronCount = 28;
        const currentMag = Math.abs(currentState.i);
        const hasCurrent = currentMag > 1e-6 && switchPos !== "open";

        const visualSpeed = hasCurrent
          ? Math.sign(currentState.i) * (20 + 160 * Math.min(1, currentMag * 1200))
          : 0;

        electronPhaseRef.current += visualSpeed * 0.016 * playbackSpeed;
        const phase = ((electronPhaseRef.current % activePerimeter) + activePerimeter) % activePerimeter;

        for (let e = 0; e < electronCount; e++) {
          const dist = (phase + (e * activePerimeter) / electronCount) % activePerimeter;
          let ex = loopLeftX;
          let ey = loopTopY;

          if (dist < loopWidth) {
            ex = loopLeftX + dist;
            ey = loopTopY;
          } else if (dist < loopWidth + loopHeight) {
            ex = loopRightX;
            ey = loopTopY + (dist - loopWidth);
          } else if (dist < loopWidth * 2 + loopHeight) {
            ex = loopRightX - (dist - loopWidth - loopHeight);
            ey = loopBotY;
          } else {
            ex = loopLeftX;
            ey = loopBotY - (dist - loopWidth * 2 - loopHeight);
          }

          // Glowing Electron Particle
          ctx.save();
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = hasCurrent ? 6 : 2;

          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ex, ey, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Current direction arrow
        if (hasCurrent) {
          const arrowX = (loopLeftX + loopRightX) * 0.5;
          const arrowDir = currentState.i >= 0 ? 1 : -1;

          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`e⁻ Flow (${(currentMag * 1000).toFixed(1)} mA)`, arrowX, loopTopY - 20);

          ctx.beginPath();
          ctx.moveTo(arrowX + arrowDir * 10, loopTopY - 12);
          ctx.lineTo(arrowX - arrowDir * 5, loopTopY - 16);
          ctx.lineTo(arrowX - arrowDir * 5, loopTopY - 8);
          ctx.closePath();
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    cMicroFarads,
    currentState,
    freqHz,
    playbackSpeed,
    rOhms,
    showElectrons,
    showFieldLines,
    signalMode,
    switchPos,
    vSource,
  ]);

  // ── Render Integrated Digital Phosphor Oscilloscope ───────────────────
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padX = 40;
    const padY = 16;
    const graphW = w - padX - 15;
    const graphH = h - padY - 20;

    // Oscilloscope Screen Frame
    ctx.fillStyle = "#050911";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
    ctx.strokeRect(padX, padY, graphW, graphH);

    // Oscilloscope Grid Divisions
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = padX; x <= padX + graphW; x += graphW / 8) {
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + graphH);
      ctx.stroke();
    }
    for (let y = padY; y <= padY + graphH; y += graphH / 4) {
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + graphW, y);
      ctx.stroke();
    }

    const history = historyRef.current;
    if (history.length < 2) return;

    const maxV = Math.max(vSource * 1.15, 5);

    // 63.2% (1τ) Reference Dash Line
    if (signalMode === "dc_switch" && switchPos === "charge") {
      const tauY = padY + graphH - (vSource * 0.632 / maxV) * graphH;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padX, tauY);
      ctx.lineTo(padX + graphW, tauY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
      ctx.font = "8px monospace";
      ctx.fillText("63.2% (1τ)", padX + 5, tauY - 3);
    }

    // Channel 1: Vc (Capacitor - Amber/Yellow)
    // Channel 2: VR (Resistor - Cyan)
    // Channel 3: Vin (Input - Purple)
    const plotWave = (extractor: (d: (typeof history)[0]) => number, color: string, width: number = 2) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      const n = history.length;
      history.forEach((d, idx) => {
        const xPx = padX + (idx / (n - 1)) * graphW;
        const normY = extractor(d) / maxV;
        const yPx = padY + graphH - normY * graphH;
        if (idx === 0) ctx.moveTo(xPx, yPx);
        else ctx.lineTo(xPx, yPx);
      });
      ctx.stroke();
    };

    plotWave((d) => d.vin, "rgba(168, 85, 247, 0.35)", 1.5);
    plotWave((d) => d.vr, "#06b6d4", 2);
    plotWave((d) => d.vc, "#f59e0b", 2.5);
  }, [currentState, signalMode, switchPos, vSource]);

  // Export CSV
  const handleExportCSV = () => {
    const rows = [["Time (s)", "Vin (V)", "Vc (V)", "VR (V)", "Current (mA)", "Stored Energy (mJ)"]];
    historyRef.current.forEach((d) => {
      rows.push([d.t.toString(), d.vin.toString(), d.vc.toString(), d.vr.toString(), d.i_mA.toString(), d.uc_mJ.toString()]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rc_circuit_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6 space-y-5">
      {/* ── Executive Header Bar ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Cpu size={22} />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              RC Circuits & Transient Simulation Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
              Electrodynamics & Signals
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Interactive animated schematic, capacitor charging/discharging curves, dual-channel oscilloscope, and frequency filtering.
          </p>
        </div>

        {/* Primary Simulation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (!isRunning) {
                setIsRunning(true);
                setIsPaused(false);
              } else {
                setIsPaused(!isPaused);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xs cursor-pointer ${
              !isRunning
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : isPaused
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {!isRunning ? (
              <>
                <Play size={15} fill="currentColor" />
                <span>Start Circuit</span>
              </>
            ) : isPaused ? (
              <>
                <Play size={15} fill="currentColor" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={15} fill="currentColor" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Reset Circuit"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition cursor-pointer"
            title="Export CSV Telemetry"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Central Stage (Left 7 cols) + Control Deck (Right 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Visual Circuit Stage + Integrated Oscilloscope (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Circuit Visualizer Box */}
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            {/* Top Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400" />
                <span>τ = {theoreticalMetrics.tau}s</span>
                <span className="text-muted-foreground font-mono text-[11px]">({theoreticalMetrics.tauMs}ms)</span>
              </span>

              <span className="px-2.5 py-1 bg-purple-950/80 backdrop-blur-md rounded-full text-purple-300 text-[10px] font-mono font-black border border-purple-500/30 uppercase">
                {signalMode.replace("_", " ")}
              </span>
            </div>

            {/* Overlays Toggle */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setShowElectrons(!showElectrons)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showElectrons ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                Electrons
              </button>
              <button
                type="button"
                onClick={() => setShowFieldLines(!showFieldLines)}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                  showFieldLines ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                E-Field
              </button>
            </div>

            {/* Schematic Canvas */}
            <canvas
              ref={circuitCanvasRef}
              width={700}
              height={290}
              className="w-full h-[240px] sm:h-[280px] block"
            />

            {/* Big Tactile SPDT Switch Action Bar */}
            {signalMode === "dc_switch" && (
              <div className="p-3 bg-card/95 border-t border-border flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-muted-foreground">Switch Position:</span>
                <div className="grid grid-cols-3 gap-2 flex-1 max-w-md">
                  <button
                    type="button"
                    onClick={() => setSwitchPos("charge")}
                    className={`py-2 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      switchPos === "charge"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Zap size={14} />
                    <span>Charge (Vs)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSwitchPos("discharge")}
                    className={`py-2 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      switchPos === "discharge"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Power size={14} />
                    <span>Discharge (GND)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSwitchPos("open")}
                    className={`py-2 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      switchPos === "open"
                        ? "bg-amber-500 text-black shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Pause size={14} />
                    <span>Open (Hold)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Integrated Real-Time Digital Oscilloscope (Directly in view) */}
          <div className="bg-card border border-border rounded-3xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Dual-Channel Digital Phosphor Oscilloscope
                </h3>
              </div>

              {/* Oscilloscope Legend Chips */}
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Ch1: Vc ({currentState.vc.toFixed(2)}V)
                </span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Ch2: VR ({currentState.vr.toFixed(2)}V)
                </span>
                <span className="text-purple-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Vin ({currentState.vin.toFixed(1)}V)
                </span>
              </div>
            </div>

            <canvas
              ref={scopeCanvasRef}
              width={700}
              height={140}
              className="w-full h-[140px] rounded-2xl block border border-border"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Console + Live Telemetry Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            {/* Console Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-border">
              {[
                { id: "controls", label: "Components", icon: Sliders },
                { id: "signal", label: "Signal Source", icon: Radio },
                { id: "presets", label: "Guided Presets", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveConsoleTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      activeConsoleTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: COMPONENT PARAMETERS ── */}
            {activeConsoleTab === "controls" && (
              <div className="space-y-4">
                {/* Resistance (R) Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Resistance (R):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="10"
                        max="100000"
                        step="100"
                        value={rOhms}
                        onChange={(e) => setROhms(Math.min(100000, Math.max(10, Number(e.target.value) || 10)))}
                        disabled={isRunning}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-amber-500 font-mono font-black text-right text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">Ω</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={rOhms}
                    onChange={(e) => setROhms(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>500Ω (Fast τ)</span>
                    <span>10kΩ (Standard)</span>
                    <span>50kΩ (Slow τ)</span>
                  </div>
                </div>

                {/* Capacitance (C) Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Capacitance (C):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="5"
                        value={cMicroFarads}
                        onChange={(e) => setCMicroFarads(Math.min(1000, Math.max(1, Number(e.target.value) || 1)))}
                        disabled={isRunning}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-sky-400 font-mono font-black text-right text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">μF</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={cMicroFarads}
                    onChange={(e) => setCMicroFarads(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>10μF</span>
                    <span>100μF</span>
                    <span>500μF</span>
                  </div>
                </div>

                {/* Supply Voltage (Vs) Slider + Manual Input */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">Supply Voltage (V_s):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={vSource}
                        onChange={(e) => setVSource(Math.min(24, Math.max(1, Number(e.target.value) || 1)))}
                        disabled={isRunning}
                        className="w-20 px-2 py-0.5 rounded-lg bg-muted border border-border text-emerald-500 font-mono font-black text-right text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-bold text-muted-foreground">V</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={vSource}
                    onChange={(e) => setVSource(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: SIGNAL SOURCE ── */}
            {activeConsoleTab === "signal" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "dc_switch", label: "DC Switch", sub: "Step Response" },
                    { id: "square_wave", label: "Square Wave", sub: "Pulse Generator" },
                    { id: "ac_sine", label: "AC Sine Wave", sub: "Filter Mode" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSignalMode(mode.id as CircuitSignalMode)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        signalMode === mode.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Radio size={14} />
                      <div className="text-xs font-bold">{mode.label}</div>
                      <div className="text-[9px] font-mono text-muted-foreground">{mode.sub}</div>
                    </button>
                  ))}
                </div>

                {signalMode !== "dc_switch" && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-muted-foreground">Frequency (f):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0.1"
                            max="20"
                            step="0.1"
                            value={freqHz}
                            onChange={(e) => setFreqHz(Math.min(20, Math.max(0.1, Number(e.target.value) || 0.1)))}
                            disabled={isRunning}
                            className="w-16 px-2 py-0.5 rounded-lg bg-muted border border-border text-purple-400 font-mono font-black text-right text-xs focus:border-purple-400 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-muted-foreground">Hz</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="10"
                        step="0.1"
                        value={freqHz}
                        onChange={(e) => setFreqHz(Number(e.target.value))}
                        disabled={isRunning}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: GUIDED PRESETS ── */}
            {activeConsoleTab === "presets" && (
              <div className="space-y-2.5">
                {GUIDED_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full p-3 bg-muted/40 border border-border hover:border-primary/50 hover:bg-muted/70 rounded-2xl text-left transition flex items-center justify-between gap-2 shadow-2xs group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-mono font-bold">
                          {preset.tag}
                        </span>
                        <h4 className="text-xs font-black text-foreground group-hover:text-primary transition">
                          {preset.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {preset.subtitle}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Live Kinematics Telemetry Grid (Docked in Right Column) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time Const (τ)</span>
              <div className="text-base sm:text-lg font-black font-mono text-foreground mt-0.5">
                {theoreticalMetrics.tau} <span className="text-xs font-normal text-muted-foreground">s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cap Voltage (Vc)</span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
                {currentState.vc.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">V</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current (I)</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                {(currentState.i * 1000).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">mA</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stored Energy</span>
              <div className="text-base sm:text-lg font-black font-mono text-sky-400 mt-0.5">
                {(currentState.uc * 1000).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">mJ</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <DailyChallengeCard
            labId="physics/rclab"
            currentParams={{
              tau: theoreticalMetrics.tau,
              vc: currentState.vc,
              current: currentState.i * 1000,
            }}
          />
        </div>
      </div>
    </div>
  );
}
