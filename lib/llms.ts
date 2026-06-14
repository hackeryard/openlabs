import fs from "fs/promises";
import path from "path";

const BASE_URL = "https://www.openlabs.org.in";
const APP_DIR = path.join(process.cwd(), "app");

const pageFileNames = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);
const excludedDirs = new Set([
  "api",
  "admin",
  "auth",
  "components",
  "hooks",
  "lib",
  "labs",
  "middleware",
  "models",
  "src",
  "types",
  "setup-profile",
  "reset-password",
  "forgotpassword",
  "login",
  "signup",
  "profile",
  "verify-email",
]);
const excludedFiles = new Set([
  "error.tsx",
  "error.ts",
  "global-error.tsx",
  "global-error.ts",
  "not-found.tsx",
  "not-found.ts",
  "robots.ts",
  "sitemap.ts",
  "favicon.ico",
]);

function isDynamicSegment(name: string) {
  return name.startsWith("[") && name.endsWith("]");
}

function toUrl(filePath: string) {
  const relative = path.relative(APP_DIR, filePath).split(path.sep);
  if (relative.length === 1 && pageFileNames.has(relative[0])) {
    return "/";
  }

  const segments = relative.slice(0, -1);
  if (segments.some((segment) => isDynamicSegment(segment))) {
    return null;
  }

  return `/${segments.join("/")}`;
}

async function collectPageFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const pageFiles: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name) || entry.name.startsWith("_")) {
        continue;
      }
      if (isDynamicSegment(entry.name)) {
        continue;
      }
      pageFiles.push(...(await collectPageFiles(path.join(directory, entry.name))));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (excludedFiles.has(entry.name)) {
      continue;
    }

    if (pageFileNames.has(entry.name)) {
      pageFiles.push(path.join(directory, entry.name));
    }
  }

  return pageFiles;
}

export async function getIndexableUrls() {
  const pageFiles = await collectPageFiles(APP_DIR);
  const urls = new Set<string>();

  for (const filePath of pageFiles) {
    const url = toUrl(filePath);
    if (!url) {
      continue;
    }
    urls.add(`${BASE_URL}${url}`);
  }

  return Array.from(urls).sort((a, b) => a.localeCompare(b));
}

const llmsTxtSections = {
  brand: "OpenLabs",
  description:
    "OpenLabs is a browser-first STEM education platform offering interactive virtual labs in physics, chemistry, biology, computer science, and mathematics for students and teachers.",
};

const coreServices = [
  "/physics",
  "/chemistry",
  "/biology",
  "/computer-science",
  "/maths",
];

const products = [
  "/computer-science/code-lab",
  "/computer-science/blockchain",
  "/computer-science/logic-gates",
  "/computer-science/dsa",
  "/computer-science/data-science",
  "/computer-science/data-analyzer",
  "/computer-science/git-simulator",
];

const solutions = [
  "/computer-science/ai-problem",
  "/computer-science/networking",
];

const llmsTxtSectionsOrder = [
  ["About", ["/about"]],
  ["Core Services", coreServices],
  ["Products", products],
  ["Solutions", solutions],
  ["Industries", []],
  ["Resources", ["/blog"]],
  ["Blog Categories", ["/blog"]],
  ["Contact", ["/contact"]],
];

export function generateLlmsTxt(urls: string[]) {
  const lines: string[] = [];
  lines.push(`# ${llmsTxtSections.brand}`);
  lines.push("");
  lines.push(`> ${llmsTxtSections.description}`);
  lines.push("");

  for (const [sectionHeading, paths] of llmsTxtSectionsOrder) {
    lines.push(`## ${sectionHeading}`);
    for (const path of paths) {
      const canonicalUrl = `${BASE_URL}${path}`;
      if (urls.includes(canonicalUrl)) {
        lines.push(canonicalUrl);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

const llmsFullSections = {
  brand: "OpenLabs",
  description:
    "OpenLabs is a browser-based STEM education platform that delivers interactive science and computer science virtual labs, AI-assisted learning, and classroom-ready simulations for students, teachers, and self-directed learners.",
};

function buildLlmsFullSections(urls: string[]) {
  const grouped = {
    "Company Overview": ["/"],
    "Core Topics": [
      "/physics",
      "/chemistry",
      "/biology",
      "/computer-science",
      "/maths",
    ],
    Services: [
      "/physics",
      "/chemistry",
      "/biology",
      "/computer-science",
      "/maths",
    ],
    Products: [
      "/computer-science/code-lab",
      "/computer-science/ai-problem",
      "/computer-science/blockchain",
      "/computer-science/networking",
      "/computer-science/logic-gates",
      "/computer-science/dsa",
    ],
    Industries: ["/"],
    Resources: ["/blog"],
    Documentation: [],
    "Case Studies": [],
    FAQs: [],
    "Blog Content": ["/blog"],
  } as Record<string, string[]>;

  const lines: string[] = [];
  lines.push(`# ${llmsFullSections.brand}`);
  lines.push("");
  lines.push(`> ${llmsFullSections.description}`);
  lines.push("");

  lines.push("## Company Overview");
  lines.push("A browser-first STEM education platform focused on interactive virtual labs for science and computer science learners, educators, and schools.");
  lines.push("A product for students, teachers, and institutions that need hands-on lab simulations without physical lab equipment.");
  lines.push("A digital learning solution with guided experiments, AI assistance, and curriculum-friendly STEM content.");
  lines.push("");

  lines.push("## Core Topics");
  lines.push("Physics, Chemistry, Biology, Computer Science, Mathematics, AI-assisted learning, virtual experimentation, STEM education.");
  lines.push("");

  const sectionOrder = [
    "Services",
    "Products",
    "Industries",
    "Resources",
    "Documentation",
    "Case Studies",
    "FAQs",
    "Blog Content",
  ];

  for (const section of sectionOrder) {
    lines.push(`## ${section}`);
    const paths = grouped[section];
    for (const path of paths) {
      const canonicalUrl = `${BASE_URL}${path}`;
      if (urls.includes(canonicalUrl)) {
        lines.push(canonicalUrl);
      }
    }
    lines.push("");
  }

  lines.push("## Entity Relationships");
  lines.push("OpenLabs → Virtual STEM Labs");
  lines.push("OpenLabs → Physics Education");
  lines.push("OpenLabs → Chemistry Education");
  lines.push("OpenLabs → Biology Education");
  lines.push("OpenLabs → Computer Science Education");
  lines.push("OpenLabs → Mathematics Education");
  lines.push("OpenLabs → AI-assisted Learning");
  lines.push("");
  lines.push("## Topic Cluster: Physics Labs");
  lines.push("/physics");
  lines.push("/physics/ohmslaw");
  lines.push("/physics/freefall");
  lines.push("");
  lines.push("## Topic Cluster: Chemistry Labs");
  lines.push("/chemistry");
  lines.push("/chemistry/periodictable");
  lines.push("/chemistry/reaction-simulation");
  lines.push("");
  lines.push("## Topic Cluster: Biology Labs");
  lines.push("/biology");
  lines.push("/biology/blood");
  lines.push("/biology/cell");
  lines.push("");
  lines.push("## Topic Cluster: Computer Science Labs");
  lines.push("/computer-science");
  lines.push("/computer-science/code-lab");
  lines.push("/computer-science/ai-problem");
  lines.push("");

  return lines.join("\n");
}

export function generateLlmsFullTxt(urls: string[]) {
  const lines: string[] = [];
  lines.push(`# ${llmsFullSections.brand}`);
  lines.push("");
  lines.push(`> ${llmsFullSections.description}`);
  lines.push("");

  lines.push("## Company Overview");
  lines.push("OpenLabs is a browser-based STEM education platform that delivers interactive virtual labs for physics, chemistry, biology, computer science, and mathematics.");
  lines.push("The platform supports students, teachers, and remote learning programs with guided simulations, practice labs, and AI-driven explanations.");
  lines.push("OpenLabs positions itself as an accessible, curriculum-friendly learning environment for STEM and computing education.");
  lines.push("");

  lines.push("## Core Topics");
  lines.push("Physics, Chemistry, Biology, Computer Science, Mathematics, Interactive Labs, Virtual Experimentation, AI Learning Assistance, STEM Education");
  lines.push("");

  lines.push("## Services");
  for (const url of urls) {
    if (
      url.includes("/physics") ||
      url.includes("/chemistry") ||
      url.includes("/biology") ||
      url.includes("/computer-science") ||
      url.includes("/maths")
    ) {
      lines.push(url);
    }
  }
  lines.push("");

  lines.push("## Products");
  for (const url of urls) {
    if (
      url.includes("/computer-science/code-lab") ||
      url.includes("/computer-science/ai-problem") ||
      url.includes("/computer-science/blockchain") ||
      url.includes("/computer-science/networking") ||
      url.includes("/computer-science/logic-gates") ||
      url.includes("/computer-science/dsa")
    ) {
      lines.push(url);
    }
  }
  lines.push("");

  lines.push("## Resources");
  if (urls.includes(`${BASE_URL}/blog`)) {
    lines.push(`${BASE_URL}/blog`);
  }
  lines.push("");

  lines.push("## All Indexable URLs");
  for (const url of urls) {
    lines.push(url);
  }
  lines.push("");

  lines.push("## FAQs");
  if (urls.includes(`${BASE_URL}/blog`)) {
    lines.push(`${BASE_URL}/blog`);
  }
  lines.push("");

  lines.push("## Blog Content");
  if (urls.includes(`${BASE_URL}/blog`)) {
    lines.push(`${BASE_URL}/blog`);
  }
  lines.push("");

  lines.push("## Entity Relationships");
  lines.push("OpenLabs → Virtual Labs");
  lines.push("OpenLabs → STEM Education");
  lines.push("OpenLabs → Physics Labs");
  lines.push("OpenLabs → Chemistry Labs");
  lines.push("OpenLabs → Biology Labs");
  lines.push("OpenLabs → Computer Science Labs");
  lines.push("OpenLabs → Mathematics Labs");
  lines.push("OpenLabs → AI-Assisted Learning");
  lines.push("OpenLabs → Educational Technology");
  lines.push("");

  lines.push("## Topic Cluster: Physics");
  lines.push("/physics");
  lines.push("/physics/ohmslaw");
  lines.push("/physics/freefall");
  lines.push("/physics/projectilemotion");
  lines.push("/physics/waveoptics");
  lines.push("");

  lines.push("## Topic Cluster: Chemistry");
  lines.push("/chemistry");
  lines.push("/chemistry/periodictable");
  lines.push("/chemistry/reaction-simulation");
  lines.push("/chemistry/water-quality");
  lines.push("");

  lines.push("## Topic Cluster: Biology");
  lines.push("/biology");
  lines.push("/biology/blood");
  lines.push("/biology/cell");
  lines.push("/biology/human");
  lines.push("");

  lines.push("## Topic Cluster: Computer Science");
  lines.push("/computer-science");
  lines.push("/computer-science/code-lab");
  lines.push("/computer-science/ai-problem");
  lines.push("/computer-science/blockchain");
  lines.push("/computer-science/networking");
  lines.push("/computer-science/logic-gates");
  lines.push("/computer-science/dsa");
  lines.push("");

  return lines.join("\n");
}

export async function getLlmsTxt() {
  const urls = await getIndexableUrls();
  return generateLlmsTxt(urls);
}

export async function getLlmsFullTxt() {
  const urls = await getIndexableUrls();
  return generateLlmsFullTxt(urls);
}
