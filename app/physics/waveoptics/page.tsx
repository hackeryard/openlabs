import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Wave Optics, Diffraction & Young's Double-Slit Studio | OpenLabs",
  description:
    "Interactive virtual laboratory for Young's double-slit interference, single-slit Fraunhofer diffraction, diffraction gratings, laser wavelength sweep, and live spectral intensity envelopes.",
  keywords: [
    "wave optics simulator",
    "Young double slit experiment",
    "Fraunhofer diffraction",
    "diffraction grating",
    "fringe width formula",
    "laser wavelength tuning",
    "Huygens principle",
    "physics simulation online",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/waveoptics",
  },
  openGraph: {
    title: "Wave Optics, Diffraction & Young's Double-Slit Studio | OpenLabs",
    description:
      "Explore wave optics with animated 2D Huygens wavefronts, tunable monochromatic laser beam (380-750nm), slit width & spacing controls, and continuous Fraunhofer intensity graphs.",
    url: "https://www.openlabs.org.in/physics/waveoptics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/wave-optics-hero.png",
        alt: "Wave Optics & Double Slit Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wave Optics & Young's Double-Slit Studio | OpenLabs",
    description:
      "Interactive wave optics simulator: Young's double-slit interference, single-slit diffraction envelopes, and diffraction grating spectroscopy.",
    images: ["https://www.openlabs.org.in/images/physics/wave-optics-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WaveOpticsPage() {
  return (
    <PhysicsExperimentLanding
      slug="waveoptics"
      title="Wave Optics & Double-Slit Diffraction"
      description="Monochromatic laser wavefronts, Young's interference fringes, and Fraunhofer diffraction intensity envelopes."
      heroDescription="Investigate the wave nature of electromagnetic radiation. Tune laser wavelengths from 380nm to 750nm, adjust single and double slit geometry, observe propagating Huygens wavelets, and analyze photographic fringe patterns with live mathematical intensity curves."
      theory="Wave optics describes the propagation of light as electromagnetic waves. When coherent light passes through narrow apertures comparable to wavelength λ, Huygens wavelets interfere constructively and destructively. In Young's double-slit configuration, interference intensity is modulated by the single-slit diffraction envelope: I(θ) = I₀ cos²(π d sinθ / λ) · sinc²(π a sinθ / λ)."
      formula="I(θ) = I₀ · cos²(πd sinθ / λ) · sinc²(πa sinθ / λ)"
      formulaLabel="Fraunhofer Double-Slit Intensity Distribution"
      launchUrl="/labs/physics/waveoptics"
      heroImageUrl="/images/physics/wave-optics-hero.png"
      visualLabel="Huygens Wavelet Propagator"
      visualDetail="Laser wavelength λ, slit width a, slit spacing d, screen distance D"
      accent={{ primary: "#8b5cf6", secondary: "#06b6d4", warm: "#f59e0b" }}
      learningObjectives={[
        "Calculate fringe spacing using the de Broglie/wave relation β = λD/d.",
        "Derive single-slit diffraction condition for dark minima: a sinθ = mλ.",
        "Analyze why the central diffraction maximum is twice as wide as secondary fringes (W₀ = 2λD/a).",
        "Investigate missing orders when slit separation d is an integer multiple of slit width a (d = m·a).",
        "Examine diffraction grating principal maxima sharpening (I ∝ N²) and chromatic resolving power (R = N·m).",
      ]}
      applications={[
        "Optical spectrometer design & astronomical stellar composition analysis",
        "Laser beam profiling & spatial light modulator calibration",
        "X-ray crystallography & DNA double-helix diffraction imaging",
        "Anti-reflective dielectric optical coatings & interferometry",
        "Photolithography semiconductor manufacturing limit analysis",
      ]}
      faqs={[
        {
          question: "What is the physical difference between interference and diffraction?",
          answer:
            "Interference is the superposition of waves originating from a discrete number of distinct coherent sources or apertures (such as two slits). Diffraction is the superposition of continuous Huygens wavelets originating from different parts of the same wavefront as it passes an obstacle or single aperture. In real optical systems, both occur simultaneously: the interference fringes are enveloped inside the single-slit diffraction pattern.",
        },
        {
          question: "How is the fringe width (β) derived in Young's double-slit experiment?",
          answer:
            "For two slits separated by distance d and a screen at distance D, the path difference to position y on screen is Δx ≈ d·sinθ ≈ d·(y/D). Constructive interference (bright fringes) occurs when Δx = mλ, yielding peak positions y_m = mλD/d. The fringe width β is the separation between consecutive maxima: β = y_(m+1) - y_m = λD/d.",
        },
        {
          question: "What are 'missing orders' in a double-slit diffraction pattern?",
          answer:
            "Missing orders occur when an interference maximum falls at the exact same angle as a diffraction minimum. For instance, if d = 4a, the 4th interference bright fringe coincides with the 1st diffraction dark minimum (a sinθ = λ), resulting in zero net intensity and causing the 4th order fringe to disappear.",
        },
        {
          question: "Why do diffraction gratings have much sharper peaks than double slits?",
          answer:
            "With N slits, waves from all N apertures must be precisely in phase to create constructive interference. Even a slight deviation from the principal angle causes destructive cancellation among the many slits. As a result, the principal maxima have peak intensities proportional to N² and angular widths proportional to 1/N, making spectral lines razor-sharp.",
        },
      ]}
    />
  );
}
