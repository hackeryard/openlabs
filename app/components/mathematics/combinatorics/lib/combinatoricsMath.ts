/**
 * Comprehensive Combinatorics & Discrete Counting Mathematics Engine
 */

export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function circularPermutations(n: number): number {
  if (n <= 1) return 1;
  return factorial(n - 1);
}

export function catalanNumber(n: number): number {
  if (n < 0) return 0;
  return nCr(2 * n, n) / (n + 1);
}

export function derangements(n: number): number {
  if (n === 0) return 1;
  if (n === 1) return 0;
  let d0 = 1;
  let d1 = 0;
  let dn = 0;
  for (let i = 2; i <= n; i++) {
    dn = (i - 1) * (d1 + d0);
    d0 = d1;
    d1 = dn;
  }
  return dn;
}

/**
 * Multiset / Anagram permutations: n! / (n1! * n2! * ... * nk!)
 */
export function multisetPermutationsCount(word: string): { total: number; freqMap: Record<string, number> } {
  const letters = word.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const n = letters.length;
  if (n === 0) return { total: 0, freqMap: {} };

  const freqMap: Record<string, number> = {};
  for (const char of letters) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  let denom = 1;
  for (const count of Object.values(freqMap)) {
    denom *= factorial(count);
  }

  const total = factorial(n) / denom;
  return { total, freqMap };
}

/**
 * Generate all permutations of length r from an array
 */
export function generatePermutations<T>(arr: T[], r: number, maxLimit = 250): T[][] {
  const results: T[][] = [];
  const n = arr.length;
  if (r <= 0 || r > n) return [];

  function backtrack(current: T[], used: boolean[]) {
    if (results.length >= maxLimit) return;
    if (current.length === r) {
      results.push([...current]);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        used[i] = true;
        current.push(arr[i]);
        backtrack(current, used);
        current.pop();
        used[i] = false;
      }
    }
  }

  backtrack([], Array(n).fill(false));
  return results;
}

/**
 * Generate all unique anagrams for a word (up to maxLimit)
 */
export function generateAnagrams(word: string, maxLimit = 150): string[] {
  const chars = word.toUpperCase().replace(/[^A-Z0-9]/g, "").split("").sort();
  const n = chars.length;
  if (n === 0) return [];
  const results: string[] = [];
  const used = Array(n).fill(false);

  function backtrack(current: string[]) {
    if (results.length >= maxLimit) return;
    if (current.length === n) {
      results.push(current.join(""));
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      // Skip duplicates
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;

      used[i] = true;
      current.push(chars[i]);
      backtrack(current);
      current.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return results;
}

/**
 * Generate all combinations of length r from an array
 */
export function generateCombinations<T>(arr: T[], r: number, maxLimit = 250): T[][] {
  const results: T[][] = [];
  const n = arr.length;
  if (r < 0 || r > n) return [];
  if (r === 0) return [[]];

  function backtrack(start: number, current: T[]) {
    if (results.length >= maxLimit) return;
    if (current.length === r) {
      results.push([...current]);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return results;
}

/**
 * Generate Pascal's Triangle Matrix up to row N
 */
export function generatePascalsTriangle(rows: number): number[][] {
  const triangle: number[][] = [];
  for (let i = 0; i <= rows; i++) {
    const row: number[] = [1];
    for (let j = 1; j < i; j++) {
      row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
    }
    if (i > 0) row.push(1);
    triangle.push(row);
  }
  return triangle;
}

/**
 * Generate all Integer Partitions of n
 */
export function generateIntegerPartitions(n: number, maxLimit = 150): number[][] {
  if (n <= 0) return [];
  const results: number[][] = [];

  function backtrack(remaining: number, maxVal: number, current: number[]) {
    if (results.length >= maxLimit) return;
    if (remaining === 0) {
      results.push([...current]);
      return;
    }
    for (let i = Math.min(remaining, maxVal); i >= 1; i--) {
      current.push(i);
      backtrack(remaining - i, i, current);
      current.pop();
    }
  }

  backtrack(n, n, []);
  return results;
}

/**
 * Generate all Dyck paths of length 2n (represented as strings of 'U' and 'D')
 */
export function generateDyckPaths(n: number, maxLimit = 150): string[] {
  if (n <= 0) return [""];
  const results: string[] = [];

  function backtrack(upCount: number, downCount: number, current: string) {
    if (results.length >= maxLimit) return;
    if (upCount === n && downCount === n) {
      results.push(current);
      return;
    }
    if (upCount < n) {
      backtrack(upCount + 1, downCount, current + "U");
    }
    if (downCount < upCount) {
      backtrack(upCount, downCount + 1, current + "D");
    }
  }

  backtrack(0, 0, "");
  return results;
}

/**
 * Generate all Balanced Parentheses of length 2n
 */
export function generateBalancedParentheses(n: number, maxLimit = 150): string[] {
  const paths = generateDyckPaths(n, maxLimit);
  return paths.map((p) => p.replace(/U/g, "(").replace(/D/g, ")"));
}

/**
 * Generate Binomial Expansion terms for (ax + by)^n
 */
export function expandBinomial(
  a: number,
  b: number,
  n: number
): { k: number; coeff: number; termStr: string }[] {
  const terms = [];
  for (let k = 0; k <= n; k++) {
    const combo = nCr(n, k);
    const coeff = combo * Math.pow(a, n - k) * Math.pow(b, k);

    const xPower = n - k;
    const yPower = k;

    let termStr = "";
    if (coeff !== 1 || (xPower === 0 && yPower === 0)) {
      termStr += coeff;
    }
    if (xPower > 0) {
      termStr += xPower === 1 ? "x" : `x^${xPower}`;
    }
    if (yPower > 0) {
      termStr += yPower === 1 ? "y" : `y^${yPower}`;
    }

    terms.push({ k, coeff, termStr: termStr || "1" });
  }
  return terms;
}
