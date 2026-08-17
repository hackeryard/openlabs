import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const VSEPRLab = dynamic(
  () => import("@/app/components/chemistry/vsepr-geometry/VSEPRLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function VSEPRPage() {
  return <VSEPRLab />;
}
