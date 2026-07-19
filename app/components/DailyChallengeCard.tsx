"use client";

import React, { useState } from "react";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Flame,
  Award,
  TrendingUp,
  X
} from "lucide-react";

interface DailyChallengeCardProps {
  labId: string;
  /** Loose on purpose: labs pass numbers, booleans, and strings —
   *  validation coerces via Math.abs(Number(...)), as it always has. */
  currentParams: Record<string, number | string | boolean | undefined>;
}

// ─── Floating Daily-Challenge widget ───────────────────────────
// Renders as a FIXED floating pill (docked above the OpenLabsAI chat
// button, bottom-right) that expands into a popover panel — it takes
// ZERO page space in the lab itself, so it never pushes content or
// covers the initial view the way the old full-width in-flow card did.
// The pulsing trophy pill keeps it eye-catching while collapsed.
// Same public API as before: every lab that renders
// <DailyChallengeCard labId currentParams/> gets this automatically.
export default function DailyChallengeCard({ labId, currentParams }: DailyChallengeCardProps) {
  const { challenge, validateChallenge, result, alreadyCompleted } = useDailyChallenge(labId);
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (!challenge) return null;

  const difficultyColors = {
    easy: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    medium: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30",
    hard: "from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30",
  };
  const difficultyName = challenge.difficulty.toLowerCase() as keyof typeof difficultyColors;
  const badgeClass = difficultyColors[difficultyName] || difficultyColors.medium;

  const isDone = alreadyCompleted || !!result?.correct;
  const justSolved = !!result?.correct && !alreadyCompleted;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const val = currentParams[challenge.targetParam];
    if (val !== undefined) {
      // Small artificial delay for a premium feel
      setTimeout(() => {
        validateChallenge(Math.abs(Number(val)), challenge.targetParam);
        setIsSubmitting(false);
      }, 600);
    } else {
      alert(`Error: Parameter "${challenge.targetParam}" not found in current experiment state.`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Collapsed pill (stacked above the AI chat FAB) ────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="pill"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40
                        flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-2 shadow-lg
                        border backdrop-blur-xl transition-all hover:shadow-xl active:scale-95
                        ${isDone
                          ? "bg-card/90 border-border text-muted-foreground"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400/50 text-white shadow-amber-500/30"
                        }`}
            aria-label={isDone ? "Daily challenge completed" : "Open today's daily challenge"}
          >
            <span className="relative flex">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  {!shouldReduceMotion && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  )}
                </>
              )}
            </span>
            <span className="text-xs font-bold whitespace-nowrap">
              {isDone ? "Challenge cleared" : "Daily Challenge"}
            </span>
            {!isDone && (
              <span className="text-[10px] font-black bg-white/20 rounded-full px-1.5 py-0.5">
                +{challenge.xpReward ?? "XP"}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Expanded popover panel ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40
                       w-[min(24rem,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto
                       rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl"
            role="dialog"
            aria-label="Daily challenge"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center gap-2 px-4 py-3 bg-card/95 backdrop-blur-xl border-b border-border">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Trophy className="w-3 h-3" />
                Daily Challenge
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border bg-gradient-to-r ${badgeClass}`}>
                {challenge.difficulty}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Minimize challenge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {/* State 1: Active Challenge */}
              {!isDone && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-card-foreground leading-snug">
                    {challenge.challenge}
                  </h3>

                  {challenge.hint && (
                    <div>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {showHint ? "Hide Hint" : "Need a Hint?"}
                      </button>
                      <AnimatePresence>
                        {showHint && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-xl p-3 leading-relaxed overflow-hidden"
                          >
                            <span className="font-semibold text-primary">Hint:</span> {challenge.hint}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Attempt</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  {result && !result.correct && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Incorrect. Attempts: {result.attempts}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* State 2: Success / Just Completed */}
              {justSolved && (
                <div className="space-y-3 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-300 tracking-tight">
                      Challenge Accomplished!
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Outstanding work. You solved the experiment&apos;s puzzle.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      +{result!.xpEarned} XP
                    </span>
                    {result!.leveledUp && (
                      <span className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-600 dark:text-amber-300">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Level Up! Level {result!.newLevel}
                      </span>
                    )}
                    {result!.badgesEarned && result!.badgesEarned.length > 0 && (
                      <span className="flex items-center gap-1 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-600 dark:text-purple-300">
                        <Award className="w-3.5 h-3.5" />
                        {result!.badgesEarned.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* State 3: Already Completed on Load */}
              {alreadyCompleted && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-card-foreground text-sm">Daily Challenge Cleared!</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      You already claimed today&apos;s rewards in this lab. Keep exploring!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
