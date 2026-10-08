import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AzureADProvider from "next-auth/providers/azure-ad";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

// Ensure NextAuth trusts reverse proxy headers (Render, Vercel, Cloudflare)
if (!process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}

// Auto-configure NEXTAUTH_URL if missing or pointing to localhost in production/Render
if (
  process.env.NODE_ENV === "production" ||
  process.env.RENDER ||
  process.env.VERCEL
) {
  if (
    !process.env.NEXTAUTH_URL ||
    process.env.NEXTAUTH_URL.includes("localhost") ||
    process.env.NEXTAUTH_URL.includes("127.0.0.1")
  ) {
    const fallbackUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.WEBSITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.openlabs.org.in";
    process.env.NEXTAUTH_URL = fallbackUrl;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        const email = (user.email as string) || (profile as any)?.email;
        if (!email) return false;

        let dbUser = await (User as any).findOne({ email });
        if (!dbUser) {
          dbUser = await (User as any).create({
            name: user.name || (profile as any)?.name || email.split("@")[0],
            email,
            password: crypto.randomUUID(),
            emailVerified: true,
            createdAt: new Date(),
            avatar: user.image || (profile as any)?.picture || null,
            profileSetupComplete: false,
          });
        } else {
          if (!(dbUser as any).avatar && (user.image || (profile as any)?.picture)) {
            (dbUser as any).avatar = user.image || (profile as any)?.picture;
            await (dbUser as any).save();
          }
        }

        (user as any).dbId = dbUser._id.toString();
        return true;
      } catch (err) {
        console.error("NextAuth signIn error:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user && (user as any).dbId) token.dbId = (user as any).dbId;
      return token;
    },
    async session({ session, token }) {
      if (token && (token as any).dbId) (session.user as any).id = (token as any).dbId;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url && url.includes("/api/auth/nextauth/sync")) {
        return url;
      }

      // Do NOT prepend baseUrl if url is a relative path (e.g. "/" or "/labs").
      // Prepending baseUrl would attach "http://localhost:3000" when NEXTAUTH_URL defaults to localhost,
      // which causes production users on Render to be redirected to localhost.
      let dest = "/";
      if (url) {
        if (url.startsWith("/")) {
          dest = url;
        } else {
          try {
            const parsed = new URL(url);
            // If the URL points to localhost or 127.0.0.1, strip origin and retain relative path
            if (
              parsed.hostname === "localhost" ||
              parsed.hostname === "127.0.0.1"
            ) {
              dest = `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
            } else {
              dest = url;
            }
          } catch {
            dest = "/";
          }
        }
      }

      // Avoid using a baseUrl that points to localhost when running in production/Render
      const isBaseLocal = baseUrl && (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1"));
      const isProd = process.env.NODE_ENV === "production" || !!process.env.RENDER;

      if (isProd && isBaseLocal) {
        const prodBase =
          process.env.RENDER_EXTERNAL_URL ||
          process.env.WEBSITE_URL ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://www.openlabs.org.in";
        return `${prodBase}/api/auth/nextauth/sync?next=${encodeURIComponent(dest)}`;
      }

      if (baseUrl && !isBaseLocal) {
        return `${baseUrl}/api/auth/nextauth/sync?next=${encodeURIComponent(dest)}`;
      }

      return `/api/auth/nextauth/sync?next=${encodeURIComponent(dest)}`;
    },
  },
};

export default authOptions;
