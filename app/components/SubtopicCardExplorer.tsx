"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Layers } from "lucide-react";

export type SubtopicCard = {
  href: string;
  title: string;
  desc: string;
  tag?: string;
  formula?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
};

function getDifficultyStyles(difficulty?: string) {
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

const themeTextMap: Record<string, string> = {
  indigo: "text-indigo-600 dark:text-indigo-400",
  purple: "text-purple-600 dark:text-purple-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  rose: "text-rose-600 dark:text-rose-400",
  amber: "text-amber-600 dark:text-amber-400",
  teal: "text-teal-600 dark:text-teal-400",
  blue: "text-blue-600 dark:text-blue-400",
};

export default function SubtopicCardExplorer({
  cards,
  themeColor = "purple",
  subtopicTitle = "Module",
}: {
  cards: SubtopicCard[];
  themeColor?: "indigo" | "purple" | "emerald" | "rose" | "amber" | "teal" | "blue";
  subtopicTitle?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => {
    const unique = Array.from(new Set(cards.map((c) => c.tag).filter(Boolean))) as string[];
    return unique.length > 1 ? ["All", ...unique] : [];
  }, [cards]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cards.filter((card) => {
      const matchTag = selectedTag === "All" || card.tag === selectedTag;
      const matchQuery =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.desc.toLowerCase().includes(q) ||
        (card.formula && card.formula.toLowerCase().includes(q)) ||
        (card.tag && card.tag.toLowerCase().includes(q));
      return matchTag && matchQuery;
    });
  }, [cards, searchQuery, selectedTag]);

  return (
    <div className="space-y-8 mb-16">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${subtopicTitle.toLowerCase()} labs, concepts, laws...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background text-foreground placeholder:text-muted-foreground rounded-xl border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {tags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border p-8">
          <Layers className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-base font-bold text-foreground">No matching {subtopicTitle.toLowerCase()} modules found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const diffStyles = getDifficultyStyles(card.difficulty);
            return (
              <article key={card.href} className="group">
                <Link
                  href={card.href}
                  className="h-full bg-card rounded-3xl border border-border p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  aria-label={`Open ${card.title}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-muted group-hover:bg-primary/40 transition-all" />

                  <div>
                    {/* Meta row */}
                    <div className="flex justify-between items-start mb-4">
                      {card.tag && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-inner bg-primary/10 text-primary border-primary/20">
                          {card.tag}
                        </span>
                      )}
                      {card.difficulty && (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-inner ${diffStyles} ml-auto`}>
                          {card.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors mb-2.5 tracking-tight leading-snug">
                      {card.title}
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-4">
                      {card.desc}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
                    {card.formula ? (
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                          Principle
                        </span>
                        <code className={`text-xs font-mono font-bold ${themeTextMap[themeColor]} truncate block`}>
                          {card.formula}
                        </code>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-semibold">
                        {card.duration || "10-15 min"}
                      </span>
                    )}

                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold group-hover:bg-primary/90 transition-all shadow-xs">
                      <span>Launch</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
