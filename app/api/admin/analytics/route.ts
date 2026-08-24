import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { getAnalyticsDashboardData } from "@/app/lib/analyticsDb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    const startDate = searchParams.get("startDate") || null;
    const endDate = searchParams.get("endDate") || null;

    const data = await getAnalyticsDashboardData(timeRange, startDate, endDate);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Admin analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: (error as Error).message },
      { status: 500 }
    );
  }
}
