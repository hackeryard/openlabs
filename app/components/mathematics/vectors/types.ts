export type VectorTabId =
  | "operations_2d"
  | "dot_product"
  | "cross_product_3d"
  | "triple_product"
  | "lines_planes_3d";

export interface Vector2D {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
}

export interface VectorOperation2DState {
  u: Vector2D;
  v: Vector2D;
  c1: number;
  c2: number;
  mode: "addition" | "subtraction" | "linear_combination";
  showParallelogram: boolean;
  showComponents: boolean;
  showUnitVectors: boolean;
}

export interface DotProductState {
  u: Vector2D;
  v: Vector2D;
  dotProduct: number;
  magnitudeU: number;
  magnitudeV: number;
  angleDeg: number;
  cosTheta: number;
  projection: Vector2D;
  rejection: Vector2D;
  classification: "acute" | "orthogonal" | "obtuse";
}

export interface CrossProduct3DState {
  u: Vector3D;
  v: Vector3D;
  crossProduct: Vector3D;
  magnitudeU: number;
  magnitudeV: number;
  magnitudeCross: number;
  angleDeg: number;
  parallelogramArea: number;
  triangleArea: number;
}

export interface TripleProductState {
  u: Vector3D;
  v: Vector3D;
  w: Vector3D;
  scalarTripleProduct: number;
  parallelepipedVolume: number;
  isCoplanar: boolean;
}

export interface Line3D {
  point: Vector3D; // point a
  direction: Vector3D; // direction vector d
}

export interface Plane3D {
  point: Vector3D; // point on plane P0
  normal: Vector3D; // normal vector n = (A, B, C)
  d: number; // Ax + By + Cz = D
}
