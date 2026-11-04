import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import IntegrationEvent from "@/app/models/IntegrationEvent";

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const eventType = searchParams.get("eventType");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));

    const filterObj: Record<string, any> = {};
    if (organizationId) {
      filterObj.organizationId = organizationId;
    }
    if (eventType) {
      filterObj.eventType = eventType;
    }

    const events = await (IntegrationEvent as any)
      .find(filterObj)
      .populate("organizationId", "name slug")
      .populate("actorUserId", "name email")
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      events,
      total: events.length,
    });
  } catch (error) {
    console.error("Failed to load integration events:", error);
    return NextResponse.json(
      { error: "Failed to load audit events" },
      { status: 500 }
    );
  }
}

