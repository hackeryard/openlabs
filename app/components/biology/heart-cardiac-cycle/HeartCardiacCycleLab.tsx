"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import NextLabModal from "@/app/components/NextLabModal";
import {
  Heart,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Scan,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  BookOpen,
  Target,
  Info,
  Layers,
  Zap,
  Gauge,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

export type LearningMode = "beginner" | "intermediate" | "advanced";

export type CardiacPhase =
  | "ventricular_filling"
  | "atrial_systole"
  | "isovolumetric_contraction"
  | "ventricular_ejection"
  | "isovolumetric_relaxation";

export type AnatomicalStructureId =
  | "all"
  | "left_ventricle"
  | "right_ventricle"
  | "left_atrium"
  | "right_atrium"
  | "aorta"
  | "pulmonary_artery"
  | "vena_cava"
  | "mitral_valve"
  | "aortic_valve"
  | "tricuspid_valve"
  | "pulmonary_valve";

export interface GuidedExperiment {
  id: string;
  title: string;
  objective: string;
  predictionQuestion: string;
  predictionOptions: string[];
  correctPredictionIndex: number;
  targetParam: "bpm" | "contractility" | "afterload";
  targetValue: number;
  initialValue: number;
  explanation: string;
  conclusion: string;
}

export const GUIDED_EXPERIMENTS: GuidedExperiment[] = [
  {
    id: "exp_normal",
    title: "Experiment 1: Master the 5 Cardiac Phases",
    objective: "Identify the mechanical interplay of electrical triggers, wall tension, and valve coaptation.",
    predictionQuestion: "During Isovolumetric Ventricular Contraction, what is the mechanical state of all 4 cardiac valves?",
    predictionOptions: [
      "AV valves open, Semilunar valves closed",
      "All 4 valves are locked shut while ventricles build high pressure",
      "Semilunar valves open, AV valves closed",
    ],
    correctPredictionIndex: 1,
    targetParam: "bpm",
    targetValue: 72,
    initialValue: 72,
    explanation: "Because blood is incompressible and both inflow (AV) and outflow (Semilunar) valves are firmly closed, ventricular tension rises steeply (dP/dt peak) with zero volume change.",
    conclusion: "Isovolumetric contraction generates the S1 'Lub' sound and builds the pressure gradient needed to overcome aortic diastolic pressure.",
  },
  {
    id: "exp_tachycardia",
    title: "Experiment 2: Tachycardia & Diastolic Filling",
    objective: "Examine how rapid heart rates selectively compromise the diastolic filling window.",
    predictionQuestion: "When Heart Rate increases from 72 BPM to 160 BPM, which phase suffers the greatest proportional time loss?",
    predictionOptions: [
      "Ventricular Ejection duration",
      "Isovolumetric Contraction duration",
      "Ventricular Diastolic Filling window",
    ],
    correctPredictionIndex: 2,
    targetParam: "bpm",
    targetValue: 160,
    initialValue: 72,
    explanation: "At elevated heart rates, systolic ejection time remains relatively fixed (~0.22s), forcing the diastolic filling phase to contract from ~0.55s down to <0.15s.",
    conclusion: "Extreme tachycardia reduces End-Diastolic Volume (EDV) due to incomplete passive ventricular inflow, eventually reducing stroke volume.",
  },
  {
    id: "exp_afterload",
    title: "Experiment 3: Hypertension & Aortic Resistance",
    objective: "Observe how elevated systemic vascular resistance delays aortic valve opening.",
    predictionQuestion: "If systemic afterload rises to 140 mmHg, what must occur before the aortic valve can open?",
    predictionOptions: [
      "Left ventricular pressure must exceed 140 mmHg before aortic leaflets open",
      "The mitral valve stays open during ejection",
      "Ventricular volume drops to zero immediately",
    ],
    correctPredictionIndex: 0,
    targetParam: "afterload",
    targetValue: 135,
    initialValue: 80,
    explanation: "The aortic semilunar valve is a passive check valve that only opens when pressure in the left ventricle strictly exceeds the pressure in the aortic root.",
    conclusion: "High afterload prolongs the isovolumetric contraction phase and increases myocardial wall stress and oxygen consumption.",
  },
];

interface StreamParticle {
  id: number;
  circuit: "deox" | "ox";
  streamIndex: number;
  t: number;
  speed: number;
  size: number;
  opacity: number;
}

export default function HeartCardiacCycleLab() {
  const { setExperimentData } = useChat();
  const {
    completeExperiment,
    xpResult,
    nextLabProgression,
    showNextLabModal,
    setShowNextLabModal,
  } = useLab("biology/heart-cardiac-cycle", "biology", "simulation");

  // Learning Mode & Progressive Disclosure
  const [learningMode, setLearningMode] = useState<LearningMode>("intermediate");
  const [viewMode, setViewMode] = useState<"anatomical" | "xray_fluoro">("anatomical");

  // Playback & Cycle Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cycleFraction, setCycleFraction] = useState<number>(0.0);

  // Physiological Sliders
  const [bpm, setBpm] = useState<number>(72);
  const [contractility, setContractility] = useState<number>(1.0);
  const [afterload, setAfterload] = useState<number>(80);
  const [edv, setEdv] = useState<number>(120);

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Focus Mode & Interactive Anatomy Explorer
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructureId>("all");
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Guided Experiments State
  const [activeExperimentIndex, setActiveExperimentIndex] = useState<number | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [experimentStep, setExperimentStep] = useState<"predict" | "observe" | "conclude">("predict");

  // Telemetry Monitor Tab: ECG / ABP / Wiggers
  const [telemetryTab, setTelemetryTab] = useState<"ecg" | "abp" | "wiggers">("ecg");
  const tabRef = useRef<"ecg" | "abp" | "wiggers">("ecg");
  tabRef.current = telemetryTab;

  // Refs for smooth 60fps loop
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const lastSoundRef = useRef<string>("");
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const speedRef = useRef(playbackSpeed);
  speedRef.current = playbackSpeed;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const systolicBpRef = useRef(120);

  // 48 Continuous Fluid Streamline Particles
  const [particles, setParticles] = useState<StreamParticle[]>(() => {
    const list: StreamParticle[] = [];
    for (let i = 0; i < 48; i++) {
      const isDeox = i < 24;
      list.push({
        id: i,
        circuit: isDeox ? "deox" : "ox",
        streamIndex: i % 4,
        t: (i % 24) / 24,
        speed: 0.28 + (i % 3) * 0.02,
        size: 3.8,
        opacity: 0.9,
      });
    }
    return list;
  });

  // Current Cardiac Phase determination from cycle fraction
  const currentPhase: CardiacPhase = useMemo(() => {
    if (cycleFraction < 0.15) return "atrial_systole";
    if (cycleFraction < 0.28) return "isovolumetric_contraction";
    if (cycleFraction < 0.50) return "ventricular_ejection";
    if (cycleFraction < 0.62) return "isovolumetric_relaxation";
    return "ventricular_filling";
  }, [cycleFraction]);

  // Valve states (Open / Closed) synchronized with phase
  const valveStates = useMemo(() => {
    const isAvOpen = currentPhase === "ventricular_filling" || currentPhase === "atrial_systole";
    const isSemilunarOpen = currentPhase === "ventricular_ejection";
    return {
      tricuspid: isAvOpen ? "OPEN" : "CLOSED",
      mitral: isAvOpen ? "OPEN" : "CLOSED",
      aortic: isSemilunarOpen ? "OPEN" : "CLOSED",
      pulmonary: isSemilunarOpen ? "OPEN" : "CLOSED",
    };
  }, [currentPhase]);

  // Hemodynamic calculations
  const strokeVolume = useMemo(() => {
    const baseEsv = 50;
    const contractilityFactor = 1.5 - contractility * 0.5;
    const afterloadFactor = afterload / 80;
    const esvCalc = Math.max(25, Math.min(edv - 15, baseEsv * contractilityFactor * afterloadFactor));
    return Math.round(edv - esvCalc);
  }, [edv, contractility, afterload]);

  const esv = useMemo(() => Math.round(edv - strokeVolume), [edv, strokeVolume]);
  const ejectionFraction = useMemo(() => Math.min(95, Math.max(15, Math.round((strokeVolume / edv) * 100))), [strokeVolume, edv]);
  const cardiacOutput = useMemo(() => ((bpm * strokeVolume) / 1000).toFixed(1), [bpm, strokeVolume]);
  const systolicBp = useMemo(() => Math.round(afterload + strokeVolume * 0.9 * contractility), [afterload, strokeVolume, contractility]);
  const mapPressure = useMemo(() => Math.round(afterload + (systolicBp - afterload) / 3), [afterload, systolicBp]);
  systolicBpRef.current = systolicBp;

  // Register AI tutor context
  useEffect(() => {
    setExperimentData({
      title: "Cardiac Cycle, ECG & Heart Hemodynamics Simulation Studio",
      theory:
        "The cardiac cycle encompasses the electrical and mechanical events of a single heartbeat: Ventricular Filling, Atrial Systole, Isovolumetric Ventricular Contraction, Ventricular Ejection, and Isovolumetric Relaxation. Valves open and close strictly in response to pressure differentials. S1 'Lub' represents AV valve closure; S2 'Dub' represents Semilunar valve closure.",
      extraContext: `Current Heart Rate: ${bpm} BPM, Phase: ${currentPhase}, SV: ${strokeVolume} mL, CO: ${cardiacOutput} L/min, EF: ${ejectionFraction}%, Blood Pressure: ${systolicBp}/${afterload} mmHg.`,
    });
  }, [bpm, currentPhase, strokeVolume, cardiacOutput, ejectionFraction, systolicBp, afterload, setExperimentData]);

  // Audio synthesis for S1 and S2 heart sounds
  const playHeartSound = useCallback((type: "s1" | "s2") => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "suspended") ctx?.resume();
      if (!ctx) return;

      const now = ctx.currentTime;
      if (type === "s1") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === "s2") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.10);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch {}
  }, [audioEnabled]);

  // Pure Canvas Oscilloscope Renderer
  const renderCanvasFrame = useCallback((fraction: number, activeTab: "ecg" | "abp" | "wiggers") => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const currentSystolic = systolicBpRef.current;

    // Dark CRT Monitor Background & Grid
    ctx.fillStyle = "#010611";
    ctx.fillRect(0, 0, width, height);

    const gridColor =
      activeTab === "ecg"
        ? "rgba(16, 185, 129, 0.08)"
        : activeTab === "abp"
        ? "rgba(244, 63, 94, 0.08)"
        : "rgba(168, 85, 247, 0.08)";

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const sweepX = fraction * width;

    if (activeTab === "ecg") {
      // 1. LEAD II ECG (EMERALD)
      const midY = height * 0.52;
      const getVoltage = (phaseT: number) => {
        if (phaseT < 0.08) return 0;
        if (phaseT < 0.15) {
          const p = (phaseT - 0.08) / 0.07;
          return Math.sin(p * Math.PI) * 0.22;
        }
        if (phaseT < 0.20) return 0;
        if (phaseT < 0.22) {
          const p = (phaseT - 0.20) / 0.02;
          return -Math.sin(p * Math.PI) * 0.15;
        }
        if (phaseT < 0.25) {
          const p = (phaseT - 0.22) / 0.03;
          return Math.sin(p * Math.PI) * 1.35;
        }
        if (phaseT < 0.28) {
          const p = (phaseT - 0.25) / 0.03;
          return -Math.sin(p * Math.PI) * 0.35;
        }
        if (phaseT < 0.38) return 0;
        if (phaseT < 0.55) {
          const p = (phaseT - 0.38) / 0.17;
          return Math.sin(p * Math.PI) * 0.38;
        }
        return 0;
      };

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const t = x / width;
        const v = getVoltage(t);
        const y = midY - v * (height * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffffff";
      const curY = midY - getVoltage(fraction) * (height * 0.35);
      ctx.beginPath();
      ctx.arc(sweepX, curY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (activeTab === "abp") {
      // 2. ARTERIAL BLOOD PRESSURE (CRIMSON/RED WITH DICROTIC NOTCH)
      const getABP = (phaseT: number) => {
        if (phaseT < 0.28) return 80;
        if (phaseT < 0.45) {
          const p = (phaseT - 0.28) / 0.17;
          return 80 + (currentSystolic - 80) * Math.sin(p * Math.PI * 0.5);
        }
        if (phaseT < 0.55) {
          const p = (phaseT - 0.45) / 0.10;
          return currentSystolic - (currentSystolic - 90) * p + Math.sin(p * Math.PI) * 7;
        }
        const p = (phaseT - 0.55) / 0.45;
        return 90 - 10 * p;
      };

      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2.4;
      ctx.shadowColor = "#fb7185";
      ctx.shadowBlur = 10;
      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const t = x / width;
        const pVal = getABP(t);
        const y = height - (pVal / 180) * (height * 0.85);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const curP = getABP(fraction);
      const curY = height - (curP / 180) * (height * 0.85);
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sweepX, curY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // 3. WIGGERS PRESSURE-VOLUME LOOP (PURPLE)
      const xESV = width * 0.22;
      const xEDV = width * 0.78;
      const yMinP = height * 0.82;
      const yMaxP = height * 0.22;

      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#c084fc";
      ctx.shadowBlur = 10;
      ctx.beginPath();

      ctx.moveTo(xEDV, yMinP);
      ctx.lineTo(xEDV, yMaxP + 18);
      ctx.quadraticCurveTo(width * 0.5, yMaxP, xESV, yMaxP + 22);
      ctx.lineTo(xESV, yMinP);
      ctx.closePath();
      ctx.stroke();

      let curX = xEDV;
      let curY = yMinP;
      if (fraction < 0.15) {
        curX = xEDV;
        curY = yMinP;
      } else if (fraction < 0.28) {
        curX = xEDV;
        curY = yMinP - ((fraction - 0.15) / 0.13) * (yMinP - yMaxP);
      } else if (fraction < 0.50) {
        const p = (fraction - 0.28) / 0.22;
        curX = xEDV - p * (xEDV - xESV);
        curY = yMaxP + Math.sin(p * Math.PI) * 5;
      } else if (fraction < 0.62) {
        curX = xESV;
        curY = yMaxP + ((fraction - 0.50) / 0.12) * (yMinP - yMaxP);
      } else {
        const p = (fraction - 0.62) / 0.38;
        curX = xESV + p * (xEDV - xESV);
        curY = yMinP;
      }

      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(curX, curY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, []);

  // Main 60 FPS animation loop
  useEffect(() => {
    let currentFraction = cycleFraction;

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlayingRef.current) {
        const cycleDuration = 60 / bpmRef.current / speedRef.current;
        currentFraction = (currentFraction + delta / cycleDuration) % 1.0;
        setCycleFraction(currentFraction);

        // Sound triggers
        if (currentFraction >= 0.15 && currentFraction < 0.28) {
          if (lastSoundRef.current !== "s1") {
            playHeartSound("s1");
            lastSoundRef.current = "s1";
          }
        } else if (currentFraction >= 0.50 && currentFraction < 0.62) {
          if (lastSoundRef.current !== "s2") {
            playHeartSound("s2");
            lastSoundRef.current = "s2";
          }
        } else if (currentFraction >= 0.62) {
          lastSoundRef.current = "";
        }

        // Particle streamline motion
        let flowMultiplier = 1.0;
        if (currentFraction >= 0.28 && currentFraction < 0.50) flowMultiplier = 3.6;
        else if (currentFraction >= 0.62 || currentFraction < 0.15) flowMultiplier = 2.4;
        else flowMultiplier = 0.15;

        setParticles((prev) =>
          prev.map((p) => {
            const step = (delta * p.speed * (bpmRef.current / 72) * flowMultiplier * speedRef.current) % 1.0;
            return {
              ...p,
              t: (p.t + step) % 1.0,
            };
          })
        );
      }

      renderCanvasFrame(currentFraction, tabRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playHeartSound, renderCanvasFrame]);

  // Smooth Catmull-Rom Flow Coordinate Mapping
  const getDeoxCoord = (t: number, streamIdx: number) => {
    const latOffset = (streamIdx - 1.5) * 6;
    let x = 180;
    let y = 30;

    if (t < 0.25) {
      const p = t / 0.25;
      x = 182 + latOffset + Math.sin(p * Math.PI) * 4;
      y = 30 + 120 * p;
    } else if (t < 0.52) {
      const p = (t - 0.25) / 0.27;
      x = 195 + latOffset * (1 - p * 0.3) + 25 * Math.sin(p * Math.PI * 0.7);
      y = 150 + 175 * p;
    } else if (t < 0.80) {
      const p = (t - 0.52) / 0.28;
      x = 225 + 15 * Math.sin(p * Math.PI) - 20 * p;
      y = 325 - 210 * p;
    } else {
      const p = (t - 0.80) / 0.20;
      x = 205 - 75 * p;
      y = 115 - 45 * Math.sin(p * Math.PI * 0.5);
    }
    return { x, y };
  };

  const getOxCoord = (t: number, streamIdx: number) => {
    const latOffset = (streamIdx - 1.5) * 6;
    let x = 420;
    let y = 140;

    if (t < 0.22) {
      const p = t / 0.22;
      x = 420 - 75 * p + latOffset;
      y = 140 + 15 * Math.sin(p * Math.PI);
    } else if (t < 0.54) {
      const p = (t - 0.22) / 0.32;
      x = 345 - 35 * Math.sin(p * Math.PI * 0.6) + latOffset * 0.8;
      y = 155 + 190 * p;
    } else if (t < 0.82) {
      const p = (t - 0.54) / 0.28;
      x = 325 - 45 * Math.sin(p * Math.PI * 0.6);
      y = 345 - 230 * p;
    } else {
      const p = (t - 0.82) / 0.18;
      x = 280 + 85 * Math.sin(p * Math.PI * 0.5);
      y = 115 - 85 * Math.sin(p * Math.PI * 0.5);
    }
    return { x, y };
  };

  // Phase Jump Helper
  const jumpToPhase = (phase: CardiacPhase) => {
    setIsPlaying(false);
    switch (phase) {
      case "atrial_systole":
        setCycleFraction(0.08);
        break;
      case "isovolumetric_contraction":
        setCycleFraction(0.20);
        break;
      case "ventricular_ejection":
        setCycleFraction(0.38);
        break;
      case "isovolumetric_relaxation":
        setCycleFraction(0.55);
        break;
      case "ventricular_filling":
      default:
        setCycleFraction(0.75);
        break;
    }
  };

  // Step forward/backward helper
  const stepPhase = (direction: "prev" | "next") => {
    setIsPlaying(false);
    const phases: CardiacPhase[] = [
      "atrial_systole",
      "isovolumetric_contraction",
      "ventricular_ejection",
      "isovolumetric_relaxation",
      "ventricular_filling",
    ];
    const currentIndex = phases.indexOf(currentPhase);
    let targetIndex = direction === "next" ? (currentIndex + 1) % phases.length : (currentIndex - 1 + phases.length) % phases.length;
    jumpToPhase(phases[targetIndex]);
  };

  // Focus Mode Camera & Zoom style helper
  const getHeartTransform = () => {
    if (!isFocusMode || selectedStructure === "all") {
      const isPumping = currentPhase === "ventricular_ejection" || currentPhase === "isovolumetric_contraction";
      return `scale(${isPumping ? 0.98 : 1.01})`;
    }

    switch (selectedStructure) {
      case "left_ventricle":
        return "scale(1.3) translate(-40px, -50px)";
      case "right_ventricle":
        return "scale(1.3) translate(40px, -50px)";
      case "mitral_valve":
        return "scale(1.5) translate(-45px, -15px)";
      case "aortic_valve":
        return "scale(1.5) translate(-10px, 35px)";
      case "aorta":
        return "scale(1.35) translate(-25px, 70px)";
      case "pulmonary_artery":
        return "scale(1.35) translate(25px, 70px)";
      default:
        return "scale(1.15)";
    }
  };

  // Dynamic Contextual Explanation Data
  const phaseDetails = useMemo(() => {
    switch (currentPhase) {
      case "atrial_systole":
        return {
          title: "Atrial Systole (Active Filling Kick)",
          timeWindow: "0.00s – 0.15s (10–15% of cycle)",
          ecgEvent: "P Wave (Atrial Depolarization)",
          ecgExplanation: "SA node depolarization spreads across atria, triggering muscular atrial contraction.",
          mechanicalEvent: "Atria contract, forcing remaining 20–30% of blood into ventricles.",
          valves: "AV Valves (Mitral/Tricuspid) OPEN • Semilunar Valves CLOSED",
          pressureState: "Atrial P > Ventricular P (transient small pressure gradient)",
          volumeState: "Ventricles reach End-Diastolic Volume (EDV = " + edv + " mL)",
          whyQuestion: "Why do the atria contract right before ventricular systole?",
          whyAnswer: "Atrial contraction ('atrial kick') completes ventricular filling and maximally stretches ventricular sarcomeres (Frank-Starling law) right before the ventricles fire.",
        };
      case "isovolumetric_contraction":
        return {
          title: "Isovolumetric Ventricular Contraction",
          timeWindow: "0.15s – 0.28s (Beginning of Systole)",
          ecgEvent: "QRS Complex (Ventricular Depolarization)",
          ecgExplanation: "Electrical wave rapidly travels via Bundle of His and Purkinje fibers to trigger massive ventricular contraction.",
          mechanicalEvent: "Ventricles contract with tremendous power with ALL 4 VALVES CLOSED.",
          valves: "ALL 4 VALVES CLOSED (Mitral/Tricuspid snap shut -> S1 'Lub' Sound)",
          pressureState: "Ventricular P rises steeply (dP/dt high) from ~10 mmHg toward " + afterload + " mmHg",
          volumeState: "Volume CONSTANT at End-Diastolic Volume (" + edv + " mL)",
          whyQuestion: "Why does ventricular pressure rise so rapidly while volume is unchanged?",
          whyAnswer: "Because blood is an incompressible liquid and all 4 inlet/outlet valves are locked shut. Myocardial wall tension spikes until ventricular pressure overcomes aortic afterload.",
        };
      case "ventricular_ejection":
        return {
          title: "Rapid & Reduced Ventricular Ejection",
          timeWindow: "0.28s – 0.50s (Active Ejection)",
          ecgEvent: "ST Segment & Early T Wave",
          ecgExplanation: "Ventricular myocardium remains depolarized and contracting, pushing blood at peak velocity.",
          mechanicalEvent: "Aortic and Pulmonary valves forced open; blood vigorously enters Aorta and Lungs.",
          valves: "Semilunar (Aortic/Pulmonary) OPEN • AV (Mitral/Tricuspid) CLOSED",
          pressureState: "Ventricular P exceeds Aortic P (Peak Systolic P = " + systolicBp + " mmHg)",
          volumeState: "Volume drops rapidly from EDV (" + edv + " mL) to ESV (" + esv + " mL). Stroke Volume = " + strokeVolume + " mL.",
          whyQuestion: "Why does the aortic valve open at this exact moment?",
          whyAnswer: "Left Ventricular pressure crossed the aortic afterload threshold (" + afterload + " mmHg). The pressure gradient pushed the passive semilunar leaflets open.",
        };
      case "isovolumetric_relaxation":
        return {
          title: "Isovolumetric Ventricular Relaxation",
          timeWindow: "0.50s – 0.62s (Beginning of Diastole)",
          ecgEvent: "Late T Wave (Ventricular Repolarization)",
          ecgExplanation: "Ventricles repolarize and relax; intracellular calcium is sequestered.",
          mechanicalEvent: "Ventricles relax; blood in aorta rebounds against semilunar cusps -> S2 'Dub' Sound.",
          valves: "ALL 4 VALVES CLOSED (Semilunar Valves snap shut -> Dicrotic Notch & S2 Sound)",
          pressureState: "Ventricular P plummets precipitously below aortic pressure",
          volumeState: "Volume CONSTANT at End-Systolic Volume (ESV = " + esv + " mL)",
          whyQuestion: "What causes the S2 'Dub' heart sound and the Dicrotic Notch?",
          whyAnswer: "As ventricular pressure drops below aortic pressure, blood briefly flows backward toward the heart, snapping the aortic and pulmonary valves shut with a sharp rebound (Dicrotic Notch).",
        };
      case "ventricular_filling":
      default:
        return {
          title: "Ventricular Diastolic Filling (Rapid & Diastasis)",
          timeWindow: "0.62s – 1.00s (Passive Filling Window)",
          ecgEvent: "Isoelectric TP Baseline",
          ecgExplanation: "Heart chambers rest in electrical baseline before the next SA node action potential.",
          mechanicalEvent: "AV valves open; blood passively rushes into relaxed ventricles (70-80% of filling).",
          valves: "AV Valves (Mitral/Tricuspid) OPEN • Semilunar Valves CLOSED",
          pressureState: "Ventricular P is at low baseline (~4-8 mmHg), below Atrial P",
          volumeState: "Ventricular volume passively rises from ESV (" + esv + " mL) toward EDV",
          whyQuestion: "Why do the AV valves open during ventricular relaxation?",
          whyAnswer: "When ventricular pressure falls below atrial pressure (which has been filling from venous return), the higher atrial pressure pushes the mitral and tricuspid valves open.",
        };
    }
  }, [currentPhase, edv, esv, strokeVolume, systolicBp, afterload]);

  // Structure metadata for interactive exploration
  const structureInfo = useMemo(() => {
    switch (selectedStructure) {
      case "left_ventricle":
        return {
          name: "Left Ventricle (LV)",
          role: "Main high-pressure systemic pump with 12mm thick concentric muscular myocardium.",
          state: currentPhase === "ventricular_ejection" ? "Active Ejection (Peak Systolic P = " + systolicBp + " mmHg)" : "Diastolic Filling",
          why: "Thick muscular wall is required to overcome the 80–120 mmHg afterload resistance of the entire systemic arterial tree.",
        };
      case "right_ventricle":
        return {
          name: "Right Ventricle (RV)",
          role: "Low-pressure pulmonary pump with 4mm crescent-shaped muscular wall.",
          state: currentPhase === "ventricular_ejection" ? "Ejecting into Pulmonary Artery (~25 mmHg)" : "Filling from Right Atrium",
          why: "Pumps against low-resistance pulmonary capillary bed (~25/10 mmHg), requiring much less muscle mass than LV.",
        };
      case "mitral_valve":
        return {
          name: "Mitral (Bicuspid) Valve",
          role: "High-pressure dual-cusp AV valve anchored by chordae tendineae and papillary muscles.",
          state: valveStates.mitral,
          why: valveStates.mitral === "OPEN" ? "Atrial pressure > Ventricular pressure allowing filling." : "High LV systolic pressure pushes cusps shut to prevent backflow into lungs.",
        };
      case "aortic_valve":
        return {
          name: "Aortic Semilunar Valve",
          role: "Tri-leaflet pocket valve at the root of the ascending aorta.",
          state: valveStates.aortic,
          why: valveStates.aortic === "OPEN" ? "LV pressure exceeded aortic pressure (" + afterload + " mmHg)." : "Aortic pressure > LV pressure holding cusps closed.",
        };
      case "aorta":
        return {
          name: "Ascending Aorta & Arch",
          role: "Elastic conduit distributing oxygenated blood to the brain, coronary arteries, and systemic circulation.",
          state: currentPhase === "ventricular_ejection" ? "Receiving Stroke Volume (" + strokeVolume + " mL)" : "Elastic Windkessel recoil maintaining diastolic pressure (" + afterload + " mmHg)",
          why: "High elastic fiber content stretches during systole and recoils in diastole to ensure continuous capillary perfusion.",
        };
      case "pulmonary_artery":
        return {
          name: "Pulmonary Trunk & Arteries",
          role: "Carries deoxygenated venous blood from Right Ventricle to lungs for gas exchange.",
          state: currentPhase === "ventricular_ejection" ? "Active Pulmonary Flow" : "Semilunar valve closed",
          why: "Only arteries in adult human circulation carrying deoxygenated blood.",
        };
      default:
        return null;
    }
  }, [selectedStructure, currentPhase, systolicBp, afterload, strokeVolume, valveStates]);

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 flex flex-col selection:bg-rose-500/20 font-sans pb-36">
      {/* 1. TOP SUITE HEADER */}
      <header className="border-b border-slate-800 bg-[#080e1b]/95 backdrop-blur-md sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 shadow-md shadow-rose-500/10">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 uppercase tracking-wider">
                  Cardiac Physiology & Wiggers Suite
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• 3D Medical Simulator</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                Cardiac Cycle Laboratory
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setLearningMode("beginner")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  learningMode === "beginner" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setLearningMode("intermediate")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  learningMode === "intermediate" ? "bg-rose-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Intermediate
              </button>
              <button
                onClick={() => setLearningMode("advanced")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  learningMode === "advanced" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Advanced
              </button>
            </div>

            <button
              onClick={() => setViewMode(viewMode === "anatomical" ? "xray_fluoro" : "anatomical")}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "xray_fluoro"
                  ? "bg-sky-600 border-sky-500 text-white shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Scan className="w-4 h-4" />
              <span className="hidden md:inline">{viewMode === "xray_fluoro" ? "Fluoroscopy" : "Anatomical 3D"}</span>
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                audioEnabled
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline">{audioEnabled ? "S1/S2 Active" : "Unmute Audio"}</span>
            </button>

            <button
              onClick={() => {
                setBpm(72);
                setContractility(1.0);
                setAfterload(80);
                setEdv(120);
                setSelectedStructure("all");
                setIsFocusMode(false);
                setCycleFraction(0.0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SIMULATION WORKBENCH */}
      <main className="max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* LEFT COLUMN: Controls & Focus */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <Target className="w-4 h-4 text-rose-500" />
                <span>Anatomy Focus</span>
              </div>
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                  isFocusMode ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                {isFocusMode ? "Focus ON" : "Focus Mode"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              <button
                onClick={() => { setSelectedStructure("all"); setIsFocusMode(false); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "all" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Full Heart
              </button>
              <button
                onClick={() => { setSelectedStructure("left_ventricle"); setIsFocusMode(true); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "left_ventricle" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Left Ventricle
              </button>
              <button
                onClick={() => { setSelectedStructure("right_ventricle"); setIsFocusMode(true); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "right_ventricle" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Right Ventricle
              </button>
              <button
                onClick={() => { setSelectedStructure("mitral_valve"); setIsFocusMode(true); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "mitral_valve" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Mitral Valve
              </button>
              <button
                onClick={() => { setSelectedStructure("aortic_valve"); setIsFocusMode(true); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "aortic_valve" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Aortic Valve
              </button>
              <button
                onClick={() => { setSelectedStructure("aorta"); setIsFocusMode(true); }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                  selectedStructure === "aorta" ? "bg-rose-500/20 border-rose-500/40 text-white font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Aorta & Arch
              </button>
            </div>
          </div>

          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Physiological Variables</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
            </div>

            <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Heart Rate</span>
                <span className="font-mono font-bold text-rose-400">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                step="2"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Brady (&lt;60)</span>
                <span>Normal</span>
                <span>Tachy (&gt;100)</span>
              </div>
            </div>

            {learningMode !== "beginner" && (
              <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Inotropy (Contractility)</span>
                  <span className="font-mono font-bold text-emerald-400">{contractility.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={contractility}
                  onChange={(e) => setContractility(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            )}

            {learningMode === "advanced" && (
              <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Aortic Afterload (SVR)</span>
                  <span className="font-mono font-bold text-purple-400">{afterload} mmHg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="2"
                  value={afterload}
                  onChange={(e) => setAfterload(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            )}

            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 uppercase">
                <Info size={12} /> Live Clinical Insight:
              </span>
              <p className="leading-tight text-[10px]">
                {bpm > 110
                  ? "Tachycardia severely shortens diastolic filling time, reducing end-diastolic volume."
                  : contractility > 1.2
                  ? "Enhanced inotropy increases ventricular dP/dt and raises stroke volume."
                  : afterload > 110
                  ? "Elevated afterload increases the pressure threshold before the aortic valve can open."
                  : "Normal resting hemodynamic parameters with balanced filling and ejection windows."}
              </p>
            </div>
          </div>

          {learningMode === "advanced" && (
            <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Guided Experiments</span>
              </div>
              <div className="space-y-1.5">
                {GUIDED_EXPERIMENTS.map((exp, idx) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      setActiveExperimentIndex(idx);
                      setExperimentStep("predict");
                      setSelectedPrediction(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      activeExperimentIndex === idx
                        ? "bg-sky-500/15 border-sky-500/40 text-white font-bold ring-1 ring-sky-500/30"
                        : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{exp.title.split(":")[0]}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{exp.title.split(":")[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: Semi-3D Anatomical Heart Cross-Section */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div
            className={`border rounded-2xl p-4 sm:p-5 shadow-2xl relative flex flex-col transition-colors duration-500 ${
              viewMode === "xray_fluoro"
                ? "bg-[#020610] border-sky-900/50 shadow-sky-950/20"
                : "bg-[#080e1c] border-slate-800/90 shadow-slate-950/50"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  {phaseDetails.title}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                t = {(cycleFraction * (60 / bpm)).toFixed(2)}s / {(60 / bpm).toFixed(2)}s
              </div>
            </div>

            {/* SVG ORGANIC SEMI-3D HEART STAGE */}
            <div className="py-2 relative flex items-center justify-center min-h-[460px]">
              <svg
                viewBox="0 0 600 480"
                className="w-full max-w-[560px] h-auto drop-shadow-2xl select-none transition-transform duration-300 ease-out"
                style={{ transform: getHeartTransform() }}
              >
                <defs>
                  <radialGradient id="myoHeartOuter" cx="48%" cy="40%" r="58%">
                    <stop offset="0%" stopColor="#9f1239" />
                    <stop offset="45%" stopColor="#881337" />
                    <stop offset="80%" stopColor="#4c0519" />
                    <stop offset="100%" stopColor="#1e0108" />
                  </radialGradient>

                  <linearGradient id="lvMuscularWall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#be123c" />
                    <stop offset="40%" stopColor="#9f1239" />
                    <stop offset="80%" stopColor="#700923" />
                    <stop offset="100%" stopColor="#30030d" />
                  </linearGradient>

                  <linearGradient id="rvMuscularWall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="50%" stopColor="#1e3a8a" />
                    <stop offset="90%" stopColor="#0f172a" />
                  </linearGradient>

                  <linearGradient id="aortaTubular3D" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b91c1c" />
                    <stop offset="35%" stopColor="#f87171" />
                    <stop offset="70%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </linearGradient>

                  <linearGradient id="pulmArteryTubular3D" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="35%" stopColor="#60a5fa" />
                    <stop offset="70%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#172554" />
                  </linearGradient>

                  <filter id="glowParticle">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Fluoroscopy Thoracic Rib Cage Overlay */}
                {viewMode === "xray_fluoro" && (
                  <g stroke="#0369a1" strokeWidth="1.5" opacity="0.3" fill="none">
                    <path d="M 60 100 C 180 130, 420 130, 540 100" />
                    <path d="M 60 160 C 180 190, 420 190, 540 160" />
                    <path d="M 60 220 C 180 250, 420 250, 540 220" />
                    <path d="M 60 280 C 180 310, 420 310, 540 280" />
                    <line x1="300" y1="10" x2="300" y2="460" strokeWidth="2.5" strokeDasharray="6,4" />
                  </g>
                )}

                {/* Outer Epicardium (Anatomical Heart Silhouette) */}
                <path
                  d="M 300 70 C 410 35, 515 110, 495 265 C 475 375, 330 425, 300 435 C 270 425, 125 375, 105 265 C 85 110, 190 35, 300 70 Z"
                  fill={viewMode === "xray_fluoro" ? "#082f49" : "url(#myoHeartOuter)"}
                  stroke={viewMode === "xray_fluoro" ? "#38bdf8" : "#5a0820"}
                  strokeWidth="8"
                  opacity={selectedStructure !== "all" && selectedStructure !== "left_ventricle" && selectedStructure !== "right_ventricle" ? 0.35 : 0.98}
                />

                {/* Superior Vena Cava (SVC) */}
                <g onClick={() => { setSelectedStructure("vena_cava"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 155 15 C 155 65, 160 110, 165 145 L 205 145 C 200 110, 195 65, 195 15 Z"
                    fill="url(#pulmArteryTubular3D)"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  <g transform="translate(85, 20)">
                    <rect x="0" y="0" width="80" height="20" rx="6" fill="#091122" stroke="#1e3a8a" strokeWidth="1" />
                    <text x="40" y="14" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">SVC (Inflow)</text>
                  </g>
                </g>

                {/* Ascending Aorta & Arch with 3 Supra-aortic Branches */}
                <g onClick={() => { setSelectedStructure("aorta"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 280 125 C 280 45, 380 15, 420 65 L 390 92 C 355 65, 305 85, 305 125 Z"
                    fill="url(#aortaTubular3D)"
                    stroke="#991b1b"
                    strokeWidth="2"
                  />
                  <path d="M 340 48 L 340 10 M 365 54 L 365 10 M 390 68 L 390 20" stroke="#ef4444" strokeWidth="6.5" strokeLinecap="round" />
                  <g transform="translate(425, 15)">
                    <rect x="0" y="0" width="85" height="20" rx="6" fill="#091122" stroke="#991b1b" strokeWidth="1" />
                    <text x="42" y="14" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">Aorta & Arch</text>
                  </g>
                </g>

                {/* Pulmonary Trunk */}
                <g onClick={() => { setSelectedStructure("pulmonary_artery"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 250 130 C 250 70, 205 65, 160 82 L 168 108 C 200 95, 222 105, 222 138 Z"
                    fill="url(#pulmArteryTubular3D)"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  <g transform="translate(45, 80)">
                    <rect x="0" y="0" width="95" height="20" rx="6" fill="#091122" stroke="#1e3a8a" strokeWidth="1" />
                    <text x="47" y="14" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">Pulmonary Trunk</text>
                  </g>
                </g>

                {/* Pulmonary Veins */}
                <path d="M 445 145 L 495 145 L 495 178 L 445 178 Z" fill="url(#aortaTubular3D)" stroke="#991b1b" strokeWidth="2" />
                <g transform="translate(500, 150)">
                  <rect x="0" y="0" width="75" height="20" rx="6" fill="#091122" stroke="#991b1b" strokeWidth="1" />
                  <text x="37" y="14" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">Pulm. Veins</text>
                </g>

                {/* RIGHT ATRIUM LUMEN */}
                <g onClick={() => { setSelectedStructure("right_atrium"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 160 135 C 155 195, 190 215, 240 215 L 240 135 Z"
                    fill="#1e40af"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity={currentPhase === "atrial_systole" ? 1.0 : 0.85}
                  />
                  <g transform="translate(155, 165)">
                    <rect x="0" y="0" width="88" height="20" rx="6" fill="#091122" stroke="#3b82f6" strokeWidth="1" opacity="0.9" />
                    <text x="44" y="14" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Right Atrium</text>
                  </g>
                </g>

                {/* LEFT ATRIUM LUMEN */}
                <g onClick={() => { setSelectedStructure("left_atrium"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 355 135 L 355 215 C 405 215, 440 195, 440 135 Z"
                    fill="#991b1b"
                    stroke="#ef4444"
                    strokeWidth="2"
                    opacity={currentPhase === "atrial_systole" ? 1.0 : 0.85}
                  />
                  <g transform="translate(352, 165)">
                    <rect x="0" y="0" width="84" height="20" rx="6" fill="#091122" stroke="#ef4444" strokeWidth="1" opacity="0.9" />
                    <text x="42" y="14" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Left Atrium</text>
                  </g>
                </g>

                {/* Muscular Interventricular Septum */}
                <path d="M 290 120 L 310 120 L 310 415 L 290 415 Z" fill="#4c0519" stroke="#881337" strokeWidth="2" />

                {/* RIGHT VENTRICLE LUMEN & 4mm Thin Wall */}
                <g onClick={() => { setSelectedStructure("right_ventricle"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 160 230 C 160 335, 225 385, 288 400 L 288 230 Z"
                    fill="url(#rvMuscularWall)"
                    stroke="#60a5fa"
                    strokeWidth={selectedStructure === "right_ventricle" ? 4 : 2}
                    opacity={currentPhase === "ventricular_ejection" ? 1.0 : 0.9}
                  />
                  <g transform="translate(162, 285)">
                    <rect x="0" y="0" width="116" height="34" rx="6" fill="#091122" stroke="#60a5fa" strokeWidth="1" opacity="0.9" />
                    <text x="58" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Right Ventricle</text>
                    <text x="58" y="28" fill="#bfdbfe" fontSize="9" textAnchor="middle">25/4 mmHg (4mm wall)</text>
                  </g>
                </g>

                {/* LEFT VENTRICLE LUMEN & 12mm Thick Muscular Wall */}
                <g onClick={() => { setSelectedStructure("left_ventricle"); setIsFocusMode(true); }} className="cursor-pointer">
                  <path
                    d="M 312 230 L 312 400 C 370 385, 435 335, 435 230 Z"
                    fill="url(#lvMuscularWall)"
                    stroke="#f87171"
                    strokeWidth={selectedStructure === "left_ventricle" ? 5 : 3.5}
                    opacity={currentPhase === "ventricular_ejection" ? 1.0 : 0.95}
                  />
                  <g transform="translate(316, 285)">
                    <rect x="0" y="0" width="116" height="34" rx="6" fill="#091122" stroke="#f87171" strokeWidth="1" opacity="0.9" />
                    <text x="58" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Left Ventricle</text>
                    <text x="58" y="28" fill="#fecaca" fontSize="9" textAnchor="middle">
                      {systolicBp}/{Math.round(afterload * 0.1)} mmHg (12mm)
                    </text>
                  </g>
                </g>

                {/* 4 DYNAMIC VALVES */}
                {/* 1. Tricuspid Valve */}
                <g transform="translate(200, 222)" onClick={() => { setSelectedStructure("tricuspid_valve"); setIsFocusMode(true); }} className="cursor-pointer">
                  <line
                    x1="-22"
                    y1="0"
                    x2="22"
                    y2="0"
                    stroke={valveStates.tricuspid === "OPEN" ? "#22c55e" : "#f8fafc"}
                    strokeWidth="4.5"
                    strokeDasharray={valveStates.tricuspid === "OPEN" ? "6,6" : "none"}
                  />
                  <line x1="-14" y1="0" x2="-8" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="14" y1="0" x2="8" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                  <circle cx="-8" cy="28" r="3.5" fill="#881337" />
                  <circle cx="8" cy="28" r="3.5" fill="#881337" />
                </g>

                {/* 2. Mitral Valve */}
                <g transform="translate(395, 222)" onClick={() => { setSelectedStructure("mitral_valve"); setIsFocusMode(true); }} className="cursor-pointer">
                  <line
                    x1="-22"
                    y1="0"
                    x2="22"
                    y2="0"
                    stroke={valveStates.mitral === "OPEN" ? "#22c55e" : "#f8fafc"}
                    strokeWidth="4.5"
                    strokeDasharray={valveStates.mitral === "OPEN" ? "6,6" : "none"}
                  />
                  <line x1="-14" y1="0" x2="-8" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="14" y1="0" x2="8" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                  <circle cx="-8" cy="28" r="4" fill="#881337" />
                  <circle cx="8" cy="28" r="4" fill="#881337" />
                </g>

                {/* 3. Aortic Valve */}
                <g transform="translate(305, 135)" onClick={() => { setSelectedStructure("aortic_valve"); setIsFocusMode(true); }} className="cursor-pointer">
                  <circle cx="0" cy="0" r="10" fill={valveStates.aortic === "OPEN" ? "#22c55e" : "#e11d48"} stroke="#ffffff" strokeWidth="2.5" />
                </g>

                {/* 4. Pulmonary Valve */}
                <g transform="translate(235, 135)" onClick={() => { setSelectedStructure("pulmonary_valve"); setIsFocusMode(true); }} className="cursor-pointer">
                  <circle cx="0" cy="0" r="10" fill={valveStates.pulmonary === "OPEN" ? "#22c55e" : "#2563eb"} stroke="#ffffff" strokeWidth="2.5" />
                </g>

                {/* CONTINUOUS ERYTHROCYTE FLUID STREAMLINES */}
                <g className="pointer-events-none">
                  {particles.map((p) => {
                    if (p.circuit === "deox") {
                      const coord = getDeoxCoord(p.t, p.streamIndex);
                      return (
                        <g key={p.id} transform={`translate(${coord.x}, ${coord.y})`}>
                          <circle r={p.size} fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" opacity={p.opacity} filter="url(#glowParticle)" />
                          <circle r={p.size * 0.4} fill="#ffffff" opacity={p.opacity} />
                        </g>
                      );
                    } else {
                      const coord = getOxCoord(p.t, p.streamIndex);
                      return (
                        <g key={p.id} transform={`translate(${coord.x}, ${coord.y})`}>
                          <circle r={p.size} fill="#f87171" stroke="#b91c1c" strokeWidth="1.2" opacity={p.opacity} filter="url(#glowParticle)" />
                          <circle r={p.size * 0.4} fill="#ffffff" opacity={p.opacity} />
                        </g>
                      );
                    }
                  })}
                </g>
              </svg>
            </div>

            {/* Structure Detail Popover */}
            {structureInfo && (
              <div className="p-3 bg-slate-900/95 rounded-xl border border-slate-700/80 text-xs space-y-1.5 mt-1 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Info size={14} className="text-rose-400" />
                    {structureInfo.name}
                  </span>
                  <button
                    onClick={() => { setSelectedStructure("all"); setIsFocusMode(false); }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <p className="text-slate-300 text-[11px]">{structureInfo.role}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-semibold">CURRENT STATE</span>
                    <span className="text-emerald-400 font-bold">{structureInfo.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">PHYSIOLOGICAL REASON</span>
                    <span className="text-slate-200">{structureInfo.why}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time ICU Telemetry Bedside Monitor */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="bg-[#040813] border border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">ICU Telemetry Monitor</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">25 mm/s</span>
              </div>
            </div>

            {/* Monitor Mode Switcher */}
            <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
              <button
                onClick={() => {
                  tabRef.current = "ecg";
                  setTelemetryTab("ecg");
                }}
                className={`flex-1 py-1 rounded transition ${
                  telemetryTab === "ecg" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Lead II ECG
              </button>
              <button
                onClick={() => {
                  tabRef.current = "abp";
                  setTelemetryTab("abp");
                }}
                className={`flex-1 py-1 rounded transition ${
                  telemetryTab === "abp" ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Arterial ABP
              </button>
              <button
                onClick={() => {
                  tabRef.current = "wiggers";
                  setTelemetryTab("wiggers");
                }}
                className={`flex-1 py-1 rounded transition ${
                  telemetryTab === "wiggers" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Wiggers Loops
              </button>
            </div>

            {/* Real-time Oscilloscope Canvas */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black relative">
              <canvas
                ref={ecgCanvasRef}
                width={320}
                height={120}
                className="w-full h-[120px] block"
              />
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-emerald-400 font-sans block uppercase font-bold">HR (BPM)</span>
                  <span className="text-base font-black text-emerald-400">{bpm}</span>
                </div>
                <Heart size={16} className="text-emerald-500 animate-pulse" />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-rose-400 font-sans block uppercase font-bold">ABP (mmHg)</span>
                  <span className="text-base font-black text-rose-400">{systolicBp}/{afterload}</span>
                </div>
                <span className="text-[10px] text-rose-300 font-bold">({mapPressure})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-cyan-400 font-sans block uppercase font-bold">STROKE VOL</span>
                  <span className="text-sm font-black text-cyan-400">{strokeVolume} mL</span>
                </div>
                <span className="text-[10px] text-slate-400">EF {ejectionFraction}%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-amber-400 font-sans block uppercase font-bold">CARDIAC OUT</span>
                  <span className="text-sm font-black text-amber-400">{cardiacOutput} L/m</span>
                </div>
                <Zap size={14} className="text-amber-400" />
              </div>
            </div>

            {/* Electrical -> Mechanical Real-time Link */}
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
              <span className="text-emerald-400 font-bold block">{phaseDetails.ecgEvent}</span>
              <p className="text-slate-300 text-[10px] leading-tight">{phaseDetails.ecgExplanation}</p>
            </div>
          </div>

          {/* "Why Did This Happen?" Learning Hub */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Why Did This Happen?</span>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1.5">
              <span className="text-amber-300 font-bold block">{phaseDetails.whyQuestion}</span>
              <p className="text-slate-300 text-[11px] leading-snug">{phaseDetails.whyAnswer}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <button
                onClick={() => jumpToPhase("isovolumetric_contraction")}
                className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition flex items-center justify-between"
              >
                <span>Why do AV valves close first?</span>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
              <button
                onClick={() => jumpToPhase("ventricular_ejection")}
                className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition flex items-center justify-between"
              >
                <span>Why does blood leave the ventricle?</span>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
              <button
                onClick={() => jumpToPhase("isovolumetric_relaxation")}
                className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition flex items-center justify-between"
              >
                <span>What produces the S2 'Dub' sound?</span>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM CARDIAC CYCLE SCRUBBER & SYNCHRONIZED TIMELINE */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#070c18]/95 backdrop-blur-md px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] sm:text-xs font-bold">
            <button
              onClick={() => jumpToPhase("atrial_systole")}
              className={`p-2 rounded-xl border transition-all ${
                currentPhase === "atrial_systole"
                  ? "bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              1. Atrial Systole
            </button>
            <button
              onClick={() => jumpToPhase("isovolumetric_contraction")}
              className={`p-2 rounded-xl border transition-all ${
                currentPhase === "isovolumetric_contraction"
                  ? "bg-amber-600 text-white border-amber-400 ring-2 ring-amber-500/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              2. Isovol. Contraction (S1)
            </button>
            <button
              onClick={() => jumpToPhase("ventricular_ejection")}
              className={`p-2 rounded-xl border transition-all ${
                currentPhase === "ventricular_ejection"
                  ? "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              3. Rapid Ejection
            </button>
            <button
              onClick={() => jumpToPhase("isovolumetric_relaxation")}
              className={`p-2 rounded-xl border transition-all ${
                currentPhase === "isovolumetric_relaxation"
                  ? "bg-purple-600 text-white border-purple-400 ring-2 ring-purple-500/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              4. Isovol. Relaxation (S2)
            </button>
            <button
              onClick={() => jumpToPhase("ventricular_filling")}
              className={`p-2 rounded-xl border transition-all ${
                currentPhase === "ventricular_filling"
                  ? "bg-sky-600 text-white border-sky-400 ring-2 ring-sky-500/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              5. Ventricular Filling
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => stepPhase("prev")}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-md transition px-3 flex items-center gap-1 text-xs"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={() => stepPhase("next")}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={cycleFraction}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCycleFraction(Number(e.target.value));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
              {[0.25, 0.5, 1.0, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded transition ${
                    playbackSpeed === speed ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Guided Experiment Modal */}
      {activeExperimentIndex !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-slate-800 max-w-lg w-full rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-base">
                {GUIDED_EXPERIMENTS[activeExperimentIndex].title}
              </h3>
              <button
                onClick={() => setActiveExperimentIndex(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {GUIDED_EXPERIMENTS[activeExperimentIndex].objective}
            </p>

            {experimentStep === "predict" && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-amber-400 block">
                  {GUIDED_EXPERIMENTS[activeExperimentIndex].predictionQuestion}
                </span>
                <div className="space-y-2">
                  {GUIDED_EXPERIMENTS[activeExperimentIndex].predictionOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPrediction(idx)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                        selectedPrediction === idx
                          ? "bg-rose-500/20 border-rose-500/40 text-white font-semibold"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  disabled={selectedPrediction === null}
                  onClick={() => {
                    setExperimentStep("observe");
                    const exp = GUIDED_EXPERIMENTS[activeExperimentIndex];
                    if (exp.targetParam === "bpm") setBpm(exp.targetValue);
                    if (exp.targetParam === "afterload") setAfterload(exp.targetValue);
                    if (exp.targetParam === "contractility") setContractility(exp.targetValue);
                    setIsPlaying(true);
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow"
                >
                  Confirm Prediction & Run Simulation
                </button>
              </div>
            )}

            {experimentStep === "observe" && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-400 block">Simulation Applied</span>
                  <p className="text-slate-300 text-[11px]">
                    {GUIDED_EXPERIMENTS[activeExperimentIndex].explanation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setExperimentStep("conclude");
                    completeExperiment();
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow"
                >
                  Complete Experiment & Earn XP
                </button>
              </div>
            )}

            {experimentStep === "conclude" && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-300 block">Scientific Conclusion</span>
                  <p className="text-slate-200 text-[11px]">
                    {GUIDED_EXPERIMENTS[activeExperimentIndex].conclusion}
                  </p>
                </div>
                <button
                  onClick={() => setActiveExperimentIndex(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Return to Studio
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Lab Modal */}
      {showNextLabModal && nextLabProgression && (
        <NextLabModal
          isOpen={showNextLabModal}
          onClose={() => setShowNextLabModal(false)}
          xpEarned={xpResult?.xpEarned || 50}
          track={nextLabProgression.track}
          nextStep={nextLabProgression.nextStep}
          isFinalStep={nextLabProgression.isFinalStep}
          trackPercentage={nextLabProgression.trackPercentage}
        />
      )}
    </div>
  );
}
