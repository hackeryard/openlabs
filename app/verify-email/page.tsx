"use client"

import { Suspense } from "react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, Timer } from "lucide-react"

function VerifyEmailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  // State
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Resend State
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Timer Effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  /* ================= HANDLERS ================= */

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to verify OTP")
        return
      }

      setSuccess(true)
      // Automatically log in and redirect to home
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setResendLoading(true)

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP")
        return
      }

      setResendCooldown(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP")
    } finally {
      setResendLoading(false)
    }
  }

  /* ================= FALLBACK UI (No Email) ================= */

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Missing Email</h2>
          <p className="mt-2 text-sm text-slate-500">
            We couldn't find an email address to verify. Please try signing up again.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    )
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Mail size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            <span className="font-medium">Verified! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="px-8 pb-8 space-y-6">
          
          {/* OTP Input */}
          <div className="space-y-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              className={`block w-full text-center text-3xl font-bold tracking-[0.5em] rounded-lg border py-4 text-slate-800 transition-all duration-200 outline-none placeholder:tracking-[0.5em] placeholder:text-slate-200
                ${error
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                }
              `}
            />
             <p className="text-center text-xs text-slate-400 uppercase tracking-wide font-medium">
               Enter 6-digit code
             </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                Verify Email
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or</span>
            </div>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || resendCooldown > 0 || success}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : resendCooldown > 0 ? (
                <Timer size={14} />
              ) : null}
              
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : resendLoading
                ? "Sending code..."
                : "Click to resend"}
            </button>
          </div>
          
          {/* Back to Signup */}
           <div className="text-center border-t border-slate-50 pt-4 mt-2">
            <Link 
                href="/signup" 
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
                Start with a different email
            </Link>
           </div>
        </form>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  )
}
