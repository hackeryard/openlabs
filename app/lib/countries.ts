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
 * Reverse mapping from lowercase full country name to 2-letter ISO alpha-2 code
 */
const NAME_TO_ISO_MAP: Record<string, string> = {};
for (const [code, name] of Object.entries(COUNTRY_OVERRIDE_MAP)) {
  if (code.length === 2) {
    NAME_TO_ISO_MAP[name.toLowerCase()] = code;
  }
}
// Additional manual aliases
NAME_TO_ISO_MAP["united states of america"] = "US";
NAME_TO_ISO_MAP["usa"] = "US";
NAME_TO_ISO_MAP["uk"] = "GB";
NAME_TO_ISO_MAP["great britain"] = "GB";
NAME_TO_ISO_MAP["south korea"] = "KR";
NAME_TO_ISO_MAP["republic of korea"] = "KR";
NAME_TO_ISO_MAP["russia"] = "RU";
NAME_TO_ISO_MAP["russian federation"] = "RU";
NAME_TO_ISO_MAP["vietnam"] = "VN";
NAME_TO_ISO_MAP["viet nam"] = "VN";
NAME_TO_ISO_MAP["algeria"] = "DZ";
NAME_TO_ISO_MAP["morocco"] = "MA";
NAME_TO_ISO_MAP["ethiopia"] = "ET";
NAME_TO_ISO_MAP["el salvador"] = "SV";
NAME_TO_ISO_MAP["dominican republic"] = "DO";
NAME_TO_ISO_MAP["guatemala"] = "GT";
NAME_TO_ISO_MAP["cambodia"] = "KH";
NAME_TO_ISO_MAP["georgia"] = "GE";
NAME_TO_ISO_MAP["ecuador"] = "EC";

/**
 * Returns 2-letter uppercase ISO alpha-2 country code (e.g. "IN", "US", "GB")
 */
export function getCountryIsoCode(countryNameOrCode?: string | null): string {
  if (!countryNameOrCode || countryNameOrCode.trim() === "" || countryNameOrCode.toLowerCase() === "unknown") {
    return "Unknown";
  }
  const clean = countryNameOrCode.trim();
  if (clean.length === 2 && /^[A-Za-z]{2}$/.test(clean)) {
    const upper = clean.toUpperCase();
    return upper === "UK" ? "GB" : upper;
  }
  const lower = clean.toLowerCase();
  if (NAME_TO_ISO_MAP[lower]) {
    return NAME_TO_ISO_MAP[lower];
  }
  // Try partial prefix match
  for (const [name, code] of Object.entries(NAME_TO_ISO_MAP)) {
    if (lower.includes(name) || name.includes(lower)) {
      return code;
    }
  }
  return clean.slice(0, 2).toUpperCase();
}

const CONTINENT_BY_ISO: Record<string, string> = {
  // Asia
  IN: "Asia-Pacific", CN: "Asia-Pacific", JP: "Asia-Pacific", KR: "Asia-Pacific",
  SG: "Asia-Pacific", ID: "Asia-Pacific", PK: "Asia-Pacific", BD: "Asia-Pacific",
  PH: "Asia-Pacific", VN: "Asia-Pacific", TH: "Asia-Pacific", MY: "Asia-Pacific",
  HK: "Asia-Pacific", TW: "Asia-Pacific", SA: "Middle East", AE: "Middle East",
  IL: "Middle East", QA: "Middle East", KW: "Middle East", OM: "Middle East",
  LK: "Asia-Pacific", NP: "Asia-Pacific", KH: "Asia-Pacific", GE: "Middle East",
  // Europe
  GB: "Europe", DE: "Europe", FR: "Europe", IT: "Europe", ES: "Europe",
  NL: "Europe", SE: "Europe", CH: "Europe", PL: "Europe", AT: "Europe",
  BE: "Europe", DK: "Europe", FI: "Europe", NO: "Europe", PT: "Europe",
  GR: "Europe", CZ: "Europe", RO: "Europe", HU: "Europe", IE: "Europe",
  UA: "Europe", RU: "Europe",
  // North America
  US: "North America", CA: "North America", MX: "North America",
  CR: "North America", PA: "North America", CU: "North America",
  DO: "North America", GT: "North America", SV: "North America",
  // South America
  BR: "South America", AR: "South America", CL: "South America",
  CO: "South America", PE: "South America", VE: "South America",
  EC: "South America", UY: "South America", PY: "South America",
  // Africa
  EG: "Africa", NG: "Africa", ZA: "Africa", KE: "Africa", GH: "Africa",
  DZ: "Africa", MA: "Africa", ET: "Africa", UG: "Africa", TZ: "Africa",
  // Oceania
  AU: "Oceania", NZ: "Oceania", FJ: "Oceania", PG: "Oceania",
};

/**
 * Returns Continent / Geographic Region Name
 */
export function getContinentForCountry(countryNameOrCode?: string | null): string {
  const iso = getCountryIsoCode(countryNameOrCode);
  if (CONTINENT_BY_ISO[iso]) {
    return CONTINENT_BY_ISO[iso];
  }
  return "Other Regions";
}

/**
 * Returns flag emoji for a given 2-letter ISO code or full country name if available.
 */
export function getCountryFlag(countryCodeOrName?: string | null): string {
  if (!countryCodeOrName || countryCodeOrName === "Unknown") return "🌐";

  const code = getCountryIsoCode(countryCodeOrName);
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    const codePoints = code
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return "🌐";
}

