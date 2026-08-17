import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const FaradaysLawLab = dynamic(
  () => import("@/app/components/physics/faradays-law/FaradaysLawLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function FaradaysLawPage() {
  return <FaradaysLawLab />;
}
