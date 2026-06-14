import { NextResponse } from "next/server";
import { getLlmsFullTxt } from "@/lib/llms";

export async function GET() {
  const content = await getLlmsFullTxt();
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60",
    },
  });
}
