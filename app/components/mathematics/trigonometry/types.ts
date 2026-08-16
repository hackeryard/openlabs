export type TrigFunction = "sin" | "cos" | "tan" | "sec" | "csc" | "cot";

export interface ExactAngle {
  deg: number;
  radStr: string;
  radVal: number;
  sinStr: string;
  sinVal: number;
  cosStr: string;
  cosVal: number;
  tanStr: string;
  tanVal: number;
  quadrant: 1 | 2 | 3 | 4 | "axis";
}

export interface WaveTransform {
  func: "sin" | "cos" | "tan";
  amplitude: number; // A
  frequency: number; // B (period = 2pi / B)
  phaseShift: number; // C
  verticalShift: number; // D
  showHarmonic: boolean;
  harmonicAmplitude: number;
  harmonicMultiple: number;
}

export interface TrigLabState {
  angleDeg: number; // 0 to 360 (or continuous)
  angleRad: number;
  selectedFunction: TrigFunction;
  showSinLeg: boolean;
  showCosLeg: boolean;
  showTanLeg: boolean;
  showSecCscCot: boolean;
  showReferenceTriangle: boolean;
  showAngleArc: boolean;
  showExactRays: boolean;
  isPlaying: boolean;
  playSpeed: number; // multiplier
}

export interface IdentityItem {
  id: string;
  name: string;
  category: "pythagorean" | "doubleAngle" | "reciprocal" | "quotient";
  formula: string;
  lhs: (deg: number) => number;
  rhs: (deg: number) => number;
  description: string;
}
