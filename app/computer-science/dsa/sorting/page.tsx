import React from "react";
import ClientGrid from "../../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer | OpenLabs",
  description: "Watch merge sort, quick sort, bubble sort, heap sort, insertion sort, and selection sort run step by step with an interactive visualizer.",
  keywords: [
    "sorting visualizer",
    "sorting algorithm visualization",
    "merge sort visualizer",
    "quick sort visualizer",
    "bubble sort visualizer",
    "heap sort visualizer",
    "insertion sort visualizer",
    "selection sort visualizer"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/dsa/sorting",
  },
  openGraph: {
    title: "Sorting Algorithm Visualizer | OpenLabs",
    description: "Watch merge sort, quick sort, bubble sort, heap sort, insertion sort, and selection sort run step by step with an interactive visualizer.",
    url: "https://www.openlabs.org.in/computer-science/dsa/sorting",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Sorting Algorithm Visualizer | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    title: "Sorting Algorithm Visualizer | OpenLabs",
    description: "Watch merge sort, quick sort, bubble sort, heap sort, insertion sort, and selection sort run step by step with an interactive visualizer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* client-only grid handles animations */

const cards = [
  {
    href: "/computer-science/dsa/sorting/merge-sort",
    title: "Merge Sort",
    desc: "Watch divide-and-conquer recursion split, sort, and merge subarrays back together.",
  },
  {
    href: "/computer-science/dsa/sorting/quick-sort",
    title: "Quick Sort",
    desc: "See a pivot partition the array and recursion sort each side around it.",
  },
  {
    href: "/computer-science/dsa/sorting/bubble-sort",
    title: "Bubble Sort",
    desc: "Watch adjacent elements compare and swap until the largest values bubble to the end.",
  },
  {
    href: "/computer-science/dsa/sorting/heap-sort",
    title: "Heap Sort",
    desc: "See a binary heap built and repeatedly reduced to produce a sorted array.",
  },
  {
    href: "/computer-science/dsa/sorting/insertion-sort",
    title: "Insertion Sort",
    desc: "Watch each element get inserted into its correct position in the sorted portion.",
  },
  {
    href: "/computer-science/dsa/sorting/selection-sort",
    title: "Selection Sort",
    desc: "See the minimum element selected from the unsorted portion on each pass.",
  },
];

export default function SortingPage() {
  return (
    <ClientGrid
      title="Sorting Algorithm Visualizer"
      description="Interactive lab that helps in visualizing sorting algorithms."
      intro="Every sorting algorithm follows the same broad idea — rearrange elements until the array is ordered — but each one gets there differently, with different tradeoffs in speed and memory. These six visualizers step through that process one comparison, swap, or merge at a time, so you can see exactly why merge sort's divide-and-conquer approach guarantees O(n log n) time while bubble sort's simplicity costs it O(n²) in the worst case. Pick an algorithm below to run it against an array and watch the sort happen."
      cards={cards}
    />
  );
}
