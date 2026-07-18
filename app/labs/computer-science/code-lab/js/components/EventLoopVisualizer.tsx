'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Info, X, BookOpen, Lock } from 'lucide-react';

import { EXAMPLES } from '../lib/examples';
import type { SimulationSnapshot } from '../lib/types';

import CallStack from './CallStack';
import WebAPIsPanel from './WebAPIsPanel';
import MicrotaskQueue from './MicrotaskQueue';
import MacrotaskQueue from './MacrotaskQueue';
import EventLoopIndicator from './EventLoopIndicator';
import ConsoleOutput from './ConsoleOutput';
import PlaybackControls from './PlaybackControls';
import CodeEditorPane from './CodeEditorPane';
import PredictModePanel from './PredictModePanel';

interface EventLoopVisualizerProps {
  onExperimentComplete: () => void;
  onExamplesCompletedChange?: (count: number) => void;
  onPredictCorrectChange?: (count: number) => void;
}

export default function EventLoopVisualizer({ 
  onExperimentComplete,
  onExamplesCompletedChange,
  onPredictCorrectChange
}: EventLoopVisualizerProps) {
  const shouldReduceMotion = useReducedMotion();

  // ── State ────────────────────────────────────────────────
  const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasCompletedExperiment, setHasCompletedExperiment] = useState(false);
  
  // ── Tracking State ───────────────────────────────────────
  const [completedExampleIds, setCompletedExampleIds] = useState<Set<string>>(new Set());
  const [predictCorrectIds, setPredictCorrectIds] = useState<Set<string>>(new Set());
  // Examples whose real output has been revealed (by submitting a
  // prediction, right or wrong) — gates peeking at the answer beforehand.
  const [revealedPredictIds, setRevealedPredictIds] = useState<Set<string>>(new Set());

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived state ────────────────────────────────────────
  const selectedExample = EXAMPLES.find(e => e.id === selectedExampleId) ?? EXAMPLES[0];
  const snapshots = selectedExample.snapshots;
  const totalSteps = snapshots.length;
  const currentSnapshot: SimulationSnapshot = snapshots[currentStep] ?? snapshots[0];
  const isLocked = selectedExample.isPredictMode && !revealedPredictIds.has(selectedExampleId);

  // ── Auto-play logic ──────────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1000 / speed;
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);

      return () => {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      };
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }
  }, [isPlaying, speed, totalSteps]);

  // Track completed examples — reaching the end of ANY example (not just
  // correctly predicting the quiz) counts as having used the lab, so it
  // also earns lab-completion XP the first time it happens.
  useEffect(() => {
    if (currentStep === totalSteps - 1 && !completedExampleIds.has(selectedExampleId)) {
      const nextSet = new Set(completedExampleIds).add(selectedExampleId);
      setCompletedExampleIds(nextSet);
      onExamplesCompletedChange?.(nextSet.size);
      if (!hasCompletedExperiment) {
        setHasCompletedExperiment(true);
        onExperimentComplete();
      }
    }
  }, [currentStep, totalSteps, selectedExampleId, completedExampleIds, onExamplesCompletedChange, hasCompletedExperiment, onExperimentComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't hijack keys while focus is on any interactive form control —
      // e.g. arrow keys should cycle the example <select>, and Space should
      // activate whichever PlaybackControls button is focused, not always
      // toggle play/pause.
      const target = e.target;
      const isFormControl =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLButtonElement;
      if (isFormControl) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
          if (isLocked) return;
          e.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
        case 'p':
          if (isLocked) return;
          e.preventDefault();
          handleStepBackward();
          break;
        case ' ': {
          if (isLocked) return;
          const atEnd = currentStep >= totalSteps - 1;
          if (isPlaying) {
            e.preventDefault();
            handlePause();
          } else if (!atEnd) {
            // Mirror PlaybackControls' own Play/Pause button, which is
            // disabled at the end — don't let Space silently restart.
            e.preventDefault();
            handlePlay();
          }
          break;
        }
        case 'r':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // Deliberately not listing the handle* callbacks below: they're declared
    // later in this component via useCallback, and their own dependencies
    // (currentStep/totalSteps) are already covered here, so this effect
    // re-subscribes with a fresh closure whenever it matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStep, totalSteps, isLocked]);

  // ── Handlers ─────────────────────────────────────────────
  const handleExampleChange = useCallback((id: string) => {
    setSelectedExampleId(id);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handleStepBackward = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handlePlay = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleSeek = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handlePredictCorrect = useCallback(() => {
    setPredictCorrectIds(prev => {
      // Dedupe by example id — resubmitting the same correct answer (via
      // "Try Again") must not keep inflating the count that feeds the
      // daily-challenge XP param.
      if (prev.has(selectedExampleId)) return prev;
      const next = new Set(prev).add(selectedExampleId);
      onPredictCorrectChange?.(next.size);
      return next;
    });
    if (!hasCompletedExperiment) {
      setHasCompletedExperiment(true);
      onExperimentComplete();
    }
  }, [hasCompletedExperiment, onExperimentComplete, onPredictCorrectChange, selectedExampleId]);

  // Reveals the real console output for a predict-mode example — called on
  // every submission (correct or incorrect), not just correct ones.
  const handlePredictSubmit = useCallback(() => {
    setRevealedPredictIds(prev => {
      if (prev.has(selectedExampleId)) return prev;
      return new Set(prev).add(selectedExampleId);
    });
  }, [selectedExampleId]);

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#0a0a14] text-white">
      {/* ── Disclaimer Banner ─────────────────────────────── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 px-4 py-3 bg-indigo-500/8 border-b border-indigo-500/20">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                  <span className="font-semibold text-indigo-300">About this simulation:</span>{' '}
                  This is a conceptual model of the JS event loop, not a literal engine trace.
                  It uses preset examples — free-form code execution isn&apos;t supported yet.
                  The goal is to build intuition about execution order, not to replicate V8 internals.
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-400/60 hover:text-indigo-300 transition-colors"
                aria-label="Dismiss disclaimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed disclaimer toggle (when dismissed) ──── */}
      {!showDisclaimer && (
        <div className="flex justify-end px-3 py-1 border-b border-slate-800/50">
          <button
            onClick={() => setShowDisclaimer(true)}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors"
            aria-label="Show simulation disclaimer"
          >
            <BookOpen className="w-3 h-3" />
            About this simulation
          </button>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-2 p-2 sm:p-3 min-h-0">
          {/* ─ Left column: Code editor ────────────────────── */}
          <div className="lg:w-[35%] shrink-0 rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden flex flex-col min-h-[250px] lg:min-h-0">
            <CodeEditorPane
              sourceCode={selectedExample.sourceCode}
              activeCodeLine={currentSnapshot.activeCodeLine}
              examples={EXAMPLES}
              selectedExampleId={selectedExampleId}
              onExampleChange={handleExampleChange}
            />
          </div>

          {/* ─ Right column: Visualization panels ──────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            {/* Top row: Call Stack + Web APIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[140px] shrink-0">
              <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.05)] flex flex-col">
                <CallStack frames={currentSnapshot.callStack} />
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.05)]">
                <WebAPIsPanel items={currentSnapshot.webAPIs} />
              </div>
            </div>

            {/* Event Loop Indicator */}
            <EventLoopIndicator
              phase={currentSnapshot.eventLoopPhase}
              description={currentSnapshot.description}
            />

            {/* Queue row: Microtask + Macrotask */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[100px] shrink-0">
              <div className="rounded-xl border border-emerald-500/20 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)] flex flex-col">
                <MicrotaskQueue
                  entries={currentSnapshot.microtaskQueue}
                  isActive={currentSnapshot.eventLoopPhase === 'draining-microtasks'}
                />
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)] flex flex-col">
                <MacrotaskQueue
                  entries={currentSnapshot.macrotaskQueue}
                  isActive={currentSnapshot.eventLoopPhase === 'picking-macrotask'}
                  isDimmed={currentSnapshot.microtaskQueue.length > 0 && currentSnapshot.eventLoopPhase === 'draining-microtasks'}
                />
              </div>
            </div>

            {/* Console Output */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden flex-1 min-h-[80px] shrink-0 flex flex-col min-h-0">
              {isLocked ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <p className="text-xs text-slate-500">Submit your prediction below to reveal the console output.</p>
                </div>
              ) : (
                <ConsoleOutput entries={currentSnapshot.consoleOutput} />
              )}
            </div>

            {/* Predict Mode Panel (only for predict examples) */}
            {selectedExample.isPredictMode && (
              <PredictModePanel
                key={selectedExampleId}
                expectedOutput={selectedExample.expectedOutput}
                onCorrect={handlePredictCorrect}
                onSubmit={handlePredictSubmit}
                explanation={selectedExample.explanation}
              />
            )}

            {/* Post-run explanation (non-predict examples, shown at end) */}
            {!selectedExample.isPredictMode && currentStep === totalSteps - 1 && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20"
              >
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-200/80 leading-relaxed">{selectedExample.explanation}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: Playback Controls ─────────────────────── */}
      <div className="shrink-0 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-3 sm:px-4 py-3">
        <PlaybackControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speed={speed}
          disabled={isLocked}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          onSeek={handleSeek}
        />
      </div>

      {/* ── Color legend ──────────────────────────────────── */}
      <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 border-t border-slate-800/50 bg-slate-950/50">
        <LegendItem color="bg-blue-400" label="Call Stack" />
        <LegendItem color="bg-violet-400" label="Web APIs" />
        <LegendItem color="bg-emerald-400" label="Microtask Queue" />
        <LegendItem color="bg-amber-400" label="Macrotask Queue" />
        <LegendItem color="bg-indigo-400" label="Event Loop" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
  );
}
