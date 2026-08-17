import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/models/Feedback";
import User from "@/app/models/User"; // Ensure User model is registered for populate
import { getAdminFeedbackSummary } from "@/app/lib/feedback";

export async function GET(request: Request) {
  try {
    // Admin auth: same pattern as /api/admin/users
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || (expectedSecret && adminSecret !== expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();
    // Ensure User model is loaded
    if (!User) {
      console.warn("User model not loaded");
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const labId = searchParams.get("labId") || undefined;
    const sortBy = searchParams.get("sortBy") || "recent";
    const expandLabId = searchParams.get("expand") || undefined;

    // Per-lab summary rows
    const summaryRows = await getAdminFeedbackSummary({
      status,
      labId,
      sortBy,
    });

    // If admin wants to expand a specific lab's comments
    let expandedComments: any[] = [];
    if (expandLabId) {
      const matchFilter: Record<string, any> = { labId: expandLabId };
      if (status) matchFilter.status = status;

      expandedComments = await (Feedback as any).find(matchFilter)
        .populate({
          path: "userId",
          select: "name email username avatar xp level bio",
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    }

    // Also fetch all recent feedbacks across all labs (with populated user info) for the live feed view
    const allMatchFilter: Record<string, any> = {};
    if (status) allMatchFilter.status = status;
    if (labId) allMatchFilter.labId = labId;

    const recentFeedbacks = await (Feedback as any).find(allMatchFilter)
      .populate({
        path: "userId",
        select: "name email username avatar xp level bio",
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Platform-wide aggregated stats
    const globalStats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          helpfulYes: { $sum: { $cond: [{ $eq: ["$helpful", true] }, 1, 0] } },
          helpfulNo: { $sum: { $cond: [{ $eq: ["$helpful", false] }, 1, 0] } },
          statusNew: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          statusReviewed: { $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] } },
          statusFixed: { $sum: { $cond: [{ $eq: ["$status", "fixed"] }, 1, 0] } },
          uniqueLabs: { $addToSet: "$labId" },
        },
      },
    ]);

    const raw = globalStats[0];
    const stats = raw
      ? {
          totalFeedback: raw.totalFeedback,
          avgRating: raw.avgRating ? parseFloat(raw.avgRating.toFixed(1)) : null,
          helpfulYes: raw.helpfulYes,
          helpfulNo: raw.helpfulNo,
          statusNew: raw.statusNew,
          statusReviewed: raw.statusReviewed,
          statusFixed: raw.statusFixed,
          uniqueLabsCount: raw.uniqueLabs?.length || 0,
        }
      : {
          totalFeedback: 0,
          avgRating: null,
          helpfulYes: 0,
          helpfulNo: 0,
          statusNew: 0,
          statusReviewed: 0,
          statusFixed: 0,
          uniqueLabsCount: 0,
        };

    return NextResponse.json({
      stats,
      rows: summaryRows,
      expandedComments,
      recentFeedbacks,
    });
  } catch (err) {
    console.error("Admin feedback GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch feedback", details: (err as Error).message },
      { status: 500 }
    );
  }
}
