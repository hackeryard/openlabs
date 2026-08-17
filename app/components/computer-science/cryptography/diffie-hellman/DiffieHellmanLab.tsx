"use client";

import React, { useState, useMemo, useEffect } from "react";
import { computeDiffieHellman } from "../lib/cryptoEngines";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  ShieldCheck,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Eye,
  Lock,
  Palette,
  Play,
  Pause,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DiffieHellmanLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/cryptography/diffie-hellman",
    "computerScience",
    "exploration"
  );

  const [primeP, setPrimeP] = useState<number>(23);
  const [generatorG, setGeneratorG] = useState<number>(5);
  const [aliceSecret, setAliceSecret] = useState<number>(6);
  const [bobSecret, setBobSecret] = useState<number>(15);

  // Animated Handshake simulation
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animStep, setAnimStep] = useState<number>(0);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const dhState = useMemo(
    () => computeDiffieHellman(primeP, generatorG, aliceSecret, bobSecret),
    [primeP, generatorG, aliceSecret, bobSecret]
  );

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Diffie-Hellman Key Exchange Studio Lab",
      theory: "Asymmetric public-key agreement protocol using modular exponentiation and the Discrete Logarithm Problem.",
      extraContext: { p: primeP, g: generatorG, sharedSecret: dhState.aliceSharedSecret },
    });
  }, [primeP, generatorG, dhState, setExperimentData]);

  // Handshake animation flow
  const handleStartHandshake = () => {
    setIsSimulating(true);
    setAnimStep(1);

    setTimeout(() => setAnimStep(2), 1000);
    setTimeout(() => setAnimStep(3), 2200);
    setTimeout(() => {
      setAnimStep(4);
      setIsSimulating(false);
      completeExperiment();
    }, 3400);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Diffie-Hellman Key Exchange Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Interactive Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Secure key agreement over public channels with paint color-mixing and modular math sandboxes
            </p>
          </div>
        </div>
      </div>

      {/* Visual Intuition Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              How Can Two Strangers Create a Secret Password in Public?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              They use the <strong>Color Mixing Trick</strong>: Mixing two paint colors together is easy, but separating them back into pure colors is mathematically impossible!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleStartHandshake}
            disabled={isSimulating}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Play size={15} className="fill-current" />
            <span>▶ Simulate Key Handshake Live</span>
          </button>
        </div>
      </div>

      {/* 4-Step Visual Paint Mixing Flow with Active Animation */}
      <div className="p-5 bg-card border border-border rounded-3xl space-y-4 shadow-md select-none">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span>4-Step Visual Paint Mixing &amp; Key Exchange Flow</span>
          </span>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {animStep > 0 ? `Step ${animStep} of 4 in progress...` : "Click Simulate to watch flow"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Step 1: Public Base Color */}
          <div className={`p-3.5 border rounded-2xl space-y-2 transition-all ${
            animStep === 1 ? "bg-amber-500/15 border-amber-500 scale-105 shadow-md" : "bg-muted/30 border-border"
          }`}>
            <span className="text-[10px] font-black uppercase text-amber-500 block">Step 1: Public Base</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border border-yellow-300 shadow-sm shrink-0" />
              <div>
                <span className="font-bold block">Shared Base Color</span>
                <span className="text-[10px] text-muted-foreground">Publicly known (Yellow)</span>
              </div>
            </div>
          </div>

          {/* Step 2: Add Private Secrets */}
          <div className={`p-3.5 border rounded-2xl space-y-2 transition-all ${
            animStep === 2 ? "bg-indigo-500/15 border-indigo-500 scale-105 shadow-md" : "bg-muted/30 border-border"
          }`}>
            <span className="text-[10px] font-black uppercase text-indigo-500 block">Step 2: Add Secrets</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 border border-blue-400 shrink-0" />
                <span className="text-[11px] font-bold">Alice adds Secret Blue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 border border-red-400 shrink-0" />
                <span className="text-[11px] font-bold">Bob adds Secret Red</span>
              </div>
            </div>
          </div>

          {/* Step 3: Swap Over Internet */}
          <div className={`p-3.5 border rounded-2xl space-y-2 transition-all ${
            animStep === 3 ? "bg-pink-500/15 border-pink-500 scale-105 shadow-md" : "bg-muted/30 border-border"
          }`}>
            <span className="text-[10px] font-black uppercase text-pink-500 block">Step 3: Public Swap</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-400 border border-cyan-300 shrink-0" />
                <span className="text-[11px] font-bold">Alice sends Cyan Mix &rarr;</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-400 border border-orange-300 shrink-0" />
                <span className="text-[11px] font-bold">&larr; Bob sends Orange Mix</span>
              </div>
            </div>
          </div>

          {/* Step 4: Final Identical Secret */}
          <div className={`p-3.5 border rounded-2xl space-y-2 transition-all ${
            animStep === 4 ? "bg-emerald-500/20 border-emerald-500 scale-105 shadow-lg ring-2 ring-emerald-500/50" : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
              Step 4: Identical Key!
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-900 border border-amber-800 shadow-sm shrink-0" />
              <div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Secret Brown Key</span>
                <span className="text-[10px] text-muted-foreground">Both get the exact same mix!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Actual Mathematical Key Agreement Sandbox */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Actual Math Key Agreement Protocol
              </span>
            </div>

            <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Shared Key = {dhState.aliceSharedSecret}
            </span>
          </div>

          {/* Visual Exchange Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 select-none text-xs">
            {/* Alice Box */}
            <div className="p-3.5 bg-muted/30 border border-border rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>Alice (Your Phone)</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div className="p-1.5 bg-background rounded-xl border border-border">
                  <span className="text-[9px] text-muted-foreground block font-sans">Secret Password (a):</span>
                  <span className="font-black text-pink-500">{dhState.alicePrivate}</span>
                </div>
                <div className="p-1.5 bg-primary/10 rounded-xl border border-primary/20">
                  <span className="text-[9px] text-primary block font-sans">Sends Public Number (A):</span>
                  <span className="font-black text-primary">A = {dhState.alicePublic}</span>
                </div>
              </div>

              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-[11px]">
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-bold font-sans">Calculated Key:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  Key = {dhState.aliceSharedSecret}
                </span>
              </div>
            </div>

            {/* Public Channel */}
            <div className="p-3.5 bg-muted/50 border border-border rounded-2xl space-y-2 flex flex-col justify-between text-center font-mono">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase font-sans">
                <Eye size={14} className="text-amber-500" />
                <span>Public Internet</span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="p-1.5 bg-background border border-border rounded-xl">
                  <span className="text-muted-foreground block font-bold">Base g = {dhState.g}</span>
                  <span className="text-muted-foreground block font-bold">Prime p = {dhState.p}</span>
                </div>
                <div className="text-[9px] text-amber-500 font-bold bg-amber-500/10 py-1 rounded-lg border border-amber-500/20">
                  Alice sends A = {dhState.alicePublic} &rarr;
                </div>
                <div className="text-[9px] text-amber-500 font-bold bg-amber-500/10 py-1 rounded-lg border border-amber-500/20">
                  &larr; Bob sends B = {dhState.bobPublic}
                </div>
              </div>

              <div className="p-1.5 bg-background rounded-xl border border-border text-[9px] text-muted-foreground font-sans">
                Hackers can see A and B, but cannot find the secret key!
              </div>
            </div>

            {/* Bob Box */}
            <div className="p-3.5 bg-muted/30 border border-border rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Bob (Bank Server)</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div className="p-1.5 bg-background rounded-xl border border-border">
                  <span className="text-[9px] text-muted-foreground block font-sans">Secret Password (b):</span>
                  <span className="font-black text-indigo-500">{dhState.bobPrivate}</span>
                </div>
                <div className="p-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <span className="text-[9px] text-indigo-500 block font-sans">Sends Public Number (B):</span>
                  <span className="font-black text-indigo-500">B = {dhState.bobPublic}</span>
                </div>
              </div>

              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-[11px]">
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-bold font-sans">Calculated Key:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  Key = {dhState.bobSharedSecret}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parameter Sliders */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Try Changing Secrets
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 font-mono">
            <div className="space-y-1 p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-pink-500">Alice's Secret Number (a)</span>
                <span className="text-pink-500 font-black">{aliceSecret}</span>
              </div>
              <input
                type="range"
                min="2"
                max={primeP - 1}
                step="1"
                value={aliceSecret}
                onChange={(e) => setAliceSecret(parseInt(e.target.value, 10) || 6)}
                className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <div className="space-y-1 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-indigo-500">Bob's Secret Number (b)</span>
                <span className="text-indigo-500 font-black">{bobSecret}</span>
              </div>
              <input
                type="range"
                min="2"
                max={primeP - 1}
                step="1"
                value={bobSecret}
                onChange={(e) => setBobSecret(parseInt(e.target.value, 10) || 15)}
                className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Security Explainer */}
          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-foreground block flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-500" />
              <span>Why Is This Secure?</span>
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Anyone listening in sees <code>A = {dhState.alicePublic}</code> and <code>B = {dhState.bobPublic}</code>. But finding the secret requires solving the <strong>Discrete Logarithm</strong>, which would take supercomputers billions of years for 2048-bit numbers!
            </p>
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
              <h3 className="text-sm font-bold text-foreground">What math problem protects Diffie-Hellman key exchanges?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "The Discrete Logarithm Problem (reversing g^a mod p)",
            "Simple addition and subtraction",
            "Sorting an array of numbers",
            "Multiplication tables",
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
