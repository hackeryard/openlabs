"use client";

import React, { useState } from "react";
import { useFeedback } from "@/app/hooks/useFeedback";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

// ── Category Chip Metadata ─────────────────────────────────────────────
const CATEGORIES = [
  { id: "bug", label: "Bug / Broken", emoji: "🐛" },
  { id: "confusing", label: "Confusing", emoji: "😕" },
  { id: "wrong-content", label: "Wrong Content", emoji: "❌" },
  { id: "suggestion", label: "Suggestion", emoji: "💡" },
  { id: "praise", label: "Love It!", emoji: "❤️" },
] as const;

// ── FeedbackPulse — The Quick Thumbs Up/Down Widget ────────────────────
interface FeedbackPulseProps {
  labId: string;
}

export default function FeedbackPulse({ labId }: FeedbackPulseProps) {
  const { stats, submitted, submitting, submitPulse, submitDeep } = useFeedback(labId);

  const [pulseGiven, setPulseGiven] = useState<boolean | null>(null);
  const [showDeepForm, setShowDeepForm] = useState(false);
  const [deepRating, setDeepRating] = useState<number>(0);
  const [deepCategory, setDeepCategory] = useState<string | null>(null);
  const [deepComment, setDeepComment] = useState("");
  const [deepSubmitted, setDeepSubmitted] = useState(false);

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Handle pulse choice (open form, do not submit prematurely)
  const handlePulse = (helpful: boolean) => {
    setPulseGiven(helpful);
    setShowValidationErrors(false);
    setShowDeepForm(true);
  };

  // Handle deep feedback submission
  const handleDeepSubmit = async () => {
    // 1. If helpful === true: rating is mandatory. If rating < 3: comment is mandatory.
    const isMissingRating = pulseGiven === true && deepRating < 1;
    const isMissingComment =
      (pulseGiven === false && !deepComment.trim()) ||
      (pulseGiven === true && deepRating > 0 && deepRating < 3 && !deepComment.trim());

    if (isMissingRating || isMissingComment) {
      setShowValidationErrors(true);
      return;
    }

    const success = await submitDeep({
      rating: deepRating > 0 ? deepRating : undefined,
      category: deepCategory || undefined,
      comment: deepComment.trim() || undefined,
      helpful: pulseGiven !== null ? pulseGiven : undefined,
    });

    if (success) {
      setDeepSubmitted(true);
    }
  };

  // Already submitted within 24h — show thank-you state
  if (submitted && pulseGiven === null && !showDeepForm) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-foreground">Thanks for your feedback!</span>
          {stats && stats.total > 0 && (
            <span className="text-muted-foreground ml-2">
              {stats.total} responses &bull; {stats.helpfulPct !== null ? `${stats.helpfulPct}% found helpful` : ""}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Deep form already submitted
  if (deepSubmitted) {
    return (
      <div className="bg-card border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Detailed feedback recorded!</span>
          <span className="text-muted-foreground ml-1.5">Your input helps us improve this lab. Thank you!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* ─── Quick Pulse Row ─── */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare size={16} className="text-primary shrink-0" />
          <span className="font-bold text-foreground">Was this lab helpful?</span>
          {stats && stats.total > 0 && (
            <span className="text-muted-foreground hidden sm:inline">
              ({stats.total} responses)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pulseGiven === null ? (
            <>
              <button
                onClick={() => handlePulse(true)}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                <ThumbsUp size={14} />
                Yes
              </button>
              <button
                onClick={() => handlePulse(false)}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                <ThumbsDown size={14} />
                No
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-bold ${pulseGiven ? "text-emerald-500" : "text-rose-500"}`}>
                {pulseGiven ? "👍 Thanks!" : "👎 Got it"}
              </span>
              {!showDeepForm && (
                <button
                  onClick={() => setShowDeepForm(true)}
                  className="text-primary hover:underline font-medium text-[11px]"
                >
                  Add details →
                </button>
              )}
            </div>
          )}

          {/* Persistent feedback icon toggle */}
          {pulseGiven === null && (
            <button
              onClick={() => setShowDeepForm(!showDeepForm)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition"
              title="Give detailed feedback"
            >
              {showDeepForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* ─── Deep Feedback Form (Expandable) ─── */}
      {showDeepForm && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/20">
          {/* Star Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {pulseGiven === true ? "Rate this lab (Required)" : "Rate this lab (Optional)"}
              </label>
              {showValidationErrors && pulseGiven === true && deepRating < 1 && (
                <span className="text-[10px] font-bold text-rose-500">★ Rating required</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setDeepRating(n);
                    setShowValidationErrors(false);
                  }}
                  className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={22}
                    className={`transition-colors ${
                      n <= deepRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {deepRating > 0 && (
                <span className="text-[11px] font-bold text-foreground ml-2">
                  {deepRating}/5
                </span>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Category (optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setDeepCategory(deepCategory === cat.id ? null : cat.id)}
                  className={`px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    deepCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {pulseGiven === false
                  ? "What went wrong? (Required)"
                  : pulseGiven === true && deepRating > 0 && deepRating < 3
                  ? "What went wrong? (Required)"
                  : "Detailed Comments (Optional)"}
              </label>
              {showValidationErrors &&
                ((pulseGiven === false && !deepComment.trim()) ||
                  (pulseGiven === true && deepRating > 0 && deepRating < 3 && !deepComment.trim())) && (
                  <span className="text-[10px] font-bold text-rose-500">⚠️ Comment required</span>
                )}
            </div>
            <textarea
              value={deepComment}
              onChange={(e) => {
                setDeepComment(e.target.value.slice(0, 500));
                if (e.target.value.trim()) setShowValidationErrors(false);
              }}
              placeholder={
                pulseGiven === false || (pulseGiven === true && deepRating > 0 && deepRating < 3)
                  ? "Please describe what was confusing, broken, or didn't work... (Required)"
                  : "Tell us more… (Optional)"
              }
              rows={3}
              className={`w-full rounded-xl border text-foreground text-xs p-3 resize-none focus:outline-none focus:ring-2 placeholder:text-muted-foreground transition-colors ${
                showValidationErrors &&
                ((pulseGiven === false && !deepComment.trim()) ||
                  (pulseGiven === true && deepRating > 0 && deepRating < 3 && !deepComment.trim()))
                  ? "border-rose-500 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/30"
                  : "border-border bg-card focus:border-primary focus:ring-primary/30"
              }`}
            />
            <div className="text-[10px] text-muted-foreground text-right">
              {deepComment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setShowDeepForm(false);
                setShowValidationErrors(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeepSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send size={13} />
              {submitting ? "Submitting…" : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
