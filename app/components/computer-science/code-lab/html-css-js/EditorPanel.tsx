"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Trash2 } from "lucide-react";

interface EditorPanelProps {
  html: string;
  setHtml: (value: string) => void;
  css: string;
  setCss: (value: string) => void;
  js: string;
  setJs: (value: string) => void;

  title: string;
  setTitle: (value: string) => void;
  onDelete?: () => void;
  deleting?: boolean;
}

type TabType = "html" | "css" | "js";

export default function EditorPanel({
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs,
  title,
  setTitle,
  onDelete,
  deleting = false,
}: EditorPanelProps) {

  const [tab, setTab] = useState<TabType>("html");

  const tabs = [
    { id: "html" as const, label: "HTML", lang: "html", val: html, change: setHtml, color: "text-orange-500" },
    { id: "css" as const, label: "CSS", lang: "css", val: css, change: setCss, color: "text-blue-400" },
    { id: "js" as const, label: "JS", lang: "javascript", val: js, change: setJs, color: "text-yellow-400" },
  ];

  const active = tabs.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">

      {/* 🔹 Top Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#252526] border-b border-white/5">

        {/* Title Input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title..."
          className="flex-1 bg-transparent outline-none text-white text-sm px-2 py-1 rounded
                     border border-white/10 focus:border-blue-500"
        />

        {/* Delete Button */}
        <button
          onClick={onDelete}
          disabled={!onDelete || deleting}
          className={`p-2 rounded transition ${
            onDelete && !deleting
              ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
              : "text-slate-500 cursor-not-allowed"
          }`}
          title={deleting ? "Deleting..." : onDelete ? "Delete Project" : "Cannot delete"}
        >
          <Trash2 size={18} />
        </button>

      </div>

      {/* 🔹 Tabs */}
      <div className="flex bg-[#252526] border-b border-white/5 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 text-sm font-medium transition-all border-b-2
              ${tab === t.id
                ? `border-blue-500 bg-[#1e1e1e] ${t.color}`
                : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 🔹 Editor */}
      <div className="flex-1 pt-2 overscroll-contain">
        <Editor
          theme="vs-dark"
          language={active.lang}
          value={active.val}
          onChange={(value) => active.change(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
          }}
        />
      </div>

    </div>
  );
}
