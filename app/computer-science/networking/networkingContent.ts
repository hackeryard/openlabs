import type { Metadata } from "next";

export type NetworkingVisual = "circuit" | "osi" | "packet" | "topology";

export type NetworkingContent = {
  slug: string;
  name: string;
  shortName: string;
  visual: NetworkingVisual;
  badge: string;
  pageTitle: string;
  metaDescription: string;
  heroDescription: string;
  definition: string;
  behavior: string;
  focus: string;
  visualSteps: string[];
  learningObjectives: string[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
};

export const networkingContent: Record<string, NetworkingContent> = {
  "circuit-switching": {
    slug: "circuit-switching",
    name: "Circuit Switching",
    shortName: "Circuit Switching",
    visual: "circuit",
    badge: "Dedicated communication path",
    pageTitle: "Circuit Switching Simulator - Computer Networking Lab | OpenLabs",
    metaDescription:
      "Learn circuit switching with an interactive networking simulator. Explore dedicated paths, setup phase, data transfer, teardown, latency, and bandwidth reservation.",
    heroDescription:
      "Visualize how circuit switching creates a dedicated end-to-end path before communication begins.",
    definition:
      "Circuit switching reserves a complete communication path between sender and receiver for the entire session.",
    behavior:
      "The network first establishes a circuit, sends data through the reserved path, and releases the circuit when the session ends.",
    focus: "Setup, reserved path, transfer, teardown",
    visualSteps: ["Request path", "Reserve links", "Transfer data", "Release circuit"],
    learningObjectives: [
      "Understand the setup, transfer, and teardown phases of circuit switching.",
      "Visualize why bandwidth is reserved even when no data is being sent.",
      "Compare circuit switching with packet switching.",
      "Connect circuit switching with telephone network concepts.",
    ],
    useCases: [
      "Traditional telephone networks",
      "Dedicated leased lines",
      "Predictable real-time communication",
      "Networking fundamentals",
    ],
    faqs: [
      {
        question: "What is circuit switching?",
        answer:
          "Circuit switching is a networking method where a dedicated path is reserved between sender and receiver for the whole communication session.",
      },
      {
        question: "Why does circuit switching need setup time?",
        answer:
          "Setup time is required because the network must reserve links and establish the path before data can flow.",
      },
      {
        question: "How is circuit switching different from packet switching?",
        answer:
          "Circuit switching reserves one path for the session, while packet switching divides data into packets that may take different routes.",
      },
    ],
  },
  "osi-model": {
    slug: "osi-model",
    name: "OSI Model",
    shortName: "OSI Model",
    visual: "osi",
    badge: "Seven-layer network architecture",
    pageTitle: "OSI Model Explorer - 7 Layers Networking Lab | OpenLabs",
    metaDescription:
      "Learn the OSI model with an interactive networking explorer. Understand the 7 layers, protocols, encapsulation, data flow, and network architecture.",
    heroDescription:
      "Explore the seven OSI layers and see how data moves from application logic down to physical transmission.",
    definition:
      "The OSI model is a seven-layer framework that explains how network communication is organized from applications to physical signals.",
    behavior:
      "Data is encapsulated as it travels down the sender layers, transmitted across the network, and decapsulated up the receiver layers.",
    focus: "Application to Physical layer flow",
    visualSteps: ["Application data", "Transport segment", "Network packet", "Physical bits"],
    learningObjectives: [
      "Learn the names and roles of all seven OSI layers.",
      "Understand encapsulation and decapsulation.",
      "Connect common protocols with their OSI layers.",
      "Trace how data travels through network architecture.",
    ],
    useCases: [
      "Network troubleshooting",
      "Protocol learning",
      "Cybersecurity fundamentals",
      "Computer networking exams",
    ],
    faqs: [
      {
        question: "What is the OSI model?",
        answer:
          "The OSI model is a seven-layer reference model used to understand how data moves through network systems.",
      },
      {
        question: "What are the 7 OSI layers?",
        answer:
          "The layers are Application, Presentation, Session, Transport, Network, Data Link, and Physical.",
      },
      {
        question: "Why is the OSI model important?",
        answer:
          "It helps learners and engineers separate networking responsibilities and troubleshoot problems layer by layer.",
      },
    ],
  },
  "packet-switching": {
    slug: "packet-switching",
    name: "Packet Switching",
    shortName: "Packet Switching",
    visual: "packet",
    badge: "Packets, routing, and network traffic",
    pageTitle: "Packet Switching Simulator - Routing and Packet Flow Lab | OpenLabs",
    metaDescription:
      "Learn packet switching with an interactive simulator. Explore packet flow, routing, queues, network traffic, data packets, and path selection.",
    heroDescription:
      "Watch data split into packets, move through routers, and reach the destination using dynamic network paths.",
    definition:
      "Packet switching divides data into smaller packets that are routed independently across a network.",
    behavior:
      "Each packet carries addressing information and can move through available routers before being reassembled at the destination.",
    focus: "Packet routing and traffic flow",
    visualSteps: ["Split message", "Route packets", "Queue traffic", "Reassemble data"],
    learningObjectives: [
      "Understand how messages are divided into packets.",
      "Visualize packet routing through network nodes.",
      "Learn why packets can take different paths.",
      "Compare packet switching with circuit switching.",
    ],
    useCases: [
      "Internet communication",
      "IP routing",
      "Network traffic analysis",
      "Distributed data networks",
    ],
    faqs: [
      {
        question: "What is packet switching?",
        answer:
          "Packet switching sends data as small packets that are routed independently through a network.",
      },
      {
        question: "Can packets take different routes?",
        answer:
          "Yes. Packets can take different routes depending on network conditions, routing decisions, and congestion.",
      },
      {
        question: "Why is packet switching used on the internet?",
        answer:
          "It uses network resources efficiently and supports flexible routing across large data networks.",
      },
    ],
  },
  "topology-builder": {
    slug: "topology-builder",
    name: "Network Topology Builder",
    shortName: "Topology Builder",
    visual: "topology",
    badge: "Build and compare network layouts",
    pageTitle: "Network Topology Builder - Interactive Networking Lab | OpenLabs",
    metaDescription:
      "Design network topologies with an interactive builder. Learn bus, star, ring, mesh, nodes, links, connectivity, reliability, and network design.",
    heroDescription:
      "Build network layouts by placing nodes, connecting links, and comparing topology patterns such as star, ring, bus, and mesh.",
    definition:
      "A network topology describes how devices and links are arranged in a computer network.",
    behavior:
      "Topology affects reliability, scalability, cost, fault tolerance, and how data can move between devices.",
    focus: "Nodes, links, layout, and connectivity",
    visualSteps: ["Place devices", "Connect links", "Test layout", "Compare topology"],
    learningObjectives: [
      "Understand common topology types and their tradeoffs.",
      "Visualize how nodes and links form a connected network.",
      "Compare reliability and scalability across layouts.",
      "Practice designing networks before physical setup.",
    ],
    useCases: [
      "Network design practice",
      "Classroom topology demos",
      "LAN planning basics",
      "Connectivity and fault analysis",
    ],
    faqs: [
      {
        question: "What is a network topology?",
        answer:
          "A network topology is the arrangement of devices and connections in a computer network.",
      },
      {
        question: "Which topology is best?",
        answer:
          "It depends on the goal. Star is common and easy to manage, mesh is reliable but costly, and bus or ring are useful for learning tradeoffs.",
      },
      {
        question: "What does a topology builder teach?",
        answer:
          "It teaches how network structure affects connectivity, cost, scalability, and fault tolerance.",
      },
    ],
  },
};

export function createNetworkingMetadata(content: NetworkingContent): Metadata {
  const pageUrl = `https://www.openlabs.org.in/computer-science/networking/${content.slug}`;

  return {
    title: content.pageTitle,
    description: content.metaDescription,
    keywords: [
      `${content.name} simulator`,
      `${content.name} networking lab`,
      `${content.shortName} visualizer`,
      "computer networking lab",
      "networking simulator",
      "interactive networking",
      "OpenLabs networking",
    ],
    alternates: {
      canonical: `/computer-science/networking/${content.slug}`,
    },
    openGraph: {
      title: content.pageTitle,
      description: content.metaDescription,
      url: pageUrl,
      siteName: "OpenLabs",
      type: "website",
      images: [
        {
          url: "/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: `OpenLabs ${content.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.pageTitle,
      description: content.metaDescription,
      images: ["/images/twitter-image.svg"],
    },
  };
}
