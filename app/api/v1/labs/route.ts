import { LABS } from "@/app/lib/labs";
import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope, hasLabAccess } from "@/app/lib/integrations/accessPolicy";
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

  const { searchParams } = new URL(request.url);
  const subjectFilter = (searchParams.get("subject") || "").toLowerCase().trim();
  const searchQuery = (searchParams.get("query") || "").toLowerCase().trim();

  // Filter labs according to organization & key licenses
  const accessibleLabs = LABS.filter((lab) => {
    // Normalization for subject matching
    const labSubject = lab.subject === "computerScience" ? "computer-science" : lab.subject;
    if (subjectFilter && labSubject !== subjectFilter) {
      return false;
    }

    if (searchQuery) {
      const matchName = lab.name.toLowerCase().includes(searchQuery);
      const matchDesc = lab.description?.toLowerCase().includes(searchQuery);
      const matchId = lab.id.toLowerCase().includes(searchQuery);
      if (!matchName && !matchDesc && !matchId) {
        return false;
      }
    }

    return hasLabAccess(auth.organization!, auth.apiKey!, lab.id);
  });

  const origin = new URL(request.url).origin;
  const sanitizedLabs = accessibleLabs.map((lab) => {
    const slug = lab.id.replace(/\//g, "-");
    const subject = lab.subject === "computerScience" ? "computer-science" : lab.subject;
    return {
      id: lab.id,
      slug,
      name: lab.name,
      subject,
      type: lab.type,
      description: lab.description,
      challengeEnabled: lab.challengeEnabled,
      embedUrl: `${origin}/embed/${encodeURIComponent(slug)}`,
    };
  });

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: auth.organization._id,
    apiKeyId: auth.apiKey._id,
    endpoint: "/api/v1/labs",
    method: "GET",
    statusCode: 200,
    responseTimeMs,
  });

  return apiSuccess(
    {
      labs: sanitizedLabs,
      totalAccessible: sanitizedLabs.length,
      filters: {
        subject: subjectFilter || null,
        query: searchQuery || null,
      },
    },
    { headers: rateLimitHeaders }
  );
}

