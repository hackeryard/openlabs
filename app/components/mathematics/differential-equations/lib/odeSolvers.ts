import {
  TrajectoryPoint2D,
  TrajectoryPoint3D,
  LinearSystemAnalysis,
  MatrixStabilityType,
  LotkaVolterraParams,
  HarmonicParams,
  LorenzParams,
  SirParams,
} from "../types";

/**
 * Euler's Method for dy/dx = f(x, y)
 */
export function eulerSolve(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number
): TrajectoryPoint2D[] {
  const points: TrajectoryPoint2D[] = [{ x: x0, y: y0 }];
  const steps = Math.min(1000, Math.floor(Math.abs(xEnd - x0) / h));
  const sign = xEnd >= x0 ? 1 : -1;
  const actualH = sign * h;

  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    if (Math.abs(y) > 1e4 || isNaN(y)) break;
    const slope = f(x, y);
    y += actualH * slope;
    x += actualH;
    points.push({ x, y });
  }

  return points;
}

/**
 * Improved Euler (Heun's Predictor-Corrector)
 */
export function heunSolve(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number
): TrajectoryPoint2D[] {
  const points: TrajectoryPoint2D[] = [{ x: x0, y: y0 }];
  const steps = Math.min(1000, Math.floor(Math.abs(xEnd - x0) / h));
  const sign = xEnd >= x0 ? 1 : -1;
  const actualH = sign * h;

  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    if (Math.abs(y) > 1e4 || isNaN(y)) break;
    const k1 = f(x, y);
    const yPredictor = y + actualH * k1;
    const k2 = f(x + actualH, yPredictor);
    y += (actualH / 2) * (k1 + k2);
    x += actualH;
    points.push({ x, y });
  }

  return points;
}

/**
 * Classical Runge-Kutta 4th Order (RK4)
 */
export function rk4Solve(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  h: number
): TrajectoryPoint2D[] {
  const points: TrajectoryPoint2D[] = [{ x: x0, y: y0 }];
  const steps = Math.min(1000, Math.floor(Math.abs(xEnd - x0) / h));
  const sign = xEnd >= x0 ? 1 : -1;
  const actualH = sign * h;

  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    if (Math.abs(y) > 1e4 || isNaN(y)) break;
    const k1 = f(x, y);
    const k2 = f(x + actualH / 2, y + (actualH / 2) * k1);
    const k3 = f(x + actualH / 2, y + (actualH / 2) * k2);
    const k4 = f(x + actualH, y + actualH * k3);

    y += (actualH / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    x += actualH;
    points.push({ x, y });
  }

  return points;
}

/**
 * 2D Linear System Analysis: A = [[a, b], [c, d]]
 */
export function analyzeLinearSystem(a: number, b: number, c: number, d: number): LinearSystemAnalysis {
  const trace = a + d;
  const determinant = a * d - b * c;
  const discriminant = trace * trace - 4 * determinant;

  let stability: MatrixStabilityType = "saddle";
  let eig1 = { real: 0, imag: 0 };
  let eig2 = { real: 0, imag: 0 };

  if (determinant < 0) {
    stability = "saddle";
    eig1.real = (trace + Math.sqrt(discriminant)) / 2;
    eig2.real = (trace - Math.sqrt(discriminant)) / 2;
  } else if (determinant === 0) {
    stability = "degenerate";
    eig1.real = trace;
  } else if (discriminant >= 0) {
    eig1.real = (trace + Math.sqrt(discriminant)) / 2;
    eig2.real = (trace - Math.sqrt(discriminant)) / 2;
    if (trace < 0) stability = "stable_node";
    else if (trace > 0) stability = "unstable_node";
    else stability = "center";
  } else {
    // Complex eigenvalues: alpha +- i*beta
    const alpha = trace / 2;
    const beta = Math.sqrt(-discriminant) / 2;
    eig1 = { real: alpha, imag: beta };
    eig2 = { real: alpha, imag: -beta };

    if (Math.abs(alpha) < 1e-6) stability = "center";
    else if (alpha < 0) stability = "stable_spiral";
    else stability = "unstable_spiral";
  }

  return {
    trace,
    determinant,
    discriminant,
    stability,
    eigenvalue1: eig1,
    eigenvalue2: eig2,
  };
}

/**
 * 2D Linear System Trajectory RK4
 */
export function solveLinearTrajectory(
  a: number,
  b: number,
  c: number,
  d: number,
  x0: number,
  y0: number,
  steps = 300,
  dt = 0.04
): TrajectoryPoint2D[] {
  const pts: TrajectoryPoint2D[] = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    if (Math.abs(x) > 20 || Math.abs(y) > 20) break;

    const f1 = (px: number, py: number) => a * px + b * py;
    const f2 = (px: number, py: number) => c * px + d * py;

    const k1x = f1(x, y);
    const k1y = f2(x, y);

    const k2x = f1(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
    const k2y = f2(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);

    const k3x = f1(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
    const k3y = f2(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);

    const k4x = f1(x + dt * k3x, y + dt * k3y);
    const k4y = f2(x + dt * k3x, y + dt * k3y);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);

    pts.push({ x, y });
  }

  return pts;
}

/**
 * Lotka-Volterra Predator-Prey RK4 Integrator
 */
export function solveLotkaVolterra(
  params: LotkaVolterraParams,
  x0: number,
  y0: number,
  tMax = 30,
  dt = 0.04
): { trajectory: TrajectoryPoint2D[]; timeSeries: { t: number; prey: number; predator: number }[] } {
  const { alpha, beta, gamma, delta } = params;
  const trajectory: TrajectoryPoint2D[] = [{ x: x0, y: y0, t: 0 }];
  const timeSeries = [{ t: 0, prey: x0, predator: y0 }];

  let x = x0;
  let y = y0;
  let t = 0;
  const steps = Math.floor(tMax / dt);

  for (let i = 0; i < steps; i++) {
    if (x <= 0 || y <= 0 || x > 100 || y > 100) break;

    const fx = (px: number, py: number) => alpha * px - beta * px * py;
    const fy = (px: number, py: number) => delta * px * py - gamma * py;

    const k1x = fx(x, y);
    const k1y = fy(x, y);

    const k2x = fx(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
    const k2y = fy(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);

    const k3x = fx(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
    const k3y = fy(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);

    const k4x = fx(x + dt * k3x, y + dt * k3y);
    const k4y = fy(x + dt * k3x, y + dt * k3y);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    t += dt;

    trajectory.push({ x, y, t });
    timeSeries.push({ t, prey: x, predator: y });
  }

  return { trajectory, timeSeries };
}

/**
 * Harmonic Oscillator (Damped & Forced): m*x'' + c*x' + k*x = F0*cos(w*t)
 */
export function solveHarmonicOscillator(
  params: HarmonicParams,
  x0: number,
  v0: number,
  tMax = 20,
  dt = 0.03
): { timeSeries: { t: number; x: number; v: number }[]; phaseTrajectory: TrajectoryPoint2D[] } {
  const { mass, damping, springK, forceAmp, forceFreq } = params;
  const timeSeries = [{ t: 0, x: x0, v: v0 }];
  const phaseTrajectory: TrajectoryPoint2D[] = [{ x: x0, y: v0 }];

  let x = x0;
  let v = v0;
  let t = 0;
  const steps = Math.floor(tMax / dt);

  for (let i = 0; i < steps; i++) {
    const fx = (currV: number) => currV;
    const fv = (currX: number, currV: number, currT: number) =>
      (forceAmp * Math.cos(forceFreq * currT) - damping * currV - springK * currX) / mass;

    const k1x = fx(v);
    const k1v = fv(x, v, t);

    const k2x = fx(v + 0.5 * dt * k1v);
    const k2v = fv(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v, t + 0.5 * dt);

    const k3x = fx(v + 0.5 * dt * k2v);
    const k3v = fv(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v, t + 0.5 * dt);

    const k4x = fx(v + dt * k3v);
    const k4v = fv(x + dt * k3x, v + dt * k3v, t + dt);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    t += dt;

    timeSeries.push({ t, x, v });
    phaseTrajectory.push({ x, y: v });
  }

  return { timeSeries, phaseTrajectory };
}

/**
 * Lorenz System Integrator (RK4)
 */
export function solveLorenzSystem(
  params: LorenzParams,
  x0: number,
  y0: number,
  z0: number,
  steps = 1500,
  dt = 0.01
): TrajectoryPoint3D[] {
  const { sigma, rho, beta } = params;
  const trajectory: TrajectoryPoint3D[] = [{ x: x0, y: y0, z: z0 }];

  let x = x0;
  let y = y0;
  let z = z0;

  for (let i = 0; i < steps; i++) {
    const fx = (px: number, py: number) => sigma * (py - px);
    const fy = (px: number, py: number, pz: number) => px * (rho - pz) - py;
    const fz = (px: number, py: number, pz: number) => px * py - beta * pz;

    const k1x = fx(x, y);
    const k1y = fy(x, y, z);
    const k1z = fz(x, y, z);

    const k2x = fx(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
    const k2y = fy(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, z + 0.5 * dt * k1z);
    const k2z = fz(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, z + 0.5 * dt * k1z);

    const k3x = fx(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
    const k3y = fy(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, z + 0.5 * dt * k2z);
    const k3z = fz(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, z + 0.5 * dt * k2z);

    const k4x = fx(x + dt * k3x, y + dt * k3y);
    const k4y = fy(x + dt * k3x, y + dt * k3y, z + dt * k3z);
    const k4z = fz(x + dt * k3x, y + dt * k3y, z + dt * k3z);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    z += (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);

    trajectory.push({ x, y, z });
  }

  return trajectory;
}

/**
 * SIR Epidemic Model RK4 Integrator
 */
export function solveSirModel(
  params: SirParams,
  tMax = 60,
  dt = 0.2
): { t: number; s: number; i: number; r: number }[] {
  const { beta, gamma, totalPop, initialInfected } = params;
  let s = totalPop - initialInfected;
  let inf = initialInfected;
  let rec = 0;
  let t = 0;

  const results = [{ t, s, i: inf, r: rec }];
  const steps = Math.floor(tMax / dt);

  for (let step = 0; step < steps; step++) {
    const fs = (currS: number, currI: number) => (-beta * currS * currI) / totalPop;
    const fi = (currS: number, currI: number) => (beta * currS * currI) / totalPop - gamma * currI;
    const fr = (currI: number) => gamma * currI;

    const k1s = fs(s, inf);
    const k1i = fi(s, inf);
    const k1r = fr(inf);

    const k2s = fs(s + 0.5 * dt * k1s, inf + 0.5 * dt * k1i);
    const k2i = fi(s + 0.5 * dt * k1s, inf + 0.5 * dt * k1i);
    const k2r = fr(inf + 0.5 * dt * k1i);

    const k3s = fs(s + 0.5 * dt * k2s, inf + 0.5 * dt * k2i);
    const k3i = fi(s + 0.5 * dt * k2s, inf + 0.5 * dt * k2i);
    const k3r = fr(inf + 0.5 * dt * k2i);

    const k4s = fs(s + dt * k3s, inf + dt * k3i);
    const k4i = fi(s + dt * k3s, inf + dt * k3i);
    const k4r = fr(inf + dt * k3i);

    s += (dt / 6) * (k1s + 2 * k2s + 2 * k3s + k4s);
    inf += (dt / 6) * (k1i + 2 * k2i + 2 * k3i + k4i);
    rec += (dt / 6) * (k1r + 2 * k2r + 2 * k3r + k4r);
    t += dt;

    results.push({ t, s, i: inf, r: rec });
  }

  return results;
}
