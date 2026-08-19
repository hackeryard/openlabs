// app/hooks/useXP.ts

import { useState, useRef, useCallback } from "react";
import { analyticsService } from "@/lib/analytics";
import { getNextLabInTrack, getTrackForLab, getTrackProgress, CurriculumTrack, TrackLabStep } from "@/app/lib/tracks";

export interface XPResult {
  xpEarned: number;
  newLevel: number;
  leveledUp: boolean;
  firstTime: boolean;
}

export interface NextLabProgression {
  track: CurriculumTrack;
  nextStep: TrackLabStep;
  isFinalStep: boolean;
  trackPercentage: number;
}

export function useLab(labId: string, subject: string, type: "simulation" | "exploration" | "editor") {
  const [xpResult, setXpResult] = useState<XPResult | null>(null);
  const [nextLabProgression, setNextLabProgression] = useState<NextLabProgression | null>(null);
  const [showNextLabModal, setShowNextLabModal] = useState(false);
  const calledRef = useRef(false);

  const completeExperiment = useCallback(async () => {
    if (calledRef.current) return;
    calledRef.current = true;

    try {
      const authCheck = await fetch("/api/auth/me");
      if (!authCheck.ok) return;

      const res = await fetch("/api/xp/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId, subject, type }),
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.alreadyCompleted) return;

      setXpResult(data);

      // Track learning milestone
      analyticsService.trackLabCompleted(labId, subject, data.xpEarned, data.leveledUp);

      // Check curriculum track progression
      const track = getTrackForLab(labId);
      const nextInfo = getNextLabInTrack(labId);
      if (track && nextInfo) {
        const progress = getTrackProgress(track, [labId]);
        setNextLabProgression({
          track: nextInfo.track,
          nextStep: nextInfo.nextStep,
          isFinalStep: nextInfo.isFinalStep,
          trackPercentage: progress.percentage,
        });
        setShowNextLabModal(true);
      }

      // Show toast if modal is not open
      const toast = document.createElement("div");
      toast.className = "fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl z-50 animate-bounce transition-opacity duration-500 flex items-center gap-3";
      toast.innerHTML = `
        <div class="font-bold">
          <div class="text-sm">🎉 Experiment Completed!</div>
          <div class="text-xs text-emerald-100">+${data.xpEarned} XP Earned</div>
          ${data.leveledUp ? `<div class="text-xs text-amber-300 font-black mt-0.5">⭐ Level Up! You reached Level ${data.newLevel}</div>` : ""}
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
      }, 4500);

    } catch (err) {
      console.error("Failed to complete experiment:", err);
    }
  }, [labId, subject, type]);

  return {
    completeExperiment,
    xpResult,
    nextLabProgression,
    showNextLabModal,
    setShowNextLabModal,
  };
}
