// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Interactive STEM Labs & Simulations";
  const subject = searchParams.get("subject") || "Physics, Chemistry, Biology & Computer Science";

  const subjectColors: Record<string, string> = {
    physics: "#3b82f6",
    chemistry: "#10b981",
    biology: "#8b5cf6",
    computerScience: "#f59e0b",
  };

  const badgeColor = subjectColors[subject] || "#3b82f6";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2px, transparent 0)",
          backgroundSize: "50px 50px",
          padding: "60px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: badgeColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            OL
          </div>
          <div style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "1px", color: "#f8fafc" }}>
            OpenLabs
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: badgeColor,
            }}
          >
            {subject.toUpperCase()} LABS & SIMULATIONS
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: "1.1",
              color: "#ffffff",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#94a3b8",
          }}
        >
          <div>Interactive Virtual Experiment Platform</div>
          <div>www.openlabs.org.in</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
