'use client'

import dynamic from "next/dynamic"

const AnimalCell = dynamic(() => import("@/app/components/biology/cell/animal/AnimalCell"), {
  ssr: false,
})

export default function Page() {
  return (
    <main className="flex justify-center">
      <AnimalCell />
    </main>
  )
}
