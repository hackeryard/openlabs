import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const PhotoelectricEffectLab = dynamic(
  () => import("@/app/components/physics/photoelectric-effect/PhotoelectricEffectLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader />,
  }
);

export default function PhotoelectricEffectPage() {
  return <PhotoelectricEffectLab />;
}
