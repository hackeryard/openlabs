export type NumberTheoryTabId =
  | "primes_sieve"
  | "euclidean_gcd"
  | "modular_arithmetic"
  | "euler_totient"
  | "rsa_cryptography"
  | "collatz_fractions";

export interface PrimeFactor {
  prime: number;
  power: number;
}

export interface EuclideanStep {
  step: number;
  a: number;
  b: number;
  q: number;
  r: number;
  equation: string;
}

export interface BezoutIdentityResult {
  gcd: number;
  x: number;
  y: number;
  steps: EuclideanStep[];
  lcm: number;
}

export interface CongruenceEquation {
  a: number;
  m: number;
}

export interface RsaKeyPair {
  p: number;
  q: number;
  n: number;
  phi: number;
  e: number;
  d: number;
}

export interface CollatzResult {
  steps: number[];
  stoppingTime: number;
  peakValue: number;
}
