import {
  Vector2D,
  Vector3D,
  DotProductState,
  CrossProduct3DState,
  TripleProductState,
  Line3D,
  Plane3D,
} from "../types";

export function magnitude2D(v: Vector2D): number {
  return Math.hypot(v.x, v.y);
}

export function magnitude3D(v: Vector3D): number {
  return Math.hypot(v.x, v.y, v.z);
}

export function angle2DDeg(v: Vector2D): number {
  let deg = (Math.atan2(v.y, v.x) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function dotProduct2D(u: Vector2D, v: Vector2D): number {
  return u.x * v.x + u.y * v.y;
}

export function dotProduct3D(u: Vector3D, v: Vector3D): number {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function crossProduct3D(u: Vector3D, v: Vector3D): Vector3D {
  return {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };
}

/**
 * Calculates 2D Dot Product & Orthogonal Projection
 */
export function computeDotProductState(u: Vector2D, v: Vector2D): DotProductState {
  const magU = magnitude2D(u);
  const magV = magnitude2D(v);
  const dot = dotProduct2D(u, v);

  let cosTheta = 1;
  let angleDeg = 0;

  if (magU > 0 && magV > 0) {
    cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
    angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
  }

  // Projection of u onto v: (u . v / |v|^2) * v
  let projScale = 0;
  if (magV > 0) {
    projScale = dot / (magV * magV);
  }

  const projection: Vector2D = {
    x: projScale * v.x,
    y: projScale * v.y,
  };

  const rejection: Vector2D = {
    x: u.x - projection.x,
    y: u.y - projection.y,
  };

  let classification: "acute" | "orthogonal" | "obtuse" = "acute";
  if (Math.abs(angleDeg - 90) < 0.5) {
    classification = "orthogonal";
  } else if (angleDeg > 90.5) {
    classification = "obtuse";
  }

  return {
    u,
    v,
    dotProduct: dot,
    magnitudeU: magU,
    magnitudeV: magV,
    angleDeg,
    cosTheta,
    projection,
    rejection,
    classification,
  };
}

/**
 * Calculates 3D Cross Product & Geometric Areas
 */
export function computeCrossProduct3DState(u: Vector3D, v: Vector3D): CrossProduct3DState {
  const magU = magnitude3D(u);
  const magV = magnitude3D(v);
  const cross = crossProduct3D(u, v);
  const magCross = magnitude3D(cross);

  let angleDeg = 0;
  if (magU > 0 && magV > 0) {
    const dot = dotProduct3D(u, v);
    const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
    angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
  }

  const parallelogramArea = magCross;
  const triangleArea = magCross / 2;

  return {
    u,
    v,
    crossProduct: cross,
    magnitudeU: magU,
    magnitudeV: magV,
    magnitudeCross: magCross,
    angleDeg,
    parallelogramArea,
    triangleArea,
  };
}

/**
 * Computes Scalar Triple Product [u, v, w] = u . (v x w) and Parallelepiped Volume
 */
export function computeTripleProductState(
  u: Vector3D,
  v: Vector3D,
  w: Vector3D
): TripleProductState {
  const vCrossW = crossProduct3D(v, w);
  const stp = dotProduct3D(u, vCrossW);
  const volume = Math.abs(stp);
  const isCoplanar = Math.abs(stp) < 1e-4;

  return {
    u,
    v,
    w,
    scalarTripleProduct: stp,
    parallelepipedVolume: volume,
    isCoplanar,
  };
}

/**
 * 3D isometric/perspective projection to 2D screen coordinate
 */
export function project3DTo2D(
  v: Vector3D,
  rotX = 25,
  rotY = 35,
  origin = { x: 300, y: 220 },
  scale = 1.0
): { x: number; y: number; z: number } {
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  // Rotate around Y-axis
  const x1 = v.x * cosY + v.z * sinY;
  const z1 = -v.x * sinY + v.z * cosY;

  // Rotate around X-axis (invert Y for standard math orientation: +Y goes up)
  const mathY = -v.y;
  const y2 = mathY * cosX - z1 * sinX;
  const z2 = mathY * sinX + z1 * cosX;

  return {
    x: origin.x + x1 * scale,
    y: origin.y + y2 * scale,
    z: z2,
  };
}

/**
 * Distance from point P to plane Ax + By + Cz = D
 */
export function pointToPlaneDistance(p: Vector3D, plane: Plane3D): number {
  const num = Math.abs(
    plane.normal.x * p.x +
      plane.normal.y * p.y +
      plane.normal.z * p.z -
      plane.d
  );
  const denom = magnitude3D(plane.normal);
  return denom > 0 ? num / denom : 0;
}
