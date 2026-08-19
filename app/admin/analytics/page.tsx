"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
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
  Radio,
  Share2,
  PieChart,
  Tag,
  Maximize2,
  Copy,
  Check,
  Sliders,
  Calendar,
} from "lucide-react";
import { getFullCountryName } from "@/app/lib/countries";

// ── Types ──────────────────────────────────────────────────────────────
interface UserSnippet {
  _id?: string;
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
  level?: number;
  xp?: number;
}

interface PageViewItem {
  _id: string;
  pathname: string;
  title?: string;
  labId?: string | null;
  visitorId: string;
  sessionId: string;
  referrer?: string;
  referrerDomain?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device: string;
  browser: string;
  os: string;
  screen?: string;
  country: string;
  duration: number;
  scrollDepth: number;
  createdAt: string;
  userId?: UserSnippet | null;
}

interface CustomEventItem {
  _id: string;
  eventName: string;
  category: string;
  labId?: string | null;
  pathname: string;
  properties?: any;
  value?: number | null;
  visitorId: string;
  sessionId: string;
  createdAt: string;
  userId?: UserSnippet | null;
}

interface ErrorLogItem {
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
  createdAt: string;
  userId?: UserSnippet | null;
}

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
  utmCampaigns: {
    source: string;
    medium: string;
    campaign: string;
    views: number;
    visitors: number;
    avgDuration: number;
  }[];
  devices: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  operatingSystems: { os: string; count: number; percentage: number }[];
  screenResolutions: { screen: string; count: number; percentage: number }[];
  countries: { country: string; count: number; percentage: number }[];
  durationDistribution: { label: string; count: number }[];
  scrollDistribution: { label: string; count: number }[];
  recentPageViews: PageViewItem[];
  recentEvents: CustomEventItem[];
  recentErrors: ErrorLogItem[];
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

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function formatExactTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatExactDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminAnalyticsDashboard() {
  const { adminSecret, isUnlocked, isAdmin, unlock, lock } = useAdminSecret();
  const [loading, setLoading] = useState(false);

  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Auto-refresh interval: 0 (off), 10, 30, 60 seconds
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0);

  // Sub-view Tab
  const [activeTab, setActiveTab] = useState<
    "live_feed" | "pages" | "acquisition" | "tech" | "engagement" | "events" | "errors"
  >("live_feed");

  // Search queries per tab
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(
    async (range = timeRange, isBackground = false) => {
      if (!isUnlocked) return;
      if (!isBackground) setLoading(true);

      try {
        const activeSecret =
          adminSecret ||
          (typeof window !== "undefined"
            ? localStorage.getItem("openlabs-admin-secret") ||
              sessionStorage.getItem("adminSecret") ||
              ""
            : "");

        const headers: Record<string, string> = {};
        if (activeSecret) headers["x-admin-secret"] = activeSecret;

        const res = await fetch(`/api/admin/analytics?timeRange=${range}`, {
          headers,
        });

        if (!res.ok) {
          if (res.status === 401) {
            lock();
            return;
          }
          throw new Error("Fetch failed");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Admin analytics error:", err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [isUnlocked, adminSecret, timeRange, lock]
  );

  useEffect(() => {
    if (isUnlocked) {
      fetchData(timeRange);
    }
  }, [isUnlocked, timeRange, fetchData]);

  // Auto-refresh loop
  useEffect(() => {
    if (!isUnlocked || autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchData(timeRange, true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, autoRefreshInterval, timeRange, fetchData]);

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Login Screen ────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <AdminLockScreen
        title="Admin Telemetry Analytics"
        description="Enter your shared Admin Secret to unlock real-time visitor telemetry, error streams, and engagement matrices."
        onUnlock={async (secret) => {
          try {
            const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
              headers: { "x-admin-secret": secret },
            });
            if (!res.ok) return false;
            const json = await res.json();
            setData(json);
            unlock(secret);
            return true;
          } catch {
            return false;
          }
        }}
      />
    );
  }

  const maxTimeseriesViews =
    data?.timeseries?.reduce((max, item) => Math.max(max, item.views), 1) || 1;

  // Filtered views
  const filteredPageViews =
    data?.recentPageViews?.filter(
      (pv) =>
        !searchQuery ||
        pv.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pv.referrerDomain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pv.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pv.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pv.visitorId?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredEvents =
    data?.recentEvents?.filter(
      (evt) =>
        !searchQuery ||
        evt.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.labId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredErrors =
    data?.recentErrors?.filter(
      (err) =>
        !searchQuery ||
        err.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        err.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        err.digest?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Executive Web Analytics & Error Diagnostics
              </h1>
              {/* Live Realtime Pulse Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>{data?.realtime?.totalActiveUsers || 0} Online Now</span>
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Live student session telemetry, traffic attribution, exact event timestamps, and automated error diagnostics
            </p>
          </div>
        </div>

        {/* Timeframe & Auto-Refresh Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe selector */}
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

          {/* Auto Refresh Menu */}
          <select
            value={autoRefreshInterval}
            onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            title="Auto Refresh Interval"
          >
            <option value={0}>Auto: Off</option>
            <option value={10}>Auto: 10s</option>
            <option value={30}>Auto: 30s</option>
            <option value={60}>Auto: 60s</option>
          </select>

          {/* Refresh button */}
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
            <span className="text-[10px] font-extrabold uppercase block">Runtime Errors</span>
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
          { id: "live_feed", label: `Live Stream (${data?.recentPageViews?.length || 0})`, icon: Radio },
          { id: "pages", label: "Top Pages & Labs", icon: Layers },
          { id: "acquisition", label: "Traffic & Campaigns", icon: Compass },
          { id: "tech", label: "Tech & Geography", icon: Laptop },
          { id: "engagement", label: "Dwell & Scroll Dist", icon: Sliders },
          { id: "events", label: `Custom Events (${data?.recentEvents?.length || 0})`, icon: Zap },
          { id: "errors", label: `Error Diagnostics (${data?.recentErrors?.length || 0})`, icon: Bug },
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

      {/* Search Filter Bar for Active Tab */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm">
        <Search size={14} className="text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab.replace("_", " ")} by path, email, device, country, or event name…`}
          className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-[10px] text-muted-foreground hover:text-foreground font-bold px-2 py-0.5 rounded bg-muted"
          >
            Clear
          </button>
        )}
      </div>

      {/* ─── TAB 1: LIVE FEED (RAW PAGEVIEWS STREAM) ─── */}
      {activeTab === "live_feed" && data && (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                Real-Time Pageviews Stream
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Showing {filteredPageViews.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Exact Event Time</th>
                  <th className="p-3.5">Path & Lab</th>
                  <th className="p-3.5">User / Visitor</th>
                  <th className="p-3.5">Dwell Time</th>
                  <th className="p-3.5">Scroll</th>
                  <th className="p-3.5">Referrer / UTM</th>
                  <th className="p-3.5">Device & Geo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPageViews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                      No pageviews recorded matching search.
                    </td>
                  </tr>
                ) : (
                  filteredPageViews.map((pv) => (
                    <tr key={pv._id} className="hover:bg-muted/20 transition">
                      {/* Exact Event Time */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground flex items-center gap-1.5">
                          <Clock size={12} className="text-primary" />
                          <span>{formatExactTime(pv.createdAt)}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <span>{timeAgo(pv.createdAt)}</span>
                          <span>&bull;</span>
                          <span>{formatExactDate(pv.createdAt)}</span>
                        </div>
                      </td>

                      {/* Path & Title */}
                      <td className="p-3.5 max-w-xs">
                        <Link
                          href={pv.pathname}
                          target="_blank"
                          className="font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{pv.pathname}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </Link>
                        {pv.title && pv.title !== pv.pathname && (
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {pv.title}
                          </span>
                        )}
                        {pv.labId && (
                          <span className="inline-block px-1.5 py-0.2 mt-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-mono font-bold">
                            {pv.labId}
                          </span>
                        )}
                      </td>

                      {/* User / Visitor */}
                      <td className="p-3.5">
                        {pv.userId ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block truncate">
                              {pv.userId.name || pv.userId.email}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                              {pv.userId.username && <span>@{pv.userId.username}</span>}
                              {pv.userId.level && (
                                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1 rounded text-[9px] font-bold">
                                  Lvl {pv.userId.level}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-[10px] text-muted-foreground">
                            <span className="block truncate max-w-[110px]" title={pv.visitorId}>
                              {pv.visitorId.slice(0, 12)}…
                            </span>
                            <span className="text-[9px] opacity-70">Anonymous</span>
                          </div>
                        )}
                      </td>

                      {/* Dwell Time */}
                      <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {formatDuration(pv.duration)}
                      </td>

                      {/* Scroll */}
                      <td className="p-3.5 font-mono text-muted-foreground whitespace-nowrap">
                        {pv.scrollDepth}%
                      </td>

                      {/* Referrer & UTM */}
                      <td className="p-3.5 max-w-xs">
                        <span className="font-mono text-[11px] font-bold text-foreground block truncate">
                          {pv.referrerDomain || "Direct"}
                        </span>
                        {pv.utmSource && (
                          <span className="text-[10px] text-indigo-500 font-mono block truncate">
                            utm: {pv.utmSource}
                            {pv.utmCampaign ? ` / ${pv.utmCampaign}` : ""}
                          </span>
                        )}
                      </td>

                      {/* Device & Geo */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-foreground font-bold">
                          {pv.device === "mobile" ? (
                            <Smartphone size={12} />
                          ) : pv.device === "tablet" ? (
                            <Tablet size={12} />
                          ) : (
                            <Laptop size={12} />
                          )}
                          <span>{pv.browser}</span>
                          <span>&bull;</span>
                          <span>{pv.os}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Globe size={10} className="text-primary" />
                          <span>{getFullCountryName(pv.country)}</span>
                          {pv.screen && <span>({pv.screen})</span>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TOP PAGES & LABS ─── */}
      {activeTab === "pages" && data && (
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
                  <th className="p-3.5 text-right">Total Views</th>
                  <th className="p-3.5 text-right">Unique Visitors</th>
                  <th className="p-3.5 text-right">Avg Dwell Time</th>
                  <th className="p-3.5 text-right">Avg Scroll Depth</th>
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

      {/* ─── TAB 3: TRAFFIC & CAMPAIGNS ─── */}
      {activeTab === "acquisition" && data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Referring Domains */}
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

            {/* UTM Campaigns Table */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                UTM Marketing Campaigns
              </h3>
              {data.utmCampaigns.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No UTM campaign traffic recorded yet. Add ?utm_source=... to your share links.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {data.utmCampaigns.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/20 border border-border rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block font-mono">
                          {u.campaign}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {u.source} &bull; {u.medium}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-black text-foreground">{u.views} views</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {u.visitors} visitors ({formatDuration(u.avgDuration)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: TECH & GEOGRAPHY ─── */}
      {activeTab === "tech" && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Device Types */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Device Split
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

          {/* Top Countries */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Top Countries
            </h3>
            <div className="space-y-2">
              {data.countries.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                >
                  <span className="text-foreground flex items-center gap-1.5">
                    <Globe size={12} className="text-primary" />
                    {getFullCountryName(c.country)}
                  </span>
                  <span className="font-mono text-muted-foreground">{c.count} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: DWELL & SCROLL ENGAGEMENT DISTRIBUTIONS ─── */}
      {activeTab === "engagement" && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Dwell Time Distribution */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Time on Page (Dwell Time Distribution)
            </h3>
            <div className="space-y-3">
              {data.durationDistribution.map((dur, idx) => {
                const total = data.overview.totalViews || 1;
                const pct = Math.round((dur.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-foreground">{dur.label}</span>
                      <span className="text-muted-foreground font-mono">
                        {dur.count} views ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Depth Distribution */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Reading Scroll Depth Milestones
            </h3>
            <div className="space-y-3">
              {data.scrollDistribution.map((scr, idx) => {
                const total = data.overview.totalViews || 1;
                const pct = Math.round((scr.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-foreground">{scr.label}</span>
                      <span className="text-muted-foreground font-mono">
                        {scr.count} views ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: CUSTOM EVENTS & LAB ACTIONS ─── */}
      {activeTab === "events" && data && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Custom Lab Actions & Learning Milestones
            </h3>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Showing {filteredEvents.length} events
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">
                No custom events recorded matching criteria.
              </p>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2 hover:border-border/80 transition"
                >
                  {/* Event Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold font-mono text-xs">
                        {evt.eventName}
                      </span>

                      {evt.labId && (
                        <span className="px-2 py-0.5 bg-muted text-foreground rounded-lg font-mono text-[11px] font-bold">
                          {evt.labId}
                        </span>
                      )}

                      {evt.pathname && (
                        <Link
                          href={evt.pathname}
                          target="_blank"
                          className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                        >
                          <span>{evt.pathname}</span>
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>

                    {/* Exact Timestamp */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-foreground flex items-center gap-1 justify-end">
                        <Clock size={11} className="text-primary" />
                        <span>{formatExactTime(evt.createdAt)}</span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        <span>{timeAgo(evt.createdAt)}</span> &bull; <span>{formatExactDate(evt.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* User info if available */}
                  {evt.userId && (
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <span>User: {evt.userId.name || evt.userId.email}</span>
                      {evt.userId.username && (
                        <span className="text-muted-foreground font-mono text-[11px]">
                          (@{evt.userId.username})
                        </span>
                      )}
                      {evt.userId.level && (
                        <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1 rounded text-[10px] font-mono">
                          Lvl {evt.userId.level}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Properties JSON toggle */}
                  {evt.properties && Object.keys(evt.properties).length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedEventId(expandedEventId === evt._id ? null : evt._id)
                        }
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>
                          {expandedEventId === evt._id ? "Hide Event Payload" : "View Event Payload"}
                        </span>
                        {expandedEventId === evt._id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>

                      {expandedEventId === evt._id && (
                        <pre className="mt-2 p-3 bg-black/90 text-emerald-400 text-[10px] font-mono rounded-xl overflow-x-auto border border-emerald-500/20 leading-relaxed">
                          {JSON.stringify(evt.properties, null, 2)}
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

      {/* ─── TAB 7: RUNTIME ERRORS & ANOMALY TRIAGE ─── */}
      {activeTab === "errors" && data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Error Diagnostic Reports & Trace Logs
            </h3>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Showing {filteredErrors.length} errors
            </span>
          </div>

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

                      <h4 className="font-bold text-foreground text-sm leading-snug font-mono">
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

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteError(err._id)}
                          className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                          title="Delete Error Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device & Exact Timestamp Bar */}
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
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-rose-500" />
                      <span>{formatExactTime(err.lastOccurredAt)}</span>
                      <span>({timeAgo(err.lastOccurredAt)})</span>
                      <span>&bull;</span>
                      <span>{formatExactDate(err.lastOccurredAt)}</span>
                    </div>
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
                          {expandedErrorId === err._id ? "Hide Stack Trace" : "View Full Stack Trace"}
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
