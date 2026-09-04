"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Globe,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MapPin,
  TrendingUp,
  X,
  Filter,
  Radio,
  Compass,
  Flame,
  Trophy,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { WORLD_COUNTRY_PATHS, WorldCountryPath } from "@/app/lib/geo/worldAtlas";
import { getFullCountryName, getContinentForCountry } from "@/app/lib/countries";

export interface GeoCountryData {
  country: string;
  code: string;
  count: number;
  percentage: number;
  continent?: string;
}

interface WorldMapAnalyticsProps {
  countries: GeoCountryData[];
  totalViews: number;
  onSelectCountry?: (countryCode: string | null) => void;
  selectedCountryCode?: string | null;
}

export default function WorldMapAnalytics({
  countries,
  totalViews,
  onSelectCountry,
  selectedCountryCode = null,
}: WorldMapAnalyticsProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [hoveredCountry, setHoveredCountry] = useState<{
    path: WorldCountryPath;
    data?: GeoCountryData;
    rank?: number;
    screenX: number;
    screenY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchMovingRef = useRef(false);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchZoomRef = useRef<number>(1);

  // Detect mobile viewport width (<640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fast map lookup by 2-letter ISO code & full country name
  const countryDataMap = useMemo(() => {
    const map = new Map<string, GeoCountryData>();
    countries.forEach((c) => {
      const codeUpper = (c.code || "").toUpperCase();
      map.set(codeUpper, c);
      map.set(c.country.toLowerCase(), c);
    });
    return map;
  }, [countries]);

  // Ranked countries list
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => b.count - a.count);
  }, [countries]);

  const countryRankMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedCountries.forEach((c, idx) => {
      const rank = idx + 1;
      if (c.code) map.set(c.code.toUpperCase(), rank);
      if (c.country) map.set(c.country.toLowerCase(), rank);
    });
    return map;
  }, [sortedCountries]);

  const maxViews = useMemo(() => {
    return countries.reduce((max, c) => Math.max(max, c.count), 1);
  }, [countries]);


  // Active wheel listener on canvas for mouse scroll and touchpad pinch-to-zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent browser page from scrolling while zooming map
      e.preventDefault();
      e.stopPropagation();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let zoomFactor = 1;
      if (e.ctrlKey) {
        // Touchpad pinch gesture
        zoomFactor = 1 - e.deltaY * 0.012;
      } else {
        // Mouse wheel or 2-finger trackpad scroll
        zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      }

      // Bound delta factor to avoid jarring jumps
      zoomFactor = Math.max(0.7, Math.min(1.4, zoomFactor));

      setZoom((prevZoom) => {
        const nextZoom = Math.min(4.5, Math.max(1.0, Number((prevZoom * zoomFactor).toFixed(2))));

        if (nextZoom <= 1.0) {
          setPan({ x: 0, y: 0 });
          return 1.0;
        }

        const cx = mouseX - rect.width / 2;
        const cy = mouseY - rect.height / 2;

        setPan((prevPan) => {
          const scaleRatio = nextZoom / prevZoom;
          const newPanX = cx - (cx - prevPan.x) * scaleRatio;
          const newPanY = cy - (cy - prevPan.y) * scaleRatio;

          const maxPanX = (rect.width / 2) * (nextZoom - 1);
          const maxPanY = (rect.height / 2) * (nextZoom - 1);

          return {
            x: Math.max(-maxPanX, Math.min(maxPanX, Math.round(newPanX))),
            y: Math.max(-maxPanY, Math.min(maxPanY, Math.round(newPanY))),
          };
        });

        return nextZoom;
      });
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Button Zoom Handlers
  const handleZoomIn = () => {
    setZoom((z) => Math.min(4.5, Number((z + 0.4).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1.0, Number((z - 0.4).toFixed(2)));
      if (next <= 1.0) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Double click on canvas to zoom in towards cursor
  const handleDoubleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setZoom((prevZoom) => {
      const nextZoom = prevZoom >= 3.5 ? 1.0 : Math.min(4.0, Number((prevZoom + 0.75).toFixed(2)));

      if (nextZoom <= 1.0) {
        setPan({ x: 0, y: 0 });
        return 1.0;
      }

      const cx = mouseX - rect.width / 2;
      const cy = mouseY - rect.height / 2;

      setPan((prevPan) => {
        const scaleRatio = nextZoom / prevZoom;
        const newPanX = cx - (cx - prevPan.x) * scaleRatio;
        const newPanY = cy - (cy - prevPan.y) * scaleRatio;

        const maxPanX = (rect.width / 2) * (nextZoom - 1);
        const maxPanY = (rect.height / 2) * (nextZoom - 1);

        return {
          x: Math.max(-maxPanX, Math.min(maxPanX, Math.round(newPanX))),
          y: Math.max(-maxPanY, Math.min(maxPanY, Math.round(newPanY))),
        };
      });

      return nextZoom;
    });
  };

  // Touch handlers for mobile/touchscreen: 1-finger drag pan (when zoomed) and 2-finger pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
      isTouchMovingRef.current = false;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = zoom;
      isTouchMovingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStartRef.current && zoom > 1) {
      isTouchMovingRef.current = true;
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const width = rect?.width || 960;
      const height = rect?.height || 500;

      const maxPanX = (width / 2) * (zoom - 1);
      const maxPanY = (height / 2) * (zoom - 1);

      const newPanX = e.touches[0].clientX - touchStartRef.current.x;
      const newPanY = e.touches[0].clientY - touchStartRef.current.y;

      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, Math.round(newPanX))),
        y: Math.max(-maxPanY, Math.min(maxPanY, Math.round(newPanY))),
      });
    } else if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      isTouchMovingRef.current = true;
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / initialPinchDistRef.current;
      const nextZoom = Math.min(4.5, Math.max(1.0, Number((initialPinchZoomRef.current * factor).toFixed(2))));

      setZoom(nextZoom);
      if (nextZoom <= 1.0) {
        setPan({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    initialPinchDistRef.current = null;
    setTimeout(() => {
      isTouchMovingRef.current = false;
    }, 60);
  };

  // Preset Continent Jumps
  const handleJumpToContinent = (region: "world" | "asia" | "europe" | "americas" | "africa") => {
    switch (region) {
      case "world":
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
        break;
      case "asia":
        setZoom(2.1);
        setPan({ x: -170, y: -20 });
        break;
      case "europe":
        setZoom(2.8);
        setPan({ x: -25, y: 70 });
        break;
      case "americas":
        setZoom(1.85);
        setPan({ x: 170, y: 20 });
        break;
      case "africa":
        setZoom(2.2);
        setPan({ x: -30, y: -40 });
        break;
    }
  };

  // Mouse pan/drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      if (hoveredCountry) setHoveredCountry(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Color interpolation for choropleth heatmap
  const getCountryFill = (iso2: string, countryName: string) => {
    const isSelected = selectedCountryCode && selectedCountryCode.toUpperCase() === iso2.toUpperCase();
    const data = countryDataMap.get(iso2) || countryDataMap.get(countryName.toLowerCase());

    if (isSelected) {
      return "url(#selected-neon-glow)";
    }

    if (!data || data.count === 0) {
      return "url(#empty-country-pattern)";
    }

    const ratio = Math.min(1, data.count / maxViews);

    // Luminescent neon cyan/sky gradient scale
    if (ratio > 0.70) return "#22d3ee"; // Cyan 400 (Peak)
    if (ratio > 0.40) return "#06b6d4"; // Cyan 500
    if (ratio > 0.20) return "#38bdf8"; // Sky 400
    if (ratio > 0.08) return "rgba(14, 165, 233, 0.65)"; // Sky 500
    return "rgba(14, 165, 233, 0.35)"; // Low Density
  };

  const handleCountryHover = (
    e: React.MouseEvent<SVGPathElement>,
    pathObj: WorldCountryPath
  ) => {
    if (isDragging || isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const data = countryDataMap.get(pathObj.iso2) || countryDataMap.get(pathObj.name.toLowerCase());
    const rank = countryRankMap.get(pathObj.iso2) || countryRankMap.get(pathObj.name.toLowerCase());

    setHoveredCountry({
      path: pathObj,
      data,
      rank,
      screenX: e.clientX - rect.left,
      screenY: e.clientY - rect.top,
    });
  };

  const handleCountryLeave = () => {
    if (isMobile) return;
    setHoveredCountry(null);
  };

  const handleClickCountry = (iso2: string) => {
    if (!onSelectCountry) return;
    if (selectedCountryCode?.toUpperCase() === iso2.toUpperCase()) {
      onSelectCountry(null);
    } else {
      onSelectCountry(iso2);
    }
  };

  // Mobile tap or desktop click on a country
  const handleCountryClick = (pathObj: WorldCountryPath, e: React.MouseEvent<SVGPathElement>) => {
    if (isTouchMovingRef.current) return;

    const data = countryDataMap.get(pathObj.iso2) || countryDataMap.get(pathObj.name.toLowerCase());
    const rank = countryRankMap.get(pathObj.iso2) || countryRankMap.get(pathObj.name.toLowerCase());

    if (isMobile) {
      // On mobile tap, open or toggle the inspection drawer
      setHoveredCountry({
        path: pathObj,
        data,
        rank,
        screenX: 0,
        screenY: 0,
      });
    } else {
      handleClickCountry(pathObj.iso2);
    }
  };

  // Dismiss mobile inspection card when tapping background / ocean
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isTouchMovingRef.current) return;
    if (isMobile && hoveredCountry) {
      const target = e.target as HTMLElement;
      if (target.tagName === "svg" || target.tagName === "rect" || target === canvasRef.current) {
        setHoveredCountry(null);
      }
    }
  };

  // Calculate position around the cursor for desktop (not directly under it, not in the corner)
  const tooltipStyle = useMemo(() => {
    if (!hoveredCountry || isDragging || isMobile) return { display: "none" };

    const canvas = canvasRef.current;
    const containerWidth = canvas?.clientWidth || 960;
    const containerHeight = canvas?.clientHeight || 480;
    const { screenX, screenY } = hoveredCountry;

    const cardWidth = 275;
    const cardHeight = 185;
    const offset = 22; // Clearance so card floats beside the cursor without being under it

    // Horizontal placement: right of cursor by default; flip to left if near right boundary
    let left = screenX + offset;
    let translateX = "0%";

    if (screenX + offset + cardWidth > containerWidth - 14) {
      left = screenX - offset;
      translateX = "-100%";
    }

    // Vertical placement: align centered relative to cursor
    let top = screenY - cardHeight / 2;

    // Clamp vertically inside map canvas bounds
    if (top < 12) {
      top = 12;
    } else if (top + cardHeight > containerHeight - 12) {
      top = containerHeight - cardHeight - 12;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      transform: `translate(${translateX}, 0)`,
    };
  }, [hoveredCountry, isDragging, isMobile]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-card border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-sm overflow-hidden flex flex-col space-y-3 sm:space-y-4"
    >
      {/* ── Top Header & Mission Control Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/20 via-sky-500/10 to-indigo-500/20 text-primary flex items-center justify-center border border-primary/30 shadow-inner shrink-0">
            <Globe size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black tracking-tight text-foreground truncate">
                Global Visitor Distribution
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                <Radio size={10} className="animate-pulse" /> Live Radar
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate sm:whitespace-normal">
              Interactive cartography tracking {countries.length} active nations (tap / pinch to zoom)
            </p>
          </div>
        </div>

        {/* Action Controls & Continent Presets */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Active Filter Indicator */}
          {selectedCountryCode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/15 text-primary text-xs font-bold border border-primary/30 shadow-xs shrink-0">
              <Filter size={11} />
              <span className="truncate max-w-[140px] sm:max-w-none">
                Filtered: {getFullCountryName(selectedCountryCode)} ({selectedCountryCode.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={() => onSelectCountry && onSelectCountry(null)}
                className="hover:text-primary-foreground hover:bg-primary rounded p-0.5 transition"
                title="Clear filter"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick Continent Selector */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border/80 rounded-xl text-xs font-bold overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => handleJumpToContinent("world")}
                className={`px-2 py-1 rounded-lg text-[11px] whitespace-nowrap transition ${
                  zoom === 1 ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                World
              </button>
              <button
                type="button"
                onClick={() => handleJumpToContinent("asia")}
                className="px-2 py-1 rounded-lg text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              >
                Asia-Pac
              </button>
              <button
                type="button"
                onClick={() => handleJumpToContinent("europe")}
                className="px-2 py-1 rounded-lg text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              >
                Europe
              </button>
              <button
                type="button"
                onClick={() => handleJumpToContinent("americas")}
                className="px-2 py-1 rounded-lg text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              >
                Americas
              </button>
              <button
                type="button"
                onClick={() => handleJumpToContinent("africa")}
                className="px-2 py-1 rounded-lg text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              >
                Africa
              </button>
            </div>

            {/* Zoom & Reset Controls */}
            <div className="flex items-center gap-1 p-1 bg-muted/60 border border-border rounded-xl shadow-xs shrink-0">
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 4.5}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <span className="text-[10px] font-mono font-bold px-1 text-muted-foreground min-w-[32px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <div className="w-[1px] h-3.5 bg-border mx-0.5" />
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition"
                title="Reset View"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── High-Tech Interactive SVG Map Canvas (Wheel / Pinch Zoom Enabled) ── */}
      <div
        ref={canvasRef}
        className={`relative w-full aspect-[16/10] sm:aspect-[2.05/1] min-h-[260px] sm:min-h-[460px] rounded-xl sm:rounded-2xl border border-border/80 overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#080d1a] via-[#050811] to-[#020408] shadow-2xl transition-all ${
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
        style={{
          touchAction: zoom > 1 ? "none" : "pan-y",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle Ambient Vignette & Radar Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] z-10" />

        {/* Floating Top-Left Status Badge (Desktop) */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-black/65 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[10px] font-mono font-semibold text-slate-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GEO-RADAR ONLINE</span>
            <span className="text-slate-500">|</span>
            <span className="text-white font-bold">{countries.length} REGIONS DETECTED</span>
          </div>
        </div>

        {/* Canvas Display Mode Toggles (Pins & Grid) */}
        <div className={`absolute bottom-3 left-3 z-20 flex items-center gap-1.5 ${isMobile && hoveredCountry ? "hidden" : "flex"}`}>
          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono border backdrop-blur-md transition ${
              showGrid
                ? "bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-xs"
                : "bg-black/50 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            Graticule Grid: {showGrid ? "ON" : "OFF"}
          </button>
        </div>

        {/* ── Inspection Card (Mobile Docked Drawer / Desktop Cursor Tooltip, Zero Emojis) ── */}
        {hoveredCountry && (
          <div
            className={`absolute z-40 transition-all duration-150 ease-out rounded-2xl bg-slate-950/96 text-slate-100 border border-slate-700/80 dark:border-slate-800 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 ${
              isMobile
                ? "bottom-2 inset-x-2 max-w-[360px] mx-auto pointer-events-auto"
                : "pointer-events-none w-[275px] sm:w-[285px]"
            }`}
            style={isMobile ? undefined : tooltipStyle}
          >
            {/* Top Glowing Accent Line */}
            <div
              className={`h-1.5 w-full ${
                hoveredCountry.data && hoveredCountry.data.percentage > 30
                  ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500"
                  : hoveredCountry.data && hoveredCountry.data.count > 0
                  ? "bg-gradient-to-r from-sky-400 to-blue-500"
                  : "bg-slate-700"
              }`}
            />

            <div className="p-3.5 space-y-3">
              {/* Header: Icon, Name, Continent, ISO Code, Rank, Close button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                    <Globe size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate tracking-tight">
                      {hoveredCountry.path.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Compass size={11} className="text-sky-400 shrink-0" />
                      <span className="truncate">
                        {hoveredCountry.data?.continent || getContinentForCountry(hoveredCountry.path.iso2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[10px] font-black text-sky-300">
                      {hoveredCountry.path.iso2}
                    </span>
                    {hoveredCountry.rank && (
                      <span className="text-[9px] font-bold font-mono text-emerald-400 flex items-center gap-1">
                        <Trophy size={10} className="text-amber-400" /> Rank #{hoveredCountry.rank}
                      </span>
                    )}
                  </div>

                  {isMobile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredCountry(null);
                      }}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      title="Close"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Telemetry Stats */}
              {hoveredCountry.data && hoveredCountry.data.count > 0 ? (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Total Audience
                      </div>
                      <div className="text-base font-black text-white font-mono flex items-center gap-1">
                        {hoveredCountry.data.count.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal">views</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Traffic Share
                      </div>
                      <div className="text-sm font-black text-cyan-400 font-mono">
                        {hoveredCountry.data.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(4, hoveredCountry.data.percentage))}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-300"
                    />
                  </div>

                  {/* Activity Classification Pill (Zero Emojis) */}
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                    <span className="text-slate-400 font-medium">Activity Tier:</span>
                    <span className="font-bold flex items-center gap-1 text-sky-300">
                      {hoveredCountry.rank === 1 ? (
                        <>
                          <Flame size={11} className="text-amber-400 animate-pulse" /> Primary Hub
                        </>
                      ) : hoveredCountry.data.percentage > 15 ? (
                        <>
                          <Sparkles size={11} className="text-cyan-400" /> High Activity
                        </>
                      ) : hoveredCountry.data.percentage > 3 ? (
                        <>
                          <TrendingUp size={11} className="text-emerald-400" /> Active Regional
                        </>
                      ) : (
                        <>
                          <Activity size={11} className="text-sky-400" /> Emerging Traffic
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-slate-400" />
                    <span>Inactive Territory</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Zero student or educator pageviews logged in active timeframe.
                  </p>
                </div>
              )}

              {/* Action CTA Prompt */}
              {selectedCountryCode?.toUpperCase() === hoveredCountry.path.iso2.toUpperCase() ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCountry) onSelectCountry(null);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-[10px] font-bold text-sky-300 transition"
                >
                  <span className="flex items-center gap-1">
                    <Filter size={11} /> Filter Applied
                  </span>
                  <span className="text-[9px] text-white underline">Tap to clear</span>
                </button>
              ) : hoveredCountry.data && hoveredCountry.data.count > 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCountry) onSelectCountry(hoveredCountry.path.iso2);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[10px] font-semibold text-sky-300 transition"
                >
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {isMobile ? "Filter dashboard by country" : "Click territory to filter dashboard"}
                  </span>
                  <ArrowRight size={11} />
                </button>
              ) : (
                <div className="text-[9px] text-center text-slate-500 font-mono">
                  Sovereign Territory &bull; {hoveredCountry.path.iso2}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main SVG Graphic */}
        <svg
          viewBox="0 0 960 500"
          className="w-full h-full transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <defs>
            {/* Ambient Background Grid Pattern */}
            <pattern id="grid-dots-dark" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.75" fill="rgba(56, 189, 248, 0.12)" />
            </pattern>

            {/* Inactive Country Translucent Surface */}
            <pattern id="empty-country-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="rgba(20, 30, 48, 0.65)" />
            </pattern>

            {/* Selected Nation Glowing Radiant Gradient */}
            <radialGradient id="selected-neon-glow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </radialGradient>

            {/* Filters for Bioluminescent Glow */}
            <filter id="hover-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Ambient Map Graticule Grid */}
          <rect width="960" height="500" fill="url(#grid-dots-dark)" />

          {/* Cartographic Parallels & Meridians (Equator, Tropics, Prime Meridian) */}
          {showGrid && (
            <g className="graticule-lines pointer-events-none opacity-40">
              {/* Arctic Circle 66.5° N */}
              <line x1="0" y1="80" x2="960" y2="80" stroke="rgba(56,189,248,0.2)" strokeDasharray="2 4" strokeWidth="0.75" />
              {/* Tropic of Cancer 23.5° N */}
              <line x1="0" y1="185" x2="960" y2="185" stroke="rgba(56,189,248,0.3)" strokeDasharray="3 4" strokeWidth="0.75" />
              {/* Equator 0° */}
              <line x1="0" y1="250" x2="960" y2="250" stroke="rgba(56,189,248,0.5)" strokeDasharray="4 4" strokeWidth="1" />
              {/* Tropic of Capricorn 23.5° S */}
              <line x1="0" y1="315" x2="960" y2="315" stroke="rgba(56,189,248,0.3)" strokeDasharray="3 4" strokeWidth="0.75" />
              {/* Antarctic Circle 66.5° S */}
              <line x1="0" y1="420" x2="960" y2="420" stroke="rgba(56,189,248,0.2)" strokeDasharray="2 4" strokeWidth="0.75" />

              {/* Prime Meridian & Major Longitude Meridians */}
              <line x1="240" y1="0" x2="240" y2="500" stroke="rgba(56,189,248,0.2)" strokeDasharray="3 4" strokeWidth="0.75" />
              <line x1="480" y1="0" x2="480" y2="500" stroke="rgba(56,189,248,0.5)" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="720" y1="0" x2="720" y2="500" stroke="rgba(56,189,248,0.2)" strokeDasharray="3 4" strokeWidth="0.75" />

              {/* Cartographic Coordinate Labels (Zero Emojis) */}
              <text x="8" y="246" fill="rgba(56,189,248,0.4)" fontSize="8" fontFamily="monospace">0 EQUATOR</text>
              <text x="8" y="181" fill="rgba(56,189,248,0.3)" fontSize="7" fontFamily="monospace">23.5N CANCER</text>
              <text x="8" y="327" fill="rgba(56,189,248,0.3)" fontSize="7" fontFamily="monospace">23.5S CAPRICORN</text>
              <text x="484" y="14" fill="rgba(56,189,248,0.4)" fontSize="8" fontFamily="monospace">0 MERIDIAN</text>
            </g>
          )}

          {/* ── Country Vector Polygons Layer ── */}
          <g className="countries-layer">
            {WORLD_COUNTRY_PATHS.map((c) => {
              const fill = getCountryFill(c.iso2, c.name);
              const isSelected = selectedCountryCode?.toUpperCase() === c.iso2.toUpperCase();
              const isHovered = hoveredCountry?.path.iso2 === c.iso2;
              const hasData = Boolean(countryDataMap.get(c.iso2) || countryDataMap.get(c.name.toLowerCase()));

              return (
                <path
                  key={c.iso2 || c.name}
                  d={c.d}
                  fill={fill}
                  stroke={
                    isSelected
                      ? "#38bdf8"
                      : isHovered
                      ? "#ffffff"
                      : hasData
                      ? "rgba(14, 165, 233, 0.4)"
                      : "rgba(71, 85, 105, 0.25)"
                  }
                  strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.45}
                  filter={isHovered ? "url(#hover-glow)" : undefined}
                  className={`transition-all duration-150 ${
                    hasData
                      ? "hover:brightness-135 cursor-pointer"
                      : "hover:fill-[rgba(45,60,85,0.7)] cursor-pointer"
                  }`}
                  onMouseMove={(e) => handleCountryHover(e, c)}
                  onMouseEnter={(e) => handleCountryHover(e, c)}
                  onMouseLeave={handleCountryLeave}
                  onClick={(e) => handleCountryClick(c, e)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* ── Choropleth Legend Bar & Summary Indicators (Zero Emojis) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 text-xs">
        {/* Heatmap Density Scale */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground overflow-x-auto no-scrollbar max-w-full">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0">
            Density:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground">0</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-slate-800/80 border border-slate-700" title="0 views / Inactive" />
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-[rgba(14,165,233,0.35)]" title="1-8% Low" />
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-[rgba(14,165,233,0.65)]" title="8-20% Moderate" />
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-[#38bdf8]" title="20-40% High" />
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-[#06b6d4]" title="40-70% Very High" />
              <span className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-[#22d3ee] shadow-xs" title="70-100% Peak Activity" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-foreground">
              Max ({maxViews.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Global Live Summary Indicators */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 font-mono text-[10px] sm:text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-foreground font-bold">{countries.length}</strong> Nations
          </span>
          <span className="text-muted-foreground/50">&bull;</span>
          <span className="flex items-center gap-1.5 truncate">
            <strong className="text-foreground font-bold">{totalViews.toLocaleString()}</strong> Sessions
          </span>
        </div>
      </div>
    </div>
  );
}
