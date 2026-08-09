// app/lib/knowledge/paths/physics.ts
import { LearningPath } from "../../types/knowledge";

export const PHYSICS_LEARNING_PATHS: LearningPath[] = [
  {
    id: "kinematics-fundamentals",
    title: "Kinematics & Motion Mastery Path",
    subject: "physics",
    description: "Master 1D motion, free fall acceleration, and 2D parabolic trajectories step-by-step.",
    difficulty: "beginner",
    steps: [
      {
        order: 1,
        conceptId: "uniformmotionlab",
        labId: "physics/uniformmotionlab",
        summary: "Understand constant velocity and distance-time relations.",
      },
      {
        order: 2,
        conceptId: "freefall",
        labId: "physics/freefall",
        summary: "Analyze acceleration due to gravity without air resistance.",
      },
      {
        order: 3,
        conceptId: "projectilemotion",
        labId: "physics/projectilemotion",
        summary: "Combine horizontal velocity and vertical free fall to analyze parabolic trajectories.",
      },
    ],
  },
];
