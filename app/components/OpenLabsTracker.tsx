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
  const pathname = usePathname();

  // Do not track analytics or errors in development mode, localhost, or Admin Panel
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      host.startsWith("admin.") ||
      window.location.port !== ""
    ) {
      return null;
    }
  }

  if (pathname?.startsWith("/admin") || pathname === "/403") {
    return null;
  }

  // State refs for active pageview
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const pageViewIdRef = useRef<string | null>(null);

  // 1. Comprehensive 360-Degree Error Capture Engine
  useEffect(() => {
    // A. Window Error Listener (with capture: true to catch both JS errors & resource loading failures)
    const handleGlobalError = (event: Event | ErrorEvent) => {
      // Catch resource loading errors (img, script, audio, video, link)
      if (event.target && event.target !== window && (event.target as HTMLElement).tagName) {
        const el = event.target as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        const src = (el as any).src || (el as any).href || (el as any).currentSrc || "";

        if (src) {
          trackError(`Resource Load Failed: <${tagName}> ${src}`, {
            errorType: "resource",
            extra: {
              tagName,
              url: src,
              pathname: window.location.pathname,
            },
          });
        }
        return;
      }

      // Catch JS runtime errors
      const errEvent = event as ErrorEvent;
      const message = errEvent.message || "Uncaught runtime error";
      if (message.includes("Script error") && !errEvent.filename) return;

      trackError(errEvent.error || message, {
        errorType: "runtime",
        extra: {
          filename: errEvent.filename,
          lineno: errEvent.lineno,
          colno: errEvent.colno,
        },
      });
    };

    // B. Unhandled Promise Rejections (e.g. failed async/await, dynamic import failure)
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

    // C. WebGL / Canvas Context Loss (3D simulations, periodic table, molecular models)
    const handleWebGLContextLost = (event: Event) => {
      trackError("WebGL context lost on simulation canvas", {
        errorType: "webgl",
        extra: {
          target: (event.target as HTMLElement)?.id || "canvas",
          pathname: window.location.pathname,
        },
      });
    };

    // D. Fetch & API Failure Interceptor (monitors internal /api calls for 400-series and 500-series errors)
    const originalFetch = window.fetch;
    const monitoredFetch: typeof window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || "";

        // Only monitor internal /api/ routes (ignore analytics beacons to prevent infinite loops)
        if (url.includes("/api/") && !url.includes("/api/analytics/")) {
          if (response.status >= 500) {
            // 500-series server error (500 Internal Server Error, 502 Bad Gateway, 503, 504)
            trackError(`HTTP ${response.status} Server Error: ${response.statusText || "Server Fault"} (${url})`, {
              errorType: "http_5xx",
              extra: {
                status: response.status,
                statusText: response.statusText,
                url,
                pathname: window.location.pathname,
              },
            });
          } else if (response.status >= 400) {
            // 400-series client/API error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422, 429)
            trackError(`HTTP ${response.status} Client/API Error: ${response.statusText || "Request Failed"} (${url})`, {
              errorType: "http_4xx",
              extra: {
                status: response.status,
                statusText: response.statusText,
                url,
                pathname: window.location.pathname,
              },
            });
          }
        }
        return response;
      } catch (err: any) {
        const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || "";
        if (url.includes("/api/") && !url.includes("/api/analytics/")) {
          trackError(err || `Network Fetch Failure: ${url}`, {
            errorType: "network",
            extra: {
              url,
              pathname: window.location.pathname,
            },
          });
        }
        throw err;
      }
    };
    window.fetch = monitoredFetch;

    // E. Console Error Interception (catches hydration mismatches & uncaught library console errors)
    const originalConsoleError = console.error;
    const loggedConsoleErrors = new Set<string>();
    console.error = (...args: any[]) => {
      originalConsoleError.apply(console, args);

      try {
        const firstArg = args[0];
        const msg =
          typeof firstArg === "string"
            ? firstArg
            : firstArg?.message || (args.map((a) => String(a)).join(" "));

        if (
          msg &&
          !loggedConsoleErrors.has(msg) &&
          (msg.includes("Hydration") ||
            msg.includes("hydrating") ||
            msg.includes("Uncaught") ||
            msg.includes("Error:") ||
            msg.includes("failed"))
        ) {
          loggedConsoleErrors.add(msg);
          const isHydration = msg.toLowerCase().includes("hydrat");

          trackError(msg.slice(0, 500), {
            errorType: isHydration ? "hydration" : "console",
            extra: {
              fullLog: args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ").slice(0, 1000),
            },
          });
        }
      } catch {}
    };

    window.addEventListener("error", handleGlobalError, { capture: true });
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    document.addEventListener("webglcontextlost", handleWebGLContextLost, { capture: true });

    return () => {
      window.fetch = originalFetch;
      console.error = originalConsoleError;
      window.removeEventListener("error", handleGlobalError, { capture: true });
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      document.removeEventListener("webglcontextlost", handleWebGLContextLost, { capture: true });
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
    const rawReferrer = typeof document !== "undefined" ? document.referrer : "";
    let effectiveReferrer = rawReferrer;

    // Resolve true acquisition referrer across Google OAuth redirects & internal navigation
    if (typeof window !== "undefined") {
      try {
        if (rawReferrer) {
          const refUrl = new URL(rawReferrer);
          const refHost = refUrl.hostname.replace(/^www\./, "").toLowerCase();
          const isAuthOrInternal =
            refHost === "accounts.google.com" ||
            refHost.endsWith(".google.com") ||
            refHost === "appleid.apple.com" ||
            refHost === "openlabs.org.in" ||
            refHost.endsWith(".openlabs.org.in") ||
            refHost === "localhost" ||
            refHost === "127.0.0.1";

          if (isAuthOrInternal) {
            effectiveReferrer =
              sessionStorage.getItem("openlabs_acquisition_referrer") || "";
          } else {
            sessionStorage.setItem("openlabs_acquisition_referrer", rawReferrer);
          }
        } else {
          effectiveReferrer =
            sessionStorage.getItem("openlabs_acquisition_referrer") || "";
        }
      } catch {}
    }

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
      referrer: effectiveReferrer,
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
