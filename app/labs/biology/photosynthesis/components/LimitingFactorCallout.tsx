import React from "react";
import { LimitingFactor } from "../lib/types";
import { AlertCircle, CheckCircle2, Droplets, Sun, Wind, Thermometer } from "lucide-react";

export default function LimitingFactorCallout({ factor }: { factor: LimitingFactor }) {
  if (factor === "None") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-800 text-sm">Optimal Rate Achieved!</h4>
          <p className="text-emerald-600 text-xs mt-1 leading-relaxed">
            All factors are abundant. The plant is photosynthesizing near its maximum possible rate.
          </p>
        </div>
      </div>
    );
  }

  const factorConfig = {
    Light: {
      icon: <Sun className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      color: "amber",
      title: "Light is the Limiting Factor",
      desc: "The plant doesn't have enough light energy to drive the light-dependent reactions faster. Increasing other factors won't help until you increase light.",
    },
    CO2: {
      icon: <Wind className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      color: "emerald",
      title: "CO₂ is the Limiting Factor",
      desc: "The Calvin cycle lacks enough Carbon Dioxide to build glucose. Increasing light or water won't boost the rate until CO₂ increases.",
    },
    Water: {
      icon: <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
      color: "blue",
      title: "Water is the Limiting Factor",
      desc: "Water is required as an electron donor. Without enough water, photosynthesis slows down and stomata close, halting the process.",
    },
    Temperature: {
      icon: <Thermometer className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
      color: "rose",
      title: "Temperature is the Limiting Factor",
      desc: "Enzymes that drive photosynthesis work best around 25-30°C. Extreme cold slows them down, and extreme heat denatures them.",
    },
  };

  const config = factorConfig[factor];

  let containerClass = "bg-slate-50 border-slate-200";
  let titleClass = "text-slate-800";
  let descClass = "text-slate-700";

  if (config.color === "amber") { containerClass = "bg-amber-50 border-amber-200"; titleClass = "text-amber-800"; descClass = "text-amber-700"; }
  if (config.color === "emerald") { containerClass = "bg-emerald-50 border-emerald-200"; titleClass = "text-emerald-800"; descClass = "text-emerald-700"; }
  if (config.color === "blue") { containerClass = "bg-blue-50 border-blue-200"; titleClass = "text-blue-800"; descClass = "text-blue-700"; }
  if (config.color === "rose") { containerClass = "bg-rose-50 border-rose-200"; titleClass = "text-rose-800"; descClass = "text-rose-700"; }

  return (
    <div className={`${containerClass} border p-4 rounded-xl flex items-start gap-3 transition-colors`}>
      {config.icon}
      <div>
        <h4 className={`font-bold ${titleClass} text-sm`}>{config.title}</h4>
        <p className={`${descClass} text-xs mt-1 leading-relaxed`}>
          {config.desc}
        </p>
      </div>
    </div>
  );
}
