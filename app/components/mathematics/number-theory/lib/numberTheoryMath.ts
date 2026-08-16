import {
  PrimeFactor,
  EuclideanStep,
  BezoutIdentityResult,
  RsaKeyPair,
  CollatzResult,
} from "../types";

/**
 * Generates prime booleans up to N via Sieve of Eratosthenes
 */
export function sieveOfEratosthenes(limit: number): boolean[] {
  const isPrime = Array(limit + 1).fill(true);
  isPrime[0] = false;
  if (limit >= 1) isPrime[1] = false;

  for (let p = 2; p * p <= limit; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= limit; i += p) {
        isPrime[i] = false;
      }
    }
  }
  return isPrime;
}

/**
 * Prime Factorization: returns array of { prime, power }
 */
export function primeFactorization(n: number): {
  factors: PrimeFactor[];
  divisors: number[];
  divisorCount: number;
  divisorSum: number;
  classification: "prime" | "composite" | "perfect" | "abundant" | "deficient";
} {
  if (n <= 1) {
    return {
      factors: [],
      divisors: [1],
      divisorCount: 1,
      divisorSum: 1,
      classification: "deficient",
    };
  }

  const factors: PrimeFactor[] = [];
  let temp = n;

  for (let d = 2; d * d <= temp; d++) {
    if (temp % d === 0) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp = Math.floor(temp / d);
      }
      factors.push({ prime: d, power: count });
    }
  }
  if (temp > 1) {
    factors.push({ prime: temp, power: 1 });
  }

  // Divisors computation
  const divisors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisors.push(i);
  }

  const divisorCount = factors.reduce((acc, f) => acc * (f.power + 1), 1);
  const divisorSum = divisors.reduce((a, b) => a + b, 0);

  // Proper divisor sum (excluding n itself)
  const properSum = divisorSum - n;
  let classification: "prime" | "composite" | "perfect" | "abundant" | "deficient" = "composite";

  if (factors.length === 1 && factors[0].power === 1) {
    classification = "prime";
  } else if (properSum === n) {
    classification = "perfect";
  } else if (properSum > n) {
    classification = "abundant";
  } else {
    classification = "deficient";
  }

  return {
    factors,
    divisors,
    divisorCount,
    divisorSum,
    classification,
  };
}

/**
 * Extended Euclidean Algorithm: ax + by = gcd(a, b)
 */
export function extendedEuclidean(a: number, b: number): BezoutIdentityResult {
  const steps: EuclideanStep[] = [];
  let r0 = Math.abs(a);
  let r1 = Math.abs(b);
  let stepCount = 1;

  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    const r = r0 % r1;
    steps.push({
      step: stepCount++,
      a: r0,
      b: r1,
      q,
      r,
      equation: `${r0} = ${r1} · ${q} + ${r}`,
    });
    r0 = r1;
    r1 = r;
  }

  const gcd = r0 || 1;
  const lcm = (Math.abs(a) * Math.abs(b)) / gcd;

  // Extended GCD for Bezout coefficients
  let x0 = 1, x1 = 0, y0 = 0, y1 = 1;
  let tempA = Math.abs(a);
  let tempB = Math.abs(b);

  while (tempB !== 0) {
    const q = Math.floor(tempA / tempB);
    const r = tempA % tempB;
    tempA = tempB;
    tempB = r;

    const nextX = x0 - q * x1;
    x0 = x1;
    x1 = nextX;

    const nextY = y0 - q * y1;
    y0 = y1;
    y1 = nextY;
  }

  const x = a < 0 ? -x0 : x0;
  const y = b < 0 ? -y0 : y0;

  return { gcd, x, y, steps, lcm };
}

/**
 * Modular Inverse: a^-1 mod m
 */
export function modInverse(a: number, m: number): number | null {
  const { gcd, x } = extendedEuclidean((a % m + m) % m, m);
  if (gcd !== 1) return null;
  return (x % m + m) % m;
}

/**
 * Chinese Remainder Theorem (CRT)
 * Solves: x = rem[i] (mod mods[i])
 */
export function solveCRT(congruences: { a: number; m: number }[]): { x: number; M: number } | null {
  if (congruences.length === 0) return null;

  let M = 1;
  for (const c of congruences) {
    M *= c.m;
  }

  let x = 0;
  for (const c of congruences) {
    const Mi = M / c.m;
    const inv = modInverse(Mi, c.m);
    if (inv === null) return null; // moduli not pairwise coprime
    x = (x + c.a * Mi * inv) % M;
  }

  return { x: (x % M + M) % M, M };
}

/**
 * Euler's Totient Function phi(n)
 */
export function eulerTotient(n: number): { phi: number; coprimes: number[] } {
  if (n <= 1) return { phi: 1, coprimes: [1] };

  const { factors } = primeFactorization(n);
  let result = n;
  for (const f of factors) {
    result -= Math.floor(result / f.prime);
  }

  const coprimes: number[] = [];
  for (let k = 1; k < n; k++) {
    const { gcd } = extendedEuclidean(k, n);
    if (gcd === 1) coprimes.push(k);
  }

  return { phi: result, coprimes };
}

/**
 * Fast Modular Exponentiation: (base^exp) mod mod
 */
export function fastModExp(
  base: number,
  exp: number,
  mod: number
): { result: number; steps: { bit: number; power: number; current: number }[] } {
  if (mod === 1) return { result: 0, steps: [] };

  let current = 1;
  let b = base % mod;
  let e = exp;
  const steps = [];

  while (e > 0) {
    const bit = e % 2;
    if (bit === 1) {
      current = (current * b) % mod;
    }
    steps.push({ bit, power: b, current });
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }

  return { result: current, steps };
}

/**
 * RSA Key Generator
 */
export function generateRSAKeys(p: number, q: number): RsaKeyPair | null {
  if (p === q || p <= 1 || q <= 1) return null;

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Common public exponents: 3, 5, 17, 65537
  const candidates = [3, 5, 7, 11, 13, 17];
  let e = 3;
  for (const cand of candidates) {
    if (cand < phi && extendedEuclidean(cand, phi).gcd === 1) {
      e = cand;
      break;
    }
  }

  const d = modInverse(e, phi);
  if (d === null) return null;

  return { p, q, n, phi, e, d };
}

/**
 * RSA Encrypt & Decrypt numbers
 */
export function rsaEncrypt(m: number, e: number, n: number): number {
  return fastModExp(m, e, n).result;
}

export function rsaDecrypt(c: number, d: number, n: number): number {
  return fastModExp(c, d, n).result;
}

/**
 * Collatz 3n + 1 Orbit Sequence
 */
export function collatzSequence(n: number, maxSteps = 250): CollatzResult {
  if (n <= 0) return { steps: [1], stoppingTime: 0, peakValue: 1 };

  const steps: number[] = [n];
  let curr = n;
  let peak = n;

  while (curr !== 1 && steps.length < maxSteps) {
    if (curr % 2 === 0) {
      curr = curr / 2;
    } else {
      curr = 3 * curr + 1;
    }
    steps.push(curr);
    if (curr > peak) peak = curr;
  }

  return {
    steps,
    stoppingTime: steps.length - 1,
    peakValue: peak,
  };
}

/**
 * Continued Fraction expansion of rational a / b
 */
export function continuedFraction(a: number, b: number, maxTerms = 12): number[] {
  const terms: number[] = [];
  let num = a;
  let den = b;

  while (den !== 0 && terms.length < maxTerms) {
    const q = Math.floor(num / den);
    terms.push(q);
    const rem = num % den;
    num = den;
    den = rem;
  }
  return terms;
}
