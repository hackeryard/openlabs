import {
  DataPoint2D,
  RegressionResult,
  ParentDistributionType,
  DistributionType,
} from "../types";

/**
 * Log factorial and combinations nCr
 */
export function factorial(n: number): number {
  if (n < 0) return 1;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 1; i <= k; i++) {
    c = (c * (n - (k - i))) / i;
  }
  return c;
}

/**
 * Error function erf(x) using Abramowitz and Stegun 7.1.26 approximation
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Standard Normal CDF: Phi(z) = 0.5 * (1 + erf(z / sqrt(2)))
 */
export function standardNormalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/**
 * Normal PDF
 */
export function normalPDF(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

/**
 * Normal CDF
 */
export function normalCDF(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return x >= mu ? 1 : 0;
  return standardNormalCDF((x - mu) / sigma);
}

/**
 * Binomial PMF: P(X = k) = nCk * p^k * (1-p)^(n-k)
 */
export function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Poisson PMF: P(X = k) = (lambda^k * e^-lambda) / k!
 */
export function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || lambda <= 0) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Uniform PDF
 */
export function uniformPDF(x: number, a: number, b: number): number {
  if (b <= a) return 0;
  return x >= a && x <= b ? 1 / (b - a) : 0;
}

/**
 * Box-Muller transform for standard normal random variables
 */
export function randomGaussian(mean = 0, stdDev = 1): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z0 * stdDev;
}

/**
 * Sample a random variable from a parent population
 */
export function sampleFromParent(type: ParentDistributionType): number {
  switch (type) {
    case "uniform":
      // U(0, 10)
      return Math.random() * 10;

    case "exponential":
      // Exp(lambda = 0.5) -> Mean = 2
      return -Math.log(1 - Math.random()) / 0.5;

    case "bimodal": {
      // 50% from N(2, 0.8^2), 50% from N(8, 0.8^2)
      const chooseFirst = Math.random() < 0.5;
      return chooseFirst ? randomGaussian(2.5, 0.8) : randomGaussian(7.5, 0.8);
    }

    case "dice":
      // 1 to 6
      return Math.floor(Math.random() * 6) + 1;
  }
}

/**
 * Theoretical mean and standard deviation of parent distribution
 */
export function getParentTheoreticalStats(type: ParentDistributionType): {
  mean: number;
  stdDev: number;
} {
  switch (type) {
    case "uniform":
      return { mean: 5.0, stdDev: Math.sqrt(100 / 12) }; // ~2.887
    case "exponential":
      return { mean: 2.0, stdDev: 2.0 };
    case "bimodal":
      return { mean: 5.0, stdDev: Math.sqrt(0.64 + 6.25) }; // ~2.62
    case "dice":
      return { mean: 3.5, stdDev: Math.sqrt(35 / 12) }; // ~1.708
  }
}

/**
 * Generates M sample means of size n from the chosen parent distribution
 */
export function generateCLTSamples(
  type: ParentDistributionType,
  sampleSize: number,
  numTrials: number
): {
  samples: number[];
  sampleMean: number;
  sampleStdDev: number;
} {
  const sampleMeans: number[] = new Array(numTrials);
  let totalSum = 0;

  for (let trial = 0; trial < numTrials; trial++) {
    let sum = 0;
    for (let i = 0; i < sampleSize; i++) {
      sum += sampleFromParent(type);
    }
    const mean = sum / sampleSize;
    sampleMeans[trial] = mean;
    totalSum += mean;
  }

  const sampleMean = totalSum / numTrials;

  // Calculate sample std dev
  let varianceSum = 0;
  for (let i = 0; i < numTrials; i++) {
    const diff = sampleMeans[i] - sampleMean;
    varianceSum += diff * diff;
  }
  const sampleStdDev = Math.sqrt(varianceSum / (numTrials - 1 || 1));

  return {
    samples: sampleMeans,
    sampleMean,
    sampleStdDev,
  };
}

/**
 * Computes Ordinary Least Squares (OLS) Linear Regression for 2D points
 */
export function computeLinearRegression(points: DataPoint2D[]): RegressionResult {
  const n = points.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: 0,
      r: 0,
      rSquared: 0,
      mse: 0,
      equation: "y = 0",
      points,
    };
  }

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let sxx = 0;
  let syy = 0;
  let sxy = 0;

  for (let i = 0; i < n; i++) {
    const dx = points[i].x - meanX;
    const dy = points[i].y - meanY;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }

  if (Math.abs(sxx) < 1e-8) {
    return {
      slope: 0,
      intercept: meanY,
      r: 0,
      rSquared: 0,
      mse: 0,
      equation: `y = ${meanY.toFixed(2)}`,
      points,
    };
  }

  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;

  const denom = Math.sqrt(sxx * syy);
  const r = denom > 1e-8 ? sxy / denom : 0;
  const rSquared = r * r;

  // MSE
  let totalSqError = 0;
  for (let i = 0; i < n; i++) {
    const predictedY = slope * points[i].x + intercept;
    const err = points[i].y - predictedY;
    totalSqError += err * err;
  }
  const mse = totalSqError / n;

  const sign = intercept >= 0 ? "+" : "-";
  const equation = `y = ${slope.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;

  return {
    slope,
    intercept,
    r,
    rSquared,
    mse,
    equation,
    points,
  };
}

export const REGRESSION_PRESETS: { name: string; points: DataPoint2D[] }[] = [
  {
    name: "Strong Positive Correlation",
    points: [
      { id: "1", x: 1, y: 1.5 },
      { id: "2", x: 2, y: 2.8 },
      { id: "3", x: 3, y: 3.2 },
      { id: "4", x: 4, y: 4.6 },
      { id: "5", x: 5, y: 5.1 },
      { id: "6", x: 6, y: 6.7 },
      { id: "7", x: 7, y: 7.3 },
      { id: "8", x: 8, y: 8.9 },
    ],
  },
  {
    name: "Strong Negative Correlation",
    points: [
      { id: "1", x: 1, y: 8.5 },
      { id: "2", x: 2, y: 7.2 },
      { id: "3", x: 3, y: 6.8 },
      { id: "4", x: 4, y: 5.3 },
      { id: "5", x: 5, y: 4.1 },
      { id: "6", x: 6, y: 3.4 },
      { id: "7", x: 7, y: 2.2 },
      { id: "8", x: 8, y: 1.1 },
    ],
  },
  {
    name: "High-Leverage Outlier Test",
    points: [
      { id: "1", x: 1, y: 2.0 },
      { id: "2", x: 2, y: 2.5 },
      { id: "3", x: 3, y: 3.0 },
      { id: "4", x: 4, y: 3.2 },
      { id: "5", x: 5, y: 3.8 },
      { id: "6", x: 8, y: 1.0 }, // Outlier pulling line down
    ],
  },
  {
    name: "Uncorrelated Scatter",
    points: [
      { id: "1", x: 1, y: 5.2 },
      { id: "2", x: 2, y: 2.1 },
      { id: "3", x: 3, y: 7.8 },
      { id: "4", x: 4, y: 3.4 },
      { id: "5", x: 5, y: 6.9 },
      { id: "6", x: 6, y: 2.8 },
      { id: "7", x: 7, y: 7.1 },
      { id: "8", x: 8, y: 4.5 },
    ],
  },
];
