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
    <ClientGrid
      title="AI Problems & Solutions"
      description="Explore artificial intelligence problems with interactive visualizers."
      intro="These labs walk through classic artificial intelligence problems that show up in almost every AI course, each one a small, self-contained puzzle for a specific technique. Watch hill climbing search for a local maximum step by step, see Q-learning navigate a maze through trial and reward, work through the water jug and monkey-banana problems as examples of state-space search, apply forward and backward chaining to logical inference, and test constraint satisfaction on problems where every variable has to agree with its neighbors. Each one pairs the algorithm with a visual you can watch update as it runs."
      cards={cards}
    />
  );
}