import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const ElectrochemistryLab = dynamic(
  () => import("@/app/components/chemistry/electrochemistry/ElectrochemistryLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function ElectrochemistryPage() {
  return <ElectrochemistryLab />;
}
