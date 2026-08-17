export type Allele = "B" | "b" | "R" | "r" | "Y" | "y" | "W" | "w" | "F" | "f";

export type DominanceModel = "complete" | "incomplete" | "codominant";

export interface TraitDefinition {
  id: string;
  name: string;
  dominance: DominanceModel;
  dominantAllele: string;
  recessiveAllele: string;
  dominantColor: string;
  recessiveColor: string;
  intermediateColor?: string;
}

export interface MonohybridGamete {
  chromosomeCount: "n" | "n+1" | "n-1";
  alleles: ("B" | "b")[];
}

export interface MonohybridParent {
  allele1: "B" | "b";
  allele2: "B" | "b";
  nondisjunction?: boolean; // When true, alleles don't separate
}

export interface DihybridParent {
  trait1: ["R" | "r", "R" | "r"];
  trait2: ["Y" | "y", "Y" | "y"];
}

export interface DihybridGameteWeight {
  gamete: string; // e.g. "RY", "Ry", "rY", "ry"
  prob: number; // 0 to 1
  isRecombinant: boolean;
}

export interface CodonEntry {
  codon: string;
  aminoAcid: string;
  fullName: string;
  abbr: string;
  isStop?: boolean;
}

export type MutationType = "none" | "silent" | "missense" | "nonsense" | "frameshift";

export interface PedigreeMember {
  id: string;
  generation: 1 | 2 | 3;
  gender: "male" | "female";
  affected: boolean;
  carrier?: boolean;
  parents?: [string, string]; // [Father ID, Mother ID]
  spouseId?: string;
  label: string;
  genotype?: string;
}

export type InheritanceMode =
  | "autosomal_dominant"
  | "autosomal_recessive"
  | "x_linked_recessive"
  | "x_linked_dominant"
  | "blind_mystery";
