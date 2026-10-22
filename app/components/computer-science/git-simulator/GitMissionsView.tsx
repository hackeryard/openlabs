"use client";

import React, { useState } from "react";
import { RepoState } from "@/app/types/gitSimualtor";
import { GIT_MISSIONS, GitMission } from "@/app/labs/computer-science/git-simulator/utils/missions";
import { PresetKey } from "@/app/labs/computer-science/git-simulator/utils/presets";
import {
  Trophy,
  CheckCircle2,
  Circle,
  ArrowRight,
  HelpCircle,
  Terminal,
  Sparkles,
  Zap,
  RotateCcw,
  Play,
  Award,
} from "lucide-react";

interface Props {
  state: RepoState;
  onRunCommand: (command: string) => void;
  onLoadPreset: (presetKey: PresetKey) => void;
  onMissionCompleted: (missionId: string, xpReward: number) => void;
}

export default function GitMissionsView({
  state,
  onRunCommand,
  onLoadPreset,
  onMissionCompleted,
}: Props) {
  const [selectedMissionId, setSelectedMissionId] = useState<string>("mission-init");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    passed: boolean;
    message: string;
  }>({ tested: false, passed: false, message: "" });

  const activeMission =
    GIT_MISSIONS.find((m) => m.id === selectedMissionId) || GIT_MISSIONS[0];

  const completedMissions = state.completedMissions || [];
  const isCompleted = completedMissions.includes(activeMission.id);

  const handleValidate = () => {
    const res = activeMission.validator(state);
    setValidationResult({ tested: true, passed: res.passed, message: res.message });
    if (res.passed && !isCompleted) {
      onMissionCompleted(activeMission.id, activeMission.xpReward);
    }
  };

  const handleSelectMission = (mission: GitMission) => {
    setSelectedMissionId(mission.id);
    setShowHint(false);
    setValidationResult({ tested: false, passed: false, message: "" });

    // If mission has an initial preset and repository is currently empty, prompt or load
    if (mission.initialPreset && !state.initialized) {
      onLoadPreset(mission.initialPreset);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Trophy size={18} />
            <span>Interactive Guided Missions (10 Quests)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Master Git through hands-on scenario-driven quests. Practice first commits, branching, 3-way merges, resolving conflicts, rebasing, and cherry-picking with automated state validation.
          </p>
        </div>

        {/* Progress badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold shadow-2xs">
          <Award size={16} className="text-amber-500" />
          <span>
            {completedMissions.length} / {GIT_MISSIONS.length} Quests Mastered
          </span>
        </div>
      </div>

      {/* Main Grid: Mission Selector (4 cols) & Active Quest Canvas (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Missions List Sidebar */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block px-1">
            Curriculum Sequence
          </span>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {GIT_MISSIONS.map((mission) => {
              const isDone = completedMissions.includes(mission.id);
              const isCurrent = mission.id === activeMission.id;

              return (
                <button
                  key={mission.id}
                  onClick={() => handleSelectMission(mission)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "border-primary bg-primary/10 shadow-xs"
                      : isDone
                      ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <Circle size={18} className="text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-foreground truncate">
                        {mission.order}. {mission.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                        <span
                          className={`font-semibold ${
                            mission.difficulty === "Beginner"
                              ? "text-emerald-500"
                              : mission.difficulty === "Intermediate"
                              ? "text-blue-500"
                              : "text-purple-500"
                          }`}
                        >
                          {mission.difficulty}
                        </span>
                        <span>•</span>
                        <span>+{mission.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 transition-transform ${
                      isCurrent ? "text-primary translate-x-0.5" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Mission Workspace */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
            {/* Quest Header */}
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Quest #{activeMission.order} • {activeMission.category}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Zap size={14} /> +{activeMission.xpReward} XP
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-foreground">
                {activeMission.title}
              </h2>
            </div>

            {/* Narrative Scenario */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/80 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Real-World Scenario
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeMission.scenario}
              </p>
            </div>

            {/* Objective */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                Target Objective
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                {activeMission.objective}
              </p>
            </div>

            {/* Recommended Commands / Quick Run Pills */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground block">
                Suggested Commands (Click to run):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeMission.recommendedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => onRunCommand(cmd)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors group"
                  >
                    <Terminal size={12} className="text-primary group-hover:scale-110 transition-transform" />
                    <span>{cmd}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Preset Loader if applicable */}
            {activeMission.initialPreset && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 text-xs">
                <span className="text-muted-foreground">
                  Need a fresh sandbox configured for this quest?
                </span>
                <button
                  onClick={() => onLoadPreset(activeMission.initialPreset!)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold bg-background hover:bg-muted border border-border text-foreground transition-colors"
                >
                  <RotateCcw size={12} />
                  Load Scenario Preset
                </button>
              </div>
            )}

            {/* Hint Dropdown */}
            <div className="space-y-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
              >
                <HelpCircle size={14} />
                <span>{showHint ? "Hide step-by-step guidance" : "Need a hint? Click here"}</span>
              </button>

              {showHint && (
                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs text-muted-foreground animate-in fade-in duration-150">
                  <div className="font-semibold text-foreground">Step-by-step guidance:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {activeMission.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Validation Outcome Banner */}
            {validationResult.tested && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
                  validationResult.passed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                }`}
              >
                {validationResult.passed ? (
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm">
                  <div className="font-bold">
                    {validationResult.passed ? "Quest Completed!" : "Requirements Not Met"}
                  </div>
                  <p className="mt-0.5 leading-relaxed">{validationResult.message}</p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {isCompleted ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> You have already completed this quest!
                  </span>
                ) : (
                  <span>Run your commands below, then click Verify.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleValidate}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all"
                >
                  <Sparkles size={14} />
                  Verify Quest Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
