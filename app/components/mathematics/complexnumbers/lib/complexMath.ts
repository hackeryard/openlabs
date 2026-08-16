import {
  ComplexNumber,
  PolarComplex,
  FractalPreset,
  ColorPaletteId,
  FractalType,
} from "../types";

/**
 * Converts Cartesian (re, im) to Polar (r, theta)
 */
export function toPolar(z: ComplexNumber): PolarComplex {
  const r = Math.hypot(z.re, z.im);
  const theta = Math.atan2(z.im, z.re);
  return { r, theta };
}

/**
 * Converts Polar (r, theta) to Cartesian (re, im)
 */
export function toCartesian(p: PolarComplex): ComplexNumber {
  return {
    re: Number((p.r * Math.cos(p.theta)).toFixed(4)),
    im: Number((p.r * Math.sin(p.theta)).toFixed(4)),
  };
}

/**
 * Complex Addition: z1 + z2
 */
export function addComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexNumber {
  return {
    re: Number((z1.re + z2.re).toFixed(4)),
    im: Number((z1.im + z2.im).toFixed(4)),
  };
}

/**
 * Complex Subtraction: z1 - z2
 */
export function subtractComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexNumber {
  return {
    re: Number((z1.re - z2.re).toFixed(4)),
    im: Number((z1.im - z2.im).toFixed(4)),
  };
}

/**
 * Complex Multiplication: z1 * z2
 */
export function multiplyComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexNumber {
  return {
    re: Number((z1.re * z2.re - z1.im * z2.im).toFixed(4)),
    im: Number((z1.re * z2.im + z1.im * z2.re).toFixed(4)),
  };
}

/**
 * Complex Division: z1 / z2
 */
export function divideComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexNumber | null {
  const denom = z2.re * z2.re + z2.im * z2.im;
  if (denom < 1e-8) return null;

  return {
    re: Number(((z1.re * z2.re + z1.im * z2.im) / denom).toFixed(4)),
    im: Number(((z1.im * z2.re - z1.re * z2.im) / denom).toFixed(4)),
  };
}

/**
 * Complex Principal Square Root: sqrt(z) = sqrt(r) * e^(i * theta / 2)
 */
export function sqrtComplex(z: ComplexNumber): ComplexNumber {
  const p = toPolar(z);
  const sqrtR = Math.sqrt(p.r);
  return {
    re: Number((sqrtR * Math.cos(p.theta / 2)).toFixed(4)),
    im: Number((sqrtR * Math.sin(p.theta / 2)).toFixed(4)),
  };
}

/**
 * Complex Principal Logarithm: Ln(z) = ln|z| + i * Arg(z)
 */
export function logComplex(z: ComplexNumber): ComplexNumber | null {
  const p = toPolar(z);
  if (p.r < 1e-8) return null;
  return {
    re: Number(Math.log(p.r).toFixed(4)),
    im: Number(p.theta.toFixed(4)),
  };
}

/**
 * Complex Linear Combination: alpha * z1 + beta * z2
 */
export function linearCombination(
  z1: ComplexNumber,
  z2: ComplexNumber,
  alpha: number,
  beta: number
): ComplexNumber {
  return {
    re: Number((alpha * z1.re + beta * z2.re).toFixed(4)),
    im: Number((alpha * z1.im + beta * z2.im).toFixed(4)),
  };
}

/**
 * Complex Conjugate: z* = a - bi
 */
export function conjugateComplex(z: ComplexNumber): ComplexNumber {
  return { re: z.re, im: -z.im };
}

/**
 * Complex Integer Power: z^n = r^n * e^(i * n * theta)
 */
export function powerComplex(z: ComplexNumber, n: number): ComplexNumber {
  const polar = toPolar(z);
  const rN = Math.pow(polar.r, n);
  const thetaN = polar.theta * n;
  return {
    re: Number((rN * Math.cos(thetaN)).toFixed(4)),
    im: Number((rN * Math.sin(thetaN)).toFixed(4)),
  };
}

/**
 * Generates all n-th roots of an arbitrary complex target W: z^n = W
 */
export function computeGeneralRoots(targetW: ComplexNumber, n: number): ComplexNumber[] {
  if (n < 1) return [];
  const polarW = toPolar(targetW);
  const rootR = Math.pow(polarW.r, 1 / n);

  const roots: ComplexNumber[] = [];
  for (let k = 0; k < n; k++) {
    const angle = (polarW.theta + 2 * Math.PI * k) / n;
    roots.push({
      re: Number((rootR * Math.cos(angle)).toFixed(4)),
      im: Number((rootR * Math.sin(angle)).toFixed(4)),
    });
  }
  return roots;
}

/**
 * Computes partial sums of the Taylor series for r * exp(i * theta)
 */
export function computeEulerTaylorSeries(
  radius: number,
  thetaRad: number,
  maxTerms: number
): { points: ComplexNumber[]; sum: ComplexNumber } {
  const partialSums: ComplexNumber[] = [{ re: 0, im: 0 }];
  let currentSum: ComplexNumber = { re: 1, im: 0 }; // k = 0: 1
  let term: ComplexNumber = { re: 1, im: 0 };

  partialSums.push({ re: radius, im: 0 });

  for (let k = 1; k <= maxTerms; k++) {
    const factor = thetaRad / k;
    const nextTerm: ComplexNumber = {
      re: -term.im * factor,
      im: term.re * factor,
    };
    term = nextTerm;

    currentSum = {
      re: currentSum.re + term.re,
      im: currentSum.im + term.im,
    };

    partialSums.push({
      re: currentSum.re * radius,
      im: currentSum.im * radius,
    });
  }

  return {
    points: partialSums,
    sum: { re: currentSum.re * radius, im: currentSum.im * radius },
  };
}

/**
 * Escape time computation for generalized fractals (Mandelbrot, Julia, Multibrot 3, Burning Ship)
 */
export function computeFractalEscape(
  cr: number,
  ci: number,
  fractalType: FractalType,
  maxIter: number,
  juliaC?: ComplexNumber
): { escaped: boolean; iter: number; smoothIter: number } {
  let zr = fractalType === "julia" ? cr : 0;
  let zi = fractalType === "julia" ? ci : 0;
  const cReal = fractalType === "julia" && juliaC ? juliaC.re : cr;
  const cImag = fractalType === "julia" && juliaC ? juliaC.im : ci;

  let iter = 0;

  if (fractalType === "burningship") {
    // z_{n+1} = (|Re(z)| + i |Im(z)|)^2 + c
    while (zr * zr + zi * zi <= 4 && iter < maxIter) {
      const absR = Math.abs(zr);
      const absI = Math.abs(zi);
      zi = 2 * absR * absI + cImag;
      zr = absR * absR - absI * absI + cReal;
      iter++;
    }
  } else if (fractalType === "multibrot3") {
    // z_{n+1} = z^3 + c
    while (zr * zr + zi * zi <= 4 && iter < maxIter) {
      const zr2 = zr * zr;
      const zi2 = zi * zi;
      const nextR = zr * (zr2 - 3 * zi2) + cReal;
      const nextI = zi * (3 * zr2 - zi2) + cImag;
      zr = nextR;
      zi = nextI;
      iter++;
    }
  } else {
    // Standard quadratic Mandelbrot / Julia (z^2 + c)
    let zr2 = zr * zr;
    let zi2 = zi * zi;
    while (zr2 + zi2 <= 4 && iter < maxIter) {
      zi = 2 * zr * zi + cImag;
      zr = zr2 - zi2 + cReal;
      zr2 = zr * zr;
      zi2 = zi * zi;
      iter++;
    }
  }

  if (iter >= maxIter) {
    return { escaped: false, iter: maxIter, smoothIter: maxIter };
  }

  const mag2 = zr * zr + zi * zi;
  const logZn = Math.log(Math.max(1e-8, mag2)) / 2;
  const nu = Math.log(Math.max(1e-8, logZn / Math.LN2)) / Math.LN2;
  const smoothIter = iter + 1 - nu;

  return { escaped: true, iter, smoothIter: Math.max(0, smoothIter) };
}

/**
 * Computes iterative orbit points trajectory z_0 -> z_1 -> z_2 -> ... for inspection
 */
export function computeOrbitTrajectory(
  cr: number,
  ci: number,
  fractalType: FractalType,
  maxSteps = 40,
  juliaC?: ComplexNumber
): ComplexNumber[] {
  const orbit: ComplexNumber[] = [];
  let zr = fractalType === "julia" ? cr : 0;
  let zi = fractalType === "julia" ? ci : 0;
  const cReal = fractalType === "julia" && juliaC ? juliaC.re : cr;
  const cImag = fractalType === "julia" && juliaC ? juliaC.im : ci;

  orbit.push({ re: zr, im: zi });

  for (let i = 0; i < maxSteps; i++) {
    if (fractalType === "burningship") {
      const absR = Math.abs(zr);
      const absI = Math.abs(zi);
      zi = 2 * absR * absI + cImag;
      zr = absR * absR - absI * absI + cReal;
    } else if (fractalType === "multibrot3") {
      const zr2 = zr * zr;
      const zi2 = zi * zi;
      const nextR = zr * (zr2 - 3 * zi2) + cReal;
      const nextI = zi * (3 * zr2 - zi2) + cImag;
      zr = nextR;
      zi = nextI;
    } else {
      const nextI = 2 * zr * zi + cImag;
      zr = zr * zr - zi * zi + cReal;
      zi = nextI;
    }

    orbit.push({ re: zr, im: zi });
    if (zr * zr + zi * zi > 100) break; // escaped
  }

  return orbit;
}

/**
 * Color mapper for smooth fractal rendering
 */
export function getFractalColor(
  smoothIter: number,
  maxIter: number,
  palette: ColorPaletteId
): [number, number, number] {
  if (smoothIter >= maxIter) {
    return [6, 8, 16]; // Deep interior navy
  }

  const t = (smoothIter % 32) / 32;

  switch (palette) {
    case "cosmic": {
      const r = Math.floor(Math.sin(t * Math.PI * 2) * 127 + 128);
      const g = Math.floor(Math.sin((t + 0.33) * Math.PI * 2) * 80 + 90);
      const b = Math.floor(Math.sin((t + 0.66) * Math.PI * 2) * 127 + 128);
      return [r, g, b];
    }
    case "fire": {
      const r = Math.min(255, Math.floor(t * 3 * 255));
      const g = Math.min(255, Math.floor(Math.max(0, t * 3 - 1) * 255));
      const b = Math.min(255, Math.floor(Math.max(0, t * 3 - 2) * 255));
      return [r, g, b];
    }
    case "emerald": {
      const r = Math.floor(Math.sin(t * Math.PI * 2) * 60 + 70);
      const g = Math.floor(Math.sin(t * Math.PI * 2) * 110 + 140);
      const b = Math.floor(Math.sin((t + 0.5) * Math.PI * 2) * 100 + 150);
      return [r, g, b];
    }
    case "electric": {
      const r = Math.floor(Math.sin((t + 0.2) * Math.PI * 2) * 110 + 140);
      const g = Math.floor(Math.sin(t * Math.PI * 2) * 70 + 80);
      const b = Math.floor(Math.sin((t + 0.7) * Math.PI * 2) * 120 + 135);
      return [r, g, b];
    }
    case "rainbow": {
      const h = t * 360;
      const s = 0.9;
      const l = 0.55;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (h < 60) { r = c; g = x; }
      else if (h < 120) { r = x; g = c; }
      else if (h < 180) { g = c; b = x; }
      else if (h < 240) { g = x; b = c; }
      else if (h < 300) { r = x; b = c; }
      else { r = c; b = x; }
      return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)];
    }
    case "monochrome": {
      const v = Math.floor((Math.sin(t * Math.PI * 2) * 0.5 + 0.5) * 255);
      return [v, v, v];
    }
  }
}

export const FRACTAL_PRESETS: FractalPreset[] = [
  {
    name: "Mandelbrot Full View",
    fractalType: "mandelbrot",
    centerX: -0.6,
    centerY: 0,
    zoom: 1,
    maxIterations: 120,
  },
  {
    name: "Seahorse Valley",
    fractalType: "mandelbrot",
    centerX: -0.7436438870371587,
    centerY: 0.1318259042053119,
    zoom: 90,
    maxIterations: 240,
  },
  {
    name: "Elephant Valley",
    fractalType: "mandelbrot",
    centerX: 0.275,
    centerY: 0.006,
    zoom: 40,
    maxIterations: 180,
  },
  {
    name: "Burning Ship Center",
    fractalType: "burningship",
    centerX: -0.45,
    centerY: -0.5,
    zoom: 1.2,
    maxIterations: 140,
  },
  {
    name: "Triple Spiral Julia",
    fractalType: "julia",
    centerX: 0,
    centerY: 0,
    zoom: 1.2,
    maxIterations: 150,
    juliaC: { re: -0.8, im: 0.156 },
  },
  {
    name: "Dendrite Julia Tree",
    fractalType: "julia",
    centerX: 0,
    centerY: 0,
    zoom: 1.2,
    maxIterations: 150,
    juliaC: { re: 0, im: 0.8 },
  },
  {
    name: "Multibrot Degree 3",
    fractalType: "multibrot3",
    centerX: 0,
    centerY: 0,
    zoom: 1.1,
    maxIterations: 140,
  },
];
