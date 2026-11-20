import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope, hasSubjectAccess } from "@/app/lib/integrations/accessPolicy";
import { checkRateLimit, getRateLimitHeaders } from "@/app/lib/integrations/rateLimiter";
import { recordApiUsage } from "@/app/lib/integrations/usageMeter";
import { apiError, apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

const ALL_SUBJECTS = [
  { id: "physics", name: "Physics", icon: "Atom", trackCount: 6 },
  { id: "chemistry", name: "Chemistry", icon: "FlaskConical", trackCount: 6 },
  { id: "biology", name: "Biology", icon: "Dna", trackCount: 6 },
  { id: "computer-science", name: "Computer Science", icon: "Binary", trackCount: 7 },
  { id: "mathematics", name: "Mathematics", icon: "Infinity", trackCount: 4 },
];

export async function GET(request: Request) {
  const start = Date.now();
  const auth = await authenticateApiKey(request);
  if (!auth.authorized || !auth.organization || !auth.apiKey) {
    return apiError(auth.error || "Unauthorized", auth.status);
  }

  // Verify scope
  if (!hasRequiredScope(auth.apiKey, "labs:read")) {
    return apiError("Forbidden: Scope 'labs:read' required", 403);
  }

  // Rate limit check
  const rateLimit = checkRateLimit(auth.organization);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError("Too Many Requests: Rate limit exceeded", 429, {
      resetInSeconds: rateLimit.resetInSeconds,
    }, { headers: rateLimitHeaders });
  }

  // Filter licensed subjects
  const licensed = ALL_SUBJECTS.filter((s) =>
    hasSubjectAccess(auth.organization!, s.id)
  );

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: auth.organization._id,
    apiKeyId: auth.apiKey._id,
    endpoint: "/api/v1/subjects",
    method: "GET",
    statusCode: 200,
    responseTimeMs,
  });

  return apiSuccess(
    { subjects: licensed, count: licensed.length },
    { headers: rateLimitHeaders }
  );
}

