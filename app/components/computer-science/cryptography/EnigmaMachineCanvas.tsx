"use client";

import React, { useState, useEffect, useRef } from "react";
import { EnigmaConfig } from "./types";
import { stepAndEncodeEnigma } from "./lib/cryptoEngines";
import {
  Cpu,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Zap,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react";

export default function EnigmaMachineCanvas() {
  const [config, setConfig] = useState<EnigmaConfig>({
    rotors: [
      { type: "I", position: 0, ringSetting: 0 },   // Left (Slow)
      { type: "II", position: 0, ringSetting: 0 },  // Middle
      { type: "III", position: 0, ringSetting: 0 }, // Right (Fast)
    ],
    reflector: "B",
    plugboard: [
      ["A", "M"],
      ["F", "X"],
      ["G", "L"],
    ],
  });

  const [lastInputChar, setLastInputChar] = useState<string>("");
  const [lastOutputChar, setLastOutputChar] = useState<string>("");
  const [typedPlaintext, setTypedPlaintext] = useState<string>("");
  const [typedCiphertext, setTypedCiphertext] = useState<string>("");
  const [signalTrace, setSignalTrace] = useState<string[]>([]);
  const [activeBulb, setActiveBulb] = useState<string>("");

  // Auto-Typer Animation States
  const [autoText, setAutoText] = useState<string>("ENIGMA TOP SECRET");
  const [isAutoTyping, setIsAutoTyping] = useState<boolean>(false);
  const [autoTypeIndex, setAutoTypeIndex] = useState<number>(-1);
  const autoTypeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O"],
    ["A", "S", "D", "F", "G", "H", "J", "K"],
    ["P", "Y", "X", "C", "V", "B", "N", "M", "L"],
  ];

  // Press a key on Enigma keyboard
  const handleKeyPress = (char: string) => {
    const { outputChar, updatedConfig, trace } = stepAndEncodeEnigma(char, config);
    setConfig(updatedConfig);
    setLastInputChar(char);
    setLastOutputChar(outputChar);
    setActiveBulb(outputChar);
    setSignalTrace(trace);
    setTypedPlaintext((prev) => prev + char);
    setTypedCiphertext((prev) => prev + outputChar);
  };

  // Auto Typer Loop
  useEffect(() => {
    if (isAutoTyping) {
      autoTypeTimerRef.current = setTimeout(() => {
        const cleanChars = autoText.toUpperCase().replace(/[^A-Z]/g, "");
        const nextIdx = autoTypeIndex + 1;
        if (nextIdx < cleanChars.length) {
          setAutoTypeIndex(nextIdx);
          handleKeyPress(cleanChars[nextIdx]);
        } else {
          setIsAutoTyping(false);
          setAutoTypeIndex(-1);
        }
      }, 500);
    }
    return () => {
      if (autoTypeTimerRef.current) clearTimeout(autoTypeTimerRef.current);
    };
  }, [isAutoTyping, autoTypeIndex, autoText, config]);

  const handleStartAutoType = () => {
    setAutoTypeIndex(-1);
    setIsAutoTyping(true);
  };

  const handleStopAutoType = () => {
    setIsAutoTyping(false);
    if (autoTypeTimerRef.current) clearTimeout(autoTypeTimerRef.current);
  };

  // Reset Rotors & Text
  const handleReset = () => {
    handleStopAutoType();
    setConfig({
      rotors: [
        { type: "I", position: 0, ringSetting: 0 },
        { type: "II", position: 0, ringSetting: 0 },
        { type: "III", position: 0, ringSetting: 0 },
      ],
      reflector: "B",
      plugboard: [
        ["A", "M"],
        ["F", "X"],
        ["G", "L"],
      ],
    });
    setTypedPlaintext("");
    setTypedCiphertext("");
    setLastInputChar("");
    setLastOutputChar("");
    setActiveBulb("");
    setSignalTrace([]);
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
              Animated WWII Enigma Machine Simulator
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click individual keyboard keys below or press <strong>▶ Auto-Type &amp; Encrypt</strong> to watch the gears spin and electrical signals pulse through the machine!
            </p>
          </div>
        </div>

        {/* 1-Click Try This Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw size={14} />
            <span>Reset Machine</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Auto-Typer Deck ────────────────────────── */}
      <div className="p-4 bg-card border border-border rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={autoText}
            onChange={(e) => setAutoText(e.target.value.toUpperCase())}
            placeholder="TYPE PHRASE TO ENCRYPT..."
            className="p-2 bg-background border border-border rounded-2xl font-mono text-xs uppercase w-48 sm:w-60 font-bold"
          />
          {!isAutoTyping ? (
            <button
              onClick={handleStartAutoType}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <Play size={16} className="fill-current" />
              <span>Auto-Type Message</span>
            </button>
          ) : (
            <button
              onClick={handleStopAutoType}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <Pause size={16} className="fill-current" />
              <span>Stop Typing</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-muted-foreground font-bold">
            {isAutoTyping ? "Encrypting live on Enigma..." : "Ready for keypresses"}
          </span>
        </div>
      </div>

      {/* ── Last Keypress Visual Summary Ribbon ────────────────────── */}
      {lastInputChar && (
        <div className="p-3 bg-card border border-border rounded-3xl flex items-center justify-between gap-3 text-xs shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="font-bold text-muted-foreground">Current Pulse:</span>
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2.5 py-1 bg-indigo-500 text-white rounded-xl font-black text-sm animate-pulse">
                Key '{lastInputChar}'
              </span>
              <ArrowRight size={16} className="text-primary animate-bounce" />
              <span className="text-muted-foreground">Electric Pulse &rarr; Lit Up:</span>
              <span className="px-2.5 py-1 bg-amber-400 text-amber-950 rounded-xl font-black text-sm shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse">
                Bulb '{lastOutputChar}'
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-500 font-bold hidden sm:inline">
            ✓ '{lastInputChar}' &ne; '{lastOutputChar}' (Fatal Flaw: Never encrypts to itself)
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Left: Enigma Rotors & Glowing Lampboard (7 cols) ──── */}
        <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Enigma Machine (Wehrmacht I)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-muted-foreground">Reflector UKW-B Active</span>
            </div>
          </div>

          {/* 3 Rotors Header with Spinning Animation */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 border border-border rounded-2xl">
            {config.rotors.map((rotor, idx) => (
              <div key={idx} className="flex flex-col items-center p-2 bg-background border border-border rounded-xl shadow-sm">
                <span className="text-[9px] uppercase font-bold text-muted-foreground">
                  Rotor {idx === 0 ? "I (Slow)" : idx === 1 ? "II (Mid)" : "III (Fast)"}
                </span>
                <span className="text-2xl font-black font-mono text-primary my-1 transition-all duration-300 transform scale-105">
                  {alphabet[rotor.position]}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <button
                    onClick={() => {
                      const newRotors = [...config.rotors] as [any, any, any];
                      newRotors[idx].position = (newRotors[idx].position + 25) % 26;
                      setConfig({ ...config, rotors: newRotors });
                    }}
                    className="px-2 py-0.5 bg-muted hover:bg-accent rounded border border-border"
                  >
                    &uarr;
                  </button>
                  <button
                    onClick={() => {
                      const newRotors = [...config.rotors] as [any, any, any];
                      newRotors[idx].position = (newRotors[idx].position + 1) % 26;
                      setConfig({ ...config, rotors: newRotors });
                    }}
                    className="px-2 py-0.5 bg-muted hover:bg-accent rounded border border-border"
                  >
                    &darr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Glowing Lampboard Bulbs */}
          <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2 select-none">
            <span className="text-[9px] uppercase font-bold text-amber-500 block text-center">
              💡 Lampboard (Lights up output letter)
            </span>
            <div className="flex flex-col items-center gap-1.5">
              {keyboardRows.map((row, rIdx) => (
                <div key={rIdx} className="flex items-center gap-1.5">
                  {row.map((char) => {
                    const isLit = activeBulb === char;
                    return (
                      <div
                        key={`lamp-${char}`}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-black transition-all duration-200 ${
                          isLit
                            ? "bg-amber-400 border-amber-300 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,1)] scale-125"
                            : "bg-muted/80 border-border text-muted-foreground/60"
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Keyboard Keys */}
          <div className="p-4 bg-card border border-border rounded-2xl space-y-2 select-none">
            <span className="text-[9px] uppercase font-bold text-primary block text-center">
              ⌨️ Typewriter Keyboard (Click any key to encrypt!)
            </span>
            <div className="flex flex-col items-center gap-1.5">
              {keyboardRows.map((row, rIdx) => (
                <div key={rIdx} className="flex items-center gap-1.5">
                  {row.map((char) => {
                    const isPressed = lastInputChar === char;
                    return (
                      <button
                        key={`key-${char}`}
                        onClick={() => handleKeyPress(char)}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all shadow-sm ${
                          isPressed
                            ? "bg-primary text-primary-foreground border-primary scale-95 shadow-inner"
                            : "bg-muted hover:bg-primary/20 hover:border-primary text-foreground active:scale-90"
                        }`}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Electrical Signal Trace & Plugboard (5 cols) ─ */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Live Electrical Path
              </span>
            </div>
          </div>

          {/* Signal Route Trace */}
          <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-1.5 min-h-[160px]">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">
              Circuit Route on Last Keystroke
            </span>
            {signalTrace.length > 0 ? (
              <div className="space-y-1 font-mono text-[11px]">
                {signalTrace.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic py-8 text-center">
                Press any letter on the keyboard to watch electricity trace through the machine!
              </div>
            )}
          </div>

          {/* Steckerbrett (Plugboard) Swaps */}
          <div className="p-3.5 bg-muted/40 border border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Steckerbrett (Letter Plug Cables)</span>
              <span className="text-[10px] font-mono text-primary font-bold">3 Swaps</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              {config.plugboard.map(([p1, p2], idx) => (
                <div key={idx} className="px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-xl text-primary font-bold">
                  {p1} &harr; {p2}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Wires on the front panel that swap pairs of letters before the signal reaches the rotors.
            </p>
          </div>

          {/* Text Output History */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="p-2.5 bg-background border border-border rounded-xl">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block font-sans">You Typed (Plaintext):</span>
              <span className="text-foreground font-bold tracking-widest break-all">
                {typedPlaintext || "None"}
              </span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-amber-500/30 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-amber-500 block font-sans">Encrypted Result (Cipher):</span>
              <span className="text-amber-500 font-black tracking-widest break-all">
                {typedCiphertext || "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
