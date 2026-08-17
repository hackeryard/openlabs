import {
  MonohybridParent,
  MonohybridGamete,
  DihybridParent,
  DihybridGameteWeight,
  DominanceModel,
  CodonEntry,
  MutationType,
  PedigreeMember,
  InheritanceMode,
} from "../types";

// ─── STANDARD GENETIC CODE TABLE (64 CODONS) ────────────────

export const CODON_TABLE: Record<string, { name: string; abbr: string; isStop?: boolean; color: string }> = {
  // Phenylalanine / Leucine
  UUU: { name: "Phenylalanine", abbr: "Phe", color: "#60a5fa" },
  UUC: { name: "Phenylalanine", abbr: "Phe", color: "#60a5fa" },
  UUA: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },
  UUG: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },

  // Serine
  UCU: { name: "Serine", abbr: "Ser", color: "#34d399" },
  UCC: { name: "Serine", abbr: "Ser", color: "#34d399" },
  UCA: { name: "Serine", abbr: "Ser", color: "#34d399" },
  UCG: { name: "Serine", abbr: "Ser", color: "#34d399" },

  // Tyrosine / Stop
  UAU: { name: "Tyrosine", abbr: "Tyr", color: "#a78bfa" },
  UAC: { name: "Tyrosine", abbr: "Tyr", color: "#a78bfa" },
  UAA: { name: "STOP", abbr: "STOP", isStop: true, color: "#f87171" },
  UAG: { name: "STOP", abbr: "STOP", isStop: true, color: "#f87171" },

  // Cysteine / Tryptophan / Stop
  UGU: { name: "Cysteine", abbr: "Cys", color: "#fbbf24" },
  UGC: { name: "Cysteine", abbr: "Cys", color: "#fbbf24" },
  UGA: { name: "STOP", abbr: "STOP", isStop: true, color: "#f87171" },
  UGG: { name: "Tryptophan", abbr: "Trp", color: "#f472b6" },

  // Leucine
  CUU: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },
  CUC: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },
  CUA: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },
  CUG: { name: "Leucine", abbr: "Leu", color: "#38bdf8" },

  // Proline
  CCU: { name: "Proline", abbr: "Pro", color: "#fb923c" },
  CCC: { name: "Proline", abbr: "Pro", color: "#fb923c" },
  CCA: { name: "Proline", abbr: "Pro", color: "#fb923c" },
  CCG: { name: "Proline", abbr: "Pro", color: "#fb923c" },

  // Histidine / Glutamine
  CAU: { name: "Histidine", abbr: "His", color: "#818cf8" },
  CAC: { name: "Histidine", abbr: "His", color: "#818cf8" },
  CAA: { name: "Glutamine", abbr: "Gln", color: "#c084fc" },
  CAG: { name: "Glutamine", abbr: "Gln", color: "#c084fc" },

  // Arginine
  CGU: { name: "Arginine", abbr: "Arg", color: "#4ade80" },
  CGC: { name: "Arginine", abbr: "Arg", color: "#4ade80" },
  CGA: { name: "Arginine", abbr: "Arg", color: "#4ade80" },
  CGG: { name: "Arginine", abbr: "Arg", color: "#4ade80" },

  // Isoleucine / Methionine (Start)
  AUU: { name: "Isoleucine", abbr: "Ile", color: "#2dd4bf" },
  AUC: { name: "Isoleucine", abbr: "Ile", color: "#2dd4bf" },
  AUA: { name: "Isoleucine", abbr: "Ile", color: "#2dd4bf" },
  AUG: { name: "Methionine", abbr: "Met", color: "#10b981" },

  // Threonine
  ACU: { name: "Threonine", abbr: "Thr", color: "#a3e635" },
  ACC: { name: "Threonine", abbr: "Thr", color: "#a3e635" },
  ACA: { name: "Threonine", abbr: "Thr", color: "#a3e635" },
  ACG: { name: "Threonine", abbr: "Thr", color: "#a3e635" },

  // Asparagine / Lysine
  AAU: { name: "Asparagine", abbr: "Asn", color: "#e879f9" },
  AAC: { name: "Asparagine", abbr: "Asn", color: "#e879f9" },
  AAA: { name: "Lysine", abbr: "Lys", color: "#f43f5e" },
  AAG: { name: "Lysine", abbr: "Lys", color: "#f43f5e" },

  // Valine
  GUU: { name: "Valine", abbr: "Val", color: "#06b6d4" },
  GUC: { name: "Valine", abbr: "Val", color: "#06b6d4" },
  GUA: { name: "Valine", abbr: "Val", color: "#06b6d4" },
  GUG: { name: "Valine", abbr: "Val", color: "#06b6d4" },

  // Alanine
  GCU: { name: "Alanine", abbr: "Ala", color: "#84cc16" },
  GCC: { name: "Alanine", abbr: "Ala", color: "#84cc16" },
  GCA: { name: "Alanine", abbr: "Ala", color: "#84cc16" },
  GCG: { name: "Alanine", abbr: "Ala", color: "#84cc16" },

  // Aspartic Acid / Glutamic Acid
  GAU: { name: "Aspartic Acid", abbr: "Asp", color: "#ef4444" },
  GAC: { name: "Aspartic Acid", abbr: "Asp", color: "#ef4444" },
  GAA: { name: "Glutamic Acid", abbr: "Glu", color: "#dc2626" },
  GAG: { name: "Glutamic Acid", abbr: "Glu", color: "#dc2626" },

  // Glycine
  GGU: { name: "Glycine", abbr: "Gly", color: "#14b8a6" },
  GGC: { name: "Glycine", abbr: "Gly", color: "#14b8a6" },
  GGA: { name: "Glycine", abbr: "Gly", color: "#14b8a6" },
  GGG: { name: "Glycine", abbr: "Gly", color: "#14b8a6" },
};

// ─── COLOR INTERPOLATION (INCOMPLETE DOMINANCE) ──────────────

export function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple hex lerp
  const c1 = parseInt(color1.replace("#", ""), 16);
  const c2 = parseInt(color2.replace("#", ""), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── MONOHYBRID PUNNETT ENGINE & NONDISJUNCTION ─────────────

export function generateMonohybridGametes(p: MonohybridParent, nondisjunction: boolean = false): [MonohybridGamete, MonohybridGamete] {
  if (nondisjunction) {
    // Both chromatids pull to one gamete (n+1), leaving the other empty (n-1)
    return [
      { chromosomeCount: "n+1", alleles: [p.allele1, p.allele2] },
      { chromosomeCount: "n-1", alleles: [] },
    ];
  }
  return [
    { chromosomeCount: "n", alleles: [p.allele1] },
    { chromosomeCount: "n", alleles: [p.allele2] },
  ];
}

export function generateMonohybridGrid(
  p1: MonohybridParent,
  p2: MonohybridParent,
  p1Nondisjunction: boolean = false,
  p2Nondisjunction: boolean = false,
  dominance: DominanceModel = "complete"
) {
  const g1List = generateMonohybridGametes(p1, p1Nondisjunction);
  const g2List = generateMonohybridGametes(p2, p2Nondisjunction);

  const grid: {
    g1: MonohybridGamete;
    g2: MonohybridGamete;
    genotype: string;
    alleles: ("B" | "b")[];
    isAneuploid: boolean;
    ploidyLabel?: "2n+1" | "2n-1" | "2n";
    color: string;
    phenotype: string;
  }[][] = [];

  let bbCount = 0;
  let bbHeteroCount = 0;
  let recCount = 0;
  let aneuploidCount = 0;

  for (let r = 0; r < 2; r++) {
    const row: any[] = [];
    for (let c = 0; c < 2; c++) {
      const g1 = g1List[r];
      const g2 = g2List[c];

      const combinedAlleles = [...g1.alleles, ...g2.alleles].sort((a, b) => (a === "B" ? -1 : 1));
      const genotype = combinedAlleles.join("") || "0";
      const totalChromosomes = combinedAlleles.length;

      const isAneuploid = totalChromosomes !== 2;
      const ploidyLabel: "2n+1" | "2n-1" | "2n" =
        totalChromosomes === 3 ? "2n+1" : totalChromosomes === 1 ? "2n-1" : "2n";

      if (isAneuploid) aneuploidCount++;

      // Phenotype color calculation
      let color = "#8b5cf6"; // Dominant purple
      let phenotype = "Dominant";

      const bCount = combinedAlleles.filter((a) => a === "B").length;
      const smallBCount = combinedAlleles.filter((a) => a === "b").length;

      if (dominance === "incomplete") {
        if (totalChromosomes === 0) {
          color = "#64748b";
          phenotype = "Null";
        } else {
          // Continuous linear blend between Purple (#8b5cf6) and Amber (#f59e0b)
          const fractionRecessive = smallBCount / totalChromosomes;
          color = interpolateColor("#8b5cf6", "#f59e0b", fractionRecessive);
          phenotype = fractionRecessive === 0 ? "Purple" : fractionRecessive === 1 ? "Amber" : "Lavender Blend";
        }
      } else {
        // Complete dominance
        if (bCount > 0) {
          color = "#8b5cf6";
          phenotype = "Purple";
        } else if (smallBCount > 0) {
          color = "#f59e0b";
          phenotype = "Amber";
        } else {
          color = "#64748b";
          phenotype = "Null";
        }
      }

      if (genotype === "BB") bbCount++;
      else if (genotype === "Bb" || genotype === "bB") bbHeteroCount++;
      else if (genotype === "bb") recCount++;

      row.push({
        g1,
        g2,
        genotype,
        alleles: combinedAlleles,
        isAneuploid,
        ploidyLabel,
        color,
        phenotype,
      });
    }
    grid.push(row);
  }

  return {
    g1List,
    g2List,
    grid,
    genotypeCounts: { BB: bbCount, Bb: bbHeteroCount, bb: recCount, aneuploid: aneuploidCount },
    phenotypeCounts: { dominant: bbCount + bbHeteroCount, recessive: recCount },
    dominantPct: ((bbCount + bbHeteroCount) / 4) * 100,
    recessivePct: (recCount / 4) * 100,
  };
}

export function simulateMonohybridOffspring(
  p1: MonohybridParent,
  p2: MonohybridParent,
  count: number = 100,
  p1Nondisjunction: boolean = false,
  p2Nondisjunction: boolean = false
) {
  const g1List = generateMonohybridGametes(p1, p1Nondisjunction);
  const g2List = generateMonohybridGametes(p2, p2Nondisjunction);

  let domCount = 0;
  let recCount = 0;
  let aneuploidCount = 0;

  for (let i = 0; i < count; i++) {
    const g1 = g1List[Math.floor(Math.random() * 2)];
    const g2 = g2List[Math.floor(Math.random() * 2)];
    const combined = [...g1.alleles, ...g2.alleles];

    if (combined.length !== 2) aneuploidCount++;
    if (combined.includes("B")) domCount++;
    else recCount++;
  }

  // Calculate live Chi-squared statistic against expected 3:1 (75% / 25%)
  const expectedDom = count * 0.75;
  const expectedRec = count * 0.25;
  const chiSquare =
    expectedDom > 0 && expectedRec > 0
      ? parseFloat(
          (
            Math.pow(domCount - expectedDom, 2) / expectedDom +
            Math.pow(recCount - expectedRec, 2) / expectedRec
          ).toFixed(3)
        )
      : 0;

  return {
    total: count,
    dominant: domCount,
    recessive: recCount,
    aneuploid: aneuploidCount,
    dominantPct: parseFloat(((domCount / count) * 100).toFixed(1)),
    recessivePct: parseFloat(((recCount / count) * 100).toFixed(1)),
    chiSquare,
  };
}

// ─── DIHYBRID CROSS & CHROMOSOME LINKAGE MAP ────────────────

export function computeLinkedGameteWeights(mapUnits: number): DihybridGameteWeight[] {
  // Recombination frequency r = min(distance, 50) / 50 * 0.5 (caps at 0.5 = 50%)
  const r = (Math.min(mapUnits, 50) / 50) * 0.5;
  const parentalProb = (1 - r) / 2;
  const recombinantProb = r / 2;

  return [
    { gamete: "RY", prob: parentalProb, isRecombinant: false },
    { gamete: "ry", prob: parentalProb, isRecombinant: false },
    { gamete: "Ry", prob: recombinantProb, isRecombinant: true },
    { gamete: "rY", prob: recombinantProb, isRecombinant: true },
  ];
}

export function generateLinkedDihybridGrid(p1: DihybridParent, p2: DihybridParent, mapUnits: number = 50) {
  const gametes1 = computeLinkedGameteWeights(mapUnits);
  const gametes2 = computeLinkedGameteWeights(mapUnits);

  const grid: {
    g1: string;
    g2: string;
    genotype: string;
    prob: number;
    trait1Dom: boolean;
    trait2Dom: boolean;
    category: "DomDom" | "DomRec" | "RecDom" | "RecRec";
  }[][] = [];

  let probDomDom = 0; // Round Yellow
  let probDomRec = 0; // Round Green
  let probRecDom = 0; // Wrinkled Yellow
  let probRecRec = 0; // Wrinkled Green

  for (let r = 0; r < 4; r++) {
    const row: any[] = [];
    for (let c = 0; c < 4; c++) {
      const g1 = gametes1[r];
      const g2 = gametes2[c];
      const cellProb = g1.prob * g2.prob;

      const rAlleles = [g1.gamete[0], g2.gamete[0]].sort().join("");
      const yAlleles = [g1.gamete[1], g2.gamete[1]].sort().join("");
      const genotype = `${rAlleles.includes("R") ? (rAlleles.includes("r") ? "Rr" : "RR") : "rr"}${yAlleles.includes("Y") ? (yAlleles.includes("y") ? "Yy" : "YY") : "yy"}`;

      const trait1Dom = genotype.includes("R");
      const trait2Dom = genotype.includes("Y");

      let category: "DomDom" | "DomRec" | "RecDom" | "RecRec" = "DomDom";
      if (trait1Dom && trait2Dom) {
        category = "DomDom";
        probDomDom += cellProb;
      } else if (trait1Dom && !trait2Dom) {
        category = "DomRec";
        probDomRec += cellProb;
      } else if (!trait1Dom && trait2Dom) {
        category = "RecDom";
        probRecDom += cellProb;
      } else {
        category = "RecRec";
        probRecRec += cellProb;
      }

      row.push({
        g1: g1.gamete,
        g2: g2.gamete,
        genotype,
        prob: cellProb,
        trait1Dom,
        trait2Dom,
        category,
      });
    }
    grid.push(row);
  }

  return {
    gametes1,
    gametes2,
    grid,
    mapUnits,
    recombinationFreq: ((Math.min(mapUnits, 50) / 50) * 0.5 * 100).toFixed(1),
    probabilities: {
      DomDom: parseFloat((probDomDom * 100).toFixed(1)),
      DomRec: parseFloat((probDomRec * 100).toFixed(1)),
      RecDom: parseFloat((probRecDom * 100).toFixed(1)),
      RecRec: parseFloat((probRecRec * 100).toFixed(1)),
    },
  };
}

// ─── CENTRAL DOGMA: TRANSCRIPTION & TRANSLATION ENGINE ───────

export function transcribeDNAtoMRNA(dnaTemplate: string): string {
  const clean = dnaTemplate.toUpperCase().replace(/[^ATCG]/g, "");
  return clean
    .split("")
    .map((base) => {
      if (base === "A") return "U";
      if (base === "T") return "A";
      if (base === "C") return "G";
      if (base === "G") return "C";
      return "";
    })
    .join("");
}

export function translateMRNAtoProtein(mrna: string): {
  codons: string[];
  aminoAcids: {
    codon: string;
    name: string;
    abbr: string;
    color: string;
    isStop?: boolean;
  }[];
} {
  const clean = mrna.toUpperCase().replace(/[^AUCG]/g, "");
  const codons: string[] = [];
  const aminoAcids: any[] = [];

  for (let i = 0; i + 2 < clean.length; i += 3) {
    const codon = clean.substring(i, i + 3);
    codons.push(codon);
    const aa = CODON_TABLE[codon] || { name: "Unknown", abbr: "???", color: "#64748b" };
    aminoAcids.push({ codon, ...aa });
  }

  return { codons, aminoAcids };
}

// Frameshift helpers
export function applyFrameshiftInsert(dna: string, index: number, base: string = "A"): string {
  const clean = dna.toUpperCase().replace(/[^ATCG]/g, "");
  return clean.slice(0, index) + base + clean.slice(index);
}

export function applyFrameshiftDelete(dna: string, index: number): string {
  const clean = dna.toUpperCase().replace(/[^ATCG]/g, "");
  if (clean.length <= 3) return clean;
  return clean.slice(0, index) + clean.slice(index + 1);
}

// ─── PEDIGREE TREE INHERITANCE ENGINE (4 DATASETS) ───────────

export const SAMPLE_PEDIGREES: Record<InheritanceMode, PedigreeMember[]> = {
  autosomal_dominant: [
    // Huntington's: I-1 affected (Aa), I-2 unaffected (aa)
    { id: "I-1", generation: 1, gender: "male", affected: true, genotype: "Aa", label: "Father (Aa)" },
    { id: "I-2", generation: 1, gender: "female", affected: false, genotype: "aa", label: "Mother (aa)" },
    { id: "II-1", generation: 2, gender: "female", affected: true, genotype: "Aa", parents: ["I-1", "I-2"], label: "Daughter 1 (Aa)" },
    { id: "II-2", generation: 2, gender: "male", affected: false, genotype: "aa", parents: ["I-1", "I-2"], label: "Son 1 (aa)" },
    { id: "II-3", generation: 2, gender: "female", affected: false, genotype: "aa", parents: ["I-1", "I-2"], label: "Daughter 2 (aa)" },
    { id: "II-4", generation: 2, gender: "male", affected: true, genotype: "Aa", parents: ["I-1", "I-2"], label: "Son 2 (Aa)" },
  ],
  autosomal_recessive: [
    // Cystic Fibrosis: both parents carriers (Aa x Aa)
    { id: "I-1", generation: 1, gender: "male", affected: false, carrier: true, genotype: "Aa", label: "Father (Aa)" },
    { id: "I-2", generation: 1, gender: "female", affected: false, carrier: true, genotype: "Aa", label: "Mother (Aa)" },
    { id: "II-1", generation: 2, gender: "female", affected: true, genotype: "aa", parents: ["I-1", "I-2"], label: "Daughter (aa)" },
    { id: "II-2", generation: 2, gender: "male", affected: false, carrier: true, genotype: "Aa", parents: ["I-1", "I-2"], label: "Son 1 (Aa)" },
    { id: "II-3", generation: 2, gender: "male", affected: false, carrier: false, genotype: "AA", parents: ["I-1", "I-2"], label: "Son 2 (AA)" },
  ],
  x_linked_recessive: [
    // Hemophilia: Carrier Mother (X^B X^b) x Normal Father (X^B Y)
    { id: "I-1", generation: 1, gender: "male", affected: false, genotype: "X^B Y", label: "Father (X^B Y)" },
    { id: "I-2", generation: 1, gender: "female", affected: false, carrier: true, genotype: "X^B X^b", label: "Mother (X^B X^b)" },
    { id: "II-1", generation: 2, gender: "male", affected: true, genotype: "X^b Y", parents: ["I-1", "I-2"], label: "Son 1 (X^b Y)" },
    { id: "II-2", generation: 2, gender: "female", affected: false, carrier: true, genotype: "X^B X^b", parents: ["I-1", "I-2"], label: "Daughter 1 (X^B X^b)" },
    { id: "II-3", generation: 2, gender: "male", affected: false, genotype: "X^B Y", parents: ["I-1", "I-2"], label: "Son 2 (X^B Y)" },
  ],
  x_linked_dominant: [
    // Vitamin D-resistant Rickets: Affected Father (X^D Y) x Normal Mother (X^d X^d)
    // Consequence: 100% of daughters affected (X^D X^d), 0% of sons affected (X^d Y)
    { id: "I-1", generation: 1, gender: "male", affected: true, genotype: "X^D Y", label: "Father (X^D Y)" },
    { id: "I-2", generation: 1, gender: "female", affected: false, genotype: "X^d X^d", label: "Mother (X^d X^d)" },
    { id: "II-1", generation: 2, gender: "female", affected: true, genotype: "X^D X^d", parents: ["I-1", "I-2"], label: "Daughter 1 (X^D X^d)" },
    { id: "II-2", generation: 2, gender: "female", affected: true, genotype: "X^D X^d", parents: ["I-1", "I-2"], label: "Daughter 2 (X^D X^d)" },
    { id: "II-3", generation: 2, gender: "male", affected: false, genotype: "X^d Y", parents: ["I-1", "I-2"], label: "Son 1 (X^d Y)" },
    { id: "II-4", generation: 2, gender: "male", affected: false, genotype: "X^d Y", parents: ["I-1", "I-2"], label: "Son 2 (X^d Y)" },
  ],
  blind_mystery: [
    // Mystery Pedigree (Unlabeled X-Linked Recessive)
    { id: "I-1", generation: 1, gender: "male", affected: false, genotype: "X^B Y", label: "Individual I-1" },
    { id: "I-2", generation: 1, gender: "female", affected: false, carrier: true, genotype: "X^B X^b", label: "Individual I-2" },
    { id: "II-1", generation: 2, gender: "male", affected: true, genotype: "X^b Y", parents: ["I-1", "I-2"], label: "Individual II-1" },
    { id: "II-2", generation: 2, gender: "female", affected: false, carrier: true, genotype: "X^B X^b", parents: ["I-1", "I-2"], label: "Individual II-2" },
    { id: "II-3", generation: 2, gender: "male", affected: false, genotype: "X^B Y", parents: ["I-1", "I-2"], label: "Individual II-3" },
  ],
};
