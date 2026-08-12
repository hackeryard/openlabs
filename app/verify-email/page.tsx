"use client"

import { Suspense } from "react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, Timer } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

function VerifyEmailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { checkAuth } = useAuth()

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
      // After success, sync central auth state & redirect
      setTimeout(async () => {
        try {
          await checkAuth();
          const next = searchParams.get("next") || "/";
          router.push(next);
        } catch (e) {
          router.push("/");
        }
      }, 1000)
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
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[400px] bg-card rounded-xl shadow-xl border border-border p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-300 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Missing Email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-foreground">
      <div className="w-full max-w-[400px] bg-card rounded-xl shadow-xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Mail size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/20 p-3 text-sm text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            <span className="font-medium">Verified! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900 animate-in fade-in slide-in-from-top-2">
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
              className={`block w-full text-center text-3xl font-bold tracking-[0.5em] rounded-lg border py-4 text-foreground transition-all duration-200 outline-none placeholder:tracking-[0.5em] placeholder:text-muted-foreground
                ${error
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-border hover:border-primary/40 focus:border-indigo-500 focus:ring-4 focus:ring-primary/20"
                }
              `}
            />
             <p className="text-center text-xs text-muted-foreground uppercase tracking-wide font-medium">
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
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
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
           <div className="text-center border-t border-border pt-4 mt-2">
            <Link 
                href="/signup" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
