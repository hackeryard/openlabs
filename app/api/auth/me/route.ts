import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/app/lib/getUserFromToken";
import { generateToken } from "@/app/lib/auth";
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
