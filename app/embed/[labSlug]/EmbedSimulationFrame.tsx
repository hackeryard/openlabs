"use client";

import React, { useState, useRef } from "react";
import { Maximize2, Minimize2, ExternalLink, Sparkles } from "lucide-react";

interface EmbedFrameProps {
  labId: string;
  labName: string;
  subjectName: string;
  labPath: string;
  isDevPreview?: boolean;
}

export default function EmbedSimulationFrame({
  labId,
  labName,
  subjectName,
  labPath,
  isDevPreview = false,
}: EmbedFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none"
    >
      {/* Dev preview watermark if testing locally without token */}
      {isDevPreview && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1 text-[11px] font-mono text-amber-400 flex items-center justify-between">
          <span>⚠️ Development Preview Mode (Unsigned embed cleared for local development only)</span>
          <span className="opacity-75">Production strictly requires signed embedToken</span>
        </div>
      )}

      {/* Minimal Embed Header */}
      <header className="h-10 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-xs tracking-tight text-white shrink-0">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            OpenLabs
          </div>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize shrink-0">
            {subjectName}
          </span>
          <h1 className="text-xs font-semibold text-slate-200 truncate">
            {labName}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <a
            href={labPath}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Full Portal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Embedded Simulation Iframe */}
      <div className="flex-1 w-full h-full relative bg-slate-950">
        <iframe
          src={`${labPath}?embed=true`}
          className="w-full h-full border-0"
          title={`${labName} Simulation`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}

