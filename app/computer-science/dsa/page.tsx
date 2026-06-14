"use client";

import React from "react";
import ClientGrid from "../ClientGrid";

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
  return <ClientGrid title="Data Structures & Algorithms" description="Interactive DSA visualizers." cards={cards} />;
}
