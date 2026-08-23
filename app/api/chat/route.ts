import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { createChatCompletionWithFallback } from "@/app/lib/openrouter";

export async function POST(req: Request) {
  try {
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

    const { message, messages, pageContext } = body || {};

    // Build user message history
    let conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      conversationHistory = messages
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .slice(-8); // Keep last 8 turns for token efficiency and high context focus
    } else if (typeof message === "string" && message.trim().length > 0) {
      conversationHistory = [{ role: "user", content: message.trim() }];
    }

    if (conversationHistory.length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // 3. Define Strict Page-Context System Prompt for OpenLabs AI
    const OPENLABS_SYSTEM_PROMPT = `You are OpenLabs AI Lab Tutor, an interactive educational companion embedded strictly within the user's active OpenLabs page/simulation.

### CRITICAL RULE — STRICT PAGE-CONTEXT LOCK (MANDATORY & UNCOMPROMISING):
1. **STRICT CONTEXT BOUNDARY**:
   - You MUST ONLY answer questions, explain principles, solve problems, or provide instructions that directly pertain to the CURRENT ACTIVE PAGE / LAB CONTEXT provided below.
   - You are STRICTLY FORBIDDEN from answering ANY question that is outside the active page's context, topic, simulation, or subject domain—**EVEN IF the question is educational, scientific, mathematical, or coding-related**.
   - Example violations:
     - If active page is "Ohm's Law" or "Physics Lab" and user asks for "Factorial code in Java", "Photosynthesis", or "Matrix multiplication" -> REFUSE IMMEDIATELY.
     - If active page is "Binary Search" and user asks about "Newton's Laws" or "Organic chemistry reactions" -> REFUSE IMMEDIATELY.
     - If active page is "Photosynthesis" and user asks about "Python web scrapers" -> REFUSE IMMEDIATELY.

2. **REFUSAL PROTOCOL FOR OUT-OF-CONTEXT INQUIRIES**:
   - If a question is outside the active page/lab context (whether non-educational OR an unrelated educational topic), DO NOT answer the question.
   - Respond with a strict, polite 1-to-2 sentence refusal redirecting to the active lab:
     "I am locked to the current lab context (**{Active Lab/Topic Name}**). I cannot answer questions on outside topics. Please ask a question related to **{Active Lab/Topic Name}** or navigate to the corresponding lab on OpenLabs."

3. **WITHIN-CONTEXT RESPONSES**:
   - When the question directly relates to the current page/lab:
     - Provide direct, zero-fluff, highly accurate, and pedagogically rich explanations.
     - Never start with filler ("Sure!", "Great question!", "Let's dive in!").
     - Reference the actual controls, sliders, switches, data plots, and formulas from the active page context to guide the student.
     - Format clearly with Markdown bolding, lists, and code/formula blocks where relevant.

4. **GREETINGS & GREETING REPLIES**:
   - For simple greetings ("Hi", "Hello", "Ka haal ba", "Kaisa hai"), reply warmly in 1 short sentence mentioning the current lab/topic and asking how you can help them with this specific experiment.

5. **LANGUAGE MATCHING**:
   - Seamlessly reply in the user's language/dialect (English, Hindi, Hinglish, etc.) while adhering 100% to the strict context lock above.`;

    // 4. Build Model Messages with Active Context
    const modelMessages: any[] = [
      {
        role: "system",
        content: OPENLABS_SYSTEM_PROMPT,
      },
    ];

    // Ingest Active Lab / Page Context
    let activeTopicName = "General OpenLabs Platform";
    const contextParts: string[] = [];

    if (pageContext && typeof pageContext === "object") {
      const { pathname, title, theory, knowledge, pageSnapshot } = pageContext;

      if (title && title !== "General STEM") {
        activeTopicName = title;
        contextParts.push(`Active Lab / Page Title: ${title}`);
      } else if (pathname) {
        activeTopicName = pathname.replace(/^\//, "").replace(/\//g, " > ");
        contextParts.push(`Active Route Path: ${pathname}`);
      }

      if (pathname) contextParts.push(`Page URL: ${pathname}`);
      if (theory && theory !== "N/A") contextParts.push(`Lab Theory / Subject Concepts:\n${theory}`);
      if (knowledge && typeof knowledge === "string") contextParts.push(`Curated Lab Knowledge & Controls:\n${knowledge}`);
      if (pageSnapshot && typeof pageSnapshot === "string") {
        contextParts.push(`Visible UI Elements & On-Page Content:\n${pageSnapshot.slice(0, 3000)}`);
      }
    }

    modelMessages.push({
      role: "system",
      content: `CURRENT ACTIVE PAGE CONTEXT (STRICT BOUNDARY):\nTarget Lab / Topic: ${activeTopicName}\n\n${
        contextParts.length > 0 ? contextParts.join("\n\n") : "No specific lab open (General OpenLabs exploration)."
      }\n\nREMINDER: Under no condition answer queries outside this specific ${activeTopicName} context.`,
    });

    // Append multi-turn conversation
    for (const msg of conversationHistory) {
      modelMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // 5. Request Completion from LLM with automatic multi-key failover
    const completion = await createChatCompletionWithFallback({
      model: "openai/gpt-4o-mini",
      messages: modelMessages,
      temperature: 0.5,
      max_tokens: 1200,
    });
    
    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    // 6. Increment usage counter directly in MongoDB
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
