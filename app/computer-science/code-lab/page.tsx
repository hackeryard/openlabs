import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Code, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive Code Lab & Execution Visualizer | OpenLabs",
  description: "Write, run, and step through HTML, CSS, JavaScript, and Python code with live call stack, heap memory variables, and execution trace visualization.",
  keywords: [
    "interactive code lab",
    "javascript visualizer",
    "call stack visualizer",
    "event loop simulator",
    "html css js sandbox",
    "code execution tracer",
    "ast parser online",
    "online coding IDE for students"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/code-lab",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/code-lab/html-css-js",
    title: "HTML / CSS / JS Live Sandbox",
    desc: "Real-time multi-file frontend playground with instant DOM rendering, console output, and CSS box-model inspection.",
    tag: "Web Development",
    formula: "DOM Tree + CSSOM ⇒ Render Tree",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/computer-science/code-lab/js",
    title: "JavaScript Runtime & Event Loop Visualizer",
    desc: "Step through execution context frames, closures, Promise microtasks, setTimeout macrotask queues, and heap mutations.",
    tag: "Runtime Tracing",
    formula: "Call Stack ⇄ Web APIs ⇄ Task Queue",
    difficulty: "Intermediate",
    duration: "15 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Coding Sandbox or Runtime Visualizer",
    desc: "Choose between the full-stack HTML/CSS/JS sandbox or the deep JavaScript execution context visualizer.",
  },
  {
    step: 2,
    title: "Write or Paste Source Code Snippets",
    desc: "Enter asynchronous functions, closures, DOM manipulation scripts, or standard algorithmic code.",
  },
  {
    step: 3,
    title: "Step Through Call Stack & Event Loop",
    desc: "Control execution pointer step by step; observe variables populate on the stack and promises queue in the microtask buffer.",
  },
  {
    step: 4,
    title: "Inspect DOM Output & Console Logs",
    desc: "View instant visual rendering, test interactive DOM events, and review clean console output logs.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Execution Context & Scope",
    laws: "Lexical Environment & Variable Hoisting",
    formulas: "EC = { VariableEnvironment, LexicalEnvironment, this }",
    solver: "AST Parsing & Stack Frame Tracer",
  },
  {
    domain: "Concurrency & Event Loop",
    laws: "Single-Threaded Task Queue Scheduling",
    formulas: "Microtasks (Promises) > Macrotasks (Timers/IO)",
    solver: "Discrete Event Loop Simulation Engine",
  },
  {
    domain: "DOM & CSSOM Rendering",
    laws: "Critical Rendering Path & Layout Recalculation",
    formulas: "HTML Tokens → DOM Nodes → Render Tree → Paint",
    solver: "Sandboxed WebWorker Execution Environment",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Live execution pointer tracking",
    desc: "Highlight current active code lines alongside local variable scope values in real time.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Memory heap & stack telemetry",
    desc: "Inspect call stack depths, heap object references, and microtask queues dynamically.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned coding",
    desc: "Directly supports CBSE CS Class 11/12, AP Computer Science Principles, and introductory web development.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Interactive Programming & Runtime Standards",
  description:
    "Our interactive code laboratories adhere to AP Computer Science Principles (Unit 3: Programming Concepts), CBSE Computer Science, and web development fundamentals.",
  secondaryText:
    "Stepping through the JavaScript call stack and event loop clarifies asynchronous programming, scope closures, and callback queues without guessing.",
  telemetryTitle: "Runtime Telemetry",
  telemetryDesc: "Inspect call stack frames, variable allocations, and task queues in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "How does the JavaScript runtime visualizer work?",
    a: "The visualizer parses your code into an Abstract Syntax Tree (AST) using a client-side JavaScript engine. It models the call stack, memory heap, and event loop queues step by step as each statement evaluates.",
  },
  {
    q: "Is code execution secure and sandboxed?",
    a: "Yes. All code runs locally within isolated Web Workers and sandboxed iframes inside your browser. No user code is transmitted to or executed on external servers.",
  },
  {
    q: "Can I inspect asynchronous operations like setTimeout and fetch?",
    a: "Yes. The visualizer explicitly shows how Web API asynchronous callbacks move from the background into the Microtask Queue (Promises) or Callback Queue (Timers) before being pushed onto the Call Stack.",
  },
  {
    q: "Is the OpenLabs Code Lab free for students?",
    a: "Yes. All code sandboxes, debuggers, and visualizers are 100% free and open for educational use.",
  },
];

export default function CodeLabSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Interactive Code Lab"
      subtopicSubtitle="Write, execute, and step through HTML, CSS, and JavaScript with real-time call stack, heap variables, and event loop visualization."
      badgeText="Interactive Code Studio"
      badgeIcon={Code}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Step Through Code Execution Online"
      howToSteps={howToSteps}
      principlesHeading="Runtime Execution Contexts & Event Loop Models"
      principlesDesc="Lexical scope environments and event-driven task queue scheduling executed in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/code-lab"
    />
  );
}
