// app/types/jsDebugger.ts

export type Memory = Record<string, any>;

// Stack frame types
export type StackFrameType = 'global' | 'function' | 'anonymous' | 'promise' | 'catch' | 'then' | 'executor';

export interface StackFrame {
    id: string;
    name: string;
    locals: Memory;
    type: StackFrameType;
    error?: string;
}

// Task types for queues
export type TaskType = 'task' | 'microtask' | 'setTimeout' | 'setInterval' | 'click' | 'promise' | 'then' | 'catch' | 'dom';

export interface Task {
    id: string;
    type: TaskType;
    name: string;
    callback?: string;
    line?: number;
    status?: 'pending' | 'running' | 'completed' | 'error';
}

export interface RuntimeSnapshot {
    id: number;
    line: number;
    memory: Memory;
    stack: StackFrame[];
    taskQueue: Task[];
    microtaskQueue: Task[];
    webAPIs: Task[];
    dom?: string;
    timestamp: number;
    error?: string;
    sourceLine?: string;
}
export type AsyncTask = {
  id: string;
  type: "timeout" | "interval" | "promise";
  label: string;
};

// export interface RuntimeSnapshot {
//   id: number;
//   line: number;
//   memory: Memory;
//   stack: StackFrame[];
//   asyncQueue?: any[];
//   dom?: string;
//   timestamp: number;
//   // Additional optional properties for visualization
//   condition?: {
//     expression: string;
//     result: any;
//   };
//   error?: string;
//   sourceLine?: string;
// }
