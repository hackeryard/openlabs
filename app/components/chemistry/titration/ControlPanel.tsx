"use client";

import React, { useRef } from "react";
import type { TitrationParams, IndicatorType } from "./engine";
import { Play, Square, Settings2, RotateCcw, Droplet, FastForward, CheckCircle2 } from "lucide-react";

interface ControlPanelProps {
  params: TitrationParams;
  setParams: (p: TitrationParams) => void;
  indicator: IndicatorType;
  setIndicator: (i: IndicatorType) => void;
  onDrop: (amount: number) => void;
  isDropping: boolean;
  setIsDropping: (d: boolean) => void;
  onReset: () => void;
  practiceMode: boolean;
  setPracticeMode: (p: boolean) => void;
  onPracticeSubmit?: (calculatedConcentration: number) => void;
}

const PRESETS = [
  {
    name: "Strong Acid + Strong Base",
    params: { type: "strong-acid-strong-base", titrantConcentration: 0.1, analyteVolume: 25, analyteConcentration: 0.1 }
  },
  {
    name: "Weak Acid + Strong Base",
    params: { type: "weak-acid-strong-base", titrantConcentration: 0.1, analyteVolume: 25, analyteConcentration: 0.1, pKa: 4.74 }
  },
  {
    name: "Strong Acid + Weak Base",
    params: { type: "strong-acid-weak-base", titrantConcentration: 0.1, analyteVolume: 25, analyteConcentration: 0.1, pKb: 4.75 }
  },
  {
    name: "Redox (KMnO4 + FeSO4)",
    params: { type: "redox", titrantConcentration: 0.02, analyteVolume: 25, analyteConcentration: 0.1 }
  }
] as const;

export default function ControlPanel({
  params, setParams, indicator, setIndicator, onDrop, isDropping, setIsDropping, onReset, practiceMode, setPracticeMode, onPracticeSubmit
}: ControlPanelProps) {

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [practiceAnswer, setPracticeAnswer] = React.useState("");

  const startHoldDrop = () => {
    setIsDropping(true);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      onDrop(0.1);
    }, 100);
  };

  const stopHoldDrop = () => {
    setIsDropping(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  return (
    <div className="w-full lg:w-[320px] bg-card/95 backdrop-blur-sm border border-border/40 rounded-2xl p-4 lg:p-5 flex flex-col gap-4 overflow-visible lg:overflow-y-auto lg:min-h-0 flex-shrink-0 shadow-sm">

      {/* Top section: Presets */}
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-3">
          <Settings2 size={20} className="text-primary" /> Setup
        </h2>

        <label className="text-sm font-medium mb-1 block">Scenario Preset</label>
        <select
          className="w-full bg-background border border-border rounded p-2 text-sm"
          value={params.type}
          onChange={(e) => {
            const preset = PRESETS.find(p => p.params.type === e.target.value);
            if (preset) {
              setParams(preset.params as TitrationParams);
              setIndicator(preset.params.type === 'redox' ? 'none' : 'phenolphthalein');
              onReset();
            }
          }}
        >
          {PRESETS.map((p, i) => (
            <option key={i} value={p.params.type}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border">
        <input
          type="checkbox"
          id="practiceMode"
          checked={practiceMode}
          onChange={(e) => {
            setPracticeMode(e.target.checked);
            onReset();
          }}
          className="rounded border-border"
        />
        <label htmlFor="practiceMode" className="text-sm font-medium cursor-pointer">Practice Mode (Hidden Concentration)</label>
      </div>

      {/* Parameters */}
      <div className="space-y-4 border-t border-border pt-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 block">Burette (Titrant)</label>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Concentration (M)</span>
            <input
              type="number"
              className="w-20 bg-background border border-border rounded px-2 py-1 text-right"
              value={params.titrantConcentration}
              step="0.01"
              min="0.01"
              onChange={(e) => setParams({ ...params, titrantConcentration: parseFloat(e.target.value) || 0.1 })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 block">Flask (Analyte)</label>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Volume (mL)</span>
            <input
              type="number"
              className="w-20 bg-background border border-border rounded px-2 py-1 text-right"
              value={params.analyteVolume}
              step="1"
              min="1"
              onChange={(e) => setParams({ ...params, analyteVolume: parseFloat(e.target.value) || 25 })}
            />
          </div>
          {!practiceMode && (
            <div className="flex items-center justify-between text-sm">
              <span>Concentration (M)</span>
              <input
                type="number"
                className="w-20 bg-background border border-border rounded px-2 py-1 text-right"
                value={params.analyteConcentration}
                step="0.01"
                min="0.01"
                onChange={(e) => setParams({ ...params, analyteConcentration: parseFloat(e.target.value) || 0.1 })}
              />
            </div>
          )}
        </div>

        {params.type !== 'redox' && (
          <div>
            <label className="text-sm font-medium mb-1 block">Indicator</label>
            <select
              className="w-full bg-background border border-border rounded p-2 text-sm"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value as IndicatorType)}
            >
              <option value="phenolphthalein">Phenolphthalein</option>
              <option value="methyl-orange">Methyl Orange</option>
              <option value="universal">Universal Indicator</option>
            </select>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-border pt-4 mt-auto">
        <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3 block">Titration Controls</label>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            className="bg-primary text-primary-foreground py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            onClick={() => { setIsDropping(true); onDrop(0.1); setTimeout(() => setIsDropping(false), 200); }}
          >
            <Droplet size={16} /> 0.1 mL Drop
          </button>

          <button
            className="bg-secondary text-secondary-foreground py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            onClick={() => { setIsDropping(true); onDrop(1.0); setTimeout(() => setIsDropping(false), 200); }}
          >
            <FastForward size={16} /> 1.0 mL Fast
          </button>
        </div>

        <button
          className={`w-full py-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${isDropping ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          onMouseDown={startHoldDrop}
          onMouseUp={stopHoldDrop}
          onMouseLeave={stopHoldDrop}
          onTouchStart={startHoldDrop}
          onTouchEnd={stopHoldDrop}
        >
          {isDropping ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          {isDropping ? 'Release to Stop' : 'Hold to Stream'}
        </button>

        <button
          className="w-full mt-3 py-2 border border-border bg-background hover:bg-accent rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          onClick={onReset}
        >
          <RotateCcw size={16} /> Reset Experiment
        </button>
      </div>

      {/* Practice Mode Submit */}
      {practiceMode && onPracticeSubmit && (
        <div className="border-t border-border pt-4 bg-muted/30 -mx-4 px-4 pb-4 mt-2">
          <label className="text-sm font-medium mb-2 block">Submit Concentration</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="e.g. 0.125"
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm"
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
              step="0.001"
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center justify-center"
              onClick={() => {
                if (practiceAnswer) onPracticeSubmit(parseFloat(practiceAnswer));
              }}
            >
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
