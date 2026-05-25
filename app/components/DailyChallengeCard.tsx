import React, { useState } from "react";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  Flame, 
  Award,
  TrendingUp
} from "lucide-react";

export default function DailyChallengeCard({ labId, currentParams }) {
  const { challenge, validateChallenge, result, alreadyCompleted } = useDailyChallenge(labId);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!challenge) return null;

  // Map difficulty to color badges
  const difficultyColors = {
    easy: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
    medium: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30",
    hard: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30",
  };

  const difficultyName = challenge.difficulty.toLowerCase() as keyof typeof difficultyColors;
  const badgeClass = difficultyColors[difficultyName] || difficultyColors.medium;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const val = currentParams[challenge.targetParam];
    if (val !== undefined) {
      // Small artificial delay for a premium feel
      setTimeout(() => {
        validateChallenge(Math.abs(val), challenge.targetParam);
        setIsSubmitting(false);
      }, 600);
    } else {
      alert(`Error: Parameter "${challenge.targetParam}" not found in current experiment state.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6 mb-2">
      <AnimatePresence mode="wait">
        {/* State 1: Active Challenge */}
        {!alreadyCompleted && !result?.correct && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-5 md:p-6"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2.5 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5 animate-pulse">
                    <Trophy className="w-3.5 h-3.5" />
                    Daily Challenge
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border bg-gradient-to-r ${badgeClass}`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                  {challenge.challenge}
                </h3>

                {challenge.hint && (
                  <div className="pt-1">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
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
                          className="mt-2 text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 leading-relaxed"
                        >
                          <span className="font-semibold text-indigo-400">Hint:</span> {challenge.hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-stretch md:items-end justify-center min-w-[160px]">
                <button
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                    className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-950/20 border border-rose-500/20 px-2.5 py-1 rounded-lg"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect. Attempts: {result.attempts}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* State 2: Success / Just Completed */}
        {result && result.correct && !alreadyCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 backdrop-blur-xl border border-emerald-500/40 p-6 shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] text-white"
          >
            {/* Particles glow background */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="flex-grow text-center md:text-left space-y-1">
                <h3 className="text-xl font-extrabold text-emerald-300 tracking-tight flex items-center justify-center md:justify-start gap-2">
                  Challenge Accomplished!
                </h3>
                <p className="text-emerald-100 text-sm font-medium">
                  Outstanding work. You solved the experiment's puzzle.
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 pt-1">
                  <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    +{result.xpEarned} XP
                  </div>
                  
                  {result.leveledUp && (
                    <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      Level Up! Level {result.newLevel}
                    </div>
                  )}

                  {result.badgesEarned && result.badgesEarned.length > 0 && (
                    <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold text-purple-300">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      Badges: {result.badgesEarned.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: Already Completed on Load */}
        {alreadyCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg flex items-center gap-4 max-w-3xl mx-auto"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <CheckCircle2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm md:text-base">Daily Challenge Cleared!</h4>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                You have already claimed your rewards for today's challenge in this lab. Keep exploring!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

