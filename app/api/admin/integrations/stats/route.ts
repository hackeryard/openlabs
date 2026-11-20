import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import Organization from "@/app/models/Organization";
import ApiKey from "@/app/models/ApiKey";
import ApiUsage from "@/app/models/ApiUsage";

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

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalOrganizations,
      activeOrganizations,
      suspendedOrganizations,
      totalApiKeys,
      activeApiKeys,
      totalRequests,
      requests30d,
      requests24h,
      rateLimitViolations30d,
      errors30d,
      topOrganizationsAgg,
    ] = await Promise.all([
      (Organization as any).countDocuments({}),
      (Organization as any).countDocuments({ status: "active" }),
      (Organization as any).countDocuments({ status: "suspended" }),
      (ApiKey as any).countDocuments({}),
      (ApiKey as any).countDocuments({ status: "active" }),
      (ApiUsage as any).countDocuments({}),
      (ApiUsage as any).countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      (ApiUsage as any).countDocuments({ timestamp: { $gte: twentyFourHoursAgo } }),
      (ApiUsage as any).countDocuments({
        timestamp: { $gte: thirtyDaysAgo },
        statusCode: 429,
      }),
      (ApiUsage as any).countDocuments({
        timestamp: { $gte: thirtyDaysAgo },
        statusCode: { $gte: 400, $ne: 429 },
      }),
      (ApiUsage as any).aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$organizationId", requestCount: { $sum: 1 } } },
        { $sort: { requestCount: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Populate top organizations details
    const topOrgIds = topOrganizationsAgg.map((item: any) => item._id);
    const orgDocs = await (Organization as any)
      .find({ _id: { $in: topOrgIds } })
      .select("name slug plan status")
      .lean();

    const orgMap = new Map(orgDocs.map((o: any) => [o._id.toString(), o]));
    const topOrganizations = topOrganizationsAgg.map((item: any) => {
      const org = orgMap.get(item._id.toString()) as any;
      return {
        organizationId: item._id,
        name: org?.name || "Unknown Organization",
        slug: org?.slug || "unknown",
        plan: org?.plan?.name || "pilot",
        status: org?.status || "active",
        requests30d: item.requestCount,
      };
    });

    return NextResponse.json({
      system: {
        status: "operational",
        serverTimestamp: now.toISOString(),
      },
      organizations: {
        total: totalOrganizations,
        active: activeOrganizations,
        suspended: suspendedOrganizations,
      },
      keys: {
        total: totalApiKeys,
        active: activeApiKeys,
      },
      usage: {
        totalRequests,
        requests30d,
        requests24h,
        rateLimitViolations30d,
        errors30d,
        topOrganizations,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin integrations stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch integration telemetry" },
      { status: 500 }
    );
  }
}

