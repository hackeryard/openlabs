// app/lib/constants/levels.ts
import { EducationalLevel } from "../types/knowledge";

export const EDUCATIONAL_LEVELS: Record<EducationalLevel, { label: string; description: string }> = {
  middleSchool: { label: "Middle School", description: "Foundational science & introductory logic concepts" },
  highSchool: { label: "High School (K-12)", description: "Standard high school STEM curriculum & interactive experiments" },
  undergraduate: { label: "Undergraduate / AP", description: "Advanced physics, higher chemistry, DSA, and networking algorithms" },
};
