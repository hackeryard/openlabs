// app/lib/tracks.ts

export type Discipline = "physics" | "chemistry" | "biology" | "computerScience" | "mathematics";
export type TrackDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TrackLabStep {
  labId: string;              // Registered lab ID (e.g. "physics/freefall")
  title: string;              // Human readable step title
  description: string;        // 1-line educational summary
  estimatedMinutes: number;   // Expected completion time
  simRoute: string;           // Direct route to simulation (e.g. "/labs/physics/freefall")
  landingRoute: string;       // Direct route to landing page (e.g. "/physics/freefall")
}

export interface CurriculumTrack {
  id: string;                 // Unique slug (e.g. "physics-classical-mechanics")
  title: string;              // e.g. "Classical Mechanics & Dynamics"
  subject: Discipline;        // "physics" | "chemistry" | "biology" | ...
  headline: string;           // e.g. "Master Newtonian motion, ballistics, and energy conservation"
  difficulty: TrackDifficulty;// "Beginner" | "Intermediate" | "Advanced"
  estimatedHours: string;     // e.g. "1.5 hours"
  totalXP: number;            // e.g. 350 XP
  badgeName: string;          // e.g. "Mechanics Virtuoso"
  badgeIcon: string;          // e.g. "Atom"
  steps: TrackLabStep[];      // Ordered sequence of labs
}

export interface TrackProgress {
  track: CurriculumTrack;
  completedSteps: number;
  totalSteps: number;
  percentage: number;
  isComplete: boolean;
  nextStep: TrackLabStep | null;
  currentStepIndex: number;
  status: "not_started" | "in_progress" | "completed";
}

// ── GUIDED CURRICULUM TRACKS (MAPPING 94 LABS) ─────────────────────────

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  // ─── PHYSICS TRACKS ─────────────────────────────────────────────────────────
  {
    id: "physics-classical-mechanics",
    title: "Classical Mechanics & Kinematics Track",
    subject: "physics",
    headline: "Master 1D & 2D motion, projectile trajectories, spring forces, and energy conservation.",
    difficulty: "Beginner",
    estimatedHours: "1.5 hours",
    totalXP: 300,
    badgeName: "Mechanics Virtuoso",
    badgeIcon: "Atom",
    steps: [
      {
        labId: "physics/uniformmotionlab",
        title: "Uniform Motion & Kinematics",
        description: "Constant velocity motion, position-time vs velocity-time curves, and ticker timers.",
        estimatedMinutes: 12,
        simRoute: "/labs/physics/uniformmotionlab",
        landingRoute: "/physics/uniformmotionlab",
      },
      {
        labId: "physics/freefall",
        title: "Free Fall & Terminal Velocity",
        description: "Galilean vacuum free fall, aerodynamic drag, terminal velocity, and planetary gravitation.",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/freefall",
        landingRoute: "/physics/freefall",
      },
      {
        labId: "physics/projectilemotion",
        title: "Projectile Motion & Ballistics",
        description: "2D parabolic trajectories, elevation cliffs, complementary angles, and air drag.",
        estimatedMinutes: 18,
        simRoute: "/labs/physics/projectilemotion",
        landingRoute: "/physics/projectilemotion",
      },
      {
        labId: "physics/hookelaw",
        title: "Hooke's Law & Springs",
        description: "Restoring forces, spring constants (k), series vs parallel springs, and elastic energy.",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/hookelaw",
        landingRoute: "/physics/hookelaw",
      },
      {
        labId: "physics/energyconservation",
        title: "Mechanical Energy Conservation & Coasters",
        description: "Kinetic, gravitational, and thermal energy conversion with loop-the-loop critical apex dynamics.",
        estimatedMinutes: 18,
        simRoute: "/labs/physics/energyconservation",
        landingRoute: "/physics/energyconservation",
      },
      {
        labId: "physics/simplependulum",
        title: "Simple Pendulum & Harmonic Motion",
        description: "Small vs large-angle oscillations, phase-space plots, and exact period T = 2π√(L/g).",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/simplependulum",
        landingRoute: "/physics/simplependulum",
      },
      {
        labId: "physics/kepler-orbit",
        title: "Kepler Orbit & Gravitational Mechanics",
        description: "Elliptical planetary orbits, Kepler's 3 laws, Vis-Viva velocity equations, and equal swept area conservation.",
        estimatedMinutes: 18,
        simRoute: "/labs/physics/kepler-orbit",
        landingRoute: "/physics/kepler-orbit",
      },
    ],
  },
  {
    id: "physics-electromagnetism",
    title: "Electromagnetism & Circuit Physics Track",
    subject: "physics",
    headline: "Build electrical circuits, measure RC transients, and simulate Faraday induction.",
    difficulty: "Intermediate",
    estimatedHours: "1.2 hours",
    totalXP: 250,
    badgeName: "Circuit Architect",
    badgeIcon: "Zap",
    steps: [
      {
        labId: "physics/ohmslaw",
        title: "Ohm's Law & Circuit Workbench",
        description: "Voltage, current, resistance, series/parallel loops, and digital multimeters.",
        estimatedMinutes: 20,
        simRoute: "/labs/physics/ohmslaw",
        landingRoute: "/physics/ohmslaw",
      },
      {
        labId: "physics/rclab",
        title: "RC Circuit Transient Analysis",
        description: "Capacitor charging and discharging time constants (τ = RC) and exponential voltage curves.",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/rclab",
        landingRoute: "/physics/rclab",
      },
      {
        labId: "physics/faradays-law",
        title: "Faraday's Law & Induction",
        description: "Magnetic flux, Lenz's law, coil turns, and zero-center galvanometer deflection.",
        estimatedMinutes: 18,
        simRoute: "/labs/physics/faradays-law",
        landingRoute: "/physics/faradays-law",
      },
      {
        labId: "physics/speedoflight",
        title: "Speed of Light & Refraction",
        description: "Electromagnetic propagation, Snell's law, and Total Internal Reflection (TIR).",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/speedoflight",
        landingRoute: "/physics/speedoflight",
      },
    ],
  },
  {
    id: "physics-optics-quantum",
    title: "Optics & Quantum Thermodynamics Track",
    subject: "physics",
    headline: "Explore wave diffraction, thin lens image formation, quantum photons, and Carnot cycles.",
    difficulty: "Advanced",
    estimatedHours: "1.5 hours",
    totalXP: 300,
    badgeName: "Quantum Pioneer",
    badgeIcon: "Sparkles",
    steps: [
      {
        labId: "physics/opticslens",
        title: "Geometric Optics & Lens Ray Tracing",
        description: "Convex and concave thin lenses, principal ray tracing, and image magnification.",
        estimatedMinutes: 15,
        simRoute: "/labs/physics/opticslens",
        landingRoute: "/physics/opticslens",
      },
      {
        labId: "physics/waveoptics",
        title: "Wave Optics & Young's Double Slit",
        description: "Constructive/destructive interference fringes, diffraction gratings, and wavelength spreads.",
        estimatedMinutes: 18,
        simRoute: "/labs/physics/waveoptics",
        landingRoute: "/physics/waveoptics",
      },
      {
        labId: "physics/photoelectric-effect",
        title: "Photoelectric Effect & Photons",
        description: "Photon energy (E = hf), cathode metal work functions, and stopping potential.",
        estimatedMinutes: 20,
        simRoute: "/labs/physics/photoelectric-effect",
        landingRoute: "/physics/photoelectric-effect",
      },
      {
        labId: "physics/thermodynamics",
        title: "Thermodynamics & Carnot Engines",
        description: "4-stroke Carnot cycle, isothermal/adiabatic expansion, and P-V indicator loops.",
        estimatedMinutes: 20,
        simRoute: "/labs/physics/thermodynamics",
        landingRoute: "/physics/thermodynamics",
      },
      {
        labId: "physics/doppler-effect",
        title: "Doppler Effect & Sonic Boom",
        description: "Moving wave sources, wavefront compression, sonic barrier shock waves, and supersonic Mach cone envelopes.",
        estimatedMinutes: 16,
        simRoute: "/labs/physics/doppler-effect",
        landingRoute: "/physics/doppler-effect",
      },
    ],
  },

  // ─── CHEMISTRY TRACKS ───────────────────────────────────────────────────────
  {
    id: "chem-atomic-structure",
    title: "Atomic Structure & Periodic Trends Track",
    subject: "chemistry",
    headline: "Understand electron configurations, periodic trends, chemical bonding, and emission spectra.",
    difficulty: "Beginner",
    estimatedHours: "1.2 hours",
    totalXP: 250,
    badgeName: "Atomic Scholar",
    badgeIcon: "Flame",
    steps: [
      {
        labId: "chemistry/periodictable",
        title: "Interactive Periodic Table",
        description: "118 elements, property heatmaps (electronegativity, atomic radius, ionization energy).",
        estimatedMinutes: 15,
        simRoute: "/labs/chemistry/periodictable",
        landingRoute: "/chemistry/periodictable",
      },
      {
        labId: "chemistry/electronic-configuration",
        title: "Electronic Configuration",
        description: "Aufbau energy levels, Pauli exclusion spin, and Hund's rule orbital box filling.",
        estimatedMinutes: 15,
        simRoute: "/labs/chemistry/electronic-configuration",
        landingRoute: "/chemistry/electronic-configuration",
      },
      {
        labId: "chemistry/chemicalbonds",
        title: "Chemical Bonding Studio",
        description: "Ionic electron transfers, polar/non-polar covalent sharing, and metallic electron seas.",
        estimatedMinutes: 18,
        simRoute: "/labs/chemistry/chemicalbonds",
        landingRoute: "/chemistry/chemicalbonds",
      },
      {
        labId: "chemistry/flame-test",
        title: "Flame Test & Emission Spectrometry",
        description: "Thermal electron excitation, metal cation flame colors, and spectroscope spectral lines.",
        estimatedMinutes: 15,
        simRoute: "/labs/chemistry/flame-test",
        landingRoute: "/chemistry/flame-test",
      },
    ],
  },
  {
    id: "chem-physical-analytical",
    title: "Physical & Analytical Chemistry Track",
    subject: "chemistry",
    headline: "Simulate chemical stoichiometry, acid-base titrations, gas laws, redox cells, and 3D VSEPR.",
    difficulty: "Intermediate",
    estimatedHours: "2.0 hours",
    totalXP: 350,
    badgeName: "Master Alchemist",
    badgeIcon: "Flame",
    steps: [
      {
        labId: "chemistry/reaction-simulation",
        title: "Chemical Reaction Builder",
        description: "Stoichiometry balancing, limiting reagents, and exothermic/endothermic energy profiles.",
        estimatedMinutes: 18,
        simRoute: "/labs/chemistry/reaction-simulation",
        landingRoute: "/chemistry/reaction-simulation",
      },
      {
        labId: "chemistry/titration",
        title: "Virtual Acid-Base Titration",
        description: "Precision burette dropwise delivery, pH indicator color shifts, and neutralization curves.",
        estimatedMinutes: 20,
        simRoute: "/labs/chemistry/titration",
        landingRoute: "/chemistry/titration",
      },
      {
        labId: "chemistry/gas-laws",
        title: "Gas Laws & Kinetic Theory",
        description: "Piston cylinder volume, ideal gas law PV = nRT, and Maxwell-Boltzmann molecular speeds.",
        estimatedMinutes: 18,
        simRoute: "/labs/chemistry/gas-laws",
        landingRoute: "/chemistry/gas-laws",
      },
      {
        labId: "chemistry/electrochemistry",
        title: "Galvanic & Electrolytic Redox Cells",
        description: "Daniell cell half-reactions, salt bridge ion migration, voltmeter, and Nernst equation.",
        estimatedMinutes: 20,
        simRoute: "/labs/chemistry/electrochemistry",
        landingRoute: "/chemistry/electrochemistry",
      },
      {
        labId: "chemistry/vsepr-geometry",
        title: "3D Molecular Geometry & VSEPR",
        description: "Electrostatic domain repulsions, lone pair distortions, hybridization, and net dipoles.",
        estimatedMinutes: 20,
        simRoute: "/labs/chemistry/vsepr-geometry",
        landingRoute: "/chemistry/vsepr-geometry",
      },
      {
        labId: "chemistry/water-quality",
        title: "Water Quality Testing Lab",
        description: "Colorimetric tests, turbidity, pH, dissolved oxygen, and EDTA water hardness titrations.",
        estimatedMinutes: 15,
        simRoute: "/labs/chemistry/water-quality",
        landingRoute: "/chemistry/water-quality",
      },
    ],
  },

  // ─── BIOLOGY TRACKS ─────────────────────────────────────────────────────────
  {
    id: "bio-cytology-genetics",
    title: "Cell Biology & Molecular Genetics Track",
    subject: "biology",
    headline: "Dissect 3D eukaryotic cells, solve Punnett crosses, translate DNA, and analyze pedigrees.",
    difficulty: "Beginner",
    estimatedHours: "1.8 hours",
    totalXP: 320,
    badgeName: "Genetics Specialist",
    badgeIcon: "Dna",
    steps: [
      {
        labId: "biology/cell/animal",
        title: "3D Animal Cell Cytology",
        description: "Nucleus, mitochondria, ER, Golgi apparatus, ribosomes, and organelle ultrastructure.",
        estimatedMinutes: 15,
        simRoute: "/labs/biology/cell/animal",
        landingRoute: "/biology/cell/animal",
      },
      {
        labId: "biology/cell/plant",
        title: "3D Plant Cell Cytology",
        description: "Cellulose cell walls, thylakoid chloroplasts, large central vacuoles, and turgidity.",
        estimatedMinutes: 15,
        simRoute: "/labs/biology/cell/plant",
        landingRoute: "/biology/cell/plant",
      },
      {
        labId: "biology/genetics/monohybrid",
        title: "Monohybrid Punnett Squares",
        description: "Single-trait Mendelian crosses, 3:1 phenotypic ratios, and 100-offspring breeders.",
        estimatedMinutes: 15,
        simRoute: "/labs/biology/genetics/monohybrid",
        landingRoute: "/biology/genetics/monohybrid",
      },
      {
        labId: "biology/genetics/dihybrid",
        title: "Dihybrid Cross & Assortment",
        description: "16-cell two-trait matrix tracking Law of Independent Assortment (9:3:3:1 ratio).",
        estimatedMinutes: 18,
        simRoute: "/labs/biology/genetics/dihybrid",
        landingRoute: "/biology/genetics/dihybrid",
      },
      {
        labId: "biology/genetics/transcription-translation",
        title: "DNA Transcription & Translation",
        description: "Central Dogma mRNA synthesis, tRNA ribosome codon reading, and mutation testing.",
        estimatedMinutes: 20,
        simRoute: "/labs/biology/genetics/transcription-translation",
        landingRoute: "/biology/genetics/transcription-translation",
      },
      {
        labId: "biology/genetics/pedigree",
        title: "Pedigree Family Tree Analysis",
        description: "3-generation family counselor tracking Autosomal and X-Linked recessive traits.",
        estimatedMinutes: 18,
        simRoute: "/labs/biology/genetics/pedigree",
        landingRoute: "/biology/genetics/pedigree",
      },
    ],
  },
  {
    id: "bio-physiology-bioenergetics",
    title: "Physiology, Bioenergetics & Anatomy Track",
    subject: "biology",
    headline: "Simulate photosynthesis, mitochondrial ATP respiration, enzyme kinetics, and action potentials.",
    difficulty: "Intermediate",
    estimatedHours: "2.2 hours",
    totalXP: 380,
    badgeName: "Physiology Maestro",
    badgeIcon: "Activity",
    steps: [
      {
        labId: "biology/photosynthesis",
        title: "Photosynthesis & Limiting Factors",
        description: "Light intensity, CO₂ levels, temperature, and aquatic bubble counting rates.",
        estimatedMinutes: 18,
        simRoute: "/labs/biology/photosynthesis",
        landingRoute: "/biology/photosynthesis",
      },
      {
        labId: "biology/cellular-respiration",
        title: "Cellular Respiration & Mitochondria",
        description: "Glycolysis, Krebs cycle, proton gradient pumping, and rotary ATP Synthase.",
        estimatedMinutes: 20,
        simRoute: "/labs/biology/cellular-respiration",
        landingRoute: "/biology/cellular-respiration",
      },
      {
        labId: "biology/enzyme-kinetics",
        title: "Enzyme Kinetics & Catalysis",
        description: "Michaelis-Menten V_max, K_m constants, and competitive/non-competitive inhibitors.",
        estimatedMinutes: 20,
        simRoute: "/labs/biology/enzyme-kinetics",
        landingRoute: "/biology/enzyme-kinetics",
      },
      {
        labId: "biology/osmosis-tonicity",
        title: "Osmosis & Cell Tonicity",
        description: "Hypertonic/hypotonic water diffusion, RBC hemolysis/crenation, and plant turgor.",
        estimatedMinutes: 18,
        simRoute: "/labs/biology/osmosis-tonicity",
        landingRoute: "/biology/osmosis-tonicity",
      },
      {
        labId: "biology/brainNeuron",
        title: "3D Brain Neuron Action Potentials",
        description: "Resting membrane potential (-70mV), Na+/K+ channels, and synaptic transmission.",
        estimatedMinutes: 20,
        simRoute: "/labs/biology/brainNeuron",
        landingRoute: "/biology/brainNeuron",
      },
      {
        labId: "biology/blood",
        title: "Blood Grouping & Transfusion",
        description: "ABO and Rh antigen-antibody agglutination tests and compatibility matrix.",
        estimatedMinutes: 15,
        simRoute: "/labs/biology/blood",
        landingRoute: "/biology/blood",
      },
      {
        labId: "biology/human",
        title: "3D Human Anatomy Systems",
        description: "Cardiovascular, respiratory, digestive, and skeletal organ physiology.",
        estimatedMinutes: 20,
        simRoute: "/labs/biology/human",
        landingRoute: "/biology/human",
      },
    ],
  },

  // ─── COMPUTER SCIENCE TRACKS ───────────────────────────────────────────────
  {
    id: "cs-algorithms-dsa",
    title: "Algorithms & Data Structures Track",
    subject: "computerScience",
    headline: "Visualize Big-O sorting algorithms, linked lists, stacks, queues, and graph pathfinding.",
    difficulty: "Beginner",
    estimatedHours: "2.0 hours",
    totalXP: 350,
    badgeName: "Algorithm Master",
    badgeIcon: "Binary",
    steps: [
      {
        labId: "computer-science/dsa/sorting/bubble-sort",
        title: "Bubble Sort Algorithm",
        description: "Adjacent comparison swaps, early-exit optimization, and O(n²) time complexity.",
        estimatedMinutes: 12,
        simRoute: "/labs/computer-science/dsa/sorting/bubble-sort",
        landingRoute: "/computer-science/dsa/sorting/bubble-sort",
      },
      {
        labId: "computer-science/dsa/sorting/insertion-sort",
        title: "Insertion Sort Algorithm",
        description: "Card-style sorting, O(n) best-case for nearly sorted lists, and element shifting.",
        estimatedMinutes: 12,
        simRoute: "/labs/computer-science/dsa/sorting/insertion-sort",
        landingRoute: "/computer-science/dsa/sorting/insertion-sort",
      },
      {
        labId: "computer-science/dsa/sorting/merge-sort",
        title: "Merge Sort Algorithm",
        description: "Divide-and-Conquer recursion trees, auxiliary buffers, and O(n log n) guarantees.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/dsa/sorting/merge-sort",
        landingRoute: "/computer-science/dsa/sorting/merge-sort",
      },
      {
        labId: "computer-science/dsa/sorting/quick-sort",
        title: "Quick Sort Algorithm",
        description: "Pivot partitioning schemes (Lomuto/Hoare) and recursive in-place sorting.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/dsa/sorting/quick-sort",
        landingRoute: "/computer-science/dsa/sorting/quick-sort",
      },
      {
        labId: "computer-science/dsa/linked-list",
        title: "Linked List Data Structure",
        description: "Dynamic nodes, pointers, head/tail insertions, deletions, and list reversal.",
        estimatedMinutes: 15,
        simRoute: "/labs/computer-science/dsa/linked-list",
        landingRoute: "/computer-science/dsa/linked-list",
      },
      {
        labId: "computer-science/dsa/stack",
        title: "Stack (LIFO) Visualizer",
        description: "Push, pop, peek operations, call stack simulation, and balanced parentheses.",
        estimatedMinutes: 15,
        simRoute: "/labs/computer-science/dsa/stack",
        landingRoute: "/computer-science/dsa/stack",
      },
      {
        labId: "computer-science/dsa/queue",
        title: "Queue (FIFO) & Circular Buffer",
        description: "Enqueue, dequeue, circular array index wrapping, and job scheduling.",
        estimatedMinutes: 15,
        simRoute: "/labs/computer-science/dsa/queue",
        landingRoute: "/computer-science/dsa/queue",
      },
      {
        labId: "computer-science/dsa/graph-algorithms",
        title: "Graph Algorithms & Network Flow",
        description: "Dijkstra shortest paths, Kruskal & Prim MST, and 4-color vertex coloring.",
        estimatedMinutes: 20,
        simRoute: "/labs/computer-science/dsa/graph-algorithms",
        landingRoute: "/computer-science/dsa/graph-algorithms",
      },
    ],
  },
  {
    id: "cs-systems-logic",
    title: "Systems, Logic & Micro-Architecture Track",
    subject: "computerScience",
    headline: "Build digital logic gates, execute 8-bit CPU assembly, and inspect the JS Event Loop.",
    difficulty: "Intermediate",
    estimatedHours: "1.8 hours",
    totalXP: 320,
    badgeName: "Systems Architect",
    badgeIcon: "Cpu",
    steps: [
      {
        labId: "computer-science/logic-gates/and-gate",
        title: "Digital Logic Gates Studio",
        description: "Interactive AND, OR, NOT, NAND, NOR, XOR gates, truth tables, and half-adders.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/logic-gates/and-gate",
        landingRoute: "/computer-science/logic-gates/and-gate",
      },
      {
        labId: "computer-science/bitwise-operations",
        title: "Binary & Bitwise Operations",
        description: "8-bit register tiles, bitwise operators, shifts, Two's complement, and bitmasks.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/bitwise-operations",
        landingRoute: "/computer-science/bitwise-operations",
      },
      {
        labId: "computer-science/cpu-architecture",
        title: "8-Bit CPU Micro-Architecture",
        description: "Von Neumann architecture, assembly editor, 4-stage instruction cycle, and ALU registers.",
        estimatedMinutes: 25,
        simRoute: "/labs/computer-science/cpu-architecture",
        landingRoute: "/computer-science/cpu-architecture",
      },
      {
        labId: "computer-science/code-lab/js",
        title: "JS Event Loop Visualizer",
        description: "Call stack, Web APIs, microtask promise queue, and macrotask execution order.",
        estimatedMinutes: 20,
        simRoute: "/labs/computer-science/code-lab/js",
        landingRoute: "/computer-science/code-lab/js",
      },
      {
        labId: "computer-science/code-lab/html-css-js",
        title: "HTML/CSS/JS Web Code Lab",
        description: "Live sandboxed Monaco editor, instant browser preview, and developer console.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/code-lab/html-css-js",
        landingRoute: "/computer-science/code-lab/html-css-js",
      },
    ],
  },
  {
    id: "cs-networking-crypto-ai",
    title: "Networking, Cryptography & AI Track",
    subject: "computerScience",
    headline: "Simulate OSI 7-layer stacks, packet routing, Enigma ciphers, and Q-learning agents.",
    difficulty: "Advanced",
    estimatedHours: "2.2 hours",
    totalXP: 380,
    badgeName: "Cybersecurity & AI Engineer",
    badgeIcon: "ShieldCheck",
    steps: [
      {
        labId: "computer-science/networking/osi-model",
        title: "OSI 7-Layer Model Simulator",
        description: "Data encapsulation and decapsulation across Application to Physical layers.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/networking/osi-model",
        landingRoute: "/computer-science/networking/osi-model",
      },
      {
        labId: "computer-science/networking/packet-switching",
        title: "Packet Switching Networks",
        description: "Packet fragmentation, independent router mesh hops, and out-of-order reassembly.",
        estimatedMinutes: 15,
        simRoute: "/labs/computer-science/networking/packet-switching",
        landingRoute: "/computer-science/networking/packet-switching",
      },
      {
        labId: "computer-science/networking/circuit-switching",
        title: "Circuit Switching Telephony",
        description: "Dedicated circuit path reservation, zero-jitter streams, and trunk call blocking.",
        estimatedMinutes: 12,
        simRoute: "/labs/computer-science/networking/circuit-switching",
        landingRoute: "/computer-science/networking/circuit-switching",
      },
      {
        labId: "computer-science/networking/topology-builder",
        title: "Network Topology Builder",
        description: "Design Star, Mesh, Ring, and Bus networks with IP subnets and ICMP ping tools.",
        estimatedMinutes: 20,
        simRoute: "/labs/computer-science/networking/topology-builder",
        landingRoute: "/computer-science/networking/topology-builder",
      },
      {
        labId: "computer-science/cryptography",
        title: "Classical & Modern Cryptography",
        description: "Caesar wheels, Vigenère table, WWII Enigma machine, Diffie-Hellman, and SHA-256 mining.",
        estimatedMinutes: 25,
        simRoute: "/labs/computer-science/cryptography",
        landingRoute: "/computer-science/cryptography",
      },
      {
        labId: "computer-science/ai-problem/maze-qlearn",
        title: "Q-Learning Reinforcement Agent",
        description: "Bellman equation, epsilon-greedy exploration, and autonomous maze solving.",
        estimatedMinutes: 20,
        simRoute: "/labs/computer-science/ai-problem/maze-qlearn",
        landingRoute: "/computer-science/ai-problem/maze-qlearn",
      },
      {
        labId: "computer-science/git-simulator",
        title: "Git Version Control Simulator",
        description: "Visual DAG commit graph, branches, HEAD pointers, fast-forward and 3-way merges.",
        estimatedMinutes: 18,
        simRoute: "/labs/computer-science/git-simulator",
        landingRoute: "/computer-science/git-simulator",
      },
    ],
  },

  // ─── MATHEMATICS TRACKS ─────────────────────────────────────────────────────
  {
    id: "math-functions-trig-geom",
    title: "Functions, Trigonometry & Geometry Track",
    subject: "mathematics",
    headline: "Master function transformations, Unit Circle trigonometry, polynomials, and geometry theorems.",
    difficulty: "Beginner",
    estimatedHours: "1.6 hours",
    totalXP: 280,
    badgeName: "Geometry Virtuoso",
    badgeIcon: "Calculator",
    steps: [
      {
        labId: "mathematics/functiongrapher",
        title: "Interactive Function Grapher",
        description: "2D Cartesian curves, a·f(b(x - h)) + k transformations, roots, and extrema.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/functiongrapher",
        landingRoute: "/mathematics/functiongrapher",
      },
      {
        labId: "mathematics/trigonometry",
        title: "Trigonometry & Unit Circle",
        description: "Unit circle x=cos(θ), y=sin(θ), ASTC rules, and continuous sine wave unfolding.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/trigonometry",
        landingRoute: "/mathematics/trigonometry",
      },
      {
        labId: "mathematics/polynomials",
        title: "Quadratic & Polynomial Explorer",
        description: "Parabolas, discriminant Δ = b² - 4ac, complex conjugate roots, and synthetic division.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/polynomials",
        landingRoute: "/mathematics/polynomials",
      },
      {
        labId: "mathematics/geometry",
        title: "Interactive Geometry Studio",
        description: "Compass constructions, Centroid/Orthocenter/Circumcenter, and collinear Euler Line.",
        estimatedMinutes: 20,
        simRoute: "/labs/mathematics/geometry",
        landingRoute: "/mathematics/geometry",
      },
    ],
  },
  {
    id: "math-calculus-linear-chaos",
    title: "Calculus, Linear Algebra & Chaos Track",
    subject: "mathematics",
    headline: "Explore limits, Riemann sum integrals, 2D matrix transformations, and 3D Lorenz chaos.",
    difficulty: "Intermediate",
    estimatedHours: "2.0 hours",
    totalXP: 350,
    badgeName: "Calculus Virtuoso",
    badgeIcon: "Compass",
    steps: [
      {
        labId: "mathematics/calculus",
        title: "Calculus & Riemann Sums",
        description: "Secant-to-tangent derivative limits, difference quotients, and Riemann sum partitions.",
        estimatedMinutes: 20,
        simRoute: "/labs/mathematics/calculus",
        landingRoute: "/mathematics/calculus",
      },
      {
        labId: "mathematics/linear-algebra",
        title: "Linear Algebra & 2D Matrices",
        description: "Basis vectors î & ĵ, determinant signed area scaling, shear/rotation, and eigenvectors.",
        estimatedMinutes: 22,
        simRoute: "/labs/mathematics/linear-algebra",
        landingRoute: "/mathematics/linear-algebra",
      },
      {
        labId: "mathematics/vector-algebra",
        title: "Vector Algebra & 3D Space",
        description: "Vector additions, dot products, cross product right-hand rule, and scalar triple product.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/vector-algebra",
        landingRoute: "/mathematics/vector-algebra",
      },
      {
        labId: "mathematics/differential-equations",
        title: "Differential Equations & Chaos",
        description: "Slope fields, RK4 integrators, 2D phase planes, Lotka-Volterra, and 3D Lorenz attractor.",
        estimatedMinutes: 25,
        simRoute: "/labs/mathematics/differential-equations",
        landingRoute: "/mathematics/differential-equations",
      },
    ],
  },
  {
    id: "math-discrete-probability",
    title: "Discrete Mathematics, Cryptography & Fractals Track",
    subject: "mathematics",
    headline: "Investigate set theory, combinatorics, RSA number theory, Galton statistics, and Mandelbrot fractals.",
    difficulty: "Advanced",
    estimatedHours: "2.2 hours",
    totalXP: 380,
    badgeName: "Discrete Math Master",
    badgeIcon: "Trophy",
    steps: [
      {
        labId: "mathematics/set-theory",
        title: "Set Theory & Boolean Algebra",
        description: "2/3-set Venn diagrams, De Morgan's laws, Inclusion-Exclusion, and injective functions.",
        estimatedMinutes: 15,
        simRoute: "/labs/mathematics/set-theory",
        landingRoute: "/mathematics/set-theory",
      },
      {
        labId: "mathematics/combinatorics",
        title: "Combinatorics & Discrete Counting",
        description: "Permutations P(n,r), combinations C(n,r), Pascal's triangle fractals, and Pigeonhole.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/combinatorics",
        landingRoute: "/mathematics/combinatorics",
      },
      {
        labId: "mathematics/number-theory",
        title: "Number Theory & RSA Cryptography",
        description: "Sieve of Eratosthenes primes, Euclidean GCD square tiling, and RSA public keys.",
        estimatedMinutes: 20,
        simRoute: "/labs/mathematics/number-theory",
        landingRoute: "/mathematics/number-theory",
      },
      {
        labId: "mathematics/statistics",
        title: "Probability & Galton Board",
        description: "Galton bean machine Central Limit Theorem, Normal distributions, and OLS regression.",
        estimatedMinutes: 18,
        simRoute: "/labs/mathematics/statistics",
        landingRoute: "/mathematics/statistics",
      },
      {
        labId: "mathematics/complex-numbers",
        title: "Complex Numbers & Mandelbrot Fractals",
        description: "Argand plane, polar form, roots of unity, Euler's identity, and Mandelbrot zoomer.",
        estimatedMinutes: 22,
        simRoute: "/labs/mathematics/complex-numbers",
        landingRoute: "/mathematics/complex-numbers",
      },
    ],
  },
];

// ── UTILITY HELPERS ───────────────────────────────────────────────────────────

export function getTrackById(id: string): CurriculumTrack | undefined {
  return CURRICULUM_TRACKS.find((t) => t.id === id);
}

export function getTracksBySubject(subject: Discipline): CurriculumTrack[] {
  return CURRICULUM_TRACKS.filter((t) => t.subject === subject);
}

export function getTrackForLab(labId: string): CurriculumTrack | undefined {
  const cleaned = labId.replace(/^\/labs\//, "").replace(/^\//, "").replace(/\/$/, "");
  return CURRICULUM_TRACKS.find((t) =>
    t.steps.some((s) => s.labId === cleaned || cleaned.includes(s.labId))
  );
}

export function getTrackProgress(
  track: CurriculumTrack,
  completedLabIds: string[] = []
): TrackProgress {
  const isMatch = (labId: string) => {
    const slug = labId.includes("/") ? labId.split("/").slice(1).join("/") : labId;
    return completedLabIds.some(
      (completed) =>
        completed === labId ||
        completed.endsWith(slug) ||
        completed.replace(/-/g, "") === slug.replace(/-/g, "")
    );
  };

  let completedSteps = 0;
  let nextStep: TrackLabStep | null = null;
  let currentStepIndex = 0;

  for (let i = 0; i < track.steps.length; i++) {
    const step = track.steps[i];
    if (isMatch(step.labId)) {
      completedSteps++;
    } else if (!nextStep) {
      nextStep = step;
      currentStepIndex = i;
    }
  }

  const totalSteps = track.steps.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  const isComplete = completedSteps === totalSteps;

  if (isComplete) {
    nextStep = null;
    currentStepIndex = totalSteps;
  }

  const status: "not_started" | "in_progress" | "completed" =
    completedSteps === 0 ? "not_started" : isComplete ? "completed" : "in_progress";

  return {
    track,
    completedSteps,
    totalSteps,
    percentage,
    isComplete,
    nextStep: nextStep || track.steps[0],
    currentStepIndex,
    status,
  };
}

export function getNextLabInTrack(
  currentLabId: string,
  completedLabIds: string[] = []
): { track: CurriculumTrack; nextStep: TrackLabStep; isFinalStep: boolean } | null {
  const track = getTrackForLab(currentLabId);
  if (!track) return null;

  const currentIndex = track.steps.findIndex(
    (s) => s.labId === currentLabId || currentLabId.includes(s.labId)
  );

  if (currentIndex === -1) return null;

  // If there is an immediate next step in the track
  if (currentIndex < track.steps.length - 1) {
    return {
      track,
      nextStep: track.steps[currentIndex + 1],
      isFinalStep: currentIndex + 1 === track.steps.length - 1,
    };
  }

  // Current step is the final step
  return {
    track,
    nextStep: track.steps[currentIndex],
    isFinalStep: true,
  };
}
