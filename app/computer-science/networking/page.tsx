import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer Networking - Interactive Simulation Lab | OpenLabs",
  description: "Explore computer networking concepts including packet switching, circuit switching, OSI model, and network topology through interactive visualization.",
  keywords: [
    "computer networking",
    "network simulation",
    "packet switching",
    "circuit switching",
    "osi model",
    "network topology",
    "tcp ip",
    "networking education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/networking",
  },
  openGraph: {
    title: "Computer Networking - Interactive Simulation Lab | OpenLabs",
    description: "Explore computer networking concepts including packet switching, circuit switching, OSI model, and network topology through interactive visualization.",
    url: "https://www.openlabs.org.in/computer-science/networking",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/computer-science/networking-hero.png",
      alt: "Computer Networking Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Computer Networking - Interactive Simulation Lab | OpenLabs",
    description: "Explore computer networking concepts including packet switching, circuit switching, OSI model, and network topology through interactive visualization.",
    images: ["https://www.openlabs.org.in/images/computer-science/networking-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* client-only grid handles animations */

const cards = [
  { href: "/computer-science/networking/packet-switching", title: "Packet Switching", desc: "Interactive lab for visualising of data flow of  packet switching." },
  { href: "/computer-science/networking/circuit-switching", title: "Circuit Switching", desc: "Interactive lab for visualising of data flow of  circuit switching." },
  { href: "/computer-science/networking/topology-builder", title: "Topology Builder", desc: "Interactive lab for visualising of topologies." },
  { href: "/computer-science/networking/osi-model", title: "OSI Model", desc: "Interactive lab for visualising of working of OSI Model." },
];

export default function Page() {
  return (
    <ClientGrid
      title="Computer Networking Visualisation"
      description="Explore networking concepts with interactive simulators."
      intro="Networking concepts are easier to understand once you can watch data actually move. These labs simulate how information travels across a network: compare packet switching (data split into independently-routed packets) against circuit switching (a dedicated path reserved for the whole connection), build and rearrange network topologies to see how layout affects reliability, and step through the OSI model's seven layers to see which layer handles what as a message travels from one device to another."
      cards={cards}
    />
  );
}