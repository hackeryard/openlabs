"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { VennMode, SetElement, SetConfig, PresetCollectionType } from "./types";
import {
  getElementRegion2Set,
  getElementRegion3Set,
  getPresetCollection,
  REGIONS_2SET,
  REGIONS_3SET,
} from "./lib/setMath";
import {
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Layers,
  Palette,
  Edit3,
} from "lucide-react";

interface VennDiagramCanvasProps {
  mode: VennMode;
  onChangeMode: (m: VennMode) => void;
  elements: SetElement[];
  onChangeElements: (elems: SetElement[]) => void;
  highlightedRegions: string[];
  onToggleRegion: (region: string) => void;
}

export default function VennDiagramCanvas({
  mode,
  onChangeMode,
  elements,
  onChangeElements,
  highlightedRegions,
  onToggleRegion,
}: VennDiagramCanvasProps) {
  const [newElemVal, setNewElemVal] = useState("");
  const [newInA, setNewInA] = useState(true);
  const [newInB, setNewInB] = useState(false);
  const [newInC, setNewInC] = useState(false);

  // Set Customization (names & colors)
  const [setConfig, setSetConfig] = useState<SetConfig>({
    nameA: "Set A",
    nameB: "Set B",
    nameC: "Set C",
    colorA: "#3b82f6",
    colorB: "#ec4899",
    colorC: "#10b981",
  });

  const [showConfig, setShowConfig] = useState(false);

  const activeRegionSet = useMemo(
    () => new Set(highlightedRegions),
    [highlightedRegions]
  );

  // Group elements into regions for visual distribution
  const elementsByRegion = useMemo(() => {
    const map: Record<string, SetElement[]> = {};
    const allRegions = mode === "2-set" ? REGIONS_2SET : REGIONS_3SET;
    allRegions.forEach((r) => (map[r] = []));

    elements.forEach((elem) => {
      const reg =
        mode === "2-set"
          ? getElementRegion2Set(elem.inA, elem.inB)
          : getElementRegion3Set(elem.inA, elem.inB, elem.inC || false);
      if (map[reg]) {
        map[reg].push(elem);
      }
    });

    return map;
  }, [elements, mode]);

  const handleAddElement = () => {
    if (!newElemVal.trim()) return;
    const newElem: SetElement = {
      id: `elem-${Date.now()}`,
      value: newElemVal.trim(),
      inA: newInA,
      inB: newInB,
      inC: mode === "3-set" ? newInC : false,
    };
    onChangeElements([...elements, newElem]);
    setNewElemVal("");
  };

  const handleDeleteElement = (id: string) => {
    onChangeElements(elements.filter((e) => e.id !== id));
  };

  const handleApplyPreset = (preset: PresetCollectionType) => {
    const data = getPresetCollection(preset);
    onChangeElements(data);
  };

  const width = 600;
  const height = 440;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive SVG Venn Canvas (7 cols) ──────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary truncate max-w-[260px]">
              {mode === "2-set" ? `2-Set Venn (${setConfig.nameA}, ${setConfig.nameB})` : `3-Set Venn (${setConfig.nameA}, ${setConfig.nameB}, ${setConfig.nameC})`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfig((c) => !c)}
              className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                showConfig
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title="Customize Set Names and Colors"
            >
              <Palette size={13} />
            </button>

            <button
              onClick={() => onChangeMode("2-set")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                mode === "2-set"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              2-Set
            </button>

            <button
              onClick={() => onChangeMode("3-set")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                mode === "3-set"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              3-Set
            </button>
          </div>
        </div>

        {/* Set Customization Bar */}
        {showConfig && (
          <div className="p-3 bg-muted/50 border border-border rounded-2xl mb-2 text-xs space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block">Set A Name</label>
                <input
                  type="text"
                  value={setConfig.nameA}
                  onChange={(e) => setSetConfig({ ...setConfig, nameA: e.target.value })}
                  className="w-full p-1.5 bg-background border border-border rounded-lg font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block">Set B Name</label>
                <input
                  type="text"
                  value={setConfig.nameB}
                  onChange={(e) => setSetConfig({ ...setConfig, nameB: e.target.value })}
                  className="w-full p-1.5 bg-background border border-border rounded-lg font-bold text-xs"
                />
              </div>
              {mode === "3-set" && (
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block">Set C Name</label>
                  <input
                    type="text"
                    value={setConfig.nameC}
                    onChange={(e) => setSetConfig({ ...setConfig, nameC: e.target.value })}
                    className="w-full p-1.5 bg-background border border-border rounded-lg font-bold text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* SVG Venn Diagram */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 overflow-hidden relative select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[440px]">
            {/* Universal Set Rectangle */}
            <rect
              x="20"
              y="20"
              width={width - 40}
              height={height - 40}
              rx="20"
              fill={activeRegionSet.has("outside") ? "#f59e0b35" : "transparent"}
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="cursor-pointer transition-colors hover:fill-amber-500/10"
              onClick={() => onToggleRegion("outside")}
            />
            <text x="35" y="45" className="fill-muted-foreground font-mono text-xs font-black">
              Universal Set U (Total: {elements.length})
            </text>

            {mode === "2-set" ? (
              /* ── 2-SET VENN DIAGRAM ── */
              <g>
                {/* Set A Circle */}
                <circle
                  cx="230"
                  cy="220"
                  r="135"
                  fill={setConfig.colorA}
                  fillOpacity={
                    activeRegionSet.has("A_only") || activeRegionSet.has("AB_intersect")
                      ? 0.35
                      : 0.12
                  }
                  stroke={setConfig.colorA}
                  strokeWidth="3"
                />

                {/* Set B Circle */}
                <circle
                  cx="370"
                  cy="220"
                  r="135"
                  fill={setConfig.colorB}
                  fillOpacity={
                    activeRegionSet.has("B_only") || activeRegionSet.has("AB_intersect")
                      ? 0.35
                      : 0.12
                  }
                  stroke={setConfig.colorB}
                  strokeWidth="3"
                />

                {/* Clickable Region Overlays */}
                <path
                  d="M 230 85 A 135 135 0 0 0 230 355 A 135 135 0 0 1 300 220 A 135 135 0 0 1 230 85 Z"
                  fill={activeRegionSet.has("A_only") ? setConfig.colorA : "transparent"}
                  fillOpacity={activeRegionSet.has("A_only") ? 0.45 : 0}
                  className="cursor-pointer transition-all hover:fill-blue-400/20"
                  onClick={() => onToggleRegion("A_only")}
                />

                <path
                  d="M 370 85 A 135 135 0 0 1 370 355 A 135 135 0 0 0 300 220 A 135 135 0 0 0 370 85 Z"
                  fill={activeRegionSet.has("B_only") ? setConfig.colorB : "transparent"}
                  fillOpacity={activeRegionSet.has("B_only") ? 0.45 : 0}
                  className="cursor-pointer transition-all hover:fill-pink-400/20"
                  onClick={() => onToggleRegion("B_only")}
                />

                <ellipse
                  cx="300"
                  cy="220"
                  rx="60"
                  ry="95"
                  fill={activeRegionSet.has("AB_intersect") ? "#8b5cf6" : "transparent"}
                  fillOpacity={activeRegionSet.has("AB_intersect") ? 0.5 : 0}
                  className="cursor-pointer transition-all hover:fill-purple-400/20"
                  onClick={() => onToggleRegion("AB_intersect")}
                />

                {/* Labels */}
                <text x="160" y="90" className="fill-blue-500 font-mono text-sm font-black">
                  {setConfig.nameA} ({elements.filter((e) => e.inA).length})
                </text>
                <text x="400" y="90" className="fill-pink-500 font-mono text-sm font-black">
                  {setConfig.nameB} ({elements.filter((e) => e.inB).length})
                </text>

                {/* Tokens */}
                <g transform="translate(180, 180)">
                  {elementsByRegion["A_only"]?.slice(0, 6).map((el, i) => (
                    <g key={el.id} transform={`translate(${(i % 2) * 38}, ${Math.floor(i / 2) * 26})`}>
                      <rect x="-16" y="-10" width="32" height="20" rx="6" fill={setConfig.colorA} />
                      <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>

                <g transform="translate(285, 180)">
                  {elementsByRegion["AB_intersect"]?.slice(0, 6).map((el, i) => (
                    <g key={el.id} transform={`translate(${(i % 2) * 30}, ${Math.floor(i / 2) * 26})`}>
                      <rect x="-14" y="-10" width="28" height="20" rx="6" fill="#8b5cf6" />
                      <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>

                <g transform="translate(390, 180)">
                  {elementsByRegion["B_only"]?.slice(0, 6).map((el, i) => (
                    <g key={el.id} transform={`translate(${(i % 2) * 38}, ${Math.floor(i / 2) * 26})`}>
                      <rect x="-16" y="-10" width="32" height="20" rx="6" fill={setConfig.colorB} />
                      <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>

                <g transform="translate(50, 360)">
                  {elementsByRegion["outside"]?.slice(0, 8).map((el, i) => (
                    <g key={el.id} transform={`translate(${i * 36}, 0)`}>
                      <rect x="-14" y="-10" width="28" height="20" rx="6" fill="#64748b" />
                      <text y="4" textAnchor="middle" className="fill-white font-mono text-[10px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>
              </g>
            ) : (
              /* ── 3-SET VENN DIAGRAM WITH ALL 8 CLICKABLE REGIONS ── */
              <g>
                {/* 3 Set Circles */}
                <circle cx="250" cy="180" r="115" fill={setConfig.colorA} fillOpacity={0.15} stroke={setConfig.colorA} strokeWidth="3" />
                <circle cx="350" cy="180" r="115" fill={setConfig.colorB} fillOpacity={0.15} stroke={setConfig.colorB} strokeWidth="3" />
                <circle cx="300" cy="260" r="115" fill={setConfig.colorC} fillOpacity={0.15} stroke={setConfig.colorC} strokeWidth="3" />

                {/* Region A_only click box */}
                <circle
                  cx="190"
                  cy="150"
                  r="35"
                  fill={activeRegionSet.has("A_only") ? setConfig.colorA : "transparent"}
                  fillOpacity={activeRegionSet.has("A_only") ? 0.5 : 0}
                  className="cursor-pointer transition-all hover:fill-blue-500/20"
                  onClick={() => onToggleRegion("A_only")}
                />

                {/* Region B_only click box */}
                <circle
                  cx="410"
                  cy="150"
                  r="35"
                  fill={activeRegionSet.has("B_only") ? setConfig.colorB : "transparent"}
                  fillOpacity={activeRegionSet.has("B_only") ? 0.5 : 0}
                  className="cursor-pointer transition-all hover:fill-pink-500/20"
                  onClick={() => onToggleRegion("B_only")}
                />

                {/* Region C_only click box */}
                <circle
                  cx="300"
                  cy="325"
                  r="35"
                  fill={activeRegionSet.has("C_only") ? setConfig.colorC : "transparent"}
                  fillOpacity={activeRegionSet.has("C_only") ? 0.5 : 0}
                  className="cursor-pointer transition-all hover:fill-emerald-500/20"
                  onClick={() => onToggleRegion("C_only")}
                />

                {/* Region AB_only click box */}
                <ellipse
                  cx="300"
                  cy="140"
                  rx="30"
                  ry="20"
                  fill={activeRegionSet.has("AB_only") ? "#8b5cf6" : "transparent"}
                  fillOpacity={activeRegionSet.has("AB_only") ? 0.6 : 0}
                  className="cursor-pointer transition-all hover:fill-purple-500/30"
                  onClick={() => onToggleRegion("AB_only")}
                />

                {/* Region AC_only click box */}
                <ellipse
                  cx="240"
                  cy="240"
                  rx="25"
                  ry="25"
                  fill={activeRegionSet.has("AC_only") ? "#06b6d4" : "transparent"}
                  fillOpacity={activeRegionSet.has("AC_only") ? 0.6 : 0}
                  className="cursor-pointer transition-all hover:fill-cyan-500/30"
                  onClick={() => onToggleRegion("AC_only")}
                />

                {/* Region BC_only click box */}
                <ellipse
                  cx="360"
                  cy="240"
                  rx="25"
                  ry="25"
                  fill={activeRegionSet.has("BC_only") ? "#f59e0b" : "transparent"}
                  fillOpacity={activeRegionSet.has("BC_only") ? 0.6 : 0}
                  className="cursor-pointer transition-all hover:fill-amber-500/30"
                  onClick={() => onToggleRegion("BC_only")}
                />

                {/* Center ABC_intersect badge */}
                <circle
                  cx="300"
                  cy="210"
                  r="24"
                  fill={activeRegionSet.has("ABC_intersect") ? "#8b5cf6" : "#6366f1"}
                  fillOpacity={activeRegionSet.has("ABC_intersect") ? 0.9 : 0.4}
                  className="cursor-pointer transition-all hover:scale-110 shadow-md"
                  onClick={() => onToggleRegion("ABC_intersect")}
                />
                <text x="300" y="214" textAnchor="middle" className="fill-white font-mono text-[9px] font-black pointer-events-none">
                  A∩B∩C
                </text>

                {/* Labels */}
                <text x="170" y="80" className="fill-blue-500 font-mono text-xs font-black">
                  {setConfig.nameA} ({elements.filter((e) => e.inA).length})
                </text>
                <text x="390" y="80" className="fill-pink-500 font-mono text-xs font-black">
                  {setConfig.nameB} ({elements.filter((e) => e.inB).length})
                </text>
                <text x="300" y="395" textAnchor="middle" className="fill-emerald-500 font-mono text-xs font-black">
                  {setConfig.nameC} ({elements.filter((e) => e.inC).length})
                </text>

                {/* 3-Set Region Tokens */}
                <g transform="translate(190, 140)">
                  {elementsByRegion["A_only"]?.slice(0, 3).map((el, i) => (
                    <g key={el.id} transform={`translate(0, ${i * 20})`}>
                      <rect x="-14" y="-8" width="28" height="16" rx="5" fill={setConfig.colorA} />
                      <text y="3" textAnchor="middle" className="fill-white font-mono text-[9px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>

                <g transform="translate(410, 140)">
                  {elementsByRegion["B_only"]?.slice(0, 3).map((el, i) => (
                    <g key={el.id} transform={`translate(0, ${i * 20})`}>
                      <rect x="-14" y="-8" width="28" height="16" rx="5" fill={setConfig.colorB} />
                      <text y="3" textAnchor="middle" className="fill-white font-mono text-[9px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>

                <g transform="translate(300, 315)">
                  {elementsByRegion["C_only"]?.slice(0, 3).map((el, i) => (
                    <g key={el.id} transform={`translate(${(i - 1) * 32}, 0)`}>
                      <rect x="-14" y="-8" width="28" height="16" rx="5" fill={setConfig.colorC} />
                      <text y="3" textAnchor="middle" className="fill-white font-mono text-[9px] font-black">{el.value}</text>
                    </g>
                  ))}
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Shading region chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">
            Toggle Shaded Regions:
          </span>
          {(mode === "2-set" ? REGIONS_2SET : REGIONS_3SET).map((reg) => (
            <button
              key={reg}
              onClick={() => onToggleRegion(reg)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                activeRegionSet.has(reg)
                  ? "bg-primary text-primary-foreground border-primary font-black shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Element Manager & Presets (5 cols) ───────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Set Elements ({elements.length} Items)
            </span>
          </div>
        </div>

        {/* Presets Gallery */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Load Element Collections
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {(
              [
                ["integers_1_to_10", "Integers 1 to 10"],
                ["primes_evens_multiples", "Primes & Evens"],
                ["student_activities", "Student Survey"],
                ["vowels_letters", "Vowels & Letters"],
                ["geometric_shapes", "Shapes Collection"],
              ] as [PresetCollectionType, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 bg-muted hover:bg-accent border border-border rounded-2xl text-left text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95 text-xs truncate"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Add custom element form */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-xs font-bold text-foreground block">
            Add Custom Element
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 42 or 'x'"
              value={newElemVal}
              onChange={(e) => setNewElemVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddElement()}
              className="flex-1 p-2 bg-muted border border-border rounded-xl font-mono text-xs font-bold text-foreground"
            />
            <button
              onClick={handleAddElement}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <label className="flex items-center gap-1 text-blue-500 cursor-pointer">
              <input
                type="checkbox"
                checked={newInA}
                onChange={(e) => setNewInA(e.target.checked)}
                className="rounded accent-blue-500"
              />
              <span>In {setConfig.nameA}</span>
            </label>

            <label className="flex items-center gap-1 text-pink-500 cursor-pointer">
              <input
                type="checkbox"
                checked={newInB}
                onChange={(e) => setNewInB(e.target.checked)}
                className="rounded accent-pink-500"
              />
              <span>In {setConfig.nameB}</span>
            </label>

            {mode === "3-set" && (
              <label className="flex items-center gap-1 text-emerald-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newInC}
                  onChange={(e) => setNewInC(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>In {setConfig.nameC}</span>
              </label>
            )}
          </div>
        </div>

        {/* Current Elements List */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Universal Set Elements
          </span>

          <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
            {elements.map((elem) => (
              <div
                key={elem.id}
                className="p-2 bg-muted/50 border border-border rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{elem.value}</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    {elem.inA && <span className="text-blue-500 font-bold">[A]</span>}
                    {elem.inB && <span className="text-pink-500 font-bold">[B]</span>}
                    {elem.inC && <span className="text-emerald-500 font-bold">[C]</span>}
                    {!elem.inA && !elem.inB && !elem.inC && (
                      <span className="text-muted-foreground">[Outside]</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteElement(elem.id)}
                  className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
