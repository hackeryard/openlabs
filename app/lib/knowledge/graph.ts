// app/lib/knowledge/graph.ts
import { ConceptEntity, FormulaEntity } from "../types/knowledge";
import { ALL_CONCEPTS, CONCEPTS_BY_ID, CONCEPTS_BY_SLUG } from "./concepts";
import { FORMULAS_BY_ID } from "./formulas";

export function getConceptById(id: string): ConceptEntity | undefined {
  if (!id) return undefined;
  if (CONCEPTS_BY_ID.has(id)) return CONCEPTS_BY_ID.get(id);
  if (CONCEPTS_BY_SLUG.has(id)) return CONCEPTS_BY_SLUG.get(id);

  const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, "");

  return ALL_CONCEPTS.find((c) => {
    if (c.id === id || c.slug === id) return true;
    if (c.slug.endsWith(`/${id}`)) return true;
    const cleanCId = c.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanCId === cleanId) return true;
    const cleanCSlug = c.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanCSlug === cleanId || cleanCSlug.endsWith(cleanId)) return true;
    return false;
  });
}

export function getConceptBySlug(slug: string): ConceptEntity | undefined {
  return getConceptById(slug);
}

export function getPrerequisites(conceptId: string): ConceptEntity[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.prerequisites
    .map((id) => getConceptById(id))
    .filter((c): c is ConceptEntity => c !== undefined);
}

export function getNextTopics(conceptId: string): ConceptEntity[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.nextTopics
    .map((id) => getConceptById(id))
    .filter((c): c is ConceptEntity => c !== undefined);
}

export function getSiblingTopics(conceptId: string): ConceptEntity[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.siblingTopics
    .map((id) => getConceptById(id))
    .filter((c): c is ConceptEntity => c !== undefined);
}

export function getConceptFormulas(conceptId: string): FormulaEntity[] {
  const concept = getConceptById(conceptId);
  if (!concept || !concept.formulas) return [];
  return concept.formulas
    .map((id) => FORMULAS_BY_ID.get(id))
    .filter((f): f is FormulaEntity => f !== undefined);
}
