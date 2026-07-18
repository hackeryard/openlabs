"use client";

import { Suspense } from "react";
import LoginFormWithParams from "@/app/components/LoginFormWithParams";

// Optimized Premium Loading Spinner Component to reuse for both dynamic & fallback
function LoadingSpinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background font-sans">
      <div className="text-center space-y-3">
        <div className="relative w-10 h-10 mx-auto">
          {/* Outer glowing track */}
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          {/* Inner spinning gradient indicator */}
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Loading secure portal...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginFormWithParams />
    </Suspense>
  );
}