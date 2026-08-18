import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { ArrowDownUp, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer & Complexity Comparator | OpenLabs",
  description: "Step-by-step interactive visualizer for Merge Sort, Quick Sort, Bubble Sort, Heap Sort, Insertion Sort, and Selection Sort with comparison and swap metrics.",
  keywords: [
    "sorting algorithm visualizer",
    "merge sort visualizer interactive",
    "quick sort simulation",
    "heap sort tree visualizer",
    "bubble sort step by step",
    "insertion sort animation",
    "selection sort complexity",
    "comparison sort time complexity"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/dsa/sorting",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/dsa/sorting/merge-sort",
    title: "Merge Sort Visualizer",
    desc: "Divide-and-conquer algorithm that recursively splits arrays into singletons and merges sorted runs in O(N log N) time.",
    tag: "Divide & Conquer",
    formula: "O(N log N) Time, O(N) Space (Stable)",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/dsa/sorting/quick-sort",
    title: "Quick Sort Visualizer",
    desc: "In-place partitioning around a chosen pivot element (Lomuto / Hoare schemes) with recursive subarray partitioning.",
    tag: "Divide & Conquer",
    formula: "Avg O(N log N), Worst O(N²)",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/dsa/sorting/heap-sort",
    title: "Heap Sort Visualizer",
    desc: "Constructs a binary Max-Heap from the unsorted array and repeatedly extracts the root maximum element.",
    tag: "Tree Based",
    formula: "O(N log N) Time, O(1) Space (In-Place)",
    difficulty: "Advanced",
    duration: "15 min",
  },
  {
    href: "/computer-science/dsa/sorting/insertion-sort",
    title: "Insertion Sort Visualizer",
    desc: "Builds the final sorted array one item at a time by shifting elements into their proper position in the sorted prefix.",
    tag: "Elementary",
    formula: "Best O(N), Worst O(N²) (Adaptive & Stable)",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/computer-science/dsa/sorting/selection-sort",
    title: "Selection Sort Visualizer",
    desc: "Repeatedly finds the minimum element from the unsorted sublist and swaps it to the front of the array.",
    tag: "Elementary",
    formula: "O(N²) Comparisons, O(N) Swaps",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/computer-science/dsa/sorting/bubble-sort",
    title: "Bubble Sort Visualizer",
    desc: "Simple comparison algorithm that steps through the list, compares adjacent elements, and swaps them if in the wrong order.",
    tag: "Elementary",
    formula: "O(N²) Time, O(1) Space (Stable)",
    difficulty: "Beginner",
    duration: "8 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Sorting Algorithm & Array Size",
    desc: "Choose between elementary O(N²) algorithms or efficient O(N log N) divide-and-conquer sorts.",
  },
  {
    step: 2,
    title: "Configure Input Distribution",
    desc: "Select random integers, nearly sorted arrays, reversed sequences, or arrays containing identical duplicates.",
  },
  {
    step: 3,
    title: "Step Through Recursive Swaps & Partitions",
    desc: "Observe active comparison pointers, pivot indices, and subarray partitions highlighted in real time.",
  },
  {
    step: 4,
    title: "Compare Empirical vs. Asymptotic Bounds",
    desc: "Track the exact number of comparisons, memory allocations, and array writes against Big-O expectations.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Divide & Conquer Sorting",
    laws: "Master Theorem & Subproblem Recurrence",
    formulas: "T(N) = 2T(N/2) + O(N) ⇒ T(N) = Θ(N log N)",
    solver: "Recursive Subarray Memory Splitting Engine",
  },
  {
    domain: "In-Place Partitioning",
    laws: "Hoare & Lomuto Partition Invariants",
    formulas: "A[low..p-1] ≤ pivot ≤ A[p+1..high]",
    solver: "Two-Pointer Swap State Machine",
  },
  {
    domain: "Binary Heap Sorting",
    laws: "Max-Heap Invariant & Sift-Down Heapify",
    formulas: "A[i] ≥ A[2i+1] and A[i] ≥ A[2i+2], Build-Heap = O(N)",
    solver: "Array-Backed Complete Binary Tree Engine",
  },
  {
    domain: "Sorting Lower Bounds",
    laws: "Decision Tree Information Theory Bound",
    formulas: "Leaves = N! ⇒ Depth ≥ log₂(N!) = Ω(N log N)",
    solver: "Comparison Metric Counter & Logger",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Interactive step-by-step playback",
    desc: "Step forward and backward through individual array comparisons and swaps at your own pace.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Live comparison & swap telemetry",
    desc: "Track exact comparison and array write counts in real time alongside Big-O theoretical curves.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum & interview standards",
    desc: "Conforms to AP Computer Science A, CBSE CS Class 12, and technical coding interview benchmarks.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Sorting Algorithms Academic Standards",
  description:
    "Our sorting visualizers cover all algorithms specified in CBSE Computer Science Class 12, AP Computer Science A (Unit 7: Searching and Sorting), and undergraduate CS algorithms courses.",
  secondaryText:
    "Interactive color-coded array bars make stability, adaptiveness, and space complexities immediately intuitive.",
  telemetryTitle: "Operation Telemetry",
  telemetryDesc: "Count comparisons, swaps, and recursive stack depths in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "What does algorithm 'stability' mean in sorting?",
    a: "A sorting algorithm is stable if it preserves the relative order of elements with equal keys in the output. Merge Sort, Insertion Sort, and Bubble Sort are stable; Quick Sort and Heap Sort are inherently unstable in their standard in-place forms.",
  },
  {
    q: "Why is Heap Sort O(N log N) in-place while Merge Sort requires O(N) extra space?",
    a: "Heap Sort encodes the binary tree directly inside the existing array indices (children at 2i+1 and 2i+2), requiring no auxiliary storage. Merge Sort merges two sorted halves into a separate auxiliary array to prevent overwriting unmerged elements.",
  },
  {
    q: "Which sorting algorithm is fastest for nearly sorted data?",
    a: "Insertion Sort runs in linear O(N) time on nearly sorted arrays with very low overhead, outperforming even Quick Sort and Merge Sort for this specific distribution.",
  },
  {
    q: "Are the OpenLabs sorting visualizers free for classroom demonstrations?",
    a: "Yes. All sorting simulations and comparisons are 100% free and open for educational use.",
  },
];

export default function SortingSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Sorting Algorithms"
      subtopicSubtitle="Watch Merge Sort, Quick Sort, Heap Sort, Bubble Sort, Insertion Sort, and Selection Sort rearrange arrays step by step with real-time operation counters."
      badgeText="Sorting Studio"
      badgeIcon={ArrowDownUp}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Step Through Sorting Algorithms Online"
      howToSteps={howToSteps}
      principlesHeading="Sorting Theorems & Complexity Bounds"
      principlesDesc="Decision tree theoretical limits and array mutation state machines evaluated in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/dsa/sorting"
    />
  );
}
