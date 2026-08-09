// app/lib/knowledge/formulas/index.ts
import { FormulaEntity } from "../../types/knowledge";
import { KINEMATICS_FORMULAS } from "./kinematics";

export * from "./kinematics";

export const ALL_FORMULAS: FormulaEntity[] = [
  ...KINEMATICS_FORMULAS,
];

export const FORMULAS_BY_ID = new Map<string, FormulaEntity>(
  ALL_FORMULAS.map((f) => [f.id, f])
);
