import { evaluateAt, TransformParams, DEFAULT_TRANSFORM } from "./evaluator";

export interface RootPoint {
  x: number;
  y: number; // Approximately 0
  formatted: string;
}

export interface ExtremaPoint {
  x: number;
  y: number;
  type: "minimum" | "maximum";
  formatted: string;
}

export interface TangentInfo {
  x: number;
  y: number;
  slope: number;
  angleDegrees: number;
  equation: string;
  isDefined: boolean;
}

export interface IntegralResult {
  a: number;
  b: number;
  value: number;
  isDefined: boolean;
  formatted: string;
  error?: string;
}

export interface FunctionAnalysis {
  roots: RootPoint[];
  yIntercept: { x: number; y: number; formatted: string } | null;
  extrema: ExtremaPoint[];
}

/**
 * Computes numerical derivative f'(x) using symmetric difference quotient
 */
export function numericalDerivative(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  x: number,
  transform: TransformParams = DEFAULT_TRANSFORM,
  h: number = 1e-5
): number {
  if (!compiled) return NaN;
  const yPlus = evaluateAt(compiled, x + h, transform);
  const yMinus = evaluateAt(compiled, x - h, transform);

  if (isNaN(yPlus) || isNaN(yMinus)) return NaN;
  return (yPlus - yMinus) / (2 * h);
}

/**
 * Finds real roots (x-intercepts) within the domain [xMin, xMax]
 */
export function findRoots(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  xMin: number,
  xMax: number,
  transform: TransformParams = DEFAULT_TRANSFORM,
  divisions: number = 400
): RootPoint[] {
  if (!compiled || xMin >= xMax) return [];

  const roots: RootPoint[] = [];
  const dx = (xMax - xMin) / divisions;

  let x1 = xMin;
  let y1 = evaluateAt(compiled, x1, transform);

  for (let i = 0; i < divisions; i++) {
    const x2 = xMin + (i + 1) * dx;
    const y2 = evaluateAt(compiled, x2, transform);

    if (!isNaN(y1) && !isNaN(y2)) {
      // Check for exact root at x1
      if (Math.abs(y1) < 1e-9) {
        addUniqueRoot(roots, x1, 0);
      }
      // Check for sign change without asymptotic discontinuity jump
      else if (y1 * y2 < 0 && Math.abs(y2 - y1) < 50) {
        const rootX = bisectionRoot(compiled, x1, x2, transform);
        if (rootX !== null) {
          const rootY = evaluateAt(compiled, rootX, transform);
          addUniqueRoot(roots, rootX, Math.abs(rootY) < 1e-4 ? 0 : rootY);
        }
      }
    }

    x1 = x2;
    y1 = y2;
  }

  // Also check end point xMax
  if (!isNaN(y1) && Math.abs(y1) < 1e-9) {
    addUniqueRoot(roots, xMax, 0);
  }

  return roots.sort((a, b) => a.x - b.x);
}

function bisectionRoot(
  compiled: { evaluate: (scope: Record<string, any>) => any },
  a: number,
  b: number,
  transform: TransformParams,
  maxIterations: number = 30,
  tolerance: number = 1e-7
): number | null {
  let low = a;
  let high = b;
  let yLow = evaluateAt(compiled, low, transform);

  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2;
    const yMid = evaluateAt(compiled, mid, transform);

    if (isNaN(yMid)) return null;

    if (Math.abs(yMid) < tolerance || (high - low) / 2 < tolerance) {
      return mid;
    }

    if (yLow * yMid < 0) {
      high = mid;
    } else {
      low = mid;
      yLow = yMid;
    }
  }

  return (low + high) / 2;
}

function addUniqueRoot(roots: RootPoint[], x: number, y: number) {
  // Avoid duplicate roots clustered within epsilon
  const exists = roots.some((r) => Math.abs(r.x - x) < 1e-3);
  if (!exists) {
    const roundedX = Number(x.toFixed(4));
    const roundedY = Number(y.toFixed(4));
    roots.push({
      x: roundedX,
      y: roundedY,
      formatted: `(${roundedX}, ${roundedY})`,
    });
  }
}

/**
 * Finds the y-intercept (evaluation at x = 0)
 */
export function findYIntercept(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  transform: TransformParams = DEFAULT_TRANSFORM
): { x: number; y: number; formatted: string } | null {
  if (!compiled) return null;
  const y = evaluateAt(compiled, 0, transform);
  if (isNaN(y)) return null;

  const roundedY = Number(y.toFixed(4));
  return {
    x: 0,
    y: roundedY,
    formatted: `(0, ${roundedY})`,
  };
}

/**
 * Finds local extrema (minima & maxima) within the domain [xMin, xMax]
 */
export function findExtrema(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  xMin: number,
  xMax: number,
  transform: TransformParams = DEFAULT_TRANSFORM,
  divisions: number = 300
): ExtremaPoint[] {
  if (!compiled || xMin >= xMax) return [];

  const extrema: ExtremaPoint[] = [];
  const dx = (xMax - xMin) / divisions;

  let x1 = xMin;
  let d1 = numericalDerivative(compiled, x1, transform);

  for (let i = 0; i < divisions; i++) {
    const x2 = xMin + (i + 1) * dx;
    const d2 = numericalDerivative(compiled, x2, transform);

    if (!isNaN(d1) && !isNaN(d2)) {
      // Sign change in derivative indicates a stationary/turning point
      if (d1 * d2 < 0 && Math.abs(d2 - d1) < 100) {
        // Refine stationary point via bisection on derivative
        let low = x1;
        let high = x2;
        let stationaryX = (low + high) / 2;

        for (let iter = 0; iter < 24; iter++) {
          const mid = (low + high) / 2;
          const dMid = numericalDerivative(compiled, mid, transform);
          if (isNaN(dMid) || Math.abs(dMid) < 1e-6) {
            stationaryX = mid;
            break;
          }
          if (d1 * dMid < 0) {
            high = mid;
          } else {
            low = mid;
          }
          stationaryX = mid;
        }

        const yVal = evaluateAt(compiled, stationaryX, transform);
        if (!isNaN(yVal)) {
          const type: "minimum" | "maximum" = d1 > 0 ? "maximum" : "minimum";
          const exists = extrema.some((e) => Math.abs(e.x - stationaryX) < 1e-3);
          if (!exists) {
            const rx = Number(stationaryX.toFixed(4));
            const ry = Number(yVal.toFixed(4));
            extrema.push({
              x: rx,
              y: ry,
              type,
              formatted: `${type === "maximum" ? "Max" : "Min"}: (${rx}, ${ry})`,
            });
          }
        }
      }
    }

    x1 = x2;
    d1 = d2;
  }

  return extrema.sort((a, b) => a.x - b.x);
}

/**
 * Computes tangent line parameters at point x0
 */
export function getTangentInfo(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  x0: number,
  transform: TransformParams = DEFAULT_TRANSFORM
): TangentInfo {
  if (!compiled) {
    return { x: x0, y: NaN, slope: NaN, angleDegrees: NaN, equation: "", isDefined: false };
  }

  const y0 = evaluateAt(compiled, x0, transform);
  const slope = numericalDerivative(compiled, x0, transform);

  if (isNaN(y0) || isNaN(slope)) {
    return { x: x0, y: NaN, slope: NaN, angleDegrees: NaN, equation: "Undefined at this point", isDefined: false };
  }

  const angleRad = Math.atan(slope);
  const angleDeg = Number(((angleRad * 180) / Math.PI).toFixed(2));
  const roundedM = Number(slope.toFixed(4));
  const intercept = Number((y0 - slope * x0).toFixed(4));

  let equation = `y = ${roundedM}x`;
  if (intercept > 0) equation += ` + ${intercept}`;
  else if (intercept < 0) equation += ` - ${Math.abs(intercept)}`;

  return {
    x: Number(x0.toFixed(4)),
    y: Number(y0.toFixed(4)),
    slope: roundedM,
    angleDegrees: angleDeg,
    equation,
    isDefined: true,
  };
}

/**
 * Numerical integration using composite Simpson's 1/3 rule
 */
export function computeDefiniteIntegral(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  a: number,
  b: number,
  transform: TransformParams = DEFAULT_TRANSFORM,
  n: number = 400
): IntegralResult {
  if (!compiled) {
    return { a, b, value: NaN, isDefined: false, formatted: "N/A", error: "No compiled function" };
  }

  if (a === b) {
    return { a, b, value: 0, isDefined: true, formatted: "0.0000" };
  }

  // If bounds are reversed
  const isReversed = a > b;
  const lower = isReversed ? b : a;
  const upper = isReversed ? a : b;

  // Simpson's rule requires even number of intervals
  const intervals = n % 2 === 0 ? n : n + 1;
  const h = (upper - lower) / intervals;

  const y0 = evaluateAt(compiled, lower, transform);
  const yn = evaluateAt(compiled, upper, transform);

  if (isNaN(y0) || isNaN(yn)) {
    return { a, b, value: NaN, isDefined: false, formatted: "Undefined", error: "Function is undefined at integral bounds" };
  }

  let sum = y0 + yn;

  for (let i = 1; i < intervals; i++) {
    const x = lower + i * h;
    const y = evaluateAt(compiled, x, transform);
    if (isNaN(y)) {
      return { a, b, value: NaN, isDefined: false, formatted: "Undefined", error: `Discontinuity / undefined point at x = ${x.toFixed(3)}` };
    }
    sum += (i % 2 === 1 ? 4 : 2) * y;
  }

  let result = (h / 3) * sum;
  if (isReversed) {
    result = -result;
  }

  const rounded = Number(result.toFixed(4));
  return {
    a,
    b,
    value: rounded,
    isDefined: true,
    formatted: `${rounded.toFixed(4)}`,
  };
}

/**
 * Comprehensive analysis of a function
 */
export function analyzeFunction(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  xMin: number,
  xMax: number,
  transform: TransformParams = DEFAULT_TRANSFORM
): FunctionAnalysis {
  return {
    roots: findRoots(compiled, xMin, xMax, transform),
    yIntercept: findYIntercept(compiled, transform),
    extrema: findExtrema(compiled, xMin, xMax, transform),
  };
}
