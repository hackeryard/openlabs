'use client';

import { ChevronDown, FlaskConical } from 'lucide-react';
import type { Example } from '../lib/types';

interface ExamplePickerProps {
  examples: Example[];
  selectedExampleId: string;
  onExampleChange: (id: string) => void;
  mode: 'preset' | 'freeform';
  onModeChange: (mode: 'preset' | 'freeform') => void;
}

const difficultyBadge: Record<Example['difficulty'], string> = {
  beginner: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
  intermediate: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30',
  advanced: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30',
};

export default function ExamplePicker({ examples, selectedExampleId, onExampleChange, mode, onModeChange }: ExamplePickerProps) {
  const selectedExample = examples.find(e => e.id === selectedExampleId);

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="relative flex-1">
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
                       text-xs font-medium px-3 py-1.5 pr-7 rounded-lg cursor-pointer
                       hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40
                       transition-colors"
            aria-label="Select example"
          >
            <optgroup label="Examples">
              {examples.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Beta">
              <option value="__freeform__">✍️ Write your own code</option>
            </optgroup>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {mode === 'preset' ? (
          <button
            onClick={() => onModeChange('freeform')}
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity shrink-0"
          >
            <FlaskConical className="w-3 h-3" />
            Free-form
          </button>
        ) : (
          <button
            onClick={() => onModeChange('preset')}
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Back to examples
          </button>
        )}
      </div>

      {mode === 'preset' && selectedExample && (
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <p className="text-[11px] text-muted-foreground leading-relaxed">{selectedExample.description}</p>
          <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${difficultyBadge[selectedExample.difficulty]}`}>
            {selectedExample.difficulty}
          </span>
        </div>
      )}
    </div>
  );
}
