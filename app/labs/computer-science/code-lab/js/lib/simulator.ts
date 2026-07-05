// ─── Simulator Engine ──────────────────────────────────────────
// Processes a list of Instructions into a timeline of SimulationSnapshots.
// Each instruction performs exactly one state mutation, then produces a snapshot.

import type {
  StackFrame,
  WebAPIItem,
  QueueEntry,
  ConsoleEntry,
  EventLoopPhase,
  SimulationSnapshot,
} from './types';

// ── Instruction types ──────────────────────────────────────────

export type InstructionType =
  | 'PUSH_STACK'
  | 'POP_STACK'
  | 'LOG'
  | 'ADD_WEB_API'
  | 'REMOVE_WEB_API'
  | 'ADD_MICROTASK'
  | 'ADD_MACROTASK'
  | 'REMOVE_MICROTASK'
  | 'REMOVE_MACROTASK'
  | 'SET_PHASE';

export interface Instruction {
  type: InstructionType;

  // PUSH_STACK
  name?: string;
  frameType?: StackFrame['type'];

  // LOG
  message?: string;
  source?: ConsoleEntry['source'];

  // ADD_WEB_API / REMOVE_WEB_API / queue ops
  label?: string;
  apiType?: WebAPIItem['type'];
  delay?: number;

  // SET_PHASE
  phase?: EventLoopPhase;

  // Metadata (required for all instructions)
  codeLine: number;       // 1-indexed source line to highlight
  description: string;    // human-readable step explanation
}

// ── Internal mutable state ────────────────────────────────────

interface SimulatorState {
  callStack: StackFrame[];
  webAPIs: WebAPIItem[];
  microtaskQueue: QueueEntry[];
  macrotaskQueue: QueueEntry[];
  consoleOutput: ConsoleEntry[];
  eventLoopPhase: EventLoopPhase;
}

// ── Snapshot generator ────────────────────────────────────────

export function generateSnapshots(instructions: Instruction[]): SimulationSnapshot[] {
  const state: SimulatorState = {
    callStack: [],
    webAPIs: [],
    microtaskQueue: [],
    macrotaskQueue: [],
    consoleOutput: [],
    eventLoopPhase: 'idle',
  };

  let idCounter = 0;
  const genId = () => `item-${idCounter++}`;

  const snapshots: SimulationSnapshot[] = [];

  for (let i = 0; i < instructions.length; i++) {
    applyInstruction(state, instructions[i], genId);

    snapshots.push({
      step: i,
      callStack: state.callStack.map(f => ({ ...f })),
      webAPIs: state.webAPIs.map(a => ({ ...a })),
      microtaskQueue: state.microtaskQueue.map(e => ({ ...e })),
      macrotaskQueue: state.macrotaskQueue.map(e => ({ ...e })),
      consoleOutput: state.consoleOutput.map(c => ({ ...c })),
      eventLoopPhase: state.eventLoopPhase,
      description: instructions[i].description,
      activeCodeLine: instructions[i].codeLine,
    });
  }

  return snapshots;
}

// ── Instruction application ──────────────────────────────────

function applyInstruction(
  state: SimulatorState,
  instr: Instruction,
  genId: () => string,
): void {
  switch (instr.type) {
    case 'PUSH_STACK':
      state.callStack.push({
        id: genId(),
        name: instr.name!,
        type: instr.frameType ?? 'function',
      });
      if (instr.phase) {
        state.eventLoopPhase = instr.phase;
      }
      break;

    case 'POP_STACK':
      state.callStack.pop();
      break;

    case 'LOG':
      state.consoleOutput.push({
        text: instr.message!,
        source: instr.source ?? 'sync',
      });
      break;

    case 'ADD_WEB_API':
      state.webAPIs.push({
        id: genId(),
        label: instr.label!,
        type: instr.apiType ?? 'timer',
        delay: instr.delay,
      });
      break;

    case 'REMOVE_WEB_API': {
      const idx = state.webAPIs.findIndex(a => a.label === instr.label);
      if (idx !== -1) state.webAPIs.splice(idx, 1);
      break;
    }

    case 'ADD_MICROTASK':
      state.microtaskQueue.push({
        id: genId(),
        label: instr.label!,
        type: 'microtask',
      });
      break;

    case 'ADD_MACROTASK':
      state.macrotaskQueue.push({
        id: genId(),
        label: instr.label!,
        type: 'macrotask',
      });
      break;

    case 'REMOVE_MICROTASK': {
      const idx = state.microtaskQueue.findIndex(e => e.label === instr.label);
      if (idx !== -1) state.microtaskQueue.splice(idx, 1);
      break;
    }

    case 'REMOVE_MACROTASK': {
      const idx = state.macrotaskQueue.findIndex(e => e.label === instr.label);
      if (idx !== -1) state.macrotaskQueue.splice(idx, 1);
      break;
    }

    case 'SET_PHASE':
      state.eventLoopPhase = instr.phase!;
      break;
  }
}
