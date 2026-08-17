import {
  FrequencyData,
  EnigmaConfig,
  EnigmaRotorConfig,
  DiffieHellmanState,
  Sha256Comparison,
} from "../types";

// Standard English Letter Frequencies (%)
export const ENGLISH_FREQUENCIES: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.095, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.074,
};

// ─── CAESAR CIPHER ──────────────────────────────────────────

export function caesarEncrypt(text: string, shift: number): string {
  const normShift = ((shift % 26) + 26) % 26;
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z (65-90)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + normShift) % 26) + 65);
      }
      // Lowercase a-z (97-122)
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + normShift) % 26) + 97);
      }
      return char;
    })
    .join("");
}

export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}

export function computeLetterFrequencies(text: string): FrequencyData[] {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const total = clean.length;
  const counts: Record<string, number> = {};
  for (let i = 65; i <= 90; i++) {
    counts[String.fromCharCode(i)] = 0;
  }

  for (const char of clean) {
    counts[char] = (counts[char] || 0) + 1;
  }

  return Object.keys(counts).map((letter) => {
    const count = counts[letter];
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return {
      letter,
      count,
      percentage: parseFloat(percentage.toFixed(1)),
      expectedPercentage: ENGLISH_FREQUENCIES[letter] || 0,
    };
  });
}

/**
 * Auto-crack Caesar ciphertext using Chi-squared (chi^2) statistic
 */
export function crackCaesar(ciphertext: string): { bestShift: number; plaintext: string; score: number } {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length === 0) return { bestShift: 0, plaintext: ciphertext, score: 0 };

  let bestShift = 0;
  let minChi2 = Infinity;

  for (let shift = 0; shift < 26; shift++) {
    const candidate = caesarDecrypt(clean, shift);
    const freqs = computeLetterFrequencies(candidate);

    // Calculate Chi-Squared: sum of (Observed - Expected)^2 / Expected
    let chi2 = 0;
    for (const item of freqs) {
      const expectedCount = (clean.length * item.expectedPercentage) / 100;
      if (expectedCount > 0) {
        chi2 += Math.pow(item.count - expectedCount, 2) / expectedCount;
      }
    }

    if (chi2 < minChi2) {
      minChi2 = chi2;
      bestShift = shift;
    }
  }

  return {
    bestShift,
    plaintext: caesarDecrypt(ciphertext, bestShift),
    score: parseFloat(minChi2.toFixed(2)),
  };
}

// ─── VIGENÈRE CIPHER ────────────────────────────────────────

export function vigenereEncrypt(text: string, key: string): string {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;

      if (isUpper || isLower) {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        const base = isUpper ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join("");
}

export function vigenereDecrypt(text: string, key: string): string {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;

      if (isUpper || isLower) {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        const base = isUpper ? 65 : 97;
        return String.fromCharCode(((code - base - shift + 26) % 26) + base);
      }
      return char;
    })
    .join("");
}

// ─── ENIGMA MACHINE SIMULATOR (Wehrmacht Enigma I) ───────────

const ROTOR_WIRINGS: Record<"I" | "II" | "III", { wire: string; notch: number }> = {
  I: { wire: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: 16 }, // Q -> R
  II: { wire: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: 4 },  // E -> F
  III: { wire: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: 21 }, // V -> W
};

const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

export function stepAndEncodeEnigma(
  inputChar: string,
  config: EnigmaConfig
): { outputChar: string; updatedConfig: EnigmaConfig; trace: string[] } {
  const char = inputChar.toUpperCase();
  if (char < "A" || char > "Z") {
    return { outputChar: inputChar, updatedConfig: config, trace: [] };
  }

  const trace: string[] = [];
  const rotors: [EnigmaRotorConfig, EnigmaRotorConfig, EnigmaRotorConfig] = [
    { ...config.rotors[0] },
    { ...config.rotors[1] },
    { ...config.rotors[2] },
  ];

  // 1. Step Rotors (Right to Left: Rotor 2 is Fast, Rotor 1 is Medium, Rotor 0 is Slow)
  // Check turnover notch on Rotor 2 (fast)
  const r2 = rotors[2];
  const r1 = rotors[1];
  const r0 = rotors[0];

  const r2Notch = ROTOR_WIRINGS[r2.type].notch;
  const r1Notch = ROTOR_WIRINGS[r1.type].notch;

  // Double-stepping anomaly: if middle rotor is at notch, it steps and steps left rotor
  const stepR1 = r2.position === r2Notch || r1.position === r1Notch;
  const stepR0 = r1.position === r1Notch;

  r2.position = (r2.position + 1) % 26;
  if (stepR1) r1.position = (r1.position + 1) % 26;
  if (stepR0) r0.position = (r0.position + 1) % 26;

  // 2. Steckerbrett (Plugboard) Swap In
  let signal = char.charCodeAt(0) - 65;
  trace.push(`Key '${char}' (Pos ${signal})`);

  for (const [p1, p2] of config.plugboard) {
    if (char === p1) signal = p2.charCodeAt(0) - 65;
    else if (char === p2) signal = p1.charCodeAt(0) - 65;
  }
  trace.push(`Plugboard In -> '${String.fromCharCode(signal + 65)}'`);

  // Helper forward through rotor
  const forwardRotor = (sig: number, r: EnigmaRotorConfig) => {
    const shift = (r.position - r.ringSetting + 26) % 26;
    const enter = (sig + shift) % 26;
    const mappedChar = ROTOR_WIRINGS[r.type].wire[enter];
    const mappedCode = mappedChar.charCodeAt(0) - 65;
    return (mappedCode - shift + 26) % 26;
  };

  // Helper backward through rotor
  const backwardRotor = (sig: number, r: EnigmaRotorConfig) => {
    const shift = (r.position - r.ringSetting + 26) % 26;
    const enter = (sig + shift) % 26;
    const targetChar = String.fromCharCode(enter + 65);
    const mappedPos = ROTOR_WIRINGS[r.type].wire.indexOf(targetChar);
    return (mappedPos - shift + 26) % 26;
  };

  // 3. Forward Pass through Rotors 2, 1, 0
  signal = forwardRotor(signal, r2);
  trace.push(`Rotor III -> '${String.fromCharCode(signal + 65)}'`);
  signal = forwardRotor(signal, r1);
  trace.push(`Rotor II -> '${String.fromCharCode(signal + 65)}'`);
  signal = forwardRotor(signal, r0);
  trace.push(`Rotor I -> '${String.fromCharCode(signal + 65)}'`);

  // 4. Reflector UKW-B
  const refChar = REFLECTOR_B[signal];
  signal = refChar.charCodeAt(0) - 65;
  trace.push(`Reflector B -> '${String.fromCharCode(signal + 65)}'`);

  // 5. Reverse Pass through Rotors 0, 1, 2
  signal = backwardRotor(signal, r0);
  trace.push(`Rotor I Rev -> '${String.fromCharCode(signal + 65)}'`);
  signal = backwardRotor(signal, r1);
  trace.push(`Rotor II Rev -> '${String.fromCharCode(signal + 65)}'`);
  signal = backwardRotor(signal, r2);
  trace.push(`Rotor III Rev -> '${String.fromCharCode(signal + 65)}'`);

  // 6. Steckerbrett (Plugboard) Swap Out
  let outChar = String.fromCharCode(signal + 65);
  for (const [p1, p2] of config.plugboard) {
    if (outChar === p1) outChar = p2;
    else if (outChar === p2) outChar = p1;
  }
  trace.push(`Lampboard Lit -> '${outChar}'`);

  return {
    outputChar: outChar,
    updatedConfig: {
      rotors: [r0, r1, r2],
      reflector: "B",
      plugboard: config.plugboard,
    },
    trace,
  };
}

// ─── ASYMMETRIC DIFFIE-HELLMAN KEY EXCHANGE ─────────────────

export function modularPow(base: number, exp: number, mod: number): number {
  let res = 1;
  let b = base % mod;
  let e = exp;

  while (e > 0) {
    if (e % 2 === 1) res = (res * b) % mod;
    e = Math.floor(e / 2);
    b = (b * b) % mod;
  }
  return res;
}

export function computeDiffieHellman(p: number, g: number, a: number, b: number): DiffieHellmanState {
  const alicePublic = modularPow(g, a, p);
  const bobPublic = modularPow(g, b, p);

  const aliceSharedSecret = modularPow(bobPublic, a, p);
  const bobSharedSecret = modularPow(alicePublic, b, p);

  return {
    p,
    g,
    alicePrivate: a,
    bobPrivate: b,
    alicePublic,
    bobPublic,
    aliceSharedSecret,
    bobSharedSecret,
  };
}

// ─── SHA-256 HASHING & AVALANCHE EFFECT ─────────────────────

/**
 * Synchronous SHA-256 implementation
 */
export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let primeCounter = k[lengthProperty];

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

export function hexToBinary256(hex: string): string {
  return hex
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
}

export function compareSha256Avalanche(text1: string, text2: string): Sha256Comparison {
  const hash1Hex = sha256Sync(text1);
  const hash2Hex = sha256Sync(text2);

  const hash1Bin = hexToBinary256(hash1Hex);
  const hash2Bin = hexToBinary256(hash2Hex);

  let bitDiffs = 0;
  for (let i = 0; i < 256; i++) {
    if (hash1Bin[i] !== hash2Bin[i]) bitDiffs++;
  }

  const flippedPercentage = parseFloat(((bitDiffs / 256) * 100).toFixed(1));

  return {
    text1,
    hash1Hex,
    hash1Bin,
    text2,
    hash2Hex,
    hash2Bin,
    bitDifferences: bitDiffs,
    flippedPercentage,
  };
}
