import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Doppler Effect & Sonic Boom Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive 2D acoustic and optical Doppler effect simulator. Explore pitch shifts, wavefront compression, sound barrier shock waves, and supersonic Mach cone physics.",
  keywords: [
    "doppler effect simulator",
    "sonic boom physics simulation",
    "mach cone angle calculator",
    "sound barrier shock wave",
    "acoustic doppler shift online",
    "relativistic optical doppler",
    "frequency pitch shift simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/doppler-effect",
  },
  openGraph: {
    title: "Doppler Effect & Sonic Boom Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive 2D acoustic and optical Doppler effect simulator. Explore pitch shifts, wavefront compression, and supersonic Mach cone physics.",
    url: "https://www.openlabs.org.in/physics/doppler-effect",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/doppler-effect-hero.png",
        alt: "Doppler Effect Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doppler Effect & Sonic Boom Simulator | OpenLabs",
    description:
      "Interactive 2D acoustic and optical Doppler effect simulator. Explore pitch shifts, wavefront compression, and supersonic Mach cone physics.",
    images: ["https://www.openlabs.org.in/images/physics/doppler-effect-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DopplerEffectLandingPage() {
  return (
    <PhysicsExperimentLanding
      slug="doppler-effect"
      title="Doppler Effect & Sonic Boom"
      description="Simulate moving wave sources, leading wavefront compression, sound barrier shock waves, and supersonic Mach cones."
      heroDescription="Experience the Doppler effect in real time. Adjust source speed across subsonic, transonic, and supersonic regimes to observe live frequency shifts, audio pitch changes, and conical shock wave envelopes."
      theory="The Doppler effect is the change in observed frequency of a wave when the source and observer are in relative motion. For a moving sound source in a stationary medium, emitted spherical wavefronts bunch together in front of the source (shortening the wavelength to λ_f = (c - v_s)/f₀) and spread out behind it (lengthening to λ_b = (c + v_s)/f₀). At supersonic velocities (v_s ≥ c, Mach M ≥ 1), the source outruns its own pressure waves, creating a conical shock front whose envelope forms the classic Mach cone with half-angle sin(μ) = 1/M = c/v_s."
      formula="f' = f_0 \left(\frac{c}{c - v_s \cos\theta}\right) \quad \text{and} \quad \sin\mu = \frac{1}{M} = \frac{c}{v_s}"
      formulaLabel="Observed Doppler Frequency & Mach Cone Angle"
      launchUrl="/labs/physics/doppler-effect"
      heroImageUrl="/images/physics/doppler-effect-hero.png"
      visualLabel="2D Numerical Wavefront Propagation Engine"
      visualDetail="Live Audio Synthesizer • Mach Shock Cone Tracer • Multi-Medium Propagation"
      accent={{ primary: "#0284c7", secondary: "#10b981", warm: "#f43f5e" }}
      learningObjectives={[
        "Understand why sound pitch rises as a vehicle approaches and drops as it speeds away.",
        "Visualize how circular wavefronts bunch together ahead of a moving source and expand behind it.",
        "Calculate the Mach number M and the resulting shock wave Mach cone angle μ for supersonic flight.",
        "Compare acoustic Doppler shifts across different media (Air, Mars atmosphere, and Water).",
      ]}
      applications={[
        "Police Radar Guns & LIDAR speed enforcement measuring vehicle speeds via frequency shifts.",
        "Medical Doppler Ultrasound for non-invasive monitoring of blood flow velocities in arteries and cardiac valves.",
        "Astronomical Redshift Spectroscopy measuring galaxy recession velocities and the cosmological expansion of the Universe.",
        "Supersonic Aerospace Engineering for Concorde and military aircraft sonic boom mitigation.",
      ]}
      faqs={[
        {
          question: "What causes a sonic boom?",
          answer:
            "When an aircraft travels faster than the speed of sound (Mach M > 1), it pushes air molecules aside faster than pressure disturbances can travel. The spherical sound waves constructively interfere along a conical surface (the Mach cone). When this concentrated high-pressure shock wave sweeps across the ground, observers hear an explosive double sonic boom.",
        },
        {
          question: "Does the sound source inside the supersonic jet experience the sonic boom?",
          answer:
            "No. The pilot and passengers inside the aircraft do not hear the sonic boom because the shock wave forms behind the nose of the plane and trails behind them. They only hear normal engine hum transmitted through the aircraft structure.",
        },
        {
          question: "How does the Doppler effect apply to light (electromagnetic waves)?",
          answer:
            "Because light travels at c without requiring a physical medium, the relativistic Doppler formula applies: f' = f₀ √[(1 - β)/(1 + β)], where β = v/c. Approaching cosmic objects shift toward higher frequencies (blueshift), while receding galaxies shift toward longer wavelengths (redshift).",
        },
      ]}
    />
  );
}
