import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AzureADProvider from "next-auth/providers/azure-ad";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

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
      // After NextAuth flow completes, redirect to our sync endpoint
      const dest = url ?? baseUrl;
      return `/api/auth/nextauth/sync?next=${encodeURIComponent(String(dest || "/"))}`;
    },
  },
};

export default authOptions;
