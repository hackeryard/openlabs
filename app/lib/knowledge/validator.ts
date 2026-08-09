// app/lib/knowledge/validator.ts
import { ALL_CONCEPTS, CONCEPTS_BY_ID } from "./concepts";

export interface ValidationReport {
  valid: boolean;
  missingPrerequisites: string[];
  missingNextTopics: string[];
  circularDependencies: string[];
}

/**
 * Validates the Knowledge Graph integrity: checks for broken references and circular prerequisite loops.
 */
export function validateKnowledgeGraph(): ValidationReport {
  const missingPrerequisites: string[] = [];
  const missingNextTopics: string[] = [];
  const circularDependencies: string[] = [];

  // 1. Check reference validity
  ALL_CONCEPTS.forEach((concept) => {
    concept.prerequisites.forEach((preId) => {
      if (!CONCEPTS_BY_ID.has(preId)) {
        missingPrerequisites.push(`Concept '${concept.id}' has missing prerequisite '${preId}'`);
      }
    });

    concept.nextTopics.forEach((nextId) => {
      if (!CONCEPTS_BY_ID.has(nextId)) {
        missingNextTopics.push(`Concept '${concept.id}' has missing nextTopic '${nextId}'`);
      }
    });
  });

  // 2. Check for circular prerequisite loops using DFS
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(conceptId: string, path: string[]) {
    visited.add(conceptId);
    recStack.add(conceptId);

    const concept = CONCEPTS_BY_ID.get(conceptId);
    if (concept) {
      concept.prerequisites.forEach((preId) => {
        if (!visited.has(preId)) {
          dfs(preId, [...path, conceptId]);
        } else if (recStack.has(preId)) {
          circularDependencies.push(`Circular prerequisite loop: ${[...path, conceptId, preId].join(" -> ")}`);
        }
      });
    }

    recStack.delete(conceptId);
  }

  ALL_CONCEPTS.forEach((concept) => {
    if (!visited.has(concept.id)) {
      dfs(concept.id, []);
    }
  });

  const valid = missingPrerequisites.length === 0 && missingNextTopics.length === 0 && circularDependencies.length === 0;

  return {
    valid,
    missingPrerequisites,
    missingNextTopics,
    circularDependencies,
  };
}
