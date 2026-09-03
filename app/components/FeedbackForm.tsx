"use client";

import React, { useState } from "react";
import { useFeedback } from "@/app/hooks/useFeedback";
import {
  MessageSquare,
  Star,
  Send,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface FeedbackFormProps {
  labId: string;
  labStep?: string;
  isOpen?: boolean;
  onClose?: () => void;
  /** When true, renders a standalone persistent floating feedback button that opens the modal */
  floatingTrigger?: boolean;
}

const CATEGORIES = [
  { id: "bug", label: "Bug / Broken", emoji: "🐛" },
  { id: "confusing", label: "Confusing", emoji: "😕" },
  { id: "wrong-content", label: "Wrong Content", emoji: "❌" },
  { id: "suggestion", label: "Suggestion", emoji: "💡" },
  { id: "praise", label: "Praise / Love It", emoji: "❤️" },
] as const;

export default function FeedbackForm({
  labId,
  labStep,
  isOpen: controlledIsOpen,
  onClose,
  floatingTrigger = false,
}: FeedbackFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const { submitDeep, submitting } = useFeedback(labId);

  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalIsOpen(false);
    // Reset after close
    setTimeout(() => {
      setSubmitted(false);
      setShowError(false);
      setRating(0);
      setCategory(null);
      setComment("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || (!rating && !category && !comment.trim())) return;

    if (rating > 0 && rating < 3 && !comment.trim()) {
      setShowError(true);
      return;
    }

    const success = await submitDeep({
      rating: rating > 0 ? rating : undefined,
      category: category || undefined,
      comment: comment.trim() || undefined,
      labStep: labStep || undefined,
    });

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {floatingTrigger && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-card/90 hover:bg-card border border-border text-foreground text-xs font-bold shadow-lg backdrop-blur hover:scale-105 transition active:scale-95"
          title="Give Feedback on this Lab"
        >
          <MessageSquare size={14} className="text-primary" />
          <span className="hidden sm:inline">Feedback</span>
        </button>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Lab Feedback</span>
              </div>
              <h3 className="text-lg font-black text-foreground">
                Help Us Improve This Lab
              </h3>
              <p className="text-xs text-muted-foreground">
                Found an issue or have an idea? Your feedback directly guides improvements.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <CheckCircle2 size={40} className="text-emerald-500 animate-bounce" />
                <h4 className="font-bold text-foreground">Thank you for your feedback!</h4>
                <p className="text-xs text-muted-foreground">
                  Your response has been recorded. +10 XP awarded!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Rating (optional)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={`transition-colors ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-xs font-bold text-foreground ml-2">
                        {rating} of 5 stars
                      </span>
                    )}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Category (optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(category === cat.id ? null : cat.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                          category === cat.id
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

                {/* Comments */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {rating > 0 && rating < 3 ? "Detailed Comments (Required)" : "Detailed Comments"}
                    </label>
                    {showError && (
                      <span className="text-[10px] text-rose-500 font-bold">
                        ⚠️ Comment is required for ratings below 3 stars
                      </span>
                    )}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value.slice(0, 500));
                      if (e.target.value.trim()) setShowError(false);
                    }}
                    placeholder={
                      rating > 0 && rating < 3
                        ? "Please describe what was confusing or broken... (Required)"
                        : "What worked well? What was confusing or broken?"
                    }
                    rows={3}
                    className={`w-full rounded-2xl border bg-background text-foreground text-xs p-3.5 resize-none focus:outline-none focus:ring-2 placeholder:text-muted-foreground ${
                      showError ? "border-rose-500 ring-1 ring-rose-500/30" : "border-border focus:ring-primary/30"
                    }`}
                  />
                  <div className="text-[10px] text-muted-foreground text-right">
                    {comment.length}/500
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!rating && !category && !comment.trim())}
                    className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                    {submitting ? "Submitting…" : "Send Feedback"}
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
