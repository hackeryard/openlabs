import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const HookeLawStudio = dynamic(
  () => import("@/app/components/physics/hookelaw/HookeLawStudio"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing Hooke's Law & Coupled Oscillations Studio..." />,
  }
);

export default function HookeLawPage() {
  return <HookeLawStudio />;
}
