"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Binary,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Play,
  Pause,
  ArrowRight,
  Zap,
  BookOpen,
  Split,
  Cpu,
  Layers2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type BitwiseOp = "AND" | "OR" | "XOR" | "NOT" | "NAND" | "NOR" | "XNOR" | "SHL" | "SHR" | "ROL" | "ROR";

export interface BitHack {
  name: string;
  formula: string;
  desc: string;
  setup: () => { a: number; b: number; op: BitwiseOp; shift?: number };
}

export default function BitwiseOperationsLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/bitwise-operations",
    "computer-science",
    "simulation"
  );

  // 8-Bit Register Values (0 to 255)
  const [valA, setValA] = useState<number>(0b10101100); // 172
  const [valB, setValB] = useState<number>(0b00111001); // 57
  const [operation, setOperation] = useState<BitwiseOp>("AND");
  const [shiftAmount, setShiftAmount] = useState<number>(1);
  const [isSignedTwosComp, setIsSignedTwosComp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"circuit" | "twos_comp" | "hacks">("circuit");
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Quick Quiz
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Single bit toggles
  const toggleBitA = (bitIndex: number) => {
    setValA((prev) => prev ^ (1 << bitIndex));
    completeExperiment();
  };

  const toggleBitB = (bitIndex: number) => {
    setValB((prev) => prev ^ (1 << bitIndex));
    completeExperiment();
  };

  // Compute Output Byte
  const outputByte = useMemo(() => {
    const a = valA & 0xff;
    const b = valB & 0xff;

    switch (operation) {
      case "AND": return a & b;
      case "OR": return a | b;
      case "XOR": return a ^ b;
      case "NOT": return (~a) & 0xff;
      case "NAND": return (~(a & b)) & 0xff;
      case "NOR": return (~(a | b)) & 0xff;
      case "XNOR": return (~(a ^ b)) & 0xff;
      case "SHL": return (a << shiftAmount) & 0xff;
      case "SHR": return (a >> shiftAmount) & 0xff;
      case "ROL": return ((a << shiftAmount) | (a >> (8 - shiftAmount))) & 0xff;
      case "ROR": return ((a >> shiftAmount) | (a << (8 - shiftAmount))) & 0xff;
      default: return a & b;
    }
  }, [valA, valB, operation, shiftAmount]);

  // Two's complement signed formatter
  const toSigned8 = (val: number) => {
    const u = val & 0xff;
    return u > 127 ? u - 256 : u;
  };

  // Bit Twiddling Hacks Library
  const bitHacks: BitHack[] = [
    {
      name: "Check Power of 2",
      formula: "x & (x - 1) == 0",
      desc: "Clears lowest set bit; returns 0 if and only if exactly 1 bit is set",
      setup: () => ({ a: 32, b: 31, op: "AND" }),
    },
    {
      name: "Isolate Lowest Set Bit",
      formula: "x & (-x)",
      desc: "Extracts the rightmost 1-bit using Two's complement negation (~x + 1)",
      setup: () => ({ a: 40, b: ((~40 + 1) & 0xff), op: "AND" }),
    },
    {
      name: "Clear Bit 4",
      formula: "x & ~(1 << 4)",
      desc: "Zeroes bit at index 4 while keeping all other bits intact",
      setup: () => ({ a: 0b11111111, b: ((~(1 << 4)) & 0xff), op: "AND" }),
    },
    {
      name: "Set Bit 3",
      formula: "x | (1 << 3)",
      desc: "Forces bit at index 3 to 1 using an OR mask",
      setup: () => ({ a: 0b00000000, b: (1 << 3), op: "OR" }),
    },
    {
      name: "Toggle Odd Bits",
      formula: "x ^ 0xAA",
      desc: "Inverts bits 1, 3, 5, 7 while preserving bits 0, 2, 4, 6",
      setup: () => ({ a: 0b11110000, b: 0b10101010, op: "XOR" }),
    },
  ];

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Binary & Bitwise Operations Studio",
      theory: "Bitwise logic gates (AND, OR, XOR, NOT, NAND, NOR, XNOR), arithmetic and logical bit-shifts, circular rotations, Two's complement representation, and high-performance mask hacks.",
      extraContext: { valA, valB, operation, outputByte, isSignedTwosComp },
    });
  }, [valA, valB, operation, outputByte, isSignedTwosComp, setExperimentData]);

  return (
    <div className="w-full p-2.5 sm:p-4 bg-background text-foreground space-y-2.5 max-w-7xl mx-auto">
      {/* Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card border border-border rounded-2xl p-2.5 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
            <Binary size={18} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-foreground tracking-tight leading-none">
              Binary &amp; Bitwise Operations Studio
            </h1>
            <span className="text-[10px] text-muted-foreground font-medium">
              8-Bit Register Tiles &bull; Logic Gates &bull; Two&apos;s Complement &bull; Masking Hacks
            </span>
          </div>
        </div>

        {/* Signed / Unsigned Toggle & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsSignedTwosComp(!isSignedTwosComp);
              completeExperiment();
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              isSignedTwosComp
                ? "bg-primary/20 border-primary text-primary"
                : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSignedTwosComp ? "Signed Two's Comp" : "Unsigned (0 - 255)"}
          </button>

          <button
            onClick={() => {
              setValA(0b10101100);
              setValB(0b00111001);
              setOperation("AND");
              setShiftAmount(1);
            }}
            className="p-1.5 bg-card hover:bg-accent border border-border rounded-xl text-muted-foreground hover:text-foreground"
            title="Reset Registers"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        {/* Left: 8-Bit Interactive Registers (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          {/* Register A */}
          <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-extrabold text-sky-500 text-[11px] uppercase flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-sky-500/10 text-sky-500 text-[9px] flex items-center justify-center font-bold">A</span>
                Register A:
              </span>
              <span className="text-[10px] text-muted-foreground">
                Dec: <strong className="text-foreground">{isSignedTwosComp ? toSigned8(valA) : valA}</strong> &bull; Hex: <strong className="text-sky-400">0x{valA.toString(16).toUpperCase().padStart(2, "0")}</strong>
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1 font-mono">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                const bitVal = (valA >> bitIdx) & 1;
                const isSignBit = bitIdx === 7 && isSignedTwosComp;

                return (
                  <button
                    key={bitIdx}
                    onClick={() => toggleBitA(bitIdx)}
                    className={`h-9 sm:h-10 rounded-xl font-mono font-black text-xs flex flex-col items-center justify-center transition-all border ${
                      bitVal === 1
                        ? "bg-sky-500 text-white border-sky-400 shadow-sm scale-[1.02]"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                    } ${isSignBit ? "ring-1 ring-rose-500" : ""}`}
                  >
                    <span>{bitVal}</span>
                    <span className="text-[7px] opacity-70 font-sans">
                      {isSignBit ? "S" : `b${bitIdx}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operation Selector Bar */}
          <div className="p-2 bg-muted/40 border border-border rounded-2xl space-y-1.5">
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1 font-mono text-[10px] font-bold">
              {(["AND", "OR", "XOR", "NOT", "NAND", "NOR", "XNOR", "SHL", "SHR", "ROL", "ROR"] as BitwiseOp[]).map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    setOperation(op);
                    completeExperiment();
                  }}
                  className={`py-1 rounded-lg transition-all border text-center ${
                    operation === op
                      ? "bg-primary text-primary-foreground border-primary shadow-sm font-black"
                      : "bg-card/70 hover:bg-accent border-border text-foreground"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>

            {/* Shift Slider if active */}
            {["SHL", "SHR", "ROL", "ROR"].includes(operation) && (
              <div className="flex items-center justify-between gap-2 px-1 pt-1 text-[10px] font-mono border-t border-border/50">
                <span className="text-muted-foreground font-bold">Shift Amount:</span>
                <span className="font-black text-primary">{shiftAmount} bit{shiftAmount > 1 ? "s" : ""}</span>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={shiftAmount}
                  onChange={(e) => setShiftAmount(parseInt(e.target.value, 10))}
                  className="w-28 h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}
          </div>

          {/* Register B (Only if 2-operand operation) */}
          {operation !== "NOT" && (
            <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-extrabold text-amber-500 text-[11px] uppercase flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-500/10 text-amber-500 text-[9px] flex items-center justify-center font-bold">B</span>
                  Register B:
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Dec: <strong className="text-foreground">{isSignedTwosComp ? toSigned8(valB) : valB}</strong> &bull; Hex: <strong className="text-amber-400">0x{valB.toString(16).toUpperCase().padStart(2, "0")}</strong>
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1 font-mono">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                  const bitVal = (valB >> bitIdx) & 1;

                  return (
                    <button
                      key={bitIdx}
                      onClick={() => toggleBitB(bitIdx)}
                      className={`h-9 sm:h-10 rounded-xl font-mono font-black text-xs flex flex-col items-center justify-center transition-all border ${
                        bitVal === 1
                          ? "bg-amber-500 text-white border-amber-400 shadow-sm scale-[1.02]"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                      }`}
                    >
                      <span>{bitVal}</span>
                      <span className="text-[7px] opacity-70 font-sans">b{bitIdx}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Output Result Register */}
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-extrabold text-emerald-400 text-[11px] uppercase">
                Result = A {operation} {operation !== "NOT" ? "B" : ""}:
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                Dec: {isSignedTwosComp ? toSigned8(outputByte) : outputByte} &bull; Hex: 0x{outputByte.toString(16).toUpperCase().padStart(2, "0")} &bull; Oct: {outputByte.toString(8).padStart(3, "0")}
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1 font-mono">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                const bitVal = (outputByte >> bitIdx) & 1;

                return (
                  <div
                    key={bitIdx}
                    className={`h-9 sm:h-10 rounded-xl font-mono font-black text-xs flex flex-col items-center justify-center border ${
                      bitVal === 1
                        ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-600"
                    }`}
                  >
                    <span>{bitVal}</span>
                    <span className="text-[7px] opacity-70 font-sans">b{bitIdx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Logic Circuit Truth Table / Two's Comp / Bit Hacks (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-2.5 sm:p-3 shadow-sm space-y-2 flex flex-col justify-between">
          {/* Tab Selector */}
          <div className="flex gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("circuit")}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === "circuit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Gate Truth Table
            </button>
            <button
              onClick={() => setActiveTab("twos_comp")}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === "twos_comp" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Two&apos;s Complement
            </button>
            <button
              onClick={() => setActiveTab("hacks")}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === "hacks" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bit Hacks
            </button>
          </div>

          {/* Tab 1: Truth Table Matrix */}
          {activeTab === "circuit" && (
            <div className="p-2 bg-slate-950 border border-border/80 rounded-xl space-y-1 text-xs font-mono">
              <div className="grid grid-cols-4 gap-1 text-center bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-[10px]">
                <span className="text-slate-400 font-bold">Bit #</span>
                <span className="text-sky-400 font-bold">A</span>
                <span className="text-amber-400 font-bold">B</span>
                <span className="text-emerald-400 font-bold">Out</span>

                {[7, 6, 5, 4, 3, 2, 1, 0].map((idx) => {
                  const aBit = (valA >> idx) & 1;
                  const bBit = (valB >> idx) & 1;
                  const outBit = (outputByte >> idx) & 1;

                  return (
                    <React.Fragment key={idx}>
                      <span className="text-slate-500 py-0.5">b{idx}</span>
                      <span className="text-sky-400 py-0.5">{aBit}</span>
                      <span className="text-amber-400 py-0.5">{operation !== "NOT" ? bBit : "-"}</span>
                      <span className="text-emerald-400 font-black py-0.5">{outBit}</span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Two's Complement Conversion */}
          {activeTab === "twos_comp" && (
            <div className="p-2 bg-muted/20 border border-border/60 rounded-xl space-y-1.5 text-xs font-mono">
              <span className="text-[9px] text-primary font-bold uppercase block">
                Two&apos;s Complement Negation Workflow:
              </span>
              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-slate-400">1. Original A:</span>
                  <span className="font-bold text-sky-400">{valA.toString(2).padStart(8, "0")} ({valA})</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-slate-400">2. Invert Bits (~A):</span>
                  <span className="font-bold text-amber-400">{((~valA) & 0xff).toString(2).padStart(8, "0")}</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                  <span className="text-slate-400">3. Add 1 (~A + 1):</span>
                  <span className="font-bold text-emerald-400">{((~valA + 1) & 0xff).toString(2).padStart(8, "0")} ({toSigned8((~valA + 1) & 0xff)})</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bit Hacks Library */}
          {activeTab === "hacks" && (
            <div className="space-y-1 max-h-[165px] overflow-y-auto pr-1">
              {bitHacks.map((hack, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const res = hack.setup();
                    setValA(res.a);
                    setValB(res.b);
                    setOperation(res.op);
                    if (res.shift) setShiftAmount(res.shift);
                    completeExperiment();
                  }}
                  className="w-full p-1.5 px-2 bg-muted/30 hover:bg-accent border border-border rounded-xl text-left transition-all space-y-0.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-foreground">{hack.name}</span>
                    <span className="text-[9px] font-mono font-black text-amber-500">{hack.formula}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground truncate">{hack.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Expandable Quick Quiz Drawer ─── */}
      <div className="bg-card border border-border rounded-2xl p-2.5 shadow-sm text-xs">
        <button
          onClick={() => setIsQuizOpen(!isQuizOpen)}
          className="w-full flex justify-between items-center text-left font-bold text-foreground hover:text-primary transition"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-primary" />
            <span className="text-[11px]">Conceptual Check: Why does XOR swapping swap two variables without temporary storage?</span>
          </div>
          {isQuizOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isQuizOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-border animate-in fade-in">
            {[
              "Because XOR is its own inverse (x ^ x = 0 and x ^ 0 = x); the sequence algebraically cancels the original operands into their swapped values",
              "Because XOR multiplies both numbers together",
              "Because XOR shifts bits into CPU cache memory",
              "Because it only works on positive numbers",
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
                  className={`p-2 rounded-xl border text-left text-[11px] transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {quizAnswered && isCorrect && <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
