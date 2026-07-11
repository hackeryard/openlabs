import { SimulatorState, RateOutput, LimitingFactor } from "./types";

// Helper for Michaelis-Menten style saturation curves
// f(x) = (Vmax * x) / (Km + x)
const calculateMichaelisMenten = (x: number, Vmax: number, Km: number) => {
  return (Vmax * x) / (Km + x);
};

export const calculateRate = (state: SimulatorState): RateOutput => {
  // Light: Vmax=100, Km=20 (saturates quickly after 20-30%)
  const fLight = calculateMichaelisMenten(state.light, 100, 20);
  
  // CO2: Vmax=100, Km=300 (saturates around 1000 ppm)
  const fCo2 = calculateMichaelisMenten(state.co2, 100, 300);
  
  // Water: Vmax=100, Km=20
  const fWater = calculateMichaelisMenten(state.water, 100, 20);
  
  // Temperature: Piecewise bell-like curve
  // Optimal temp is around 28C.
  let tempFactor = 0;
  const temp = state.temperature;
  if (temp > 0 && temp <= 28) {
    // rises quadratically
    tempFactor = Math.pow(temp / 28, 2); 
  } else if (temp > 28 && temp <= 45) {
    // drops sharply
    tempFactor = Math.max(0, 1 - Math.pow((temp - 28) / 17, 2));
  }

  // Rate = min(fLight, fCo2, fWater) * tempFactor
  // We want to find the lowest raw value (fLight, fCo2, fWater).
  // If they are near-equal, break ties predictably: Light > CO2 > Water
  
  const factors = [
    { name: "Light" as LimitingFactor, value: fLight, tieBreakPriority: 1 },
    { name: "CO2" as LimitingFactor, value: fCo2, tieBreakPriority: 2 },
    { name: "Water" as LimitingFactor, value: fWater, tieBreakPriority: 3 },
  ];

  factors.sort((a, b) => {
    // Epsilon for "near equal" is 1.0 (on a 0-100 scale)
    if (Math.abs(a.value - b.value) < 1.0) {
      return a.tieBreakPriority - b.tieBreakPriority;
    }
    return a.value - b.value;
  });

  const primaryLimiter = factors[0];
  let limitingFactor = primaryLimiter.name;
  let baseRate = primaryLimiter.value;

  // Temperature becomes limiting if it severely bottlenecks the base rate
  // Let's say if tempFactor < 0.6 and the baseRate is somewhat decent
  if (tempFactor < 0.6 && baseRate > 20) {
    limitingFactor = "Temperature";
  }

  // Calculate final rate
  const rate = Math.max(0, Math.min(100, baseRate * tempFactor));

  // If rate is near maximum, we can say there's no major limiting factor (optimal)
  if (rate > 95) {
    limitingFactor = "None";
  }

  return { rate, limitingFactor };
};
