// app/lib/constants/subjects.ts
import { SubjectId } from "../types/knowledge";

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  slug: string;
  description: string;
  color: string;
  gradient: string;
  iconName: string;
  primaryBranches: string[];
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  physics: {
    id: "physics",
    name: "Physics",
    slug: "/physics",
    description: "Explore kinematics, mechanics, electricity, optics, and thermodynamics through interactive virtual labs.",
    color: "#3b82f6", // blue-500
    gradient: "from-blue-600 to-cyan-500",
    iconName: "Zap",
    primaryBranches: ["Kinematics", "Dynamics", "Electricity & Magnetism", "Optics", "Thermodynamics"],
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    slug: "/chemistry",
    description: "Master periodic trends, chemical bonding, stoichiometry, and volumetric titration online.",
    color: "#10b981", // emerald-500
    gradient: "from-emerald-600 to-teal-500",
    iconName: "FlaskConical",
    primaryBranches: ["Atomic Structure", "Periodic Trends", "Chemical Bonding", "Stoichiometry", "Titration"],
  },
  biology: {
    id: "biology",
    name: "Biology",
    slug: "/biology",
    description: "Visualize human anatomy, 3D plant & animal cell structures, neuron signaling, and blood compatibility.",
    color: "#8b5cf6", // purple-500
    gradient: "from-purple-600 to-indigo-500",
    iconName: "Dna",
    primaryBranches: ["Cytology", "Anatomy", "Neurobiology", "Hematology", "Photosynthesis"],
  },
  computerScience: {
    id: "computerScience",
    name: "Computer Science",
    slug: "/computer-science",
    description: "Visualize algorithms, data structures, digital logic gates, networking models, and AI search techniques.",
    color: "#f59e0b", // amber-500
    gradient: "from-amber-500 to-orange-600",
    iconName: "Code2",
    primaryBranches: ["Data Structures & Algorithms", "Digital Logic", "Networking", "AI & Machine Learning", "Web Development"],
  },
};

export const SITE_METADATA = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.openlabs.org.in",
  siteName: "OpenLabs",
  siteDescription: "Interactive virtual lab experience platform for science & technology education.",
  defaultPublisher: "OpenLabs Team",
  twitterHandle: "@openlabs",
};
