"use client";

import React, { useState, useMemo, useRef } from "react";
import { RepoState, CommitObject } from "@/app/types/gitSimualtor";
import { GitCommit, GitBranch, ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, Tag } from "lucide-react";

interface Props {
  state: RepoState;
  onSelectCommit: (commit: CommitObject) => void;
}

// Color palette for branches
const BRANCH_COLORS = [
  { name: "emerald", stroke: "#10b981", bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
  { name: "blue", stroke: "#3b82f6", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  { name: "purple", stroke: "#a855f7", bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
  { name: "amber", stroke: "#f59e0b", bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
  { name: "rose", stroke: "#f43f5e", bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30" },
  { name: "cyan", stroke: "#06b6d4", bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" },
];

export default function CommitGraph({ state, onSelectCommit }: Props) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Gather all commit objects
  const commits = useMemo(() => {
    return Object.values(state.objects).filter(
      (o): o is CommitObject => o.type === "commit"
    );
  }, [state.objects]);

  // 2. Build topological ordering and branch lane assignments
  const { orderedCommits, lanes, branchColorMap } = useMemo(() => {
    if (commits.length === 0) {
      return { orderedCommits: [], lanes: {}, branchColorMap: {} };
    }

    const branchNames = Object.keys(state.refs);
    const branchColorMap: Record<string, typeof BRANCH_COLORS[0]> = {};
    branchNames.forEach((branch, index) => {
      branchColorMap[branch] = BRANCH_COLORS[index % BRANCH_COLORS.length];
    });

    // Map each commit to a branch
    const commitBranchMap: Record<string, string> = {};

    // First assign based on branch tips
    branchNames.forEach((branch) => {
      let cur: string | undefined = state.refs[branch];
      while (cur && !commitBranchMap[cur]) {
        commitBranchMap[cur] = branch;
        const c = state.objects[cur] as CommitObject;
        cur = c?.parents?.[0];
      }
    });

    // Fallback for detached or unreachable commits
    commits.forEach((c) => {
      if (!commitBranchMap[c.id]) {
        commitBranchMap[c.id] = "detached";
      }
    });

    // Determine distinct lanes (main = lane 0, others assigned as they diverge)
    const laneMap: Record<string, number> = {};
    let nextLane = 0;

    // Give 'main' or 'master' lane 0
    const primaryBranch = branchNames.find((b) => b === "main" || b === "master") || branchNames[0] || "main";
    laneMap[primaryBranch] = nextLane++;

    branchNames.forEach((b) => {
      if (laneMap[b] === undefined) {
        laneMap[b] = nextLane++;
      }
    });
    laneMap["detached"] = nextLane++;

    // Topological sort (parents appear above children, root at top)
    const visited = new Set<string>();
    const ordered: CommitObject[] = [];

    // Helper: depth-first search to find all root commits
    const inDegree: Record<string, number> = {};
    commits.forEach((c) => {
      inDegree[c.id] = 0;
    });
    commits.forEach((c) => {
      c.parents.forEach((p) => {
        if (inDegree[p] !== undefined) {
          inDegree[p]++;
        }
      });
    });

    // Topological order: starting from roots
    const queue = commits.filter((c) => !c.parents || c.parents.length === 0);
    if (queue.length === 0 && commits.length > 0) {
      // If cycle or no explicit root, start from any commit
      queue.push(commits[0]);
    }

    // Traverse
    const commitMap: Record<string, CommitObject> = {};
    commits.forEach((c) => {
      commitMap[c.id] = c;
    });

    // Topo order by traversing from all branch tips downward to ancestors
    const allTips = Array.from(new Set([...Object.values(state.refs), state.HEAD?.value])).filter(Boolean) as string[];

    function collectAncestry(id: string) {
      if (visited.has(id)) return;
      visited.add(id);

      const c = commitMap[id];
      if (!c) return;

      c.parents.forEach((p) => collectAncestry(p));
      ordered.push(c);
    }

    allTips.forEach((tip) => collectAncestry(tip));

    // Any remaining commits
    commits.forEach((c) => {
      if (!visited.has(c.id)) {
        collectAncestry(c.id);
      }
    });

    // Invert so newest commits are at the top, root at the bottom (or root at top)
    // Standard git DAG: Root at top, chronological downwards
    return {
      orderedCommits: ordered,
      lanes: commitBranchMap,
      branchColorMap,
    };
  }, [commits, state.refs, state.HEAD, state.objects]);

  // Geometry configuration
  const LANE_WIDTH = 90;
  const ROW_HEIGHT = 80;
  const PADDING_X = 50;
  const PADDING_Y = 40;

  // Build coordinate map for each commit: id -> {x, y, color}
  const commitPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; lane: number; color: string }> = {};

    const laneIndexMap: Record<string, number> = {};
    let laneCounter = 0;

    orderedCommits.forEach((commit, rowIndex) => {
      const branchName = lanes[commit.id] || "main";
      if (laneIndexMap[branchName] === undefined) {
        laneIndexMap[branchName] = laneCounter++;
      }
      const laneIdx = laneIndexMap[branchName];
      const colorObj = branchColorMap[branchName] || BRANCH_COLORS[0];

      positions[commit.id] = {
        x: PADDING_X + laneIdx * LANE_WIDTH,
        y: PADDING_Y + rowIndex * ROW_HEIGHT,
        lane: laneIdx,
        color: colorObj.stroke,
      };
    });

    return positions;
  }, [orderedCommits, lanes, branchColorMap]);

  if (orderedCommits.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <GitCommit size={32} />
        </div>
        <h3 className="font-bold text-lg text-foreground">Repository Graph is Empty</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Initialize your repository and make your first commit to see the directed acyclic graph (DAG) come to life.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs font-mono text-muted-foreground border border-border">
          <code>git init && touch index.js && git add . && git commit -m &quot;feat: initial commit&quot;</code>
        </div>
      </div>
    );
  }

  const svgWidth = Math.max(Object.keys(state.refs).length * LANE_WIDTH + 450, 600);
  const svgHeight = orderedCommits.length * ROW_HEIGHT + PADDING_Y * 2;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      {/* Visualizer Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-border bg-muted/30 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <GitCommit size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span>Directed Acyclic Graph (DAG)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {orderedCommits.length} commit{orderedCommits.length > 1 ? "s" : ""}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Click any node to inspect commit snapshots, trees, and parent diffs.
            </p>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl p-1 text-xs">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <div className="w-[1px] h-4 bg-border my-auto mx-0.5" />
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-auto max-h-[560px] p-4 bg-dot-pattern"
        style={{ transformOrigin: "top left" }}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.15s ease-out" }}>
          <svg width={svgWidth} height={svgHeight} className="overflow-visible font-sans">
            <defs>
              {/* Arrowhead marker */}
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" opacity="0.6" />
              </marker>

              {/* Glowing filters */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Bezier Edges between Parents and Children */}
            {orderedCommits.map((commit) => {
              const pos = commitPositions[commit.id];
              if (!pos) return null;

              return commit.parents.map((parentId) => {
                const parentPos = commitPositions[parentId];
                if (!parentPos) return null;

                // Bezier curve from parent (top) to child (bottom)
                // Start from parent center to commit center
                const x1 = parentPos.x;
                const y1 = parentPos.y;
                const x2 = pos.x;
                const y2 = pos.y;

                const isMergeEdge = commit.parents.length > 1;

                // Cubic bezier control points
                const pathData = `M ${x1} ${y1} C ${x1} ${y1 + (y2 - y1) * 0.5}, ${x2} ${y1 + (y2 - y1) * 0.5}, ${x2} ${y2}`;

                return (
                  <path
                    key={`${parentId}->${commit.id}`}
                    d={pathData}
                    fill="none"
                    stroke={isMergeEdge ? "#a855f7" : pos.color}
                    strokeWidth={isMergeEdge ? 2.5 : 2}
                    strokeDasharray={isMergeEdge ? "4 3" : undefined}
                    opacity={0.8}
                    className="transition-all duration-300"
                  />
                );
              });
            })}

            {/* Commit Nodes & Info Badges */}
            {orderedCommits.map((commit) => {
              const pos = commitPositions[commit.id];
              if (!pos) return null;

              const isMerge = commit.parents && commit.parents.length > 1;

              // Find branch tips at this commit
              const pointingBranches = Object.entries(state.refs)
                .filter(([, id]) => id === commit.id)
                .map(([name]) => name);

              // Find tags at this commit
              const pointingTags = Object.entries(state.tags || {})
                .filter(([, id]) => id === commit.id)
                .map(([name]) => name);

              // Is HEAD at this commit?
              const isHeadDirect = state.HEAD?.type === "commit" && state.HEAD.value === commit.id;
              const isHeadBranch =
                state.HEAD?.type === "branch" && pointingBranches.includes(state.HEAD.value);
              const isHead = isHeadDirect || isHeadBranch;

              return (
                <g
                  key={commit.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectCommit(commit)}
                >
                  {/* Outer halo on hover */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={20}
                    fill={pos.color}
                    opacity={0}
                    className="group-hover:opacity-20 transition-opacity duration-200"
                  />

                  {/* Main Commit Circle Node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isMerge ? 12 : 10}
                    fill="var(--card, #1e293b)"
                    stroke={isMerge ? "#a855f7" : pos.color}
                    strokeWidth={3}
                    filter="url(#glow)"
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  {/* Inner ring for Merge Commits */}
                  {isMerge && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={5}
                      fill="#a855f7"
                    />
                  )}

                  {/* Commit SHA text inside node */}
                  {!isMerge && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={3.5}
                      fill={pos.color}
                    />
                  )}

                  {/* Commit Details Card right next to the node */}
                  <g transform={`translate(${pos.x + 24}, ${pos.y - 18})`}>
                    {/* Background card */}
                    <rect
                      x={0}
                      y={0}
                      width={320}
                      height={40}
                      rx={8}
                      className="fill-muted/70 stroke-border group-hover:stroke-primary/50 group-hover:fill-muted transition-colors"
                      strokeWidth={1}
                    />

                    {/* Commit Message & SHA */}
                    <text
                      x={10}
                      y={16}
                      className="fill-foreground font-semibold text-xs tracking-tight select-none"
                    >
                      {commit.message.length > 36 ? commit.message.slice(0, 36) + "…" : commit.message}
                    </text>

                    <text
                      x={10}
                      y={30}
                      className="fill-muted-foreground font-mono text-[10px] select-none"
                    >
                      {commit.id.slice(0, 7)} • {new Date(commit.timestamp || Date.now()).toLocaleTimeString()}
                    </text>
                  </g>

                  {/* Branch Labels (Pills) */}
                  {pointingBranches.length > 0 && (
                    <g transform={`translate(${pos.x + 355}, ${pos.y - 12})`}>
                      {pointingBranches.map((branch, bIdx) => {
                        const isCurrentHeadBranch =
                          state.HEAD?.type === "branch" && state.HEAD.value === branch;

                        return (
                          <g key={branch} transform={`translate(${bIdx * 85}, 0)`}>
                            <rect
                              x={0}
                              y={0}
                              width={Math.max(branch.length * 7.5 + 24, 70)}
                              height={24}
                              rx={6}
                              fill={isCurrentHeadBranch ? "#3b82f6" : "rgba(59, 130, 246, 0.15)"}
                              stroke="#3b82f6"
                              strokeWidth={1}
                            />
                            <text
                              x={8}
                              y={16}
                              fill={isCurrentHeadBranch ? "#ffffff" : "#60a5fa"}
                              className="font-mono text-[11px] font-bold select-none"
                            >
                              ⎇ {branch}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* HEAD Pointer Tag */}
                  {isHead && (
                    <g
                      transform={`translate(${pos.x - 70}, ${pos.y - 10})`}
                      className="animate-pulse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={58}
                        height={20}
                        rx={5}
                        fill="#f59e0b"
                      />
                      <text
                        x={8}
                        y={14}
                        fill="#000000"
                        className="font-mono font-black text-[10px] select-none"
                      >
                        HEAD ➜
                      </text>
                    </g>
                  )}

                  {/* Tag Badges */}
                  {pointingTags.length > 0 && (
                    <g transform={`translate(${pos.x + 355 + pointingBranches.length * 85}, ${pos.y - 12})`}>
                      {pointingTags.map((tag, tIdx) => (
                        <g key={tag} transform={`translate(${tIdx * 70}, 0)`}>
                          <rect
                            x={0}
                            y={0}
                            width={Math.max(tag.length * 7 + 22, 60)}
                            height={24}
                            rx={6}
                            fill="rgba(168, 85, 247, 0.2)"
                            stroke="#a855f7"
                            strokeWidth={1}
                          />
                          <text
                            x={8}
                            y={16}
                            fill="#c084fc"
                            className="font-mono text-[11px] font-bold select-none"
                          >
                            🏷️ {tag}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
