// app/llms.txt/route.ts
import { NextResponse } from "next/server";
import { SITE_METADATA, SUBJECTS } from "@/app/lib/constants/subjects";
import { LABS } from "@/app/lib/labs";

export async function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE_METADATA.siteName}`);
  lines.push(`> ${SITE_METADATA.siteDescription}`);
  lines.push(``);
  lines.push(`## Platform Overview`);
  lines.push(`OpenLabs is an interactive, browser-based virtual laboratory platform for STEM education covering Physics, Chemistry, Biology, and Computer Science.`);
  lines.push(`Each lab provides real-time simulations, formula calculations, visual data plots, and step-by-step educational guidance.`);
  lines.push(``);

  lines.push(`## Subject Hubs & Primary Learning Domains`);
  Object.values(SUBJECTS).forEach((subj) => {
    lines.push(`- [${subj.name}](${SITE_METADATA.baseUrl}${subj.slug}): ${subj.description}`);
    lines.push(`  - Core Branches: ${subj.primaryBranches.join(", ")}`);
  });
  lines.push(``);

  lines.push(`## Interactive Virtual Labs & Simulations`);

  const physicsLabs = LABS.filter((l) => l.subject === "physics");
  const chemistryLabs = LABS.filter((l) => l.subject === "chemistry");
  const biologyLabs = LABS.filter((l) => l.subject === "biology");
  const csLabs = LABS.filter((l) => l.subject === "computerScience");

  lines.push(`### Physics Experiments`);
  physicsLabs.forEach((l) => {
    lines.push(`- [${l.name}](${SITE_METADATA.baseUrl}/${l.id}): ${l.description}`);
  });
  lines.push(``);

  lines.push(`### Chemistry Experiments`);
  chemistryLabs.forEach((l) => {
    lines.push(`- [${l.name}](${SITE_METADATA.baseUrl}/${l.id}): ${l.description}`);
  });
  lines.push(``);

  lines.push(`### Biology Experiments`);
  biologyLabs.forEach((l) => {
    lines.push(`- [${l.name}](${SITE_METADATA.baseUrl}/${l.id}): ${l.description}`);
  });
  lines.push(``);

  lines.push(`### Computer Science Visualizers & Tools`);
  csLabs.forEach((l) => {
    lines.push(`- [${l.name}](${SITE_METADATA.baseUrl}/${l.id}): ${l.description}`);
  });
  lines.push(``);

  lines.push(`## API & Documentation Options`);
  lines.push(`- [Full Sitemap](${SITE_METADATA.baseUrl}/sitemap.xml)`);
  lines.push(`- [Robots Rules](${SITE_METADATA.baseUrl}/robots.txt)`);

  const content = lines.join("\n");

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
