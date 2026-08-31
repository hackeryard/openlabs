"use client";

import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const HeartCardiacCycleLab = dynamic(
  () => import("@/app/components/biology/heart-cardiac-cycle/HeartCardiacCycleLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="biology" customMessage="Loading Cardiac Simulation Engine & ECG..." />,
  }
);

// Medical Cardiac Cycle Simulation Studio
export default function Page() {
  return <HeartCardiacCycleLab />;
}

