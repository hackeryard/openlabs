"use client";

import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const LabComponent = dynamic(
  () => import("@/app/components/biology/mitosis-meiosis/MitosisMeiosisLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="biology" customMessage="Initializing Microscopic Cell Division Studio..." />,
  }
);

export default function Page() {
  return <LabComponent />;
}
