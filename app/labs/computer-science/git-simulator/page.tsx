"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RepoState, CommitObject } from "@/app/types/gitSimualtor";
import { executeCommand } from "./utils/executeCommand";
import { getPresetState, PresetKey, PRESET_METAS } from "./utils/presets";
import { GIT_MISSIONS } from "./utils/missions";
import CommitGraph from "@/app/components/computer-science/git-simulator/CommitGraph";
import GitZonesView from "@/app/components/computer-science/git-simulator/GitZonesView";
import GitObjectsView from "@/app/components/computer-science/git-simulator/GitObjectsView";
import GitMissionsView from "@/app/components/computer-science/git-simulator/GitMissionsView";
import GitTerminal from "@/app/components/computer-science/git-simulator/GitTerminal";
import CommitDetailsModal from "@/app/components/computer-science/git-simulator/CommitDetailsModal";
import FileEditorModal from "@/app/components/computer-science/git-simulator/FileEditorModal";
import PresetSwitchConfirmModal from "@/app/components/computer-science/git-simulator/PresetSwitchConfirmModal";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  GitCommit,
  GitBranch,
  Layers,
  HardDrive,
  Trophy,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCode,
  CheckCircle2,
  ChevronDown,
  Terminal,
  Bookmark,
  FolderGit2,
  Save,
  Check,
  X,
} from "lucide-react";

type VisualizerTab = "graph" | "zones" | "objects" | "missions";

const STORAGE_KEY = "openlabs_git_custom_workspace";

function loadSavedCustomWorkspace(): RepoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.objects && parsed.refs) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to parse saved git workspace:", err);
  }
  return null;
}

function saveCustomWorkspace(stateToSave: RepoState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (err) {
    console.error("Failed to save git workspace:", err);
  }
}

export default function GitVisualizerPage() {
  const { completeExperiment } = useLab(
    "computer-science/git-simulator",
    "computerScience",
    "simulation"
  );
  const { setExperimentData } = useChat();

  // Initialize with Clean Starter Repo
  const [state, setState] = useState<RepoState>(() => getPresetState("clean"));
  const [activeTab, setActiveTab] = useState<VisualizerTab>("graph");
  const [selectedCommit, setSelectedCommit] = useState<CommitObject | null>(null);
  const [editingFile, setEditingFile] = useState<{
    filename: string;
    content: string;
    isConflict?: boolean;
  } | null>(null);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PresetKey>("clean");

  // Custom Workspace Persistence & Switching Protection
  const [customWorkspace, setCustomWorkspace] = useState<RepoState | null>(() => loadSavedCustomWorkspace());
  const [pendingPreset, setPendingPreset] = useState<PresetKey | null>(null);
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false);
  const [savedBannerNotice, setSavedBannerNotice] = useState<string | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    setExperimentData({
      title: "Interactive Git Version Control Simulator",
      theory:
        "Git is a distributed content-addressable version control system modeled as a Directed Acyclic Graph (DAG) of snapshots. Commits point to Trees, which point to Blobs. Branches are lightweight movable pointers to commits.",
      extraContext:
        "The user can run standard Git commands (git init, add, commit, branch, checkout, merge, rebase, stash, reset, cherry-pick) and inspect changes across the Working Tree, Staging Area, and Object Database.",
    });
  }, [setExperimentData]);

  // Check if current workspace has modified/custom work compared to baseline preset
  const isWorkspaceModified = useCallback((): boolean => {
    if (activePreset === "custom") {
      return (
        Object.keys(state.workingDir || {}).length > 0 ||
        Object.keys(state.index || {}).length > 0 ||
        Object.keys(state.refs || {}).length > 0 ||
        (state.history || []).length > 0
      );
    }

    try {
      const baseline = getPresetState(activePreset);
      const currWorking = state.workingDir || {};
      const baseWorking = baseline.workingDir || {};
      const currKeys = Object.keys(currWorking);
      const baseKeys = Object.keys(baseWorking);

      if (currKeys.length !== baseKeys.length) return true;
      for (const k of currKeys) {
        if (currWorking[k] !== baseWorking[k]) return true;
      }

      if (Object.keys(state.index || {}).length !== Object.keys(baseline.index || {}).length) return true;
      if (Object.keys(state.refs || {}).length !== Object.keys(baseline.refs || {}).length) return true;
      if ((state.history || []).length > (baseline.history || []).length) return true;
      if (Object.keys(state.objects || {}).length !== Object.keys(baseline.objects || {}).length) return true;

      return false;
    } catch {
      return true;
    }
  }, [state, activePreset]);

  // Handle command execution from terminal or quick pills
  const handleCommand = useCallback(
    (command: string) => {
      const { newState, output } = executeCommand(state, command);
      setState(newState);
      if (activePreset === "custom") {
        saveCustomWorkspace(newState);
        setCustomWorkspace(newState);
      }
      completeExperiment();
      return { output };
    },
    [state, activePreset, completeExperiment]
  );

  // User clicked a preset
  const handleSelectPreset = (targetKey: PresetKey) => {
    if (targetKey === activePreset) return;

    if (targetKey === "custom") {
      if (customWorkspace) {
        setState(customWorkspace);
        setActivePreset("custom");
        setSelectedCommit(null);
        setSavedBannerNotice(null);
      } else {
        saveCustomWorkspace(state);
        setCustomWorkspace(state);
        setActivePreset("custom");
      }
      return;
    }

    // If currently modified, open confirmation modal to avoid wiping user work
    if (isWorkspaceModified()) {
      setPendingPreset(targetKey);
      setShowSwitchModal(true);
      return;
    }

    // Clean preset switch
    const preset = getPresetState(targetKey);
    setState(preset);
    setActivePreset(targetKey);
    setSelectedCommit(null);
  };

  // Confirm Save & Switch
  const handleConfirmSaveAndSwitch = () => {
    if (!pendingPreset) return;

    saveCustomWorkspace(state);
    setCustomWorkspace(state);

    const targetKey = pendingPreset;
    const preset = getPresetState(targetKey);
    const targetMeta = PRESET_METAS.find((p) => p.id === targetKey);
    const targetName = targetMeta?.name || targetKey;

    setState(preset);
    setActivePreset(targetKey);
    setSelectedCommit(null);
    setShowSwitchModal(false);
    setPendingPreset(null);

    const fileCount = Object.keys(state.workingDir || {}).length;
    setSavedBannerNotice(
      `Switched to ${targetName}. Your previous working directory (${fileCount} ${
        fileCount === 1 ? "file" : "files"
      }) was saved to 'My Workspace'.`
    );
  };

  // Confirm Discard & Switch
  const handleConfirmDiscardAndSwitch = () => {
    if (!pendingPreset) return;
    const targetKey = pendingPreset;
    const preset = getPresetState(targetKey);
    setState(preset);
    setActivePreset(targetKey);
    setSelectedCommit(null);
    setShowSwitchModal(false);
    setPendingPreset(null);
  };

  // Cancel Switch
  const handleCancelSwitch = () => {
    setShowSwitchModal(false);
    setPendingPreset(null);
  };

  // Explicit Save to My Workspace
  const handleExplicitSave = () => {
    saveCustomWorkspace(state);
    setCustomWorkspace(state);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Reset entire repository
  const handleResetRepo = () => {
    const clean = getPresetState("clean");
    setState(clean);
    setActivePreset("clean");
    setSelectedCommit(null);
    setSavedBannerNotice(null);
  };

  // Save edited file back into working directory
  const handleSaveFile = (filename: string, newContent: string) => {
    setState((prev) => {
      const updated = {
        ...prev,
        workingDir: {
          ...prev.workingDir,
          [filename]: newContent,
        },
      };
      if (activePreset === "custom") {
        saveCustomWorkspace(updated);
        setCustomWorkspace(updated);
      }
      return updated;
    });
  };

  // Handle mission completed
  const handleMissionCompleted = (missionId: string, xpReward: number) => {
    setState((prev) => {
      const completed = prev.completedMissions || [];
      if (completed.includes(missionId)) return prev;
      return {
        ...prev,
        completedMissions: [...completed, missionId],
      };
    });
    completeExperiment();
  };

  // Derived state stats
  const commitCount = Object.values(state.objects).filter(
    (o) => o.type === "commit"
  ).length;
  const branchCount = Object.keys(state.refs).length;
  const stagedCount = Object.keys(state.index).length;
  const stashCount = state.stash?.length || 0;
  const isDetached = state.HEAD?.type === "commit";
  const activeBranch = isDetached
    ? `detached:${state.HEAD?.value.slice(0, 7)}`
    : state.HEAD?.value || "main";

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Daily Challenge Card Float */}
      <DailyChallengeCard
        labId="computer-science/git-simulator"
        currentParams={{
          commandsRun: state.history?.length || 1,
          branchesCreated: branchCount,
          commitsMade: commitCount,
          missionsCompleted: state.completedMissions?.length || 0,
        }}
      />

      {/* Header & Control Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Computer Science Studio
            </span>
            <span className="text-xs text-muted-foreground">• In-Browser Virtual Git Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Git Version Control Simulator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
            Explore Git&apos;s internal DAG architecture, three-tree lifecycle, branching, 3-way merges, conflict resolutions, and rebasing with real-time visual feedback.
          </p>
        </div>

        {/* Live Repository Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Branch / HEAD */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs shadow-2xs font-mono">
            <GitBranch size={13} className={isDetached ? "text-amber-500" : "text-primary"} />
            <span className="text-muted-foreground">HEAD:</span>
            <span className={`font-bold ${isDetached ? "text-amber-500" : "text-foreground"}`}>
              {activeBranch}
            </span>
          </div>

          {/* Commits */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs shadow-2xs font-mono">
            <GitCommit size={13} className="text-emerald-500" />
            <span className="font-bold text-foreground">{commitCount}</span>
            <span className="text-muted-foreground">commits</span>
          </div>

          {/* Staged */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs shadow-2xs font-mono">
            <Layers size={13} className="text-blue-500" />
            <span className="font-bold text-foreground">{stagedCount}</span>
            <span className="text-muted-foreground">staged</span>
          </div>

          {/* Stash */}
          {stashCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs shadow-2xs font-mono">
              <Bookmark size={13} className="text-purple-500" />
              <span className="font-bold text-foreground">{stashCount}</span>
              <span className="text-muted-foreground">stashed</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Selector & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-muted/40 border border-border">
        <div className="flex flex-wrap items-center gap-2">
          {/* User's Custom Workspace Tab */}
          <button
            onClick={() => handleSelectPreset("custom")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activePreset === "custom"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : customWorkspace
                ? "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                : "bg-background hover:bg-muted text-muted-foreground border border-dashed border-border"
            }`}
            title={
              customWorkspace
                ? "Your saved custom repository workspace"
                : "Switch to your personalized workspace"
            }
          >
            <FolderGit2
              size={13}
              className={activePreset === "custom" ? "text-primary-foreground" : "text-primary"}
            />
            <span>My Workspace</span>
            {customWorkspace && activePreset !== "custom" && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                title="Saved workspace available"
              />
            )}
          </button>

          <span className="text-border mx-1 select-none">|</span>

          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
            <Sparkles size={14} className="text-primary" />
            Presets:
          </span>

          {PRESET_METAS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activePreset === preset.id
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-background hover:bg-muted text-foreground border border-border"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Explicit Save Workspace Button */}
          <button
            onClick={handleExplicitSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              saveSuccessToast
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                : "bg-background hover:bg-muted border-border text-foreground"
            }`}
            title="Snapshot current repository to My Workspace"
          >
            {saveSuccessToast ? <Check size={13} className="text-emerald-500" /> : <Save size={13} />}
            {saveSuccessToast ? "Workspace Saved!" : "Save Workspace"}
          </button>

          <button
            onClick={() => setShowCheatsheet(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background hover:bg-muted border border-border text-foreground transition-colors"
          >
            <HelpCircle size={14} />
            Cheatsheet
          </button>
          <button
            onClick={handleResetRepo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background hover:bg-rose-500/10 hover:text-rose-500 border border-border text-muted-foreground transition-colors"
            title="Reset repository to clean slate"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>

      {/* Workspace Saved Alert / Restore Banner */}
      {savedBannerNotice && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <FolderGit2 size={16} className="shrink-0" />
            <span>{savedBannerNotice}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectPreset("custom")}
              className="font-bold underline hover:text-primary/80 transition-colors cursor-pointer"
            >
              Return to My Workspace &rarr;
            </button>
            <button
              onClick={() => setSavedBannerNotice(null)}
              className="p-1 rounded-md hover:bg-primary/20 transition-colors"
              title="Dismiss notice"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("graph")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors border-b-2 ${
            activeTab === "graph"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <GitCommit size={15} />
          <span>Interactive Commit Graph (DAG)</span>
        </button>

        <button
          onClick={() => setActiveTab("zones")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors border-b-2 ${
            activeTab === "zones"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Layers size={15} />
          <span>3-Zone Pipeline (Working Tree &rarr; Staging &rarr; Repo)</span>
        </button>

        <button
          onClick={() => setActiveTab("objects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors border-b-2 ${
            activeTab === "objects"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <HardDrive size={15} />
          <span>Git Internals &amp; Objects (.git/)</span>
        </button>

        <button
          onClick={() => setActiveTab("missions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors border-b-2 ${
            activeTab === "missions"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Trophy size={15} />
          <span>Guided Quests (10 Missions)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary">
            {state.completedMissions?.length || 0}/10
          </span>
        </button>
      </div>

      {/* Main Visualizer Area */}
      <div>
        {activeTab === "graph" && (
          <CommitGraph
            state={state}
            onSelectCommit={(commit) => setSelectedCommit(commit)}
          />
        )}

        {activeTab === "zones" && (
          <GitZonesView
            state={state}
            onRunCommand={handleCommand}
            onOpenFileEditor={(filename, content, isConflict) =>
              setEditingFile({ filename, content, isConflict })
            }
          />
        )}

        {activeTab === "objects" && <GitObjectsView state={state} />}

        {activeTab === "missions" && (
          <GitMissionsView
            state={state}
            onRunCommand={handleCommand}
            onLoadPreset={handleSelectPreset}
            onMissionCompleted={handleMissionCompleted}
          />
        )}
      </div>

      {/* Terminal Emulator (Always Visible at bottom) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-foreground flex items-center gap-2">
            <Terminal size={15} className="text-primary" />
            <span>Interactive Terminal Emulator</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Type commands or click quick action buttons
          </span>
        </div>

        <GitTerminal state={state} onCommand={handleCommand} />
      </div>

      {/* Modals */}
      {selectedCommit && (
        <CommitDetailsModal
          commit={selectedCommit}
          state={state}
          onClose={() => setSelectedCommit(null)}
          onSelectCommit={(commitId) => {
            const c = state.objects[commitId] as CommitObject | undefined;
            if (c) setSelectedCommit(c);
          }}
        />
      )}

      {editingFile && (
        <FileEditorModal
          filename={editingFile.filename}
          initialContent={editingFile.content}
          isConflict={editingFile.isConflict}
          onSave={handleSaveFile}
          onClose={() => setEditingFile(null)}
        />
      )}

      {/* Quick Cheatsheet Modal */}
      {showCheatsheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-foreground">
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Bookmark size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Git Command Reference &amp; Syntax</h3>
                  <p className="text-xs text-muted-foreground">
                    Essential commands supported in OpenLabs Git simulator
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="px-3 py-1.5 rounded-lg bg-muted text-xs font-semibold hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider">
                    Basic Workflow
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs">
                    <li><strong className="text-foreground">git init</strong> - Initialize repository</li>
                    <li><strong className="text-foreground">touch &lt;file&gt;</strong> - Create new file</li>
                    <li><strong className="text-foreground">git add .</strong> - Stage all changes</li>
                    <li><strong className="text-foreground">git commit -m &quot;msg&quot;</strong> - Record snapshot</li>
                    <li><strong className="text-foreground">git status</strong> - Check workspace state</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <h4 className="font-bold text-blue-500 text-xs uppercase tracking-wider">
                    Branching &amp; Switching
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs">
                    <li><strong className="text-foreground">git branch</strong> - List branches</li>
                    <li><strong className="text-foreground">git checkout -b &lt;name&gt;</strong> - Create &amp; switch</li>
                    <li><strong className="text-foreground">git switch &lt;name&gt;</strong> - Switch branch</li>
                    <li><strong className="text-foreground">git branch -d &lt;name&gt;</strong> - Delete branch</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <h4 className="font-bold text-purple-500 text-xs uppercase tracking-wider">
                    Merging &amp; Rebasing
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs">
                    <li><strong className="text-foreground">git merge &lt;branch&gt;</strong> - Fast-Forward or 3-Way</li>
                    <li><strong className="text-foreground">git rebase &lt;target&gt;</strong> - Replay linear history</li>
                    <li><strong className="text-foreground">git cherry-pick &lt;SHA&gt;</strong> - Apply specific commit</li>
                    <li><strong className="text-foreground">git revert &lt;SHA&gt;</strong> - Safe undo commit</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <h4 className="font-bold text-amber-500 text-xs uppercase tracking-wider">
                    Stashing &amp; Undo
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs">
                    <li><strong className="text-foreground">git stash</strong> - Shelve uncommitted work</li>
                    <li><strong className="text-foreground">git stash pop</strong> - Restore shelved changes</li>
                    <li><strong className="text-foreground">git reset --soft &lt;SHA&gt;</strong> - Move HEAD pointer only</li>
                    <li><strong className="text-foreground">git reset --hard &lt;SHA&gt;</strong> - Reset all trees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Switch Confirmation Modal */}
      <PresetSwitchConfirmModal
        isOpen={showSwitchModal}
        targetPresetName={
          PRESET_METAS.find((p) => p.id === pendingPreset)?.name ||
          (pendingPreset === "custom" ? "My Workspace" : pendingPreset || "Preset")
        }
        currentState={state}
        onSaveAndSwitch={handleConfirmSaveAndSwitch}
        onDiscardAndSwitch={handleConfirmDiscardAndSwitch}
        onCancel={handleCancelSwitch}
      />
    </div>
  );
}