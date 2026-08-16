"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  Matrix2x2,
  Vector2D,
  TransformShapeType,
} from "./types";
import {
  calculateDeterminant,
  transformVector,
  calculateEigen,
  calculateSVD,
  interpolateMatrix,
  getShapeVertices,
  solveLinearSystem,
} from "./lib/linearMath";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Compass,
  Play,
  Pause,
  Layers,
  Circle,
  Square,
  Home,
  Target,
} from "lucide-react";

interface MatrixCanvasProps {
  matrix: Matrix2x2;
  onUpdateMatrix: (m: Matrix2x2) => void;
  tAnim: number;
  isAnimating: boolean;
  onToggleAnimation: () => void;
  activeShape: TransformShapeType;
  onChangeShape: (shape: TransformShapeType) => void;
  showOriginalGrid: boolean;
  showTransformedGrid: boolean;
  showUnitSquare: boolean;
  showBasisVectors: boolean;
  showEigenLines: boolean;
  showSVD: boolean;
  showCustomVector: boolean;
  customVector: Vector2D;
  onChangeCustomVector?: (v: Vector2D) => void;
  targetVectorB?: Vector2D;
  onChangeTargetB?: (b: Vector2D) => void;
  isSolvingSystem?: boolean;
}

export default function MatrixCanvas({
  matrix,
  onUpdateMatrix,
  tAnim,
  isAnimating,
  onToggleAnimation,
  activeShape,
  onChangeShape,
  showOriginalGrid,
  showTransformedGrid,
  showUnitSquare,
  showBasisVectors,
  showEigenLines,
  showSVD,
  showCustomVector,
  customVector,
  onChangeCustomVector,
  targetVectorB = { x: 2, y: 1 },
  onChangeTargetB,
  isSolvingSystem = false,
}: MatrixCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [draggingItem, setDraggingItem] = useState<"i" | "j" | "custom" | "targetB" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Active interpolated matrix M(t)
  const currentMatrix = useMemo(
    () => interpolateMatrix(matrix, tAnim),
    [matrix, tAnim]
  );

  const determinant = useMemo(() => calculateDeterminant(matrix), [matrix]);
  const eigen = useMemo(() => calculateEigen(matrix), [matrix]);
  const svd = useMemo(() => calculateSVD(matrix), [matrix]);

  // Linear system solution Ax = b
  const systemSolution = useMemo(
    () => solveLinearSystem(matrix, targetVectorB),
    [matrix, targetVectorB]
  );

  // Canvas bounds & coordinate scales
  const width = 600;
  const height = 450;
  const domainRadius = 4 / zoomLevel;

  const xScale = useCallback(
    (x: number) => ((x + domainRadius) / (2 * domainRadius)) * width,
    [domainRadius, width]
  );

  const yScale = useCallback(
    (y: number) => height - ((y + domainRadius) / (2 * domainRadius)) * height,
    [domainRadius, height]
  );

  const screenToWorld = useCallback(
    (clientX: number, clientY: number): Vector2D => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * width;
      const svgY = ((clientY - rect.top) / rect.height) * height;
      const worldX = (svgX / width) * (2 * domainRadius) - domainRadius;
      const worldY = -((svgY / height) * (2 * domainRadius) - domainRadius);
      return { x: worldX, y: worldY };
    },
    [domainRadius, width, height]
  );

  const originX = xScale(0);
  const originY = yScale(0);

  // Transformed basis vectors: i_hat = [a, c], j_hat = [b, d]
  const iHat = useMemo(
    () => transformVector(currentMatrix, { x: 1, y: 0 }),
    [currentMatrix]
  );
  const jHat = useMemo(
    () => transformVector(currentMatrix, { x: 0, y: 1 }),
    [currentMatrix]
  );

  // Transformed custom vector u -> Au
  const transformedU = useMemo(
    () => transformVector(currentMatrix, customVector),
    [currentMatrix, customVector]
  );

  // Transformed shape vertices
  const originalShapeVertices = useMemo(
    () => getShapeVertices(activeShape),
    [activeShape]
  );

  const transformedShapePoints = useMemo(() => {
    return originalShapeVertices
      .map((pt) => {
        const tPt = transformVector(currentMatrix, pt);
        return `${xScale(tPt.x).toFixed(1)},${yScale(tPt.y).toFixed(1)}`;
      })
      .join(" ");
  }, [originalShapeVertices, currentMatrix, xScale, yScale]);

  const originalShapePoints = useMemo(() => {
    return originalShapeVertices
      .map((pt) => `${xScale(pt.x).toFixed(1)},${yScale(pt.y).toFixed(1)}`)
      .join(" ");
  }, [originalShapeVertices, xScale, yScale]);

  // Transformed grid lines (lines of constant x and constant y)
  const transformedGridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const gridRange = 6;
    const lineExtent = 8;

    for (let c = -gridRange; c <= gridRange; c++) {
      const startV = transformVector(currentMatrix, { x: c, y: -lineExtent });
      const endV = transformVector(currentMatrix, { x: c, y: lineExtent });
      lines.push({
        x1: xScale(startV.x),
        y1: yScale(startV.y),
        x2: xScale(endV.x),
        y2: yScale(endV.y),
      });

      const startH = transformVector(currentMatrix, { x: -lineExtent, y: c });
      const endH = transformVector(currentMatrix, { x: lineExtent, y: c });
      lines.push({
        x1: xScale(startH.x),
        y1: yScale(startH.y),
        x2: xScale(endH.x),
        y2: yScale(endH.y),
      });
    }

    return lines;
  }, [currentMatrix, xScale, yScale]);

  // Pointer drag interactions
  const handlePointerDown = (itemType: "i" | "j" | "custom" | "targetB") => {
    setDraggingItem(itemType);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingItem) return;
    const world = screenToWorld(e.clientX, e.clientY);
    const snap = (v: number) => (Math.abs(v - Math.round(v)) < 0.08 ? Math.round(v) : v);

    const snappedX = Number(snap(world.x).toFixed(2));
    const snappedY = Number(snap(world.y).toFixed(2));

    if (draggingItem === "i") {
      onUpdateMatrix([
        [snappedX, matrix[0][1]],
        [snappedY, matrix[1][1]],
      ]);
    } else if (draggingItem === "j") {
      onUpdateMatrix([
        [matrix[0][0], snappedX],
        [matrix[1][0], snappedY],
      ]);
    } else if (draggingItem === "custom" && onChangeCustomVector) {
      onChangeCustomVector({ x: snappedX, y: snappedY });
    } else if (draggingItem === "targetB" && onChangeTargetB) {
      onChangeTargetB({ x: snappedX, y: snappedY });
    }
  };

  const handlePointerUp = () => {
    setDraggingItem(null);
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
      {/* ── Top Header Strip ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            2D Linear Transformation Plane
          </span>
        </div>

        {/* Shape Switcher Toolbar */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => onChangeShape("unit_square")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              activeShape === "unit_square"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Unit Square"
          >
            <Square size={13} />
          </button>
          <button
            onClick={() => onChangeShape("circle")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              activeShape === "circle"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Unit Circle -> Ellipse"
          >
            <Circle size={13} />
          </button>
          <button
            onClick={() => onChangeShape("house")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              activeShape === "house"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="House Polygon"
          >
            <Home size={13} />
          </button>
          <button
            onClick={() => onChangeShape("letter_f")}
            className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
              activeShape === "letter_f"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Letter F (Chirality Indicator)"
          >
            Letter F
          </button>
        </div>

        {/* Animation & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleAnimation}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isAnimating
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            {isAnimating ? <Pause size={13} /> : <Play size={13} />}
            <span>{isAnimating ? "Pause" : "Transform"}</span>
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z * 1.25, 3))}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Zoom In"
          >
            <Maximize2 size={13} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z / 1.25, 0.5))}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Zoom Out"
          >
            <Minimize2 size={13} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Reset Zoom"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* ── Interactive SVG Canvas ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative min-h-[340px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[460px] cursor-crosshair select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            <clipPath id="matrix-canvas-clip">
              <rect x="0" y="0" width={width} height={height} rx="20" ry="20" />
            </clipPath>
          </defs>

          <g clipPath="url(#matrix-canvas-clip)">
            {/* 1. Original Cartesian Grid (dashed gray) */}
            {showOriginalGrid && (
              <g className="opacity-20">
                {[-4, -3, -2, -1, 1, 2, 3, 4].map((t) => (
                  <g key={`orig-grid-${t}`}>
                    <line
                      x1={xScale(t)}
                      y1={0}
                      x2={xScale(t)}
                      y2={height}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={0}
                      y1={yScale(t)}
                      x2={width}
                      y2={yScale(t)}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </g>
                ))}
              </g>
            )}

            {/* 2. Transformed Warped Grid Lines */}
            {showTransformedGrid && (
              <g className="opacity-40">
                {transformedGridLines.map((ln, idx) => (
                  <line
                    key={`trans-grid-${idx}`}
                    x1={ln.x1}
                    y1={ln.y1}
                    x2={ln.x2}
                    y2={ln.y2}
                    stroke="#6366f1"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                ))}
              </g>
            )}

            {/* 3. Original Ghost Shape */}
            {showUnitSquare && (
              <polygon
                points={originalShapePoints}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* 4. Transformed Shape Area (Unit Square / Circle / House / Letter F) */}
            {showUnitSquare && (
              <polygon
                points={transformedShapePoints}
                fill={determinant < 0 ? "#f59e0b" : "#6366f1"}
                fillOpacity="0.25"
                stroke={determinant < 0 ? "#f59e0b" : "#6366f1"}
                strokeWidth="2"
              />
            )}

            {/* 5. Invariant Eigen-Lines (Purple dashed lines) */}
            {showEigenLines && eigen.hasRealEigenvalues && (
              <g className="opacity-80">
                {eigen.v1 && (
                  <line
                    x1={xScale(-eigen.v1.x * 6)}
                    y1={yScale(-eigen.v1.y * 6)}
                    x2={xScale(eigen.v1.x * 6)}
                    y2={yScale(eigen.v1.y * 6)}
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                )}
                {eigen.v2 && Math.abs(eigen.lambda1 - eigen.lambda2) > 0.01 && (
                  <line
                    x1={xScale(-eigen.v2.x * 6)}
                    y1={yScale(-eigen.v2.y * 6)}
                    x2={xScale(eigen.v2.x * 6)}
                    y2={yScale(eigen.v2.y * 6)}
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                )}
              </g>
            )}

            {/* 6. SVD Singular Value Principal Axes */}
            {showSVD && activeShape === "circle" && (
              <g>
                {/* Major Axis sigma1 * u1 */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(svd.sigma1 * svd.u1.x)}
                  y2={yScale(svd.sigma1 * svd.u1.y)}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x={xScale(svd.sigma1 * svd.u1.x) + 4}
                  y={yScale(svd.sigma1 * svd.u1.y) - 4}
                  className="fill-rose-500 font-mono text-[9px] font-bold"
                >
                  σ₁ = {svd.sigma1.toFixed(2)}
                </text>

                {/* Minor Axis sigma2 * u2 */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(svd.sigma2 * svd.u2.x)}
                  y2={yScale(svd.sigma2 * svd.u2.y)}
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x={xScale(svd.sigma2 * svd.u2.x) + 4}
                  y={yScale(svd.sigma2 * svd.u2.y) + 12}
                  className="fill-blue-500 font-mono text-[9px] font-bold"
                >
                  σ₂ = {svd.sigma2.toFixed(2)}
                </text>
              </g>
            )}

            {/* 7. Main Coordinate Axes */}
            <line
              x1={0}
              y1={originY}
              x2={width}
              y2={originY}
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
            <line
              x1={originX}
              y1={0}
              x2={originX}
              y2={height}
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="2"
            />

            {/* 8. Linear System Solver Visualizer: Ax = b */}
            {isSolvingSystem && (
              <g>
                {/* Target Vector b (Red) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(targetVectorB.x)}
                  y2={yScale(targetVectorB.y)}
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx={xScale(targetVectorB.x)}
                  cy={yScale(targetVectorB.y)}
                  r="7"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={() => handlePointerDown("targetB")}
                />
                <text
                  x={xScale(targetVectorB.x) + 8}
                  y={yScale(targetVectorB.y) - 6}
                  className="fill-rose-500 font-mono text-[10px] font-black"
                >
                  Target b ({targetVectorB.x.toFixed(2)}, {targetVectorB.y.toFixed(2)})
                </text>

                {/* Solution Vector x = A^-1 b (Gold) */}
                {systemSolution.solutionX && (
                  <>
                    <line
                      x1={originX}
                      y1={originY}
                      x2={xScale(systemSolution.solutionX.x)}
                      y2={yScale(systemSolution.solutionX.y)}
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={xScale(systemSolution.solutionX.x)}
                      cy={yScale(systemSolution.solutionX.y)}
                      r="5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={xScale(systemSolution.solutionX.x) + 8}
                      y={yScale(systemSolution.solutionX.y) + 12}
                      className="fill-amber-500 font-mono text-[9px] font-black"
                    >
                      Solution x ({systemSolution.solutionX.x.toFixed(2)}, {systemSolution.solutionX.y.toFixed(2)})
                    </text>
                  </>
                )}
              </g>
            )}

            {/* 9. Custom Test Vector u and transformed Au */}
            {showCustomVector && !isSolvingSystem && (
              <g>
                {/* Original vector u (dashed gray) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(customVector.x)}
                  y2={yScale(customVector.y)}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                  strokeOpacity="0.6"
                />
                {/* Transformed vector Au (Pink) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(transformedU.x)}
                  y2={yScale(transformedU.y)}
                  stroke="#ec4899"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle
                  cx={xScale(customVector.x)}
                  cy={yScale(customVector.y)}
                  r="7"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={() => handlePointerDown("custom")}
                />
                <text
                  x={xScale(transformedU.x) + 8}
                  y={yScale(transformedU.y) - 6}
                  className="fill-pink-500 font-mono text-[10px] font-black"
                >
                  Au ({transformedU.x.toFixed(2)}, {transformedU.y.toFixed(2)})
                </text>
              </g>
            )}

            {/* 10. Basis Vector î (Emerald [a, c]) */}
            {showBasisVectors && (
              <g>
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(iHat.x)}
                  y2={yScale(iHat.y)}
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle
                  cx={xScale(iHat.x)}
                  cy={yScale(iHat.y)}
                  r="7"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={() => handlePointerDown("i")}
                />
                <text
                  x={xScale(iHat.x) + 8}
                  y={yScale(iHat.y) + 4}
                  className="fill-emerald-500 font-mono text-[10px] font-black"
                >
                  î ({iHat.x.toFixed(2)}, {iHat.y.toFixed(2)})
                </text>
              </g>
            )}

            {/* 11. Basis Vector ĵ (Blue [b, d]) */}
            {showBasisVectors && (
              <g>
                <line
                  x1={originX}
                  y1={originY}
                  x2={xScale(jHat.x)}
                  y2={yScale(jHat.y)}
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle
                  cx={xScale(jHat.x)}
                  cy={yScale(jHat.y)}
                  r="7"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={() => handlePointerDown("j")}
                />
                <text
                  x={xScale(jHat.x) + 8}
                  y={yScale(jHat.y) - 6}
                  className="fill-blue-500 font-mono text-[10px] font-black"
                >
                  ĵ ({jHat.x.toFixed(2)}, {jHat.y.toFixed(2)})
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* ── Bottom Metric Strip ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-500 block">
            Basis Vector î
          </span>
          <span className="font-mono font-bold text-foreground">
            [{matrix[0][0]}, {matrix[1][0]}]ᵀ
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-blue-500 block">
            Basis Vector ĵ
          </span>
          <span className="font-mono font-bold text-foreground">
            [{matrix[0][1]}, {matrix[1][1]}]ᵀ
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Determinant (det A)
          </span>
          <span
            className={`font-mono font-bold text-sm ${
              determinant > 0
                ? "text-emerald-500"
                : determinant === 0
                ? "text-rose-500 font-black"
                : "text-amber-500"
            }`}
          >
            {determinant.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
            Area Scale Factor
          </span>
          <span className="font-mono font-bold text-primary">
            {Math.abs(determinant).toFixed(2)}×
          </span>
        </div>
      </div>
    </div>
  );
}
