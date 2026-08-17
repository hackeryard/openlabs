"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

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
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, symbol, or atomic number"
        className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm font-semibold text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Search elements"
      />
      {q && results.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 mt-2 max-h-72 overflow-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          {results.map((r) => (
            <li key={r.atomicNumber}>
              <button
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-accent"
                onClick={() => {
                  onSelect(r);
                  setQ("");
                }}
              >
                <span>
                  <strong className="font-black text-foreground">{r.symbol}</strong>
                  <span className="ml-2 font-semibold text-muted-foreground">{r.name}</span>
                </span>
                <span className="rounded-lg bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
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
