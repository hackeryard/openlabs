"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// Dynamically import the Water Quality component
const WaterQualityLab = dynamic(
  () => import("@/app/components/chemistry/Water-quality"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0b1120 0%, #1a2a3a 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "pulse 1.5s infinite",
            }}
          >
            🌊
          </div>
          <div style={{ color: "#2dd4bf", fontSize: "1.2rem" }}>
            Loading Water Quality Lab...
          </div>
        </div>
      </div>
    ),
  }
);

export default function WaterQualityPage() {
  const { completeExperiment } = useLab("chemistry/water-quality", "chemistry", "exploration");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0b1120 0%, #1a2a3a 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "pulse 1.5s infinite",
            }}
          >
            🌊
          </div>
          <div style={{ color: "#2dd4bf", fontSize: "1.2rem" }}>
            Loading Water Quality Lab...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <DailyChallengeCard labId="chemistry/water-quality" currentParams={{ labExplored: true }} />
      <WaterQualityLab onComplete={completeExperiment} />
    </main>
  );
}
