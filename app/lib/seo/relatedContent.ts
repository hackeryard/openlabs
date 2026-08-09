// app/lib/seo/relatedContent.ts
import { LABS, Lab } from "../labs";
import { RelatedContentItem } from "../types/seo";
import { SubjectId } from "../types/knowledge";

/**
 * Public recommendation API for internal linking.
 * Generates 5 to 10 contextually relevant internal links for any given topic or lab.
 */
export function getRelatedLabs(subject: SubjectId, currentLabId?: string, limit: number = 6): RelatedContentItem[] {
  const filtered = LABS.filter((l) => l.subject === subject && l.id !== currentLabId);

  return filtered.slice(0, limit).map((l) => ({
    id: l.id,
    title: l.name,
    description: l.description,
    url: `/${l.id}`,
    type: "lab",
    subject: l.subject as SubjectId,
  }));
}

/**
 * Gets contextually scored related content items across labs and subjects.
 */
export function getRelatedContent(topic: string, subject?: SubjectId, limit: number = 8): RelatedContentItem[] {
  const lowerTopic = topic.toLowerCase();
  
  const matches = LABS.map((l) => {
    let score = 0;
    if (subject && l.subject === subject) score += 10;
    if (l.name.toLowerCase().includes(lowerTopic)) score += 20;
    if (l.description.toLowerCase().includes(lowerTopic)) score += 15;

    return { lab: l, score };
  })
  .filter((m) => m.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);

  // If insufficient direct matches, fallback to subject labs
  if (matches.length < 4 && subject) {
    const fallbackLabs = LABS.filter((l) => l.subject === subject);
    fallbackLabs.forEach((fl) => {
      if (!matches.some((m) => m.lab.id === fl.id)) {
        matches.push({ lab: fl, score: 5 });
      }
    });
  }

  return matches.slice(0, limit).map((m) => ({
    id: m.lab.id,
    title: m.lab.name,
    description: m.lab.description,
    url: `/${m.lab.id}`,
    type: "lab",
    subject: m.lab.subject as SubjectId,
  }));
}
