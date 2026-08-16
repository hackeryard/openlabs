export type SetTabId =
  | "venn"
  | "operations"
  | "inclusion_exclusion"
  | "relations"
  | "truth_tables";

export type VennMode = "2-set" | "3-set";

export interface SetElement {
  id: string;
  value: string;
  inA: boolean;
  inB: boolean;
  inC?: boolean;
  x?: number;
  y?: number;
}

export interface SetConfig {
  nameA: string;
  nameB: string;
  nameC: string;
  colorA: string;
  colorB: string;
  colorC: string;
}

export type PresetCollectionType =
  | "integers_1_to_10"
  | "primes_evens_multiples"
  | "vowels_letters"
  | "geometric_shapes"
  | "student_activities"
  | "custom";

export interface RelationMapping {
  from: string; // element in domain X
  to: string; // element in codomain Y
}

export interface FunctionClassification {
  isInjective: boolean; // One-to-One
  isSurjective: boolean; // Onto
  isBijective: boolean; // One-to-One and Onto
  isFunction: boolean; // Each x maps to exactly one y
  injectiveViolations: string[];
  surjectiveMissing: string[];
  functionViolations: string[];
}

export interface EquivalenceRelationProperties {
  isReflexive: boolean;
  isSymmetric: boolean;
  isTransitive: boolean;
  isEquivalenceRelation: boolean;
  reflexiveMissing: string[];
  symmetricViolations: string[];
  transitiveViolations: string[];
}

export interface DynamicTruthTable {
  headers: string[];
  variables: string[];
  rows: {
    inputs: Record<string, boolean>;
    intermediates: Record<string, boolean>;
    finalResult: boolean;
  }[];
  isTautology: boolean;
  isContradiction: boolean;
}
