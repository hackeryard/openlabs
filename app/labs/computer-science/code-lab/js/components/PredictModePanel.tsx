'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface PredictModePanelProps {
  expectedOutput: string[];
  onCorrect: () => void;
  /** Called on every submission attempt, correct or not — used by the
   * parent to reveal the real console output once the user has answered. */
  onSubmit?: () => void;
  explanation: string;
}

// Splits a free-form prediction into individual output values. Accepts
// commas, newlines, "→", ">" and "->"/"-->" style arrows as separators, and
// compares case-insensitively so e.g. "a, f, c" matches "A, F, C".
function parsePrediction(raw: string): string[] {
  return raw
    .replace(/-+>/g, ',')
    .split(/[,\n→>]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function PredictModePanel({ expectedOutput, onCorrect, onSubmit, explanation }: PredictModePanelProps) {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const userLines = parsePrediction(prediction);

    const correct =
      userLines.length === expectedOutput.length &&
      userLines.every((line, i) => normalize(line) === normalize(expectedOutput[i]));

    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit?.();

    if (correct) {
      onCorrect();
    }
  };

  const handleReset = () => {
    setPrediction('');
    setSubmitted(false);
    setIsCorrect(false);
  };

  // Find first point of divergence
  const userLines = parsePrediction(prediction);

  const firstDivergence = submitted
    ? userLines.findIndex((line, i) => i >= expectedOutput.length || normalize(line) !== normalize(expectedOutput[i]))
    : -1;

  return (
    <div className="rounded-2xl border border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-100 dark:from-indigo-500/10 to-purple-100 dark:to-purple-500/10 border-b border-indigo-200 dark:border-indigo-500/20">
        <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-300">🧠 Predict the Output</h3>
      </div>

      <div className="p-4 space-y-4">
        {!submitted ? (
          <>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Look at the code above and predict the console output order.
              Type each output value separated by commas or new lines.
            </p>

            <div className="relative">
              <textarea
                value={prediction}
                onChange={e => setPrediction(e.target.value)}
                placeholder="e.g., A, F, C, D, B, E"
                aria-label="Predicted console output"
                rows={3}
                className="w-full bg-card border border-border rounded-xl px-4 py-3
                           text-sm font-mono text-foreground resize-none
                           placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40
                           transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={prediction.trim().length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         text-white text-sm font-bold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all active:scale-[0.98]
                         shadow-lg shadow-indigo-500/20"
            >
              Check My Prediction
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Result banner */}
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border
                ${isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30'
                }
              `}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Correct! 🎉</p>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">You understand the event loop order.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Not quite!</p>
                      <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-0.5">Compare your answer with the correct output below.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Comparison table */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center text-muted-foreground font-semibold uppercase tracking-wider pb-1">Your Answer</div>
                <div className="text-center text-muted-foreground font-semibold uppercase tracking-wider pb-1">Correct Output</div>

                {Array.from({ length: Math.max(userLines.length, expectedOutput.length) }).map((_, i) => {
                  const userVal = userLines[i];
                  const expected = expectedOutput[i];
                  const match = userVal !== undefined && expected !== undefined && normalize(userVal) === normalize(expected);
                  const isDivergence = i === firstDivergence;

                  return (
                    <div key={i} className="contents">
                      <div className={`
                        px-3 py-1.5 rounded-lg font-mono text-center border
                        ${match ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : isDivergence ? 'bg-rose-100 dark:bg-rose-500/15 border-rose-400 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400/30'
                            : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-700/70 dark:text-rose-300/70'}
                      `}>
                        {userVal ?? '—'}
                      </div>
                      <div className={`
                        px-3 py-1.5 rounded-lg font-mono text-center border
                        ${match ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-muted border-border text-foreground'}
                      `}>
                        {expected ?? '—'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {!isCorrect && firstDivergence >= 0 && (
                <div className="flex gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800/90 dark:text-amber-200/90 leading-relaxed">{explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 rounded-xl border border-border bg-muted
                             text-muted-foreground text-xs font-medium
                             hover:bg-accent hover:text-foreground transition-all"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
