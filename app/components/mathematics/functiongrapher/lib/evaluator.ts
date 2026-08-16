export interface Point2D {
  x: number;
  y: number;
}

export interface TransformParams {
  a: number; // Vertical scale / stretch / reflection
  b: number; // Horizontal frequency / compression
  h: number; // Horizontal phase shift: f(b*(x - h))
  k: number; // Vertical shift: + k
}

export const DEFAULT_TRANSFORM: TransformParams = {
  a: 1,
  b: 1,
  h: 0,
  k: 0,
};

export interface SampleOptions {
  xMin: number;
  xMax: number;
  sampleCount?: number;
  transform?: TransformParams;
  yClampMin?: number;
  yClampMax?: number;
}

/**
 * Safely extracts a real numeric value from a mathjs evaluation result
 */
export function extractRealNumber(val: any): number {
  if (val === null || val === undefined) return NaN;

  if (typeof val === "number") {
    return isFinite(val) ? val : NaN;
  }

  if (typeof val === "boolean") {
    return val ? 1 : 0;
  }

  if (typeof val === "object") {
    // Check for mathjs BigNumber or Complex number
    if ("isBigNumber" in val && typeof val.toNumber === "function") {
      const num = val.toNumber();
      return isFinite(num) ? num : NaN;
    }
    if ("isComplex" in val) {
      // If imaginary part is effectively 0, return real part
      if (Math.abs(val.im || 0) < 1e-10) {
        return isFinite(val.re) ? val.re : NaN;
      }
      return NaN; // Reject purely complex numbers
    }
    if ("re" in val && typeof val.re === "number") {
      if (Math.abs(val.im || 0) < 1e-10) {
        return isFinite(val.re) ? val.re : NaN;
      }
      return NaN;
    }
  }

  return NaN;
}

/**
 * Evaluates a compiled function at a single x value with optional transformation:
 * y = a * f(b * (x - h)) + k
 */
export function evaluateAt(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  x: number,
  transform: TransformParams = DEFAULT_TRANSFORM
): number {
  if (!compiled) return NaN;

  const { a, b, h, k } = transform;
  // Compute inner x value for f(b*(x - h))
  const innerX = b * (x - h);

  try {
    const rawVal = compiled.evaluate({ x: innerX, pi: Math.PI, e: Math.E });
    const realVal = extractRealNumber(rawVal);

    if (isNaN(realVal)) return NaN;

    // Apply vertical stretch and vertical shift: a * y + k
    const finalY = a * realVal + k;
    return isFinite(finalY) ? finalY : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Samples a function across the domain [xMin, xMax], segmenting points to prevent
 * erroneous lines across vertical asymptotes or undefined regions.
 */
export function sampleFunction(
  compiled: { evaluate: (scope: Record<string, any>) => any } | null,
  options: SampleOptions
): Point2D[][] {
  if (!compiled) return [];

  const {
    xMin,
    xMax,
    sampleCount = 800,
    transform = DEFAULT_TRANSFORM,
    yClampMin = -1000,
    yClampMax = 1000,
  } = options;

  if (xMin >= xMax || sampleCount <= 1) return [];

  const dx = (xMax - xMin) / (sampleCount - 1);
  const segments: Point2D[][] = [];
  let currentSegment: Point2D[] = [];

  let prevY: number | null = null;
  const maxAllowedJump = Math.max(100, Math.abs(yClampMax - yClampMin) * 2);

  for (let i = 0; i < sampleCount; i++) {
    const x = xMin + i * dx;
    const y = evaluateAt(compiled, x, transform);

    if (isNaN(y) || y < yClampMin || y > yClampMax) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      prevY = null;
      continue;
    }

    // Check for asymptotic sign flip jumps (e.g. tan(x), 1/x)
    if (prevY !== null) {
      const dy = Math.abs(y - prevY);
      const signFlipped = (prevY > 10 && y < -10) || (prevY < -10 && y > 10);

      if (signFlipped && dy > maxAllowedJump) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }

    currentSegment.push({ x, y });
    prevY = y;
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * Returns a human-readable algebraic string of the transformed function
 */
export function getTransformedExpression(
  baseExpr: string,
  transform: TransformParams
): string {
  const { a, b, h, k } = transform;
  if (a === 1 && b === 1 && h === 0 && k === 0) {
    return `f(x) = ${baseExpr}`;
  }

  let inner = "x";
  if (h !== 0) {
    inner = h > 0 ? `(x - ${h})` : `(x + ${Math.abs(h)})`;
  }
  if (b !== 1) {
    if (b === -1) {
      inner = `-${inner}`;
    } else {
      inner = `${b}*${inner}`;
    }
  }

  let outer = `f(${inner})`;
  if (a !== 1) {
    if (a === -1) {
      outer = `-${outer}`;
    } else {
      outer = `${a} · ${outer}`;
    }
  }
  if (k !== 0) {
    outer = k > 0 ? `${outer} + ${k}` : `${outer} - ${Math.abs(k)}`;
  }

  return `g(x) = ${outer}`;
}
