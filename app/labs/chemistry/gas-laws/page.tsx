import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const GasLawsLab = dynamic(
  () => import("@/app/components/chemistry/gas-laws/GasLawsLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function GasLawsPage() {
  return <GasLawsLab />;
}
