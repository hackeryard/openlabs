import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const subject = searchParams.get("subject") || "all";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    
    let sortQuery: any = {};
    let query: any = { 
      profileSetupComplete: true, 
      email: { $ne: "rahulrajput3621@gmail.com" } 
    }; // Only show fully setup profiles, excluding main admin account

    if (subject === "all") {
      sortQuery = { xp: -1 };
    } else {
      // Sort by specific subject xp in subjectProgress array
      sortQuery = { "subjectProgress.xp": -1 }; // MongoDB will sort by the highest matching element in the array if we match it, but we need an aggregation pipeline or simple sorting. Actually, simple sorting by an array field sorts by the maximum value in the array, which isn't right if we only want the specific subject.
      // We should use an aggregation pipeline for accurate subject sorting.
    }

    let users;

    if (subject === "all") {
      users = await (User as any).find(query)
        .sort(sortQuery)
        .limit(limit)
        .select("username name avatar level xp subjectProgress");
    } else {
      // Aggregation for accurate subject sorting
      users = await (User as any).aggregate([
        { $match: query },
        { $unwind: "$subjectProgress" },
        { $match: { "subjectProgress.subject": subject } },
        { $sort: { "subjectProgress.xp": -1 } },
        { $limit: limit },
        {
          $project: {
            username: 1,
            name: 1,
            avatar: 1,
            level: 1,
            xp: 1,
            subjectProgress: {
              subject: "$subjectProgress.subject",
              xp: "$subjectProgress.xp",
              level: "$subjectProgress.level"
            }
          }
        }
      ]);
      
      // we should wrap subjectProgress back into an array to match the schema format expected by the frontend
      users = users.map((u: any) => ({
        ...u,
        subjectProgress: [u.subjectProgress]
      }));
    }

    return Response.json({ success: true, users });
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
