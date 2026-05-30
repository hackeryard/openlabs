"use client";
// src/components/SearchBar.jsx
import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

/**
 * SearchBar
 * - live search on name | symbol | atomicNumber
 * - props:
 *   - elements: array
 *   - onSelect(element) => void
 */

export default function SearchBar({ elements = [], onSelect }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return [];
    return elements
      .filter((el) => {
        return (
          (el.name && el.name.toLowerCase().includes(v)) ||
          (el.symbol && el.symbol.toLowerCase().includes(v)) ||
          String(el.atomicNumber).startsWith(v)
        );
      })
      .slice(0, 10);
  }, [q, elements]);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, symbol, or atomic number"
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        aria-label="Search elements"
      />
      {q && results.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {results.map((r) => (
            <li key={r.atomicNumber}>
              <button
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-slate-50"
                onClick={() => {
                  onSelect(r);
                  setQ("");
                }}
              >
                <span>
                  <strong className="font-black text-slate-900">{r.symbol}</strong>
                  <span className="ml-2 font-semibold text-slate-600">{r.name}</span>
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                  #{r.atomicNumber}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
