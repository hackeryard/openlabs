import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const username = (searchParams.get("username") || "").toLowerCase().trim();

    if (!username || username.length < 3) {
      return Response.json({ available: false, reason: "invalid" });
    }

    const exists = await (User as any).findOne({ username }).select("_id");
    return Response.json({ available: !Boolean(exists) });
  } catch (err) {
    console.error("/api/profile/check-username error:", err);
    return Response.json({ available: false }, { status: 500 });
  }
}
