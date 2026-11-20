import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope } from "@/app/lib/integrations/accessPolicy";
import { checkRateLimit, getRateLimitHeaders } from "@/app/lib/integrations/rateLimiter";
import { recordApiUsage, getOrganizationUsageSummary } from "@/app/lib/integrations/usageMeter";
import { apiError, apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const start = Date.now();
  const auth = await authenticateApiKey(request);
  if (!auth.authorized || !auth.organization || !auth.apiKey) {
    return apiError(auth.error || "Unauthorized", auth.status);
  }

  if (!hasRequiredScope(auth.apiKey, "usage:read")) {
    return apiError("Forbidden: Scope 'usage:read' required", 403);
  }

  const rateLimit = checkRateLimit(auth.organization);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError("Too Many Requests: Rate limit exceeded", 429, {
      resetInSeconds: rateLimit.resetInSeconds,
    }, { headers: rateLimitHeaders });
  }

  const summary = await getOrganizationUsageSummary(auth.organization._id.toString());

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: auth.organization._id,
    apiKeyId: auth.apiKey._id,
    endpoint: "/api/v1/usage",
    method: "GET",
    statusCode: 200,
    responseTimeMs,
  });

  return apiSuccess(
    {
      organization: {
        id: auth.organization._id,
        name: auth.organization.name,
        slug: auth.organization.slug,
        plan: auth.organization.plan?.name || "pilot",
      },
      usage: summary,
      billingPeriod: {
        period: "calendar_month",
        validUntil: auth.organization.validUntil,
      },
    },
    { headers: rateLimitHeaders }
  );
}

