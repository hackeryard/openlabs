import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Cpu, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Logic Gates & Digital Circuits Simulator | OpenLabs",
  description: "Explore interactive digital logic gates including AND, OR, NOT, NAND, NOR, XOR, and XNOR through real-time truth tables, boolean algebra, and circuit wiring.",
  keywords: [
    "logic gates simulator",
    "digital circuits online",
    "and gate simulator",
    "or gate truth table",
    "xor gate interactive",
    "nand universal gate",
    "boolean algebra simplifier",
    "cbse computer science logic gates"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/logic-gates",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/logic-gates/and-gate",
    title: "AND Gate Simulator",
    desc: "Output is HIGH (1) if and only if all input signals are HIGH. Explore two-input and multi-input configurations.",
    tag: "Basic Gates",
    formula: "Y = A · B",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/computer-science/logic-gates/or-gate",
    title: "OR Gate Simulator",
    desc: "Output is HIGH (1) if at least one input signal is HIGH. Test inclusive OR logic against live truth tables.",
    tag: "Basic Gates",
    formula: "Y = A + B",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/computer-science/logic-gates/not-gate",
    title: "NOT Inverter Gate",
    desc: "Inverts input logic level: turns HIGH into LOW (0) and LOW into HIGH (1). Fundamental digital signal negation.",
    tag: "Basic Gates",
    formula: "Y = A'",
    difficulty: "Beginner",
    duration: "5 min",
  },
  {
    href: "/computer-science/logic-gates/nand-gate",
    title: "NAND Universal Gate",
    desc: "Universal logic gate capable of constructing any boolean function. Output is LOW only when all inputs are HIGH.",
    tag: "Universal Gates",
    formula: "Y = (A · B)'",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    href: "/computer-science/logic-gates/nor-gate",
    title: "NOR Universal Gate",
    desc: "Universal logic gate that outputs HIGH only when all inputs are LOW. Explore De Morgan's dual construction.",
    tag: "Universal Gates",
    formula: "Y = (A + B)'",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    href: "/computer-science/logic-gates/xor-gate",
    title: "XOR Exclusive-OR Gate",
    desc: "Outputs HIGH if an odd number of inputs are HIGH (inequality detector). Essential for binary adders and parity.",
    tag: "Arithmetic Gates",
    formula: "Y = A ⊕ B = A'B + AB'",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/logic-gates/xnor-gate",
    title: "XNOR Equivalence Gate",
    desc: "Outputs HIGH when both inputs are identical (equality comparator). Fundamental for binary equality checks.",
    tag: "Arithmetic Gates",
    formula: "Y = (A ⊕ B)' = AB + A'B'",
    difficulty: "Intermediate",
    duration: "12 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Logic Gate or Universal Circuit",
    desc: "Choose between basic gates (AND, OR, NOT), universal gates (NAND, NOR), or arithmetic gates (XOR, XNOR).",
  },
  {
    step: 2,
    title: "Toggle Binary Inputs (0 / 1)",
    desc: "Click interactive input switches to change binary voltage levels and observe immediate digital output state updates.",
  },
  {
    step: 3,
    title: "Inspect Synchronized Truth Table",
    desc: "Watch the active truth table row highlight dynamically matching your real-time switch configuration.",
  },
  {
    step: 4,
    title: "Verify Boolean Theorems & Export",
    desc: "Validate De Morgan's laws, Karnaugh map minimizations, and export circuit logic state diagrams.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Boolean Algebra",
    laws: "De Morgan's Laws & Duals",
    formulas: "(A · B)' = A' + B', (A + B)' = A' · B'",
    solver: "Deterministic Truth Table Evaluation Engine",
  },
  {
    domain: "Universal Logic",
    laws: "Functional Completeness of NAND / NOR",
    formulas: "NOT(A) = A NAND A, AND(A, B) = (A NAND B) NAND (A NAND B)",
    solver: "Universal Gate Tree Expansion Compiler",
  },
  {
    domain: "Binary Arithmetic",
    laws: "Half Adder & Full Adder Logic",
    formulas: "Sum = A ⊕ B, Carry = A · B",
    solver: "Combinational Ripple Propagation Simulator",
  },
  {
    domain: "Propagation & Signal Delay",
    laws: "Gate Switching Latency & Glitch Dynamics",
    formulas: "t_pd = (t_pHL + t_pLH) / 2",
    solver: "Topological Netlist Event-Driven Propagation",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Interactive switch manipulation",
    desc: "Toggle binary inputs with instant output rendering and signal flow animations.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Live truth table highlighting",
    desc: "Watch active input states highlight in real time across the full truth table matrix.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned digital logic",
    desc: "Structured alongside CBSE CS Class 11 Boolean Logic and AP Computer Science Principles.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Digital Logic & Boolean Algebra Educational Standards",
  description:
    "Our interactive logic gate simulators follow CBSE Computer Science Class 11 (Boolean Logic & Circuits), AP Computer Science Principles (Binary & Logic), and undergraduate Digital Circuit Design (ECE/CS).",
  secondaryText:
    "Students build solid foundations in binary boolean operations, canonical sum-of-products (SOP), and universal gate construction before moving on to full CPU architectures.",
  telemetryTitle: "Signal Telemetry",
  telemetryDesc: "Inspect binary voltage states, propagation delays, and gate fan-out in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "Why are NAND and NOR called universal logic gates?",
    a: "NAND and NOR gates are functionally complete, meaning any boolean logic function or digital circuit (AND, OR, NOT, XOR, adders, latches) can be constructed solely using interconnected NAND or NOR gates.",
  },
  {
    q: "How does the XOR gate function in binary arithmetic?",
    a: "The XOR (Exclusive OR) gate acts as a binary 1-bit adder: it produces a Sum of 1 when either input is 1, and 0 when both inputs are 0 or 1. Coupled with an AND gate (for the Carry bit), it forms a fundamental Half Adder.",
  },
  {
    q: "Can I combine multiple logic gates into custom circuits?",
    a: "Yes. OpenLabs provides combinational circuit modules where you can wire gates together to create half adders, full adders, multiplexers, and SR latches.",
  },
  {
    q: "Is the OpenLabs Logic Gates simulator free for schools?",
    a: "Yes. All logic gate modules, truth tables, and circuit simulators are 100% free with no account requirements.",
  },
];

export default function LogicGatesSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Logic Gates & Digital Circuits"
      subtopicSubtitle="Explore interactive truth tables, boolean algebra, and digital signal flow for AND, OR, NOT, NAND, NOR, XOR, and XNOR gates."
      badgeText="Digital Logic Suite"
      badgeIcon={Cpu}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Simulate Logic Gates & Truth Tables Online"
      howToSteps={howToSteps}
      principlesHeading="Boolean Logic Theorems & Combinational Models"
      principlesDesc="Exact truth table evaluations and topological netlist propagation models executed in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/logic-gates"
    />
  );
}