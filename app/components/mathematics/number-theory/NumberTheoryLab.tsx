"use client";

import React, { useState, useEffect } from "react";
import { NumberTheoryTabId } from "./types";
import PrimesSieveCanvas from "./PrimesSieveCanvas";
import EuclideanGcdCanvas from "./EuclideanGcdCanvas";
import ModularArithmeticCanvas from "./ModularArithmeticCanvas";
import EulerTotientCanvas from "./EulerTotientCanvas";
import RsaCryptoCanvas from "./RsaCryptoCanvas";
import CollatzFractionsCanvas from "./CollatzFractionsCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  Binary,
  Maximize2,
  Clock,
  ShieldCheck,
  Activity,
  Grid,
} from "lucide-react";

export default function NumberTheoryLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "mathematics/number-theory",
    "mathematics",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<NumberTheoryTabId>("primes_sieve");

  // Challenge metrics
  const [primesFactored, setPrimesFactored] = useState(1);
  const [gcdsComputed, setGcdsComputed] = useState(0);
  const [ciphersTested, setCiphersTested] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  // ── AI Chat Context Registration ─────────────────────────────
  useEffect(() => {
    setExperimentData({
      title: "Number Theory & Cryptography Studio Lab",
      theory: `Interactive Number Theory, Prime Factorization, Modular Arithmetic, and RSA Cryptography Laboratory.
Examines Sieve of Eratosthenes prime generation and Fundamental Theorem factor trees, Euclidean Algorithm and Extended Bézout's identity (ax + by = gcd) with geometric rectangle square tiling, Modular Clock Arithmetic and Chinese Remainder Theorem systems, Euler's Totient Function phi(n) with coprimality wheels and Fermat's Little Theorem, RSA Public-Key Cryptography with Square-and-Multiply fast exponentiation, and Collatz 3n + 1 orbits with continued fractions.`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (primesFactored >= 2 || gcdsComputed >= 1 || ciphersTested >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [primesFactored, gcdsComputed, ciphersTested, experimentCompleted, completeExperiment]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="mathematics/number-theory"
        currentParams={{
          primesFactored: primesFactored + (activeTab === "primes_sieve" ? 1 : 0),
          gcdsComputed: gcdsComputed + (activeTab === "euclidean_gcd" || activeTab === "modular_arithmetic" ? 1 : 0),
          ciphersTested: ciphersTested + (activeTab === "rsa_cryptography" || activeTab === "euler_totient" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Binary size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Number Theory &amp; Cryptography Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Mathematics Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Primes &amp; sieves, Euclidean GCD tiling, modular arithmetic &amp; CRT, Euler&apos;s totient, RSA cryptography, and Collatz orbits
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("primes_sieve");
              setPrimesFactored((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "primes_sieve"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Grid size={14} />
            <span>Primes &amp; Sieve</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("euclidean_gcd");
              setGcdsComputed((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "euclidean_gcd"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Maximize2 size={14} />
            <span>Euclidean GCD &amp; Tiling</span>
          </button>

          <button
            onClick={() => setActiveTab("modular_arithmetic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "modular_arithmetic"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Clock size={14} />
            <span>Modular &amp; CRT</span>
          </button>

          <button
            onClick={() => setActiveTab("euler_totient")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "euler_totient"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Binary size={14} />
            <span>Euler &phi;(n) &amp; Powers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("rsa_cryptography");
              setCiphersTested((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "rsa_cryptography"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <ShieldCheck size={14} />
            <span>RSA Cryptography</span>
          </button>

          <button
            onClick={() => setActiveTab("collatz_fractions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "collatz_fractions"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity size={14} />
            <span>Collatz &amp; Fractions</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "primes_sieve" && <PrimesSieveCanvas />}
      {activeTab === "euclidean_gcd" && <EuclideanGcdCanvas />}
      {activeTab === "modular_arithmetic" && <ModularArithmeticCanvas />}
      {activeTab === "euler_totient" && <EulerTotientCanvas />}
      {activeTab === "rsa_cryptography" && <RsaCryptoCanvas />}
      {activeTab === "collatz_fractions" && <CollatzFractionsCanvas />}
    </div>
  );
}
