"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Zap,
  RotateCcw,
  Compass,
  X,
  Atom,
  Flame,
  Dna,
  Binary,
  Calculator,
} from "lucide-react";
import { CurriculumTrack, TrackLabStep } from "@/app/lib/tracks";

const SUBJECT_THEMES: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  physics: {
    label: "Physics",
    icon: Atom,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  chemistry: {
    label: "Chemistry",
    icon: Flame,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  biology: {
    label: "Biology",
    icon: Dna,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  computerScience: {
    label: "Computer Science",
    icon: Binary,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  mathematics: {
    label: "Mathematics",
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

interface NextLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned?: number;
  completedLabTitle: string;
  track?: CurriculumTrack | null;
  nextStep?: TrackLabStep | null;
  trackPercentage?: number;
  isFinalStep?: boolean;
}

export default function NextLabModal({
  isOpen,
  onClose,
  xpEarned = 50,
  completedLabTitle,
  track,
  nextStep,
  trackPercentage = 50,
  isFinalStep = false,
}: NextLabModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const subjectTheme = track ? SUBJECT_THEMES[track.subject] || SUBJECT_THEMES.physics : SUBJECT_THEMES.physics;
  const SubjectIcon = subjectTheme.icon;

  const handleContinue = () => {
    onClose();
    if (nextStep) {
      router.push(nextStep.simRoute);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle gradient glow in background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header celebration */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/30 mb-1">
              <Trophy size={28} className="animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap size={13} className="fill-current" />
              <span>+{xpEarned} XP Earned</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Experiment Completed! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Great mastery of <span className="font-bold text-foreground">{completedLabTitle}</span>.
            </p>
          </div>

          {/* Active Track Progress Card */}
          {track && (
            <div className="mb-6 rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${subjectTheme.bg} ${subjectTheme.color} flex items-center justify-center shrink-0`}>
                    <SubjectIcon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Curriculum Track
                    </p>
                    <p className="text-xs font-bold text-foreground">
                      {track.title}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">
                  {trackPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-border/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trackPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Next Step Box */}
          {nextStep && !isFinalStep ? (
            <div className="mb-6 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  <Sparkles size={12} />
                  <span>Up Next in Track</span>
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  ~{nextStep.estimatedMinutes} mins
                </span>
              </div>

              <h3 className="text-base font-black text-foreground">
                {nextStep.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {nextStep.description}
              </p>
            </div>
          ) : isFinalStep ? (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                <CheckCircle2 size={16} />
                <span>Track Mastered! 🏆</span>
              </div>
              <p className="text-xs text-muted-foreground">
                You have completed all experiments in the <span className="font-bold text-foreground">{track?.title}</span>!
              </p>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {nextStep && !isFinalStep ? (
              <button
                onClick={handleContinue}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all"
              >
                <span>Continue to Next Lab</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <Link
                href="/profile"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all"
              >
                <span>View Profile & Achievements</span>
                <ArrowRight size={15} />
              </Link>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-all"
            >
              Stay in Simulation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
