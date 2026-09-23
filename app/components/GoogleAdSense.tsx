"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-4121707034074280";

/**
 * Returns true if the pathname is an interactive lab route or restricted page.
 */
function isExcludedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  // Exclude all interactive simulation labs under /labs or /labs/*
  if (pathname === "/labs" || pathname.startsWith("/labs/")) return true;
  // Exclude administrative dashboards and access restricted screens
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/403"
  ) {
    return true;
  }
  return false;
}

/**
 * Returns true if accessed via an administrative subdomain.
 */
function isAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.startsWith("admin.") || host.startsWith("admin.localhost");
}

/**
 * Removes any ad elements injected by Google Auto Ads.
 */
function purgeAdElements(): void {
  if (typeof document === "undefined") return;
  const selectors = [
    ".google-auto-placed",
    "ins.adsbygoogle",
    "iframe[id^='aswift_']",
    "#google_esf",
    "[id^='google_ads_iframe']",
    ".adsbygoogle-noablate",
  ];
  const adNodes = document.querySelectorAll(selectors.join(", "));
  adNodes.forEach((node) => {
    try {
      node.remove();
    } catch {
      // Node already removed
    }
  });
}

export default function GoogleAdSense() {
  const pathname = usePathname();
  const isLab = Boolean(pathname === "/labs" || pathname?.startsWith("/labs/"));
  const isExcluded = isExcludedRoute(pathname);

  // Dynamic route transition watcher & active cleanup
  useEffect(() => {
    const shouldExclude = isExcludedRoute(pathname) || isAdminHost();

    if (shouldExclude) {
      document.body.setAttribute("data-no-ads", "true");
      if (isLab) {
        document.body.setAttribute("data-is-lab-page", "true");
      } else {
        document.body.removeAttribute("data-is-lab-page");
      }

      // Initial cleanup sweep on entering an excluded route
      purgeAdElements();

      // Active observer to block AdSense background mutations during route transitions
      const observer = new MutationObserver((mutations) => {
        let detected = false;
        for (const mutation of mutations) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement) {
              const tag = node.tagName.toLowerCase();
              const id = node.id || "";
              if (
                node.classList.contains("google-auto-placed") ||
                node.classList.contains("adsbygoogle") ||
                tag === "ins" ||
                id.startsWith("aswift_") ||
                id.startsWith("google_ads_iframe") ||
                id === "google_esf"
              ) {
                detected = true;
                break;
              }
            }
          }
          if (detected) break;
        }

        if (detected) {
          purgeAdElements();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    } else {
      document.body.removeAttribute("data-no-ads");
      document.body.removeAttribute("data-is-lab-page");
    }
  }, [pathname, isLab]);

  // Do not inject the script tag when rendering an excluded route
  if (isExcluded) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
