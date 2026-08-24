"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import AdminAccessDenied from "./AdminAccessDenied";

interface AdminLockScreenProps {
  title?: string;
  description?: string;
  onUnlock: (secret: string) => Promise<boolean | void> | boolean | void;
  error?: string | null;
  loading?: boolean;
}

export default function AdminLockScreen({
  title = "Admin Console Clearance",
  description = "Enter your shared Admin Secret to unlock administrative controls, telemetry feeds, and mutation tools.",
  onUnlock,
  error: externalError,
  loading: externalLoading = false,
}: AdminLockScreenProps) {
  const { user, authState } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // If not logged in, show Staff Login prompt (never show the secret input form to unauthenticated users)
  if (!user) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                Staff Authentication Required
              </span>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                Admin Portal Login
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Please sign in with your authorized administrator or moderator staff account to access the OpenLabs Admin Console.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Link
              href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/admin")}`}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Log In as Staff</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-accent font-semibold text-xs border border-border transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isRegularUser = user && user.role !== "admin" && user.role !== "moderator";

  if (isRegularUser) {
    return <AdminAccessDenied />;
  }

  const error = externalError || internalError;
  const loading = externalLoading || internalLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;

    setInternalError(null);
    setInternalLoading(true);

    try {
      const result = await onUnlock(secret.trim());
      if (result === false) {
        setInternalError("Invalid Admin Secret. Access Denied.");
      }
    } catch (err: any) {
      setInternalError(err.message || "Failed to authenticate secret.");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Icon & Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
            </span>
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-sm">
              {description}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Admin Secret Key</span>
              <span className="text-[10px] text-muted-foreground/70 lowercase font-normal">
                x-admin-secret
              </span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="w-4 h-4" />
              </div>

              <input
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  if (internalError) setInternalError(null);
                }}
                placeholder="Paste or type secret..."
                autoFocus
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background/80 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />

              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition"
                tabIndex={-1}
                aria-label={showSecret ? "Hide secret" : "Show secret"}
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !secret.trim()}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 active:scale-[0.99] transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Unlock Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 border-t border-border/60 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
