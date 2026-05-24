import OpenAI from "openai";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

const openai = new OpenAI({
  apiKey: process.env.CHATBOT_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  try {
    if (!process.env.CHATBOT_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration: Missing API key" },
        { status: 500 }
      );
    }

    // 1. Authenticate user from JWT token cookie
    await connectDB();
    const payload = getUserFromToken();
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to use the AI chatbot" },
        { status: 401 }
      );
    }

    // 2. Fetch raw MongoDB user document (bypassing cached Mongoose schemas)
    const db = mongoose.connection.db;
    const userObjectId = new mongoose.Types.ObjectId(payload.id);
    const userDoc = await db.collection("users").findOne({ _id: userObjectId });
    
    if (!userDoc) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let aiQueriesCount = userDoc.aiQueriesCount ?? 0;
    let lastAiQueryDate = userDoc.lastAiQueryDate ?? null;

    // Reset query count if it's a new day
    if (lastAiQueryDate !== todayStr) {
      aiQueriesCount = 0;
      lastAiQueryDate = todayStr;
      
      await db.collection("users").updateOne(
        { _id: userObjectId },
        { $set: { aiQueriesCount: 0, lastAiQueryDate: todayStr } }
      );
    }

    // Block request if user has reached daily quota
    if (aiQueriesCount >= 10) {
      return NextResponse.json(
        {
          error: "Daily Limit Reached",
          reply: "⚠️ You have reached your daily limit of 10 AI queries. Please try again tomorrow!",
          remainingQueries: 0
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 3. Request Completion from LLM (Soften instructions to avoid false-refusal on theory/STEM questions)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are OpenLabs AI Assistant. You are a friendly, highly helpful educational companion designed to help students learn STEM subjects (Physics, Chemistry, Biology, Computer Science, Mathematics) and understand the lab experiments. You must answer all academic, scientific, coding, or learning-related questions with great detail and support. Refuse to answer ONLY if the question is completely and obviously off-topic and has absolutely nothing to do with science, coding, technology, mathematics, academic subjects, or the OpenLabs platform (for example, queries about general non-scientific history, entertainment, cooking recipes, gossip, or general chit-chat)."
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });
    
    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    // 4. Increment usage counter directly in MongoDB
    await db.collection("users").updateOne(
      { _id: userObjectId },
      { 
        $inc: { aiQueriesCount: 1 },
        $set: { lastAiQueryDate: todayStr }
      }
    );

    const remaining = Math.max(0, 10 - (aiQueriesCount + 1));

    return NextResponse.json({ reply, remainingQueries: remaining });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: error?.status || 500 }
    );
  }
}
