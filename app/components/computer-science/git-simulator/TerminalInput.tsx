"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onCommand: (command: string) => { output: string };
};

type HistoryItem = {
  command: string;
  output: string;
};

export default function TerminalInput({ onCommand }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const result = onCommand(input);

    setHistory((prev) => [
      ...prev,
      { command: input, output: result.output },
    ]);

    setInput("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex =
          prev === null ? history.length - 1 : Math.max(prev - 1, 0);
        setInput(history[newIndex]?.command || "");
        return newIndex;
      });
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex =
          prev + 1 >= history.length ? null : prev + 1;

        setInput(newIndex !== null ? history[newIndex].command : "");
        return newIndex;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-green-400 p-4 font-mono rounded-2xl h-80 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((item, index) => (
        <div key={index} className="mb-2">
          <div>
            <span className="text-green-500">openlabs@repo ➜ </span>
            {item.command}
          </div>
          {item.output && (
            <pre className="text-green-300 whitespace-pre-wrap">
              {item.output}
            </pre>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex">
        <span className="text-green-500">openlabs@repo ➜ </span>
        <input
          ref={inputRef}
          className="bg-black outline-none text-green-400 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </form>
    </div>
  );
}