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
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function sendTelemetryBeacon(url: string, data: Record<string, any>) {
  if (typeof window === "undefined") return;
  // Only track telemetry in production
  if (process.env.NODE_ENV !== "production") return;

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
  if (typeof window === "undefined") return;

  let labId = null;
  const path = window.location.pathname;
  if (path.startsWith("/labs/")) {
    labId = path.replace(/^\/labs\//, "").replace(/\/$/, "");
  }

  sendTelemetryBeacon("/api/analytics/collect", {
    type: "event",
    eventName,
    category: properties.category || (labId ? "lab" : "interaction"),
    labId,
    pathname: path,
    properties,
    value,
  });
}

// ── Public Helper: Track Error ─────────────────────────────────────────
export function trackError(
  error: Error | string,
  context: {
    errorType?: "runtime" | "unhandledrejection" | "boundary" | "network" | "api";
    digest?: string;
    componentStack?: string;
    extra?: Record<string, any>;
  } = {}
) {
  if (typeof window === "undefined") return;

  const message = typeof error === "string" ? error : error.message || "Unknown error";
  const stack = typeof error === "string" ? "" : error.stack || "";

  sendTelemetryBeacon("/api/analytics/error", {
    message,
    stack,
    digest: context.digest || null,
    componentStack: context.componentStack || null,
    errorType: context.errorType || "runtime",
    pathname: window.location.pathname,
  });
}
