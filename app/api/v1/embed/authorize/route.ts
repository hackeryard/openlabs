import jwt from "jsonwebtoken";
import { LABS } from "@/app/lib/labs";
import { getJwtSecret } from "@/app/lib/auth";
import { authenticateApiKey } from "@/app/lib/integrations/apiKeyAuth";
import { hasRequiredScope, hasLabAccess } from "@/app/lib/integrations/accessPolicy";
import { checkRateLimit, getRateLimitHeaders } from "@/app/lib/integrations/rateLimiter";
import { recordApiUsage } from "@/app/lib/integrations/usageMeter";
import { apiError, apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const start = Date.now();
  const auth = await authenticateApiKey(request);
  if (!auth.authorized || !auth.organization || !auth.apiKey) {
    return apiError(auth.error || "Unauthorized", auth.status);
  }

  // Verify scope
  if (!hasRequiredScope(auth.apiKey, "embed:create") && !hasRequiredScope(auth.apiKey, "labs:read")) {
    return apiError("Forbidden: Scope 'embed:create' or 'labs:read' required", 403);
  }

  // Rate limit check
  const rateLimit = checkRateLimit(auth.organization);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError("Too Many Requests: Rate limit exceeded", 429, {
      resetInSeconds: rateLimit.resetInSeconds,
    }, { headers: rateLimitHeaders });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON request body", 400);
  }

  const labIdParam = (body.labId || body.slug || "").trim().toLowerCase();
  if (!labIdParam) {
    return apiError("labId is required in request body (e.g. 'physics/freefall')", 400);
  }

  const normalizedId = labIdParam.replace(/-/g, "/");
  const lab = LABS.find(
    (l) =>
      l.id.toLowerCase() === normalizedId ||
      l.id.replace(/\//g, "-").toLowerCase() === labIdParam ||
      l.id.split("/")[1]?.toLowerCase() === labIdParam
  );

  if (!lab) {
    return apiError(`Lab '${labIdParam}' not found in catalog`, 404);
  }

  if (!hasLabAccess(auth.organization, auth.apiKey, lab.id)) {
    return apiError(
      `Forbidden: Organization license does not include lab '${lab.id}'`,
      403
    );
  }

  const secret = getJwtSecret();
  const origin = new URL(request.url).origin;
  const slug = lab.id.replace(/\//g, "-");

  // Sign a short-lived (15 minutes) embed authorization token
  const embedPayload = {
    type: "embed_auth",
    orgId: auth.organization._id.toString(),
    keyId: auth.apiKey._id.toString(),
    labId: lab.id,
    targetOrigin: body.targetOrigin || auth.organization.allowedOrigins?.[0] || "*",
  };

  const embedToken = jwt.sign(embedPayload, secret, {
    algorithm: "HS256",
    expiresIn: "15m",
  });

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const embedUrl = `${origin}/embed/${encodeURIComponent(slug)}?token=${encodeURIComponent(embedToken)}`;

  const responseTimeMs = Date.now() - start;
  recordApiUsage({
    organizationId: auth.organization._id,
    apiKeyId: auth.apiKey._id,
    endpoint: "/api/v1/embed/authorize",
    method: "POST",
    statusCode: 200,
    labId: lab.id,
    responseTimeMs,
  });

  return apiSuccess(
    {
      labId: lab.id,
      labName: lab.name,
      embedToken,
      embedUrl,
      expiresAt,
      expiresIn: "15m",
    },
    { headers: rateLimitHeaders }
  );
}

