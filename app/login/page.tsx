"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

/* ================= TYPES ================= */

type FormErrors = {
  email?: string;
  password?: string;
};

type LoginPageProps = {
  onSuccess?: () => void;
};

/* ================= COMPONENT ================= */

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const router = useRouter();
  
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Status
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ================= VALIDATION ================= */

  function validate(): boolean {
    const e: FormErrors = {};

    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email)) e.email = "Please enter a valid email address.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= LOGIN API ================= */

  async function login(payload: { email: string; password: string }): Promise<void> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
      onSuccess?.();
      router.push("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      {/* Card Container */}
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-6 text-center">
          <div className="mb-2 flex justify-center">
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Lock size={20} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5" noValidate>
          
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
                autoComplete="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: undefined});
                }}
                className={`block w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm transition-all duration-200 outline-none
                  ${errors.email 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50" 
                    : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }
                `}
                placeholder="name@company.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500 animate-pulse">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                }}
                className={`block w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm transition-all duration-200 outline-none
                  ${errors.password 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50" 
                    : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }
                `}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 animate-pulse">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              href="/forgotpassword"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
                <>
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                <span>Signing in...</span>
                </>
            ) : (
                <>
                Sign in
                <ArrowRight size={16} />
                </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link 
              href="/signup" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}