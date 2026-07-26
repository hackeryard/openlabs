import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import mongoose from "mongoose";

type PublicUser = {
  name?: string;
  username?: string;
  avatar?: string | null;
  bio?: string;
  xp?: number;
  level?: number;
  streak?: number;
  badges?: any[];
  subjectProgress?: any[];
  completedExperiments?: any[];
  activityLog?: any[];
  profileSetupComplete?: boolean;
}

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    await connectDB();

    const username = (params.username || "").toLowerCase().trim();
    if (!username) return Response.json({ error: "Username or ID required" }, { status: 400 });

    let user: PublicUser | null = null;
    if (mongoose.Types.ObjectId.isValid(username)) {
      user = (await (User as any).findById(username).select("-password -email").lean()) as PublicUser | null;
    }

    if (!user) {
      user = (await (User as any).findOne({ username }).select("-password -email").lean()) as PublicUser | null;
    }

    if (!user) return Response.json({ error: "Not found" }, { status: 404 });

    const publicUser = {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges || [],
      subjectProgress: user.subjectProgress || [],
      profileSetupComplete: user.profileSetupComplete || false,
    };

    return Response.json({ user: publicUser });
  } catch (err) {
    console.error("/api/profile/[username] error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
