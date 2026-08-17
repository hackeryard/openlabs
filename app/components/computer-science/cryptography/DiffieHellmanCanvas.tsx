"use client";

import React, { useState, useMemo } from "react";
import { computeDiffieHellman } from "./lib/cryptoEngines";
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
} from "lucide-react";

export default function DiffieHellmanCanvas() {
  const [primeP, setPrimeP] = useState<number>(23);
  const [generatorG, setGeneratorG] = useState<number>(5);
  const [aliceSecret, setAliceSecret] = useState<number>(6);
  const [bobSecret, setBobSecret] = useState<number>(15);

  const dhState = useMemo(
    () => computeDiffieHellman(primeP, generatorG, aliceSecret, bobSecret),
    [primeP, generatorG, aliceSecret, bobSecret]
  );

  return (
    <div className="space-y-4">
      {/* ── Visual Intuition Banner ────────────────────────────── */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              The Secret Paint Mixing Trick (Diffie-Hellman)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              How do two strangers on the public internet create a secret password without hackers listening in? 
              They use the <strong>Color Mixing Trick</strong> below: Mixing paints is easy, but separating mixed paint back into its original colors is impossible!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Demos:</span>
          <button
            onClick={() => {
              setPrimeP(23);
              setGeneratorG(5);
              setAliceSecret(6);
              setBobSecret(15);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🔢 Small Numbers (p=23, g=5)
          </button>
          <button
            onClick={() => {
              setPrimeP(97);
              setGeneratorG(5);
              setAliceSecret(18);
              setBobSecret(29);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            🛡️ Bigger Numbers (p=97, g=5)
          </button>
        </div>
      </div>

      {/* ── 4-Step Visual Paint Mixing Flow ──────────────────────── */}
      <div className="p-4 bg-card border border-border rounded-3xl space-y-3 shadow-sm select-none">
        <span className="text-xs font-bold text-foreground flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span>Step-by-Step Visual Paint Mixing Analogy</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Step 1: Public Base Color */}
          <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-500 block">Step 1: Public Start</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border border-yellow-300 shadow-sm shrink-0" />
              <div>
                <span className="font-bold block">Shared Base Color</span>
                <span className="text-[10px] text-muted-foreground">Publicly known (Yellow)</span>
              </div>
            </div>
          </div>

          {/* Step 2: Add Private Secrets */}
          <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
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
          <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
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
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
              Step 4: Identical Secret!
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
        {/* ── Left: Alice & Bob Interactive Key Exchange (7 cols) ─ */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Actual Math Key Agreement Protocol
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Shared Secret Key = {dhState.aliceSharedSecret}
              </span>
            </div>
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

            {/* Public Channel (Middle) */}
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

        {/* ── Right: Public Prime & Private Sliders (5 cols) ───── */}
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

          {/* Eve Security Explainer */}
          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-foreground block flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-500" />
              <span>Why Is This Secure?</span>
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Anyone listening in sees <code>A = {dhState.alicePublic}</code> and <code>B = {dhState.bobPublic}</code>. But to find Alice's secret, they would have to solve a math puzzle called the <strong>Discrete Logarithm</strong>. On real internet connections with 2048-bit numbers, this would take all the world's supercomputers billions of years to crack!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
