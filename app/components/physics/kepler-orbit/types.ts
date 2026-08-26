export type CelestialPreset = "earth_sun" | "halley_comet" | "mercury_eccentric" | "jupiter_giant" | "binary_orbit";
export type OrbitDisplayMode = "standard" | "swept_areas" | "vectors" | "energy";

export interface OrbitParameters {
  semiMajorAxisAU: number; // a (0.4 to 6.0 AU)
  eccentricity: number; // e (0.0 to 0.95)
  starMassSolar: number; // M (0.2 to 4.0 M_sun)
  planetMassEarth: number; // m (0.01 to 300 M_earth)
  displayMode: OrbitDisplayMode;
  showVectors: boolean;
  showGrid: boolean;
  simSpeed: number; // 0.1x to 10x
}

export interface SweptSector {
  thetaStart: number;
  thetaEnd: number;
  area: number;
  startTime: number;
  color: string;
}

export interface OrbitTelemetry {
  trueAnomalyDeg: number; // ν (degrees)
  meanAnomalyDeg: number; // M (degrees)
  currentRadiusAU: number; // r(t)
  currentSpeedKms: number; // v(t) in km/s
  orbitalPeriodYears: number; // T (years)
  orbitalPeriodDays: number; // T (days)
  perihelionAU: number; // r_min = a(1-e)
  aphelionAU: number; // r_max = a(1+e)
  specificEnergyMJ: number; // -GM/(2a)
  keplerRatio: number; // T^2 / a^3
  planetX_AU: number;
  planetY_AU: number;
  velocityVx_kms: number;
  velocityVy_kms: number;
  sweptSectors: SweptSector[];
}
