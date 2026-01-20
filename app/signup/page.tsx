"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

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

export default function SignupPage({ onSuccess }: SignupPageProps) {
  const router = useRouter();
  
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

    setLoading(true);
    try {
      await Signup({ name, email, password });
      onSuccess?.();

      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      {/* Card Container */}
      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Start your free 30-day trial today
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
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`block w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm transition-all duration-200 outline-none
                  ${errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }
                `}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-red-500 animate-pulse">{errors.name}</p>
            )}
          </div>

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
                  if (errors.email) setErrors({ ...errors, email: undefined });
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
              <p className="text-xs font-medium text-red-500 animate-pulse">{errors.email}</p>
            )}
          </div>

          {/* Password Fields Wrapper */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`block w-full rounded-lg border pl-10 pr-8 py-2.5 text-sm transition-all duration-200 outline-none
                    ${errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    }
                  `}
                  placeholder="••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 animate-pulse">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Confirm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CheckCircle2 size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errors.confirm) setErrors({ ...errors, confirm: undefined });
                  }}
                  className={`block w-full rounded-lg border pl-10 pr-8 py-2.5 text-sm transition-all duration-200 outline-none
                    ${errors.confirm
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    }
                  `}
                  placeholder="••••••"
                />
                
                {/* Single Toggle for both fields, positioned in the second input */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-xs font-medium text-red-500 animate-pulse">{errors.confirm}</p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={accept}
                  onChange={(e) => {
                    setAccept(e.target.checked);
                    if (errors.accept) setErrors({ ...errors, accept: undefined });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.accept && (
               <p className="text-xs font-medium text-red-500 animate-pulse ml-6">
                {errors.accept}
               </p>
            )}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}