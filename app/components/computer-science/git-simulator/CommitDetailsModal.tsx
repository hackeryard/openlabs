"use client";

import React from "react";
import { CommitObject, TreeObject, RepoState } from "@/app/types/gitSimualtor";
import { GitCommit, GitBranch, FolderTree, FileCode, Clock, User, X, ArrowUpRight } from "lucide-react";

interface Props {
  commit: CommitObject | null;
  state: RepoState;
  onClose: () => void;
  onSelectCommit?: (commitId: string) => void;
}

export default function CommitDetailsModal({ commit, state, onClose, onSelectCommit }: Props) {
  if (!commit) return null;

  const tree = state.objects[commit.tree] as TreeObject | undefined;
  const isMerge = commit.parents && commit.parents.length > 1;

  // Find branches pointing to this commit
  const branches = Object.entries(state.refs)
    .filter(([, id]) => id === commit.id)
    .map(([name]) => name);

  const tags = Object.entries(state.tags || {})
    .filter(([, id]) => id === commit.id)
    .map(([name]) => name);

  const isHead =
    state.HEAD?.type === "commit"
      ? state.HEAD.value === commit.id
      : branches.includes(state.HEAD?.value || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isMerge ? "bg-purple-500/10 text-purple-500" : "bg-emerald-500/10 text-emerald-500"}`}>
              <GitCommit size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-mono">commit {commit.id.slice(0, 10)}</h3>
                {isMerge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Merge Commit
                  </span>
                )}
                {isHead && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    HEAD
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tree SHA: <span className="font-mono">{commit.tree?.slice(0, 12) || "none"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Commit Message */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border/80">
            <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block mb-1">
              Commit Message
            </span>
            <p className="text-sm sm:text-base font-semibold leading-relaxed">
              {commit.message}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <User size={14} />
                <span>Author</span>
              </div>
              <p className="font-semibold text-foreground">{commit.author || "OpenLabs Contributor"}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Clock size={14} />
                <span>Timestamp</span>
              </div>
              <p className="font-semibold text-foreground">
                {commit.timestamp ? new Date(commit.timestamp).toLocaleString() : "Recently"}
              </p>
            </div>
          </div>

          {/* Ref Badges (Branches & Tags) */}
          {(branches.length > 0 || tags.length > 0) && (
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
                References pointing to this commit
              </span>
              <div className="flex flex-wrap gap-2">
                {branches.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20"
                  >
                    <GitBranch size={12} />
                    {b}
                  </span>
                ))}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20"
                  >
                    🏷️ {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Parents */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
              Parent Commit(s)
            </span>
            {commit.parents && commit.parents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {commit.parents.map((p, i) => (
                  <button
                    key={p}
                    onClick={() => onSelectCommit && onSelectCommit(p)}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 border border-border font-mono transition-colors"
                  >
                    <span>Parent {i + 1}: {p.slice(0, 8)}</span>
                    <ArrowUpRight size={12} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">Root commit (no parents)</span>
            )}
          </div>

          {/* Snapshot Tree Entries */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <FolderTree size={14} />
                Snapshot Tree Contents
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {tree?.entries?.length || 0} file(s)
              </span>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden bg-muted/20">
              {tree && tree.entries && tree.entries.length > 0 ? (
                tree.entries.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <FileCode size={14} className="text-primary" />
                      <span className="font-semibold text-foreground">{entry.name}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">
                      blob {entry.objectId.slice(0, 7)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-muted-foreground text-center">
                  Tree is empty or not found in object database.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
