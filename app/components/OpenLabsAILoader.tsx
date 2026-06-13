"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const OpenLabsAI = dynamic(() => import("./OpenLabsAI"), {
  ssr: false,
});

const HIDDEN_ROUTES = ["/login", "/signup", "/forgot"];

export default function OpenLabsAILoader() {
  const pathname = usePathname();
  const [canLoadAssistant, setCanLoadAssistant] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
      setCanLoadAssistant(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!cancelled) {
          setCanLoadAssistant(res.ok);
        }
      } catch {
        if (!cancelled) {
          setCanLoadAssistant(false);
        }
      }
    }

    setCanLoadAssistant(false);
    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return canLoadAssistant ? <OpenLabsAI /> : null;
}
