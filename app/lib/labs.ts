// app/lib/labs.ts

export type LabType = "simulation" | "exploration" | "editor"

export interface Lab {
  id: string
  name: string
  subject: "physics" | "chemistry" | "biology" | "computerScience" | "mathematics"
  type: LabType
  challengeParams: string[]
  description: string
}

export const LABS: Lab[] = [

  // ─── PHYSICS ───────────────────────────────────────────
  {
    id: "physics/freefall",
    name: "Free Fall",
    subject: "physics",
    type: "simulation",
    challengeParams: ["time", "velocity", "height"],
    description: "Free fall motion under gravity",
  },
  {
    id: "physics/projectilemotion",
    name: "Projectile Motion",
    subject: "physics",
    type: "simulation",
    challengeParams: ["range", "maxHeight", "time"],
    description: "Projectile motion analysis",
  },
  {
    id: "physics/simplependulum",
    name: "Simple Pendulum",
    subject: "physics",
    type: "simulation",
    challengeParams: ["period", "frequency"],
    description: "Pendulum oscillation experiment",
  },
  {
    id: "physics/hookelaw",
    name: "Hooke's Law",
    subject: "physics",
    type: "simulation",
    challengeParams: ["extension", "force"],
    description: "Spring force and extension",
  },
  {
    id: "physics/ohmslaw",
    name: "Ohm's Law",
    subject: "physics",
    type: "simulation",
    challengeParams: ["current", "voltage", "resistance"],
    description: "Voltage, current, and resistance",
  },
  {
    id: "physics/energyconservation",
    name: "Energy Conservation",
    subject: "physics",
    type: "simulation",
    challengeParams: ["kineticEnergy", "potentialEnergy"],
    description: "Conservation of mechanical energy",
  },
  {
    id: "physics/rclab",
    name: "RC Circuit",
    subject: "physics",
    type: "simulation",
    challengeParams: ["timeConstant", "voltage"],
    description: "RC circuit charge and discharge",
  },
  {
    id: "physics/speedoflight",
    name: "Speed of Light",
    subject: "physics",
    type: "exploration",
    challengeParams: ["wavelength", "frequency"],
    description: "Speed of light experiments",
  },
  {
    id: "physics/uniformmotionlab",
    name: "Uniform Motion",
    subject: "physics",
    type: "simulation",
    challengeParams: ["distance", "time", "speed"],
    description: "Constant velocity motion",
  },
  {
    id: "physics/waveoptics",
    name: "Wave Optics",
    subject: "physics",
    type: "exploration",
    challengeParams: ["fringeWidth", "wavelength"],
    description: "Wave optics and diffraction",
  },

  // ─── CHEMISTRY ─────────────────────────────────────────
  {
    id: "chemistry/periodictable",
    name: "Periodic Table",
    subject: "chemistry",
    type: "exploration",
    challengeParams: ["elementsVisited", "groupExplored", "periodExplored"],
    description: "Interactive periodic table explorer",
  },
  {
    id: "chemistry/chemicalbonds",
    name: "Chemical Bonds",
    subject: "chemistry",
    type: "exploration",
    challengeParams: ["bondsExplored"],
    description: "Ionic, covalent, and metallic bonding",
  },
  {
    id: "chemistry/electronic-configuration",
    name: "Electronic Configuration",
    subject: "chemistry",
    type: "exploration",
    challengeParams: ["elementsVisualized"],
    description: "Atomic structure and electron configuration",
  },
  {
    id: "chemistry/reaction-simulation",
    name: "Reaction Simulator",
    subject: "chemistry",
    type: "simulation",
    challengeParams: ["reactionsRun", "temperature", "yield"],
    description: "Chemical reaction builder",
  },

  // ─── BIOLOGY ───────────────────────────────────────────
  {
    id: "biology/cell/animal",
    name: "Animal Cell",
    subject: "biology",
    type: "exploration",
    challengeParams: ["organellesExplored"],
    description: "3D interactive animal cell",
  },
  {
    id: "biology/cell/plant",
    name: "Plant Cell",
    subject: "biology",
    type: "exploration",
    challengeParams: ["organellesExplored"],
    description: "3D interactive plant cell",
  },
  {
    id: "biology/human",
    name: "Human Anatomy",
    subject: "biology",
    type: "exploration",
    challengeParams: ["structuresExplored"],
    description: "Human anatomy explorer",
  },

  // ─── COMPUTER SCIENCE ──────────────────────────────────
  {
    id: "computer-science/code-lab/html-css-js",
    name: "HTML/CSS/JS Editor",
    subject: "computerScience",
    type: "editor",
    challengeParams: ["codeRuns", "consoleOutputMatched"],
    description: "Live web code editor",
  },
  {
    id: "computer-science/code-lab/js",
    name: "JS Visual Debugger",
    subject: "computerScience",
    type: "editor",
    challengeParams: ["stepsDebugged", "variablesInspected"],
    description: "JavaScript step-through debugger",
  },
  {
    id: "computer-science/dsa",
    name: "DSA Visualizer",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["algorithmsRun", "structuresExplored"],
    description: "Data structures and algorithms",
  },
  {
    id: "computer-science/logic-gates",
    name: "Logic Gates",
    subject: "computerScience",
    type: "simulation",
    challengeParams: ["outputMatched", "gatesUsed"],
    description: "Boolean logic and digital circuits",
  },
  {
    id: "computer-science/git-simulator",
    name: "Git Simulator",
    subject: "computerScience",
    type: "simulation",
    challengeParams: ["commandsRun", "branchesCreated"],
    description: "Interactive Git version control",
  },
  {
    id: "computer-science/networking",
    name: "Networking Lab",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["protocolsExplored"],
    description: "Network protocols simulator",
  },
  {
    id: "computer-science/blockchain",
    name: "Blockchain Explorer",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["blocksExplored"],
    description: "Blockchain technology explorer",
  },
  {
    id: "computer-science/data-analyzer",
    name: "Data Analyzer",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["datasetsAnalyzed", "chartsGenerated"],
    description: "Data visualization and analysis",
  },
  {
    id: "computer-science/data-science",
    name: "Data Science",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["experimentsRun"],
    description: "Data science and ML experiments",
  },
  {
    id: "computer-science/ai-problem",
    name: "AI Problem Solver",
    subject: "computerScience",
    type: "exploration",
    challengeParams: ["problemsSolved"],
    description: "AI-powered problem solving",
  },
]

export const getLabById = (id: string) => LABS.find(l => l.id === id)
export const getLabsBySubject = (subject: string) => LABS.filter(l => l.subject === subject)
export const getLabsByType = (type: LabType) => LABS.filter(l => l.type === type)