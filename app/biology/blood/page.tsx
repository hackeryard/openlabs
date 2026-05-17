"use client";

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useLab } from "@/app/hooks/useXP"
import DailyChallengeCard from "@/app/components/DailyChallengeCard"

const BloodTransfusionLab = dynamic(() => import("@/app/components/biology/blood/blood"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen"><p className="text-lg">Loading Blood Transfusion Lab...</p></div>
})

export default function BloodPage() {
  const { completeExperiment } = useLab("biology/blood", "biology", "exploration");
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 10000); return () => clearTimeout(timer); }, []);
  return (
    <main className="min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <DailyChallengeCard labId="biology/blood" currentParams={{ bloodGroupTested: true }} />
        <BloodTransfusionLab />
      </div>
    </main>
  )
}
