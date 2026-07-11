import { SimulatorState } from "./types";

export const PRESETS: Record<string, SimulatorState> = {
  "Full Sunlight": { light: 100, co2: 420, water: 80, temperature: 28 },
  "Cloudy Day": { light: 30, co2: 420, water: 80, temperature: 22 },
  "Drought": { light: 90, co2: 420, water: 10, temperature: 35 },
  "Greenhouse (CO₂ Enriched)": { light: 80, co2: 1200, water: 90, temperature: 28 },
  "Winter Cold": { light: 40, co2: 420, water: 60, temperature: 5 },
};
