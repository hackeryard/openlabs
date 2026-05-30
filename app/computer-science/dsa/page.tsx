import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Structures & Algorithms Visualizer | OpenLabs",
  description: "Visualize sorting algorithms, trees, graphs, and basic data structures. See how code executes step-by-step in memory.",
  keywords: ["DSA visualizer", "data structures", "algorithms", "sorting algorithms", "computer science tool"],
};

const content: EducationalContent = {
  slug: "dsa",
  subject: "Computer-Science",
  title: "Data Structures & Algorithms",
  description: "Interactive visualization of sorting algorithms, trees, and graphs.",
  difficulty: "Intermediate",
  estimatedTime: "45 mins",
  heroDescription: "Demystify complex computer science concepts. Watch as arrays are sorted, trees are traversed, and graphs are searched step-by-step to understand the inner workings of algorithms.",
  theory: {
    content: `
      <p>Data Structures and Algorithms (DSA) form the bedrock of efficient software development. A data structure is a specialized format for organizing and storing data, while an algorithm is a step-by-step procedure for solving a problem or performing a computation.</p>
      <h3>Core Categories</h3>
      <ul>
        <li><strong>Linear Data Structures:</strong> Arrays, Linked Lists, Stacks, and Queues. Data is arranged sequentially.</li>
        <li><strong>Non-Linear Data Structures:</strong> Trees and Graphs. Data is connected in complex, hierarchical networks.</li>
        <li><strong>Sorting Algorithms:</strong> Bubble, Merge, Quick, and Insertion sort. Techniques to arrange data in a specific order.</li>
        <li><strong>Search Algorithms:</strong> Linear and Binary search. Methods to find specific data within a structure.</li>
      </ul>
    `
  },
  learningObjectives: [
    "Understand how different data structures store and retrieve data in memory.",
    "Compare the time and space complexity of various sorting algorithms.",
    "Visualize recursive algorithms like Merge Sort and tree traversals.",
    "Identify the appropriate data structure for a given computational problem."
  ],
  mathematicalFoundations: {
    equations: [
      "O(1) \\rightarrow Constant Time",
      "O(\\log n) \\rightarrow Logarithmic Time (e.g. Binary Search)",
      "O(n) \\rightarrow Linear Time (e.g. Linear Search)",
      "O(n \\log n) \\rightarrow Linearithmic Time (e.g. Merge Sort)",
      "O(n^2) \\rightarrow Quadratic Time (e.g. Bubble Sort)"
    ],
    explanation: "Big O notation is used to describe the performance or complexity of an algorithm. It specifically describes the worst-case scenario, indicating how the runtime or space requirements grow as the input size (n) grows."
  },
  realWorldApplications: [
    "Databases: B-Trees are used to index data for fast retrieval.",
    "Navigation Apps: Dijkstra's Algorithm finds the shortest path on a map (Graph).",
    "Operating Systems: Queues manage process scheduling and print spooling.",
    "Compilers: Abstract Syntax Trees (ASTs) parse and evaluate source code."
  ],
  howItWorks: "The DSA Visualizer allows you to select a specific algorithm or data structure. You can input custom data sets or generate random ones. As you click 'Play', the simulation executes the algorithm step-by-step, highlighting the current variables, array indices, and pointers, while displaying the corresponding pseudo-code execution line-by-line.",
  faqs: [
    {
      question: "Why is Big O notation important?",
      answer: "Big O notation provides a standardized way to compare the efficiency of different algorithms independently of the hardware or programming language used. It helps developers choose the most scalable solution for large datasets."
    },
    {
      question: "What is the difference between a Stack and a Queue?",
      answer: "A Stack follows the Last-In-First-Out (LIFO) principle, much like a stack of plates. A Queue follows the First-In-First-Out (FIFO) principle, like a line of people waiting for a bus."
    },
    {
      question: "Which sorting algorithm is the best?",
      answer: "There is no single 'best' sorting algorithm; it depends on the context. Quick Sort is generally very fast for large, randomized datasets. Merge Sort guarantees O(n log n) time and is stable, making it good for linked lists. Insertion sort is very efficient for small or nearly sorted datasets."
    },
    {
      question: "What is a Graph in computer science?",
      answer: "A graph is a non-linear data structure consisting of nodes (vertices) connected by edges. They are used to represent networks, such as social connections, city roads, or computer networks."
    }
  ],
  relatedExperiments: [
    {
      title: "Code Lab",
      href: "/computer-science/code-lab",
      description: "Write and execute JavaScript, Python, or Java in the browser."
    },
    {
      title: "Logic Gates",
      href: "/computer-science/logic-gates",
      description: "Build digital circuits to understand computer hardware at the lowest level."
    }
  ]
};

export default function DSAPage() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/dsa" />;
}
