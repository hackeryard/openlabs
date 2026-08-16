import {
  SetElement,
  PresetCollectionType,
  FunctionClassification,
  EquivalenceRelationProperties,
  RelationMapping,
  DynamicTruthTable,
} from "../types";

export const REGIONS_2SET = ["A_only", "B_only", "AB_intersect", "outside"] as const;

export const REGIONS_3SET = [
  "A_only",
  "B_only",
  "C_only",
  "AB_only",
  "AC_only",
  "BC_only",
  "ABC_intersect",
  "outside",
] as const;

export type Region2Set = typeof REGIONS_2SET[number];
export type Region3Set = typeof REGIONS_3SET[number];

/**
 * Maps element membership to 2-set region
 */
export function getElementRegion2Set(inA: boolean, inB: boolean): Region2Set {
  if (inA && inB) return "AB_intersect";
  if (inA) return "A_only";
  if (inB) return "B_only";
  return "outside";
}

/**
 * Maps element membership to 3-set region
 */
export function getElementRegion3Set(inA: boolean, inB: boolean, inC = false): Region3Set {
  if (inA && inB && inC) return "ABC_intersect";
  if (inA && inB && !inC) return "AB_only";
  if (inA && !inB && inC) return "AC_only";
  if (!inA && inB && inC) return "BC_only";
  if (inA) return "A_only";
  if (inB) return "B_only";
  if (inC) return "C_only";
  return "outside";
}

/**
 * Evaluates standard set operations and returns active region names for 2-Set
 */
export function evaluateSetOperation2Set(operation: string): string[] {
  const op = operation.toLowerCase().trim();

  switch (op) {
    case "a":
      return ["A_only", "AB_intersect"];
    case "b":
      return ["B_only", "AB_intersect"];
    case "a_union_b":
    case "a | b":
    case "a u b":
    case "a ∪ b":
      return ["A_only", "B_only", "AB_intersect"];
    case "a_intersect_b":
    case "a & b":
    case "a n b":
    case "a ∩ b":
      return ["AB_intersect"];
    case "a_minus_b":
    case "a \\ b":
    case "a - b":
      return ["A_only"];
    case "b_minus_a":
    case "b \\ a":
    case "b - a":
      return ["B_only"];
    case "sym_diff":
    case "a ^ b":
    case "a delta b":
    case "a Δ b":
      return ["A_only", "B_only"];
    case "a_comp":
    case "a'":
    case "~a":
    case "¬a":
      return ["B_only", "outside"];
    case "b_comp":
    case "b'":
    case "~b":
    case "¬b":
      return ["A_only", "outside"];
    case "neither":
    case "(a u b)'":
    case "~(a | b)":
      return ["outside"];
    case "universal":
    case "u":
      return ["A_only", "B_only", "AB_intersect", "outside"];
    default: {
      const result: string[] = [];
      const testCases: { name: string; a: boolean; b: boolean }[] = [
        { name: "A_only", a: true, b: false },
        { name: "B_only", a: false, b: true },
        { name: "AB_intersect", a: true, b: true },
        { name: "outside", a: false, b: false },
      ];

      testCases.forEach(({ name, a, b }) => {
        if (evalBoolExpr(op, { a, b, c: false })) {
          result.push(name);
        }
      });

      return result;
    }
  }
}

/**
 * Evaluates standard set operations and returns active region names for 3-Set
 */
export function evaluateSetOperation3Set(operation: string): string[] {
  const op = operation.toLowerCase().trim();

  switch (op) {
    case "a":
      return ["A_only", "AB_only", "AC_only", "ABC_intersect"];
    case "b":
      return ["B_only", "AB_only", "BC_only", "ABC_intersect"];
    case "c":
      return ["C_only", "AC_only", "BC_only", "ABC_intersect"];
    case "a_union_b":
    case "a | b":
    case "a ∪ b":
      return ["A_only", "B_only", "AB_only", "AC_only", "BC_only", "ABC_intersect"];
    case "a_intersect_b":
    case "a & b":
    case "a ∩ b":
      return ["AB_only", "ABC_intersect"];
    case "b_intersect_c":
    case "b & c":
    case "b ∩ c":
      return ["BC_only", "ABC_intersect"];
    case "a_intersect_c":
    case "a & c":
    case "a ∩ c":
      return ["AC_only", "ABC_intersect"];
    case "a_intersect_b_intersect_c":
    case "a & b & c":
    case "a ∩ b ∩ c":
      return ["ABC_intersect"];
    case "all_union":
    case "a | b | c":
    case "a ∪ b ∪ c":
      return [
        "A_only",
        "B_only",
        "C_only",
        "AB_only",
        "AC_only",
        "BC_only",
        "ABC_intersect",
      ];
    default: {
      const result: string[] = [];
      const testCases: { name: string; a: boolean; b: boolean; c: boolean }[] = [
        { name: "A_only", a: true, b: false, c: false },
        { name: "B_only", a: false, b: true, c: false },
        { name: "C_only", a: false, b: false, c: true },
        { name: "AB_only", a: true, b: true, c: false },
        { name: "AC_only", a: true, b: false, c: true },
        { name: "BC_only", a: false, b: true, c: true },
        { name: "ABC_intersect", a: true, b: true, c: true },
        { name: "outside", a: false, b: false, c: false },
      ];

      testCases.forEach(({ name, a, b, c }) => {
        if (evalBoolExpr(op, { a, b, c })) {
          result.push(name);
        }
      });

      return result;
    }
  }
}

/**
 * Safe mini boolean evaluator for expressions with A, B, C, &, |, ~, ^, \, ∪, ∩, ¬
 */
function evalBoolExpr(expr: string, vars: { a: boolean; b: boolean; c: boolean }): boolean {
  try {
    let jsExpr = expr
      .replace(/∪/g, " || ")
      .replace(/∩/g, " && ")
      .replace(/¬/g, " !")
      .replace(/Δ/g, " !== ")
      .replace(/\\/g, " && !")
      .replace(/u/gi, " || ")
      .replace(/n/gi, " && ")
      .replace(/~/g, " !")
      .replace(/'/g, " ! ")
      .replace(/\|/g, " || ")
      .replace(/&/g, " && ")
      .replace(/\^/g, " !== ");

    jsExpr = jsExpr.replace(/\ba\b/gi, vars.a ? "true" : "false");
    jsExpr = jsExpr.replace(/\bb\b/gi, vars.b ? "true" : "false");
    jsExpr = jsExpr.replace(/\bc\b/gi, vars.c ? "true" : "false");

    if (!/^[truefals!&|()=\s]+$/.test(jsExpr)) {
      return false;
    }

    // eslint-disable-next-line no-eval
    return Boolean(Function(`"use strict"; return (${jsExpr})`)());
  } catch {
    return false;
  }
}

/**
 * Standard Presets
 */
export function getPresetCollection(preset: PresetCollectionType): SetElement[] {
  switch (preset) {
    case "primes_evens_multiples": {
      const elements: SetElement[] = [];
      const primes = new Set([2, 3, 5, 7, 11, 13]);

      for (let x = 1; x <= 15; x++) {
        elements.push({
          id: `elem-${x}`,
          value: x.toString(),
          inA: primes.has(x),
          inB: x % 2 === 0,
          inC: x % 3 === 0,
        });
      }
      return elements;
    }

    case "student_activities": {
      const students = [
        { name: "Alice", inA: true, inB: true, inC: false },
        { name: "Bob", inA: true, inB: false, inC: true },
        { name: "Charlie", inA: false, inB: true, inC: true },
        { name: "David", inA: true, inB: true, inC: true },
        { name: "Emma", inA: true, inB: false, inC: false },
        { name: "Frank", inA: false, inB: true, inC: false },
        { name: "Grace", inA: false, inB: false, inC: true },
        { name: "Hannah", inA: false, inB: false, inC: false },
      ];

      return students.map((s) => ({
        id: `student-${s.name}`,
        value: s.name,
        inA: s.inA,
        inB: s.inB,
        inC: s.inC,
      }));
    }

    case "vowels_letters": {
      const letters = ["A", "B", "C", "D", "E", "I", "O", "U", "X", "Y", "Z"];
      const vowels = new Set(["A", "E", "I", "O", "U"]);
      const inWord1 = new Set(["A", "B", "C", "E", "X"]);
      const inWord2 = new Set(["E", "I", "O", "X", "Y", "Z"]);

      return letters.map((l) => ({
        id: `elem-${l}`,
        value: l,
        inA: vowels.has(l),
        inB: inWord1.has(l),
        inC: inWord2.has(l),
      }));
    }

    case "geometric_shapes": {
      const shapes = [
        { label: "🔴 Red Circle", inA: true, inB: false, inC: true },
        { label: "🔵 Blue Square", inA: false, inB: true, inC: false },
        { label: "🔺 Red Triangle", inA: true, inB: false, inC: false },
        { label: "🔷 Blue Polygon", inA: false, inB: true, inC: true },
        { label: "⭐ Star", inA: false, inB: false, inC: true },
        { label: "💎 Red Diamond", inA: true, inB: true, inC: false },
        { label: "🟢 Green Dot", inA: false, inB: false, inC: false },
      ];

      return shapes.map((s, idx) => ({
        id: `shape-${idx}`,
        value: s.label,
        inA: s.inA,
        inB: s.inB,
        inC: s.inC,
      }));
    }

    case "integers_1_to_10":
    default: {
      const elements: SetElement[] = [];
      for (let i = 1; i <= 10; i++) {
        elements.push({
          id: `int-${i}`,
          value: i.toString(),
          inA: i <= 6,
          inB: i % 2 === 0,
          inC: i >= 5,
        });
      }
      return elements;
    }
  }
}

/**
 * Classify function mapping
 */
export function classifyFunctionMapping(
  domain: string[],
  codomain: string[],
  mappings: RelationMapping[]
): FunctionClassification {
  const functionViolations: string[] = [];
  const injectiveViolations: string[] = [];
  const surjectiveMissing: string[] = [];

  const fromCounts: Record<string, number> = {};
  domain.forEach((x) => (fromCounts[x] = 0));
  mappings.forEach((m) => {
    fromCounts[m.from] = (fromCounts[m.from] || 0) + 1;
  });

  let isFunction = true;
  domain.forEach((x) => {
    if (fromCounts[x] === 0) {
      isFunction = false;
      functionViolations.push(`Element "${x}" in domain has no output mapping.`);
    } else if (fromCounts[x] > 1) {
      isFunction = false;
      functionViolations.push(`Element "${x}" maps to ${fromCounts[x]} different outputs.`);
    }
  });

  const toCounts: Record<string, string[]> = {};
  codomain.forEach((y) => (toCounts[y] = []));
  mappings.forEach((m) => {
    if (!toCounts[m.to]) toCounts[m.to] = [];
    toCounts[m.to].push(m.from);
  });

  let isInjective = isFunction;
  codomain.forEach((y) => {
    if (toCounts[y].length > 1) {
      isInjective = false;
      injectiveViolations.push(`Target "${y}" is mapped by multiple inputs: [${toCounts[y].join(", ")}]`);
    }
  });

  let isSurjective = isFunction;
  codomain.forEach((y) => {
    if (!toCounts[y] || toCounts[y].length === 0) {
      isSurjective = false;
      surjectiveMissing.push(y);
    }
  });

  const isBijective = isFunction && isInjective && isSurjective;

  return {
    isFunction,
    isInjective,
    isSurjective,
    isBijective,
    functionViolations,
    injectiveViolations,
    surjectiveMissing,
  };
}

/**
 * Test Equivalence Relation Properties on a single set X (X = Domain = Codomain)
 */
export function checkEquivalenceRelation(
  set: string[],
  mappings: RelationMapping[]
): EquivalenceRelationProperties {
  const pairSet = new Set(mappings.map((m) => `${m.from}->${m.to}`));

  // 1. Reflexive: for all x in X, (x, x) in R
  const reflexiveMissing: string[] = [];
  set.forEach((x) => {
    if (!pairSet.has(`${x}->${x}`)) {
      reflexiveMissing.push(`(${x}, ${x})`);
    }
  });
  const isReflexive = reflexiveMissing.length === 0;

  // 2. Symmetric: for all (x, y) in R, (y, x) must be in R
  const symmetricViolations: string[] = [];
  mappings.forEach((m) => {
    if (!pairSet.has(`${m.to}->${m.from}`)) {
      symmetricViolations.push(`(${m.from}, ${m.to}) has no symmetric pair (${m.to}, ${m.from})`);
    }
  });
  const isSymmetric = symmetricViolations.length === 0;

  // 3. Transitive: (x, y) in R and (y, z) in R ==> (x, z) in R
  const transitiveViolations: string[] = [];
  for (const m1 of mappings) {
    for (const m2 of mappings) {
      if (m1.to === m2.from) {
        if (!pairSet.has(`${m1.from}->${m2.to}`)) {
          transitiveViolations.push(
            `(${m1.from}, ${m1.to}) & (${m2.from}, ${m2.to}) exist, but transitive pair (${m1.from}, ${m2.to}) is missing.`
          );
        }
      }
    }
  }
  const isTransitive = transitiveViolations.length === 0;

  return {
    isReflexive,
    isSymmetric,
    isTransitive,
    isEquivalenceRelation: isReflexive && isSymmetric && isTransitive,
    reflexiveMissing,
    symmetricViolations,
    transitiveViolations,
  };
}

/**
 * Dynamically evaluate arbitrary Boolean proposition (e.g. "(p and q) or not r")
 */
export function evaluateCustomProposition(
  rawExpr: string,
  variables = ["p", "q"]
): DynamicTruthTable {
  const cleanVars = Array.from(new Set(variables));
  const numRows = Math.pow(2, cleanVars.length);
  const rows: DynamicTruthTable["rows"] = [];

  const headers = [...cleanVars, "Result"];

  for (let i = 0; i < numRows; i++) {
    const inputs: Record<string, boolean> = {};
    for (let v = 0; v < cleanVars.length; v++) {
      const bit = (i >> (cleanVars.length - 1 - v)) & 1;
      inputs[cleanVars[v]] = bit === 0; // standard true first order
    }

    let expr = rawExpr.toLowerCase();
    expr = expr
      .replace(/∧|and|&&/g, " && ")
      .replace(/∨|or|\|\|/g, " || ")
      .replace(/¬|not|~/g, " ! ")
      .replace(/⊕|xor/g, " !== ")
      .replace(/→|implies/g, " <= ") // p -> q === !p || q === p <= q in bool
      .replace(/↔|iff/g, " === ");

    cleanVars.forEach((v) => {
      const re = new RegExp(`\\b${v}\\b`, "g");
      expr = expr.replace(re, inputs[v] ? "true" : "false");
    });

    let finalResult = false;
    try {
      // eslint-disable-next-line no-eval
      finalResult = Boolean(Function(`"use strict"; return (${expr})`)());
    } catch {
      finalResult = false;
    }

    rows.push({
      inputs,
      intermediates: {},
      finalResult,
    });
  }

  const isTautology = rows.every((r) => r.finalResult);
  const isContradiction = rows.every((r) => !r.finalResult);

  return {
    headers,
    variables: cleanVars,
    rows,
    isTautology,
    isContradiction,
  };
}
