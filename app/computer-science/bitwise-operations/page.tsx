import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

export const metadata: Metadata = {
  title: "Binary & Bitwise Operations Digital Logic Virtual Lab | OpenLabs",
  description: "Explore 8-bit binary registers, Boolean logic gates (AND, OR, XOR, NOT, NAND, NOR, XNOR), bit shifts, circular rotations, Two's complement conversion, and bit twiddling hacks online.",
  keywords: [
    "bitwise operations simulation online",
    "binary logic gates virtual lab",
    "twos complement calculator",
    "bit shift circular rotation simulator",
    "bit manipulation bit twiddling hacks",
    "boolean algebra truth table",
    "computer science virtual lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/bitwise-operations",
  },
  openGraph: {
    title: "Binary & Bitwise Operations Virtual Lab | OpenLabs",
    description: "Explore 8-bit binary logic gates, bit shifts, Two's complement representation, and high-performance bit twiddling hacks in real time.",
    url: "https://www.openlabs.org.in/computer-science/bitwise-operations",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/computer-science/bitwise-hero.png",
        alt: "Binary & Bitwise Operations Digital Logic | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Binary & Bitwise Operations Virtual Lab | OpenLabs",
    description: "Explore 8-bit binary logic gates, bit shifts, Two's complement representation, and high-performance bit twiddling hacks in real time.",
    images: ["https://www.openlabs.org.in/images/computer-science/bitwise-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const bitwiseContent = {
  slug: "bitwise-operations",
  subject: "Computer Science",
  title: "Binary & Bitwise Operations Studio",
  description: "An interactive digital logic and systems programming simulation modeling 8-bit register manipulation, Boolean logic gate circuits, arithmetic/logical bit shifts, Two's complement signed integer encoding, and bit twiddling algorithms.",
  difficulty: "Beginner" as const,
  estimatedTime: "20 minutes",
  heroDescription: "Master the foundational binary language of computing. Toggle individual bits on interactive 8-bit register tiles, evaluate parallel Boolean logic gates (AND, OR, XOR, NOT, NAND, NOR, XNOR), perform bit shifts and circular rotations, convert Two's complement negative integers, and execute high-speed bit twiddling hacks.",
  theory: {
    content: `
      <p><strong>Bitwise Operations</strong> are primitive low-level operations that manipulate individual binary digits (bits: 0 or 1) at the hardware register level. In digital computers, data is represented in binary format where each bit represents a power of two ($2^0, 2^1, \\dots, 2^7$ in an 8-bit byte, with values ranging from $0$ to $255$ unsigned).</p>
      <p>Core bitwise primitives include:</p>
      <ul>
        <li><strong>AND (&)</strong>: Yields 1 if and only if both input bits are 1; used for <em>bit masking</em> (extracting specific bit fields).</li>
        <li><strong>OR (|)</strong>: Yields 1 if either input bit is 1; used for <em>setting bits</em> to 1.</li>
        <li><strong>XOR (^)</strong>: Yields 1 if input bits differ; used for <em>toggling bits</em>, parity generation, and cryptographic stream ciphers.</li>
        <li><strong>NOT (~)</strong>: Inverts every bit (one's complement).</li>
        <li><strong>Bit Shifts (<<, >>)</strong>: Left shift ($x \\ll n$) multiplies by $2^n$; Logical Right shift ($x \\gg n$) divides by $2^n$.</li>
      </ul>
      <p>Signed integers are represented using <strong>Two's Complement</strong>, where the Most Significant Bit (MSB, bit 7) serves as the sign bit with negative positional weight ($-2^7 = -128$), enabling negative and positive arithmetic addition with identical hardware circuitry.</p>
    `
  },
  learningObjectives: [
    "Construct truth tables and compute outputs for all fundamental Boolean bitwise operators (AND, OR, XOR, NOT, NAND, NOR, XNOR).",
    "Calculate integer multiplication and division using bitwise left shift (<<) and right shift (>>).",
    "Perform Two's complement negation (~x + 1) and determine signed decimal values (-128 to +127).",
    "Apply bit twiddling algorithms (e.g. isolating lowest set bit x & -x, checking power of two x & (x - 1) == 0, XOR swap without temporary storage)."
  ],
  mathematicalFoundations: {
    equations: [
      "x \\ll n = x \\times 2^n \\pmod{256}",
      "x \\gg n = \\lfloor x / 2^n \\rfloor",
      "-x = \\sim x + 1 \\text{ (Two's Complement Negation)}",
      "\\text{Signed Value} = -b_7 \\cdot 2^7 + \\sum_{i=0}^{6} b_i \\cdot 2^i",
      "\\text{Lowest Set Bit} = x \\,\\&\\, (-x)"
    ],
    explanation: "Two's complement avoids the ambiguity of dual zeros (+0 and -0) found in sign-magnitude representations and allows standard binary adders to compute subtractions directly as A - B = A + (~B + 1)."
  },
  realWorldApplications: [
    "Computer Graphics & Alpha Masking: Extracting RGBA color channels (Red = (pixel >> 24) & 0xFF) and fast bitmask sprite collision detection.",
    "Network Engineering & Subnetting: Applying IPv4 subnet masks (e.g. IP & 255.255.255.0) to isolate network and host addresses.",
    "Cryptography & Hashing: High-speed bitwise rotations and XOR operations forming the core rounds of AES, SHA-256, and ChaCha20.",
    "Data Compression: Huffman encoding and bit-packing arrays to minimize memory footprint in high-frequency trading engines."
  ],
  howItWorks: "Click individual bit buttons on Register A and Register B to toggle their states (0 or 1). Select any logic operator (AND, OR, XOR, NOT, NAND, NOR, XNOR, SHL, SHR, ROL, ROR) to watch the result compute instantaneously. Toggle Signed Mode to inspect Two's complement interpretations, or browse the Bit Hacks tab to test famous bit manipulation algorithms.",
  faqs: [
    {
      question: "Why does x & (x - 1) determine whether a number is a power of two?",
      answer: "A positive integer is a power of two if and only if its binary representation has exactly one '1' bit (e.g., 8 is 00001000). Subtracting 1 inverts that single set bit and sets all lower trailing zeros to 1 (8 - 1 = 7 is 00000111). Performing a bitwise AND between x and x-1 yields 0. For any other number with multiple set bits, the highest set bit remains untouched, yielding a non-zero result."
    },
    {
      question: "How does the XOR variable swap trick work without temporary memory?",
      answer: "The algorithm executes three steps: 1) a = a ^ b; 2) b = a ^ b; 3) a = a ^ b. Because XOR is commutative, associative, and its own inverse (x ^ x = 0 and x ^ 0 = x), substituting step 1 into step 2 gives b = (a_orig ^ b_orig) ^ b_orig = a_orig. Substituting into step 3 gives a = (a_orig ^ b_orig) ^ a_orig = b_orig, swapping both variables."
    },
    {
      question: "What is the difference between an arithmetic right shift and a logical right shift?",
      answer: "A logical right shift always fills the newly created leftmost vacant bit positions with zeros (0). An arithmetic right shift preserves the sign bit (MSB) by replicating the original sign bit (0 for positive, 1 for negative), ensuring correct division by powers of two for signed negative numbers."
    }
  ],
  relatedExperiments: []
};

export default function BitwiseLandingPage() {
  return (
    <EducationalLandingLayout 
      content={bitwiseContent} 
      launchUrl="/labs/computer-science/bitwise-operations" 
    />
  );
}
