"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { compareSha256Avalanche, sha256Sync } from "./lib/cryptoEngines";
import {
  Hash,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Pickaxe,
  Play,
  Pause,
} from "lucide-react";

export default function Sha256AvalancheCanvas() {
  const [text1, setText1] = useState<string>("OpenLabs Science");
  const [text2, setText2] = useState<string>("openLabs Science");

  // Proof of work mining state
  const [miningData, setMiningData] = useState<string>("Alice pays Bob 5 BTC");
  const [targetZeros, setTargetZeros] = useState<number>(2);
  const [nonce, setNonce] = useState<number>(0);
  const [liveHash, setLiveHash] = useState<string>("");
  const [minedHash, setMinedHash] = useState<string>("");
  const [isMining, setIsMining] = useState<boolean>(false);
  const [hashRate, setHashRate] = useState<number>(0);

  const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Avalanche comparison
  const comparison = useMemo(
    () => compareSha256Avalanche(text1, text2),
    [text1, text2]
  );

  // Animated Live Mining Loop
  useEffect(() => {
    if (isMining) {
      const prefix = "0".repeat(targetZeros);
      let currentNonce = nonce;

      miningIntervalRef.current = setInterval(() => {
        // Run a batch of 150 hashes per interval tick for visual animation
        for (let i = 0; i < 150; i++) {
          currentNonce++;
          const h = sha256Sync(`${miningData}:${currentNonce}`);
          if (h.startsWith(prefix)) {
            setNonce(currentNonce);
            setLiveHash(h);
            setMinedHash(h);
            setIsMining(false);
            if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
            return;
          }
        }
        setNonce(currentNonce);
        setLiveHash(sha256Sync(`${miningData}:${currentNonce}`));
      }, 50);
    } else {
      if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
    }
    return () => {
      if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
    };
  }, [isMining, targetZeros, miningData]);

  const handleStartMining = () => {
    setMinedHash("");
    setNonce(0);
    setIsMining(true);
  };

  const handleStopMining = () => {
    setIsMining(false);
  };

  return (
    <div className="space-y-4">
      {/* ── Visual Intuition Banner ────────────────────────────── */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Lightbulb size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              What is the SHA-256 Avalanche Effect?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type in the boxes to see over <strong>50% of the 256 bits flip instantly</strong>, or click <strong>▶ Mine Bitcoin Block Live</strong> to watch thousands of hashes cycle in real time!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Tests:</span>
          <button
            onClick={() => {
              setText1("The quick brown fox jumps over the lazy dog");
              setText2("The quick brown fox jumps over the lazy dog.");
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-pink-500"
          >
            🔤 Add 1 Period "."
          </button>
          <button
            onClick={() => {
              setText1("Password123");
              setText2("password123");
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🔒 Capital vs Lowercase 'P'
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Bit-Level Avalanche Comparison (7 cols) ────── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                256-Bit Avalanche Visualizer
              </span>
            </div>

            <span className="text-xs font-mono font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
              {comparison.bitDifferences} / 256 Bits Flipped ({comparison.flippedPercentage}%)
            </span>
          </div>

          {/* Dual Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-indigo-500 block">Input 1</label>
              <input
                type="text"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full p-2 bg-background border border-indigo-500/30 rounded-xl font-mono text-xs"
              />
              <span className="text-[9px] font-mono text-muted-foreground block truncate">
                Hash: {comparison.hash1Hex.substring(0, 24)}...
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-pink-500 block">Input 2 (Slightly Changed)</label>
              <input
                type="text"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full p-2 bg-background border border-pink-500/30 rounded-xl font-mono text-xs"
              />
              <span className="text-[9px] font-mono text-muted-foreground block truncate">
                Hash: {comparison.hash2Hex.substring(0, 24)}...
              </span>
            </div>
          </div>

          {/* 256-Bit Array Visualizer */}
          <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-2 select-none">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Bit Difference Map (256 Bits)</span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-emerald-500 font-bold">■ Matching (Same)</span>
                <span className="text-rose-500 font-bold">■ Flipped (Scrambled)</span>
              </div>
            </div>

            {/* Grid of 256 Bit Boxes (16x16) */}
            <div className="grid grid-cols-16 gap-1 max-h-[160px] overflow-hidden p-1 bg-background border border-border rounded-xl">
              {comparison.hash1Bin.split("").map((bit, idx) => {
                const isFlipped = bit !== comparison.hash2Bin[idx];
                return (
                  <div
                    key={idx}
                    title={`Bit ${idx}: Input1=${bit} vs Input2=${comparison.hash2Bin[idx]}`}
                    className={`aspect-square rounded-sm text-[8px] font-mono flex items-center justify-center font-bold transition-all ${
                      isFlipped ? "bg-rose-500 text-white animate-pulse" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {isFlipped ? "1" : "0"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Proof-of-Work Bitcoin Mining Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Pickaxe size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Bitcoin Proof-of-Work Mining
              </span>
            </div>

            {isMining && (
              <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Mining Live...
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground block">Block Transaction Data</label>
              <input
                type="text"
                value={miningData}
                onChange={(e) => setMiningData(e.target.value)}
                className="w-full p-2 bg-background border border-border rounded-xl font-mono text-xs"
              />
            </div>

            {/* Difficulty Setting */}
            <div className="space-y-1 p-2.5 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span>Mining Difficulty (Leading Zeros)</span>
                <span className="font-mono text-primary font-black">{"0".repeat(targetZeros)} ({targetZeros} zeros)</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={targetZeros}
                onChange={(e) => setTargetZeros(parseInt(e.target.value, 10) || 1)}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Live Nonce and Hash Stream during mining */}
            <div className="p-3 bg-muted/30 border border-border rounded-2xl font-mono text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground font-bold text-[10px]">
                <span>Tested Nonce Counter:</span>
                <span className="text-primary font-black text-xs">{nonce}</span>
              </div>
              <div className="p-1.5 bg-background border border-border rounded-lg text-[10px] font-bold truncate text-foreground">
                {liveHash ? liveHash : "Click Start Mining below"}
              </div>
            </div>

            {!isMining ? (
              <button
                onClick={handleStartMining}
                className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Play size={16} className="fill-current" />
                <span>Start Mining Nonce (Target: {"0".repeat(targetZeros)}...)</span>
              </button>
            ) : (
              <button
                onClick={handleStopMining}
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Pause size={16} className="fill-current" />
                <span>Stop Mining</span>
              </button>
            )}

            {/* Mined Result Display */}
            {minedHash && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1 font-mono text-xs animate-in fade-in">
                <div className="flex justify-between items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>🎉 Valid Block Mined!</span>
                  <span>Nonce: {nonce}</span>
                </div>
                <span className="text-foreground text-[10px] font-bold block truncate">
                  Hash: {minedHash}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
