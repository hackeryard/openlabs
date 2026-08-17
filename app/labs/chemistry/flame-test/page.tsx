import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const FlameTestLab = dynamic(
  () => import("@/app/components/chemistry/flame-test/FlameTestLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function FlameTestPage() {
  return <FlameTestLab />;
}
