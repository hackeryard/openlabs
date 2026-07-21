import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Structures & Algorithms Visualizer | OpenLabs",
  description: "Interactive DSA visualizers for sorting algorithms, stacks, queues, and linked lists — watch each data structure operate step by step.",
  keywords: [
    "data structures and algorithms",
    "dsa visualizer",
    "sorting visualizer",
    "stack visualizer",
    "queue visualizer",
    "linked list visualizer",
    "algorithm visualization",
    "computer science education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/dsa",
  },
  openGraph: {
    title: "Data Structures & Algorithms Visualizer | OpenLabs",
    description: "Interactive DSA visualizers for sorting algorithms, stacks, queues, and linked lists — watch each data structure operate step by step.",
    url: "https://www.openlabs.org.in/computer-science/dsa",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Data Structures & Algorithms Visualizer | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    title: "Data Structures & Algorithms Visualizer | OpenLabs",
    description: "Interactive DSA visualizers for sorting algorithms, stacks, queues, and linked lists — watch each data structure operate step by step.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* client-only grid handles animations */

const cards = [
  {
    href: "/computer-science/dsa/sorting",
    title: "Sorting Visualizer",
    desc: "Interactive lab that help in visualizing the code you write.",
  },
  {
    href: "/computer-science/dsa/stack",
    title: "Stack Visualizer",
    desc: "Interactive lab that help in visualizing the stack data-structure.",
  },
  {
    href: "/computer-science/dsa/queue",
    title: "Queue Visualizer",
    desc: "Interactive lab that help in visualizing the queue data-structure.",
  },
  {
    href: "/computer-science/dsa/linked-list",
    title: "Linked-list Visualizer",
    desc: "Interactive lab that help in visualizing the linked-list data-structure.",
  },
];

export default function ComputerScience() {
  return (
    <ClientGrid
      title="Data Structures & Algorithms"
      description="Interactive DSA visualizers."
      intro="Data structures and algorithms are usually taught on a whiteboard, which makes it hard to see what's actually happening to the data at each step. These labs animate that process directly: watch six different sorting algorithms rearrange an array one comparison and swap at a time, push and pop elements off a stack, enqueue and dequeue from a queue, and insert or remove nodes from a linked list. Each visualizer runs at your own pace so you can pause on the step that doesn't make sense yet."
      cards={cards}
    />
  );
}
