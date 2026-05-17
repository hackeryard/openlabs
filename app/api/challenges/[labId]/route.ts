import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import DailyChallenge from "@/app/models/DailyChallenge";

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

    // Omit targetValue and tolerance
    const { targetValue, tolerance, ...publicChallenge } = challenge as any;

    return NextResponse.json({ challenge: publicChallenge });
  } catch (err) {
    console.error("Fetch challenge error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
