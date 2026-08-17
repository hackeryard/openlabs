import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const CellularRespirationLab = dynamic(
  () => import("@/app/components/biology/cellular-respiration/CellularRespirationLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function CellularRespirationPage() {
  return <CellularRespirationLab />;
}
