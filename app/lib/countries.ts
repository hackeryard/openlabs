/**
 * Country Code to Full Country Name Resolver
 * Converts 2-letter ISO 3166-1 alpha-2 codes (e.g. 'IN', 'US', 'GB')
 * into human-readable full country names ('India', 'United States', 'United Kingdom').
 */

const COUNTRY_OVERRIDE_MAP: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom",
  IN: "India",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  SG: "Singapore",
  AE: "United Arab Emirates",
  JP: "Japan",
  CN: "China",
  BR: "Brazil",
  NL: "Netherlands",
  SE: "Sweden",
  CH: "Switzerland",
  ID: "Indonesia",
  PK: "Pakistan",
  BD: "Bangladesh",
  NG: "Nigeria",
  ZA: "South Africa",
  KR: "South Korea",
  IT: "Italy",
  ES: "Spain",
  RU: "Russia",
  MX: "Mexico",
  TR: "Turkey",
  SA: "Saudi Arabia",
  PL: "Poland",
  PH: "Philippines",
  VN: "Vietnam",
  EG: "Egypt",
  TH: "Thailand",
  MY: "Malaysia",
  NZ: "New Zealand",
  IE: "Ireland",
  AT: "Austria",
  BE: "Belgium",
  DK: "Denmark",
  FI: "Finland",
  NO: "Norway",
  PT: "Portugal",
  GR: "Greece",
  CZ: "Czech Republic",
  RO: "Romania",
  HU: "Hungary",
  IL: "Israel",
  HK: "Hong Kong",
  TW: "Taiwan",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  KE: "Kenya",
  GH: "Ghana",
  Unknown: "Unknown",
};

let intlRegionNames: Intl.DisplayNames | null = null;
try {
  if (typeof Intl !== "undefined" && Intl.DisplayNames) {
    intlRegionNames = new Intl.DisplayNames(["en"], { type: "region" });
  }
} catch {}

/**
 * Returns the full country name for a given ISO code or raw country string.
 */
export function getFullCountryName(countryCode?: string | null): string {
  if (!countryCode || countryCode.trim() === "" || countryCode.toLowerCase() === "unknown") {
    return "Unknown";
  }

  const code = countryCode.trim().toUpperCase();

  // 1. Direct fast lookup in common country overrides
  if (COUNTRY_OVERRIDE_MAP[code]) {
    return COUNTRY_OVERRIDE_MAP[code];
  }

  // 2. If it's already a full country name (longer than 3 chars)
  if (countryCode.trim().length > 3 && !countryCode.includes("-")) {
    return countryCode.trim();
  }

  // 3. Fallback to Intl.DisplayNames for any 2-letter alpha-2 ISO code
  if (intlRegionNames && code.length === 2) {
    try {
      const resolved = intlRegionNames.of(code);
      if (resolved && resolved !== code) {
        return resolved;
      }
    } catch {}
  }

  return countryCode.trim();
}

/**
 * Returns flag emoji for a given 2-letter ISO code or full country name if available.
 */
export function getCountryFlag(countryCodeOrName?: string | null): string {
  if (!countryCodeOrName || countryCodeOrName === "Unknown") return "🌐";

  const code = countryCodeOrName.trim().toUpperCase();
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    const codePoints = code
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return "🌐";
}
