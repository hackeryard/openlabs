"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import AdminAccessDenied from "./AdminAccessDenied";

interface AdminLockScreenProps {
  title?: string;
  description?: string;
  onUnlock?: (secret: string) => Promise<boolean | void> | boolean | void;
  error?: string | null;
  loading?: boolean;
}

export default function AdminLockScreen({
  title = "Staff Authentication Required",
  description = "Please sign in with your authorized administrator or moderator staff account to access the OpenLabs Admin Console.",
}: AdminLockScreenProps) {
  const { user } = useAuth();

  // If not logged in, show Staff Login prompt
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
                {description}
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

  const isRegularUser = user.role !== "admin" && user.role !== "moderator";
  if (isRegularUser) {
    return <AdminAccessDenied />;
  }

  return null;
}
