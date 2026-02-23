import OpenAI from "openai";
import { NextResponse } from "next/server";

console.log("🔑 CHATBOT_API_KEY exists:", !!process.env.CHATBOT_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.CHATBOT_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Validate API Key Early
    if (!process.env.CHATBOT_API_KEY) {
      console.error("❌ Missing CHATBOT_API_KEY in environment");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing API key" },
        { status: 500 }
      );
    }

    // 2️⃣ Parse Request Body Safely
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { message, experimentTitle, experimentTheory } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("📩 Incoming message:", message);

    // 3️⃣ Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are OpenLabs AI, a smart lab assistant.
Explain experiments in very simple language.
Break down theory step-by-step.
If needed, give examples.
Experiment: ${experimentTitle}
Theory: ${experimentTheory}
          `,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("❌ No reply returned from OpenAI:", completion);
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    console.log("✅ AI reply generated");

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("🔥 OpenAI API Error:");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Full Error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: error?.status || 500 }
    );
  }
}