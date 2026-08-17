import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const EnzymeKineticsLab = dynamic(
  () => import("@/app/components/biology/enzyme-kinetics/EnzymeKineticsLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function EnzymeKineticsPage() {
  return <EnzymeKineticsLab />;
}
