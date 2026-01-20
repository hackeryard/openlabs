"use client"

import { Suspense } from "react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to reset password")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 p-8">
          <p className="text-center text-red-600">Email not found. Please request password reset again.</p>
          <Link
            href="/forgotpassword"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to forgot password
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        {!success && (
          <div className="p-8 pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Lock size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the OTP and your new password
            </p>
          </div>
        )}

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Password reset successful</h2>
            <p className="mb-6 text-sm text-slate-500">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleResetPassword} className="px-8 pb-8 space-y-5">
            
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="000000"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-center text-2xl font-bold tracking-widest focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              />
            </div>

            {/* New Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 pl-10 pr-10 py-2.5 text-sm transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2.5 text-sm transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  Reset Password
                </>
              )}
            </button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft size={16} />
                Back to log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
