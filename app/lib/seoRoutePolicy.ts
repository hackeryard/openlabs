// app/lib/seoRoutePolicy.ts
/**
 * Centralized SEO Route Policy & Classification Engine for OpenLabs.
 * Single source of truth for:
 * - Public indexable educational routes
 * - Non-indexable interactive lab simulation routes (/labs/*)
 * - Private / authenticated routes (/admin/*, /login, etc.)
 * - Embed proxy routes (/embed/*)
 * - Canonical redirects
 */

export type RouteType = "public" | "lab" | "private" | "redirect" | "removed";

export interface RouteClassification {
  route: string;
  type: RouteType;
  isIndexable: boolean;
  shouldIncludeInSitemap: boolean;
  canonicalUrl: string;
  redirectTo?: string;
  reason: string;
}

export const BASE_URL = "https://www.openlabs.org.in";

/** Permanent 308 redirects */
export const REDIRECTS: Record<string, string> = {
  "/education": "/tracks",
  "/virtual-science-labs": "/tracks",
};

/** Core top-level public indexable static pages */
export const CORE_PUBLIC_PAGES: string[] = [
  "/",
  "/physics",
  "/chemistry",
  "/biology",
  "/computer-science",
  "/mathematics",
  "/tracks",
  "/leaderboard",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export const CORE_PUBLIC_ROUTES = CORE_PUBLIC_PAGES;

/** Public subtopic hubs */
export const SUBTOPIC_HUBS: string[] = [
  "/computer-science/ai-problem",
  "/computer-science/code-lab",
  "/computer-science/dsa",
  "/computer-science/dsa/sorting",
  "/computer-science/logic-gates",
  "/computer-science/networking",
  "/computer-science/cryptography",
  "/biology/cell",
  "/biology/genetics",
  "/biology/genetics/dna-transcription",
];

/** Private / authenticated paths that must never be indexed or in sitemaps */
export const PRIVATE_EXACT_ROUTES: string[] = [
  "/login",
  "/signup",
  "/forgotpassword",
  "/reset-password",
  "/verify-email",
  "/setup-profile",
  "/profile",
  "/403",
];

/** Private prefixes */
export const PRIVATE_PREFIXES: string[] = [
  "/admin",
  "/api",
  "/private",
  "/profile/",
  "/embed",
];

/**
 * Classify any route into its SEO category.
 */
export function classifyRoute(rawPath: string): RouteClassification {
  const normalized = normalizePath(rawPath);

  // 1. Check permanent redirects
  if (REDIRECTS[normalized]) {
    return {
      route: normalized,
      type: "redirect",
      isIndexable: false,
      shouldIncludeInSitemap: false,
      redirectTo: REDIRECTS[normalized],
      canonicalUrl: `${BASE_URL}${REDIRECTS[normalized]}`,
      reason: `Permanent redirect to ${REDIRECTS[normalized]}`,
    };
  }

  // 2. Interactive Labs (/labs/*) - Intentionally excluded from index
  if (normalized.startsWith("/labs/") || normalized === "/labs") {
    return {
      route: normalized,
      type: "lab",
      isIndexable: false,
      shouldIncludeInSitemap: false,
      canonicalUrl: `${BASE_URL}${normalized}`,
      reason: "Interactive simulation workspace: intentionally non-indexable",
    };
  }

  // 3. Private / authenticated / admin / embed routes
  if (
    PRIVATE_EXACT_ROUTES.includes(normalized) ||
    PRIVATE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  ) {
    return {
      route: normalized,
      type: "private",
      isIndexable: false,
      shouldIncludeInSitemap: false,
      canonicalUrl: `${BASE_URL}${normalized}`,
      reason: "Private, authenticated, administrative, or embed route",
    };
  }

  // 4. Public educational routes
  return {
    route: normalized,
    type: "public",
    isIndexable: true,
    shouldIncludeInSitemap: true,
    canonicalUrl: `${BASE_URL}${normalized}`,
    reason: "Public educational landing page",
  };
}

export function isIndexableRoute(path: string): boolean {
  return classifyRoute(path).isIndexable;
}

export function isSitemapEligible(path: string): boolean {
  return classifyRoute(path).shouldIncludeInSitemap;
}

export function toCanonicalUrl(path: string): string {
  return classifyRoute(path).canonicalUrl;
}

function normalizePath(raw: string): string {
  let p = raw.split("?")[0].split("#")[0].trim();
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p.toLowerCase();
}
