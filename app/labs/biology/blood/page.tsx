"use client";

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useLab } from "@/app/hooks/useXP"
import DailyChallengeCard from "@/app/components/DailyChallengeCard"

import UniversalLoader from "@/app/components/UniversalLoader"

const BloodTransfusionLab = dynamic(() => import("@/app/components/biology/blood/blood"), {
  ssr: false,
  loading: () => <UniversalLoader subject="biology" customMessage="Loading Blood Transfusion Lab..." />
})

export default function BloodPage() {
  const { completeExperiment } = useLab("biology/blood", "biology", "exploration");

  return (
    <main className="min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <DailyChallengeCard labId="biology/blood" currentParams={{ bloodGroupTested: true }} />
        <BloodTransfusionLab />
      </div>
    </main>
  )
}
