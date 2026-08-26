export type ThermodynamicCycle = "carnot" | "otto" | "diesel" | "stirling";
export type WorkingGas = "monatomic" | "diatomic" | "polyatomic";
export type DiagramType = "pv" | "ts";

export interface CycleParameters {
  cycleType: ThermodynamicCycle;
  tempHotK: number; // 350 to 1200 K
  tempColdK: number; // 200 to 450 K
  compressionRatio: number; // 4 to 24
  workingGas: WorkingGas;
  moleCount: number; // mol (0.5 to 2.0)
  rpmSpeed: number; // 10 to 300 RPM
  diagramMode: DiagramType;
}

export interface CycleTelemetry {
  currentStroke: number; // 0 to 3
  strokeProgress: number; // 0 to 1
  strokeName: string;
  currentP_kPa: number;
  currentV_L: number;
  currentT_K: number;
  currentS_J_K: number;
  efficiencyPercent: number;
  carnotMaxEfficiency: number;
  netWorkJoules: number;
  heatInJoules: number;
  heatOutJoules: number;
  pistonHeightPx: number;
}
