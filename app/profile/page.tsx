import React from "react"
import { Suspense } from "react"
import ProfileView from "./ProfileViewClient"
import UniversalLoader from "@/app/components/UniversalLoader"

export default function ProfilePage() {
  return (
    <main className="min-h-screen text-foreground">
      <Suspense fallback={<div className="pt-20"><UniversalLoader subject="default" customMessage="Loading your scientific profile..." /></div>}>
        <ProfileView />
      </Suspense>
    </main>
  )
}
