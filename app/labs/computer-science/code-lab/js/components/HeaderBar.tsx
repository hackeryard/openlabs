'use client';

import { ChevronDown, FlaskConical, Play, HelpCircle, ArrowLeft } from 'lucide-react';
import type { Example, RuntimeMode } from '../lib/types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../lib/types';

interface HeaderBarProps {
  examples: Example[];
  selectedExampleId: string;
  onExampleChange: (id: string) => void;
  mode: 'preset' | 'freeform';
  onModeChange: (mode: 'preset' | 'freeform') => void;
  runtimeMode: RuntimeMode;
  onRuntimeModeChange: (mode: RuntimeMode) => void;
  onRun: () => void;
  isRunning: boolean;
  onOpenInfo: () => void;
}

const difficultyBadge: Record<Example['difficulty'], string> = {
  beginner: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
  intermediate: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30',
  advanced: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30',
};

// Single-row control strip: example picker (grouped by category),
// free-form toggle, Browser/Node runtime toggle + Run (free-form only),
// and the help/info button. Replaces the old ExamplePicker + RunPanel.
export default function HeaderBar({
  examples,
  selectedExampleId,
  onExampleChange,
  mode,
  onModeChange,
  runtimeMode,
  onRuntimeModeChange,
  onRun,
  isRunning,
  onOpenInfo,
}: HeaderBarProps) {
  const selectedExample = examples.find(e => e.id === selectedExampleId);
  const categorized = CATEGORY_ORDER
    .map(category => ({ category, items: examples.filter(ex => ex.category === category) }))
    .filter(group => group.items.length > 0);

  return (
    <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border bg-card">
      {/* Example picker / freeform indicator */}
      <div className="relative flex-1 min-w-0 max-w-xs">
        <select
          value={mode === 'freeform' ? '__freeform__' : selectedExampleId}
          onChange={e => {
            if (e.target.value === '__freeform__') {
              onModeChange('freeform');
            } else {
              onModeChange('preset');
              onExampleChange(e.target.value);
            }
          }}
          className="w-full appearance-none bg-muted border border-border text-foreground
                     text-[11px] sm:text-xs font-medium px-2 sm:px-3 py-1.5 pr-7 rounded-lg cursor-pointer
                     hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
          aria-label="Select example"
        >
          {categorized.map(group => (
            <optgroup key={group.category} label={CATEGORY_LABELS[group.category]}>
              {group.items.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </optgroup>
          ))}
          <optgroup label="Beta">
            <option value="__freeform__">✍️ Write your own code</option>
          </optgroup>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Preset: difficulty badge (compact context, description lives in the code pane header title) */}
      {mode === 'preset' && selectedExample && (
        <span className={`hidden md:inline-block shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${difficultyBadge[selectedExample.difficulty]}`}>
          {selectedExample.difficulty}
        </span>
      )}

      {/* Free-form: runtime toggle + Run */}
      {mode === 'freeform' ? (
        <>
          <div className="shrink-0 flex items-center gap-0.5 bg-muted rounded-lg border border-border p-0.5">
            {(['browser', 'node'] as const).map(m => (
              <button
                key={m}
                onClick={() => onRuntimeModeChange(m)}
                className={`px-1.5 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold capitalize transition-all ${
                  runtimeMode === m
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="shrink-0 inline-flex items-center gap-1 sm:gap-1.5 rounded-lg bg-primary px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-primary-foreground transition hover:opacity-90 active:scale-95 disabled:opacity-50"
            title="Run (Ctrl/Cmd + Enter)"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{isRunning ? 'Running…' : 'Run'}</span>
          </button>
          <button
            onClick={() => onModeChange('preset')}
            className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden lg:inline">Examples</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => onModeChange('freeform')}
          className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity"
        >
          <FlaskConical className="w-3 h-3" />
          <span className="hidden sm:inline">Free-form</span>
        </button>
      )}

      {/* Help */}
      <button
        onClick={onOpenInfo}
        className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label="About this simulation, shortcuts and legend"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
