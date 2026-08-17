export type CryptographyTabId =
  | "caesar"
  | "vigenere"
  | "enigma"
  | "diffie_hellman"
  | "sha256";

export interface FrequencyData {
  letter: string;
  count: number;
  percentage: number;
  expectedPercentage: number;
}

export interface EnigmaRotorConfig {
  type: "I" | "II" | "III";
  position: number; // 0-25 (A-Z)
  ringSetting: number; // 0-25
}

export interface EnigmaConfig {
  rotors: [EnigmaRotorConfig, EnigmaRotorConfig, EnigmaRotorConfig];
  reflector: "B";
  plugboard: [string, string][]; // pairs of swapped letters e.g. [["A", "M"], ["F", "X"]]
}

export interface DiffieHellmanState {
  p: number; // Public prime modulus
  g: number; // Public generator base
  alicePrivate: number; // Alice secret a
  bobPrivate: number; // Bob secret b
  alicePublic: number; // A = g^a mod p
  bobPublic: number; // B = g^b mod p
  aliceSharedSecret: number; // S = B^a mod p
  bobSharedSecret: number; // S = A^b mod p
}

export interface Sha256Comparison {
  text1: string;
  hash1Hex: string;
  hash1Bin: string;
  text2: string;
  hash2Hex: string;
  hash2Bin: string;
  bitDifferences: number;
  flippedPercentage: number;
}
