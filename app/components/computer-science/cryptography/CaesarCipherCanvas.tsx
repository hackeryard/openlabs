"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  caesarEncrypt,
  caesarDecrypt,
  computeLetterFrequencies,
  crackCaesar,
} from "./lib/cryptoEngines";
import {
  KeyRound,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Wand2,
  ArrowRight,
  Play,
  Pause,
  ArrowRightLeft,
  Lock,
  Unlock,
  RefreshCw,
} from "lucide-react";

export default function CaesarCipherCanvas() {
  const [shift, setShift] = useState<number>(3);
  const [inputText, setInputText] = useState<string>("HELLO WORLD");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [revealedCount, setRevealedCount] = useState<number>(11);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(200);

  // Compute final transformed text based on mode
  const outputText = useMemo(() => {
    return mode === "encrypt"
      ? caesarEncrypt(inputText, shift)
      : caesarDecrypt(inputText, shift);
  }, [inputText, shift, mode]);

  // Clean uppercase array of input characters
  const inputChars = useMemo(() => inputText.toUpperCase().split(""), [inputText]);
  const outputChars = useMemo(() => outputText.toUpperCase().split(""), [outputText]);

  // Live animated characters array (scrambles unrevealed characters, reveals processed ones)
  const displayedOutput = useMemo(() => {
    return inputChars
      .map((char, idx) => {
        if (!/[A-Z]/.test(char)) return char;
        if (idx < revealedCount) {
          return outputChars[idx];
        }
        // If not revealed yet and processing, show original or random scramble
        return isProcessing ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : char;
      })
      .join("");
  }, [inputChars, outputChars, revealedCount, isProcessing]);

  // Auto Crack Result
  const crackResult = useMemo(() => crackCaesar(outputText), [outputText]);

  // Frequency Analysis
  const frequencies = useMemo(() => computeLetterFrequencies(outputText), [outputText]);

  // Alphabet for wheel
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Animate encryption / decryption character by character
  const startTransformation = () => {
    setIsProcessing(true);
    setRevealedCount(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setRevealedCount(current);
      if (current >= inputChars.length) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, speedMs);
  };

  // Trigger animation automatically when user toggles mode or clicks a demo
  const handleToggleMode = () => {
    const newMode = mode === "encrypt" ? "decrypt" : "encrypt";
    setMode(newMode);
    // Set input to current output when switching to decrypt
    setInputText(outputText);
    setTimeout(() => {
      setRevealedCount(0);
      setIsProcessing(true);
      let cur = 0;
      const targetLen = outputText.length;
      const intv = setInterval(() => {
        cur++;
        setRevealedCount(cur);
        if (cur >= targetLen) {
          clearInterval(intv);
          setIsProcessing(false);
        }
      }, speedMs);
    }, 50);
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
              Live Caesar Encryption &amp; Decryption Studio
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type any word or click <strong>▶ Perform {mode === "encrypt" ? "Encryption" : "Decryption"}</strong> to watch each letter shift by <strong>{mode === "encrypt" ? `+${shift}` : `-${shift}`}</strong> in real time!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Demos:</span>
          <button
            onClick={() => {
              setShift(3);
              setInputText("JULIUS CAESAR");
              setMode("encrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🏛️ "JULIUS CAESAR" (+3)
          </button>
          <button
            onClick={() => {
              setShift(13);
              setInputText("TOP SECRET AGENT");
              setMode("encrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🔄 "TOP SECRET" (+13)
          </button>
          <button
            onClick={() => {
              setShift(crackResult.bestShift);
              setMode("decrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500 flex items-center gap-1"
          >
            <Wand2 size={12} />
            <span>Auto-Crack Shift ({crackResult.bestShift})</span>
          </button>
        </div>
      </div>

      {/* ── Big Animated Letter-by-Letter Flip Cards ────────────── */}
      <div className="p-5 bg-card border border-border rounded-3xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-black text-foreground">
              Letter-by-Letter Transformation ({mode === "encrypt" ? "Plaintext ➔ Ciphertext" : "Ciphertext ➔ Plaintext"})
            </span>
          </div>

          {/* Mode Switch & Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                mode === "encrypt"
                  ? "bg-indigo-500/15 text-indigo-500 border-indigo-500/30 hover:bg-indigo-500/25"
                  : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/25"
              }`}
            >
              <ArrowRightLeft size={14} />
              <span>Switch to {mode === "encrypt" ? "Decrypt Mode" : "Encrypt Mode"}</span>
            </button>

            <button
              onClick={startTransformation}
              disabled={isProcessing}
              className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />}
              <span>{isProcessing ? "Transforming..." : `▶ Animate ${mode === "encrypt" ? "Encryption" : "Decryption"}`}</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Letter Tiles */}
        <div className="flex items-center gap-2.5 overflow-x-auto p-2 font-mono select-none min-h-[90px]">
          {inputChars.map((inChar, idx) => {
            const isAlpha = /[A-Z]/.test(inChar);
            if (!isAlpha) {
              return (
                <div key={idx} className="w-8 flex items-center justify-center text-muted-foreground font-bold">
                  {inChar === " " ? "␣" : inChar}
                </div>
              );
            }

            const outChar = outputChars[idx];
            const isRevealed = idx < revealedCount;
            const isCurrentlyFlipping = isProcessing && idx === revealedCount - 1;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-2.5 min-w-[54px] rounded-2xl border transition-all duration-300 ${
                  isCurrentlyFlipping
                    ? "bg-primary text-primary-foreground border-primary scale-110 shadow-xl ring-2 ring-primary/50"
                    : isRevealed
                    ? "bg-muted/60 border-border text-foreground"
                    : "bg-muted/20 border-border/40 opacity-40"
                }`}
              >
                {/* Top Input Letter */}
                <span className="text-xs font-bold text-muted-foreground">{inChar}</span>

                {/* Shift Indicator */}
                <span className="text-[10px] font-bold text-primary my-1">
                  {mode === "encrypt" ? `+${shift}` : `-${shift}`}
                </span>

                {/* Bottom Output Letter */}
                <span
                  className={`text-base font-black transition-all ${
                    isRevealed
                      ? mode === "encrypt"
                        ? "text-pink-500 font-bold scale-105"
                        : "text-emerald-500 font-bold scale-105"
                      : "text-muted-foreground/30"
                  }`}
                >
                  {isRevealed ? outChar : "?"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Interactive Inputs & Result Boxes (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Text Translation Deck
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Shift = {shift} (A ➔ {alphabet[shift % 26]})
              </span>
            </div>
          </div>

          {/* Text Input Box */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                {mode === "encrypt" ? <Lock size={14} className="text-indigo-500" /> : <Unlock size={14} className="text-emerald-500" />}
                <span>{mode === "encrypt" ? "Original Message (Plaintext)" : "Encrypted Input (Ciphertext)"}</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">{inputText.length} characters</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setRevealedCount(e.target.value.length);
              }}
              rows={3}
              className="w-full p-3 bg-background border border-border rounded-2xl font-mono text-sm uppercase tracking-wider font-bold"
              placeholder="Type message here..."
            />
          </div>

          {/* Real-Time Live Transformed Box */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-pink-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-pink-500" />
                <span>{mode === "encrypt" ? "Encrypted Output (Ciphertext)" : "Decrypted Output (Plaintext)"}</span>
              </label>
              <span className="text-[10px] text-pink-500 font-mono font-bold">
                {isProcessing ? "Processing live..." : "Ready"}
              </span>
            </div>
            <div className="p-3.5 bg-muted/40 border border-pink-500/30 rounded-2xl font-mono text-sm font-black uppercase tracking-wider text-pink-500 min-h-[80px] break-all select-all">
              {displayedOutput || "..."}
            </div>
          </div>
        </div>

        {/* ── Right: Shift Controls & Auto-Cracker (5 cols) ────── */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Shift Settings &amp; Cracker
              </span>
            </div>
          </div>

          {/* Shift Slider */}
          <div className="space-y-2 p-3.5 bg-muted/40 border border-border rounded-2xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Shift Positions (k)</span>
              <span className="font-mono text-primary font-black text-sm">+{shift} places</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={shift}
              onChange={(e) => {
                const s = parseInt(e.target.value, 10) || 0;
                setShift(s);
                setRevealedCount(inputText.length);
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>0 (No Change)</span>
              <span>13 (ROT13)</span>
              <span>25 (Shift -1)</span>
            </div>
          </div>

          {/* Auto-Cracker Card */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Wand2 size={15} />
                <span>1-Click Automated Cracker</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Guessed Shift: +{crackResult.bestShift}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Computers analyze the frequency of letters (the letter <strong>E</strong> appears 13% of the time in English) to decode ciphertexts instantly!
            </p>
            <button
              onClick={() => {
                setShift(crackResult.bestShift);
                setMode("decrypt");
                setTimeout(startTransformation, 50);
              }}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Wand2 size={14} />
              <span>Crack &amp; Decrypt with Shift +{crackResult.bestShift}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
