// app/lib/seo/canonicalBuilder.ts
import { SITE_METADATA } from "../constants/subjects";

/**
 * Generates an absolute, normalized canonical URL.
 * Enforces HTTPS domain, lowercase paths, removes trailing slashes,
 * and strips tracking query parameters (utm_*, ref, gclid, fbclid).
 */
export function buildCanonical(pathname: string, searchParams?: Record<string, string | string[]>): string {
  const base = SITE_METADATA.baseUrl.replace(/\/+$/, "");
  let cleanPath = (pathname || "/").trim().toLowerCase();

  // Normalize trailing slash (keep root '/' intact)
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Ensure leading slash
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // Handle URL parameters if pagination or essential query state exists
  const allowedParams = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, val]) => {
      const lowerKey = key.toLowerCase();
      // Exclude tracking parameters
      if (
        !lowerKey.startsWith("utm_") &&
        !["ref", "gclid", "fbclid", "_ga"].includes(lowerKey)
      ) {
        if (Array.isArray(val)) {
          val.forEach((v) => allowedParams.append(key, v));
        } else if (val !== undefined) {
          allowedParams.append(key, val);
        }
      }
    });
  }

  const queryString = allowedParams.toString();
  return `${base}${cleanPath}${queryString ? `?${queryString}` : ""}`;
}
