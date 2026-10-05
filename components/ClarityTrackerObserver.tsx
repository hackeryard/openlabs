"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsService } from "@/lib/analytics";
import { useAuth } from "./AuthProvider";

export default function ClarityTrackerObserver() {
  const pathname = usePathname();
  const { user } = useAuth();
  const lastIdentifiedUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.endsWith(".local") ||
        host.startsWith("admin.") ||
        window.location.port !== ""
      ) {
        return;
      }
    }

    if (pathname?.startsWith("/admin") || pathname === "/403") {
      return;
    }

    if (!user) {
      lastIdentifiedUserRef.current = null;
      return;
    }

    const userId = user._id || (user as any).id;
    if (!userId || lastIdentifiedUserRef.current === userId) {
      return;
    }

    try {
      const username = user.username || user.name || "";

      // 1. Identify user in Clarity
      analyticsService.identify(userId, username);
      lastIdentifiedUserRef.current = userId;

      // 2. Determine country from timezone heuristic if not stored directly
      let userCountry = (user as any).country;
      if (!userCountry && typeof window !== "undefined") {
        try {
          userCountry = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
        } catch {
          userCountry = "unknown";
        }
      }

      // 3. Populate tags
      const tags = {
        role: user.role || (user.email?.includes("admin") ? "admin" : "student"),
        plan: (user as any).plan || "free",
        country: userCountry,
        organizationId: (user as any).organizationId || "personal",
        accountType: (user as any).accountType || (user.email?.endsWith(".edu") ? "student" : "individual"),
        level: String(user.level || 1),
        xp: String(user.xp || 0),
      };

      // 4. Register tags in Clarity
      analyticsService.setUserTags(tags);
    } catch (err) {
      console.error("Clarity session tracking sync failed:", err);
    }
  }, [pathname, user]);

  return null;
}
