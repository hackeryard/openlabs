import { IOrganization } from "@/app/models/Organization";

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory token bucket rate limiter indexed by organization ID
const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Checks and updates rate-limit quota for an organization using a sliding token-bucket algorithm.
 * Uses organization.plan.requestsPerMinute as the ceiling.
 */
export function checkRateLimit(organization: IOrganization): RateLimitResult {
  const orgId = organization._id.toString();
  const limit = organization.plan?.requestsPerMinute || 60;
  const now = Date.now();

  let bucket = buckets.get(orgId);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(orgId, bucket);
  }

  // Refill tokens proportionally over 60 seconds
  const elapsed = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = elapsed * (limit / 60);
  bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    const resetInSeconds = Math.max(1, Math.ceil((limit - bucket.tokens) / (limit / 60)));
    return {
      allowed: true,
      limit,
      remaining: Math.floor(bucket.tokens),
      resetInSeconds,
    };
  }

  // Rate limit exceeded
  const resetInSeconds = Math.max(1, Math.ceil((1 - bucket.tokens) / (limit / 60)));
  return {
    allowed: false,
    limit,
    remaining: 0,
    resetInSeconds,
  };
}

/**
 * Attaches standard RFC rate limit headers to responses.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetInSeconds),
  };
}

