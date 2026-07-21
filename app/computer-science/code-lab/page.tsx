import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Lab - Interactive Code Visualization | OpenLabs",
  description: "Interactive code visualization lab for HTML, CSS, JavaScript, and web development with live preview and event loop simulation.",
  keywords: [
    "code lab",
    "code visualization",
    "web development",
    "html css javascript",
    "javascript debugger",
    "event loop",
    "interactive coding",
    "programming education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/code-lab",
  },
  openGraph: {
    title: "Code Lab - Interactive Code Visualization | OpenLabs",
    description: "Interactive code visualization lab for HTML, CSS, JavaScript, and web development with live preview and event loop simulation.",
    url: "https://www.openlabs.org.in/computer-science/code-lab",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/computer-science/code-lab-hero.png",
      alt: "Code Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Lab - Interactive Code Visualization | OpenLabs",
    description: "Interactive code visualization lab for HTML, CSS, JavaScript, and web development with live preview and event loop simulation.",
    images: ["https://www.openlabs.org.in/images/computer-science/code-lab-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* client-only grid handles animations */

const cards = [
  {
    href: "/computer-science/code-lab/html-css-js",
    title: "HTML | CSS | JS",
    desc: "Interactive lab for previewing the code written in HTML CSS and JS.",
  },
  {
    href: "/computer-science/code-lab/js",
    title: "JavaScript",
    desc: "Interactive lab for previewing the code written in JavaScript.",
  },
];

export default function CodeLab() {
  return (
    <ClientGrid
      title="Code Lab"
      description="Interactive code visualization labs."
      intro="Code Lab is a set of in-browser editors built for learning by watching code run, not just reading about it. Write HTML, CSS, and JavaScript with a live preview that updates as you type, or open the JavaScript visualizer to step through the event loop line by line — see the call stack, Web APIs, microtask queue, and macrotask queue update in real time as your code executes. Both labs run entirely in your browser, so there's nothing to install and nothing to configure."
      cards={cards}
    />
  );
}
