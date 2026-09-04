import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import { parseDateFilter } from "@/app/lib/analyticsDb";
import PageView from "@/app/models/PageView";
import User from "@/app/models/User"; // Ensure User model is loaded for populate

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
    if (!User) {
      console.warn("User model not initialized");
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(200, Math.max(5, parseInt(searchParams.get("limit") || "50", 10)));
    const timeRange = searchParams.get("timeRange") || "all";
    const startDateParam = searchParams.get("startDate") || null;
    const endDateParam = searchParams.get("endDate") || null;
    const userType = searchParams.get("userType") || "all";
    const query = searchParams.get("query")?.trim() || "";
    const device = searchParams.get("device") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    const { matchStage } = parseDateFilter(timeRange, startDateParam, endDateParam);
    const andConditions: any[] = [{ createdAt: matchStage.createdAt }];

    if (device && device !== "all") {
      andConditions.push({ device });
    }

    if (userType === "anonymous") {
      andConditions.push({ userId: null });
    } else if (userType === "authenticated") {
      andConditions.push({ userId: { $ne: null } });
    } else if (userType === "new") {
      andConditions.push({
        $or: [
          { isReturning: false },
          { isReturning: { $exists: false }, visitCount: { $lte: 1 } },
        ],
      });
    } else if (userType === "returning") {
      andConditions.push({
        $or: [
          { isReturning: true },
          { visitCount: { $gt: 1 } },
        ],
      });
    }

    if (query) {
      const regex = new RegExp(query, "i");
      andConditions.push({
        $or: [
          { pathname: regex },
          { title: regex },
          { labId: regex },
          { referrerDomain: regex },
          { country: regex },
          { city: regex },
          { browser: regex },
          { os: regex },
          { visitorId: regex },
          { sessionId: regex },
          { utmSource: regex },
          { utmCampaign: regex },
        ],
      });
    }

    const filterObj = andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

    // Sort mapping
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sortBy) {
      case "createdAt_asc":
        sortObj = { createdAt: 1 };
        break;
      case "duration_desc":
        sortObj = { duration: -1, createdAt: -1 };
        break;
      case "duration_asc":
        sortObj = { duration: 1, createdAt: -1 };
        break;
      case "scroll_desc":
        sortObj = { scrollDepth: -1, createdAt: -1 };
        break;
      case "createdAt_desc":
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    // Parallel fetch: records + total count
    const [pageviews, totalCount] = await Promise.all([
      (PageView as any)
        .find(filterObj)
        .populate({
          path: "userId",
          select: "name email username avatar level xp",
        })
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      (PageView as any).countDocuments(filterObj),
    ]);

    const formattedPageviews = pageviews.map((pv: any) => ({
      ...pv,
      isReturning: Boolean(pv.isReturning || (pv.visitCount && pv.visitCount > 1)),
      visitCount: typeof pv.visitCount === "number" ? pv.visitCount : 1,
    }));

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json(
      {
        pageviews: formattedPageviews,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin paginated pageviews fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch paginated pageviews",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
