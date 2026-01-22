'use client'

import dynamic from "next/dynamic"

const PlantCell = dynamic(() => import("@/app/components/biology/cell/plant/PlantCell"), {
  ssr: false,
})

export default function Page() {
  return (
    <main className="flex justify-center">
      <PlantCell />
    </main>
  )
}
