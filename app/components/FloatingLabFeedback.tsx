"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showValidationErrors, setShowValidationErrors] = useState(false);
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

  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Global 'F' keyboard shortcut to toggle feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      if (
        e.key.toLowerCase() === "f" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setIsExitTriggered(false);
        setPulseChoice(null);
        setIsManualExpanded(false);
        setShowValidationErrors(false);
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset states on lab route change
  useEffect(() => {
    mountTimeRef.current = Date.now();
    hasTriggeredExitRef.current = false;
    setIsOpen(false);
    setIsExitTriggered(false);
    setPulseChoice(null);
    setIsManualExpanded(false);
    setShowValidationErrors(false);
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
    setShowValidationErrors(false);
  };

  // Handler 2: When user clicks "👎 No, Not Helpful"
  const handleNotHelpful = () => {
    setPulseChoice("not_helpful");
    setShowValidationErrors(false);
  };

  // Handler 3: Submit Helpful Flow (Mandatory Star Rating; Feedback Text ONLY mandatory if below 3 stars)
  const handleHelpfulStarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isMissingRating = selectedRating < 1;
    const isMissingComment = selectedRating > 0 && selectedRating < 3 && !comment.trim();

    if (isMissingRating || isMissingComment) {
      setShowValidationErrors(true);
      return;
    }

    const success = await submitDeep({
      rating: selectedRating,
      category: selectedTag || (selectedRating < 3 ? "confusing" : selectedRating >= 4 ? "praise" : "helpful"),
      comment: comment.trim() || undefined,
      helpful: true,
    });

    if (success) {
      setSubmittedSuccess(true);
      markDismissedInSession();

      setTimeout(() => {
        if (pendingUrl) {
          router.push(pendingUrl);
        }
      }, 700);
    }
  };

  // Handler 4: Submit Not-Helpful Flow (Mandatory Feedback Text)
  const handleNotHelpfulDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setShowValidationErrors(true);
      return;
    }

    const success = await submitDeep({
      rating: selectedRating > 0 ? selectedRating : undefined,
      category: selectedTag || "confusing",
      comment: comment.trim(),
      helpful: false,
    });

    if (success) {
      setSubmittedSuccess(true);
      markDismissedInSession();

      setTimeout(() => {
        if (pendingUrl) {
          router.push(pendingUrl);
        }
      }, 700);
    }
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

  const isUnder3Stars = selectedRating > 0 && selectedRating < 3;

  return (
    <>
      {/* ── Dynamic Island Morphing Feedback Pill ── */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <motion.button
          layout
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.94 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onClick={() => {
            setIsExitTriggered(false);
            setPulseChoice(null);
            setIsManualExpanded(false);
            setIsOpen(true);
          }}
          transition={{
            layout: { type: "spring", stiffness: 450, damping: 28, mass: 0.8 },
          }}
          className="flex items-center gap-2 h-10 px-2.5 rounded-full bg-card/95 hover:bg-card border border-border text-foreground text-xs font-bold shadow-lg hover:shadow-xl backdrop-blur-2xl transition-colors duration-200 group cursor-pointer overflow-hidden"
          title="Give feedback on this lab (Press F)"
          aria-label="Give feedback on this lab (Press F)"
        >
          {/* Circular Icon Container */}
          <motion.div
            layout="position"
            className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
          >
            <MessageSquare size={13} />
          </motion.div>

          {/* Morphing Expanding Label + Shortcut Key Reveal */}
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div
                key="dynamic-island-content"
                initial={{ opacity: 0, width: 0, x: -6 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -6 }}
                transition={{
                  duration: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-2 pr-1.5 whitespace-nowrap overflow-hidden"
              >
                <span className="text-foreground tracking-tight font-extrabold text-xs">
                  Feedback
                </span>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-black text-muted-foreground bg-muted rounded border border-border/80 shadow-2xs">
                  F
                </kbd>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
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
                  {pulseChoice === "not_helpful" || isUnder3Stars
                    ? "What went wrong with this experiment?"
                    : pulseChoice === "helpful"
                    ? "Great! How would you rate this experiment?"
                    : isManualExpanded
                    ? "Share Your Lab Feedback"
                    : `Was ${labTitle} helpful?`}
                </h3>
              </div>

              <button
                onClick={handleCloseOrSkip}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition shrink-0 cursor-pointer"
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
                    Your response helps us continuously refine STEM simulations for students worldwide.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-black">
                  <Zap size={13} className="fill-current" />
                  <span>+10 Contributor XP Awarded</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCloseOrSkip}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
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
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black text-sm transition-all active:scale-95 shadow-sm group cursor-pointer"
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
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500 text-rose-600 dark:text-rose-400 font-black text-sm transition-all active:scale-95 shadow-sm group cursor-pointer"
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
                    onClick={() => {
                      setIsManualExpanded(true);
                      if (selectedRating === 0) setSelectedRating(5);
                    }}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Give detailed feedback ▾
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseOrSkip}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : pulseChoice === "helpful" || isManualExpanded ? (
              /* ── State 3: Helpful / Manual Flow -> Mandatory Star Rating & Mandatory Feedback ── */
              <form onSubmit={handleHelpfulStarSubmit} className="space-y-4">
                <div
                  className={`rounded-2xl p-4 text-center space-y-2 transition-all ${
                    showValidationErrors && selectedRating < 1
                      ? "bg-rose-500/10 border-2 border-rose-500 shadow-xs"
                      : "bg-muted/20 border border-border/70"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                    {showValidationErrors && selectedRating < 1 ? (
                      <span className="text-rose-600 dark:text-rose-400">⚠️ Star rating is required</span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <ThumbsUp size={14} />
                        <span>Rate this experiment (Required):</span>
                      </div>
                    )}
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
                          onClick={() => {
                            setSelectedRating(star);
                            setShowValidationErrors(false);
                            if (star < 3 && !selectedTag) {
                              setSelectedTag("confusing");
                            } else if (star >= 4 && (!selectedTag || selectedTag === "confusing" || selectedTag === "bug")) {
                              setSelectedTag("helpful");
                            }
                          }}
                          className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
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

                  <span
                    className={`text-xs font-bold block min-h-[18px] ${
                      showValidationErrors && selectedRating < 1
                        ? "text-rose-600 dark:text-rose-400 font-black animate-pulse"
                        : selectedRating > 0
                        ? "text-foreground"
                        : "text-amber-600 dark:text-amber-400 font-black"
                    }`}
                  >
                    {selectedRating > 0
                      ? RATING_DESCRIPTIONS[hoverRating || selectedRating]
                      : showValidationErrors
                      ? "★ Please select a star rating (Required)"
                      : "★ Select a star rating (Required)"}
                  </span>
                </div>

                {/* Conditional Sub-Prompt: If < 3 stars, explicitly ask what went wrong */}
                {isUnder3Stars && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                    <HelpCircle size={15} className="shrink-0 mt-0.5" />
                    <span>What went wrong? Please describe what was confusing, broken, or didn't work as expected.</span>
                  </div>
                )}

                {/* Category Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    {isUnder3Stars ? "Issue category (optional)" : "Category (optional)"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FEEDBACK_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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

                {/* Feedback Input (Mandatory ONLY when rating < 3 stars; Optional for >= 3 stars) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-foreground">
                      {isUnder3Stars
                        ? "What went wrong? (Required)"
                        : "Your Feedback (Optional)"}
                    </label>
                    <span
                      className={`text-[10px] font-mono ${
                        showValidationErrors && isUnder3Stars && !comment.trim()
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {showValidationErrors && isUnder3Stars && !comment.trim()
                        ? "⚠️ Required"
                        : isUnder3Stars
                        ? "Required"
                        : comment.trim().length > 0
                        ? `${comment.length}/500`
                        : "Optional"}
                    </span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value.slice(0, 500));
                      if (e.target.value.trim()) setShowValidationErrors(false);
                    }}
                    placeholder={
                      isUnder3Stars
                        ? "Please tell us what went wrong, what was confusing, or what didn't work... (Required)"
                        : "Tell us what you liked or anything we can improve... (Optional)"
                    }
                    rows={3}
                    className={`w-full rounded-2xl border text-foreground text-xs p-3 resize-none focus:outline-none focus:ring-2 placeholder:text-muted-foreground transition-colors ${
                      showValidationErrors && isUnder3Stars && !comment.trim()
                        ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/30"
                        : "border-border bg-background focus:border-primary focus:ring-primary/30"
                    }`}
                  />
                  {showValidationErrors && isUnder3Stars && !comment.trim() && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      ⚠️ Please describe what went wrong before submitting.
                    </p>
                  )}
                </div>

                {/* Submit Action (Always Clickable, validates on click) */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPulseChoice(null);
                      setIsManualExpanded(false);
                      setShowValidationErrors(false);
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition px-2 py-1 cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>{submitting ? "Submitting…" : "Submit Feedback"}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ── State 4: Not Helpful Flow -> Mandatory Feedback Text ── */
              <form onSubmit={handleNotHelpfulDetailsSubmit} className="space-y-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                  <HelpCircle size={15} className="shrink-0 mt-0.5" />
                  <span>We're sorry this lab didn't meet expectations. Please describe what went wrong so we can fix it:</span>
                </div>

                {/* Optional Star Rating in Not-Helpful flow */}
                <div className="rounded-2xl p-3 bg-muted/20 border border-border/70 text-center space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    Rating (optional)
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || selectedRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setSelectedRating(selectedRating === star ? 0 : star)}
                          className="p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={24}
                            className={`transition-colors ${
                              active
                                ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                                : "text-muted-foreground/30 hover:text-amber-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {selectedRating > 0 && (
                    <span className="text-[11px] font-bold text-foreground block">
                      {RATING_DESCRIPTIONS[selectedRating] || `${selectedRating} stars`}
                    </span>
                  )}
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
                        className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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

                {/* Mandatory Comment Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-foreground">
                      What went wrong? (Required)
                    </label>
                    <span
                      className={`text-[10px] font-mono ${
                        showValidationErrors && !comment.trim()
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {showValidationErrors && !comment.trim()
                        ? "⚠️ Feedback Required"
                        : comment.trim().length > 0
                        ? `${comment.length}/500`
                        : "Required"}
                    </span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value.slice(0, 500));
                      if (e.target.value.trim()) setShowValidationErrors(false);
                    }}
                    placeholder="Please tell us what went wrong, what was confusing, or what bug you ran into... (Required)"
                    rows={3}
                    className={`w-full rounded-2xl border text-foreground text-xs p-3 resize-none focus:outline-none focus:ring-2 placeholder:text-muted-foreground transition-colors ${
                      showValidationErrors && !comment.trim()
                        ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/30"
                        : "border-border bg-background focus:border-primary focus:ring-primary/30"
                    }`}
                  />
                  {showValidationErrors && !comment.trim() && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      ⚠️ Please enter what went wrong before submitting.
                    </p>
                  )}
                </div>

                {/* Submit Buttons (Always Clickable, validates on click) */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPulseChoice(null);
                      setShowValidationErrors(false);
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition px-2 py-1 cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>{submitting ? "Submitting…" : "Submit Feedback"}</span>
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
