'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Code2 } from 'lucide-react';

// `monaco-editor` itself is CDN-loaded lazily by @monaco-editor/loader,
// not an installed npm package here — derive types structurally from
// what @monaco-editor/react already exports instead of importing it.
type MonacoEditorInstance = Parameters<OnMount>[0];
type MonacoDecorationsCollection = ReturnType<MonacoEditorInstance['createDecorationsCollection']>;

interface EditorPaneReadOnlyProps {
  readOnly: true;
  sourceCode: string;
  /** 1-indexed line to highlight (preset playback). */
  activeCodeLine?: number;
  title?: string;
}

interface EditorPaneEditableProps {
  readOnly: false;
  sourceCode: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

type EditorPaneProps = EditorPaneReadOnlyProps | EditorPaneEditableProps;

// Monaco owns its own focus/keystroke handling, so the visualizer's
// global keyboard shortcuts (arrows/space/r) must not fire while the
// editor has focus — onFocusChange lets the parent track that via a
// ref instead of relying on the instanceof form-control check it uses
// for native inputs. Only meaningful in editable mode; a read-only
// pane never captures typing shortcuts.
export default function EditorPane(props: EditorPaneProps) {
  // Split the discriminated union into plain values ONCE, up front —
  // property-access narrowing (`props.readOnly` / `!props.readOnly`)
  // doesn't reliably persist into nested closures like Monaco's
  // onMount callback (or even through an aliased boolean), so every
  // branch-specific value used below is captured via a direct if/else
  // on `props.readOnly` inside splitEditorPaneProps, not re-narrowed
  // deeper in the file.
  const { isReadOnly, activeCodeLine, title, onRun, onChange, onFocusChange, running } = splitEditorPaneProps(props);

  // Unlike the html-css-js lab (a deliberately full-dark IDE), this
  // lab's chrome is fully tokenized light/dark — a permanently dark
  // editor clashes against light-mode panels, so follow the site theme.
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light';

  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const decorationsRef = useRef<MonacoDecorationsCollection | null>(null);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    if (!isReadOnly) {
      editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
      editorInstance.onDidFocusEditorText(() => onFocusChange?.(true));
      editorInstance.onDidBlurEditorText(() => onFocusChange?.(false));
    } else if (activeCodeLine) {
      // The scrub-driven useEffect below may have already fired (and
      // no-op'd, since Monaco mounts asynchronously) before this
      // callback runs — apply the current line once mounted too.
      applyActiveLineDecoration(editorInstance, activeCodeLine, decorationsRef);
    }
  };

  // Keep the active-line highlight/scroll in sync as the user scrubs
  // through preset playback (Monaco instance persists across renders,
  // so this can't be done via the `value` prop alone). Runs only when
  // the target line actually changes, not on every render.
  useEffect(() => {
    if (!editorRef.current || !activeCodeLine) return;
    applyActiveLineDecoration(editorRef.current, activeCodeLine, decorationsRef);
  }, [activeCodeLine]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide hidden sm:block">
          {title}
        </h3>
        {/* Run lives in the HeaderBar (single source); Ctrl/Cmd+Enter
            still runs from inside the editor via the Monaco command. */}
        {!isReadOnly && (
          <span className="ml-auto text-[10px] text-muted-foreground font-mono hidden md:inline">Ctrl/Cmd+Enter to run</span>
        )}
      </div>

      <div className="flex-1 min-h-0 overscroll-contain">
        <Editor
          theme={editorTheme}
          language="javascript"
          value={props.sourceCode}
          onChange={onChange ? (value => onChange(value ?? '')) : undefined}
          onMount={handleMount}
          options={{
            readOnly: isReadOnly,
            domReadOnly: isReadOnly,
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

function splitEditorPaneProps(props: EditorPaneProps) {
  // Plain truthy narrowing (`if (props.readOnly)`) only narrows the
  // `true` branch for a boolean-literal discriminant, not the `else`
  // — TS needs an explicit equality check to narrow both sides.
  if (props.readOnly === true) {
    return {
      isReadOnly: true as const,
      activeCodeLine: props.activeCodeLine,
      title: props.title ?? 'Source Code',
      onRun: undefined,
      onChange: undefined,
      onFocusChange: undefined,
      running: undefined,
    };
  }
  return {
    isReadOnly: false as const,
    activeCodeLine: undefined,
    title: 'Your Code',
    onRun: props.onRun,
    onChange: props.onChange,
    onFocusChange: props.onFocusChange,
    running: props.running,
  };
}

function applyActiveLineDecoration(
  editorInstance: MonacoEditorInstance,
  line: number,
  decorationsRef: MutableRefObject<MonacoDecorationsCollection | null>,
): void {
  const decorations = [
    {
      range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
      options: {
        isWholeLine: true,
        className: 'code-lab-active-line',
        linesDecorationsClassName: 'code-lab-active-line-gutter',
      },
    },
  ];

  if (!decorationsRef.current) {
    decorationsRef.current = editorInstance.createDecorationsCollection(decorations);
  } else {
    decorationsRef.current.set(decorations);
  }

  editorInstance.revealLineInCenter(line);
}
