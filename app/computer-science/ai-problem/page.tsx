import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Problems & Solutions - Interactive Lab | OpenLabs",
  description: "Explore artificial intelligence problems including search algorithms, constraint satisfaction, neural networks, and reinforcement learning through interactive visualization.",
  keywords: [
    "artificial intelligence",
    "AI problems",
    "search algorithms",
    "constraint satisfaction",
    "neural networks",
    "reinforcement learning",
    "AI simulation",
    "machine learning education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/ai-problem",
  },
  openGraph: {
    title: "AI Problems & Solutions - Interactive Lab | OpenLabs",
    description: "Explore artificial intelligence problems including search algorithms, constraint satisfaction, neural networks, and reinforcement learning through interactive visualization.",
    url: "https://www.openlabs.org.in/computer-science/ai-problem",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/computer-science/ai-problem-hero.png",
      alt: "AI Problems Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Problems & Solutions - Interactive Lab | OpenLabs",
    description: "Explore artificial intelligence problems including search algorithms, constraint satisfaction, neural networks, and reinforcement learning through interactive visualization.",
    images: ["https://www.openlabs.org.in/images/computer-science/ai-problem-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};


const cards = [
  {
    href: "/computer-science/ai-problem/hangman",
    title: "Hangman",
    desc: "Interactive lab that help in visualizing Hangman problem",
  },
  {
    href: "/computer-science/ai-problem/monkey-banana",
    title: "Monkey-banana",
    desc: "Interactive lab that help in visualizing Monkey banana problem",
  },
   {
    href: "/computer-science/ai-problem/water-jug",
    title: "water-jug",
    desc: "Interactive lab that help in visualizing  water jug ",
  },
  {
    href: "/computer-science/ai-problem/forward-backward",
    title: "Forward-Backward",
    desc: "Interactive lab that help in visualizing forward-backward chaining",
  },
   {
    href: "/computer-science/ai-problem/maze-qlearn",
    title: "Maze-qLearn",
    desc: "Interactive lab that help in visualizing maze qlearn",
  },
  {
    href: "/computer-science/ai-problem/neural-network",
    title: "Neural-Network",
    desc: "Interactive lab that help in visualizing  neural block",
  },
  {
    href: "/computer-science/ai-problem/constraint-satisfy",
    title: "Constraint-satisfaction",
    desc: "Interactive lab that help in visualizing  constraint satisfaction",
  },
    { href: "/computer-science/ai-problem/hill-climb",
    title: "hill-climb",
    desc: "Interactive lab that help in visualizing hill climbing maxima",
  },
];

export default function Page() {
  return (
    <ClientGrid title="AI Problems & Solutions" description="Explore artificial intelligence problems with interactive visualizers." cards={cards} />
  );
}