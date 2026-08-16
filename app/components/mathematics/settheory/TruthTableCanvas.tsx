"use client";

import React, { useState, useMemo } from "react";
import { evaluateCustomProposition } from "./lib/setMath";
import {
  Table,
  Sliders,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

export default function TruthTableCanvas() {
  const [customExpr, setCustomExpr] = useState<string>("(p and q) or not r");
  const [activeVariables, setActiveVariables] = useState<string[]>(["p", "q", "r"]);

  const tableData = useMemo(() => {
    return evaluateCustomProposition(customExpr, activeVariables);
  }, [customExpr, activeVariables]);

  const handleAppendSymbol = (sym: string) => {
    setCustomExpr((prev) => prev + " " + sym);
  };

  const handleToggleVariable = (v: string) => {
    if (activeVariables.includes(v)) {
      if (activeVariables.length > 1) {
        setActiveVariables(activeVariables.filter((x) => x !== v));
      }
    } else {
      setActiveVariables([...activeVariables, v]);
    }
  };

  const presets = [
    { label: "De Morgan: ¬(p ∨ q) ↔ (¬p ∧ ¬q)", expr: "not (p or q) iff (not p and not q)", vars: ["p", "q"] },
    { label: "Implication: p → q", expr: "p implies q", vars: ["p", "q"] },
    { label: "Contrapositive: (p → q) ↔ (¬q → ¬p)", expr: "(p implies q) iff (not q implies not p)", vars: ["p", "q"] },
    { label: "Modus Ponens: ((p → q) ∧ p) → q", expr: "((p implies q) and p) implies q", vars: ["p", "q"] },
    { label: "Exclusive OR: p ⊕ q", expr: "p xor q", vars: ["p", "q"] },
    { label: "Distributive: p ∧ (q ∨ r)", expr: "p and (q or r)", vars: ["p", "q", "r"] },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Truth Table Display (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Table size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary truncate max-w-[280px]">
              Dynamic Truth Table ({tableData.rows.length} Rows)
            </span>
          </div>

          <div className="flex items-center gap-1">
            {["p", "q", "r", "s"].map((v) => (
              <button
                key={v}
                onClick={() => handleToggleVariable(v)}
                className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeVariables.includes(v)
                    ? "bg-primary text-primary-foreground font-black shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Truth Table Grid */}
        <div className="flex-1 overflow-x-auto bg-muted/20 rounded-2xl border border-border p-3 max-h-[380px] overflow-y-auto">
          <table className="w-full text-center font-mono text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {tableData.variables.map((v) => (
                  <th key={v} className="p-2 font-bold text-primary">
                    {v}
                  </th>
                ))}
                <th className="p-2 font-black text-foreground bg-primary/10 rounded-lg">
                  Evaluated Result
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, idx) => (
                <tr
                  key={`dyn-row-${idx}`}
                  className="border-b border-border/40 hover:bg-muted/40 transition-colors"
                >
                  {tableData.variables.map((v) => (
                    <td key={`val-${v}`} className="p-2 font-bold">
                      <span className={`px-2 py-0.5 rounded ${row.inputs[v] ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}>
                        {row.inputs[v] ? "T" : "F"}
                      </span>
                    </td>
                  ))}
                  <td className="p-2 font-black">
                    <span
                      className={`px-3 py-1 rounded-lg shadow-sm font-black ${
                        row.finalResult
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {row.finalResult ? "TRUE (1)" : "FALSE (0)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Classification Strip */}
        <div className="p-3 bg-muted/50 border border-border rounded-2xl flex items-center justify-between text-xs font-bold">
          <span className="text-foreground">Proposition Classification:</span>
          <span className="font-mono text-primary font-black">
            {tableData.isTautology
              ? "Tautology (Always True) ✨"
              : tableData.isContradiction
              ? "Contradiction (Always False)"
              : "Contingent (Satisfiable)"}
          </span>
        </div>
      </div>

      {/* ── Right: Custom Formula Keypad & Presets (5 cols) ─── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Formula Builder & Logic Keypad
            </span>
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">Propositional Formula</label>
          <input
            type="text"
            value={customExpr}
            onChange={(e) => setCustomExpr(e.target.value)}
            placeholder="e.g. (p and q) or not r"
            className="w-full p-2.5 bg-muted border border-border rounded-xl font-mono text-xs font-bold text-foreground"
          />
        </div>

        {/* Clickable Logic Keypad */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Insert Logic Operators
          </span>
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs font-bold">
            {[
              ["∧ (and)", "and"],
              ["∨ (or)", "or"],
              ["¬ (not)", "not"],
              ["→ (implies)", "implies"],
              ["↔ (iff)", "iff"],
              ["⊕ (xor)", "xor"],
              ["(", "("],
              [")", ")"],
            ].map(([label, sym]) => (
              <button
                key={label}
                onClick={() => handleAppendSymbol(sym)}
                className="p-2 bg-muted hover:bg-accent border border-border rounded-xl text-center text-foreground hover:text-primary transition-all shadow-sm active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Theorem Presets */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Famous Tautologies & Theorems
          </span>
          <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
            {presets.map((pr) => (
              <button
                key={pr.label}
                onClick={() => {
                  setCustomExpr(pr.expr);
                  setActiveVariables(pr.vars);
                }}
                className="w-full p-2 bg-muted hover:bg-accent border border-border rounded-xl text-left text-xs font-bold text-muted-foreground hover:text-foreground transition-all truncate"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
