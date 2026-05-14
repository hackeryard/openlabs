import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import mongoose from "mongoose";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export async function GET(req: Request) {
  try {
    await connectDB();

    const payload = getUserFromToken();
    if (!payload) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await (User as any).findById(payload.id).select("-password").lean();
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ user });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
