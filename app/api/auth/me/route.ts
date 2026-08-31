import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { generateToken } from "@/app/lib/auth";
import { extractGeoLocation } from "@/app/lib/geolocation";
import { serialize } from "cookie";

export async function GET(req: Request) {
  try {
    await connectDB();

    const payload = getUserFromToken();
    if (!payload) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await (User as any).findById(payload.id).select("-password").lean();
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Silently update user location in background if needed
    try {
      const geo = extractGeoLocation(req);
      if (geo.country !== "Unknown" || geo.city) {
        await (User as any).findByIdAndUpdate(payload.id, {
          $set: {
            "location.ip": geo.ip,
            "location.city": geo.city,
            "location.region": geo.region,
            "location.country": geo.country,
            "location.countryCode": geo.countryCode,
            "location.timezone": geo.timezone,
            "location.latitude": geo.latitude,
            "location.longitude": geo.longitude,
            "location.lastUpdated": new Date(),
          },
        });
      }
    } catch {}

    // Streak validation: Reset active daily streak to 0 if user skipped a day, while preserving highestStreak
    try {
      let streakNeedsUpdate = false;
      let newStreak = user.streak || 0;
      const highestStreak = Math.max(user.highestStreak || 0, user.streak || 0);

      if (user.lastActiveDate) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastActive = new Date(user.lastActiveDate);
        lastActive.setUTCHours(0, 0, 0, 0);

        // If last active was before yesterday, streak is broken and resets
        if (lastActive.getTime() < yesterday.getDate() && user.streak > 0) {
          // Check timestamp millisecond difference
          if (lastActive.getTime() < yesterday.getTime()) {
            newStreak = 0;
            streakNeedsUpdate = true;
          }
        }
      }

      if (streakNeedsUpdate || (user.highestStreak || 0) < highestStreak) {
        await (User as any).findByIdAndUpdate(payload.id, {
          $set: {
            streak: newStreak,
            highestStreak: highestStreak,
          },
        });
        user.streak = newStreak;
        user.highestStreak = highestStreak;
      }
    } catch {}


    if (!user.emailVerified) {
      return Response.json(
        { 
          error: "Email not verified", 
          emailVerified: false, 
          email: user.email 
        }, 
        { 
          status: 403,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          }
        }
      );
    }

    const responseHeaders: Record<string, string> = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    // If role in DB has changed since token was minted, auto-refresh JWT cookie
    if (user.role && user.role !== payload.role) {
      const refreshedToken = generateToken(user);
      const isProd = process.env.NODE_ENV === "production";
      responseHeaders["Set-Cookie"] = serialize("auth-token", refreshedToken, {
        httpOnly: true,
        path: "/",
        domain: isProd ? ".openlabs.org.in" : undefined,
        maxAge: 60 * 60 * 24,
      });
    }

    return Response.json(
      { user },
      {
        headers: responseHeaders,
      }
    );
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

