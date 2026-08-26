"use client";

import React from "react";
import {
  InductionMode,
  LinearMagnetParams,
  DynamoParams,
  TransformerParams,
  EddyTubeParams,
  CoreMaterial,
  LoadDevice,
  GeneratorType,
  TubeMaterial,
  DroppedObject,
} from "./types";
import {
  Sliders,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Activity,
  Layers,
  Magnet,
} from "lucide-react";

interface ControlPanelProps {
  mode: InductionMode;
  setMode: (mode: InductionMode) => void;
  linearParams: LinearMagnetParams;
  setLinearParams: React.Dispatch<React.SetStateAction<LinearMagnetParams>>;
  dynamoParams: DynamoParams;
  setDynamoParams: React.Dispatch<React.SetStateAction<DynamoParams>>;
  transformerParams: TransformerParams;
  setTransformerParams: React.Dispatch<React.SetStateAction<TransformerParams>>;
  eddyParams: EddyTubeParams;
  setEddyParams: React.Dispatch<React.SetStateAction<EddyTubeParams>>;
  onReset: () => void;
  onDropEddy: () => void;
  onResetEddy: () => void;
}

export default function ControlPanel({
  mode,
  setMode,
  linearParams,
  setLinearParams,
  dynamoParams,
  setDynamoParams,
  transformerParams,
  setTransformerParams,
  eddyParams,
  setEddyParams,
  onReset,
  onDropEddy,
  onResetEddy,
}: ControlPanelProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-5">
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-primary" />
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Experimental Controls
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-muted rounded-2xl border border-border">
          {[
            { id: "linear_magnet", label: "Bar Magnet" },
            { id: "ac_dynamo", label: "Dynamo Generator" },
            { id: "transformer", label: "Transformer" },
            { id: "eddy_tube", label: "Lenz Tube Drop" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as InductionMode)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                mode === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ────────────────── MODE 1: BAR MAGNET CONTROLS ────────────────── */}
      {mode === "linear_magnet" && (
        <div className="space-y-4 text-xs">
          {/* Magnet Polarity & Core Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="font-bold text-foreground block">Magnet Polarity:</span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setLinearParams((p) => ({
                      ...p,
                      magnetPolarity: p.magnetPolarity === "N-S" ? "S-N" : "N-S",
                    }))
                  }
                  className="flex-1 py-2 rounded-xl bg-muted/60 hover:bg-accent border border-border font-mono font-bold transition-all text-center"
                >
                  Flip ({linearParams.magnetPolarity})
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-foreground block">Permeable Core Material:</span>
              <div className="flex gap-1">
                {(["air", "ferrite", "soft_iron"] as CoreMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setLinearParams((p) => ({ ...p, coreMaterial: mat }))}
                    className={`flex-1 py-1.5 rounded-xl font-bold uppercase text-[10px] border transition-all ${
                      linearParams.coreMaterial === mat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {mat.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coil Turns (N) */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono">
              <span className="font-bold text-foreground">Coil Turns (N):</span>
              <span className="font-black text-amber-500">{linearParams.coilTurns} Turns</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 8, 10].map((t) => (
                <button
                  key={t}
                  onClick={() => setLinearParams((p) => ({ ...p, coilTurns: t }))}
                  className={`flex-1 py-1.5 rounded-xl font-mono font-bold border transition-all ${
                    linearParams.coilTurns === t
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                      : "bg-muted/40 border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Magnet Strength & Coil Radius Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Magnet Field (B₀):</span>
                <span className="font-black text-rose-500">{linearParams.magnetStrengthB0.toFixed(1)} T</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={linearParams.magnetStrengthB0}
                onChange={(e) =>
                  setLinearParams((p) => ({
                    ...p,
                    magnetStrengthB0: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Coil Radius (r):</span>
                <span className="font-black text-amber-500">{linearParams.coilRadius} mm</span>
              </div>
              <input
                type="range"
                min="25"
                max="55"
                value={linearParams.coilRadius}
                onChange={(e) =>
                  setLinearParams((p) => ({
                    ...p,
                    coilRadius: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Auto-Harmonic Plunger Oscillator Toggle & Freq */}
          <div className="p-3 bg-muted/30 border border-border/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Activity size={14} className="text-sky-400" />
                Harmonic Plunger Oscillator (SHM)
              </span>
              <button
                onClick={() =>
                  setLinearParams((p) => ({ ...p, isOscillating: !p.isOscillating }))
                }
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  linearParams.isOscillating
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {linearParams.isOscillating ? "Oscillating ON" : "Auto SHM OFF"}
              </button>
            </div>

            {linearParams.isOscillating && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Oscillation Frequency:</span>
                  <span className="font-black text-sky-400">{linearParams.oscillationFreq.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={linearParams.oscillationFreq}
                  onChange={(e) =>
                    setLinearParams((p) => ({
                      ...p,
                      oscillationFreq: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            )}
          </div>

          {/* Load Device Picker */}
          <div className="space-y-1">
            <span className="font-bold text-foreground block">Load Circuit Device:</span>
            <div className="flex gap-2">
              {[
                { id: "lightbulb", label: "Incandescent Bulb" },
                { id: "galvanometer", label: "Center-0 Galvanometer" },
                { id: "buzzer", label: "Acoustic Buzzer" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setLinearParams((p) => ({ ...p, loadDevice: item.id as LoadDevice }))
                  }
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-all text-center ${
                    linearParams.loadDevice === item.id
                      ? "bg-amber-500/20 border-amber-500 text-amber-400"
                      : "bg-muted/40 border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── MODE 2: DYNAMO GENERATOR CONTROLS ────────────────── */}
      {mode === "ac_dynamo" && (
        <div className="space-y-4 text-xs">
          {/* Generator Type: AC Slip Rings vs DC Commutator */}
          <div className="space-y-1">
            <span className="font-bold text-foreground block">Electrical Output Commutation:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDynamoParams((p) => ({ ...p, generatorType: "ac_slip_rings" }))}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  dynamoParams.generatorType === "ac_slip_rings"
                    ? "bg-sky-500/20 border-sky-500 text-sky-400"
                    : "bg-muted/40 border-border text-foreground hover:bg-accent"
                }`}
              >
                AC Slip Rings (Sinusoidal)
              </button>
              <button
                onClick={() => setDynamoParams((p) => ({ ...p, generatorType: "dc_commutator" }))}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  dynamoParams.generatorType === "dc_commutator"
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "bg-muted/40 border-border text-foreground hover:bg-accent"
                }`}
              >
                DC Commutator (Rectified)
              </button>
            </div>
          </div>

          {/* RPM Slider with Turbine Presets */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="font-bold text-foreground">Turbine Rotation Speed:</span>
              <span className="font-black text-sky-400">{dynamoParams.rotationSpeedRPM} RPM</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={dynamoParams.rotationSpeedRPM}
              onChange={(e) =>
                setDynamoParams((p) => ({
                  ...p,
                  rotationSpeedRPM: parseInt(e.target.value, 10),
                }))
              }
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            {/* Quick Presets */}
            <div className="flex gap-1.5">
              {[
                { label: "Idle (0)", rpm: 0 },
                { label: "Hydro (600)", rpm: 600 },
                { label: "Wind (1200)", rpm: 1200 },
                { label: "Steam Turbine (3000)", rpm: 3000 },
              ].map((p) => (
                <button
                  key={p.rpm}
                  onClick={() => setDynamoParams((prev) => ({ ...prev, rotationSpeedRPM: p.rpm }))}
                  className="flex-1 py-1 rounded-lg bg-muted/40 hover:bg-accent border border-border text-[10px] font-mono font-bold"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Armature Turns & Magnetic Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Armature Turns (N):</span>
                <span className="font-black text-amber-500">{dynamoParams.armatureTurns}</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="20"
                value={dynamoParams.armatureTurns}
                onChange={(e) =>
                  setDynamoParams((p) => ({
                    ...p,
                    armatureTurns: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Field Strength (B):</span>
                <span className="font-black text-rose-500">{dynamoParams.magneticFieldB.toFixed(1)} T</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={dynamoParams.magneticFieldB}
                onChange={(e) =>
                  setDynamoParams((p) => ({
                    ...p,
                    magneticFieldB: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── MODE 3: TRANSFORMER CONTROLS ────────────────── */}
      {mode === "transformer" && (
        <div className="space-y-4 text-xs">
          {/* Quick Presets */}
          <div className="space-y-1">
            <span className="font-bold text-foreground block">Transformer Configuration Presets:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  setTransformerParams({
                    primaryTurnsNp: 200,
                    secondaryTurnsNs: 20,
                    primaryVoltageVp: 120,
                    frequencyHz: 60,
                    coreCouplingK: 0.98,
                    secondaryLoadResistance: 10,
                  })
                }
                className="py-1.5 px-2 rounded-xl bg-muted/50 hover:bg-accent border border-border text-[10px] font-bold text-center"
              >
                Step-Down (120V → 12V)
              </button>
              <button
                onClick={() =>
                  setTransformerParams({
                    primaryTurnsNp: 100,
                    secondaryTurnsNs: 500,
                    primaryVoltageVp: 120,
                    frequencyHz: 60,
                    coreCouplingK: 0.98,
                    secondaryLoadResistance: 200,
                  })
                }
                className="py-1.5 px-2 rounded-xl bg-muted/50 hover:bg-accent border border-border text-[10px] font-bold text-center"
              >
                Step-Up (120V → 600V)
              </button>
              <button
                onClick={() =>
                  setTransformerParams({
                    primaryTurnsNp: 200,
                    secondaryTurnsNs: 200,
                    primaryVoltageVp: 230,
                    frequencyHz: 50,
                    coreCouplingK: 0.99,
                    secondaryLoadResistance: 50,
                  })
                }
                className="py-1.5 px-2 rounded-xl bg-muted/50 hover:bg-accent border border-border text-[10px] font-bold text-center"
              >
                1:1 Isolation (230V)
              </button>
            </div>
          </div>

          {/* Primary / Secondary Turns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-amber-500">Primary Turns (Np):</span>
                <span className="font-black text-amber-500">{transformerParams.primaryTurnsNp}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={transformerParams.primaryTurnsNp}
                onChange={(e) =>
                  setTransformerParams((p) => ({
                    ...p,
                    primaryTurnsNp: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-sky-400">Secondary Turns (Ns):</span>
                <span className="font-black text-sky-400">{transformerParams.secondaryTurnsNs}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={transformerParams.secondaryTurnsNs}
                onChange={(e) =>
                  setTransformerParams((p) => ({
                    ...p,
                    secondaryTurnsNs: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </div>

          {/* Input Voltage & AC Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">Input Voltage (Vp):</span>
                <span className="font-black text-emerald-400">{transformerParams.primaryVoltageVp} V RMS</span>
              </div>
              <input
                type="range"
                min="10"
                max="240"
                value={transformerParams.primaryVoltageVp}
                onChange={(e) =>
                  setTransformerParams((p) => ({
                    ...p,
                    primaryVoltageVp: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-foreground">AC Frequency (f):</span>
                <span className="font-black text-purple-400">{transformerParams.frequencyHz} Hz</span>
              </div>
              <div className="flex gap-2">
                {[50, 60, 400].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTransformerParams((p) => ({ ...p, frequencyHz: f }))}
                    className={`flex-1 py-1 rounded-xl font-mono font-bold border transition-all ${
                      transformerParams.frequencyHz === f
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-muted/40 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {f} Hz
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── MODE 4: LENZ TUBE DROP CONTROLS ────────────────── */}
      {mode === "eddy_tube" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dropped Object */}
            <div className="space-y-1">
              <span className="font-bold text-foreground block">Falling Object:</span>
              <div className="flex gap-2">
                {(["neodymium_magnet", "brass_slug"] as DroppedObject[]).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setEddyParams((p) => ({ ...p, droppedObject: obj }))}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      eddyParams.droppedObject === obj
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {obj === "neodymium_magnet" ? "NdFeB Magnet" : "Brass Slug"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tube Material */}
            <div className="space-y-1">
              <span className="font-bold text-foreground block">Tube Wall Material:</span>
              <div className="flex gap-1">
                {(["copper", "aluminum", "acrylic"] as TubeMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setEddyParams((p) => ({ ...p, tubeMaterial: mat }))}
                    className={`flex-1 py-2 rounded-xl font-bold uppercase text-[10px] border transition-all ${
                      eddyParams.tubeMaterial === mat
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "bg-muted/40 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Drop vs Reset */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDropEddy}
              disabled={eddyParams.isDropped}
              className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Release &amp; Drop Object
            </button>
            <button
              onClick={onResetEddy}
              className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-accent border border-border font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
