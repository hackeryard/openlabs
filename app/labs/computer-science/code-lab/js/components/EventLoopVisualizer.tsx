'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { Info, X, BookOpen } from 'lucide-react';

import { EXAMPLES } from '../lib/examples';
import type { SimulationSnapshot, RuntimeMode } from '../lib/types';
import { generateSnapshots } from '../lib/simulator';
import { executeUserCode } from '../lib/runtime/execute';

import HeaderBar from './HeaderBar';
import InfoModal from './InfoModal';
import EditorPane from './EditorPane';
import LoopHub from './LoopHub';
import ConsolePanel from './ConsolePanel';
import PlaybackBar from './PlaybackBar';
import PredictModePanel from './PredictModePanel';
import StackPanel from './panels/StackPanel';
import WebApisPanel from './panels/WebApisPanel';
import { MicroQueuePanel, MacroQueuePanel, RafPanel, NextTickPanel, ImmediatePanel } from './panels/QueuePanel';

const FREEFORM_STARTER = [
  "console.log('1: start');",
  '',
  "setTimeout(() => console.log('4: timeout'), 0);",
  '',
  "Promise.resolve().then(() => console.log('3: promise'));",
  '',
  "console.log('2: end');",
].join('\n');

const EMPTY_SNAPSHOT: SimulationSnapshot = {
  step: 0,
  callStack: [],
  webAPIs: [],
  microtaskQueue: [],
  macrotaskQueue: [],
  rafQueue: [],
  nextTickQueue: [],
  immediateQueue: [],
  consoleOutput: [],
  eventLoopPhase: 'idle',
  description: 'Click "Run" to execute your code and see it step through the event loop.',
  activeCodeLine: 1,
  mode: 'browser',
};

const DISCLAIMER_KEY = 'js-lab-disclaimer-dismissed';

interface EventLoopVisualizerProps {
  onExperimentComplete: () => void;
  onExamplesCompletedChange?: (count: number) => void;
  onPredictCorrectChange?: (count: number) => void;
  onFreeformRunsChange?: (count: number) => void;
}

// ─── Live Dashboard shell ──────────────────────────────────────
// Every runtime panel (code, stack, web APIs, queues, phase hub,
// console) is always mounted and visible — panels compress
// responsively instead of hiding behind tabs or below the fold.
// Static help lives in InfoModal; playback is pinned at the bottom.
export default function EventLoopVisualizer({
  onExperimentComplete,
  onExamplesCompletedChange,
  onPredictCorrectChange,
  onFreeformRunsChange
}: EventLoopVisualizerProps) {
  const shouldReduceMotion = useReducedMotion();

  // ── State ────────────────────────────────────────────────
  const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hasCompletedExperiment, setHasCompletedExperiment] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // First-visit disclaimer strip: shown until dismissed once, then it
  // lives inside the help modal only.
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(DISCLAIMER_KEY)) setShowDisclaimer(true);
    } catch { /* private mode etc. — just skip the banner */ }
  }, []);
  const dismissDisclaimer = useCallback(() => {
    setShowDisclaimer(false);
    try { window.localStorage.setItem(DISCLAIMER_KEY, '1'); } catch { /* ignore */ }
  }, []);

  // ── Free-form mode (beta) ──────────────────────────────────
  const [mode, setMode] = useState<'preset' | 'freeform'>('preset');
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>('browser');
  const [freeformSource, setFreeformSource] = useState(FREEFORM_STARTER);
  const [freeformSnapshots, setFreeformSnapshots] = useState<SimulationSnapshot[] | null>(null);
  const [freeformError, setFreeformError] = useState<string | undefined>(undefined);
  const [freeformNote, setFreeformNote] = useState<string | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [, setFreeformRunsCompleted] = useState(0);
  const isEditorFocusedRef = useRef(false);

  // ── Tracking State ───────────────────────────────────────
  const [completedExampleIds, setCompletedExampleIds] = useState<Set<string>>(new Set());
  const [, setPredictCorrectIds] = useState<Set<string>>(new Set());
  // Examples whose real output has been revealed (by submitting a
  // prediction, right or wrong) — gates peeking at the answer beforehand.
  const [revealedPredictIds, setRevealedPredictIds] = useState<Set<string>>(new Set());

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived state ────────────────────────────────────────
  const selectedExample = EXAMPLES.find(e => e.id === selectedExampleId) ?? EXAMPLES[0];
  const snapshots = mode === 'freeform' ? (freeformSnapshots ?? [EMPTY_SNAPSHOT]) : selectedExample.snapshots;
  const totalSteps = snapshots.length;
  const currentSnapshot: SimulationSnapshot = snapshots[currentStep] ?? snapshots[0];
  const isLocked = mode === 'preset' && !!selectedExample.isPredictMode && !revealedPredictIds.has(selectedExampleId);
  const atEnd = currentStep === totalSteps - 1;

  // Which panel is the loop's current focus (drives glow/dim).
  const phase = currentSnapshot.eventLoopPhase;
  const focus: 'stack' | 'micro' | 'macro' | 'raf' | 'nexttick' | null =
    phase === 'executing' || phase === 'checking-stack' ? 'stack'
      : phase === 'draining-microtasks' ? 'micro'
        : phase === 'picking-macrotask' ? 'macro'
          : phase === 'running-raf' || phase === 'rendering' ? 'raf'
            : phase === 'draining-nexttick' ? 'nexttick'
              : null;

  // Steps that print console output → timeline markers.
  const logSteps = useMemo(() => {
    const steps: number[] = [];
    for (let i = 0; i < snapshots.length; i++) {
      const prev = i > 0 ? snapshots[i - 1].consoleOutput.length : 0;
      if (snapshots[i].consoleOutput.length > prev) steps.push(i);
    }
    return steps;
  }, [snapshots]);

  // Conditional panels: rAF strip only if this run ever uses it; Node
  // queues only in Node-mode runs.
  const usesRaf = useMemo(() => snapshots.some(s => s.rafQueue.length > 0), [snapshots]);
  const isNodeMode = currentSnapshot.mode === 'node';
  const queuePanelCount = 2 + (usesRaf ? 1 : 0) + (isNodeMode ? 2 : 0);
  const queueGridCols = queuePanelCount <= 2 ? 'grid-cols-2' : queuePanelCount === 3 ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 xl:grid-cols-4';

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
    if (mode !== 'preset') return;
    if (currentStep === totalSteps - 1 && !completedExampleIds.has(selectedExampleId)) {
      const nextSet = new Set(completedExampleIds).add(selectedExampleId);
      setCompletedExampleIds(nextSet);
      onExamplesCompletedChange?.(nextSet.size);
      if (!hasCompletedExperiment) {
        setHasCompletedExperiment(true);
        onExperimentComplete();
      }
    }
  }, [mode, currentStep, totalSteps, selectedExampleId, completedExampleIds, onExamplesCompletedChange, hasCompletedExperiment, onExperimentComplete]);

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
      // activate whichever PlaybackBar button is focused, not always
      // toggle play/pause.
      const target = e.target;
      const isFormControl =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLButtonElement;
      if (isFormControl) return;
      // Monaco (free-form editor) owns its own keystrokes and isn't
      // one of the instanceof checks above — skip while it has focus.
      if (isEditorFocusedRef.current) return;

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
          const atLast = currentStep >= totalSteps - 1;
          if (isPlaying) {
            e.preventDefault();
            handlePause();
          } else if (!atLast) {
            // Mirror PlaybackBar's own Play/Pause button, which is
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

  const handleModeChange = useCallback((next: 'preset' | 'freeform') => {
    setMode(next);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setIsPlaying(false);
    // Synchronous today (no real network/timers), but kept as a
    // discrete state transition so a future async engine (e.g. a
    // Worker) is a drop-in swap here.
    const result = executeUserCode(freeformSource, { mode: runtimeMode });
    setFreeformSnapshots(generateSnapshots(result.instructions, runtimeMode));
    setFreeformError(result.error);
    setFreeformNote(result.note);
    setCurrentStep(0);
    setIsRunning(false);

    if (!result.error && !hasCompletedExperiment) {
      setHasCompletedExperiment(true);
      onExperimentComplete();
    }
    // A budget/loop-guard `note` still counts as "ran" (it produced a
    // full observable trace) — only a hard `error` doesn't count.
    if (!result.error) {
      setFreeformRunsCompleted(prev => {
        const next = prev + 1;
        onFreeformRunsChange?.(next);
        return next;
      });
    }
  }, [freeformSource, runtimeMode, hasCompletedExperiment, onExperimentComplete, onFreeformRunsChange]);

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

  // ── Console footer: predict quiz, or the explanation at the end ──
  const consoleFooter = mode === 'preset' && selectedExample.isPredictMode ? (
    <PredictModePanel
      key={selectedExampleId}
      expectedOutput={selectedExample.expectedOutput}
      onCorrect={handlePredictCorrect}
      onSubmit={handlePredictSubmit}
      explanation={selectedExample.explanation}
    />
  ) : mode === 'preset' && atEnd && totalSteps > 1 ? (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 px-3 py-2 bg-primary/5"
    >
      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
      <p className="text-[10px] sm:text-xs text-foreground/85 leading-relaxed">{selectedExample.explanation}</p>
    </motion.div>
  ) : undefined;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background text-foreground">
      <HeaderBar
        examples={EXAMPLES}
        selectedExampleId={selectedExampleId}
        onExampleChange={handleExampleChange}
        mode={mode}
        onModeChange={handleModeChange}
        runtimeMode={runtimeMode}
        onRuntimeModeChange={setRuntimeMode}
        onRun={handleRun}
        isRunning={isRunning}
        onOpenInfo={() => setInfoOpen(true)}
      />

      {/* First-visit disclaimer strip (one line; permanent copy lives in the help modal) */}
      {showDisclaimer && (
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-primary/5 border-b border-primary/15">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <p className="flex-1 min-w-0 truncate text-[10px] sm:text-[11px] text-foreground/80">
            A conceptual model of the JS event loop, not a literal engine trace — see the <b>?</b> button for details.
          </p>
          <button onClick={dismissDisclaimer} className="shrink-0 p-0.5 rounded text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Dismiss">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Dashboard: everything visible, nothing scrolls but leaf panels ── */}
      <LayoutGroup>
        <div className="flex-1 min-h-0 min-w-0 flex flex-col lg:flex-row gap-1.5 p-1.5">
          {/* Code pane */}
          <div className="flex-[3] lg:flex-none lg:w-[34%] xl:w-[30%] min-h-0 min-w-0 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
            {mode === 'freeform' ? (
              <EditorPane
                readOnly={false}
                sourceCode={freeformSource}
                onChange={setFreeformSource}
                onRun={handleRun}
                running={isRunning}
                onFocusChange={focused => { isEditorFocusedRef.current = focused; }}
              />
            ) : (
              <EditorPane
                readOnly
                sourceCode={selectedExample.sourceCode}
                activeCodeLine={currentSnapshot.activeCodeLine}
                title={selectedExample.title}
              />
            )}
          </div>

          {/* Runtime column */}
          <div className="flex-[7] lg:flex-1 min-h-0 min-w-0 flex flex-col gap-1.5">
            {/* Execution row (stack frames need vertical room) */}
            <div className="flex-[3] min-h-0 grid grid-cols-2 gap-1.5">
              <StackPanel
                frames={currentSnapshot.callStack}
                isActive={focus === 'stack'}
                isDimmed={focus !== null && focus !== 'stack'}
              />
              <WebApisPanel
                items={currentSnapshot.webAPIs}
                isDimmed={focus === 'micro' || focus === 'macro'}
              />
            </div>

            {/* The event loop hub */}
            <LoopHub phase={phase} description={currentSnapshot.description} step={currentStep} />

            {/* Queues row (chips wrap horizontally — needs less height) */}
            <div className={`flex-[2] min-h-0 grid ${queueGridCols} gap-1.5`}>
              <MicroQueuePanel
                entries={currentSnapshot.microtaskQueue}
                isActive={focus === 'micro'}
                isDimmed={focus !== null && focus !== 'micro'}
              />
              <MacroQueuePanel
                entries={currentSnapshot.macrotaskQueue}
                isActive={focus === 'macro'}
                isDimmed={(focus === 'micro' && currentSnapshot.microtaskQueue.length > 0) || focus === 'nexttick'}
              />
              {usesRaf && (
                <RafPanel
                  entries={currentSnapshot.rafQueue}
                  isActive={focus === 'raf'}
                  isDimmed={focus !== null && focus !== 'raf'}
                />
              )}
              {isNodeMode && (
                <>
                  <NextTickPanel
                    entries={currentSnapshot.nextTickQueue}
                    isActive={focus === 'nexttick'}
                    isDimmed={focus !== null && focus !== 'nexttick'}
                  />
                  <ImmediatePanel entries={currentSnapshot.immediateQueue} isDimmed={focus !== null} />
                </>
              )}
            </div>

            {/* Console */}
            <div className="flex-[3] min-h-0">
              <ConsolePanel
                entries={currentSnapshot.consoleOutput}
                isLocked={isLocked}
                error={mode === 'freeform' ? freeformError : undefined}
                note={mode === 'freeform' ? freeformNote : undefined}
                footer={consoleFooter}
              />
            </div>
          </div>
        </div>
      </LayoutGroup>

      {/* ── Pinned playback bar ─────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-card px-2 sm:px-4 py-1.5">
        <PlaybackBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speed={speed}
          disabled={isLocked || (mode === 'freeform' && !freeformSnapshots)}
          logSteps={logSteps}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          onSeek={handleSeek}
        />
      </div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
