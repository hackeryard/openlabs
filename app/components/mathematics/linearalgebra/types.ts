export type Matrix2x2 = [[number, number], [number, number]];

export interface Vector2D {
  x: number;
  y: number;
}

export type TransformShapeType = "unit_square" | "circle" | "letter_f" | "house" | "grid_dots";

export type MatrixPresetId =
  | "identity"
  | "rotation"
  | "shearX"
  | "shearY"
  | "scale"
  | "reflectionX"
  | "reflectionY"
  | "reflectionDiag"
  | "projectionX"
  | "squeeze"
  | "singular";

export interface MatrixPreset {
  id: MatrixPresetId;
  name: string;
  description: string;
  matrix: Matrix2x2;
}

export interface EigenResult {
  hasRealEigenvalues: boolean;
  lambda1: number;
  lambda2: number;
  lambda1Complex?: string;
  lambda2Complex?: string;
  v1?: Vector2D;
  v2?: Vector2D;
  trace: number;
  determinant: number;
}

export interface SVDResult {
  sigma1: number;
  sigma2: number;
  u1: Vector2D;
  u2: Vector2D;
  v1: Vector2D;
  v2: Vector2D;
}

export interface LinearSystemResult {
  targetB: Vector2D;
  solutionX: Vector2D | null;
  hasUniqueSolution: boolean;
  statusMessage: string;
}

export interface LinearAlgebraState {
  activeTab: "canvas" | "eigen" | "system" | "composition";
  matrix: Matrix2x2;
  // Matrix composition: Second matrix B for B * A
  matrixB: Matrix2x2;
  useComposition: boolean;
  // Animation interpolation factor: 0 = Identity I, 1 = Matrix A
  tAnim: number;
  isAnimating: boolean;
  animSpeed: number;
  // Shape & Geometry customization
  activeShape: TransformShapeType;
  showOriginalGrid: boolean;
  showTransformedGrid: boolean;
  showUnitSquare: boolean;
  showBasisVectors: boolean;
  showEigenLines: boolean;
  showSVD: boolean;
  // Custom vector
  showCustomVector: boolean;
  customVector: Vector2D;
  // Linear system Ax = b
  targetVectorB: Vector2D;
  // Preset rotation angle
  rotationAngleDeg: number;
}
