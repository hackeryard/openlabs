import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const FreeFallStudio = dynamic(
  () => import("@/app/components/physics/freefall/FreeFallStudio"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing Free Fall & Terminal Velocity Studio..." />,
  }
);

export default function FreeFallPage() {
  return <FreeFallStudio />;
}
