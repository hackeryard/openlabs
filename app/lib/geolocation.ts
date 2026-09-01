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
 * Automatically resolves geolocation (Country, State/Region, City, Timezone)
 * from Edge/CDN headers (Vercel, Cloudflare) without prompting the user.
 */
export function extractGeoLocation(req: Request | Headers): GeoLocationData {
  const headers = req instanceof Headers ? req : req.headers;
  const ip = getClientIp(headers);

  // Country Code (e.g., 'US', 'IN', 'GB')
  const rawCountryCode =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "Unknown";

  const countryCode = rawCountryCode.trim().toUpperCase();
  const country = getFullCountryName(countryCode);

  // Region / State (e.g., 'CA', 'MH', 'NY')
  const region =
    headers.get("x-vercel-ip-country-region") ||
    headers.get("cf-region") ||
    headers.get("x-region-code") ||
    "";

  // City (e.g., 'San Francisco', 'Mumbai' - Vercel URL-encodes city names)
  const rawCity =
    headers.get("x-vercel-ip-city") ||
    headers.get("cf-ipcity") ||
    headers.get("x-city") ||
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
    "";

  // Coordinates
  const rawLat = headers.get("x-vercel-ip-latitude") || headers.get("cf-iplatitude");
  const rawLon = headers.get("x-vercel-ip-longitude") || headers.get("cf-iplongitude");
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
