"use client";

import React, { useState } from "react";
import { DominanceModel } from "../types";

export interface PunnettCellData {
  g1: string; // Maternal gamete
  g2: string; // Paternal gamete
  genotype: string;
  phenotype: string;
  color?: string;
  isAneuploid?: boolean;
  ploidyLabel?: "2n+1" | "2n-1" | "2n";
  prob?: number;
  category?: string;
}

export interface PunnettGridEngineProps {
  gridSize?: 2 | 4;
  gametes1?: { label: string; count?: string }[]; // Maternal headers (left)
  gametes2?: { label: string; count?: string }[]; // Paternal headers (top)
  grid?: PunnettCellData[][];
  dominance?: DominanceModel;
  highlightCategory?: string | null;
  renderOrganismPreview?: (cell: PunnettCellData, size: number) => React.ReactNode;
  onCellClick?: (cell: PunnettCellData) => void;
}

export default function PunnettGridEngine({
  gridSize = 2,
  gametes1 = [],
  gametes2 = [],
  grid = [],
  dominance = "complete",
  highlightCategory,
  renderOrganismPreview,
  onCellClick,
}: PunnettGridEngineProps) {
  const [fusingCell, setFusingCell] = useState<{ r: number; c: number } | null>(null);

  // Trigger sperm-egg nuclear collision and fusion glow pulse
  const handleCellInteract = (r: number, c: number, cell: PunnettCellData) => {
    setFusingCell({ r, c });
    setTimeout(() => setFusingCell(null), 800);
    if (onCellClick) onCellClick(cell);
  };

  const safeGametes1 = gametes1 || [];
  const safeGametes2 = gametes2 || [];
  const safeGrid = grid || [];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-muted/20 rounded-3xl border border-border/60 select-none overflow-x-auto">
      <div
        className={`grid gap-2 text-center font-mono ${
          gridSize === 2 ? "grid-cols-3 min-w-[340px]" : "grid-cols-5 min-w-[480px]"
        }`}
      >
        {/* Top-Left Corner Header */}
        <div className="p-2 text-xs font-bold text-muted-foreground flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/30">
          <span className="text-[9px]">Egg \ Sperm</span>
        </div>

        {/* Paternal Gamete Columns (Top) */}
        {safeGametes2.map((g, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-2xl border bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shadow-sm"
          >
            <span className="text-base font-black">{g?.label || "?"}</span>
            {g?.count && <span className="text-[9px] font-bold opacity-80">{g.count}</span>}
          </div>
        ))}

        {/* Rows */}
        {safeGrid.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            {/* Maternal Gamete Header (Left) */}
            <div className="p-2.5 rounded-2xl border bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 flex flex-col items-center justify-center shadow-sm">
              <span className="text-base font-black">{safeGametes1[rIdx]?.label || "?"}</span>
              {safeGametes1[rIdx]?.count && (
                <span className="text-[9px] font-bold opacity-80">{safeGametes1[rIdx].count}</span>
              )}
            </div>

            {/* Grid Cells in Row */}
            {(row || []).map((cell, cIdx) => {
              if (!cell) return null;
              const isMatching = highlightCategory ? cell.category === highlightCategory : true;
              const isFusing = fusingCell?.r === rIdx && fusingCell?.c === cIdx;

              return (
                <div
                  key={cIdx}
                  onClick={() => handleCellInteract(rIdx, cIdx, cell)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer ${
                    isFusing
                      ? "ring-4 ring-primary scale-110 shadow-2xl bg-card z-20"
                      : isMatching
                      ? highlightCategory
                        ? "bg-card border-primary ring-2 ring-primary/60 scale-102 shadow-md"
                        : "bg-card border-border shadow-sm hover:scale-102"
                      : "bg-muted/20 border-border/30 opacity-20 scale-95"
                  } ${gridSize === 2 ? "min-h-[110px] min-w-[110px]" : "min-h-[72px]"}`}
                >
                  {/* Radiating Glow-Ring Pulse on Selection or Fusion */}
                  {isFusing && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/25 animate-ping pointer-events-none" />
                  )}

                  {/* Render Custom Organism SVG or Default Badge */}
                  {renderOrganismPreview ? (
                    renderOrganismPreview(cell, gridSize === 2 ? 48 : 30)
                  ) : (
                    <div
                      style={{ backgroundColor: cell.color || "#8b5cf6" }}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                    >
                      {cell.genotype ? cell.genotype[0] : "?"}
                    </div>
                  )}

                  <span className="text-xs font-black font-mono text-foreground mt-1 tracking-wider">
                    {cell.genotype || ""}
                  </span>

                  {cell.prob !== undefined && (
                    <span className="text-[8px] font-mono text-muted-foreground">
                      {(cell.prob * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
