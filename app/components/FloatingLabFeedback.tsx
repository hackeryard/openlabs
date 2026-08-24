"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveLabIdFromPath, getLabById } from "@/app/lib/labs";
import { useFeedback } from "@/app/hooks/useFeedback";
import {
  MessageSquare,
  X,
  Sparkles,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle2,
  Zap,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

// ── Category Chip Options ──────────────────────────────────────────────
const FEEDBACK_TAGS = [
  { id: "praise", label: "Loved It!", emoji: "❤️" },
  { id: "helpful", label: "Super Clear", emoji: "✨" },
  { id: "suggestion", label: "Suggestion", emoji: "💡" },
  { id: "confusing", label: "Confusing", emoji: "😕" },
  { id: "bug", label: "Found a Bug", emoji: "🐛" },
] as const;

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "Needs a lot of work 😕",
  2: "A bit confusing 😐",
  3: "Good & functional 🙂",
  4: "Very helpful! 😄",
  5: "Masterpiece! 🤩",
};

export default function FloatingLabFeedback() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExitTriggered, setIsExitTriggered] = useState(false);
  const [pulseChoice, setPulseChoice] = useState<"helpful" | "not_helpful" | null>(null);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Identify active lab route (strictly interactive simulation labs under /labs/...)
  const isLabPage = Boolean(pathname?.startsWith("/labs/"));
  const labId = isLabPage ? resolveLabIdFromPath(pathname || "") : null;
  const labMeta = labId ? getLabById(labId) : null;
  const labTitle = labMeta?.name || labId?.split("/").pop() || "this simulation";

  const { submitting, submitDeep, submitPulse } = useFeedback(labId || "");

  // Track engagement time on current lab
  const mountTimeRef = useRef<number>(Date.now());
  const hasTriggeredExitRef = useRef<boolean>(false);

  // Reset states on lab route change
  useEffect(() => {
    mountTimeRef.current = Date.now();
    hasTriggeredExitRef.current = false;
    setIsOpen(false);
    setIsExitTriggered(false);
    setPulseChoice(null);
    setIsManualExpanded(false);
    setSubmittedSuccess(false);
    setSelectedRating(0);
    setSelectedTag(null);
    setComment("");
    setPendingUrl(null);
  }, [pathname]);

  // Check if exit prompt has already been dismissed for this lab in this browser session
  const isDismissedInSession = useCallback(() => {
    if (typeof window === "undefined" || !labId) return false;
    return Boolean(
      sessionStorage.getItem(`openlabs_exit_feedback_dismissed_${labId}`)
    );
  }, [labId]);

  const markDismissedInSession = useCallback(() => {
    if (typeof window === "undefined" || !labId) return;
    sessionStorage.setItem(`openlabs_exit_feedback_dismissed_${labId}`, "1");
  }, [labId]);

  // Trigger Exit Feedback Modal
  const triggerExitFeedback = useCallback(
    (targetUrl?: string) => {
      if (!isLabPage || !labId) {
        if (targetUrl) router.push(targetUrl);
        return;
      }
      if (hasTriggeredExitRef.current || isDismissedInSession()) {
        if (targetUrl) router.push(targetUrl);
        return;
      }

      const engagementSeconds = Math.round((Date.now() - mountTimeRef.current) / 1000);
      if (engagementSeconds < 3) {
        if (targetUrl) router.push(targetUrl);
        return;
      }

      hasTriggeredExitRef.current = true;
      setIsExitTriggered(true);
      if (targetUrl) setPendingUrl(targetUrl);
      setIsOpen(true);
    },
    [isLabPage, labId, isDismissedInSession, router]
  );

  // Navigation Intercept: Trigger ONLY when the user clicks a link to leave the lab page
  useEffect(() => {
    if (!isLabPage || !labId) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("javascript:")) return;
      const isExternal = href.startsWith("http") || href.startsWith("//") || target.getAttribute("target") === "_blank";
      if (isExternal) return;

      const currentPath = window.location.pathname;
      const targetPath = href.split("?")[0].split("#")[0];

      if (targetPath && targetPath !== currentPath && !hasTriggeredExitRef.current && !isDismissedInSession()) {
        const engagementSeconds = Math.round((Date.now() - mountTimeRef.current) / 1000);
        if (engagementSeconds >= 3) {
          e.preventDefault();
          e.stopPropagation();
          triggerExitFeedback(href);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [isLabPage, labId, isDismissedInSession, triggerExitFeedback]);

  // Handler 1: When user clicks "👍 Yes, Helpful"
  const handleFoundHelpful = () => {
    setPulseChoice("helpful");
    // Also record helpful pulse
    submitPulse(true);
  };

  // Handler 2: When user clicks "👎 No, Not Helpful"
  const handleNotHelpful = () => {
    setPulseChoice("not_helpful");
    // Automatically record helpful=false pulse in background
    submitPulse(false);
  };

  // Handler 3: Submit Helpful Flow (Mandatory Star Rating)
  const handleHelpfulStarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating < 1) return; // Mandatory rating check

    await submitDeep({
      rating: selectedRating,
      category: selectedTag || (selectedRating >= 4 ? "praise" : "helpful"),
      comment: comment.trim() || undefined,
      helpful: true,
    });

    setSubmittedSuccess(true);
    markDismissedInSession();

    setTimeout(() => {
      if (pendingUrl) {
        router.push(pendingUrl);
      }
    }, 700);
  };

  // Handler 4: Submit Not-Helpful Flow (Optional Details)
  const handleNotHelpfulDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTag || comment.trim() || selectedRating > 0) {
      await submitDeep({
        rating: selectedRating > 0 ? selectedRating : undefined,
        category: selectedTag || "confusing",
        comment: comment.trim() || undefined,
        helpful: false,
      });
    }

    setSubmittedSuccess(true);
    markDismissedInSession();

    setTimeout(() => {
      if (pendingUrl) {
        router.push(pendingUrl);
      }
    }, 700);
  };

  const handleCloseOrSkip = () => {
    markDismissedInSession();
    setIsOpen(false);
    if (pendingUrl) {
      router.push(pendingUrl);
    }
  };

  if (!mounted || !isLabPage || !labId) {
    return null;
  }

  return (
    <>
      {/* ── Docked Bottom-Left Floating Trigger Pill ── */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <button
          onClick={() => {
            setIsExitTriggered(false);
            setPulseChoice(null);
            setIsManualExpanded(false);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card/95 hover:bg-card border border-border text-foreground text-xs font-bold shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 group"
          title="Give feedback on this lab"
        >
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageSquare size={12} />
          </div>
          <span className="text-foreground">Feedback</span>
        </button>
      </div>

      {/* ── Interactive Exit Feedback Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles size={11} />
                  <span>{isExitTriggered ? "Before you leave…" : "Lab Feedback"}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                  {pulseChoice === "helpful"
                    ? "Great! How would you rate this experiment?"
                    : pulseChoice === "not_helpful"
                    ? "What went wrong with this experiment?"
                    : `Was ${labTitle} helpful?`}
                </h3>
              </div>

              <button
                onClick={handleCloseOrSkip}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition shrink-0"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── State 1: Thank You Celebration ── */}
            {submittedSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={32} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-foreground">
                    Thank You for Your Feedback! 🎉
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Your rating helps us continuously refine STEM simulations for students worldwide.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-black">
                  <Zap size={13} className="fill-current" />
                  <span>+10 Contributor XP Awarded</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCloseOrSkip}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>{pendingUrl ? "Proceed to Next Page" : "Done"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ) : pulseChoice === null && !isManualExpanded ? (
              /* ── State 2: Initial Pulse Choice (Helpful vs Not Helpful) ── */
              <div className="space-y-5 py-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your response helps us tailor future physics, chemistry, and STEM simulations for learners worldwide.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleFoundHelpful}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black text-sm transition-all active:scale-95 shadow-sm group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ThumbsUp size={20} />
                    </div>
                    <span>Yes, Helpful</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNotHelpful}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500 text-rose-600 dark:text-rose-400 font-black text-sm transition-all active:scale-95 shadow-sm group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ThumbsDown size={20} />
                    </div>
                    <span>Not Helpful</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/70">
                  <button
                    type="button"
                    onClick={() => setIsManualExpanded(true)}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Give detailed feedback ▾
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseOrSkip}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : pulseChoice === "helpful" ? (
              /* ── State 3: Helpful Flow -> Mandatory Star Rating Required ── */
              <form onSubmit={handleHelpfulStarSubmit} className="space-y-4">
                <div className="bg-muted/20 border border-border/70 rounded-2xl p-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                    <ThumbsUp size={14} />
                    <span>Glad it was helpful! Please rate to submit:</span>
                  </div>

                  {/* 5 Stars — MANDATORY */}
                  <div className="flex items-center justify-center gap-2 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || selectedRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setSelectedRating(star)}
                          className="p-1 transition-transform hover:scale-125 active:scale-95"
                          title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={32}
                            className={`transition-colors ${
                              active
                                ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                                : "text-muted-foreground/30 hover:text-amber-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className={`text-xs font-bold block min-h-[18px] ${selectedRating > 0 ? "text-foreground" : "text-amber-600 dark:text-amber-400 font-black"}`}>
                    {selectedRating > 0
                      ? RATING_DESCRIPTIONS[hoverRating || selectedRating]
                      : "★ Select a star rating (required to submit)"}
                  </span>
                </div>

                {/* Optional Note */}
                <div className="space-y-1.5">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    placeholder="Anything specific you loved about this simulation? (optional)"
                    rows={2}
                    className="w-full rounded-2xl border border-border bg-background text-foreground text-xs p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>

                {/* Submit Action (Disabled until >= 1 star selected) */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setPulseChoice(null)}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition px-2 py-1"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || selectedRating < 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                    <span>{submitting ? "Submitting…" : selectedRating < 1 ? "Select Star Rating" : "Submit Feedback"}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ── State 4: Not Helpful / Expanded Flow -> Optional Feedback (NOT mandatory) ── */
              <form onSubmit={handleNotHelpfulDetailsSubmit} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Your feedback is completely optional. Tell us what went wrong so we can fix it:
                  </p>
                </div>

                {/* Category Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    What was the issue? (optional)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FEEDBACK_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                        className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
                          selectedTag === tag.id
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="mr-1">{tag.emoji}</span>
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Comment Box */}
                <div className="space-y-1.5">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    placeholder="Tell us what didn't work or what was confusing… (optional)"
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-background text-foreground text-xs p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>

                {/* Non-Mandatory Buttons: Skip or Submit Details */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleCloseOrSkip}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition px-2 py-1"
                  >
                    Skip &amp; Exit
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                  >
                    <Send size={13} />
                    <span>{submitting ? "Submitting…" : "Submit Details"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
