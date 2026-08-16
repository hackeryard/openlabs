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
  {
    match: (p) => p === "/mathematics",
    knowledge: {
      title: "Mathematics Lab Hub",
      overview:
        "Hub for mathematics interactive labs: real-time function plotting, curve transformations, polynomial roots, calculus tangent slopes, and definite integration.",
      howToUse: [
        "Select an interactive mathematics laboratory (e.g. Function Grapher).",
        "Ask the AI assistant to explain mathematical definitions, function behaviors, or transformation mechanics.",
      ],
      keyConcepts: [
        "Continuous 2D function plotting and Cartesian coordinates",
        "Function transformations: a·f(b(x - h)) + k",
        "Polynomial roots and sign change analysis",
        "Instantaneous rate of change and tangent line slopes f'(x)",
        "Definite integrals and area bounded under curves",
      ],
    },
  },
  {
    match: (p) => p === "/mathematics/functiongrapher" || p === "/labs/mathematics/functiongrapher",
    knowledge: {
      title: "Function Grapher Lab",
      overview:
        "Interactive mathematical sandbox for plotting functions, exploring real-time scaling and phase shifts, inspecting tangent lines, finding roots and extrema, and calculating definite integrals.",
      howToUse: [
        "Enter any mathematical formula (e.g. x^3 - 3*x, sin(x), exp(-x^2)) or choose a preset from the gallery.",
        "Use the Transformation sliders to manipulate amplitude (a), frequency (b), horizontal shift (h), and vertical shift (k).",
        "Hover over the curve or click to pin points, inspect tangent slopes f'(x), and view multi-function comparisons.",
        "Open the Analysis panel to view detected roots, y-intercepts, local extrema, and compute definite integrals.",
      ],
      keyConcepts: [
        "Parent functions vs transformed graphs",
        "Roots (x-intercepts) where f(x) = 0",
        "Turning points (local minima and maxima) where f'(x) = 0",
        "Numerical derivative and tangent equation: y - y0 = m(x - x0)",
        "Simpson's composite rule for definite numerical integration",
      ],
      whatToTry: [
        "Try transforming sin(x) into 2*sin(2*(x - 1)) + 1 and observe the amplitude and period changes.",
        "Plot a cubic polynomial like x^3 - 3*x and find all 3 real roots and both turning points.",
        "Compute the definite integral of sin(x) from 0 to π and verify the area equals 2.",
      ],
      glossary: {
        "Root": "A value of x for which f(x) = 0 (an x-intercept).",
        "Extrema": "Local maximum or minimum turning points where the derivative changes sign.",
        "Tangent line": "A straight line that touches a curve at a single point with slope equal to the derivative at that point.",
        "Definite integral": "The net signed area under a function curve between lower bound a and upper bound b.",
      },
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

  if (pathname.startsWith("/mathematics/trigonometry") || pathname.startsWith("/labs/mathematics/trigonometry")) {
    return formatKnowledge({
      title: "Trigonometry Visualizer Lab",
      overview:
        "This lab connects the geometric unit circle (r = 1) to continuous sine, cosine, and tangent waves, Pythagorean identity proofs, and sinusoidal wave transformations.",
      keyConcepts: [
        "Unit Circle coordinates: x = cos(θ), y = sin(θ), tan(θ) = y/x",
        "ASTC quadrant signs (Q1: All, Q2: Sine, Q3: Tangent, Q4: Cosine)",
        "Pythagorean identities (sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ)",
        "Wave transformations: y = A·sin(B(x - C)) + D with period T = 2π/B",
      ],
      whatToTry: [
        "Drag the unit circle handle to see how rotating coordinates trace periodic waves.",
        "Verify double-angle and Pythagorean identities at standard angles (e.g. 30°, 45°, 60°).",
        "Adjust amplitude (A) and frequency (B) in the Wave Sandbox to synthesize harmonics.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/functiongrapher") || pathname.startsWith("/labs/mathematics/functiongrapher")) {
    return formatKnowledge({
      title: "Function Grapher Lab",
      overview:
        "This lab plots 2D mathematical equations in real time with curve transformations, bisection root-finding, local extrema detection, and Simpson composite definite integrals.",
      keyConcepts: [
        "Function transformations: g(x) = a·f(b(x - h)) + k",
        "Calculus roots (f(x) = 0) and local turning points (f'(x) = 0)",
        "Definite integration: net signed area under curve via Simpson composite rule",
      ],
      whatToTry: [
        "Plot polynomials, trigonometric functions, or rational functions and apply transformations.",
        "Inspect tangent line slopes at arbitrary coordinates or compute definite integrals.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/polynomials") || pathname.startsWith("/labs/mathematics/polynomials")) {
    return formatKnowledge({
      title: "Quadratic & Polynomial Explorer Lab",
      overview:
        "This lab explores parabolic geometry (y = ax² + bx + c), vertex form (y = a(x - h)² + k), discriminant classification (Δ = b² - 4ac), higher-degree polynomial turning points, and step-by-step synthetic division.",
      keyConcepts: [
        "Parabola vertex (h, k) where h = -b/(2a) and k = c - b²/(4a)",
        "Discriminant Δ = b² - 4ac (Δ > 0: 2 real roots, Δ = 0: 1 repeated root, Δ < 0: 2 complex conjugate roots)",
        "Parabola focus (h, k + 1/(4a)) and directrix line y = k - 1/(4a)",
        "Polynomial critical turning points (P'(x) = 0) and inflection points (P''(x) = 0)",
        "Remainder Theorem P(c) = R and Factor Theorem (R = 0 => (x - c) is a factor)",
      ],
      whatToTry: [
        "Switch between standard and vertex forms to see how parameter 'a' scales width and orientation.",
        "Adjust coefficients to achieve negative discriminant and view complex conjugate roots on the Argand plane.",
        "Select higher polynomial degrees (1 to 5) to inspect local extrema and end behavior.",
        "Use the synthetic division tableau to divide polynomials and test root factors.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/calculus") || pathname.startsWith("/labs/mathematics/calculus")) {
    return formatKnowledge({
      title: "Calculus & Derivatives Sandbox Lab",
      overview:
        "This lab explores differential limits (f'(x) = lim[h->0] (f(x+h) - f(x))/h), secant-to-tangent line convergence, 5 Riemann sum partitioning methods, and stationary optimization extrema.",
      keyConcepts: [
        "Difference quotient limit: f'(x₀) = lim[h→0] (f(x₀+h) - f(x₀))/h",
        "Secant line slope m_sec = Δy/Δx converging to tangent slope m_tan = f'(x₀)",
        "Riemann Sums (Left, Right, Midpoint, Trapezoidal, Simpson) approximating ∫ₐᵇ f(x)dx",
        "Fundamental Theorem of Calculus: d/dx [∫ₐˣ f(t)dt] = f(x)",
        "Second Derivative Test for local minima (f''(x) > 0) and maxima (f''(x) < 0)",
      ],
      whatToTry: [
        "Drag step size h down to 0 to watch the secant line pivot and snap to the tangent line.",
        "Increase partition count N from 2 to 80 to observe error convergence to the exact definite integral.",
        "Inspect stationary critical points and concavity across different function presets.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/linear-algebra") || pathname.startsWith("/labs/mathematics/linear-algebra")) {
    return formatKnowledge({
      title: "Linear Algebra & Matrix Transformations Lab",
      overview:
        "This lab explores 2D linear space transformations T(v) = Av, standard basis vectors î = [a, c]ᵀ and ĵ = [b, d]ᵀ, determinant area scaling det(A) = ad - bc, and invariant eigenvectors (Av = λv).",
      keyConcepts: [
        "Matrix columns represent the transformed landing positions of basis vectors î and ĵ",
        "Determinant det(A) = ad - bc scales area (|det(A)|) and indicates orientation preservation vs flip",
        "Singular matrices (det(A) = 0) collapse 2D space into a 1D line or 0D point (non-invertible)",
        "Eigenvalues λ and eigenvectors v satisfy A·v = λ·v along invariant span lines",
      ],
      whatToTry: [
        "Drag the emerald î and blue ĵ vector handles to see how space warps in real time.",
        "Test rotation, shear, and reflection presets to observe changes in orientation and determinant.",
        "Examine invariant purple eigen-lines where vectors are purely scaled without rotating.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/statistics") || pathname.startsWith("/labs/mathematics/statistics")) {
    return formatKnowledge({
      title: "Probability & Statistics Sandbox Lab",
      overview:
        "This lab explores physical bean machine distributions (Galton Board), the Central Limit Theorem, probability distributions (Normal, Binomial, Poisson), and Ordinary Least Squares linear regression.",
      keyConcepts: [
        "Galton Board bean machine demonstrates physical convergence to the Binomial B(N, p) and Gaussian bell curve",
        "Central Limit Theorem: sampling distribution of sample means converges to N(μ, σ²/n) regardless of parent population shape",
        "Confidence intervals and 68-95-99.7 empirical rule under Gaussian distributions",
        "Ordinary Least Squares (OLS) minimizes sum of squared residuals to find line of best fit y = mx + b",
      ],
      whatToTry: [
        "Drop continuous streams or 500-ball batches through the Galton Board to watch the binomial histogram form.",
        "Select skewed exponential or bimodal parent populations and increase sample size n to observe the bell curve emerge.",
        "Click on the scatter canvas to add or drag data points and observe real-time changes to Pearson's r and R².",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/complex-numbers") || pathname.startsWith("/labs/mathematics/complex-numbers")) {
    return formatKnowledge({
      title: "Complex Numbers & Fractals Explorer Lab",
      overview:
        "This lab explores the 2D Argand plane z = a + bi, complex multiplication as rotation and dilation, n-th roots of unity forming regular polygons, Euler's identity, and real-time escape-time rendering of the Mandelbrot and Julia set fractals.",
      keyConcepts: [
        "Cartesian z = a + bi and Polar z = r e^(iθ) with modulus r and argument θ",
        "Complex multiplication multiplies lengths (r₁·r₂) and adds angles (θ₁ + θ₂)",
        "Roots of unity z^n = 1 evenly partition the unit circle into regular n-gons",
        "Euler's formula e^(iθ) = cos(θ) + i·sin(θ) and Euler's identity e^(iπ) + 1 = 0",
        "Mandelbrot & Julia sets z_{n+1} = z_n² + c generated by quadratic escape-time iterations",
      ],
      whatToTry: [
        "Drag vectors z₁ and z₂ on the Argand plane to see how multiplication angles add together.",
        "Adjust roots slider n from 2 to 16 and click 'Cycle Powers' to watch cyclic orbits around the unit circle.",
        "Drag rotation angle θ to see Euler's circular projection and Taylor series spiral.",
        "Zoom into the Mandelbrot fractal using your mouse wheel to discover infinite self-similar structures.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/set-theory") || pathname.startsWith("/labs/mathematics/set-theory")) {
    return formatKnowledge({
      title: "Set Theory & Boolean Algebra Lab",
      overview:
        "This lab explores set theory, Venn diagrams, set operations (Union, Intersection, Set Difference, Symmetric Difference, Complement), Principle of Inclusion-Exclusion (PIE), De Morgan's laws, injective/surjective/bijective function classifications, and logic truth tables.",
      keyConcepts: [
        "Union (A ∪ B) vs Intersection (A ∩ B) vs Difference (A \\ B) vs Symmetric Difference (A Δ B)",
        "De Morgan's Laws: (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'",
        "Principle of Inclusion-Exclusion: |A ∪ B ∪ C| = Σ|A_i| - Σ|A_i ∩ A_j| + |A ∩ B ∩ C|",
        "Function types: Injective (One-to-One), Surjective (Onto), and Bijective (Invertible)",
        "Propositional logic truth tables (AND, OR, NOT, IMPLIES, IFF, XOR)",
      ],
      whatToTry: [
        "Toggle between 2-Set and 3-Set Venn diagrams and click on regions to highlight subsets.",
        "Add custom elements or load the 'Primes & Evens' preset to watch tokens position into Venn regions.",
        "Type custom set formulas like '(A | B) & ~C' in the Operations tab to test Boolean evaluations.",
        "In the Functions tab, draw mapping arrows between Set X and Set Y to test Injective and Bijective rules.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/geometry") || pathname.startsWith("/labs/mathematics/geometry")) {
    return formatKnowledge({
      title: "Interactive Geometry Studio",
      overview:
        "This lab explores Euclidean geometry, dynamic constructions (points, segments, circles, midpoints), the 4 classical Triangle Centers (Centroid G, Incenter I, Circumcenter O, Orthocenter H), the collinear Euler Line (HG = 2 · GO), Circle Theorems (Inscribed Angle, Thales 90° Semicircle, Cyclic Quadrilaterals), 2D Rigid Transformations (Translation, Rotation, Reflection, Dilation), and Regular n-gon metrics.",
      keyConcepts: [
        "Centroid G divides medians in 2:1 ratio (center of mass)",
        "Circumcenter O is the center of circumcircle passing through all 3 vertices",
        "Incenter I is the center of the incircle tangent to all 3 edges",
        "Euler Line: Orthocenter H, Centroid G, and Circumcenter O are collinear with HG = 2 · GO",
        "Inscribed Angle Theorem: angle subtended at center is twice the angle at circumference",
        "Thales' Theorem: angle inscribed in a semicircle is always 90°",
      ],
      whatToTry: [
        "Use the Construction Studio to draw points, segments, circles, and midpoints.",
        "Drag vertices A, B, and C in the Triangle Centers tab to see the Euler line update in real-time.",
        "Drag points on the circle in Circle Theorems tab to verify the 2:1 angle ratio.",
        "In Transformations tab, adjust rotation angle or translation offsets to transform polygons.",
        "In Regular Polygons tab, change the number of sides from 3 to 16 to inspect apothem and area.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/vector-algebra") || pathname.startsWith("/labs/mathematics/vector-algebra")) {
    return formatKnowledge({
      title: "Vector Algebra & 3D Space Studio",
      overview:
        "This lab explores 2D and 3D Vector Algebra, Parallelogram Law and Tip-to-Tail addition, Dot Product (u · v = |u||v|cosθ) and orthogonal vector projections (proj_v(u)), 3D Cross Product (u × v) and Right-Hand Rule with spanned parallelogram area, Scalar Triple Product [u, v, w] and 3D parallelepiped volume / coplanarity test, and 3D parametric lines (r = a + td) and planes (r · n = D).",
      keyConcepts: [
        "Parallelogram Law of vector addition: R = u + v forms diagonal of parallelogram",
        "Dot Product: u · v = |u||v|cosθ measures directional alignment (zero when perpendicular)",
        "Orthogonal vector projection: proj_v(u) gives the shadow component of u along v",
        "Cross Product: u × v produces a normal 3D vector whose magnitude equals spanned parallelogram area",
        "Scalar Triple Product: [u, v, w] = det(M) gives the volume of spanned 3D parallelepiped (zero when coplanar)",
        "Vector equations of lines (r = a + td) and planes (r · n = D)",
      ],
      whatToTry: [
        "Drag vector heads in the 2D Operations tab to see the Parallelogram Law and resultant vector R.",
        "Inspect the Dot Product tab to see the angle arc and green orthogonal projection vector proj_v(u).",
        "Rotate the 3D canvas in the Cross Product tab to see normal vector u × v perpendicular to both inputs.",
        "In the Triple Product tab, test coplanar vs independent vectors to see parallelepiped volume.",
        "In 3D Lines & Planes tab, adjust parameter t and normal vectors to compute point-to-plane distance.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/combinatorics") || pathname.startsWith("/labs/mathematics/combinatorics")) {
    return formatKnowledge({
      title: "Combinatorics & Discrete Counting Studio",
      overview:
        "This lab explores foundational discrete counting techniques: Permutations P(n, r) and Combinations C(n, r), Pascal's Triangle (Sierpinski mod 2 fractal, Fibonacci diagonal sums, Hockey-stick theorem) with Binomial Theorem expansion ((ax + by)^n), Dirichlet's Generalized Pigeonhole Principle, Stars and Bars integer solution distribution, Ferrers/Young diagrams for integer partitions p(n), and Subfactorial Derangements (!n) with Hat-Check asymptotic convergence to 1/e.",
      keyConcepts: [
        "Permutations P(n, r) = n! / (n - r)! when order matters",
        "Combinations C(n, r) = n! / (r! (n - r)!) when order is unimportant",
        "Pascal's Triangle recurrence: C(n, k) = C(n-1, k-1) + C(n-1, k)",
        "Binomial Theorem: (x + y)^n = sum C(n, k) x^(n-k) y^k",
        "Pigeonhole Principle: distributing n items into k containers guarantees at least ceil(n/k) in one container",
        "Stars and Bars: non-negative integer solutions to x1 + ... + xk = n equals C(n+k-1, k-1)",
        "Derangements !n: permutations with zero fixed points, probability converges to 1/e ≈ 36.79%",
      ],
      whatToTry: [
        "In P(n, r) & C(n, r) tab, select different item themes (letters, emojis, colored balls) and adjust n and r.",
        "In Pascal's Triangle tab, toggle Sierpinski (mod 2) and Hockey Stick patterns, and test binomial expansions.",
        "In Pigeonhole Principle tab, distribute items uniformly vs randomly to verify the Dirichlet bound ceil(n/k).",
        "In Stars & Bars tab, test non-negative vs positive constraints and explore Ferrers partition diagrams.",
        "In Derangements tab, run Monte Carlo Hat-Check trials to observe convergence to 1/e.",
      ],
    });
  }

  if (pathname.startsWith("/mathematics/number-theory") || pathname.startsWith("/labs/mathematics/number-theory")) {
    return formatKnowledge({
      title: "Number Theory & Cryptography Studio",
      overview:
        "This lab explores classical and modern Number Theory: Sieve of Eratosthenes prime generation, Fundamental Theorem of Arithmetic factor trees, Euclidean Algorithm and Extended Bézout's identity (ax + by = gcd) with geometric square rectangle tiling, Modular Clock Arithmetic and Chinese Remainder Theorem systems, Euler's Totient Function phi(n) with coprimality wheels and Fermat's Little Theorem, RSA Public-Key Cryptography with Square-and-Multiply fast exponentiation, and Collatz 3n + 1 trajectory orbits with continued fractions.",
      keyConcepts: [
        "Fundamental Theorem of Arithmetic: unique prime factor decomposition n = p1^a1 ... pk^ak",
        "Sieve of Eratosthenes: efficient O(N log log N) prime filtering",
        "Euclidean Algorithm: gcd(a, b) computed via successive divisions a = bq + r",
        "Bézout's Identity: integers x, y exist such that ax + by = gcd(a, b)",
        "Modular Multiplicative Inverse: a^-1 mod m exists iff gcd(a, m) = 1",
        "Chinese Remainder Theorem: unique solution modulo M = m1...mk for coprime moduli",
        "Euler's Totient Theorem: a^phi(n) = 1 (mod n) for gcd(a, n) = 1",
        "RSA Cryptography: asymmetric cipher based on integer factorization hardness C = M^e mod n",
        "Collatz 3n + 1 Problem: iterative sequence reaching 4-2-1 cycle",
      ],
      whatToTry: [
        "In Primes & Sieve tab, click prime filters to highlight multiples and inspect divisor sums.",
        "In Euclidean GCD & Tiling tab, adjust inputs a and b to see geometric square box tiling.",
        "In Modular & CRT tab, spin the modular clock wheel and solve simultaneous congruence systems.",
        "In Euler phi(n) & Powers tab, inspect coprimality spokes and verify Euler's theorem a^phi(n) = 1 mod n.",
        "In RSA Cryptography tab, select primes p and q to generate public/private key pairs and encrypt text.",
        "In Collatz & Fractions tab, test starting seeds to plot orbit trajectories and peak heights.",
      ],
    });
  }

  if (pathname.startsWith("/computer-science/dsa/graph-algorithms") || pathname.startsWith("/labs/computer-science/dsa/graph-algorithms")) {
    return formatKnowledge({
      title: "Graph Algorithms & Network Flow Lab",
      overview:
        "This lab explores node-edge graph structures G = (V, E), topological invariants (degree sequences, density, connectivity), shortest path algorithms (Dijkstra, BFS, Bellman-Ford), Minimum Spanning Trees (Kruskal with DSU, Prim), and proper vertex coloring / chromatic number χ(G).",
      keyConcepts: [
        "Handshaking Lemma: sum of all vertex degrees equals 2|E|",
        "Dijkstra's greedy shortest path algorithm using priority queue edge relaxation",
        "Minimum Spanning Tree contains |V|-1 edges connecting all vertices with minimum total weight",
        "Kruskal's greedy edge sorting with Disjoint Set Union (DSU) cycle detection",
        "Four Color Theorem: any planar graph can be properly colored with at most 4 colors (χ(G) ≤ 4)",
      ],
      whatToTry: [
        "Click on the canvas to add nodes and connect weighted edges, or load the Petersen graph preset.",
        "Select start node S and target node T in the Shortest Path tab and press 'Play Trace' to watch Dijkstra's algorithm relax distances.",
        "Toggle Kruskal vs Prim in the Spanning Tree tab and step through edge acceptance and cycle rejection.",
        "Check the Graph Coloring tab to see the chromatic number χ(G) and bipartite 2-color partition sets.",
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

