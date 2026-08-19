"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, Terminal, Activity } from "lucide-react";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  const isSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");

  const getCleanHref = (href: string) => {
    if (isSubdomain) {
      return href.replace(/^\/admin/, "") || "/";
    }
    return href;
  };

  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md text-foreground py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ── Left: Security notice ── */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Lock className="w-3 h-3" />
          </div>
          <span>
            OpenLabs Management Console &bull; Confidential &bull; Authorized Personnel Only
          </span>
        </div>

        {/* ── Center / Right: Quick Navigation & Status ── */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry Operational</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href={getCleanHref("/admin/analytics")}
              className="hover:text-foreground transition"
            >
              Analytics
            </Link>
            <Link
              href={getCleanHref("/admin/users")}
              className="hover:text-foreground transition"
            >
              Users
            </Link>
            <Link
              href={getCleanHref("/admin/seo-dashboard")}
              className="hover:text-foreground transition"
            >
              SEO Graph
            </Link>
          </div>

          <span className="text-muted-foreground/60">
            &copy; {currentYear} OpenLabs
          </span>
        </div>
      </div>
    </footer>
  );
}
