"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsService } from "@/lib/analytics";

export default function ClarityTrackerObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const syncUserSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          // User is not authenticated or logged out
          return;
        }

        const data = await res.json();
        const user = data.user;

        if (user) {
          const userId = user._id || user.id;
          const username = user.username || user.name || "";

          // 1. Identify user in Clarity
          analyticsService.identify(userId, username);

          // 2. Determine country from timezone heuristic if not stored directly
          let userCountry = user.country;
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
            plan: user.plan || "free",
            country: userCountry,
            organizationId: user.organizationId || "personal",
            accountType: user.accountType || (user.email?.endsWith(".edu") ? "student" : "individual"),
            level: String(user.level || 1),
            xp: String(user.xp || 0),
          };

          // 4. Register tags in Clarity
          analyticsService.setUserTags(tags);
        }
      } catch (err) {
        console.error("Clarity session tracking sync failed:", err);
      }
    };

    syncUserSession();
  }, [pathname]);

  return null;
}
