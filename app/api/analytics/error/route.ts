import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import ErrorLog from "@/app/models/ErrorLog";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export async function POST(req: Request) {
  try {
    const host = req.headers.get("host") || "";
    // Only record error diagnostics in real production deployments (never local dev or localhost)
    if (
      process.env.NODE_ENV !== "production" ||
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.endsWith(".local")
    ) {
      return NextResponse.json({ ok: true, devMode: true });
    }

    const body = await req.json();
    const {
      message,
      stack,
      digest,
      componentStack,
      errorType,
      pathname,
      visitorId,
      sessionId,
    } = body;

    if (!message || !pathname) {
      return NextResponse.json({ ok: false, error: "message and pathname required" }, { status: 400 });
    }

    await connectDB();

    // Check optional authenticated user
    let userId = null;
    try {
      const payload = getUserFromToken();
      if (payload?.id) userId = payload.id;
    } catch {}

    const ua = req.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone/i.test(ua);
    const device = isMobile ? "mobile" : "desktop";

    let browser = "Browser";
    if (/chrome/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    let os = "OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad/i.test(ua)) os = "iOS";

    // Deduplicate: check if identical error occurred on this pathname in the last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await (ErrorLog as any).findOne({
      message: message.trim(),
      pathname,
      lastOccurredAt: { $gte: twentyFourHoursAgo },
    });

    if (existing) {
      existing.occurrences = (existing.occurrences || 1) + 1;
      existing.lastOccurredAt = new Date();
      if (userId && !existing.userId) existing.userId = userId;
      if (digest && !existing.digest) existing.digest = digest;
      if (stack && !existing.stack) existing.stack = stack;
      await existing.save();

      return NextResponse.json({ ok: true, deduplicated: true, errorId: existing._id });
    }

    // Create new ErrorLog
    const errorLog = await (ErrorLog as any).create({
      message: message.trim().slice(0, 1000),
      stack: stack ? String(stack).slice(0, 5000) : "",
      digest: digest || null,
      componentStack: componentStack ? String(componentStack).slice(0, 3000) : null,
      errorType: errorType || "runtime",
      pathname,
      visitorId: visitorId || null,
      sessionId: sessionId || null,
      userId,
      device,
      browser,
      os,
      userAgent: ua.slice(0, 300),
      status: "new",
      occurrences: 1,
      lastOccurredAt: new Date(),
    });

    return NextResponse.json({ ok: true, created: true, errorId: errorLog._id });
  } catch (err) {
    console.error("Error logging endpoint error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
