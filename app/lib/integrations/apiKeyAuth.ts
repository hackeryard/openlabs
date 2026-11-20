import crypto from "crypto";
import { connectDB } from "@/app/lib/mongodb";
import ApiKey, { IApiKey } from "@/app/models/ApiKey";
import Organization, { IOrganization } from "@/app/models/Organization";

export interface KeyGenerationResult {
  rawKey: string;
  keyPrefix: string;
  hashedKey: string;
}

export interface ApiKeyAuthResult {
  authorized: boolean;
  status: number;
  error?: string;
  apiKey?: IApiKey;
  organization?: IOrganization;
}

/**
 * Generates a cryptographically secure API key pair:
 * - rawKey: "ol_live_<random_bytes>" (shown to user ONCE)
 * - keyPrefix: "ol_live_7a9f..." (safe for display)
 * - hashedKey: SHA-256 hash (stored in database)
 */
export function generateApiKeyPair(): KeyGenerationResult {
  const secretBytes = crypto.randomBytes(32).toString("hex");
  const rawKey = `ol_live_${secretBytes}`;
  const keyPrefix = `ol_live_${secretBytes.substring(0, 8)}...`;
  const hashedKey = hashApiKey(rawKey);

  return {
    rawKey,
    keyPrefix,
    hashedKey,
  };
}

/**
 * Cryptographic SHA-256 hash of raw API key.
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash("sha256").update(rawKey.trim()).digest("hex");
}

/**
 * Extracts and authenticates an incoming partner request via API key.
 * 1. Reads key from Authorization header ("Bearer ol_live_...") or X-API-Key header.
 * 2. Computes SHA-256 hash.
 * 3. Checks ApiKey document status & expiry.
 * 4. Checks Organization document status & license validUntil.
 * 5. Asynchronously updates usage timestamp & counter.
 */
export async function authenticateApiKey(
  request: Request
): Promise<ApiKeyAuthResult> {
  let rawKey: string | null = null;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    rawKey = authHeader.substring(7).trim();
  }

  if (!rawKey) {
    rawKey = request.headers.get("x-api-key")?.trim() || null;
  }

  if (!rawKey) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required: Missing API key in Authorization or X-API-Key header",
    };
  }

  if (!rawKey.startsWith("ol_live_")) {
    return {
      authorized: false,
      status: 401,
      error: "Invalid API key format. Expected format: ol_live_<secret>",
    };
  }

  try {
    await connectDB();
    const hashedKey = hashApiKey(rawKey);

    const apiKey = await ApiKey.findOne({ hashedKey });
    if (!apiKey) {
      return {
        authorized: false,
        status: 401,
        error: "Invalid or unrecognized API key",
      };
    }

    if (apiKey.status !== "active") {
      return {
        authorized: false,
        status: 403,
        error: `API key is inactive (status: ${apiKey.status})`,
      };
    }

    if (apiKey.expiresAt && new Date() > new Date(apiKey.expiresAt)) {
      return {
        authorized: false,
        status: 403,
        error: "API key has expired",
      };
    }

    const organization = await Organization.findById(apiKey.organizationId);
    if (!organization) {
      return {
        authorized: false,
        status: 403,
        error: "Organization associated with this API key not found",
      };
    }

    if (organization.status !== "active") {
      return {
        authorized: false,
        status: 403,
        error: `Organization license is not active (status: ${organization.status})`,
      };
    }

    if (organization.validUntil && new Date() > new Date(organization.validUntil)) {
      return {
        authorized: false,
        status: 403,
        error: "Organization subscription/license period has expired",
      };
    }

    // Silently update API key activity in background without blocking
    ApiKey.findByIdAndUpdate(apiKey._id, {
      $set: { lastUsedAt: new Date() },
      $inc: { requestCount: 1 },
    }).catch((err) => console.error("Error updating API key activity:", err));

    return {
      authorized: true,
      status: 200,
      apiKey,
      organization,
    };
  } catch (err) {
    console.error("API key authentication error:", err);
    return {
      authorized: false,
      status: 500,
      error: "Internal server error authenticating API key",
    };
  }
}

