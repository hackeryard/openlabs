"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getAdminHref } from "@/app/lib/adminUrl";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  Mail,
  Network,
  Shield,
  ShieldCheck,
  TrendingUp,
  Activity,
  Sparkles,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Eye,
  Clock,
  Flame,
  Zap,
  Globe,
  Radio,
  Layers,
  Lock,
  User as UserIcon,
} from "lucide-react";

interface AdminSummaryData {
  system: {
    status: string;
    dbConnected: boolean;
    serverTimestamp: string;
    activeStaffCount: number;
    unresolvedErrors: number;
  };
  users: {
    total: number;
    verified: number;
    staff: number;
    newLast7Days: number;
    totalXpEarned: number;
    recentUsers: Array<{
      _id: string;
      name: string;
      email: string;
      username?: string;
      role: string;
      avatar?: string;
      xp: number;
      level: number;
      createdAt: string;
    }>;
  };
  telemetry: {
    totalViews: number;
    views24h: number;
    uniqueVisitors: number;
    topLabs: Array<{
      pathname: string;
      views: number;
    }>;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
    latestPost?: {
      title: string;
      slug: string;
      date: string;
      author: string;
      readTime?: string;
      views?: number;
      published?: boolean;
      coverImage?: string;
    } | null;
  };
  feedback: {
    total: number;
    pending: number;
    resolved: number;
    recent: Array<{
      _id: string;
      labId: string;
      rating: number;
      comment: string;
      type: string;
      status: string;
      createdAt: string;
    }>;
  };
  contacts: {
    total: number;
    pending: number;
    resolved: number;
    recent: Array<{
      _id: string;
      name: string;
      email: string;
      subject: string;
      status: string;
      createdAt: string;
    }>;
  };
  seo: {
    totalLabs: number;
    coverage: string;
    sitemapStatus: string;
    schemaStatus: string;
  };
}

export default function AdminPortalHomePage() {
  const { isUnlocked, isHydrated, adminSecret, unlock } = useAdminSecret();
  const [data, setData] = useState<AdminSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchSummary = useCallback(async () => {
    if (!isUnlocked && !adminSecret) return;
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {};
      if (adminSecret) {
        headers["x-admin-secret"] = adminSecret;
      }

      const res = await fetch("/api/admin/summary", {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}: Failed to load admin summary`);
      }

      const summaryJson = await res.json();
      setData(summaryJson);
      setLastRefreshed(new Date());
    } catch (err: any) {
      console.error("Admin summary fetch error:", err);
      setError(err.message || "Failed to load admin portal status.");
    } finally {
      setLoading(false);
    }
  }, [isUnlocked, adminSecret]);

  useEffect(() => {
    if (isHydrated && isUnlocked) {
      fetchSummary();
    }
  }, [isHydrated, isUnlocked, fetchSummary]);

  // Auth gate
  if (!isHydrated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <AdminLockScreen
        title="Admin Portal Master Clearance"
        description="Authenticate your administrator clearance or enter your admin secret key to access the central operations dashboard."
        onUnlock={unlock}
      />
    );
  }

  const getRoute = getAdminHref;

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Background Ambient Lighting ── */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* ── Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Admin Portal Central Hub
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Executive status &amp; operational telemetry</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All Systems Normal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Refresh */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchSummary}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/80 hover:bg-accent border border-border/80 text-xs font-bold text-foreground transition"
              title={`Last refreshed: ${lastRefreshed.toLocaleTimeString()}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>

            <Link
              href={getRoute("/admin/blogs/create")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchSummary}
              className="underline hover:no-underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Top Level KPI Ribbon (6 Metrics) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Registered Users */}
          <Link
            href={getRoute("/admin/users")}
            className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">Users</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-foreground">
                {data ? data.users.total.toLocaleString() : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="text-emerald-500 font-bold">+{data?.users.newLast7Days || 0}</span>
                <span>past 7d</span>
              </p>
            </div>
          </Link>

          {/* 24h Page Views */}
          <Link
            href={getRoute("/admin/analytics")}
            className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">Views 24h</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-foreground">
                {data ? data.telemetry.views24h.toLocaleString() : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {data ? `${data.telemetry.totalViews.toLocaleString()} all-time` : "..."}
              </p>
            </div>
          </Link>

          {/* Total Platform XP */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">XP Earned</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {data ? `${(data.users.totalXpEarned / 1000).toFixed(1)}k` : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Student achievements</p>
            </div>
          </div>

          {/* Published Articles */}
          <Link
            href={getRoute("/admin/blogs")}
            className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">Stories</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-foreground">
                {data ? data.blogs.published : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {data ? `${data.blogs.drafts} drafts pending` : "..."}
              </p>
            </div>
          </Link>

          {/* Open Feedback */}
          <Link
            href={getRoute("/admin/feedback")}
            className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">Feedback</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                  data && data.feedback.pending > 0
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div
                className={`text-xl sm:text-2xl font-black ${
                  data && data.feedback.pending > 0 ? "text-rose-500" : "text-foreground"
                }`}
              >
                {data ? data.feedback.pending : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {data ? `${data.feedback.total} total items` : "..."}
              </p>
            </div>
          </Link>

          {/* Contact Inquiries */}
          <Link
            href={getRoute("/admin/contacts")}
            className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">Inquiries</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                  data && data.contacts.pending > 0
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div
                className={`text-xl sm:text-2xl font-black ${
                  data && data.contacts.pending > 0 ? "text-amber-500" : "text-foreground"
                }`}
              >
                {data ? data.contacts.pending : "..."}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {data ? `${data.contacts.total} total inquiries` : "..."}
              </p>
            </div>
          </Link>
        </div>

        {/* ── 6 Modular Service Command Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Analytics Module */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Traffic &amp; Telemetry</h2>
                    <span className="text-[10px] text-muted-foreground">Real-time visitor logs</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live Feed
                </span>
              </div>

              {/* Top Labs Quick List */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Top Active Simulations
                </p>
                {data?.telemetry.topLabs && data.telemetry.topLabs.length > 0 ? (
                  <div className="space-y-1">
                    {data.telemetry.topLabs.slice(0, 3).map((lab, i) => (
                      <div
                        key={lab.pathname}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-muted/40"
                      >
                        <span className="font-mono text-[11px] truncate max-w-[170px] text-foreground">
                          {lab.pathname.replace(/^\/labs\//, "").replace(/^\//, "")}
                        </span>
                        <span className="font-bold text-[11px] text-primary">{lab.views} views</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2">No simulation telemetry logged yet.</p>
                )}
              </div>
            </div>

            <Link
              href={getRoute("/admin/analytics")}
              className="inline-flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition group"
            >
              <span>View Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2. Users & Roles Module */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">User Management</h2>
                    <span className="text-[10px] text-muted-foreground">Accounts, XP &amp; Roles</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {data?.users.staff || 0} Staff
                </span>
              </div>

              {/* User Breakdown Progress Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Verified Accounts</span>
                  <span className="font-bold text-foreground">
                    {data ? Math.round((data.users.verified / (data.users.total || 1)) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        data ? Math.min(100, (data.users.verified / (data.users.total || 1)) * 100) : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">{data?.users.total || 0}</strong> total learners on platform.
                </p>
              </div>
            </div>

            <Link
              href={getRoute("/admin/users")}
              className="inline-flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition group"
            >
              <span>Manage User Accounts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3. Blogs & Editorial Module */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Editorial &amp; Blog</h2>
                    <span className="text-[10px] text-muted-foreground">Science publications</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {data?.blogs.published || 0} Published
                </span>
              </div>

              {/* Latest Article Preview */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Latest Publication
                </p>
                {data?.blogs.latestPost ? (
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <p className="text-xs font-bold text-foreground line-clamp-1">
                      {data.blogs.latestPost.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>By {data.blogs.latestPost.author}</span>
                      <span>{new Date(data.blogs.latestPost.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2">No articles published yet.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={getRoute("/admin/blogs")}
                className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition"
              >
                <span>View All</span>
              </Link>
              <Link
                href={getRoute("/admin/blogs/create")}
                className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Write</span>
              </Link>
            </div>
          </div>

          {/* 4. Feedback & Quality Radar */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Lab Feedback</h2>
                    <span className="text-[10px] text-muted-foreground">Student bug &amp; concept reports</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    data && data.feedback.pending > 0
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }`}
                >
                  {data?.feedback.pending || 0} Pending
                </span>
              </div>

              {/* Feedback Summary Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Resolved Issues</span>
                  <span className="font-bold text-emerald-500">{data?.feedback.resolved || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Ingested</span>
                  <span className="font-bold text-foreground">{data?.feedback.total || 0}</span>
                </div>
                {data && data.feedback.pending > 0 && (
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Requires staff triage</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={getRoute("/admin/feedback")}
              className="inline-flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition group"
            >
              <span>Inspect Feedback &amp; Triage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 5. Support & Contact Inquiries */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Contact Inquiries</h2>
                    <span className="text-[10px] text-muted-foreground">Support &amp; partnerships</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    data && data.contacts.pending > 0
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {data?.contacts.pending || 0} Unread
                </span>
              </div>

              {/* Inquiry Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Replied / Handled</span>
                  <span className="font-bold text-emerald-500">{data?.contacts.resolved || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Inquiries</span>
                  <span className="font-bold text-foreground">{data?.contacts.total || 0}</span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Incoming contact submissions from public forms.
                </p>
              </div>
            </div>

            <Link
              href={getRoute("/admin/contacts")}
              className="inline-flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition group"
            >
              <span>Open Support Inbox</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6. SEO & Indexation Dashboard */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20 flex items-center justify-center">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">SEO &amp; Indexing</h2>
                    <span className="text-[10px] text-muted-foreground">Search graph &amp; audit</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  {data?.seo.totalLabs || 94} Labs
                </span>
              </div>

              {/* SEO Checklist status */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Simulation Coverage</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{data?.seo.coverage || "100%"}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">XML Sitemap</span>
                  <span className="font-bold text-emerald-500">Auto-Generated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Schema.org JSON-LD</span>
                  <span className="font-bold text-emerald-500">Valid</span>
                </div>
              </div>
            </div>

            <Link
              href={getRoute("/admin/seo-dashboard")}
              className="inline-flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground transition group"
            >
              <span>Explore SEO Audit Graph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Real-Time Activity Feeds (Split 2-Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          {/* Recent Registrations */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Recent User Registrations</h3>
              </div>
              <Link
                href={getRoute("/admin/users")}
                className="text-xs font-bold text-primary hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            {data?.users.recentUsers && data.users.recentUsers.length > 0 ? (
              <div className="space-y-2">
                {data.users.recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/40 border border-border/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                        {u.avatar ? (
                          <Image
                            src={u.avatar}
                            alt={u.name}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name?.charAt(0).toUpperCase() || <UserIcon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {u.xp || 0} XP
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No users registered yet.</p>
            )}
          </div>

          {/* Recent Inquiries & Feedback */}
          <div className="p-5 rounded-3xl bg-card/90 border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">Recent Feedback &amp; Inquiries</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={getRoute("/admin/feedback")}
                  className="font-bold text-primary hover:underline"
                >
                  Feedback
                </Link>
                <span>•</span>
                <Link
                  href={getRoute("/admin/contacts")}
                  className="font-bold text-primary hover:underline"
                >
                  Contacts
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              {data?.feedback.recent && data.feedback.recent.length > 0 ? (
                data.feedback.recent.slice(0, 3).map((f) => (
                  <div
                    key={f._id}
                    className="p-2.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-[11px] truncate max-w-[200px]">
                        Lab: {f.labId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          f.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-1 text-[11px]">{f.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No recent feedback.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
