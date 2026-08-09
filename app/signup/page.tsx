"use client";

import React, { Suspense } from "react";
import AuthPage from "@/components/AuthPage";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Loading signup...</div>}>
      <AuthPage initialMode="signup" />
    </Suspense>
  );
}