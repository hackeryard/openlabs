import React from 'react'
import { Suspense } from 'react'
import ProfilePublicClient from './ProfilePublicClient'
import UniversalLoader from '@/app/components/UniversalLoader'

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="min-h-screen text-foreground py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="pt-20"><UniversalLoader subject="default" customMessage="Loading public profile..." /></div>}>
          <ProfilePublicClient username={params.username} />
        </Suspense>
      </div>
    </main>
  )
}
