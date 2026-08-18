import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { BrainCircuit, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Search Problems & Machine Learning Visualizers | OpenLabs",
  description: "Explore interactive AI problem solvers including Q-Learning mazes, neural networks, constraint satisfaction, hill climbing, and state-space heuristics.",
  keywords: [
    "artificial intelligence problems",
    "q learning visualizer online",
    "neural network playground",
    "constraint satisfaction problem visualizer",
    "hill climbing algorithm simulation",
    "state space search ai",
    "forward backward chaining",
    "ai education interactive"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/ai-problem",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/ai-problem/neural-network",
    title: "Multilayer Perceptron Neural Network",
    desc: "Train deep feedforward networks with backpropagation, customize activation functions (ReLU, Sigmoid), and inspect decision boundaries.",
    tag: "Machine Learning",
    formula: "w ← w - η(∂L/∂w)",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/ai-problem/maze-qlearn",
    title: "Q-Learning Maze Reinforcement",
    desc: "Train an autonomous agent to solve grid mazes using Bellman equation updates, exploration vs. exploitation (ε-greedy), and rewards.",
    tag: "Reinforcement Learning",
    formula: "Q(s, a) ← Q + α[R + γ max Q' - Q]",
    difficulty: "Advanced",
    duration: "18 min",
  },
  {
    href: "/computer-science/ai-problem/hill-climb",
    title: "Hill Climbing Search & Optimization",
    desc: "Step through local heuristic gradient climbing; explore local maxima plateaus, ridge problems, and random-restart escapes.",
    tag: "State-Space Search",
    formula: "s* = argmax_{s' ∈ N(s)} f(s')",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/ai-problem/constraint-satisfy",
    title: "Constraint Satisfaction (CSP)",
    desc: "Solve N-Queens, map coloring, and Sudoku using Backtracking search with Forward Checking and AC-3 Arc Consistency.",
    tag: "Constraint Reasoning",
    formula: "CSP = ⟨X, D, C⟩",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/ai-problem/water-jug",
    title: "Water Jug State-Space Search",
    desc: "Find optimal transfer sequences between unmeasured jugs using Breadth-First and Depth-First state search trees.",
    tag: "State-Space Search",
    formula: "GCD(a, b) Divisibility Locus",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/ai-problem/forward-backward",
    title: "Forward & Backward Chaining Inference",
    desc: "Trace deductive expert system inference rules, modus ponens derivations, and goal-directed backward query resolution.",
    tag: "Knowledge & Logic",
    formula: "P ⇒ Q, P ⊢ Q",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/ai-problem/monkey-banana",
    title: "Monkey & Banana Planning Problem",
    desc: "Formulate STRIPS action operators (Push, Climb, Grasp) and step through automated Goal-Stack planning graphs.",
    tag: "Planning",
    formula: "STRIPS: ⟨Preconditions, Add, Delete⟩",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/ai-problem/hangman",
    title: "Probabilistic Hangman AI",
    desc: "Calculate Bayesian letter probability distributions across dictionary corpuses to make optimal informational guesses.",
    tag: "Probabilistic AI",
    formula: "P(Letter | Pattern, Excluded)",
    difficulty: "Beginner",
    duration: "8 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select AI Problem or Learning Model",
    desc: "Choose from neural network classification, reinforcement Q-learning, constraint satisfaction, or heuristic search puzzles.",
  },
  {
    step: 2,
    title: "Configure Hyperparameters & State Space",
    desc: "Adjust learning rates (η), discount factors (γ), epsilon exploration (ε), or initial puzzle starting configurations.",
  },
  {
    step: 3,
    title: "Run Real-Time Epochs & Search Steps",
    desc: "Watch agent exploration paths, loss curve convergence, backpropagation gradient vectors, or backtrack search trees update live.",
  },
  {
    step: 4,
    title: "Evaluate Performance & Export Models",
    desc: "Analyze reward convergence plots, classification confusion matrices, and optimal state action policy tables.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Reinforcement Learning",
    laws: "Bellman Optimality Equation & Temporal Difference",
    formulas: "Q*(s, a) = R(s, a) + γ Σ P(s'|s, a) max_{a'} Q*(s', a')",
    solver: "Tabular Q-Learning Temporal Difference Engine",
  },
  {
    domain: "Deep Neural Networks",
    laws: "Backpropagation via Multivariable Chain Rule",
    formulas: "∂L/∂w_{ij} = δ_j · a_i, δ_j = (∂L/∂z_j) · σ'(z_j)",
    solver: "Mini-Batch Stochastic Gradient Descent (SGD)",
  },
  {
    domain: "Constraint Satisfaction",
    laws: "Arc Consistency (AC-3) & Domain Pruning",
    formulas: "∀x ∈ D_i, ∃y ∈ D_j s.t. (x, y) satisfies C_{ij}",
    solver: "AC-3 Constraint Propagation & MRV Backtracker",
  },
  {
    domain: "State-Space Heuristics",
    laws: "Admissible & Consistent Heuristic Search (A*)",
    formulas: "f(n) = g(n) + h(n), h(n) ≤ h*(n)",
    solver: "Priority Queue State Tree Graph Expander",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Live hyperparameter tuning",
    desc: "Adjust learning rate, discount factor, and batch size to observe instant changes in model training stability.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Real-time loss & policy telemetry",
    desc: "Monitor convergence loss graphs, reward curves, and Q-table heatmaps dynamically.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned AI",
    desc: "Structured alongside university Artificial Intelligence (CS188 / CS221) and AP CS Principles.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Artificial Intelligence Educational Standards Alignment",
  description:
    "Our interactive AI problem suites cover fundamental topics in university CS Artificial Intelligence (Russell & Norvig curriculum), Machine Learning foundations, and heuristic optimization.",
  secondaryText:
    "Students build deep conceptual models for state spaces, Q-learning policies, and backpropagation gradients through direct visual experimentation.",
  telemetryTitle: "AI Telemetry",
  telemetryDesc: "Inspect training loss curves, Q-value heatmaps, and search tree expansions in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "How does Q-learning find the optimal path in the maze?",
    a: "The agent interacts with the maze environment through trial and error. By receiving rewards for reaching the goal and penalties for hitting walls, it uses the Bellman equation to update a Q-table that stores expected future rewards for every state-action pair.",
  },
  {
    q: "What is the difference between forward chaining and backward chaining?",
    a: "Forward chaining is data-driven: it starts with known facts and applies inference rules to extract new facts until a goal is reached. Backward chaining is goal-driven: it starts with the hypothesis and searches for supporting facts in reverse.",
  },
  {
    q: "How does constraint satisfaction (CSP) avoid exploring invalid states?",
    a: "CSP algorithms use Forward Checking and AC-3 Arc Consistency to prune invalid values from neighboring variables' domains before assigning them, cutting down exponential search spaces dramatically compared to naive brute-force.",
  },
  {
    q: "Are the OpenLabs AI simulations free for students?",
    a: "Yes. All AI search solvers, neural network playgrounds, and reinforcement learning mazes are 100% free and open for educational use.",
  },
];

export default function AIProblemSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="AI Problems & Machine Learning"
      subtopicSubtitle="Explore interactive visualizers for neural network training, Q-learning maze reinforcement, constraint satisfaction, and heuristic search."
      badgeText="Artificial Intelligence Studio"
      badgeIcon={BrainCircuit}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Solve Classical AI Problems Online"
      howToSteps={howToSteps}
      principlesHeading="AI Search Foundations & Machine Learning Solvers"
      principlesDesc="Bellman optimality, backpropagation gradient descent, and constraint propagation models evaluated in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/ai-problem"
    />
  );
}