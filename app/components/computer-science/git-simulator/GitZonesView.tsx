"use client";

import React from "react";
import { RepoState, CommitObject, TreeObject, BlobObject } from "@/app/types/gitSimualtor";
import {
  FolderOpen,
  Layers,
  Database,
  ArrowRight,
  Plus,
  Minus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileText,
  GitCommit,
  GitBranch,
} from "lucide-react";

interface Props {
  state: RepoState;
  onRunCommand: (command: string) => void;
  onOpenFileEditor: (filename: string, content: string, isConflict?: boolean) => void;
}

export default function GitZonesView({ state, onRunCommand, onOpenFileEditor }: Props) {
  const workingFiles = Object.keys(state.workingDir);
  const stagedFiles = Object.keys(state.index);

  // Get committed files from HEAD commit
  const headCommitId =
    state.HEAD?.type === "branch"
      ? state.refs[state.HEAD.value]
      : state.HEAD?.value;

  const headCommit = state.objects[headCommitId || ""] as CommitObject | undefined;
  const headTree = state.objects[headCommit?.tree || ""] as TreeObject | undefined;

  const committedFiles: Record<string, string> = {};
  if (headTree && headTree.entries) {
    headTree.entries.forEach((e) => {
      const blob = state.objects[e.objectId] as BlobObject | undefined;
      if (blob) {
        committedFiles[e.name] = blob.content;
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Layers size={18} />
            <span>The Three Trees Architecture of Git</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Git manages file evolution across three distinct zones: your <strong>Working Directory</strong> (local sandbox on disk), the <strong>Staging Area (Index)</strong> (the preview blueprint for your next commit), and the <strong>Local Repository (Commit History)</strong> (the permanent content-addressed object store).
          </p>
        </div>

        {/* Workflow indicator pills */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-card border border-border px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="text-blue-500 font-bold">git add</span>
          <ArrowRight size={12} className="text-muted-foreground" />
          <span className="text-emerald-500 font-bold">git commit</span>
        </div>
      </div>

      {/* Three Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= ZONE 1: WORKING DIRECTORY ================= */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <FolderOpen size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">1. Working Tree</h3>
                <p className="text-[11px] text-muted-foreground">Files on local disk</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {workingFiles.length} file{workingFiles.length !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Unstaged local edits. Modifying files here does not update the repository until staged.
          </p>

          {/* Files List */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
            {workingFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No files in working directory.<br />
                Try typing: <code className="text-primary font-mono">touch index.js</code>
              </div>
            ) : (
              workingFiles.map((file) => {
                const currentContent = state.workingDir[file] || "";
                const stagedBlobId = state.index[file];
                const committedContent = committedFiles[file];

                let statusLabel = "Clean";
                let statusColor = "bg-muted text-muted-foreground";

                // Check conflict
                const isConflict = state.conflicts?.some((c) => c.file === file);
                if (isConflict) {
                  statusLabel = "Conflict";
                  statusColor = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                } else if (committedContent === undefined && !stagedBlobId) {
                  statusLabel = "Untracked";
                  statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                } else if (stagedBlobId) {
                  const stagedBlob = state.objects[stagedBlobId] as BlobObject | undefined;
                  if (stagedBlob && stagedBlob.content !== currentContent) {
                    statusLabel = "Modified*";
                    statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                  } else {
                    statusLabel = "Staged";
                    statusColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                  }
                } else if (committedContent !== currentContent) {
                  statusLabel = "Modified";
                  statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                }

                return (
                  <div
                    key={file}
                    className="p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} className="text-primary flex-shrink-0" />
                        <span className="font-mono text-xs font-semibold truncate text-foreground">{file}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {currentContent.length}B
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenFileEditor(file, currentContent, isConflict)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit file content"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => onRunCommand(`git add ${file}`)}
                        className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        title={`Stage ${file}`}
                      >
                        <Plus size={11} />
                        Stage
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => onRunCommand("git add .")}
            disabled={workingFiles.length === 0}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 border border-border transition-colors disabled:opacity-50"
          >
            git add . (Stage All)
          </button>
        </div>

        {/* ================= ZONE 2: STAGING AREA (INDEX) ================= */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">2. Staging Area (Index)</h3>
                <p className="text-[11px] text-muted-foreground">Snapshot draft for next commit</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              {stagedFiles.length} staged
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            The staging index holds exact blob references that will be committed into the next tree.
          </p>

          {/* Staged Files List */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
            {stagedFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                Staging area is empty.<br />
                Run <code className="text-primary font-mono">git add &lt;file&gt;</code> to prepare files.
              </div>
            ) : (
              stagedFiles.map((file) => {
                const blobId = state.index[file];
                return (
                  <div
                    key={file}
                    className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1 font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                        <CheckCircle2 size={13} className="flex-shrink-0" />
                        <span>{file}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        blob: <span className="font-mono">{blobId.slice(0, 8)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRunCommand(`git restore --staged ${file}`)}
                      className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
                      title={`Unstage ${file}`}
                    >
                      <Minus size={11} />
                      Unstage
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => onRunCommand('git commit -m "Update snapshot"')}
            disabled={stagedFiles.length === 0}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
          >
            git commit -m &quot;...&quot;
          </button>
        </div>

        {/* ================= ZONE 3: LOCAL REPOSITORY ================= */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Database size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">3. Local Repository</h3>
                <p className="text-[11px] text-muted-foreground">Permanent object database</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
              {Object.keys(state.refs).length} branch{Object.keys(state.refs).length !== 1 ? "es" : ""}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Permanent DAG history. Contains immutable commits, trees, blobs, and branch references.
          </p>

          {/* Active HEAD and Tip Snapshot */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
            {headCommit ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Current HEAD
                    </span>
                    <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                      <GitBranch size={12} />
                      {state.HEAD?.type === "branch" ? state.HEAD.value : `Detached (${headCommit.id.slice(0, 7)})`}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-foreground">
                    {headCommit.id.slice(0, 10)}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    &quot;{headCommit.message}&quot;
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Committed Tree ({Object.keys(committedFiles).length} files)
                  </span>
                  <div className="space-y-1 font-mono text-xs">
                    {Object.keys(committedFiles).map((f) => (
                      <div key={f} className="flex items-center justify-between text-muted-foreground">
                        <span>{f}</span>
                        <span className="text-[10px]">{committedFiles[f].length}B</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No commits recorded yet.<br />
                Stage files and make your first commit.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onRunCommand("git log --oneline")}
              disabled={!headCommit}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 border border-border transition-colors disabled:opacity-50"
            >
              git log
            </button>
            <button
              onClick={() => onRunCommand("git status")}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 border border-border transition-colors"
            >
              git status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
