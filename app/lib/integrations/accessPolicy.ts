import { IApiKey } from "@/app/models/ApiKey";
import { IOrganization } from "@/app/models/Organization";

/**
 * Checks if the API key holds the requested scope or universal wildcard scope "*".
 */
export function hasRequiredScope(apiKey: IApiKey, requiredScope: string): boolean {
  if (!apiKey || !Array.isArray(apiKey.scopes)) {
    return false;
  }

  if (apiKey.scopes.includes("*")) {
    return true;
  }

  return apiKey.scopes.includes(requiredScope);
}

/**
 * Checks if the organization license and API key permit access to a specific lab.
 * Supports:
 * - "*" (universal access across all labs)
 * - "<subject>/*" (all labs in a subject discipline, e.g. "physics/*")
 * - "<subject>/<slug>" (specific individual lab, e.g. "physics/ohms-law")
 */
export function hasLabAccess(
  organization: IOrganization,
  apiKey: IApiKey,
  labId: string
): boolean {
  if (!labId || typeof labId !== "string") {
    return false;
  }

  const cleanLabId = labId.trim().toLowerCase();
  const [subject] = cleanLabId.split("/");

  // 1. Check organization level licensing
  const orgLabs = organization?.licensedLabs || ["*"];
  const orgPermitted =
    orgLabs.includes("*") ||
    orgLabs.includes(cleanLabId) ||
    orgLabs.includes(`${subject}/*`);

  if (!orgPermitted) {
    return false;
  }

  // 2. Check API key specific restrictions
  const keyLabs = apiKey?.permittedLabs || ["*"];
  const keyPermitted =
    keyLabs.includes("*") ||
    keyLabs.includes(cleanLabId) ||
    keyLabs.includes(`${subject}/*`);

  return keyPermitted;
}

/**
 * Checks if the organization is licensed for a specific subject discipline.
 */
export function hasSubjectAccess(
  organization: IOrganization,
  subject: string
): boolean {
  if (!organization) return false;
  const cleanSubject = subject.trim().toLowerCase();

  const licensedSubjects = organization.licensedSubjects;
  if (!licensedSubjects || licensedSubjects.length === 0) {
    // If empty, defaults to full access across all 5 disciplines
    return true;
  }

  return (
    licensedSubjects.includes(cleanSubject as any) ||
    licensedSubjects.includes("*" as any)
  );
}

