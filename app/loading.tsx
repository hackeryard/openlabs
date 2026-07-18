"use client";

import { usePathname } from "next/navigation";
import UniversalLoader from "./components/UniversalLoader";

export default function RootLoading() {
  const pathname = usePathname() || "";
  
  let subject: "biology" | "chemistry" | "physics" | "computer-science" | "default" = "default";
  
  if (pathname.includes("/biology")) {
    subject = "biology";
  } else if (pathname.includes("/chemistry")) {
    subject = "chemistry";
  } else if (pathname.includes("/physics")) {
    subject = "physics";
  } else if (pathname.includes("/computer-science")) {
    subject = "computer-science";
  }

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center pt-16">
      <UniversalLoader subject={subject} />
    </div>
  );
}
