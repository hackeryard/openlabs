import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Network, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Computer Networking Virtual Lab & Packet Routing Simulator",
  description: "Explore computer networking experiments including packet switching, circuit switching, OSI 7-layer stack, and network topology simulation.",
  keywords: [
    "computer networking lab",
    "packet switching simulator",
    "circuit switching vs packet switching",
    "osi model 7 layers interactive",
    "network topology builder",
    "router packet routing",
    "tcp ip simulation",
    "cbse computer science networking"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/networking",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/networking/packet-switching",
    title: "Packet Switching Simulation",
    desc: "Visualize packet segmentation, hop-by-hop forwarding, buffer queues, and dynamic reassembly at the destination.",
    tag: "Protocols",
    formula: "Delay = D_proc + D_queue + D_trans + D_prop",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/networking/circuit-switching",
    title: "Circuit Switching Simulation",
    desc: "Observe dedicated path reservation, call setup phases, constant bandwidth allocation, and line teardown.",
    tag: "Protocols",
    formula: "Total Time = T_setup + T_trans + T_teardown",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/networking/topology-builder",
    title: "Interactive Topology Builder",
    desc: "Wire Star, Mesh, Ring, Bus, and Tree topologies to evaluate single-point-of-failure fault tolerance.",
    tag: "Architecture",
    formula: "Mesh Links = N(N - 1) / 2",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/networking/osi-model",
    title: "OSI 7-Layer Stack Visualizer",
    desc: "Step through Physical, Data Link, Network, Transport, Session, Presentation, and Application protocol encapsulations.",
    tag: "Architecture",
    formula: "Data → Segment → Packet → Frame → Bits",
    difficulty: "Intermediate",
    duration: "15 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Choose Network Lab or Architecture",
    desc: "Select between packet vs. circuit switching, network topology design, or the OSI encapsulation model.",
  },
  {
    step: 2,
    title: "Configure Nodes, Links & Bandwidth",
    desc: "Add client devices, switches, and routers; configure transmission rates, link propagation delays, and packet sizes.",
  },
  {
    step: 3,
    title: "Transmit Packets & Monitor Queues",
    desc: "Send message payloads across nodes and observe hop-by-hop buffering, packet headers, and routing tables in real time.",
  },
  {
    step: 4,
    title: "Analyze Latency & Throughput Metrics",
    desc: "Record round-trip time (RTT), jitter, packet loss ratios, and bottleneck link utilizations.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Packet Transmission Delay",
    laws: "Transmission & Propagation Delay Model",
    formulas: "d_trans = L / R, d_prop = d / s, Total = d_proc + d_queue + d_trans + d_prop",
    solver: "Discrete-Event Network Queue Simulator",
  },
  {
    domain: "Network Topologies",
    laws: "Graph Connectivity & Fault Tolerance",
    formulas: "Full Mesh = N(N-1)/2, Tree Depth = ⌈log_b(N)⌉",
    solver: "Adjacency Matrix & Biconnected Component Finder",
  },
  {
    domain: "OSI Encapsulation",
    laws: "Protocol Data Unit (PDU) Header Wrapping",
    formulas: "PDU_n = Header_n + PDU_{n+1} + Trailer_n",
    solver: "Layered State Machine & Bitstream Serializer",
  },
  {
    domain: "Shortest Path Routing",
    laws: "Dijkstra Link-State & Bellman-Ford Distance Vector",
    formulas: "D_x(y) = min_v { c(x, v) + D_v(y) }",
    solver: "Dijkstra Priority Queue Path Optimizer",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Real-time packet flow visualization",
    desc: "Watch data packets physically travel across routers and buffers with adjustable time speeds.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Live latency & queue telemetry",
    desc: "Plot buffer fill levels, throughput graphs, and transmission delays on dynamic feeds.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned networking",
    desc: "Maps to CBSE CS Class 12 Unit 3, AP Computer Science Principles, and CCNA introductory networking.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Computer Networking Educational Standards Alignment",
  description:
    "Our interactive computer networking labs conform to CBSE Computer Science Class 12 (Computer Networks), AP Computer Science Principles (The Internet & Routing), and undergraduate CS networking foundations.",
  secondaryText:
    "Students gain hands-on intuition for packet header encapsulation, routing algorithms, and network reliability without configuring physical enterprise hardware.",
  telemetryTitle: "Packet Telemetry",
  telemetryDesc: "Inspect packet headers, TTL decrements, and routing table updates in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "What is the difference between packet switching and circuit switching?",
    a: "In circuit switching, a dedicated communication path is reserved between endpoints for the entire session. In packet switching, data is divided into independent packets that are routed dynamically over shared links, maximizing bandwidth efficiency.",
  },
  {
    q: "How does the OSI Model visualizer demonstrate protocol encapsulation?",
    a: "The visualizer displays how application data gets progressively wrapped with transport port headers, network IP addresses, data link MAC addresses, and physical bit signals as it travels down the transmitting stack.",
  },
  {
    q: "Can I simulate custom network topologies and broken links?",
    a: "Yes. In the Topology Builder, you can add nodes, connect links with custom bandwidths, and sever links to observe dynamic rerouting and fault recovery.",
  },
  {
    q: "Are OpenLabs computer networking simulations free?",
    a: "Yes. All networking modules, packet simulators, and topology tools are completely free for educational use.",
  },
];

export default function NetworkingSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Computer Networking"
      subtopicSubtitle="Explore packet switching, circuit switching, OSI 7-layer encapsulation, and interactive network topology design."
      badgeText="Networking Lab Suite"
      badgeIcon={Network}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Simulate Computer Networks Online"
      howToSteps={howToSteps}
      principlesHeading="Networking Principles & Mathematical Delay Models"
      principlesDesc="Standard queuing models and protocol data unit frameworks executed in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/networking"
    />
  );
}