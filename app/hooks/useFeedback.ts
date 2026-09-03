"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { analyticsService } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────
export interface FeedbackStats {
  avgRating: number | null;
  helpfulPct: number | null;
  helpfulYes: number;
  helpfulNo: number;
  total: number;
  withRating: number;
  withComment: number;
  recentComments: {
    rating?: number;
    category?: string;
    comment: string;
    helpful?: boolean;
    createdAt: string;
  }[];
}

// ── Helpers ────────────────────────────────────────────────────────────
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "openlabs-feedback-session-id";
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, sid);
  }
  return sid;
}

function hasSubmittedForLab(labId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = `openlabs-fb-${labId}`;
  const ts = localStorage.getItem(key);
  if (!ts) return false;
  // 24 hour cooldown
  return Date.now() - Number(ts) < 24 * 60 * 60 * 1000;
}

function markSubmittedForLab(labId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`openlabs-fb-${labId}`, String(Date.now()));
}

// ── Hook ───────────────────────────────────────────────────────────────
export function useFeedback(labId: string) {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef(false);
  const fetchedRef = useRef(false);

  // Load stats on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Check local storage for prior submission
    if (hasSubmittedForLab(labId)) {
      setSubmitted(true);
    }

    // Fetch public stats
    fetch(`/api/feedback/${encodeURIComponent(labId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => setStats(data))
      .catch(() => {
        // Silent fail — feedback is non-critical
      });
  }, [labId]);

  // Submit quick pulse (thumbs up / down)
  const submitPulse = useCallback(
    async (helpful: boolean): Promise<boolean> => {
      if (isSubmittingRef.current) return false;
      isSubmittingRef.current = true;
      setSubmitting(true);

      try {
        const sessionId = getOrCreateSessionId();
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ labId, sessionId, helpful }),
        });

        if (res.ok) {
          setSubmitted(true);
          markSubmittedForLab(labId);

          // Track feedback submission event
          analyticsService.trackFeedbackSubmitted(labId, helpful ? 5 : 1, "pulse");

          // Optimistic local stats update
          setStats((prev) =>
            prev
              ? {
                  ...prev,
                  total: prev.total + 1,
                  helpfulYes: helpful ? prev.helpfulYes + 1 : prev.helpfulYes,
                  helpfulNo: !helpful ? prev.helpfulNo + 1 : prev.helpfulNo,
                }
              : prev
          );
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
    },
    [labId]
  );

  // Submit deep feedback (rating, category, comment)
  const submitDeep = useCallback(
    async (data: {
      rating?: number;
      category?: string;
      comment?: string;
      labStep?: string;
      helpful?: boolean;
    }): Promise<boolean> => {
      if (isSubmittingRef.current) return false;
      isSubmittingRef.current = true;
      setSubmitting(true);

      try {
        const sessionId = getOrCreateSessionId();
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            labId,
            sessionId,
            ...data,
          }),
        });

        if (res.ok) {
          setSubmitted(true);
          markSubmittedForLab(labId);

          // Track detailed feedback event
          analyticsService.trackFeedbackSubmitted(
            labId,
            data.rating || (data.helpful ? 5 : 1),
            data.category || "deep_feedback"
          );
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
    },
    [labId]
  );

  return { stats, submitted, submitting, submitPulse, submitDeep };
}
