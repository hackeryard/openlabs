export type LimitingFactor = "Light" | "CO2" | "Water" | "Temperature" | "None";

export interface SimulatorState {
  light: number; // 0-100%
  co2: number; // 0-2000 ppm
  water: number; // 0-100%
  temperature: number; // 0-50 C
}

export interface RateOutput {
  rate: number; // 0-100% normalized
  limitingFactor: LimitingFactor;
}
