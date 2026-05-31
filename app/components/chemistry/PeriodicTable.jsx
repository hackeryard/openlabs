"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import elements from "../../src/data/elements";
import ElementCard from "./ElementCard";
import ElementModal from "./ElementModal";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import { Atom, Download, RotateCcw, Table2, FlaskConical } from "lucide-react";

export default function PeriodicTable({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [querySelected, setQuerySelected] = useState(null);
  const [explored, setExplored] = useState(new Set());

  useEffect(() => {
    if (selected) {
      setExplored(prev => {
        const next = new Set(prev).add(selected.symbol);
        if (next.size >= 3 && onComplete) onComplete();
        return next;
      });
    }
  }, [selected, onComplete]);

  /* ---------------- Categories ---------------- */
  const categories = useMemo(() => {
    return Array.from(
      new Set(elements.map(e => e.category).filter(Boolean))
    ).sort();
  }, []);

  const categoryStyles = {
    "alkali-metal": { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 border-rose-200" },
    "alkaline-earth": { dot: "bg-orange-500", chip: "bg-orange-50 text-orange-700 border-orange-200" },
    lanthanide: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
    actinide: { dot: "bg-yellow-500", chip: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    "noble-gas": { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700 border-sky-200" },
    "transition-metal": { dot: "bg-indigo-500", chip: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    "post-transition": { dot: "bg-slate-500", chip: "bg-slate-50 text-slate-700 border-slate-200" },
    metalloid: { dot: "bg-teal-500", chip: "bg-teal-50 text-teal-700 border-teal-200" },
    nonmetal: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    halogen: { dot: "bg-violet-500", chip: "bg-violet-50 text-violet-700 border-violet-200" },
  };
  const formatCategory = (cat) => cat.replace(/-/g, " ");

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
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.01 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 }
  };

  const renderGridCells = () => {
    const cells = [];
    for (let p = 1; p <= 7; p++) {
      for (let g = 1; g <= 18; g++) {
        const el = elementMap.get(`${p}-${g}`);
        cells.push(
          el ? (
            <motion.div
              key={`${p}-${g}`}
              variants={itemVariants}
            >
              <ElementCard element={el} onOpen={setSelected} />
            </motion.div>
          ) : (
            <div key={`${p}-${g}`} className="aspect-square" />
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
      <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-md backdrop-blur">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span className={`h-2.5 w-2.5 rounded-full ${categoryStyles[type]?.dot || "bg-slate-400"}`} />
          {formatCategory(type)} series
        </div>
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-1 sm:gap-2"
          style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        >
          {[...Array(2)].map((_, i) => <div key={`spacer-${i}`} />)}

          {items.map(el => (
            <motion.div key={el.symbol} variants={itemVariants}>
              <ElementCard element={el} onOpen={setSelected} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };


  /* ---------------- UI ---------------- */
  return (
    <section className="max-w-[1600px] mx-auto px-0 sm:px-2 py-6 space-y-6">
      {/* Header */}
      <motion.div
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_420px] md:p-7">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
              <FlaskConical className="h-3.5 w-3.5 animate-pulse" />
              Quantum Element Workbench
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Interactive Periodic Table
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
                Filter families, inspect atomic properties, open 3D atom pages, and export focused datasets from a polished lab console.
              </p>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
                <div className="font-mono text-xl font-black text-slate-900 sm:text-2xl">118</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Elements</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
                <div className="font-mono text-xl font-black text-slate-900 sm:text-2xl">{filtered.length}</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Visible</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
                <div className="font-mono text-xl font-black text-indigo-600 sm:text-2xl">{explored.size}</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Visited</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <SearchBar elements={elements} onSelect={setQuerySelected} />
            {querySelected && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-700">
                Focused on {querySelected.name}. Clear search to restore the full table.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="sticky top-2 z-10 space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <Filters categories={categories} active={activeCategories} onToggle={onToggleCategory} />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setQuerySelected(null);
                setActiveCategories(new Set());
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="hidden flex-wrap gap-2 border-t border-slate-100 pt-3 text-xs sm:flex">
          {categories.map(cat => (
            <div
              key={cat}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-1 font-bold capitalize ${categoryStyles[cat]?.chip || "border-slate-200 bg-slate-50 text-slate-600"}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${categoryStyles[cat]?.dot || "bg-slate-400"}`} />
              <span>{formatCategory(cat)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-1.5 shadow-xl backdrop-blur sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Table2 className="h-4 w-4 text-indigo-500" />
            Element Matrix
          </div>
          <div className="hidden items-center gap-2 text-[10px] font-bold text-slate-400 sm:flex">
            <Atom className="h-4 w-4 text-indigo-500" />
            Arrow keys navigate focused cells
          </div>
        </div>
        <div className="w-full">
          <div className="mx-auto w-full">
            <div className="mb-1 grid gap-1 pl-0 sm:mb-2 sm:gap-2" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="text-center font-mono text-[7px] font-black text-slate-400 sm:text-[10px]">
                  {i + 1}
                </div>
              ))}
            </div>
            <motion.div
              ref={gridRef}
              role="grid"
              tabIndex={0}
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-1 sm:gap-2"
              style={{
                gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
              }}
            >
              {renderGridCells()}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* f-block */}
      <div className="space-y-4">
        {renderFBlock("lanthanide")}
        {renderFBlock("actinide")}
      </div>

      <AnimatePresence>
        {selected && (
          <ElementModal element={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
