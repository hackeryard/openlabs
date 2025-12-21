// src/components/Filters.jsx
import React from "react";

/**
 * Filters
 * - Props:
 *   - categories: string[] (unique categories)
 *   - active: Set or array of active categories
 *   - onToggle(category)
 */

export default function Filters({ categories = [], active = new Set(), onToggle }) {
  return (
    <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Element category filters">
      <button
        onClick={() => onToggle?.("ALL")}
        className="px-2 py-1 rounded bg-gray-200 text-sm"
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
            className={`px-2 py-1 rounded text-sm ${isActive ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            aria-pressed={isActive}
            title={`Filter by ${cat}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
