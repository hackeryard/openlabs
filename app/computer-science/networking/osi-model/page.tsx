 "use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";

const OSIModel = dynamic(
  () => import("@/app/components/computer-science/networking/osi-model/OSIModel"),
  { ssr: false }
);
const OSIModel2D = dynamic(
  () => import("@/app/components/computer-science/networking/osi-model/OSIModel2D"),
  { ssr: false }
);

export default function OSIPage() {
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "OSI Model",
      theory:
        "Interactive OSI model visualization showing encapsulation/decapsulation, PDUs, devices, and common protocols across 7 layers.",
      extraContext:
        "Use TCP/UDP and Sender/Receiver mode to see how data flows through layers. Click any layer card to open details (function, protocols, devices, example, quiz).",
    });
  }, [setExperimentData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        OSI Model Interactive Visualization
      </h1>
      {/* <OSIModel /> */}
      <OSIModel2D />
    </div>
  );
}