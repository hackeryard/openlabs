"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getAdminHref, getMainSiteHref } from "@/app/lib/adminUrl";
import {
  Users,
  BookOpen,
  Inbox,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingDown,
  Activity,
  RefreshCw,
  Search,
  Eye,
  ShieldCheck,
  Wrench,
  User as UserIcon,
  Mail,
  Zap,
  Award,
  Globe,
  Smartphone,
  Laptop,
  ExternalLink,
  Layers,
  LayoutGrid,
  ListFilter,
  Trash2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface FeedbackUser {
  _id: string;
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
  xp?: number;
  level?: number;
  bio?: string;
}

interface FeedbackComment {
  _id: string;
  labId: string;
  helpful: boolean | null;
  rating: number | null;
  category: string | null;
  comment: string;
  labStep: string | null;
  status: "new" | "reviewed" | "fixed" | string;
  createdAt: string;
  sessionId?: string;
  userAgent?: string;
  userId?: FeedbackUser | null;
}

interface FeedbackSummaryRow {
  labId: string;
  avgRating: number | null;
  helpfulPct: number | null;
  total: number;
  statusNew: number;
  statusReviewed: number;
  statusFixed: number;
  latestAt: string;
}

interface GlobalStats {
  totalFeedback: number;
  avgRating: number | null;
  helpfulYes: number;
  helpfulNo: number;
  statusNew: number;
  statusReviewed: number;
  statusFixed: number;
  uniqueLabsCount: number;
}

// ── Browser / OS Parser ────────────────────────────────────────────────
function parseUserAgent(ua?: string): { device: "mobile" | "desktop"; browser: string } {
  if (!ua) return { device: "desktop", browser: "Unknown" };
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  let browser = "Browser";
  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";
  return { device: isMobile ? "mobile" : "desktop", browser };
}

export default function AdminFeedbackPage() {
  const { isUnlocked } = useAdminSecret();
  const [loading, setLoading] = useState(false);

  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [rows, setRows] = useState<FeedbackSummaryRow[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackComment[]>([]);
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<FeedbackComment[]>([]);

  // View mode: 'summary' (grouped by lab) vs 'feed' (all individual feedbacks)
  const [viewMode, setViewMode] = useState<"summary" | "feed">("feed");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch feedback data
  const fetchFeedback = useCallback(
    async (expandLabId?: string) => {
      if (!isUnlocked) return;
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (sortBy) params.set("sortBy", sortBy);
        if (expandLabId) params.set("expand", expandLabId);

        const res = await fetch(`/api/admin/feedback?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Fetch failed");
        }

        const data = await res.json();
        setGlobalStats(data.stats);
        setRows(data.summary || data.rows || []);
        setRecentFeedbacks(data.recentFeedbacks || []);
        if (expandLabId) {
          setExpandedComments(data.expandedComments || []);
        }
      } catch (err) {
        console.error("Admin feedback fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [isUnlocked, statusFilter, sortBy]
  );

  useEffect(() => {
    if (isUnlocked) {
      fetchFeedback();
    }
  }, [isUnlocked, fetchFeedback]);

  // Handle expand/collapse of a lab's comments
  const handleToggleExpand = async (labId: string) => {
    if (expandedLab === labId) {
      setExpandedLab(null);
      setExpandedComments([]);
    } else {
      setExpandedLab(labId);
      await fetchFeedback(labId);
    }
  };

  // Handle status update for individual feedback
  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Optimistically update local lists
        setRecentFeedbacks((prev) =>
          prev.map((fb) => (fb._id === feedbackId ? { ...fb, status: newStatus } : fb))
        );
        setExpandedComments((prev) =>
          prev.map((fb) => (fb._id === feedbackId ? { ...fb, status: newStatus } : fb))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this feedback entry?")) return;
    try {
      const res = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecentFeedbacks((prev) => prev.filter((fb) => fb._id !== feedbackId));
        setExpandedComments((prev) => prev.filter((fb) => fb._id !== feedbackId));
      }
    } catch (err) {
      console.error("Delete feedback error:", err);
    }
  };

  // Filter rows & feed by search
  const filteredRows = searchQuery
    ? rows.filter((r) => r.labId.toLowerCase().includes(searchQuery.toLowerCase()))
    : rows;

  const filteredFeed = searchQuery
    ? recentFeedbacks.filter(
        (fb) =>
          fb.labId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fb.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fb.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fb.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fb.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentFeedbacks;

  // ─── Login Screen ────────────────────────────────────────────────────
  if (!isUnlocked) {
    return <AdminLockScreen />;
  }

  // ─── Helper to render a single detailed Feedback Card ────────────────
  const renderFeedbackCard = (fb: FeedbackComment) => {
    const user = fb.userId;
    const uaInfo = parseUserAgent(fb.userAgent);

    return (
      <div
        key={fb._id}
        className="p-4 sm:p-5 bg-card border border-border rounded-3xl space-y-3.5 shadow-sm hover:shadow-md transition"
      >
        {/* Top Header: User Profile info + Lab Badge + Status buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          {/* User Details */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-2xl object-cover border border-border shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-foreground text-sm">
                      {user.name || "OpenLabs User"}
                    </span>
                    {user.username && (
                      <a
                        href={getMainSiteHref(`/profile/${user.username}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary font-mono flex items-center gap-0.5"
                      >
                        @{user.username}
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Mail size={11} className="text-muted-foreground" />
                      {user.email || "No email"}
                    </span>
                    {user.level && (
                      <span className="px-1.5 py-0.2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded font-bold font-mono text-[10px]">
                        Lvl {user.level} &bull; {user.xp || 0} XP
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-muted/60 border border-border text-muted-foreground flex items-center justify-center shrink-0">
                  <UserIcon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground text-xs">Anonymous / Guest</span>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-mono rounded-full">
                      Guest Session
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Session: {fb.sessionId ? fb.sessionId.slice(0, 16) : "Anonymous"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Status Action Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground mr-1 hidden md:inline">
              Status:
            </span>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border">
              <button
                onClick={() => handleStatusUpdate(fb._id, "new")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  fb.status === "new"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Mark as New"
              >
                <AlertCircle size={12} />
                <span>New</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(fb._id, "reviewed")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  fb.status === "reviewed"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Mark as Reviewed"
              >
                <Eye size={12} />
                <span>Reviewed</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(fb._id, "fixed")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  fb.status === "fixed"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Mark as Fixed"
              >
                <Wrench size={12} />
                <span>Fixed</span>
              </button>
            </div>
            <button
              onClick={() => handleDeleteFeedback(fb._id)}
              className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
              title="Delete feedback entry"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Middle: Feedback Ratings & Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Lab Link */}
          <a
            href={getMainSiteHref(`/labs/${fb.labId}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold font-mono flex items-center gap-1 text-[11px] transition"
          >
            <span>/labs/{fb.labId}</span>
            <ExternalLink size={10} />
          </a>

          {/* Helpful pulse */}
          {fb.helpful !== null && (
            <span
              className={`px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1 text-[11px] ${
                fb.helpful
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              {fb.helpful ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
              <span>{fb.helpful ? "Found Helpful" : "Not Helpful"}</span>
            </span>
          )}

          {/* Star Rating */}
          {fb.rating && (
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl font-bold flex items-center gap-1 text-[11px]">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{fb.rating} / 5 Stars</span>
            </span>
          )}

          {/* Category */}
          {fb.category && (
            <span className="px-2.5 py-1 bg-muted border border-border text-foreground rounded-xl font-bold text-[11px]">
              Category: {fb.category}
            </span>
          )}

          {/* Client Device Tag */}
          <span className="px-2 py-1 bg-muted/60 text-muted-foreground rounded-xl text-[10px] font-mono flex items-center gap-1 ml-auto">
            {uaInfo.device === "mobile" ? <Smartphone size={10} /> : <Laptop size={10} />}
            <span>{uaInfo.browser}</span>
            <span>&bull;</span>
            <span>{new Date(fb.createdAt).toLocaleString()}</span>
          </span>
        </div>

        {/* Comment Message Body */}
        {fb.comment ? (
          <div className="p-3.5 bg-muted/30 border border-border rounded-2xl text-xs text-foreground leading-relaxed">
            <p className="font-sans whitespace-pre-wrap">{fb.comment}</p>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">
            No detailed comment attached (Quick pulse rating).
          </p>
        )}
      </div>
    );
  };

  // ─── Main Dashboard ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Feedback Triage Dashboard
            </h1>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Review, triage, and action user feedback with full student profiles and ratings
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchFeedback()}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Global Stats Cards */}
      {globalStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Total Feedback
            </span>
            <span className="text-xl font-black text-foreground">{globalStats.totalFeedback}</span>
          </div>
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Avg Rating
            </span>
            <span className="text-xl font-black text-foreground">
              {globalStats.avgRating !== null ? `${globalStats.avgRating} ★` : "—"}
            </span>
          </div>
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Helpful
            </span>
            <span className="text-xl font-black text-emerald-500">{globalStats.helpfulYes}</span>
            <span className="text-xs text-muted-foreground ml-1">
              / {globalStats.helpfulYes + globalStats.helpfulNo}
            </span>
          </div>
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block">
              New (Action Needed)
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {globalStats.statusNew}
            </span>
          </div>
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Reviewed
            </span>
            <span className="text-xl font-black text-foreground">{globalStats.statusReviewed}</span>
          </div>
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Labs Covered
            </span>
            <span className="text-xl font-black text-foreground">
              {globalStats.uniqueLabsCount}
            </span>
          </div>
        </div>
      )}

      {/* Controls & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border">
          <button
            onClick={() => setViewMode("feed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "feed"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListFilter size={13} />
            <span>Live Feed ({filteredFeed.length})</span>
          </button>
          <button
            onClick={() => setViewMode("summary")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "summary"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={13} />
            <span>Lab Summary ({filteredRows.length})</span>
          </button>
        </div>

        {/* Middle: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="fixed">Fixed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="lowRating">Lowest Rating</option>
            <option value="highTraffic">Highest Traffic</option>
          </select>
        </div>

        {/* Right: Search */}
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, email, lab, or comment…"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* ─── LIVE FEED VIEW (All Individual Feedbacks with User Profiles) ─── */}
      {viewMode === "feed" && (
        <div className="space-y-4">
          {filteredFeed.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-3xl text-sm text-muted-foreground">
              {loading ? "Loading feedbacks…" : "No feedbacks found matching your filters."}
            </div>
          ) : (
            filteredFeed.map((fb) => renderFeedbackCard(fb))
          )}
        </div>
      )}

      {/* ─── LAB SUMMARY VIEW (Grouped by Lab with Expandable Rows) ─── */}
      {viewMode === "summary" && (
        <div className="bg-card border border-border rounded-3xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_60px] gap-2 p-4 border-b border-border bg-muted/30 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            <span>Lab ID</span>
            <span>Avg Rating</span>
            <span>Helpful %</span>
            <span>Total</span>
            <span>Status</span>
            <span>Latest</span>
            <span></span>
          </div>

          {/* Table Rows */}
          {filteredRows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {loading ? "Loading…" : "No feedback summary found."}
            </div>
          ) : (
            filteredRows.map((row) => (
              <div key={row.labId}>
                <div
                  onClick={() => handleToggleExpand(row.labId)}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_60px] gap-2 p-4 border-b border-border hover:bg-muted/20 cursor-pointer transition text-xs items-center"
                >
                  <span className="font-bold text-foreground truncate" title={row.labId}>
                    {row.labId}
                  </span>
                  <span className="font-mono font-bold">
                    {row.avgRating !== null ? (
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        {row.avgRating}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                  <span className="font-mono font-bold">
                    {row.helpfulPct !== null ? `${row.helpfulPct}%` : "—"}
                  </span>
                  <span className="font-mono font-bold text-foreground">{row.total}</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    {row.statusNew > 0 && (
                      <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded">
                        {row.statusNew} new
                      </span>
                    )}
                    {row.statusReviewed > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded">
                        {row.statusReviewed} rev
                      </span>
                    )}
                    {row.statusFixed > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded">
                        {row.statusFixed} fix
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {row.latestAt ? new Date(row.latestAt).toLocaleDateString() : "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {expandedLab === row.labId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>

                {/* Expanded Comments Thread with User Details */}
                {expandedLab === row.labId && (
                  <div className="bg-muted/10 border-b border-border p-4 space-y-3">
                    {expandedComments.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No detailed comments for this lab.
                      </p>
                    ) : (
                      expandedComments.map((fb) => renderFeedbackCard(fb))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
