import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const OsmosisTonicityLab = dynamic(
  () => import("@/app/components/biology/osmosis-tonicity/OsmosisTonicityLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function OsmosisTonicityPage() {
  return <OsmosisTonicityLab />;
}
