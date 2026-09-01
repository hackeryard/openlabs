import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const DopplerEffectLab = dynamic(
  () => import("@/app/components/physics/doppler-effect/DopplerEffectLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Synthesizing acoustic wave propagation..." />,
  }
);

export default function DopplerEffectPage() {
  return <DopplerEffectLab />;
}
