export type InductionMode = "linear_magnet" | "ac_dynamo" | "transformer" | "eddy_tube";

export type CoreMaterial = "air" | "soft_iron" | "ferrite";

export type LoadDevice = "lightbulb" | "galvanometer" | "buzzer";

export type GeneratorType = "ac_slip_rings" | "dc_commutator";

export type TubeMaterial = "copper" | "aluminum" | "acrylic";

export type DroppedObject = "neodymium_magnet" | "brass_slug";

export interface LinearMagnetParams {
  magnetX: number; // px along axis
  magnetY: number;
  magnetPolarity: "N-S" | "S-N";
  magnetStrengthB0: number; // Tesla (0.1 to 2.0 T)
  isOscillating: boolean; // Auto-plunger SHM
  oscillationFreq: number; // Hz (0.2 to 4.0 Hz)
  oscillationAmp: number; // px (30 to 140 px)
  coilTurns: number; // N (1 to 10)
  coilRadius: number; // mm (20 to 60)
  coilLength: number; // mm (40 to 100)
  coreMaterial: CoreMaterial;
  loadDevice: LoadDevice;
  loadResistance: number; // Ohms (1 to 50 Ω)
}

export interface DynamoParams {
  generatorType: GeneratorType;
  rotationSpeedRPM: number; // 0 to 3000 RPM
  magneticFieldB: number; // Tesla (0.1 to 2.0 T)
  armatureTurns: number; // 10 to 500 turns
  loopAreaCm2: number; // cm² (10 to 100)
  loadResistance: number; // Ohms
  isRunning: boolean;
}

export interface TransformerParams {
  primaryTurnsNp: number; // 50 to 500
  secondaryTurnsNs: number; // 20 to 1000
  primaryVoltageVp: number; // V RMS (10 to 240 V)
  frequencyHz: number; // 50 or 60 Hz or variable (10 to 200 Hz)
  coreCouplingK: number; // 0.5 to 1.0
  secondaryLoadResistance: number; // Ohms
}

export interface EddyTubeParams {
  tubeMaterial: TubeMaterial;
  droppedObject: DroppedObject;
  tubeLengthM: number; // 1.0 m
  magnetStrengthT: number; // 1.2 T
  isDropped: boolean;
  dropTime: number; // seconds elapsed
  dropPosition: number; // 0 to 1 (normalized height)
  dropVelocity: number; // m/s
}

export interface SimulationTelemetry {
  magneticFluxWb: number; // Magnetic Flux Φ_B (Wb)
  dPhiDt: number; // Wb/s
  inducedEMF: number; // Volts
  inducedCurrent: number; // Amperes
  powerDissipatedW: number; // Watts
  lenzOpposingFieldB: number; // Tesla
  frequencyHz?: number;
  vRMS?: number;
  iRMS?: number;
  efficiency?: number;
}

export interface ExperimentTrial {
  id: string;
  timestamp: string;
  mode: InductionMode;
  paramDescription: string;
  magneticFluxWb: number;
  peakEMF: number;
  currentA: number;
  powerW: number;
  notes: string;
}
