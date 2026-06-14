"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export type PhysicsExperiment = {
  href: string;
  title: string;
  desc: string;
  formula: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
};

const categories = ["All", "Mechanics", "Electricity", "Optics"];

function getCategoryStyles(category: string) {
  switch (category) {
    case "Mechanics":
      return {
        accent: "text-blue-600",
        border: "border-blue-500",
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        iconBg: "bg-blue-50",
      };
    case "Electricity":
      return {
        accent: "text-emerald-600",
        border: "border-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        iconBg: "bg-emerald-50",
      };
    case "Optics":
      return {
        accent: "text-violet-600",
        border: "border-violet-500",
        badge: "bg-violet-50 text-violet-700 border-violet-100",
        iconBg: "bg-violet-50",
      };
    default:
      return {
        accent: "text-slate-600",
        border: "border-slate-400",
        badge: "bg-slate-50 text-slate-600 border-slate-200",
        iconBg: "bg-slate-50",
      };
  }
}

function getDifficultyStyles(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-50 text-green-700 border-green-100";
    case "Intermediate":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Advanced":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function ExperimentCard({ exp }: { exp: PhysicsExperiment }) {
  const styles = getCategoryStyles(exp.category);
  const diffStyles = getDifficultyStyles(exp.difficulty);

  return (
    <article className="group">
      <Link
        href={exp.href}
        className={`h-full bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
        aria-label={`Go to ${exp.title}`}
      >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-indigo-500/20 transition-all`} />

        <div>
          {/* Meta row */}
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-inner ${styles.badge}`}>
              {exp.category}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-inner ${diffStyles}`}>
                {exp.difficulty}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5 tracking-tight leading-snug">
            {exp.title}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed font-medium mb-4">
            {exp.desc}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <code className="text-[11px] font-mono font-semibold text-indigo-600/80 bg-indigo-50/60 px-2.5 py-1 rounded-lg">
            {exp.formula}
          </code>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-slate-400">
              {exp.duration}
            </span>
            <span className="text-[10px] font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function PhysicsExperimentExplorer({ experiments }: { experiments: PhysicsExperiment[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExperiments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return experiments.filter((exp) => {
      const matchesCategory = activeCategory === "All" || exp.category === activeCategory;
      const matchesSearch = !query ||
        exp.title.toLowerCase().includes(query) ||
        exp.desc.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, experiments, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <label htmlFor="physics-search" className="sr-only">Search physics experiments</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            id="physics-search"
            type="search"
            placeholder="Search by experiment name or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter physics experiments by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white/80 backdrop-blur-sm border-slate-200/60 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 shadow-sm"
              }`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Header with count */}
      <div className="flex justify-between items-baseline flex-wrap gap-2 pb-4 border-b border-slate-200/60">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Available experiments</h2>
        <p className="text-xs font-semibold text-slate-400" aria-live="polite">
          {filteredExperiments.length} of {experiments.length} experiments
        </p>
      </div>

      {/* Grid */}
      <section aria-labelledby="physics-experiments-heading">
        <h2 id="physics-experiments-heading" className="sr-only">Physics experiment list</h2>
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-16 px-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">No matching experiments</h3>
            <p className="text-sm text-slate-500 font-medium">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <ExperimentCard key={exp.href} exp={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
