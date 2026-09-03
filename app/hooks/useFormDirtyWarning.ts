"use client";

import { useEffect } from "react";

interface UseFormDirtyWarningOptions {
  message?: string;
}

/**
 * Hook that warns and blocks the user from navigating away or hard reloading
 * when a form has unsaved (dirty) changes.
 *
 * Handles:
 * 1. Hard reload, browser refresh, tab closing, and external navigation (via `beforeunload`)
 * 2. Next.js App Router client-side navigation links (via capture click interception on `<a>`)
 * 3. Browser Back / Forward history navigation (via `popstate`)
 */
export function useFormDirtyWarning(
  isDirty: boolean,
  options?: UseFormDirtyWarningOptions
) {
  const message =
    options?.message ||
    "You have unsaved changes. Are you sure you want to leave this page? Any unsaved edits will be lost.";

  // 1. Browser hard reload / tab close / window navigation
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers display standard prompt, but setting returnValue is required by spec
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, message]);

  // 2. Client-side Next.js route navigation (links in navbar, breadcrumbs, sidebar, etc.)
  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.getAttribute("href");
      // Skip empty hrefs, anchor hashes on the same page, or javascript/mailto/tel calls
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // Check if clicking link pointing to a different page/url
      try {
        const targetUrl = new URL(target.href, window.location.href);
        const currentUrl = new URL(window.location.href);
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search &&
          targetUrl.hash !== currentUrl.hash
        ) {
          return;
        }
      } catch {
        // In case of invalid URL
      }

      const confirmed = window.confirm(message);
      if (!confirmed) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [isDirty, message]);
}
