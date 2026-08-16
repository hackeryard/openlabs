"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { binomialPMF, normalPDF } from "./lib/statsMath";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  Sparkles,
  Layers,
  Volume2,
  VolumeX,
} from "lucide-react";

interface PhysicalBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  currentRow: number;
  targetCol: number;
  settled: boolean;
  binIndex: number;
}

interface PegDef {
  x: number;
  y: number;
  row: number;
  col: number;
}

interface GaltonBoardCanvasProps {
  rowsN: number;
  onChangeRowsN: (n: number) => void;
  biasP: number;
  onChangeBiasP: (p: number) => void;
  onBallsSampled?: (count: number) => void;
}

const BALL_COLORS = [
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
];

export default function GaltonBoardCanvas({
  rowsN,
  onChangeRowsN,
  biasP,
  onChangeBiasP,
  onBallsSampled,
}: GaltonBoardCanvasProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [dropRate, setDropRate] = useState<"steady" | "rapid">("steady");
  const [binCounts, setBinCounts] = useState<number[]>(() => new Array(rowsN + 1).fill(0));
  const [totalBalls, setTotalBalls] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<PhysicalBall[]>([]);
  const nextBallId = useRef(1);
  const lastSpawnRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Clear when rows change
  useEffect(() => {
    setBinCounts(new Array(rowsN + 1).fill(0));
    setTotalBalls(0);
    ballsRef.current = [];
  }, [rowsN]);

  // Theoretical binomial probabilities
  const theoreticalProbs = useMemo(() => {
    const probs: number[] = [];
    for (let k = 0; k <= rowsN; k++) {
      probs.push(binomialPMF(k, rowsN, biasP));
    }
    return probs;
  }, [rowsN, biasP]);

  const theoreticalMean = rowsN * biasP;
  const theoreticalStdDev = Math.sqrt(rowsN * biasP * (1 - biasP));

  // Canvas coordinate geometry
  const width = 600;
  const height = 540;
  const topY = 60;
  const pegSpacingY = Math.min(26, 210 / rowsN);
  const binTopY = topY + rowsN * pegSpacingY + 30;
  const binHeight = height - binTopY - 25;
  const binWidth = width / (rowsN + 1);

  // Generate Peg layout
  const pegs: PegDef[] = useMemo(() => {
    const list: PegDef[] = [];
    for (let r = 0; r < rowsN; r++) {
      const rowWidth = r * (binWidth * 0.92);
      const startX = width / 2 - rowWidth / 2;
      for (let c = 0; c <= r; c++) {
        const x = startX + c * (binWidth * 0.92);
        const y = topY + r * pegSpacingY;
        list.push({ x, y, row: r, col: c });
      }
    }
    return list;
  }, [rowsN, binWidth, pegSpacingY, topY, width]);

  // Instant 500-ball batch drop
  const handleInstantDrop = () => {
    const batchSize = 500;
    const newCounts = [...binCounts];

    for (let b = 0; b < batchSize; b++) {
      let col = 0;
      for (let r = 0; r < rowsN; r++) {
        if (Math.random() < biasP) col++;
      }
      newCounts[col]++;
    }

    setBinCounts(newCounts);
    setTotalBalls((prev) => prev + batchSize);
    onBallsSampled?.(batchSize);
  };

  const handleReset = () => {
    setIsRunning(false);
    setBinCounts(new Array(rowsN + 1).fill(0));
    setTotalBalls(0);
    ballsRef.current = [];
  };

  // ── Physics Animation Engine (Canvas 2D) ─────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const gravity = 0.35;
    const bounceFriction = 0.55;

    const render = (time: number) => {
      // 1. Spawn balls if running
      const spawnInterval = dropRate === "rapid" ? 35 : 120;
      if (isRunning && time - lastSpawnRef.current > spawnInterval) {
        const color = BALL_COLORS[nextBallId.current % BALL_COLORS.length];
        ballsRef.current.push({
          id: nextBallId.current++,
          x: width / 2 + (Math.random() - 0.5) * 6,
          y: 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 1.2,
          radius: 3.8,
          color,
          currentRow: -1,
          targetCol: 0,
          settled: false,
          binIndex: -1,
        });
        lastSpawnRef.current = time;
      }

      // 2. Clear canvas with slight trail
      ctx.clearRect(0, 0, width, height);

      // 3. Draw Hopper Funnel
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(width / 2 - 40, 10);
      ctx.lineTo(width / 2 - 12, topY - 18);
      ctx.lineTo(width / 2 - 12, topY - 5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2 + 40, 10);
      ctx.lineTo(width / 2 + 12, topY - 18);
      ctx.lineTo(width / 2 + 12, topY - 5);
      ctx.stroke();

      // 4. Draw Glowing Triangular Peg Lattice
      pegs.forEach((peg) => {
        // Peg outer glow
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
        ctx.fill();

        // Peg core
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#cbd5e1";
        ctx.fill();
      });

      // 5. Draw Accumulator Bins & Histogram Tubes
      const maxCount = Math.max(1, ...binCounts);

      for (let i = 0; i <= rowsN; i++) {
        const binX = i * binWidth;
        const count = binCounts[i] || 0;
        const tubeHeight = (count / maxCount) * (binHeight - 30);
        const tubeY = height - 25 - tubeHeight;

        // Vertical divider
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(binX, binTopY);
        ctx.lineTo(binX, height - 25);
        ctx.stroke();

        // Histogram fill gradient
        if (count > 0) {
          const grad = ctx.createLinearGradient(0, tubeY, 0, height - 25);
          grad.addColorStop(0, "rgba(99, 102, 241, 0.85)");
          grad.addColorStop(1, "rgba(147, 51, 234, 0.4)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(binX + 2, tubeY, binWidth - 4, tubeHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Top highlight cap
          ctx.strokeStyle = "#a5b4fc";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(binX + 3, tubeY);
          ctx.lineTo(binX + binWidth - 3, tubeY);
          ctx.stroke();
        }

        // Bin number label
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${i}`, binX + binWidth / 2, height - 8);
      }

      // End divider
      ctx.beginPath();
      ctx.moveTo(width, binTopY);
      ctx.lineTo(width, height - 25);
      ctx.stroke();

      // 6. Draw Theoretical Limiting Bell Curve Envelope
      if (totalBalls > 20) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        for (let i = 0; i <= rowsN; i++) {
          const binX = i * binWidth + binWidth / 2;
          const prob = theoreticalProbs[i] || 0;
          const expectedHeight = prob * (binHeight - 30) * (totalBalls / maxCount);
          const y = height - 25 - expectedHeight;

          if (i === 0) ctx.moveTo(binX, y);
          else ctx.lineTo(binX, y);
        }
        ctx.stroke();

        // Dots on theoretical points
        for (let i = 0; i <= rowsN; i++) {
          const binX = i * binWidth + binWidth / 2;
          const prob = theoreticalProbs[i] || 0;
          const expectedHeight = prob * (binHeight - 30) * (totalBalls / maxCount);
          const y = height - 25 - expectedHeight;

          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(binX, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 7. Update & Render Physical Balls
      const activeBalls: PhysicalBall[] = [];

      ballsRef.current.forEach((ball) => {
        if (ball.settled) return;

        // Apply gravity
        ball.vy += gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Peg collision detection
        pegs.forEach((peg) => {
          const dx = ball.x - peg.x;
          const dy = ball.y - peg.y;
          const dist = Math.hypot(dx, dy);
          const minDist = ball.radius + 3;

          if (dist < minDist && ball.y < binTopY) {
            // Collision normal
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            // Reflect velocity with bounce damping
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx = (ball.vx - 1.8 * dot * nx) * bounceFriction;
            ball.vy = (ball.vy - 1.8 * dot * ny) * bounceFriction;

            // Bernoulli lateral bias push
            const biasDrift = Math.random() < biasP ? 0.9 : -0.9;
            ball.vx += biasDrift;

            // Separate overlapping
            ball.x = peg.x + nx * (minDist + 0.5);
            ball.y = peg.y + ny * (minDist + 0.5);
          }
        });

        // Bin entry
        if (ball.y >= binTopY) {
          const rawBin = Math.floor(ball.x / binWidth);
          const binIndex = Math.max(0, Math.min(rowsN, rawBin));

          // Constrain to bin walls
          const leftWall = binIndex * binWidth + ball.radius;
          const rightWall = (binIndex + 1) * binWidth - ball.radius;

          if (ball.x < leftWall) {
            ball.x = leftWall;
            ball.vx = -ball.vx * 0.3;
          }
          if (ball.x > rightWall) {
            ball.x = rightWall;
            ball.vx = -ball.vx * 0.3;
          }

          // Land at bottom or stack on top of existing level
          const currentCount = binCounts[binIndex] || 0;
          const targetLevelY = height - 25 - (currentCount / maxCount) * (binHeight - 30);

          if (ball.y >= targetLevelY - 4) {
            ball.settled = true;
            ball.binIndex = binIndex;

            setBinCounts((counts) => {
              const next = [...counts];
              next[binIndex]++;
              return next;
            });
            setTotalBalls((t) => t + 1);
            onBallsSampled?.(1);
            return;
          }
        }

        // Draw active ball with glowing gradient
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 6;
        ctx.fill();

        // Highlight glint
        ctx.beginPath();
        ctx.arc(ball.x - 1, ball.y - 1, ball.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
        ctx.restore();

        if (ball.y < height) {
          activeBalls.push(ball);
        }
      });

      ballsRef.current = activeBalls;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, dropRate, rowsN, biasP, binCounts, theoreticalProbs, pegs, binWidth, binTopY, binHeight, totalBalls, onBallsSampled]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* ── Left: Interactive Physics Canvas (7 cols) ───────── */}
      <div className="lg:col-span-7 flex flex-col bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Physics Bean Machine Lattice (N = {rowsN} Rows)
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsRunning((r) => !r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isRunning
                  ? "bg-amber-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRunning ? "Pause" : "Start Drop"}</span>
            </button>

            <button
              onClick={handleInstantDrop}
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              title="Drop 500 balls instantly"
            >
              <Zap size={13} className="text-amber-500" />
              <span>+500 Instant</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Reset Board"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* ── High-Performance Canvas 2D Board ──────────────── */}
        <div className="flex-1 flex items-center justify-center min-h-[380px] bg-background/50 rounded-2xl border border-border/60 p-1">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full max-h-[520px] select-none rounded-xl"
          />
        </div>

        {/* ── Metric Summary Strip ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 bg-muted/60 border border-border rounded-2xl p-2.5 text-center text-xs mt-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Total Sampled Balls
            </span>
            <span className="font-mono font-black text-primary text-sm">
              {totalBalls.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Binomial Mean μ = Np
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {theoreticalMean.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Std Dev σ = √(Np(1-p))
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {theoreticalStdDev.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Galton Controls & Theory (5 cols) ────────── */}
      <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Physics Machine Parameters
            </span>
          </div>
        </div>

        {/* Rows Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">
              Lattice Depth <span className="font-mono text-primary">(N)</span>
            </span>
            <span className="font-mono text-primary font-black">{rowsN} rows</span>
          </div>
          <input
            type="range"
            min="4"
            max="14"
            step="1"
            value={rowsN}
            onChange={(e) => onChangeRowsN(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Bias Probability Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">
              Right-Branch Probability <span className="font-mono text-primary">(p)</span>
            </span>
            <span className="font-mono text-primary font-black">{(biasP * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={biasP}
            onChange={(e) => onChangeBiasP(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>Left Skew (p=0.1)</span>
            <span>Symmetric (p=0.5)</span>
            <span>Right Skew (p=0.9)</span>
          </div>
        </div>

        {/* Rate Switcher */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Dispenser Cascade Rate
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDropRate("steady")}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                dropRate === "steady"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Steady Flow
            </button>
            <button
              onClick={() => setDropRate("rapid")}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                dropRate === "rapid"
                  ? "bg-primary text-primary-foreground shadow-sm font-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Rapid Cascade
            </button>
          </div>
        </div>

        {/* Mathematical Connection Card */}
        <div className="p-4 bg-muted/50 border border-border rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            <span>The de Moivre–Laplace Theorem</span>
          </h4>
          <p className="text-muted-foreground">
            Each ball performs <code>N</code> independent Bernoulli trials.
            The resulting distribution in the bottom bins strictly follows the Binomial distribution:
          </p>
          <div className="font-mono text-xs font-bold text-primary bg-background/60 p-2 rounded-xl text-center border border-border/80">
            P(X = k) = binom(N, k) p^k (1-p)^(N-k)
          </div>
          <p className="text-[11px] text-muted-foreground">
            Notice how the gold theoretical curve seamlessly envelopes the empirical histogram as more particles accumulate.
          </p>
        </div>
      </div>
    </div>
  );
}
