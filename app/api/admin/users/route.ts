import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { verifyAdminAccess } from "@/app/lib/adminAuth";

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const filterVerified = searchParams.get("verified");
    const filterProfileComplete = searchParams.get("profileComplete");
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // Build filter object
    const filterObj: Record<string, any> = {};

    if (query) {
      const regex = new RegExp(query, "i");
      filterObj.$or = [{ name: regex }, { email: regex }, { username: regex }, { bio: regex }];
    }

    if (filterVerified === "true") {
      filterObj.emailVerified = true;
    } else if (filterVerified === "false") {
      filterObj.emailVerified = false;
    }

    if (filterProfileComplete === "true") {
      filterObj.profileSetupComplete = true;
    } else if (filterProfileComplete === "false") {
      filterObj.profileSetupComplete = false;
    }

    // Build sort object
    let sortObj: Record<string, number> = { createdAt: -1 };
    switch (sortBy) {
      case "createdAt_asc":
        sortObj = { createdAt: 1 };
        break;
      case "createdAt_desc":
        sortObj = { createdAt: -1 };
        break;
      case "xp_desc":
        sortObj = { xp: -1 };
        break;
      case "xp_asc":
        sortObj = { xp: 1 };
        break;
      case "level_desc":
        sortObj = { level: -1 };
        break;
      case "streak_desc":
        sortObj = { streak: -1 };
        break;
      case "ai_desc":
        sortObj = { aiQueriesCount: -1 };
        break;
      case "name_asc":
        sortObj = { name: 1 };
        break;
      case "name_desc":
        sortObj = { name: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // High-performance lean projection: fetch only what is needed for the dashboard listing
    const rawUsers = await (User as any)
      .find(filterObj)
      .select("name email role username avatar bio emailVerified profileSetupComplete createdAt xp level streak highestStreak lastActiveDate aiQueriesCount completedExperiments badges subjectProgress location loginHistory")
      .sort(sortObj)
      .lean();

    // Map to optimized lightweight response format
    const users = rawUsers.map((u: any) => ({
      _id: u._id,
      name: u.name || "Anonymous",
      email: u.email,
      role: u.role || "user",
      username: u.username || null,
      avatar: u.avatar || null,
      bio: u.bio || "",
      emailVerified: Boolean(u.emailVerified),
      profileSetupComplete: Boolean(u.profileSetupComplete),
      createdAt: u.createdAt,
      xp: u.xp || 0,
      level: u.level || 1,
      streak: u.streak || 0,
      highestStreak: u.highestStreak || u.streak || 0,
      lastActiveDate: u.lastActiveDate || null,
      aiQueriesCount: u.aiQueriesCount || 0,
      completedExperimentsCount: u.completedExperiments?.length || 0,
      badgesCount: u.badges?.length || 0,
      subjectCount: u.subjectProgress?.length || 0,
      location: u.location || null,
      loginHistoryCount: u.loginHistory?.length || 0,
    }));



    // Compute aggregated platform statistics in a single pass
    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter((u: any) => u.emailVerified).length,
      profileCompleted: users.filter((u: any) => u.profileSetupComplete).length,
      totalXpEarned: users.reduce((acc: number, u: any) => acc + u.xp, 0),
      totalExperimentsCompleted: users.reduce(
        (acc: number, u: any) => acc + u.completedExperimentsCount,
        0
      ),
      totalAiQueries: users.reduce((acc: number, u: any) => acc + u.aiQueriesCount, 0),
    };

    return NextResponse.json({ users, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}
