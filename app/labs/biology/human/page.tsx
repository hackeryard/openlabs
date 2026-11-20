"use client"

import { useState, Suspense, useEffect } from "react"
import ProceduralAnatomy from "@/app/components/biology/human/HumanBody"
import dynamic from "next/dynamic"
import InfoPanel from "@/app/components/biology/human/InfoPanel"
import { useChat } from "@/app/components/ChatContext"
import { useLab } from "@/app/hooks/useXP"
import DailyChallengeCard from "@/app/components/DailyChallengeCard"

import UniversalLoader from "@/app/components/UniversalLoader"

const AnatomyScene = dynamic(
  () => import("@/app/components/biology/human/AnatomyScene"),
  { ssr: false, loading: () => <UniversalLoader subject="biology" customMessage="Loading 3D Anatomy Model..." /> }
)

const ALL_ORGANS = [
  { id: "Brain", label: "Brain", icon: "🧠" },
  { id: "Heart", label: "Heart", icon: "❤️" },
  { id: "Lungs", label: "Lungs", icon: "🫁" },
  { id: "Liver", label: "Liver", icon: "🩸" },
  { id: "Stomach", label: "Stomach", icon: "🥣" },
  { id: "Kidneys", label: "Kidneys", icon: "💧" },
  { id: "Intestines", label: "Intestines", icon: "🧬" },
  { id: "Bladder", label: "Bladder", icon: "🫧" },
];

export default function Page() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "3D Structure model of human anatomy.",
      theory: "Interactive 3D model of human anatomy and organ systems.",
      extraContext: `Click on anatomical pins or select any organ from the directory to inspect its physiological function, biological system, and key anatomical facts.`,
    });
  }, []);
  const [selectedOrgan, setSelectedOrgan] = useState("Brain");
  const [type, setType] = useState<"human" | "skeleton">("human");
  const { completeExperiment } = useLab("biology/human", "biology", "exploration");
  const [explored, setExplored] = useState<Set<string>>(new Set(["Brain"]));

  useEffect(() => {
    if (selectedOrgan) {
      setExplored(prev => {
        const next = new Set(prev).add(selectedOrgan);
        if (next.size >= 3) completeExperiment();
        return next;
      });
    }
  }, [selectedOrgan, completeExperiment]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <DailyChallengeCard labId="biology/human" currentParams={{ structuresExplored: explored.size }} />

      {/* Quick Organ Directory Filter Bar */}
      <div className="px-4 py-2 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mr-1">
            Organ Directory:
          </span>
          {ALL_ORGANS.map((org) => {
            const isSelected = selectedOrgan === org.id;
            return (
              <button
                key={org.id}
                onClick={() => setSelectedOrgan(org.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-rose-600 text-white shadow-md shadow-rose-500/20 scale-105"
                    : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{org.icon}</span>
                <span>{org.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher (Human / Skeleton) */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl shrink-0">
          <button
            onClick={() => setType("human")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              type === "human"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Human
          </button>
          <button
            onClick={() => setType("skeleton")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              type === "skeleton"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Skeleton
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
        {/* 3D Scene Viewport */}
        <div className="md:col-span-8 relative h-full">
          <AnatomyScene type={type} selectedOrgan={selectedOrgan} onSelect={setSelectedOrgan} />
          <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-white/80 pointer-events-none">
            💡 Click 3D pins on the body or click the organ bar to inspect
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="md:col-span-4 border-l border-border bg-card h-full overflow-y-auto">
          <InfoPanel organ={selectedOrgan} />
        </div>
      </div>
    </div>
  );
}
