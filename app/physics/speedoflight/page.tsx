import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Speed of Light Measurement & Time-of-Flight Studio | OpenLabs",
  description:
    "Interactive physics simulation of historical and modern speed of light measurements: Fizeau toothed wheel (1849), Foucault rotating mirror, multi-media refractive race, and time-of-flight picosecond telemetry.",
  keywords: [
    "speed of light simulation",
    "Fizeau toothed wheel",
    "Foucault rotating mirror",
    "refractive index speed of light",
    "time of flight measurement",
    "SI constant c",
    "299792458 m/s",
    "Michelson interferometer",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/speedoflight",
  },
  openGraph: {
    title: "Speed of Light Measurement & Time-of-Flight Studio | OpenLabs",
    description:
      "Simulate historical Fizeau toothed-wheel extinction, multi-media photon races (Vacuum, Air, Water, Glass, Diamond), and picosecond time-of-flight round trips.",
    url: "https://www.openlabs.org.in/physics/speedoflight",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/speed-of-light-hero.png",
        alt: "Speed of Light Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speed of Light Measurement & Time-of-Flight Studio | OpenLabs",
    description:
      "Interactive speed of light laboratory: Fizeau toothed wheel, refractive media speed race, and time-of-flight telemetry.",
    images: ["https://www.openlabs.org.in/images/physics/speed-of-light-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SpeedOfLightPage() {
  return (
    <PhysicsExperimentLanding
      slug="speedoflight"
      title="Speed of Light & Time-of-Flight"
      description="Historical Fizeau toothed-wheel apparatus, Foucault rotating mirrors, multi-media refractive speeds, and picosecond time-of-flight telemetry."
      heroDescription="Explore the universal speed limit c = 299,792,458 m/s. Recreate Armand Fizeau's 1849 Parisian baseline across 8.63 km with a spinning 720-tooth cogwheel, simulate photon races through vacuum, water, glass, and diamond, and analyze lunar laser ranging round-trips."
      theory="The speed of light in vacuum c is a fundamental physical constant defined exactly as 299,792,458 m/s by the 17th CGPM in 1983. In dielectric media with refractive index n, electromagnetic waves propagate at phase velocity v = c / n due to continuous atomic polarization. In Armand Fizeau's 1849 experiment, a pulse of light passed through a spinning toothed wheel (N teeth) to a distant mirror at distance D; extinction occurs when the wheel rotates by half a tooth during the round trip (t = 2D/c = 1/(2Nω)), yielding c = 4NDω."
      formula="c = 4ND\omega \quad \text{and} \quad v = \frac{c}{n}"
      formulaLabel="Fizeau Extinction & Medium Phase Velocity Equations"
      launchUrl="/labs/physics/speedoflight"
      heroImageUrl="/images/physics/speed-of-light-hero.png"
      visualLabel="Optical Apparatus"
      visualDetail="Baseline D, teeth count N, angular velocity ω, refractive index n"
      accent={{ primary: "#10b981", secondary: "#38bdf8", warm: "#f59e0b" }}
      learningObjectives={[
        "Derive the Fizeau extinction condition: c = 4NDω from tooth angular displacement during round-trip time.",
        "Calculate phase velocity v = c/n and optical delay across Vacuum, Air, Water, Glass, and Diamond.",
        "Understand why the SI metre is defined via the fixed constant speed of light (1/299,792,458 s).",
        "Explore real-world time-of-flight applications, including Apollo lunar laser ranging (2.56s delay) and subsea fiber optics.",
        "Analyze the null result of the Michelson-Morley interferometer and its implications for special relativity.",
      ]}
      applications={[
        "Global Positioning System (GPS) satellite nanosecond trilateration",
        "Apollo Lunar Laser Ranging (LLR) for general relativity verification",
        "Transcontinental submarine fiber optic communication latency optimization",
        "Laser Detection and Ranging (LiDAR) autonomous vehicle navigation",
        "High-precision laser rangefinders & optical time-domain reflectometry (OTDR)",
      ]}
      faqs={[
        {
          question: "How did Armand Fizeau measure the speed of light without electronics in 1849?",
          answer:
            "Fizeau directed a light beam from Suresnes to a mirror in Montmartre (8.63 km away) through the teeth of a spinning cogwheel with 720 teeth. As he increased the rotational speed, light passing through a tooth gap on the outbound trip was blocked by the adjacent incoming tooth upon return. At ω = 12.6 rps, the light was completely eclipsed, allowing him to compute c = 4NDω ≈ 313,000 km/s.",
        },
        {
          question: "Why is the speed of light in vacuum considered an exact constant with zero uncertainty?",
          answer:
            "Since 1983, the International System of Units (SI) defined the metre as the distance light travels in vacuum in exactly 1 / 299,792,458 of a second. Consequently, c is an exact defined constant (c = 299,792,458 m/s by definition), and experimental measurements now refine the definition of distance rather than the speed of light.",
        },
        {
          question: "Why does light slow down in dense materials like glass or diamond?",
          answer:
            "Inside a dielectric medium, the oscillating electric field of the light wave induces oscillating electric dipoles in the material's electron shells. These dipoles radiate secondary electromagnetic waves with a phase lag. The superposition of the incident wave and secondary waves creates a resultant wave with a lower phase velocity v = c/n.",
        },
        {
          question: "How does Lunar Laser Ranging measure the Earth-Moon distance?",
          answer:
            "Observatories fire short laser pulses at retroreflector arrays placed on the lunar surface during the Apollo 11, 14, and 15 missions. By measuring the elapsed round-trip time of flight (approximately 2.564 seconds) with picosecond timers, scientists calculate distance D = c · Δt / 2 to within a few millimeters.",
        },
      ]}
    />
  );
}
