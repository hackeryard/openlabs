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
  Type,
  Hash,
  Search,
  Check,
  Skull,
  Award,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Types & Information-Theoretic Structures ──────────────────────────
type GameMode = "ai_solver" | "human_assisted" | "evil_hangman";
type WordCategory = "computer_science" | "ai_robotics" | "mathematics" | "biology";

interface WordItem {
  word: string;
  category: WordCategory;
  hint: string;
}

interface LetterProb {
  letter: string;
  prob: number;
  entropy: number;
  wordCount: number;
}

// ── Built-in Lexicon Corpus for Bayesian Inference ────────────────────
const DICTIONARY_CORPUS: WordItem[] = [
  // Computer Science & Algorithms
  { word: "ALGORITHM", category: "computer_science", hint: "Step-by-step computational procedure" },
  { word: "RECURSION", category: "computer_science", hint: "Function that calls itself directly or indirectly" },
  { word: "DATABASE", category: "computer_science", hint: "Structured set of data stored in a computer" },
  { word: "COMPILER", category: "computer_science", hint: "Translates high-level source code into machine instructions" },
  { word: "HEURISTIC", category: "computer_science", hint: "Problem-solving shortcut that produces good-enough solutions" },
  { word: "PIPELINE", category: "computer_science", hint: "Chain of processing elements arranged in series" },
  { word: "COMPLEXITY", category: "computer_science", hint: "Asymptotic time and space bound analysis" },
  { word: "BANDWIDTH", category: "computer_science", hint: "Maximum rate of data transfer across a network" },
  { word: "POLYNOMIAL", category: "computer_science", hint: "Tractable computational complexity class (P)" },
  { word: "SEMAPHORE", category: "computer_science", hint: "Variable used for controlling access to common resources" },

  // AI & Robotics
  { word: "BACKPROPAGATION", category: "ai_robotics", hint: "Gradient computation algorithm in deep neural networks" },
  { word: "PERCEPTRON", category: "ai_robotics", hint: "Fundamental mathematical building block of neural models" },
  { word: "REINFORCEMENT", category: "ai_robotics", hint: "Learning paradigm based on rewards and state penalties" },
  { word: "CONVERGENCE", category: "ai_robotics", hint: "State where model loss stabilizes at optimal minima" },
  { word: "TRANSFORMER", category: "ai_robotics", hint: "Attention-based sequence architecture powering modern LLMs" },
  { word: "PROBABILISTIC", category: "ai_robotics", hint: "Reasoning under uncertainty using Bayesian inference" },
  { word: "CLASSIFIER", category: "ai_robotics", hint: "Predictive model that maps input features to categorical labels" },
  { word: "OPTIMIZATION", category: "ai_robotics", hint: "Maximizing or minimizing an objective objective function" },
  { word: "EMBEDDING", category: "ai_robotics", hint: "Dense continuous vector representation of discrete tokens" },

  // Mathematics & Cryptography
  { word: "DIOPHANTINE", category: "mathematics", hint: "Polynomial equation seeking integer-only solutions" },
  { word: "ASYMPTOTIC", category: "mathematics", hint: "Limiting behavior of a function as input approaches infinity" },
  { word: "DETERMINANT", category: "mathematics", hint: "Scalar value computed from a square matrix" },
  { word: "EIGENVALUE", category: "mathematics", hint: "Scalar multiplier associated with a linear transformation" },
  { word: "COMBINATORICS", category: "mathematics", hint: "Branch of mathematics concerning counting structures" },
  { word: "CRYPTOGRAPHY", category: "mathematics", hint: "Art of protecting information through encryption algorithms" },
  { word: "LOGARITHMIC", category: "mathematics", hint: "Inverse function to exponentiation" },

  // Biology & Genetics
  { word: "CHROMOSOME", category: "biology", hint: "Thread-like structure of nucleic acids carrying genetic info" },
  { word: "MUTATION", category: "biology", hint: "Alteration in the nucleotide sequence of the genome" },
  { word: "MITOCHONDRIA", category: "biology", hint: "Powerhouse of the eukaryotic cell producing ATP" },
  { word: "PHOTOSYNTHESIS", category: "biology", hint: "Process by which green plants synthesize nutrients from sunlight" },
  { word: "NUCLEOTIDE", category: "biology", hint: "Basic structural unit of DNA and RNA" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_INCORRECT_GUESSES = 6;

export default function HangmanAILab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/hangman",
    "computerScience",
    "simulation"
  );

  // ── Game Configuration & Mode ────────────────────────────────────────
  const [gameMode, setGameMode] = useState<GameMode>("ai_solver");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedWordObj, setSelectedWordObj] = useState<WordItem>(DICTIONARY_CORPUS[0]);

  // ── Active Gameplay State ────────────────────────────────────────────
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);

  // AI Solver Loop
  const [isRunningAI, setIsRunningAI] = useState<boolean>(false);
  const [aiSpeedMs, setAiSpeedMs] = useState<number>(500);

  // UI Tabs & Milestones
  const [activeTab, setActiveTab] = useState<"game_arena" | "bayesian_tensor" | "theory" | "diagnostics">("game_arena");
  const [milestones, setMilestones] = useState({
    executedAISolver: false,
    zeroErrorSolve: false,
    inspectedShannonEntropy: false,
    analyzedTheory: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Active Dictionary Filter ─────────────────────────────────────────
  const activeLexicon = useMemo(() => {
    if (categoryFilter === "all") return DICTIONARY_CORPUS;
    return DICTIONARY_CORPUS.filter((w) => w.category === categoryFilter);
  }, [categoryFilter]);

  // ── Target Word Mask ─────────────────────────────────────────────────
  const wordMask = useMemo(() => {
    return selectedWordObj.word
      .split("")
      .map((char) => (guessedLetters.has(char) ? char : "_"));
  }, [selectedWordObj, guessedLetters]);

  const isWordFullyRevealed = useMemo(() => {
    return selectedWordObj.word.split("").every((char) => guessedLetters.has(char));
  }, [selectedWordObj, guessedLetters]);

  // ── Matching Candidate Words in Corpus ────────────────────────────────
  const matchingCandidates = useMemo(() => {
    const targetLen = selectedWordObj.word.length;
    return DICTIONARY_CORPUS.filter((item) => {
      const w = item.word;
      if (w.length !== targetLen) return false;

      // Check if word matches current mask and contains no guessed wrong letters
      for (let i = 0; i < targetLen; i++) {
        const maskChar = wordMask[i];
        if (maskChar !== "_" && maskChar !== w[i]) return false;
        if (maskChar === "_" && guessedLetters.has(w[i])) return false;
      }
      return true;
    });
  }, [selectedWordObj, wordMask, guessedLetters]);

  // ── Information-Theoretic Letter Probability & Shannon Entropy ────────
  const letterDistributions = useMemo((): LetterProb[] => {
    const unrevealed = ALPHABET.filter((c) => !guessedLetters.has(c));
    const totalMatching = Math.max(1, matchingCandidates.length);

    const distributions: LetterProb[] = unrevealed.map((char) => {
      // Count words containing this letter
      const count = matchingCandidates.filter((item) => item.word.includes(char)).length;
      const p = count / totalMatching;

      // Shannon Entropy: H(c) = -p*log2(p) - (1-p)*log2(1-p)
      let entropy = 0;
      if (p > 0 && p < 1) {
        entropy = -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
      }

      return {
        letter: char,
        prob: p,
        entropy,
        wordCount: count,
      };
    });

    // Sort by Information Gain / Entropy (descending)
    return distributions.sort((a, b) => b.entropy - a.entropy || b.prob - a.prob);
  }, [matchingCandidates, guessedLetters]);

  // ── Reset & Initialize Game ──────────────────────────────────────────
  const startNewGame = useCallback(() => {
    const available = activeLexicon;
    const randomWord = available[Math.floor(Math.random() * available.length)];
    setSelectedWordObj(randomWord);
    setGuessedLetters(new Set());
    setIncorrectGuesses(0);
    setWrongLetters([]);
    setIsGameOver(false);
    setIsWon(false);
    setIsRunningAI(false);
    setStepCount(0);
  }, [activeLexicon]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // ── Handle Single Letter Guess ───────────────────────────────────────
  const handleLetterGuess = useCallback(
    (letter: string) => {
      if (isGameOver || guessedLetters.has(letter)) return;

      const newGuessed = new Set(guessedLetters);
      newGuessed.add(letter);
      setGuessedLetters(newGuessed);
      setStepCount((p) => p + 1);

      // Check if letter exists in target word
      if (!selectedWordObj.word.includes(letter)) {
        const newIncorrect = incorrectGuesses + 1;
        setIncorrectGuesses(newIncorrect);
        setWrongLetters((prev) => [...prev, letter]);

        if (newIncorrect >= MAX_INCORRECT_GUESSES) {
          setIsGameOver(true);
          setIsWon(false);
          setIsRunningAI(false);
        }
      } else {
        // Check if word is now solved
        const allRevealed = selectedWordObj.word.split("").every((c) => newGuessed.has(c));
        if (allRevealed) {
          setIsGameOver(true);
          setIsWon(true);
          setIsRunningAI(false);
          if (incorrectGuesses === 0) {
            setMilestones((p) => ({ ...p, zeroErrorSolve: true }));
          }
          completeExperiment();
        }
      }
    },
    [isGameOver, guessedLetters, selectedWordObj, incorrectGuesses, completeExperiment]
  );

  // ── AI Solver: Optimal Letter Selection (Max Entropy / Prob) ─────────
  const stepAISolver = useCallback(() => {
    if (isGameOver || letterDistributions.length === 0) {
      setIsRunningAI(false);
      return;
    }

    const bestPick = letterDistributions[0].letter;
    handleLetterGuess(bestPick);
    setMilestones((p) => ({ ...p, executedAISolver: true, inspectedShannonEntropy: true }));
  }, [isGameOver, letterDistributions, handleLetterGuess]);

  // AI Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunningAI && !isGameOver) {
      interval = setInterval(() => {
        stepAISolver();
      }, aiSpeedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunningAI, isGameOver, aiSpeedMs, stepAISolver]);

  // ── High-DPI Vector Gallows & Character Canvas Renderer ──────────────
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

    // 1. Draw Wooden Gallows Scaffold
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    // Base beam
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.88);
    ctx.lineTo(width * 0.55, height * 0.88);
    ctx.stroke();

    // Vertical post
    ctx.beginPath();
    ctx.moveTo(width * 0.28, height * 0.88);
    ctx.lineTo(width * 0.28, height * 0.15);
    ctx.stroke();

    // Top horizontal beam
    ctx.beginPath();
    ctx.moveTo(width * 0.28, height * 0.15);
    ctx.lineTo(width * 0.65, height * 0.15);
    ctx.stroke();

    // Diagonal corner brace
    ctx.beginPath();
    ctx.moveTo(width * 0.28, height * 0.3);
    ctx.lineTo(width * 0.42, height * 0.15);
    ctx.stroke();

    // Rope Drop
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.65, height * 0.15);
    ctx.lineTo(width * 0.65, height * 0.28);
    ctx.stroke();

    // 2. Progressive Stick Figure Rendering Based on Incorrect Guesses (0 - 6)
    const centerX = width * 0.65;
    const headRadius = 18;
    const headCenterY = height * 0.28 + headRadius;

    ctx.strokeStyle = isGameOver && !isWon ? "#ef4444" : isWon ? "#10b981" : "#e2e8f0";
    ctx.lineWidth = 3;

    // Error 1: Head
    if (incorrectGuesses >= 1) {
      ctx.beginPath();
      ctx.arc(centerX, headCenterY, headRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Face expressions
      if (isGameOver && !isWon) {
        // X eyes
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("X  X", centerX, headCenterY - 1);
        ctx.fillText("︵", centerX, headCenterY + 10);
      } else if (isWon) {
        // Happy face
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("^  ^", centerX, headCenterY - 1);
        ctx.fillText("‿", centerX, headCenterY + 8);
      }
    }

    // Error 2: Torso Body
    const torsoTopY = headCenterY + headRadius;
    const torsoBottomY = torsoTopY + 45;
    if (incorrectGuesses >= 2) {
      ctx.beginPath();
      ctx.moveTo(centerX, torsoTopY);
      ctx.lineTo(centerX, torsoBottomY);
      ctx.stroke();
    }

    // Error 3: Left Arm
    if (incorrectGuesses >= 3) {
      ctx.beginPath();
      ctx.moveTo(centerX, torsoTopY + 15);
      ctx.lineTo(centerX - 24, torsoTopY + 32);
      ctx.stroke();
    }

    // Error 4: Right Arm
    if (incorrectGuesses >= 4) {
      ctx.beginPath();
      ctx.moveTo(centerX, torsoTopY + 15);
      ctx.lineTo(centerX + 24, torsoTopY + 32);
      ctx.stroke();
    }

    // Error 5: Left Leg
    if (incorrectGuesses >= 5) {
      ctx.beginPath();
      ctx.moveTo(centerX, torsoBottomY);
      ctx.lineTo(centerX - 22, torsoBottomY + 42);
      ctx.stroke();
    }

    // Error 6: Right Leg (Full Gallows)
    if (incorrectGuesses >= 6) {
      ctx.beginPath();
      ctx.moveTo(centerX, torsoBottomY);
      ctx.lineTo(centerX + 22, torsoBottomY + 42);
      ctx.stroke();
    }

    ctx.restore();
  }, [incorrectGuesses, isGameOver, isWon]);

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
              <Type size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Information-Theoretic Hangman AI Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Shannon Entropy &amp; Bayesian Pruning
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Letter frequency distributions, entropy minimization $H(c)$, and candidate word-space partitioning
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunningAI(!isRunningAI)}
            disabled={isGameOver}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-40 ${
              isRunningAI
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
            }`}
          >
            {isRunningAI ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunningAI ? "Pause AI" : "Run AI Solver"}</span>
          </button>

          <button
            type="button"
            onClick={stepAISolver}
            disabled={isRunningAI || isGameOver}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step 1 Optimal AI Letter Guess"
          >
            Step AI
          </button>

          <button
            type="button"
            onClick={startNewGame}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="New Random Word Game"
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
            { id: "game_arena", label: "Game Arena & Shannon Entropy Visualizer", icon: Type },
            { id: "bayesian_tensor", label: "Letter Probability Distribution Matrix", icon: Layers },
            { id: "theory", label: "Information Theory & Entropy Formulary", icon: Calculator },
            { id: "diagnostics", label: "Solver Performance & Lexicon Pruning", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "theory") setMilestones((p) => ({ ...p, analyzedTheory: true }));
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
          {/* 1. Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Lexicon Domain Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Domains (Computer Science, AI, Math, Bio)</option>
              <option value="computer_science">Computer Science &amp; Algorithms</option>
              <option value="ai_robotics">AI, Deep Learning &amp; Robotics</option>
              <option value="mathematics">Mathematics &amp; Cryptography</option>
              <option value="biology">Biology &amp; Genetics</option>
            </select>
          </div>

          {/* 2. Target Word Length */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Target Word Length</span>
              <span className="font-mono text-purple-400 font-bold">{selectedWordObj.word.length} Characters</span>
            </div>
            <div className="p-2 bg-muted/60 border border-border rounded-xl text-xs font-mono text-muted-foreground truncate">
              Hint: {selectedWordObj.hint}
            </div>
          </div>

          {/* 3. Matching Words Remaining */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Candidate Words in Corpus
            </label>
            <div className="p-2 bg-muted/60 border border-border rounded-xl text-xs font-mono font-black text-cyan-400 flex items-center justify-between">
              <span>{matchingCandidates.length} Matching Words</span>
              <span className="text-[10px] text-muted-foreground">|W| = {DICTIONARY_CORPUS.length}</span>
            </div>
          </div>

          {/* 4. AI Step Speed */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>AI Solver Step Delay</span>
              <span className="font-mono text-foreground font-bold">{aiSpeedMs}ms</span>
            </div>
            <input
              type="range"
              min={100}
              max={1000}
              step={100}
              value={aiSpeedMs}
              onChange={(e) => setAiSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: Game Arena ── */}
        {activeTab === "game_arena" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: High-DPI Gallows Canvas (5 Cols) */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-foreground">
                      Physical Gallows State ({incorrectGuesses} / {MAX_INCORRECT_GUESSES} Errors)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Remaining: {MAX_INCORRECT_GUESSES - incorrectGuesses}
                  </span>
                </div>

                {/* Canvas Arena */}
                <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                      isWon
                        ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                        : isGameOver
                        ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                        : isRunningAI
                        ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                        : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                    }`}
                  >
                    {isWon
                      ? "WORD SOLVED SUCCESSFULLY"
                      : isGameOver
                      ? `GAME OVER! WORD: ${selectedWordObj.word}`
                      : isRunningAI
                      ? "AI MAX-ENTROPY SEARCHING"
                      : "READY FOR GUESS"}
                  </span>

                  <span className="text-xs font-mono text-muted-foreground">
                    Wrong: <strong className="text-rose-400">{wrongLetters.join(", ") || "None"}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Word Mask Display & Interactive Virtual Keyboard (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-5">
                {/* 1. Word Mask Letters Display */}
                <div className="p-6 bg-slate-950 rounded-2xl border border-border flex flex-col items-center justify-center space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Current Pattern Mask
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {wordMask.map((char, idx) => (
                      <div
                        key={idx}
                        className={`w-10 sm:w-12 h-12 sm:h-14 rounded-xl border flex items-center justify-center font-mono text-xl sm:text-2xl font-black transition ${
                          char !== "_"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                            : "bg-muted/30 border-border text-transparent"
                        }`}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center italic mt-1">
                    &ldquo;{selectedWordObj.hint}&rdquo;
                  </p>
                </div>

                {/* 2. Top Entropy Recommendations from AI Engine */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <span>AI Maximum Information-Gain Letters ($H(c)$)</span>
                    <span className="text-purple-400">Entropy Metric</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {letterDistributions.slice(0, 5).map((lp) => (
                      <button
                        key={lp.letter}
                        type="button"
                        onClick={() => handleLetterGuess(lp.letter)}
                        disabled={isGameOver || guessedLetters.has(lp.letter)}
                        className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-center transition cursor-pointer disabled:opacity-40"
                      >
                        <span className="text-sm font-black font-mono text-purple-400 block">{lp.letter}</span>
                        <span className="text-[9px] font-mono text-muted-foreground block">
                          H = {lp.entropy.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Interactive Virtual Keyboard */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    Alphabet Keypad (Click to Guess)
                  </span>
                  <div className="grid grid-cols-9 gap-1.5">
                    {ALPHABET.map((char) => {
                      const isGuessed = guessedLetters.has(char);
                      const isCorrect = isGuessed && selectedWordObj.word.includes(char);
                      const isWrong = isGuessed && !selectedWordObj.word.includes(char);

                      return (
                        <button
                          key={char}
                          type="button"
                          onClick={() => handleLetterGuess(char)}
                          disabled={isGuessed || isGameOver}
                          className={`h-9 rounded-lg font-mono text-xs font-black transition cursor-pointer ${
                            isCorrect
                              ? "bg-emerald-500 text-white font-black shadow-sm"
                              : isWrong
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 opacity-40 cursor-not-allowed"
                              : "bg-muted/60 text-foreground hover:bg-muted border border-border"
                          }`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Bayesian Probability Distribution Matrix ── */}
        {activeTab === "bayesian_tensor" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-black text-foreground">
                Letter Probability &amp; Shannon Entropy Tensor
              </h3>
              <p className="text-xs text-muted-foreground">
                Distribution of candidate letters across matching words in the lexicon.
              </p>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
              <table className="w-full text-left font-mono text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                    <th className="p-2.5">Letter ($c$)</th>
                    <th className="p-2.5">Candidate Occurrences</th>
                    <th className="p-2.5">Probability $P(c)$</th>
                    <th className="p-2.5 text-purple-400">Shannon Entropy $H(c)$</th>
                    <th className="p-2.5">Information Gain Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {letterDistributions.map((lp) => (
                    <tr key={lp.letter} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2.5 font-bold text-cyan-400 text-sm">{lp.letter}</td>
                      <td className="p-2.5">{lp.wordCount} / {matchingCandidates.length} words</td>
                      <td className="p-2.5 font-bold text-white">{(lp.prob * 100).toFixed(1)}%</td>
                      <td className="p-2.5 font-black text-purple-400">{lp.entropy.toFixed(3)} bits</td>
                      <td className="p-2.5 w-48">
                        <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, lp.entropy * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: Mathematical Theory & Entropy Formulary ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Shannon Entropy &amp; Bayesian Search Optimization
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical formulation of information theory, letter probability distributions, and equivalence class partitioning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Shannon Entropy Formula */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Calculator size={16} />
                  <span>1. Shannon Information Entropy</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 space-y-1.5 border border-border">
                  <div>{"H(c) = - ∑ P(p | c) · log_2 P(p | c)"}</div>
                  <div>{"P(p | c) = |W_p| / |W_matching|"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Quantifies the expected uncertainty reduction obtained by guessing candidate letter $c$.
                </p>
              </div>

              {/* 2. Equivalence Class Partitioning */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                  <Split size={16} />
                  <span>2. Equivalence Class Partitioning</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"W_matching = ⋃ W_p   (Disjoint Partition)"}</div>
                  <div>{"Optimal Guess: c* = argmax_{c} H(c)"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Partitions the search space into the most balanced subset sizes, ensuring logarithmic tree convergence.
                </p>
              </div>

              {/* 3. Positional n-Gram Language Modeling */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Network size={16} />
                  <span>3. Positional Letter Transition Probabilities</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"P(c @ pos i) = Count(w[i] == c) / |W_matching|"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Leverages character position conditioning to disambiguate vowel-consonant phonetic structures.
                </p>
              </div>

              {/* 4. Adversarial Equivalence Selection */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <ShieldCheck size={16} />
                  <span>4. Adversarial &ldquo;Evil Hangman&rdquo; Formulation</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"Target Class: p* = argmax_p |W_p|"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Adversarial strategy delaying target word commitment by selecting the partition with the maximum number of remaining words.
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
                Inference &amp; Search Space Reduction Diagnostics
              </h3>
              <p className="text-xs text-muted-foreground">
                Examine candidate space pruning velocity, error rates, and information gain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Search Space Pruning</span>
                <span className="text-2xl font-black font-mono text-purple-400">
                  {matchingCandidates.length} / {DICTIONARY_CORPUS.length}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Remaining candidate words in lexicon matching current mask.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Error Rate</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {incorrectGuesses} / {MAX_INCORRECT_GUESSES}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Incorrect letter hypotheses incurred during game.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Search Cycles</span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {stepCount} Guesses
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Total letter evaluations executed.
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
                Information Theory &amp; NLP Search Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "executedAISolver",
                label: "Deploy Entropy AI Solver",
                desc: "Run the autonomous information-theoretic solver to maximize information gain.",
                done: milestones.executedAISolver,
              },
              {
                id: "zeroErrorSolve",
                label: "Zero-Error Perfect Solve",
                desc: "Solve a target word with 0 incorrect letter penalties.",
                done: milestones.zeroErrorSolve,
              },
              {
                id: "inspectedShannonEntropy",
                label: "Inspect Shannon Entropy Ranking",
                desc: "Examine letter entropy values $H(c)$ and probability distributions.",
                done: milestones.inspectedShannonEntropy,
              },
              {
                id: "analyzedTheory",
                label: "Study Information Theory Proofs",
                desc: "Review formal mathematical derivations of Shannon entropy and equivalence classes.",
                done: milestones.analyzedTheory,
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
          labId="computer-science/ai-problem/hangman"
          currentParams={{
            incorrectGuesses,
            stepCount,
            isWon,
          }}
        />
      </main>
    </div>
  );
}