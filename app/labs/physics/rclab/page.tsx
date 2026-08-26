import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const RCStudio = dynamic(
  () => import("@/app/components/physics/rc/RCStudio"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing RC Circuits & Transient Simulation Studio..." />,
  }
);

export default function RCLabPage() {
  return <RCStudio />;
}
