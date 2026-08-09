// app/lib/seo/keywordBuilder.ts
import { SubjectId } from "../types/knowledge";
import { SUBJECTS } from "../constants/subjects";

/**
 * Generates intent-driven, topic-specific keywords for educational pages.
 */
export function buildKeywords(
  topicName: string,
  subject?: SubjectId,
  extraKeywords: string[] = []
): string[] {
  const subjectName = subject ? SUBJECTS[subject]?.name || "" : "";

  const baseKeywords = [
    `${topicName} simulation`,
    `virtual ${topicName} lab`,
    `${topicName} interactive experiment`,
    `learn ${topicName} online`,
    `${topicName} formulas and theory`,
  ];

  if (subjectName) {
    baseKeywords.push(
      `${subjectName.toLowerCase()} ${topicName.toLowerCase()}`,
      `online ${subjectName.toLowerCase()} lab`,
      `interactive ${subjectName.toLowerCase()} simulation`
    );
  }

  const combined = Array.from(new Set([...baseKeywords, ...extraKeywords]));
  return combined;
}
