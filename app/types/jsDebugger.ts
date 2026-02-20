export type Memory = Record<string, any>;

export type StackFrame = {
  id: string;
  name: string;
  locals: Memory;
};

export type AsyncTask = {
  id: string;
  type: "timeout" | "interval" | "promise";
  label: string;
};

export type RuntimeSnapshot = {
  id: number;
  line: number;
  memory: Memory;
  stack: StackFrame[];
  dom?: string;
  asyncQueue?: AsyncTask[];
  timestamp: number;
};
