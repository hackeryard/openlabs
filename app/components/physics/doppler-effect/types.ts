export type DopplerMedium = "air" | "water" | "mars" | "helium" | "light";
export type DopplerDisplayMode = "wavefronts" | "shock_cone" | "spectral_shift" | "audio_scope";

export interface DopplerParameters {
  sourceSpeedMs: number; // v_s (0 to 700 m/s)
  sourceFrequencyHz: number; // f_0 (100 to 1000 Hz)
  medium: DopplerMedium; // determines sound speed c
  observerX: number; // Observer position (-200 to +200 m)
  observerY: number; // Observer offset (0 to 150 m)
  displayMode: DopplerDisplayMode;
  audioEnabled: boolean;
  showVectors: boolean;
  showMachCone: boolean;
  simSpeed: number;
}

export interface WavefrontCircle {
  id: number;
  originX: number;
  originY: number;
  birthTime: number; // seconds
  radiusMeters: number;
  frequency: number;
}

export interface DopplerTelemetry {
  soundSpeedMs: number; // c
  machNumber: number; // M = v_s / c
  machAngleDeg: number | null; // μ = arcsin(1/M) if M >= 1
  observedFrequencyHz: number; // f'
  frequencyShiftPercent: number; // Δf / f_0 * 100
  sourceX: number;
  sourceY: number;
  distanceToObserverM: number;
  approaching: boolean;
  isSonicBoomActive: boolean;
  wavelengthFrontM: number; // λ_front = (c - v_s)/f_0
  wavelengthBackM: number; // λ_back = (c + v_s)/f_0
}
