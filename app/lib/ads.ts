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
  "https://disregardpervertmural.com/08/e6/db/08e6dbca5d9532e90ba54ed38592f7b0.js";

/**
 * Adsterra Direct Smartlink URL
 * Unit: Smartlink_1 on openlabs.org.in
 */
export const ADSTERRA_SMARTLINK_URL =
  "https://disregardpervertmural.com/nq14cn3uq9?key=c81181fb15ae3c289e31602fa7849d41";

/**
 * Returns true if the pathname is an interactive simulation lab or administrative panel
 * that must be protected from all advertisements.
 */
export function isAdExcludedRoute(pathname: string | null): boolean {
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
