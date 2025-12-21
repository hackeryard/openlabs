"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ================= TYPES ================= */

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  accept?: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type SignupPageProps = {
  onSuccess?: (user: User) => void;
};

/* ================= COMPONENT ================= */

export default function SignupPage({ onSuccess }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ================= VALIDATION ================= */

  function validate(): boolean {
    const e: FormErrors = {};

    if (!name.trim()) e.name = "Full name is required.";

    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email))
      e.email = "Please enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";

    if (!confirm) e.confirm = "Please confirm your password.";
    else if (password !== confirm)
      e.confirm = "Passwords do not match.";

    if (!accept) e.accept = "You must accept the terms.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= MOCK API ================= */

  function mockSignup({
    name,
    email,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@site.com") {
          reject(new Error("User already exists"));
        } else {
          resolve({ id: Date.now(), name, email });
        }
      }, 800);
    });
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const user = await mockSignup({ name, email, password });
      onSuccess?.(user);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Signup failed"
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
            Create account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Start your free account
          </p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-900 dark:text-white ${
                errors.name ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-900 dark:text-white ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-900 dark:text-white ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
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
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-900 dark:text-white ${
                errors.confirm ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                terms and privacy
              </a>
            </span>
          </div>
          {errors.accept && (
            <p className="text-xs text-red-600">{errors.accept}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
