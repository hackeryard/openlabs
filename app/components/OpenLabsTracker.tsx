"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendTelemetryBeacon, trackError } from "@/app/lib/tracker";

// ── Client Environment Detectors ───────────────────────────────────────
function getClientTech() {
  if (typeof window === "undefined") {
    return {
      device: "desktop",
      browser: "Unknown",
      os: "Unknown",
      screen: "",
      language: "en",
      timezone: "",
    };
  }

  const ua = navigator.userAgent;
  const isMobile = /mobile|android|iphone/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let browser = "Browser";
  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "OS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

  let timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}

  return {
    device,
    browser,
    os,
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: navigator.language || "en",
    timezone,
  };
}

export default function OpenLabsTracker() {
  // Do not track analytics or errors in development mode or localhost
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return null;
    }
  }

  const pathname = usePathname();

  // State refs for active pageview
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const pageViewIdRef = useRef<string | null>(null);

  // 1. Listen for global uncaught errors and unhandled rejections
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Ignore cross-origin script error spam
      if (!event.message || event.message.includes("Script error")) return;

      trackError(event.error || event.message, {
        errorType: "runtime",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || "Unhandled Promise Rejection";

      trackError(reason || message, {
        errorType: "unhandledrejection",
      });
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // 2. Track scroll depth
  useEffect(() => {
    maxScrollRef.current = 0;

    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const scrollTop = h.scrollTop || b.scrollTop;
      const scrollHeight = h.scrollHeight || b.scrollHeight;
      const clientHeight = h.clientHeight;

      if (scrollHeight <= clientHeight) {
        maxScrollRef.current = 100;
        return;
      }

      const percent = Math.min(
        100,
        Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
      );

      if (percent > maxScrollRef.current) {
        maxScrollRef.current = percent;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // 3. Track Pageview and Heartbeat / Dwell time on route change or unload
  useEffect(() => {
    startTimeRef.current = Date.now();
    pageViewIdRef.current = crypto.randomUUID?.() || `pv_${Date.now()}`;

    const tech = getClientTech();
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Parse UTM tags
    let utmSource = null;
    let utmMedium = null;
    let utmCampaign = null;
    if (typeof window !== "undefined" && window.location.search) {
      try {
        const sp = new URLSearchParams(window.location.search);
        utmSource = sp.get("utm_source") || null;
        utmMedium = sp.get("utm_medium") || null;
        utmCampaign = sp.get("utm_campaign") || null;
      } catch {}
    }

    let labId: string | null = null;
    if (pathname?.startsWith("/labs/")) {
      labId = pathname.replace(/^\/labs\//, "").replace(/\/$/, "");
    }

    // A. Send initial pageview event
    sendTelemetryBeacon("/api/analytics/collect", {
      type: "pageview",
      pageViewId: pageViewIdRef.current,
      pathname,
      title: typeof document !== "undefined" ? document.title : "",
      labId,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      ...tech,
    });

    // Helper to send final dwell time and scroll update
    const sendHeartbeatUpdate = () => {
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 1000)
      );

      sendTelemetryBeacon("/api/analytics/collect", {
        type: "heartbeat",
        pageViewId: pageViewIdRef.current,
        pathname,
        duration: durationSeconds,
        scrollDepth: maxScrollRef.current,
      });
    };

    // Send heartbeat when tab is hidden or page is closed
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendHeartbeatUpdate();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendHeartbeatUpdate);

    return () => {
      sendHeartbeatUpdate();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendHeartbeatUpdate);
    };
  }, [pathname]);

  return null;
}
