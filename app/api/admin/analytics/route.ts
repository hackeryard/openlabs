import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { getAnalyticsDashboardData } from "@/app/lib/analyticsDb";

export async function GET(request: Request) {
  try {
    // Admin auth
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || (expectedSecret && adminSecret !== expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "7d";

    const data = await getAnalyticsDashboardData(timeRange);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Admin analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: (error as Error).message },
      { status: 500 }
    );
  }
}
