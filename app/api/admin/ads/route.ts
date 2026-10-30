import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import AdSettings from "@/app/models/AdSettings";

export const dynamic = "force-dynamic";

function parseDurationMs(duration: string | number): number {
  if (typeof duration === "number") {
    // If number, treat as minutes
    return duration * 60 * 1000;
  }
  const str = String(duration).trim().toLowerCase();

  // If ISO date string, calculate difference
  if (str.includes("t") || str.includes("-")) {
    const targetDate = new Date(str);
    if (!isNaN(targetDate.getTime())) {
      return Math.max(0, targetDate.getTime() - Date.now());
    }
  }

  // Parse strings like "15m", "1h", "24h", "1d", "7d"
  const match = str.match(/^(\d+(?:\.\d+)?)\s*([mhd])$/);
  if (!match) {
    // Fallback: try parsing number of minutes
    const num = parseFloat(str);
    return isNaN(num) ? 60 * 60 * 1000 : num * 60 * 1000;
  }

  const value = parseFloat(match[1]);
  const unit = match[2];

  if (unit === "m") return value * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  if (unit === "d") return value * 24 * 60 * 60 * 1000;

  return 60 * 60 * 1000;
}

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Staff authentication required" },
        { status: auth.status }
      );
    }

    await connectDB();
    const effective = await AdSettings.getEffectiveSettings();
    const raw = await AdSettings.findOne({ key: "default" }).lean();

    return NextResponse.json(
      {
        settings: effective,
        raw,
        serverTime: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin ads GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error fetching ad settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Staff authentication required" },
        { status: auth.status }
      );
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Monetization controls require Administrator privileges" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, duration, reason, enabled, networks } = body;

    await connectDB();

    let doc = await AdSettings.findOne({ key: "default" });
    if (!doc) {
      doc = await AdSettings.create({ key: "default" });
    }

    doc.lastUpdatedBy = auth.userId || "admin";

    switch (action) {
      case "toggle_master": {
        doc.globalAdsEnabled = typeof enabled === "boolean" ? enabled : !doc.globalAdsEnabled;
        if (!doc.globalAdsEnabled) {
          doc.snoozeUntil = null;
          doc.snoozeReason = "";
        }
        break;
      }

      case "snooze": {
        const ms = parseDurationMs(duration);
        if (ms <= 0) {
          return NextResponse.json(
            { error: "Invalid snooze duration provided" },
            { status: 400 }
          );
        }
        doc.snoozeUntil = new Date(Date.now() + ms);
        doc.snoozeReason = typeof reason === "string" ? reason.trim() : "Temporarily paused by administrator";
        doc.globalAdsEnabled = true; // Ensure master toggle remains enabled so it resumes automatically when snooze expires
        break;
      }

      case "resume": {
        doc.snoozeUntil = null;
        doc.snoozeReason = "";
        doc.globalAdsEnabled = true;
        break;
      }

      case "disable": {
        doc.globalAdsEnabled = false;
        doc.snoozeUntil = null;
        doc.snoozeReason = "";
        break;
      }

      case "update_networks": {
        if (networks && typeof networks === "object") {
          if (typeof networks.googleAdSense === "boolean") {
            doc.networks.googleAdSense = networks.googleAdSense;
          }
          if (typeof networks.adsterraPopunder === "boolean") {
            doc.networks.adsterraPopunder = networks.adsterraPopunder;
          }
          if (typeof networks.adsterraBanners === "boolean") {
            doc.networks.adsterraBanners = networks.adsterraBanners;
          }
        }
        break;
      }

      default: {
        return NextResponse.json(
          { error: `Unknown action '${action}'. Valid actions: toggle_master, snooze, resume, disable, update_networks` },
          { status: 400 }
        );
      }
    }

    await doc.save();

    const updatedEffective = await AdSettings.getEffectiveSettings();

    return NextResponse.json({
      success: true,
      message: `Ad operation '${action}' executed successfully`,
      settings: updatedEffective,
      serverTime: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Admin ads mutation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error mutating ad settings" },
      { status: 500 }
    );
  }
}
