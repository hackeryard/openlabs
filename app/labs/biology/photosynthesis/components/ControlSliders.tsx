import React from "react";
import { SimulatorState, LimitingFactor } from "../lib/types";

interface ControlSlidersProps {
  state: SimulatorState;
  onChange: (key: keyof SimulatorState, value: number) => void;
  limitingFactor: LimitingFactor;
}

export default function ControlSliders({ state, onChange, limitingFactor }: ControlSlidersProps) {
  const controls = [
    {
      id: "light",
      label: "Light Intensity",
      value: state.light,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      factor: "Light",
      color: "amber",
    },
    {
      id: "co2",
      label: "CO₂ Concentration",
      value: state.co2,
      unit: " ppm",
      min: 0,
      max: 2000,
      step: 10,
      factor: "CO2",
      color: "emerald",
    },
    {
      id: "water",
      label: "Water Availability",
      value: state.water,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      factor: "Water",
      color: "blue",
    },
    {
      id: "temperature",
      label: "Temperature",
      value: state.temperature,
      unit: "°C",
      min: 0,
      max: 50,
      step: 1,
      factor: "Temperature",
      color: "rose",
    },
  ];

  return (
    <div className="space-y-6">
      {controls.map((ctrl) => {
        const isLimiting = limitingFactor === ctrl.factor;
        
        let accentColor = "bg-slate-200";
        let textColor = "text-slate-700";
        let borderClass = "border-slate-200";
        let hexColor = "#10b981";
        
        if (ctrl.color === "amber") { accentColor = "bg-amber-100"; textColor = "text-amber-700"; hexColor = "#f59e0b"; }
        if (ctrl.color === "emerald") { accentColor = "bg-emerald-100"; textColor = "text-emerald-700"; hexColor = "#10b981"; }
        if (ctrl.color === "blue") { accentColor = "bg-blue-100"; textColor = "text-blue-700"; hexColor = "#3b82f6"; }
        if (ctrl.color === "rose") { accentColor = "bg-rose-100"; textColor = "text-rose-700"; hexColor = "#f43f5e"; }

        if (isLimiting) {
          borderClass = `border-${ctrl.color}-500 ring-2 ring-${ctrl.color}-200`;
        }

        return (
          <div 
            key={ctrl.id}
            className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${borderClass}`}
          >
            <div className="flex justify-between items-center mb-3">
              <label htmlFor={ctrl.id} className="text-sm font-bold text-slate-800 flex items-center gap-2">
                {ctrl.label}
                {isLimiting && (
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${accentColor} ${textColor}`}>
                    Limiting Factor
                  </span>
                )}
              </label>
              <div className="text-sm font-mono font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded">
                {ctrl.value}{ctrl.unit}
              </div>
            </div>
            
            <div className="relative pt-1">
              <input
                id={ctrl.id}
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={ctrl.value}
                onChange={(e) => onChange(ctrl.id as keyof SimulatorState, Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-200"
                style={{
                  background: `linear-gradient(to right, ${hexColor} ${(ctrl.value - ctrl.min) / (ctrl.max - ctrl.min) * 100}%, #e2e8f0 ${(ctrl.value - ctrl.min) / (ctrl.max - ctrl.min) * 100}%)`
                }}
              />
            </div>
            
            {/* Keyboard a11y & screen readers */}
            <span className="sr-only" aria-live="polite">
              {ctrl.label} is currently {ctrl.value}{ctrl.unit}. {isLimiting ? "This is the limiting factor." : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
