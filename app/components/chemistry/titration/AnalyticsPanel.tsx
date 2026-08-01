"use client";

import React from "react";
import { TitrationParams } from "./engine";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsPanelProps {
  data: { volume: number; value: number }[]; // value is pH or potential
  params: TitrationParams;
  practiceMode: boolean;
}

export default function AnalyticsPanel({ data, params, practiceMode }: AnalyticsPanelProps) {
  const isRedox = params.type === 'redox';
  const yLabel = isRedox ? "Potential (V)" : "pH";
  const yMin = isRedox ? 0.5 : 0;
  const yMax = isRedox ? 1.7 : 14;

  const chartData = {
    datasets: [
      {
        label: isRedox ? "Potential Curve" : "pH Curve",
        data: data.map((d) => ({ x: d.volume, y: d.value })),
        borderColor: "rgba(59, 130, 246, 1)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 2,
        pointRadius: 1, // small points for the curve
        pointHoverRadius: 4,
        fill: false,
        tension: 0.4, // smooth curve
        animation: false as const, // User specifically requested this for streaming updates
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const, // Disable global animation for streaming performance
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: "Volume of Titrant Added (mL)",
        },
        min: 0,
        max: 50, // Burette capacity
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
        min: yMin,
        max: yMax,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${yLabel}: ${context.parsed.y.toFixed(2)}`,
        }
      }
    },
  };

  // Calculation C1V1 = C2V2
  // We want to calculate C2 (Analyte) if this were a real experiment.
  // Actually, we don't know the exact equivalence volume until it's detected, but for the UI we can show it dynamically.
  const currentVolume = data.length > 0 ? data[data.length - 1].volume : 0;
  const currentPH = data.length > 0 ? data[data.length - 1].value : (isRedox ? 0.77 : 7.0);

  // In a real lab, C1V1 = C2V2 is used. 
  // For redox (KMnO4 and FeSO4), it's 5Fe2+ + MnO4- -> ratio is 5:1.
  // We will just show the general C1V1 = C2V2 frame.
  const ratio = isRedox ? 5 : 1;

  const calculatedC2 = (params.titrantConcentration * currentVolume * ratio) / params.analyteVolume;

  return (
    <div className="w-full bg-card/95 backdrop-blur-sm border border-border/40 rounded-2xl p-3 flex flex-col gap-3 flex-shrink-0 shadow-sm">

      {/* Live Graph Section */}
      <div className="border border-border rounded-lg p-2 bg-background relative">
        <h3 className="text-xs font-semibold mb-1 text-center text-muted-foreground">{yLabel} vs Volume</h3>
        <div className="w-full h-[180px]">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* Live Calculation Panel */}
      <div className="bg-muted/30 border border-border rounded-xl p-3">
        <h3 className="text-xs font-bold mb-2 border-b border-border pb-1.5 text-muted-foreground uppercase tracking-wider">Live Stoichiometry</h3>
        
        <div className="text-xs space-y-2 font-mono">
          <div className="text-center font-bold bg-background p-1 rounded border border-border text-primary text-sm shadow-sm">
            {isRedox ? '5C₁V₁ = C₂V₂ (Fe²⁺/MnO₄⁻)' : 'C₁V₁ = C₂V₂'}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 p-1.5 rounded border border-border/50">
              <div className="text-muted-foreground font-sans text-[10px] uppercase font-bold mb-0.5">Titrant (1)</div>
              <div className="text-foreground">C₁ = {params.titrantConcentration.toFixed(3)} M</div>
              <div className="text-foreground">V₁ = {currentVolume.toFixed(2)} mL</div>
            </div>
            <div className="bg-background/50 p-1.5 rounded border border-border/50">
              <div className="text-muted-foreground font-sans text-[10px] uppercase font-bold mb-0.5">Analyte (2)</div>
              <div className="text-foreground">V₂ = {params.analyteVolume.toFixed(1)} mL</div>
              <div className="text-foreground">
                C₂ = {practiceMode ? '???' : params.analyteConcentration.toFixed(3) + ' M'}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-2 mt-1">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground font-sans text-[10px] uppercase font-bold">Estimated C₂</div>
              <div className="text-sm text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {calculatedC2.toFixed(4)} M
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
