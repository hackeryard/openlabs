"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { analyticsService } from "@/lib/analytics";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginFormWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ================= VALIDATION ================= */

  function validate(): boolean {
    const e: FormErrors = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Invalid email address.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Must be at least 6 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // Track successful login
      analyticsService.trackLoginCompleted();

      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full flex bg-slate-50 font-sans selection:bg-indigo-100 overflow-hidden">
      {/* --- LEFT SIDE: Brand/Visual (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 items-center justify-center p-12 overflow-hidden h-full">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Animated Blobs */}
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse duration-4000" />
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse duration-3000" />

        <div className="relative z-10 max-w-lg text-center backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-white/20 to-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-inner group transition-transform duration-500 hover:scale-105">
            <Lock className="text-white drop-shadow-md" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">OpenLabs.</span>
          </h2>
          <p className="text-indigo-100/90 text-base leading-relaxed font-medium">
            Log in to access your custom workspace, saved lab variations, and cloud-compiled analysis datasets.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-slate-50 lg:bg-white h-full overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto py-2">

          {/* Header */}
          <div className="text-center lg:text-left space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">Sign In</h1>
            <p className="text-sm text-slate-500 font-medium">Welcome back! Please enter your secure details.</p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: nextPath || "/" })}
            className="w-full inline-flex items-center justify-center gap-3 bg-white border border-slate-200/80 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200 active:scale-[0.98]"
            aria-label="Sign in with Google"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.6-37-4.9-54.6H272v103.3h147.2c-6.4 34.7-25.5 64.1-54.4 83.7v69.6h87.8c51.4-47.3 81.9-117.4 81.9-202z" />
              <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.5 180.8-66.7l-87.8-69.6c-24.4 16.4-55.7 26.1-93 26.1-71.4 0-132-48.2-153.6-113.1H28.4v71.1C73.9 486.7 168.6 544.3 272 544.3z" />
              <path fill="#FBBC05" d="M118.4 327.9c-10.8-32.5-10.8-67.8 0-100.3V156.5H28.4c-39.5 78.9-39.5 171.1 0 250l90-78.6z" />
              <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C407.5 24.1 345.6 0 272 0 168.6 0 73.9 57.6 28.4 156.5l90 71.1C140 155.9 200.6 107.7 272 107.7z" />
            </svg>
            <span className="text-xs sm:text-sm">Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-50 lg:bg-white px-3 text-slate-400 font-bold tracking-wider">Or use email</span></div>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="alex@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-400 ring-2 ring-red-50' : 'border-slate-200 hover:border-slate-300'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm`}
                />
              </div>
              {errors.email && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">Password</label>
                <Link href="/forgot" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors.password ? 'border-red-400 ring-2 ring-red-50' : 'border-slate-200 hover:border-slate-300'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-semibold text-red-500 ml-1 mt-0.5">{errors.password}</p>}
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center gap-2 ml-0.5 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                Remember for 30 days
              </label>
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
                  <span className="text-sm">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Sign In</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 pt-1 font-medium">
            New here?{" "}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}