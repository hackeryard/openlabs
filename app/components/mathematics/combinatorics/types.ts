export type CombinatoricsTabId =
  | "permutations_combinations"
  | "pascals_triangle"
  | "pigeonhole"
  | "stars_and_bars"
  | "catalan_numbers"
  | "derangements";

export type ItemType = "letters" | "colors" | "emojis" | "numbers" | "custom";

export interface ItemElement {
  id: string;
  label: string;
  color?: string;
  value: string;
}

export type CountingMode =
  | "combination" // C(n, r)
  | "permutation" // P(n, r)
  | "multiset_anagram" // n! / (n1! n2! ... nk!)
  | "repetition" // n^r
  | "circular"; // (n-1)!

export interface PascalPatternType {
  mode: "default" | "sierpinski" | "fibonacci" | "hockey_stick" | "row_sums" | "vandermonde";
}

export interface PigeonItem {
  id: number;
  label: string;
  holeIndex: number;
  color: string;
}

export interface PartitionItem {
  parts: number[];
  sum: number;
}

export interface DyckStep {
  x: number;
  y: number;
}
