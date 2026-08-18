"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return;
    }
    const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

    if (projectId) {
      Clarity.init(projectId);
    }
  }, []);

  return null;
}