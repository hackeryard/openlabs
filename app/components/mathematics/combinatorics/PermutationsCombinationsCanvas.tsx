"use client";

import React, { useState, useMemo } from "react";
import { CountingMode, ItemType, ItemElement } from "./types";
import {
  factorial,
  nPr,
  nCr,
  circularPermutations,
  multisetPermutationsCount,
  generatePermutations,
  generateCombinations,
  generateAnagrams,
} from "./lib/combinatoricsMath";
import {
  Hash,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Shuffle,
  Grid,
  Filter,
  Plus,
  Trash2,
  Type,
} from "lucide-react";

const INITIAL_THEMES: Record<ItemType, ItemElement[]> = {
  letters: [
    { id: "1", label: "A", value: "A", color: "#3b82f6" },
    { id: "2", label: "B", value: "B", color: "#ec4899" },
    { id: "3", label: "C", value: "C", color: "#10b981" },
    { id: "4", label: "D", value: "D", color: "#f59e0b" },
    { id: "5", label: "E", value: "E", color: "#8b5cf6" },
    { id: "6", label: "F", value: "F", color: "#06b6d4" },
    { id: "7", label: "G", value: "G", color: "#ef4444" },
    { id: "8", label: "H", value: "H", color: "#84cc16" },
  ],
  colors: [
    { id: "1", label: "🔴 Red", value: "🔴", color: "#ef4444" },
    { id: "2", label: "🔵 Blue", value: "🔵", color: "#3b82f6" },
    { id: "3", label: "🟢 Green", value: "🟢", color: "#10b981" },
    { id: "4", label: "🟡 Yellow", value: "🟡", color: "#eab308" },
    { id: "5", label: "🟣 Purple", value: "🟣", color: "#a855f7" },
    { id: "6", label: "🟠 Orange", value: "🟠", color: "#f97316" },
    { id: "7", label: "🟤 Brown", value: "🟤", color: "#78350f" },
    { id: "8", label: "⚫ Black", value: "⚫", color: "#1f2937" },
  ],
  emojis: [
    { id: "1", label: "🍎 Apple", value: "🍎", color: "#ef4444" },
    { id: "2", label: "🍌 Banana", value: "🍌", color: "#eab308" },
    { id: "3", label: "🍒 Cherry", value: "🍒", color: "#dc2626" },
    { id: "4", label: "🍇 Grapes", value: "🍇", color: "#7c3aed" },
    { id: "5", label: "🍓 Berry", value: "🍓", color: "#f43f5e" },
    { id: "6", label: "🥑 Avocado", value: "🥑", color: "#16a34a" },
    { id: "7", label: "🍍 Pineapple", value: "🍍", color: "#ca8a04" },
    { id: "8", label: "🥝 Kiwi", value: "🥝", color: "#65a30d" },
  ],
  numbers: [
    { id: "1", label: "1", value: "1", color: "#3b82f6" },
    { id: "2", label: "2", value: "2", color: "#ec4899" },
    { id: "3", label: "3", value: "3", color: "#10b981" },
    { id: "4", label: "4", value: "4", color: "#f59e0b" },
    { id: "5", label: "5", value: "5", color: "#8b5cf6" },
    { id: "6", label: "6", value: "6", color: "#06b6d4" },
    { id: "7", label: "7", value: "7", color: "#ef4444" },
    { id: "8", label: "8", value: "8", color: "#84cc16" },
  ],
  custom: [
    { id: "1", label: "Alpha", value: "α", color: "#3b82f6" },
    { id: "2", label: "Beta", value: "β", color: "#ec4899" },
    { id: "3", label: "Gamma", value: "γ", color: "#10b981" },
    { id: "4", label: "Delta", value: "δ", color: "#f59e0b" },
  ],
};

export default function PermutationsCombinationsCanvas() {
  const [mode, setMode] = useState<CountingMode>("combination");
  const [theme, setTheme] = useState<ItemType>("letters");

  const [customPool, setCustomPool] = useState<ItemElement[]>(INITIAL_THEMES.letters);
  const [newItemName, setNewItemName] = useState<string>("");

  const [n, setN] = useState<number>(5);
  const [r, setR] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Anagram / Multiset Word state
  const [anagramWord, setAnagramWord] = useState<string>("BANANA");

  const activeItems = useMemo(() => {
    return customPool.slice(0, n);
  }, [customPool, n]);

  // Multiset count
  const anagramData = useMemo(() => {
    return multisetPermutationsCount(anagramWord);
  }, [anagramWord]);

  // Total counts
  const totalCount = useMemo(() => {
    if (mode === "permutation") return nPr(n, r);
    if (mode === "combination") return nCr(n, r);
    if (mode === "repetition") return Math.pow(n, r);
    if (mode === "circular") return circularPermutations(n);
    if (mode === "multiset_anagram") return anagramData.total;
    return 0;
  }, [n, r, mode, anagramData]);

  // Generated arrangements / subsets
  const generatedList = useMemo(() => {
    if (mode === "permutation") {
      return generatePermutations(activeItems, r, 150);
    } else if (mode === "combination") {
      return generateCombinations(activeItems, r, 150);
    } else if (mode === "circular") {
      return generatePermutations(activeItems, n, 150);
    }
    return generateCombinations(activeItems, r, 150);
  }, [activeItems, r, mode, n]);

  const anagramList = useMemo(() => {
    if (mode === "multiset_anagram") {
      return generateAnagrams(anagramWord, 150);
    }
    return [];
  }, [mode, anagramWord]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return generatedList;
    return generatedList.filter((arr) =>
      arr.some((item) => item.value.toLowerCase().includes(searchQuery.toLowerCase()) || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [generatedList, searchQuery]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const colors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
    const newItem: ItemElement = {
      id: Date.now().toString(),
      label: newItemName.trim(),
      value: newItemName.trim(),
      color: colors[customPool.length % colors.length],
    };
    setCustomPool([...customPool, newItem]);
    setNewItemName("");
    setN(Math.min(8, customPool.length + 1));
  };

  const handleRemoveItem = (id: string) => {
    const nextPool = customPool.filter((item) => item.id !== id);
    setCustomPool(nextPool);
    setN(Math.min(n, nextPool.length));
  };

  const switchTheme = (t: ItemType) => {
    setTheme(t);
    setCustomPool(INITIAL_THEMES[t]);
    setN(Math.min(n, INITIAL_THEMES[t].length));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Item Pool & Enumeration Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Customizable Pool & Enumeration Gallery
            </span>
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            {(["letters", "colors", "emojis", "numbers", "custom"] as ItemType[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTheme(t)}
                className={`px-2 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                  theme === t
                    ? "bg-primary text-primary-foreground font-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {mode === "multiset_anagram" ? (
          /* ── Anagram Word Editor Mode ── */
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Type Word to Generate Anagrams</span>
                <span className="font-mono text-primary font-black">Length: {anagramWord.length}</span>
              </div>

              <input
                type="text"
                value={anagramWord}
                onChange={(e) => setAnagramWord(e.target.value.toUpperCase())}
                className="w-full p-2 bg-background border border-border rounded-xl font-mono text-sm font-black tracking-widest text-center"
                placeholder="e.g. BANANA, MISSISSIPPI"
              />

              <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
                {Object.entries(anagramData.freqMap).map(([char, count]) => (
                  <span key={char} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-bold">
                    &apos;{char}&apos; &times; {count}
                  </span>
                ))}
              </div>
            </div>

            {/* Anagram List Output */}
            <div className="flex-1 bg-muted/20 rounded-2xl border border-border/50 p-3 overflow-hidden">
              <div className="text-xs font-bold mb-2 flex items-center justify-between">
                <span>Unique Anagram Permutations ({anagramList.length} of {totalCount}):</span>
              </div>
              <div className="overflow-y-auto max-h-[220px] grid grid-cols-3 sm:grid-cols-4 gap-2 pr-1 font-mono text-xs">
                {anagramList.map((ana, idx) => (
                  <div key={idx} className="p-2 bg-card border border-border rounded-xl text-center font-black text-primary shadow-sm">
                    {ana}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Standard Permutations/Combinations View ── */
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Active Items Pool with Custom Add/Remove */}
            <div className="p-3 bg-muted/30 border border-border rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Active Item Pool ({activeItems.length} items)</span>
                <span className="text-muted-foreground font-mono text-[11px]">Pick {r}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {activeItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ borderColor: item.color }}
                    className="px-2.5 py-1 rounded-xl border bg-card shadow-sm flex items-center gap-1.5 font-mono text-xs font-black text-foreground group"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {/* Add Item Box */}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ New item"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    className="w-24 p-1 px-2 bg-background border border-border rounded-xl text-xs font-mono"
                  />
                  <button
                    onClick={handleAddItem}
                    className="p-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Enumeration List Display */}
            <div className="flex-1 flex flex-col bg-muted/20 rounded-2xl border border-border/50 p-3 overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">
                    {mode === "permutation" ? "Permutations" : "Combinations"} Output
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Showing {filteredList.length} of {totalCount}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-1 px-2 bg-background border border-border rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[240px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pr-1">
                {filteredList.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-2 bg-card border border-border hover:border-primary/50 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all text-xs font-mono font-bold"
                  >
                    <span className="text-[9px] text-muted-foreground mr-0.5">#{gIdx + 1}</span>
                    {group.map((elem, eIdx) => (
                      <span
                        key={eIdx}
                        style={{ color: elem.color }}
                        className="px-1 py-0.5 rounded bg-muted/60"
                      >
                        {elem.value}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Formulas, Sliders & Counting Controls (5 cols) */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Counting Mode & Controls
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-2xl border border-border">
          {[
            ["combination", "Combinations C(n, r)"],
            ["permutation", "Permutations P(n, r)"],
            ["multiset_anagram", "Anagrams / Multiset"],
            ["repetition", "With Repetition nʳ"],
            ["circular", "Circular (n-1)!"],
          ].map(([mKey, label]) => (
            <button
              key={mKey}
              onClick={() => setMode(mKey as CountingMode)}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center ${
                mode === mKey
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Result Formula Box */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary block">
            {mode === "combination"
              ? "Combinations Formula (Order Unimportant)"
              : mode === "permutation"
              ? "Permutations Formula (Order Matters)"
              : mode === "multiset_anagram"
              ? "Multiset Permutations Formula"
              : mode === "repetition"
              ? "Permutations with Repetition"
              : "Circular Arrangements"}
          </span>

          <div className="font-mono text-base font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
            {mode === "combination" && `C(${n}, ${r}) = ${n}! / (${r}! · ${n - r}!) = ${totalCount}`}
            {mode === "permutation" && `P(${n}, ${r}) = ${n}! / ${n - r}! = ${totalCount}`}
            {mode === "multiset_anagram" && `${anagramWord.length}! / (${Object.values(anagramData.freqMap).map(c => `${c}!`).join("·") || "1"}) = ${totalCount}`}
            {mode === "repetition" && `${n}^${r} = ${totalCount}`}
            {mode === "circular" && `(${n}-1)! = ${factorial(n - 1)} = ${totalCount}`}
          </div>

          <div className="text-xs text-muted-foreground text-center font-mono">
            Factorial {n}! = {factorial(n).toLocaleString()}
          </div>
        </div>

        {/* Sliders for n and r (when not in anagram mode) */}
        {mode !== "multiset_anagram" && (
          <div className="space-y-4">
            <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Total Elements (n)</span>
                <span className="font-mono text-primary font-black">{n}</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(1, customPool.length)}
                step="1"
                value={n}
                onChange={(e) => {
                  const newN = Math.max(1, Math.min(customPool.length, parseInt(e.target.value, 10) || 1));
                  setN(newN);
                  if (r > newN) setR(newN);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {mode !== "circular" && (
              <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Sample Size (r)</span>
                  <span className="font-mono text-primary font-black">{r}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={n}
                  step="1"
                  value={r}
                  onChange={(e) => setR(Math.max(1, Math.min(n, parseInt(e.target.value, 10) || 1)))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
