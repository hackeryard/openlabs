import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import DailyChallenge from "@/app/models/DailyChallenge";
import { LABS } from "@/app/lib/labs";
import { fetchOpenRouterWithFallback } from "@/app/lib/openrouter";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const xCronSecret = req.headers.get("x-cron-secret");
    
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      xCronSecret !== process.env.CRON_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await (DailyChallenge as any).deleteMany({ date: { $lt: today } });

    let generated = 0;
    let failed = 0;

    for (const lab of LABS.filter(l => l.challengeEnabled)) {
      try {
        const response = await fetchOpenRouterWithFallback({
          model: "openai/gpt-4o-mini",
          response_format: { type: "json_object" },
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: "You are a science teacher generating daily lab challenges. Return only valid JSON, no markdown.",
            },
            {
              role: "user",
              content: `Generate a challenge for ${lab.name} lab. Available params: ${lab.challengeParams.join(", ")}. Return: { "challenge": string, "hint": string, "targetParam": string, "targetValue": number, "tolerance": number, "difficulty": "easy"|"medium"|"hard" }. The challenge should be solvable by adjusting lab parameters. Be specific with target values.`,
            },
          ],
        });

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        const parsed = JSON.parse(content);
        const xpReward = parsed.difficulty === "hard" ? 100 : parsed.difficulty === "medium" ? 75 : 50;

        await (DailyChallenge as any).findOneAndUpdate(
          { labId: lab.id, date: today },
          {
            $set: {
              subject: lab.subject,
              challenge: parsed.challenge,
              hint: parsed.hint,
              targetParam: parsed.targetParam,
              targetValue: parsed.targetValue,
              tolerance: parsed.tolerance || 0,
              difficulty: parsed.difficulty || "easy",
              xpReward,
            }
          },
          { upsert: true, returnDocument: "after" }
        );

        generated++;
      } catch (err) {
        console.error(`Error generating challenge for lab ${lab.id}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ generated, failed });
  } catch (err) {
    console.error("Challenge generation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
