// app/lib/knowledge/paths/index.ts
import { LearningPath } from "../../types/knowledge";
import { PHYSICS_LEARNING_PATHS } from "./physics";

export * from "./physics";

export const ALL_LEARNING_PATHS: LearningPath[] = [
  ...PHYSICS_LEARNING_PATHS,
];
