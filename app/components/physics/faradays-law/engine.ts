import {
  LinearMagnetParams,
  DynamoParams,
  TransformerParams,
  EddyTubeParams,
  SimulationTelemetry,
  CoreMaterial,
  TubeMaterial,
} from "./types";

export const CORE_PERMEABILITY_FACTOR: Record<CoreMaterial, number> = {
  air: 1.0,
  ferrite: 3.2,
  soft_iron: 6.8,
};

export const TUBE_CONDUCTIVITY: Record<TubeMaterial, { name: string; sigma: number; dragFactor: number; color: string }> = {
  copper: { name: "Pure Copper (Cu)", sigma: 5.96e7, dragFactor: 9.8, color: "#f97316" },
  aluminum: { name: "Structural Aluminum (Al)", sigma: 3.77e7, dragFactor: 6.2, color: "#94a3b8" },
  acrylic: { name: "Acrylic Glass (Insulator)", sigma: 1e-14, dragFactor: 0.0, color: "#38bdf8" },
};

/**
 * Calculates axial magnetic field B(x) from a cylindrical bar magnet dipole.
 * @param x Position relative to magnet center (meters)
 * @param B0 Surface remanence field (Tesla)
 * @param radius Magnet radius (meters)
 * @param length Magnet length (meters)
 */
export function calculateAxialBField(
  x: number,
  B0: number,
  radius: number = 0.015,
  length: number = 0.06
): number {
  const d1 = x + length / 2;
  const d2 = x - length / 2;
  // Analytical magnetic field on axis of cylindrical magnet
  const term1 = d1 / Math.sqrt(d1 * d1 + radius * radius);
  const term2 = d2 / Math.sqrt(d2 * d2 + radius * radius);
  return (B0 / 2) * Math.abs(term1 - term2);
}

/**
 * Calculates magnetic flux linkage Phi_B through a multi-turn solenoid coil.
 */
export function calculateLinearFlux(
  params: LinearMagnetParams,
  coilCenterXPx: number = 380
): { fluxWb: number; spatialGradientDPhiDx: number } {
  const pixelToMeter = 0.001; // 1 px = 1 mm
  const distPx = params.magnetX - coilCenterXPx;
  const distM = distPx * pixelToMeter;

  const coilRadiusM = params.coilRadius * 0.001;
  const coilAreaM2 = Math.PI * coilRadiusM * coilRadiusM;
  const coreGain = CORE_PERMEABILITY_FACTOR[params.coreMaterial];

  const B = calculateAxialBField(distM, params.magnetStrengthB0);
  const polaritySign = params.magnetPolarity === "N-S" ? 1 : -1;
  const fluxWb = polaritySign * B * coilAreaM2 * coreGain;

  // Spatial gradient dPhi/dx using numerical central difference
  const deltaX = 0.001; // 1 mm step
  const B_plus = calculateAxialBField(distM + deltaX, params.magnetStrengthB0);
  const B_minus = calculateAxialBField(distM - deltaX, params.magnetStrengthB0);
  const dBDx = (B_plus - B_minus) / (2 * deltaX);
  const spatialGradientDPhiDx = polaritySign * dBDx * coilAreaM2 * coreGain;

  return { fluxWb, spatialGradientDPhiDx };
}

/**
 * Computes instantaneous linear induction telemetry given magnet velocity (dx/dt in px/s).
 */
export function computeLinearTelemetry(
  params: LinearMagnetParams,
  velocityPxS: number,
  coilCenterXPx: number = 380
): SimulationTelemetry {
  const { fluxWb, spatialGradientDPhiDx } = calculateLinearFlux(params, coilCenterXPx);
  const velocityMS = velocityPxS * 0.001; // convert px/s to m/s

  // Faraday's Law: EMF = -N * (dPhi/dt) = -N * (dPhi/dx * dx/dt)
  const dPhiDt = spatialGradientDPhiDx * velocityMS;
  const inducedEMF = -params.coilTurns * dPhiDt;

  const rLoad = Math.max(1, params.loadResistance);
  const inducedCurrent = inducedEMF / rLoad;
  const powerDissipatedW = inducedEMF * inducedCurrent;

  // Lenz's Law opposing magnetic field produced by the coil
  const mu0 = 4 * Math.PI * 1e-7;
  const nPerM = params.coilTurns / (params.coilLength * 0.001);
  const lenzOpposingFieldB = -mu0 * nPerM * inducedCurrent * CORE_PERMEABILITY_FACTOR[params.coreMaterial];

  return {
    magneticFluxWb: fluxWb,
    dPhiDt,
    inducedEMF,
    inducedCurrent,
    powerDissipatedW,
    lenzOpposingFieldB,
  };
}

/**
 * Computes instantaneous AC / DC Dynamo Generator telemetry.
 */
export function computeDynamoTelemetry(
  params: DynamoParams,
  angleRad: number
): SimulationTelemetry {
  const omega = (params.rotationSpeedRPM * 2 * Math.PI) / 60; // rad/s
  const areaM2 = params.loopAreaCm2 * 1e-4;

  // Phi(t) = B * A * cos(theta)
  const instantaneousFluxWb = params.magneticFieldB * areaM2 * Math.cos(angleRad);
  // dPhi/dt = -B * A * omega * sin(theta)
  const dPhiDt = -params.magneticFieldB * areaM2 * omega * Math.sin(angleRad);

  // Peak EMF: E0 = N * B * A * omega
  const peakEMF = params.armatureTurns * params.magneticFieldB * areaM2 * omega;

  let instantaneousEMF: number;
  if (params.generatorType === "ac_slip_rings") {
    instantaneousEMF = peakEMF * Math.sin(angleRad);
  } else {
    // DC Split-Ring Commutator full-wave rectification
    instantaneousEMF = Math.abs(peakEMF * Math.sin(angleRad));
  }

  const vRMS = peakEMF / Math.SQRT2;
  const iRMS = vRMS / Math.max(1, params.loadResistance);
  const inducedCurrent = instantaneousEMF / Math.max(1, params.loadResistance);
  const powerDissipatedW = instantaneousEMF * inducedCurrent;

  return {
    magneticFluxWb: instantaneousFluxWb,
    dPhiDt,
    inducedEMF: instantaneousEMF,
    inducedCurrent,
    powerDissipatedW,
    lenzOpposingFieldB: 0,
    frequencyHz: params.rotationSpeedRPM / 60,
    vRMS,
    iRMS,
  };
}

/**
 * Computes Mutual Induction Transformer telemetry.
 */
export function computeTransformerTelemetry(
  params: TransformerParams,
  timeSec: number
): SimulationTelemetry {
  const omega = 2 * Math.PI * params.frequencyHz;
  const turnsRatio = params.secondaryTurnsNs / params.primaryTurnsNp;

  const vpPeak = params.primaryVoltageVp * Math.SQRT2;
  const vpInstantaneous = vpPeak * Math.sin(omega * timeSec);

  // Ideal transformer: Vs/Vp = Ns/Np * coupling
  const vsPeak = vpPeak * turnsRatio * params.coreCouplingK;
  const vsInstantaneous = vsPeak * Math.sin(omega * timeSec);
  const vsRMS = params.primaryVoltageVp * turnsRatio * params.coreCouplingK;

  const isRMS = vsRMS / Math.max(1, params.secondaryLoadResistance);
  const isInstantaneous = vsInstantaneous / Math.max(1, params.secondaryLoadResistance);

  const powerSecondaryW = vsRMS * isRMS;
  const efficiency = 0.96 * params.coreCouplingK;
  const powerPrimaryW = powerSecondaryW / efficiency;
  const ipRMS = powerPrimaryW / params.primaryVoltageVp;

  return {
    magneticFluxWb: (vpPeak / (params.primaryTurnsNp * omega)) * Math.cos(omega * timeSec),
    dPhiDt: -(vpPeak / params.primaryTurnsNp) * Math.sin(omega * timeSec),
    inducedEMF: vsInstantaneous,
    inducedCurrent: isInstantaneous,
    powerDissipatedW: vsInstantaneous * isInstantaneous,
    lenzOpposingFieldB: 0,
    frequencyHz: params.frequencyHz,
    vRMS: vsRMS,
    iRMS: isRMS,
    efficiency: efficiency * 100,
  };
}

/**
 * Computes single-step physical trajectory for Lenz's Law tube drop.
 */
export function stepEddyTubeDrop(
  params: EddyTubeParams,
  dt: number
): { position: number; velocity: number; acceleration: number; isFinished: boolean } {
  const g = 9.81; // m/s^2
  const massKg = 0.05; // 50g cylinder
  const tubeInfo = TUBE_CONDUCTIVITY[params.tubeMaterial];

  let dragCoeff = 0;
  if (params.droppedObject === "neodymium_magnet") {
    dragCoeff = tubeInfo.dragFactor * (params.magnetStrengthT / 1.2);
  }

  // F_net = m*g - dragCoeff * v
  const v = params.dropVelocity;
  const fDrag = dragCoeff * v;
  const a = Math.max(0, g - fDrag / massKg);

  const nextV = v + a * dt;
  const nextY = params.dropPosition + (nextV * dt) / params.tubeLengthM;

  const isFinished = nextY >= 1.0;

  return {
    position: isFinished ? 1.0 : nextY,
    velocity: isFinished ? 0 : nextV,
    acceleration: isFinished ? 0 : a,
    isFinished,
  };
}
