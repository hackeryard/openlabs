export type PageKnowledge = {
  title: string;
  overview: string;
  howToUse?: string[];
  keyConcepts?: string[];
  whatToTry?: string[];
  commonMistakes?: string[];
  glossary?: Record<string, string>;
};

type KnowledgeMatcher = {
  match: (pathname: string) => boolean;
  knowledge: PageKnowledge;
};

const matchers: KnowledgeMatcher[] = [
  // Global / top-level hubs
  {
    match: (p) => p === "/",
    knowledge: {
      title: "OpenLabs Home",
      overview:
        "Landing page for OpenLabs, an interactive playground for Physics, Chemistry, Computer Science, and Biology experiments.",
      howToUse: [
        "Pick a subject card (Physics, Chemistry, Computer Science, Biology) to enter a lab area.",
        "From a lab hub, drill down into a specific simulation or visualizer.",
      ],
      keyConcepts: [
        "Each page is an experiment or visualizer, not just static content.",
        "The AI assistant can always see the current page context and explain what you are viewing.",
      ],
      whatToTry: [
        "Ask: which lab is best to learn a specific concept (e.g. Ohm’s Law, OSI layers).",
        "Navigate to any lab and then ask the assistant to explain what you’re seeing step-by-step.",
      ],
    },
  },
  {
    match: (p) => p === "/computer-science",
    knowledge: {
      title: "Computer Science Lab Hub",
      overview:
        "Hub page listing Computer Science experiments: data structures, algorithms, logic gates, networking, code lab, Git simulator, AI problems, and more.",
      howToUse: [
        "Choose a card (e.g. DSA Visualizer, Logic Gates, Networking Lab, Code Lab, Git Simulator, AI Problems).",
        "Use the assistant to compare two labs or to suggest which one fits a topic you want to understand.",
      ],
      keyConcepts: [
        "Data Structures & Algorithms visualization",
        "Digital logic and circuit intuition",
        "Networking fundamentals and OSI model",
        "Version control (Git) concepts",
        "AI problem solving and search/learning",
      ],
      whatToTry: [
        "Ask for a learning path, e.g. 'In what order should I open these CS labs to learn systematically?'",
      ],
    },
  },
  {
    match: (p) => p === "/physics",
    knowledge: {
      title: "Physics Lab Hub",
      overview:
        "Hub page with multiple interactive physics experiments (pendulum, projectile motion, Ohm’s law, RC circuits, optics, energy, motion, etc.).",
      howToUse: [
        "Pick an experiment card and open its dedicated simulation page.",
        "When inside a lab, change parameters and ask the assistant what the changes mean physically.",
      ],
      keyConcepts: [
        "Kinematics and dynamics",
        "Electric circuits and Ohm’s law",
        "Wave and geometric optics",
        "Energy conservation",
      ],
    },
  },
  {
    match: (p) => p === "/chemistry",
    knowledge: {
      title: "Chemistry Lab Hub",
      overview:
        "Hub for chemistry tools like reaction simulations, periodic table explorer, electronic configuration visualizer, and chemical bonds.",
      howToUse: [
        "Choose a tool (e.g. reaction simulation, periodic table) based on what you want to explore.",
        "Use the assistant to connect periodic trends and bonding to what the visualizations show.",
      ],
      keyConcepts: [
        "Periodic table structure and trends",
        "Electron configuration",
        "Chemical bonding and reaction types",
      ],
    },
  },
  {
    match: (p) => p === "/biology",
    knowledge: {
      title: "Biology Lab Hub",
      overview:
        "Biology hub that links to human anatomy and cell (plant/animal) visualizations.",
      howToUse: [
        "Open a specific page like Human Body, Plant Cell, or Animal Cell.",
        "Use the assistant to quiz yourself on organ/cell part functions based on what you see.",
      ],
      keyConcepts: [
        "Human body systems at a high level",
        "Differences between plant and animal cells",
      ],
    },
  },

  // Networking
  {
    match: (p) => p === "/computer-science/networking",
    knowledge: {
      title: "Computer Networking Lab (Hub)",
      overview:
        "This page is a hub that links to networking simulations (packet switching, circuit switching, topology builder, and the OSI model).",
      howToUse: [
        "Open one of the labs and interact with controls to see how data moves or how networks are structured.",
        "Ask the assistant to compare concepts (e.g. packet vs circuit switching) using examples from the lab you opened.",
      ],
      keyConcepts: [
        "Packet vs circuit switching",
        "Network topologies (star, bus, ring, mesh)",
        "OSI layers and encapsulation/decapsulation",
      ],
    },
  },
  {
    match: (p) => p === "/computer-science/networking/packet-switching",
    knowledge: {
      title: "Packet Switching Lab",
      overview:
        "Interactive simulation that demonstrates how data is split into packets and routed through a network independently.",
      howToUse: [
        "Start the simulation and watch packet movement through intermediate nodes.",
        "Change parameters (speed, hops, ordering if available) and observe how delivery changes.",
      ],
      keyConcepts: [
        "Packets, headers, and addressing",
        "Store-and-forward and routing",
        "Latency, jitter, packet loss, and reordering",
      ],
      whatToTry: [
        "Ask: why packets can arrive out of order and how TCP fixes it.",
        "Ask: what happens if a link fails (rerouting) and how that differs from circuit switching.",
      ],
      glossary: {
        "Packet": "A small chunk of data with a header (addresses + control info).",
        "Routing": "Selecting a path through the network to reach the destination.",
        "Jitter": "Variation in packet arrival time (uneven latency).",
      },
    },
  },
  {
    match: (p) => p === "/computer-science/networking/circuit-switching",
    knowledge: {
      title: "Circuit Switching Lab",
      overview:
        "Interactive simulation showing how a dedicated end-to-end path (circuit) is established before data transfer.",
      howToUse: [
        "Establish a circuit, then send data across the reserved path.",
        "Reset and compare behavior when multiple flows compete for the same resources (if the UI supports it).",
      ],
      keyConcepts: [
        "Call setup / circuit establishment",
        "Reserved bandwidth and predictable latency",
        "Inefficiency when the circuit is idle",
      ],
      whatToTry: [
        "Ask: why circuit switching is good for constant bit-rate traffic and why the Internet prefers packet switching.",
        "Ask: what 'blocking' means when no circuit is available.",
      ],
      glossary: {
        "Circuit": "A reserved, dedicated path between sender and receiver.",
        "Call setup": "The phase where the network allocates a circuit before data is sent.",
      },
    },
  },
  {
    match: (p) => p === "/computer-science/networking/topology-builder",
    knowledge: {
      title: "Topology Builder",
      overview:
        "Interactive tool for building and visualizing network topologies and understanding how structure affects communication.",
      howToUse: [
        "Add nodes and links, then choose a topology style (star/bus/ring/mesh if available).",
        "Ask the assistant how the topology impacts fault tolerance, cost, and performance.",
      ],
      keyConcepts: [
        "Topology types and trade-offs",
        "Single points of failure",
        "Redundancy and path diversity",
      ],
      whatToTry: [
        "Build a star and then remove the central node; ask what breaks and why.",
        "Build a mesh and compare number of links vs reliability.",
      ],
    },
  },
  {
    match: (p) => p === "/computer-science/networking/osi-model",
    knowledge: {
      title: "OSI Model Interactive Visualization",
      overview:
        "Interactive simulator that explains the 7 OSI layers and shows encapsulation/decapsulation as data moves down/up the stack.",
      howToUse: [
        "Pick TCP vs UDP and Sender vs Receiver mode, then run the simulation.",
        "Click a layer to open its details (function, protocols, devices, example, quiz).",
      ],
      keyConcepts: [
        "Encapsulation and decapsulation",
        "PDU names (bits, frame, packet, segment, data)",
        "TCP vs UDP trade-offs (reliability vs speed)",
        "What devices typically operate at each layer",
      ],
      whatToTry: [
        "Ask: in this simulator, what changes when switching TCP ↔ UDP?",
        "Ask: map a real action (opening a website) to OSI layers step-by-step.",
      ],
      glossary: {
        "Encapsulation": "Adding headers/trailers as data moves down the stack during sending.",
        "Decapsulation": "Removing headers/trailers as data moves up the stack during receiving.",
        "PDU": "Protocol Data Unit; the 'name' of data at a given layer (frame/packet/etc.).",
      },
    },
  },
];

function humanizeSegment(seg: string): string {
  return seg
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function lastPathSegment(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function formatKnowledge(k: PageKnowledge): string {
  const lines: string[] = [];
  lines.push(`Title: ${k.title}`);
  lines.push(`Overview: ${k.overview}`);

  const addList = (label: string, items?: string[]) => {
    if (!items?.length) return;
    lines.push(`${label}:`);
    for (const item of items) lines.push(`- ${item}`);
  };

  addList("How to use", k.howToUse);
  addList("Key concepts", k.keyConcepts);
  addList("What to try", k.whatToTry);
  addList("Common mistakes", k.commonMistakes);

  if (k.glossary && Object.keys(k.glossary).length) {
    lines.push("Glossary:");
    for (const [term, def] of Object.entries(k.glossary)) {
      lines.push(`- ${term}: ${def}`);
    }
  }

  return lines.join("\n");
}

export function getPageKnowledgeText(pathname: string): string | null {
  for (const m of matchers) {
    if (m.match(pathname)) return formatKnowledge(m.knowledge);
  }

  // Heuristic knowledge for common lab families (so "every page" gets useful detail).
  if (pathname.startsWith("/computer-science/dsa/sorting/")) {
    const algo = lastPathSegment(pathname);
    const algoName = humanizeSegment(algo);
    const algoFacts: Record<
      string,
      { best: string; avg: string; worst: string; stable: string; inPlace: string }
    > = {
      "bubble-sort": {
        best: "O(n) (already sorted, with early-exit)",
        avg: "O(n²)",
        worst: "O(n²)",
        stable: "Yes",
        inPlace: "Yes",
      },
      "insertion-sort": {
        best: "O(n) (nearly sorted)",
        avg: "O(n²)",
        worst: "O(n²)",
        stable: "Yes",
        inPlace: "Yes",
      },
      "selection-sort": {
        best: "O(n²)",
        avg: "O(n²)",
        worst: "O(n²)",
        stable: "No (typical implementation)",
        inPlace: "Yes",
      },
      "merge-sort": {
        best: "O(n log n)",
        avg: "O(n log n)",
        worst: "O(n log n)",
        stable: "Yes",
        inPlace: "No (needs extra memory)",
      },
      "quick-sort": {
        best: "O(n log n)",
        avg: "O(n log n)",
        worst: "O(n²) (bad pivots)",
        stable: "No (typical implementation)",
        inPlace: "Yes (typical)",
      },
      "heap-sort": {
        best: "O(n log n)",
        avg: "O(n log n)",
        worst: "O(n log n)",
        stable: "No",
        inPlace: "Yes",
      },
    };

    const facts = algoFacts[algo];
    return formatKnowledge({
      title: `${algoName} Visualizer`,
      overview:
        "This page visualizes a sorting algorithm step-by-step so you can see comparisons, swaps, and how the array becomes sorted over time.",
      howToUse: [
        "Generate/shuffle an array, then start the visualization.",
        "Adjust speed/size (if available) to see behavior on different inputs.",
      ],
      keyConcepts: [
        "Comparisons vs swaps/moves",
        "Time complexity trends on different inputs",
        "Stability (whether equal elements keep relative order)",
      ],
      whatToTry: [
        "Try a nearly-sorted array vs a random array and compare steps.",
        "Ask the assistant to explain what happened in the last step you saw on screen.",
      ],
      glossary: facts
        ? {
            "Best/Average/Worst": `For ${algoName}: best=${facts.best}, avg=${facts.avg}, worst=${facts.worst}.`,
            Stable: facts.stable,
            "In-place": facts.inPlace,
          }
        : undefined,
    });
  }

  if (pathname.startsWith("/computer-science/dsa/")) {
    const seg = lastPathSegment(pathname);
    const name = humanizeSegment(seg);
    return formatKnowledge({
      title: `${name} Visualizer`,
      overview:
        "This page is an interactive data-structure lab. It helps you understand operations by animating state changes after each action.",
      howToUse: [
        "Perform common operations (insert, delete, push/pop, enqueue/dequeue) and watch the structure update.",
        "Ask the assistant to explain what the current state means and what the next operation will do.",
      ],
      keyConcepts: [
        "Operations and their time complexity (big-O)",
        "Invariants (what must always be true for correctness)",
      ],
      whatToTry: [
        "Try edge cases: empty structure, full capacity (if any), duplicate values.",
        "Ask: why a particular operation is O(1) vs O(n) in this structure.",
      ],
    });
  }

  if (pathname.startsWith("/computer-science/logic-gates/")) {
    const gateSeg = lastPathSegment(pathname);
    const gate = humanizeSegment(gateSeg).replace(" Gate", "");
    const base = `${gate.toUpperCase()} gate`;
    const quick: Record<string, string> = {
      "and-gate": "Outputs 1 only when both inputs are 1.",
      "or-gate": "Outputs 1 when at least one input is 1.",
      "not-gate": "Inverts the input (0→1, 1→0).",
      "nand-gate": "NOT(AND). Universal gate: can build any logic circuit.",
      "nor-gate": "NOT(OR). Universal gate: can build any logic circuit.",
      "xor-gate": "Outputs 1 when inputs differ (A≠B).",
      "xnor-gate": "Outputs 1 when inputs match (A=B).",
    };
    return formatKnowledge({
      title: `${gate.toUpperCase()} Gate Lab`,
      overview:
        quick[gateSeg] ||
        `Interactive page to explore how the ${base} behaves for different input combinations.`,
      howToUse: [
        "Toggle inputs and observe output changes.",
        "Ask the assistant for the truth table and real-world examples.",
      ],
      keyConcepts: [
        "Boolean logic and truth tables",
        "Combinational logic building blocks",
      ],
      whatToTry: [
        "Ask: how to build XOR using only NAND or only NOR gates.",
        "Ask: what the gate represents in real circuits (switches/transistors).",
      ],
    });
  }

  if (pathname.startsWith("/physics/")) {
    const lab = humanizeSegment(lastPathSegment(pathname));
    return formatKnowledge({
      title: `${lab} Lab`,
      overview:
        "This is an interactive physics simulation. Use the controls to change parameters and observe how the system responds.",
      howToUse: [
        "Change one parameter at a time and observe the output/graph to understand cause → effect.",
        "Ask the assistant to connect the simulation to the core equations and physical intuition.",
      ],
      keyConcepts: [
        "Model parameters vs observed behavior",
        "Units and physical interpretation",
      ],
      whatToTry: [
        "Try an extreme value vs a typical value and compare behavior.",
        "Ask: what assumptions the simulation is making and when they break.",
      ],
    });
  }

  if (pathname.startsWith("/chemistry/reaction-simulation")) {
    return formatKnowledge({
      title: "Reaction Simulation",
      overview:
        "Interactive chemistry reaction simulator that demonstrates reactants → products, balancing, and real-world contexts for reactions.",
      howToUse: [
        "Select a reaction and observe how products form (and what conditions matter).",
        "Ask the assistant to explain the reaction type (combustion, synthesis, decomposition, etc.).",
      ],
      keyConcepts: [
        "Reactants/products and conservation of mass",
        "Balancing chemical equations",
        "Reaction conditions (heat, catalysts) if shown",
      ],
    });
  }

  if (pathname.startsWith("/chemistry/periodictable/atom/")) {
    return formatKnowledge({
      title: "Atom Details",
      overview:
        "This page shows details for a specific element (by atomic number) and helps you connect periodic trends to electron structure.",
      keyConcepts: [
        "Atomic number and electron count",
        "Valence electrons and bonding behavior",
        "Periodic trends (radius, electronegativity, ionization energy)",
      ],
      whatToTry: [
        "Ask: why this element is reactive/inert based on its valence shell.",
        "Ask: common compounds and oxidation states for this element.",
      ],
    });
  }

  if (pathname.startsWith("/chemistry/electronic-configuration/")) {
    return formatKnowledge({
      title: "Electronic Configuration",
      overview:
        "This page helps you understand electron configuration (shells/subshells) and how it explains periodic behavior.",
      keyConcepts: [
        "Aufbau principle, Pauli exclusion, Hund’s rule",
        "s/p/d/f subshells and filling order",
        "Valence electrons and chemical properties",
      ],
      whatToTry: [
        "Ask: write the configuration and identify valence shell electrons.",
        "Ask: predict likely ions from the configuration.",
      ],
    });
  }

  // Generic fallback for the rest of the site (still useful when DOM snapshot is thin).
  return formatKnowledge({
    title: "OpenLabs page",
    overview:
      "This is an interactive OpenLabs page. Use the live page snapshot to explain what the user is seeing and how the UI controls affect the simulation.",
    howToUse: [
      "Explain the goal of the page in 2-3 lines.",
      "Explain each major UI control and what changes when it’s used.",
      "If there is a simulation, describe what to observe and what the output means.",
    ],
    whatToTry: [
      "Ask the user what they changed last and explain the observed behavior.",
      "Propose 2-3 safe experiments the user can run inside the UI.",
    ],
  });
}

