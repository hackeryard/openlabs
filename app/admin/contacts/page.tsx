"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Activity,
  MessageSquare,
  Inbox,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Laptop,
  Copy,
  Check,
  Send,
  User as UserIcon,
  Filter,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface ContactUser {
  _id: string;
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
  xp?: number;
  level?: number;
}

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  emailSent: boolean;
  emailError?: string | null;
  userAgent?: string | null;
  createdAt: string;
  userId?: ContactUser | null;
}

interface ContactStats {
  total: number;
  statusNew: number;
  statusRead: number;
  statusReplied: number;
  statusArchived: number;
  emailsSent: number;
  emailsFailed: number;
}

// ── Admin Secret Helper ────────────────────────────────────────────────
function getAdminSecret(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("openlabs-admin-secret") || "";
}

// ── User Agent Parser ──────────────────────────────────────────────────
function parseUserAgent(ua?: string | null): { device: "mobile" | "desktop"; browser: string } {
  if (!ua) return { device: "desktop", browser: "Browser" };
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  let browser = "Browser";
  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";
  return { device: isMobile ? "mobile" : "desktop", browser };
}

export default function AdminContactsPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<ContactStats | null>(null);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize admin secret
  useEffect(() => {
    const stored = getAdminSecret();
    if (stored) {
      setAdminSecret(stored);
      setAuthenticated(true);
    }
  }, []);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!adminSecret) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (sortBy) params.set("sortBy", sortBy);
      if (searchQuery.trim()) params.set("query", searchQuery.trim());

      const res = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: { "x-admin-secret": adminSecret },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          return;
        }
        throw new Error("Fetch failed");
      }

      const data = await res.json();
      setStats(data.stats);
      setContacts(data.contacts || []);
      setAuthenticated(true);
      localStorage.setItem("openlabs-admin-secret", adminSecret);
    } catch (err) {
      console.error("Admin contacts fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [adminSecret, statusFilter, sortBy, searchQuery]);

  useEffect(() => {
    if (authenticated) {
      fetchContacts();
    }
  }, [authenticated, fetchContacts]);

  // Handle login
  const handleLogin = () => {
    if (adminSecret.trim()) {
      setAuthenticated(true);
    }
  };

  // Status update
  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c._id === contactId ? { ...c, status: newStatus as any } : c))
        );
        // Refresh counts
        if (stats) {
          fetchContacts();
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete submission
  const handleDelete = async (contactId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this contact submission?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        if (stats) {
          setStats((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
        }
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Copy message text helper
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              <h1 className="text-lg font-black text-foreground">Admin Contacts Dashboard</h1>
              <p className="text-xs text-muted-foreground">Enter your admin secret to access</p>
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

  // ─── Main Contacts Dashboard ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Admin Navigation Breadcrumb & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link href="/admin/seo-dashboard" className="hover:text-foreground">
            Admin
          </Link>
          <span>/</span>
          <span className="text-foreground">Contact Form Submissions</span>
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
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm flex items-center gap-1.5"
          >
            <Inbox size={13} />
            <span>Contacts</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <Inbox size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Contact Submissions & Inquiries
            </h1>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Direct inbox of student inquiries, partner requests, and user support submissions
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchContacts()}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Global Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Total Inquiries
            </span>
            <span className="text-xl font-black text-foreground">{stats.total}</span>
          </div>

          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block">
              New (Unread)
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {stats.statusNew}
            </span>
          </div>

          <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-blue-600 dark:text-blue-400 block">
              Read
            </span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              {stats.statusRead}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block">
              Replied
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.statusReplied}
            </span>
          </div>

          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Archived
            </span>
            <span className="text-xl font-black text-muted-foreground">
              {stats.statusArchived}
            </span>
          </div>

          <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">
              Email Notifications
            </span>
            <span className="text-xl font-black text-foreground">
              {stats.emailsSent}
              <span className="text-xs text-muted-foreground ml-1">/ {stats.total}</span>
            </span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm">
        {/* Left: Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Right: Search Input */}
        <div className="flex-1 min-w-[220px] max-w-md relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, subject, or message…"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Contact Submissions Feed */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-3xl text-sm text-muted-foreground">
            {loading ? "Loading inquiries…" : "No contact submissions found."}
          </div>
        ) : (
          contacts.map((c) => {
            const user = c.userId;
            const uaInfo = parseUserAgent(c.userAgent);

            return (
              <div
                key={c._id}
                className={`p-5 bg-card border rounded-3xl space-y-4 shadow-sm hover:shadow-md transition ${
                  c.status === "new" ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-border"
                }`}
              >
                {/* Header: Sender Profile + Email Status + Quick Status Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  {/* Sender Profile */}
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={c.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-border shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-foreground text-sm">{c.name}</span>
                        {user?.username && (
                          <Link
                            href={`/profile/${user.username}`}
                            target="_blank"
                            className="text-xs text-muted-foreground hover:text-primary font-mono flex items-center gap-0.5"
                          >
                            @{user.username}
                            <ExternalLink size={10} />
                          </Link>
                        )}
                        {user?.level && (
                          <span className="px-1.5 py-0.2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded font-bold font-mono text-[10px]">
                            Lvl {user.level}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <a
                          href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                          className="text-primary hover:underline flex items-center gap-1 font-bold"
                        >
                          <Mail size={11} />
                          {c.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Action Toggles */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                      <button
                        onClick={() => handleStatusUpdate(c._id, "new")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          c.status === "new"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Mark as New"
                      >
                        <Clock size={11} />
                        <span>New</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c._id, "read")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          c.status === "read"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Mark as Read"
                      >
                        <CheckCircle2 size={11} />
                        <span>Read</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c._id, "replied")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          c.status === "replied"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Mark as Replied"
                      >
                        <Send size={11} />
                        <span>Replied</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c._id, "archived")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          c.status === "archived"
                            ? "bg-slate-700 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Archive"
                      >
                        <Archive size={11} />
                        <span>Archive</span>
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Delete Submission"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Subject & Telemetry Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Subject:
                    </span>
                    <span className="font-extrabold text-foreground bg-muted px-2.5 py-0.5 rounded-lg border border-border">
                      {c.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                    {/* Email Delivery Status */}
                    {c.emailSent ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Email Dispatched
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold flex items-center gap-1" title={c.emailError || undefined}>
                        <AlertCircle size={11} /> Email Failed
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      {uaInfo.device === "mobile" ? <Smartphone size={10} /> : <Laptop size={10} />}
                      {uaInfo.browser}
                    </span>

                    <span>&bull;</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-muted/30 border border-border rounded-2xl space-y-2 relative group">
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {c.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button
                      onClick={() => handleCopyMessage(c._id, c.message)}
                      className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition"
                    >
                      {copiedId === c._id ? (
                        <>
                          <Check size={11} className="text-emerald-500" />
                          <span className="text-emerald-500">Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}&body=%0A%0A--- Original Message ---%0AFrom: ${encodeURIComponent(c.name)}%0A${encodeURIComponent(c.message)}`}
                      className="flex items-center gap-1.5 px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Send size={11} />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
