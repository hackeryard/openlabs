import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Theory & Cryptography - Interactive Virtual Math Lab | OpenLabs",
  description:
    "Master prime numbers, Sieve of Eratosthenes, Euclidean algorithm, Bézout's identity, modular arithmetic, Euler's totient, RSA cryptography, and the Collatz conjecture with our interactive laboratory.",
  keywords: [
    "number theory virtual lab",
    "prime factorization visualizer",
    "sieve of eratosthenes interactive",
    "extended euclidean algorithm bezout",
    "modular inverse calculator",
    "chinese remainder theorem crt",
    "rsa public key encryption",
    "euler totient theorem",
    "collatz conjecture trajectory",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/number-theory",
  },
  openGraph: {
    title: "Number Theory & Cryptography - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore primes, modular arithmetic, RSA cryptography, and the Euclidean algorithm.",
    url: "https://www.openlabs.org.in/mathematics/number-theory",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Number Theory Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Theory & Cryptography - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Interactive number theory, prime sieves, RSA cryptography, and modular arithmetic.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "number-theory",
  subject: "Mathematics",
  title: "Number Theory & Cryptography",
  description:
    "Explore the 'Queen of Mathematics': from prime numbers and the Euclidean algorithm to modular arithmetic, Euler's totient function, RSA public-key encryption, and the Collatz conjecture.",
  difficulty: "Intermediate",
  estimatedTime: "25 mins",
  heroDescription:
    "Discover how the deep algebraic structure of whole numbers powers modern cybersecurity, cryptocurrency, public-key ciphers, and algorithmic efficiency.",
  theory: {
    content: `<p><strong>Number Theory</strong> is the branch of pure mathematics devoted primarily to the study of the integers and integer-valued functions. Once celebrated as the purest of theoretical pursuits, it is today the indispensable foundation of global cryptography, information security, and computer algorithms.</p>
    <h3>The Fundamental Theorem of Arithmetic</h3>
    <p>Every integer <code>n > 1</code> either is a prime itself or can be represented as the product of prime numbers in a way that is unique up to the order of the factors:</p>
    <p><code>n = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}</code></p>
    <h3>The Euclidean Algorithm & Bézout's Identity</h3>
    <p>The greatest common divisor <code>\\gcd(a, b)</code> can be computed rapidly by successive division: <code>a = bq + r</code>. <strong>Bézout's identity</strong> states that integers <code>x</code> and <code>y</code> always exist such that:</p>
    <p><code>ax + by = \\gcd(a, b)</code></p>
    <p>This allows finding modular multiplicative inverses: <code>ax \\equiv 1 \\pmod m</code> if and only if <code>\\gcd(a, m) = 1</code>.</p>
    <h3>Modular Arithmetic & Chinese Remainder Theorem</h3>
    <p>Two integers are congruent modulo <code>m</code> (written <code>a \\equiv b \\pmod m</code>) if <code>m | (a - b)</code>. The <strong>Chinese Remainder Theorem (CRT)</strong> guarantees a unique solution modulo <code>M = m_1 m_2 \\cdots m_k</code> for simultaneous congruences when moduli are pairwise coprime.</p>
    <h3>Euler's Totient & Fermat's Little Theorem</h3>
    <p>Euler's totient function <code>\\phi(n)</code> counts integers up to <code>n</code> coprime to <code>n</code>:</p>
    <p><code>\\phi(n) = n \\prod_{p | n} \\left(1 - \\frac{1}{p}\\right)</code></p>
    <p><strong>Euler's Generalization:</strong> For <code>\\gcd(a, n) = 1</code>, <code>a^{\\phi(n)} \\equiv 1 \\pmod n</code>. (When <code>n = p</code> is prime, <code>a^{p-1} \\equiv 1 \\pmod p</code>, which is Fermat's Little Theorem).</p>
    <h3>RSA Public-Key Cryptography</h3>
    <p>RSA relies on the mathematical asymmetry of prime factorization: multiplying two large primes <code>p</code> and <code>q</code> to compute <code>n = pq</code> is computationally trivial, but factoring <code>n</code> back into <code>p</code> and <code>q</code> is intractable.</p>
    <ul>
      <li><strong>Public Key:</strong> <code>(e, n)</code> where <code>\\gcd(e, \\phi(n)) = 1</code>.</li>
      <li><strong>Private Key:</strong> <code>(d, n)</code> where <code>d \\equiv e^{-1} \\pmod{\\phi(n)}</code>.</li>
      <li><strong>Encryption:</strong> <code>C = M^e \\pmod n</code>.</li>
      <li><strong>Decryption:</strong> <code>M = C^d \\pmod n</code>.</li>
    </ul>`,
  },
  mathematicalFoundations: {
    equations: [
      "n = \\prod_{i=1}^k p_i^{a_i}",
      "ax + by = \\gcd(a, b) \\quad \\text{(Bézout's Identity)}",
      "\\phi(n) = n \\prod_{p | n} \\left(1 - \\frac{1}{p}\\right)",
      "a^{\\phi(n)} \\equiv 1 \\pmod n \\quad \\text{(Euler's Theorem)}",
      "C = M^e \\pmod n \\implies M = C^d \\pmod n \\quad \\text{(RSA)}",
    ],
    explanation:
      "Modular exponentiation and prime factorization forms the security pillar of public-key cryptography (RSA, Diffie-Hellman, Elliptic Curve Cryptography), guaranteeing end-to-end encryption across the internet.",
  },
  learningObjectives: [
    "Visualize prime sieving with the Sieve of Eratosthenes and decompose numbers into prime factor trees.",
    "Perform the Euclidean algorithm and Extended Euclidean Algorithm (EEA) to find Bézout coefficients.",
    "Explore modular clock arithmetic, multiplicative inverses, and Chinese Remainder Theorem systems.",
    "Compute Euler's Totient function phi(n) and verify Fermat's Little Theorem.",
    "Generate RSA public and private key pairs and encrypt/decrypt messages via square-and-multiply exponentiation.",
    "Analyze Collatz 3n + 1 trajectories, stopping times, and continued fraction representations.",
  ],
  realWorldApplications: [
    "Cybersecurity, SSL/TLS certificates, and HTTPS web encryption",
    "Cryptocurrency, blockchain consensus, and digital signatures (ECDSA)",
    "Hash tables, checksums, and pseudo-random number generation (PRNG)",
    "Signal processing and fast Fourier transforms via number theoretic transforms (NTT)",
  ],
  howItWorks:
    "Filter prime numbers in the sieve, tile rectangles to compute GCDs, spin the modular clock wheel, generate RSA key pairs, and plot Collatz orbits in real time.",
  faqs: [
    {
      question: "Why is RSA encryption considered secure?",
      answer:
        "RSA security is backed by the integer factorization problem. While multiplying two 1024-bit primes takes milliseconds, finding the original factors from a 2048-bit composite number takes billions of CPU years on classical computers.",
    },
    {
      question: "What is Bézout's identity used for?",
      answer:
        "Bézout's identity ax + by = gcd(a, b) is used to find modular multiplicative inverses, solve linear Diophantine equations, and construct private decryption keys in asymmetric cryptography.",
    },
    {
      question: "What is the Collatz Conjecture?",
      answer:
        "The Collatz Conjecture (or 3n + 1 problem) posits that beginning with any positive integer n, repeatedly applying n -> n/2 (even) or 3n+1 (odd) will always eventually reach the repeating cycle 4 -> 2 -> 1.",
    },
  ],
  relatedExperiments: [],
};

export default function NumberTheoryLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/number-theory"
    />
  );
}
