"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  BookOpen,
  MessageSquare,
  Inbox,
  BarChart3,
  Eye,
  Clock,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Bug,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  Filter,
  Zap,
  Layers,
  Flame,
  ArrowUpRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    avgDuration: number;
    avgScrollDepth: number;
    activeUsers: number;
  };
  realtime: {
    totalActiveUsers: number;
    activePaths: { pathname: string; activeUsers: number }[];
  };
  timeseries: { label: string; views: number; visitors: number }[];
  topPages: {
    pathname: string;
    title: string;
    labId: string | null;
    views: number;
    visitors: number;
    avgDuration: number;
    avgScrollDepth: number;
  }[];
  topReferrers: { domain: string; count: number; percentage: number }[];
  devices: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number }[];
  operatingSystems: { os: string; count: number }[];
  countries: { country: string; count: number; percentage: number }[];
  recentEvents: {
    _id: string;
    eventName: string;
    category: string;
    labId?: string;
    pathname: string;
    properties?: any;
    value?: number;
    createdAt: string;
    userId?: {
      name?: string;
      email?: string;
      username?: string;
      avatar?: string;
      level?: number;
    } | null;
  }[];
  recentErrors: {
    _id: string;
    message: string;
    stack?: string;
    digest?: string;
    componentStack?: string;
    errorType: string;
    pathname: string;
    device: string;
    browser: string;
    os: string;
    status: "new" | "investigating" | "resolved" | "ignored";
    occurrences: number;
    lastOccurredAt: string;
    userId?: {
      name?: string;
      email?: string;
      username?: string;
    } | null;
  }[];
  errorStats: {
    totalErrors: number;
    uniqueIssues: number;
    statusNew: number;
    statusInvestigating: number;
    statusResolved: number;
  };
}

function getAdminSecret(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("openlabs-admin-secret") || "";
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "< 1s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function AdminAnalyticsDashboard() {
  const [adminSecret, setAdminSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Sub-view Tab: "overview" | "pages" | "acquisition" | "tech" | "events" | "errors"
  const [activeTab, setActiveTab] = useState<
    "overview" | "pages" | "acquisition" | "tech" | "events" | "errors"
  >("overview");

  // Error search & expanded state
  const [errorSearch, setErrorSearch] = useState("");
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  // Initialize admin secret
  useEffect(() => {
    const stored = getAdminSecret();
    if (stored) {
      setAdminSecret(stored);
      setAuthenticated(true);
    }
  }, []);

  // Fetch data
  const fetchData = useCallback(
    async (range = timeRange) => {
      if (!adminSecret) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/analytics?timeRange=${range}`, {
          headers: { "x-admin-secret": adminSecret },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setAuthenticated(false);
            return;
          }
          throw new Error("Fetch failed");
        }

        const json = await res.json();
        setData(json);
        setAuthenticated(true);
        localStorage.setItem("openlabs-admin-secret", adminSecret);
      } catch (err) {
        console.error("Admin analytics error:", err);
      } finally {
        setLoading(false);
      }
    },
    [adminSecret, timeRange]
  );

  useEffect(() => {
    if (authenticated) {
      fetchData(timeRange);
    }
  }, [authenticated, timeRange, fetchData]);

  // Handle login
  const handleLogin = () => {
    if (adminSecret.trim()) {
      setAuthenticated(true);
    }
  };

  // Status update for error triage
  const handleUpdateErrorStatus = async (errorId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/analytics/errors/${errorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentErrors: prev.recentErrors.map((err) =>
              err._id === errorId ? { ...err, status: newStatus as any } : err
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete error record
  const handleDeleteError = async (errorId: string) => {
    if (!window.confirm("Permanently delete this error record?")) return;

    try {
      const res = await fetch(`/api/admin/analytics/errors/${errorId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });

      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentErrors: prev.recentErrors.filter((err) => err._id !== errorId),
          };
        });
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // ─── Login Screen ────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground">Admin Analytics</h1>
              <p className="text-xs text-muted-foreground">Enter admin secret to access</p>
            </div>
          </div>
          <input
            type="password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin Secret"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold transition hover:bg-primary/90 shadow-md"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const maxTimeseriesViews = data?.timeseries?.reduce(
    (max, item) => Math.max(max, item.views),
    1
  ) || 1;

  // Filtered errors
  const filteredErrors = data?.recentErrors?.filter(
    (err) =>
      !errorSearch ||
      err.message.toLowerCase().includes(errorSearch.toLowerCase()) ||
      err.pathname.toLowerCase().includes(errorSearch.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Admin Navigation Breadcrumb & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link href="/admin/seo-dashboard" className="hover:text-foreground">
            Admin
          </Link>
          <span>/</span>
          <span className="text-foreground">Analytics & Telemetry</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
          <Link
            href="/admin/users"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <Users size={13} />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <BookOpen size={13} />
            <span>Blogs</span>
          </Link>
          <Link
            href="/admin/seo-dashboard"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <Activity size={13} />
            <span>SEO</span>
          </Link>
          <Link
            href="/admin/feedback"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <MessageSquare size={13} />
            <span>Feedback</span>
          </Link>
          <Link
            href="/admin/contacts"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <Inbox size={13} />
            <span>Contacts</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm flex items-center gap-1.5"
          >
            <BarChart3 size={13} />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Executive Analytics & Error Triage
              </h1>
              {/* Live Realtime Pulse Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>{data?.realtime?.totalActiveUsers || 0} Online</span>
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              First-party privacy-friendly web analytics, engagement telemetry, and real-time error logging
            </p>
          </div>
        </div>

        {/* Timeframe Selector & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 rounded-xl p-1 border border-border text-xs font-bold">
            {[
              { id: "today", label: "Today" },
              { id: "24h", label: "24h" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "all", label: "All Time" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === t.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="p-2.5 bg-card hover:bg-accent border border-border rounded-xl text-foreground text-xs font-bold transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Total Pageviews
            </span>
            <span className="text-2xl font-black text-foreground">
              {data.overview.totalViews.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Unique Visitors
            </span>
            <span className="text-2xl font-black text-foreground">
              {data.overview.uniqueVisitors.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Total Sessions
            </span>
            <span className="text-2xl font-black text-foreground">
              {data.overview.uniqueSessions.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Avg Dwell Time
            </span>
            <span className="text-2xl font-black text-foreground font-mono">
              {formatDuration(data.overview.avgDuration)}
            </span>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Avg Scroll Depth
            </span>
            <span className="text-2xl font-black text-foreground font-mono">
              {data.overview.avgScrollDepth}%
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
              data.errorStats.totalErrors > 0
                ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                : "bg-card border border-border"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase block">
              Runtime Errors
            </span>
            <span className="text-2xl font-black">
              {data.errorStats.totalErrors}
              <span className="text-xs ml-1 font-normal opacity-80">
                ({data.errorStats.statusNew} new)
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Traffic Time-Series Chart */}
      {data && data.timeseries.length > 0 && (
        <div className="p-5 bg-card border border-border rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="text-sm font-black text-foreground">Traffic & Views Trend</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {data.timeseries.length} data points
            </span>
          </div>

          {/* Pure CSS / SVG Bar Chart */}
          <div className="h-40 flex items-end gap-1.5 sm:gap-2 pt-4 border-b border-border/50">
            {data.timeseries.map((item, idx) => {
              const heightPct = Math.max(6, Math.round((item.views / maxTimeseriesViews) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded-lg shadow-lg z-20 whitespace-nowrap">
                    {item.label}: {item.views} views, {item.visitors} visitors
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg group-hover:brightness-125 transition-all shadow-sm"
                  />
                  <span className="text-[9px] text-muted-foreground font-mono truncate w-full text-center hidden sm:block">
                    {item.label.split(" ").pop() || item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-2xl overflow-x-auto shadow-sm text-xs font-bold">
        {[
          { id: "overview", label: "Top Pages & Labs", icon: Layers },
          { id: "acquisition", label: "Traffic Acquisition", icon: Compass },
          { id: "tech", label: "Devices & Tech", icon: Laptop },
          { id: "events", label: `Custom Events (${data?.recentEvents?.length || 0})`, icon: Zap },
          { id: "errors", label: `Error Logs (${data?.recentErrors?.length || 0})`, icon: Bug },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: TOP PAGES & LABS ─── */}
      {activeTab === "overview" && data && (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Most Visited Lab Routes & Pages
            </h3>
            <span className="text-xs font-bold text-foreground font-mono">
              Top {data.topPages.length} Pages
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Page / Lab Path</th>
                  <th className="p-3.5 text-right">Views</th>
                  <th className="p-3.5 text-right">Unique Visitors</th>
                  <th className="p-3.5 text-right">Avg Time</th>
                  <th className="p-3.5 text-right">Avg Scroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition">
                    <td className="p-3.5">
                      <Link
                        href={page.pathname}
                        target="_blank"
                        className="font-bold text-foreground hover:text-primary flex items-center gap-1.5 font-mono"
                      >
                        <span>{page.pathname}</span>
                        <ExternalLink size={11} className="text-muted-foreground" />
                      </Link>
                      {page.title && page.title !== page.pathname && (
                        <span className="text-[11px] text-muted-foreground block truncate max-w-md">
                          {page.title}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-black font-mono text-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono text-muted-foreground">
                      {page.visitors.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatDuration(page.avgDuration)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-muted-foreground">
                      {page.avgScrollDepth}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TRAFFIC ACQUISITION & REFERRERS ─── */}
      {activeTab === "acquisition" && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Referrers */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Top Referring Domains & Sources
            </h3>
            <div className="space-y-3">
              {data.topReferrers.map((ref, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-mono text-foreground">{ref.domain}</span>
                    <span className="text-muted-foreground">
                      {ref.count} views ({ref.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${ref.percentage}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Geographic Distribution
            </h3>
            <div className="space-y-3">
              {data.countries.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-mono text-foreground flex items-center gap-1.5">
                      <Globe size={13} className="text-primary" />
                      {c.country}
                    </span>
                    <span className="text-muted-foreground">
                      {c.count} views ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${c.percentage}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: DEVICES & TECH ─── */}
      {activeTab === "tech" && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Device Types */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Devices
            </h3>
            <div className="space-y-3">
              {data.devices.map((d, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="capitalize text-foreground flex items-center gap-1.5">
                      {d.device === "mobile" ? (
                        <Smartphone size={14} />
                      ) : d.device === "tablet" ? (
                        <Tablet size={14} />
                      ) : (
                        <Laptop size={14} />
                      )}
                      {d.device}
                    </span>
                    <span>{d.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div style={{ width: `${d.percentage}%` }} className="h-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Top Browsers
            </h3>
            <div className="space-y-2">
              {data.browsers.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                >
                  <span className="text-foreground">{b.browser}</span>
                  <span className="font-mono text-muted-foreground">{b.count} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Operating Systems
            </h3>
            <div className="space-y-2">
              {data.operatingSystems.map((o, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                >
                  <span className="text-foreground">{o.os}</span>
                  <span className="font-mono text-muted-foreground">{o.count} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: CUSTOM LEARNING & LAB EVENTS ─── */}
      {activeTab === "events" && data && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Live Learning & Experiment Events Stream
          </h3>

          <div className="space-y-2.5">
            {data.recentEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No custom events recorded yet.
              </p>
            ) : (
              data.recentEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="p-3.5 bg-muted/20 border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold font-mono text-[11px]">
                      {evt.eventName}
                    </span>

                    {evt.labId && (
                      <span className="px-2 py-0.5 bg-muted text-foreground rounded-lg font-mono text-[11px]">
                        {evt.labId}
                      </span>
                    )}

                    {evt.userId && (
                      <span className="text-xs font-bold text-foreground">
                        {evt.userId.name || evt.userId.email} (Lvl {evt.userId.level || 1})
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {new Date(evt.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 5: RUNTIME ERRORS & ANOMALY TRIAGE ─── */}
      {activeTab === "errors" && data && (
        <div className="space-y-4">
          {/* Error Search Bar */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={errorSearch}
              onChange={(e) => setErrorSearch(e.target.value)}
              placeholder="Search error messages, routes, or stack traces…"
              className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Error List */}
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="p-12 text-center bg-card border border-border rounded-3xl text-xs text-muted-foreground">
                🎉 No runtime errors recorded matching criteria.
              </div>
            ) : (
              filteredErrors.map((err) => (
                <div
                  key={err._id}
                  className={`p-4 sm:p-5 bg-card border rounded-3xl space-y-3 shadow-sm ${
                    err.status === "new" ? "border-rose-500/40 bg-rose-500/[0.02]" : "border-border"
                  }`}
                >
                  {/* Top: Error Message & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded font-black font-mono text-[10px] uppercase">
                          {err.errorType}
                        </span>

                        <span className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground">
                          {err.occurrences} {err.occurrences === 1 ? "occurrence" : "occurrences"}
                        </span>

                        <Link
                          href={err.pathname}
                          target="_blank"
                          className="text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1"
                        >
                          <span>{err.pathname}</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>

                      <h4 className="font-bold text-foreground text-sm leading-snug">
                        {err.message}
                      </h4>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                        <button
                          onClick={() => handleUpdateErrorStatus(err._id, "new")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                            err.status === "new"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() => handleUpdateErrorStatus(err._id, "investigating")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                            err.status === "investigating"
                              ? "bg-amber-500 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Investigating
                        </button>
                        <button
                          onClick={() => handleUpdateErrorStatus(err._id, "resolved")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                            err.status === "resolved"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Resolved
                        </button>
                        <button
                          onClick={() => handleUpdateErrorStatus(err._id, "ignored")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                            err.status === "ignored"
                              ? "bg-slate-700 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Ignore
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteError(err._id)}
                        className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete Error Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Device & Timestamp Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
                    <div className="flex items-center gap-2">
                      <span>
                        {err.os} &bull; {err.browser} ({err.device})
                      </span>
                      {err.digest && (
                        <span className="bg-muted px-1.5 py-0.2 rounded text-[10px]">
                          Digest: {err.digest}
                        </span>
                      )}
                    </div>
                    <span>Last: {new Date(err.lastOccurredAt).toLocaleString()}</span>
                  </div>

                  {/* Stack Trace Toggle */}
                  {err.stack && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedErrorId(expandedErrorId === err._id ? null : err._id)
                        }
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>
                          {expandedErrorId === err._id ? "Hide Stack Trace" : "View Stack Trace"}
                        </span>
                        {expandedErrorId === err._id ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>

                      {expandedErrorId === err._id && (
                        <pre className="mt-2 p-3 bg-black/90 text-rose-400 text-[10px] font-mono rounded-2xl overflow-x-auto border border-rose-500/20 leading-relaxed whitespace-pre-wrap">
                          {err.stack}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
