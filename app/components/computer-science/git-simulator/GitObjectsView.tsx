"use client";

import React, { useState } from "react";
import { RepoState, GitObject, BlobObject, TreeObject, CommitObject, TagObject } from "@/app/types/gitSimualtor";
import { Database, FileCode, FolderTree, GitCommit, Tag, Compass, HardDrive, Terminal } from "lucide-react";

interface Props {
  state: RepoState;
}

export default function GitObjectsView({ state }: Props) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const objectsList = Object.entries(state.objects);
  const selectedObject: GitObject | undefined = selectedObjectId ? state.objects[selectedObjectId] : undefined;

  const blobs = objectsList.filter(([, o]) => o.type === "blob");
  const trees = objectsList.filter(([, o]) => o.type === "tree");
  const commits = objectsList.filter(([, o]) => o.type === "commit");
  const tags = objectsList.filter(([, o]) => o.type === "tag");

  return (
    <div className="space-y-6">
      {/* Intro Explanation */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <HardDrive size={18} />
            <span>Under The Hood: Git&apos;s Content-Addressable Object Database (.git/)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Git is essentially a simple key-value data store. When you stage and commit files, Git creates immutable content-addressed objects in <code className="font-mono text-purple-500">.git/objects/</code> hashed with SHA-1. Every commit points to a Tree, which points to Blobs.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-card border border-border">
            {blobs.length} blobs
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-card border border-border">
            {trees.length} trees
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-card border border-border">
            {commits.length} commits
          </span>
        </div>
      </div>

      {/* Main Split Layout: Objects Browser & Object Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Object Lists (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Commits */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <GitCommit size={16} className="text-emerald-500" />
                <span>Commits ({commits.length})</span>
              </h3>
              <span className="text-[11px] text-muted-foreground">Snapshot metadata & tree root</span>
            </div>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {commits.length === 0 ? (
                <p className="text-xs text-muted-foreground italic p-2">No commit objects yet.</p>
              ) : (
                commits.map(([id, o]) => {
                  const c = o as CommitObject;
                  const isSelected = selectedObjectId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedObjectId(id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-mono border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-muted/30 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="truncate flex items-center gap-2">
                        <span className="font-bold text-emerald-500">{id.slice(0, 9)}</span>
                        <span className="font-sans text-muted-foreground truncate">&quot;{c.message}&quot;</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        parents: {c.parents?.length || 0}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Trees */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FolderTree size={16} className="text-blue-500" />
                <span>Trees ({trees.length})</span>
              </h3>
              <span className="text-[11px] text-muted-foreground">Directory manifests & file pointers</span>
            </div>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {trees.length === 0 ? (
                <p className="text-xs text-muted-foreground italic p-2">No tree objects yet.</p>
              ) : (
                trees.map(([id, o]) => {
                  const t = o as TreeObject;
                  const isSelected = selectedObjectId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedObjectId(id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-mono border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-muted/30 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="truncate flex items-center gap-2">
                        <span className="font-bold text-blue-500">{id.slice(0, 9)}</span>
                        <span className="font-sans text-muted-foreground">
                          {t.entries?.map((e) => e.name).join(", ") || "(empty tree)"}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {t.entries?.length || 0} entries
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. Blobs */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileCode size={16} className="text-amber-500" />
                <span>Blobs ({blobs.length})</span>
              </h3>
              <span className="text-[11px] text-muted-foreground">Raw compressed file content</span>
            </div>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {blobs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic p-2">No blob objects created yet.</p>
              ) : (
                blobs.map(([id, o]) => {
                  const b = o as BlobObject;
                  const isSelected = selectedObjectId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedObjectId(id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-mono border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-muted/30 hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="font-bold text-amber-500">{id.slice(0, 9)}</span>
                      <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                        {b.content?.replace(/\n/g, " ") || "(empty)"}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {b.size || b.content?.length || 0}B
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 4. References & HEAD Pointer */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Compass size={16} className="text-purple-500" />
              <span>References & Pointers (.git/refs/ & HEAD)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  .git/HEAD
                </span>
                <p className="font-bold text-primary truncate">
                  {state.HEAD?.type === "branch"
                    ? `ref: refs/heads/${state.HEAD.value}`
                    : `detached: ${state.HEAD?.value || "none"}`}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Active Branch Tip
                </span>
                <p className="font-bold text-foreground truncate">
                  {state.HEAD?.type === "branch"
                    ? state.refs[state.HEAD.value]?.slice(0, 10) || "(no commits yet)"
                    : "(detached)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Object Inspector (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                <h3 className="font-bold text-sm text-foreground">Object Inspector</h3>
              </div>
              {selectedObject && (
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedObject.type}
                </span>
              )}
            </div>

            {selectedObject ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Object SHA Identifier
                  </div>
                  <div className="font-bold text-foreground break-all">{selectedObject.id}</div>
                </div>

                {/* Inspecting Blob */}
                {selectedObject.type === "blob" && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
                      Decompressed Raw Content
                    </span>
                    <pre className="p-3.5 rounded-xl bg-black/90 text-green-400 font-mono text-xs overflow-x-auto max-h-[300px] border border-border/80">
                      {(selectedObject as BlobObject).content || "(empty file)"}
                    </pre>
                  </div>
                )}

                {/* Inspecting Tree */}
                {selectedObject.type === "tree" && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
                      Tree Entries (mode, type, SHA, filename)
                    </span>
                    <div className="rounded-xl border border-border divide-y divide-border overflow-hidden bg-muted/20 font-mono text-xs">
                      {(selectedObject as TreeObject).entries?.map((e) => (
                        <div key={e.name} className="p-2.5 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-muted-foreground text-[10px] mr-2">{e.mode || "100644"}</span>
                            <span className="font-semibold text-foreground">{e.name}</span>
                          </div>
                          <button
                            onClick={() => setSelectedObjectId(e.objectId)}
                            className="text-primary hover:underline text-[11px]"
                          >
                            {e.objectId.slice(0, 8)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspecting Commit */}
                {selectedObject.type === "commit" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                      <div>
                        <span className="text-muted-foreground text-[10px] block">Tree Pointer:</span>
                        <button
                          onClick={() => setSelectedObjectId((selectedObject as CommitObject).tree)}
                          className="font-bold text-blue-500 hover:underline"
                        >
                          {(selectedObject as CommitObject).tree}
                        </button>
                      </div>

                      <div>
                        <span className="text-muted-foreground text-[10px] block">Parent(s):</span>
                        {(selectedObject as CommitObject).parents?.length > 0 ? (
                          (selectedObject as CommitObject).parents.map((p) => (
                            <button
                              key={p}
                              onClick={() => setSelectedObjectId(p)}
                              className="font-bold text-emerald-500 hover:underline mr-2"
                            >
                              {p}
                            </button>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic">None (root)</span>
                        )}
                      </div>

                      <div>
                        <span className="text-muted-foreground text-[10px] block">Message:</span>
                        <span className="font-sans font-semibold text-foreground">
                          {(selectedObject as CommitObject).message}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl space-y-2">
                <Database size={24} className="mx-auto text-muted-foreground/60" />
                <p>Select any object on the left to inspect its raw key-value store representation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
