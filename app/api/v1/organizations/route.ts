import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope } from "@/app/lib/integrations/accessPolicy";
import { checkRateLimit, getRateLimitHeaders } from "@/app/lib/integrations/rateLimiter";
import { recordApiUsage } from "@/app/lib/integrations/usageMeter";
import { apiError, apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const start = Date.now();
  const auth = await authenticateApiKey(request);
  if (!auth.authorized || !auth.organization || !auth.apiKey) {
    return apiError(auth.error || "Unauthorized", auth.status);
  }

  if (!hasRequiredScope(auth.apiKey, "organizations:read")) {
    return apiError("Forbidden: Scope 'organizations:read' required", 403);
  }

  const rateLimit = checkRateLimit(auth.organization);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError("Too Many Requests: Rate limit exceeded", 429, {
      resetInSeconds: rateLimit.resetInSeconds,
    }, { headers: rateLimitHeaders });
  }

  const org = auth.organization;
  const profile = {
    id: org._id,
    name: org.name,
    slug: org.slug,
    type: org.type,
    status: org.status,
    contactEmail: org.contactEmail,
    plan: org.plan,
    allowedOrigins: org.allowedOrigins || [],
    licensedSubjects: org.licensedSubjects || [],
    validUntil: org.validUntil,
    createdAt: org.createdAt,
  };

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: org._id,
    apiKeyId: auth.apiKey._id,
    endpoint: "/api/v1/organizations",
    method: "GET",
    statusCode: 200,
    responseTimeMs,
  });

  return apiSuccess(
    { organization: profile },
    { headers: rateLimitHeaders }
  );
}

