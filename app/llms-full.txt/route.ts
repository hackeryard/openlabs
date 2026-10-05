import { NextResponse } from "next/server";
import { getLlmsFullTxt } from "@/lib/llms";

export const revalidate = 86400; // Cache on CDN for 24 hours

export async function GET() {
  const content = await getLlmsFullTxt();
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
