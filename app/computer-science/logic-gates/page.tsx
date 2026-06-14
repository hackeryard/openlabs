import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logic Gates - Interactive Digital Circuits Lab | OpenLabs",
  description: "Explore logic gates including AND, OR, NOT, NAND, NOR, XOR, XNOR through interactive truth tables and circuit visualization.",
  keywords: [
    "logic gates",
    "digital circuits",
    "truth tables",
    "and gate",
    "or gate",
    "not gate",
    "circuit simulation",
    "computer architecture"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/logic-gates",
  },
  openGraph: {
    title: "Logic Gates - Interactive Digital Circuits Lab | OpenLabs",
    description: "Explore logic gates including AND, OR, NOT, NAND, NOR, XOR, XNOR through interactive truth tables and circuit visualization.",
    url: "https://www.openlabs.org.in/computer-science/logic-gates",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/computer-science/logic-gates-hero.png",
      alt: "Logic Gates Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Logic Gates - Interactive Digital Circuits Lab | OpenLabs",
    description: "Explore logic gates including AND, OR, NOT, NAND, NOR, XOR, XNOR through interactive truth tables and circuit visualization.",
    images: ["https://www.openlabs.org.in/images/computer-science/logic-gates-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* client-only grid handles animations */

const cards = [
  { href: "/computer-science/logic-gates/and-gate", title: "AND Gate", desc: "Interactive lab for visualising working of AND Gate." },
  { href: "/computer-science/logic-gates/or-gate", title: "OR Gate", desc: "Interactive lab for visualising working of OR Gate." },
  { href: "/computer-science/logic-gates/not-gate", title: "NOT Gate", desc: "Interactive lab for visualising working of NOT Gate." },
  { href: "/computer-science/logic-gates/nand-gate", title: "NAND Gate", desc: "Interactive lab for visualising working of NAND Gate." },
  { href: "/computer-science/logic-gates/nor-gate", title: "NOR Gate", desc: "Interactive lab for visualising working of NOR Gate." },
  { href: "/computer-science/logic-gates/xor-gate", title: "XOR Gate", desc: "Interactive lab for visualising working of XOR Gate." },
  { href: "/computer-science/logic-gates/xnor-gate", title: "XNOR Gate", desc: "Interactive lab for visualising working of XNOR Gate." },
];

export default function LogicGates() {
  return <ClientGrid title="Logic Gates Visualisation" description="Explore digital logic fundamentals." cards={cards} />;
}