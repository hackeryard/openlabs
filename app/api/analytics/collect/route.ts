import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PageView from "@/app/models/PageView";
import AnalyticsEvent from "@/app/models/AnalyticsEvent";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { getFullCountryName } from "@/app/lib/countries";
import { extractGeoLocation } from "@/app/lib/geolocation";

/**
 * Extracts country code from Edge/CDN headers and resolves to full name
 */
function getGeoCountry(req: Request): string {
  const headers = req.headers;
  const rawCountry =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "Unknown";
  return getFullCountryName(rawCountry);
}

/**
 * Extracts domain name from referrer string, ignoring authentication redirectors and internal domains
 */
function extractDomain(ref?: string): string {
  if (!ref || ref.trim() === "") return "Direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    // Ignore OAuth authentication redirectors and internal OpenLabs hosts
    if (
      host === "accounts.google.com" ||
      host.endsWith(".google.com") && (url.pathname.includes("/oauth") || url.pathname.includes("/signin") || url.pathname.includes("/ServiceLogin")) ||
      host === "appleid.apple.com" ||
      host === "openlabs.org.in" ||
      host === "admin.openlabs.org.in" ||
      host.endsWith(".openlabs.org.in") ||
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      return "Direct";
    }

    return host;
  } catch {
    return "Direct";
  }
}

export async function POST(req: Request) {
  try {
    const host = req.headers.get("host") || "";
    const body = await req.json();
    const { type, visitorId, sessionId, pathname } = body;

    // Do not track telemetry for local dev or admin panel
    if (
      process.env.NODE_ENV !== "production" ||
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.endsWith(".local") ||
      host.startsWith("admin.") ||
      pathname?.startsWith("/admin") ||
      pathname === "/403"
    ) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (!visitorId || !sessionId || !pathname) {
      return NextResponse.json({ ok: false, error: "Missing identity params" }, { status: 400 });
    }

    await connectDB();

    // Check optional authenticated user
    let userId = null;
    try {
      const payload = getUserFromToken();
      if (payload?.id) userId = payload.id;
    } catch {}

    const geo = extractGeoLocation(req);

    // ── A. Handle Pageview Ingestion ──
    if (type === "pageview") {
      const referrerDomain = extractDomain(body.referrer);

      let isReturning = Boolean(body.isReturning);
      let visitCount = Math.max(1, Number(body.visitCount) || 1);

      // Server-side identity check: verify against prior sessions in database
      if (!isReturning) {
        const priorQuery: any[] = [{ visitorId, sessionId: { $ne: sessionId } }];
        if (userId) {
          priorQuery.push({ userId, sessionId: { $ne: sessionId } });
        }
        const priorPv = await (PageView as any).findOne({ $or: priorQuery }).select("_id").lean();
        if (priorPv) {
          isReturning = true;
          visitCount = Math.max(2, visitCount);
        }
      }

      await (PageView as any).create({
        pathname,
        title: body.title || "",
        labId: body.labId || null,
        visitorId,
        sessionId,
        userId,
        referrer: body.referrer || "",
        referrerDomain,
        utmSource: body.utmSource || null,
        utmMedium: body.utmMedium || null,
        utmCampaign: body.utmCampaign || null,
        device: body.device || "desktop",
        browser: body.browser || "Unknown",
        os: body.os || "Unknown",
        screen: body.screen || "",
        language: body.language || "en",
        timezone: body.timezone || geo.timezone || "",
        country: geo.country,
        region: geo.region,
        city: geo.city,
        ip: geo.ip,
        duration: 1,
        activeDuration: 0,
        idleDuration: 0,
        focusCount: 1,
        scrollDepth: 0,
        scrollMilestones: [],
        webVitals: {
          fcp: null,
          lcp: null,
          cls: null,
          inp: null,
          ttfb: null,
          domLoad: null,
          windowLoad: null,
        },
        hardware: body.hardware || {},
        network: body.network || {},
        isBounce: false,
        exitIntent: false,
        isReturning,
        visitCount,
      });

      return NextResponse.json({ ok: true });
    }

    // ── B. Handle Heartbeat (Dwell time, Web Vitals & Scroll update) ──
    if (type === "heartbeat") {
      const {
        duration,
        activeDuration,
        idleDuration,
        focusCount,
        scrollDepth,
        scrollMilestones,
        webVitals,
        isBounce,
        exitIntent,
      } = body;

      const updateSet: Record<string, any> = {
        duration: Number(duration) || 1,
        activeDuration: Math.max(0, Number(activeDuration) || 0),
        idleDuration: Math.max(0, Number(idleDuration) || 0),
        focusCount: Math.max(1, Number(focusCount) || 1),
        scrollDepth: Math.min(100, Math.max(0, Number(scrollDepth) || 0)),
        isBounce: Boolean(isBounce),
        exitIntent: Boolean(exitIntent),
      };

      if (Array.isArray(scrollMilestones) && scrollMilestones.length > 0) {
        updateSet.scrollMilestones = scrollMilestones;
      }

      if (webVitals && typeof webVitals === "object") {
        if (webVitals.fcp !== null && webVitals.fcp !== undefined) updateSet["webVitals.fcp"] = webVitals.fcp;
        if (webVitals.lcp !== null && webVitals.lcp !== undefined) updateSet["webVitals.lcp"] = webVitals.lcp;
        if (webVitals.cls !== null && webVitals.cls !== undefined) updateSet["webVitals.cls"] = webVitals.cls;
        if (webVitals.inp !== null && webVitals.inp !== undefined) updateSet["webVitals.inp"] = webVitals.inp;
        if (webVitals.ttfb !== null && webVitals.ttfb !== undefined) updateSet["webVitals.ttfb"] = webVitals.ttfb;
        if (webVitals.domLoad !== null && webVitals.domLoad !== undefined) updateSet["webVitals.domLoad"] = webVitals.domLoad;
        if (webVitals.windowLoad !== null && webVitals.windowLoad !== undefined) updateSet["webVitals.windowLoad"] = webVitals.windowLoad;
      }

      // Find the most recent pageview for this session + pathname and update duration/scroll/vitals
      await (PageView as any).findOneAndUpdate(
        {
          sessionId,
          pathname,
        },
        {
          $set: updateSet,
        },
        { sort: { createdAt: -1 } }
      );

      return NextResponse.json({ ok: true });
    }

    // ── C. Handle Custom Learning / Lab / UX / Web Vital Event ──
    if (type === "event") {
      const { eventName, category, labId, properties, value } = body;

      if (!eventName) {
        return NextResponse.json({ ok: false, error: "eventName required" }, { status: 400 });
      }

      await (AnalyticsEvent as any).create({
        eventName,
        category: category || "general",
        labId: labId || null,
        visitorId,
        sessionId,
        userId,
        pathname,
        properties: properties || {},
        value: typeof value === "number" ? value : null,
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Analytics collect error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
