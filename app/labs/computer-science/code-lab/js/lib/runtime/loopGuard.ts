// ─── Loop Guard ─────────────────────────────────────────────────
// A synchronous `while(true){}`/`for(;;){}` never reaches the
// Scheduler (nothing is ever recorded, no instruction budget is
// ever checked), so it hangs the tab forever. `transform.ts`
// injects a call to `tick()` at the top of every loop body; once
// a single run exceeds LOOP_ITERATION_CAP iterations across ALL
// its loops combined, we throw a recognizable, catchable error so
// `execute.ts`/`scheduler.ts` can surface it as a clean "Stopped:"
// note instead of a frozen tab.

export const LOOP_BUDGET_MESSAGE = '__LOOP_BUDGET_EXCEEDED__';

// Generous enough that real teaching examples (even nested loops up
// to ~50x50x50) never trip it, but a non-yielding infinite loop hits
// it in well under a second since each tick is just increment+compare.
const LOOP_ITERATION_CAP = 200_000;

export interface LoopGuard {
  tick: () => void;
}

/** Fresh counter per `executeUserCode` run — never shared across runs. */
export function createLoopGuard(): LoopGuard {
  let count = 0;
  return {
    tick(): void {
      count++;
      if (count > LOOP_ITERATION_CAP) {
        throw new Error(LOOP_BUDGET_MESSAGE);
      }
    },
  };
}
