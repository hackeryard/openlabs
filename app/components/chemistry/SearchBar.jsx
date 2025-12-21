"use client";
// src/components/SearchBar.jsx
import React, { useState, useMemo } from "react";

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
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, symbol, or atomic number..."
        className="w-full border rounded px-3 py-2 text-sm md:text-base"
        aria-label="Search elements"
      />
      {q && results.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 mt-1 bg-white border rounded shadow max-h-60 overflow-auto">
          {results.map((r) => (
            <li key={r.atomicNumber}>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm md:text-base"
                onClick={() => {
                  onSelect(r);
                  setQ("");
                }}
              >
                <strong>{r.symbol}</strong> — {r.name} <span className="text-xs text-gray-500">#{r.atomicNumber}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
