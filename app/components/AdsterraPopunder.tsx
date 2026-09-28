"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAdExcludedRoute, ADSTERRA_POPUNDER_SRC, ADSTERRA_SMARTLINK_URL } from "@/app/lib/ads";

/**
 * Returns true if accessed via an administrative subdomain.
 */
function isAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.startsWith("admin.") || host.startsWith("admin.localhost");
}

/**
 * Purges any Adsterra overlays, iframes, or tracking anchors from the DOM.
 */
function purgeAdsterraElements(): void {
  if (typeof document === "undefined") return;
  const selectors = [
    "iframe[src*='disregardpervertmural']",
    "a[href*='disregardpervertmural']",
    "div[id*='disregardpervertmural']",
    "[data-adsterra]",
  ];
  const nodes = document.querySelectorAll(selectors.join(", "));
  nodes.forEach((node) => {
    try {
      node.remove();
    } catch {
      // Ignored if already removed
    }
  });
}

/**
 * AdsterraPopunder Component.
 * 
 * Works alongside the static anti-adblock script in <head> while enforcing
 * strict protection on interactive science simulations (/labs/*) and admin routes (/admin/*):
 * 1. Blocks window.open popunders when clicking inside simulation canvases or admin screens.
 * 2. Purges any dynamically injected transparent overlay click-traps or iframes.
 * 3. Restores standard behavior on public discovery routes (landing pages, blog, tracks).
 */
export default function AdsterraPopunder() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldExclude = isAdExcludedRoute(pathname) || isAdminHost();

    if (shouldExclude) {
      purgeAdsterraElements();

      // Intercept and neutralize window.open calls targeted at adsterra / popunders while in labs
      const originalWindowOpen = window.open;
      window.open = function (
        url?: string | URL,
        target?: string,
        features?: string
      ): Window | null {
        const urlStr = typeof url === "string" ? url : url?.toString() || "";
        if (
          urlStr.includes("disregardpervertmural") ||
          urlStr.includes("adsterra")
        ) {
          return null;
        }
        return originalWindowOpen.apply(this, arguments as any);
      };

      // MutationObserver to immediately destroy any Adsterra popunder overlay added during simulation use
      const observer = new MutationObserver((mutations) => {
        let detected = false;
        for (const mutation of mutations) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement) {
              const tag = node.tagName.toLowerCase();
              const src = node.getAttribute("src") || "";
              const href = node.getAttribute("href") || "";
              if (
                src.includes("disregardpervertmural") ||
                href.includes("disregardpervertmural") ||
                (tag === "iframe" && src.includes("disregard"))
              ) {
                detected = true;
                break;
              }
            }
          }
          if (detected) break;
        }
        if (detected) {
          purgeAdsterraElements();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        window.open = originalWindowOpen;
        observer.disconnect();
      };
    }
  }, [pathname]);

  return null;
}

export { ADSTERRA_POPUNDER_SRC, ADSTERRA_SMARTLINK_URL };
