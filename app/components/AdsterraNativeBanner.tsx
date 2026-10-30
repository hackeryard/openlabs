"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAdExcludedRoute, ADSTERRA_BANNERS } from "@/app/lib/ads";
import { useAdSettings } from "./AdController";

interface AdsterraNativeBannerProps {
  className?: string;
  showBadge?: boolean;
}

function isAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.startsWith("admin.") || host.startsWith("admin.localhost");
}

/**
 * AdsterraNativeBanner Component
 * 
 * Safely renders Adsterra's 4-tile Native Recommendation Banner widget
 * on public educational landing pages, blog publications, and discipline hubs.
 * Automatically respects lab simulation (/labs/*), admin (/admin/*), and admin panel master ad switches.
 */
export default function AdsterraNativeBanner({
  className = "",
  showBadge = false,
}: AdsterraNativeBannerProps) {
  const pathname = usePathname();
  const adSettings = useAdSettings();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldExclude =
    isAdExcludedRoute(pathname) ||
    isAdminHost() ||
    !adSettings.allowed ||
    !adSettings.networks.adsterraBanners;

  useEffect(() => {
    if (shouldExclude || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    // Clear out any previous scripts or injections
    const existingScript = wrapper.querySelector("script[src*='8eb9029bb810ce5acaa5919fc62e556a']");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_BANNERS.native.src;

    wrapper.appendChild(script);

    return () => {
      try {
        if (wrapper && wrapper.contains(script)) {
          wrapper.removeChild(script);
        }
      } catch {
        // Ignored
      }
    };
  }, [shouldExclude, pathname]);

  if (shouldExclude) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      data-adsterra="native-banner"
      className={`w-full flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}
    >
      {showBadge && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-2 select-none">
          Sponsored Recommendations
        </span>
      )}
      <div
        id={ADSTERRA_BANNERS.native.containerId}
        className="w-full flex justify-center min-h-[90px]"
      />
    </div>
  );
}
