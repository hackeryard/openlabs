"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { analyticsService } from "@/lib/analytics";

/* ================= TYPES ================= */

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  accept?: string;
};

type SignupPageProps = {
  onSuccess?: () => void;
};

/* ================= COMPONENT ================= */

function SignupPageContent({ onSuccess }: SignupPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Track signup page view / start
  useEffect(() => {
    analyticsService.trackSignupStarted();
  }, []);

  /* ================= VALIDATION ================= */

  function validate(): boolean {
    const e: FormErrors = {};

    if (!name.trim()) e.name = "Full name is required.";

    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Please enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";

    if (!confirm) e.confirm = "Please confirm your password.";
    else if (password !== confirm) e.confirm = "Passwords do not match.";

    if (!accept) e.accept = "You must accept the terms.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= SIGNUP API ================= */

  async function Signup(payload: { name: string; email: string; password: string }): Promise<void> {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    if (!loading) setLoading(true);
    try {
      await Signup({ name, email, password });
      
      // Track signup completed event
      analyticsService.trackSignupCompleted();
      
      onSuccess?.();

      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);

      // Send OTP email
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed");
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full flex bg-background font-sans selection:bg-indigo-100 overflow-hidden">
      {/* --- LEFT SIDE: Brand/Visual (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 items-center justify-center p-12 overflow-hidden h-full">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Animated Blobs */}
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse duration-4000"></div>
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse duration-3000"></div>

        <div className="relative z-10 max-w-lg text-center backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-white/20 to-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-inner group transition-transform duration-500 hover:scale-105">
            <UserPlus className="text-white drop-shadow-md" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Start your journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">OpenLabs.</span>
          </h2>
          <p className="text-indigo-100/90 text-base leading-relaxed font-medium">
            Join thousands of scientists, researchers, and students to unlock a world of interactive virtual labs and simulations.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Signup Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background h-full overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto py-2">

          {/* Header */}
          <div className="text-center lg:text-left space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">Create an account</h1>
            <p className="text-sm text-muted-foreground font-medium">Start your free 30-day trial today</p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: nextPath || "/" })}
            className="w-full inline-flex items-center justify-center gap-3 bg-card border border-border/80 py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:border-border hover:text-foreground transition-all duration-200 active:scale-[0.98]"
            aria-label="Sign up with Google"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.6-37-4.9-54.6H272v103.3h147.2c-6.4 34.7-25.5 64.1-54.4 83.7v69.6h87.8c51.4-47.3 81.9-117.4 81.9-202z" />
              <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.5 180.8-66.7l-87.8-69.6c-24.4 16.4-55.7 26.1-93 26.1-71.4 0-132-48.2-153.6-113.1H28.4v71.1C73.9 486.7 168.6 544.3 272 544.3z" />
              <path fill="#FBBC05" d="M118.4 327.9c-10.8-32.5-10.8-67.8 0-100.3V156.5H28.4c-39.5 78.9-39.5 171.1 0 250l90-78.6z" />
              <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C407.5 24.1 345.6 0 272 0 168.6 0 73.9 57.6 28.4 156.5l90 71.1C140 155.9 200.6 107.7 272 107.7z" />
            </svg>
            <span className="text-xs sm:text-sm">Sign up with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-background px-3 text-muted-foreground font-bold tracking-wider">Or register with email</span></div>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-300 p-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-card border ${errors.name ? 'border-red-400 ring-2 ring-red-500/20' : 'border-border hover:border-primary/40'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground font-medium text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-card border ${errors.email ? 'border-red-400 ring-2 ring-red-500/20' : 'border-border hover:border-primary/40'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground font-medium text-sm`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.email}</p>}
            </div>

            {/* Password Fields Wrapper */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-card border ${errors.password ? 'border-red-400 ring-2 ring-red-500/20' : 'border-border hover:border-primary/40'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground font-medium text-sm`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase ml-1">Confirm</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      if (errors.confirm) setErrors({ ...errors, confirm: undefined });
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 bg-card border ${errors.confirm ? 'border-red-400 ring-2 ring-red-500/20' : 'border-border hover:border-primary/40'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground font-medium text-sm`}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirm && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.confirm}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-start ml-0.5">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={accept}
                    onChange={(e) => {
                      setAccept(e.target.checked);
                      if (errors.accept) setErrors({ ...errors, accept: undefined });
                    }}
                    className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-xs text-muted-foreground font-medium leading-tight select-none cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.accept && <p className="text-[11px] font-semibold text-red-500 ml-0.5 mt-0.5">{errors.accept}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/5 hover:shadow-indigo-600/15 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Creating account...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Create account</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pt-1 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage(props: SignupPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SignupPageContent {...props} />
    </Suspense>
  );
}