"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getMainSiteHref } from "@/app/lib/adminUrl";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  Play,
  Pause,
  SlidersHorizontal,
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  Code2,
  CheckCheck,
  Wrench,
  Bot,
  UserCheck,
  Repeat,
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
  userId?: UserSnippet | null;
  isReturning?: boolean;
  visitCount?: number;
  referrer?: string;
  referrerDomain?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  os: string;
  screen?: string;
  language?: string;
  timezone?: string;
  country: string;
  city?: string;
  duration: number;
  activeDuration?: number;
  idleDuration?: number;
  focusCount?: number;
  scrollDepth: number;
  scrollMilestones?: number[];
  webVitals?: {
    fcp?: number | null;
    lcp?: number | null;
    cls?: number | null;
    inp?: number | null;
    ttfb?: number | null;
    domLoad?: number | null;
    windowLoad?: number | null;
  };
  hardware?: {
    memory?: number | null;
    cores?: number | null;
    gpu?: string;
    dpr?: number;
    viewport?: string;
    touchPoints?: number;
  };
  network?: {
    effectiveType?: string;
    downlink?: number | null;
    rtt?: number | null;
    saveData?: boolean;
  };
  isBounce?: boolean;
  exitIntent?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomEventItem {
  _id: string;
  eventName: string;
  category?: string;
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
  errorType?: string;
  pathname: string;
  device?: string;
  browser?: string;
  os?: string;
  status: "new" | "investigating" | "resolved" | "ignored";
  occurrences: number;
  firstOccurredAt?: string;
  lastOccurredAt: string;
  createdAt?: string;
  userId?: UserSnippet | null;
}

interface ReturningUserItem {
  visitorId: string;
  user?: UserSnippet | null;
  visitCount: number;
  sessionCount: number;
  totalViews: number;
  totalDuration: number;
  topPaths: string[];
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  firstSeen: string;
  lastSeen: string;
}

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    anonymousSessions?: number;
    authenticatedSessions?: number;
    avgDuration: number;
    avgScrollDepth: number;
    activeUsers: number;
    returningVisitors?: number;
    newVisitors?: number;
    returnRate?: number;
  };
  retention?: {
    totalVisitors: number;
    returningVisitors: number;
    newVisitors: number;
    returnRate: number;
    frequency: { label: string; count: number; percentage: number }[];
  };
  returningUsers?: ReturningUserItem[];
  realtime: {
    totalActiveUsers: number;
    activePaths: { pathname: string; activeUsers: number }[];
  };
  timeseries: {
    label: string;
    views: number;
    visitors: number;
    returningVisitors?: number;
    newVisitors?: number;
    returningViews?: number;
  }[];
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
  recentPageViews?: PageViewItem[];
  recentEvents: CustomEventItem[];
  recentErrors: ErrorLogItem[];
  errorStats: {
    totalErrors: number;
    uniqueIssues: number;
    statusNew: number;
    statusInvestigating: number;
    statusResolved: number;
  };
  webVitals?: {
    totalMeasured: number;
    overall: {
      lcp: number | null;
      fcp: number | null;
      cls: number | null;
      inp: number | null;
      ttfb: number | null;
      domLoad: number | null;
      windowLoad: number | null;
    };
    distributions: {
      lcp: { good: number; needsImprovement: number; poor: number };
      fcp: { good: number; needsImprovement: number; poor: number };
      cls: { good: number; needsImprovement: number; poor: number };
      inp: { good: number; needsImprovement: number; poor: number };
    };
    pages: {
      pathname: string;
      count: number;
      lcp: number | null;
      fcp: number | null;
      cls: number | null;
      inp: number | null;
      ttfb: number | null;
    }[];
  };
  hardwareDiagnostics?: {
    networkTypes: { type: string; count: number; percentage: number }[];
    gpus: { gpu: string; count: number; percentage: number }[];
    cpuCores: { cores: string; count: number; percentage: number }[];
  };
  labIntelligence?: {
    overview: {
      totalStarts: number;
      totalCompletions: number;
      completionRate: number;
      totalParameterTweaks: number;
      totalQuizAttempts: number;
    };
    labs: {
      labId: string;
      starts: number;
      completes: number;
      completionRate: number;
      parameterTweaks: number;
      stepProgressions: number;
      quizAttempts: number;
      resets: number;
      uniqueStudents: number;
    }[];
  };
  behavioralSignals?: {
    bounceRate: number;
    exitIntentRate: number;
    activeRatio: {
      totalActiveSeconds: number;
      totalIdleSeconds: number;
      activePercentage: number;
      avgActiveSeconds: number;
      avgIdleSeconds: number;
      avgFocusCount: number;
    };
    rageClicks: { element: string; pathname: string; count: number; sampleText: string }[];
    outboundClicks: { href: string; count: number; sampleText: string }[];
  };
  userJourneys?: {
    entryPages: { pathname: string; count: number; percentage: number }[];
    exitPages: { pathname: string; count: number; percentage: number }[];
  };
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

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function offsetDateString(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(dateStr: string): string {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function DateRangeNavigator({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Determine current active single date
  let activeSingleDate = today;
  if (value.startsWith("date:")) {
    activeSingleDate = value.replace("date:", "");
  } else if (value === "yesterday") {
    activeSingleDate = yesterday;
  } else if (value === "today" || value === "24h") {
    activeSingleDate = today;
  }

  // Custom date range inputs
  const isCustomRange = value.startsWith("custom:");
  const customParts = isCustomRange ? value.replace("custom:", "").split("_") : [today, today];
  const [customStart, setCustomStart] = useState(customParts[0] || today);
  const [customEnd, setCustomEnd] = useState(customParts[1] || today);

  const isToday = activeSingleDate >= today;
  const isSingleDayMode = value.startsWith("date:") || value === "today" || value === "yesterday";

  const handlePrevDay = () => {
    const prev = offsetDateString(activeSingleDate, -1);
    if (prev === yesterday) {
      onChange("yesterday");
    } else {
      onChange(`date:${prev}`);
    }
  };

  const handleNextDay = () => {
    if (isToday) return;
    const next = offsetDateString(activeSingleDate, 1);
    if (next >= today) {
      onChange("today");
    } else if (next === yesterday) {
      onChange("yesterday");
    } else {
      onChange(`date:${next}`);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    if (customStart === customEnd) {
      if (customStart === today) onChange("today");
      else if (customStart === yesterday) onChange("yesterday");
      else onChange(`date:${customStart}`);
    } else {
      onChange(`custom:${customStart}_${customEnd}`);
    }
    setShowCustomModal(false);
  };

  return (
    <div className={`flex items-center gap-1.5 flex-wrap max-w-full ${className}`}>
      {/* 1. Quick Presets Strip */}
      <div className="flex items-center bg-muted/60 rounded-xl p-1 border border-border text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
        {[
          { id: "today", label: "Today" },
          { id: "yesterday", label: "Yesterday" },
          { id: "7d", label: "7 Days" },
          { id: "30d", label: "30 Days" },
          { id: "all", label: "All Time" },
        ].map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 2. Day-by-Day Stepper Navigator (< Day >) */}
      <div className="flex items-center bg-muted/60 border border-border rounded-xl p-1 text-xs shrink-0">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition"
          title="Previous Day"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="px-2 font-mono text-[11px] font-bold text-foreground select-none whitespace-nowrap">
          {isSingleDayMode
            ? formatDayLabel(activeSingleDate)
            : isCustomRange
              ? `${customParts[0]} → ${customParts[1]}`
              : formatDayLabel(activeSingleDate)}
        </span>

        <button
          type="button"
          onClick={handleNextDay}
          disabled={isToday && isSingleDayMode}
          className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Day"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 3. Custom Date Range Picker */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowCustomModal(!showCustomModal)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${isCustomRange
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          title="Custom Date Range"
        >
          <Calendar size={13} />
          <span>{isCustomRange ? `${customParts[0]} to ${customParts[1]}` : "Custom Range"}</span>
        </button>

        {/* Custom Range Popover Dropdown */}
        {showCustomModal && (
          <div className="absolute right-0 top-full mt-2 z-50 p-4 bg-card border border-border rounded-2xl shadow-2xl w-72 max-w-[calc(100vw-2rem)] space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-black text-foreground">Custom Date Range</span>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground block">
                  From Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  max={today}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground block">
                  To Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  max={today}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs rounded-xl transition shadow-sm"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAnalyticsDashboard() {
  const { adminSecret, isUnlocked, isAdmin, unlock, lock } = useAdminSecret();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    | "live_feed"
    | "returning_users"
    | "vitals"
    | "labs"
    | "ux"
    | "journeys"
    | "pages"
    | "acquisition"
    | "tech"
    | "engagement"
    | "events"
    | "errors"
  >("live_feed");

  // Returning Users Directory Filter State
  const [retUserSearch, setRetUserSearch] = useState("");
  const [retUserSegment, setRetUserSegment] = useState<"all" | "registered" | "guests">("all");
  const [retUserSort, setRetUserSort] = useState<"visits_desc" | "recent_desc" | "views_desc" | "duration_desc">("visits_desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [paginatedPageviews, setPaginatedPageviews] = useState<PageViewItem[]>([]);
  const [pvPagination, setPvPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [pvLoading, setPvLoading] = useState(false);
  const [pvPage, setPvPage] = useState(1);
  const [pvLimit, setPvLimit] = useState(50);
  const [pvQuery, setPvQuery] = useState("");
  const [pvUserType, setPvUserType] = useState("all");
  const [pvDevice, setPvDevice] = useState("all");
  const [pvSort, setPvSort] = useState("createdAt_desc");
  const [pvTimeRange, setPvTimeRange] = useState("7d");
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [jumpPageInput, setJumpPageInput] = useState("");

  // Error Tab State & Filters
  const [errorStatusFilter, setErrorStatusFilter] = useState<string>("all");
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>("all");
  const [errorSearchQuery, setErrorSearchQuery] = useState<string>("");
  const [copiedErrorId, setCopiedErrorId] = useState<string | null>(null);
  const [copiedAllErrors, setCopiedAllErrors] = useState<boolean>(false);
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const [showBulkActionDropdown, setShowBulkActionDropdown] = useState<boolean>(false);
  const [errorBulkLoading, setErrorBulkLoading] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<number>(1);
  const [errorPageSize, setErrorPageSize] = useState<number>(20);
  const [errorJumpPageInput, setErrorJumpPageInput] = useState<string>("");

  useEffect(() => {
    setErrorPage(1);
  }, [errorStatusFilter, errorTypeFilter, errorSearchQuery, timeRange]);

  const generateAiFixPrompt = (err: ErrorLogItem) => {
    return `# 🐛 Bug Diagnostic & Fix Report
**Route / Pathname:** \`${err.pathname}\`
**Error Type:** \`${err.errorType || "runtime"}\`
**Occurrences:** ${err.occurrences}
**Environment:** ${err.browser || "Unknown"} on ${err.os || "Unknown"} (${err.device || "Desktop"})
**Digest / Error Code:** ${err.digest || "None"}
**Last Seen:** ${new Date(err.lastOccurredAt).toLocaleString()}
**Error ID:** \`${err._id}\`

### 🚨 Error Message
\`\`\`
${err.message}
\`\`\`

### 📜 Stack Trace
\`\`\`
${err.stack || "No client stack trace available"}
\`\`\`

---
### 🛠️ AI Fix Instructions
1. Inspect the route component or API handler at \`${err.pathname}\`.
2. Locate the function throwing: \`${err.message}\`.
3. Check for undefined/null property access, missing SSR guards (\`typeof window !== "undefined"\`), invalid JSON parsing, or missing API responses.
4. Implement safe fallbacks or boundary checks to completely eliminate this error.`;
  };

  const handleCopyAiPrompt = async (err: ErrorLogItem) => {
    const promptText = generateAiFixPrompt(err);
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedErrorId(err._id);
      setTimeout(() => setCopiedErrorId(null), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleCopyAllAiPrompts = async (errorsToCopy: ErrorLogItem[]) => {
    if (errorsToCopy.length === 0) return;
    const header = `# 🛠️ OpenLabs Automated Error Triage Report
Generated on: ${new Date().toLocaleString()}
Total Tracked Errors: ${errorsToCopy.length}

---
`;
    const body = errorsToCopy
      .map(
        (err, idx) =>
          `## Bug #${idx + 1}: [${(err.errorType || "runtime").toUpperCase()}] on ${err.pathname}\n${generateAiFixPrompt(
            err
          )}`
      )
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(header + body);
      setCopiedAllErrors(true);
      setTimeout(() => setCopiedAllErrors(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleExportErrors = (format: "markdown" | "json" | "csv", errorsToExport: ErrorLogItem[]) => {
    if (errorsToExport.length === 0) return;
    setShowExportDropdown(false);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let content = "";
    let mimeType = "text/plain";
    let filename = `openlabs_errors_${timestamp}`;

    if (format === "markdown") {
      filename += ".md";
      mimeType = "text/markdown";
      const header = `# 📋 OpenLabs Error Diagnostics & AI Fix Report
- **Export Date:** ${new Date().toLocaleString()}
- **Total Filtered Errors:** ${errorsToExport.length}
- **Active Errors:** ${errorsToExport.filter((e) => e.status === "new" || e.status === "investigating").length
        }
- **Resolved Errors:** ${errorsToExport.filter((e) => e.status === "resolved").length}

---

`;
      const body = errorsToExport
        .map(
          (err, idx) =>
            `## #${idx + 1} - \`${err.errorType}\` on [${err.pathname}](${getMainSiteHref(
              err.pathname
            )})\n` + generateAiFixPrompt(err)
        )
        .join("\n\n---\n\n");
      content = header + body;
    } else if (format === "json") {
      filename += ".json";
      mimeType = "application/json";
      content = JSON.stringify(errorsToExport, null, 2);
    } else if (format === "csv") {
      filename += ".csv";
      mimeType = "text/csv;charset=utf-8;";
      const headers = [
        "ID",
        "Type",
        "Status",
        "Occurrences",
        "Pathname",
        "Message",
        "Digest",
        "Browser",
        "OS",
        "Device",
        "LastOccurredAt",
      ];
      const rows = errorsToExport.map((err) => [
        `"${err._id}"`,
        `"${err.errorType}"`,
        `"${err.status}"`,
        err.occurrences,
        `"${(err.pathname || "").replace(/"/g, '""')}"`,
        `"${(err.message || "").replace(/"/g, '""')}"`,
        `"${(err.digest || "").replace(/"/g, '""')}"`,
        `"${(err.browser || "").replace(/"/g, '""')}"`,
        `"${(err.os || "").replace(/"/g, '""')}"`,
        `"${(err.device || "").replace(/"/g, '""')}"`,
        `"${err.lastOccurredAt}"`,
      ]);
      content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpdateErrors = async (newStatus: string, errorIds: string[]) => {
    if (errorIds.length === 0) return;
    setErrorBulkLoading(true);
    setShowBulkActionDropdown(false);
    try {
      const res = await fetch("/api/admin/analytics/errors", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ errorIds, status: newStatus }),
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          const idSet = new Set(errorIds);
          return {
            ...prev,
            recentErrors: prev.recentErrors.map((err) =>
              idSet.has(err._id) ? { ...err, status: newStatus as any } : err
            ),
          };
        });
      }
    } catch (err) {
      console.error("Bulk update errors error:", err);
    } finally {
      setErrorBulkLoading(false);
    }
  };

  const handleBulkPurgeErrors = async (purgeMode: "resolved" | "all" | "ignored") => {
    const label =
      purgeMode === "all"
        ? "ALL error records"
        : purgeMode === "resolved"
          ? "all RESOLVED error records"
          : "all IGNORED error records";
    if (!window.confirm(`Are you sure you want to permanently delete ${label}?`)) return;

    setErrorBulkLoading(true);
    setShowBulkActionDropdown(false);
    try {
      const res = await fetch(`/api/admin/analytics/errors?purge=${purgeMode}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          let remaining = prev.recentErrors;
          if (purgeMode === "all") remaining = [];
          else if (purgeMode === "resolved") remaining = remaining.filter((e) => e.status !== "resolved");
          else if (purgeMode === "ignored") remaining = remaining.filter((e) => e.status !== "ignored");
          return { ...prev, recentErrors: remaining };
        });
      }
    } catch (err) {
      console.error("Purge errors error:", err);
    } finally {
      setErrorBulkLoading(false);
    }
  };

  const handleUpdateErrorStatus = async (errorId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/analytics/errors/${errorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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

  const handleDeleteError = async (errorId: string) => {
    if (!window.confirm("Permanently delete this error record?")) return;

    try {
      const res = await fetch(`/api/admin/analytics/errors/${errorId}`, {
        method: "DELETE",
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

  const fetchData = useCallback(
    async (range = timeRange, isBackground = false) => {
      if (!isUnlocked) return;
      if (!isBackground) setLoading(true);

      try {
        const res = await fetch(`/api/admin/analytics?timeRange=${range}`);
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Admin analytics error:", err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [isUnlocked, timeRange]
  );

  const fetchPaginatedPageviews = useCallback(
    async (isBackground = false) => {
      if (!isUnlocked) return;
      if (!isBackground) setPvLoading(true);
      try {
        const params = new URLSearchParams({
          page: pvPage.toString(),
          limit: pvLimit.toString(),
          timeRange: pvTimeRange,
          userType: pvUserType,
          query: pvQuery,
          device: pvDevice,
          sortBy: pvSort,
        });
        const res = await fetch(`/api/admin/analytics/pageviews?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setPaginatedPageviews(json.pageviews || []);
          if (json.pagination) setPvPagination(json.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch paginated pageviews:", err);
      } finally {
        if (!isBackground) setPvLoading(false);
      }
    },
    [isUnlocked, pvPage, pvLimit, pvTimeRange, pvUserType, pvQuery, pvDevice, pvSort]
  );

  useEffect(() => { if (isUnlocked) fetchData(timeRange); }, [isUnlocked, timeRange, fetchData]);
  useEffect(() => { if (isUnlocked) fetchPaginatedPageviews(); }, [isUnlocked, fetchPaginatedPageviews]);

  useEffect(() => {
    if (!isUnlocked || !liveStreamActive || activeTab !== "live_feed") return;
    const streamInterval = setInterval(() => { fetchPaginatedPageviews(true); }, 5000);
    return () => clearInterval(streamInterval);
  }, [isUnlocked, liveStreamActive, activeTab, fetchPaginatedPageviews]);

  useEffect(() => {
    if (!isUnlocked || autoRefreshInterval <= 0) return;
    const interval = setInterval(() => { fetchData(timeRange, true); }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [isUnlocked, autoRefreshInterval, timeRange, fetchData]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= pvPagination.totalPages) {
      setPvPage(target);
      setJumpPageInput("");
    }
  };

  const getPageNumbers = () => {
    const total = pvPagination.totalPages;
    const current = pvPage;
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  if (!isUnlocked) {
    return <AdminLockScreen />;
  }

  const maxTimeseriesViews = data?.timeseries?.reduce((max, item) => Math.max(max, item.views), 1) || 1;
  const filteredEvents = data?.recentEvents?.filter((evt) => !searchQuery || evt.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || evt.pathname.toLowerCase().includes(searchQuery.toLowerCase()) || evt.labId?.toLowerCase().includes(searchQuery.toLowerCase()) || evt.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const allErrors = data?.recentErrors || [];
  const errorCounts = {
    total: allErrors.length,
    new: allErrors.filter((e) => e.status === "new").length,
    investigating: allErrors.filter((e) => e.status === "investigating").length,
    resolved: allErrors.filter((e) => e.status === "resolved").length,
    ignored: allErrors.filter((e) => e.status === "ignored").length,
    active: allErrors.filter((e) => e.status === "new" || e.status === "investigating").length,
  };

  const filteredErrors = allErrors.filter((err) => {
    if (errorStatusFilter === "active") {
      if (err.status !== "new" && err.status !== "investigating") return false;
    } else if (errorStatusFilter !== "all") {
      if (err.status !== errorStatusFilter) return false;
    }

    if (errorTypeFilter !== "all") {
      if (err.errorType !== errorTypeFilter) return false;
    }

    const q = (errorSearchQuery || searchQuery).toLowerCase().trim();
    if (!q) return true;
    return (
      (err.message || "").toLowerCase().includes(q) ||
      (err.pathname || "").toLowerCase().includes(q) ||
      (err.digest || "").toLowerCase().includes(q) ||
      (err.stack || "").toLowerCase().includes(q) ||
      (err.errorType || "").toLowerCase().includes(q) ||
      (err.browser || "").toLowerCase().includes(q) ||
      (err.os || "").toLowerCase().includes(q) ||
      (err.device || "").toLowerCase().includes(q)
    );
  });

  const totalErrorPages = Math.max(1, Math.ceil(filteredErrors.length / errorPageSize));
  const paginatedErrors = filteredErrors.slice(
    (errorPage - 1) * errorPageSize,
    errorPage * errorPageSize
  );

  const getErrorPageNumbers = () => {
    const total = totalErrorPages;
    const current = errorPage;
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const handleJumpErrorPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(errorJumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalErrorPages) {
      setErrorPage(target);
      setErrorJumpPageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Executive Web Analytics &amp; Error Diagnostics</h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>{data?.realtime?.totalActiveUsers || 0} Online Now</span>
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Live student session telemetry, traffic attribution, exact event timestamps, and automated error diagnostics</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <DateRangeNavigator value={timeRange} onChange={(val) => setTimeRange(val)} />

          <button
            onClick={() => { fetchData(timeRange); fetchPaginatedPageviews(); }}
            disabled={loading || pvLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold hover:bg-muted transition shadow-sm disabled:opacity-50"
            title="Refresh All Analytics"
          >
            <RefreshCw size={14} className={loading || pvLoading ? "animate-spin text-primary" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Total Pageviews</span>
            <span className="text-xl sm:text-2xl font-black text-foreground">{data.overview.totalViews.toLocaleString()}</span>
          </div>
          <div className="p-3 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Unique Visitors</span>
            <span className="text-xl sm:text-2xl font-black text-foreground">{data.overview.uniqueVisitors.toLocaleString()}</span>
          </div>
          <div
            onClick={() => setActiveTab("returning_users")}
            className="p-3 sm:p-4 bg-card border border-border hover:border-primary/60 rounded-2xl shadow-sm space-y-1 cursor-pointer transition-all hover:bg-muted/30 group"
            title="Click to view full Returning Users directory & profiles"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground group-hover:text-primary transition-colors block">Returning Users</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {data.retention?.returnRate ?? data.overview.returnRate ?? 0}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {(data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-mono">
                View &rarr;
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.retention?.newVisitors ?? data.overview.newVisitors ?? 0} new</span>
              <span>&bull;</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0} return</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Total Sessions</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground">{data.overview.uniqueSessions.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <span>{data.overview.anonymousSessions ?? "?"} guest</span>
              <span>&bull;</span>
              <span>{data.overview.authenticatedSessions ?? "?"} user</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Avg Dwell Time</span>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono">{formatDuration(data.overview.avgDuration)}</span>
          </div>
          <div className="p-3 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Avg Scroll Depth</span>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono">{data.overview.avgScrollDepth}%</span>
          </div>
          <div className={`p-3 sm:p-4 rounded-2xl border shadow-sm space-y-1 ${data.errorStats.totalErrors > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-card border border-border"}`}>
            <span className="text-[10px] font-extrabold uppercase block">Runtime Errors</span>
            <span className="text-xl sm:text-2xl font-black">{data.errorStats.totalErrors} <span className="text-xs ml-1 font-normal opacity-80">({data.errorStats.statusNew} new)</span></span>
          </div>
        </div>
      )}

      {data && data.timeseries.length > 0 && (
        <div className="p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="text-sm font-black text-foreground">Traffic &amp; Returning Users Trend</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> All Pageviews
              </span>
              <span className="flex items-center gap-1.5 text-blue-500 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Returning ({data.retention?.returnRate ?? data.overview.returnRate ?? 0}%)
              </span>
              <span className="text-muted-foreground font-mono">{data.timeseries.length} data points</span>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <div className="h-40 min-w-[340px] flex items-end gap-1.5 sm:gap-2 pt-4 border-b border-border/50">
              {data.timeseries.map((item, idx) => {
                const heightPct = Math.max(6, Math.round((item.views / maxTimeseriesViews) * 100));
                const retPct = item.views > 0 && item.returningViews ? Math.min(100, Math.round((item.returningViews / item.views) * 100)) : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-xl shadow-xl z-20 whitespace-nowrap">
                      <div className="font-bold text-slate-100">{item.label}</div>
                      <div>{item.views} views ({item.visitors} visitors)</div>
                      <div className="text-blue-300">
                        {item.returningVisitors ?? 0} returning ({retPct}%)
                      </div>
                    </div>
                    <div className="w-full flex flex-col justify-end items-center h-full">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[28px] rounded-t-sm transition-all relative overflow-hidden bg-primary/20 group-hover:bg-primary/30 flex flex-col justify-end"
                      >
                        {retPct > 0 && (
                          <div
                            style={{ height: `${retPct}%` }}
                            className="w-full bg-blue-500 transition-all rounded-t-xs"
                            title={`${item.returningViews} returning views`}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground truncate w-full text-center group-hover:text-foreground">
                      {item.label.length > 5 ? item.label.slice(5) : item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-2xl overflow-x-auto no-scrollbar shadow-sm text-xs font-bold">
        {[
          { id: "live_feed", label: `All Page Views (${pvPagination.total.toLocaleString()})`, icon: Radio },
          { id: "returning_users", label: `Returning Users (${data?.returningUsers?.length ?? 0})`, icon: UserCheck },
          { id: "vitals", label: `⚡ Web Vitals & RUM (${data?.webVitals?.totalMeasured || 0})`, icon: Activity },
          { id: "labs", label: `🔬 Lab Intelligence (${data?.labIntelligence?.labs?.length || 0})`, icon: BookOpen },
          { id: "ux", label: `🧠 Behavioral UX (${data?.behavioralSignals?.rageClicks?.length || 0})`, icon: Flame },
          { id: "journeys", label: "🗺️ User Journeys", icon: Share2 },
          { id: "pages", label: "Top Pages & Labs", icon: Layers },
          { id: "acquisition", label: "Traffic & Campaigns", icon: Compass },
          { id: "tech", label: "Tech & Geography", icon: Laptop },
          { id: "engagement", label: "Loyalty, Dwell & Scroll", icon: Sliders },
          { id: "events", label: `Custom Events (${data?.recentEvents?.length || 0})`, icon: Zap },
          { id: "errors", label: `Error Diagnostics (${data?.recentErrors?.length || 0})`, icon: Bug },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition shrink-0 ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "live_feed" && (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${liveStreamActive ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" : "bg-muted-foreground"}`} />
                <h3 className="text-sm font-black tracking-tight text-foreground">All Pageview Events &amp; Live Stream</h3>
              </div>
              <button onClick={() => setLiveStreamActive((v) => !v)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${liveStreamActive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}>
                {liveStreamActive ? (<><Pause size={10} /> <span>Live (5s)</span></>) : (<><Play size={10} /> <span>Stream Paused</span></>)}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-muted-foreground font-mono">Showing <strong className="text-foreground font-bold">{pvPagination.total === 0 ? 0 : (pvPage - 1) * pvLimit + 1}–{Math.min(pvPage * pvLimit, pvPagination.total)}</strong> of <strong className="text-foreground font-bold">{pvPagination.total.toLocaleString()}</strong> events</span>
            </div>
          </div>

          <div className="p-4 border-b border-border/70 space-y-3 bg-muted/10">
            {/* Date Range & Day Stepper for Live Events */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background border border-border rounded-2xl p-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-primary shrink-0" />
                <span className="text-xs font-black text-foreground">Filter Live Pageviews by Date:</span>
              </div>
              <DateRangeNavigator value={pvTimeRange} onChange={(val) => { setPvTimeRange(val); setPvPage(1); }} />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input value={pvQuery} onChange={(e) => { setPvQuery(e.target.value); setPvPage(1); }} placeholder="Search path, visitor, country…" className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground" />
              </div>

              {/* User Type Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Users size={14} className="text-muted-foreground shrink-0" />
                <select value={pvUserType} onChange={(e) => { setPvUserType(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="all">All Visitors</option>
                  <option value="new">New Visitors Only (Visit #1)</option>
                  <option value="returning">Returning Visitors Only</option>
                  <option value="anonymous">Guests / Anonymous Only</option>
                  <option value="authenticated">Logged-In Users Only</option>
                </select>
              </div>

              {/* Device Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Smartphone size={14} className="text-muted-foreground shrink-0" />
                <select value={pvDevice} onChange={(e) => { setPvDevice(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop Only</option>
                  <option value="mobile">Mobile Only</option>
                  <option value="tablet">Tablet Only</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
                <select value={pvSort} onChange={(e) => { setPvSort(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="duration_desc">Longest Dwell</option>
                  <option value="scroll_desc">Deepest Scroll</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Exact Event Time</th>
                  <th className="p-3.5">Path &amp; Lab</th>
                  <th className="p-3.5">User / Visitor ID</th>
                  <th className="p-3.5">Dwell Time</th>
                  <th className="p-3.5">Scroll</th>
                  <th className="p-3.5">Referrer / UTM</th>
                  <th className="p-3.5">Device &amp; Geo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pvLoading && paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-primary" />
                        <span>Loading pageview stream...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground text-xs">
                      No pageviews recorded matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedPageviews.map((pv) => (
                    <tr key={pv._id} className="hover:bg-muted/30 transition group">
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
                        <a
                          href={getMainSiteHref(pv.pathname)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{pv.pathname}</span>
                          <ExternalLink size={10} className="shrink-0 text-muted-foreground group-hover:text-primary" />
                        </a>
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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-foreground block truncate max-w-[150px]">
                                {pv.userId.name || pv.userId.email}
                              </span>
                              {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-bold text-[9px] border border-blue-500/20 inline-flex items-center gap-1" title={`Returning visitor (${pv.visitCount || 2} total visits)`}>
                                  <Repeat size={8} />
                                  <span>Return #{pv.visitCount || 2}</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans font-bold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1" title="First-time new visitor">
                                  <Sparkles size={8} />
                                  <span>New</span>
                                </span>
                              )}
                            </div>
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
                          <div className="font-mono text-[10px] text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground font-sans font-bold text-[9px] uppercase tracking-wide border border-border/50">
                                Guest
                              </span>
                              {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-bold text-[9px] border border-blue-500/20 inline-flex items-center gap-1" title={`Returning guest (${pv.visitCount || 2} total visits)`}>
                                  <Repeat size={8} />
                                  <span>Return #{pv.visitCount || 2}</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans font-bold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1" title="First-time new guest">
                                  <Sparkles size={8} />
                                  <span>New</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <button
                                onClick={() => handleCopy(pv._id + "_vid", pv.visitorId)}
                                className="hover:text-foreground inline-flex items-center gap-1 text-muted-foreground"
                                title="Visitor ID (click to copy)"
                              >
                                <span className="truncate max-w-[90px]">vid:{pv.visitorId.slice(0, 8)}…</span>
                                {copiedId === pv._id + "_vid" ? (
                                  <Check size={9} className="text-emerald-500" />
                                ) : (
                                  <Copy size={9} className="opacity-60" />
                                )}
                              </button>
                              {pv.sessionId && (
                                <button
                                  onClick={() => handleCopy(pv._id + "_sid", pv.sessionId)}
                                  className="hover:text-foreground inline-flex items-center gap-1 text-muted-foreground/70"
                                  title="Session ID (click to copy)"
                                >
                                  <span className="truncate max-w-[70px]">sid:{pv.sessionId.slice(0, 6)}…</span>
                                  {copiedId === pv._id + "_sid" ? (
                                    <Check size={9} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={9} className="opacity-50" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Dwell Time & Active vs. Idle Ratio */}
                      <td className="p-3.5 font-mono whitespace-nowrap">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatDuration(pv.duration)}
                        </div>
                        {pv.activeDuration !== undefined && (
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono mt-0.5">
                            <span className="text-emerald-500 font-bold">{pv.activeDuration}s act</span>
                            {pv.idleDuration ? <span>&bull; {pv.idleDuration}s idl</span> : null}
                          </div>
                        )}
                        {pv.isBounce && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[9px] font-bold border border-rose-500/20">
                            Bounced
                          </span>
                        )}
                      </td>

                      {/* Scroll */}
                      <td className="p-3.5 font-mono text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{pv.scrollDepth}%</span>
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, pv.scrollDepth)}%` }}
                            />
                          </div>
                        </div>
                        {pv.exitIntent && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold border border-amber-500/20">
                            Exit Intent
                          </span>
                        )}
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
                        {pv.webVitals?.lcp && (
                          <div className="mt-1 flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                                pv.webVitals.lcp <= 2500
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : pv.webVitals.lcp <= 4000
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                              }`}
                            >
                              LCP: {pv.webVitals.lcp}ms
                            </span>
                            {pv.webVitals.inp && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                                INP: {pv.webVitals.inp}ms
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Device & Geo */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-foreground font-bold">
                          {pv.device === "mobile" ? (
                            <Smartphone size={12} className="text-amber-500" />
                          ) : pv.device === "tablet" ? (
                            <Tablet size={12} className="text-blue-500" />
                          ) : (
                            <Laptop size={12} className="text-emerald-500" />
                          )}
                          <span>{pv.browser}</span>
                          <span>&bull;</span>
                          <span>{pv.os}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Globe size={10} className="text-primary" />
                          <span>{getFullCountryName(pv.country)}</span>
                          {pv.city && <span>({pv.city})</span>}
                        </div>
                        {pv.network?.effectiveType && (
                          <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground mt-0.5">
                            <span className="px-1 py-0.2 rounded bg-muted text-foreground uppercase font-bold border border-border/60">
                              {pv.network.effectiveType}
                            </span>
                            {pv.hardware?.gpu && (
                              <span className="truncate max-w-[120px] text-[9px]" title={pv.hardware.gpu}>
                                &bull; {pv.hardware.gpu}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Dynamic Pagination Navigation Bar ── */}
          <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Page <strong className="text-foreground">{pvPage}</strong> of{" "}
              <strong className="text-foreground">{pvPagination.totalPages}</strong> (
              {pvPagination.total.toLocaleString()} total events)
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* First Page */}
              <button
                onClick={() => setPvPage(1)}
                disabled={pvPage <= 1 || pvLoading}
                className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => setPvPage((p) => Math.max(1, p - 1))}
                disabled={!pvPagination.hasPrevPage || pvLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              {/* Numbered Pills */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((num, idx) =>
                  typeof num === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setPvPage(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${pvPage === num
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-card border border-border hover:bg-muted text-foreground"
                        }`}
                    >
                      {num}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-muted-foreground text-xs font-bold">
                      …
                    </span>
                  )
                )}
              </div>

              {/* Next Page */}
              <button
                onClick={() => setPvPage((p) => Math.min(pvPagination.totalPages, p + 1))}
                disabled={!pvPagination.hasNextPage || pvLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setPvPage(pvPagination.totalPages)}
                disabled={pvPage >= pvPagination.totalPages || pvLoading}
                className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </button>

              {/* Jump to Page Form */}
              <form onSubmit={handleJumpPage} className="flex items-center gap-1 ml-2">
                <input
                  type="number"
                  min={1}
                  max={pvPagination.totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder="Go to"
                  className="w-14 px-2 py-1 bg-card border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-muted hover:bg-accent border border-border rounded-lg text-[11px] font-bold text-foreground"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: RETURNING USERS DIRECTORY ─── */}
      {activeTab === "returning_users" && data && (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-4">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <UserCheck size={18} />
                </div>
                <h3 className="text-sm font-black tracking-tight text-foreground">
                  Returning Users Directory &amp; Visitor Profiles
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Profiles of registered accounts, frequent students, and persistent visitors returning to OpenLabs
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 font-mono">
                {data.retention?.returnRate ?? data.overview.returnRate ?? 0}% Return Rate
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-background text-foreground font-bold border border-border font-mono">
                {data.returningUsers?.length || 0} Profiles Identified
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-5">
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Total Returnees</span>
              <span className="text-lg font-black text-foreground">
                {data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Registered Members</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                {(data.returningUsers || []).filter((u) => u.user).length}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Guest Returnees</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                {(data.returningUsers || []).filter((u) => !u.user).length}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Max Visits Recorded</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <Flame size={14} className="text-amber-500" />
                {(data.returningUsers && data.returningUsers.length > 0)
                  ? Math.max(...data.returningUsers.map((u) => u.visitCount || 1))
                  : 1}{" "}
                visits
              </span>
            </div>
          </div>

          {/* Search, Filter & Segment Controls */}
          <div className="px-4 sm:px-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Box */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  value={retUserSearch}
                  onChange={(e) => setRetUserSearch(e.target.value)}
                  placeholder="Search name, email, vid, country, lab…"
                  className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Segment Selector */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Users size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={retUserSegment}
                  onChange={(e) => setRetUserSegment(e.target.value as any)}
                  className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                >
                  <option value="all">All Returning Visitors ({data.returningUsers?.length || 0})</option>
                  <option value="registered">Registered Members Only ({(data.returningUsers || []).filter((u) => u.user).length})</option>
                  <option value="guests">Guest Returnees ({(data.returningUsers || []).filter((u) => !u.user).length})</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={retUserSort}
                  onChange={(e) => setRetUserSort(e.target.value as any)}
                  className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                >
                  <option value="visits_desc">Highest Lifetime Visits (Most Loyal)</option>
                  <option value="recent_desc">Most Recently Active</option>
                  <option value="views_desc">Most Pageviews</option>
                  <option value="duration_desc">Longest Total Dwell Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Returning Visitors Table */}
          <div className="overflow-x-auto border-t border-border">
            {(() => {
              const query = retUserSearch.toLowerCase().trim();
              const filtered = (data.returningUsers || [])
                .filter((item) => {
                  if (retUserSegment === "registered" && !item.user) return false;
                  if (retUserSegment === "guests" && item.user) return false;
                  if (!query) return true;
                  const nameMatch = item.user?.name?.toLowerCase().includes(query);
                  const emailMatch = item.user?.email?.toLowerCase().includes(query);
                  const usernameMatch = item.user?.username?.toLowerCase().includes(query);
                  const vidMatch = item.visitorId?.toLowerCase().includes(query);
                  const countryMatch = item.country?.toLowerCase().includes(query);
                  const cityMatch = item.city?.toLowerCase().includes(query);
                  const pathMatch = item.topPaths?.some((p) => p.toLowerCase().includes(query));
                  return Boolean(nameMatch || emailMatch || usernameMatch || vidMatch || countryMatch || cityMatch || pathMatch);
                })
                .sort((a, b) => {
                  if (retUserSort === "recent_desc") {
                    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
                  }
                  if (retUserSort === "views_desc") {
                    return b.totalViews - a.totalViews;
                  }
                  if (retUserSort === "duration_desc") {
                    return b.totalDuration - a.totalDuration;
                  }
                  return (b.visitCount || 1) - (a.visitCount || 1);
                });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">No returning users match your search criteria</p>
                    <p className="text-xs text-muted-foreground">Try clearing search terms or selecting another timeframe.</p>
                  </div>
                );
              }

              return (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      <th className="p-3.5">User / Visitor Identity</th>
                      <th className="p-3.5">Loyalty &amp; Visits</th>
                      <th className="p-3.5">Engagement</th>
                      <th className="p-3.5">Top Explored Labs &amp; Pages</th>
                      <th className="p-3.5">Location &amp; Tech</th>
                      <th className="p-3.5">Activity Timeline</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((item, idx) => (
                      <tr key={item.visitorId || idx} className="hover:bg-muted/30 transition-colors">
                        {/* Identity */}
                        <td className="p-3.5">
                          {item.user ? (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0 overflow-hidden">
                                {item.user.avatar ? (
                                  <img src={item.user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (item.user.name || item.user.email || "U").slice(0, 1).toUpperCase()
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-foreground block">
                                    {item.user.name || item.user.email}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[9px] font-extrabold border border-purple-500/30">
                                    Registered
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                                  {item.user.email && <span>{item.user.email}</span>}
                                  {item.user.username && <span>@{item.user.username}</span>}
                                  {item.user.level && (
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">Lvl {item.user.level}</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleCopy(item.visitorId + "_ret_vid", item.visitorId)}
                                  className="text-[9px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                  title="Visitor ID (click to copy)"
                                >
                                  <span>vid:{item.visitorId.slice(0, 10)}…</span>
                                  {copiedId === item.visitorId + "_ret_vid" ? <Check size={8} className="text-emerald-500" /> : <Copy size={8} className="opacity-50" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                <Users size={16} />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground">Anonymous Guest</span>
                                  <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground text-[9px] font-extrabold border border-border">
                                    Guest
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                                  <button
                                    onClick={() => handleCopy(item.visitorId + "_ret_vid", item.visitorId)}
                                    className="hover:text-foreground inline-flex items-center gap-1"
                                    title="Visitor ID (click to copy)"
                                  >
                                    <span>vid:{item.visitorId.slice(0, 12)}…</span>
                                    {copiedId === item.visitorId + "_ret_vid" ? <Check size={8} className="text-emerald-500" /> : <Copy size={8} className="opacity-50" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Loyalty & Visits */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              <Flame size={12} className="text-amber-500" />
                              <span>{item.visitCount} Visits</span>
                            </span>
                            <span className="block text-[10px] font-mono text-muted-foreground">
                              {item.sessionCount} sessions in period
                            </span>
                          </div>
                        </td>

                        {/* Engagement Volume */}
                        <td className="p-3.5 font-mono">
                          <div className="space-y-0.5">
                            <span className="font-black text-foreground block">{item.totalViews} views</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              {formatDuration(item.totalDuration)} dwell
                            </span>
                          </div>
                        </td>

                        {/* Explored Labs */}
                        <td className="p-3.5 max-w-[260px]">
                          <div className="flex flex-wrap gap-1">
                            {item.topPaths.slice(0, 3).map((path, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground truncate max-w-[160px] inline-block"
                                title={path}
                              >
                                {path}
                              </span>
                            ))}
                            {item.topPaths.length > 3 && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                +{item.topPaths.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Location & Tech */}
                        <td className="p-3.5">
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1 font-bold text-foreground">
                              <Globe size={11} className="text-primary shrink-0" />
                              <span className="truncate max-w-[120px]">{item.country}</span>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground">
                              <span>{item.city} &bull; {item.os} ({item.browser})</span>
                            </div>
                          </div>
                        </td>

                        {/* Timeline */}
                        <td className="p-3.5 font-mono text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block">
                              {timeAgo(item.lastSeen)}
                            </span>
                            <span className="text-[10px] text-muted-foreground block" title={`First: ${item.firstSeen}`}>
                              First: {new Date(item.firstSeen).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setPvQuery(item.visitorId);
                              setPvUserType("all");
                              setActiveTab("live_feed");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border border-border text-[11px] font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
                            title="Filter live stream pageviews for this visitor"
                          >
                            <Eye size={12} />
                            <span>Timeline</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── TAB: CORE WEB VITALS & REAL USER MONITORING (RUM) ─── */}
      {activeTab === "vitals" && data && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  <span>Real User Monitoring (RUM) &amp; Core Web Vitals</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-world browser performance observed across Google Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 w-fit">
                {data.webVitals?.totalMeasured ?? 0} Measured Sessions
              </span>
            </div>
          </div>

          {/* 5 Primary Vital Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. LCP */}
            {(() => {
              const lcp = data.webVitals?.overall.lcp;
              const dist = data.webVitals?.distributions.lcp || { good: 0, needsImprovement: 0, poor: 0 };
              const total = dist.good + dist.needsImprovement + dist.poor || 1;
              const goodPct = Math.round((dist.good / total) * 100);
              const needsPct = Math.round((dist.needsImprovement / total) * 100);
              const poorPct = Math.round((dist.poor / total) * 100);
              const rating = !lcp ? "none" : lcp <= 2500 ? "good" : lcp <= 4000 ? "needs" : "poor";

              return (
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">LCP (Load Speed)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {lcp ? `${(lcp / 1000).toFixed(2)}s` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Largest Contentful Paint</span>
                  </div>
                  {/* Distribution Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" title={`Good: ${goodPct}%`} />
                      <div style={{ width: `${needsPct}%` }} className="h-full bg-amber-500" title={`Needs Imp: ${needsPct}%`} />
                      <div style={{ width: `${poorPct}%` }} className="h-full bg-rose-500" title={`Poor: ${poorPct}%`} />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 2.5s</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. INP */}
            {(() => {
              const inp = data.webVitals?.overall.inp;
              const dist = data.webVitals?.distributions.inp || { good: 0, needsImprovement: 0, poor: 0 };
              const total = dist.good + dist.needsImprovement + dist.poor || 1;
              const goodPct = Math.round((dist.good / total) * 100);
              const rating = !inp ? "none" : inp <= 200 ? "good" : inp <= 500 ? "needs" : "poor";

              return (
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">INP (Interactivity)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {inp ? `${inp}ms` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Interaction to Next Paint</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 200ms</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3. CLS */}
            {(() => {
              const cls = data.webVitals?.overall.cls;
              const dist = data.webVitals?.distributions.cls || { good: 0, needsImprovement: 0, poor: 0 };
              const total = dist.good + dist.needsImprovement + dist.poor || 1;
              const goodPct = Math.round((dist.good / total) * 100);
              const rating = cls === null || cls === undefined ? "none" : cls <= 0.1 ? "good" : cls <= 0.25 ? "needs" : "poor";

              return (
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">CLS (Visual Shift)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {cls !== null && cls !== undefined ? cls.toFixed(3) : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Cumulative Layout Shift</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 0.10</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 4. FCP */}
            {(() => {
              const fcp = data.webVitals?.overall.fcp;
              const dist = data.webVitals?.distributions.fcp || { good: 0, needsImprovement: 0, poor: 0 };
              const total = dist.good + dist.needsImprovement + dist.poor || 1;
              const goodPct = Math.round((dist.good / total) * 100);
              const rating = !fcp ? "none" : fcp <= 1800 ? "good" : fcp <= 3000 ? "needs" : "poor";

              return (
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">FCP (First Paint)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {fcp ? `${(fcp / 1000).toFixed(2)}s` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">First Contentful Paint</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 1.8s</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 5. TTFB */}
            {(() => {
              const ttfb = data.webVitals?.overall.ttfb;
              const rating = !ttfb ? "none" : ttfb <= 800 ? "good" : ttfb <= 1800 ? "needs" : "poor";

              return (
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">TTFB (Server Speed)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {ttfb ? `${ttfb}ms` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Time to First Byte</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${rating === "good" ? 90 : 50}%` }} className={`h-full ${rating === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">Server Edge</span>
                      <span>Target: &le; 800ms</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Web Vitals by Page Matrix Table */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Route-by-Route Core Web Vitals Matrix
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {data.webVitals?.pages?.length ?? 0} Analyzed Routes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Route Path</th>
                    <th className="p-3.5 text-right">Samples</th>
                    <th className="p-3.5 text-right">LCP</th>
                    <th className="p-3.5 text-right">INP</th>
                    <th className="p-3.5 text-right">CLS</th>
                    <th className="p-3.5 text-right">FCP</th>
                    <th className="p-3.5 text-right">TTFB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.webVitals?.pages || data.webVitals.pages.length === 0) ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        No Core Web Vitals records available for the selected time range.
                      </td>
                    </tr>
                  ) : (
                    data.webVitals.pages.map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground">
                          <a href={getMainSiteHref(p.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1.5">
                            <span>{p.pathname}</span>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">{p.count}</td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            !p.lcp ? "text-muted-foreground" :
                            p.lcp <= 2500 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            p.lcp <= 4000 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {p.lcp ? `${(p.lcp / 1000).toFixed(2)}s` : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            !p.inp ? "text-muted-foreground" :
                            p.inp <= 200 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            p.inp <= 500 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {p.inp ? `${p.inp}ms` : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.cls === null || p.cls === undefined ? "text-muted-foreground" :
                            p.cls <= 0.1 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            p.cls <= 0.25 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {p.cls !== null && p.cls !== undefined ? p.cls.toFixed(3) : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">
                          {p.fcp ? `${(p.fcp / 1000).toFixed(2)}s` : "—"}
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">
                          {p.ttfb ? `${p.ttfb}ms` : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hardware & Network Diagnostics Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Network Speeds */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Network Connection Speeds
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.networkTypes || data.hardwareDiagnostics.networkTypes.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No network data recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.networkTypes.map((net, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground uppercase">{net.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{net.count}</span>
                        <span className="text-primary font-bold">{net.percentage}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* GPU Renderers */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Unmasked WebGL GPUs
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.gpus || data.hardwareDiagnostics.gpus.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No GPU profiles recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.gpus.map((gpu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground truncate max-w-[170px]" title={gpu.gpu}>{gpu.gpu}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{gpu.count}</span>
                        <span className="text-primary font-bold">{gpu.percentage}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CPU Cores */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                CPU Core Architecture
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.cpuCores || data.hardwareDiagnostics.cpuCores.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No CPU cores recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.cpuCores.map((cpu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground">{cpu.cores}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{cpu.count}</span>
                        <span className="text-primary font-bold">{cpu.percentage}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: LAB INTELLIGENCE & LEARNING FUNNEL ─── */}
      {activeTab === "labs" && data && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <span>Interactive STEM Lab Intelligence &amp; Learning Funnel</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Granular simulation telemetry tracking experiment starts, parameter adjustments, step progressions, and completion rates
                </p>
              </div>
            </div>
          </div>

          {/* 5 Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Lab Starts</span>
              <span className="text-2xl font-black text-foreground">{data.labIntelligence?.overview.totalStarts.toLocaleString() ?? 0}</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Initiated simulations</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Completions</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data.labIntelligence?.overview.totalCompletions.toLocaleString() ?? 0}</span>
              <span className="text-[10px] text-muted-foreground font-mono block">XP-awarded finishes</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Completion Rate</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{data.labIntelligence?.overview.completionRate ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Overall learning success</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Parameter Tweaks</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{data.labIntelligence?.overview.totalParameterTweaks.toLocaleString() ?? 0}</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Interactive control edits</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Quiz Attempts</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{data.labIntelligence?.overview.totalQuizAttempts.toLocaleString() ?? 0}</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Knowledge checks</span>
            </div>
          </div>

          {/* Interactive Learning Funnel Visualizer */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Universal Student Learning Progression Funnel
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Stage 1: Session Start</span>
                <span className="text-xl font-black text-foreground block">{data.labIntelligence?.overview.totalStarts ?? 0}</span>
                <div className="h-1.5 w-full bg-primary rounded-full" />
                <span className="text-[10px] text-muted-foreground block">100% Entry baseline</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Stage 2: Active Tweaks</span>
                <span className="text-xl font-black text-purple-600 dark:text-purple-400 block">{data.labIntelligence?.overview.totalParameterTweaks ?? 0}</span>
                <div className="h-1.5 w-full bg-purple-500 rounded-full" />
                <span className="text-[10px] text-muted-foreground block">Control interactions</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Stage 3: Quiz Attempts</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 block">{data.labIntelligence?.overview.totalQuizAttempts ?? 0}</span>
                <div className="h-1.5 w-full bg-amber-500 rounded-full" />
                <span className="text-[10px] text-muted-foreground block">Assessment checks</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Stage 4: Experiment Finished</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">{data.labIntelligence?.overview.totalCompletions ?? 0}</span>
                <div className="h-1.5 w-full bg-emerald-500 rounded-full" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{data.labIntelligence?.overview.completionRate ?? 0}% Conversion</span>
              </div>
            </div>
          </div>

          {/* Per-Lab Detailed Telemetry Table */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Discipline &amp; Individual Lab Performance Table
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {data.labIntelligence?.labs?.length ?? 0} Active Labs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Lab Identifier</th>
                    <th className="p-3.5 text-right">Starts</th>
                    <th className="p-3.5 text-right">Completions</th>
                    <th className="p-3.5 text-right">Success Rate</th>
                    <th className="p-3.5 text-right">Param Tweaks</th>
                    <th className="p-3.5 text-right">Step Progress</th>
                    <th className="p-3.5 text-right">Quizzes</th>
                    <th className="p-3.5 text-right">Resets</th>
                    <th className="p-3.5 text-right">Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.labIntelligence?.labs || data.labIntelligence.labs.length === 0) ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        No interactive lab telemetry recorded yet in this timeframe. Run experiments in virtual labs to populate!
                      </td>
                    </tr>
                  ) : (
                    data.labIntelligence.labs.map((lab, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground">
                          <a href={getMainSiteHref(`/labs/${lab.labId}`)} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1.5">
                            <span>{lab.labId}</span>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-bold text-foreground">{lab.starts}</td>
                        <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{lab.completes}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-bold">{lab.completionRate}%</span>
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, lab.completionRate)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-right text-purple-600 dark:text-purple-400 font-bold">{lab.parameterTweaks}</td>
                        <td className="p-3.5 text-right text-muted-foreground">{lab.stepProgressions}</td>
                        <td className="p-3.5 text-right text-amber-600 dark:text-amber-400">{lab.quizAttempts}</td>
                        <td className="p-3.5 text-right text-muted-foreground">{lab.resets}</td>
                        <td className="p-3.5 text-right font-black text-foreground">{lab.uniqueStudents}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: BEHAVIORAL UX SIGNALS & FRUSTRATION RADAR ─── */}
      {activeTab === "ux" && data && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Flame size={18} className="text-amber-500" />
                  <span>Behavioral UX Signals &amp; Frustration Radar</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automated detection of user frustration, rage clicks, bounce rate, and active vs. idle tab dwell times
                </p>
              </div>
            </div>
          </div>

          {/* 4 Key UX Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Bounce Rate</span>
              <span className="text-2xl font-black text-foreground">{data.behavioralSignals?.bounceRate ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Sessions &lt; 10s with 0 scroll</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Exit Intent Rate</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{data.behavioralSignals?.exitIntentRate ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Desktop cursor exited top</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Active Learning Ratio</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {data.behavioralSignals?.activeRatio.activePercentage ?? 100}%
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">Genuine tab interaction time</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Avg Focus Switches</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {data.behavioralSignals?.activeRatio.avgFocusCount ?? 1}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">Tab blur / focus cycles</span>
            </div>
          </div>

          {/* Rage Clicks Radar Table */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Rage Click Radar (Rapid Frustrated Clicks on Frozen / Confusing Elements)
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground font-bold">
                {data.behavioralSignals?.rageClicks?.length ?? 0} Flagged Targets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Element Selector</th>
                    <th className="p-3.5">Affected Page</th>
                    <th className="p-3.5 text-right">Frustration Count</th>
                    <th className="p-3.5">Element Text Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.behavioralSignals?.rageClicks || data.behavioralSignals.rageClicks.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        🎉 Zero rage clicks detected! Students are navigating and interacting without UI frustration.
                      </td>
                    </tr>
                  ) : (
                    data.behavioralSignals.rageClicks.map((r, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">
                          <code>{r.element}</code>
                        </td>
                        <td className="p-3.5">
                          <a href={getMainSiteHref(r.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold text-foreground">
                            {r.pathname}
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">{r.count} &times;</td>
                        <td className="p-3.5 text-muted-foreground font-sans truncate max-w-xs">{r.sampleText || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound External Links */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Top Outbound External Resource Clicks
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {data.behavioralSignals?.outboundClicks?.length ?? 0} External Links
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Target External URL</th>
                    <th className="p-3.5">Label Preview</th>
                    <th className="p-3.5 text-right">Click Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.behavioralSignals?.outboundClicks || data.behavioralSignals.outboundClicks.length === 0) ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        No external outbound clicks recorded in this timeframe.
                      </td>
                    </tr>
                  ) : (
                    data.behavioralSignals.outboundClicks.map((link, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground">
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1.5">
                            <span className="truncate max-w-md">{link.href}</span>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-sans truncate max-w-xs">{link.sampleText || "—"}</td>
                        <td className="p-3.5 text-right font-black text-foreground">{link.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: USER JOURNEYS & PATH FLOWS ─── */}
      {activeTab === "journeys" && data && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Share2 size={18} className="text-blue-500" />
                  <span>User Journeys &amp; Path Flows</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Analyze where student journeys begin (Entry Landing Pages) and where they abandon or conclude (Exit Drop-off Pages)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Entry Pages */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Entry Pages (Session Starters)
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {data.userJourneys?.entryPages?.length ?? 0} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5">Entry Route</th>
                      <th className="p-3.5 text-right">Sessions</th>
                      <th className="p-3.5 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(!data.userJourneys?.entryPages || data.userJourneys.entryPages.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                          No entry path data available.
                        </td>
                      </tr>
                    ) : (
                      data.userJourneys.entryPages.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3.5 font-bold text-foreground">
                            <a href={getMainSiteHref(entry.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              {entry.pathname}
                            </a>
                          </td>
                          <td className="p-3.5 text-right font-black text-foreground">{entry.count}</td>
                          <td className="p-3.5 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              {entry.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Exit Pages */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Exit Pages (Drop-off Points)
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {data.userJourneys?.exitPages?.length ?? 0} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5">Exit Route</th>
                      <th className="p-3.5 text-right">Drop-offs</th>
                      <th className="p-3.5 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(!data.userJourneys?.exitPages || data.userJourneys.exitPages.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                          No exit path data available.
                        </td>
                      </tr>
                    ) : (
                      data.userJourneys.exitPages.map((exit, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3.5 font-bold text-foreground">
                            <a href={getMainSiteHref(exit.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              {exit.pathname}
                            </a>
                          </td>
                          <td className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">{exit.count}</td>
                          <td className="p-3.5 text-right">
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                              {exit.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
                      <a
                        href={getMainSiteHref(page.pathname)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-primary flex items-center gap-1.5 font-mono"
                      >
                        <span>{page.pathname}</span>
                        <ExternalLink size={11} className="text-muted-foreground" />
                      </a>
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

      {/* ─── TAB 5: DWELL, SCROLL & RETENTION ENGAGEMENT ─── */}
      {activeTab === "engagement" && data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Visitor Loyalty & Visit Frequency */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Visitor Retention &amp; Loyalty
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  {data.retention?.returnRate ?? data.overview.returnRate ?? 0}% Return Rate
                </span>
              </div>

              {/* New vs Returning Split Bar */}
              <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={12} /> New ({data.retention?.newVisitors ?? data.overview.newVisitors ?? 0})
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Repeat size={12} /> Returning ({data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(data.retention?.totalVisitors || 1) > 0
                          ? Math.round(
                            ((data.retention?.newVisitors ?? data.overview.newVisitors ?? 0) /
                              ((data.retention?.totalVisitors ?? data.overview.uniqueVisitors) || 1)) *
                            100
                          )
                          : 50
                        }%`,
                    }}
                    className="h-full bg-emerald-500"
                    title="New visitors"
                  />
                  <div
                    style={{
                      width: `${(data.retention?.totalVisitors || 1) > 0
                          ? Math.round(
                            ((data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0) /
                              ((data.retention?.totalVisitors ?? data.overview.uniqueVisitors) || 1)) *
                            100
                          )
                          : 50
                        }%`,
                    }}
                    className="h-full bg-blue-500"
                    title="Returning visitors"
                  />
                </div>
              </div>

              {/* Frequency Milestones */}
              <div className="space-y-3 pt-1">
                {(data.retention?.frequency || []).map((tier, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-foreground">{tier.label}</span>
                      <span className="text-muted-foreground font-mono">
                        {tier.count} visitors ({tier.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tier.percentage}%` }}
                        className={`h-full rounded-full ${idx === 0
                            ? "bg-emerald-500"
                            : idx === 1
                              ? "bg-blue-500"
                              : idx === 2
                                ? "bg-indigo-500"
                                : "bg-purple-500"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dwell Time Distribution */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Time on Page (Dwell Time)
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
                        <div style={{ width: `${pct}%` }} className="h-full bg-teal-500 rounded-full" />
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
                        <a
                          href={getMainSiteHref(evt.pathname)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                        >
                          <span>{evt.pathname}</span>
                          <ExternalLink size={10} />
                        </a>
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
        <div className="space-y-5">
          {/* Header Strip & Export Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Bug className="text-rose-500" size={20} />
                  <span>Error Diagnostics & AI Triage Engine</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold">
                  {errorCounts.active} Active / {errorCounts.total} Total
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Export error traces, copy AI fix prompts with stack traces, and triage anomalies across all lab routes.
              </p>
            </div>

            {/* Action Buttons: Copy All, Export Menu, Bulk Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy All AI Prompts Button */}
              <button
                type="button"
                onClick={() => handleCopyAllAiPrompts(filteredErrors)}
                disabled={filteredErrors.length === 0}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 ${copiedAllErrors
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                title="Copy all currently filtered errors as an actionable prompt for AI agents (Antigravity, Cursor, Claude Code)"
              >
                {copiedAllErrors ? <Check size={14} /> : <Bot size={14} />}
                <span>{copiedAllErrors ? "Copied All AI Prompts! 📋" : `Copy AI Fix Prompts (${filteredErrors.length})`}</span>
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportDropdown(!showExportDropdown);
                    setShowBulkActionDropdown(false);
                  }}
                  disabled={filteredErrors.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-xs cursor-pointer disabled:opacity-50"
                  title="Export error diagnostics"
                >
                  <Download size={14} />
                  <span>Export ({filteredErrors.length})</span>
                  <ChevronDown size={12} className={showExportDropdown ? "rotate-180 transition" : "transition"} />
                </button>

                {showExportDropdown && (
                  <div className="absolute right-0 top-full mt-2 z-50 p-2 bg-card border border-border rounded-2xl shadow-2xl w-64 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                      Choose Export Format
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExportErrors("markdown", filteredErrors)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                    >
                      <FileText size={14} className="text-primary shrink-0" />
                      <div>
                        <div className="font-black">AI Debug Report (.md)</div>
                        <div className="text-[10px] text-muted-foreground font-normal">Formatted markdown with AI fix prompts</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportErrors("json", filteredErrors)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                    >
                      <FileJson size={14} className="text-amber-500 shrink-0" />
                      <div>
                        <div className="font-black">Raw JSON Dump (.json)</div>
                        <div className="text-[10px] text-muted-foreground font-normal">Complete telemetry dataset</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportErrors("csv", filteredErrors)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                    >
                      <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-black">Spreadsheet Table (.csv)</div>
                        <div className="text-[10px] text-muted-foreground font-normal">Excel and Google Sheets compatible</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Actions Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkActionDropdown(!showBulkActionDropdown);
                    setShowExportDropdown(false);
                  }}
                  disabled={errorBulkLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-xs cursor-pointer disabled:opacity-50"
                  title="Bulk error actions"
                >
                  <SlidersHorizontal size={14} />
                  <span>Bulk Actions</span>
                  <ChevronDown size={12} className={showBulkActionDropdown ? "rotate-180 transition" : "transition"} />
                </button>

                {showBulkActionDropdown && (
                  <div className="absolute right-0 top-full mt-2 z-50 p-2 bg-card border border-border rounded-2xl shadow-2xl w-60 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                      Status Management
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleBulkUpdateErrors(
                          "resolved",
                          filteredErrors.map((e) => e._id)
                        )
                      }
                      disabled={filteredErrors.length === 0}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer disabled:opacity-50"
                    >
                      <CheckCheck size={14} className="text-emerald-500 shrink-0" />
                      <span>Mark Filtered ({filteredErrors.length}) as Resolved</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBulkUpdateErrors(
                          "investigating",
                          filteredErrors.map((e) => e._id)
                        )
                      }
                      disabled={filteredErrors.length === 0}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer disabled:opacity-50"
                    >
                      <Wrench size={14} className="text-amber-500 shrink-0" />
                      <span>Mark Filtered as Investigating</span>
                    </button>

                    {isAdmin && (
                      <>
                        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-rose-500 border-t border-border mt-1 pt-1.5">
                          Admin Purge Tools
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBulkPurgeErrors("resolved")}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          <span>Purge Resolved ({errorCounts.resolved})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBulkPurgeErrors("all")}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          <span>Purge All ({errorCounts.total}) Records</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter Bar: Status Pills, Type Select & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card/60 border border-border/80 rounded-2xl p-3.5 shadow-2xs">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {[
                { id: "all", label: "All", count: errorCounts.total },
                { id: "active", label: "Active", count: errorCounts.active },
                { id: "new", label: "New", count: errorCounts.new },
                { id: "investigating", label: "Investigating", count: errorCounts.investigating },
                { id: "resolved", label: "Resolved", count: errorCounts.resolved },
                { id: "ignored", label: "Ignored", count: errorCounts.ignored },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setErrorStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${errorStatusFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${errorStatusFilter === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-card text-muted-foreground"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Error Type Selector & Search Input */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Type Select */}
              <select
                value={errorTypeFilter}
                onChange={(e) => setErrorTypeFilter(e.target.value)}
                aria-label="Filter error logs by type"
                className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary shadow-2xs cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
              >
                <option value="all">All Error Types</option>
                <option value="not_found">404 Not Found</option>
                <option value="runtime">Runtime Exception</option>
                <option value="boundary">React Boundary</option>
                <option value="http_5xx">Server 5xx</option>
                <option value="http_4xx">Client 4xx</option>
                <option value="api">API Endpoint</option>
                <option value="hydration">Hydration Mismatch</option>
                <option value="console">Console Error</option>
                <option value="unhandledrejection">Unhandled Promise</option>
                <option value="network">Network Failure</option>
                <option value="resource">Resource Load</option>
                <option value="webgl">WebGL / Shader</option>
              </select>

              {/* Search Box */}
              <div className="relative flex-grow sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={errorSearchQuery}
                  onChange={(e) => setErrorSearchQuery(e.target.value)}
                  placeholder="Search error, path, stack..."
                  className="w-full pl-8 pr-8 py-1.5 bg-card border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs"
                />
                {errorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setErrorSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List of Error Cards */}
          <div className="space-y-3.5">
            {filteredErrors.length === 0 ? (
              <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                  🎉
                </div>
                <h4 className="text-sm font-bold text-foreground">No Runtime Errors Found</h4>
                <p className="text-xs text-muted-foreground">
                  {errorSearchQuery || errorStatusFilter !== "all" || errorTypeFilter !== "all"
                    ? "No error traces matched your current filter criteria."
                    : "Your application is running smoothly with zero tracked exceptions!"}
                </p>
              </div>
            ) : (
              paginatedErrors.map((err) => (
                <div
                  key={err._id}
                  className={`p-4 sm:p-5 bg-card border rounded-3xl space-y-3.5 shadow-sm transition-all ${err.status === "new"
                      ? "border-rose-500/40 bg-rose-500/[0.02]"
                      : err.status === "investigating"
                        ? "border-amber-500/30 bg-amber-500/[0.01]"
                        : "border-border"
                    }`}
                >
                  {/* Top: Error Message & Action Buttons */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 border-b border-border pb-3.5">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded font-black font-mono text-[10px] uppercase border ${err.errorType === "not_found"
                              ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20"
                              : err.errorType === "http_4xx"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : err.errorType === "http_5xx" || err.errorType === "boundary"
                                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                  : err.errorType === "api"
                                    ? "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20"
                                    : err.errorType === "resource"
                                      ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                                      : err.errorType === "webgl"
                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : err.errorType === "hydration" || err.errorType === "console"
                                          ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                                          : err.errorType === "unhandledrejection"
                                            ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                                            : err.errorType === "network"
                                              ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20"
                                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                        >
                          {err.errorType === "not_found"
                            ? "404 Not Found"
                            : err.errorType === "http_4xx"
                              ? "HTTP 4xx (Client)"
                              : err.errorType === "http_5xx"
                                ? "HTTP 5xx (Server)"
                                : err.errorType || "runtime"}
                        </span>

                        <span className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground font-bold">
                          {err.occurrences} {err.occurrences === 1 ? "occurrence" : "occurrences"}
                        </span>

                        <a
                          href={getMainSiteHref(err.pathname)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition"
                        >
                          <span>{err.pathname}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>

                      <h4 className="font-bold text-foreground text-sm leading-snug font-mono break-words">
                        {err.message}
                      </h4>
                    </div>

                    {/* Action Tools: Copy AI Fix Prompt & Status Switcher */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* One-Click Copy AI Fix Prompt */}
                      <button
                        type="button"
                        onClick={() => handleCopyAiPrompt(err)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-2xs cursor-pointer ${copiedErrorId === err._id
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-card border-border hover:border-primary text-foreground hover:bg-muted"
                          }`}
                        title="Copy diagnostic prompt to fix this error with AI"
                      >
                        {copiedErrorId === err._id ? <Check size={13} /> : <Bot size={13} className="text-primary" />}
                        <span>{copiedErrorId === err._id ? "Copied Prompt! 📋" : "Copy AI Fix Prompt"}</span>
                      </button>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "new")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "new"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          New
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "investigating")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "investigating"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Investigating
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "resolved")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "resolved"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Resolved
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "ignored")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "ignored"
                              ? "bg-slate-700 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Ignore
                        </button>
                      </div>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteError(err._id)}
                          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Error Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device, Environment & Timestamp Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>
                        {err.os || "Unknown OS"} &bull; {err.browser || "Unknown Browser"} ({err.device || "desktop"})
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

                  {/* Stack Trace Collapsible View */}
                  {err.stack && (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedErrorId(expandedErrorId === err._id ? null : err._id)
                        }
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Code2 size={12} />
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
                        <div className="relative">
                          <pre className="p-3.5 bg-black/95 text-rose-400 text-[10px] font-mono rounded-2xl overflow-x-auto border border-rose-500/20 leading-relaxed whitespace-pre-wrap">
                            {err.stack}
                          </pre>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(err.stack || "");
                              } catch { }
                            }}
                            className="absolute top-2.5 right-2.5 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[9px] font-bold font-mono transition"
                            title="Copy stack trace only"
                          >
                            Copy Trace
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ── Error Diagnostics Pagination Navigation Bar ── */}
          {filteredErrors.length > 0 && (
            <div className="p-4 bg-card border border-border rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                <span>
                  Showing <strong className="text-foreground">{Math.min((errorPage - 1) * errorPageSize + 1, filteredErrors.length)}</strong>–<strong className="text-foreground">{Math.min(errorPage * errorPageSize, filteredErrors.length)}</strong> of <strong className="text-foreground">{filteredErrors.length}</strong> {filteredErrors.length === 1 ? "error" : "errors"} (Page <strong className="text-foreground">{errorPage}</strong> of <strong className="text-foreground">{totalErrorPages}</strong>)
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-border">
                  <span className="text-[11px]">Per page:</span>
                  <select
                    value={errorPageSize}
                    onChange={(e) => {
                      setErrorPageSize(Number(e.target.value));
                      setErrorPage(1);
                    }}
                    aria-label="Errors per page"
                    className="px-2 py-1 bg-muted border border-border rounded-lg text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage(1)}
                  disabled={errorPage <= 1}
                  className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>

                {/* Prev Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage((p) => Math.max(1, p - 1))}
                  disabled={errorPage <= 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                {/* Numbered Pills */}
                <div className="hidden sm:flex items-center gap-1">
                  {getErrorPageNumbers().map((num, idx) =>
                    typeof num === "number" ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setErrorPage(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${errorPage === num
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-card border border-border hover:bg-muted text-foreground"
                          }`}
                      >
                        {num}
                      </button>
                    ) : (
                      <span key={idx} className="px-1 text-muted-foreground text-xs">
                        {num}
                      </span>
                    )
                  )}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage((p) => Math.min(totalErrorPages, p + 1))}
                  disabled={errorPage >= totalErrorPages}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage(totalErrorPages)}
                  disabled={errorPage >= totalErrorPages}
                  className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>

                {/* Jump to Page form */}
                {totalErrorPages > 1 && (
                  <form onSubmit={handleJumpErrorPage} className="hidden md:flex items-center gap-1 pl-2 border-l border-border">
                    <input
                      type="number"
                      min={1}
                      max={totalErrorPages}
                      value={errorJumpPageInput}
                      onChange={(e) => setErrorJumpPageInput(e.target.value)}
                      placeholder="#"
                      className="w-12 px-2 py-1 bg-card border border-border rounded-lg text-xs text-center font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={!errorJumpPageInput}
                      className="px-2 py-1 bg-muted hover:bg-accent border border-border text-foreground rounded-lg text-xs font-bold disabled:opacity-40 transition cursor-pointer"
                    >
                      Go
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
