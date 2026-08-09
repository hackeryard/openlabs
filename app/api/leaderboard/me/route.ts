import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const payload = getUserFromToken();
    if (!payload) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const currentUser = await (User as any).findById(payload.id).select("username xp subjectProgress");
    if (!currentUser || !currentUser.username) {
      return Response.json({ error: "User not found or no username set" }, { status: 404 });
    }

    // Calculate Global Rank
    const globalRank = await (User as any).countDocuments({ 
      profileSetupComplete: true,
      email: { $ne: "rahulrajput3621@gmail.com" },
      xp: { $gt: currentUser.xp } 
    }) + 1;

    // Calculate Subject Ranks
    const subjectRanks: Record<string, number> = {};
    const subjects = ["physics", "chemistry", "biology", "computerScience"];

    for (const subject of subjects) {
      const userSubProg = currentUser.subjectProgress?.find((s: any) => s.subject === subject);
      const userSubXp = userSubProg?.xp || 0;

      // Count users who have more xp in this subject
      // Mongoose query using dot notation in array of documents
      const count = await (User as any).countDocuments({
        profileSetupComplete: true,
        email: { $ne: "rahulrajput3621@gmail.com" },
        subjectProgress: {
          $elemMatch: {
            subject: subject,
            xp: { $gt: userSubXp }
          }
        }
      });
      subjectRanks[subject] = count + 1;
    }

    return Response.json({ 
      success: true, 
      globalRank, 
      subjectRanks 
    });
  } catch (err) {
    console.error("Leaderboard ME GET error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
