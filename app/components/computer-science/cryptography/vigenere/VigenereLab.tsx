"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "../lib/cryptoEngines";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
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
  ArrowRightLeft,
  Lock,
  Unlock,
  RefreshCw,
  Target,
  BookOpen,
} from "lucide-react";

export default function VigenereCipherLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/cryptography/vigenere",
    "computerScience",
    "exploration"
  );

  const [keyword, setKeyword] = useState<string>("LEMON");
  const [inputText, setInputText] = useState<string>("ATTACK AT DAWN");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [revealedCount, setRevealedCount] = useState<number>(14);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [highlightCell, setHighlightCell] = useState<{ row: number; col: number }>({ row: 11, col: 0 });

  // Missions & Quiz
  const [missionCompleted, setMissionCompleted] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "KEY";

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Vigenère Cipher & Tabula Recta Lab",
      theory: "Polyalphabetic substitution cipher using repeating keyword shifts and 26x26 Tabula Recta matrix lookup.",
      extraContext: { keyword: cleanKey, mode },
    });
  }, [cleanKey, mode, setExperimentData]);

  // Compute final output
  const outputText = useMemo(() => {
    return mode === "encrypt"
      ? vigenereEncrypt(inputText, cleanKey)
      : vigenereDecrypt(inputText, cleanKey);
  }, [inputText, cleanKey, mode]);

  const inputChars = useMemo(() => inputText.toUpperCase().split(""), [inputText]);
  const outputChars = useMemo(() => outputText.toUpperCase().split(""), [outputText]);

  // Key stream alignment
  const keyStream = useMemo(() => {
    let kIdx = 0;
    return inputText
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
  }, [inputText, cleanKey]);

  // Animated transformation
  const startTransformation = () => {
    setIsProcessing(true);
    setRevealedCount(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setRevealedCount(current);

      if (current <= inputChars.length) {
        const pChar = inputChars[current - 1];
        const kChar = keyStream[current - 1];
        if (pChar && kChar && /[A-Z]/.test(pChar) && /[A-Z]/.test(kChar)) {
          const col = pChar.charCodeAt(0) - 65;
          const row = kChar.charCodeAt(0) - 65;
          setHighlightCell({ row, col });
        }
      }

      if (current >= inputChars.length) {
        clearInterval(interval);
        setIsProcessing(false);
        completeExperiment();
      }
    }, 250);
  };

  const handleToggleMode = () => {
    const newMode = mode === "encrypt" ? "decrypt" : "encrypt";
    setMode(newMode);
    setInputText(outputText);
    setTimeout(startTransformation, 50);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Grid size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Vigenère Cipher &amp; Tabula Recta Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Interactive Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Polyalphabetic password substitution with live 26&times;26 matrix lookup and visual letter-by-letter transformation
            </p>
          </div>
        </div>
      </div>

      {/* Visual Intuition Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Lightbulb size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              How Vigenère Works (The Repeating Password Cipher)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unlike Caesar which uses one fixed shift, Vigenère repeats a <strong>Secret Keyword</strong> (like <code>{cleanKey}</code>). 
              Each letter of your message is shifted by the matching letter of the keyword!
            </p>
          </div>
        </div>

        {/* 1-Click Demos */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">1-Click Demos:</span>
          <button
            onClick={() => {
              setKeyword("LEMON");
              setInputText("ATTACK AT DAWN");
              setMode("encrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all"
          >
            🍋 Key: "LEMON"
          </button>
          <button
            onClick={() => {
              setKeyword("SECRET");
              setInputText("MEET UNDER BRIDGE");
              setMode("encrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-indigo-500"
          >
            🤫 Key: "SECRET"
          </button>
          <button
            onClick={() => {
              setKeyword("CIPHER");
              setInputText("POLYALPHABETIC CIPHER");
              setMode("encrypt");
              setTimeout(startTransformation, 50);
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold transition-all text-emerald-500"
          >
            🛡️ Key: "CIPHER"
          </button>
        </div>
      </div>

      {/* Big Animated Letter-by-Letter Flip Cards */}
      <div className="p-5 bg-card border border-border rounded-3xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-black text-foreground">
              Letter-by-Letter Transformation ({mode === "encrypt" ? "Plaintext ➔ Ciphertext" : "Ciphertext ➔ Plaintext"})
            </span>
          </div>

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
        <div className="flex items-center gap-2.5 overflow-x-auto p-2 font-mono select-none min-h-[100px]">
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
            const kChar = keyStream[idx] || " ";
            const isRevealed = idx < revealedCount;
            const isCurrentlyFlipping = isProcessing && idx === revealedCount - 1;

            return (
              <div
                key={idx}
                onClick={() => {
                  const col = inChar.charCodeAt(0) - 65;
                  const row = kChar.charCodeAt(0) - 65;
                  setHighlightCell({ row, col });
                }}
                className={`flex flex-col items-center justify-between p-2.5 min-w-[56px] rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isCurrentlyFlipping
                    ? "bg-primary text-primary-foreground border-primary scale-110 shadow-xl ring-2 ring-primary/50"
                    : isRevealed
                    ? "bg-muted/60 border-border text-foreground hover:border-primary"
                    : "bg-muted/20 border-border/40 opacity-40"
                }`}
              >
                <span className="text-xs font-bold text-muted-foreground">{inChar}</span>
                <span className="text-[10px] font-black text-pink-500 my-0.5 bg-pink-500/10 px-1.5 rounded">
                  {kChar}
                </span>
                <span
                  className={`text-base font-black transition-all ${
                    isRevealed
                      ? mode === "encrypt"
                        ? "text-emerald-500 font-bold scale-105"
                        : "text-indigo-500 font-bold scale-105"
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
        {/* 26x26 Tabula Recta Matrix */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Grid size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                26&times;26 Tabula Recta Grid (Click Any Cell)
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
              Row (Key) &cap; Col (Plain)
            </span>
          </div>

          <div className="flex-1 bg-muted/20 border border-border rounded-2xl p-2 overflow-x-auto max-h-[320px] overflow-y-auto select-none font-mono text-[10px]">
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
              Key Row <strong>'{alphabet[highlightCell.row]}'</strong> &cap; Plaintext Col <strong>'{alphabet[highlightCell.col]}'</strong>
            </span>
            <span className="font-black text-emerald-500 text-sm">
              &rarr; Cipher Letter: '{alphabet[(highlightCell.row + highlightCell.col) % 26]}'
            </span>
          </div>
        </div>

        {/* Controls & Inputs */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Keyword &amp; Message Controls
              </span>
            </div>
          </div>

          {/* Keyword Input */}
          <div className="space-y-1.5 p-3.5 bg-muted/40 border border-border rounded-2xl">
            <label className="text-[11px] uppercase font-bold text-foreground block">
              Secret Repeating Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value.toUpperCase());
                setRevealedCount(inputText.length);
              }}
              className="w-full p-2.5 bg-background border border-border rounded-xl font-mono text-sm font-black uppercase text-pink-500 tracking-widest"
              placeholder="ENTER KEYWORD..."
            />
          </div>

          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground block">
              {mode === "encrypt" ? "Message to Encrypt" : "Ciphertext to Decrypt"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setRevealedCount(e.target.value.length);
              }}
              rows={2}
              className="w-full p-2.5 bg-background border border-border rounded-xl font-mono text-xs uppercase"
              placeholder="Type message..."
            />
          </div>

          {/* Output Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-emerald-500 block">
              {mode === "encrypt" ? "Encrypted Output (Ciphertext)" : "Decrypted Output (Plaintext)"}
            </label>
            <div className="p-3 bg-muted/40 border border-emerald-500/30 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-emerald-500 min-h-[50px] break-all select-all">
              {outputText}
            </div>
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
              <h3 className="text-sm font-bold text-foreground">Why does Vigenère defeat frequency analysis?</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Because each letter is shifted by a different amount based on the keyword",
            "Because it converts letters to binary numbers",
            "Because it only works on passwords shorter than 3 letters",
            "Because the alphabet is scrambled backwards",
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
