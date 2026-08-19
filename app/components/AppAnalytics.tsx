"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import OpenLabsTracker from "./OpenLabsTracker";
import ClarityProvider from "@/components/ClarityProvider";
import ClarityTrackerObserver from "@/components/ClarityTrackerObserver";

/**
 * Robust detection of local / non-production environments.
 * Returns true if running on localhost, 127.0.0.1, local ports (e.g. 3000 with yarn start),
 * or non-production NODE_ENV.
 */
function isLocalHost(): boolean {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV !== "production";
  }
  const host = window.location.hostname;
  const port = window.location.port;

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "[::1]" ||
    host.endsWith(".local") ||
    host.includes("localhost") ||
    port === "3000" ||
    port === "5000" ||
    port !== "" // Any non-empty port means a local dev/preview/start server
  );
}

/**
 * Returns true if current route or subdomain is part of the Admin Panel.
 */
function isAdminContext(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const path = window.location.pathname;
  return host.startsWith("admin.") || path.startsWith("/admin") || path === "/403";
}

export default function AppAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only track if running in real production on public student site (never admin panel or localhost)
    if (!isLocalHost() && !isAdminContext() && process.env.NODE_ENV === "production") {
      setEnabled(true);
    }
  }, []);

  if (!enabled || isAdminContext()) {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) - live production only */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-7XW8JGG3BD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7XW8JGG3BD');
        `}
      </Script>

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />

      {/* First-Party Telemetry & Microsoft Clarity */}
      <OpenLabsTracker />
      <ClarityProvider />
      <ClarityTrackerObserver />
    </>
  );
}
