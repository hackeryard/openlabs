"use client";

import React from "react";
import { CircuitComponent, SolverResult } from "./engine";

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  component: CircuitComponent | null;
  solverResult: SolverResult;
  onUpdate: (id: string, updates: Partial<CircuitComponent>, saveHistory?: boolean) => void;
  globalStats: { totalEmf: number, totalCurrent: number, totalResistance: number, totalPower: number };
  onPushHistory: () => void;
}

export default function PropertiesPanel({
  selectedComponentId,
  component,
  solverResult,
  onUpdate,
  globalStats,
  onPushHistory
}: PropertiesPanelProps) {

  const renderComponentEditor = () => {
    if (!component) return null;

    const voltage = solverResult.componentVoltages[component.id] || 0;
    const current = solverResult.componentCurrents[component.id] || 0;
    const power = solverResult.componentPowers[component.id] || 0;
    const absCurrent = Math.abs(current);

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg capitalize">{component.type}</h3>
        
        {/* Editor Inputs */}
        <div className="space-y-3">
          {(component.type === 'battery') && (
            <>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">EMF (Volts)</label>
                <input 
                  type="number" 
                  value={component.value} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                  className="w-full bg-background border border-border rounded px-3 py-1"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Internal Resistance (Ohms)</label>
                <input 
                  type="number" 
                  value={component.internalResistance || 0} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { internalResistance: Number(e.target.value) }, false)}
                  className="w-full bg-background border border-border rounded px-3 py-1"
                />
              </div>
              <div className="flex items-center gap-2 mt-4 mb-2">
                <input 
                  type="checkbox" 
                  id="isAC"
                  checked={component.isAC || false} 
                  onChange={(e) => onUpdate(component.id, { isAC: e.target.checked })}
                  className="rounded border-border"
                />
                <label htmlFor="isAC" className="text-sm font-medium">AC Mode (Alternating Current)</label>
              </div>
              {component.isAC && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Frequency (Hz)</label>
                  <input 
                    type="number" 
                    value={component.frequency || 1} 
                    onFocus={onPushHistory}
                    onChange={(e) => onUpdate(component.id, { frequency: Number(e.target.value) }, false)}
                    className="w-full bg-background border border-border rounded px-3 py-1"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              )}
            </>
          )}

          {(component.type === 'resistor' || component.type === 'bulb') && (
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Resistance (Ohms)</label>
              <input 
                type="number" 
                value={component.value} 
                onFocus={onPushHistory}
                onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                className="w-full bg-background border border-border rounded px-3 py-1"
              />
            </div>
          )}

          {component.type === 'capacitor' && (
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Capacitance (Farads)</label>
              <input 
                type="number" 
                value={component.value} 
                onFocus={onPushHistory}
                onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                className="w-full bg-background border border-border rounded px-3 py-1"
                step="0.001"
              />
            </div>
          )}

          {component.type === 'switch' && (
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input 
                  type="checkbox" 
                  checked={component.isOpen} 
                  onChange={(e) => onUpdate(component.id, { isOpen: e.target.checked })}
                  className="rounded border-border"
                />
                Switch is Open
              </label>
            </div>
          )}

          {component.type === 'potentiometer' && (
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm text-muted-foreground">Resistance (Ohms)</label>
                <span className="text-sm font-mono">{component.value} Ω</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1000" 
                step="0.1"
                value={component.value} 
                onFocus={onPushHistory}
                onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                className="w-full"
              />
            </div>
          )}

          {component.type === 'fuse' && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <input 
                    type="checkbox" 
                    checked={component.isOpen} 
                    onChange={(e) => onUpdate(component.id, { isOpen: e.target.checked })}
                    className="rounded border-border"
                  />
                  Fuse is Blown (Open)
                </label>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Current Rating (Amps)</label>
                <input 
                  type="number" 
                  value={component.maxCurrent || 2} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { maxCurrent: Number(e.target.value) }, false)}
                  className="w-full bg-background border border-border rounded px-3 py-1"
                />
                <p className="text-xs text-muted-foreground mt-1">If current exceeds this rating, the fuse will blow automatically.</p>
              </div>
            </>
          )}

          {component.type === 'led' && (
            <>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Internal Resistance (Ohms)</label>
                <input 
                  type="number" 
                  value={component.value} 
                  onFocus={onPushHistory}
                  onChange={(e) => onUpdate(component.id, { value: Number(e.target.value) }, false)}
                  className="w-full bg-background border border-border rounded px-3 py-1"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">LED Color</label>
                <select 
                  value={component.color || 'red'} 
                  onChange={(e) => onUpdate(component.id, { color: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-1"
                >
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                  <option value="white">White</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Live Readings */}
        <div className="bg-accent/30 p-4 rounded-lg space-y-3 mt-6 border border-border/50">
          <h4 className="font-medium text-sm border-b border-border/50 pb-2 text-foreground/80">Live Readings</h4>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Voltage Drop</span>
              <span className="font-mono bg-background/50 px-2 py-1 rounded border border-border/30">{voltage.toFixed(3)} V</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current</span>
              <span className="font-mono bg-background/50 px-2 py-1 rounded border border-border/30">{absCurrent.toFixed(3)} A</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Power</span>
              <span className="font-mono bg-background/50 px-2 py-1 rounded border border-border/30">{power.toFixed(3)} W</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-5 flex flex-col gap-8 h-full overflow-y-auto">
      <div>
        <h2 className="font-semibold text-lg mb-4 text-foreground/90">Properties</h2>
        {selectedComponentId ? (
          renderComponentEditor()
        ) : (
          <div className="bg-muted/50 border border-border/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Select a component on the grid to view its properties.</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-4 border-t border-border pt-6 text-foreground/90">Global Stats</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Total EMF</span>
            <span className="font-mono bg-muted px-2.5 py-1 rounded-md border border-border/50">{globalStats.totalEmf.toFixed(2)} V</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Total Current</span>
            <span className="font-mono bg-muted px-2.5 py-1 rounded-md border border-border/50">{globalStats.totalCurrent.toFixed(3)} A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Total Power</span>
            <span className="font-mono bg-muted px-2.5 py-1 rounded-md border border-border/50">{globalStats.totalPower.toFixed(2)} W</span>
          </div>
        </div>
      </div>
    </div>
  );
}
