import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "RC Circuits & Transient Response Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive RC circuit simulator for capacitor charging and discharging, RC time constants, dual-channel oscilloscope waveforms, and low-pass filter frequency response.",
  keywords: [
    "rc circuit simulator",
    "capacitor charging discharging",
    "rc time constant tau",
    "oscilloscope circuit simulation",
    "low pass filter cutoff frequency",
    "exponential transient voltage",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/rclab",
  },
  openGraph: {
    title: "RC Circuits & Transient Response Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive RC circuit simulator for capacitor charging and discharging, RC time constants, dual-channel oscilloscope waveforms, and low-pass filter frequency response.",
    url: "https://www.openlabs.org.in/physics/rclab",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/rc-lab-hero.png",
        alt: "RC Circuit Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RC Circuits & Transient Response Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive RC circuit simulator for capacitor charging and discharging, RC time constants, and dual-channel oscilloscope waveforms.",
    images: ["https://www.openlabs.org.in/images/physics/rc-lab-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RCLabPage() {
  return (
    <PhysicsExperimentLanding
      slug="rclab"
      title="RC Circuits & Transient Response"
      description="Simulate capacitor charging, exponential decay, oscilloscope traces, and low-pass frequency response."
      heroDescription="Investigate electrodynamic transient responses in series RC circuits. Toggle charging and discharging loops, observe real-time animated electron drift, measure time constants (τ = RC), and analyze dual-channel oscilloscope waveforms."
      theory="An RC circuit consists of a resistor R and capacitor C connected in series. When charging from a DC source Vs, the capacitor voltage rises exponentially according to Vc(t) = Vs(1 - e^(-t/τ)), while current decays as I(t) = (Vs/R)e^(-t/τ). When discharging, stored electrostatic energy Uc = ½CVc² dissipates through the resistor as heat: Vc(t) = V0·e^(-t/τ). The product τ = RC represents the characteristic time required to charge to 63.2% or discharge to 36.8% of maximum voltage."
      formula="V_c(t) = V_s\left(1 - e^{-\frac{t}{RC}}\right) \quad \text{and} \quad \tau = RC"
      formulaLabel="Capacitor Charging Equation & Time Constant"
      launchUrl="/labs/physics/rclab"
      heroImageUrl="/images/physics/rc-lab-hero.png"
      visualLabel="Dual-Channel Digital Oscilloscope Simulation"
      visualDetail="Live Electron Drift • SPDT Switch • Low-Pass Filter Frequency Response"
      accent={{ primary: "#0284c7", secondary: "#0d9488", warm: "#f59e0b" }}
      learningObjectives={[
        "Verify the RC time constant equation (τ = RC) by measuring the 63.2% charging point and 36.8% discharging point.",
        "Observe the inverse relationship between capacitor voltage (Vc) and resistor voltage drop (VR = Vs - Vc) satisfying Kirchhoff's Voltage Law.",
        "Analyze continuous square-wave and AC sinusoidal responses to understand wave shaping, integrator circuits, and low-pass filter cutoff (fc = 1 / 2πRC).",
        "Track real-time electrostatic energy storage (Uc = ½CVc²) vs thermal energy dissipation in the resistor.",
        "Visualize dynamic electron current drift velocity scaling in real-time with instantaneous circuit current I(t).",
      ]}
      applications={[
        "Audio equalizer high-cut and low-pass filter networks",
        "Debounce circuits for mechanical pushbuttons and switches",
        "555 timer oscillator and pulse-width modulation circuits",
        "Power supply ripple smoothing in AC-to-DC converters",
        "High-voltage camera flash pulse charging systems",
      ]}
      faqs={[
        {
          question: "What is the physical meaning of the RC time constant (τ)?",
          answer:
            "The time constant τ = RC (in seconds) represents the time required for a capacitor charging through resistor R to reach 1 - 1/e ≈ 63.2% of its final supply voltage. When discharging, it is the time taken to drop to 1/e ≈ 36.8% of its initial voltage.",
        },
        {
          question: "How long does it take for a capacitor to become fully charged?",
          answer:
            "Theoretically, charging is asymptotic and takes infinite time. However, for practical engineering purposes, a capacitor is considered fully charged (>99.3%) after 5 time constants (t = 5τ).",
        },
        {
          question: "Why does the resistor get warm when charging an ideal capacitor?",
          answer:
            "Regardless of resistance R, exactly half of the total energy supplied by the voltage source (E_source = C·Vs²) is stored in the capacitor's electric field (Uc = ½C·Vs²), while the remaining 50% is inevitably dissipated as Joule heat in the resistor.",
        },
        {
          question: "How does an RC circuit act as a low-pass filter?",
          answer:
            "Capacitive reactance Xc = 1/(2πfC) decreases as frequency increases. At low frequencies, the capacitor acts like an open circuit and passes the voltage to the output; at high frequencies, it acts like a short circuit to ground, attenuating signals above the cutoff frequency fc = 1/(2πRC).",
        },
      ]}
    />
  );
}
