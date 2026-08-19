"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Beaker,
  Atom,
  Flame,
  Dna,
  Calculator,
  Binary,
  Sparkles,
  Mail,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Heart,
  Globe,
} from "lucide-react";

import AdminFooter from "./AdminFooter";
import { useAuth } from "@/components/AuthProvider";

const stemDisciplines = [
  { label: "Physics Suite (14)", url: "/physics", icon: Atom, color: "text-blue-500" },
  { label: "Chemistry Studio (4)", url: "/chemistry", icon: Flame, color: "text-emerald-500" },
  { label: "Biology Explorer (3)", url: "/biology", icon: Dna, color: "text-rose-500" },
  { label: "Mathematics Lab (12)", url: "/mathematics", icon: Calculator, color: "text-amber-500" },
  { label: "Computer Science (19+)", url: "/computer-science", icon: Binary, color: "text-purple-500" },
];

const platformLinks = [
  { label: "50+ Virtual Labs", url: "/#labs" },
  { label: "Global XP Leaderboard", url: "/leaderboard" },
  { label: "Research & Blog", url: "/blog" },
  { label: "About OpenLabs", url: "/about" },
  { label: "Contact & Bug Report", url: "/contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSubdomain = mounted && typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const hasAdminOrModRole = mounted && (user?.role === "admin" || user?.role === "moderator");
  const isAdminRoute = mounted && (pathname.startsWith("/admin") || isSubdomain) && pathname !== "/403" && hasAdminOrModRole;

  if (isAdminRoute) {
    return <AdminFooter />;
  }

  // If on 403 page on admin subdomain, hide footer entirely
  if (mounted && pathname === "/403" && isSubdomain) {
    return null;
  }

  // Hide footer on focused auth screens
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/95 backdrop-blur-md text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-border/70">
          {/* ─── COL 1: BRAND & MISSION (5 COLS) ─── */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="OpenLabs logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-black tracking-tight text-foreground">
                OpenLabs
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Free, open-access virtual STEM simulations for students and educators worldwide. Run interactive experiments across Physics, Chemistry, Biology, Mathematics, and Computer Science directly in your browser.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Simulation Cloud Active</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck size={12} />
                <span>100% Free & Open</span>
              </div>
            </div>
          </div>

          {/* ─── COL 2: STEM DISCIPLINES (4 COLS) ─── */}
          <div className="lg:col-span-4 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" />
              <span>STEM Disciplines</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {stemDisciplines.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.url}
                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    <item.icon size={13} className={`${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── COL 3: PLATFORM & EXPLORE (3 COLS) ─── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Globe size={13} className="text-primary" />
              <span>Platform & Hub</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.url}
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <a
                href="mailto:support@openlabs.org.in"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-semibold"
              >
                <Mail size={12} className="text-primary" />
                <span>support@openlabs.org.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM LEGAL & COPYRIGHT BAR ─── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <span>&copy; {currentYear} OpenLabs. Built for interactive science education.</span>
          </p>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <span>&bull;</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Publications
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
