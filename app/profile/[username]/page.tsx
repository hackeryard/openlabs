import React from "react";
import { Suspense } from "react";
import ProfilePublicClient from "./ProfilePublicClient";
import UniversalLoader from "@/app/components/UniversalLoader";

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="min-h-screen text-foreground bg-background">
      <Suspense
        fallback={
          <div className="pt-24 flex items-center justify-center">
            <UniversalLoader subject="default" customMessage="Loading researcher profile..." />
          </div>
        }
      >
        <ProfilePublicClient username={params.username} />
      </Suspense>
    </main>
  );
}
