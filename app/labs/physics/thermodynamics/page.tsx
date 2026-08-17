import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const ThermodynamicsLab = dynamic(
  () => import("@/app/components/physics/thermodynamics/ThermodynamicsLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function ThermodynamicsPage() {
  return <ThermodynamicsLab />;
}
