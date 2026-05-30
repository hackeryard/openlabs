import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projectile Motion Experiment - Physics Simulation | OpenLabs",
  description: "Learn the physics behind projectile motion, launch angles, velocity, and gravity. Launch our interactive simulation to visualize and calculate trajectories.",
  keywords: ["projectile motion", "physics experiment", "kinematics simulation", "launch angle", "time of flight"],
};

const content: EducationalContent = {
  slug: "projectilemotion",
  subject: "Physics",
  title: "Projectile Motion",
  description: "Simulate trajectories and measure range & time-of-flight in our interactive physics lab.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore the fascinating world of kinematics. Understand how initial velocity, launch angle, and gravity dictate the path of a projectile through the air.",
  theory: {
    content: `
      <p>Projectile motion is a form of motion experienced by an object or particle (a projectile) that is projected in a gravitational field, such as from Earth's surface, and moves along a curved path under the action of gravity only.</p>
      <p>In the absence of air resistance, the path of a projectile is a parabola. The motion can be broken down into two independent one-dimensional motions: horizontal (constant velocity) and vertical (constant acceleration due to gravity).</p>
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Initial Velocity ($v_0$):</strong> The speed at which the object is launched.</li>
        <li><strong>Launch Angle ($\\theta$):</strong> The angle relative to the horizontal plane.</li>
        <li><strong>Gravity ($g$):</strong> The constant downward acceleration, approximately $9.81 m/s^2$ on Earth.</li>
      </ul>
    `
  },
  learningObjectives: [
    "Understand the independence of horizontal and vertical motion.",
    "Calculate the maximum height, range, and time of flight of a projectile.",
    "Analyze the effect of changing the launch angle on the projectile's trajectory.",
    "Recognize that a 45-degree angle yields the maximum range in a vacuum."
  ],
  mathematicalFoundations: {
    equations: [
      "x(t) = v_0 \\cdot \\cos(\\theta) \\cdot t",
      "y(t) = v_0 \\cdot \\sin(\\theta) \\cdot t - \\frac{1}{2}gt^2",
      "R = \\frac{v_0^2 \\cdot \\sin(2\\theta)}{g}",
      "H = \\frac{v_0^2 \\cdot \\sin^2(\\theta)}{2g}"
    ],
    explanation: "These kinematic equations describe the horizontal position (x), vertical position (y), maximum range (R), and maximum height (H) of a projectile launched from the ground."
  },
  realWorldApplications: [
    "Sports: Predicting the path of a basketball or golf ball.",
    "Aerospace: Calculating rocket trajectories during launch.",
    "Engineering: Designing water fountains or irrigation sprinklers.",
    "Forensics: Analyzing accident scenes to determine vehicle speeds."
  ],
  howItWorks: "In this interactive lab, you can adjust the initial velocity, launch angle, and mass of the projectile. As you launch the object, the simulation traces its parabolic path in real-time. You can pause the simulation, step forward in time, and use the built-in ruler and stopwatch to measure distances and times to verify the kinematic equations.",
  faqs: [
    {
      question: "What is projectile motion?",
      answer: "Projectile motion is the motion of an object thrown or projected into the air, subject to only the acceleration of gravity. The object is called a projectile, and its path is called its trajectory."
    },
    {
      question: "Why does the launch angle affect the range?",
      answer: "The launch angle determines the ratio of vertical to horizontal velocity. A higher angle keeps the projectile in the air longer, but a lower angle gives it more horizontal speed. An angle of 45 degrees optimally balances these two factors for maximum range (without air resistance)."
    },
    {
      question: "How does air resistance change the trajectory?",
      answer: "Air resistance provides a force opposite to the direction of motion, slowing the projectile down. This causes the trajectory to be non-parabolic, reducing both the maximum height and the maximum range."
    },
    {
      question: "Does the mass of the object affect projectile motion?",
      answer: "In a vacuum (no air resistance), all objects fall at the same rate regardless of mass. Therefore, mass does not affect the trajectory. However, when air resistance is present, heavier objects are less affected by it than lighter objects of the same size."
    }
  ],
  relatedExperiments: [
    {
      title: "Free Fall Lab",
      href: "/physics/freefall",
      description: "Explore 1D vertical motion under gravity."
    },
    {
      title: "Simple Pendulum",
      href: "/physics/simplependulum",
      description: "Analyze periodic motion and the effect of gravity on a pendulum."
    }
  ]
};

export default function ProjectileMotionPage() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/physics/projectilemotion" />;
}
