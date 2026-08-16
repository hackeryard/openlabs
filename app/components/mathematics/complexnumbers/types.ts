export type ComplexTabId = "argand" | "roots" | "euler" | "fractals";

export interface ComplexNumber {
  re: number; // Real component (a)
  im: number; // Imaginary component (b)
}

export interface PolarComplex {
  r: number; // Modulus |z|
  theta: number; // Argument (radians)
}

export type ComplexOperation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "power"
  | "sqrt"
  | "log"
  | "linear_comb";

export type FractalType = "mandelbrot" | "julia" | "multibrot3" | "burningship";

export type ColorPaletteId = "cosmic" | "fire" | "emerald" | "rainbow" | "monochrome" | "electric";

export interface FractalPreset {
  name: string;
  fractalType: FractalType;
  centerX: number;
  centerY: number;
  zoom: number;
  maxIterations: number;
  juliaC?: ComplexNumber;
}

export interface ComplexLabState {
  activeTab: ComplexTabId;
  // Argand State
  z1: ComplexNumber;
  z2: ComplexNumber;
  activeOperation: ComplexOperation;
  powerExponent: number;
  combAlpha: number;
  combBeta: number;
  showConjugate: boolean;
  showParallelogram: boolean;
  showPolarArcs: boolean;
  showAxisProjections: boolean;
  showGridLines: boolean;
  // Roots State: z^n = targetW
  rootsN: number;
  targetW: ComplexNumber;
  activeRootPower: number;
  isCyclingPowers: boolean;
  cycleSpeedMs: number;
  // Euler Formula State
  eulerAngleDeg: number;
  eulerRadius: number;
  taylorTermsCount: number;
  isEulerAnimating: boolean;
  eulerAnimSpeed: number;
  // Fractal State
  fractalType: FractalType;
  fractalCenterX: number;
  fractalCenterY: number;
  fractalZoom: number;
  maxIterations: number;
  paletteId: ColorPaletteId;
  juliaC: ComplexNumber;
  showOrbitTrap: boolean;
  orbitInspectPoint: ComplexNumber | null;
}
