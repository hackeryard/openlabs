const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function createSvgHero({ title, subtitle, formula, tags, primaryColor, secondaryColor, warmColor, diagramSvg }) {
  // Clean formula and subtitle from unescaped XML entities
  const cleanSubtitle = String(subtitle).replace(/&bull;/g, "•").replace(/&/g, "&amp;");
  const cleanFormula = String(formula).replace(/&bull;/g, "•").replace(/&/g, "&amp;");
  const cleanTitle = String(title).replace(/&bull;/g, "•").replace(/&/g, "&amp;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="${primaryColor}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#030712" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="${warmColor}"/>
      <stop offset="100%" stop-color="${warmColor}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f2937" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#111827" stop-opacity="0.95"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="960" height="540" fill="#030712"/>
  <rect width="960" height="540" fill="url(#bgGlow)"/>

  <!-- Coordinate Grid Lines -->
  <g opacity="0.15" stroke="${primaryColor}" stroke-width="1">
    ${Array.from({ length: 16 }).map((_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="540"/>`).join("\n    ")}
    ${Array.from({ length: 10 }).map((_, i) => `<line x1="0" y1="${i * 60}" x2="960" y2="${i * 60}"/>`).join("\n    ")}
  </g>

  <!-- Central Scientific Diagram Vector Art -->
  <g transform="translate(480, 260)">
    ${diagramSvg}
  </g>

  <!-- Title & Kicker Badge Card Overlay -->
  <g transform="translate(48, 48)">
    <!-- Glassmorphic Banner -->
    <rect width="460" height="130" rx="16" fill="url(#cardGrad)" stroke="${primaryColor}" stroke-opacity="0.3" stroke-width="1.5"/>
    
    <!-- Subject & Level Tags -->
    <g transform="translate(20, 28)">
      ${tags.map((t, idx) => `
        <g transform="translate(${idx * 110}, 0)">
          <rect width="100" height="24" rx="12" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-opacity="0.5"/>
          <text x="50" y="16" fill="${primaryColor}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${t}</text>
        </g>
      `).join("")}
    </g>

    <!-- Main Title -->
    <text x="20" y="80" fill="#f9fafb" font-family="'Space Grotesk', Inter, system-ui, sans-serif" font-size="22" font-weight="900" letter-spacing="-0.02em">
      ${cleanTitle}
    </text>

    <!-- Formula / Subtitle -->
    <text x="20" y="106" fill="${warmColor}" font-family="'IBM Plex Mono', monospace" font-size="13" font-weight="bold">
      ${cleanFormula}
    </text>
  </g>

  <!-- Bottom Telemetry Metric Strip -->
  <g transform="translate(48, 460)">
    <rect width="864" height="48" rx="12" fill="#111827" fill-opacity="0.85" stroke="rgba(255,255,255,0.1)"/>
    <text x="24" y="30" fill="#9ca3af" font-family="Inter, system-ui, sans-serif" font-size="12">
      ${cleanSubtitle}
    </text>
    <text x="840" y="30" fill="${primaryColor}" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="bold" text-anchor="end">
      OpenLabs STEM Suite • Real-time Numeric Solver
    </text>
  </g>
</svg>`;
}

const biologyImages = {
  "blood-hero.svg": {
    title: "Blood Transfusion & ABO Compatibility",
    subtitle: "Antigen-Antibody Agglutination & Immuno-hematology Matrix",
    formula: "Agglutination: Anti-A + Antigen-A → Clumping",
    tags: ["Biology", "Genetics", "Clinical"],
    primaryColor: "#e11d48",
    secondaryColor: "#9333ea",
    warmColor: "#f59e0b",
    diagramSvg: `
      <circle cx="-120" cy="0" r="55" fill="#e11d48" fill-opacity="0.85" stroke="#f43f5e" stroke-width="3" filter="url(#glow)"/>
      <circle cx="-120" cy="0" r="25" fill="#9f1239"/>
      <text x="-120" y="5" fill="#fff" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">RBC Type A</text>
      
      <circle cx="120" cy="0" r="55" fill="#9333ea" fill-opacity="0.85" stroke="#c084fc" stroke-width="3" filter="url(#glow)"/>
      <circle cx="120" cy="0" r="25" fill="#581c87"/>
      <text x="120" y="5" fill="#fff" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">RBC Type B</text>

      <!-- Antibody Y shape -->
      <path d="M 0 -60 L 0 -20 L -30 10 M 0 -20 L 30 10" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <text x="0" y="45" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Anti-A Antibody</text>
    `
  },
  "brainNeuron-hero.svg": {
    title: "3D Brain Neuron & Action Potential",
    subtitle: "Synaptic Transmission, Ion Channels & Membrane Depolarization",
    formula: "Goldman Equation: Vm = -70 mV → +30 mV Action Potential",
    tags: ["Biology", "Neuroscience", "Electrophysiology"],
    primaryColor: "#0284c7",
    secondaryColor: "#9333ea",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Neuron Soma -->
      <circle cx="-140" cy="0" r="45" fill="#0284c7" fill-opacity="0.8" stroke="#38bdf8" stroke-width="3" filter="url(#glow)"/>
      <text x="-140" y="5" fill="#fff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">Soma</text>
      <!-- Axon -->
      <line x1="-95" y1="0" x2="110" y2="0" stroke="#38bdf8" stroke-width="6"/>
      <!-- Action Potential Wave -->
      <path d="M -90 0 Q -40 -70 10 0 Q 60 50 110 0" fill="none" stroke="#f59e0b" stroke-width="4" filter="url(#glow)"/>
      <circle cx="150" cy="0" r="30" fill="#9333ea" fill-opacity="0.8" stroke="#c084fc" stroke-width="2"/>
      <text x="150" y="5" fill="#fff" font-family="monospace" font-size="11" text-anchor="middle">Synapse</text>
    `
  },
  "animal-cell-hero.svg": {
    title: "Animal Cell Organelles & Cytology",
    subtitle: "Nucleus, Mitochondria, Endoplasmic Reticulum & Cytoskeleton",
    formula: "Cellular Ultrastructure & Fluid Mosaic Bilayer",
    tags: ["Biology", "Cell Biology", "Microscopy"],
    primaryColor: "#e11d48",
    secondaryColor: "#f59e0b",
    warmColor: "#06b6d4",
    diagramSvg: `
      <ellipse cx="0" cy="0" rx="180" ry="110" fill="#e11d48" fill-opacity="0.15" stroke="#e11d48" stroke-width="3" stroke-dasharray="6 3"/>
      <!-- Nucleus -->
      <circle cx="-50" cy="-10" r="45" fill="#9333ea" fill-opacity="0.7" stroke="#c084fc" stroke-width="2"/>
      <circle cx="-50" cy="-10" r="18" fill="#f43f5e"/>
      <text x="-50" y="-8" fill="#fff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">Nucleus</text>
      <!-- Mitochondria -->
      <ellipse cx="70" cy="20" rx="35" ry="18" fill="#f59e0b" fill-opacity="0.7" stroke="#fbbf24" stroke-width="2"/>
      <text x="70" y="24" fill="#fff" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">Mitochondria</text>
    `
  },
  "plant-cell-hero.svg": {
    title: "Plant Cell & Chloroplast Ultrastructure",
    subtitle: "Cell Wall, Large Central Vacuole & Thylakoid Grana",
    formula: "Turgor Pressure: Ψ = Ψs + Ψp (Osmotic Equilibrium)",
    tags: ["Biology", "Botany", "Cell Biology"],
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    warmColor: "#facc15",
    diagramSvg: `
      <rect x="-160" y="-90" width="320" height="180" rx="20" fill="#059669" fill-opacity="0.15" stroke="#10b981" stroke-width="4"/>
      <!-- Vacuole -->
      <ellipse cx="20" cy="0" rx="90" ry="60" fill="#0284c7" fill-opacity="0.4" stroke="#38bdf8" stroke-width="2"/>
      <text x="20" y="5" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Central Vacuole</text>
      <!-- Chloroplast -->
      <ellipse cx="-100" cy="-30" rx="30" ry="16" fill="#10b981" fill-opacity="0.8" stroke="#34d399" stroke-width="2"/>
      <text x="-100" y="-26" fill="#fff" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">Chloroplast</text>
    `
  },
  "cell-hero.svg": {
    title: "Comparative Cell Biology Studio",
    subtitle: "Eukaryotic vs Prokaryotic Cell Organelle Organization",
    formula: "Universal Cytological Membrane Transport",
    tags: ["Biology", "Comparative Cytology", "Cell Biology"],
    primaryColor: "#e11d48",
    secondaryColor: "#059669",
    warmColor: "#f59e0b",
    diagramSvg: `
      <circle cx="-80" cy="0" r="70" fill="#e11d48" fill-opacity="0.2" stroke="#f43f5e" stroke-width="3"/>
      <text x="-80" y="-30" fill="#f43f5e" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Animal Cell</text>
      
      <rect x="20" y="-60" width="130" height="120" rx="16" fill="#059669" fill-opacity="0.2" stroke="#10b981" stroke-width="3"/>
      <text x="85" y="-30" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Plant Cell</text>
    `
  },
  "human-hero.svg": {
    title: "Human Anatomy & Organ Systems",
    subtitle: "Cardiovascular, Respiratory, Renal & Nervous Homeostasis",
    formula: "Physiological Feedback & Homeostatic Equilibrium",
    tags: ["Biology", "Physiology", "Anatomy"],
    primaryColor: "#e11d48",
    secondaryColor: "#0284c7",
    warmColor: "#f59e0b",
    diagramSvg: `
      <circle cx="0" cy="-50" r="28" fill="#f59e0b" fill-opacity="0.6" stroke="#fbbf24" stroke-width="2"/>
      <!-- Torso -->
      <path d="M -35 -20 L 35 -20 L 25 70 L -25 70 Z" fill="#e11d48" fill-opacity="0.5" stroke="#f43f5e" stroke-width="2"/>
      <!-- Heart glowing -->
      <circle cx="-5" cy="5" r="14" fill="#ef4444" filter="url(#glow)"/>
      <text x="0" y="95" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Organ Systems</text>
    `
  },
  "photosynthesis-hero.svg": {
    title: "Photosynthesis & Light Reactions",
    subtitle: "Photosystems I & II, Calvin Cycle & Photophosphorylation",
    formula: "6CO2 + 6H2O + hν → C6H12O6 + 6O2",
    tags: ["Biology", "Bioenergetics", "Biochemistry"],
    primaryColor: "#059669",
    secondaryColor: "#eab308",
    warmColor: "#10b981",
    diagramSvg: `
      <circle cx="0" cy="0" r="75" fill="#059669" fill-opacity="0.25" stroke="#10b981" stroke-width="3"/>
      <path d="M -50 0 C -20 -50 20 -50 50 0 C 20 50 -20 50 -50 0 Z" fill="#10b981" fill-opacity="0.8"/>
      <!-- Photon beam -->
      <line x1="-120" y1="-80" x2="-40" y2="-20" stroke="#facc15" stroke-width="4" stroke-dasharray="4 2" filter="url(#glow)"/>
      <text x="0" y="5" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Calvin Cycle</text>
    `
  },
  "monohybrid-hero.svg": {
    title: "Monohybrid Cross & Punnett Squares",
    subtitle: "Mendelian Single-Gene Inheritance & Phenotype Ratios",
    formula: "Genotype: 1:2:1 (BB:Bb:bb) • Phenotype: 3:1",
    tags: ["Biology", "Genetics", "Mendelian"],
    primaryColor: "#9333ea",
    secondaryColor: "#e11d48",
    warmColor: "#f59e0b",
    diagramSvg: `
      <rect x="-80" y="-80" width="160" height="160" rx="8" fill="#1f2937" stroke="#9333ea" stroke-width="3"/>
      <line x1="-80" y1="0" x2="80" y2="0" stroke="#9333ea" stroke-width="2"/>
      <line x1="0" y1="-80" x2="0" y2="80" stroke="#9333ea" stroke-width="2"/>
      <text x="-40" y="-35" fill="#38bdf8" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">BB</text>
      <text x="40" y="-35" fill="#c084fc" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">Bb</text>
      <text x="-40" y="45" fill="#c084fc" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">Bb</text>
      <text x="40" y="45" fill="#f43f5e" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">bb</text>
    `
  },
  "dihybrid-hero.svg": {
    title: "Dihybrid Cross & Independent Assortment",
    subtitle: "16-Cell Genetic Matrix & 9:3:3:1 Phenotypic Ratio",
    formula: "Mendel's 2nd Law: (3:1) × (3:1) = 9:3:3:1",
    tags: ["Biology", "Genetics", "Probability"],
    primaryColor: "#9333ea",
    secondaryColor: "#059669",
    warmColor: "#f59e0b",
    diagramSvg: `
      <rect x="-90" y="-90" width="180" height="180" rx="10" fill="#1f2937" stroke="#9333ea" stroke-width="3"/>
      <!-- 4x4 Grid lines -->
      <line x1="-45" y1="-90" x2="-45" y2="90" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="0" y1="-90" x2="0" y2="90" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="45" y1="-90" x2="45" y2="90" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="-90" y1="-45" x2="90" y2="-45" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="-90" y1="0" x2="90" y2="0" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="-90" y1="45" x2="90" y2="45" stroke="#9333ea" stroke-width="1.5"/>
      <text x="0" y="115" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">9 : 3 : 3 : 1</text>
    `
  },
  "transcription-translation-hero.svg": {
    title: "DNA Transcription & Ribosomal Translation",
    subtitle: "Central Dogma: mRNA Synthesis, tRNA Codons & Polypeptide Chain",
    formula: "DNA (Gene) → mRNA (Codons) → Protein (Amino Acids)",
    tags: ["Biology", "Molecular Biology", "Biochemistry"],
    primaryColor: "#0284c7",
    secondaryColor: "#e11d48",
    warmColor: "#10b981",
    diagramSvg: `
      <!-- DNA Helix -->
      <path d="M -160 -40 Q -110 40 -60 -40 Q -10 40 40 -40 Q 90 40 140 -40" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <path d="M -160 40 Q -110 -40 -60 40 Q -10 -40 40 40 Q 90 -40 140 40" fill="none" stroke="#f43f5e" stroke-width="3"/>
      <!-- Ribosome -->
      <ellipse cx="0" cy="50" rx="60" ry="35" fill="#10b981" fill-opacity="0.8" stroke="#34d399" stroke-width="2"/>
      <text x="0" y="55" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Ribosome 80S</text>
    `
  },
  "pedigree-hero.svg": {
    title: "Pedigree Tree & Genetic Inheritance",
    subtitle: "Autosomal Dominant, Recessive & X-Linked Trait Analysis",
    formula: "3-Generation Family Tree Analysis",
    tags: ["Biology", "Genetics", "Family Tree"],
    primaryColor: "#9333ea",
    secondaryColor: "#0284c7",
    warmColor: "#f43f5e",
    diagramSvg: `
      <!-- Generation 1 -->
      <rect x="-80" y="-70" width="30" height="30" fill="#38bdf8" stroke="#fff" stroke-width="2"/>
      <line x1="-50" y1="-55" x2="50" y2="-55" stroke="#fff" stroke-width="2"/>
      <circle cx="65" cy="-55" r="15" fill="#f43f5e" stroke="#fff" stroke-width="2"/>
      <!-- Generation 2 -->
      <line x1="0" y1="-55" x2="0" y2="10" stroke="#fff" stroke-width="2"/>
      <line x1="-60" y1="10" x2="60" y2="10" stroke="#fff" stroke-width="2"/>
      <rect x="-75" y="10" width="30" height="30" fill="#9333ea" stroke="#fff" stroke-width="2"/>
      <circle cx="0" cy="25" r="15" fill="#38bdf8" stroke="#fff" stroke-width="2"/>
      <circle cx="60" cy="25" r="15" fill="#f43f5e" stroke="#fff" stroke-width="2"/>
    `
  },
  "enzyme-kinetics-hero.svg": {
    title: "Enzyme Kinetics & Michaelis-Menten",
    subtitle: "Substrate Binding, Induced Fit & Lineweaver-Burk Double Reciprocal",
    formula: "v = (Vmax · [S]) / (Km + [S])",
    tags: ["Biology", "Enzymology", "Biochemistry"],
    primaryColor: "#e11d48",
    secondaryColor: "#059669",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Michaelis Menten Curve -->
      <path d="M -120 70 Q -60 -40 120 -60" fill="none" stroke="#f43f5e" stroke-width="4" filter="url(#glow)"/>
      <line x1="-120" y1="70" x2="140" y2="70" stroke="#9ca3af" stroke-width="2"/>
      <line x1="-120" y1="70" x2="-120" y2="-80" stroke="#9ca3af" stroke-width="2"/>
      <!-- Vmax asymptote -->
      <line x1="-120" y1="-60" x2="140" y2="-60" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="110" y="-70" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">Vmax</text>
      <text x="0" y="90" fill="#9ca3af" font-family="monospace" font-size="11">[Substrate Concentration]</text>
    `
  },
  "cellular-respiration-hero.svg": {
    title: "Cellular Respiration & ATP Synthase",
    subtitle: "Glycolysis, Krebs Cycle & Mitochondrial Electron Transport Chain",
    formula: "C6H12O6 + 6O2 → 6CO2 + 6H2O + 38 ATP",
    tags: ["Biology", "Bioenergetics", "Biochemistry"],
    primaryColor: "#059669",
    secondaryColor: "#9333ea",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Mitochondrial Membrane -->
      <line x1="-140" y1="20" x2="140" y2="20" stroke="#f59e0b" stroke-width="6"/>
      <!-- Proton Gradient -->
      ${[-100, -60, -20, 20, 60, 100].map((x) => `<circle cx="${x}" cy="-20" r="8" fill="#38bdf8" filter="url(#glow)"/>`).join("")}
      <!-- Rotary ATP Synthase -->
      <rect x="40" y="-10" width="40" height="60" rx="8" fill="#10b981" stroke="#34d399" stroke-width="2"/>
      <circle cx="60" cy="50" r="16" fill="#f59e0b"/>
      <text x="60" y="55" fill="#fff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">ATP</text>
    `
  },
  "osmosis-tonicity-hero.svg": {
    title: "Osmosis, Diffusion & Cell Tonicity",
    subtitle: "Hypotonic Hemolysis, Isotonic Equilibrium & Hypertonic Crenation",
    formula: "Van 't Hoff Equation: Π = i · M · R · T",
    tags: ["Biology", "Cell Physiology", "Biophysics"],
    primaryColor: "#0284c7",
    secondaryColor: "#e11d48",
    warmColor: "#10b981",
    diagramSvg: `
      <!-- Hypotonic Swollen -->
      <circle cx="-100" cy="0" r="45" fill="#38bdf8" fill-opacity="0.6" stroke="#0284c7" stroke-width="3"/>
      <text x="-100" y="5" fill="#fff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">Hypotonic</text>
      <!-- Isotonic Normal -->
      <circle cx="0" cy="0" r="32" fill="#10b981" fill-opacity="0.6" stroke="#059669" stroke-width="3"/>
      <text x="0" y="5" fill="#fff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">Isotonic</text>
      <!-- Hypertonic Shriveled -->
      <path d="M 85 -20 L 115 -25 L 125 0 L 115 25 L 85 20 L 75 0 Z" fill="#f43f5e" fill-opacity="0.6" stroke="#e11d48" stroke-width="3"/>
      <text x="100" y="5" fill="#fff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">Hypertonic</text>
    `
  },
  "heart-cardiac-cycle-hero.svg": {
    title: "Cardiac Cycle, ECG & Heart Hemodynamics",
    subtitle: "4-Chamber Pump, Lead II ECG, Wiggers Diagram & S1/S2 Auscultation",
    formula: "CO = HR × SV • EF = (SV / EDV) × 100%",
    tags: ["Biology", "Physiology", "Cardiology"],
    primaryColor: "#e11d48",
    secondaryColor: "#0284c7",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- 4-Chamber Heart Outline -->
      <path d="M 0 -80 C 40 -110, 90 -60, 80 20 C 70 80, 10 110, 0 120 C -10 110, -70 80, -80 20 C -90 -60, -40 -110, 0 -80 Z" fill="#881337" fill-opacity="0.8" stroke="#f43f5e" stroke-width="4" filter="url(#glow)"/>
      <!-- Right Atrium & Ventricle (Deox Blue) -->
      <path d="M -60 -40 C -60 -10, -40 0, -10 0 L -10 -40 Z" fill="#1e40af" fill-opacity="0.85"/>
      <path d="M -60 10 C -60 60, -30 90, -10 100 L -10 10 Z" fill="#1d4ed8" fill-opacity="0.85"/>
      <!-- Left Atrium & Ventricle (Ox Red) -->
      <path d="M 10 -40 L 10 0 C 40 0, 60 -10, 60 -40 Z" fill="#991b1b" fill-opacity="0.85"/>
      <path d="M 10 10 L 10 100 C 30 90, 60 60, 60 10 Z" fill="#b91c1c" fill-opacity="0.85"/>
      <!-- ECG Wave Trace Overlaid -->
      <path d="M -160 30 L -120 30 L -110 15 L -100 30 L -90 30 L -80 45 L -65 -60 L -50 50 L -40 30 L 10 30 Q 35 -10 60 30 L 160 30" fill="none" stroke="#10b981" stroke-width="3.5" filter="url(#glow)"/>
      <text x="0" y="145" fill="#facc15" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Lead II ECG • 72 BPM</text>
    `
  }
};

const mathematicsImages = {
  "functiongrapher-hero.svg": {
    title: "Function Grapher & Curve Transformations",
    subtitle: "Polynomial, Trigonometric & Rational Dynamic Function Visualizer",
    formula: "f(x) → a · f(b(x - c)) + d",
    tags: ["Mathematics", "Algebra", "Graphing"],
    primaryColor: "#d97706",
    secondaryColor: "#0284c7",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Axes -->
      <line x1="-140" y1="0" x2="140" y2="0" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="-90" x2="0" y2="90" stroke="#9ca3af" stroke-width="2"/>
      <!-- Cubic polynomial curve -->
      <path d="M -120 70 Q -60 -90 0 0 Q 60 90 120 -70" fill="none" stroke="#f59e0b" stroke-width="4" filter="url(#glow)"/>
    `
  },
  "trigonometry-hero.svg": {
    title: "Trigonometry & Unit Circle Dynamics",
    subtitle: "Unit Circle (cos θ, sin θ), Tangent Ratios & Wave Unfolding",
    formula: "sin²(θ) + cos²(θ) = 1 • e^(iθ) = cos θ + i sin θ",
    tags: ["Mathematics", "Geometry", "Trigonometry"],
    primaryColor: "#0284c7",
    secondaryColor: "#f59e0b",
    warmColor: "#10b981",
    diagramSvg: `
      <!-- Unit Circle -->
      <circle cx="-50" cy="0" r="70" fill="none" stroke="#38bdf8" stroke-width="3" filter="url(#glow)"/>
      <line x1="-130" y1="0" x2="30" y2="0" stroke="#9ca3af" stroke-width="1.5"/>
      <line x1="-50" y1="-80" x2="-50" y2="80" stroke="#9ca3af" stroke-width="1.5"/>
      <!-- Triangle -->
      <polygon points="-50,0 0,0 0,-49.5" fill="#f59e0b" fill-opacity="0.3" stroke="#f59e0b" stroke-width="2"/>
      <!-- Sine Wave -->
      <path d="M 30 0 Q 60 -50 90 0 Q 120 50 150 0" fill="none" stroke="#10b981" stroke-width="3"/>
    `
  },
  "polynomials-hero.svg": {
    title: "Quadratic & Polynomial Discriminant Studio",
    subtitle: "Parabola Vertex Form, Roots (Δ = b² - 4ac) & Synthetic Division",
    formula: "x = (-b ± √(b² - 4ac)) / (2a)",
    tags: ["Mathematics", "Algebra", "Polynomials"],
    primaryColor: "#d97706",
    secondaryColor: "#9333ea",
    warmColor: "#f43f5e",
    diagramSvg: `
      <line x1="-120" y1="30" x2="120" y2="30" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="-80" x2="0" y2="80" stroke="#9ca3af" stroke-width="2"/>
      <!-- Parabola -->
      <path d="M -100 -70 Q 0 90 100 -70" fill="none" stroke="#f59e0b" stroke-width="4" filter="url(#glow)"/>
      <circle cx="-55" cy="30" r="6" fill="#f43f5e"/>
      <circle cx="55" cy="30" r="6" fill="#f43f5e"/>
      <text x="0" y="55" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Vertex (h, k)</text>
    `
  },
  "calculus-hero.svg": {
    title: "Calculus, Derivatives & Riemann Integrals",
    subtitle: "Secant-to-Tangent Limits, Difference Quotients & Area Under Curve",
    formula: "f'(x) = lim (f(x+h) - f(x))/h • ∫ f(x)dx = F(b) - F(a)",
    tags: ["Mathematics", "Calculus", "Analysis"],
    primaryColor: "#0284c7",
    secondaryColor: "#10b981",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Axes -->
      <line x1="-130" y1="50" x2="130" y2="50" stroke="#9ca3af" stroke-width="2"/>
      <line x1="-120" y1="-70" x2="-120" y2="60" stroke="#9ca3af" stroke-width="2"/>
      <!-- Riemann Bars -->
      <rect x="-80" y="-10" width="20" height="60" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <rect x="-60" y="-30" width="20" height="80" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <rect x="-40" y="-45" width="20" height="95" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <rect x="-20" y="-50" width="20" height="100" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <rect x="0" y="-45" width="20" height="95" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <rect x="20" y="-30" width="20" height="80" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8"/>
      <!-- Continuous curve -->
      <path d="M -110 30 Q -20 -80 70 50" fill="none" stroke="#f59e0b" stroke-width="4" filter="url(#glow)"/>
    `
  },
  "linear-algebra-hero.svg": {
    title: "Linear Algebra & Matrix Transformations",
    subtitle: "Basis Vectors î & ĵ, Determinant Area Scaling & Eigenvectors",
    formula: "A · x = λ · x • det(A - λI) = 0",
    tags: ["Mathematics", "Linear Algebra", "Vectors"],
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Grid transformed parallelogram -->
      <polygon points="0,0 80,-20 120,-80 40,-60" fill="#4f46e5" fill-opacity="0.3" stroke="#818cf8" stroke-width="2"/>
      <!-- Basis Vector i -->
      <line x1="0" y1="0" x2="80" y2="-20" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#arrow)"/>
      <text x="85" y="-25" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold">î'</text>
      <!-- Basis Vector j -->
      <line x1="0" y1="0" x2="40" y2="-60" stroke="#10b981" stroke-width="3.5" marker-end="url(#arrow)"/>
      <text x="45" y="-65" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">ĵ'</text>
      <text x="70" y="-40" fill="#facc15" font-family="monospace" font-size="12" font-weight="bold">det(A)</text>
    `
  },
  "statistics-hero.svg": {
    title: "Statistics, CLT & Probability Distributions",
    subtitle: "Galton Bean Machine, Normal Bell Curve & OLS Regression",
    formula: "Gaussian: f(x) = (1 / (σ√(2π))) · e^(-(x-μ)² / 2σ²)",
    tags: ["Mathematics", "Statistics", "Data Science"],
    primaryColor: "#d97706",
    secondaryColor: "#0284c7",
    warmColor: "#10b981",
    diagramSvg: `
      <!-- Bell Curve -->
      <path d="M -140 60 Q -50 60 -20 -60 Q 0 -80 20 -60 Q 50 60 140 60" fill="none" stroke="#f59e0b" stroke-width="4" filter="url(#glow)"/>
      <line x1="-140" y1="60" x2="140" y2="60" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="-80" x2="0" y2="60" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 3"/>
      <text x="0" y="-90" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">μ (Mean)</text>
    `
  },
  "complex-numbers-hero.svg": {
    title: "Complex Numbers & Mandelbrot Fractals",
    subtitle: "Argand Plane, Euler's Identity (e^(iπ) + 1 = 0) & Julia Sets",
    formula: "z = a + b·i • Iteration: z_{n+1} = z_n² + c",
    tags: ["Mathematics", "Complex Analysis", "Fractals"],
    primaryColor: "#9333ea",
    secondaryColor: "#06b6d4",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Argand Axes -->
      <line x1="-120" y1="0" x2="120" y2="0" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="-80" x2="0" y2="80" stroke="#9ca3af" stroke-width="2"/>
      <!-- Complex Vector -->
      <line x1="0" y1="0" x2="70" y2="-60" stroke="#c084fc" stroke-width="3" filter="url(#glow)"/>
      <circle cx="70" cy="-60" r="6" fill="#f59e0b"/>
      <text x="80" y="-65" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">z = r·e^(iθ)</text>
      <!-- Mandelbrot Cardioid hint -->
      <circle cx="-30" cy="0" r="45" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
    `
  },
  "set-theory-hero.svg": {
    title: "Set Theory & Boolean Venn Diagrams",
    subtitle: "Union, Intersection, Complement & Inclusion-Exclusion Principle",
    formula: "|A ∪ B| = |A| + |B| - |A ∩ B| • De Morgan's Laws",
    tags: ["Mathematics", "Set Theory", "Discrete Math"],
    primaryColor: "#d97706",
    secondaryColor: "#0284c7",
    warmColor: "#9333ea",
    diagramSvg: `
      <!-- Circle A -->
      <circle cx="-35" cy="0" r="65" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="3"/>
      <!-- Circle B -->
      <circle cx="35" cy="0" r="65" fill="#d97706" fill-opacity="0.3" stroke="#f59e0b" stroke-width="3"/>
      <text x="-65" y="5" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">A</text>
      <text x="65" y="5" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">B</text>
      <text x="0" y="5" fill="#fff" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">A ∩ B</text>
    `
  },
  "geometry-hero.svg": {
    title: "Interactive Geometry & Triangle Centers",
    subtitle: "Circumcenter, Incenter, Orthocenter, Centroid & Euler Line",
    formula: "Law of Cosines: c² = a² + b² - 2ab·cos C",
    tags: ["Mathematics", "Euclidean Geometry", "Theorems"],
    primaryColor: "#0284c7",
    secondaryColor: "#f59e0b",
    warmColor: "#10b981",
    diagramSvg: `
      <!-- Triangle -->
      <polygon points="-90,50 80,50 10,-70" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="3"/>
      <!-- Circumcircle -->
      <circle cx="0" cy="0" r="95" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4"/>
      <!-- Euler line -->
      <line x1="-60" y1="-20" x2="60" y2="20" stroke="#f43f5e" stroke-width="3" filter="url(#glow)"/>
      <text x="0" y="35" fill="#f43f5e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Euler Line</text>
    `
  },
  "vector-algebra-hero.svg": {
    title: "Vector Algebra & 3D Projections",
    subtitle: "Dot Product, Cross Product (Right-Hand Rule) & Triple Scalar",
    formula: "u · v = |u||v|cos θ • u × v = |u||v|sin θ n̂",
    tags: ["Mathematics", "Vector Calculus", "3D Geometry"],
    primaryColor: "#4f46e5",
    secondaryColor: "#f59e0b",
    warmColor: "#06b6d4",
    diagramSvg: `
      <!-- 3D Axes -->
      <line x1="0" y1="0" x2="90" y2="40" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="0" x2="-90" y2="40" stroke="#9ca3af" stroke-width="2"/>
      <line x1="0" y1="0" x2="0" y2="-90" stroke="#9ca3af" stroke-width="2"/>
      <!-- Vector u -->
      <line x1="0" y1="0" x2="80" y2="-30" stroke="#f43f5e" stroke-width="4" filter="url(#glow)"/>
      <text x="85" y="-35" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold">u</text>
      <!-- Vector v -->
      <line x1="0" y1="0" x2="-60" y2="-50" stroke="#38bdf8" stroke-width="4" filter="url(#glow)"/>
      <text x="-70" y="-55" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">v</text>
      <!-- Normal vector u x v -->
      <line x1="0" y1="0" x2="0" y2="-80" stroke="#10b981" stroke-width="4" filter="url(#glow)"/>
      <text x="10" y="-80" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">u × v</text>
    `
  },
  "combinatorics-hero.svg": {
    title: "Combinatorics & Pascal's Triangle",
    subtitle: "Permutations, Combinations & Binomial Expansion Theorem",
    formula: "C(n, k) = n! / (k!(n-k)!) • (x+y)^n = Σ C(n,k) x^(n-k) y^k",
    tags: ["Mathematics", "Combinatorics", "Discrete Math"],
    primaryColor: "#d97706",
    secondaryColor: "#9333ea",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Pascal Triangle Pyramids -->
      <text x="0" y="-60" fill="#f59e0b" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">1</text>
      <text x="-30" y="-25" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
      <text x="30" y="-25" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
      <text x="-60" y="10" fill="#c084fc" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
      <text x="0" y="10" fill="#f43f5e" font-family="monospace" font-size="20" font-weight="black" text-anchor="middle">2</text>
      <text x="60" y="10" fill="#c084fc" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
      <text x="-90" y="45" fill="#10b981" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
      <text x="-30" y="45" fill="#f59e0b" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">3</text>
      <text x="30" y="45" fill="#f59e0b" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">3</text>
      <text x="90" y="45" fill="#10b981" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">1</text>
    `
  },
  "number-theory-hero.svg": {
    title: "Number Theory & Modular Cryptography",
    subtitle: "Euclidean GCD, Euler's Totient φ(n), Primes & RSA Encryption",
    formula: "Bézout's Identity: gcd(a,b) = ax + by • m^(ed) ≡ m (mod n)",
    tags: ["Mathematics", "Number Theory", "Cryptography"],
    primaryColor: "#059669",
    secondaryColor: "#d97706",
    warmColor: "#38bdf8",
    diagramSvg: `
      <!-- Modulo Clock -->
      <circle cx="0" cy="0" r="70" fill="#1f2937" stroke="#10b981" stroke-width="3" filter="url(#glow)"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const rad = (i * 30 * Math.PI) / 180;
        const x = 52 * Math.sin(rad);
        const y = -52 * Math.cos(rad);
        return `<text x="${x}" y="${y + 4}" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${i}</text>`;
      }).join("")}
      <!-- Key lock -->
      <circle cx="0" cy="-5" r="10" fill="#38bdf8"/>
      <rect x="-4" y="-5" width="8" height="15" fill="#38bdf8"/>
      <text x="0" y="25" fill="#38bdf8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">RSA Modulo</text>
    `
  },
  "differential-equations-hero.svg": {
    title: "Differential Equations & Dynamical Chaos",
    subtitle: "RK4 Numerical Integration, Phase Planes & Lorenz Attractor",
    formula: "dx/dt = σ(y - x) • dy/dt = x(ρ - z) - y • dz/dt = xy - βz",
    tags: ["Mathematics", "Differential Equations", "Chaos Theory"],
    primaryColor: "#f43f5e",
    secondaryColor: "#0284c7",
    warmColor: "#f59e0b",
    diagramSvg: `
      <!-- Lorenz Butterfly Attractor -->
      <path d="M -70 -10 C -90 -60 -30 -70 -10 -10 C 10 50 70 60 90 10 C 110 -40 50 -60 10 -10 C -30 40 -50 40 -70 -10 Z" fill="none" stroke="#f43f5e" stroke-width="3.5" filter="url(#glow)"/>
      <path d="M -60 -5 C -80 -50 -25 -60 -5 -5 C 15 40 60 50 80 5 C 95 -30 45 -50 5 -5 C -25 30 -40 30 -60 -5 Z" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="0" y="85" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Lorenz Strange Attractor</text>
    `
  }
};

async function generateAll() {
  const bioDir = path.join(__dirname, "..", "public", "images", "biology");
  if (!fs.existsSync(bioDir)) fs.mkdirSync(bioDir, { recursive: true });

  for (const [filename, config] of Object.entries(biologyImages)) {
    const svgContent = createSvgHero(config);
    const svgPath = path.join(bioDir, filename);
    fs.writeFileSync(svgPath, svgContent, "utf8");

    // Rasterize with Sharp to 1200x675 PNG binary
    const pngPath = path.join(bioDir, filename.replace(".svg", ".png"));
    await sharp(Buffer.from(svgContent), { density: 300 })
      .resize(1200, 675, { fit: "cover" })
      .png({ quality: 95 })
      .toFile(pngPath);

    console.log(`Generated Biology PNG binary: ${path.basename(pngPath)}`);
  }

  const mathDir = path.join(__dirname, "..", "public", "images", "mathematics");
  if (!fs.existsSync(mathDir)) fs.mkdirSync(mathDir, { recursive: true });

  for (const [filename, config] of Object.entries(mathematicsImages)) {
    const svgContent = createSvgHero(config);
    const svgPath = path.join(mathDir, filename);
    fs.writeFileSync(svgPath, svgContent, "utf8");

    // Rasterize with Sharp to 1200x675 PNG binary
    const pngPath = path.join(mathDir, filename.replace(".svg", ".png"));
    await sharp(Buffer.from(svgContent), { density: 300 })
      .resize(1200, 675, { fit: "cover" })
      .png({ quality: 95 })
      .toFile(pngPath);

    console.log(`Generated Math PNG binary: ${path.basename(pngPath)}`);
  }

  console.log("All STEM SVG & PNG assets successfully generated with Sharp!");
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
