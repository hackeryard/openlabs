// app/components/seo/KnowledgeGraphVisualizer.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ConceptEntity } from "@/app/lib/types/knowledge";
import { ALL_CONCEPTS } from "@/app/lib/knowledge/concepts";
import { Network, Sparkles, BookOpen, ExternalLink } from "lucide-react";

interface KnowledgeGraphVisualizerProps {
  initialSubject?: string;
}

export default function KnowledgeGraphVisualizer({ initialSubject }: KnowledgeGraphVisualizerProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || "all");
  const [activeConcept, setActiveConcept] = useState<ConceptEntity | null>(ALL_CONCEPTS[0] || null);

  const filteredConcepts = selectedSubject === "all"
    ? ALL_CONCEPTS
    : ALL_CONCEPTS.filter((c) => c.subject === selectedSubject);

  return (
    <div className="w-full bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Network className="text-primary" size={20} />
            Interactive Concept Knowledge Graph
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore scientific prerequisites, learning paths, and simulation relationships visually.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {["all", "physics", "chemistry", "biology", "computerScience"].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedSubject === subj
                  ? "bg-primary text-primary-foreground font-semibold border-primary"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/40"
              }`}
            >
              {subj === "computerScience" ? "CS" : subj.charAt(0).toUpperCase() + subj.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Concept Nodes Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredConcepts.map((concept) => {
            const isSelected = activeConcept?.id === concept.id;
            return (
              <div
                key={concept.id}
                onClick={() => setActiveConcept(concept)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-background/50 hover:bg-accent/40 border-border/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {concept.domain}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">{concept.difficulty}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1">{concept.title}</h3>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {concept.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Concept Details Panel */}
        {activeConcept ? (
          <div className="p-5 rounded-xl bg-muted/20 border border-border/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} /> {activeConcept.subject} • {activeConcept.domain}
              </div>
              <h3 className="font-bold text-base mb-2">{activeConcept.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {activeConcept.quickAnswer || activeConcept.description}
              </p>

              {activeConcept.prerequisites.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Prerequisites</div>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {activeConcept.prerequisites.map((pId) => (
                      <span key={pId} className="px-2 py-0.5 rounded bg-background border border-border text-foreground font-mono">
                        {pId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={activeConcept.slug}
              className="flex items-center justify-center gap-2 w-full text-xs font-semibold bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <BookOpen size={14} /> Open Interactive Lab & Theory <ExternalLink size={12} />
            </Link>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center border border-dashed rounded-xl">
            Select a concept node to inspect prerequisites & formulas
          </div>
        )}
      </div>
    </div>
  );
}
