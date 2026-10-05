import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const GeneralRelativityLab = dynamic(
  () => import("@/app/components/physics/general-relativity/GeneralRelativityLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Warping spacetime continuum..." />,
  }
);

export default function GeneralRelativityPage() {
  return <GeneralRelativityLab />;
}
