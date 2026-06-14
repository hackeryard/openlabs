"use client";

import { useEffect, useState } from "react";
import { Dna, Atom, FlaskConical, Cpu, Layers } from "lucide-react";
import { motion } from "framer-motion";

type SubjectType = "biology" | "chemistry" | "physics" | "computer-science" | "default";

interface SubjectTheme {
  primary: string;
  border: string;
  accent: string;
  bgGradient: string;
  glowColor: string;
  icon: React.ComponentType<any>;
  facts: string[];
  statuses: string[];
}

const SUBJECT_THEMES: Record<SubjectType, SubjectTheme> = {
  biology: {
    primary: "text-emerald-600",
    border: "border-emerald-500",
    accent: "bg-emerald-500",
    bgGradient: "from-emerald-50/20 via-white to-slate-50/30",
    glowColor: "bg-emerald-500/5",
    icon: Dna,
    statuses: [
      "Calibrating virtual microscope optics...",
      "Preparing cell membrane layer...",
      "Synthesizing cellular organelles...",
      "Replicating genetic structures...",
      "Stabilizing biological environment...",
    ],
    facts: [
      "The human body contains about 37.2 trillion cells.",
      "Mitochondria generate most of the chemical energy needed to power the cell's reactions.",
      "Red blood cells are unique because they do not contain a nucleus or mitochondria.",
      "Chloroplasts in plant cells conduct photosynthesis to convert solar energy into chemical energy.",
      "The cell membrane is a selective barrier that controls what enters and exits the cell.",
      "Ribosomes are cellular machines that build proteins from amino acids.",
    ],
  },
  chemistry: {
    primary: "text-amber-600",
    border: "border-amber-500",
    accent: "bg-amber-500",
    bgGradient: "from-amber-50/20 via-white to-slate-50/30",
    glowColor: "bg-amber-500/5",
    icon: FlaskConical,
    statuses: [
      "Sterilizing virtual glassware...",
      "Preparing chemical reactants...",
      "Simulating molecular configurations...",
      "Balancing reaction equations...",
      "Stabilizing thermal environments...",
    ],
    facts: [
      "Water expands when it freezes, unlike most other substances.",
      "An atom consists of a nucleus surrounded by one or more electrons.",
      "Helium is lighter than air, which makes balloons float.",
      "Covalent bonds involve the sharing of electron pairs between atoms.",
      "The periodic table arranges elements by their atomic number and chemical properties.",
      "Acids taste sour and turn blue litmus paper red, while bases feel slippery.",
    ],
  },
  physics: {
    primary: "text-indigo-600",
    border: "border-indigo-500",
    accent: "bg-indigo-500",
    bgGradient: "from-indigo-50/20 via-white to-slate-50/30",
    glowColor: "bg-indigo-500/5",
    icon: Atom,
    statuses: [
      "Calibrating gravitational field constants...",
      "Aligning laser optics...",
      "Calculating vector trajectories...",
      "Simulating conservation parameters...",
      "Resolving kinetic forces...",
    ],
    facts: [
      "Light travels at approximately 299,792 kilometers per second in a vacuum.",
      "Newton's Third Law states that for every action, there is an equal and opposite reaction.",
      "Gravity causes all objects to accelerate downwards at the same rate, regardless of mass, when in a vacuum.",
      "Entropy is a measure of the disorder or randomness in a closed system.",
      "Electromagnetic forces are about 10^36 times stronger than gravitational forces.",
      "Sound waves require a medium (like air or water) to travel, so space is completely silent.",
    ],
  },
  "computer-science": {
    primary: "text-purple-600",
    border: "border-purple-500",
    accent: "bg-purple-500",
    bgGradient: "from-purple-50/20 via-white to-slate-50/30",
    glowColor: "bg-purple-500/5",
    icon: Cpu,
    statuses: [
      "Allocating virtual memory registers...",
      "Parsing algorithmic syntax tree...",
      "Initializing execution threads...",
      "Routing data packets through virtual nodes...",
      "Stabilizing runtime sandbox...",
    ],
    facts: [
      "The first computer bug was a real moth trapped in a relay of the Harvard Mark II in 1947.",
      "Binary code uses only 0s and 1s to represent all computer data.",
      "An algorithm is a step-by-step set of operations to perform a calculation or solve a problem.",
      "Git is a distributed version control system designed to track changes in source code.",
      "Q-learning is a reinforcement learning algorithm used to find the optimal action-selection policy.",
      "The OSI model defines seven layers of computer network protocols.",
    ],
  },
  default: {
    primary: "text-violet-600",
    border: "border-violet-500",
    accent: "bg-violet-500",
    bgGradient: "from-violet-50/20 via-white to-slate-50/30",
    glowColor: "bg-violet-500/5",
    icon: Layers,
    statuses: [
      "Loading virtual laboratory...",
      "Setting up workspace variables...",
      "Connecting to data storage...",
      "Rendering dashboard interfaces...",
      "Starting simulation modules...",
    ],
    facts: [
      "Virtual labs allow scientists and students to safely run experiments without physical hazards.",
      "OpenLabs provides simulated experiments in physics, chemistry, biology, and computer science.",
      "Critical thinking and experimental design are at the core of all scientific discovery.",
      "Interactive models help visualize abstract concepts in science and engineering.",
    ],
  },
};

interface UniversalLoaderProps {
  subject?: SubjectType;
  customMessage?: string;
}

export default function UniversalLoader({ subject = "default", customMessage }: UniversalLoaderProps) {
  const theme = SUBJECT_THEMES[subject] || SUBJECT_THEMES.default;
  const Icon = theme.icon;

  const [statusIndex, setStatusIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % theme.statuses.length);
    }, 1200);

    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % theme.facts.length);
    }, 4500);

    return () => {
      clearInterval(statusInterval);
      clearInterval(factInterval);
    };
  }, [theme]);

  return (
    <div className={`w-full min-h-[420px] flex flex-col items-center justify-center p-8 bg-gradient-to-b ${theme.bgGradient} transition-colors duration-500`}>
      <div className="relative max-w-lg w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-lg flex flex-col items-center overflow-hidden">
        
        {/* Glow Effects */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none ${theme.glowColor}`} />
        
        {/* Animated Icon and Orbit Rings */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Orbiting ring 1 */}
          <div className={`absolute inset-0 rounded-full border-2 border-dashed opacity-30 animate-[spin_12s_linear_infinite] ${theme.border}`} />
          {/* Orbiting ring 2 */}
          <div className={`absolute inset-2 rounded-full border border-dotted opacity-50 animate-[spin_8s_linear_infinite_reverse] ${theme.border}`} />
          {/* Pulsing glow behind icon */}
          <div className={`absolute w-12 h-12 rounded-full blur-md opacity-25 animate-pulse ${theme.accent}`} />
          
          {/* Subject Icon */}
          <Icon className={`w-10 h-10 ${theme.primary} relative z-10 animate-pulse`} />
        </div>

        {/* Status text */}
        <h3 className="text-sm font-bold text-slate-700 tracking-wide text-center h-7 select-none">
          {customMessage || theme.statuses[statusIndex]}
        </h3>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-200/40 relative">
          <motion.div 
            className={`h-full rounded-full ${theme.accent} bg-gradient-to-r from-transparent to-white/40 absolute top-0`}
            initial={{ left: "-40%", width: "40%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Fact Card */}
        <div className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 mt-6 flex flex-col gap-1.5 select-none relative z-10">
          <span className={`text-[10px] uppercase font-extrabold tracking-widest ${theme.primary}`}>
            Did You Know?
          </span>
          <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed min-h-[48px] flex items-center transition-all duration-300">
            {theme.facts[factIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
