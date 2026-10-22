"use client";

import React, { useState } from "react";
import { FileEdit, X, Save, AlertTriangle } from "lucide-react";

interface Props {
  filename: string;
  initialContent: string;
  isConflict?: boolean;
  onSave: (filename: string, newContent: string) => void;
  onClose: () => void;
}

export default function FileEditorModal({
  filename,
  initialContent,
  isConflict,
  onSave,
  onClose,
}: Props) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(filename, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileEdit size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm font-mono">{filename}</h3>
              <p className="text-xs text-muted-foreground">
                Working Directory File Editor
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

        {/* Conflict Notice if present */}
        {isConflict && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
            <span>
              This file contains merge conflict markers (<code className="font-mono">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>).
              Edit the text to keep the desired code, save, then run <code className="font-mono">git add {filename}</code>.
            </span>
          </div>
        )}

        {/* Editor Textarea */}
        <div className="p-4 bg-muted/10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-background font-mono text-xs sm:text-sm p-4 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none"
            placeholder="Type file contents here..."
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length} characters • {content.split("\n").length} lines
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Save size={14} />
              Save File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
