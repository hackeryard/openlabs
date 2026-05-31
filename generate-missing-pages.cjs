const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (file === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

const labsDir = path.join(process.cwd(), 'app', 'labs');
const appDir = path.join(process.cwd(), 'app');
const labFiles = getFiles(labsDir);

const missingPages = [];

for (const labFile of labFiles) {
  const relPath = path.relative(labsDir, labFile);
  const publicPagePath = path.join(appDir, relPath);
  
  if (!fs.existsSync(publicPagePath)) {
    missingPages.push(relPath);
  }
}

// Helper to titleize a slug
function titleize(slug) {
  if (slug.startsWith('[')) return slug; // leave [atomicNumber] alone for now
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

for (const relPath of missingPages) {
  const parts = relPath.split(path.sep);
  const subjectStr = parts[0]; // e.g. computer-science
  const slug = parts[parts.length - 2]; // e.g. bubble-sort or [atomicNumber]
  
  const title = titleize(slug);
  const subjectTitle = titleize(subjectStr);
  const launchUrl = `/labs/${relPath.replace(/\\/g, '/').replace(/\/page\.tsx$/, '')}`;
  
  // Create directory
  const publicPagePath = path.join(appDir, relPath);
  const dirPath = path.dirname(publicPagePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title} | OpenLabs",
  description: "Interactive ${title} exploration.",
};

const content: EducationalContent = {
  slug: "${slug}",
  subject: "${subjectTitle}",
  title: "${title}",
  description: "Interactive ${title} exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the ${title} in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind ${title}. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of ${title}.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is ${title}?", answer: "It is a foundational concept in ${subjectTitle} that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="${launchUrl}" />;
}
`;

  fs.writeFileSync(publicPagePath, content);
  console.log('Generated:', publicPagePath);
}

console.log('All missing nested pages generated!');
