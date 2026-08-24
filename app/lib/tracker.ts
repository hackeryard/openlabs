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

  const payload = JSON.stringify({
    ...data,
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
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

  if (context.extra && Object.keys(context.extra).length > 0) {
    stack = stack
      ? `${stack}\n\n[Diagnostic Context]\n${JSON.stringify(context.extra, null, 2)}`
      : `[Diagnostic Context]\n${JSON.stringify(context.extra, null, 2)}`;
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
