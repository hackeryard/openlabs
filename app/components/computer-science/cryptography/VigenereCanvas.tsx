"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "./lib/cryptoEngines";
import {
  Grid,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Key,
  Play,
  Pause,
  SkipForward,
  FastForward,
} from "lucide-react";

export default function VigenereCanvas() {
  const [keyword, setKeyword] = useState<string>("LEMON");
  const [plaintext, setPlaintext] = useState<string>("ATTACK AT DAWN");
  const [highlightCell, setHighlightCell] = useState<{ row: number; col: number }>({ row: 11, col: 0 });

  // Animation states
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeAnimIndex, setActiveAnimIndex] = useState<number>(-1);
  const [animSpeedMs, setAnimSpeedMs] = useState<number>(700);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Clean uppercase text and key
  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
  const cleanChars = useMemo(() => plaintext.toUpperCase().split(""), [plaintext]);
  const ciphertext = useMemo(() => vigenereEncrypt(plaintext, cleanKey), [plaintext, cleanKey]);

  // Repeated Key Stream mapping
  const keyStream = useMemo(() => {
    let kIdx = 0;
    return plaintext
      .split("")
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const kChar = cleanKey[kIdx % cleanKey.length];
          kIdx++;
          return kChar;
        }
        return " ";
      })
      .join("");
  }, [plaintext, cleanKey]);

  // Step Animation Function
  const stepAnimation = () => {
    setActiveAnimIndex((prev) => {
      let next = prev + 1;
      while (next < cleanChars.length && !/[A-Z]/.test(cleanChars[next])) {
        next++;
      }
      if (next >= cleanChars.length) {
        setIsAnimating(false);
        return -1;
      }

      // Update highlight cell on table
      const plainChar = cleanChars[next];
      const keyChar = keyStream[next];
      if (plainChar && keyChar && /[A-Z]/.test(plainChar) && /[A-Z]/.test(keyChar)) {
        const col = plainChar.charCodeAt(0) - 65;
        const row = keyChar.charCodeAt(0) - 65;
        setHighlightCell({ row, col });
      }

      return next;
    });
  };

  useEffect(() => {
    if (isAnimating) {
      animTimerRef.current = setTimeout(() => {
        stepAnimation();
      }, animSpeedMs);
    }
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, [isAnimating, activeAnimIndex, animSpeedMs, cleanChars, keyStream]);

  const handleStartAnimation = () => {
    setActiveAnimIndex(-1);
    setIsAnimating(true);
    stepAnimation();
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
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
              Animated Vigenère Tableau (Tabula Recta)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Press <strong>▶ Animate Tableau Lookup</strong> to watch the computer scan the <strong>Keyword Row</strong> and <strong>Plaintext Column</strong> to light up their intersection cell on the grid!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Demos:</span>
          <button
            onClick={() => {
              setKeyword("LEMON");
              setPlaintext("ATTACK AT DAWN");
              handleStartAnimation();
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🍋 Key: "LEMON"
          </button>
          <button
            onClick={() => {
              setKeyword("SECRET");
              setPlaintext("TREASURE UNDER TREE");
              handleStartAnimation();
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🤫 Key: "SECRET"
          </button>
          <button
            onClick={() => {
              setKeyword("CIPHER");
              setPlaintext("POLYALPHABETIC CIPHER");
              handleStartAnimation();
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            🛡️ Key: "CIPHER"
          </button>
        </div>
      </div>

      {/* ── Interactive Animation Control Deck ─────────────────── */}
      <div className="p-4 bg-card border border-border rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          {!isAnimating ? (
            <button
              onClick={handleStartAnimation}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Play size={16} className="fill-current" />
              <span>Animate Tableau Lookup</span>
            </button>
          ) : (
            <button
              onClick={handleStopAnimation}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Pause size={16} className="fill-current" />
              <span>Pause Lookup</span>
            </button>
          )}

          <button
            onClick={stepAnimation}
            className="px-3 py-2 bg-muted hover:bg-accent border border-border rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all text-foreground"
          >
            <SkipForward size={16} />
            <span>Next Letter</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Speed:</span>
          <button
            onClick={() => setAnimSpeedMs(1000)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              animSpeedMs === 1000 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            0.5x
          </button>
          <button
            onClick={() => setAnimSpeedMs(700)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              animSpeedMs === 700 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            1.0x
          </button>
          <button
            onClick={() => setAnimSpeedMs(300)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              animSpeedMs === 300 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            2.0x
          </button>
        </div>
      </div>

      {/* ── Letter-by-Letter Real-Time Transformer Ribbon ─────────── */}
      <div className="p-3 bg-card border border-border rounded-3xl space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <span className="text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            <span>Password Stream Alignment (Keyword: {cleanKey})</span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {activeAnimIndex >= 0 ? `Looking up character ${activeAnimIndex + 1}...` : "Click Play to animate"}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto p-1 font-mono">
          {cleanChars.map((char, idx) => {
            const isAlpha = /[A-Z]/.test(char);
            const isCurrentAnim = activeAnimIndex === idx;
            const kChar = keyStream[idx] || " ";
            const cChar = isAlpha ? ciphertext[idx] : char;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (isAlpha) {
                    const col = char.charCodeAt(0) - 65;
                    const row = kChar.charCodeAt(0) - 65;
                    setHighlightCell({ row, col });
                  }
                }}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  isCurrentAnim
                    ? "bg-primary text-primary-foreground border-primary scale-125 shadow-lg animate-bounce z-10"
                    : "bg-muted/40 hover:bg-accent border-border text-foreground"
                }`}
              >
                <span className="text-xs font-black">{char}</span>
                <span className="text-[9px] text-pink-500 font-bold my-0.5">{kChar}</span>
                <span className={`text-xs font-black ${isCurrentAnim ? "text-amber-300" : "text-emerald-500"}`}>
                  {cChar}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Interactive Tabula Recta Grid (7 cols) ────── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Grid size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Vigenère Tableau Grid (Tabula Recta)
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
              26 &times; 26 Letter Matrix
            </span>
          </div>

          {/* 26x26 Scrollable Grid */}
          <div className="flex-1 bg-muted/20 border border-border rounded-2xl p-2 overflow-x-auto max-h-[300px] overflow-y-auto select-none font-mono text-[10px]">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 bg-primary/20 text-primary font-bold border border-border/40">Key</th>
                  {alphabet.map((colChar, cIdx) => (
                    <th
                      key={colChar}
                      className={`p-1 border border-border/40 font-bold transition-all ${
                        cIdx === highlightCell.col ? "bg-indigo-500 text-white scale-110 shadow-sm" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {colChar}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alphabet.map((rowChar, rIdx) => (
                  <tr key={rowChar}>
                    <td
                      className={`p-1 border border-border/40 font-bold text-center transition-all ${
                        rIdx === highlightCell.row ? "bg-pink-500 text-white scale-110 shadow-sm" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rowChar}
                    </td>
                    {alphabet.map((_, cIdx) => {
                      const cellLetter = alphabet[(rIdx + cIdx) % 26];
                      const isHighlighted = rIdx === highlightCell.row && cIdx === highlightCell.col;
                      const isRow = rIdx === highlightCell.row;
                      const isCol = cIdx === highlightCell.col;

                      let cellBg = "hover:bg-accent cursor-pointer";
                      if (isHighlighted) cellBg = "bg-primary text-primary-foreground font-black scale-125 shadow-lg animate-pulse";
                      else if (isRow || isCol) cellBg = "bg-primary/20 font-bold";

                      return (
                        <td
                          key={cIdx}
                          onClick={() => setHighlightCell({ row: rIdx, col: cIdx })}
                          className={`p-1 text-center border border-border/30 transition-all ${cellBg}`}
                        >
                          {cellLetter}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-muted/40 border border-border rounded-2xl flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              Intersect: Key Row <strong>'{alphabet[highlightCell.row]}'</strong> &cap; Plaintext Col <strong>'{alphabet[highlightCell.col]}'</strong>
            </span>
            <span className="font-black text-emerald-500 text-sm">
              &rarr; Ciphertext: '{alphabet[(highlightCell.row + highlightCell.col) % 26]}'
            </span>
          </div>
        </div>

        {/* ── Right: Keyword Alignment Stream & Translation (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Keyword Stream &amp; Input
              </span>
            </div>
          </div>

          {/* Keyword Input */}
          <div className="space-y-1 p-3 bg-muted/40 border border-border rounded-2xl">
            <label className="text-[10px] uppercase font-bold text-foreground block">Secret Repeating Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toUpperCase())}
              className="w-full p-2 bg-background border border-border rounded-xl font-mono text-sm font-black uppercase text-pink-500 tracking-widest"
              placeholder="ENTER KEYWORD..."
            />
          </div>

          {/* Plaintext and Repeated Key Alignment Stream */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block">Full Message &amp; Keystream</label>
            <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2 font-mono text-xs overflow-x-auto">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Message (Plain):</span>
                <span className="font-bold tracking-widest text-foreground">{plaintext.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-pink-500 block">Repeated Key:</span>
                <span className="font-bold tracking-widest text-pink-500">{keyStream}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-[9px] uppercase font-bold text-emerald-500 block">Encrypted (Cipher):</span>
                <span className="font-black tracking-widest text-emerald-600 dark:text-emerald-400">{ciphertext}</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block">Edit Message</label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
              rows={2}
              className="w-full p-2 bg-background border border-border rounded-xl font-mono text-xs uppercase"
              placeholder="Type message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
