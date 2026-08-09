// app/lib/knowledge/concepts/index.ts
import { ConceptEntity } from "../../types/knowledge";
import { PHYSICS_CONCEPTS } from "./physics";
import { CHEMISTRY_CONCEPTS } from "./chemistry";
import { BIOLOGY_CONCEPTS } from "./biology";
import { COMPUTER_SCIENCE_CONCEPTS } from "./computerScience";

export * from "./physics";
export * from "./chemistry";
export * from "./biology";
export * from "./computerScience";

export const ALL_CONCEPTS: ConceptEntity[] = [
  ...PHYSICS_CONCEPTS,
  ...CHEMISTRY_CONCEPTS,
  ...BIOLOGY_CONCEPTS,
  ...COMPUTER_SCIENCE_CONCEPTS,
];

export const CONCEPTS_BY_ID = new Map<string, ConceptEntity>(
  ALL_CONCEPTS.map((c) => [c.id, c])
);

export const CONCEPTS_BY_SLUG = new Map<string, ConceptEntity>(
  ALL_CONCEPTS.map((c) => [c.slug, c])
);
