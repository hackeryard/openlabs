export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedExperiment {
  title: string;
  href: string;
  description: string;
}

export interface EducationalContent {
  slug: string;
  subject: string; // e.g. "Physics", "Chemistry"
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string; // e.g. "15 minutes"
  
  heroDescription: string;
  
  theory: {
    content: string; // Markdown or HTML string
  };
  
  learningObjectives: string[];
  
  mathematicalFoundations?: {
    equations: string[];
    explanation: string;
  };
  
  realWorldApplications: string[];
  
  howItWorks: string;
  
  faqs: FAQ[];
  
  relatedExperiments: RelatedExperiment[];
}
