import { ExactAngle, IdentityItem } from "../types";

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export function normalizeDeg(deg: number): number {
  let normalized = deg % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function getQuadrant(deg: number): 1 | 2 | 3 | 4 | "axis" {
  const norm = normalizeDeg(deg);
  if (norm === 0 || norm === 90 || norm === 180 || norm === 270) return "axis";
  if (norm > 0 && norm < 90) return 1;
  if (norm > 90 && norm < 180) return 2;
  if (norm > 180 && norm < 270) return 3;
  return 4;
}

export function getQuadrantRule(quadrant: 1 | 2 | 3 | 4 | "axis"): {
  title: string;
  positive: string[];
  mnemonic: string;
} {
  switch (quadrant) {
    case 1:
      return { title: "Quadrant I (0° to 90°)", positive: ["ALL (sin, cos, tan, sec, csc, cot) > 0"], mnemonic: "All (All positive)" };
    case 2:
      return { title: "Quadrant II (90° to 180°)", positive: ["sin > 0", "csc > 0"], mnemonic: "Silver / Students (Sine positive)" };
    case 3:
      return { title: "Quadrant III (180° to 270°)", positive: ["tan > 0", "cot > 0"], mnemonic: "Tea / Take (Tangent positive)" };
    case 4:
      return { title: "Quadrant IV (270° to 360°)", positive: ["cos > 0", "sec > 0"], mnemonic: "Cups / Calculus (Cosine positive)" };
    default:
      return { title: "Coordinate Axis", positive: ["Boundary between quadrants"], mnemonic: "Axis Intercept" };
  }
}

export const EXACT_ANGLES: ExactAngle[] = [
  { deg: 0, radStr: "0", radVal: 0, sinStr: "0", sinVal: 0, cosStr: "1", cosVal: 1, tanStr: "0", tanVal: 0, quadrant: "axis" },
  { deg: 30, radStr: "π/6", radVal: Math.PI / 6, sinStr: "1/2", sinVal: 0.5, cosStr: "√3/2", cosVal: Math.sqrt(3) / 2, tanStr: "√3/3", tanVal: 1 / Math.sqrt(3), quadrant: 1 },
  { deg: 45, radStr: "π/4", radVal: Math.PI / 4, sinStr: "√2/2", sinVal: Math.SQRT1_2, cosStr: "√2/2", cosVal: Math.SQRT1_2, tanStr: "1", tanVal: 1, quadrant: 1 },
  { deg: 60, radStr: "π/3", radVal: Math.PI / 3, sinStr: "√3/2", sinVal: Math.sqrt(3) / 2, cosStr: "1/2", cosVal: 0.5, tanStr: "√3", tanVal: Math.sqrt(3), quadrant: 1 },
  { deg: 90, radStr: "π/2", radVal: Math.PI / 2, sinStr: "1", sinVal: 1, cosStr: "0", cosVal: 0, tanStr: "undefined", tanVal: Infinity, quadrant: "axis" },
  { deg: 120, radStr: "2π/3", radVal: (2 * Math.PI) / 3, sinStr: "√3/2", sinVal: Math.sqrt(3) / 2, cosStr: "-1/2", cosVal: -0.5, tanStr: "-√3", tanVal: -Math.sqrt(3), quadrant: 2 },
  { deg: 135, radStr: "3π/4", radVal: (3 * Math.PI) / 4, sinStr: "√2/2", sinVal: Math.SQRT1_2, cosStr: "-√2/2", cosVal: -Math.SQRT1_2, tanStr: "-1", tanVal: -1, quadrant: 2 },
  { deg: 150, radStr: "5π/6", radVal: (5 * Math.PI) / 6, sinStr: "1/2", sinVal: 0.5, cosStr: "-√3/2", cosVal: -Math.sqrt(3) / 2, tanStr: "-√3/3", tanVal: -1 / Math.sqrt(3), quadrant: 2 },
  { deg: 180, radStr: "π", radVal: Math.PI, sinStr: "0", sinVal: 0, cosStr: "-1", cosVal: -1, tanStr: "0", tanVal: 0, quadrant: "axis" },
  { deg: 210, radStr: "7π/6", radVal: (7 * Math.PI) / 6, sinStr: "-1/2", sinVal: -0.5, cosStr: "-√3/2", cosVal: -Math.sqrt(3) / 2, tanStr: "√3/3", tanVal: 1 / Math.sqrt(3), quadrant: 3 },
  { deg: 225, radStr: "5π/4", radVal: (5 * Math.PI) / 4, sinStr: "-√2/2", sinVal: -Math.SQRT1_2, cosStr: "-√2/2", cosVal: -Math.SQRT1_2, tanStr: "1", tanVal: 1, quadrant: 3 },
  { deg: 240, radStr: "4π/3", radVal: (4 * Math.PI) / 3, sinStr: "-√3/2", sinVal: -Math.sqrt(3) / 2, cosStr: "-1/2", cosVal: -0.5, tanStr: "√3", tanVal: Math.sqrt(3), quadrant: 3 },
  { deg: 270, radStr: "3π/2", radVal: (3 * Math.PI) / 2, sinStr: "-1", sinVal: -1, cosStr: "0", cosVal: 0, tanStr: "undefined", tanVal: -Infinity, quadrant: "axis" },
  { deg: 300, radStr: "5π/3", radVal: (5 * Math.PI) / 3, sinStr: "-√3/2", sinVal: -Math.sqrt(3) / 2, cosStr: "1/2", cosVal: 0.5, tanStr: "-√3", tanVal: -Math.sqrt(3), quadrant: 4 },
  { deg: 315, radStr: "7π/4", radVal: (7 * Math.PI) / 4, sinStr: "-√2/2", sinVal: -Math.SQRT1_2, cosStr: "√2/2", cosVal: Math.SQRT1_2, tanStr: "-1", tanVal: -1, quadrant: 4 },
  { deg: 330, radStr: "11π/6", radVal: (11 * Math.PI) / 6, sinStr: "-1/2", sinVal: -0.5, cosStr: "√3/2", cosVal: Math.sqrt(3) / 2, tanStr: "-√3/3", tanVal: -1 / Math.sqrt(3), quadrant: 4 },
  { deg: 360, radStr: "2π", radVal: 2 * Math.PI, sinStr: "0", sinVal: 0, cosStr: "1", cosVal: 1, tanStr: "0", tanVal: 0, quadrant: "axis" },
];

export function findClosestExactAngle(deg: number, thresholdDeg = 3): ExactAngle | null {
  const norm = normalizeDeg(deg);
  for (const item of EXACT_ANGLES) {
    if (Math.abs(item.deg - norm) <= thresholdDeg || Math.abs(item.deg - (norm + 360)) <= thresholdDeg) {
      return item;
    }
  }
  return null;
}

export const IDENTITIES: IdentityItem[] = [
  {
    id: "pyth-1",
    name: "Pythagorean Primary",
    category: "pythagorean",
    formula: "sin²(θ) + cos²(θ) = 1",
    lhs: (deg) => {
      const r = degToRad(deg);
      return Math.sin(r) ** 2 + Math.cos(r) ** 2;
    },
    rhs: () => 1,
    description: "Fundamental trigonometric identity derived from the Pythagorean theorem on the unit circle (x² + y² = 1).",
  },
  {
    id: "pyth-2",
    name: "Tangent-Secant Relation",
    category: "pythagorean",
    formula: "1 + tan²(θ) = sec²(θ)",
    lhs: (deg) => {
      const r = degToRad(deg);
      const c = Math.cos(r);
      if (Math.abs(c) < 1e-6) return NaN;
      return 1 + Math.tan(r) ** 2;
    },
    rhs: (deg) => {
      const r = degToRad(deg);
      const c = Math.cos(r);
      if (Math.abs(c) < 1e-6) return NaN;
      return (1 / c) ** 2;
    },
    description: "Obtained by dividing the primary Pythagorean identity by cos²(θ).",
  },
  {
    id: "pyth-3",
    name: "Cotangent-Cosecant Relation",
    category: "pythagorean",
    formula: "1 + cot²(θ) = csc²(θ)",
    lhs: (deg) => {
      const r = degToRad(deg);
      const s = Math.sin(r);
      if (Math.abs(s) < 1e-6) return NaN;
      return 1 + (1 / Math.tan(r)) ** 2;
    },
    rhs: (deg) => {
      const r = degToRad(deg);
      const s = Math.sin(r);
      if (Math.abs(s) < 1e-6) return NaN;
      return (1 / s) ** 2;
    },
    description: "Obtained by dividing the primary Pythagorean identity by sin²(θ).",
  },
  {
    id: "double-sin",
    name: "Double Angle Sine",
    category: "doubleAngle",
    formula: "sin(2θ) = 2 · sin(θ) · cos(θ)",
    lhs: (deg) => {
      const r = degToRad(deg);
      return Math.sin(2 * r);
    },
    rhs: (deg) => {
      const r = degToRad(deg);
      return 2 * Math.sin(r) * Math.cos(r);
    },
    description: "Expands the sine of double the angle into product of sine and cosine.",
  },
  {
    id: "double-cos",
    name: "Double Angle Cosine",
    category: "doubleAngle",
    formula: "cos(2θ) = cos²(θ) − sin²(θ)",
    lhs: (deg) => {
      const r = degToRad(deg);
      return Math.cos(2 * r);
    },
    rhs: (deg) => {
      const r = degToRad(deg);
      return Math.cos(r) ** 2 - Math.sin(r) ** 2;
    },
    description: "Computes cosine of double angle from squared primary components.",
  },
  {
    id: "quotient-tan",
    name: "Quotient Identity",
    category: "quotient",
    formula: "tan(θ) = sin(θ) / cos(θ)",
    lhs: (deg) => {
      const r = degToRad(deg);
      const c = Math.cos(r);
      if (Math.abs(c) < 1e-6) return NaN;
      return Math.tan(r);
    },
    rhs: (deg) => {
      const r = degToRad(deg);
      const c = Math.cos(r);
      if (Math.abs(c) < 1e-6) return NaN;
      return Math.sin(r) / c;
    },
    description: "Definition of tangent as the ratio of sine over cosine.",
  },
];
