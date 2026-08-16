// app/lib/types/knowledge.ts

export type SubjectId = "physics" | "chemistry" | "biology" | "computerScience" | "mathematics";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type EducationalLevel = "middleSchool" | "highSchool" | "undergraduate";

export interface ConceptEntity {
  id: string;
  slug: string;
  title: string;
  subject: SubjectId;
  domain: string;
  topic: string;
  description: string;
  quickAnswer?: string;
  prerequisites: string[]; // Concept IDs
  nextTopics: string[];   // Concept IDs
  siblingTopics: string[];// Concept IDs
  relatedLabs: string[];  // Lab IDs
  relatedBlogs: string[]; // Blog slugs
  formulas?: string[];    // Formula IDs
  difficulty: DifficultyLevel;
  educationalLevel: EducationalLevel;
  tags: string[];
}

export interface FormulaEntity {
  id: string;
  title: string;
  expression: string;
  latex?: string;
  description: string;
  variables: Record<string, string>;
  relatedConcepts: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  subject: SubjectId;
  description: string;
  difficulty: DifficultyLevel;
  steps: {
    order: number;
    conceptId: string;
    labId?: string;
    summary: string;
  }[];
}
