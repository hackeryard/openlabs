import OpenAI from "openai";
import { NextResponse } from "next/server";

console.log("🔑 CHATBOT_API_KEY exists:", !!process.env.CHATBOT_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.CHATBOT_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  // Request tracking ID for debugging
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🚀 [${requestId}] POST request started`);

  try {
    // 1️⃣ Validate API Key Early
    if (!process.env.CHATBOT_API_KEY) {
      console.error(`❌ [${requestId}] Missing CHATBOT_API_KEY in environment`);
      return NextResponse.json(
        { error: "Server misconfiguration: Missing API key" },
        { status: 500 }
      );
    }
    console.log(`✅ [${requestId}] CHATBOT_API_KEY verified`);

    // 2️⃣ Parse Request Body Safely
    let body;
    try {
      body = await req.json();
      console.log(`📦 [${requestId}] Request body parsed successfully`);
      console.log(`📦 [${requestId}] Body structure:`, {
        hasMessage: !!body?.message,
        messageLength: body?.message?.length,
        hasExperimentTitle: !!body?.experimentTitle,
        hasExperimentTheory: !!body?.experimentTheory,
        theoryLength: body?.experimentTheory?.length
      });
    } catch (parseError) {
      console.error(`❌ [${requestId}] Failed to parse request body:`, parseError);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { message, experimentTitle, experimentTheory } = body;

    if (!message) {
      console.warn(`⚠️ [${requestId}] Missing message in request body`);
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log(`📩 [${requestId}] Incoming message:`, {
      preview: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      fullLength: message.length
    });

    if (experimentTitle) {
      console.log(`🧪 [${requestId}] Experiment context:`, {
        title: experimentTitle,
        theoryPreview: experimentTheory?.substring(0, 100) + (experimentTheory?.length > 100 ? '...' : '')
      });
    }

    // 3️⃣ Call OpenAI
    console.log(`🤖 [${requestId}] Calling OpenAI API...`);
    console.log(`🤖 [${requestId}] Model: gpt-4o-mini`);
    console.log(`🤖 [${requestId}] Temperature: 0.7`);
    console.log(`🤖 [${requestId}] System prompt length:`, `Experiment: ${experimentTitle} Theory: ${experimentTheory}`.length);

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are OpenLabs AI Assistant. Follow the user's instructions carefully."
        },
        { role: "user", content: message }, // Your rich prompt comes here
      ],
      temperature: 0.7,
    });

    const endTime = Date.now();
    console.log(`⏱️ [${requestId}] OpenAI API call completed in ${endTime - startTime}ms`);

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      console.error(`❌ [${requestId}] No reply returned from OpenAI:`, {
        choices: completion.choices,
        model: completion.model,
        usage: completion.usage
      });
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] AI reply generated successfully:`, {
      preview: reply.substring(0, 100) + (reply.length > 100 ? '...' : ''),
      fullLength: reply.length,
      model: completion.model,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      } : 'Not available'
    });

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error(`🔥 [${requestId}] OpenAI API Error:`);
    console.error(`🔥 [${requestId}] Name:`, error?.name);
    console.error(`🔥 [${requestId}] Message:`, error?.message);
    console.error(`🔥 [${requestId}] Status:`, error?.status);
    console.error(`🔥 [${requestId}] Stack:`, error?.stack);

    // Log additional error details if available
    if (error?.response) {
      console.error(`🔥 [${requestId}] Response data:`, error.response.data);
      console.error(`🔥 [${requestId}] Response status:`, error.response.status);
      console.error(`🔥 [${requestId}] Response headers:`, error.response.headers);
    }

    console.error(`🔥 [${requestId}] Full Error:`, error);

    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: error?.status || 500 }
    );
  } finally {
    console.log(`🏁 [${requestId}] Request completed`);
  }
}
