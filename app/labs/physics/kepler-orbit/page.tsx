import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const KeplerOrbitLab = dynamic(
  () => import("@/app/components/physics/kepler-orbit/KeplerOrbitLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing celestial gravity engine..." />,
  }
);

export default function KeplerOrbitPage() {
  return <KeplerOrbitLab />;
}
