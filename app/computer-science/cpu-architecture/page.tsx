import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

export const metadata: Metadata = {
  title: "Intel 8085 & SAP-1 Microprocessor Architecture Virtual Lab | OpenLabs",
  description: "Explore the Intel 8085 & SAP-1 8-bit microprocessor hardware datapath, ALU, register array (A, B, C, D, E, H, L, SP, PC), timing control signals, flags, and assembly opcode execution online.",
  keywords: [
    "8085 microprocessor simulation online",
    "sap 1 cpu architecture virtual lab",
    "microprocessor register array datapath",
    "8 bit alu accumulator flags",
    "timing and control unit machine cycles",
    "assembly instruction execution online",
    "computer science virtual lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/cpu-architecture",
  },
  openGraph: {
    title: "Intel 8085 Microprocessor Architecture Virtual Lab | OpenLabs",
    description: "Explore 8085 hardware registers, ALU, timing control matrices, machine cycles, and interactive opcode execution in real time.",
    url: "https://www.openlabs.org.in/computer-science/cpu-architecture",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/computer-science/cpu-hero.png",
        alt: "Intel 8085 Microprocessor Architecture | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intel 8085 Microprocessor Architecture Virtual Lab | OpenLabs",
    description: "Explore 8085 hardware registers, ALU, timing control matrices, machine cycles, and interactive opcode execution in real time.",
    images: ["https://www.openlabs.org.in/images/computer-science/cpu-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cpuContent = {
  slug: "cpu-architecture",
  subject: "Computer Science",
  title: "Intel 8085 & SAP-1 Microprocessor Architecture",
  description: "An interactive computer systems engineering laboratory simulating the complete Intel 8085 and SAP-1 8-bit microprocessor datapath, general-purpose register arrays, ALU subsystem, status flags, and instruction decoder.",
  difficulty: "Advanced" as const,
  estimatedTime: "30 minutes",
  heroDescription: "Step inside the heart of an 8-bit microprocessor. Inject custom 8085 assembly instructions (MVI, MOV, ADD, SUB, ANA, INR, XCHG, HLT), adjust clock speeds, trace data across the internal bidirectional bus, and watch register updates and ALU status flags in real time.",
  theory: {
    content: `
      <p>A <strong>Microprocessor</strong> is a programmable, clock-driven electronic integrated circuit that fetches binary instructions from memory, decodes them into control signals, and executes arithmetic, logical, and data transfer operations. The <strong>Intel 8085</strong> is a landmark 8-bit microprocessor architecture featuring an 8-bit internal data bus and a 16-bit address bus capable of addressing up to 64 KB of memory.</p>
      <p>The core hardware datapath comprises five major functional subsystems:</p>
      <ul>
        <li><strong>ALU & Accumulator (A) Subsystem</strong>: Performs 8-bit arithmetic (ADD, SUB) and Boolean logic (AND, OR, XOR), working in conjunction with an 8-bit Temporary Register (TR) and updating a 5-bit <strong>Flag Register</strong> ($S$, $Z$, $AC$, $P$, $CY$).</li>
        <li><strong>Register Array</strong>: Six 8-bit general-purpose registers ($B$, $C$, $D$, $E$, $H$, $L$) that can be paired as 16-bit registers ($BC$, $DE$, $HL$, where $HL$ serves as the default memory pointer $[M]$).</li>
        <li><strong>Special-Purpose Registers</strong>: 16-bit <strong>Program Counter (PC)</strong> (holding next instruction address) and 16-bit <strong>Stack Pointer (SP)</strong> (tracking LIFO top-of-stack).</li>
        <li><strong>Timing & Control Matrix</strong>: Generates hardware synchronization and enable signals ($\\overline{RD}$, $\\overline{WR}$, $ALE$, $IO/\\overline{M}$, $S_0$, $S_1$, $CLK$) across micro-state clock cycles ($T_1$ to $T_6$).</li>
        <li><strong>Interrupt & Serial I/O Controller</strong>: Hardware pins for prioritized interrupts ($TRAP$, $RST\\ 7.5$, $RST\\ 6.5$, $RST\\ 5.5$, $INTR$) and serial lines ($SID$, $SOD$).</li>
      </ul>
    `
  },
  learningObjectives: [
    "Trace the Fetch-Decode-Execute instruction cycle through machine cycles (M1 Opcode Fetch, M2 Memory Read/Write).",
    "Identify the operational roles of the Accumulator (A), Temporary Register (TR), and 5 status flags (Sign, Zero, Auxiliary Carry, Parity, Carry).",
    "Explain how tri-state buffers (High-Z) prevent bus contention on shared internal bidirectional data trunks.",
    "Write and execute custom 8085 assembly instructions (MVI, MOV, ADD, SUB, ANA, ORA, XRA, INR, DCR, XCHG) in real time."
  ],
  mathematicalFoundations: {
    equations: [
      "f_{\\text{clock}} = \\frac{1}{T_{\\text{state}}} \\text{ (Clock Frequency)}",
      "\\text{Execution Time} = \\sum (T_{\\text{states}}) \\times T_{\\text{clk}}",
      "\\text{HL Pointer Address} = (H \\ll 8) \\mid L = H \\times 256 + L",
      "\\text{Flag Register Byte} = (S \\ll 7) \\mid (Z \\ll 6) \\mid (AC \\ll 4) \\mid (P \\ll 2) \\mid 0x02 \\mid CY"
    ],
    explanation: "Opcode Fetch (M1) requires 4 clock T-states (T1-T4), whereas standard Memory Read/Write cycles (M2, M3) require 3 T-states each. Microprocessor throughput is determined by total instruction T-state counts."
  },
  realWorldApplications: [
    "Embedded Microcontroller Systems: Automotive engine control units (ECUs), industrial PLCs, and home appliance motor controllers.",
    "Aerospace & Defense: Radiation-hardened microprocessors operating satellite flight computers and missile guidance telemetry.",
    "Operating System Kernels: Low-level interrupt handling, register context switching, and stack pointer memory virtualization.",
    "Compiler Design: Translating high-level programming language syntax (C/Rust) into machine opcode instructions and register allocations."
  ],
  howItWorks: "Type any valid 8085 instruction into the interactive Assembly Console (e.g. 'MVI A, 45H', 'ADD B', 'MOV M, A') and click Execute, or select from the library of pre-loaded algorithms (Addition & Flags, HL Memory Transfer, Logic Operations, Subtraction). Adjust the clock frequency slider (0.5 Hz to 10 Hz) and use Run / Single Step buttons to follow data transfer across the glowing 8-bit bus, watch register values change, and inspect status flag updates.",
  faqs: [
    {
      question: "Why do hardware registers require Tri-State Buffers (High-Z) to connect to a common bus?",
      answer: "A physical bus is a shared group of copper wire tracks. If multiple hardware registers drove electrical voltages (0V and 5V) onto the same wire simultaneously, it would create short circuits and bus contention. Tri-State buffers have three states: Logic 0, Logic 1, and High-Impedance (High-Z). In High-Z, a register is electrically disconnected, allowing exactly one register to drive the bus per clock cycle."
    },
    {
      question: "What is the purpose of the HL register pair acting as a memory pointer [M]?",
      answer: "The 8085 data bus is 8 bits wide, but its address bus is 16 bits wide (addressing 64 KB). The H (High) and L (Low) registers combine to store a full 16-bit memory address. In instructions referencing memory operand 'M' (such as MOV A, M or ADD M), the CPU automatically uses the 16-bit address formed by HL to access the external RAM byte."
    },
    {
      question: "What is the difference between TRAP and other hardware interrupts?",
      answer: "TRAP is a non-maskable, highest-priority interrupt that is both edge- and level-sensitive, used for emergency events like sudden power failure. Other interrupts (RST 7.5, 6.5, 5.5, and INTR) are maskable and can be disabled by software instructions (DI / SIM)."
    }
  ],
  relatedExperiments: []
};

export default function CpuArchitectureLandingPage() {
  return (
    <EducationalLandingLayout 
      content={cpuContent} 
      launchUrl="/labs/computer-science/cpu-architecture" 
    />
  );
}
