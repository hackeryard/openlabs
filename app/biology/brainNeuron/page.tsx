import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "3D Brain Neuron & Action Potential Virtual Lab | OpenLabs",
  description: "Understand neural networks, neuron anatomy, voltage-gated ion channels, synaptic transmission, and action potential propagation online.",
  keywords: [
    "brain neuron simulation",
    "action potential virtual lab",
    "neuroscience interactive",
    "synaptic transmission neurotransmitters",
    "hodgkin huxley model",
    "voltage gated sodium potassium channels",
    "biology simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/brainNeuron",
  },
  openGraph: {
    title: "3D Brain Neuron & Action Potential Virtual Lab | OpenLabs",
    description: "Understand neural networks, neuron anatomy, voltage-gated ion channels, synaptic transmission, and action potentials in real time.",
    url: "https://www.openlabs.org.in/biology/brainNeuron",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/brainNeuron-hero.png",
        alt: "Brain & Neurons Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Brain Neuron & Action Potential Virtual Lab | OpenLabs",
    description: "Understand neural networks, neuron anatomy, and action potential propagation.",
    images: ["https://www.openlabs.org.in/images/biology/brainNeuron-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BrainNeuronLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="brainNeuron"
      title="Brain Neuron & Action Potential"
      description="Interactive neurobiology laboratory modeling neuron anatomy, voltage-gated ion channel gating, Hodgkin-Huxley action potentials, and synaptic neurotransmitter release."
      heroDescription="Explore cellular neurophysiology in 3D. Inject current into the neuron soma, observe all-or-none action potential spikes propagating along myelinated axons, and watch calcium-triggered neurotransmitter vesicle exocytosis at the chemical synapse."
      theory="Neurons transmit electrical signals via rapid transient reversals of membrane potential called action potentials. At rest, the Na⁺/K⁺ ATPase pump maintains a resting membrane potential around -70 mV. When depolarization reaches the -55 mV threshold, voltage-gated Na⁺ channels open rapidly, driving rapid Na⁺ influx and overshoot to +30 mV. Delayed-rectifier voltage-gated K⁺ channels then open as Na⁺ channels inactivate, driving K⁺ efflux to repolarize and hyperpolarize the membrane."
      formula="V_m = \frac{RT}{F} \ln \left( \frac{P_{\text{K}}[K^+]_o + P_{\text{Na}}[Na^+]_o + P_{\text{Cl}}[Cl^-]_i}{P_{\text{K}}[K^+]_i + P_{\text{Na}}[Na^+]_i + P_{\text{Cl}}[Cl^-]_o} \right)"
      formulaLabel="Goldman-Hodgkin-Katz Voltage Equation"
      launchUrl="/labs/biology/brainNeuron"
      heroImageUrl="/images/biology/brainNeuron-hero.png"
      visualLabel="3D Multipolar Neuron & Chemical Synapse"
      visualDetail="Hodgkin-Huxley Voltage Trace • Node of Ranvier Saltatory Conduction • Synaptic Vesicle Exocytosis"
      accent={{ primary: "#e11d48", secondary: "#9333ea", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate the physiological roles of dendrites, soma, axon hillock, myelin sheath, and synaptic terminals.",
        "Construct and interpret a standard action potential waveform (depolarization, repolarization, refractory period).",
        "Explain how saltatory conduction in myelinated axons increases action potential propagation velocity.",
        "Trace chemical neurotransmission from presynaptic Ca²⁺ influx to postsynaptic ligand-gated channel opening.",
      ]}
      applications={[
        "Neuropharmacology & Anaesthesia (local anesthetics like lidocaine blocking voltage-gated Na⁺ channels).",
        "Clinical Neurology & Electromyography (Multiple Sclerosis demyelination diagnostics).",
        "Brain-Computer Interfaces (BCI) and Deep Brain Stimulation (DBS) for Parkinson's Disease.",
        "Neuromorphic Computing and Deep Artificial Neural Networks.",
      ]}
      faqs={[
        {
          question: "What does the 'all-or-none' law of action potentials mean?",
          answer:
            "If a graded stimulus depolarizes the axon hillock membrane past the threshold potential (typically around -55 mV), an action potential will fire at full amplitude (+30 mV). Stronger stimuli do not produce larger action potentials; instead, they increase the frequency of firing.",
        },
        {
          question: "Why is the absolute refractory period important?",
          answer:
            "During the absolute refractory period, voltage-gated Na⁺ channels are in an inactivated state and cannot reopen. This enforces a maximum limit on firing frequency and prevents action potentials from traveling backward toward the soma, ensuring unidirectional propagation.",
        },
        {
          question: "How does myelination speed up nerve impulse conduction?",
          answer:
            "Myelin acts as an electrical insulator, preventing ion leakage across the axon membrane. Action potentials can only regenerate at the uninsulated Nodes of Ranvier, allowing the electrical signal to 'jump' rapidly between nodes via saltatory conduction.",
        },
      ]}
    />
  );
}
