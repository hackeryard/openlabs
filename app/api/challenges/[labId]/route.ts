import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import DailyChallenge from "@/app/models/DailyChallenge";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import User from "@/app/models/User";

export async function GET(req: Request, { params }: { params: { labId: string } }) {
  try {
    await connectDB();
    
    const labId = decodeURIComponent(params.labId);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const challenge = await (DailyChallenge as any).findOne({ labId, date: today }).lean();

    if (!challenge) {
      return NextResponse.json({ challenge: null });
    }

    let alreadyCompleted = false;
    const payload = getUserFromToken();
    if (payload) {
       const user = await (User as any).findById(payload.id).lean();
       if (user && user.dailyChallenges) {
         const todayStr = today.toISOString().split("T")[0];
         const existing = user.dailyChallenges.find(
           (dc: any) => dc.labId === labId && dc.date.toISOString().startsWith(todayStr) && dc.completed
         );
         if (existing) alreadyCompleted = true;
       }
    }

    // Omit targetValue and tolerance
    const { targetValue, tolerance, ...publicChallenge } = challenge as any;

    return NextResponse.json({ challenge: publicChallenge, alreadyCompleted });
  } catch (err) {
    console.error("Fetch challenge error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
