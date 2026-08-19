import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../options";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { generateToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { origin, searchParams } = new URL(req.url);
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
    const domainPart = secure ? "Domain=.openlabs.org.in; " : "";
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

    const redirectTarget = cleanNext.startsWith('http') ? cleanNext : `${origin}${cleanNext.startsWith('/') ? cleanNext : `/${cleanNext}`}`;

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