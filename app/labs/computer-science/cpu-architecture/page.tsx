import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const CpuArchitectureLab = dynamic(
  () => import("@/app/components/computer-science/cpu-architecture/CpuArchitectureLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function CpuArchitecturePage() {
  return <CpuArchitectureLab />;
}
