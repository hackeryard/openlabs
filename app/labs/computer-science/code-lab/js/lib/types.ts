// ─── Core Types for the JS Event Loop Visualizer ──────────────────

/** A frame on the call stack */
export interface StackFrame {
  id: string;
  name: string;
  type: 'global' | 'function' | 'callback' | 'microtask' | 'promise-executor';
}

/** An async operation sitting in the Web APIs holding area */
export interface WebAPIItem {
  id: string;
  label: string;
  type: 'timer' | 'promise';
  delay?: number;
}

/** An entry in either the microtask or macrotask queue */
export interface QueueEntry {
  id: string;
  label: string;
  type: 'microtask' | 'macrotask';
}

/** Current phase of the event loop */
export type EventLoopPhase =
  | 'executing'
  | 'checking-stack'
  | 'draining-microtasks'
  | 'picking-macrotask'
  | 'idle';

/** A single console output entry with source attribution */
export interface ConsoleEntry {
  text: string;
  source: 'sync' | 'microtask' | 'macrotask';
}

/** A single point-in-time snapshot of the entire simulated runtime */
export interface SimulationSnapshot {
  step: number;
  callStack: StackFrame[];
  webAPIs: WebAPIItem[];
  microtaskQueue: QueueEntry[];
  macrotaskQueue: QueueEntry[];
  consoleOutput: ConsoleEntry[];
  eventLoopPhase: EventLoopPhase;
  description: string;
  activeCodeLine: number; // 1-indexed line in the source code
}

/** A fully-resolved example ready for the UI */
export interface Example {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  sourceCode: string;
  snapshots: SimulationSnapshot[];
  expectedOutput: string[];
  explanation: string;
  isPredictMode?: boolean;
}
