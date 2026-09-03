import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/models/Feedback";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { LABS } from "@/app/lib/labs";
import { calculateLevel } from "@/app/lib/xp";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { labId, sessionId, helpful, rating, category, comment, labStep } = body;

    // Validate required fields
    if (!labId || !sessionId) {
      return NextResponse.json(
        { error: "labId and sessionId are required" },
        { status: 400 }
      );
    }

    // Validate labId exists in registry
    const labExists = LABS.find((l) => l.id === labId);
    if (!labExists) {
      return NextResponse.json(
        { error: "Unknown labId" },
        { status: 400 }
      );
    }

    // Sanitize comment: strip HTML tags, trim whitespace, cap at 500 chars
    let sanitizedComment = "";
    if (comment) {
      sanitizedComment = String(comment)
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 500);
    }

    // Validate rating range if provided
    const parsedRating =
      rating !== undefined && rating !== null && rating !== ""
        ? Number(rating)
        : null;

    if (parsedRating !== null && (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Business Rules Enforcement:
    // 1. If helpful === true: rating is mandatory (1-5). If rating < 3, comment is mandatory too.
    if (helpful === true) {
      if (!parsedRating) {
        return NextResponse.json(
          { error: "Rating is mandatory when feedback is marked helpful" },
          { status: 400 }
        );
      }
      if (parsedRating < 3 && !sanitizedComment) {
        return NextResponse.json(
          { error: "Comment is mandatory for ratings below 3 stars" },
          { status: 400 }
        );
      }
    }

    // 2. If helpful === false: comment is mandatory.
    if (helpful === false) {
      if (!sanitizedComment) {
        return NextResponse.json(
          { error: "Comment is mandatory when feedback is marked not helpful" },
          { status: 400 }
        );
      }
    }

    // 3. If helpful is not specified (e.g. general modal feedback): at least rating or comment must be provided
    if (helpful === undefined || helpful === null) {
      if (!parsedRating && !sanitizedComment) {
        return NextResponse.json(
          { error: "Either a rating or comment is required" },
          { status: 400 }
        );
      }
      if (parsedRating && parsedRating < 3 && !sanitizedComment) {
        return NextResponse.json(
          { error: "Comment is mandatory for ratings below 3 stars" },
          { status: 400 }
        );
      }
    }

    // Rate-limit: check for existing submission from this session+lab in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingFeedback = await (Feedback as any).findOne({
      sessionId,
      labId,
      createdAt: { $gte: twentyFourHoursAgo },
    }).sort({ createdAt: -1 });

    // Get authenticated user (optional — anonymous feedback is allowed)
    let userId = null;
    try {
      const payload = getUserFromToken();
      if (payload?.id) userId = payload.id;
    } catch {
      // Anonymous submission — that's fine
    }

    const userAgent = req.headers.get("user-agent") || undefined;

    if (existingFeedback) {
      // PATCH: upgrade existing pulse into deep feedback (or update fields)
      if (helpful !== undefined) existingFeedback.helpful = helpful;
      if (parsedRating !== null) existingFeedback.rating = parsedRating;
      if (category) existingFeedback.category = category;
      if (sanitizedComment) existingFeedback.comment = sanitizedComment;
      if (labStep) existingFeedback.labStep = labStep;
      if (userId && !existingFeedback.userId) existingFeedback.userId = userId;

      await existingFeedback.save();

      return NextResponse.json({
        updated: true,
        feedbackId: existingFeedback._id,
      });
    }

    // CREATE: new feedback entry
    const feedback = await Feedback.create({
      labId,
      userId,
      sessionId,
      helpful: helpful !== undefined ? helpful : null,
      rating: parsedRating,
      category: category || null,
      comment: sanitizedComment,
      labStep: labStep || null,
      userAgent,
    });

    // Gamification: award +10 XP on first feedback per lab & Contributor badge
    let xpAwarded = 0;
    if (userId) {
      try {
        const priorFeedback = await (Feedback as any).findOne({
          userId,
          labId,
          _id: { $ne: feedback._id },
        });

        if (!priorFeedback) {
          const user = await (User as any).findById(userId);
          if (user) {
            xpAwarded = 10;
            user.xp = (user.xp || 0) + 10;
            user.level = calculateLevel(user.xp);

            // Contributor badge check (5+ feedback submissions)
            const totalUserFeedbacks = await (Feedback as any).countDocuments({ userId });
            if (totalUserFeedbacks >= 5) {
              const hasBadge = user.badges?.some((b: any) => b.id === "contributor");
              if (!hasBadge) {
                user.badges = user.badges || [];
                user.badges.push({
                  id: "contributor",
                  name: "Contributor",
                  earnedAt: new Date(),
                });
              }
            }

            await user.save();
          }
        }
      } catch (xpErr) {
        console.error("Feedback XP award error:", xpErr);
      }
    }

    return NextResponse.json({
      created: true,
      feedbackId: feedback._id,
      xpAwarded,
    });
  } catch (err) {
    console.error("Feedback POST error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
