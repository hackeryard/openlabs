import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
  description: "Explore ionic, covalent, and metallic bonds in an interactive lab. Build molecules, compare bond types, and understand molecular geometry.",
  keywords: [
    "chemical bonds",
    "covalent bond",
    "ionic bond",
    "metallic bond",
    "molecular geometry",
    "chemistry lab",
    "electron sharing",
    "bond polarity"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/chemicalbonds",
  },
  openGraph: {
    title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
    description: "Explore ionic, covalent, and metallic bonding through our guided chemistry lab simulation.",
    url: "https://www.openlabs.org.in/chemistry/chemicalbonds",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/chemical-bonds-hero.png",
        alt: "OpenLabs Chemical Bonds Interactive Chemistry Lab"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
    description: "Build molecules and compare bond types with our interactive chemistry bonding lab.",
    images: ["https://www.openlabs.org.in/images/chemistry/chemical-bonds-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "chemicalbonds",
  subject: "Chemistry",
  title: "Chemical Bonds",
  description: "Visualize and build molecules to understand chemical bonding.",
  difficulty: "Beginner",
  estimatedTime: "20 mins",
  heroDescription: "Dive into the microscopic world of atoms. Learn how elements share or transfer electrons to form the complex molecules that make up our universe.",
  theory: {
    content: `
      <p>Chemical bonding is the fundamental process that holds atoms together in molecules and compounds. Atoms bond to achieve a more stable electron configuration, typically a full outer valence shell (the octet rule).</p>
      <p>There are three primary types of chemical bonds:</p>
      <ul>
        <li><strong>Ionic Bonds:</strong> Formed when one atom completely transfers one or more electrons to another atom, creating oppositely charged ions that attract each other (e.g., NaCl).</li>
        <li><strong>Covalent Bonds:</strong> Formed when two atoms share pairs of valence electrons to achieve stability (e.g., H₂O). These can be polar or nonpolar depending on electronegativity.</li>
        <li><strong>Metallic Bonds:</strong> A lattice of positive ions in a "sea" of delocalized electrons, giving metals their conductivity and malleability.</li>
      </ul>
    `
  },
  learningObjectives: [
    "Differentiate between ionic, covalent, and metallic bonds.",
    "Predict the type of bond formed between two elements based on their position in the periodic table.",
    "Understand the octet rule and how it drives chemical reactivity.",
    "Visualize the 3D geometry of simple molecules."
  ],
  mathematicalFoundations: {
    equations: [
      "\\Delta EN = |EN_1 - EN_2|",
      "\\Delta EN > 1.7 \\rightarrow Ionic",
      "0.4 < \\Delta EN \\le 1.7 \\rightarrow Polar Covalent",
      "\\Delta EN \\le 0.4 \\rightarrow Nonpolar Covalent"
    ],
    explanation: "The difference in electronegativity (ΔEN) between two bonding atoms determines the bond character. A large difference leads to ionic bonding, while a small difference leads to covalent bonding."
  },
  realWorldApplications: [
    "Materials Science: Designing new polymers and alloys based on bond strength.",
    "Pharmacology: Understanding how drug molecules bind to target receptors in the body.",
    "Environmental Science: Analyzing the bonds in greenhouse gases like CO₂.",
    "Energy Storage: Developing better lithium-ion batteries by studying ionic interactions."
  ],
  howItWorks: "Our interactive 3D laboratory allows you to drag and drop atoms from the periodic table onto a workspace. When you bring compatible atoms close together, the simulation will automatically form the appropriate bonds, calculate the electronegativity difference, and display the molecular geometry using the VSEPR model.",
  faqs: [
    {
      question: "What is the octet rule?",
      answer: "The octet rule is a chemical rule of thumb that reflects the observation that main group elements tend to bond in such a way that each atom has eight electrons in its valence shell, giving it the same electronic configuration as a noble gas."
    },
    {
      question: "Why is water a polar molecule?",
      answer: "Water (H₂O) is polar because oxygen is significantly more electronegative than hydrogen. This causes the shared electrons to spend more time near the oxygen atom, giving it a partial negative charge and the hydrogens a partial positive charge. The bent shape of the molecule prevents these dipoles from canceling out."
    },
    {
      question: "Are metallic bonds stronger than ionic bonds?",
      answer: "Bond strength varies widely within both categories. However, ionic bonds are generally very strong, resulting in high melting points for ionic compounds (like salt). Metallic bonds can also be very strong (like in tungsten) or quite weak (like in mercury, which is liquid at room temperature)."
    },
    {
      question: "Can an atom form more than one covalent bond?",
      answer: "Yes, atoms can form double or triple covalent bonds by sharing two or three pairs of electrons, respectively. For example, oxygen gas (O₂) has a double bond, and nitrogen gas (N₂) has a triple bond."
    }
  ],
  relatedExperiments: [
    {
      title: "Periodic Table",
      href: "/chemistry/periodictable",
      description: "Explore element properties and trends."
    },
    {
      title: "Reaction Simulation",
      href: "/chemistry/reaction-simulation",
      description: "Balance chemical equations and observe reaction kinetics."
    }
  ]
};

export default function ChemicalBondsPage() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/chemistry/chemicalbonds" />;
}
