import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import mongoose from "mongoose";
import type { QueryOptions } from "mongoose";

function validUsername(u: string) {
  return /^[a-z0-9_-]{3,30}$/.test(u);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const payload = getUserFromToken();
    if (!payload) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const usernameRaw = (body.username || "").toLowerCase().trim();
    const avatar = body.avatar || null;
    const bio = (body.bio || "").slice(0, 160);
    const replaceAvatar = Boolean(body.replaceAvatar);

    if (!validUsername(usernameRaw)) {
      return Response.json({ error: "Invalid username" }, { status: 400 });
    }

    // Load current user to decide whether to overwrite avatar
    const currentUser = await (User as any).findById(payload.id).select("avatar");
    if (!currentUser) return Response.json({ error: "User not found" }, { status: 404 });

    // Decide final avatar: only overwrite if replaceAvatar === true or no existing avatar
    const finalAvatar = replaceAvatar || !currentUser.avatar ? avatar : currentUser.avatar;

    // Attempt save; unique index will prevent duplicates
    try {
      const updated = await (User as any).findByIdAndUpdate(
        payload.id,
        {
          $set: {
            username: usernameRaw,
            avatar: finalAvatar,
            bio,
            profileSetupComplete: true,
          },
        },
        ({ new: true } as any)
      ).select("-password");

      return Response.json({ success: true, user: updated });
    } catch (e) {
      console.error("Profile setup save error:", e);
      // Duplicate key
      if ((e as any)?.code === 11000) {
        return Response.json({ error: "Username already taken" }, { status: 409 });
      }
      return Response.json({ error: "Server error" }, { status: 500 });
    }

  } catch (err) {
    console.error("/api/profile/setup error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
