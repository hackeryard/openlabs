"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { resolveLabIdFromPath } from "@/app/lib/labs";
import FeedbackPulse from "@/app/components/FeedbackPulse";
import { MessageSquare, X, Sparkles } from "lucide-react";

export default function FloatingLabFeedback() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Only show on lab simulation / interaction pages (/labs/...) or mapped lab routes
  const isLabPage = pathname?.startsWith("/labs/");
  const labId = resolveLabIdFromPath(pathname || "");

  if (!isLabPage || !labId) {
    return null;
  }

  return (
    <>
      {/* Docked Floating Trigger Pill (Bottom-Left: leaves bottom-right free for OpenLabsAI & DailyChallenge) */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card/95 hover:bg-card border border-border text-foreground text-xs font-bold shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 group"
          title="Give feedback on this lab"
        >
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageSquare size={12} />
          </div>
          <span className="text-foreground">Feedback</span>
        </button>
      </div>

      {/* Popover / Modal when open */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start sm:justify-start p-4 sm:p-6 sm:left-6 sm:bottom-16 pointer-events-none">
          <div className="pointer-events-auto bg-card border border-border rounded-3xl p-4 sm:p-5 max-w-md w-full shadow-2xl space-y-3 relative animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sparkles size={14} className="text-primary" />
                <span>Lab Feedback &bull; {labId}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Embedded Feedback Pulse & Deep Form */}
            <FeedbackPulse labId={labId} />
          </div>
        </div>
      )}
    </>
  );
}
