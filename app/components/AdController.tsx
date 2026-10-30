"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  isAdExcludedRoute,
  isAdminContext,
  GOOGLE_ADSENSE_CLIENT_ID,
  ADSTERRA_POPUNDER_SRC,
  AD_HOST_PATTERNS,
} from "@/app/lib/ads";

export interface AdStatusState {
  allowed: boolean;
  globalAdsEnabled: boolean;
  isSnoozed: boolean;
  snoozeUntil: string | null;
  snoozeReason: string;
  remainingMs: number;
  networks: {
    googleAdSense: boolean;
    adsterraPopunder: boolean;
    adsterraBanners: boolean;
  };
  loaded: boolean;
}

const defaultAdStatus: AdStatusState = {
  allowed: true,
  globalAdsEnabled: true,
  isSnoozed: false,
  snoozeUntil: null,
  snoozeReason: "",
  remainingMs: 0,
  networks: {
    googleAdSense: true,
    adsterraPopunder: true,
    adsterraBanners: true,
  },
  loaded: false,
};

const AdContext = createContext<AdStatusState>(defaultAdStatus);

export function useAdSettings(): AdStatusState {
  return useContext(AdContext);
}

/**
 * Sweeps and removes any ad elements, iframes, click-traps, or overlays from the DOM.
 */
export function purgeAllAdElements(): void {
  if (typeof document === "undefined") return;
  const selectors = [
    ".google-auto-placed",
    "ins.adsbygoogle",
    "iframe[id^='aswift_']",
    "#google_esf",
    "[id^='google_ads_iframe']",
    ".adsbygoogle-noablate",
    "iframe[src*='disregardpervertmural']",
    "a[href*='disregardpervertmural']",
    "div[id*='disregardpervertmural']",
    "iframe[src*='portalfluently']",
    "a[href*='portalfluently']",
    "div[id*='portalfluently']",
    "iframe[src*='bauval.org']",
    "a[href*='bauval.org']",
    "div[id*='bauval']",
    "iframe[src*='abscloud.org']",
    "a[href*='abscloud.org']",
    "div[id*='abscloud']",
    "iframe[src*='araplhn.org']",
    "a[href*='araplhn.org']",
    "div[id*='container-8eb9029bb810ce5acaa5919fc62e556a']",
    "[data-adsterra]",
  ];

  try {
    const nodes = document.querySelectorAll(selectors.join(", "));
    nodes.forEach((node) => {
      try {
        node.remove();
      } catch {
        // Ignored if already removed
      }
    });
  } catch {
    // Selector syntax error fallback
  }
}

/**
 * Removes dynamically injected ad scripts from <head>.
 */
export function removeAdScripts(): void {
  if (typeof document === "undefined") return;
  const scriptSelectors = [
    "#ol-adsense-script",
    "#ol-adsterra-popunder",
    "script[src*='pagead2.googlesyndication.com']",
    "script[src*='abscloud.org']",
    "script[src*='bauval.org']",
    "script[src*='araplhn.org']",
  ];
  try {
    const scripts = document.querySelectorAll(scriptSelectors.join(", "));
    scripts.forEach((s) => {
      try {
        s.remove();
      } catch {}
    });
  } catch {}
}

/**
 * AdController Component.
 * 
 * Central governor for all advertising across OpenLabs:
 * 1. Guarantees 0 ADS on Admin Panel (/admin/*, admin.* subdomain, /403) and Labs (/labs/*).
 * 2. Fetches dynamic ad settings from /api/ads/status to respect Admin Panel master switch and timed snooze periods.
 * 3. Dynamically injects and cleans up third-party ad tags without rendering them statically in <head>.
 * 4. Intercepts unwanted window.open calls to ad networks when in protected modes.
 */
export default function AdController({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [adStatus, setAdStatus] = useState<AdStatusState>(defaultAdStatus);
  const originalWindowOpenRef = useRef<typeof window.open | null>(null);

  const isExcluded = isAdExcludedRoute(pathname);
  const isAdmin = isAdminContext(pathname);
  const isLab = Boolean(pathname === "/labs" || pathname?.startsWith("/labs/"));

  // Fetch live ad status from public endpoint
  const fetchStatus = useCallback(async () => {
    // If we're strictly on an admin route, no need to query public ad states to render ads
    if (isAdmin) {
      setAdStatus((prev) => ({ ...prev, allowed: false, loaded: true }));
      return;
    }

    try {
      const res = await fetch("/api/ads/status", {
        headers: { "Cache-Control": "max-age=5" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAdStatus({
        allowed: Boolean(data.allowed),
        globalAdsEnabled: Boolean(data.globalAdsEnabled),
        isSnoozed: Boolean(data.isSnoozed),
        snoozeUntil: data.snoozeUntil || null,
        snoozeReason: data.snoozeReason || "",
        remainingMs: typeof data.remainingMs === "number" ? data.remainingMs : 0,
        networks: {
          googleAdSense: Boolean(data.networks?.googleAdSense),
          adsterraPopunder: Boolean(data.networks?.adsterraPopunder),
          adsterraBanners: Boolean(data.networks?.adsterraBanners),
        },
        loaded: true,
      });
    } catch {
      // Keep previous or default
      setAdStatus((prev) => ({ ...prev, loaded: true }));
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchStatus();
    // Re-verify status every 30 seconds so admin pause/resume takes effect immediately
    const timer = setInterval(fetchStatus, 30000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  // Window.open interceptor to prevent ad click-traps in protected contexts
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!originalWindowOpenRef.current) {
      originalWindowOpenRef.current = window.open;
    }

    const shouldBlockPopunders = isExcluded || !adStatus.allowed || !adStatus.networks.adsterraPopunder;

    if (shouldBlockPopunders) {
      window.open = function (url?: string | URL, target?: string, features?: string) {
        const urlStr = typeof url === "string" ? url : url?.toString() || "";
        const lowerUrl = urlStr.toLowerCase();
        const isAdUrl = AD_HOST_PATTERNS.some((pattern) => lowerUrl.includes(pattern));

        if (isAdUrl) {
          // Block popunder
          return null;
        }

        if (originalWindowOpenRef.current) {
          return originalWindowOpenRef.current.call(window, url, target, features);
        }
        return null;
      };
    } else if (originalWindowOpenRef.current) {
      window.open = originalWindowOpenRef.current;
    }

    return () => {
      if (originalWindowOpenRef.current) {
        window.open = originalWindowOpenRef.current;
      }
    };
  }, [isExcluded, adStatus]);

  // Active Route & Protection Observer
  useEffect(() => {
    if (typeof document === "undefined") return;

    const shouldSuppressAds = isExcluded || !adStatus.allowed;

    if (shouldSuppressAds) {
      document.body.setAttribute("data-no-ads", "true");
      if (isAdmin) {
        document.body.setAttribute("data-is-admin", "true");
      } else {
        document.body.removeAttribute("data-is-admin");
      }

      if (isLab) {
        document.body.setAttribute("data-is-lab-page", "true");
      } else {
        document.body.removeAttribute("data-is-lab-page");
      }

      // Remove any injected scripts and elements immediately
      removeAdScripts();
      purgeAllAdElements();

      // MutationObserver to neutralize any background auto-ad injection attempts
      const observer = new MutationObserver(() => {
        purgeAllAdElements();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    } else {
      // Public educational discovery route with ads enabled and NOT snoozed
      document.body.removeAttribute("data-no-ads");
      document.body.removeAttribute("data-is-admin");
      document.body.removeAttribute("data-is-lab-page");

      // Inject Google AdSense tag if enabled
      if (adStatus.networks.googleAdSense && !document.getElementById("ol-adsense-script")) {
        const script = document.createElement("script");
        script.id = "ol-adsense-script";
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      // Inject Adsterra Popunder tag if enabled
      if (adStatus.networks.adsterraPopunder && !document.getElementById("ol-adsterra-popunder")) {
        const script = document.createElement("script");
        script.id = "ol-adsterra-popunder";
        script.setAttribute("data-cfasync", "false");
        script.src = ADSTERRA_POPUNDER_SRC;
        document.head.appendChild(script);
      }
    }
  }, [isExcluded, isAdmin, isLab, adStatus]);

  return <AdContext.Provider value={adStatus}>{children}</AdContext.Provider>;
}
