import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reaction Simulation - Chemistry Lab | OpenLabs",
  description: "Simulate chemical reactions and reaction kinetics in an interactive laboratory environment.",
  keywords: [
    "reaction simulation",
    "chemical kinetics",
    "chemistry lab",
    "reaction rates",
    "interactive simulation",
    "chemical equations"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/reaction-simulation",
  },
  openGraph: {
    title: "Reaction Simulation - Chemistry Lab | OpenLabs",
    description: "Run chemistry reaction simulations and explore kinetics with real-time controls.",
    url: "https://www.openlabs.org.in/chemistry/reaction-simulation",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/reaction-simulation-hero.png",
        alt: "OpenLabs Reaction Simulation Chemistry Lab"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaction Simulation - Chemistry Lab | OpenLabs",
    description: "Run real-time chemistry reaction simulations and learn kinetic behavior.",
    images: ["https://www.openlabs.org.in/images/chemistry/reaction-simulation-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "reaction-simulation",
  subject: "Chemistry",
  title: "Reaction Simulation",
  description: "Simulate chemical reactions and kinetics.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive reaction lab to understand chemical kinetics, rate laws, and balanced equations in real time.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of chemical reactions. By experimenting with rates, concentrations, and catalysts in real time, you can intuitively grasp reaction kinetics and equilibrium behavior.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Reaction Simulation.",
    "Observe real-time changes by manipulating simulation parameters.",
    "Apply theoretical knowledge to practical scenarios."
  ],
  realWorldApplications: [
    "Education and academia",
    "Applied science and engineering",
    "Research and development"
  ],
  howItWorks: "Launch the lab to interact with the environment. Use the controls to adjust parameters and observe the outcomes immediately.",
  faqs: [
    {
      question: "What will I learn from this simulation?",
      answer: "You will learn the fundamental mechanics of Reaction Simulation through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of chemistry helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/chemistry/reaction-simulation" />;
}
