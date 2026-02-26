"use client";

import dynamic from "next/dynamic"

const BloodTransfusionLab = dynamic(() => import("@/app/components/biology/blood/blood"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen"><p className="text-lg">Loading Blood Transfusion Lab...</p></div>
})

export default function BloodPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <BloodTransfusionLab />
      </div>
    </main>
  )
}
