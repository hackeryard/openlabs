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

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
}

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

function cleanMetaText(text: string) {
  return text
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMetadata(content: string): { title?: string; description?: string } {
  const metaMatch = content.match(/export\s+const\s+metadata(?:\s*:\s*\w+)?\s*=\s*\{([\s\S]*?)\}/);
  if (!metaMatch) return {};

  const block = metaMatch[1];
  
  let title: string | undefined;
  const titleObjMatch = block.match(/title\s*:\s*\{[\s\S]*?default\s*:\s*(["'`])([\s\S]*?)\1/);
  if (titleObjMatch) {
    title = titleObjMatch[2];
  } else {
    const titleStrMatch = block.match(/title\s*:\s*(["'`])([\s\S]*?)\1/);
    if (titleStrMatch) {
      title = titleStrMatch[2];
    }
  }

  let description: string | undefined;
  const descMatch = block.match(/description\s*:\s*(["'`])([\s\S]*?)\1/);
  if (descMatch) {
    description = descMatch[2];
  }

  return {
    title: title ? cleanMetaText(title) : undefined,
    description: description ? cleanMetaText(description) : undefined,
  };
}

function getPathMetadata(urlPath: string): { title: string; description: string } {
  const parts = urlPath.split("/").filter(Boolean);
  if (urlPath.startsWith("/blog/")) {
    const slug = parts[1] || "";
    const title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: `Blog: ${title}`,
      description: `Read the article on ${title} on the OpenLabs Blog.`,
    };
  }

  const category = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "";
  const pageName = parts[parts.length - 1]
    ? parts[parts.length - 1]
        .replace(/-/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "";

  return {
    title: pageName ? `${category} - ${pageName}` : category,
    description: `Explore the interactive ${pageName} simulation and virtual lab under the ${category} category.`,
  };
}

export async function getIndexableUrls(): Promise<PageMetadata[]> {
  const pageFiles = await collectPageFiles(APP_DIR);
  const pages: PageMetadata[] = [];

  for (const filePath of pageFiles) {
    const urlPath = toUrl(filePath);
    if (!urlPath) {
      continue;
    }
    const url = `${BASE_URL}${urlPath}`;

    let title = "";
    let description = "";

    try {
      // 1. Parse metadata directly from page.tsx file
      const fileContent = await fs.readFile(filePath, "utf-8");
      const meta = parseMetadata(fileContent);

      // 2. Fall back to layout.tsx metadata in the same directory if page.tsx metadata is missing
      if (!meta.title || !meta.description) {
        const layoutPath = path.join(path.dirname(filePath), "layout.tsx");
        try {
          const layoutContent = await fs.readFile(layoutPath, "utf-8");
          const layoutMeta = parseMetadata(layoutContent);
          if (!meta.title) meta.title = layoutMeta.title;
          if (!meta.description) meta.description = layoutMeta.description;
        } catch {
          // ignore layout read errors
        }
      }

      if (!meta.title || !meta.description) {
        const fallback = getPathMetadata(urlPath);
        title = meta.title || fallback.title;
        description = meta.description || fallback.description;
      } else {
        title = meta.title;
        description = meta.description;
      }
    } catch {
      const fallback = getPathMetadata(urlPath);
      title = fallback.title;
      description = fallback.description;
    }

    pages.push({ url, title, description });
  }

  // Retrieve dynamic published blog posts from database with actual meta values
  try {
    const { connectDB } = await import("@/app/lib/mongodb");
    const Blog = (await import("@/app/models/Blog")).default;
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select('slug title excerpt metaTitle metaDescription')
      .lean();
    if (blogs && Array.isArray(blogs)) {
      for (const blog of blogs) {
        if (blog.slug) {
          const url = `${BASE_URL}/blog/${blog.slug}`;
          const title = blog.metaTitle || blog.title || `Blog: ${blog.slug}`;
          const description = blog.metaDescription || blog.excerpt || "Read our blog post.";
          pages.push({ url, title, description });
        }
      }
    }
  } catch (error) {
    console.error("✗ Failed to get indexable blog URLs from database:", error);
  }

  return pages.sort((a, b) => a.url.localeCompare(b.url));
}

type LlmsLink = {
  path: string;
  title: string;
  description: string;
};

const llmsTxtSections: Array<[string, LlmsLink[]]> = [
  [
    "Platform",
    [
      {
        path: "/",
        title: "OpenLabs home",
        description: "Overview of OpenLabs and its browser-based STEM learning experiences.",
      },
      {
        path: "/about",
        title: "About OpenLabs",
        description: "Mission, platform background, and the people OpenLabs serves.",
      },
      {
        path: "/contact",
        title: "Contact",
        description: "Ways to contact the OpenLabs team.",
      },
    ],
  ],
  [
    "STEM subjects and virtual labs",
    [
      { path: "/physics", title: "Physics", description: "Interactive physics labs and simulations." },
      { path: "/chemistry", title: "Chemistry", description: "Interactive chemistry labs and learning tools." },
      { path: "/biology", title: "Biology", description: "Interactive biology labs and learning tools." },
      { path: "/computer-science", title: "Computer Science", description: "Hands-on computer science learning tools and labs." },
      { path: "/maths", title: "Mathematics", description: "Mathematics learning resources and interactive tools." },
    ],
  ],
  [
    "Computer science tools",
    [
      { path: "/computer-science/code-lab", title: "Code Lab", description: "Browser-based coding practice environment." },
      { path: "/computer-science/ai-problem", title: "AI Problem Solver", description: "AI-assisted problem-solving learning tool." },
      { path: "/computer-science/blockchain", title: "Blockchain", description: "Interactive blockchain learning experience." },
      { path: "/computer-science/networking", title: "Networking", description: "Networking concepts and interactive learning resources." },
      { path: "/computer-science/logic-gates", title: "Logic Gates", description: "Digital logic and logic-gate simulator." },
      { path: "/computer-science/dsa", title: "Data Structures and Algorithms", description: "Interactive data-structures and algorithms learning tool." },
      { path: "/computer-science/data-science", title: "Data Science", description: "Data science learning resources and tools." },
      { path: "/computer-science/data-analyzer", title: "Data Analyzer", description: "Browser-based data analysis learning tool." },
      { path: "/computer-science/git-simulator", title: "Git Simulator", description: "Interactive Git learning simulator." },
    ],
  ],
];

const optionalLlmsLinks: LlmsLink[] = [
  {
    path: "/blog",
    title: "OpenLabs blog",
    description: "Articles, updates, and STEM education resources.",
  },
];

export function generateLlmsTxt(pages: PageMetadata[]) {
  const lines: string[] = [];
  lines.push("# OpenLabs");
  lines.push("");
  lines.push(
    "> OpenLabs is a browser-first STEM education platform offering interactive virtual labs in physics, chemistry, biology, computer science, and mathematics for students and teachers.",
  );
  lines.push("");

  const matchedUrls = new Set<string>();
  const pageMap = new Map<string, PageMetadata>();
  for (const page of pages) {
    pageMap.set(page.url, page);
  }

  for (const [sectionHeading, links] of llmsTxtSections) {
    lines.push(`## ${sectionHeading}`);
    for (const { path, title, description } of links) {
      const canonicalUrl = `${BASE_URL}${path}`;
      const pageInfo = pageMap.get(canonicalUrl);
      if (pageInfo) {
        const finalTitle = pageInfo.title || title;
        const finalDesc = pageInfo.description || description;
        lines.push(`- [${finalTitle}](${canonicalUrl}): ${finalDesc}`);
        matchedUrls.add(canonicalUrl);
      }
    }
    lines.push("");
  }

  const availableOptionalLinks = optionalLlmsLinks.filter(({ path }) =>
    pageMap.has(`${BASE_URL}${path}`)
  );
  if (availableOptionalLinks.length > 0) {
    lines.push("## Optional");
    for (const { path, title, description } of availableOptionalLinks) {
      const canonicalUrl = `${BASE_URL}${path}`;
      const pageInfo = pageMap.get(canonicalUrl);
      const finalTitle = pageInfo ? (pageInfo.title || title) : title;
      const finalDesc = pageInfo ? (pageInfo.description || description) : description;
      lines.push(`- [${finalTitle}](${canonicalUrl}): ${finalDesc}`);
      matchedUrls.add(canonicalUrl);
    }
    lines.push("");
  }

  const remainingPages = pages.filter((page) => !matchedUrls.has(page.url));

  // Dynamic Blog Articles section with meta attributes
  const blogArticles = remainingPages.filter((page) => page.url.includes("/blog/"));
  if (blogArticles.length > 0) {
    lines.push("## Blog Articles");
    for (const page of blogArticles) {
      lines.push(`- [${page.title}](${page.url}): ${page.description}`);
    }
    lines.push("");
  }

  // Dynamic Experiments / Subpages section with meta attributes
  const otherPages = remainingPages.filter((page) => !page.url.includes("/blog/"));
  if (otherPages.length > 0) {
    lines.push("## Experiment Modules and Learning Resources");
    for (const page of otherPages) {
      lines.push(`- [${page.title}](${page.url}): ${page.description}`);
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

export function generateLlmsFullTxt(pages: PageMetadata[]) {
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
  for (const page of pages) {
    if (
      page.url.includes("/physics") ||
      page.url.includes("/chemistry") ||
      page.url.includes("/biology") ||
      page.url.includes("/computer-science") ||
      page.url.includes("/maths")
    ) {
      lines.push(`${page.url} - ${page.title}`);
    }
  }
  lines.push("");

  lines.push("## Products");
  for (const page of pages) {
    if (
      page.url.includes("/computer-science/code-lab") ||
      page.url.includes("/computer-science/ai-problem") ||
      page.url.includes("/computer-science/blockchain") ||
      page.url.includes("/computer-science/networking") ||
      page.url.includes("/computer-science/logic-gates") ||
      page.url.includes("/computer-science/dsa")
    ) {
      lines.push(`${page.url} - ${page.title}`);
    }
  }
  lines.push("");

  lines.push("## Resources");
  const blogPage = pages.find((p) => p.url === `${BASE_URL}/blog`);
  if (blogPage) {
    lines.push(`${blogPage.url} - ${blogPage.title}`);
  }
  lines.push("");

  lines.push("## All Indexable URLs");
  for (const page of pages) {
    lines.push(`${page.url} - ${page.title}: ${page.description}`);
  }
  lines.push("");

  lines.push("## FAQs");
  if (blogPage) {
    lines.push(`${blogPage.url} - ${blogPage.title}`);
  }
  lines.push("");

  lines.push("## Blog Content");
  if (blogPage) {
    lines.push(`${blogPage.url} - ${blogPage.title}`);
  }
  for (const page of pages) {
    if (page.url.includes("/blog/")) {
      lines.push(`${page.url} - ${page.title}`);
    }
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
  const pages = await getIndexableUrls();
  return generateLlmsTxt(pages);
}

export async function getLlmsFullTxt() {
  const pages = await getIndexableUrls();
  return generateLlmsFullTxt(pages);
}
