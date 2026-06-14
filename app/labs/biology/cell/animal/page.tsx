'use client'

import { useState, useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";
import dynamic from "next/dynamic"
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import UniversalLoader from "@/app/components/UniversalLoader";
import Link from "next/link";
import { 
  Dna, 
  BookOpen, 
  CheckSquare, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  Compass, 
  Award,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from "lucide-react";

const AnimalCell = dynamic(() => import("@/app/components/biology/cell/animal/AnimalCell"), {
  ssr: false,
  loading: () => <UniversalLoader subject="biology" customMessage="Mounting 3D Animal Cell simulation..." />
})

type OrganelleType = 
  | "Nucleus" | "Mitochondria" | "Golgi" | "ER" | "Membrane" 
  | "Lysosome" | "Peroxisome" | "Vacuole" | "Centrosome" 
  | "Ribosome" | "Cytoskeleton" | null;

interface OrganelleDetail {
  title: string;
  description: string;
  color: string;
  functions: string[];
  funFact: string;
}

const ORGANELLE_DETAILS: Record<string, OrganelleDetail> = {
  Membrane: {
    title: "Cell Membrane",
    description: "The semi-permeable phospholipid bilayer that protects the cell and regulates molecular transport.",
    color: "#3b82f6", // Adjusted for better visibility on light bg
    functions: [
      "Selectively regulates import/export of nutrients and waste.",
      "Protects the internal contents of the cell from external fluids.",
      "Plays a key role in cell-to-cell signaling and communication."
    ],
    funFact: "The membrane is fluid and has the consistency of olive oil, allowing proteins to drift floatingly within the lipid bilayer!"
  },
  Nucleus: {
    title: "Nucleus & Nucleolus",
    description: "The double-membrane repository of genetic information (DNA). The inner Nucleolus produces ribosomes.",
    color: "#7c3aed",
    functions: [
      "Safeguards the cell's genetic blueprints (DNA).",
      "Directs cell activities like protein synthesis, growth, and division.",
      "The nucleolus synthesizes ribosomal RNA (rRNA) and assembles ribosome subunits."
    ],
    funFact: "If you uncoiled the DNA inside a single human cell nucleus, it would stretch to a length of about 6 feet (2 meters)!"
  },
  Mitochondria: {
    title: "Mitochondria",
    description: "The powerhouse of the eukaryotic cell. It converts glucose and oxygen into ATP via cellular respiration.",
    color: "#ea580c",
    functions: [
      "Produces ATP (Adenosine Triphosphate), the universal energy currency of cells.",
      "Regulates cellular metabolism, heat production, and cell signaling.",
      "Contains its own unique maternal DNA, pointing to an evolutionary origins story."
    ],
    funFact: "Mitochondria were once independent bacteria that were engulfed by ancestral cells billions of years ago in a process called endosymbiosis!"
  },
  Golgi: {
    title: "Golgi Apparatus",
    description: "A stack of flat cisternae vesicles that modifies, sorts, and packages proteins for cellular or extracellular shipping.",
    color: "#059669",
    functions: [
      "Modifies proteins and lipids by adding carbohydrate groups (glycosylation).",
      "Packages synthesized materials into vesicles for transport.",
      "Acts as the cell's post office, routing biological packages to their correct destinations."
    ],
    funFact: "The Golgi apparatus is named after Camillo Golgi, the Italian biologist who discovered it in 1898 using a silver staining method!"
  },
  ER: {
    title: "Endoplasmic Reticulum",
    description: "A vast membrane network. The Rough ER synthesizes proteins (studded with ribosomes); the Smooth ER produces lipids and detoxifies.",
    color: "#db2777",
    functions: [
      "Rough ER: Folds and processes newly made proteins.",
      "Smooth ER: Synthesizes lipids, phospholipids, and steroid hormones.",
      "Smooth ER also detoxifies drugs, alcohol, and harmful metabolic byproducts."
    ],
    funFact: "Muscles have a specialized Smooth ER called the sarcoplasmic reticulum, which stores and releases calcium ions to trigger muscle contractions!"
  },
  Lysosome: {
    title: "Lysosome",
    description: "Spherical organelles containing acidic digestive enzymes that break down waste, foreign invaders, and old cell parts.",
    color: "#dc2626",
    functions: [
      "Degrades worn-out organelles (autophagy) for raw materials recycling.",
      "Destroys foreign viruses and bacteria ingested by immune cells.",
      "Performs programmed cell death (apoptosis) if the cell is damaged beyond repair."
    ],
    funFact: "Lysosomes are like the cell's recycling center. If they leak or malfunction, it can lead to severe metabolic storage disorders!"
  },
  Peroxisome: {
    title: "Peroxisome",
    description: "Specialized metabolic vesicles that oxidize fatty acids and amino acids, producing and subsequently neutralizing hydrogen peroxide.",
    color: "#0891b2",
    functions: [
      "Breaks down very-long-chain fatty acids via beta-oxidation.",
      "Detoxifies toxic substances (like alcohol in liver cells).",
      "Converts toxic hydrogen peroxide byproduct into harmless water and oxygen."
    ],
    funFact: "Peroxisomes contain crystalline cores of catalase enzymes, which are so packed they can form visible grids under high-resolution microscopes!"
  },
  Vacuole: {
    title: "Vacuole",
    description: "Membrane-bound storage sacs. Smaller in animal cells compared to plants, they store water, nutrients, and waste products.",
    color: "#0284c7",
    functions: [
      "Temporarily stores nutrients, water, and ions.",
      "Isolates waste materials to protect the rest of the cytoplasm.",
      "Helps regulate cytoplasmic pH and fluid balance."
    ],
    funFact: "While plant cells typically have one giant central vacuole, animal cells have multiple small vacuoles scattered throughout!"
  },
  Centrosome: {
    title: "Centrosome (Centrioles)",
    description: "The primary microtubule-organizing center of animal cells, containing a pair of perpendicular centrioles.",
    color: "#d97706",
    functions: [
      "Coordinates the cell's microtubule cytoskeleton network.",
      "Forms the spindle fibers that pull chromosomes apart during cell division.",
      "Assists in organizing cilia and flagella for cellular movement."
    ],
    funFact: "Centrioles are arranged in a perfect cylinder formed of nine triplets of microtubules, looking like high-tech nanotechnology wheels!"
  },
  Ribosome: {
    title: "Ribosomes",
    description: "Intricate complexes of RNA and protein that translate genetic messenger RNA (mRNA) into polypeptide chains.",
    color: "#ca8a04",
    functions: [
      "Decodes mRNA sequences to link amino acids in exact peptide order.",
      "Can be found floating freely in cytoplasm or bound to the Rough ER.",
      "Serves as the structural factory where translation occurs."
    ],
    funFact: "A single active human cell can contain up to 10 million ribosomes, which consumes a significant portion of the cell's total energy!"
  },
  Cytoskeleton: {
    title: "Cytoskeleton",
    description: "A dynamic meshwork of microfilaments, intermediate filaments, and microtubules that structuralizes eukaryotic cytoplasm.",
    color: "#475569",
    functions: [
      "Maintains the mechanical shape of animal cells (which lack cell walls).",
      "Acts as a railway network for molecular motors to move vesicles.",
      "Enables cellular motility (crawling) and contraction."
    ],
    funFact: "The cytoskeleton is constantly assembling and dismantling itself within seconds, allowing cells to change shape and move dynamically!"
  }
};

export default function Page() {
  const { completeExperiment } = useLab("biology/cell/animal", "biology", "exploration");
  const { setExperimentData } = useChat();

  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleType>(null);
  const [exploredOrganelles, setExploredOrganelles] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"explorer" | "log" | "theory">("explorer");

  useEffect(() => {
    setExperimentData({
      title: "3D structure model of animal cell.",
      theory: "Animal cells are eukaryotic cells enclosed by a plasma membrane, containing membrane-bound organelles. They lack cell walls (found in plant cells) and exhibit structures like centrioles/centrosomes involved in cell division.",
      extraContext: `Key organelles explored in this lab: Nucleus, Mitochondria, Golgi, Endoplasmic Reticulum (ER), Cell Membrane, Lysosome, Peroxisome, Vacuoles, Centrosomes, Ribosomes, and Cytoskeleton.`,
    });
  }, []);

  const handleSelect = (type: OrganelleType) => {
    setSelectedOrganelle(type);
    if (type) {
      setActiveTab("explorer");
    }
  };

  const handleExploredChange = (nextExplored: Set<string>) => {
    setExploredOrganelles(nextExplored);
  };

  const activeInfo = selectedOrganelle ? ORGANELLE_DETAILS[selectedOrganelle] : null;

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-800 pb-16 pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Breadcrumbs & Lab Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/biology" className="hover:text-emerald-700 transition-colors">Biology Labs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Animal Cell</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Dna className="w-8 h-8 text-emerald-600" />
            Animal Cell Exploration
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-medium">
            Investigate eukaryotic structure, organelles, and cell biology. Double-click or rotate the 3D model, select cells to explore their function, and test your understanding.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Biology Lab
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            3D Exploration
          </span>
        </div>
      </div>

      {/* Daily Challenge Placement */}
      <DailyChallengeCard 
        labId="biology/cell/animal" 
        currentParams={{ organellesExplored: exploredOrganelles.size }} 
      />

      {/* Lab Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: 3D Microscope Viewport */}
        <div className="lg:col-span-8 flex flex-col h-full space-y-4">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-4 relative flex flex-col flex-grow shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            
            {/* Viewport Control Bar */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="uppercase tracking-wider font-bold">Virtual Microscope Feed</span>
              </div>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => handleSelect(null)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 transition-colors border border-slate-200"
                  title="Reset viewport focus"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Focus
                </button>
              </div>
            </div>

            {/* Canvas Mount - Restricting it to clean viewport card with dark backing */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 flex-grow border border-slate-900 shadow-inner">
              <AnimalCell 
                selected={selectedOrganelle} 
                onSelect={handleSelect} 
                onComplete={completeExperiment} 
                exploredList={exploredOrganelles}
                onExploredChange={handleExploredChange}
                standalone={false}
              />
            </div>

            {/* Viewport Instructions */}
            <div className="pt-3 flex justify-between items-center text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Drag to rotate</span>
              <span>Scroll to zoom</span>
              <span>Right-Click/Shift to Pan</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Telemetry & Database Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px]">
            
            {/* Sidebar Tabs */}
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("explorer")}
                className={`py-3.5 flex flex-col items-center gap-1 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "explorer" 
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50/30" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Compass className="w-4 h-4" />
                Explorer
              </button>
              <button
                onClick={() => setActiveTab("log")}
                className={`py-3.5 flex flex-col items-center gap-1 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "log" 
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50/30" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                Lab Log
              </button>
              <button
                onClick={() => setActiveTab("theory")}
                className={`py-3.5 flex flex-col items-center gap-1 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "theory" 
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50/30" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Theory
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-5 flex-grow overflow-y-auto space-y-4 max-h-[550px]">
              
              {/* Tab 1: Explorer */}
              {activeTab === "explorer" && (
                <div className="space-y-4">
                  {activeInfo ? (
                    <div className="space-y-4 animate-fadeIn">
                      
                      {/* Active Organelle Details */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            Identified Organelle
                          </span>
                          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeInfo.color }} />
                            {activeInfo.title}
                          </h2>
                        </div>
                        <button 
                          onClick={() => handleSelect(null)}
                          className="text-xs font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors border border-slate-200"
                        >
                          Clear
                        </button>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {activeInfo.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-emerald-600" />
                          Key Cellular Functions
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-2 pl-4 list-disc marker:text-emerald-500 font-medium">
                          {activeInfo.functions.map((func, i) => (
                            <li key={i}>{func}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                        <span className="font-extrabold text-emerald-600 uppercase tracking-widest text-[9px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          Science Fun Fact
                        </span>
                        <p className="text-slate-500 leading-relaxed italic font-medium">
                          "{activeInfo.funFact}"
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto">
                        <Compass className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-slate-800">No Organelle Selected</p>
                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-normal">
                          Click directly on parts of the 3D cell structure, or choose one from the directory below to inspect its attributes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Organelle Selection Directory */}
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                      Organelle Directory
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.keys(ORGANELLE_DETAILS).map((key) => {
                        const organelle = ORGANELLE_DETAILS[key];
                        const isExplored = exploredOrganelles.has(key);
                        const isSelected = selectedOrganelle === key;
                        return (
                          <button
                            key={key}
                            onClick={() => handleSelect(key as OrganelleType)}
                            className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all border ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                                : "bg-slate-50/50 border-slate-200/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: organelle.color }} />
                              {organelle.title.split(" ")[0]}
                            </span>
                            {isExplored && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Lab Log Checklist */}
              {activeTab === "log" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-emerald-600 font-bold text-sm">
                        {exploredOrganelles.size}
                      </div>
                      <svg className="absolute w-12 h-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          className="stroke-slate-100"
                          strokeWidth="2"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          className="stroke-emerald-500 transition-all duration-500"
                          strokeWidth="2.5"
                          fill="transparent"
                          strokeDasharray={138.2}
                          strokeDashoffset={138.2 - (138.2 * Math.min(exploredOrganelles.size, 11)) / 11}
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Exploration Tracker</h4>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Identified {exploredOrganelles.size} out of {Object.keys(ORGANELLE_DETAILS).length} structures.
                      </p>
                    </div>
                  </div>

                  {/* Completion Card */}
                  {exploredOrganelles.size >= 3 ? (
                    <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-700">
                      <Award className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
                      <div>
                        <span className="font-bold block">Experiment Checklist Met!</span>
                        You have explored at least 3 structures and fulfilled the lab completion parameters.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs text-slate-500">
                      <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-700 block">Lab Target</span>
                        Identify at least 3 organelle structures in 3D to complete the experiment criteria (Progress: {exploredOrganelles.size}/3).
                      </div>
                    </div>
                  )}

                  {/* Log Checklist */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-2">
                      Identification Log
                    </h4>
                    {Object.keys(ORGANELLE_DETAILS).map((key) => {
                      const organelle = ORGANELLE_DETAILS[key];
                      const isExplored = exploredOrganelles.has(key);
                      return (
                        <div
                          key={key}
                          onClick={() => handleSelect(key as OrganelleType)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isExplored
                              ? "bg-slate-50 border-slate-200 text-slate-800 font-medium"
                              : "bg-white border-slate-100 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${isExplored ? "" : "opacity-30"}`} 
                              style={{ backgroundColor: organelle.color }} 
                            />
                            <span>{organelle.title}</span>
                          </div>
                          {isExplored ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Identified
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">
                              Unexplored
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Tab 3: Cell Theory */}
              {activeTab === "theory" && (
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Eukaryotic Cell Biology
                    </h4>
                    <p className="text-slate-500 font-medium">
                      Animal cells are typical eukaryotic cell systems. Unlike prokaryotic cells (like bacteria), eukaryotic cells partition their tasks across membrane-bound structures called **organelles**.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-150 pt-3">
                    <h4 className="text-xs uppercase font-bold text-slate-800">Animal vs. Plant Cells</h4>
                    <p className="text-slate-500 font-medium">
                      While both are eukaryotic, they contain fundamental differences:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-500 font-medium">
                      <li><strong>Cell Wall:</strong> Plant cells contain a rigid cellulose cell wall; animal cells have only a flexible cell membrane.</li>
                      <li><strong>Chloroplasts:</strong> Plants utilize chloroplasts for photosynthesis; animal cells generate energy strictly via cellular respiration in mitochondria.</li>
                      <li><strong>Vacuoles:</strong> Plants contain one giant central vacuole; animal cells feature small, scattered vacuoles.</li>
                      <li><strong>Centrosomes:</strong> Animal cells contain centrioles for dividing chromosomes; most higher plants lack centrioles.</li>
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-slate-150 pt-3">
                    <h4 className="text-xs uppercase font-bold text-slate-800">The Fluid Mosaic Model</h4>
                    <p className="text-slate-500 font-medium">
                      The membrane is a double layer of phospholipids. Hydrophilic heads face outwards, and hydrophobic tails point inwards, creating a self-sealing barrier that maintains homeostasis.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
