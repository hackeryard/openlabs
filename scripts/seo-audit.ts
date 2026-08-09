// scripts/seo-audit.ts
import { ALL_CONCEPTS } from "../app/lib/knowledge/concepts";
import { validateKnowledgeGraph } from "../app/lib/knowledge/validator";
import { LABS } from "../app/lib/labs";

function runSeoAudit() {
  console.log("==========================================");
  console.log("🔍 Running OpenLabs Build-Time SEO Audit");
  console.log("==========================================");

  let errors = 0;

  // 1. Validate Knowledge Graph Integrity
  console.log("\n1. Knowledge Graph Integrity & Prerequisites Check...");
  const report = validateKnowledgeGraph();
  if (!report.valid) {
    console.error("❌ Knowledge Graph Validation Failed:");
    report.missingPrerequisites.forEach((e) => console.error("   - " + e));
    report.missingNextTopics.forEach((e) => console.error("   - " + e));
    report.circularDependencies.forEach((e) => console.error("   - " + e));
    errors++;
  } else {
    console.log(`✅ Knowledge Graph Valid (${ALL_CONCEPTS.length} concepts indexed, 0 circular dependencies).`);
  }

  // 2. Check for Duplicate Slugs & Titles
  console.log("\n2. Duplicate Slugs & Titles Audit...");
  const slugSet = new Set<string>();
  const titleSet = new Set<string>();

  ALL_CONCEPTS.forEach((c) => {
    if (slugSet.has(c.slug)) {
      console.error(`❌ Duplicate Concept Slug detected: ${c.slug}`);
      errors++;
    }
    slugSet.add(c.slug);

    if (titleSet.has(c.title)) {
      console.error(`❌ Duplicate Concept Title detected: ${c.title}`);
      errors++;
    }
    titleSet.add(c.title);
  });

  // 3. Check LABS Registry Alignment
  console.log("\n3. Labs Registry Alignment...");
  const labIdSet = new Set(LABS.map((l) => l.id));
  ALL_CONCEPTS.forEach((c) => {
    c.relatedLabs.forEach((labId) => {
      if (!labIdSet.has(labId)) {
        console.warn(`⚠️ Concept '${c.id}' references unregistered labId: '${labId}'`);
      }
    });
  });

  console.log("\n==========================================");
  if (errors > 0) {
    console.error(`❌ Audit Completed with ${errors} error(s). Build halted.`);
    process.exit(1);
  } else {
    console.log("✅ Build-Time SEO Audit Passed Successfully!");
    console.log("==========================================");
  }
}

runSeoAudit();
