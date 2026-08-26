"use client";

import React from "react";
import { ExperimentTrial } from "./types";
import { Table, Download, Trash2, PlusCircle, CheckCircle2 } from "lucide-react";

interface DataTableProps {
  trials: ExperimentTrial[];
  onAddTrial: () => void;
  onClearTrials: () => void;
}

export default function DataTable({ trials, onAddTrial, onClearTrials }: DataTableProps) {
  const exportCSV = () => {
    if (trials.length === 0) return;
    const headers = ["ID", "Timestamp", "Mode", "Parameters", "Flux (uWb)", "Peak EMF (V)", "Current (A)", "Power (W)"];
    const rows = trials.map((t) => [
      t.id,
      t.timestamp,
      t.mode,
      `"${t.paramDescription}"`,
      (t.magneticFluxWb * 1e6).toFixed(2),
      t.peakEMF.toFixed(2),
      t.currentA.toFixed(3),
      t.powerW.toFixed(3),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faradays_induction_trials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Table size={18} className="text-primary" />
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Experimental Trials &amp; Telemetry Data Logger
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddTrial}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle size={14} />
            Record Data Point
          </button>
          {trials.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-foreground text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                onClick={onClearTrials}
                className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-rose-500 transition-all"
                title="Clear All Trials"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Content */}
      {trials.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-xs font-mono space-y-2">
          <p>No trials recorded yet in this session.</p>
          <p className="text-[11px] opacity-75">Click &quot;Record Data Point&quot; above to capture real-time EMF and flux metrics for comparative quantitative analysis.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Mode</th>
                <th className="py-2 px-3">Config</th>
                <th className="py-2 px-3">Flux (μWb)</th>
                <th className="py-2 px-3">Peak EMF (V)</th>
                <th className="py-2 px-3">Current (A)</th>
                <th className="py-2 px-3">Power (W)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {trials.map((trial, idx) => (
                <tr key={trial.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-3 font-bold text-muted-foreground">{idx + 1}</td>
                  <td className="py-2 px-3 text-muted-foreground">{trial.timestamp}</td>
                  <td className="py-2 px-3 uppercase text-[10px] font-bold text-primary">{trial.mode.replace("_", " ")}</td>
                  <td className="py-2 px-3 text-slate-300">{trial.paramDescription}</td>
                  <td className="py-2 px-3 text-amber-500 font-bold">{(trial.magneticFluxWb * 1e6).toFixed(1)}</td>
                  <td className="py-2 px-3 text-sky-400 font-black">{trial.peakEMF.toFixed(2)}</td>
                  <td className="py-2 px-3 text-emerald-400">{trial.currentA.toFixed(3)}</td>
                  <td className="py-2 px-3 text-purple-400 font-bold">{trial.powerW.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
