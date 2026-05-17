import { useState, useRef, useCallback } from "react";

export interface XPResult {
  xpEarned: number;
  newLevel: number;
  leveledUp: boolean;
  firstTime: boolean;
}

export function useLab(labId: string, subject: string, type: "simulation" | "exploration" | "editor") {
  const [xpResult, setXpResult] = useState<XPResult | null>(null);
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

      const toast = document.createElement("div");
      toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce transition-opacity duration-500";
      toast.innerHTML = `
        <h4 class="font-bold">Experiment Completed!</h4>
        <p>+${data.xpEarned} XP Earned</p>
        ${data.leveledUp ? `<p class="font-bold text-yellow-300 mt-1">Level Up! You are now level ${data.newLevel}</p>` : ""}
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

  return { completeExperiment, xpResult };
}
