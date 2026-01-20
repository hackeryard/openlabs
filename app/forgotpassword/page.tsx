"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

/* ================= COMPONENT ================= */

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ================= HANDLERS ================= */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic client validation
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      // Show success state
      setSuccess(true);
      
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Content */}
        {!success && (
          <div className="p-8 pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <KeyRound size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              No worries, we'll send you reset instructions.
            </p>
          </div>
        )}

        {/* Success View (Replaces Form) */}
        {success ? (
          <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Check your email</h2>
            <p className="mb-6 text-sm text-slate-500">
              We have sent a password reset link to <br />
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
            
            <div className="space-y-3">
                <a 
                    href={`mailto:${email}`}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
                >
                    Open Email App
                </a>
                
                <button
                    onClick={() => {
                        setSuccess(false);
                        setEmail("");
                    }}
                    className="text-sm text-slate-400 hover:text-slate-600"
                >
                    Click to try another email
                </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                      setEmail(e.target.value);
                      if(error) setError("");
                  }}
                  className={`block w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm transition-all duration-200 outline-none
                    ${error
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    }
                  `}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Sending link...</span>
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}