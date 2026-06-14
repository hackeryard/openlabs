import React from "react";
import ClientGrid from "./ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer Science Virtual Labs & Interactive Tools | OpenLabs",
  description: "Explore interactive computer science experiments including code visualization, logic gates, networking, AI problems, blockchain, DSA, and version control.",
  keywords: [
    "computer science",
    "virtual labs",
    "code visualization",
    "logic gates",
    "networking simulation",
    "artificial intelligence",
    "blockchain",
    "data structures algorithms",
    "interactive programming",
    "education technology"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science",
  },
  openGraph: {
    title: "Computer Science Virtual Labs & Interactive Tools | OpenLabs",
    description: "Explore interactive computer science experiments including code visualization, logic gates, networking, AI problems, blockchain, DSA, and version control.",
    url: "https://www.openlabs.org.in/computer-science",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Computer Science Virtual Labs | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    title: "Computer Science Virtual Labs & Interactive Tools | OpenLabs",
    description: "Explore interactive computer science experiments including code visualization, logic gates, networking, AI problems, blockchain, DSA, and version control.",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const cards = [
  {
    href: "/computer-science/code-lab",
    title: "Code Lab",
    desc: "Interactive lab that help in visualizing the code you write.",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    href: "/computer-science/logic-gates",
    title: "Logic Gates",
    desc: "Interactive lab for visualising working of Logic Gates.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    href: "/computer-science/git-simulator",
    title: "Git Simulator",
    desc: "Interactive lab for visualising the git commands.",
    accent: "from-orange-500 to-amber-500",
  },
  {
    href: "/computer-science/dsa",
    title: "Data Structures & Algorithms",
    desc: "Interactive lab that help in visualizing the code you write.",
  },
  {
    href: "/computer-science/blockchain",
    title: "Blockchain",
    desc: "Interactive lab that help in visualizing the blockchain implementations.",
  },
  {
    href: "/computer-science/ai-problem",
    title: "Artificial-Intelligence",
    desc: "Interactive lab that help in visualizing the AI implementations.",
  },
   {
    href: "/computer-science/data-science",
    title: "Data-Science",
    desc: "Interactive lab that help in visualizing the data science implementations.",
  },
  {
    href: "/computer-science/data-analyzer",
    title: "Data Analyzing ",
    desc: "Interactive lab that help in visualizing the data-analysis implementations.",
  },
  {
    href: "/computer-science/networking",
    title: "Computer Networking Lab",
    desc: "Interactive lab that help in visualizing the working of computer networking.",
  },
];

export default function ComputerScience() {
  return (
    <ClientGrid
      title="Computer Science Experiments"
      description="Coding and Tech related experiments."
      cards={cards}
    />
  );
}