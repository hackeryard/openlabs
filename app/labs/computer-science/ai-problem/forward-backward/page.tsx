"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Sliders,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Info,
  Maximize2,
  RefreshCw,
  Eye,
  Crosshair,
  TrendingDown,
  TrendingUp,
  Gauge,
  CircleDot,
  Compass,
  Activity,
  Calculator,
  Binary,
  Cpu,
  Flame,
  AlertTriangle,
  FileCode,
  Grid,
  ShieldCheck,
  BookOpen,
  Split,
  Network,
  GitFork,
  FastForward,
  Search,
  Check,
  Plus,
  Trash2,
  ShieldAlert,
  Stethoscope,
  Radio,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & First-Order Logic Formulations ────────────────────────────
type InferenceEngineMode = "forward" | "backward";
type KnowledgeDomain = "medical" | "zoology" | "cybersecurity";
type ConflictResolution = "specificity" | "recency" | "first_rule";

interface HornRule {
  id: string;
  name: string;
  premises: string[]; // Antecedents (AND)
  conclusion: string; // Consequent
  category?: string;
  weight?: number;
}

interface DomainKnowledgeBase {
  name: string;
  subtitle: string;
  desc: string;
  availableFacts: { id: string; label: string; category: string }[];
  rules: HornRule[];
  defaultFacts: string[];
  defaultGoal: string;
}

// ── Knowledge Base Benchmark Domains ──────────────────────────────────
const KNOWLEDGE_DOMAINS: Record<KnowledgeDomain, DomainKnowledgeBase> = {
  medical: {
    name: "Medical Diagnostic Expert System",
    subtitle: "Clinical Symptom & Pathology Inference Engine",
    desc: "Infers clinical diagnoses and treatment protocols from observable patient symptoms and laboratory findings using Horn clause Modus Ponens.",
    availableFacts: [
      { id: "fever", label: "High Fever (>38.5°C)", category: "Vitals" },
      { id: "cough", label: "Persistent Cough", category: "Respiratory" },
      { id: "chills", label: "Severe Chills & Rigors", category: "Systemic" },
      { id: "wheezing", label: "Bronchial Wheezing", category: "Respiratory" },
      { id: "chest_pain", label: "Pleuritic Chest Pain", category: "Cardiovascular" },
      { id: "rash", label: "Maculopapular Rash", category: "Dermatological" },
      { id: "joint_pain", label: "Joint Pain & Arthralgia", category: "Musculoskeletal" },
      { id: "fatigue", label: "Profound Fatigue", category: "Systemic" },
    ],
    rules: [
      { id: "R1", name: "Acute Respiratory Syndrome", premises: ["fever", "cough"], conclusion: "respiratory_infection", category: "Pathology" },
      { id: "R2", name: "Bronchial Inflammation", premises: ["cough", "wheezing"], conclusion: "bronchitis", category: "Diagnosis" },
      { id: "R3", name: "Pneumonia Diagnosis", premises: ["respiratory_infection", "chills", "chest_pain"], conclusion: "pneumonia", category: "Diagnosis" },
      { id: "R4", name: "Viral Exanthem", premises: ["fever", "rash"], conclusion: "measles", category: "Diagnosis" },
      { id: "R5", name: "Viral Flu Syndrome", premises: ["fever", "fatigue", "joint_pain"], conclusion: "influenza", category: "Diagnosis" },
      { id: "R6", name: "Hospitalization Protocol", premises: ["pneumonia"], conclusion: "admit_hospital", category: "Treatment" },
      { id: "R7", name: "Antiviral Therapy", premises: ["influenza"], conclusion: "prescribe_oseltamivir", category: "Treatment" },
      { id: "R8", name: "Antibiotic Protocol", premises: ["pneumonia"], conclusion: "prescribe_azithromycin", category: "Treatment" },
    ],
    defaultFacts: ["fever", "cough", "chills", "chest_pain"],
    defaultGoal: "admit_hospital",
  },
  zoology: {
    name: "Zoological Taxonomy & Species Identification",
    subtitle: "Russell & Norvig Animal Classification System",
    desc: "Classifies biological organisms through hierarchical taxonomic rules based on anatomical and behavioral attributes.",
    availableFacts: [
      { id: "has_hair", label: "Has Hair", category: "Anatomy" },
      { id: "gives_milk", label: "Gives Milk", category: "Physiology" },
      { id: "has_feathers", label: "Has Feathers", category: "Anatomy" },
      { id: "flies", label: "Flies in Air", category: "Locomotion" },
      { id: "lays_eggs", label: "Lays Eggs", category: "Reproduction" },
      { id: "eats_meat", label: "Eats Meat", category: "Diet" },
      { id: "has_pointed_teeth", label: "Has Pointed Canine Teeth", category: "Anatomy" },
      { id: "has_claws", label: "Has Retractile Claws", category: "Anatomy" },
      { id: "has_hooves", label: "Has Hooves", category: "Anatomy" },
      { id: "tawny_color", label: "Tawny Coloration", category: "Color" },
      { id: "dark_spots", label: "Dark Spots Pattern", category: "Color" },
      { id: "black_stripes", label: "Black Stripes Pattern", category: "Color" },
      { id: "long_neck", label: "Extremely Long Neck", category: "Anatomy" },
      { id: "swims", label: "Swims Well in Water", category: "Locomotion" },
    ],
    rules: [
      { id: "Z1", name: "Mammal Rule 1", premises: ["has_hair"], conclusion: "mammal", category: "Taxonomy" },
      { id: "Z2", name: "Mammal Rule 2", premises: ["gives_milk"], conclusion: "mammal", category: "Taxonomy" },
      { id: "Z3", name: "Bird Rule 1", premises: ["has_feathers"], conclusion: "bird", category: "Taxonomy" },
      { id: "Z4", name: "Bird Rule 2", premises: ["flies", "lays_eggs"], conclusion: "bird", category: "Taxonomy" },
      { id: "Z5", name: "Carnivore Rule 1", premises: ["mammal", "eats_meat"], conclusion: "carnivore", category: "Taxonomy" },
      { id: "Z6", name: "Carnivore Rule 2", premises: ["mammal", "has_pointed_teeth", "has_claws"], conclusion: "carnivore", category: "Taxonomy" },
      { id: "Z7", name: "Ungulate Rule", premises: ["mammal", "has_hooves"], conclusion: "ungulate", category: "Taxonomy" },
      { id: "Z8", name: "Cheetah Identification", premises: ["carnivore", "tawny_color", "dark_spots"], conclusion: "cheetah", category: "Species" },
      { id: "Z9", name: "Tiger Identification", premises: ["carnivore", "tawny_color", "black_stripes"], conclusion: "tiger", category: "Species" },
      { id: "Z10", name: "Giraffe Identification", premises: ["ungulate", "long_neck", "dark_spots"], conclusion: "giraffe", category: "Species" },
      { id: "Z11", name: "Penguin Identification", premises: ["bird", "swims", "black_stripes"], conclusion: "penguin", category: "Species" },
    ],
    defaultFacts: ["has_hair", "eats_meat", "tawny_color", "black_stripes"],
    defaultGoal: "tiger",
  },
  cybersecurity: {
    name: "Threat Detection & Incident Response",
    subtitle: "SIEM & SOC Rule-Based Defense Engine",
    desc: "Correlates low-level network log events into high-fidelity attack vectors and automated counter-response actions.",
    availableFacts: [
      { id: "failed_logins", label: "Multiple Failed SSH Logins (>10)", category: "Auth" },
      { id: "port_scan", label: "Syn-Flood Port Scanning Detected", category: "Network" },
      { id: "unknown_ip", label: "Origin IP in Threat Feed", category: "Network" },
      { id: "powershell_enc", label: "Base64 Encoded PowerShell Process", category: "Host" },
      { id: "lsass_dump", label: "LSASS Process Memory Dump Access", category: "Host" },
      { id: "shadow_copy_del", label: "VSS Volume Shadow Copy Deletion", category: "Host" },
      { id: "large_egress", label: "High Volume Outbound Data Transfer", category: "Network" },
    ],
    rules: [
      { id: "C1", name: "Brute Force Recon", premises: ["failed_logins", "port_scan"], conclusion: "brute_force_attack", category: "Threat" },
      { id: "C2", name: "Malicious Origin", premises: ["unknown_ip", "port_scan"], conclusion: "reconnaissance", category: "Threat" },
      { id: "C3", name: "Credential Harvesting", premises: ["powershell_enc", "lsass_dump"], conclusion: "credential_theft", category: "Threat" },
      { id: "C4", name: "Ransomware Precursor", premises: ["powershell_enc", "shadow_copy_del"], conclusion: "ransomware_execution", category: "Threat" },
      { id: "C5", name: "APT Compromise", premises: ["credential_theft", "large_egress"], conclusion: "data_exfiltration", category: "Threat" },
      { id: "C6", name: "Automated Host Isolation", premises: ["ransomware_execution"], conclusion: "isolate_endpoint", category: "Action" },
      { id: "C7", name: "IP Firewall Block", premises: ["brute_force_attack"], conclusion: "block_ip_firewall", category: "Action" },
      { id: "C8", name: "Revoke User Credentials", premises: ["credential_theft"], conclusion: "revoke_session_tokens", category: "Action" },
    ],
    defaultFacts: ["powershell_enc", "lsass_dump", "large_egress"],
    defaultGoal: "revoke_session_tokens",
  },
};

export default function ForwardBackwardChainingLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/forward-backward",
    "computerScience",
    "exploration"
  );

  // ── Problem Domain & Engine Mode ─────────────────────────────────────
  const [domain, setDomain] = useState<KnowledgeDomain>("medical");
  const [engineMode, setEngineMode] = useState<InferenceEngineMode>("forward");
  const [conflictStrategy, setConflictStrategy] = useState<ConflictResolution>("specificity");
  const [speedMs, setSpeedMs] = useState<number>(300);

  // ── Knowledge Base State ─────────────────────────────────────────────
  const activeKB = KNOWLEDGE_DOMAINS[domain];
  const [workingMemory, setWorkingMemory] = useState<Set<string>>(new Set(activeKB.defaultFacts));
  const [targetGoal, setTargetGoal] = useState<string>(activeKB.defaultGoal);
  const [firedRules, setFiredRules] = useState<string[]>([]);
  const [activeFiredRule, setActiveFiredRule] = useState<HornRule | null>(null);

  // Backward Chaining State
  const [proofTree, setProofTree] = useState<{ node: string; status: "proven" | "failed" | "active" | "given"; depth: number; ruleId?: string }[]>([]);
  const [subGoalStack, setSubGoalStack] = useState<string[]>([]);

  // Simulation Telemetry
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isGoalReached, setIsGoalReached] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [inferenceLog, setInferenceLog] = useState<{ step: number; message: string; ruleId?: string; type: "fire" | "goal" | "info" | "fail" }[]>([]);

  // UI Tabs & Milestones
  const [activeTab, setActiveTab] = useState<"inference_studio" | "rule_tensor" | "theory" | "diagnostics">("inference_studio");
  const [milestones, setMilestones] = useState({
    forwardDerived: false,
    backwardProven: false,
    testedConflictResolution: false,
    analyzedHornTheory: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Reset Problem State ──────────────────────────────────────────────
  const resetInference = useCallback(() => {
    setWorkingMemory(new Set(activeKB.defaultFacts));
    setTargetGoal(activeKB.defaultGoal);
    setFiredRules([]);
    setActiveFiredRule(null);
    setProofTree([]);
    setSubGoalStack([activeKB.defaultGoal]);
    setIsRunning(false);
    setIsGoalReached(false);
    setIsFinished(false);
    setStepCount(0);
    setInferenceLog([
      {
        step: 0,
        message: `Initialized ${activeKB.name}. Initial facts in Working Memory: [${activeKB.defaultFacts.join(", ")}]. Target goal: '${activeKB.defaultGoal}'.`,
        type: "info",
      },
    ]);
  }, [activeKB]);

  useEffect(() => {
    resetInference();
  }, [domain, resetInference]);

  // ── Toggle User Fact in Working Memory ───────────────────────────────
  const toggleFact = (factId: string) => {
    setWorkingMemory((prev) => {
      const next = new Set(prev);
      if (next.has(factId)) {
        next.delete(factId);
      } else {
        next.add(factId);
      }
      return next;
    });
    setFiredRules([]);
    setIsGoalReached(false);
    setIsFinished(false);
  };

  // ── Forward Chaining Single Step (Data-Driven Modus Ponens) ───────────
  const stepForwardChaining = useCallback(() => {
    if (isFinished || isGoalReached) return;

    // 1. Find all candidate Horn rules whose premises are completely satisfied in Working Memory
    const candidateRules = activeKB.rules.filter((rule) => {
      // Must not have already fired
      if (firedRules.includes(rule.id)) return false;
      // Conclusion must not already be in Working Memory
      if (workingMemory.has(rule.conclusion)) return false;
      // All premises must exist in working memory
      return rule.premises.every((p) => workingMemory.has(p));
    });

    if (candidateRules.length === 0) {
      setIsFinished(true);
      setIsRunning(false);
      setInferenceLog((prev) => [
        {
          step: stepCount + 1,
          message: `Forward Chaining Fixed-Point Reached (ΔWM = ∅). No more rules can fire. Target goal '${targetGoal}' ${workingMemory.has(targetGoal) ? "was successfully proved!" : "could not be derived from initial facts."}`,
          type: workingMemory.has(targetGoal) ? "goal" : "fail",
        },
        ...prev,
      ]);
      return;
    }

    // 2. Conflict Resolution: Pick rule based on strategy
    let chosenRule = candidateRules[0];
    if (conflictStrategy === "specificity") {
      // Rule with most premises (most specific)
      chosenRule = candidateRules.reduce((best, curr) =>
        curr.premises.length > best.premises.length ? curr : best
      );
    }

    // 3. Fire chosen Horn Rule (Modus Ponens)
    setActiveFiredRule(chosenRule);
    const newWM = new Set(workingMemory);
    newWM.add(chosenRule.conclusion);
    setWorkingMemory(newWM);
    setFiredRules((prev) => [...prev, chosenRule.id]);
    setStepCount((p) => p + 1);

    const isGoal = chosenRule.conclusion === targetGoal;
    if (isGoal) {
      setIsGoalReached(true);
      setIsRunning(false);
      setMilestones((p) => ({ ...p, forwardDerived: true }));
      completeExperiment();
    }

    setInferenceLog((prev) => [
      {
        step: stepCount + 1,
        message: `Fired ${chosenRule.id} (${chosenRule.name}): [${chosenRule.premises.join(" ∧ ")}] ⟹ ${chosenRule.conclusion.toUpperCase()}`,
        ruleId: chosenRule.id,
        type: isGoal ? "goal" : "fire",
      },
      ...prev.slice(0, 30),
    ]);
  }, [
    isFinished,
    isGoalReached,
    activeKB,
    firedRules,
    workingMemory,
    targetGoal,
    conflictStrategy,
    stepCount,
    completeExperiment,
  ]);

  // ── Backward Chaining Single Step (Goal-Driven AND-OR Tree Search) ───
  const stepBackwardChaining = useCallback(() => {
    if (isFinished || isGoalReached) return;

    if (subGoalStack.length === 0) {
      setIsFinished(true);
      setIsRunning(false);
      return;
    }

    const currentGoal = subGoalStack[subGoalStack.length - 1];

    // Case 1: Sub-goal is already proven / in working memory
    if (workingMemory.has(currentGoal)) {
      setSubGoalStack((prev) => prev.slice(0, -1));
      setProofTree((prev) => [
        ...prev,
        { node: currentGoal, status: "given", depth: subGoalStack.length },
      ]);
      setInferenceLog((prev) => [
        {
          step: stepCount + 1,
          message: `Goal '${currentGoal}' is directly verified as a known FACT in Working Memory.`,
          type: "info",
        },
        ...prev,
      ]);

      if (currentGoal === targetGoal) {
        setIsGoalReached(true);
        setIsRunning(false);
        setMilestones((p) => ({ ...p, backwardProven: true }));
        completeExperiment();
      }
      return;
    }

    // Case 2: Find Horn rule whose conclusion matches currentGoal
    const matchingRule = activeKB.rules.find(
      (r) => r.conclusion === currentGoal && !firedRules.includes(r.id)
    );

    if (matchingRule) {
      setActiveFiredRule(matchingRule);
      setFiredRules((prev) => [...prev, matchingRule.id]);
      setProofTree((prev) => [
        ...prev,
        { node: currentGoal, status: "active", depth: subGoalStack.length, ruleId: matchingRule.id },
      ]);

      // Push unproven premises onto subGoalStack (AND nodes)
      const unprovenPremises = matchingRule.premises.filter((p) => !workingMemory.has(p));

      if (unprovenPremises.length === 0) {
        // All premises proven! Add conclusion to working memory
        const newWM = new Set(workingMemory);
        newWM.add(currentGoal);
        setWorkingMemory(newWM);
        setSubGoalStack((prev) => prev.slice(0, -1));

        setInferenceLog((prev) => [
          {
            step: stepCount + 1,
            message: `Sub-goal '${currentGoal}' PROVED via Rule ${matchingRule.id} (${matchingRule.name})!`,
            ruleId: matchingRule.id,
            type: currentGoal === targetGoal ? "goal" : "fire",
          },
          ...prev,
        ]);

        if (currentGoal === targetGoal) {
          setIsGoalReached(true);
          setIsRunning(false);
          setMilestones((p) => ({ ...p, backwardProven: true }));
          completeExperiment();
        }
      } else {
        setSubGoalStack((prev) => [...prev, ...unprovenPremises]);
        setInferenceLog((prev) => [
          {
            step: stepCount + 1,
            message: `Backward Chaining on '${currentGoal}': Rule ${matchingRule.id} requires verifying sub-goals: [${unprovenPremises.join(", ")}]`,
            ruleId: matchingRule.id,
            type: "info",
          },
          ...prev,
        ]);
      }
      setStepCount((p) => p + 1);
    } else {
      // No rule can prove currentGoal -> Backtrack / Fail
      setSubGoalStack((prev) => prev.slice(0, -1));
      setProofTree((prev) => [
        ...prev,
        { node: currentGoal, status: "failed", depth: subGoalStack.length },
      ]);
      setInferenceLog((prev) => [
        {
          step: stepCount + 1,
          message: `Branch Failed: No valid Horn rules available to deduce sub-goal '${currentGoal}'.`,
          type: "fail",
        },
        ...prev,
      ]);
      setStepCount((p) => p + 1);
    }
  }, [
    isFinished,
    isGoalReached,
    subGoalStack,
    workingMemory,
    targetGoal,
    activeKB,
    firedRules,
    stepCount,
    completeExperiment,
  ]);

  // Main step dispatcher
  const stepInference = useCallback(() => {
    if (engineMode === "forward") {
      stepForwardChaining();
    } else {
      stepBackwardChaining();
    }
  }, [engineMode, stepForwardChaining, stepBackwardChaining]);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        stepInference();
      }, speedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speedMs, stepInference]);

  // ── High-DPI Retina Knowledge Graph & Inference Canvas ────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const width = rect.width;
    const height = rect.height;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Dynamic Node Layout
    const rules = activeKB.rules;
    const allFacts = Array.from(
      new Set([...activeKB.availableFacts.map((f) => f.id), ...rules.map((r) => r.conclusion)])
    );

    // Left Column: Initial Premise Facts, Right Column: Intermediate / Goal Conclusions
    const premiseFacts = allFacts.filter((f) => !rules.some((r) => r.conclusion === f));
    const derivedFacts = allFacts.filter((f) => rules.some((r) => r.conclusion === f));

    const factPositions: Record<string, { x: number; y: number }> = {};

    premiseFacts.forEach((fact, idx) => {
      factPositions[fact] = {
        x: 90,
        y: 50 + (idx / Math.max(1, premiseFacts.length - 1)) * (height - 100),
      };
    });

    derivedFacts.forEach((fact, idx) => {
      factPositions[fact] = {
        x: width - 110,
        y: 60 + (idx / Math.max(1, derivedFacts.length - 1)) * (height - 120),
      };
    });

    // 1. Draw Rule Hyperedges & Connectors
    for (const rule of rules) {
      const targetPos = factPositions[rule.conclusion];
      if (!targetPos) continue;

      const isFired = firedRules.includes(rule.id);
      const isTarget = rule.conclusion === targetGoal;

      for (const p of rule.premises) {
        const sourcePos = factPositions[p];
        if (!sourcePos) continue;

        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.bezierCurveTo(
          sourcePos.x + (targetPos.x - sourcePos.x) * 0.5,
          sourcePos.y,
          sourcePos.x + (targetPos.x - sourcePos.x) * 0.5,
          targetPos.y,
          targetPos.x,
          targetPos.y
        );

        ctx.strokeStyle = isFired
          ? isTarget
            ? "#10b981"
            : "rgba(168, 85, 247, 0.7)"
          : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isFired ? 2.5 : 1.2;
        ctx.stroke();
      }
    }

    // 2. Draw Fact Nodes
    for (const fact of allFacts) {
      const pos = factPositions[fact];
      if (!pos) continue;

      const isKnown = workingMemory.has(fact);
      const isGoal = fact === targetGoal;

      // Glow halo for proven goal
      if (isGoal && isKnown) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = isGoal && isKnown
        ? "#10b981"
        : isGoal
        ? "#a855f7"
        : isKnown
        ? "#06b6d4"
        : "#1e293b";
      ctx.fill();

      ctx.strokeStyle = isGoal
        ? "#c084fc"
        : isKnown
        ? "#22d3ee"
        : "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node Label text
      ctx.fillStyle = isKnown ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
      ctx.font = isGoal ? "bold 11px monospace" : "9.5px monospace";
      ctx.textAlign = pos.x < width / 2 ? "right" : "left";
      ctx.textBaseline = "middle";
      const offsetX = pos.x < width / 2 ? -20 : 20;
      ctx.fillText(fact.toUpperCase(), pos.x + offsetX, pos.y);
    }

    ctx.restore();
  }, [activeKB, workingMemory, firedRules, targetGoal]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/20">
      {/* ── Top Engineering Header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/computer-science/ai-problem"
            className="p-2 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
            title="Back to AI Problems"
          >
            <ArrowRight className="rotate-180" size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-sm">
              <GitFork size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Inference Engines &amp; Rule-Based Reasoning Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Modus Ponens &amp; AND-OR Search
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Forward data-driven deduction, backward goal-directed search, conflict resolution, and Horn clauses
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            disabled={isGoalReached || isFinished}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-40 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? "Pause" : "Run Engine"}</span>
          </button>

          <button
            type="button"
            onClick={stepInference}
            disabled={isRunning || isGoalReached || isFinished}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 Inference Cycle"
          >
            Step
          </button>

          <button
            type="button"
            onClick={resetInference}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reset Working Memory"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Studio Container ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "inference_studio", label: "Inference Graph & Working Memory Studio", icon: GitFork },
            { id: "rule_tensor", label: "Horn Clause Rule Base & Conflict Set", icon: Layers },
            { id: "theory", label: "Modus Ponens & Horn Clause Formulary", icon: Calculator },
            { id: "diagnostics", label: "Forward vs Backward Search Diagnostics", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedHornTheory: true }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Hyperparameter Controls Bar ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Knowledge Domain */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Knowledge Base Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as KnowledgeDomain)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="medical">Medical Diagnostic System (MYCIN)</option>
              <option value="zoology">Zoological Taxonomy (Species ID)</option>
              <option value="cybersecurity">Cybersecurity Threat Defense</option>
            </select>
          </div>

          {/* 2. Inference Strategy */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Inference Paradigm
            </label>
            <select
              value={engineMode}
              onChange={(e) => {
                setEngineMode(e.target.value as InferenceEngineMode);
                resetInference();
              }}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="forward">Forward Chaining (Data-Driven / Modus Ponens)</option>
              <option value="backward">Backward Chaining (Goal-Driven / AND-OR Tree)</option>
            </select>
          </div>

          {/* 3. Conflict Resolution Strategy */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Conflict Resolution Rule
            </label>
            <select
              value={conflictStrategy}
              onChange={(e) => {
                setConflictStrategy(e.target.value as ConflictResolution);
                setMilestones((p) => ({ ...p, testedConflictResolution: true }));
              }}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="specificity">Specificity (Most Antecedents First)</option>
              <option value="recency">Recency (Most Recently Added Facts)</option>
              <option value="first_rule">First-Match Priority (Rule Index)</option>
            </select>
          </div>

          {/* 4. Playback Speed */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Inference Cycle Delay</span>
              <span className="font-mono text-foreground font-bold">{speedMs}ms</span>
            </div>
            <input
              type="range"
              min={100}
              max={800}
              step={50}
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: Inference Studio ── */}
        {activeTab === "inference_studio" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Canvas: DAG Knowledge Graph Visualizer (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {activeKB.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {activeKB.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-1 rounded-lg">
                    Cyan = Initial Facts • Purple = Target Goal • Green = Derived Conclusion
                  </span>
                </div>

                {/* Canvas Arena */}
                <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* State Status Banner */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                        isGoalReached
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : isFinished
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : isRunning
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {isGoalReached
                        ? `GOAL PROVEN (${targetGoal.toUpperCase()})`
                        : isFinished
                        ? "FIXED-POINT REACHED (NO MORE RULES)"
                        : isRunning
                        ? `EXECUTING ${engineMode.toUpperCase()} INFERENCE`
                        : "READY"}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    Active Fired: <strong className="text-foreground">{activeFiredRule?.id || "None"}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Working Memory & Interactive Fact Toggles (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      Working Memory ($WM$) &amp; Fact Toggles
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    |WM| = {workingMemory.size} facts
                  </span>
                </div>

                {/* Available Facts Checkbox Pills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    Observed Environmental Facts (Click to Toggle)
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-muted/20 rounded-xl border border-border">
                    {activeKB.availableFacts.map((fact) => {
                      const isActive = workingMemory.has(fact.id);
                      return (
                        <button
                          key={fact.id}
                          type="button"
                          onClick={() => toggleFact(fact.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                            isActive
                              ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                              : "bg-muted/60 text-muted-foreground hover:text-foreground border border-border"
                          }`}
                        >
                          {isActive && <Check size={12} />}
                          <span>{fact.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Inference Stream Log */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <span>Deduction Proof Trail</span>
                    <span>Cycle #{stepCount}</span>
                  </div>
                  <div className="h-40 overflow-y-auto bg-slate-950 p-3 rounded-2xl border border-border space-y-1.5 font-mono text-xs">
                    {inferenceLog.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-lg border flex items-start justify-between text-[11px] ${
                          item.type === "goal"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                            : item.type === "fire"
                            ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                            : item.type === "fail"
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                            : "bg-muted/40 border-border text-slate-300"
                        }`}
                      >
                        <span>{item.message}</span>
                        <span className="text-[9px] opacity-60">#{item.step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Rule Tensor & Conflict Set ── */}
        {activeTab === "rule_tensor" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Horn Clause Knowledge Base &amp; Conflict Set
                </h3>
                <p className="text-xs text-muted-foreground">
                  Matrix of definite clauses $\bigwedge P_i \implies Q$ with satisfaction statuses in Working Memory.
                </p>
              </div>

              <span className="text-xs font-mono text-purple-400 font-bold">
                Conflict Strategy: {conflictStrategy.toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
              <table className="w-full text-left font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2.5">Rule ID</th>
                    <th className="p-2.5">Rule Name</th>
                    <th className="p-2.5">Premises ($\bigwedge P_i$)</th>
                    <th className="p-2.5">Consequent ($Q$)</th>
                    <th className="p-2.5 text-purple-400">Rule Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeKB.rules.map((rule) => {
                    const isFired = firedRules.includes(rule.id);
                    const isReady = rule.premises.every((p) => workingMemory.has(p)) && !workingMemory.has(rule.conclusion);

                    return (
                      <tr key={rule.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-cyan-400">{rule.id}</td>
                        <td className="p-2.5 font-bold text-white">{rule.name}</td>
                        <td className="p-2.5">
                          <div className="flex flex-wrap gap-1">
                            {rule.premises.map((p) => (
                              <span
                                key={p}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  workingMemory.has(p)
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5 font-black text-emerald-400">{rule.conclusion}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isFired
                                ? "bg-emerald-500/20 text-emerald-400"
                                : isReady
                                ? "bg-amber-500/20 text-amber-400 animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isFired ? "FIRED" : isReady ? "READY IN CONFLICT SET" : "UNSATISFIED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Mathematical Theory & Horn Clauses ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Horn Clauses, Modus Ponens &amp; Deductive Tractability
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical formulation of rule-based production systems, Generalized Modus Ponens, and linear-time inference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Horn Clause Definition */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                  <Calculator size={16} />
                  <span>1. Definite Horn Clauses</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"Horn Clause: Disjunction with at most one positive literal"}</div>
                  <div>{"(¬P_1 ∨ ¬P_2 ∨ ... ∨ ¬P_n ∨ Q)  ≡  (P_1 ∧ P_2 ∧ ... ∧ P_n ⇒ Q)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Definite clauses enable linear-time forward and backward inference, avoiding exponential combinatorial explosion.
                </p>
              </div>

              {/* 2. Generalized Modus Ponens */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Split size={16} />
                  <span>2. Generalized Modus Ponens (GMP)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 space-y-1.5 border border-border">
                  <div>{"Premise: P_1, P_2, ..., P_n"}</div>
                  <div>{"Implication: P_1 ∧ P_2 ∧ ... ∧ P_n ⇒ Q"}</div>
                  <div>{"Conclusion: Q (Added to Working Memory)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sound and complete inference rule for propositional and first-order definite clauses.
                </p>
              </div>

              {/* 3. Linear Time Complexity Proof */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Zap size={16} />
                  <span>3. Forward Chaining Complexity: O(n)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"Time Complexity: O(size of KB)"}</div>
                  <div>{"Every premise is evaluated at most once per fact assertion"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By maintaining premise counters for each rule, forward chaining runs in deterministic linear time relative to KB size.
                </p>
              </div>

              {/* 4. AND-OR Goal Tree Topology */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <GitFork size={16} />
                  <span>4. Backward Chaining AND-OR Trees</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"OR-Nodes: Alternative rules for same conclusion"}</div>
                  <div>{"AND-Nodes: Simultaneous premises required by rule"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Avoids irrelevant inferences by only exploring sub-goals directly on the causal proof path.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 4: Diagnostics ── */}
        {activeTab === "diagnostics" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-foreground">
                Inference Performance &amp; Paradigm Comparison
              </h3>
              <p className="text-xs text-muted-foreground">
                Benchmark forward data-driven expansion against backward goal-directed search.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Rules Fired</span>
                <span className="text-2xl font-black font-mono text-purple-500">
                  {firedRules.length} / {activeKB.rules.length}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Total Horn implications executed during inference session.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Working Memory Growth</span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  +{workingMemory.size - activeKB.defaultFacts.length} Inferred
                </span>
                <p className="text-[10px] text-muted-foreground">
                  New ground facts derived beyond the initial observation set.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Proof Efficiency</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {isGoalReached ? "100% (PROVEN)" : isFinished ? "TERMINATED" : "IN PROGRESS"}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Goal state deduction status in active domain.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Student Mastery Milestones ── */}
        <section className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h4 className="text-sm font-bold text-foreground">
                Inference &amp; Knowledge Representation Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "forwardDerived",
                label: "Forward Chaining Deduction",
                desc: "Derive the target goal from environmental facts using Modus Ponens.",
                done: milestones.forwardDerived,
              },
              {
                id: "backwardProven",
                label: "Backward AND-OR Proof",
                desc: "Execute top-down goal reduction to prove hypothesis via sub-goals.",
                done: milestones.backwardProven,
              },
              {
                id: "testedConflictResolution",
                label: "Tune Conflict Resolution",
                desc: "Switch between Specificity, Recency, and First-Match priority rules.",
                done: milestones.testedConflictResolution,
              },
              {
                id: "analyzedHornTheory",
                label: "Study Horn Clause Tractability",
                desc: "Review formal mathematical proofs of linear-time $O(n)$ definite inference.",
                done: milestones.analyzedHornTheory,
              },
            ].map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition ${
                  m.done
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2
                    size={14}
                    className={m.done ? "text-emerald-500" : "text-muted-foreground/40"}
                  />
                  <span className={m.done ? "text-emerald-600 dark:text-emerald-400" : ""}>
                    {m.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Daily Challenge Integration */}
        <DailyChallengeCard
          labId="computer-science/ai-problem/forward-backward"
          currentParams={{
            domain,
            engineMode,
            stepCount,
            isGoalReached,
          }}
        />
      </main>
    </div>
  );
}