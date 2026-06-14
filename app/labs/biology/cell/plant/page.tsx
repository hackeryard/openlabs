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

const PlantCell = dynamic(() => import("@/app/components/biology/cell/plant/PlantCell"), {
  ssr: false,
  loading: () => <UniversalLoader subject="biology" customMessage="Mounting 3D Plant Cell simulation..." />
})

type OrganelleType = 
  | "Nucleus" | "Mitochondria" | "Golgi" | "ER" | "CellWall" 
  | "Chloroplast" | "LargeVacuole" | "Ribosome" | "Cytoskeleton" | null;

interface OrganelleDetail {
  title: string;
  description: string;
  color: string;
  functions: string[];
  funFact: string;
}

const ORGANELLE_DETAILS: Record<string, OrganelleDetail> = {
  CellWall: {
    title: "Cell Wall & Membrane",
    description: "The Cell Wall is a rigid cellulose box enclosing the plant cell. The Membrane is the thin, selective liner just inside it.",
    color: "#4d7c0f", // Darker green for readability on light bg
    functions: [
      "Provides mechanical strength, support, and a rigid shape to the plant cell.",
      "Protects against physical damage and limits invasion by plant pathogens.",
      "Resists turgor pressure from water intake, preventing the cell from bursting."
    ],
    funFact: "Cellulose, which forms the cell wall, is the most abundant biological macromolecule on Earth!"
  },
  Nucleus: {
    title: "Nucleus",
    description: "The double-membrane command center containing genomic DNA. In plants, it is pushed to the side by the central vacuole.",
    color: "#7c3aed",
    functions: [
      "Encloses the plant's genomic DNA blueprints.",
      "Directs transcription, translation control, and cellular reproduction.",
      "Site of ribosomal RNA assembly in the nucleolus."
    ],
    funFact: "In plant cells, the nucleus is pushed away from the center to the periphery because of the massive central vacuole!"
  },
  Chloroplast: {
    title: "Chloroplast",
    description: "The solar energy generator of plant cells. It utilizes green chlorophyll pigment to conduct photosynthesis.",
    color: "#16a34a",
    functions: [
      "Captures solar light energy to trigger synthesis reactions.",
      "Converts carbon dioxide and water into glucose and oxygen (Photosynthesis).",
      "Contains its own unique circular genome, suggesting endosymbiotic origins."
    ],
    funFact: "Chloroplasts can orient themselves inside plant cells, moving towards light on dark days and hiding on extremely bright days to avoid damage!"
  },
  LargeVacuole: {
    title: "Large Central Vacuole",
    description: "A massive, fluid-filled membrane sac that acts as a storage tank and maintains cellular turgor pressure.",
    color: "#0284c7",
    functions: [
      "Stores large reserves of water, enzymes, organic acids, and ions.",
      "Pushes outward against the cell wall to keep the plant stiff and upright (turgor pressure).",
      "Degrades cellular waste materials, functioning similarly to animal lysosomes."
    ],
    funFact: "When a plant wilts, it is because its central vacuole has lost water, reducing turgor pressure and making the cells go limp!"
  },
  Mitochondria: {
    title: "Mitochondria",
    description: "The energy-producing powerhouse. It oxidizes sugars synthesized during photosynthesis to generate ATP.",
    color: "#ea580c",
    functions: [
      "Conducts cellular respiration to produce Adenosine Triphosphate (ATP).",
      "Breaks down glucose produced by photosynthesis into usable cellular energy.",
      "Assists in maintaining calcium homeostasis and metabolic signaling."
    ],
    funFact: "Yes, plants have mitochondria! Even though they synthesize glucose via photosynthesis, they still need mitochondria to convert that glucose into ATP!"
  },
  Golgi: {
    title: "Golgi Apparatus",
    description: "A series of membrane stacks that modifies, sorts, and packages materials, particularly structural polysaccharides for the cell wall.",
    color: "#db2777",
    functions: [
      "Synthesizes complex matrix polysaccharides (like pectin) for building cell walls.",
      "Modifies proteins and lipids by adding glycan chains (glycosylation).",
      "Routes shipping vesicles to the plasma membrane and cell wall."
    ],
    funFact: "In plant cells, the Golgi stacks are sometimes scattered individually in the cytoplasm and are called dictyosomes!"
  },
  ER: {
    title: "Endoplasmic Reticulum",
    description: "A comprehensive membrane labyrinth. Rough ER handles protein processing; Smooth ER synthesizes lipids and handles transport.",
    color: "#c026d3",
    functions: [
      "Synthesizes and processes proteins studded on the Rough ER surface.",
      "Produces lipids and cellular membranes.",
      "Connects neighboring cells through plasmodesmata via desmotubules."
    ],
    funFact: "The plant ER forms structural bridges called desmotubules that pass through cell walls, connecting neighboring cells' cytoplasm!"
  },
  Ribosome: {
    title: "Ribosomes",
    description: "Macromolecular complexes of RNA and protein that catalyze polypeptide translation from mRNA templates.",
    color: "#ca8a04",
    functions: [
      "Translates mRNA nucleotide triplets into specific amino acid chains.",
      "Synthesizes essential structural and metabolic proteins.",
      "Can be found floating in the cytosol or attached to the membrane of the Rough ER."
    ],
    funFact: "A single plant cell can have thousands of active ribosomes, translating proteins essential for cell growth and defense!"
  },
  Cytoskeleton: {
    title: "Cytoskeleton",
    description: "A structural grid of microtubules and actin filaments that establishes cell shape and directs internal molecular traffic.",
    color: "#475569",
    functions: [
      "Guides the movement and deposition of cellulose microfibrils during cell wall synthesis.",
      "Forms tracks for myosin and kinesin motors to transport vesicles.",
      "Assembles the phragmoplast during cellular division (mitosis) to build a new cell plate."
    ],
    funFact: "The plant cytoskeleton is crucial for cytoplasmic streaming, which is the constant circling of cytoplasm that distributes nutrients!"
  }
};

export default function Page() {
  const { completeExperiment } = useLab("biology/cell/plant", "biology", "exploration");
  const { setExperimentData } = useChat();

  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleType>(null);
  const [exploredOrganelles, setExploredOrganelles] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"explorer" | "log" | "theory">("explorer");

  useEffect(() => {
    setExperimentData({
      title: "3D structure model of plant cell.",
      theory: "Plant cells are eukaryotic cells containing features not seen in animal cells: a rigid cellulose Cell Wall, Chloroplasts for generating energy from sunlight, and a giant Large Central Vacuole for osmotic regulation. They lack centrosomes with centrioles, relying on other microtubule centers.",
      extraContext: `Key plant cell structures to explore: Cell Wall, Large Central Vacuole, Chloroplasts, Nucleus, Mitochondria, Golgi, ER, Ribosomes, and Cytoskeleton.`,
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
            <span className="text-slate-500">Plant Cell</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Dna className="w-8 h-8 text-emerald-600" />
            Plant Cell Exploration
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-medium">
            Investigate photosynthetic plant eukaryotic structure, central vacuole turgor, and chloroplast mechanics. Rotate the 3D model, select cells to explore their function, and complete targets.
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
        labId="biology/cell/plant" 
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
              <PlantCell 
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
                            Identified Structure
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
                        <p className="text-sm font-semibold text-slate-800">No Structure Selected</p>
                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-normal">
                          Click directly on the plant cell structure, or choose one from the directory list to examine its properties.
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
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: organelle.color }} />
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
                          strokeDashoffset={138.2 - (138.2 * Math.min(exploredOrganelles.size, 9)) / 9}
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
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-700">
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
                      Plant Cell Biology
                    </h4>
                    <p className="text-slate-500 font-medium">
                      Plant cells are eukaryotic cells with structural features optimized for solar energy harvesting and architectural support.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <h4 className="text-xs uppercase font-bold text-slate-800">The Power of Turgor Pressure</h4>
                    <p className="text-slate-500 font-medium font-normal">
                      The Large Central Vacuole absorbs water, expanding like a balloon inside the rigid Cellulose Cell Wall. This outward force is called **turgor pressure** and is what holds non-woody plants upright!
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <h4 className="text-xs uppercase font-bold text-slate-800">Photosynthesis Machinery</h4>
                    <p className="text-slate-500 font-medium font-normal">
                      Chloroplasts capture photons using green chlorophyll pigment to build glucose molecules. This is an endothermic chemical pathway:
                      <br/>
                      <span className="block mt-1 font-mono text-[10px] bg-slate-950 p-1.5 rounded border border-slate-800 text-emerald-400 text-center">
                        6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
                      </span>
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
