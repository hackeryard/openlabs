import { GeoPoint, TriangleCenterResult, SolidMetrics, PlatonicSolidType } from "../types";

export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function midpoint(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * Calculates interior angle at vertex V between rays (V->P1) and (V->P2) in degrees
 */
export function calculateAngleDeg(
  p1: { x: number; y: number },
  vertex: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);

  if (mag1 === 0 || mag2 === 0) return 0;
  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}

/**
 * Generates an SVG path for an angle arc at a vertex
 */
export function createAngleArcSvg(
  p1: { x: number; y: number },
  vertex: { x: number; y: number },
  p2: { x: number; y: number },
  radius = 24
): { pathD: string; textX: number; textY: number } {
  const ang1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const ang2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);

  let diff = ang2 - ang1;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;

  const startAng = ang1;
  const endAng = ang1 + diff;

  const startX = vertex.x + radius * Math.cos(startAng);
  const startY = vertex.y + radius * Math.sin(startAng);
  const endX = vertex.x + radius * Math.cos(endAng);
  const endY = vertex.y + radius * Math.sin(endAng);

  const sweep = diff > 0 ? 1 : 0;
  const largeArc = Math.abs(diff) > Math.PI ? 1 : 0;

  const midAng = (startAng + endAng) / 2;
  const textX = vertex.x + (radius + 14) * Math.cos(midAng);
  const textY = vertex.y + (radius + 14) * Math.sin(midAng);

  const pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${endX} ${endY}`;
  return { pathD, textX, textY };
}

/**
 * Computes all triangle centers, circumcircle, incircle, Euler line, and 9-point circle
 */
export function computeTriangleCenters(
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number }
): TriangleCenterResult {
  const a = distance(B, C);
  const b = distance(A, C);
  const c = distance(A, B);

  const perimeter = a + b + c;
  const s = perimeter / 2;

  const areaSq = s * (s - a) * (s - b) * (s - c);
  const area = Math.sqrt(Math.max(0, areaSq));

  const angleA =
    Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))) *
    (180 / Math.PI);
  const angleB =
    Math.acos(Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c)))) *
    (180 / Math.PI);
  const angleC = Math.max(0, 180 - angleA - angleB);

  const centroid = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  const incenter = {
    x: (a * A.x + b * B.x + c * C.x) / Math.max(1e-6, perimeter),
    y: (a * A.y + b * B.y + c * C.y) / Math.max(1e-6, perimeter),
    radius: perimeter > 0 ? area / s : 0,
  };

  const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  let circumcenter = { x: centroid.x, y: centroid.y, radius: 0 };

  if (Math.abs(D) > 1e-4) {
    const ox =
      ((A.x * A.x + A.y * A.y) * (B.y - C.y) +
        (B.x * B.x + B.y * B.y) * (C.y - A.y) +
        (C.x * C.x + C.y * C.y) * (A.y - B.y)) /
      D;
    const oy =
      ((A.x * A.x + A.y * A.y) * (C.x - B.x) +
        (B.x * B.x + B.y * B.y) * (A.x - C.x) +
        (C.x * C.x + C.y * C.y) * (B.x - A.x)) /
      D;
    circumcenter = {
      x: ox,
      y: oy,
      radius: (a * b * c) / Math.max(1e-6, 4 * area),
    };
  }

  const orthocenter = {
    x: 3 * centroid.x - 2 * circumcenter.x,
    y: 3 * centroid.y - 2 * circumcenter.y,
  };

  const ninePointCenter = {
    x: (circumcenter.x + orthocenter.x) / 2,
    y: (circumcenter.y + orthocenter.y) / 2,
    radius: circumcenter.radius / 2,
  };

  let triangleType = "Scalene Acute";
  const maxAngle = Math.max(angleA, angleB, angleC);
  if (Math.abs(angleA - 60) < 1 && Math.abs(angleB - 60) < 1) {
    triangleType = "Equilateral";
  } else if (Math.abs(maxAngle - 90) < 0.5) {
    triangleType = "Right-Angled";
  } else if (maxAngle > 90.5) {
    triangleType = "Obtuse-Angled";
  } else if (
    Math.abs(a - b) < 2 ||
    Math.abs(b - c) < 2 ||
    Math.abs(a - c) < 2
  ) {
    triangleType = "Isosceles Acute";
  }

  return {
    centroid,
    circumcenter,
    incenter,
    orthocenter,
    ninePointCenter,
    area,
    perimeter,
    sideLengths: { a, b, c },
    anglesDeg: { A: angleA, B: angleB, C: angleC },
    triangleType,
  };
}

/**
 * 2D transformation
 */
export function transformPoint(
  p: { x: number; y: number },
  type: "translation" | "rotation" | "reflection" | "dilation",
  params: {
    dx?: number;
    dy?: number;
    angleDeg?: number;
    center?: { x: number; y: number };
    scale?: number;
    reflectAxis?: "x" | "y" | "y=x";
  }
): { x: number; y: number } {
  const center = params.center || { x: 300, y: 220 };

  switch (type) {
    case "translation":
      return {
        x: p.x + (params.dx || 0),
        y: p.y + (params.dy || 0),
      };

    case "rotation": {
      const rad = ((params.angleDeg || 0) * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
      };
    }

    case "reflection": {
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      if (params.reflectAxis === "x") {
        return { x: p.x, y: center.y - dy };
      } else if (params.reflectAxis === "y") {
        return { x: center.x - dx, y: p.y };
      } else {
        return { x: center.x + dy, y: center.y + dx };
      }
    }

    case "dilation": {
      const k = params.scale ?? 1.5;
      return {
        x: center.x + (p.x - center.x) * k,
        y: center.y + (p.y - center.y) * k,
      };
    }
  }
}

/**
 * Regular n-gon vertices
 */
export function generateRegularPolygonVertices(
  n: number,
  radius: number,
  cx = 300,
  cy = 220
): { x: number; y: number }[] {
  const vertices: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    vertices.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return vertices;
}

/**
 * 3D Solid Geometry Vertices and Projection
 */
export function get3DSolidData(
  solid: PlatonicSolidType,
  size = 100,
  rotX = 30,
  rotY = 45
): {
  projectedVertices: { x: number; y: number; z: number }[];
  edges: [number, number][];
  metrics: SolidMetrics;
} {
  let v3D: [number, number, number][] = [];
  let edges: [number, number][] = [];
  let metrics: SolidMetrics = {
    name: "Cube",
    vertices: 8,
    edges: 12,
    faces: 6,
    eulerCharacteristic: 2,
    surfaceAreaFormula: "6a²",
    volumeFormula: "a³",
    surfaceAreaValue: 6 * Math.pow(size / 50, 2),
    volumeValue: Math.pow(size / 50, 3),
  };

  const a = size / 2;

  switch (solid) {
    case "tetrahedron":
      v3D = [
        [a, a, a],
        [-a, -a, a],
        [-a, a, -a],
        [a, -a, -a],
      ];
      edges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [1, 3], [2, 3],
      ];
      metrics = {
        name: "Regular Tetrahedron",
        vertices: 4,
        edges: 6,
        faces: 4,
        eulerCharacteristic: 2,
        surfaceAreaFormula: "√3 a²",
        volumeFormula: "a³ / (6√2)",
        surfaceAreaValue: Math.sqrt(3) * Math.pow((size * Math.sqrt(2)) / 50, 2),
        volumeValue: (Math.pow((size * Math.sqrt(2)) / 50, 3)) / (6 * Math.sqrt(2)),
      };
      break;

    case "octahedron":
      v3D = [
        [a * 1.3, 0, 0],
        [-a * 1.3, 0, 0],
        [0, a * 1.3, 0],
        [0, -a * 1.3, 0],
        [0, 0, a * 1.3],
        [0, 0, -a * 1.3],
      ];
      edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];
      metrics = {
        name: "Regular Octahedron",
        vertices: 6,
        edges: 12,
        faces: 8,
        eulerCharacteristic: 2,
        surfaceAreaFormula: "2√3 a²",
        volumeFormula: "(√2 / 3) a³",
        surfaceAreaValue: 2 * Math.sqrt(3) * Math.pow(size / 50, 2),
        volumeValue: (Math.sqrt(2) / 3) * Math.pow(size / 50, 3),
      };
      break;

    case "cylinder":
      // Cylinder represented with two 8-point circles
      for (let i = 0; i < 8; i++) {
        const rad = (i * 2 * Math.PI) / 8;
        v3D.push([a * Math.cos(rad), a * Math.sin(rad), -a * 1.2]); // bottom
        v3D.push([a * Math.cos(rad), a * Math.sin(rad), a * 1.2]); // top
      }
      for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        edges.push([i * 2, next * 2]); // bottom ring
        edges.push([i * 2 + 1, next * 2 + 1]); // top ring
        edges.push([i * 2, i * 2 + 1]); // pillar
      }
      metrics = {
        name: "Right Circular Cylinder",
        vertices: 16,
        edges: 24,
        faces: 3,
        eulerCharacteristic: 2,
        surfaceAreaFormula: "2πrh + 2πr²",
        volumeFormula: "πr²h",
        surfaceAreaValue: 2 * Math.PI * (size / 100) * (size / 50) + 2 * Math.PI * Math.pow(size / 100, 2),
        volumeValue: Math.PI * Math.pow(size / 100, 2) * (size / 50),
      };
      break;

    case "cube":
    default:
      v3D = [
        [-a, -a, -a],
        [a, -a, -a],
        [a, a, -a],
        [-a, a, -a],
        [-a, -a, a],
        [a, -a, a],
        [a, a, a],
        [-a, a, a],
      ];
      edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // back face
        [4, 5], [5, 6], [6, 7], [7, 4], // front face
        [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
      ];
      break;
  }

  // 3D rotation projection
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;
  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  const projectedVertices = v3D.map(([x, y, z]) => {
    // Rotate Y
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    // Rotate X
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Project onto 2D screen center (300, 220)
    return {
      x: 300 + x1,
      y: 220 + y2,
      z: z2,
    };
  });

  return { projectedVertices, edges, metrics };
}
