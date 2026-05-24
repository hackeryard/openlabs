import OpenAI from "openai";
import { NextResponse } from "next/server";

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
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
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
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are OpenLabs AI Assistant. Follow the user's instructions carefully."
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

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: error?.status || 500 }
    );
  }
}
