import { LABS } from "@/app/lib/labs";
import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope, hasLabAccess } from "@/app/lib/integrations/accessPolicy";
import { checkRateLimit, getRateLimitHeaders } from "@/app/lib/integrations/rateLimiter";
import { recordApiUsage } from "@/app/lib/integrations/usageMeter";
import { apiError, apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const start = Date.now();
  const auth = await authenticateApiKey(request);
  if (!auth.authorized || !auth.organization || !auth.apiKey) {
    return apiError(auth.error || "Unauthorized", auth.status);
  }

  if (!hasRequiredScope(auth.apiKey, "labs:read")) {
    return apiError("Forbidden: Scope 'labs:read' required", 403);
  }

  const rateLimit = checkRateLimit(auth.organization);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError("Too Many Requests: Rate limit exceeded", 429, {
      resetInSeconds: rateLimit.resetInSeconds,
    }, { headers: rateLimitHeaders });
  }

  const slugParam = decodeURIComponent(params.slug || "").toLowerCase().trim();
  const normalizedId = slugParam.replace(/-/g, "/");

  // Find matching lab by id (physics/freefall), dashed slug (physics-freefall), or end-slug
  const lab = LABS.find(
    (l) =>
      l.id.toLowerCase() === normalizedId ||
      l.id.replace(/\//g, "-").toLowerCase() === slugParam ||
      l.id.split("/")[1]?.toLowerCase() === slugParam
  );

  if (!lab) {
    return apiError("Lab not found", 404);
  }

  // Verify licensing clearance for this specific lab
  if (!hasLabAccess(auth.organization, auth.apiKey, lab.id)) {
    return apiError(
      `Forbidden: Your organization license does not include lab '${lab.id}'`,
      403
    );
  }

  const origin = new URL(request.url).origin;
  const slug = lab.id.replace(/\//g, "-");
  const subject = lab.subject === "computerScience" ? "computer-science" : lab.subject;

  const labDetails = {
    id: lab.id,
    slug,
    name: lab.name,
    subject,
    type: lab.type,
    description: lab.description,
    challengeParams: lab.challengeParams || [],
    challengeEnabled: lab.challengeEnabled,
    embedUrl: `${origin}/embed/${encodeURIComponent(slug)}`,
  };

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: auth.organization._id,
    apiKeyId: auth.apiKey._id,
    endpoint: `/api/v1/labs/${slugParam}`,
    method: "GET",
    statusCode: 200,
    labId: lab.id,
    responseTimeMs,
  });

  return apiSuccess(
    { lab: labDetails },
    { headers: rateLimitHeaders }
  );
}

