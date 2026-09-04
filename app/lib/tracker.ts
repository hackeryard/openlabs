"use client";

// ── Visitor & Session ID Helpers ───────────────────────────────────────
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  const key = "openlabs_vid";
  let vid = localStorage.getItem(key);
  if (!vid) {
    vid = crypto.randomUUID?.() || `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, vid);
  }
  return vid;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "openlabs_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export function getVisitorMetadata(): {
  isReturning: boolean;
  visitCount: number;
  daysSinceLastVisit: number | null;
} {
  if (typeof window === "undefined") {
    return { isReturning: false, visitCount: 1, daysSinceLastVisit: null };
  }

  const countKey = "openlabs_vc";
  const lastSeenKey = "openlabs_ls";
  const sessionCheckKey = "openlabs_session_active";

  const rawCount = parseInt(localStorage.getItem(countKey) || "0", 10);
  const lastSeen = parseInt(localStorage.getItem(lastSeenKey) || "0", 10);
  const isCurrentSessionActive = sessionStorage.getItem(sessionCheckKey);

  let visitCount = rawCount;
  let daysSinceLastVisit: number | null = null;

  if (lastSeen > 0) {
    daysSinceLastVisit = Math.floor((Date.now() - lastSeen) / (1000 * 60 * 60 * 24));
  }

  if (!isCurrentSessionActive) {
    // New browsing session starts: increment visit count
    visitCount = rawCount + 1;
    localStorage.setItem(countKey, String(visitCount));
    localStorage.setItem(lastSeenKey, String(Date.now()));
    sessionStorage.setItem(sessionCheckKey, "1");
  }

  const isReturning = visitCount > 1;

  return {
    isReturning,
    visitCount,
    daysSinceLastVisit,
  };
}

// ── Telemetry Ingestion Dispatcher ─────────────────────────────────────
export function isLocalDevelopment(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const port = window.location.port;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      host === "[::1]" ||
      host.includes("localhost") ||
      port === "3000" ||
      port === "5000" ||
      port !== ""
    ) {
      return true;
    }
  }
  return false;
}

export function isProduction(): boolean {
  return !isLocalDevelopment();
}

export function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const path = window.location.pathname;
  return host.startsWith("admin.") || path.startsWith("/admin") || path === "/403";
}

export function sendTelemetryBeacon(url: string, data: Record<string, any>) {
  if (typeof window === "undefined") return;
  // Never track analytics or telemetry in local development or admin panel
  if (isLocalDevelopment() || isAdminRoute()) return;

  const visitorMeta = getVisitorMetadata();

  const payload = JSON.stringify({
    ...data,
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
    isReturning: data.isReturning !== undefined ? data.isReturning : visitorMeta.isReturning,
    visitCount: data.visitCount !== undefined ? data.visitCount : visitorMeta.visitCount,
    timestamp: Date.now(),
  });

  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    } catch {
      // Fall back to fetch keepalive
    }
  }

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Non-blocking
  }
}

// ── User Action Breadcrumbs (Attached to Crash Diagnostics) ───────────
interface Breadcrumb {
  timestamp: number;
  action: string;
  data?: Record<string, any>;
}

const MAX_BREADCRUMBS = 10;
const breadcrumbsQueue: Breadcrumb[] = [];

export function addBreadcrumb(
  action: string | { category?: string; message: string; data?: Record<string, any> },
  data?: Record<string, any>
) {
  if (typeof window === "undefined") return;
  const actionStr = typeof action === "string" ? action : `[${action.category || "ui"}] ${action.message}`;
  const payloadData = typeof action === "object" && action.data ? { ...action.data, ...(data || {}) } : data;

  breadcrumbsQueue.push({
    timestamp: Date.now(),
    action: actionStr,
    data: payloadData,
  });
  if (breadcrumbsQueue.length > MAX_BREADCRUMBS) {
    breadcrumbsQueue.shift();
  }
}

export function getBreadcrumbs(): Breadcrumb[] {
  return [...breadcrumbsQueue];
}

// ── Public Helper: Track Custom Event ──────────────────────────────────
export function trackEvent(
  eventName: string,
  properties: Record<string, any> = {},
  value?: number
) {
  if (typeof window === "undefined" || isLocalDevelopment() || isAdminRoute()) return;

  let labId = properties.labId || null;
  const path = properties.pathname || window.location.pathname;
  if (!labId && path.startsWith("/labs/")) {
    labId = path.replace(/^\/labs\//, "").replace(/\/$/, "");
  }

  const category = properties.category || (labId ? "lab" : "interaction");

  // Create clean copy of properties
  const cleanProperties: Record<string, any> = { ...properties };
  delete cleanProperties.category;
  if (properties.labId) delete cleanProperties.labId;
  if (properties.pathname) delete cleanProperties.pathname;

  addBreadcrumb(`event:${eventName}`, { category, labId, pathname: path });

  sendTelemetryBeacon("/api/analytics/collect", {
    type: "event",
    eventName,
    category,
    labId,
    pathname: path,
    properties: cleanProperties,
    value,
  });
}

// ── Public Helper: Track Core Web Vital ────────────────────────────────
export function trackWebVital(metric: {
  name: "FCP" | "LCP" | "CLS" | "FID" | "INP" | "TTFB";
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
}) {
  if (typeof window === "undefined" || isLocalDevelopment() || isAdminRoute()) return;

  sendTelemetryBeacon("/api/analytics/collect", {
    type: "event",
    eventName: "web_vital",
    category: "performance",
    pathname: window.location.pathname,
    properties: {
      metricName: metric.name,
      metricValue: Math.round(metric.value * 100) / 100,
      rating: metric.rating || (
        metric.name === "LCP" ? (metric.value <= 2500 ? "good" : metric.value <= 4000 ? "needs-improvement" : "poor") :
        metric.name === "CLS" ? (metric.value <= 0.1 ? "good" : metric.value <= 0.25 ? "needs-improvement" : "poor") :
        metric.name === "INP" ? (metric.value <= 200 ? "good" : metric.value <= 500 ? "needs-improvement" : "poor") :
        metric.name === "FCP" ? (metric.value <= 1800 ? "good" : metric.value <= 3000 ? "needs-improvement" : "poor") :
        metric.name === "TTFB" ? (metric.value <= 800 ? "good" : metric.value <= 1800 ? "needs-improvement" : "poor") : "good"
      ),
    },
    value: metric.value,
  });
}

// ── Public Helper: Track STEM Virtual Lab Learning Interaction ─────────
export function trackLabInteraction(
  labId: string,
  action:
    | "start"
    | "reset"
    | "parameter_change"
    | "step_complete"
    | "step_progress"
    | "quiz_attempt"
    | "complete"
    | "fps_drop",
  data: Record<string, any> = {}
) {
  if (typeof window === "undefined" || isLocalDevelopment() || isAdminRoute()) return;

  addBreadcrumb(`lab:${action}`, { labId, ...data });

  trackEvent(`lab_${action}`, {
    category: "lab",
    labId,
    pathname: window.location.pathname,
    ...data,
  });
}

// ── Public Helper: Track UX / Behavioral Signal ────────────────────────
export function trackUxSignal(
  signal: "rage_click" | "dead_click" | "exit_intent" | "outbound_click" | "text_copy" | "internal_search" | "scroll_milestone",
  details: Record<string, any> = {}
) {
  if (typeof window === "undefined" || isLocalDevelopment() || isAdminRoute()) return;

  addBreadcrumb(`ux:${signal}`, details);

  trackEvent(`ux_${signal}`, {
    category: "ux",
    pathname: window.location.pathname,
    ...details,
  });
}

// ── Public Helper: Track Error ─────────────────────────────────────────
export function trackError(
  error: Error | string,
  context: {
    errorType?:
      | "runtime"
      | "unhandledrejection"
      | "boundary"
      | "network"
      | "api"
      | "resource"
      | "webgl"
      | "console"
      | "hydration"
      | "not_found"
      | "http_4xx"
      | "http_5xx";
    digest?: string;
    componentStack?: string;
    extra?: Record<string, any>;
  } = {}
) {
  if (typeof window === "undefined" || isLocalDevelopment() || isAdminRoute()) return;

  const message = typeof error === "string" ? error : error.message || "Unknown error";
  let stack = typeof error === "string" ? "" : error.stack || "";

  const recentBreadcrumbs = getBreadcrumbs();
  const contextPayload: Record<string, any> = {
    ...(context.extra || {}),
    ...(recentBreadcrumbs.length > 0 ? { recentActions: recentBreadcrumbs } : {}),
  };

  if (Object.keys(contextPayload).length > 0) {
    stack = stack
      ? `${stack}\n\n[Diagnostic Context]\n${JSON.stringify(contextPayload, null, 2)}`
      : `[Diagnostic Context]\n${JSON.stringify(contextPayload, null, 2)}`;
  }

  sendTelemetryBeacon("/api/analytics/error", {
    message,
    stack,
    digest: context.digest || null,
    componentStack: context.componentStack || null,
    errorType: context.errorType || "runtime",
    pathname: window.location.pathname,
  });
}
