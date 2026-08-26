import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const ProjectileMotionStudio = dynamic(
  () => import("@/app/components/physics/projectilemotion/ProjectileMotionStudio"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="physics" customMessage="Initializing Projectile Motion & Ballistics Studio..." />,
  }
);

export default function ProjectileMotionPage() {
  return <ProjectileMotionStudio />;
}
