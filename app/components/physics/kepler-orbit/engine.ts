import { OrbitParameters, OrbitTelemetry, SweptSector } from "./types";

export const G_SOLAR = 4 * Math.PI * Math.PI; // AU^3 / (yr^2 * M_sun)
export const KM_PER_AU = 149597870.7; // km
export const SEC_PER_YEAR = 31557600; // seconds
export const EARTH_ORBITAL_SPEED_KMS = 29.78; // km/s at 1 AU around 1 M_sun

/**
 * Solves Kepler's equation M = E - e*sin(E) for Eccentric Anomaly E using Newton-Raphson method.
 */
export function solveKeplerEquation(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 15; i++) {
    const f = E - e * Math.sin(E) - M;
    const fPrime = 1 - e * Math.cos(E);
    const dE = f / fPrime;
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return E;
}

/**
 * Computes complete orbital telemetry and position vectors at simulation time t (years).
 */
export function computeOrbitTelemetry(params: OrbitParameters, simTimeYears: number): OrbitTelemetry {
  const { semiMajorAxisAU: a, eccentricity: e, starMassSolar: M } = params;

  // Kepler's 3rd Law: T^2 = a^3 / M  ==>  T = sqrt(a^3 / M) in Earth years
  const orbitalPeriodYears = Math.sqrt(Math.pow(a, 3) / M);
  const orbitalPeriodDays = orbitalPeriodYears * 365.25;
  const meanMotionN = (2 * Math.PI) / orbitalPeriodYears; // rad/yr

  // Mean anomaly M(t) in [0, 2π)
  const meanAnomaly = (meanMotionN * simTimeYears) % (2 * Math.PI);

  // Eccentric anomaly E(t)
  const eccentricAnomaly = solveKeplerEquation(meanAnomaly, e);

  // True anomaly ν(t)
  const sinNu = (Math.sqrt(1 - e * e) * Math.sin(eccentricAnomaly)) / (1 - e * Math.cos(eccentricAnomaly));
  const cosNu = (Math.cos(eccentricAnomaly) - e) / (1 - e * Math.cos(eccentricAnomaly));
  const trueAnomaly = Math.atan2(sinNu, cosNu);

  // Distance r(t) in AU
  const currentRadiusAU = a * (1 - e * Math.cos(eccentricAnomaly));

  // Coordinates with Star at Focus (0, 0)
  // Major axis along X: Star at (0, 0), Center at (-a*e, 0)
  const planetX_AU = currentRadiusAU * Math.cos(trueAnomaly);
  const planetY_AU = currentRadiusAU * Math.sin(trueAnomaly);

  // Orbital Speed via Vis-Viva Equation: v = sqrt(GM * (2/r - 1/a))
  const speedNormalized = Math.sqrt(M * (2 / currentRadiusAU - 1 / a));
  const currentSpeedKms = speedNormalized * EARTH_ORBITAL_SPEED_KMS;

  // Velocity components Vx, Vy (perpendicular velocity vector along trajectory)
  const specificAngularMomentumH = Math.sqrt(G_SOLAR * M * a * (1 - e * e));
  const rDot = (Math.sqrt(G_SOLAR * M / (a * (1 - e * e)))) * e * Math.sin(trueAnomaly);
  const rThetaDot = specificAngularMomentumH / currentRadiusAU;

  // Velocity in Cartesian frame:
  // vx = rDot*cos(nu) - r*nuDot*sin(nu)
  // vy = rDot*sin(nu) + r*nuDot*cos(nu)
  const vx_AU_yr = rDot * Math.cos(trueAnomaly) - rThetaDot * Math.sin(trueAnomaly);
  const vy_AU_yr = rDot * Math.sin(trueAnomaly) + rThetaDot * Math.cos(trueAnomaly);

  const velocityVx_kms = (vx_AU_yr * KM_PER_AU) / SEC_PER_YEAR;
  const velocityVy_kms = (vy_AU_yr * KM_PER_AU) / SEC_PER_YEAR;

  // Perihelion and Aphelion
  const perihelionAU = a * (1 - e);
  const aphelionAU = a * (1 + e);

  // Specific Orbital Energy: E = -GM / (2a) in MJ/kg
  const specificEnergyMJ = -0.5 * (M / a) * 887.2;

  // Kepler Harmonic Ratio: T^2 / a^3
  const keplerRatio = Math.pow(orbitalPeriodYears, 2) / Math.pow(a, 3);

  // Swept Sectors for Kepler's 2nd Law (Equal Areas in Equal Times)
  const sweptSectors: SweptSector[] = [];
  const sectorCount = 6;
  for (let s = 0; s < sectorCount; s++) {
    const fracStart = s / sectorCount;
    const fracEnd = (s + 0.5) / sectorCount;

    const M_start = fracStart * 2 * Math.PI;
    const M_end = fracEnd * 2 * Math.PI;

    const E_start = solveKeplerEquation(M_start, e);
    const E_end = solveKeplerEquation(M_end, e);

    const nu_start = Math.atan2(
      Math.sqrt(1 - e * e) * Math.sin(E_start) / (1 - e * Math.cos(E_start)),
      (Math.cos(E_start) - e) / (1 - e * Math.cos(E_start))
    );
    const nu_end = Math.atan2(
      Math.sqrt(1 - e * e) * Math.sin(E_end) / (1 - e * Math.cos(E_end)),
      (Math.cos(E_end) - e) / (1 - e * Math.cos(E_end))
    );

    sweptSectors.push({
      thetaStart: nu_start,
      thetaEnd: nu_end,
      area: 0.5 * a * a * Math.sqrt(1 - e * e) * (M_end - M_start),
      startTime: fracStart * orbitalPeriodDays,
      color: s % 2 === 0 ? "rgba(56, 189, 248, 0.25)" : "rgba(245, 158, 11, 0.25)",
    });
  }

  return {
    trueAnomalyDeg: ((trueAnomaly * 180) / Math.PI + 360) % 360,
    meanAnomalyDeg: ((meanAnomaly * 180) / Math.PI + 360) % 360,
    currentRadiusAU,
    currentSpeedKms,
    orbitalPeriodYears,
    orbitalPeriodDays,
    perihelionAU,
    aphelionAU,
    specificEnergyMJ,
    keplerRatio,
    planetX_AU,
    planetY_AU,
    velocityVx_kms,
    velocityVy_kms,
    sweptSectors,
  };
}
