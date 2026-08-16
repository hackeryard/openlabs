import {
  CalculusFunctionId,
  CalculusFunctionPreset,
  RiemannMethod,
  RiemannSumResult,
  RiemannPartitionSlice,
  CalculusCriticalPoint,
} from "../types";

export const CALCULUS_PRESETS: CalculusFunctionPreset[] = [
  {
    id: "cubic",
    name: "Cubic Polynomial",
    expression: "f(x) = x³ - 3x",
    derivativeExpr: "f'(x) = 3x² - 3",
    fn: (x: number) => x * x * x - 3 * x,
    dfn: (x: number) => 3 * x * x - 3,
    d2fn: (x: number) => 6 * x,
    defaultDomain: [-4, 4],
    defaultRange: [-4, 4],
    defaultX0: 1.5,
    defaultA: -2,
    defaultB: 2,
  },
  {
    id: "parabola",
    name: "Quadratic Parabola",
    expression: "f(x) = x² - 2",
    derivativeExpr: "f'(x) = 2x",
    fn: (x: number) => x * x - 2,
    dfn: (x: number) => 2 * x,
    d2fn: () => 2,
    defaultDomain: [-4, 4],
    defaultRange: [-3, 6],
    defaultX0: 1.0,
    defaultA: -1,
    defaultB: 2.5,
  },
  {
    id: "sine",
    name: "Sine Wave",
    expression: "f(x) = 2 sin(x)",
    derivativeExpr: "f'(x) = 2 cos(x)",
    fn: (x: number) => 2 * Math.sin(x),
    dfn: (x: number) => 2 * Math.cos(x),
    d2fn: (x: number) => -2 * Math.sin(x),
    defaultDomain: [-5, 5],
    defaultRange: [-3, 3],
    defaultX0: 1.0,
    defaultA: 0,
    defaultB: Math.PI,
  },
  {
    id: "cosine",
    name: "Cosine Wave",
    expression: "f(x) = 2 cos(x)",
    derivativeExpr: "f'(x) = -2 sin(x)",
    fn: (x: number) => 2 * Math.cos(x),
    dfn: (x: number) => -2 * Math.sin(x),
    d2fn: (x: number) => -2 * Math.cos(x),
    defaultDomain: [-5, 5],
    defaultRange: [-3, 3],
    defaultX0: 0.5,
    defaultA: -Math.PI / 2,
    defaultB: Math.PI / 2,
  },
  {
    id: "exponential",
    name: "Exponential Growth",
    expression: "f(x) = e^(0.5x)",
    derivativeExpr: "f'(x) = 0.5 e^(0.5x)",
    fn: (x: number) => Math.exp(0.5 * x),
    dfn: (x: number) => 0.5 * Math.exp(0.5 * x),
    d2fn: (x: number) => 0.25 * Math.exp(0.5 * x),
    defaultDomain: [-4, 4],
    defaultRange: [-1, 8],
    defaultX0: 0.0,
    defaultA: 0,
    defaultB: 3,
  },
  {
    id: "rational",
    name: "Rational Function",
    expression: "f(x) = 4 / (x² + 1)",
    derivativeExpr: "f'(x) = -8x / (x² + 1)²",
    fn: (x: number) => 4 / (x * x + 1),
    dfn: (x: number) => (-8 * x) / Math.pow(x * x + 1, 2),
    d2fn: (x: number) => (8 * (3 * x * x - 1)) / Math.pow(x * x + 1, 3),
    defaultDomain: [-4, 4],
    defaultRange: [-1, 5],
    defaultX0: 1.0,
    defaultA: -2,
    defaultB: 2,
  },
  {
    id: "logarithm",
    name: "Natural Logarithm",
    expression: "f(x) = ln(x + 3)",
    derivativeExpr: "f'(x) = 1 / (x + 3)",
    fn: (x: number) => (x > -2.99 ? Math.log(x + 3) : NaN),
    dfn: (x: number) => (x > -2.99 ? 1 / (x + 3) : NaN),
    d2fn: (x: number) => (x > -2.99 ? -1 / Math.pow(x + 3, 2) : NaN),
    defaultDomain: [-3, 5],
    defaultRange: [-3, 3],
    defaultX0: 1.0,
    defaultA: -1,
    defaultB: 4,
  },
  {
    id: "dampened",
    name: "Dampened Oscillator",
    expression: "f(x) = e^(-0.3x) sin(2x)",
    derivativeExpr: "f'(x) = e^(-0.3x)(2 cos(2x) - 0.3 sin(2x))",
    fn: (x: number) => Math.exp(-0.3 * x) * Math.sin(2 * x),
    dfn: (x: number) =>
      Math.exp(-0.3 * x) * (2 * Math.cos(2 * x) - 0.3 * Math.sin(2 * x)),
    d2fn: (x: number) =>
      Math.exp(-0.3 * x) *
      (-3.91 * Math.sin(2 * x) - 1.2 * Math.cos(2 * x)),
    defaultDomain: [-1, 7],
    defaultRange: [-2, 2],
    defaultX0: 1.5,
    defaultA: 0,
    defaultB: 6,
  },
];

export function getPresetById(id: CalculusFunctionId): CalculusFunctionPreset {
  return CALCULUS_PRESETS.find((p) => p.id === id) || CALCULUS_PRESETS[0];
}

/**
 * Exact high-precision composite Simpson's rule definite integral: int_a^b f(x)dx
 */
export function computeExactIntegral(
  fn: (x: number) => number,
  a: number,
  b: number,
  intervals: number = 600
): number {
  if (a === b) return 0;
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    const y = fn(x);
    if (!isNaN(y) && isFinite(y)) {
      sum += (i % 2 === 0 ? 2 : 4) * y;
    }
  }

  return (h / 3) * sum;
}

/**
 * Computes Riemann Sum for all 5 methods and returns detailed partition slice geometries
 */
export function computeRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod
): RiemannSumResult {
  const safeN = Math.max(1, Math.min(n, 120));
  const dx = (b - a) / safeN;
  const slices: RiemannPartitionSlice[] = [];
  let approxArea = 0;

  const exactArea = computeExactIntegral(fn, a, b);

  for (let i = 0; i < safeN; i++) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const yLeft = fn(xLeft);
    const yRight = fn(xRight);

    let xSample = xLeft;
    let height = yLeft;
    let sliceArea = 0;

    switch (method) {
      case "left":
        xSample = xLeft;
        height = yLeft;
        sliceArea = height * dx;
        break;

      case "right":
        xSample = xRight;
        height = yRight;
        sliceArea = height * dx;
        break;

      case "midpoint":
        xSample = (xLeft + xRight) / 2;
        height = fn(xSample);
        sliceArea = height * dx;
        break;

      case "trapezoid":
        xSample = (xLeft + xRight) / 2;
        height = (yLeft + yRight) / 2;
        sliceArea = ((yLeft + yRight) / 2) * dx;
        break;

      case "simpson":
        const xMid = (xLeft + xRight) / 2;
        const yMid = fn(xMid);
        height = (yLeft + 4 * yMid + yRight) / 6;
        sliceArea = (dx / 6) * (yLeft + 4 * yMid + yRight);
        break;
    }

    if (!isNaN(sliceArea) && isFinite(sliceArea)) {
      approxArea += sliceArea;
    }

    slices.push({
      xLeft,
      xRight,
      xSample,
      height: isNaN(height) || !isFinite(height) ? 0 : height,
      yLeft: isNaN(yLeft) || !isFinite(yLeft) ? 0 : yLeft,
      yRight: isNaN(yRight) || !isFinite(yRight) ? 0 : yRight,
      area: sliceArea,
    });
  }

  const error = Math.abs(exactArea - approxArea);
  const percentError =
    Math.abs(exactArea) > 1e-4 ? (error / Math.abs(exactArea)) * 100 : 0;

  return {
    method,
    partitions: safeN,
    approxArea,
    exactArea,
    error,
    percentError,
    slices,
  };
}

/**
 * Finds critical points: roots of f'(x) = 0 and inflection points f''(x) = 0
 */
export function findCalculusLandmarks(
  fn: (x: number) => number,
  dfn: (x: number) => number,
  d2fn: (x: number) => number,
  xMin: number = -5,
  xMax: number = 5
): CalculusCriticalPoint[] {
  const points: CalculusCriticalPoint[] = [];
  const steps = 240;
  const dx = (xMax - xMin) / steps;

  for (let i = 0; i < steps; i++) {
    const x1 = xMin + i * dx;
    const x2 = x1 + dx;
    const d1 = dfn(x1);
    const d2 = dfn(x2);

    if (d1 * d2 <= 0 && isFinite(d1) && isFinite(d2)) {
      let left = x1;
      let right = x2;
      for (let iter = 0; iter < 12; iter++) {
        const mid = (left + right) / 2;
        const dMid = dfn(mid);
        if (d1 * dMid <= 0) right = mid;
        else left = mid;
      }
      const critX = (left + right) / 2;
      const critY = fn(critX);
      const secondD = d2fn(critX);

      const isDup = points.some((p) => Math.abs(p.x - critX) < 0.15);
      if (!isDup && isFinite(critY)) {
        let type: "local_min" | "local_max" | "saddle" = "local_min";
        if (secondD > 0.01) type = "local_min";
        else if (secondD < -0.01) type = "local_max";
        else type = "saddle";

        points.push({
          x: critX,
          y: critY,
          firstDerivative: 0,
          secondDerivative: secondD,
          type,
          formatted: `(${critX.toFixed(2)}, ${critY.toFixed(2)})`,
        });
      }
    }
  }

  return points.sort((a, b) => a.x - b.x);
}
