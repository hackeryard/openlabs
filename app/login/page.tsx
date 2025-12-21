"use client"

import Link from "next/link";
import React, { useState } from "react";

/* ================= TYPES ================= */

type FormErrors = {
  email?: string;
  password?: string;
};

type LoginResult = {
  token: string;
};

type LoginPageProps = {
  onSuccess?: (result: LoginResult) => void;
};

/* ================= COMPONENT ================= */

export default function LoginPage({ onSuccess }: LoginPageProps) {
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
    else if (!emailRegex.test(email))
      e.email = "Please enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= MOCK API ================= */

  function mockSignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@site.com" && password === "password") {
          resolve({ token: "demo-token" });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 900);
    });
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await mockSignIn({ email, password });

      if (remember) {
        localStorage.setItem("auth_token", result.token);
      } else {
        sessionStorage.setItem("auth_token", result.token);
      }

      onSuccess?.(result);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to sign in"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Sign in to continue to your account
          </p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-indigo-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">
                Remember me
              </span>
            </label>

            <Link
              href="/forgotpassword"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
