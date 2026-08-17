import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const BitwiseOperationsLab = dynamic(
  () => import("@/app/components/computer-science/bitwise-operations/BitwiseOperationsLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function BitwiseOperationsPage() {
  return <BitwiseOperationsLab />;
}
