export type DifferentialEquationsTabId =
  | "slope_fields"
  | "phase_plane"
  | "lotka_volterra"
  | "harmonic_oscillator"
  | "lorenz_chaos"
  | "sir_epidemic";

export type SolverMethod = "euler" | "heun" | "rk4";

export interface TrajectoryPoint2D {
  x: number;
  y: number;
  t?: number;
}

export interface TrajectoryPoint3D {
  x: number;
  y: number;
  z: number;
  t?: number;
}

export type MatrixStabilityType =
  | "saddle"
  | "stable_node"
  | "unstable_node"
  | "stable_spiral"
  | "unstable_spiral"
  | "center"
  | "degenerate";

export interface LinearSystemAnalysis {
  trace: number;
  determinant: number;
  discriminant: number;
  stability: MatrixStabilityType;
  eigenvalue1: { real: number; imag: number };
  eigenvalue2: { real: number; imag: number };
}

export interface LotkaVolterraParams {
  alpha: number; // Prey birth rate
  beta: number; // Predation rate
  gamma: number; // Predator death rate
  delta: number; // Predator reproduction per eaten prey
}

export interface HarmonicParams {
  mass: number;
  damping: number;
  springK: number;
  forceAmp: number;
  forceFreq: number;
}

export interface LorenzParams {
  sigma: number;
  rho: number;
  beta: number;
}

export interface SirParams {
  beta: number; // Transmission rate
  gamma: number; // Recovery rate
  totalPop: number;
  initialInfected: number;
}
