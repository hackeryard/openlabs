import type { Metadata } from "next";

export type TruthRow = {
  a?: string;
  b?: string;
  input?: string;
  output: string;
};

export type LogicGateContent = {
  slug: string;
  name: string;
  shortName: string;
  formula: string;
  pageTitle: string;
  metaDescription: string;
  heroDescription: string;
  definition: string;
  behavior: string;
  learningObjectives: string[];
  useCases: string[];
  truthRows: TruthRow[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const gateContent: Record<string, LogicGateContent> = {
  "and-gate": {
    slug: "and-gate",
    name: "AND Gate",
    shortName: "AND",
    formula: "Y = A . B",
    pageTitle: "AND Gate Simulator - Truth Table and Logic Lab | OpenLabs",
    metaDescription:
      "Learn the AND gate with an interactive simulator, truth table, Boolean expression, circuit behavior, and digital logic examples on OpenLabs.",
    heroDescription:
      "Explore the AND gate by switching inputs, reading the truth table, and seeing why the output becomes 1 only when every input is 1.",
    definition:
      "An AND gate is a basic digital logic gate that produces a high output only when all of its inputs are high.",
    behavior:
      "The AND gate behaves like a strict condition checker: if A and B are both 1, the output is 1; otherwise the output remains 0.",
    learningObjectives: [
      "Understand the Boolean expression and truth table of an AND gate.",
      "Predict the output for every input combination.",
      "Connect AND logic with conditions used in circuits and programs.",
      "Use the simulator to compare theory with live input changes.",
    ],
    useCases: [
      "Digital enable circuits",
      "Conditional control systems",
      "Arithmetic circuits and adders",
      "Computer science logic practice",
    ],
    truthRows: [
      { a: "0", b: "0", output: "0" },
      { a: "0", b: "1", output: "0" },
      { a: "1", b: "0", output: "0" },
      { a: "1", b: "1", output: "1" },
    ],
    faqs: [
      {
        question: "What is an AND gate?",
        answer:
          "An AND gate is a digital logic gate that outputs 1 only when all inputs are 1.",
      },
      {
        question: "What is the Boolean expression of an AND gate?",
        answer:
          "The common Boolean expression is Y = A . B, where Y is the output and A and B are inputs.",
      },
      {
        question: "Why is the AND gate important?",
        answer:
          "AND gates are used in decision logic, control circuits, arithmetic circuits, and many digital systems.",
      },
    ],
  },
  "nand-gate": {
    slug: "nand-gate",
    name: "NAND Gate",
    shortName: "NAND",
    formula: "Y = (A . B)'",
    pageTitle: "NAND Gate Simulator - Truth Table and Universal Gate Lab | OpenLabs",
    metaDescription:
      "Learn the NAND gate with an interactive simulator, truth table, Boolean expression, universal gate behavior, and digital logic examples.",
    heroDescription:
      "Experiment with the NAND gate, a universal logic gate that gives 0 only when every input is 1.",
    definition:
      "A NAND gate is the inverse of an AND gate and produces a low output only when all inputs are high.",
    behavior:
      "NAND logic is useful because it can be combined to build every other basic logic gate, including AND, OR, and NOT.",
    learningObjectives: [
      "Understand NAND gate truth table behavior.",
      "Learn why NAND is called a universal gate.",
      "Compare NAND output with AND output.",
      "Use input switching to observe inverted AND logic.",
    ],
    useCases: [
      "Universal gate circuit design",
      "Memory and latch circuits",
      "Digital logic simplification",
      "Computer architecture fundamentals",
    ],
    truthRows: [
      { a: "0", b: "0", output: "1" },
      { a: "0", b: "1", output: "1" },
      { a: "1", b: "0", output: "1" },
      { a: "1", b: "1", output: "0" },
    ],
    faqs: [
      {
        question: "What is a NAND gate?",
        answer:
          "A NAND gate is a digital gate that outputs the opposite result of an AND gate.",
      },
      {
        question: "Why is NAND called a universal gate?",
        answer:
          "NAND is called universal because combinations of NAND gates can create all other basic logic gates.",
      },
      {
        question: "When does a NAND gate output 0?",
        answer:
          "A NAND gate outputs 0 only when all of its inputs are 1.",
      },
    ],
  },
  "nor-gate": {
    slug: "nor-gate",
    name: "NOR Gate",
    shortName: "NOR",
    formula: "Y = (A + B)'",
    pageTitle: "NOR Gate Simulator - Truth Table and Universal Logic Lab | OpenLabs",
    metaDescription:
      "Learn the NOR gate using an interactive simulator with truth table, Boolean expression, universal gate behavior, and digital electronics examples.",
    heroDescription:
      "Use the NOR gate simulator to see why the output is 1 only when every input is 0.",
    definition:
      "A NOR gate is the inverse of an OR gate and produces a high output only when all inputs are low.",
    behavior:
      "NOR logic is another universal gate pattern, meaning it can be used to construct every other basic logic function.",
    learningObjectives: [
      "Understand the NOR gate truth table and Boolean expression.",
      "Compare NOR output with OR output.",
      "Learn why NOR is a universal logic gate.",
      "Practice reading gate outputs from input combinations.",
    ],
    useCases: [
      "Universal logic construction",
      "Control circuits",
      "Digital electronics experiments",
      "Boolean algebra practice",
    ],
    truthRows: [
      { a: "0", b: "0", output: "1" },
      { a: "0", b: "1", output: "0" },
      { a: "1", b: "0", output: "0" },
      { a: "1", b: "1", output: "0" },
    ],
    faqs: [
      {
        question: "What is a NOR gate?",
        answer:
          "A NOR gate is a digital logic gate that outputs 1 only when all inputs are 0.",
      },
      {
        question: "What is the Boolean expression of a NOR gate?",
        answer:
          "The common Boolean expression is Y = (A + B)', which means NOT OR.",
      },
      {
        question: "Is NOR a universal gate?",
        answer:
          "Yes. NOR gates can be combined to build all other basic logic gates.",
      },
    ],
  },
  "not-gate": {
    slug: "not-gate",
    name: "NOT Gate",
    shortName: "NOT",
    formula: "Y = A'",
    pageTitle: "NOT Gate Simulator - Inverter Truth Table and Logic Lab | OpenLabs",
    metaDescription:
      "Learn the NOT gate with an interactive inverter simulator, truth table, Boolean expression, and digital logic examples on OpenLabs.",
    heroDescription:
      "Explore the NOT gate by switching one input and watching the output invert instantly.",
    definition:
      "A NOT gate, also called an inverter, produces the opposite value of its single input.",
    behavior:
      "When the input is 0, the NOT gate outputs 1. When the input is 1, it outputs 0.",
    learningObjectives: [
      "Understand how an inverter changes a binary signal.",
      "Read the NOT gate truth table correctly.",
      "Connect NOT logic with Boolean complements.",
      "Use the simulator to see input inversion instantly.",
    ],
    useCases: [
      "Signal inversion",
      "Boolean complement operations",
      "Control logic",
      "Digital circuit building blocks",
    ],
    truthRows: [
      { input: "0", output: "1" },
      { input: "1", output: "0" },
    ],
    faqs: [
      {
        question: "What is a NOT gate?",
        answer:
          "A NOT gate is a single-input logic gate that outputs the opposite of the input.",
      },
      {
        question: "Why is a NOT gate called an inverter?",
        answer:
          "It is called an inverter because it changes 0 to 1 and 1 to 0.",
      },
      {
        question: "What is the Boolean expression of a NOT gate?",
        answer:
          "The common Boolean expression is Y = A', where the apostrophe represents NOT.",
      },
    ],
  },
  "or-gate": {
    slug: "or-gate",
    name: "OR Gate",
    shortName: "OR",
    formula: "Y = A + B",
    pageTitle: "OR Gate Simulator - Truth Table and Logic Lab | OpenLabs",
    metaDescription:
      "Learn the OR gate with an interactive simulator, truth table, Boolean expression, output behavior, and digital logic examples.",
    heroDescription:
      "Explore the OR gate and see why the output becomes 1 when at least one input is 1.",
    definition:
      "An OR gate is a basic digital logic gate that produces a high output when one or more inputs are high.",
    behavior:
      "The OR gate is inclusive: if A is 1, B is 1, or both are 1, the output becomes 1.",
    learningObjectives: [
      "Understand the OR gate Boolean expression and truth table.",
      "Predict output from all input combinations.",
      "Compare OR logic with AND logic.",
      "Use the simulator to observe inclusive logic behavior.",
    ],
    useCases: [
      "Alarm and trigger systems",
      "Decision circuits",
      "Control logic",
      "Boolean algebra practice",
    ],
    truthRows: [
      { a: "0", b: "0", output: "0" },
      { a: "0", b: "1", output: "1" },
      { a: "1", b: "0", output: "1" },
      { a: "1", b: "1", output: "1" },
    ],
    faqs: [
      {
        question: "What is an OR gate?",
        answer:
          "An OR gate is a digital logic gate that outputs 1 when at least one input is 1.",
      },
      {
        question: "What is the Boolean expression of an OR gate?",
        answer:
          "The common Boolean expression is Y = A + B, where plus represents logical OR.",
      },
      {
        question: "When does an OR gate output 0?",
        answer:
          "An OR gate outputs 0 only when all of its inputs are 0.",
      },
    ],
  },
  "xnor-gate": {
    slug: "xnor-gate",
    name: "XNOR Gate",
    shortName: "XNOR",
    formula: "Y = (A xor B)'",
    pageTitle: "XNOR Gate Simulator - Truth Table and Equality Logic Lab | OpenLabs",
    metaDescription:
      "Learn the XNOR gate with an interactive simulator, truth table, Boolean expression, equality logic behavior, and circuit examples.",
    heroDescription:
      "Use the XNOR gate simulator to see why the output is 1 when both inputs are the same.",
    definition:
      "An XNOR gate is the inverse of an XOR gate and outputs 1 when its inputs are equal.",
    behavior:
      "XNOR logic is often used for equality checks because matching inputs produce a high output.",
    learningObjectives: [
      "Understand XNOR truth table behavior.",
      "Compare XNOR with XOR logic.",
      "Recognize XNOR as equality detection logic.",
      "Practice predicting outputs from matching and different inputs.",
    ],
    useCases: [
      "Equality checking circuits",
      "Digital comparators",
      "Error detection logic",
      "Boolean algebra exercises",
    ],
    truthRows: [
      { a: "0", b: "0", output: "1" },
      { a: "0", b: "1", output: "0" },
      { a: "1", b: "0", output: "0" },
      { a: "1", b: "1", output: "1" },
    ],
    faqs: [
      {
        question: "What is an XNOR gate?",
        answer:
          "An XNOR gate outputs 1 when its inputs are equal and outputs 0 when they are different.",
      },
      {
        question: "How is XNOR different from XOR?",
        answer:
          "XOR outputs 1 for different inputs, while XNOR outputs 1 for matching inputs.",
      },
      {
        question: "Where is XNOR used?",
        answer:
          "XNOR gates are commonly used in equality checks, digital comparators, and error detection logic.",
      },
    ],
  },
  "xor-gate": {
    slug: "xor-gate",
    name: "XOR Gate",
    shortName: "XOR",
    formula: "Y = A xor B",
    pageTitle: "XOR Gate Simulator - Truth Table and Exclusive OR Lab | OpenLabs",
    metaDescription:
      "Learn the XOR gate with an interactive simulator, truth table, Boolean expression, exclusive OR behavior, and digital logic examples.",
    heroDescription:
      "Explore the XOR gate and see why the output becomes 1 only when the two inputs are different.",
    definition:
      "An XOR gate, or exclusive OR gate, produces a high output when its inputs are different.",
    behavior:
      "XOR logic is useful for difference detection: matching inputs produce 0, while different inputs produce 1.",
    learningObjectives: [
      "Understand XOR truth table behavior.",
      "Compare XOR with OR and XNOR logic.",
      "Recognize XOR in adders and parity circuits.",
      "Use the simulator to test exclusive OR input combinations.",
    ],
    useCases: [
      "Half adder sum output",
      "Parity generation and checking",
      "Difference detection",
      "Digital circuit design practice",
    ],
    truthRows: [
      { a: "0", b: "0", output: "0" },
      { a: "0", b: "1", output: "1" },
      { a: "1", b: "0", output: "1" },
      { a: "1", b: "1", output: "0" },
    ],
    faqs: [
      {
        question: "What is an XOR gate?",
        answer:
          "An XOR gate outputs 1 only when the inputs are different.",
      },
      {
        question: "What does XOR mean?",
        answer:
          "XOR means exclusive OR, which excludes the case where both inputs are 1.",
      },
      {
        question: "Where is XOR used?",
        answer:
          "XOR gates are used in adders, parity circuits, comparison logic, and error detection systems.",
      },
    ],
  },
};

export function createLogicGateMetadata(gate: LogicGateContent): Metadata {
  const pageUrl = `https://www.openlabs.org.in/computer-science/logic-gates/${gate.slug}`;

  return {
    title: gate.pageTitle,
    description: gate.metaDescription,
    keywords: [
      `${gate.name} simulator`,
      `${gate.name} truth table`,
      `${gate.name} Boolean expression`,
      `${gate.shortName} gate lab`,
      "logic gates simulator",
      "digital logic lab",
      "computer science logic gates",
      "OpenLabs logic gates",
    ],
    alternates: {
      canonical: `/computer-science/logic-gates/${gate.slug}`,
    },
    openGraph: {
      title: gate.pageTitle,
      description: gate.metaDescription,
      url: pageUrl,
      siteName: "OpenLabs",
      type: "website",
      images: [
        {
          url: "/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: `OpenLabs ${gate.name} Simulator`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: gate.pageTitle,
      description: gate.metaDescription,
      images: ["/images/twitter-image.svg"],
    },
  };
}
