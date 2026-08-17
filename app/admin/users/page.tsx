"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Activity,
  MessageSquare,
  Inbox,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  Flame,
  Bot,
  FlaskConical,
  Lock,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Shield,
  Mail,
  UserCheck,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface UserListItem {
  _id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  bio?: string;
  emailVerified: boolean;
  profileSetupComplete: boolean;
  createdAt: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  aiQueriesCount: number;
  completedExperimentsCount: number;
  badgesCount: number;
  subjectCount: number;
}

interface FullUserDetail extends UserListItem {
  badges?: Array<{ id: string; name: string; earnedAt?: string; pinned?: boolean }>;
  completedExperiments?: Array<{
    experimentId: string;
    subject: string;
    completedAt?: string;
    xpEarned?: number;
    timesVisited?: number;
  }>;
  subjectProgress?: Array<{
    subject: string;
    xp: number;
    level: number;
    experimentsCompleted: number;
  }>;
  dailyChallenges?: Array<{
    labId: string;
    date: string;
    completed: boolean;
    attempts: number;
    xpEarned: number;
  }>;
}

interface StatsData {
  totalUsers: number;
  verifiedUsers: number;
  profileCompleted: number;
  totalXpEarned: number;
  totalExperimentsCompleted: number;
  totalAiQueries: number;
}

type SortField =
  | "createdAt"
  | "xp"
  | "level"
  | "streak"
  | "completedExperimentsCount"
  | "aiQueriesCount"
  | "name"
  | "email";

export default function AdminUsersDashboard() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rawUsers, setRawUsers] = useState<UserListItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all"); // "all" | "true" | "false"
  const [profileCompleteFilter, setProfileCompleteFilter] = useState("all"); // "all" | "true" | "false"
  const [activityFilter, setActivityFilter] = useState("all"); // "all" | "active7" | "inactive30"
  const [xpTierFilter, setXpTierFilter] = useState("all"); // "all" | "novice" | "intermediate" | "expert"
  const [labStatusFilter, setLabStatusFilter] = useState("all"); // "all" | "hasCompleted" | "powerUser" | "zero"

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Selected User Modal / Drawer State
  const [selectedUser, setSelectedUser] = useState<FullUserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const storedSecret = sessionStorage.getItem("adminSecret");
    if (storedSecret) {
      setAdminSecret(storedSecret);
      fetchUsers(storedSecret);
    }
  }, []);

  const fetchUsers = async (secret: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      setRawUsers(data.users || []);
      setStats(data.stats || null);
      setIsAuthorized(true);
    } catch (err: any) {
      setError(err.message);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("adminSecret", adminSecret);
    fetchUsers(adminSecret);
  };

  const fetchUserDetail = async (userId: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: { "x-admin-secret": adminSecret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user details");
      setSelectedUser(data.user);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setRawUsers((prev) => prev.filter((u) => u._id !== userId));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setVerifiedFilter("all");
    setProfileCompleteFilter("all");
    setActivityFilter("all");
    setXpTierFilter("all");
    setLabStatusFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  // Filtered & Sorted Users Memoization
  const processedUsers = useMemo(() => {
    let result = [...rawUsers];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.bio && u.bio.toLowerCase().includes(q))
      );
    }

    // 2. Email Verification Filter
    if (verifiedFilter === "true") {
      result = result.filter((u) => u.emailVerified);
    } else if (verifiedFilter === "false") {
      result = result.filter((u) => !u.emailVerified);
    }

    // 3. Profile Setup Filter
    if (profileCompleteFilter === "true") {
      result = result.filter((u) => u.profileSetupComplete);
    } else if (profileCompleteFilter === "false") {
      result = result.filter((u) => !u.profileSetupComplete);
    }

    // 4. Activity Filter
    const now = new Date().getTime();
    if (activityFilter === "active7") {
      result = result.filter((u) => {
        if (!u.lastActiveDate) return false;
        const activeTime = new Date(u.lastActiveDate).getTime();
        return now - activeTime <= 7 * 24 * 60 * 60 * 1000;
      });
    } else if (activityFilter === "inactive30") {
      result = result.filter((u) => {
        if (!u.lastActiveDate) return true;
        const activeTime = new Date(u.lastActiveDate).getTime();
        return now - activeTime > 30 * 24 * 60 * 60 * 1000;
      });
    }

    // 5. XP Tier Filter
    if (xpTierFilter === "novice") {
      result = result.filter((u) => u.xp < 100);
    } else if (xpTierFilter === "intermediate") {
      result = result.filter((u) => u.xp >= 100 && u.xp <= 1000);
    } else if (xpTierFilter === "expert") {
      result = result.filter((u) => u.xp > 1000);
    }

    // 6. Lab Completion Filter
    if (labStatusFilter === "hasCompleted") {
      result = result.filter((u) => u.completedExperimentsCount > 0);
    } else if (labStatusFilter === "powerUser") {
      result = result.filter((u) => u.completedExperimentsCount >= 5);
    } else if (labStatusFilter === "zero") {
      result = result.filter((u) => u.completedExperimentsCount === 0);
    }

    // 7. Multi-column Sorting
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = (valB || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    rawUsers,
    searchQuery,
    verifiedFilter,
    profileCompleteFilter,
    activityFilter,
    xpTierFilter,
    labStatusFilter,
    sortField,
    sortDirection,
  ]);

  // Paginated Subset
  const totalPages = Math.ceil(processedUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = [
      "ID,Name,Email,Username,Verified,ProfileComplete,XP,Level,Streak,LabsCompleted,AIQueries,JoinedDate",
    ];
    const rows = processedUsers.map((u) =>
      [
        u._id,
        `"${u.name.replace(/"/g, '""')}"`,
        `"${u.email}"`,
        `"${u.username || ""}"`,
        u.emailVerified,
        u.profileSetupComplete,
        u.xp,
        u.level,
        u.streak,
        u.completedExperimentsCount,
        u.aiQueriesCount,
        u.createdAt ? new Date(u.createdAt).toISOString() : "",
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `openlabs-users-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="bg-card p-8 rounded-3xl shadow-xl border border-border max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Admin Telemetry Access</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Enter your Admin Secret to access user records and analytics.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Admin Secret..."
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-center"
              required
            />
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? "Authenticating..." : "Access User Portal"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-foreground py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link href="/admin/seo-dashboard" className="hover:text-foreground">Admin</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">User Management & Telemetry</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm flex items-center gap-1.5"
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
              className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
            >
              <BarChart3 size={13} />
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Users className="text-indigo-600" /> Platform User Telemetry
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              High-performance user management with multi-attribute filtering and instant sorting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-sm"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={() => fetchUsers(adminSecret)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-accent border border-border text-foreground text-xs font-extrabold rounded-xl transition shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Aggregated Telemetry Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Total Users</span>
                <Users size={16} className="text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.totalUsers}</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Verified</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.verifiedUsers}</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Profiles Ready</span>
                <UserCheck size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.profileCompleted}</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Platform XP</span>
                <Zap size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.totalXpEarned.toLocaleString()}</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Labs Completed</span>
                <FlaskConical size={16} className="text-cyan-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.totalExperimentsCompleted}</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>AI Assistant</span>
                <Bot size={16} className="text-pink-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{stats.totalAiQueries}</p>
            </div>
          </div>
        )}

        {/* Multi-attribute Filter & Sort Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
          
          {/* Top Row: Instant Search & Reset */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search name, email, username, or bio..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-muted-foreground">
                Showing <strong className="text-foreground">{processedUsers.length}</strong> of {rawUsers.length} users
              </span>

              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-accent border border-border text-foreground text-xs font-bold rounded-xl transition"
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>
          </div>

          {/* Bottom Row: Detailed Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-border">
            
            {/* Email Verification Filter */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                Email Verification
              </label>
              <select
                value={verifiedFilter}
                onChange={(e) => {
                  setVerifiedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">All Verification</option>
                <option value="true">Verified Emails</option>
                <option value="false">Unverified Emails</option>
              </select>
            </div>

            {/* Profile Setup Filter */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                Profile Setup
              </label>
              <select
                value={profileCompleteFilter}
                onChange={(e) => {
                  setProfileCompleteFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">All Setup Status</option>
                <option value="true">Setup Complete</option>
                <option value="false">Setup Incomplete</option>
              </select>
            </div>

            {/* Activity Filter */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                Activity Level
              </label>
              <select
                value={activityFilter}
                onChange={(e) => {
                  setActivityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">All Activity</option>
                <option value="active7">Active (Last 7 Days)</option>
                <option value="inactive30">Inactive (30+ Days)</option>
              </select>
            </div>

            {/* XP Tier Filter */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                XP Tier
              </label>
              <select
                value={xpTierFilter}
                onChange={(e) => {
                  setXpTierFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">All XP Tiers</option>
                <option value="novice">Novice (&lt; 100 XP)</option>
                <option value="intermediate">Intermediate (100 - 1,000 XP)</option>
                <option value="expert">Expert (&gt; 1,000 XP)</option>
              </select>
            </div>

            {/* Lab Completion Status */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                Lab Activity
              </label>
              <select
                value={labStatusFilter}
                onChange={(e) => {
                  setLabStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">All Lab Counts</option>
                <option value="hasCompleted">Completed ≥ 1 Lab</option>
                <option value="powerUser">Power Learners (≥ 5 Labs)</option>
                <option value="zero">Zero Labs Completed</option>
              </select>
            </div>

          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/70 border-b border-border text-xs font-extrabold text-muted-foreground uppercase tracking-wider select-none">
                  
                  {/* Name Sort Header */}
                  <th
                    onClick={() => handleSortToggle("name")}
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>User</span>
                      {sortField === "name" ? (
                        sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </div>
                  </th>

                  {/* Verification Status */}
                  <th className="px-6 py-4">Status</th>

                  {/* XP & Level Sort Header */}
                  <th
                    onClick={() => handleSortToggle("xp")}
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Gamification (XP / Level)</span>
                      {sortField === "xp" ? (
                        sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </div>
                  </th>

                  {/* Labs Completed Sort Header */}
                  <th
                    onClick={() => handleSortToggle("completedExperimentsCount")}
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Labs Completed</span>
                      {sortField === "completedExperimentsCount" ? (
                        sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </div>
                  </th>

                  {/* AI Queries Sort Header */}
                  <th
                    onClick={() => handleSortToggle("aiQueriesCount")}
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>AI Queries</span>
                      {sortField === "aiQueriesCount" ? (
                        sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </div>
                  </th>

                  {/* Joined Date Sort Header */}
                  <th
                    onClick={() => handleSortToggle("createdAt")}
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Joined Date</span>
                      {sortField === "createdAt" ? (
                        sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* User Profile Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm overflow-hidden flex-shrink-0 shadow-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-foreground flex items-center gap-2">
                            {user.name}
                            {user.username && (
                              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                @{user.username}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email Verification */}
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 text-xs font-extrabold border border-amber-200 dark:border-amber-800">
                          <XCircle size={13} /> Unverified
                        </span>
                      )}
                    </td>

                    {/* Gamification Stats */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                          <Zap size={14} /> {user.xp.toLocaleString()} XP
                        </div>
                        <div className="text-xs font-bold text-muted-foreground">
                          Lvl {user.level}
                        </div>
                        {user.streak > 0 && (
                          <div className="flex items-center gap-0.5 text-orange-500 font-extrabold text-xs">
                            <Flame size={14} /> {user.streak}d
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Labs Completed */}
                    <td className="px-6 py-4 text-xs font-bold text-foreground">
                      <span className="px-2.5 py-1 rounded-lg bg-muted border border-border">
                        {user.completedExperimentsCount} Labs
                      </span>
                    </td>

                    {/* AI Queries */}
                    <td className="px-6 py-4 text-xs font-bold text-pink-500 flex items-center gap-1 mt-2">
                      <Bot size={14} /> {user.aiQueriesCount}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => fetchUserDetail(user._id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition"
                          title="View Full Telemetry"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                          title="Delete User Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

                {paginatedUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-medium">
                      No users match your filters. Try resetting filters or adjusting search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="px-6 py-4 bg-muted/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-card border border-border rounded-lg px-2 py-1 text-foreground font-bold focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span>
                Page <strong className="text-foreground">{currentPage}</strong> of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-card hover:bg-accent border border-border rounded-lg text-foreground disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 bg-card hover:bg-accent border border-border rounded-lg text-foreground disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Telemetry Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-card w-full max-w-2xl h-full overflow-y-auto border-l border-border p-6 shadow-2xl space-y-6 animate-in slide-in-from-right duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg overflow-hidden flex-shrink-0">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground">{selectedUser.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {selectedUser._id} • Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-muted rounded-full transition text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-20 text-center text-muted-foreground font-bold flex flex-col items-center gap-2">
                <RefreshCw className="animate-spin text-indigo-500" size={24} />
                <span>Loading full telemetry data...</span>
              </div>
            ) : (
              <>
                {/* Core User Metadata Card */}
                <div className="bg-muted/50 border border-border p-4 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">Email</span>
                      <span className="font-mono text-foreground font-semibold">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">Username</span>
                      <span className="font-mono text-foreground font-semibold">
                        {selectedUser.username ? `@${selectedUser.username}` : "Unset"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">Email Verification</span>
                      <span className={`font-semibold ${selectedUser.emailVerified ? "text-emerald-500" : "text-amber-500"}`}>
                        {selectedUser.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">Profile Setup</span>
                      <span className={`font-semibold ${selectedUser.profileSetupComplete ? "text-emerald-500" : "text-amber-500"}`}>
                        {selectedUser.profileSetupComplete ? "Completed" : "Incomplete"}
                      </span>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="pt-2 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground font-bold uppercase tracking-wider block mb-1">Bio</span>
                      <p className="text-foreground italic">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>

                {/* Gamification Cockpit */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" /> Gamification & Telemetry
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-card border border-border p-3 rounded-xl">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">XP</span>
                      <p className="text-base font-black text-amber-500">{selectedUser.xp || 0}</p>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-xl">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Level</span>
                      <p className="text-base font-black text-indigo-500">{selectedUser.level || 1}</p>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-xl">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Streak</span>
                      <p className="text-base font-black text-orange-500">{selectedUser.streak || 0}d</p>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-xl">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">AI Queries</span>
                      <p className="text-base font-black text-pink-500">{selectedUser.aiQueriesCount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Completed Experiments Log */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical size={16} className="text-cyan-500" /> Completed Experiments ({selectedUser.completedExperiments?.length || 0})
                  </h3>

                  <div className="bg-card border border-border rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    {selectedUser.completedExperiments && selectedUser.completedExperiments.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px]">
                          <tr>
                            <th className="px-3 py-2">Lab ID</th>
                            <th className="px-3 py-2">Subject</th>
                            <th className="px-3 py-2">XP</th>
                            <th className="px-3 py-2">Visits</th>
                            <th className="px-3 py-2">Completed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {selectedUser.completedExperiments.map((exp, idx) => (
                            <tr key={idx} className="hover:bg-muted/40 font-mono">
                              <td className="px-3 py-2 font-bold text-foreground">{exp.experimentId}</td>
                              <td className="px-3 py-2 capitalize">{exp.subject}</td>
                              <td className="px-3 py-2 text-amber-500 font-bold">+{exp.xpEarned || 0}</td>
                              <td className="px-3 py-2">{exp.timesVisited || 1}</td>
                              <td className="px-3 py-2 text-muted-foreground">
                                {exp.completedAt ? new Date(exp.completedAt).toLocaleDateString() : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-4 text-center text-xs text-muted-foreground italic">
                        No experiments completed yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Progress breakdown */}
                {selectedUser.subjectProgress && selectedUser.subjectProgress.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" /> Subject Mastery Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedUser.subjectProgress.map((sp) => (
                        <div key={sp.subject} className="bg-muted/40 border border-border p-3 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-xs font-extrabold capitalize text-foreground">
                            <span>{sp.subject}</span>
                            <span className="text-indigo-500">Lvl {sp.level}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                            <span>{sp.xp} XP</span>
                            <span>{sp.experimentsCompleted} Labs Completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earned Badges */}
                {selectedUser.badges && selectedUser.badges.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Award size={16} className="text-purple-500" /> Earned Badges ({selectedUser.badges.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.badges.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-bold"
                        >
                          <Award size={12} /> {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="pt-6 border-t border-border space-y-3">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield size={14} /> Admin Danger Zone
                  </h3>
                  <button
                    onClick={() => handleDeleteUser(selectedUser._id, selectedUser.name)}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Permanently Delete User Account
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </main>
  );
}
