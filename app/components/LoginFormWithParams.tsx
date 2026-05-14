"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Chrome } from "lucide-react";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function RedesignedLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): boolean {
    const e: FormErrors = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Invalid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

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

      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full w-full flex bg-white font-sans selection:bg-indigo-100">
      {/* --- LEFT SIDE: Brand/Visual (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 items-center justify-center p-12 overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-8 border border-white/20">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Seamlessly manage your <span className="text-indigo-200">digital workflow.</span>
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Join over 10,000+ professionals who use our platform to streamline their daily productivity.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: nextPath || "/" })}
            className="w-full inline-flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.6-37-4.9-54.6H272v103.3h147.2c-6.4 34.7-25.5 64.1-54.4 83.7v69.6h87.8c51.4-47.3 81.9-117.4 81.9-202z" />
              <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.5 180.8-66.7l-87.8-69.6c-24.4 16.4-55.7 26.1-93 26.1-71.4 0-132-48.2-153.6-113.1H28.4v71.1C73.9 486.7 168.6 544.3 272 544.3z" />
              <path fill="#FBBC05" d="M118.4 327.9c-10.8-32.5-10.8-67.8 0-100.3V156.5H28.4c-39.5 78.9-39.5 171.1 0 250l90-78.6z" />
              <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C407.5 24.1 345.6 0 272 0 168.6 0 73.9 57.6 28.4 156.5l90 71.1C140 155.9 200.6 107.7 272 107.7z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 lg:bg-white px-2 text-slate-400 font-medium">Or use email</span></div>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 lg:bg-white border ${errors.email ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900`}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</Link>
              </div>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 lg:bg-white border ${errors.password ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-red-500 ml-1">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">Remember for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-4">
            New here? <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}