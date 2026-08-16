export type QuadraticForm = "standard" | "vertex" | "factored";

export interface QuadraticParams {
  a: number;
  b: number;
  c: number;
  // Vertex form parameters: y = a(x - h)^2 + k
  h: number;
  k: number;
  // Factored form parameters: y = a(x - r1)(x - r2)
  r1: number;
  r2: number;
}

export type RootType = "two_real" | "one_real" | "two_complex";

export interface QuadraticRoots {
  type: RootType;
  discriminant: number;
  r1Real: number;
  r1Imag: number;
  r2Real: number;
  r2Imag: number;
  r1Formatted: string;
  r2Formatted: string;
}

export interface ParabolaLandmarks {
  vertex: { x: number; y: number };
  axisOfSymmetry: number; // x = -b / (2a)
  yIntercept: { x: number; y: number }; // (0, c)
  focus: { x: number; y: number }; // (h, k + 1/(4a))
  directrix: number; // y = k - 1/(4a)
  focalLength: number; // p = 1 / (4a)
  opensUpward: boolean;
}

export interface PolynomialCoefficients {
  degree: number; // 1 to 5
  coeffs: number[]; // [a_n, a_{n-1}, ..., a_1, a_0]
}

export interface CriticalPoint {
  x: number;
  y: number;
  type: "local_max" | "local_min" | "inflection";
  formatted: string;
}

export interface SyntheticDivisionResult {
  divisorC: number;
  inputCoeffs: number[];
  multiplierRow: number[]; // numbers multiplied by c
  sumRow: number[]; // final row of coefficients + remainder
  quotientCoeffs: number[];
  remainder: number;
  isFactor: boolean;
  quotientString: string;
}

export interface PolyLabState {
  activeTab: "quadratic" | "polynomial" | "synthetic";
  quadraticForm: QuadraticForm;
  quadParams: QuadraticParams;
  polyDegree: number;
  polyCoeffs: number[];
  syntheticDivisorC: number;
  showVertex: boolean;
  showAxisOfSymmetry: boolean;
  showRoots: boolean;
  showFocusDirectrix: boolean;
  showTangent: boolean;
  tangentX: number;
}
