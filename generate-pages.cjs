const fs = require('fs');
const path = require('path');

const experiments = [
  // Physics
  { subject: 'physics', slug: 'energyconservation', title: 'Energy Conservation', desc: 'Investigate energy transformation and conservation.' },
  { subject: 'physics', slug: 'freefall', title: 'Free Fall', desc: 'Free Fall demonstration of an object.' },
  { subject: 'physics', slug: 'hookelaw', title: "Hooke's Law", desc: 'Mass–spring system: observe oscillations and measure period.' },
  { subject: 'physics', slug: 'ohmslaw', title: "Ohm's Law", desc: 'Explore V–I behavior with virtual instruments.' },
  { subject: 'physics', slug: 'opticslens', title: 'Optics Lens', desc: 'Optical Lens lab.' },
  { subject: 'physics', slug: 'rclab', title: 'RC Lab', desc: 'RC circuit charging / discharging experiments.' },
  { subject: 'physics', slug: 'simplependulum', title: 'Simple Pendulum', desc: 'Simulate pendulum motion and compare theory vs measured period.' },
  { subject: 'physics', slug: 'speedoflight', title: 'Speed of Light', desc: 'Demonstration of speed of light in different media.' },
  { subject: 'physics', slug: 'uniformmotionlab', title: 'Uniform Motion Lab', desc: 'Uniform linear motion using a moving object.' },
  { subject: 'physics', slug: 'waveoptics', title: 'Wave Optics', desc: 'Diffraction & interference lab (Fraunhofer).' },
  // Chemistry
  { subject: 'chemistry', slug: 'electronic-configuration', title: 'Electronic Configuration', desc: 'Explore the electronic structure of elements.' },
  { subject: 'chemistry', slug: 'periodictable', title: 'Periodic Table', desc: 'Interactive periodic table of elements.' },
  { subject: 'chemistry', slug: 'reaction-simulation', title: 'Reaction Simulation', desc: 'Simulate chemical reactions and kinetics.' },
  { subject: 'chemistry', slug: 'water-quality', title: 'Water Quality', desc: 'Test and measure water quality metrics.' },
  // Biology
  { subject: 'biology', slug: 'blood', title: 'Blood Components', desc: 'Examine human blood components.' },
  { subject: 'biology', slug: 'brainNeuron', title: 'Brain & Neurons', desc: 'Understand neural networks and brain anatomy.' },
  { subject: 'biology', slug: 'cell', title: 'Cell Structure', desc: 'Interactive plant and animal cell explorer.' },
  { subject: 'biology', slug: 'human', title: 'Human Anatomy', desc: 'Explore the human body systems.' },
  // Computer Science
  { subject: 'computer-science', slug: 'ai-problem', title: 'AI Problems', desc: 'Solve classic AI problems.' },
  { subject: 'computer-science', slug: 'blockchain', title: 'Blockchain', desc: 'Visualize blocks, hashes, and consensus.' },
  { subject: 'computer-science', slug: 'code-lab', title: 'Code Lab', desc: 'Interactive code editor and runner.' },
  { subject: 'computer-science', slug: 'data-analyzer', title: 'Data Analyzer', desc: 'Analyze datasets visually.' },
  { subject: 'computer-science', slug: 'data-science', title: 'Data Science', desc: 'Data science models and visualization.' },
  { subject: 'computer-science', slug: 'git-simulator', title: 'Git Simulator', desc: 'Learn version control visually.' },
  { subject: 'computer-science', slug: 'logic-gates', title: 'Logic Gates', desc: 'Build digital logic circuits.' },
  { subject: 'computer-science', slug: 'networking', title: 'Networking', desc: 'Simulate network topologies and packets.' },
  // Maths
  { subject: 'maths', slug: 'alzebra', title: 'Algebra Visualizer', desc: 'Visualize algebraic equations.' }
];

experiments.forEach(exp => {
  const dirPath = path.join(process.cwd(), 'app', exp.subject, exp.slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "${exp.title} - ${exp.subject.charAt(0).toUpperCase() + exp.subject.slice(1)} Lab | OpenLabs",
  description: "${exp.desc}",
};

const content: EducationalContent = {
  slug: "${exp.slug}",
  subject: "${exp.subject.charAt(0).toUpperCase() + exp.subject.slice(1)}",
  title: "${exp.title}",
  description: "${exp.desc}",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive ${exp.title} simulation to understand the fundamental concepts in ${exp.subject}.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of ${exp.title}. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of ${exp.title}.",
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
      answer: "You will learn the fundamental mechanics of ${exp.title} through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of ${exp.subject} helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/${exp.subject}/${exp.slug}" />;
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Generated ' + experiments.length + ' educational pages.');
