import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const PendulumStudio = dynamic(
  () => import("@/app/components/physics/pendulum/PendulumStudio"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing Simple Pendulum & Harmonic Motion Studio..." />,
  }
);

export default function SimplePendulumPage() {
  return <PendulumStudio />;
}
