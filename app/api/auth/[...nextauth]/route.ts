import NextAuth from "next-auth";
import authOptions from "../nextauth/options";

// Ensure reverse-proxy origin detection works across Render and other hosting providers
if (!process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}

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

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
