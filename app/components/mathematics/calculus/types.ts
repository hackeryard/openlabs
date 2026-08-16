export type CalculusFunctionId =
  | "cubic"
  | "parabola"
  | "sine"
  | "cosine"
  | "exponential"
  | "rational"
  | "logarithm"
  | "dampened";

export interface CalculusFunctionPreset {
  id: CalculusFunctionId;
  name: string;
  expression: string;
  derivativeExpr: string;
  fn: (x: number) => number;
  dfn: (x: number) => number;
  d2fn: (x: number) => number;
  defaultDomain: [number, number];
  defaultRange: [number, number];
  defaultX0: number;
  defaultA: number;
  defaultB: number;
}

export type RiemannMethod = "left" | "right" | "midpoint" | "trapezoid" | "simpson";

export interface RiemannPartitionSlice {
  xLeft: number;
  xRight: number;
  xSample: number;
  height: number;
  yLeft: number;
  yRight: number;
  area: number;
}

export interface RiemannSumResult {
  method: RiemannMethod;
  partitions: number;
  approxArea: number;
  exactArea: number;
  error: number;
  percentError: number;
  slices: RiemannPartitionSlice[];
}

export interface CalculusCriticalPoint {
  x: number;
  y: number;
  firstDerivative: number;
  secondDerivative: number;
  type: "local_min" | "local_max" | "inflection" | "saddle";
  formatted: string;
}

export interface CalculusLabState {
  activeTab: "derivatives" | "riemann" | "optimization";
  selectedFuncId: CalculusFunctionId;
  // Derivative Limit state
  x0: number;
  h: number;
  showSecantLine: boolean;
  showTangentLine: boolean;
  showDerivativeGraph: boolean;
  // Riemann Integral state
  integralA: number;
  integralB: number;
  partitionsN: number;
  riemannMethod: RiemannMethod;
  // Optimization state
  selectedCriticalPoint: CalculusCriticalPoint | null;
}
