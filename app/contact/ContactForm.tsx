"use client";

import React, { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setError("Failed to send message. Please try again or email us directly at support@openlabs.org.in.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-12 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-sm">
          <CheckCircle className="h-10 w-10 text-emerald-500" aria-hidden="true" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-slate-900">Transmission Successful</h3>
        <p className="mb-8 text-slate-600">
          Data packet received. Our systems are processing your request and we will respond within standard operational parameters.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
          className="text-sm font-bold uppercase tracking-widest text-emerald-600 transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Initiate New Protocol
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest text-slate-500">Operator Name</label>
          <input
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-slate-500">Your Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="john@domain.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-widest text-slate-500">Signal Classification</label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50"
        >
          <option value="">Select Classification...</option>
          <option value="general">General Inquiry</option>
          <option value="bug">Bug / Anomaly Report</option>
          <option value="feature">Feature Request</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Enter transmission data..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-indigo-400 sm:w-auto"
      >
        {sending ? (
          <>
            <span className="h-5 w-5 rounded-full border-2 border-indigo-200 border-t-white animate-spin" aria-hidden="true" />
            Transmitting...
          </>
        ) : (
          <>
            Transmit Payload
            <Send size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
