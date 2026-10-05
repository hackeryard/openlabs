// app/components/physics/general-relativity/types.ts

export type RelativityMode =
  | "spacetime"
  | "lensing"
  | "timedilation"
  | "redshift"
  | "waves";

export interface CelestialPreset {
  id: string;
  name: string;
  category: "planet" | "star" | "compact" | "blackhole";
  massSolar: number; // In Solar Masses (M_sun)
  radiusKm: number;  // Physical radius
  description: string;
  color: string;
  glowColor: string;
  defaultProbeDistanceRs: number; // in units of r_s
  spinParam: number; // Dimensionless Kerr spin a* in [0, 0.998]
}

export interface GeodesicParticle {
  id: number;
  x: number; // In sim units
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
  active: boolean;
  absorbed: boolean;
  color: string;
}

export interface SpectralLine {
  id: string;
  name: string;
  element: string;
  restWavelengthNm: number;
  restColorHex: string;
  description: string;
}

export interface EffectivePotentialPoint {
  rRs: number;
  potential: number;
}

export interface TidalForceMetrics {
  humanTidalG: number;       // Tidal acceleration across 1.8m in units of Earth g
  spaghettificationStatus: "negligible" | "noticeable" | "lethal" | "extreme";
  statusColor: string;
  rocheRadiusKm: number;
}

export interface MetricTensorValues {
  g00: number; // -(1 - r_s / r)
  g11: number; // 1 / (1 - r_s / r)
  g22: number; // r^2 (in km^2)
  g33: number; // r^2 sin^2 theta
  kretschmannScalar: number; // 48 G^2 M^2 / (c^4 r^6)
  ricciScalar: number; // 0 for vacuum solution
  frameDraggingOmegaRadS: number; // Kerr frame-dragging angular velocity in rad/s
  iscoRadiusRs: number;
  photonSphereRs: number;
  outerHorizonRs: number;
  ergosphereEquatorRs: number;
}

export interface BinaryChirpParams {
  m1Solar: number;
  m2Solar: number;
  chirpMassSolar: number;
  timeToMergerSeconds: number;
  currentFreqHz: number;
  strainAmplitude: number;
  phase: number;
  luminosityWatts: number;
  eventHorizonCombinedKm: number;
}

export interface GuidedInvestigation {
  id: string;
  title: string;
  subtitle: string;
  historicalYear: number;
  leadScientist: string;
  objective: string;
  recommendedMode: RelativityMode;
  targetPresetId: string;
  targetMassSolar: number;
  targetProbeDistanceRs: number;
  targetImpactParameterRs?: number;
  targetKerrSpin?: number;
  formula: string;
  formulaDescription: string;
  steps: string[];
  expectedObservation: string;
  keyTakeaway: string;
}

export interface RelativisticTelemetry {
  massSolar: number;
  massKg: number;
  schwarzschildRadiusKm: number; // r_s = 2GM/c^2
  photonSphereKm: number;        // 1.5 * r_s
  iscoKm: number;                // 3.0 * r_s (Innermost Stable Circular Orbit)
  probeRadiusKm: number;         // Current probe distance
  probeRadiusRs: number;         // In multiples of r_s
  escapeVelocityC: number;       // v_esc / c = sqrt(r_s / r)
  escapeVelocityKms: number;     // km/s
  timeDilationFactor: number;    // gamma_grav = 1 / sqrt(1 - r_s / r)
  gravitationalRedshiftZ: number;// z = 1 / sqrt(1 - r_s/r) - 1
  lightDeflectionArcsec: number; // 4GM / (c^2 b)
  lightDeflectionDeg: number;
  mercuryPrecessionArcsecCentury: number; // 42.98 arcsec / century
  gpsGravitationalDriftUsDay: number;     // +45.9 us / day
  gpsKinematicDriftUsDay: number;         // -7.2 us / day
  gpsNetDriftUsDay: number;               // +38.7 us / day
  tidal: TidalForceMetrics;
  kerrEventHorizonKm: number;    // r_+ = M + sqrt(M^2 - a^2)
  ergosphereEquatorKm: number;   // r_E(pi/2) = 2M = r_s
  metric: MetricTensorValues;
}

export interface RelativityTrialRecord {
  id: string;
  timestamp: string;
  objectName: string;
  massSolar: number;
  probeRadiusKm: number;
  schwarzschildRadiusKm: number;
  timeDilationFactor: number;
  gravitationalRedshiftZ: number;
  escapeVelocityC: number;
  deflectionArcsec: number;
  tidalG: number;
}
