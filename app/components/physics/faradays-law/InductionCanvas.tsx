"use client";

import React, { useRef } from "react";
import {
  InductionMode,
  LinearMagnetParams,
  DynamoParams,
  TransformerParams,
  EddyTubeParams,
  SimulationTelemetry,
} from "./types";
import { TUBE_CONDUCTIVITY } from "./engine";
import { Lightbulb, Magnet, Zap, Volume2 } from "lucide-react";

interface InductionCanvasProps {
  mode: InductionMode;
  linearParams: LinearMagnetParams;
  setLinearParams: React.Dispatch<React.SetStateAction<LinearMagnetParams>>;
  dynamoParams: DynamoParams;
  dynamoAngle: number;
  transformerParams: TransformerParams;
  transformerTime: number;
  eddyParams: EddyTubeParams;
  telemetry: SimulationTelemetry;
  onMagnetDrag?: (dx: number, dt: number) => void;
  showFieldLines?: boolean;
  showLenzVector?: boolean;
  showElectronFlow?: boolean;
}

export default function InductionCanvas({
  mode,
  linearParams,
  setLinearParams,
  dynamoParams,
  dynamoAngle,
  transformerParams,
  transformerTime,
  eddyParams,
  telemetry,
  onMagnetDrag,
  showFieldLines = true,
  showLenzVector = true,
  showElectronFlow = true,
}: InductionCanvasProps) {
  const isDraggingRef = useRef(false);
  const lastClientXRef = useRef(0);
  const lastTimeRef = useRef(0);

  const coilCenterX = 380;
  const coilCenterY = 175;

  // Pointer drag for linear magnet
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastClientXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || mode !== "linear_magnet") return;
    const now = performance.now();
    const dt = Math.max(0.008, (now - lastTimeRef.current) / 1000);
    const dx = e.clientX - lastClientXRef.current;

    lastClientXRef.current = e.clientX;
    lastTimeRef.current = now;

    if (onMagnetDrag) {
      onMagnetDrag(dx, dt);
    } else {
      setLinearParams((prev) => ({
        ...prev,
        magnetX: Math.max(60, Math.min(540, prev.magnetX + dx)),
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Glow power calculation
  const bulbGlow = Math.min(1, Math.pow(Math.abs(telemetry.inducedEMF) / 12, 1.8));

  return (
    <div className="relative w-full h-[400px] sm:h-[440px] bg-slate-950 rounded-2xl border border-border/80 overflow-hidden shadow-2xl select-none">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

      {/* ─────────────────── MODE 1: LINEAR MAGNET & SOLENOID ─────────────────── */}
      {mode === "linear_magnet" && (
        <svg className="w-full h-full absolute inset-0">
          <defs>
            {/* Soft Iron Core Gradient */}
            <linearGradient id="ironCoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="ferriteCoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            {/* Copper Wire Gradient */}
            <linearGradient id="copperWireGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Magnetic Field Streamlines */}
          {showFieldLines && (
            <g opacity="0.35">
              {[-50, -30, -15, 15, 30, 50].map((offsetY, i) => {
                const magX = linearParams.magnetX;
                const pathD = `M ${magX - 60} ${coilCenterY + offsetY * 0.4} Q ${magX} ${coilCenterY + offsetY * 2.2} ${magX + 60} ${coilCenterY + offsetY * 0.4}`;
                return (
                  <path
                    key={i}
                    d={pathD}
                    fill="none"
                    stroke={linearParams.magnetPolarity === "N-S" ? "#38bdf8" : "#f43f5e"}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </g>
          )}

          {/* Solenoid Permeable Core Rod */}
          {linearParams.coreMaterial !== "air" && (
            <rect
              x={coilCenterX - linearParams.coilLength / 2}
              y={coilCenterY - 12}
              width={linearParams.coilLength}
              height={24}
              rx={4}
              fill={linearParams.coreMaterial === "soft_iron" ? "url(#ironCoreGrad)" : "url(#ferriteCoreGrad)"}
              stroke="#64748b"
              strokeWidth="1"
            />
          )}

          {/* Circuit Wiring to Load */}
          <path
            d={`M ${coilCenterX - 40} ${coilCenterY + linearParams.coilRadius} L ${coilCenterX - 40} 330 L 320 330 L 320 350 M ${coilCenterX + 40} ${coilCenterY + linearParams.coilRadius} L ${coilCenterX + 40} 330 L 440 330 L 440 350`}
            fill="none"
            stroke="#64748b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Animated Electron Drift Particles */}
          {showElectronFlow && Math.abs(telemetry.inducedCurrent) > 0.001 && (
            <g>
              {Array.from({ length: 12 }).map((_, pIdx) => {
                const speedSec = Math.max(0.2, 2.5 / (Math.abs(telemetry.inducedCurrent) * 10 + 0.1));
                const isReverse = telemetry.inducedCurrent < 0;
                return (
                  <circle key={pIdx} r="3" fill="#fbbf24">
                    <animateMotion
                      path={`M ${coilCenterX - 40} ${coilCenterY + 40} L ${coilCenterX - 40} 330 L 320 330 L 320 350 L 440 350 L 440 330 L ${coilCenterX + 40} 330 L ${coilCenterX + 40} ${coilCenterY + 40}`}
                      dur={`${speedSec}s`}
                      repeatCount="indefinite"
                      keyPoints={isReverse ? "1;0" : "0;1"}
                      keyTimes="0;1"
                    />
                  </circle>
                );
              })}
            </g>
          )}

          {/* Copper Coil Windings */}
          <g>
            {Array.from({ length: linearParams.coilTurns }).map((_, cIdx) => {
              const turnSpacing = linearParams.coilLength / (linearParams.coilTurns + 1);
              const xPos = coilCenterX - linearParams.coilLength / 2 + (cIdx + 1) * turnSpacing;
              return (
                <ellipse
                  key={cIdx}
                  cx={xPos}
                  cy={coilCenterY}
                  rx={8}
                  ry={linearParams.coilRadius}
                  fill="none"
                  stroke="url(#copperWireGrad)"
                  strokeWidth="5"
                  className="filter drop-shadow-md"
                />
              );
            })}
          </g>

          {/* Lenz's Law Vector Arrow */}
          {showLenzVector && Math.abs(telemetry.dPhiDt) > 0.0001 && (
            <g>
              <line
                x1={coilCenterX}
                y1={coilCenterY - linearParams.coilRadius - 20}
                x2={coilCenterX + (telemetry.lenzOpposingFieldB > 0 ? 55 : -55)}
                y2={coilCenterY - linearParams.coilRadius - 20}
                stroke="#10b981"
                strokeWidth="3.5"
                markerEnd="url(#lenzArrow)"
              />
              <text
                x={coilCenterX}
                y={coilCenterY - linearParams.coilRadius - 28}
                fill="#10b981"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                B_ind (Lenz&apos;s Law Opposing)
              </text>
            </g>
          )}
        </svg>
      )}

      {/* Draggable Bar Magnet in Linear Mode */}
      {mode === "linear_magnet" && (
        <div
          style={{
            left: `${linearParams.magnetX - 55}px`,
            top: `${coilCenterY - 24}px`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute w-32 h-12 rounded-xl shadow-2xl z-30 cursor-grab active:cursor-grabbing flex border-2 border-white/40 overflow-hidden touch-none transition-transform duration-75 select-none"
        >
          {linearParams.magnetPolarity === "N-S" ? (
            <>
              <div className="w-1/2 bg-gradient-to-r from-rose-600 to-rose-500 flex flex-col items-center justify-center font-black text-white text-xs font-mono shadow-inner">
                <span>N</span>
                <span className="text-[8px] opacity-70 font-sans">{linearParams.magnetStrengthB0.toFixed(1)}T</span>
              </div>
              <div className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 flex flex-col items-center justify-center font-black text-white text-xs font-mono shadow-inner">
                <span>S</span>
                <span className="text-[8px] opacity-70 font-sans">POLE</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-500 flex flex-col items-center justify-center font-black text-white text-xs font-mono shadow-inner">
                <span>S</span>
                <span className="text-[8px] opacity-70 font-sans">POLE</span>
              </div>
              <div className="w-1/2 bg-gradient-to-r from-rose-500 to-rose-600 flex flex-col items-center justify-center font-black text-white text-xs font-mono shadow-inner">
                <span>N</span>
                <span className="text-[8px] opacity-70 font-sans">{linearParams.magnetStrengthB0.toFixed(1)}T</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─────────────────── MODE 2: AC DYNAMO GENERATOR ─────────────────── */}
      {mode === "ac_dynamo" && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Stator Magnetic Pole Shoes */}
          <div className="absolute left-16 sm:left-24 top-1/2 -translate-y-1/2 w-24 h-48 bg-gradient-to-r from-rose-700 to-rose-500 rounded-r-3xl border-2 border-white/20 flex items-center justify-center font-black text-white text-2xl font-mono shadow-2xl">
            NORTH
          </div>
          <div className="absolute right-16 sm:right-24 top-1/2 -translate-y-1/2 w-24 h-48 bg-gradient-to-l from-blue-700 to-blue-500 rounded-l-3xl border-2 border-white/20 flex items-center justify-center font-black text-white text-2xl font-mono shadow-2xl">
            SOUTH
          </div>

          {/* Rotating Rotor Armature */}
          <div
            style={{
              transform: `rotate(${dynamoAngle}rad)`,
            }}
            className="w-48 h-32 rounded-2xl border-4 border-amber-500 bg-amber-500/15 flex flex-col items-center justify-between p-2 shadow-2xl origin-center relative transition-transform duration-75"
          >
            <div className="w-full h-2 bg-amber-500 rounded-full" />
            <div className="text-[11px] font-black text-amber-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              {dynamoParams.armatureTurns} Turns Loop
            </div>
            <div className="w-full h-2 bg-amber-500 rounded-full" />
          </div>

          {/* Slip Rings vs Split-Ring Commutator Visual */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-border text-xs font-mono">
            <span className="text-muted-foreground">Contacts:</span>
            <span className="font-bold text-sky-400">
              {dynamoParams.generatorType === "ac_slip_rings" ? "Dual Slip Rings (Continuous AC)" : "Split-Ring Commutator (Pulsating DC)"}
            </span>
          </div>
        </div>
      )}

      {/* ─────────────────── MODE 3: MUTUAL INDUCTION TRANSFORMER ─────────────────── */}
      {mode === "transformer" && (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Rectangular Soft Iron Core */}
          <div className="relative w-80 h-60 bg-slate-800 border-8 border-slate-600 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
            {/* Core Cavity */}
            <div className="w-44 h-32 bg-slate-950 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Iron Core</span>
              <span className="text-xs font-mono font-black text-sky-400">
                k = {(transformerParams.coreCouplingK * 100).toFixed(0)}%
              </span>
            </div>

            {/* Primary Coil on Left Arm */}
            <div className="absolute left-1 top-6 bottom-6 w-10 flex flex-col justify-around items-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-12 h-3.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded shadow-md" />
              ))}
            </div>

            {/* Secondary Coil on Right Arm */}
            <div className="absolute right-1 top-6 bottom-6 w-10 flex flex-col justify-around items-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-12 h-2.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded shadow-md" />
              ))}
            </div>
          </div>

          {/* Primary & Secondary Label Tags */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-xs font-mono text-center">
            <span className="font-bold text-amber-400">Primary (Input)</span>
            <span className="text-slate-400">{transformerParams.primaryTurnsNp} Turns</span>
            <span className="text-emerald-400 font-bold">{transformerParams.primaryVoltageVp}V RMS</span>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-xs font-mono text-center">
            <span className="font-bold text-sky-400">Secondary (Output)</span>
            <span className="text-slate-400">{transformerParams.secondaryTurnsNs} Turns</span>
            <span className="text-sky-400 font-bold">{telemetry.vRMS?.toFixed(1)}V RMS</span>
          </div>
        </div>
      )}

      {/* ─────────────────── MODE 4: LENZ'S LAW EDDY CURRENT TUBE ─────────────────── */}
      {mode === "eddy_tube" && (
        <div className="w-full h-full relative flex items-center justify-center p-6">
          {/* Vertical Drop Tube Column */}
          <div className="relative w-28 h-72 rounded-3xl border-4 overflow-hidden shadow-2xl flex flex-col justify-between"
            style={{
              borderColor: TUBE_CONDUCTIVITY[eddyParams.tubeMaterial].color,
              backgroundColor: `${TUBE_CONDUCTIVITY[eddyParams.tubeMaterial].color}15`,
            }}
          >
            {/* Falling Object */}
            <div
              style={{
                top: `${eddyParams.dropPosition * 220 + 8}px`,
              }}
              className="absolute left-1/2 -translate-x-1/2 w-16 h-10 rounded-xl shadow-2xl z-20 flex border border-white/60 overflow-hidden transition-all duration-75"
            >
              {eddyParams.droppedObject === "neodymium_magnet" ? (
                <>
                  <div className="w-1/2 bg-rose-600 flex items-center justify-center text-white font-black text-[10px] font-mono">N</div>
                  <div className="w-1/2 bg-blue-600 flex items-center justify-center text-white font-black text-[10px] font-mono">S</div>
                </>
              ) : (
                <div className="w-full bg-amber-500 flex items-center justify-center text-slate-900 font-black text-[10px] font-mono">BRASS</div>
              )}
            </div>

            {/* Tube Markings */}
            <div className="p-2 text-[10px] font-mono font-bold text-center text-slate-400">0.0 m (Top)</div>
            <div className="p-2 text-[10px] font-mono font-bold text-center text-slate-400">1.0 m (Base)</div>
          </div>

          {/* Tube Telemetry Readout */}
          <div className="ml-8 space-y-2 font-mono text-xs">
            <div className="text-slate-300">
              Material: <span className="font-bold text-white">{TUBE_CONDUCTIVITY[eddyParams.tubeMaterial].name}</span>
            </div>
            <div className="text-slate-300">
              Descent Velocity: <span className="font-black text-amber-400">{eddyParams.dropVelocity.toFixed(2)} m/s</span>
            </div>
            <div className="text-slate-300">
              Elapsed Time: <span className="font-black text-sky-400">{eddyParams.dropTime.toFixed(2)} s</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── BOTTOM LOAD DEVICE STAGE ─────────────────── */}
      {mode !== "eddy_tube" && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          {linearParams.loadDevice === "lightbulb" ? (
            <div className="relative flex flex-col items-center">
              {/* Radiance Aura */}
              <div
                style={{
                  opacity: bulbGlow,
                  transform: `scale(${1 + bulbGlow * 0.7})`,
                }}
                className="absolute -top-12 w-28 h-28 rounded-full bg-amber-400/50 blur-xl pointer-events-none transition-all duration-75"
              />
              <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-500/60 flex items-center justify-center relative shadow-lg">
                <Lightbulb
                  size={26}
                  style={{
                    color: bulbGlow > 0.05 ? "#fbbf24" : "#64748b",
                    filter: bulbGlow > 0.05 ? "drop-shadow(0 0 12px #f59e0b)" : "none",
                  }}
                  className="transition-all duration-75"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 mt-1">
                Load: Filament Bulb ({Math.abs(telemetry.inducedEMF).toFixed(2)} V)
              </span>
            </div>
          ) : linearParams.loadDevice === "galvanometer" ? (
            <div className="w-40 h-20 bg-slate-900 border-2 border-slate-700 rounded-t-3xl flex flex-col items-center justify-end p-2 shadow-2xl relative overflow-hidden">
              <div className="w-28 h-12 border-t-2 border-dashed border-slate-500 rounded-t-full relative">
                <div
                  style={{
                    transform: `rotate(${Math.max(-55, Math.min(55, telemetry.inducedCurrent * 40))}deg)`,
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-rose-500 origin-bottom transition-transform duration-75 shadow-md"
                />
              </div>
              <span className="text-[10px] font-mono font-black text-slate-300 mt-0.5">
                Galvanometer ({(telemetry.inducedCurrent * 1000).toFixed(1)} mA)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400 shadow-md">
              <Volume2 size={16} />
              <span>Acoustic Buzzer ({telemetry.powerDissipatedW.toFixed(2)} W)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
