import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const EnergyConservationStudio = dynamic(
  () => import("@/app/components/physics/energyconservation/EnergyConservationStudio"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="physics"
        customMessage="Initializing Conservation of Energy & Roller Coaster Studio..."
      />
    ),
  }
);

export default function EnergyConservationPage() {
  return <EnergyConservationStudio />;
}
