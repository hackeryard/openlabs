"use client";

import React, { Suspense } from "react";
import AuthPage from "@/components/AuthPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Loading login...</div>}>
      <AuthPage initialMode="login" />
    </Suspense>
  );
}