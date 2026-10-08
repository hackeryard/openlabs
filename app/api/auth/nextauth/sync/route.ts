import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../options";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { generateToken, getAuthCookieDomain } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Reconstruct canonical origin safely behind reverse proxies (Render, Vercel)
  const proto = req.headers.get("x-forwarded-proto") || (req.url.startsWith("https") ? "https" : "http");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || new URL(req.url).host;
  const origin = `${proto}://${host}`;
  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/";

  try {
    const session = (await getServerSession(authOptions as any)) as any;

    if (!session || !session.user?.email) {
      return NextResponse.redirect(`${origin}/login`);
    }

    await connectDB();
    const email = session.user.email as string;
    let user = await (User as any).findOne({ email });

    if (!user) {
      user = await (User as any).create({
        name: session.user.name || email.split("@")[0],
        email,
        password: crypto.randomUUID(),
        emailVerified: true,
        createdAt: new Date(),
        avatar: session.user.image || null,
        profileSetupComplete: false,
      });
    }

    const token = generateToken(user);
    const secure = process.env.NODE_ENV === "production";
    const cookieDomain = getAuthCookieDomain(req);
    const domainPart = cookieDomain ? `Domain=${cookieDomain}; ` : "";
    const cookie = `auth-token=${token}; Path=/; ${domainPart}HttpOnly; SameSite=Lax; ${secure ? "Secure; " : ""
      }Max-Age=${60 * 60 * 24}`;

    let cleanNext = next;
    while (cleanNext.includes("/api/auth/nextauth/sync")) {
      try {
        const parsed = new URL(cleanNext, origin);
        cleanNext = parsed.searchParams.get("next") || "/";
      } catch {
        cleanNext = "/";
        break;
      }
    }

    // Resolve redirect target safely:
    // If cleanNext is a localhost URL while the current origin is not localhost (e.g. Render / production),
    // rewrite the destination to current origin!
    let redirectTarget = "/";
    try {
      if (cleanNext.startsWith("/")) {
        redirectTarget = `${origin}${cleanNext}`;
      } else {
        const parsed = new URL(cleanNext, origin);
        const isTargetLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
        const isCurrentLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

        if (isTargetLocal && !isCurrentLocal) {
          redirectTarget = `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        } else if (parsed.origin === origin) {
          redirectTarget = cleanNext;
        } else if (
          parsed.hostname.endsWith("openlabs.org.in") &&
          new URL(origin).hostname.endsWith("openlabs.org.in")
        ) {
          redirectTarget = cleanNext;
        } else {
          redirectTarget = `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
      }
    } catch {
      redirectTarget = `${origin}/`;
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTarget,
        "Set-Cookie": cookie,
      },
    });
  } catch (err) {
    console.error("NextAuth sync error:", err);
    return NextResponse.redirect(`${origin}/login`);
  }
}