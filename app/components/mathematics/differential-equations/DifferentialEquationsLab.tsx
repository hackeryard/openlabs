"use client";

import React, { useState, useEffect } from "react";
import { DifferentialEquationsTabId } from "./types";
import SlopeFieldsCanvas from "./SlopeFieldsCanvas";
import PhasePlaneCanvas from "./PhasePlaneCanvas";
import LotkaVolterraCanvas from "./LotkaVolterraCanvas";
import HarmonicOscillatorCanvas from "./HarmonicOscillatorCanvas";
import LorenzChaosCanvas from "./LorenzChaosCanvas";
import SirEpidemicCanvas from "./SirEpidemicCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Compass,
  Activity,
  TrendingUp,
  Sparkles,
  Users,
  GitBranch,
  Target,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface Mission {
  id: string;
  tab: DifferentialEquationsTabId;
  title: string;
  task: string;
  hint: string;
}

const MISSIONS: Mission[] = [
  {
    id: "m1",
    tab: "slope_fields",
    title: "Mission 1: The S-Curve Population",
    task: "Click the '🌱 Population S-Curve' demo button and observe how the population starts small, accelerates, and flattens at carrying capacity y = 1.",
    hint: "Notice that above y = 1, slopes point downward, and below y = 1, slopes point upward.",
  },
  {
    id: "m2",
    tab: "phase_plane",
    title: "Mission 2: Tame the Galaxy Spiral",
    task: "Click the '🌀 Galaxy Swirl' demo and watch how every starting position spirals inward to equilibrium (0, 0).",
    hint: "The eigenvalues have a negative real part, acting as friction draining energy from the system.",
  },
  {
    id: "m3",
    tab: "lotka_volterra",
    title: "Mission 3: The Predator Lag Delay",
    task: "Watch the time-series waves in the Lotka-Volterra tab. Identify why the red fox peak comes *after* the green rabbit peak.",
    hint: "Foxes need abundant food first to reproduce. Once rabbits are eaten, foxes starve, allowing rabbits to rebound!",
  },
  {
    id: "m4",
    tab: "harmonic_oscillator",
    title: "Mission 4: The Car Shock Absorber",
    task: "Click '🚗 Car Shock Absorber (Critical)' to see how engineers stop a car from bouncing repeatedly over potholes.",
    hint: "Critical damping (zeta = 1) is the fastest possible way to return to rest without oscillating.",
  },
  {
    id: "m5",
    tab: "lorenz_chaos",
    title: "Mission 5: The Butterfly Effect",
    task: "Drag the 3D butterfly attractor to rotate it. Notice how two lines starting only 0.0001 apart split into different wings!",
    hint: "This proves why 14-day weather forecasts are impossible even with supercomputers.",
  },
  {
    id: "m6",
    tab: "sir_epidemic",
    title: "Mission 6: Flatten the Curve",
    task: "Slide 'Flatten the Curve' to 50% and watch the red infection peak drop below hospital capacity.",
    hint: "Lowering transmission rates spreads cases out over time so medical facilities aren't overwhelmed.",
  },
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZZES: Record<DifferentialEquationsTabId, QuizQuestion> = {
  slope_fields: {
    question: "Why is Runge-Kutta (RK4) widely used over Euler's method?",
    options: [
      "RK4 calculates 4 test slopes per step for massive precision",
      "Euler's method is only for imaginary numbers",
      "RK4 requires zero math calculations",
      "Euler's method is completely forbidden in physics",
    ],
    correctIndex: 0,
    explanation: "Euler's method drifts quickly because it only looks at the current slope. RK4 averages 4 intermediate test slopes per step, making it thousands of times more accurate!",
  },
  phase_plane: {
    question: "What happens to trajectories when the origin (0, 0) is a Stable Spiral (Sink)?",
    options: [
      "They fly away to infinity",
      "They swirl inward toward (0, 0) over time",
      "They move in a straight vertical line forever",
      "They freeze immediately at t = 0",
    ],
    correctIndex: 1,
    explanation: "A stable spiral sink has complex eigenvalues with negative real parts, meaning the system oscillates while friction drains energy toward the rest state.",
  },
  lotka_volterra: {
    question: "Why does the predator population peak after the prey population?",
    options: [
      "Predators eat plants before prey",
      "Predators reproduce only after ample prey has provided food energy",
      "Prey animals attack predators directly",
      "Predators hibernate every other year",
    ],
    correctIndex: 1,
    explanation: "Abundant prey must exist first to nourish the predator population. As predators increase, they overhunt prey, causing both populations to cyclicly rise and fall with a phase lag.",
  },
  harmonic_oscillator: {
    question: "What is Critical Damping (zeta = 1) optimal for?",
    options: [
      "Creating infinite continuous sound ringing",
      "Returning a disturbed object to rest as fast as possible without bouncing",
      "Making an elevator shake vigorously",
      "Increasing maximum acceleration infinitely",
    ],
    correctIndex: 1,
    explanation: "Critically damped systems (like car shock absorbers, automatic door closers, and scales) return to zero position in the shortest possible time without overshoot or oscillations.",
  },
  lorenz_chaos: {
    question: "What is the core takeaway of the Butterfly Effect in chaotic systems?",
    options: [
      "Butterflies control the global climate directly",
      "Tiny microscopic differences in starting measurements grow exponentially over time",
      "Computers can easily predict chaotic weather 1 year in advance",
      "Chaotic systems have no mathematical equations",
    ],
    correctIndex: 1,
    explanation: "Even in completely deterministic systems, infinitesimal variations in initial conditions diverge exponentially, making long-term forecasting impossible.",
  },
  sir_epidemic: {
    question: "What happens when the basic reproduction number R0 is less than 1 (R0 < 1)?",
    options: [
      "The disease spreads to the entire population",
      "Each sick individual infects fewer than 1 other person on average, and the outbreak dies out",
      "The recovery rate drops to 0",
      "The virus mutates immediately",
    ],
    correctIndex: 1,
    explanation: "When R0 < 1, transmission cannot sustain itself and the epidemic naturally burns out.",
  },
};

export default function DifferentialEquationsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/differential-equations",
    "mathematics",
    "simulation"
  );

  const [activeTab, setActiveTab] = useState<DifferentialEquationsTabId>("slope_fields");
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Challenge metrics
  const [equationsIntegrated, setEquationsIntegrated] = useState(1);
  const [phaseSystemsExplored, setPhaseSystemsExplored] = useState(0);
  const [chaosTrajectoriesTested, setChaosTrajectoriesTested] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // Reset quiz state on tab change
  useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizAnswered(false);
  }, [activeTab]);

  // AI Chat Context Registration
  useEffect(() => {
    setExperimentData({
      title: "Differential Equations & Dynamical Systems Studio Lab",
      theory: `Interactive Differential Equations, Numerical Integrators, Phase Plane Portraits, and Non-Linear Chaos Laboratory.
Examines 1st-order direction fields (dy/dx = f(x,y)) with Euler, Heun, and Runge-Kutta RK4 numerical solvers, 2D Linear System Phase Portraits (x' = Ax) with Trace-Determinant stability classifications (saddles, spirals, nodes, centers), Lotka-Volterra ecological predator-prey cyclic orbits, Damped and Driven Harmonic Oscillators with resonance amplitude responses, the 3D Lorenz Strange Attractor with sensitive dependence Butterfly Effect chaos, and Kermack-McKendrick SIR epidemiological models with R0 reproduction numbers.`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (equationsIntegrated >= 2 || phaseSystemsExplored >= 1 || chaosTrajectoriesTested >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [equationsIntegrated, phaseSystemsExplored, chaosTrajectoriesTested, experimentCompleted, completeExperiment]);

  const activeMission = MISSIONS.find((m) => m.tab === activeTab) || MISSIONS[0];
  const activeQuiz = QUIZZES[activeTab];

  const handleToggleMission = (missionId: string) => {
    setCompletedMissions((prev) => ({
      ...prev,
      [missionId]: !prev[missionId],
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/differential-equations"
        currentParams={{
          equationsIntegrated: equationsIntegrated + (activeTab === "slope_fields" ? 1 : 0),
          phaseSystemsExplored: phaseSystemsExplored + (activeTab === "phase_plane" || activeTab === "lotka_volterra" ? 1 : 0),
          chaosTrajectoriesTested: chaosTrajectoriesTested + (activeTab === "lorenz_chaos" || activeTab === "harmonic_oscillator" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Differential Equations &amp; Dynamical Systems Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Student-Friendly Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Explore how math models real-world change: wind currents, predator-prey cycles, car shocks, butterfly chaos, and epidemics
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("slope_fields");
              setEquationsIntegrated((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "slope_fields"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Compass size={14} />
            <span>Wind Currents &amp; Solvers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("phase_plane");
              setPhaseSystemsExplored((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "phase_plane"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <GitBranch size={14} />
            <span>2D Flow &amp; Spirals</span>
          </button>

          <button
            onClick={() => setActiveTab("lotka_volterra")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "lotka_volterra"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <TrendingUp size={14} />
            <span>Rabbits &amp; Foxes</span>
          </button>

          <button
            onClick={() => setActiveTab("harmonic_oscillator")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "harmonic_oscillator"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Springs &amp; Resonance</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("lorenz_chaos");
              setChaosTrajectoriesTested((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "lorenz_chaos"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sparkles size={14} />
            <span>3D Butterfly Chaos</span>
          </button>

          <button
            onClick={() => setActiveTab("sir_epidemic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "sir_epidemic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Users size={14} />
            <span>Virus &amp; Vaccines</span>
          </button>
        </div>
      </div>

      {/* ── Student Learning Mission Card ─────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
            completedMissions[activeMission.id]
              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
              : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
          }`}>
            {completedMissions[activeMission.id] ? <CheckCircle2 size={20} /> : <Target size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-primary">Student Guided Goal</span>
              <h3 className="text-sm font-bold text-foreground">{activeMission.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {activeMission.task}
            </p>
            <p className="text-[11px] text-primary/80 italic mt-0.5">
              💡 Hint: {activeMission.hint}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleToggleMission(activeMission.id)}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 border ${
            completedMissions[activeMission.id]
              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
              : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border-primary/20"
          }`}
        >
          {completedMissions[activeMission.id] ? (
            <>
              <CheckCircle2 size={16} />
              <span>Completed! (+50 XP)</span>
            </>
          ) : (
            <>
              <Target size={16} />
              <span>Mark as Completed</span>
            </>
          )}
        </button>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "slope_fields" && <SlopeFieldsCanvas />}
      {activeTab === "phase_plane" && <PhasePlaneCanvas />}
      {activeTab === "lotka_volterra" && <LotkaVolterraCanvas />}
      {activeTab === "harmonic_oscillator" && <HarmonicOscillatorCanvas />}
      {activeTab === "lorenz_chaos" && <LorenzChaosCanvas />}
      {activeTab === "sir_epidemic" && <SirEpidemicCanvas />}

      {/* ── Student Quick-Check Quiz Widget ───────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-primary block">Active Recall Checkpoint</span>
              <h3 className="text-sm font-bold text-foreground">Test Your Conceptual Understanding</h3>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            1 Question Quick Quiz
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-bold text-foreground">
            {activeQuiz.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === activeQuiz.correctIndex;
              let btnStyle = "bg-muted/40 hover:bg-accent border-border text-foreground";

              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold";
                } else {
                  btnStyle = "bg-muted/20 opacity-50 border-border text-muted-foreground";
                }
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

          {quizAnswered && (
            <div className="p-3.5 bg-muted/40 border border-border rounded-2xl text-xs space-y-1 mt-2 animate-in fade-in">
              <span className="font-bold text-primary block">
                {selectedQuizAnswer === activeQuiz.correctIndex ? "🎉 Correct!" : "💡 Explanation:"}
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {activeQuiz.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
