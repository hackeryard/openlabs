import Feedback from "@/app/models/Feedback";

/**
 * Precomputed per-lab feedback statistics.
 * Runs a single aggregation pipeline instead of loading all docs.
 */
export async function getLabFeedbackStats(labId: string) {
  const stats = await Feedback.aggregate([
    { $match: { labId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        helpfulYes: {
          $sum: { $cond: [{ $eq: ["$helpful", true] }, 1, 0] },
        },
        helpfulNo: {
          $sum: { $cond: [{ $eq: ["$helpful", false] }, 1, 0] },
        },
        total: { $sum: 1 },
        withRating: {
          $sum: { $cond: [{ $ne: ["$rating", null] }, 1, 0] },
        },
        withComment: {
          $sum: {
            $cond: [
              { $and: [{ $ne: ["$comment", ""] }, { $ne: ["$comment", null] }] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const raw = stats[0];
  if (!raw) {
    return {
      avgRating: null,
      helpfulPct: null,
      helpfulYes: 0,
      helpfulNo: 0,
      total: 0,
      withRating: 0,
      withComment: 0,
    };
  }

  const helpfulTotal = raw.helpfulYes + raw.helpfulNo;
  return {
    avgRating: raw.avgRating ? parseFloat(raw.avgRating.toFixed(1)) : null,
    helpfulPct: helpfulTotal > 0 ? parseFloat(((raw.helpfulYes / helpfulTotal) * 100).toFixed(1)) : null,
    helpfulYes: raw.helpfulYes,
    helpfulNo: raw.helpfulNo,
    total: raw.total,
    withRating: raw.withRating,
    withComment: raw.withComment,
  };
}

/**
 * Get recent comments for a lab (public-safe — no sessionId/userId/userAgent).
 */
export async function getLabRecentComments(labId: string, limit = 10) {
  const docs = await (Feedback as any).find({
    labId,
    comment: { $ne: "" },
  })
    .select("rating category comment helpful createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return docs;
}

/**
 * Admin: get aggregated per-lab feedback summary rows.
 */
export async function getAdminFeedbackSummary(filters: {
  status?: string;
  labId?: string;
  sortBy?: string;
}) {
  const matchStage: Record<string, any> = {};
  if (filters.status) matchStage.status = filters.status;
  if (filters.labId) matchStage.labId = filters.labId;

  const pipeline: any[] = [];
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({
    $group: {
      _id: "$labId",
      avgRating: { $avg: "$rating" },
      helpfulYes: {
        $sum: { $cond: [{ $eq: ["$helpful", true] }, 1, 0] },
      },
      helpfulNo: {
        $sum: { $cond: [{ $eq: ["$helpful", false] }, 1, 0] },
      },
      total: { $sum: 1 },
      statusNew: {
        $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
      },
      statusReviewed: {
        $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] },
      },
      statusFixed: {
        $sum: { $cond: [{ $eq: ["$status", "fixed"] }, 1, 0] },
      },
      latestAt: { $max: "$createdAt" },
    },
  });

  // Sort options
  switch (filters.sortBy) {
    case "lowRating":
      pipeline.push({ $sort: { avgRating: 1, total: -1 } });
      break;
    case "highTraffic":
      pipeline.push({ $sort: { total: -1 } });
      break;
    case "recent":
    default:
      pipeline.push({ $sort: { latestAt: -1 } });
      break;
  }

  const rows = await Feedback.aggregate(pipeline);

  return rows.map((r: any) => {
    const helpfulTotal = r.helpfulYes + r.helpfulNo;
    return {
      labId: r._id,
      avgRating: r.avgRating ? parseFloat(r.avgRating.toFixed(1)) : null,
      helpfulPct: helpfulTotal > 0 ? parseFloat(((r.helpfulYes / helpfulTotal) * 100).toFixed(1)) : null,
      total: r.total,
      statusNew: r.statusNew,
      statusReviewed: r.statusReviewed,
      statusFixed: r.statusFixed,
      latestAt: r.latestAt,
    };
  });
}
