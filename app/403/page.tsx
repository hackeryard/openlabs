"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, ArrowLeft, Home, Sparkles, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ForbiddenPage() {
  const { user, logout } = useAuth();

  const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.openlabs.org.in";

  return (
    <main className="min-h-[82vh] flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
        {/* Soft Badge & Friendly Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
              403 • Restricted Area
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              This section is reserved for authorized staff. Your account does not currently have administrative permissions.
            </p>
          </div>
        </div>

        {/* User Badge Info */}
        {user && (
          <div className="p-3 rounded-2xl bg-muted/50 border border-border/70 text-xs flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-foreground truncate">{user.name || "Logged In"}</div>
                <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-muted font-bold text-[10px] text-muted-foreground border border-border uppercase shrink-0">
              {user.role || "user"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <a
            href={mainSiteUrl}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to OpenLabs</span>
          </a>
          <button
            onClick={logout}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-accent font-semibold text-xs border border-border transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </main>
  );
}
