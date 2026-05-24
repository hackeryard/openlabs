import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { calculateLevel, calculateXPReward } from "@/app/lib/xp";

export async function POST(req: Request) {
  try {
    await connectDB();

    const payload = getUserFromToken();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { labId, subject, type } = await req.json();

    const user = await (User as any).findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const expRecord = user.completedExperiments.find((ce: any) => ce.experimentId === labId);
    let firstTime = false;

    if (expRecord) {
      const lastCompleted = new Date(expRecord.completedAt);
      lastCompleted.setUTCHours(0, 0, 0, 0);

      if (lastCompleted.getTime() === today.getTime()) {
        return NextResponse.json({ alreadyCompleted: true });
      }
      expRecord.timesVisited += 1;
      expRecord.completedAt = new Date();
    } else {
      firstTime = true;
      user.completedExperiments.push({
        experimentId: labId,
        subject,
        completedAt: new Date(),
        xpEarned: 0,
        timesVisited: 1,
      });
    }

    const xpReward = calculateXPReward(type, false, "easy");
    
    const activeExpRecord = user.completedExperiments.find((ce: any) => ce.experimentId === labId);
    if (activeExpRecord) activeExpRecord.xpEarned += xpReward;

    const freshUser = await (User as any).findById(payload.id).select('xp').lean();
    user.xp = (freshUser?.xp || 0) + xpReward;
    
    const currentLevel = user.level || 1;
    const newLevel = calculateLevel(user.xp);
    const leveledUp = newLevel > currentLevel;
    user.level = newLevel;

    let subjectProg = user.subjectProgress.find((sp: any) => sp.subject === subject);
    if (!subjectProg) {
      subjectProg = { subject, xp: 0, level: 1, experimentsCompleted: 0 };
      user.subjectProgress.push(subjectProg);
    }
    subjectProg.xp += xpReward;
    subjectProg.level = calculateLevel(subjectProg.xp);
    subjectProg.experimentsCompleted += 1;

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) lastActive.setUTCHours(0, 0, 0, 0);

    // Only update streak once per calendar day
    const alreadyActiveToday = lastActive && lastActive.getTime() === today.getTime();
    if (!alreadyActiveToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive && lastActive.getTime() === yesterday.getTime()) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = new Date();
    }

    const dateStr = today.toISOString().split("T")[0];
    let log = user.activityLog.find((al: any) => al.date === dateStr);
    if (log) {
      log.count += 1;
    } else {
      user.activityLog.push({ date: dateStr, count: 1 });
    }

    await user.save();

    return NextResponse.json({
      xpEarned: xpReward,
      newLevel,
      leveledUp,
      firstTime,
    });
  } catch (err) {
    console.error("Complete XP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
