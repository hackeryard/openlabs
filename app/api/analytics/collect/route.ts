import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PageView from "@/app/models/PageView";
import AnalyticsEvent from "@/app/models/AnalyticsEvent";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

/**
 * Extracts country code from Edge/CDN headers
 */
function getGeoCountry(req: Request): string {
  const headers = req.headers;
  const country =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "Unknown";
  return country;
}

/**
 * Extracts domain name from referrer string
 */
function extractDomain(ref?: string): string {
  if (!ref || ref.trim() === "") return "Direct";
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export async function POST(req: Request) {
  try {
    // Only ingest telemetry in production
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, devMode: true });
    }

    const body = await req.json();
    const { type, visitorId, sessionId, pathname } = body;

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

    const country = getGeoCountry(req);

    // ── A. Handle Pageview Ingestion ──
    if (type === "pageview") {
      const referrerDomain = extractDomain(body.referrer);

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
        timezone: body.timezone || "",
        country,
        duration: 1,
        scrollDepth: 0,
      });

      return NextResponse.json({ ok: true });
    }

    // ── B. Handle Heartbeat (Dwell time & Scroll update) ──
    if (type === "heartbeat") {
      const { duration, scrollDepth } = body;

      // Find the most recent pageview for this session + pathname and update duration/scroll
      await (PageView as any).findOneAndUpdate(
        {
          sessionId,
          pathname,
        },
        {
          $set: {
            duration: Number(duration) || 1,
            scrollDepth: Math.min(100, Math.max(0, Number(scrollDepth) || 0)),
          },
        },
        { sort: { createdAt: -1 } }
      );

      return NextResponse.json({ ok: true });
    }

    // ── C. Handle Custom Learning / Lab Event ──
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
