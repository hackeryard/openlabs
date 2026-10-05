"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const OpenLabsAI = dynamic(() => import("./OpenLabsAI"), {
  ssr: false,
});

const HIDDEN_ROUTES = ["/login", "/signup", "/forgot"];

export default function OpenLabsAILoader() {
  const pathname = usePathname();
  const { authState, user } = useAuth();

  const isHidden = HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (isHidden || authState !== "AUTHENTICATED" || !user) {
    return null;
  }

  return <OpenLabsAI />;
}
