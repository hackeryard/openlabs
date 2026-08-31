import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import DailyChallenge from "@/app/models/DailyChallenge";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { calculateLevel, calculateXPReward } from "@/app/lib/xp";
import { getLabById } from "@/app/lib/labs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const payload = getUserFromToken();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { labId, targetParam, achievedValue, date } = await req.json();

    const challengeDate = new Date(date);
    challengeDate.setUTCHours(0, 0, 0, 0);

    const challenge = await (DailyChallenge as any).findOne({
      labId,
      date: challengeDate,
    }).lean();

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const user = await (User as any).findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingAttempt = user.dailyChallenges.find(
      (dc: any) => dc.labId === labId && new Date(dc.date).getTime() === challengeDate.getTime()
    );

    if (existingAttempt && existingAttempt.completed) {
      return NextResponse.json({ alreadyCompleted: true });
    }

    // Check if target param matches and value is within tolerance
    const isCorrect = challenge.targetParam === targetParam &&
      Math.abs(achievedValue - challenge.targetValue) <= (challenge.tolerance || 0);

    if (!isCorrect) {
      if (existingAttempt) {
        existingAttempt.attempts += 1;
      } else {
        user.dailyChallenges.push({
          labId,
          date: challengeDate,
          completed: false,
          attempts: 1,
          xpEarned: 0,
        });
      }
      await user.save();
      return NextResponse.json({ 
        correct: false, 
        attempts: existingAttempt ? existingAttempt.attempts : 1 
      });
    }

    const lab = getLabById(labId);
    const type = lab ? lab.type : "simulation";
    const xpReward = calculateXPReward(type, true, challenge.difficulty);

    const freshUser = await (User as any).findById(payload.id).select('xp').lean();
    user.xp = (freshUser?.xp || 0) + xpReward;
    
    const currentLevel = user.level || 1;
    const newLevel = calculateLevel(user.xp);
    const leveledUp = newLevel > currentLevel;
    user.level = newLevel;

    // subject progress
    let subjectProg = user.subjectProgress.find((sp: any) => sp.subject === challenge.subject);
    if (!subjectProg) {
      subjectProg = { subject: challenge.subject, xp: 0, level: 1, experimentsCompleted: 0 };
      user.subjectProgress.push(subjectProg);
    }
    subjectProg.xp += xpReward;
    subjectProg.level = calculateLevel(subjectProg.xp);
    subjectProg.experimentsCompleted += 1;

    if (existingAttempt) {
      existingAttempt.completed = true;
      existingAttempt.attempts += 1;
      existingAttempt.xpEarned = xpReward;
    } else {
      user.dailyChallenges.push({
        labId,
        date: challengeDate,
        completed: true,
        attempts: 1,
        xpEarned: xpReward,
      });
    }

    // Streak and lastActiveDate
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) lastActive.setUTCHours(0, 0, 0, 0);

    // Only update streak once per calendar day
    const alreadyActiveToday = lastActive && lastActive.getTime() === today.getTime();
    if (!alreadyActiveToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive?.getTime() === yesterday.getTime()) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.highestStreak = Math.max(user.highestStreak || 0, user.streak || 0);
      user.lastActiveDate = new Date();
    }


    // Activity Log
    const dateStr = today.toISOString().split("T")[0];
    let log = user.activityLog.find((al: any) => al.date === dateStr);
    if (log) {
      log.count += 1;
    } else {
      user.activityLog.push({ date: dateStr, count: 1 });
    }

    // Badges
    const badgesEarned: string[] = [];
    const hasBadge = (name: string) => user.badges.some((b: any) => b.name === name);
    const addBadge = (name: string, id: string) => {
      if (!hasBadge(name)) {
        user.badges.push({ id, name, earnedAt: new Date(), pinned: false });
        badgesEarned.push(name);
      }
    };

    const completedChallengesCount = user.dailyChallenges.filter((dc: any) => dc.completed).length;
    if (completedChallengesCount === 1) addBadge("First Challenge", "first-challenge");
    if (user.streak >= 3) addBadge("3 Day Streak", "3-day-streak");
    if (user.streak >= 7) addBadge("7 Day Streak", "7-day-streak");

    if (subjectProg.experimentsCompleted >= 10) {
      addBadge("Subject Master", `subject-master-${challenge.subject}`);
    }

    await user.save();

    return NextResponse.json({
      correct: true,
      xpEarned: xpReward,
      newLevel,
      leveledUp,
      newStreak: user.streak,
      badgesEarned
    });

  } catch (err) {
    console.error("Validate challenge error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
