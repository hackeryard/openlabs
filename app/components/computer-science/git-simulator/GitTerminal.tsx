"use client";

import React, { useState, useRef, useEffect } from "react";
import { RepoState } from "@/app/types/gitSimualtor";
import { Terminal, Copy, Trash2, HelpCircle, ChevronRight, CornerDownLeft, Sparkles } from "lucide-react";

interface Props {
  state: RepoState;
  onCommand: (command: string) => { output: string };
}

interface HistoryItem {
  command: string;
  output: string;
  timestamp: string;
}

const COMMON_COMMANDS = [
  "git status",
  "git add .",
  'git commit -m "feat: update project"',
  "git log --oneline",
  "git checkout -b feature/login",
  "git branch",
  "git stash",
  "git stash pop",
  "clear",
];

export default function GitTerminal({ state, onCommand }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "git --version",
      output: "openlabs-git version 2.44.0.virtual (WebAssembly in-memory simulation engine)",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active branch and dirty state indicator
  const activeBranch =
    state.HEAD?.type === "branch"
      ? state.HEAD.value
      : state.HEAD?.type === "commit"
      ? `detached:${state.HEAD.value.slice(0, 7)}`
      : "main";

  const isDirty =
    Object.keys(state.index).length > 0 ||
    Object.keys(state.workingDir).length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const runCommandInternal = (cmd: string) => {
    if (!cmd.trim()) return;

    const result = onCommand(cmd);

    if (result.output === "__CLEAR__") {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: result.output,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setInput("");
    setHistoryIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommandInternal(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow Up: Previous command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const commandsOnly = history.map((h) => h.command);
      if (commandsOnly.length === 0) return;

      setHistoryIndex((prev) => {
        const newIndex = prev === null ? commandsOnly.length - 1 : Math.max(prev - 1, 0);
        setInput(commandsOnly[newIndex] || "");
        return newIndex;
      });
    }

    // Arrow Down: Next command
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const commandsOnly = history.map((h) => h.command);
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex = prev + 1 >= commandsOnly.length ? null : prev + 1;
        setInput(newIndex !== null ? commandsOnly[newIndex] : "");
        return newIndex;
      });
    }

    // Tab autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const trimmed = input.trim();
      const candidateCommands = [
        "git init",
        "git add",
        "git commit -m \"\"",
        "git status",
        "git branch",
        "git checkout",
        "git checkout -b",
        "git switch",
        "git switch -c",
        "git merge",
        "git rebase",
        "git cherry-pick",
        "git revert",
        "git reset --soft",
        "git reset --hard",
        "git stash",
        "git stash pop",
        "git stash list",
        "git tag",
        "git log --oneline",
        "git diff",
        "git diff --staged",
        "git show",
        "touch",
        "clear",
        "help",
      ];

      // Add branch names to autocomplete
      Object.keys(state.refs).forEach((b) => {
        candidateCommands.push(`git checkout ${b}`);
        candidateCommands.push(`git switch ${b}`);
        candidateCommands.push(`git merge ${b}`);
        candidateCommands.push(`git rebase ${b}`);
      });

      // Add filenames
      Object.keys(state.workingDir).forEach((f) => {
        candidateCommands.push(`git add ${f}`);
        candidateCommands.push(`cat ${f}`);
      });

      const match = candidateCommands.find((c) => c.startsWith(trimmed));
      if (match) {
        setInput(match);
      }
    }
  };

  const handleCopyHistory = () => {
    const text = history
      .map((h) => `openlabs@repo ➜ ${h.command}\n${h.output}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <div className="rounded-2xl border border-border bg-[#090d16] text-slate-100 shadow-xl overflow-hidden font-mono flex flex-col">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Traffic light macOS dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Terminal size={14} className="text-emerald-400" />
            <span>openlabs-bash — /workspace/git-repo</span>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
            ({activeBranch}){isDirty ? "*" : ""}
          </span>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyHistory}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy terminal session"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear terminal screen (Ctrl+L / clear)"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Quick Command Suggestions Pill Bar */}
      <div className="px-4 py-2 bg-[#090d16]/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider flex-shrink-0">
          Quick:
        </span>
        {COMMON_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => runCommandInternal(cmd)}
            className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 transition-colors flex-shrink-0 text-[11px]"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className="p-4 overflow-y-auto max-h-[360px] min-h-[220px] text-xs sm:text-sm leading-relaxed space-y-3 cursor-text selection:bg-emerald-500/30"
      >
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            {/* Prompt Line */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400 font-bold">openlabs@repo</span>
              <span className="text-slate-500">:</span>
              <span className="text-blue-400 font-bold">~</span>
              <span className="text-amber-400 font-bold">({activeBranch})</span>
              <span className="text-slate-400">➜</span>
              <span className="text-white font-semibold">{item.command}</span>
            </div>

            {/* Output */}
            {item.output && (
              <pre className="text-slate-300 whitespace-pre-wrap pl-4 font-mono text-xs sm:text-[13px] leading-relaxed border-l-2 border-slate-800/60 py-0.5">
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Active Command Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
          <span className="text-emerald-400 font-bold flex-shrink-0">openlabs@repo</span>
          <span className="text-slate-500 flex-shrink-0">:</span>
          <span className="text-blue-400 font-bold flex-shrink-0">~</span>
          <span className="text-amber-400 font-bold flex-shrink-0">({activeBranch})</span>
          <span className="text-slate-400 flex-shrink-0">➜</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type git command... (e.g. 'git status', 'git help', Tab to autocomplete)"
            className="flex-1 bg-transparent border-none outline-none text-emerald-300 placeholder:text-slate-600 font-mono text-xs sm:text-sm"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>

      {/* Terminal Footer Info */}
      <div className="px-4 py-2 bg-[#0c1220] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="hidden sm:inline">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Tab</kbd> to autocomplete, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">↓</kbd> for command history.
        </span>
        <span className="text-slate-400">
          Type <code className="text-emerald-400">git help</code> for full command list
        </span>
      </div>
    </div>
  );
}
