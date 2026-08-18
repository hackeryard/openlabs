"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, User, Mail, HelpCircle, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch {
      setError(
        "Failed to transmit message. Please try again or email us directly at support@openlabs.org.in."
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 sm:p-10 text-center space-y-4"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-foreground">Message Sent Successfully</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Thank you for reaching out. We have received your submission and our team will review and reply within 24 hours.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-bold text-xs shadow-xs transition-all hover:scale-105"
          >
            <span>Send Another Message</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {error ? (
        <div
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            <User size={12} className="text-primary" />
            <span>Your Name</span>
          </label>
          <input
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            <Mail size={12} className="text-primary" />
            <span>Email Address</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="ada@openlabs.org.in"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-subject"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
        >
          <HelpCircle size={12} className="text-primary" />
          <span>Topic / Classification</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select Topic...</option>
          <option value="general">General Inquiry & Questions</option>
          <option value="bug">Bug Report / Simulation Glitch</option>
          <option value="feature">New Virtual Lab Idea / Feature Request</option>
          <option value="partnership">School / Educator Partnership</option>
          <option value="feedback">User Feedback & Testimonial</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
        >
          <MessageSquare size={12} className="text-primary" />
          <span>Message</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Describe your inquiry, bug details, or feature idea..."
          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-xs sm:text-sm text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {sending ? (
          <>
            <span
              className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"
              aria-hidden="true"
            />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send size={15} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
