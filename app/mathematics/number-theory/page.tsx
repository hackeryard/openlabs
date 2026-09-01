import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Number Theory & Cryptography | OpenLabs",
  description: "Master prime numbers, Sieve of Eratosthenes, Euclidean algorithm, Bézout's identity, modular arithmetic, Euler's totient, RSA cryptography, and the Collatz conjecture online.",
  keywords: [
    "number theory virtual lab",
    "prime factorization visualizer",
    "sieve of eratosthenes interactive",
    "extended euclidean algorithm bezout",
    "modular inverse calculator",
    "rsa public key encryption",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/number-theory",
  },
  openGraph: {
    title: "Number Theory & Cryptography | OpenLabs",
    description: "Explore primes, modular arithmetic, RSA cryptography, and the Euclidean algorithm in real time.",
    url: "https://www.openlabs.org.in/mathematics/number-theory",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/number-theory-hero.png",
        alt: "Number Theory Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Theory & Cryptography | OpenLabs",
    description: "Interactive number theory, prime sieves, RSA cryptography, and modular arithmetic.",
    images: ["https://www.openlabs.org.in/images/mathematics/number-theory-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NumberTheoryLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="number-theory"
      title="Number Theory & Modern Cryptography"
      description="Pure mathematics laboratory exploring Prime Factorization, the Sieve of Eratosthenes, Euclidean GCD geometric tiling, Modular Clock Arithmetic, and RSA Public-Key Encryption."
      heroDescription="Explore the 'Queen of Mathematics' and the bedrock of modern internet cybersecurity. Sieve for primes, compute greatest common divisors via the Euclidean algorithm, evaluate modular multiplicative inverses, and encrypt/decrypt messages using the RSA asymmetric key cipher."
      theory="Number theory studies the algebraic properties of integers (ℤ). By the Fundamental Theorem of Arithmetic, every integer n > 1 has a unique prime factorization. The Euclidean Algorithm computes gcd(a, b) in logarithmic time, with Bézout's Identity guaranteeing integers x, y such that ax + by = gcd(a, b). Modern RSA cryptography exploits the computational asymmetry between prime multiplication (easy) and prime factorization of large semiprimes n = p·q (intractable), relying on Euler's Totient Theorem: a^φ(n) ≡ 1 (mod n)."
      formula="\gcd(a,b) = ax + by \quad \text{and} \quad a^{\phi(n)} \equiv 1 \pmod n \quad \text{and} \quad \text{RSA: } c \equiv m^e \pmod n, \; m \equiv c^d \pmod n"
      formulaLabel="Bézout's Identity, Euler's Totient Theorem & RSA Encryption"
      launchUrl="/labs/mathematics/number-theory"
      heroImageUrl="/images/mathematics/number-theory-hero.png"
      visualLabel="Sieve of Eratosthenes & RSA Cipher Engine"
      visualDetail="Interactive Sieve Grid to 1000 • Euclidean Rectangle Tiling • Live RSA Key Generation (p, q, e, d)"
      accent={{ primary: "#059669", secondary: "#d97706", warm: "#38bdf8" }}
      learningObjectives={[
        "Execute the Sieve of Eratosthenes to identify prime numbers up to n.",
        "Apply the Extended Euclidean Algorithm to compute the Greatest Common Divisor and modular inverse (a⁻¹ mod m).",
        "Explain the mathematical principles of RSA Public-Key Cryptography (key generation, encryption c = m^e mod n, decryption m = c^d mod n).",
        "Trace Collatz conjecture orbits (3n + 1 problem) and observe stopping times.",
      ]}
      applications={[
        "Public-Key Infrastructure (PKI), TLS/SSL HTTPS Certificates, and SSH Authentication.",
        "Cryptocurrency Blockchain Proof-of-Work (SHA-256 modular hashing).",
        "Error-Correcting Codes & Hash Functions (Reed-Solomon codes in QR codes and satellite signals).",
        "Pseudo-Random Number Generators (Linear Congruential Generators in simulations).",
      ]}
      faqs={[
        {
          question: "Why is RSA encryption considered secure against modern classical computers?",
          answer:
            "Multiplying two large prime numbers p and q (each 1024 or 2048 bits long) takes fractions of a millisecond. However, finding the prime factors p and q given only their product n = p·q has no known polynomial-time classical algorithm and would require millions of years of brute-force computation with current supercomputers.",
        },
        {
          question: "What is Euler's Totient Function φ(n)?",
          answer:
            "Euler's totient function φ(n) counts the number of positive integers up to n that are coprime to n (share no common factors other than 1). For a prime p, φ(p) = p - 1. For the product of two primes n = p·q, φ(n) = (p - 1)(q - 1).",
        },
      ]}
    />
  );
}
