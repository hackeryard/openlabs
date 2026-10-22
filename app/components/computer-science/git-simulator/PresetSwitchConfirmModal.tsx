"use client";

import React from "react";
import { RepoState } from "@/app/types/gitSimualtor";
import {
  AlertTriangle,
  FolderGit2,
  GitCommit,
  GitBranch,
  Save,
  Trash2,
  X,
  FileCode,
  Layers,
} from "lucide-react";

interface PresetSwitchConfirmModalProps {
  isOpen: boolean;
  targetPresetName: string;
  currentState: RepoState;
  onSaveAndSwitch: () => void;
  onDiscardAndSwitch: () => void;
  onCancel: () => void;
}

export default function PresetSwitchConfirmModal({
  isOpen,
  targetPresetName,
  currentState,
  onSaveAndSwitch,
  onDiscardAndSwitch,
  onCancel,
}: PresetSwitchConfirmModalProps) {
  if (!isOpen) return null;

  const workingFiles = Object.keys(currentState.workingDir || {});
  const stagedFiles = Object.keys(currentState.index || {});
  const commitCount = Object.values(currentState.objects || {}).filter(
    (o) => o.type === "commit"
  ).length;
  const branchCount = Object.keys(currentState.refs || {}).length;
  const isDetached = currentState.HEAD?.type === "commit";
  const activeBranch = isDetached
    ? `detached:${currentState.HEAD?.value.slice(0, 7)}`
    : currentState.HEAD?.value || "main";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Active Work in Repository</h3>
              <p className="text-xs text-muted-foreground">
                Switching to <strong className="text-foreground">{targetPresetName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Cancel and stay"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-muted-foreground leading-relaxed">
            You currently have active files and changes in your working repository. Loading another preset scenario will replace your active workspace.
          </p>

          {/* Current Workspace Snapshot Card */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b border-border/60 pb-2">
              <span className="flex items-center gap-1.5 text-foreground">
                <FolderGit2 size={14} className="text-primary" />
                Current Repository State
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-card border border-border">
                {activeBranch}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-card border border-border">
                <div className="font-bold text-base text-foreground">{workingFiles.length}</div>
                <div className="text-[10px] text-muted-foreground">Working Files</div>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <div className="font-bold text-base text-emerald-500">{stagedFiles.length}</div>
                <div className="text-[10px] text-muted-foreground">Staged</div>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <div className="font-bold text-base text-primary">{commitCount}</div>
                <div className="text-[10px] text-muted-foreground">Commits</div>
              </div>
            </div>

            {/* File List Preview */}
            {workingFiles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Files in Working Directory:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {workingFiles.map((file) => (
                    <span
                      key={file}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-card border border-border text-foreground"
                    >
                      <FileCode size={11} className="text-muted-foreground" />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2.5">
            <Save size={16} className="mt-0.5 shrink-0" />
            <span>
              <strong>Tip:</strong> Click <strong>Save to &apos;My Workspace&apos; &amp; Switch</strong> to preserve your entire repository so you can return to your working directory at any time.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-muted border border-border text-foreground transition-colors order-3 sm:order-1"
          >
            Stay in Current Workspace
          </button>

          <button
            onClick={onDiscardAndSwitch}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors order-2"
          >
            <Trash2 size={13} />
            Discard &amp; Switch
          </button>

          <button
            onClick={onSaveAndSwitch}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors order-1 sm:order-3"
          >
            <Save size={14} />
            Save to &apos;My Workspace&apos; &amp; Switch
          </button>
        </div>
      </div>
    </div>
  );
}
