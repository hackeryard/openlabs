// ─── Execute Orchestrator ──────────────────────────────────────
// Transforms user code, runs it in the sandbox with our shimmed
// globals, drives the virtual event loop, and returns the recorded
// Instruction timeline (which feeds the existing visualizer) plus
// console output and any error / budget note.

import type { Instruction } from '../simulator';
import { Recorder } from './recorder';
import { Scheduler } from './scheduler';
import { createSandbox } from './shims';
import { transform } from './transform';
import { LOOP_BUDGET_MESSAGE } from './loopGuard';

const RECURSION_MESSAGE = 'Maximum call stack size exceeded (simulated)';

const LOOP_NOTE = 'Stopped: this loop ran too many iterations to visualize (possible infinite loop). Add a smaller bound or a break condition.';
const RECURSION_NOTE = 'Stopped: this recursion went too deep to visualize (possible missing base case).';

/** Maps a controlled safety-guard throw to its friendly note text, or undefined for a real error. */
function budgetNoteFor(err: Error): string | undefined {
  if (err.message === LOOP_BUDGET_MESSAGE) return LOOP_NOTE;
  if (err.message === RECURSION_MESSAGE) return RECURSION_NOTE;
  return undefined;
}

export interface ExecuteResult {
  instructions: Instruction[];
  consoleLines: string[];
  /** Syntax/transform error, or an uncaught top-level runtime error. */
  error?: string;
  /** Set when a safety budget stopped the run (e.g. infinite loop). */
  note?: string;
}

export function executeUserCode(source: string): ExecuteResult {
  const { code, error: transformError } = transform(source);
  if (transformError) {
    return { instructions: [], consoleLines: [], error: transformError };
  }

  const recorder = new Recorder();
  const scheduler = new Scheduler(recorder);
  const { globals, consoleLines } = createSandbox(scheduler);

  recorder.stackPush('global()', 'global', 'Script starts — the global execution context is pushed onto the Call Stack.', 1);
  recorder.phase('executing', 'The engine runs the top-level code, line by line.', 1);

  const names = Object.keys(globals);
  const values = names.map(n => globals[n]);

  let runtimeError: string | undefined;
  let note: string | undefined;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...names, `"use strict";\n${code}`);
    fn(...values);
  } catch (e) {
    const err = e as Error;
    const budgetNote = budgetNoteFor(err);
    if (budgetNote) {
      // A controlled safety stop, not a bug in the user's syntax —
      // surface as `note` (soft/amber), skip the "Uncaught ..." log.
      note = budgetNote;
    } else {
      runtimeError = `${err.name}: ${err.message}`;
      recorder.log(runtimeError, scheduler.currentSource, `Uncaught ${runtimeError}`);
    }
  }

  recorder.stackPop('Top-level code finished — global context popped. The Call Stack is now empty.');

  if (!note) {
    try {
      scheduler.drive();
    } catch (e) {
      const err = e as Error;
      runtimeError ??= `${err.name}: ${err.message}`;
    }
  }

  return {
    instructions: recorder.instructions,
    consoleLines,
    error: runtimeError,
    note: note ?? scheduler.budgetHit ?? undefined,
  };
}
