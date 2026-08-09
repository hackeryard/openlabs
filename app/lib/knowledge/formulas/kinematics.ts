// app/lib/knowledge/formulas/kinematics.ts
import { FormulaEntity } from "../../types/knowledge";

export const KINEMATICS_FORMULAS: FormulaEntity[] = [
  {
    id: "freefall-velocity",
    title: "Free Fall Final Velocity",
    expression: "v = g * t",
    latex: "v = g \\cdot t",
    description: "Calculates instantaneous velocity of a falling object starting from rest.",
    variables: {
      v: "Final velocity (m/s)",
      g: "Acceleration due to gravity (9.81 m/s²)",
      t: "Time elapsed (s)",
    },
    relatedConcepts: ["freefall"],
  },
  {
    id: "projectile-range",
    title: "Horizontal Range of Projectile",
    expression: "R = (v₀² * sin(2θ)) / g",
    latex: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
    description: "Calculates total horizontal displacement of a projectile on level ground.",
    variables: {
      R: "Horizontal Range (m)",
      "v₀": "Initial velocity (m/s)",
      "θ": "Launch angle (degrees)",
      g: "Gravitational acceleration (9.81 m/s²)",
    },
    relatedConcepts: ["projectilemotion"],
  },
];
