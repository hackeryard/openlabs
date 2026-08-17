"use client";

import React from "react";
import { CircuitComponent, SolverResult } from "./engine";
import { Zap, Activity, Gauge, Flame, Sliders } from "lucide-react";

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  component: CircuitComponent | null;
  solverResult: SolverResult;
  onUpdate: (id: string, updates: Partial<CircuitComponent>, saveHistory?: boolean) => void;
  globalStats: { totalEmf: number; totalCurrent: number; totalResistance: number; totalPower: number };
  onPushHistory: () => void;
}

export default function PropertiesPanel({
  selectedComponentId,
  component,
  solverResult,
  onUpdate,
  globalStats,
  onPushHistory,
}: PropertiesPanelProps) {

  const renderComponentEditor = () => {
    if (!component) {
      return (
        <div className="p-3 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-medium">No component selected</p>
          <p className="text-[10px]">Click any component on the circuit canvas to tune its resistance, EMF voltage, or switch states.</p>
        </div>
      );
    }

    const voltage = solverResult.componentVoltages[component.id] || 0;
    const current = solverResult.componentCurrents[component.id] || 0;
    const power = solverResult.componentPowers[component.id] || 0;

    return (
      <div className="space-y-3 p-3 text-xs">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <span className="font-extrabold text-sm capitalize text-foreground flex items-center gap-1.5">
            <Sliders size={14} className="text-primary" />
            {component.type} Properties
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            ID: {component.id.slice(0, 8)}
          </span>
        </div>

        {/* Live Component Telemetry */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-950/60 rounded-xl border border-border/80 text-center font-mono text-[10px]">
          <div>
            <span className="text-slate-400 block text-[8px] uppercase">Voltage:</span>
            <span className="font-bold text-sky-400">{voltage.toFixed(2)}V</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[8px] uppercase">Current:</span>
            <span className="font-bold text-emerald-400">{Math.abs(current).toFixed(3)}A</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[8px] uppercase">Power:</span>
            <span className="font-bold text-amber-400">{power.toFixed(3)}W</span>
          </div>
        </div>
        
        {/* Editor Inputs */}
        <div className="space-y-2.5">
          {component.type === 'battery' && (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span className="text-muted-foreground">EMF Voltage:</span>
                  <span className="font-mono font-bold text-primary">{component.value}V</span>
                </div>
                <input 
                  type="range" 
                  min="0.5"
                  max="48"
                  step="0.5"
                  value={component.value} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex gap-1 mt-1.5">
                  {[1.5, 3.3, 5, 9, 12, 24].map(v => (
                    <button
                      key={v}
                      onClick={() => onUpdate(component.id, { value: v })}
                      className={`flex-1 py-0.5 text-[9px] font-mono rounded border transition ${
                        component.value === v ? "bg-primary text-primary-foreground border-primary font-bold" : "bg-muted/40 hover:bg-accent border-border"
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <label htmlFor="isAC" className="text-[11px] font-medium cursor-pointer">AC (Alternating Current)</label>
                <input 
                  type="checkbox" 
                  id="isAC"
                  checked={component.isAC || false} 
                  onChange={(e) => onUpdate(component.id, { isAC: e.target.checked })}
                  className="rounded border-border cursor-pointer"
                />
              </div>

              {component.isAC && (
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Frequency:</span>
                    <span className="font-mono font-bold text-primary">{component.frequency || 1} Hz</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={component.frequency || 1} 
                    onFocus={onPushHistory}
                    onChange={(e) => onUpdate(component.id, { frequency: Number(e.target.value) }, false)}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>
          )}

          {(component.type === 'resistor' || component.type === 'bulb') && (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span className="text-muted-foreground">Resistance:</span>
                  <span className="font-mono font-bold text-primary">{component.value} Ω</span>
                </div>
                <input 
                  type="range" 
                  min="1"
                  max="100"
                  step="1"
                  value={Math.min(component.value, 100)} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex gap-1 mt-1.5">
                  {[1, 5, 10, 20, 50, 100].map(r => (
                    <button
                      key={r}
                      onClick={() => onUpdate(component.id, { value: r })}
                      className={`flex-1 py-0.5 text-[9px] font-mono rounded border transition ${
                        component.value === r ? "bg-primary text-primary-foreground border-primary font-bold" : "bg-muted/40 hover:bg-accent border-border"
                      }`}
                    >
                      {r}Ω
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {component.type === 'potentiometer' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-muted-foreground">Wiper Resistance:</span>
                <span className="font-mono font-bold text-amber-500">{component.value} Ω</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="200" 
                step="0.5"
                value={component.value} 
                onFocus={onPushHistory}
                onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}

          {component.type === 'switch' && (
            <div className="p-2 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
              <span className="text-[11px] font-medium">Contact State:</span>
              <button
                onClick={() => onUpdate(component.id, { isOpen: !component.isOpen })}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                  component.isOpen ? "bg-rose-500/20 text-rose-500 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                }`}
              >
                {component.isOpen ? "OPEN (Break)" : "CLOSED (Conducting)"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card divide-y divide-border">
      {/* Global Circuit Metrics */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Gauge size={14} className="text-primary" />
          <h3 className="font-bold text-xs">Circuit Telemetry</h3>
        </div>

        <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
          <div className="p-1.5 bg-muted/30 rounded-lg border border-border">
            <span className="text-muted-foreground block text-[8px] uppercase">Total EMF:</span>
            <span className="font-black text-sky-400">{globalStats.totalEmf.toFixed(1)} V</span>
          </div>
          <div className="p-1.5 bg-muted/30 rounded-lg border border-border">
            <span className="text-muted-foreground block text-[8px] uppercase">Total Current:</span>
            <span className="font-black text-emerald-400">{globalStats.totalCurrent.toFixed(3)} A</span>
          </div>
          <div className="p-1.5 bg-muted/30 rounded-lg border border-border">
            <span className="text-muted-foreground block text-[8px] uppercase">Equivalent Req:</span>
            <span className="font-black text-amber-400">
              {globalStats.totalResistance > 0 ? `${globalStats.totalResistance.toFixed(1)} Ω` : "---"}
            </span>
          </div>
          <div className="p-1.5 bg-muted/30 rounded-lg border border-border">
            <span className="text-muted-foreground block text-[8px] uppercase">Total Power:</span>
            <span className="font-black text-rose-400">{globalStats.totalPower.toFixed(2)} W</span>
          </div>
        </div>
      </div>

      {/* Selected Component Properties */}
      <div className="flex-1 overflow-y-auto">
        {renderComponentEditor()}
      </div>
    </div>
  );
}
