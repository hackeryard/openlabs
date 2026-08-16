import {
  QuadraticParams,
  QuadraticRoots,
  ParabolaLandmarks,
  CriticalPoint,
  SyntheticDivisionResult,
} from "../types";

/**
 * Derives full quadratic roots, discriminant, and algebraic formatting
 */
export function calculateQuadraticRoots(a: number, b: number, c: number): QuadraticRoots {
  if (Math.abs(a) < 1e-6) {
    // Linear edge case: bx + c = 0 -> x = -c/b
    const root = Math.abs(b) > 1e-6 ? -c / b : 0;
    return {
      type: "one_real",
      discriminant: 0,
      r1Real: root,
      r1Imag: 0,
      r2Real: root,
      r2Imag: 0,
      r1Formatted: `${root.toFixed(3)}`,
      r2Formatted: `${root.toFixed(3)}`,
    };
  }

  const disc = b * b - 4 * a * c;
  const twoA = 2 * a;

  if (disc > 1e-6) {
    // Two distinct real roots
    const sqrtDisc = Math.sqrt(disc);
    const r1 = (-b + sqrtDisc) / twoA;
    const r2 = (-b - sqrtDisc) / twoA;

    return {
      type: "two_real",
      discriminant: disc,
      r1Real: r1,
      r1Imag: 0,
      r2Real: r2,
      r2Imag: 0,
      r1Formatted: `${r1.toFixed(3)}`,
      r2Formatted: `${r2.toFixed(3)}`,
    };
  } else if (Math.abs(disc) <= 1e-6) {
    // Single repeated real root
    const r = -b / twoA;
    return {
      type: "one_real",
      discriminant: 0,
      r1Real: r,
      r1Imag: 0,
      r2Real: r,
      r2Imag: 0,
      r1Formatted: `${r.toFixed(3)}`,
      r2Formatted: `${r.toFixed(3)}`,
    };
  } else {
    // Two complex conjugate roots
    const realPart = -b / twoA;
    const imagPart = Math.sqrt(-disc) / Math.abs(twoA);

    return {
      type: "two_complex",
      discriminant: disc,
      r1Real: realPart,
      r1Imag: imagPart,
      r2Real: realPart,
      r2Imag: -imagPart,
      r1Formatted: `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`,
      r2Formatted: `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`,
    };
  }
}

/**
 * Calculates vertex, axis of symmetry, focus, and directrix
 */
export function calculateParabolaLandmarks(a: number, b: number, c: number): ParabolaLandmarks {
  const safeA = Math.abs(a) < 1e-6 ? 0.001 : a;
  const h = -b / (2 * safeA);
  const k = c - (b * b) / (4 * safeA);
  const p = 1 / (4 * safeA); // Focal length

  return {
    vertex: { x: h, y: k },
    axisOfSymmetry: h,
    yIntercept: { x: 0, y: c },
    focus: { x: h, y: k + p },
    directrix: k - p,
    focalLength: p,
    opensUpward: safeA > 0,
  };
}

/**
 * Formats quadratic standard equation string: y = ax^2 + bx + c
 */
export function formatQuadraticStandard(a: number, b: number, c: number): string {
  const parts: string[] = [];

  // x^2 term
  if (a === 1) parts.push("x²");
  else if (a === -1) parts.push("-x²");
  else if (a !== 0) parts.push(`${a}x²`);

  // x term
  if (b === 1) parts.push(parts.length > 0 ? "+ x" : "x");
  else if (b === -1) parts.push("- x");
  else if (b > 0) parts.push(parts.length > 0 ? `+ ${b}x` : `${b}x`);
  else if (b < 0) parts.push(`- ${Math.abs(b)}x`);

  // Constant term
  if (c > 0) parts.push(parts.length > 0 ? `+ ${c}` : `${c}`);
  else if (c < 0) parts.push(`- ${Math.abs(c)}`);
  else if (parts.length === 0) parts.push("0");

  return `y = ${parts.join(" ")}`;
}

/**
 * Formats quadratic vertex form: y = a(x - h)^2 + k
 */
export function formatQuadraticVertex(a: number, h: number, k: number): string {
  let aStr = "";
  if (a === -1) aStr = "-";
  else if (a !== 1) aStr = `${a}`;

  let hStr = "x";
  if (h > 0) hStr = `(x - ${h})`;
  else if (h < 0) hStr = `(x + ${Math.abs(h)})`;
  else hStr = "x";

  let kStr = "";
  if (k > 0) kStr = ` + ${k}`;
  else if (k < 0) kStr = ` - ${Math.abs(k)}`;

  return `y = ${aStr}${hStr === "x" ? "x²" : `${hStr}²`}${kStr}`;
}

/**
 * Evaluates polynomial P(x) = sum(coeffs[i] * x^(n - i)) using Horner's rule
 * coeffs order: [a_n, a_{n-1}, ..., a_1, a_0]
 */
export function evaluatePolynomial(coeffs: number[], x: number): number {
  let result = 0;
  for (let i = 0; i < coeffs.length; i++) {
    result = result * x + coeffs[i];
  }
  return result;
}

/**
 * Computes first derivative polynomial coefficients P'(x)
 */
export function derivativeCoeffs(coeffs: number[]): number[] {
  const n = coeffs.length - 1;
  if (n <= 0) return [0];
  const dCoeffs: number[] = [];
  for (let i = 0; i < n; i++) {
    dCoeffs.push(coeffs[i] * (n - i));
  }
  return dCoeffs;
}

/**
 * Formats arbitrary degree polynomial to mathematical string
 */
export function formatPolynomial(coeffs: number[]): string {
  const n = coeffs.length - 1;
  const parts: string[] = [];

  for (let i = 0; i <= n; i++) {
    const power = n - i;
    const c = coeffs[i];
    if (c === 0 && parts.length > 0 && i < n) continue;
    if (c === 0 && parts.length === 0 && i === n) return "y = 0";
    if (c === 0) continue;

    let sign = c > 0 ? (parts.length > 0 ? "+ " : "") : "- ";
    let absC = Math.abs(c);
    let coeffStr = absC === 1 && power > 0 ? "" : `${absC}`;

    let term = "";
    if (power === 0) term = `${absC}`;
    else if (power === 1) term = `${coeffStr}x`;
    else {
      const supMap: Record<string, string> = { "2": "²", "3": "³", "4": "⁴", "5": "⁵" };
      term = `${coeffStr}x${supMap[String(power)] || `^${power}`}`;
    }

    parts.push(`${sign}${term}`);
  }

  return parts.length > 0 ? `y = ${parts.join(" ")}` : "y = 0";
}

/**
 * Finds local extrema and inflection points numerically for polynomials up to degree 5
 */
export function findPolynomialLandmarks(
  coeffs: number[],
  xMin: number = -10,
  xMax: number = 10
): CriticalPoint[] {
  const points: CriticalPoint[] = [];
  const d1 = derivativeCoeffs(coeffs);
  const d2 = derivativeCoeffs(d1);

  const steps = 300;
  const dx = (xMax - xMin) / steps;

  // Extrema: roots of P'(x) = 0
  for (let i = 0; i < steps; i++) {
    const x1 = xMin + i * dx;
    const x2 = x1 + dx;
    const y1 = evaluatePolynomial(d1, x1);
    const y2 = evaluatePolynomial(d1, x2);

    if (y1 * y2 <= 0) {
      // Bisection root refinement
      let left = x1;
      let right = x2;
      for (let iter = 0; iter < 12; iter++) {
        const mid = (left + right) / 2;
        const yMid = evaluatePolynomial(d1, mid);
        if (y1 * yMid <= 0) right = mid;
        else left = mid;
      }
      const rootX = (left + right) / 2;
      const rootY = evaluatePolynomial(coeffs, rootX);
      const secondDeriv = evaluatePolynomial(d2, rootX);

      // Check if duplicate point
      const isDuplicate = points.some((p) => Math.abs(p.x - rootX) < 0.1);
      if (!isDuplicate) {
        points.push({
          x: rootX,
          y: rootY,
          type: secondDeriv > 0 ? "local_min" : secondDeriv < 0 ? "local_max" : "inflection",
          formatted: `(${rootX.toFixed(2)}, ${rootY.toFixed(2)})`,
        });
      }
    }
  }

  // Inflection points: roots of P''(x) = 0
  if (d2.length > 1) {
    for (let i = 0; i < steps; i++) {
      const x1 = xMin + i * dx;
      const x2 = x1 + dx;
      const y1 = evaluatePolynomial(d2, x1);
      const y2 = evaluatePolynomial(d2, x2);

      if (y1 * y2 <= 0) {
        let left = x1;
        let right = x2;
        for (let iter = 0; iter < 12; iter++) {
          const mid = (left + right) / 2;
          const yMid = evaluatePolynomial(d2, mid);
          if (y1 * yMid <= 0) right = mid;
          else left = mid;
        }
        const infX = (left + right) / 2;
        const infY = evaluatePolynomial(coeffs, infX);

        const isDuplicate = points.some((p) => Math.abs(p.x - infX) < 0.1);
        if (!isDuplicate) {
          points.push({
            x: infX,
            y: infY,
            type: "inflection",
            formatted: `(${infX.toFixed(2)}, ${infY.toFixed(2)})`,
          });
        }
      }
    }
  }

  return points.sort((a, b) => a.x - b.x);
}

/**
 * Step-by-step Synthetic Division: P(x) / (x - c)
 */
export function computeSyntheticDivision(
  coeffs: number[],
  c: number
): SyntheticDivisionResult {
  const n = coeffs.length;
  if (n === 0) {
    return {
      divisorC: c,
      inputCoeffs: [],
      multiplierRow: [],
      sumRow: [],
      quotientCoeffs: [],
      remainder: 0,
      isFactor: false,
      quotientString: "0",
    };
  }

  const multiplierRow: number[] = [0]; // First position is empty/0
  const sumRow: number[] = [coeffs[0]];

  for (let i = 1; i < n; i++) {
    const mult = sumRow[i - 1] * c;
    multiplierRow.push(mult);
    const sum = coeffs[i] + mult;
    sumRow.push(sum);
  }

  const quotientCoeffs = sumRow.slice(0, n - 1);
  const remainder = sumRow[n - 1];
  const isFactor = Math.abs(remainder) < 1e-5;

  const quotientString = formatPolynomial(quotientCoeffs).replace("y = ", "");

  return {
    divisorC: c,
    inputCoeffs: coeffs,
    multiplierRow,
    sumRow,
    quotientCoeffs,
    remainder,
    isFactor,
    quotientString: quotientString || "0",
  };
}
