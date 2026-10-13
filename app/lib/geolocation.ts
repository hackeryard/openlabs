import { getFullCountryName } from "@/app/lib/countries";

export interface GeoLocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Extracts client IP address from standard proxy and CDN headers.
 */
export function getClientIp(req: Request | Headers): string {
  const headers = req instanceof Headers ? req : req.headers;
  
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Checks if an IP address is a publicly routable IP (not loopback, private or link-local).
 */
export function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  const clean = ip.trim();
  if (
    clean === "127.0.0.1" ||
    clean === "::1" ||
    clean === "localhost" ||
    clean.startsWith("10.") ||
    clean.startsWith("192.168.") ||
    clean.startsWith("169.254.") ||
    clean.startsWith("fc00:") ||
    clean.startsWith("fe80:")
  ) {
    return false;
  }
  if (clean.startsWith("172.")) {
    const parts = clean.split(".");
    const second = parseInt(parts[1], 10);
    if (second >= 16 && second <= 31) return false;
  }
  return true;
}

/**
 * Automatically resolves geolocation (Country, State/Region, City, Timezone)
 * from Edge/CDN headers (Vercel, Cloudflare, AWS CloudFront, proxies) without prompting the user.
 */
export function extractGeoLocation(req: Request | Headers): GeoLocationData {
  const headers = req instanceof Headers ? req : req.headers;
  const ip = getClientIp(headers);

  // Country Code (e.g., 'US', 'IN', 'GB')
  const rawCountryCode =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    headers.get("x-geo-country") ||
    headers.get("cloudfront-viewer-country") ||
    headers.get("x-real-ip-country") ||
    headers.get("geoip-country-code") ||
    "Unknown";

  const countryCode = rawCountryCode.trim().toUpperCase();
  const country = getFullCountryName(countryCode);

  // Region / State (e.g., 'CA', 'MH', 'NY')
  const region =
    headers.get("x-vercel-ip-country-region") ||
    headers.get("cf-region") ||
    headers.get("x-region-code") ||
    headers.get("x-geo-region") ||
    headers.get("cloudfront-viewer-country-region-name") ||
    "";

  // City (e.g., 'San Francisco', 'Mumbai' - Vercel URL-encodes city names)
  const rawCity =
    headers.get("x-vercel-ip-city") ||
    headers.get("cf-ipcity") ||
    headers.get("x-city") ||
    headers.get("x-geo-city") ||
    headers.get("cloudfront-viewer-city") ||
    "";

  let city = "";
  try {
    city = rawCity ? decodeURIComponent(rawCity).trim() : "";
  } catch {
    city = rawCity.trim();
  }

  // Timezone (e.g., 'America/Los_Angeles', 'Asia/Kolkata')
  const timezone =
    headers.get("x-vercel-ip-timezone") ||
    headers.get("cf-timezone") ||
    headers.get("x-timezone") ||
    headers.get("x-geo-timezone") ||
    headers.get("cloudfront-viewer-time-zone") ||
    "";

  // Coordinates
  const rawLat =
    headers.get("x-vercel-ip-latitude") ||
    headers.get("cf-iplatitude") ||
    headers.get("x-latitude") ||
    headers.get("x-geo-latitude");
  const rawLon =
    headers.get("x-vercel-ip-longitude") ||
    headers.get("cf-iplongitude") ||
    headers.get("x-longitude") ||
    headers.get("x-geo-longitude");
  const latitude = rawLat ? parseFloat(rawLat) : null;
  const longitude = rawLon ? parseFloat(rawLon) : null;

  return {
    ip,
    country,
    countryCode: countryCode !== "UNKNOWN" ? countryCode : "",
    region: region.trim(),
    city,
    timezone: timezone.trim(),
    latitude: !isNaN(Number(latitude)) ? latitude : null,
    longitude: !isNaN(Number(longitude)) ? longitude : null,
  };
}

/**
 * Resilient async geolocation resolver. First checks zero-latency Edge/CDN headers.
 * If edge headers are absent (e.g. Render deployments or direct origin requests) and
 * the client has a public IP address, falls back to a fast IP lookup service (<= 1500ms timeout).
 */
export async function resolveGeoLocation(req: Request | Headers): Promise<GeoLocationData> {
  const geo = extractGeoLocation(req);
  if (geo.country !== "Unknown" && geo.countryCode !== "") {
    return geo;
  }

  if (isPublicIp(geo.ip)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`https://ipwho.is/${encodeURIComponent(geo.ip)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const countryCode = (data.country_code || "").toUpperCase();
          const country = data.country || getFullCountryName(countryCode);
          return {
            ip: geo.ip,
            country: country || "Unknown",
            countryCode: countryCode !== "UNKNOWN" ? countryCode : "",
            region: data.region || geo.region,
            city: data.city || geo.city,
            timezone: data.timezone?.id || geo.timezone,
            latitude: typeof data.latitude === "number" ? data.latitude : geo.latitude,
            longitude: typeof data.longitude === "number" ? data.longitude : geo.longitude,
          };
        }
      }
    } catch {
      // Fallback silently to sync geo
    }
  }

  return geo;
}
