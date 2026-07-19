'use client';

import { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Code2, Play } from 'lucide-react';

interface EditorPaneProps {
  sourceCode: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

// Monaco owns its own focus/keystroke handling, so the visualizer's
// global keyboard shortcuts (arrows/space/r) must not fire while the
// editor has focus — onFocusChange lets the parent track that via a
// ref instead of relying on the instanceof form-control check it uses
// for native inputs.
export default function EditorPane({ sourceCode, onChange, onRun, running, onFocusChange }: EditorPaneProps) {
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current());
    editor.onDidFocusEditorText(() => onFocusChange?.(true));
    editor.onDidBlurEditorText(() => onFocusChange?.(false));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide hidden sm:block">
          Your Code
        </h3>
        <button
          onClick={onRun}
          disabled={running}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          title="Run (Ctrl/Cmd + Enter)"
        >
          <Play className="w-3.5 h-3.5" />
          {running ? 'Running…' : 'Run'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overscroll-contain">
        <Editor
          theme="vs-dark"
          language="javascript"
          value={sourceCode}
          onChange={value => onChange(value ?? '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            scrollbar: { alwaysConsumeMouseWheel: false },
          }}
        />
      </div>
    </div>
  );
}
