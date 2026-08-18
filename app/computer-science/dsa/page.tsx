import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Binary, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Structures & Algorithms Visualizer | OpenLabs",
  description: "Interactive DSA visualizers for sorting algorithms, stacks, queues, linked lists, and graph algorithms — step through memory states and Big-O asymptotic growth in real time.",
  keywords: [
    "data structures and algorithms",
    "dsa visualizer",
    "sorting visualizer interactive",
    "stack queue simulator",
    "linked list visualizer",
    "graph algorithms visualizer",
    "dijkstra shortest path online",
    "big o notation complexity",
    "cbse dsa class 12",
    "ap computer science a data structures"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/dsa",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/dsa/sorting",
    title: "Sorting Algorithms Studio",
    desc: "Compare Bubble, Selection, Insertion, Merge, Quick, and Heap sorts with live comparison and swap telemetry.",
    tag: "Algorithms",
    formula: "O(N log N) / O(N²)",
    difficulty: "Beginner",
    duration: "15 min",
  },
  {
    href: "/computer-science/dsa/stack",
    title: "Stack (LIFO) Visualizer",
    desc: "Simulate Push, Pop, Peek, and overflow/underflow checks on a dynamic Last-In First-Out linear stack.",
    tag: "Linear",
    formula: "Top Pointer, O(1) Operations",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/dsa/queue",
    title: "Queue (FIFO) Visualizer",
    desc: "Explore Enqueue and Dequeue operations on linear and circular queues with Front and Rear pointer tracking.",
    tag: "Linear",
    formula: "Front & Rear, O(1) Amortized",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/dsa/linked-list",
    title: "Linked List Studio",
    desc: "Trace Singly, Doubly, and Circular Linked Lists with interactive node insertions, deletions, and pointer reversals.",
    tag: "Linear",
    formula: "Node(Data, Next, Prev)",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/dsa/graph-algorithms",
    title: "Graph Algorithms & Shortest Path",
    desc: "Visualize Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra shortest path, and Prim/Kruskal MST.",
    tag: "Non-Linear",
    formula: "G = (V, E), O(V + E log V)",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Data Structure or Algorithm",
    desc: "Choose from sorting algorithms, linear structures (stack, queue, linked list), or non-linear graph traversals.",
  },
  {
    step: 2,
    title: "Supply Custom Input or Generate Random Data",
    desc: "Enter custom integer arrays, linked list sequences, or weighted graph matrices, or choose preset edge cases.",
  },
  {
    step: 3,
    title: "Step Through Execution at Custom Speed",
    desc: "Use play, pause, step forward, and step backward controls to observe pointer updates, swaps, and call stacks.",
  },
  {
    step: 4,
    title: "Analyze Real-Time Asymptotic Complexity",
    desc: "Inspect active comparison counts, array access operations, memory allocations, and theoretical Big-O curves.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Asymptotic Complexity",
    laws: "Master Theorem & Big-O Upper Bound",
    formulas: "T(n) = aT(n/b) + f(n), f(n) ∈ O(g(n))",
    solver: "Runtime Step & Memory Profiling Tracer",
  },
  {
    domain: "Comparison Sorting Bounds",
    laws: "Information-Theoretic Decision Tree Lower Bound",
    formulas: "Depth ≥ log₂(N!) = Ω(N log N)",
    solver: "State Machine Array Mutation Engine",
  },
  {
    domain: "Pointer Invariants",
    laws: "Dynamic Memory Allocation & Node Link Integrity",
    formulas: "Node.next = Node.next.next, Top = Top ± 1",
    solver: "Direct Pointer Reference Graph Engine",
  },
  {
    domain: "Greedy Graph Optimization",
    laws: "Dijkstra Non-Negative Edge Relaxation",
    formulas: "dist[v] = min(dist[v], dist[u] + w(u, v))",
    solver: "Indexed Binary Min-Heap Priority Queue",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Bidirectional step debugging",
    desc: "Step backwards and forwards through algorithms to understand subtle pointer swaps and recursion trees.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Live comparison & swap counters",
    desc: "Track exact comparison counts and array access metrics compared against theoretical Big-O upper bounds.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned DSA",
    desc: "Directly aligned with CBSE CS Class 12, AP Computer Science A, and university CS101/CS102 syllabi.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Data Structures & Algorithms Educational Standards",
  description:
    "Our interactive DSA laboratory adheres to CBSE Computer Science Class 12 (Data Structures with Python), AP Computer Science A (Arrays, ArrayLists, Searching & Sorting), and ABET accredited undergraduate computing curricula.",
  secondaryText:
    "Visualizing memory pointer updates and recursive call stacks replaces abstract whiteboard lectures with immediate tactile intuition.",
  telemetryTitle: "Algorithmic Telemetry",
  telemetryDesc: "Inspect comparisons, swaps, heap memory pointers, and recursion stack depth in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "Why is Merge Sort O(N log N) while Quick Sort can be O(N²)?",
    a: "Merge Sort guarantees a balanced divide-and-conquer split regardless of input order, maintaining O(N log N) worst-case time. Quick Sort's performance depends on pivot choice; poor pivots (e.g. sorted array with first element pivot) result in unbalanced partitions and O(N²) quadratic time.",
  },
  {
    q: "Can I input custom arrays and graphs to test edge cases?",
    a: "Yes. All DSA modules allow custom numeric array inputs (including reverse sorted, duplicates, and negative values) and custom graph node adjacency matrices.",
  },
  {
    q: "How does the visualizer demonstrate call stack recursion?",
    a: "Recursive algorithms (Quick Sort, Merge Sort, DFS) render an active call stack pane showing local variables, recursion frame depth, and return unwinding.",
  },
  {
    q: "Are the OpenLabs DSA visualizers free for coding interview practice?",
    a: "Yes. All algorithm visualizers and data structure sandboxes are 100% free and open for educational and interview preparation use.",
  },
];

export default function DSASubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Data Structures & Algorithms"
      subtopicSubtitle="Explore step-by-step visualizers for sorting algorithms, stacks, queues, linked lists, and graph pathfinding with real-time Big-O analysis."
      badgeText="DSA Exploration Studio"
      badgeIcon={Binary}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Step Through Data Structures & Algorithms Online"
      howToSteps={howToSteps}
      principlesHeading="Asymptotic Complexity & Data Structure Invariants"
      principlesDesc="Information-theoretic limits and pointer state machines evaluated in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/dsa"
    />
  );
}
