// app/components/physics/general-relativity/InvestigationGuidePanel.tsx
"use client";

import React, { useState } from "react";
import { GuidedInvestigation } from "./types";
import { GUIDED_INVESTIGATIONS } from "./engine";
import {
  Compass,
  CheckCircle2,
  Circle,
  Play,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
  Calendar,
  User,
} from "lucide-react";

interface InvestigationGuidePanelProps {
  onApplyInvestigation: (inv: GuidedInvestigation) => void;
  activeInvestigationId: string | null;
  onSelectInvestigationId: (id: string) => void;
}

export default function InvestigationGuidePanel({
  onApplyInvestigation,
  activeInvestigationId,
  onSelectInvestigationId,
}: InvestigationGuidePanelProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const selectedInv =
    GUIDED_INVESTIGATIONS.find((i) => i.id === activeInvestigationId) ||
    GUIDED_INVESTIGATIONS[0];

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const completedCount = selectedInv.steps.filter(
    (_, idx) => completedSteps[`${selectedInv.id}-${idx}`]
  ).length;
  const progressPercent = Math.round((completedCount / selectedInv.steps.length) * 100);

  return (
    <div className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Structured Lab Protocols
            </h3>
            <p className="text-[11px] text-foreground font-semibold">
              Historical & Relativistic Milestones
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
          {completedCount} / {selectedInv.steps.length} Verified
        </span>
      </div>

      {/* Investigation Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
        {GUIDED_INVESTIGATIONS.map((inv, index) => {
          const isSelected = selectedInv.id === inv.id;
          return (
            <button
              key={inv.id}
              onClick={() => onSelectInvestigationId(inv.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted/80"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-primary/20 text-[10px] font-mono flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <span className="truncate max-w-[130px]">{inv.title.split(" ")[0]} {inv.title.split(" ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Investigation Detail Card */}
      <div className="bg-muted/30 border border-border/80 rounded-xl p-3.5 flex flex-col gap-3">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              {selectedInv.historicalYear}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-amber-400" />
              {selectedInv.leadScientist}
            </span>
          </div>
          <h4 className="text-sm font-bold text-foreground leading-snug">
            {selectedInv.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedInv.subtitle}
          </p>
        </div>

        {/* Objective */}
        <div className="p-2.5 rounded-lg bg-card border border-border/70 text-xs">
          <span className="font-semibold text-sky-400 flex items-center gap-1 mb-1">
            <Info className="w-3.5 h-3.5" />
            Core Laboratory Objective
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {selectedInv.objective}
          </p>
        </div>

        {/* Mathematical Equation */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-border text-center font-mono text-xs shadow-inner">
          <div className="text-amber-400 font-bold mb-0.5 text-xs sm:text-sm">
            {selectedInv.formula}
          </div>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
            {selectedInv.formulaDescription}
          </p>
        </div>

        {/* 1-Click Setup Button */}
        <button
          onClick={() => onApplyInvestigation(selectedInv)}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Auto-Configure Experiment Parameters & Mode
        </button>

        {/* Step-by-Step Procedure */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Experimental Protocol</span>
            <span className="text-[10px] font-mono text-muted-foreground lowercase">
              {progressPercent}% completed
            </span>
          </span>

          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-sky-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {selectedInv.steps.map((step, idx) => {
              const stepKey = `${selectedInv.id}-${idx}`;
              const isDone = !!completedSteps[stepKey];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(stepKey)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-card/70 border-border/60 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <button className="mt-0.5 text-sky-400 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 leading-relaxed">
                    <strong className="text-foreground mr-1">Step {idx + 1}:</strong>
                    <span>{step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expected Observation & Takeaway */}
        <div className="p-3 rounded-xl bg-card border border-border/80 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Expected Phenomenon</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {selectedInv.expectedObservation}
          </p>
          <div className="pt-2 border-t border-border/60 mt-1">
            <span className="font-semibold text-foreground text-[11px]">Key Theoretical Takeaway: </span>
            <span className="text-muted-foreground text-[11px] leading-relaxed">
              {selectedInv.keyTakeaway}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
