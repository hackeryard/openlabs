import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import AdSettings from "@/app/models/AdSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await AdSettings.getEffectiveSettings();

    return NextResponse.json(settings, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch (error: any) {
    console.error("Ad status query error:", error?.message || error);
    // Safe resilient fallback allowing ads by default if db is momentarily unreachable
    return NextResponse.json(
      {
        allowed: true,
        globalAdsEnabled: true,
        isSnoozed: false,
        snoozeUntil: null,
        snoozeReason: "",
        remainingMs: 0,
        networks: {
          googleAdSense: true,
          adsterraPopunder: true,
          adsterraBanners: true,
        },
        lastUpdatedBy: "fallback",
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
