import { NextResponse } from "next/server";

const AGENT_URL ="https://agent.aicodepro.com/api/v1/prediction/0397bf51-7308-49bb-b6a8-b8a9d48dac3b";
  // "https://agent.aicodepro.com/api/v1/prediction/7ab68714-4730-4fd7-af37-67dfded10658";

export async function POST(req: Request) {
  console.log("📩 /api/agent called");

  try {
    // 1️⃣ Parse body safely
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || !body.question) {
      console.error("❌ Missing required field: question");
      return NextResponse.json(
        { error: "Field 'question' is required" },
        { status: 400 }
      );
    }

    console.log("➡️ Forwarding request to agent API");

    // 2️⃣ Add timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let response;
    try {
      response = await fetch(AGENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.AGENT_KEY}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (networkError: any) {
      console.error("🌐 Network error calling agent:", networkError);
      return NextResponse.json(
        { error: "Failed to reach AI service" },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    // 3️⃣ Read response safely
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("❌ Failed to parse agent response:", jsonError);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 502 }
      );
    }

    // 4️⃣ Handle non-200 responses
    if (!response.ok) {
      console.error("⚠️ Agent returned error:", {
        status: response.status,
        statusText: response.statusText,
        body: result,
      });

      return NextResponse.json(
        {
          error:
            result?.message ||
            `AI service error (${response.status})`,
        },
        { status: response.status }
      );
    }

    console.log("✅ Agent response received successfully");

    return NextResponse.json(result);

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("⏳ Agent request timed out");
      return NextResponse.json(
        { error: "AI service timeout" },
        { status: 504 }
      );
    }

    console.error("🔥 Unexpected server error:", error);

    return NextResponse.json(
      { error: error.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}