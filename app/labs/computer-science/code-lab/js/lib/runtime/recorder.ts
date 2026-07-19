// ─── Trace Recorder ────────────────────────────────────────────
// Collects an ordered list of `Instruction`s as the sandboxed user
// code runs. The instruction list is the SAME shape the preset
// examples use, so it feeds straight into `generateSnapshots()` and
// reuses the entire existing visualizer UI.

import type { Instruction } from '../simulator';
import type { StackFrame, ConsoleEntry, WebAPIItem, EventLoopPhase } from '../types';

export class Recorder {
  readonly instructions: Instruction[] = [];
  /** Most recent source line seen — used when a call omits an explicit line. */
  private line = 1;

  setLine(line?: number): void {
    if (typeof line === 'number' && line > 0) this.line = line;
  }

  private emit(instr: Omit<Instruction, 'codeLine' | 'description'> & { description: string; codeLine?: number }): void {
    this.instructions.push({
      ...instr,
      codeLine: instr.codeLine ?? this.line,
    } as Instruction);
  }

  stackPush(name: string, frameType: StackFrame['type'], description: string, line?: number): void {
    this.emit({ type: 'PUSH_STACK', name, frameType, description, codeLine: line });
  }
  stackPop(description: string, line?: number): void {
    this.emit({ type: 'POP_STACK', description, codeLine: line });
  }
  log(message: string, source: ConsoleEntry['source'], description: string, line?: number): void {
    this.emit({ type: 'LOG', message, source, description, codeLine: line });
  }
  addWebApi(label: string, apiType: WebAPIItem['type'], delay: number | undefined, description: string, detail?: string, line?: number): void {
    this.emit({ type: 'ADD_WEB_API', label, apiType, delay, detail, description, codeLine: line });
  }
  removeWebApi(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_WEB_API', label, description, codeLine: line });
  }
  addMicrotask(label: string, description: string, line?: number): void {
    this.emit({ type: 'ADD_MICROTASK', label, description, codeLine: line });
  }
  removeMicrotask(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_MICROTASK', label, description, codeLine: line });
  }
  addMacrotask(label: string, description: string, line?: number): void {
    this.emit({ type: 'ADD_MACROTASK', label, description, codeLine: line });
  }
  removeMacrotask(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_MACROTASK', label, description, codeLine: line });
  }
  addRafCallback(label: string, description: string, line?: number): void {
    this.emit({ type: 'ADD_RAF_CALLBACK', label, description, codeLine: line });
  }
  removeRafCallback(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_RAF_CALLBACK', label, description, codeLine: line });
  }
  addNextTick(label: string, description: string, line?: number): void {
    this.emit({ type: 'ADD_NEXTTICK', label, description, codeLine: line });
  }
  removeNextTick(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_NEXTTICK', label, description, codeLine: line });
  }
  addImmediate(label: string, description: string, line?: number): void {
    this.emit({ type: 'ADD_IMMEDIATE', label, description, codeLine: line });
  }
  removeImmediate(label: string, description: string, line?: number): void {
    this.emit({ type: 'REMOVE_IMMEDIATE', label, description, codeLine: line });
  }
  phase(phase: EventLoopPhase, description: string, line?: number): void {
    this.emit({ type: 'SET_PHASE', phase, description, codeLine: line });
  }
}
