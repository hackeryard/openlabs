'use client';

import { useRef, useEffect } from 'react';
import type { Example } from '../lib/types';
import { Code2, ChevronDown } from 'lucide-react';

interface CodeEditorPaneProps {
  sourceCode: string;
  activeCodeLine: number;
  examples: Example[];
  selectedExampleId: string;
  onExampleChange: (id: string) => void;
}

// Basic JS syntax highlighting via regex
function highlightLine(line: string): JSX.Element {
  const parts: { text: string; cls: string }[] = [];
  let remaining = line;

  // Process patterns in order
  const patterns: [RegExp, string][] = [
    [/\/\/.*/, 'text-slate-500 italic'],                                    // comments (indented or inline trailing)
    [/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/, 'text-emerald-400'],  // strings
    [/\b(const|let|var|function|return|async|await|new|if|else|for|while)\b/, 'text-violet-400 font-semibold'], // keywords
    [/\b(console|Promise|setTimeout|setInterval|queueMicrotask)\b/, 'text-amber-400'],  // built-ins
    [/\b(true|false|null|undefined|NaN|Infinity)\b/, 'text-rose-400'],     // literals
    [/\b(\d+)\b/, 'text-amber-300'],                                        // numbers
    [/(\.(?:log|resolve|then|catch|finally))\b/, 'text-blue-400'],         // methods
  ];

  // Simple sequential replacement — not a full tokenizer, but good enough for display
  const tokens: { text: string; cls: string; index: number }[] = [];
  for (const [regex, cls] of patterns) {
    const globalRegex = new RegExp(regex.source, 'g');
    let match;
    while ((match = globalRegex.exec(line)) !== null) {
      tokens.push({ text: match[0], cls, index: match.index });
    }
  }

  // Sort by position, then build the result
  tokens.sort((a, b) => a.index - b.index);

  let pos = 0;
  const result: { text: string; cls: string }[] = [];
  const used = new Set<number>();

  for (const token of tokens) {
    // Skip overlapping tokens
    let overlap = false;
    for (let i = token.index; i < token.index + token.text.length; i++) {
      if (used.has(i)) { overlap = true; break; }
    }
    if (overlap) continue;

    // Add plain text before this token
    if (token.index > pos) {
      result.push({ text: line.slice(pos, token.index), cls: 'text-slate-300' });
    }

    result.push({ text: token.text, cls: token.cls });
    for (let i = token.index; i < token.index + token.text.length; i++) used.add(i);
    pos = token.index + token.text.length;
  }

  // Add remaining text
  if (pos < line.length) {
    result.push({ text: line.slice(pos), cls: 'text-slate-300' });
  }

  if (result.length === 0) {
    return <span className="text-slate-300">{line || ' '}</span>;
  }

  return (
    <>
      {result.map((r, i) => (
        <span key={i} className={r.cls}>{r.text}</span>
      ))}
    </>
  );
}

export default function CodeEditorPane({
  sourceCode,
  activeCodeLine,
  examples,
  selectedExampleId,
  onExampleChange,
}: CodeEditorPaneProps) {
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll active line into view
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeCodeLine]);

  const lines = sourceCode.split('\n');
  const selectedExample = examples.find(e => e.id === selectedExampleId);

  return (
    <div className="flex flex-col h-full">
      {/* Header + example selector */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-600/30">
        <div className="w-6 h-6 rounded-md bg-slate-700/50 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 tracking-wide hidden sm:block">Source Code</h3>

        {/* Example dropdown */}
        <div className="relative flex-1 sm:flex-none sm:ml-auto">
          <select
            value={selectedExampleId}
            onChange={e => onExampleChange(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-slate-800/80 border border-slate-700/50 text-slate-300
                       text-xs font-medium px-3 py-1.5 pr-7 rounded-lg cursor-pointer
                       hover:border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/40
                       transition-colors"
            aria-label="Select example"
          >
            {examples.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Example description */}
      {selectedExample && (
        <div className="px-3 py-2 bg-slate-800/30 border-b border-slate-700/30">
          <p className="text-[11px] text-slate-400 leading-relaxed">{selectedExample.description}</p>
          <span className={`
            inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border
            ${selectedExample.difficulty === 'beginner'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : selectedExample.difficulty === 'intermediate'
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }
          `}>
            {selectedExample.difficulty}
          </span>
        </div>
      )}

      {/* Code display */}
      <div ref={containerRef} className="flex-1 overflow-y-auto bg-[#0a0a14]">
        <div className="font-mono text-xs leading-6">
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isActive = lineNum === activeCodeLine;

            return (
              <div
                key={index}
                ref={isActive ? activeLineRef : undefined}
                className={`
                  flex transition-colors duration-200
                  ${isActive
                    ? 'bg-indigo-500/15 border-l-2 border-indigo-400'
                    : 'border-l-2 border-transparent hover:bg-slate-800/30'
                  }
                `}
              >
                <span className={`
                  w-10 shrink-0 text-right pr-3 py-0.5 select-none
                  ${isActive ? 'text-indigo-400' : 'text-slate-600'}
                `}>
                  {lineNum}
                </span>
                <span className="flex-1 py-0.5 pr-4 whitespace-pre">
                  {highlightLine(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
