"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import elements from "../../src/data/elements";
import ElementCard from "./ElementCard";
import ElementModal from "./ElementModal";
import SearchBar from "./SearchBar";
import Filters from "./Filters";

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null);
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [querySelected, setQuerySelected] = useState(null);

  /* ---------------- Categories ---------------- */
  const categories = useMemo(() => {
    return Array.from(
      new Set(elements.map(e => e.category).filter(Boolean))
    ).sort();
  }, []);

  const categoryColors = {
    "alkali metal": "bg-red-300",
    "alkaline earth metal": "bg-orange-300",
    lanthanide: "bg-amber-300",
    actinide: "bg-yellow-300",
    "noble gas": "bg-blue-300",
    "transition metal": "bg-indigo-300",
    "post-transition metal": "bg-slate-300",
    metalloid: "bg-emerald-300",
    nonmetal: "bg-lime-300",
    halogen: "bg-violet-300",
  };

  /* ---------------- Filtering ---------------- */
  const filtered = useMemo(() => {
    if (querySelected) return [querySelected];
    if (activeCategories.size === 0) return elements;
    return elements.filter(el => activeCategories.has(el.category));
  }, [activeCategories, querySelected]);

  const elementMap = useMemo(() => {
    const map = new Map();
    filtered.forEach(el => {
      map.set(`${el.period}-${el.group}`, el);
    });
    return map;
  }, [filtered]);

  /* ---------------- Keyboard Navigation ---------------- */
  const gridRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

      const active = document.activeElement;
      if (!gridRef.current?.contains(active)) return;

      const p = Number(active.dataset.period);
      const g = Number(active.dataset.group);
      if (!p || !g) return;

      e.preventDefault();
      let target;

      const find = (np, ng) => elementMap.has(`${np}-${ng}`) && `${np}-${ng}`;

      if (e.key === "ArrowRight")
        for (let ng = g + 1; ng <= 18; ng++) if ((target = find(p, ng))) break;

      if (e.key === "ArrowLeft")
        for (let ng = g - 1; ng >= 1; ng--) if ((target = find(p, ng))) break;

      if (e.key === "ArrowDown")
        for (let np = p + 1; np <= 7; np++) if ((target = find(np, g))) break;

      if (e.key === "ArrowUp")
        for (let np = p - 1; np >= 1; np--) if ((target = find(np, g))) break;

      if (target) {
        const [tp, tg] = target.split("-");
        gridRef.current
          .querySelector(`button[data-period="${tp}"][data-group="${tg}"]`)
          ?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [elementMap]);

  /* ---------------- Actions ---------------- */
  const onToggleCategory = (cat) => {
    if (cat === "ALL") return setActiveCategories(new Set());
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const handleExportCSV = () => {
    const rows = [
      ["atomicNumber", "symbol", "name", "atomicMass", "category"],
      ...filtered.map(e => [
        e.atomicNumber,
        e.symbol,
        `"${e.name}"`,
        `"${e.atomicMass}"`,
        `"${e.category}"`,
      ]),
    ];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `periodic-table-${Date.now()}.csv`;
    a.click();
  };

  /* ---------------- Render Helpers ---------------- */
  const renderGridCells = () => {
    const cells = [];
    for (let p = 1; p <= 7; p++) {
      for (let g = 1; g <= 18; g++) {
        const el = elementMap.get(`${p}-${g}`);
        cells.push(
          el ? (
            <ElementCard key={`${p}-${g}`} element={el} onOpen={setSelected} />
          ) : (
            <div key={`${p}-${g}`} />
          )
        );
      }
    }
    return cells;
  };

  const renderFBlock = (type) => {
    const items = filtered.filter(el => el.category === type);
    if (!items.length) return null;

    return (
      <div className="flex justify-center mt-4">
        <div
          className="grid gap-2 origin-top"
          style={{
            gridTemplateColumns: "repeat(18, minmax(44px, 1fr))",
            transform: "scale(min(1, (100vw - 32px) / 900))",
          }}
        >
          {[...Array(2)].map((_, i) => <div key={`spacer-${i}`} />)}
          {items.map(el => (
            <ElementCard key={el.symbol} element={el} onOpen={setSelected} />
          ))}
        </div>
      </div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Interactive Periodic Table
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Explore, filter & learn chemical elements
          </p>
        </div>
        <SearchBar elements={elements} onSelect={setQuerySelected} />
      </header>

      {/* Controls */}
      <div className="sticky top-2 z-10 bg-white/80 backdrop-blur border rounded-xl p-4 shadow-sm space-y-3">
        <Filters categories={categories} active={activeCategories} onToggle={onToggleCategory} />

        <div className="flex flex-wrap gap-3 text-xs">
          {categories.map(cat => (
            <div key={cat} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${categoryColors[cat]}`} />
              <span className="capitalize">{cat.replace(/-/g, " ")}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setQuerySelected(null)}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="rounded-2xl border bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 shadow-inner overflow-hidden">
        <div className="flex justify-center">
          <div
            ref={gridRef}
            role="grid"
            tabIndex={0}
            className="grid gap-2 origin-top"
            style={{
              gridTemplateColumns: "repeat(18, minmax(44px, 1fr))",
              transform: "scale(min(1, (100vw - 32px) / 900))",
            }}
          >
            {renderGridCells()}
          </div>
        </div>
      </div>

      {/* f-block */}
      {renderFBlock("lanthanide")}
      {renderFBlock("actinide")}

      <ElementModal element={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
