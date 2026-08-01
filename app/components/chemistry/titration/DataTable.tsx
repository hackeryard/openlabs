"use client";

import React from "react";
import { Download } from "lucide-react";
import type { TitrationType, IndicatorType } from "./engine";

interface DataPoint {
  volume: number;
  value: number; // pH or potential
  color: string;
}

interface DataTableProps {
  data: DataPoint[];
  titrationType: TitrationType;
  indicator?: IndicatorType;
}

function getColorLabel(rgba: string, indicator: string | undefined, value: number, isRedox: boolean): string {
  if (isRedox) {
    if (value > 1.2) return "Purple";
    if (value > 0.8) return "Pale Pink";
    return "Colorless";
  }
  
  if (indicator === 'phenolphthalein') {
    if (value < 8.2) return "Colorless";
    if (value < 9.0) return "Pale Pink";
    if (value < 10.0) return "Pink";
    return "Bright Pink";
  }
  
  if (indicator === 'methyl-orange') {
    if (value < 3.1) return "Red";
    if (value < 4.4) return "Orange";
    return "Yellow";
  }
  
  if (indicator === 'universal') {
    if (value < 3) return "Red";
    if (value < 6) return "Orange";
    if (value < 8) return "Green";
    if (value < 11) return "Blue";
    return "Purple";
  }
  
  return "Unknown";
}

export default function DataTable({ data, titrationType, indicator }: DataTableProps) {
  const isRedox = titrationType === 'redox';
  const valueLabel = isRedox ? "Potential (V)" : "pH";

  const exportCSV = () => {
    if (data.length === 0) return;

    const headers = ["Volume Added (mL)", valueLabel, "Observation Color"];
    const rows = data.map(d => [
      d.volume.toFixed(2),
      d.value.toFixed(2),
      getColorLabel(d.color, indicator, d.value, isRedox)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `titration_data_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-card/95 backdrop-blur-sm border border-border/40 rounded-2xl flex flex-col min-h-[250px] shadow-sm overflow-hidden flex-shrink-0">
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm px-2">Experimental Data Log</h3>
        <button
          onClick={exportCSV}
          disabled={data.length === 0}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0">
            <tr>
              <th className="px-4 py-2 font-medium">Volume Added (mL)</th>
              <th className="px-4 py-2 font-medium">{valueLabel}</th>
              <th className="px-4 py-2 font-medium">Observation (Color)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  No data recorded yet. Add titrant to start plotting.
                </td>
              </tr>
            ) : (
              data.map((point, index) => {
                const colorLabel = getColorLabel(point.color, indicator, point.value, isRedox);
                return (
                  <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-1.5 font-mono">{point.volume.toFixed(2)}</td>
                    <td className="px-4 py-1.5 font-mono font-medium text-primary">{point.value.toFixed(2)}</td>
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        {colorLabel !== "Colorless" && (
                          <div
                            className="w-4 h-4 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: point.color }}
                          ></div>
                        )}
                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[150px]">
                          {colorLabel}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            {/* Empty element to help scroll to bottom if needed, though react handles it okay with flex-col-reverse sometimes */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
