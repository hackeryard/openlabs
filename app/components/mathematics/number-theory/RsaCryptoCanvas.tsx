"use client";

import React, { useState, useMemo } from "react";
import { generateRSAKeys, rsaEncrypt, rsaDecrypt, fastModExp } from "./lib/numberTheoryMath";
import {
  Key,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
} from "lucide-react";

export default function RsaCryptoCanvas() {
  const [primeP, setPrimeP] = useState<number>(7);
  const [primeQ, setPrimeQ] = useState<number>(11);
  const [plainMessage, setPlainMessage] = useState<number>(9);

  // RSA Key Pair
  const keys = useMemo(() => generateRSAKeys(primeP, primeQ), [primeP, primeQ]);

  // Ciphertext and Decrypted message
  const cipher = useMemo(() => {
    if (!keys || plainMessage >= keys.n) return 0;
    return rsaEncrypt(plainMessage, keys.e, keys.n);
  }, [keys, plainMessage]);

  const decrypted = useMemo(() => {
    if (!keys) return 0;
    return rsaDecrypt(cipher, keys.d, keys.n);
  }, [keys, cipher]);

  const expSteps = useMemo(() => {
    if (!keys) return [];
    return fastModExp(plainMessage, keys.e, keys.n).steps;
  }, [plainMessage, keys]);

  const primeCandidates = [3, 5, 7, 11, 13, 17, 19, 23];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: RSA Encryption & Key Pipeline (7 cols) ─────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              RSA Public-Key Cryptography Studio
            </span>
          </div>

          <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Public Key: (e={keys?.e}, n={keys?.n})
          </span>
        </div>

        {/* Visual Cryptography Pipeline */}
        <div className="flex-1 flex flex-col justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            {/* Step 1: Plaintext M */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-1">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-blue-500">
                <Unlock size={12} /> Plaintext M
              </div>
              <div className="text-xl font-black text-foreground">{plainMessage}</div>
              <div className="text-[10px] text-muted-foreground">Original Data (M &lt; n)</div>
            </div>

            {/* Step 2: Ciphertext C = M^e mod n */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-amber-500">
                <Lock size={12} /> Cipher C
              </div>
              <div className="text-xl font-black text-amber-500">{cipher}</div>
              <div className="text-[10px] text-muted-foreground">{plainMessage}^{keys?.e} mod {keys?.n}</div>
            </div>

            {/* Step 3: Decrypted M = C^d mod n */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-emerald-500">
                <Key size={12} /> Decrypted
              </div>
              <div className="text-xl font-black text-emerald-500">{decrypted}</div>
              <div className="text-[10px] text-muted-foreground">{cipher}^{keys?.d} mod {keys?.n}</div>
            </div>
          </div>

          {/* Keys Breakdown Box */}
          {keys && (
            <div className="grid grid-cols-2 gap-2 bg-card p-3 rounded-2xl border border-border font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary block">Public Key (Shared)</span>
                <div>Modulus n = p·q = {keys.n}</div>
                <div>Exponent e = {keys.e}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-500 block">Private Key (Secret)</span>
                <div>&phi;(n) = (p-1)(q-1) = {keys.phi}</div>
                <div>Secret d = e⁻¹ mod &phi; = {keys.d}</div>
              </div>
            </div>
          )}

          {/* Square and Multiply Step-by-Step Exponentiation */}
          <div className="p-3 bg-muted/40 rounded-2xl border border-border overflow-y-auto max-h-[110px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
              Fast Modular Exponentiation Trace ({plainMessage}^{keys?.e} mod {keys?.n}):
            </span>
            <div className="space-y-0.5 font-mono text-[11px]">
              {expSteps.map((st, sIdx) => (
                <div key={sIdx} className="flex justify-between text-muted-foreground">
                  <span>Bit {st.bit}: power = {st.power}</span>
                  <span className="text-foreground font-bold">running accumulator = {st.current}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Prime Selection & Message Sliders (5 cols) ── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              RSA Parameter Setup
            </span>
          </div>
        </div>

        {/* Primes Selection */}
        <div className="space-y-3">
          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <span className="text-xs font-bold text-foreground block">Select Prime p = {primeP}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {primeCandidates.map((p) => (
                <button
                  key={`p-${p}`}
                  onClick={() => setPrimeP(p)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                    primeP === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
            <span className="text-xs font-bold text-foreground block">Select Prime q = {primeQ}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {primeCandidates.map((q) => (
                <button
                  key={`q-${q}`}
                  onClick={() => setPrimeQ(q)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                    primeQ === q
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Plaintext Message Number (M &lt; {keys?.n || 0})</span>
            <span className="font-mono text-primary font-black">{plainMessage}</span>
          </div>
          <input
            type="range"
            min="1"
            max={Math.max(1, (keys?.n || 20) - 1)}
            step="1"
            value={plainMessage}
            onChange={(e) => setPlainMessage(parseInt(e.target.value, 10) || 1)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Security / Factoring Info */}
        <div className="p-3 bg-muted/30 border border-border rounded-2xl text-xs space-y-1">
          <span className="font-bold text-foreground block">The RSA Trapdoor Function</span>
          <p className="text-muted-foreground">
            Multiplication of primes p·q is computationally trivial, but factoring the composite modulus n = pq is intractable for large numbers (2048+ bits).
          </p>
        </div>
      </div>
    </div>
  );
}
