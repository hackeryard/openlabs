/**
 * Centralized Advertising Configuration for OpenLabs.
 * 
 * Houses Google AdSense and Adsterra ad tag configurations,
 * endpoints, and exclusion rules.
 */

export const GOOGLE_ADSENSE_CLIENT_ID = "ca-pub-4121707034074280";

/**
 * Adsterra Popunder Anti-Adblock JS Sync Source
 * Unit: Popunder_1 on openlabs.org.in
 */
export const ADSTERRA_POPUNDER_SRC =
  "https://abscloud.org/1/08e6dbca5d9532e90ba54ed38592f7b0";

/**
 * Adsterra Direct Smartlink URL
 * Unit: Smartlink_1 on openlabs.org.in
 */
export const ADSTERRA_SMARTLINK_URL =
  "https://araplhn.org/4/c81181fb15ae3c289e31602fa7849d41";

/**
 * Adsterra Display Banners & Native Banner Unit Configurations
 * Units on openlabs.org.in
 */
export const ADSTERRA_BANNERS = {
  "160x300": {
    key: "06c4c074fa3cebea8c6cfc859cc3da96",
    format: "iframe",
    height: 300,
    width: 160,
    src: "https://bauval.org/22/06c4c074fa3cebea8c6cfc859cc3da96",
  },
  "160x600": {
    key: "f6cad1d3217a2e4709811c3a89600d36",
    format: "iframe",
    height: 600,
    width: 160,
    src: "https://bauval.org/22/f6cad1d3217a2e4709811c3a89600d36",
  },
  "300x250": {
    key: "43a4570cb7b5f2d359a67cefc9f4984f",
    format: "iframe",
    height: 250,
    width: 300,
    src: "https://bauval.org/22/43a4570cb7b5f2d359a67cefc9f4984f",
  },
  "320x50": {
    key: "d1c94bed64aa9e5d335a80aa63d23fe4",
    format: "iframe",
    height: 50,
    width: 320,
    src: "https://bauval.org/22/d1c94bed64aa9e5d335a80aa63d23fe4",
  },
  "468x60": {
    key: "50d5e096c9f65fbc210e2ee159a3de18",
    format: "iframe",
    height: 60,
    width: 468,
    src: "https://bauval.org/22/50d5e096c9f65fbc210e2ee159a3de18",
  },
  "728x90": {
    key: "1ca29a9bbc0a612dd16f4ad238009488",
    format: "iframe",
    height: 90,
    width: 728,
    src: "https://bauval.org/22/1ca29a9bbc0a612dd16f4ad238009488",
  },
  native: {
    src: "https://bauval.org/21/8eb9029bb810ce5acaa5919fc62e556a",
    containerId: "container-8eb9029bb810ce5acaa5919fc62e556a",
  },
} as const;

export type AdBannerSize = "160x300" | "160x600" | "300x250" | "320x50" | "468x60" | "728x90";
export type AdBannerFormat = AdBannerSize | "responsive-leaderboard";

/**
 * Returns true if the current environment or route is within the Admin Console
 * (subdomain admin.*, path /admin, or 403 screen).
 */
export function isAdminContext(pathname?: string | null): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const path = pathname || window.location.pathname;
    if (
      host.startsWith("admin.") ||
      host.startsWith("admin.localhost") ||
      path === "/admin" ||
      path.startsWith("/admin/") ||
      path === "/403"
    ) {
      return true;
    }
  } else if (pathname) {
    if (
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname === "/403"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if the pathname is an interactive simulation lab or administrative panel
 * that must be protected from all advertisements.
 */
export function isAdExcludedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  // Exclude all interactive simulation labs under /labs or /labs/*
  if (pathname === "/labs" || pathname.startsWith("/labs/")) return true;
  // Exclude administrative dashboards, admin subdomains, and access restricted screens
  if (isAdminContext(pathname)) {
    return true;
  }
  // Exclude login and signup forms for security and friction-free auth
  if (pathname === "/login" || pathname === "/signup") {
    return true;
  }
  return false;
}

/**
 * Known third-party ad networks, anti-adblock fallback domains, and rotated Adsterra sources.
 */
export const AD_HOST_PATTERNS = [
  "disregardpervertmural",
  "portalfluently",
  "sfp.js",
  "adsterra",
  "googleads",
  "doubleclick",
  "googlesyndication",
  "pagead",
  "adsbygoogle",
  "adtrafficquality",
  "sodar",
  "bauval",
  "abscloud",
  "araplhn",
];

/**
 * Checks if a given URL or host belongs to external advertising scripts.
 */
export function isAdOrTrackerUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return AD_HOST_PATTERNS.some((pattern) => lower.includes(pattern));
}
