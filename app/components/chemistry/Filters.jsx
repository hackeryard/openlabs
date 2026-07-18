// src/components/Filters.jsx
import React from "react";
import { Check, SlidersHorizontal } from "lucide-react";

/**
 * Filters
 * - Props:
 *   - categories: string[] (unique categories)
 *   - active: Set or array of active categories
 *   - onToggle(category)
 */

export default function Filters({ categories = [], active = new Set(), onToggle }) {
  const formatCategory = (cat) => cat.replace(/-/g, " ");

  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Element category filters">
      <div className="mr-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
        Families
      </div>
      <button
        onClick={() => onToggle?.("ALL")}
        className={`rounded-xl border px-3 py-1.5 text-xs font-black capitalize transition ${
          active.size === 0
            ? "border-indigo-200 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
            : "border-border bg-card text-muted-foreground hover:border-indigo-300 hover:text-indigo-600"
        }`}
        aria-label="Show all categories"
        title="Show all categories"
      >
        All
      </button>
      {categories.map((cat) => {
        const isActive = active.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold capitalize transition ${
              isActive
                ? "border-indigo-200 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "border-border bg-card text-muted-foreground hover:border-indigo-300 hover:text-indigo-600"
            }`}
            aria-pressed={isActive}
            title={`Filter by ${cat}`}
          >
            {isActive && <Check className="h-3 w-3" />}
            {formatCategory(cat)}
          </button>
        );
      })}
    </div>
  );
}
