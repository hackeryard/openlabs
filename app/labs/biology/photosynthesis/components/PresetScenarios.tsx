import React from "react";
import { PRESETS } from "../lib/presets";
import { SimulatorState } from "../lib/types";

interface PresetScenariosProps {
  onSelect: (state: SimulatorState) => void;
  currentState: SimulatorState;
}

export default function PresetScenarios({ onSelect, currentState }: PresetScenariosProps) {
  // Check if current state matches any preset (optional, for active state)
  const isMatch = (preset: SimulatorState) => {
    return preset.light === currentState.light &&
           preset.co2 === currentState.co2 &&
           preset.water === currentState.water &&
           preset.temperature === currentState.temperature;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
        Preset Scenarios
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([name, state]) => (
          <button
            key={name}
            onClick={() => onSelect(state)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isMatch(state)
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
