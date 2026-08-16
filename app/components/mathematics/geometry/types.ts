export type GeometryTabId =
  | "construction"
  | "triangle_centers"
  | "circle_theorems"
  | "pythagoras"
  | "transformations"
  | "polygons"
  | "solids3d";

export interface GeoPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  isFixed?: boolean;
}

export interface GeoSegment {
  id: string;
  p1: string; // point id
  p2: string; // point id
  color?: string;
  showLength?: boolean;
}

export interface GeoCircle {
  id: string;
  centerId: string;
  radiusPointId?: string;
  radius?: number;
  color?: string;
}

export type ConstructionTool =
  | "select"
  | "point"
  | "segment"
  | "line"
  | "circle"
  | "polygon"
  | "midpoint"
  | "perpendicular"
  | "delete";

export interface TriangleCenterResult {
  centroid: { x: number; y: number };
  circumcenter: { x: number; y: number; radius: number };
  incenter: { x: number; y: number; radius: number };
  orthocenter: { x: number; y: number };
  ninePointCenter: { x: number; y: number; radius: number };
  area: number;
  perimeter: number;
  sideLengths: { a: number; b: number; c: number };
  anglesDeg: { A: number; B: number; C: number };
  triangleType: string;
}

export type CircleTheoremType =
  | "inscribed_angle"
  | "semicircle_thales"
  | "same_segment"
  | "cyclic_quadrilateral"
  | "tangent_secant";

export type TransformationType = "translation" | "rotation" | "reflection" | "dilation";

export type PlatonicSolidType =
  | "tetrahedron"
  | "cube"
  | "octahedron"
  | "dodecahedron"
  | "icosahedron"
  | "cylinder"
  | "cone"
  | "sphere";

export interface SolidMetrics {
  name: string;
  vertices: number;
  edges: number;
  faces: number;
  eulerCharacteristic: number; // V - E + F = 2
  surfaceAreaFormula: string;
  volumeFormula: string;
  surfaceAreaValue: number;
  volumeValue: number;
}
