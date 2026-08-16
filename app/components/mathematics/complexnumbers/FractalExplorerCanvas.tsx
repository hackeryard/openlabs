"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FractalType,
  ColorPaletteId,
  ComplexNumber,
  FractalPreset,
} from "./types";
import {
  computeFractalEscape,
  computeOrbitTrajectory,
  getFractalColor,
  FRACTAL_PRESETS,
} from "./lib/complexMath";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Sliders,
  Palette,
  Crosshair,
  Download,
} from "lucide-react";

interface FractalExplorerCanvasProps {
  onFractalRendered?: () => void;
}

export default function FractalExplorerCanvas({
  onFractalRendered,
}: FractalExplorerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fractal parameters
  const [fractalType, setFractalType] = useState<FractalType>("mandelbrot");
  const [centerX, setCenterX] = useState<number>(-0.6);
  const [centerY, setCenterY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [maxIterations, setMaxIterations] = useState<number>(100);
  const [palette, setPalette] = useState<ColorPaletteId>("cosmic");
  const [juliaC, setJuliaC] = useState<ComplexNumber>({ re: -0.7, im: 0.27015 });

  // Orbit inspector
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [inspectOrbit, setInspectOrbit] = useState<ComplexNumber[]>([]);
  const [inspectClickPos, setInspectClickPos] = useState<{ x: number; y: number } | null>(null);

  // Pan dragging
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const centerStartRef = useRef<{ cx: number; cy: number }>({ cx: 0, cy: 0 });

  const width = 600;
  const height = 440;

  // Render fractal onto canvas
  const renderFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const scale = 3.0 / (zoom * Math.min(width, height));

    for (let py = 0; py < height; py++) {
      const y = centerY + (py - height / 2) * scale;

      for (let px = 0; px < width; px++) {
        const x = centerX + (px - width / 2) * scale;
        const pixelIdx = (py * width + px) * 4;

        const res = computeFractalEscape(x, y, fractalType, maxIterations, juliaC);
        const [r, g, b] = getFractalColor(res.smoothIter, maxIterations, palette);

        data[pixelIdx] = r;
        data[pixelIdx + 1] = g;
        data[pixelIdx + 2] = b;
        data[pixelIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw inspected orbit line overlay
    if (inspectOrbit.length > 1) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      inspectOrbit.forEach((pt, idx) => {
        const px = (pt.re - centerX) / scale + width / 2;
        const py = (pt.im - centerY) / scale + height / 2;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Points on orbit
      inspectOrbit.forEach((pt) => {
        const px = (pt.re - centerX) / scale + width / 2;
        const py = (pt.im - centerY) / scale + height / 2;
        ctx.fillStyle = "#ec4899";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [fractalType, centerX, centerY, zoom, maxIterations, palette, juliaC, inspectOrbit, width, height]);

  // Trigger render on state change
  useEffect(() => {
    renderFractal();
    onFractalRendered?.();
  }, [renderFractal, onFractalRendered]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.35 : 1 / 1.35;
    setZoom((z) => Math.max(0.2, Math.min(1e9, z * zoomFactor)));
  };

  // Pointer drag panning & inspect click
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (inspectMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const scale = 3.0 / (zoom * Math.min(width, height));
      const worldX = centerX + (clickX - width / 2) * scale;
      const worldY = centerY + (clickY - height / 2) * scale;

      const orbit = computeOrbitTrajectory(worldX, worldY, fractalType, 40, juliaC);
      setInspectOrbit(orbit);
      setInspectClickPos({ x: clickX, y: clickY });
      return;
    }

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    centerStartRef.current = { cx: centerX, cy: centerY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const scale = 3.0 / (zoom * Math.min(width, height));

    setCenterX(centerStartRef.current.cx - dx * scale);
    setCenterY(centerStartRef.current.cy - dy * scale);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleApplyPreset = (preset: FractalPreset) => {
    setFractalType(preset.fractalType);
    setCenterX(preset.centerX);
    setCenterY(preset.centerY);
    setZoom(preset.zoom);
    setMaxIterations(preset.maxIterations);
    if (preset.juliaC) setJuliaC(preset.juliaC);
    setInspectOrbit([]);
  };

  const handleResetView = () => {
    setInspectOrbit([]);
    if (fractalType === "mandelbrot") {
      setCenterX(-0.6);
      setCenterY(0);
      setZoom(1);
    } else if (fractalType === "burningship") {
      setCenterX(-0.45);
      setCenterY(-0.5);
      setZoom(1.2);
    } else {
      setCenterX(0);
      setCenterY(0);
      setZoom(1.2);
    }
  };

  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `fractal-${fractalType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: High-Performance Canvas (7 cols) ─────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Fractal Universe Engine ({fractalType.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInspectMode((m) => !m)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 ${
                inspectMode
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title="Click to inspect orbit path"
            >
              <Crosshair size={13} />
              <span>Orbit</span>
            </button>

            <button
              onClick={handleDownloadSnapshot}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Download PNG Snapshot"
            >
              <Download size={13} />
            </button>

            <button
              onClick={() => setZoom((z) => z * 1.5)}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Zoom In"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z / 1.5))}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Zoom Out"
            >
              <Minimize2 size={13} />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-black/50 rounded-2xl overflow-hidden border border-border/50">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`w-full h-full max-h-[460px] select-none ${
              inspectMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
            }`}
          />
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Zoom Magnification
            </span>
            <span className="font-mono font-black text-primary text-sm">
              {zoom >= 1000 ? `${(zoom / 1000).toFixed(1)}k×` : `${zoom.toFixed(1)}×`}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Complex Center (Re, Im)
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              ({centerX.toFixed(4)}, {centerY.toFixed(4)}i)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Detail Iterations
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {maxIterations}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Customization & Formula Parameters (5 cols) ─ */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Fractal Formula & Color Palette
            </span>
          </div>
        </div>

        {/* Fractal Equation Switcher */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Fractal Formula Type
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {(
              [
                ["mandelbrot", "Mandelbrot (z² + c)"],
                ["julia", "Julia Set (Fixed c)"],
                ["burningship", "Burning Ship (Ship)"],
                ["multibrot3", "Multibrot (z³ + c)"],
              ] as [FractalType, string][]
            ).map(([type, label]) => (
              <button
                key={type}
                onClick={() => {
                  setFractalType(type);
                  handleResetView();
                }}
                className={`p-2.5 rounded-xl text-left transition-all ${
                  fractalType === type
                    ? "bg-primary text-primary-foreground shadow-md font-black"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Selection */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Color Spectrum
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {(
              [
                ["cosmic", "Cosmic"],
                ["fire", "Fire"],
                ["emerald", "Emerald"],
                ["electric", "Electric"],
                ["rainbow", "Rainbow"],
                ["monochrome", "Mono"],
              ] as [ColorPaletteId, string][]
            ).map(([palId, label]) => (
              <button
                key={palId}
                onClick={() => setPalette(palId)}
                className={`py-1.5 rounded-xl text-center transition-all ${
                  palette === palId
                    ? "bg-primary text-primary-foreground shadow-sm font-black"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Iterations Slider */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Escape Iterations (Detail)</span>
            <span className="font-mono text-primary font-black">{maxIterations}</span>
          </div>
          <input
            type="range"
            min="30"
            max="350"
            step="10"
            value={maxIterations}
            onChange={(e) => setMaxIterations(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Julia Constant Sliders if Julia mode */}
        {fractalType === "julia" && (
          <div className="space-y-3 pt-2 border-t border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 block">
              Julia Seed Constant c = a + bi
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Re(c)</span>
                  <span className="font-mono">{juliaC.re.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.01"
                  value={juliaC.re}
                  onChange={(e) =>
                    setJuliaC({ ...juliaC, re: parseFloat(e.target.value) })
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Im(c)</span>
                  <span className="font-mono">{juliaC.im.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.01"
                  value={juliaC.im}
                  onChange={(e) =>
                    setJuliaC({ ...juliaC, im: parseFloat(e.target.value) })
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Famous Landmarks Presets */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Fractal Landmarks Gallery
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {FRACTAL_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 rounded-xl bg-muted hover:bg-accent border border-border text-left text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95 truncate"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
