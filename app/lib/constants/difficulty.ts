// app/lib/constants/difficulty.ts
import { DifficultyLevel } from "../types/knowledge";

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  intermediate: { label: "Intermediate", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  advanced: { label: "Advanced", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
};
