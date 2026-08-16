import {
  Matrix2x2,
  Vector2D,
  EigenResult,
  SVDResult,
  LinearSystemResult,
  MatrixPreset,
  TransformShapeType,
} from "../types";

export const IDENTITY_MATRIX: Matrix2x2 = [
  [1, 0],
  [0, 1],
];

/**
 * Calculates determinant of 2x2 matrix: det(A) = ad - bc
 */
export function calculateDeterminant(m: Matrix2x2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/**
 * Calculates trace of 2x2 matrix: tr(A) = a + d
 */
export function calculateTrace(m: Matrix2x2): number {
  return m[0][0] + m[1][1];
}

/**
 * Matrix-Vector multiplication: A * v
 */
export function transformVector(m: Matrix2x2, v: Vector2D): Vector2D {
  return {
    x: m[0][0] * v.x + m[0][1] * v.y,
    y: m[1][0] * v.x + m[1][1] * v.y,
  };
}

/**
 * Matrix multiplication: A * B
 */
export function multiplyMatrices(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1],
    ],
  ];
}

/**
 * Inverse matrix: A^-1 = (1 / det) * [[d, -b], [-c, a]]
 */
export function invertMatrix(m: Matrix2x2): Matrix2x2 | null {
  const det = calculateDeterminant(m);
  if (Math.abs(det) < 1e-6) return null;

  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det],
  ];
}

/**
 * Solves the linear system A * x = b
 */
export function solveLinearSystem(m: Matrix2x2, b: Vector2D): LinearSystemResult {
  const det = calculateDeterminant(m);
  if (Math.abs(det) < 1e-6) {
    // Check if b lies in column space
    const col1 = { x: m[0][0], y: m[1][0] };
    const col2 = { x: m[0][1], y: m[1][1] };
    const len1 = Math.hypot(col1.x, col1.y);
    const len2 = Math.hypot(col2.x, col2.y);

    const isCollinearWithCol1 =
      len1 > 1e-5 &&
      Math.abs(col1.x * b.y - col1.y * b.x) < 1e-4;

    if (isCollinearWithCol1 || (len1 < 1e-5 && len2 < 1e-5 && Math.hypot(b.x, b.y) < 1e-5)) {
      return {
        targetB: b,
        solutionX: null,
        hasUniqueSolution: false,
        statusMessage: "Infinite solutions (Target b lies in the 1D column space)",
      };
    }

    return {
      targetB: b,
      solutionX: null,
      hasUniqueSolution: false,
      statusMessage: "No solution (Target b lies outside the collapsed 1D column space)",
    };
  }

  const inv = invertMatrix(m)!;
  const x = transformVector(inv, b);
  return {
    targetB: b,
    solutionX: x,
    hasUniqueSolution: true,
    statusMessage: "Unique solution found via x = A⁻¹b",
  };
}

/**
 * Interpolates smoothly between Identity matrix I and Matrix A with factor t in [0, 1]
 */
export function interpolateMatrix(target: Matrix2x2, t: number): Matrix2x2 {
  const clampedT = Math.max(0, Math.min(1, t));
  return [
    [1 + (target[0][0] - 1) * clampedT, target[0][1] * clampedT],
    [target[1][0] * clampedT, 1 + (target[1][1] - 1) * clampedT],
  ];
}

/**
 * Calculates Eigenvalues & Eigenvectors for 2x2 matrix
 * Characteristic equation: lambda^2 - tr(A)*lambda + det(A) = 0
 */
export function calculateEigen(m: Matrix2x2): EigenResult {
  const tr = calculateTrace(m);
  const det = calculateDeterminant(m);
  const disc = tr * tr - 4 * det;

  if (disc >= -1e-6) {
    const sqrtDisc = Math.sqrt(Math.max(0, disc));
    const l1 = (tr + sqrtDisc) / 2;
    const l2 = (tr - sqrtDisc) / 2;

    const findEigenVector = (lambda: number): Vector2D => {
      const a_l = m[0][0] - lambda;
      const b = m[0][1];
      const c = m[1][0];
      const d_l = m[1][1] - lambda;

      if (Math.abs(b) > 1e-5) {
        const len = Math.hypot(-b, a_l);
        return { x: -b / len, y: a_l / len };
      }
      if (Math.abs(c) > 1e-5) {
        const len = Math.hypot(d_l, -c);
        return { x: d_l / len, y: -c / len };
      }
      if (Math.abs(a_l) < 1e-5) return { x: 1, y: 0 };
      return { x: 0, y: 1 };
    };

    return {
      hasRealEigenvalues: true,
      lambda1: l1,
      lambda2: l2,
      v1: findEigenVector(l1),
      v2: findEigenVector(l2),
      trace: tr,
      determinant: det,
    };
  } else {
    const realPart = tr / 2;
    const imagPart = Math.sqrt(-disc) / 2;

    return {
      hasRealEigenvalues: false,
      lambda1: realPart,
      lambda2: realPart,
      lambda1Complex: `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`,
      lambda2Complex: `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`,
      trace: tr,
      determinant: det,
    };
  }
}

/**
 * Calculates Singular Value Decomposition (SVD): A = U * Sigma * V^T
 */
export function calculateSVD(m: Matrix2x2): SVDResult {
  // A^T * A
  const ata: Matrix2x2 = [
    [m[0][0] * m[0][0] + m[1][0] * m[1][0], m[0][0] * m[0][1] + m[1][0] * m[1][1]],
    [m[0][0] * m[0][1] + m[1][0] * m[1][1], m[0][1] * m[0][1] + m[1][1] * m[1][1]],
  ];

  const eigenATA = calculateEigen(ata);
  const sigma1 = Math.sqrt(Math.max(0, eigenATA.lambda1));
  const sigma2 = Math.sqrt(Math.max(0, eigenATA.lambda2));

  const v1 = eigenATA.v1 || { x: 1, y: 0 };
  const v2 = eigenATA.v2 || { x: 0, y: 1 };

  // u1 = (1 / sigma1) * A * v1
  const av1 = transformVector(m, v1);
  const u1 =
    sigma1 > 1e-5
      ? { x: av1.x / sigma1, y: av1.y / sigma1 }
      : { x: 1, y: 0 };

  const av2 = transformVector(m, v2);
  const u2 =
    sigma2 > 1e-5
      ? { x: av2.x / sigma2, y: av2.y / sigma2 }
      : { x: -u1.y, y: u1.x };

  return {
    sigma1,
    sigma2,
    v1,
    v2,
    u1,
    u2,
  };
}

/**
 * Generates geometric shape vertices for arbitrary transformations
 */
export function getShapeVertices(shape: TransformShapeType): Vector2D[] {
  switch (shape) {
    case "unit_square":
      return [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ];

    case "circle": {
      const vertices: Vector2D[] = [];
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const rad = (i / steps) * 2 * Math.PI;
        vertices.push({ x: Math.cos(rad), y: Math.sin(rad) });
      }
      return vertices;
    }

    case "house":
      return [
        { x: -0.8, y: -0.8 },
        { x: 0.8, y: -0.8 },
        { x: 0.8, y: 0.4 },
        { x: 0.0, y: 1.2 },
        { x: -0.8, y: 0.4 },
      ];

    case "letter_f":
      return [
        { x: -0.6, y: -1.0 },
        { x: -0.2, y: -1.0 },
        { x: -0.2, y: -0.1 },
        { x: 0.5, y: -0.1 },
        { x: 0.5, y: 0.2 },
        { x: -0.2, y: 0.2 },
        { x: -0.2, y: 0.7 },
        { x: 0.7, y: 0.7 },
        { x: 0.7, y: 1.0 },
        { x: -0.6, y: 1.0 },
      ];

    case "grid_dots": {
      const pts: Vector2D[] = [];
      for (let x = -2; x <= 2; x += 0.5) {
        for (let y = -2; y <= 2; y += 0.5) {
          pts.push({ x, y });
        }
      }
      return pts;
    }
  }
}

/**
 * Creates 2D rotation matrix for angle theta in radians
 */
export function createRotationMatrix(radians: number): Matrix2x2 {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    [Number(cos.toFixed(4)), Number(-sin.toFixed(4))],
    [Number(sin.toFixed(4)), Number(cos.toFixed(4))],
  ];
}

export const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: "identity",
    name: "Identity Matrix (I)",
    description: "Standard basis vectors unchanged (det = 1)",
    matrix: [
      [1, 0],
      [0, 1],
    ],
  },
  {
    id: "rotation",
    name: "Rotation by 45°",
    description: "Pure rigid rotation counter-clockwise",
    matrix: [
      [0.7071, -0.7071],
      [0.7071, 0.7071],
    ],
  },
  {
    id: "shearX",
    name: "Horizontal Shear",
    description: "Points shifted horizontally proportional to their height y",
    matrix: [
      [1, 1],
      [0, 1],
    ],
  },
  {
    id: "shearY",
    name: "Vertical Shear",
    description: "Points shifted vertically proportional to their x-coordinate",
    matrix: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    id: "scale",
    name: "Non-uniform Scaling",
    description: "Stretches horizontal axis by 2x, vertical by 1.5x",
    matrix: [
      [2, 0],
      [0, 1.5],
    ],
  },
  {
    id: "squeeze",
    name: "Squeeze Mapping",
    description: "Stretches x by 2x while compressing y by 0.5x (det = 1)",
    matrix: [
      [2, 0],
      [0, 0.5],
    ],
  },
  {
    id: "reflectionX",
    name: "Reflection across X-Axis",
    description: "Flips vertical coordinate (det = -1, orientation flipped)",
    matrix: [
      [1, 0],
      [0, -1],
    ],
  },
  {
    id: "reflectionDiag",
    name: "Reflection across y = x",
    description: "Swaps x and y coordinates (det = -1)",
    matrix: [
      [0, 1],
      [1, 0],
    ],
  },
  {
    id: "projectionX",
    name: "Projection onto X-Axis",
    description: "Collapses space onto 1D line (det = 0, singular rank 1)",
    matrix: [
      [1, 0],
      [0, 0],
    ],
  },
  {
    id: "singular",
    name: "Linear Dependent Collapse",
    description: "Both columns are parallel vectors (det = 0)",
    matrix: [
      [1, 2],
      [2, 4],
    ],
  },
];
