"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Dna, Microscope } from "lucide-react";

export type BiologyExperiment = {
  href: string;
  title: string;
  desc: string;
  formula: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
};

const categories = ["All", "Cellular Biology", "Genetics", "Physiology", "Anatomy", "Neuroscience"];

function getCategoryStyles(category: string) {
  switch (category) {
    case "Cellular Biology":
      return {
        badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900",
      };
    case "Genetics":
      return {
        badge: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900",
      };
    case "Physiology":
      return {
        badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900",
      };
    case "Anatomy":
      return {
        badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900",
      };
    case "Neuroscience":
      return {
        badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900",
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground border-border",
      };
  }
}

function getDifficultyStyles(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900";
    case "Intermediate":
      return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900";
    case "Advanced":
      return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function ExperimentCard({ exp }: { exp: BiologyExperiment }) {
  const styles = getCategoryStyles(exp.category);
  const diffStyles = getDifficultyStyles(exp.difficulty);

  return (
    <article className="group">
      <Link
        href={exp.href}
        className="h-full bg-card rounded-3xl border border-border p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        aria-label={`Go to ${exp.title}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted group-hover:bg-rose-500/30 transition-all" />

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
          <h3 className="text-xl font-extrabold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-2.5 tracking-tight leading-snug">
            {exp.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-4">
            {exp.desc}
          </p>
        </div>

        {/* Footer info: Formula/Concept + Action */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
              Biological Concept
            </span>
            <code className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 truncate block">
              {exp.formula}
            </code>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold group-hover:bg-primary/90 transition-all shadow-xs">
            <span>Launch</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function BiologyExperimentExplorer({
  experiments,
}: {
  experiments: BiologyExperiment[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(experiments.map((e) => e.category)))];
  }, [experiments]);

  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchSearch =
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.desc.toLowerCase().includes(search.toLowerCase()) ||
        exp.formula.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCategory === "All" || exp.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [experiments, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search biology labs, cell structures, genetics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background text-foreground placeholder:text-muted-foreground rounded-xl border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Categories */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border p-8">
          <Dna className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-base font-bold text-foreground">No biology simulations found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => (
            <ExperimentCard key={exp.href} exp={exp} />
          ))}
        </div>
      )}
    </div>
  );
}
