"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendTelemetryBeacon, trackError, trackWebVital, trackUxSignal, addBreadcrumb } from "@/app/lib/tracker";

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
      hardware: {
        memory: null,
        cores: null,
        gpu: "",
        dpr: 1,
        viewport: "",
        touchPoints: 0,
      },
      network: {
        effectiveType: "",
        downlink: null,
        rtt: null,
        saveData: false,
      },
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

  // Hardware profile & unmasked WebGL GPU renderer extraction
  let gpu = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpu = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }
    }
  } catch {}

  const hardware = {
    memory: (navigator as any).deviceMemory || null,
    cores: navigator.hardwareConcurrency || null,
    gpu: gpu ? gpu.replace(/ANGLE \((.*)\)/, "$1").slice(0, 100) : "",
    dpr: window.devicePixelRatio || 1,
    viewport: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
    touchPoints: navigator.maxTouchPoints || 0,
  };

  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const network = {
    effectiveType: conn?.effectiveType || "",
    downlink: typeof conn?.downlink === "number" ? conn.downlink : null,
    rtt: typeof conn?.rtt === "number" ? conn.rtt : null,
    saveData: Boolean(conn?.saveData),
  };

  return {
    device,
    browser,
    os,
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: navigator.language || "en",
    timezone,
    hardware,
    network,
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

  // State refs for active pageview and RUM
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const pageViewIdRef = useRef<string | null>(null);

  // Core Web Vitals RUM metrics
  const webVitalsRef = useRef<{
    fcp: number | null;
    lcp: number | null;
    cls: number | null;
    inp: number | null;
    ttfb: number | null;
    domLoad: number | null;
    windowLoad: number | null;
  }>({
    fcp: null,
    lcp: null,
    cls: null,
    inp: null,
    ttfb: null,
    domLoad: null,
    windowLoad: null,
  });

  // Active vs. Idle dwell tracking & Focus/Blur
  const activeSecondsRef = useRef<number>(0);
  const idleSecondsRef = useRef<number>(0);
  const focusCountRef = useRef<number>(1);
  const lastActivityRef = useRef<number>(Date.now());
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const hasFiredExitIntentRef = useRef<boolean>(false);
  const recentClicksRef = useRef<{ target: HTMLElement; x: number; y: number; time: number }[]>([]);

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
          const lowerSrc = src.toLowerCase();

          // 1. Next.js ChunkLoadError / Stale Chunk from a new deployment: auto-reload once to recover
          if (tagName === "script" && lowerSrc.includes("/_next/static/chunks/")) {
            try {
              const reloadKey = "openlabs_chunk_reload";
              const lastReload = sessionStorage.getItem(reloadKey);
              if (lastReload !== window.location.href) {
                sessionStorage.setItem(reloadKey, window.location.href);
                window.location.reload();
                return;
              }
            } catch {}
            return;
          }

          // 2. Ignore external 3rd-party adblocker blocks & extension resources
          if (
            lowerSrc.includes("clarity.ms") ||
            lowerSrc.includes("clarity") ||
            lowerSrc.includes("_vercel/insights") ||
            lowerSrc.includes("_vercel/speed-insights") ||
            lowerSrc.includes("vercel-scripts") ||
            lowerSrc.includes("googletagmanager") ||
            lowerSrc.includes("google-analytics") ||
            lowerSrc.includes("doubleclick") ||
            lowerSrc.includes("googleads") ||
            lowerSrc.includes("extension://") ||
            lowerSrc.includes("chrome-extension://") ||
            lowerSrc.includes("moz-extension://") ||
            lowerSrc.includes("safari-extension://")
          ) {
            return;
          }

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

      // Handle ChunkLoadError in runtime window error
      if (message.includes("ChunkLoadError") || message.includes("Loading chunk")) {
        try {
          const reloadKey = "openlabs_chunk_reload";
          const lastReload = sessionStorage.getItem(reloadKey);
          if (lastReload !== window.location.href) {
            sessionStorage.setItem(reloadKey, window.location.href);
            window.location.reload();
            return;
          }
        } catch {}
        return;
      }

      // Ignore benign browser notifications, extension mutations & third party injected scripts
      if (
        message.includes("ResizeObserver loop") ||
        message.includes("removeChild") ||
        message.includes("insertBefore") ||
        message.includes("not a child of this node") ||
        message.includes("MetaMask") ||
        message.includes("metamask") ||
        message.includes("@context") ||
        message.includes("clarity") ||
        message.includes("_vercel") ||
        (errEvent.filename && (
          errEvent.filename.includes("extension://") ||
          errEvent.filename.includes("clarity") ||
          errEvent.filename.includes("_vercel")
        ))
      ) {
        return;
      }

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

      // Auto-reload on unhandled chunk load rejections
      if (message.includes("ChunkLoadError") || message.includes("Loading chunk")) {
        try {
          const reloadKey = "openlabs_chunk_reload";
          const lastReload = sessionStorage.getItem(reloadKey);
          if (lastReload !== window.location.href) {
            sessionStorage.setItem(reloadKey, window.location.href);
            window.location.reload();
            return;
          }
        } catch {}
        return;
      }

      // Ignore benign / extension errors / network aborts
      if (
        message.includes("ResizeObserver loop") ||
        message.includes("AbortError") ||
        message.includes("cancelled") ||
        message.includes("MetaMask") ||
        message.includes("metamask") ||
        message.includes("Failed to connect to MetaMask") ||
        message.includes("clarity") ||
        message.includes("_vercel")
      ) {
        return;
      }

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
          // Normal expected client state checks:
          // /api/auth/me returning 401 (guest) or 403 (unverified email) is normal status response
          if (url.includes("/api/auth/me") && (response.status === 401 || response.status === 403)) {
            return response;
          }

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
        const isAbort = err?.name === "AbortError" || String(err).includes("aborted");
        const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
        const isPageHiding = typeof document !== "undefined" && document.visibilityState === "hidden";
        // /api/auth/me is a non-critical guest/auth probe; network drops shouldn't be logged as server errors
        const isNonCriticalAuth = url.includes("/api/auth/me");

        if (
          url.includes("/api/") &&
          !url.includes("/api/analytics/") &&
          !isAbort &&
          !isOffline &&
          !isPageHiding &&
          !isNonCriticalAuth
        ) {
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
          !msg.includes("ChunkLoadError") &&
          !msg.includes("Loading chunk") &&
          !msg.includes("Failed to fetch challenge") &&
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

  // 2. Real User Monitoring (RUM): Core Web Vitals (FCP, LCP, CLS, INP, TTFB)
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    const vitals = webVitalsRef.current;

    // A. Navigation Timing for TTFB, DOM Load, Window Load
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        if (nav.responseStart > 0) {
          vitals.ttfb = Math.round(nav.responseStart);
        }
        if (nav.domContentLoadedEventEnd > 0) {
          vitals.domLoad = Math.round(nav.domContentLoadedEventEnd);
        }
        if (nav.loadEventEnd > 0) {
          vitals.windowLoad = Math.round(nav.loadEventEnd);
        }
      }
    } catch {}

    // B. First Contentful Paint (FCP)
    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            const val = Math.round(entry.startTime);
            vitals.fcp = val;
            trackWebVital({
              name: "FCP",
              value: val,
              rating: val <= 1800 ? "good" : val <= 3000 ? "needs-improvement" : "poor",
            });
          }
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {}

    // C. Largest Contentful Paint (LCP)
    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const val = Math.round(lastEntry.startTime);
          vitals.lcp = val;
          trackWebVital({
            name: "LCP",
            value: val,
            rating: val <= 2500 ? "good" : val <= 4000 ? "needs-improvement" : "poor",
          });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // D. Cumulative Layout Shift (CLS)
    let clsObserver: PerformanceObserver | null = null;
    let clsValue = 0;
    try {
      clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            vitals.cls = Number(clsValue.toFixed(4));
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // E. Interaction to Next Paint (INP) / First Input Delay fallback
    let inpObserver: PerformanceObserver | null = null;
    try {
      inpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          const duration = Math.round(
            entry.duration || (entry.processingStart ? entry.processingStart - entry.startTime : 0)
          );
          if (duration > (vitals.inp || 0)) {
            vitals.inp = duration;
            trackWebVital({
              name: "INP",
              value: duration,
              rating: duration <= 200 ? "good" : duration <= 500 ? "needs-improvement" : "poor",
            });
          }
        }
      });
      try {
        inpObserver.observe({ type: "first-input", buffered: true });
      } catch {}
    } catch {}

    return () => {
      fcpObserver?.disconnect();
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
      inpObserver?.disconnect();
    };
  }, [pathname]);

  // 3. Active vs. Idle Dwell Tracking & Focus Counters
  useEffect(() => {
    activeSecondsRef.current = 0;
    idleSecondsRef.current = 0;
    focusCountRef.current = 1;
    lastActivityRef.current = Date.now();
    hasFiredExitIntentRef.current = false;
    recentClicksRef.current = [];
    scrollMilestonesRef.current = new Set();

    const markActive = () => {
      lastActivityRef.current = Date.now();
    };

    const handleFocus = () => {
      focusCountRef.current += 1;
      markActive();
    };

    window.addEventListener("pointerdown", markActive, { passive: true });
    window.addEventListener("keydown", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });
    window.addEventListener("scroll", markActive, { passive: true });
    window.addEventListener("focus", handleFocus);

    // 1-second interval ticker for active vs idle time
    const ticker = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const isCurrentlyActive = Date.now() - lastActivityRef.current < 30000;
        if (isCurrentlyActive) {
          activeSecondsRef.current += 1;
        } else {
          idleSecondsRef.current += 1;
        }
      }
    }, 1000);

    return () => {
      clearInterval(ticker);
      window.removeEventListener("pointerdown", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("scroll", markActive);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  // 4. Track Scroll Depth and Milestones (25%, 50%, 75%, 90%, 100%)
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

      // Check milestones
      const milestones = [25, 50, 75, 90, 100];
      for (const m of milestones) {
        if (percent >= m && !scrollMilestonesRef.current.has(m)) {
          scrollMilestonesRef.current.add(m);
          addBreadcrumb({
            category: "scroll",
            message: `Scrolled to ${m}%`,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // 5. Behavioral Signals: Rage Clicks, Outbound Links, Text Copy, Desktop Exit Intent
  useEffect(() => {
    // A. Click handler for Rage Clicks and Outbound Links
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tag = target.tagName.toLowerCase();
      const targetId = target.id ? `#${target.id}` : "";
      const textSample = (target.textContent || "").trim().slice(0, 30);

      addBreadcrumb({
        category: "click",
        message: `<${tag}${targetId}> "${textSample}"`,
      });

      // Outbound external links
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          if (url.origin !== window.location.origin && !anchor.href.startsWith("javascript:")) {
            trackUxSignal("outbound_click", {
              href: anchor.href,
              text: (anchor.textContent || "").trim().slice(0, 50),
              pathname,
            });
          }
        } catch {}
      }

      // Rage Click Detector: >= 3 rapid clicks within 500ms and < 40px radius
      recentClicksRef.current.push({
        target,
        x: e.clientX,
        y: e.clientY,
        time: now,
      });

      recentClicksRef.current = recentClicksRef.current.filter(
        (c) => now - c.time < 1000
      );

      if (recentClicksRef.current.length >= 3) {
        const clicks = recentClicksRef.current;
        const first = clicks[clicks.length - 3];
        const last = clicks[clicks.length - 1];
        const timeDiff = last.time - first.time;
        const dist = Math.hypot(last.x - first.x, last.y - first.y);

        if (timeDiff <= 500 && dist < 40) {
          recentClicksRef.current = []; // Reset after trigger
          const selector = target.id
            ? `#${target.id}`
            : target.className && typeof target.className === "string"
            ? `${tag}.${target.className.split(" ")[0]}`
            : tag;

          trackUxSignal("rage_click", {
            element: selector,
            text: textSample,
            x: Math.round(e.clientX),
            y: Math.round(e.clientY),
            pathname,
          });
        }
      }
    };

    // B. Text Copy Detection
    const handleCopy = () => {
      try {
        const selection = window.getSelection();
        const len = selection ? selection.toString().length : 0;
        if (len > 0) {
          trackUxSignal("text_copy", {
            length: len,
            pathname,
          });
        }
      } catch {}
    };

    // C. Desktop Exit Intent (cursor crossing top viewport boundary)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasFiredExitIntentRef.current) {
        hasFiredExitIntentRef.current = true;
        trackUxSignal("exit_intent", {
          pathname,
          activeDuration: activeSecondsRef.current,
          maxScroll: maxScrollRef.current,
        });
      }
    };

    window.addEventListener("click", handleClick, { capture: true, passive: true });
    document.addEventListener("copy", handleCopy, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [pathname]);

  // 6. Pageview & Enhanced Heartbeat Telemetry Ingestion
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

    // Helper to send final dwell time, active/idle time, and scroll update
    const sendHeartbeatUpdate = () => {
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 1000)
      );

      const isBounce =
        durationSeconds < 10 &&
        maxScrollRef.current < 25 &&
        focusCountRef.current <= 1;

      // Update timing from navigation if not yet populated
      try {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const nav = navEntries[0] as PerformanceNavigationTiming;
          if (!webVitalsRef.current.ttfb && nav.responseStart > 0) {
            webVitalsRef.current.ttfb = Math.round(nav.responseStart);
          }
          if (!webVitalsRef.current.domLoad && nav.domContentLoadedEventEnd > 0) {
            webVitalsRef.current.domLoad = Math.round(nav.domContentLoadedEventEnd);
          }
          if (!webVitalsRef.current.windowLoad && nav.loadEventEnd > 0) {
            webVitalsRef.current.windowLoad = Math.round(nav.loadEventEnd);
          }
        }
      } catch {}

      sendTelemetryBeacon("/api/analytics/collect", {
        type: "heartbeat",
        pageViewId: pageViewIdRef.current,
        pathname,
        duration: durationSeconds,
        activeDuration: activeSecondsRef.current,
        idleDuration: idleSecondsRef.current,
        focusCount: focusCountRef.current,
        scrollDepth: maxScrollRef.current,
        scrollMilestones: Array.from(scrollMilestonesRef.current).sort((a, b) => a - b),
        webVitals: webVitalsRef.current,
        isBounce,
        exitIntent: hasFiredExitIntentRef.current,
      });
    };

    // Send heartbeat periodically (every 25 seconds) while page remains open
    const periodicHeartbeat = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        sendHeartbeatUpdate();
      }
    }, 25000);

    // Send heartbeat when tab is hidden or page is closed
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendHeartbeatUpdate();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendHeartbeatUpdate);

    return () => {
      clearInterval(periodicHeartbeat);
      sendHeartbeatUpdate();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendHeartbeatUpdate);
    };
  }, [pathname]);

  return null;
}
