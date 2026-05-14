import React from "react"
import { Suspense } from "react"
import ProfileView from "./ProfileViewClient"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-6">
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfileView />
      </Suspense>
    </main>
  )
}
