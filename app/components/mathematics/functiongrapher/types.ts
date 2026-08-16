import { ParsedFunction } from "./lib/parser";
import { TransformParams } from "./lib/evaluator";
import { RootPoint, ExtremaPoint, TangentInfo, IntegralResult } from "./lib/analysis";

export interface GraphFunction {
  id: string;
  name: string; // e.g. "f(x)", "g(x)", "h(x)"
  rawExpression: string;
  parsed: ParsedFunction;
  color: string;
  isVisible: boolean;
  isPrimary: boolean;
  transform: TransformParams;
}

export interface DomainRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PinnedPoint {
  x: number;
  y: number;
  functionId: string;
  label?: string;
}

export interface GraphOverlayOptions {
  showGrid: boolean;
  showAxes: boolean;
  showRoots: boolean;
  showExtrema: boolean;
  showTangent: boolean;
  showIntegralShading: boolean;
}

export interface IntegralConfig {
  functionId: string;
  lowerBound: number;
  upperBound: number;
}

export const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#3b82f6", // Blue
];
