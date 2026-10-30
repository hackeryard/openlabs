"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  isAdExcludedRoute,
  ADSTERRA_BANNERS,
  AdBannerFormat,
  AdBannerSize,
} from "@/app/lib/ads";
import { useAdSettings } from "./AdController";

interface AdsterraBannerProps {
  format: AdBannerFormat;
  className?: string;
  showBadge?: boolean;
}

function isAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.startsWith("admin.") || host.startsWith("admin.localhost");
}

/**
 * AdsterraBanner Component
 * 
 * Safely mounts Adsterra IFrame Sync ad units within an isolated iframe execution
 * context, protecting parent React DOM from document.write collisions and variable leakage.
 * Automatically respects lab simulation (/labs/*), admin (/admin/*), and admin panel master ad switches.
 */
export default function AdsterraBanner({
  format,
  className = "",
  showBadge = false,
}: AdsterraBannerProps) {
  const pathname = usePathname();
  const adSettings = useAdSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolvedSize, setResolvedSize] = useState<AdBannerSize>(() => {
    if (format !== "responsive-leaderboard") return format;
    if (typeof window === "undefined") return "728x90";
    const width = window.innerWidth;
    if (width < 480) return "320x50";
    if (width < 768) return "468x60";
    return "728x90";
  });

  const shouldExclude =
    isAdExcludedRoute(pathname) ||
    isAdminHost() ||
    !adSettings.allowed ||
    !adSettings.networks.adsterraBanners;

  // Responsive size listener for responsive-leaderboard
  useEffect(() => {
    if (format !== "responsive-leaderboard") {
      setResolvedSize(format);
      return;
    }

    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setResolvedSize("320x50");
      } else if (width < 768) {
        setResolvedSize("468x60");
      } else {
        setResolvedSize("728x90");
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [format]);

  // Iframe mounting lifecycle
  useEffect(() => {
    if (shouldExclude || !containerRef.current) return;

    const unit = ADSTERRA_BANNERS[resolvedSize];
    if (!unit) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.width = String(unit.width);
    iframe.height = String(unit.height);
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.setAttribute("title", `Advertisement ${resolvedSize}`);
    iframe.setAttribute("loading", "lazy");

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`<!DOCTYPE html>
<html>
  <head>
    <base target="_blank">
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${unit.key}',
        'format' : 'iframe',
        'height' : ${unit.height},
        'width' : ${unit.width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="${unit.src}"></script>
  </body>
</html>`);
        doc.close();
      }
    } catch {
      // In case iframe write is restricted
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [resolvedSize, shouldExclude, pathname]);

  if (shouldExclude) {
    return null;
  }

  const unit = ADSTERRA_BANNERS[resolvedSize];
  if (!unit) return null;

  return (
    <div
      data-adsterra="banner"
      data-ad-size={resolvedSize}
      className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}
    >
      {showBadge && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-1 select-none">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        style={{ width: `${unit.width}px`, height: `${unit.height}px` }}
        className="flex items-center justify-center max-w-full overflow-hidden"
      />
    </div>
  );
}
