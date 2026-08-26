import { DopplerMedium, DopplerParameters, DopplerTelemetry } from "./types";

export const SPEED_OF_SOUND: Record<DopplerMedium, number> = {
  air: 343, // m/s in Earth air at 20°C
  water: 1482, // m/s in freshwater
  mars: 240, // m/s in Martian CO2 atmosphere
  helium: 965, // m/s in Helium
  light: 3000, // normalized scaled speed for relativistic light
};

/**
 * Computes instantaneous Doppler shift, Mach cone geometry, and observed acoustic frequency.
 */
export function computeDopplerTelemetry(params: DopplerParameters, simTimeSec: number): DopplerTelemetry {
  const { sourceSpeedMs: v_s, sourceFrequencyHz: f_0, medium, observerX, observerY } = params;
  const c = SPEED_OF_SOUND[medium];

  // Source moves horizontally along X = 0 line, looping periodically
  // Span = 600 meters (-300m to +300m)
  const trackLength = 600;
  const rawX = -300 + (v_s * simTimeSec) % trackLength;
  const sourceX = rawX;
  const sourceY = 0;

  // Vector from source to observer
  const dx = observerX - sourceX;
  const dy = observerY - sourceY;
  const distanceToObserverM = Math.sqrt(dx * dx + dy * dy) || 1;

  // Direction cosine: angle between source velocity vector (+X) and line-of-sight to observer
  const cosTheta = dx / distanceToObserverM;
  const approaching = cosTheta > 0;

  // Mach Number M = v_s / c
  const machNumber = v_s / c;

  // Mach Cone Half-Angle: sin(mu) = 1/M  ==>  mu = arcsin(1/M) in degrees
  let machAngleDeg: number | null = null;
  if (machNumber >= 1.0) {
    machAngleDeg = (Math.asin(1 / machNumber) * 180) / Math.PI;
  }

  // Instantaneous classical 2D Doppler frequency at observer
  // f' = f_0 * (c / (c - v_s * cos(theta)))
  let observedFrequencyHz: number;
  if (medium === "light") {
    // Relativistic Doppler longitudinal shift
    const beta = Math.min(0.99, v_s / c);
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    observedFrequencyHz = f_0 / (gamma * (1 - beta * cosTheta));
  } else {
    // Acoustic Doppler shift with clamping to prevent singularity at sonic boom wavefront
    const denom = Math.max(10, c - v_s * cosTheta);
    observedFrequencyHz = f_0 * (c / denom);
  }

  const frequencyShiftPercent = ((observedFrequencyHz - f_0) / f_0) * 100;

  // Wavelength compression ahead and decompression behind
  const wavelengthFrontM = Math.max(0.01, (c - v_s) / f_0);
  const wavelengthBackM = (c + v_s) / f_0;

  // Sonic boom active when shock front sweeps past observer
  const isSonicBoomActive = machNumber >= 1.0 && Math.abs(dx) < 25 && distanceToObserverM < 120;

  return {
    soundSpeedMs: c,
    machNumber,
    machAngleDeg,
    observedFrequencyHz: Math.max(20, Math.min(4000, observedFrequencyHz)),
    frequencyShiftPercent,
    sourceX,
    sourceY,
    distanceToObserverM,
    approaching,
    isSonicBoomActive,
    wavelengthFrontM,
    wavelengthBackM,
  };
}
