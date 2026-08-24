"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  Mail,
  Network,
  Shield,
  ExternalLink,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  Lock,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getAdminHref, getMainSiteHref } from "@/app/lib/adminUrl";

interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "SEO Graph", href: "/admin/seo-dashboard", icon: Network },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lock } = useAdminSecret();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const mainSiteUrl = getMainSiteHref("/");

  const isItemActive = (href: string) => {
    const cleanHref = getAdminHref(href);
    if (pathname === href || pathname === cleanHref) return true;
    if (href !== "/admin" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-card/90 backdrop-blur-xl border-b border-border/80 z-50 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* ── Left: Brand & Admin Badge ── */}
        <div className="flex items-center gap-4">
          <Link href={getAdminHref("/admin")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-foreground">
                OpenLabs
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Admin
              </span>
            </div>
          </Link>

          {/* System Pulse Dot (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-border/60 text-[11px] font-medium text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </div>
        </div>

        {/* ── Center: Desktop Navigation Tabs ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={getAdminHref(item.href)}
                  className={`
                    h-8 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold transition-all
                    ${active
                      ? "bg-primary text-primary-foreground font-bold shadow-xs shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right Suite: Main Site Link + Theme + Profile ── */}
        <div className="flex items-center gap-2">
          {/* Link back to Main Student Site */}
          <a
            href={mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition"
            title="Open Main Platform"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Theme Toggle */}
          <ThemeToggle className="bg-muted hover:bg-accent border border-border/70 text-foreground" />

          {/* Admin User Profile Dropdown or Sign In */}
          {!user ? (
            <Link
              href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/admin/analytics")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
            </Link>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-foreground transition"
                aria-expanded={profileOpen}
                title="Admin Account"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User Avatar"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || <UserIcon className="w-3 h-3" />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold max-w-[100px] truncate">
                  {user.name || "User"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 p-2 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl z-50 text-foreground"
                  >
                    <div className="px-3 py-2 border-b border-border/70 mb-1">
                      <p className="text-xs font-bold truncate text-foreground">
                        {user.name || "Authenticated User"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase">
                            <Shield className="w-3 h-3" />
                            <span>Administrator</span>
                          </span>
                        ) : user.role === "moderator" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                            <Shield className="w-3 h-3" />
                            <span>Moderator</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-extrabold uppercase">
                            <span>Standard User (No Admin)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={getAdminHref("/admin/users")}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium hover:bg-accent transition"
                    >
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Manage Users</span>
                    </Link>

                    <Link
                      href={getAdminHref("/admin/analytics")}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium hover:bg-accent transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Executive Analytics</span>
                    </Link>

                    <div className="border-t border-border/70 my-1 pt-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          lock();
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Admin Console</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-1.5 rounded-lg bg-muted hover:bg-accent border border-border/70 text-foreground transition"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/70 bg-card/95 backdrop-blur-2xl px-4 py-3 space-y-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={getAdminHref(item.href)}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition
                    ${active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-border/60">
              <a
                href={mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                <span>Exit to Main Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-14 shrink-0" aria-hidden="true" />
    </>
  );
}
