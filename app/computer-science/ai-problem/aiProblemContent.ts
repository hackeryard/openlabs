import type { Metadata } from "next";

export type AiVisualKind =
  | "constraint"
  | "forward-backward"
  | "hangman"
  | "hill-climb"
  | "maze-qlearn"
  | "monkey-banana"
  | "neural-network"
  | "water-jug";

export type AiProblemContent = {
  slug: string;
  name: string;
  shortName: string;
  visualKind: AiVisualKind;
  badge: string;
  pageTitle: string;
  metaDescription: string;
  heroDescription: string;
  definition: string;
  behavior: string;
  modelFocus: string;
  visualSteps: string[];
  learningObjectives: string[];
  useCases: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const aiProblemContent: Record<string, AiProblemContent> = {
  "constraint-satisfy": {
    slug: "constraint-satisfy",
    name: "Constraint Satisfaction Problem",
    shortName: "CSP",
    visualKind: "constraint",
    badge: "Variables, domains, and constraints",
    pageTitle: "Constraint Satisfaction Problem Visualizer | OpenLabs",
    metaDescription:
      "Learn constraint satisfaction problems with an interactive AI visualizer. Explore variables, domains, constraints, backtracking, and solution search.",
    heroDescription:
      "Explore how AI solves constraint satisfaction problems by assigning values to variables while respecting rules and pruning invalid choices.",
    definition:
      "A constraint satisfaction problem defines variables, possible values, and constraints that must all be satisfied by a valid solution.",
    behavior:
      "The search process assigns values, checks constraints, backtracks from conflicts, and continues until a complete consistent assignment is found.",
    modelFocus: "Backtracking search with constraint checking",
    visualSteps: ["Choose variable", "Test domain value", "Check constraints", "Backtrack or accept"],
    learningObjectives: [
      "Understand variables, domains, constraints, and assignments.",
      "Visualize backtracking when a partial assignment violates a rule.",
      "Learn how constraint propagation reduces the search space.",
      "Connect CSPs with scheduling, maps, puzzles, and planning tasks.",
    ],
    useCases: [
      "Timetable scheduling",
      "Map coloring",
      "Sudoku and logic puzzles",
      "Resource allocation",
    ],
    faqs: [
      {
        question: "What is a constraint satisfaction problem?",
        answer:
          "A CSP is an AI problem where values must be assigned to variables while satisfying a set of constraints.",
      },
      {
        question: "How does backtracking help in CSP?",
        answer:
          "Backtracking reverses a choice when it creates a conflict, then tries another value or variable.",
      },
      {
        question: "Where are CSPs used?",
        answer:
          "CSPs are used in scheduling, planning, map coloring, configuration, and many puzzle-solving systems.",
      },
    ],
  },
  "forward-backward": {
    slug: "forward-backward",
    name: "Forward and Backward Chaining",
    shortName: "Inference Chaining",
    visualKind: "forward-backward",
    badge: "Rule-based AI inference",
    pageTitle: "Forward and Backward Chaining Visualizer | OpenLabs",
    metaDescription:
      "Learn forward and backward chaining with an interactive AI inference visualizer. Explore facts, rules, goals, reasoning paths, and expert systems.",
    heroDescription:
      "Visualize rule-based reasoning as AI moves from facts to conclusions or works backward from a goal to required facts.",
    definition:
      "Forward and backward chaining are inference techniques used in rule-based AI systems to derive conclusions from facts and rules.",
    behavior:
      "Forward chaining starts with known facts and applies rules to infer new facts, while backward chaining starts with a goal and searches for rules that prove it.",
    modelFocus: "Facts, rules, goals, and inference paths",
    visualSteps: ["Load facts", "Match rule", "Infer conclusion", "Prove goal"],
    learningObjectives: [
      "Understand the difference between data-driven and goal-driven inference.",
      "Trace how rules fire from known facts.",
      "Visualize how a goal can be proven by searching backward.",
      "Connect chaining with expert systems and knowledge bases.",
    ],
    useCases: [
      "Expert systems",
      "Medical decision rules",
      "Troubleshooting systems",
      "Knowledge-base reasoning",
    ],
    faqs: [
      {
        question: "What is forward chaining?",
        answer:
          "Forward chaining starts from known facts and applies rules to infer new conclusions.",
      },
      {
        question: "What is backward chaining?",
        answer:
          "Backward chaining starts with a goal and works backward to find facts and rules that prove it.",
      },
      {
        question: "Where is chaining used in AI?",
        answer:
          "It is used in expert systems, rule engines, diagnosis tools, and knowledge-based reasoning systems.",
      },
    ],
  },
  hangman: {
    slug: "hangman",
    name: "Hangman AI Problem",
    shortName: "Hangman AI",
    visualKind: "hangman",
    badge: "Search and guessing strategy",
    pageTitle: "Hangman AI Problem Visualizer | OpenLabs",
    metaDescription:
      "Learn AI search and guessing strategy with an interactive Hangman problem visualizer. Explore word states, letters, constraints, and decision making.",
    heroDescription:
      "Study how an AI agent can reason about hidden words, update possible candidates, and choose letters based on available evidence.",
    definition:
      "The Hangman AI problem models guessing under uncertainty, where the agent chooses letters and updates beliefs from feedback.",
    behavior:
      "The agent tracks revealed letters, rejected guesses, candidate patterns, and likely next choices to reduce uncertainty.",
    modelFocus: "State space search and probabilistic guessing",
    visualSteps: ["Read pattern", "Filter words", "Choose letter", "Update state"],
    learningObjectives: [
      "Understand search under uncertainty using a familiar word game.",
      "Visualize how guesses reduce the candidate space.",
      "Learn the role of feedback in AI decision making.",
      "Connect word constraints with practical state filtering.",
    ],
    useCases: [
      "Game AI",
      "Pattern matching",
      "Language reasoning",
      "Search strategy practice",
    ],
    faqs: [
      {
        question: "How is Hangman an AI problem?",
        answer:
          "Hangman requires an agent to make decisions under uncertainty using feedback from previous guesses.",
      },
      {
        question: "What does the AI learn from each guess?",
        answer:
          "It learns which letters are present or absent and uses that feedback to narrow possible words.",
      },
      {
        question: "Which AI concepts appear in Hangman?",
        answer:
          "Hangman can demonstrate state space search, probability, constraints, and decision making.",
      },
    ],
  },
  "hill-climb": {
    slug: "hill-climb",
    name: "Hill Climbing Search",
    shortName: "Hill Climb",
    visualKind: "hill-climb",
    badge: "Local search optimization",
    pageTitle: "Hill Climbing Search Visualizer | OpenLabs",
    metaDescription:
      "Learn hill climbing search with an interactive AI visualizer. Explore local search, heuristic values, neighbors, maxima, plateaus, and optimization.",
    heroDescription:
      "Watch hill climbing move from one state to a better neighboring state until it reaches a peak or gets stuck in a local optimum.",
    definition:
      "Hill climbing is a local search algorithm that repeatedly chooses a neighboring state with a better heuristic value.",
    behavior:
      "The algorithm improves step by step, but it can get stuck at local maxima, ridges, or plateaus when no immediate neighbor looks better.",
    modelFocus: "Heuristic optimization over neighboring states",
    visualSteps: ["Start state", "Evaluate neighbors", "Move uphill", "Stop at peak"],
    learningObjectives: [
      "Understand local search and heuristic improvement.",
      "Visualize neighbors, current state, and better moves.",
      "Learn why local maxima and plateaus are limitations.",
      "Connect hill climbing with optimization and search problems.",
    ],
    useCases: [
      "Optimization problems",
      "Scheduling improvements",
      "Route refinement",
      "Heuristic AI search",
    ],
    faqs: [
      {
        question: "What is hill climbing in AI?",
        answer:
          "Hill climbing is a local search method that moves to a better neighboring state until no better move is available.",
      },
      {
        question: "What is a local maximum?",
        answer:
          "A local maximum is a state that is better than nearby states but may not be the best solution overall.",
      },
      {
        question: "What is the weakness of hill climbing?",
        answer:
          "It can get stuck in local maxima, ridges, or plateaus because it only looks at nearby improvements.",
      },
    ],
  },
  "maze-qlearn": {
    slug: "maze-qlearn",
    name: "Maze Q-Learning",
    shortName: "Q-Learning Maze",
    visualKind: "maze-qlearn",
    badge: "Reinforcement learning",
    pageTitle: "Maze Q-Learning Visualizer - Reinforcement Learning Lab | OpenLabs",
    metaDescription:
      "Learn Q-learning with an interactive maze visualizer. Explore states, actions, rewards, Q-values, exploration, exploitation, and paths.",
    heroDescription:
      "Explore reinforcement learning by watching an agent move through a maze, collect rewards, update Q-values, and learn better paths.",
    definition:
      "Q-learning is a reinforcement learning algorithm that learns action values from rewards without needing a model of the environment.",
    behavior:
      "The agent explores states, takes actions, receives rewards, updates Q-values, and gradually improves its path toward the goal.",
    modelFocus: "States, actions, rewards, and Q-value updates",
    visualSteps: ["Observe state", "Choose action", "Receive reward", "Update Q-value"],
    learningObjectives: [
      "Understand states, actions, rewards, and policies.",
      "Visualize how Q-values change through experience.",
      "Learn exploration versus exploitation in a maze.",
      "Connect reinforcement learning with path-finding behavior.",
    ],
    useCases: [
      "Robot navigation",
      "Game AI agents",
      "Path optimization",
      "Reinforcement learning practice",
    ],
    faqs: [
      {
        question: "What is Q-learning?",
        answer:
          "Q-learning is a reinforcement learning algorithm that learns the value of actions in states from rewards.",
      },
      {
        question: "What is the maze agent learning?",
        answer:
          "The agent learns which actions lead to better rewards and shorter paths to the goal.",
      },
      {
        question: "What are Q-values?",
        answer:
          "Q-values estimate how useful an action is in a given state for achieving future rewards.",
      },
    ],
  },
  "monkey-banana": {
    slug: "monkey-banana",
    name: "Monkey Banana Problem",
    shortName: "Monkey Banana",
    visualKind: "monkey-banana",
    badge: "Classical AI planning",
    pageTitle: "Monkey Banana Problem Visualizer - AI Planning Lab | OpenLabs",
    metaDescription:
      "Learn the Monkey Banana AI problem with an interactive planning visualizer. Explore states, actions, goals, operators, and classical planning.",
    heroDescription:
      "Visualize how an AI planner solves the classic monkey banana problem by sequencing actions to reach a goal state.",
    definition:
      "The monkey banana problem is a classical AI planning problem where an agent must use available actions to reach bananas.",
    behavior:
      "The planner reasons about states such as monkey position, box position, and goal reachability, then builds an action sequence.",
    modelFocus: "State-space planning and goal achievement",
    visualSteps: ["Define state", "Move to box", "Push box", "Climb and grab"],
    learningObjectives: [
      "Understand state-space planning with actions and goals.",
      "Visualize preconditions and effects of each action.",
      "Learn how action sequences solve planning problems.",
      "Connect classical AI examples with modern planning ideas.",
    ],
    useCases: [
      "AI planning education",
      "Robot task planning",
      "Goal-based agents",
      "State transition practice",
    ],
    faqs: [
      {
        question: "What is the monkey banana problem?",
        answer:
          "It is a classic AI planning problem where a monkey must perform actions such as moving, pushing a box, climbing, and grabbing bananas.",
      },
      {
        question: "What does this problem teach?",
        answer:
          "It teaches state representation, actions, preconditions, effects, and goal-driven planning.",
      },
      {
        question: "Why is it important in AI?",
        answer:
          "It is a simple example for understanding how agents plan sequences of actions to reach a goal.",
      },
    ],
  },
  "water-jug": {
    slug: "water-jug",
    name: "Water Jug Problem",
    shortName: "Water Jug",
    visualKind: "water-jug",
    badge: "State-space search",
    pageTitle: "Water Jug Problem Visualizer - AI Search Lab | OpenLabs",
    metaDescription:
      "Learn the Water Jug problem with an interactive AI search visualizer. Explore states, actions, goal tests, BFS/DFS style search, and solution paths.",
    heroDescription:
      "Solve the classic water jug problem by pouring, filling, and emptying jugs while tracing each state toward the target amount.",
    definition:
      "The water jug problem is a state-space search problem where an agent must measure a target amount using jugs of fixed capacities.",
    behavior:
      "The search explores states created by fill, empty, and pour actions until a state satisfies the target measurement goal.",
    modelFocus: "State transitions and goal search",
    visualSteps: ["Fill jug", "Pour between jugs", "Empty jug", "Test target"],
    learningObjectives: [
      "Understand state representation for classic AI search.",
      "Visualize fill, empty, and pour operations.",
      "Trace solution paths through state transitions.",
      "Connect water jug search with BFS, DFS, and goal testing.",
    ],
    useCases: [
      "AI search fundamentals",
      "State-space modeling",
      "Puzzle solving",
      "Planning and transition systems",
    ],
    faqs: [
      {
        question: "What is the water jug problem?",
        answer:
          "It is an AI search problem where fixed-size jugs are used to measure a target amount of water.",
      },
      {
        question: "Which actions are used in the water jug problem?",
        answer:
          "Common actions include filling a jug, emptying a jug, and pouring water from one jug to another.",
      },
      {
        question: "What AI concept does it teach?",
        answer:
          "It teaches state-space search, state transitions, action modeling, and goal testing.",
      },
    ],
  },
  "neural-network": {
    slug: "neural-network",
    name: "Multilayer Perceptron Neural Network",
    shortName: "Neural Network",
    visualKind: "neural-network",
    badge: "Deep learning & backpropagation",
    pageTitle: "Multilayer Perceptron Neural Network Visualizer | OpenLabs",
    metaDescription:
      "Train multilayer perceptron neural networks interactively. Explore forward propagation, backpropagation gradient descent, activation functions, and decision boundary convergence.",
    heroDescription:
      "Interactive neural network simulator: configure layers, train on non-linear datasets, adjust learning rates, and visualize real-time decision boundary convergence.",
    definition:
      "A Multilayer Perceptron (MLP) is a class of feedforward artificial neural network consisting of input, hidden, and output layers trained via gradient-descent backpropagation.",
    behavior:
      "Input signals propagate forward through weighted layers and non-linear activations; error losses are computed against targets, and backpropagated gradients update weights.",
    modelFocus: "Forward pass activations, loss gradients, and weight updates",
    visualSteps: [
      "Input feature vectors",
      "Hidden layer activations (ReLU/Sigmoid)",
      "Output prediction & loss calculation",
      "Backpropagation weight updates",
    ],
    learningObjectives: [
      "Understand artificial neuron mathematical models (weights, biases, activations).",
      "Trace forward propagation and non-linear activation functions.",
      "Visualize error backpropagation and gradient descent optimization.",
      "Explore non-linear decision boundary classification and convergence.",
    ],
    useCases: [
      "Binary and multi-class classification",
      "Pattern and digit recognition",
      "Function approximation and regression",
      "Non-linear decision boundary mapping",
    ],
    faqs: [
      {
        question: "What is a Multilayer Perceptron (MLP)?",
        answer:
          "An MLP is a deep feedforward artificial neural network composed of multiple layers of nodes, capable of learning non-linear relationships via supervised backpropagation.",
      },
      {
        question: "How does backpropagation work?",
        answer:
          "Backpropagation calculates the gradient of the loss function with respect to each weight using the chain rule of calculus, adjusting weights in the opposite direction of the gradient.",
      },
      {
        question: "Why are activation functions necessary?",
        answer:
          "Without non-linear activation functions like ReLU or Sigmoid, stacking multiple linear layers would collapse mathematically into a single linear transformation.",
      },
    ],
  },
};

export function createAiProblemMetadata(content: AiProblemContent): Metadata {
  const pageUrl = `https://www.openlabs.org.in/computer-science/ai-problem/${content.slug}`;

  return {
    title: content.pageTitle,
    description: content.metaDescription,
    keywords: [
      `${content.name} visualizer`,
      `${content.name} AI problem`,
      `${content.name} interactive lab`,
      `${content.shortName} simulator`,
      "AI problem visualizer",
      "artificial intelligence lab",
      "computer science AI problems",
      "OpenLabs AI lab",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: content.pageTitle,
      description: content.metaDescription,
      url: pageUrl,
      siteName: "OpenLabs",
      type: "website",
      images: [
        {
          url: "https://www.openlabs.org.in/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: `OpenLabs ${content.name} Visualizer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.pageTitle,
      description: content.metaDescription,
      images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    },
  };
}
