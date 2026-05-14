import React from 'react'
import ProfilePublicClient from './ProfilePublicClient'

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <ProfilePublicClient username={params.username} />
      </div>
    </main>
  )
}
