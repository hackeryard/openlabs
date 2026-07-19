'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Info, X, BookOpen, Lock, Code2, LayoutGrid, Terminal, Settings2, Keyboard } from 'lucide-react';

import { EXAMPLES } from '../lib/examples';
import type { SimulationSnapshot } from '../lib/types';
import { generateSnapshots } from '../lib/simulator';
import { executeUserCode } from '../lib/runtime/execute';

import ExamplePicker from './ExamplePicker';
import RuntimePanelGroup from './RuntimePanelGroup';
import EventLoopIndicator from './EventLoopIndicator';
import ConsoleOutput from './ConsoleOutput';
import PlaybackControls from './PlaybackControls';
import EditorPane from './EditorPane';
import RunPanel from './RunPanel';
import PredictModePanel from './PredictModePanel';

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
  consoleOutput: [],
  eventLoopPhase: 'idle',
  description: 'Click "Run" to execute your code and see it step through the event loop.',
  activeCodeLine: 1,
};

type View = 'code' | 'runtime' | 'console' | 'settings';

const TAB_ITEMS: { id: View; label: string; icon: typeof Code2 }[] = [
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'runtime', label: 'Runtime', icon: LayoutGrid },
  { id: 'console', label: 'Console', icon: Terminal },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

interface EventLoopVisualizerProps {
  onExperimentComplete: () => void;
  onExamplesCompletedChange?: (count: number) => void;
  onPredictCorrectChange?: (count: number) => void;
  onFreeformRunsChange?: (count: number) => void;
}

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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasCompletedExperiment, setHasCompletedExperiment] = useState(false);

  // ── Responsive shell ───────────────────────────────────────
  // `view` drives the single-panel tab bar below `lg`; `rightTab`
  // drives the smaller sub-tab row shown only between `lg` and `xl`
  // (Runtime/Console/Settings share the right column there). At `xl+`
  // all three are shown stacked, no tabs — see the panel classNames
  // below, which combine both states purely via Tailwind breakpoint
  // prefixes rather than a JS media-query hook.
  const [view, setView] = useState<View>('code');
  const [rightTab, setRightTab] = useState<Exclude<View, 'code'>>('runtime');

  // ── Free-form mode (beta) ──────────────────────────────────
  const [mode, setMode] = useState<'preset' | 'freeform'>('preset');
  const [freeformSource, setFreeformSource] = useState(FREEFORM_STARTER);
  const [freeformSnapshots, setFreeformSnapshots] = useState<SimulationSnapshot[] | null>(null);
  const [freeformError, setFreeformError] = useState<string | undefined>(undefined);
  const [freeformNote, setFreeformNote] = useState<string | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [freeformRunsCompleted, setFreeformRunsCompleted] = useState(0);
  const isEditorFocusedRef = useRef(false);

  // ── Tracking State ───────────────────────────────────────
  const [completedExampleIds, setCompletedExampleIds] = useState<Set<string>>(new Set());
  const [predictCorrectIds, setPredictCorrectIds] = useState<Set<string>>(new Set());
  // Examples whose real output has been revealed (by submitting a
  // prediction, right or wrong) — gates peeking at the answer beforehand.
  const [revealedPredictIds, setRevealedPredictIds] = useState<Set<string>>(new Set());

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived state ────────────────────────────────────────
  const selectedExample = EXAMPLES.find(e => e.id === selectedExampleId) ?? EXAMPLES[0];
  const snapshots = mode === 'freeform' ? (freeformSnapshots ?? [EMPTY_SNAPSHOT]) : selectedExample.snapshots;
  const totalSteps = snapshots.length;
  const currentSnapshot: SimulationSnapshot = snapshots[currentStep] ?? snapshots[0];
  const isLocked = mode === 'preset' && selectedExample.isPredictMode && !revealedPredictIds.has(selectedExampleId);

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
      // activate whichever PlaybackControls button is focused, not always
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
    const result = executeUserCode(freeformSource);
    setFreeformSnapshots(generateSnapshots(result.instructions));
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
  }, [freeformSource, hasCompletedExperiment, onExperimentComplete, onFreeformRunsChange]);

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
    <div className="flex flex-col flex-1 min-h-0 bg-background text-foreground">
      {/* ── Disclaimer Banner ─────────────────────────────── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 px-4 py-3 bg-primary/5 border-b border-primary/20">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-primary">About this simulation:</span>{' '}
                  This is a conceptual model of the JS event loop, not a literal engine trace.
                  Try a preset example or write your own code in the Code tab. See the Settings
                  tab for the full picture and keyboard shortcuts.
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="shrink-0 p-0.5 rounded hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors"
                aria-label="Dismiss disclaimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showDisclaimer && (
        <div className="flex justify-end px-3 py-1 border-b border-border">
          <button
            onClick={() => setShowDisclaimer(true)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
            aria-label="Show simulation disclaimer"
          >
            <BookOpen className="w-3 h-3" />
            About this simulation
          </button>
        </div>
      )}

      {/* ── Mobile/tablet tab bar (below lg) ────────────────── */}
      <div className="flex lg:hidden border-b border-border shrink-0">
        {TAB_ITEMS.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-2 p-2 sm:p-3">
        {/* ─ Code pane: always visible at lg+, tab-gated below ─ */}
        <div className={`${view === 'code' ? 'flex' : 'hidden'} lg:flex lg:w-[35%] shrink-0 rounded-xl border border-border bg-card overflow-hidden flex-col min-h-[250px] lg:min-h-0`}>
          <ExamplePicker
            examples={EXAMPLES}
            selectedExampleId={selectedExampleId}
            onExampleChange={handleExampleChange}
            mode={mode}
            onModeChange={handleModeChange}
          />
          {mode === 'freeform' ? (
            <>
              <RunPanel error={freeformError} note={freeformNote} />
              <EditorPane
                readOnly={false}
                sourceCode={freeformSource}
                onChange={setFreeformSource}
                onRun={handleRun}
                running={isRunning}
                onFocusChange={focused => { isEditorFocusedRef.current = focused; }}
              />
            </>
          ) : (
            <EditorPane
              readOnly
              sourceCode={selectedExample.sourceCode}
              activeCodeLine={currentSnapshot.activeCodeLine}
              title={selectedExample.title}
            />
          )}
        </div>

        {/* ─ Right column: Runtime / Console / Settings ──────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-2 min-h-0">
          {/* Sub-tab row: only shown between lg and xl, where the
              right column shares space with the always-visible code
              pane and can't fit all three panels stacked. */}
          <div className="hidden lg:flex xl:hidden border-b border-border shrink-0">
            {(['runtime', 'console', 'settings'] as const).map(id => {
              const item = TAB_ITEMS.find(t => t.id === id)!;
              const Icon = item.icon;
              const active = rightTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
            {/* Runtime tab */}
            <div className={`${view === 'runtime' ? 'flex' : 'hidden'} ${rightTab === 'runtime' ? 'lg:flex' : 'lg:hidden'} xl:flex flex-col gap-2`}>
              <RuntimePanelGroup snapshot={currentSnapshot} />
              <EventLoopIndicator
                phase={currentSnapshot.eventLoopPhase}
                description={currentSnapshot.description}
              />
            </div>

            {/* Console tab */}
            <div className={`${view === 'console' ? 'flex' : 'hidden'} ${rightTab === 'console' ? 'lg:flex' : 'lg:hidden'} xl:flex flex-col gap-2 min-h-[200px]`}>
              <div className="rounded-xl border border-border bg-card overflow-hidden flex-1 min-h-[80px] flex flex-col">
                {isLocked ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Submit your prediction below to reveal the console output.</p>
                  </div>
                ) : (
                  <ConsoleOutput entries={currentSnapshot.consoleOutput} />
                )}
              </div>

              {mode === 'preset' && selectedExample.isPredictMode && (
                <PredictModePanel
                  key={selectedExampleId}
                  expectedOutput={selectedExample.expectedOutput}
                  onCorrect={handlePredictCorrect}
                  onSubmit={handlePredictSubmit}
                  explanation={selectedExample.explanation}
                />
              )}

              {mode === 'preset' && !selectedExample.isPredictMode && currentStep === totalSteps - 1 && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">{selectedExample.explanation}</p>
                </motion.div>
              )}
            </div>

            {/* Settings tab */}
            <div className={`${view === 'settings' ? 'flex' : 'hidden'} ${rightTab === 'settings' ? 'lg:flex' : 'lg:hidden'} xl:flex flex-col gap-3`}>
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-bold text-foreground mb-2">About this simulation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a conceptual model of the JavaScript event loop, not a literal engine
                  trace. It's built to teach execution order — Call Stack, Web APIs, Microtask
                  Queue, Macrotask Queue, and how the event loop hands off between them — not to
                  replicate V8 internals exactly. Use a preset example to see a scripted trace, or
                  switch to free-form mode to write and run your own JavaScript.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                  <Keyboard className="w-4 h-4" />
                  Keyboard shortcuts
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">→</kbd> step backward / forward</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Space</kbd> play / pause</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">R</kbd> reset to the start</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Ctrl/Cmd + Enter</kbd> run your code (free-form mode)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-bold text-foreground mb-3">Color legend</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <LegendItem color="bg-blue-500" label="Call Stack" />
                  <LegendItem color="bg-violet-500" label="Web APIs" />
                  <LegendItem color="bg-emerald-500" label="Microtask Queue" />
                  <LegendItem color="bg-amber-500" label="Macrotask Queue" />
                  <LegendItem color="bg-primary" label="Event Loop" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Playback Controls ─────────────────────── */}
      <div className="shrink-0 border-t border-border bg-card px-3 sm:px-4 py-3">
        <PlaybackControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speed={speed}
          disabled={isLocked || (mode === 'freeform' && !freeformSnapshots)}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
