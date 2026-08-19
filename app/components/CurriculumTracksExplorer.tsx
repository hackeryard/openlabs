"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Clock,
  Zap,
  ChevronRight,
  Atom,
  Flame,
  Dna,
  Binary,
  Calculator,
  Trophy,
  Filter,
} from "lucide-react";
import {
  CURRICULUM_TRACKS,
  CurriculumTrack,
  Discipline,
  getTrackProgress,
  TrackProgress,
} from "@/app/lib/tracks";

const SUBJECT_METAS: Record<
  Discipline,
  { label: string; icon: any; color: string; bg: string; border: string; activePill: string }
> = {
  physics: {
    label: "Physics",
    icon: Atom,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    activePill: "bg-blue-500 text-white",
  },
  chemistry: {
    label: "Chemistry",
    icon: Flame,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    activePill: "bg-emerald-500 text-white",
  },
  biology: {
    label: "Biology",
    icon: Dna,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    activePill: "bg-rose-500 text-white",
  },
  computerScience: {
    label: "Computer Science",
    icon: Binary,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    activePill: "bg-purple-500 text-white",
  },
  mathematics: {
    label: "Mathematics",
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    activePill: "bg-amber-500 text-white",
  },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

interface CurriculumTracksExplorerProps {
  subjectFilter?: Discipline;
  completedLabIds?: string[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  compact?: boolean;
}

export default function CurriculumTracksExplorer({
  subjectFilter,
  completedLabIds = [],
  title = "Guided Curriculum Tracks",
  subtitle = "Step-by-step learning pathways with structured progression, skill milestones, and track completion certificates.",
  showFilters = true,
  limit,
  compact = false,
}: CurriculumTracksExplorerProps) {
  const [selectedSubject, setSelectedSubject] = useState<Discipline | "all">(
    subjectFilter || "all"
  );

  const displayedTracks = CURRICULUM_TRACKS.filter((track) => {
    if (subjectFilter) return track.subject === subjectFilter;
    if (selectedSubject === "all") return true;
    return track.subject === selectedSubject;
  }).slice(0, limit || undefined);

  return (
    <section className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <Compass size={14} />
            <span>Structured Learning Journeys</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Filter Pills */}
        {showFilters && !subjectFilter && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedSubject("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSubject === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Disciplines
            </button>
            {(Object.keys(SUBJECT_METAS) as Discipline[]).map((subj) => {
              const meta = SUBJECT_METAS[subj];
              const Icon = meta.icon;
              const isSelected = selectedSubject === subj;

              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? meta.activePill + " shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={12} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tracks Grid */}
      <div className={`grid grid-cols-1 ${compact ? "gap-4" : "lg:grid-cols-2 gap-5"}`}>
        {displayedTracks.map((track) => {
          const progress = getTrackProgress(track, completedLabIds);
          const meta = SUBJECT_METAS[track.subject] || SUBJECT_METAS.physics;
          const SubjectIcon = meta.icon;

          const targetRoute =
            progress.isComplete
              ? track.steps[0].simRoute
              : progress.nextStep
              ? progress.nextStep.simRoute
              : track.steps[0].simRoute;

          return (
            <div
              key={track.id}
              className="group rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Top Row: Subject & Meta pills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}
                    >
                      <SubjectIcon size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                        {meta.label} Track
                      </span>
                      <span
                        className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          DIFFICULTY_STYLES[track.difficulty]
                        }`}
                      >
                        {track.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-primary">
                      {progress.percentage}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold block">
                      {progress.completedSteps}/{progress.totalSteps} Completed
                    </span>
                  </div>
                </div>

                {/* Track Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {track.headline}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                {/* Step Timeline Nodes */}
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                    Learning Sequence ({track.steps.length} Experiments)
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {track.steps.map((step, idx) => {
                      const isStepComplete = completedLabIds.some(
                        (id) =>
                          id === step.labId ||
                          id.endsWith(step.labId.split("/")[1])
                      );
                      const isNextUp = !isStepComplete && progress.nextStep?.labId === step.labId;

                      return (
                        <Link
                          key={step.labId}
                          href={step.simRoute}
                          title={`${idx + 1}. ${step.title} (${step.estimatedMinutes} mins)`}
                          className={`
                            group/node shrink-0 flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold transition-all
                            ${
                              isStepComplete
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : isNextUp
                                ? "bg-primary text-primary-foreground border-2 border-primary shadow-xs animate-pulse"
                                : "bg-muted text-muted-foreground border border-border/80 hover:border-primary/40 hover:text-foreground"
                            }
                          `}
                        >
                          {isStepComplete ? (
                            <CheckCircle2 size={13} className="fill-current" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Action CTA */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    <span>{track.estimatedHours}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Zap size={12} className="fill-current" />
                    <span>+{track.totalXP} XP</span>
                  </span>
                </div>

                <Link
                  href={targetRoute}
                  className={`
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs shrink-0
                    ${
                      progress.isComplete
                        ? "bg-muted hover:bg-accent text-foreground border border-border"
                        : progress.status === "in_progress"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                    }
                  `}
                >
                  <span>
                    {progress.isComplete
                      ? "Review Track ✓"
                      : progress.status === "in_progress"
                      ? `Resume Step ${progress.currentStepIndex + 1}`
                      : "Start Track"}
                  </span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
