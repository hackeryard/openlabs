"use client";

import React, { useState, useEffect } from "react";
import { parseExpression, PRESET_FUNCTIONS, FunctionPreset } from "./lib/parser";
import { COLOR_PALETTE } from "./types";
import { Plus, Sparkles, AlertCircle, CheckCircle2, BookOpen, ChevronDown } from "lucide-react";

interface FunctionInputPanelProps {
  onAddFunction: (expression: string, color: string) => void;
  onApplyPreset: (preset: FunctionPreset) => void;
  activeColorIndex: number;
}

const MATH_KEYPAD_BUTTONS = [
  { label: "x²", insert: "x^2" },
  { label: "√x", insert: "sqrt(x)" },
  { label: "sin", insert: "sin(x)" },
  { label: "cos", insert: "cos(x)" },
  { label: "tan", insert: "tan(x)" },
  { label: "ln", insert: "log(x)" },
  { label: "eˣ", insert: "exp(x)" },
  { label: "π", insert: "pi" },
  { label: "|x|", insert: "abs(x)" },
  { label: "1/x", insert: "1/x" },
];

export default function FunctionInputPanel({
  onAddFunction,
  onApplyPreset,
  activeColorIndex,
}: FunctionInputPanelProps) {
  const [expr, setExpr] = useState("x^3 - 3*x");
  const [selectedColor, setSelectedColor] = useState(
    COLOR_PALETTE[activeColorIndex % COLOR_PALETTE.length]
  );
  const [showPresets, setShowPresets] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sync default color
  useEffect(() => {
    setSelectedColor(COLOR_PALETTE[activeColorIndex % COLOR_PALETTE.length]);
  }, [activeColorIndex]);

  // Live expression validation
  const validation = parseExpression(expr);

  const handleAdd = () => {
    if (validation.isValid) {
      onAddFunction(expr, selectedColor);
      setExpr("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && validation.isValid) {
      handleAdd();
    }
  };

  const insertSymbol = (text: string) => {
    setExpr((prev) => (prev ? `${prev} + ${text}` : text));
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-4">
      {/* Header & Presets Trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Function Expression
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shadow-sm"
          >
            <BookOpen size={13} className="text-indigo-500" />
            <span>Preset Gallery</span>
            <ChevronDown size={13} className={showPresets ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>

          {/* Presets Dropdown */}
          {showPresets && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 p-2 space-y-1 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                Standard Mathematical Presets
              </div>
              {PRESET_FUNCTIONS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setExpr(preset.expression);
                    onApplyPreset(preset);
                    setShowPresets(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted transition-colors flex flex-col gap-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                      {preset.category}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-primary/80 font-bold">
                    f(x) = {preset.expression}
                  </div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Bar with Color Selector */}
      <div className="flex items-center gap-2">
        {/* Color Swatch Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-10 h-10 rounded-2xl border border-border flex items-center justify-center transition-all hover:scale-105 shadow-inner"
            style={{ backgroundColor: selectedColor }}
            title="Change curve color"
          />

          {showColorPicker && (
            <div className="absolute left-0 mt-2 p-2 bg-card border border-border rounded-2xl shadow-xl z-50 grid grid-cols-4 gap-1.5 w-36">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-lg border border-border transition-transform hover:scale-110 shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-muted-foreground font-bold text-sm select-none">
            f(x) =
          </div>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. x^2 - 4, sin(x), exp(-x^2)"
            className="w-full pl-16 pr-10 py-2.5 bg-muted/60 border border-border rounded-2xl font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-amber-500" />
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          disabled={!validation.isValid}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Plot</span>
        </button>
      </div>

      {/* Inline Validation Status / Error Message */}
      {!validation.isValid && validation.errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl font-medium">
          <AlertCircle size={14} className="shrink-0" />
          <span>{validation.errorMessage}</span>
        </div>
      )}

      {/* Quick Math Symbols Keypad */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-1">
          Quick:
        </span>
        {MATH_KEYPAD_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => insertSymbol(btn.insert)}
            className="px-2.5 py-1 rounded-xl bg-muted hover:bg-accent border border-border font-mono text-xs font-bold text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
