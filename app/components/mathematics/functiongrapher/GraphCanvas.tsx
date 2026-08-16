"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { GraphFunction, DomainRange, PinnedPoint, GraphOverlayOptions, IntegralConfig } from "./types";
import { sampleFunction, evaluateAt, Point2D } from "./lib/evaluator";
import { RootPoint, ExtremaPoint, TangentInfo, numericalDerivative } from "./lib/analysis";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Crosshair, Sparkles } from "lucide-react";

interface GraphCanvasProps {
  functions: GraphFunction[];
  domain: DomainRange;
  onDomainChange: (newDomain: DomainRange) => void;
  overlays: GraphOverlayOptions;
  pinnedPoint: PinnedPoint | null;
  onPinPoint: (point: PinnedPoint | null) => void;
  hoveredX: number | null;
  onHoverX: (x: number | null) => void;
  roots: RootPoint[];
  extrema: ExtremaPoint[];
  tangentInfo: TangentInfo | null;
  integralConfig?: IntegralConfig | null;
}

export default function GraphCanvas({
  functions,
  domain,
  onDomainChange,
  overlays,
  pinnedPoint,
  onPinPoint,
  hoveredX,
  onHoverX,
  roots,
  extrema,
  tangentInfo,
  integralConfig,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // Track responsive container resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain([domain.xMin, domain.xMax]).range([0, width]);
  }, [domain.xMin, domain.xMax, width]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([domain.yMin, domain.yMax]).range([height, 0]);
  }, [domain.yMin, domain.yMax, height]);

  // Primary active function (for hover snapping and tangent line)
  const primaryFunc = useMemo(() => {
    return functions.find((f) => f.isPrimary && f.isVisible) || functions.find((f) => f.isVisible) || null;
  }, [functions]);

  // Generate SVG Path data for each visible function
  const functionPaths = useMemo(() => {
    const lineGen = d3
      .line<Point2D>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    return functions
      .filter((fn) => fn.isVisible && fn.parsed.isValid && fn.parsed.compiled)
      .map((fn) => {
        const segments = sampleFunction(fn.parsed.compiled, {
          xMin: domain.xMin - 1,
          xMax: domain.xMax + 1,
          sampleCount: Math.min(1200, Math.max(400, Math.floor(width * 1.5))),
          transform: fn.transform,
          yClampMin: domain.yMin - 50,
          yClampMax: domain.yMax + 50,
        });

        const pathStrings = segments
          .map((seg) => lineGen(seg))
          .filter((p): p is string => Boolean(p));

        return {
          id: fn.id,
          name: fn.name,
          color: fn.color,
          isPrimary: fn.isPrimary,
          pathStrings,
        };
      });
  }, [functions, domain, width, xScale, yScale]);

  // Generate Definite Integral Shaded Polygon
  const integralPolygonPath = useMemo(() => {
    if (!overlays.showIntegralShading || !integralConfig || !primaryFunc?.parsed.compiled) return null;
    const { lowerBound, upperBound } = integralConfig;
    const a = Math.min(lowerBound, upperBound);
    const b = Math.max(lowerBound, upperBound);

    if (a >= b) return null;

    const segments = sampleFunction(primaryFunc.parsed.compiled, {
      xMin: a,
      xMax: b,
      sampleCount: 200,
      transform: primaryFunc.transform,
    });

    if (segments.length === 0 || segments[0].length === 0) return null;

    const allPoints = segments.flat();
    if (allPoints.length === 0) return null;

    const first = allPoints[0];
    const last = allPoints[allPoints.length - 1];

    let d = `M ${xScale(first.x)} ${yScale(0)} `;
    d += `L ${xScale(first.x)} ${yScale(first.y)} `;

    for (let i = 1; i < allPoints.length; i++) {
      d += `L ${xScale(allPoints[i].x)} ${yScale(allPoints[i].y)} `;
    }

    d += `L ${xScale(last.x)} ${yScale(0)} Z`;
    return d;
  }, [overlays.showIntegralShading, integralConfig, primaryFunc, xScale, yScale]);

  // Generate Tangent Line Segment across the canvas
  const tangentLineCoords = useMemo(() => {
    if (!overlays.showTangent || !tangentInfo || !tangentInfo.isDefined) return null;

    const { x: x0, y: y0, slope: m } = tangentInfo;
    const xLeft = domain.xMin;
    const yLeft = y0 + m * (xLeft - x0);
    const xRight = domain.xMax;
    const yRight = y0 + m * (xRight - x0);

    return {
      x1: xScale(xLeft),
      y1: yScale(yLeft),
      x2: xScale(xRight),
      y2: yScale(yRight),
    };
  }, [overlays.showTangent, tangentInfo, domain, xScale, yScale]);

  // Grid Ticks
  const xTicks = useMemo(() => xScale.ticks(Math.max(6, Math.floor(width / 80))), [xScale, width]);
  const yTicks = useMemo(() => yScale.ticks(Math.max(6, Math.floor(height / 60))), [yScale, height]);

  // D3 Zoom handler
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 50])
      .filter((event) => {
        // Allow wheel zoom and mousedown drag with left click or touch
        return (!event.ctrlKey || event.type === "wheel") && !event.button;
      })
      .on("zoom", (event) => {
        const transform = event.transform;
        const newXScale = transform.rescaleX(xScale);
        const newYScale = transform.rescaleY(yScale);

        const newDomain: DomainRange = {
          xMin: Number(newXScale.domain()[0].toFixed(4)),
          xMax: Number(newXScale.domain()[1].toFixed(4)),
          yMin: Number(newYScale.domain()[0].toFixed(4)),
          yMax: Number(newYScale.domain()[1].toFixed(4)),
        };

        onDomainChange(newDomain);
      });

    // We do not bind direct continuous zoom listener here to avoid fighting React state,
    // but handle mouse interactions cleanly through native SVG pointer events.
  }, [xScale, yScale, onDomainChange]);

  // Mouse move handler for crosshair & tooltip
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    if (mouseX < 0 || mouseX > width) {
      onHoverX(null);
      return;
    }

    const mathX = xScale.invert(mouseX);
    onHoverX(mathX);
  };

  const handlePointerLeave = () => {
    onHoverX(null);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!primaryFunc || !primaryFunc.parsed.compiled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mathX = xScale.invert(mouseX);
    const mathY = evaluateAt(primaryFunc.parsed.compiled, mathX, primaryFunc.transform);

    if (!isNaN(mathY)) {
      onPinPoint({
        x: Number(mathX.toFixed(4)),
        y: Number(mathY.toFixed(4)),
        functionId: primaryFunc.id,
      });
    }
  };

  // Zoom Helpers
  const handleZoomIn = () => {
    const xSpan = (domain.xMax - domain.xMin) * 0.35;
    const ySpan = (domain.yMax - domain.yMin) * 0.35;
    const xMid = (domain.xMin + domain.xMax) / 2;
    const yMid = (domain.yMin + domain.yMax) / 2;

    onDomainChange({
      xMin: Number((xMid - xSpan).toFixed(4)),
      xMax: Number((xMid + xSpan).toFixed(4)),
      yMin: Number((yMid - ySpan).toFixed(4)),
      yMax: Number((yMid + ySpan).toFixed(4)),
    });
  };

  const handleZoomOut = () => {
    const xSpan = (domain.xMax - domain.xMin) * 0.7;
    const ySpan = (domain.yMax - domain.yMin) * 0.7;
    const xMid = (domain.xMin + domain.xMax) / 2;
    const yMid = (domain.yMin + domain.yMax) / 2;

    onDomainChange({
      xMin: Number((xMid - xSpan).toFixed(4)),
      xMax: Number((xMid + xSpan).toFixed(4)),
      yMin: Number((yMid - ySpan).toFixed(4)),
      yMax: Number((yMid + ySpan).toFixed(4)),
    });
  };

  const handleResetView = () => {
    onDomainChange({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
    });
  };

  // Compute active hover point coordinate
  const currentHoverData = useMemo(() => {
    if (hoveredX === null || !primaryFunc?.parsed.compiled) return null;
    const y = evaluateAt(primaryFunc.parsed.compiled, hoveredX, primaryFunc.transform);
    if (isNaN(y)) return null;

    return {
      x: hoveredX,
      y,
      px: xScale(hoveredX),
      py: yScale(y),
      color: primaryFunc.color,
      name: primaryFunc.name,
    };
  }, [hoveredX, primaryFunc, xScale, yScale]);

  const originX = xScale(0);
  const originY = yScale(0);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] bg-card border border-border rounded-3xl overflow-hidden select-none shadow-xl flex flex-col"
    >
      {/* Top Floating Mini-Bar: Quick Actions & Legend */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Function Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {functions
            .filter((f) => f.isVisible)
            .map((fn) => (
              <div
                key={fn.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all shadow-sm ${
                  fn.isPrimary
                    ? "bg-card/95 border-primary text-foreground ring-2 ring-primary/20 shadow-md"
                    : "bg-card/75 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: fn.color }}
                />
                <span className="font-mono">{fn.name}</span>
                {fn.isPrimary && (
                  <span className="text-[9px] uppercase px-1 rounded bg-primary/10 text-primary font-extrabold">
                    Active
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* Quick View Controls */}
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md p-1 rounded-2xl border border-border shadow-lg pointer-events-auto">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View ([-10, 10])"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
            aria-label="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Interactive D3 SVG Surface */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <defs>
          {/* Plot Area ClipPath to prevent curves overflowing border */}
          <clipPath id="plot-area-clip">
            <rect x="0" y="0" width={width} height={height} rx="24" ry="24" />
          </clipPath>

          {/* Integral Shading Linear Gradient */}
          <linearGradient id="integral-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <g clipPath="url(#plot-area-clip)">
          {/* 1. Background Grid Lines */}
          {overlays.showGrid && (
            <g className="grid-layer opacity-40">
              {/* Vertical Grid Lines */}
              {xTicks.map((tick) => {
                const xPos = xScale(tick);
                const isOrigin = tick === 0;
                return (
                  <line
                    key={`grid-x-${tick}`}
                    x1={xPos}
                    y1={0}
                    x2={xPos}
                    y2={height}
                    stroke="currentColor"
                    strokeWidth={isOrigin ? 0 : 1}
                    className="text-border"
                    strokeDasharray={isOrigin ? undefined : "3 3"}
                  />
                );
              })}

              {/* Horizontal Grid Lines */}
              {yTicks.map((tick) => {
                const yPos = yScale(tick);
                const isOrigin = tick === 0;
                return (
                  <line
                    key={`grid-y-${tick}`}
                    x1={0}
                    y1={yPos}
                    x2={width}
                    y2={yPos}
                    stroke="currentColor"
                    strokeWidth={isOrigin ? 0 : 1}
                    className="text-border"
                    strokeDasharray={isOrigin ? undefined : "3 3"}
                  />
                );
              })}
            </g>
          )}

          {/* 2. Integral Shaded Polygon */}
          {integralPolygonPath && (
            <g className="integral-area-layer">
              <path
                d={integralPolygonPath}
                fill="url(#integral-gradient)"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="transition-all duration-300"
              />
            </g>
          )}

          {/* 3. Coordinate Axes (X & Y) */}
          {overlays.showAxes && (
            <g className="axes-layer text-muted-foreground font-mono text-[10px]">
              {/* X-Axis Line (y = 0) */}
              {originY >= 0 && originY <= height && (
                <g>
                  <line
                    x1={0}
                    y1={originY}
                    x2={width}
                    y2={originY}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-foreground/70"
                  />
                  {/* X-Axis Tick Labels */}
                  {xTicks
                    .filter((t) => t !== 0)
                    .map((tick) => (
                      <text
                        key={`x-label-${tick}`}
                        x={xScale(tick)}
                        y={Math.min(Math.max(originY + 14, 16), height - 8)}
                        textAnchor="middle"
                        className="fill-muted-foreground font-semibold select-none"
                      >
                        {tick}
                      </text>
                    ))}
                </g>
              )}

              {/* Y-Axis Line (x = 0) */}
              {originX >= 0 && originX <= width && (
                <g>
                  <line
                    x1={originX}
                    y1={0}
                    x2={originX}
                    y2={height}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-foreground/70"
                  />
                  {/* Y-Axis Tick Labels */}
                  {yTicks
                    .filter((t) => t !== 0)
                    .map((tick) => (
                      <text
                        key={`y-label-${tick}`}
                        x={Math.min(Math.max(originX + 8, 8), width - 24)}
                        y={yScale(tick) + 3}
                        textAnchor="start"
                        className="fill-muted-foreground font-semibold select-none"
                      >
                        {tick}
                      </text>
                    ))}
                </g>
              )}

              {/* Origin (0,0) Label */}
              {originX >= 0 && originX <= width && originY >= 0 && originY <= height && (
                <g>
                  <circle cx={originX} cy={originY} r="3" className="fill-foreground/80" />
                  <text
                    x={originX + 6}
                    y={originY + 12}
                    className="fill-muted-foreground font-bold text-[9px]"
                  >
                    0
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 4. Function Curves */}
          <g className="functions-layer">
            {functionPaths.map((fn) => (
              <g key={fn.id}>
                {fn.pathStrings.map((pathD, idx) => (
                  <path
                    key={`fn-${fn.id}-seg-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={fn.color}
                    strokeWidth={fn.isPrimary ? 3.5 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-200"
                  />
                ))}
              </g>
            ))}
          </g>

          {/* 5. Tangent Line */}
          {tangentLineCoords && (
            <g className="tangent-layer">
              <line
                x1={tangentLineCoords.x1}
                y1={tangentLineCoords.y1}
                x2={tangentLineCoords.x2}
                y2={tangentLineCoords.y2}
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
            </g>
          )}

          {/* 6. Extrema Markers */}
          {overlays.showExtrema && (
            <g className="extrema-markers-layer">
              {extrema.map((ex, idx) => {
                const px = xScale(ex.x);
                const py = yScale(ex.y);
                if (px < 0 || px > width || py < 0 || py > height) return null;
                const isMax = ex.type === "maximum";

                return (
                  <g key={`extrema-${idx}`} className="group/extrema cursor-pointer">
                    <polygon
                      points={
                        isMax
                          ? `${px},${py - 6} ${px - 5},${py + 4} ${px + 5},${py + 4}`
                          : `${px},${py + 6} ${px - 5},${py - 4} ${px + 5},${py - 4}`
                      }
                      className="fill-amber-500 stroke-card stroke-2"
                    />
                    <text
                      x={px}
                      y={isMax ? py - 10 : py + 16}
                      textAnchor="middle"
                      className="fill-amber-500 font-mono text-[9px] font-black pointer-events-none"
                    >
                      {ex.formatted}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. Roots Markers */}
          {overlays.showRoots && (
            <g className="roots-markers-layer">
              {roots.map((rt, idx) => {
                const px = xScale(rt.x);
                const py = yScale(0);
                if (px < 0 || px > width || py < 0 || py > height) return null;

                return (
                  <g key={`root-${idx}`} className="group/root cursor-pointer">
                    <circle
                      cx={px}
                      cy={py}
                      r="4.5"
                      className="fill-emerald-500 stroke-card stroke-2"
                    />
                    <text
                      x={px}
                      y={py - 10}
                      textAnchor="middle"
                      className="fill-emerald-500 font-mono text-[9px] font-black pointer-events-none"
                    >
                      x={rt.x}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 8. Pinned Point Marker */}
          {pinnedPoint && (
            <g className="pinned-marker-layer">
              {(() => {
                const px = xScale(pinnedPoint.x);
                const py = yScale(pinnedPoint.y);
                if (px < 0 || px > width || py < 0 || py > height) return null;
                return (
                  <g>
                    <circle cx={px} cy={py} r="6" className="fill-purple-500 stroke-white stroke-2" />
                    <rect
                      x={px + 8}
                      y={py - 24}
                      width={100}
                      height={22}
                      rx="6"
                      className="fill-card stroke-border stroke"
                    />
                    <text
                      x={px + 14}
                      y={py - 9}
                      className="fill-foreground font-mono text-[10px] font-black select-none"
                    >
                      ({pinnedPoint.x}, {pinnedPoint.y})
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 9. Crosshair & Hover Snapped Inspection Point */}
          {currentHoverData && (
            <g className="hover-inspector-layer pointer-events-none">
              {/* Vertical Crosshair Line */}
              <line
                x1={currentHoverData.px}
                y1={0}
                x2={currentHoverData.px}
                y2={height}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="text-muted-foreground/60"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={0}
                y1={currentHoverData.py}
                x2={width}
                y2={currentHoverData.py}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="text-muted-foreground/60"
              />

              {/* Snapped Point Dot */}
              <circle
                cx={currentHoverData.px}
                cy={currentHoverData.py}
                r="6"
                fill={currentHoverData.color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Floating Hover Badge Readout (Bottom Right) */}
      {currentHoverData && (
        <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-md border border-border px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-3 font-mono text-xs pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentHoverData.color }}
            />
            <span className="text-muted-foreground">{currentHoverData.name}:</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span>x = {currentHoverData.x.toFixed(3)}</span>
            <span className="text-muted-foreground">•</span>
            <span>y = {currentHoverData.y.toFixed(3)}</span>
          </div>
        </div>
      )}

      {/* Click-to-Pin Helper Hint (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-border shadow-sm flex items-center gap-1.5 pointer-events-none">
        <Crosshair size={12} className="text-primary animate-spin [animation-duration:8s]" />
        <span>Click canvas to pin point • Scroll to zoom • Drag to pan</span>
      </div>
    </div>
  );
}
