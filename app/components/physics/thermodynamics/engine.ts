import { CycleParameters, CycleTelemetry, ThermodynamicCycle, WorkingGas } from "./types";

export const R_IDEAL = 8.314; // J/(mol*K)

export const GAS_PROPERTIES: Record<WorkingGas, { name: string; gamma: number; cvFactor: number }> = {
  monatomic: { name: "Monatomic (Argon/Helium)", gamma: 1.667, cvFactor: 1.5 },
  diatomic: { name: "Diatomic (Air/N₂/O₂)", gamma: 1.400, cvFactor: 2.5 },
  polyatomic: { name: "Polyatomic (CO₂/Steam)", gamma: 1.333, cvFactor: 3.0 },
};

export const STROKE_DESCRIPTIONS: Record<ThermodynamicCycle, string[]> = {
  carnot: [
    "1. Isothermal Expansion (TH Heat Absorption Qin)",
    "2. Adiabatic Expansion (Gas Cools TH -> TC, Work Out)",
    "3. Isothermal Compression (TC Heat Rejection Qout)",
    "4. Adiabatic Compression (Gas Warms TC -> TH, Work In)",
  ],
  otto: [
    "1. Adiabatic Compression (Piston Compresses Air-Fuel)",
    "2. Isochoric Combustion (Spark Ignition, Qin)",
    "3. Adiabatic Power Stroke (High Pressure Expansion)",
    "4. Isochoric Heat Rejection (Exhaust Blowdown, Qout)",
  ],
  diesel: [
    "1. Adiabatic Compression (High Compression Heat)",
    "2. Isobaric Fuel Injection (Constant Pressure Burn, Qin)",
    "3. Adiabatic Power Stroke (Expansion Work)",
    "4. Isochoric Heat Rejection (Exhaust Release, Qout)",
  ],
  stirling: [
    "1. Isothermal Expansion (TH Heat Absorption)",
    "2. Isochoric Regeneration Cooling (Internal Storage)",
    "3. Isothermal Compression (TC Heat Rejection)",
    "4. Isochoric Regeneration Heating (Heat Recovery)",
  ],
};

/**
 * Computes the 4 corners of the thermodynamic P-V and T-S diagram.
 */
export function computeCycleStatePoints(params: CycleParameters) {
  const { cycleType, tempHotK, tempColdK, compressionRatio, workingGas, moleCount } = params;
  const { gamma } = GAS_PROPERTIES[workingGas];
  const nR = moleCount * R_IDEAL;

  const vMin = 0.001; // 1 L in m³
  const vMax = vMin * compressionRatio; // m³

  let p1: number, v1: number, t1: number, s1: number;
  let p2: number, v2: number, t2: number, s2: number;
  let p3: number, v3: number, t3: number, s3: number;
  let p4: number, v4: number, t4: number, s4: number;

  if (cycleType === "carnot") {
    // Carnot Cycle
    t1 = tempHotK;
    v1 = vMin;
    p1 = (nR * t1) / v1;
    s1 = 20;

    t2 = tempHotK;
    v2 = vMin * 1.8;
    p2 = (nR * t2) / v2;
    s2 = s1 + nR * Math.log(v2 / v1);

    t3 = tempColdK;
    // Adiabatic expansion: T1 * V2^(gamma-1) = T3 * V3^(gamma-1)
    v3 = v2 * Math.pow(tempHotK / tempColdK, 1 / (gamma - 1));
    p3 = (nR * t3) / v3;
    s3 = s2;

    t4 = tempColdK;
    // Adiabatic compression to point 1: V4 = V1 * (TH/TC)^(1/(gamma-1))
    v4 = v1 * Math.pow(tempHotK / tempColdK, 1 / (gamma - 1));
    p4 = (nR * t4) / v4;
    s4 = s1;
  } else if (cycleType === "otto") {
    // Otto Cycle: 1->2 Adiabatic compression, 2->3 Isochoric heat in, 3->4 Adiabatic expansion, 4->1 Isochoric heat out
    t1 = tempColdK;
    v1 = vMax;
    p1 = (nR * t1) / v1;
    s1 = 20;

    v2 = vMin;
    t2 = t1 * Math.pow(compressionRatio, gamma - 1);
    p2 = (nR * t2) / v2;
    s2 = s1;

    v3 = vMin;
    t3 = tempHotK;
    p3 = (nR * t3) / v3;
    s3 = s2 + moleCount * GAS_PROPERTIES[workingGas].cvFactor * R_IDEAL * Math.log(t3 / t2);

    v4 = vMax;
    t4 = t3 / Math.pow(compressionRatio, gamma - 1);
    p4 = (nR * t4) / v4;
    s4 = s3;
  } else if (cycleType === "diesel") {
    // Diesel Cycle: 1->2 Adiabatic comp, 2->3 Isobaric heat in, 3->4 Adiabatic exp, 4->1 Isochoric heat out
    const rc = 2.0; // cutoff ratio
    t1 = tempColdK;
    v1 = vMax;
    p1 = (nR * t1) / v1;
    s1 = 20;

    v2 = vMin;
    t2 = t1 * Math.pow(compressionRatio, gamma - 1);
    p2 = (nR * t2) / v2;
    s2 = s1;

    v3 = vMin * rc;
    t3 = t2 * rc;
    p3 = p2;
    s3 = s2 + moleCount * (GAS_PROPERTIES[workingGas].cvFactor + 1) * R_IDEAL * Math.log(rc);

    v4 = vMax;
    t4 = t3 * Math.pow(v3 / v4, gamma - 1);
    p4 = (nR * t4) / v4;
    s4 = s3;
  } else {
    // Stirling Cycle: 1->2 Isothermal expansion (TH), 2->3 Isochoric cool, 3->4 Isothermal comp (TC), 4->1 Isochoric heat
    t1 = tempHotK;
    v1 = vMin;
    p1 = (nR * t1) / v1;
    s1 = 20;

    t2 = tempHotK;
    v2 = vMax;
    p2 = (nR * t2) / v2;
    s2 = s1 + nR * Math.log(v2 / v1);

    t3 = tempColdK;
    v3 = vMax;
    p3 = (nR * t3) / v3;
    s3 = s2 - moleCount * GAS_PROPERTIES[workingGas].cvFactor * R_IDEAL * Math.log(tempHotK / tempColdK);

    t4 = tempColdK;
    v4 = vMin;
    p4 = (nR * t4) / v4;
    s4 = s1;
  }

  return [
    { p: p1 / 1000, v: v1 * 1000, t: t1, s: s1 }, // P in kPa, V in Liters
    { p: p2 / 1000, v: v2 * 1000, t: t2, s: s2 },
    { p: p3 / 1000, v: v3 * 1000, t: t3, s: s3 },
    { p: p4 / 1000, v: v4 * 1000, t: t4, s: s4 },
  ];
}

/**
 * Computes instantaneous cycle progress, state variables (P, V, T, S), work, and efficiencies.
 */
export function computeCycleTelemetry(params: CycleParameters, timeSec: number): CycleTelemetry {
  const points = computeCycleStatePoints(params);
  const cyclePeriodSec = 60 / params.rpmSpeed;
  const cycleFrac = (timeSec % cyclePeriodSec) / cyclePeriodSec;

  const currentStroke = Math.floor(cycleFrac * 4); // 0 to 3
  const strokeProgress = (cycleFrac * 4) % 1; // 0 to 1

  const pStart = points[currentStroke];
  const pEnd = points[(currentStroke + 1) % 4];

  // Interpolate P, V, T, S along stroke
  const currentP_kPa = pStart.p + (pEnd.p - pStart.p) * strokeProgress;
  const currentV_L = pStart.v + (pEnd.v - pStart.v) * strokeProgress;
  const currentT_K = pStart.t + (pEnd.t - pStart.t) * strokeProgress;
  const currentS_J_K = pStart.s + (pEnd.s - pStart.s) * strokeProgress;

  // Efficiencies
  const carnotMaxEfficiency = (1 - params.tempColdK / params.tempHotK) * 100;
  let efficiencyPercent = carnotMaxEfficiency;

  const { gamma } = GAS_PROPERTIES[params.workingGas];
  if (params.cycleType === "otto") {
    efficiencyPercent = (1 - 1 / Math.pow(params.compressionRatio, gamma - 1)) * 100;
  } else if (params.cycleType === "diesel") {
    const rc = 2.0;
    const term = (Math.pow(rc, gamma) - 1) / (gamma * (rc - 1));
    efficiencyPercent = (1 - (1 / Math.pow(params.compressionRatio, gamma - 1)) * term) * 100;
  } else if (params.cycleType === "stirling") {
    efficiencyPercent = carnotMaxEfficiency * 0.85; // practical Stirling regenerator
  }

  // Work & Heat
  const nR = params.moleCount * R_IDEAL;
  const heatInJoules = nR * params.tempHotK * Math.log(2.2);
  const netWorkJoules = heatInJoules * (efficiencyPercent / 100);
  const heatOutJoules = heatInJoules - netWorkJoules;

  // Piston Height (min 50px at top-dead-center, max 160px at bottom-dead-center)
  const vMin = Math.min(...points.map((p) => p.v));
  const vMax = Math.max(...points.map((p) => p.v));
  const vNorm = (currentV_L - vMin) / (vMax - vMin || 1);
  const pistonHeightPx = 50 + vNorm * 110;

  return {
    currentStroke,
    strokeProgress,
    strokeName: STROKE_DESCRIPTIONS[params.cycleType][currentStroke],
    currentP_kPa,
    currentV_L,
    currentT_K,
    currentS_J_K,
    efficiencyPercent,
    carnotMaxEfficiency,
    netWorkJoules,
    heatInJoules,
    heatOutJoules,
    pistonHeightPx,
  };
}
