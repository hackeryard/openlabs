import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { getLabFeedbackStats, getLabRecentComments } from "@/app/lib/feedback";

export async function GET(
  req: Request,
  { params }: { params: { labId: string } }
) {
  try {
    await connectDB();

    // labId comes URL-encoded (e.g. "chemistry%2Felectrochemistry")
    const labId = decodeURIComponent(params.labId);

    const [stats, recentComments] = await Promise.all([
      getLabFeedbackStats(labId),
      getLabRecentComments(labId, 10),
    ]);

    return NextResponse.json({
      labId,
      ...stats,
      recentComments,
    });
  } catch (err) {
    console.error("Feedback GET error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
