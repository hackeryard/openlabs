"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  Box,
  Users,
} from "lucide-react";

export default function PigeonholeCanvas() {
  const [activeTab, setActiveTab] = useState<"pigeonhole" | "ramsey">("pigeonhole");

  // Pigeonhole State
  const [numItems, setNumItems] = useState<number>(10);
  const [numHoles, setNumHoles] = useState<number>(4);
  const [distribution, setDistribution] = useState<number[]>([3, 3, 2, 2]);

  // Ramsey R(3, 3) = 6 Graph State
  // 6 vertices (0..5), 15 edges with color: "red" | "blue"
  const [edgeColors, setEdgeColors] = useState<Record<string, "red" | "blue">>({
    "0-1": "red", "0-2": "red", "0-3": "red", "0-4": "blue", "0-5": "blue",
    "1-2": "blue", "1-3": "blue", "1-4": "red", "1-5": "red",
    "2-3": "blue", "2-4": "red", "2-5": "red",
    "3-4": "blue", "3-5": "blue",
    "4-5": "red",
  });

  const dirichletBound = Math.ceil(numItems / numHoles);

  const distribute = (mode: "uniform" | "random") => {
    const newDist = Array(numHoles).fill(0);
    if (mode === "uniform") {
      for (let i = 0; i < numItems; i++) {
        newDist[i % numHoles]++;
      }
    } else if (mode === "random") {
      for (let i = 0; i < numItems; i++) {
        const randHole = Math.floor(Math.random() * numHoles);
        newDist[randHole]++;
      }
    }
    setDistribution(newDist);
  };

  // Ramsey K6 Vertex Positions on Circle
  const ramseyNodes = useMemo(() => {
    const nodes = [];
    const r = 100;
    const cx = 200;
    const cy = 160;
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
      nodes.push({
        id: i,
        label: `P${i + 1}`,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    return nodes;
  }, []);

  const toggleEdgeColor = (u: number, v: number) => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    const curr = edgeColors[key] || "red";
    setEdgeColors({
      ...edgeColors,
      [key]: curr === "red" ? "blue" : "red",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Canvas (7 cols) ───────────────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "pigeonhole"
                ? `Dirichlet Pigeonhole (${numItems} Items, ${numHoles} Boxes)`
                : "Ramsey Party Theorem R(3, 3) = 6"}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
            <button
              onClick={() => setActiveTab("pigeonhole")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pigeonhole"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pigeonholes
            </button>
            <button
              onClick={() => setActiveTab("ramsey")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ramsey"
                  ? "bg-primary text-primary-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ramsey Graph R(3, 3)
            </button>
          </div>
        </div>

        {activeTab === "pigeonhole" ? (
          /* ── Pigeonhole View ── */
          <div className="flex-1 min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 flex flex-col justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: numHoles }).map((_, hIdx) => {
                const count = distribution[hIdx] || 0;
                const hasExceeded = count >= dirichletBound;

                return (
                  <div
                    key={`hole-${hIdx}`}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[110px] transition-all ${
                      hasExceeded
                        ? "bg-primary/10 border-primary shadow-md"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full text-xs font-bold">
                      <span className="text-muted-foreground font-mono">Box #{hIdx + 1}</span>
                      <span className="font-mono text-primary font-black">{count}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 flex-wrap my-2">
                      {Array.from({ length: count }).map((_, pIdx) => (
                        <div
                          key={pIdx}
                          className="w-5 h-5 rounded-full bg-indigo-500 shadow-sm border border-white flex items-center justify-center text-[9px] text-white font-black"
                        >
                          🕊️
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 w-full justify-center">
                      <button
                        onClick={() => {
                          if (count > 0) {
                            const nd = [...distribution];
                            nd[hIdx]--;
                            setDistribution(nd);
                            setNumItems((prev) => Math.max(1, prev - 1));
                          }
                        }}
                        className="w-5 h-5 rounded bg-muted hover:bg-accent text-xs font-bold flex items-center justify-center text-muted-foreground"
                      >
                        -
                      </button>
                      <button
                        onClick={() => {
                          const nd = [...distribution];
                          nd[hIdx]++;
                          setDistribution(nd);
                          setNumItems((prev) => prev + 1);
                        }}
                        className="w-5 h-5 rounded bg-muted hover:bg-accent text-xs font-bold flex items-center justify-center text-muted-foreground"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
              <button
                onClick={() => distribute("uniform")}
                className="px-3 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all"
              >
                Distribute Uniformly
              </button>
              <button
                onClick={() => distribute("random")}
                className="px-3 py-1.5 bg-muted text-foreground hover:bg-accent border border-border font-bold text-xs rounded-xl transition-all"
              >
                Random Scatter
              </button>
            </div>
          </div>
        ) : (
          /* ── Ramsey R(3, 3) = 6 Graph View ── */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] bg-muted/20 rounded-2xl border border-border/50 p-4 select-none">
            <svg viewBox="0 0 400 320" className="w-full h-full max-h-[320px]">
              {/* Edges of K6 */}
              {ramseyNodes.map((u, i) =>
                ramseyNodes.slice(i + 1).map((v) => {
                  const key = `${u.id}-${v.id}`;
                  const color = edgeColors[key] || "red";

                  return (
                    <line
                      key={key}
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={color === "red" ? "#ef4444" : "#3b82f6"}
                      strokeWidth="2.5"
                      className="cursor-pointer hover:stroke-amber-400 transition-colors"
                      onClick={() => toggleEdgeColor(u.id, v.id)}
                    />
                  );
                })
              )}

              {/* Vertices */}
              {ramseyNodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                  <circle r="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
                  <text y="4" textAnchor="middle" className="fill-white font-mono text-[9px] font-black">
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
            <span className="text-[11px] font-mono text-muted-foreground mt-1">
              Click any line to toggle between Red (Friends) &amp; Blue (Strangers)
            </span>
          </div>
        )}
      </div>

      {/* ── Right: Controls & Theories (5 cols) ─────────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {activeTab === "pigeonhole" ? "Pigeonhole Controls" : "Ramsey Party Theorem"}
            </span>
          </div>
        </div>

        {activeTab === "pigeonhole" ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Pigeonhole Principle Formula
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                Max Hole &ge; ⌈n / k⌉ = ⌈{numItems} / {numHoles}⌉ = {dirichletBound}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Items (n)</span>
                  <span className="font-mono text-primary font-black">{numItems}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={numItems}
                  onChange={(e) => {
                    const newN = Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 1));
                    setNumItems(newN);
                    const nd = Array(numHoles).fill(0);
                    for (let i = 0; i < newN; i++) nd[i % numHoles]++;
                    setDistribution(nd);
                  }}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-1.5 p-3 bg-muted/40 border border-border rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Holes (k)</span>
                  <span className="font-mono text-primary font-black">{numHoles}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={numHoles}
                  onChange={(e) => {
                    const newK = Math.max(2, Math.min(8, parseInt(e.target.value, 10) || 2));
                    setNumHoles(newK);
                    const nd = Array(newK).fill(0);
                    for (let i = 0; i < numItems; i++) nd[i % newK]++;
                    setDistribution(nd);
                  }}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">
                Theorem of Friends and Strangers
              </span>
              <div className="font-mono text-sm font-black text-foreground bg-background/80 p-3 rounded-xl border border-border text-center">
                Ramsey Number R(3, 3) = 6
              </div>
              <p className="text-xs text-muted-foreground text-center">
                In any gathering of 6 people, there are either at least 3 mutual friends (red triangle) or at least 3 mutual strangers (blue triangle).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
