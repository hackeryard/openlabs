import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Number Theory & Cryptography Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Number Theory simulation. Explore Sieve of Eratosthenes, Euclidean Algorithm & Bézout's identity, modular arithmetic & Chinese Remainder Theorem, Euler's totient, RSA cryptography, and Collatz conjecture orbits.",
  keywords: [
    "number theory simulation",
    "prime factorization interactive",
    "sieve of eratosthenes visualizer",
    "euclidean algorithm gcd tiling",
    "bezout identity solver",
    "chinese remainder theorem calculator",
    "rsa encryption simulator",
    "euler totient function wheel",
    "collatz conjecture 3n+1 graph",
  ],
};

const NumberTheoryLab = dynamic(
  () => import("@/app/components/mathematics/number-theory/NumberTheoryLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Number Theory Engine & Prime Sieves..."
      />
    ),
  }
);

export default function NumberTheoryLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <NumberTheoryLab />
    </main>
  );
}
