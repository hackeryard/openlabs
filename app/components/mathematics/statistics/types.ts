export type StatisticsTabId = "galton" | "clt" | "distributions" | "regression";

export type ParentDistributionType = "uniform" | "exponential" | "bimodal" | "dice";

export type DistributionType = "normal" | "binomial" | "poisson" | "uniform";

export interface DataPoint2D {
  id: string;
  x: number;
  y: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r: number;
  rSquared: number;
  mse: number;
  equation: string;
  points: DataPoint2D[];
}

export interface GaltonBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  currentRow: number;
  currentCol: number;
  binIndex: number;
  settled: boolean;
}

export interface DistributionParams {
  type: DistributionType;
  mu: number;
  sigma: number;
  n: number;
  p: number;
  lambda: number;
  a: number;
  b: number;
  lowerBound: number;
  upperBound: number;
}

export interface CLTState {
  parentType: ParentDistributionType;
  sampleSize: number; // n
  numTrials: number; // M
  samples: number[]; // Array of sample means
  parentMean: number;
  parentStdDev: number;
  sampleMean: number;
  sampleStdDev: number;
}

export interface StatisticsLabState {
  activeTab: StatisticsTabId;
  // Galton Board State
  galtonRows: number;
  galtonBiasP: number;
  galtonDropSpeed: "slow" | "medium" | "fast";
  totalBallsDropped: number;
  // CLT State
  clt: CLTState;
  // Distribution Explorer State
  distParams: DistributionParams;
  // Regression State
  regressionPoints: DataPoint2D[];
}
