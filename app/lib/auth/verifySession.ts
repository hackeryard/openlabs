import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export interface SessionVerificationOptions {
  checkDb?: boolean;
  allowUnverifiedEmail?: boolean;
}

export interface SessionAuthResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  role?: string;
  user?: any;
  error?: string;
  status: number;
}

/**
 * Extracts and verifies the user session from the HTTP Cookie or Bearer Authorization header.
 * 1. Checks token signature using the configured secret and strictly HS256.
 * 2. Validates expiration and required claims.
 * 3. If checkDb: true, fetches trusted user record from MongoDB, verifying user existence
 *    and genuine database role (preventing privilege escalation via stale/forged tokens).
 */
export async function verifySession(
  request?: Request,
  options: SessionVerificationOptions = {}
): Promise<SessionAuthResult> {
  let token: string | undefined;

  // 1. Try reading cookie
  try {
    const cookieStore = cookies();
    token = cookieStore.get("auth-token")?.value;
  } catch {
    // Context where cookies() is unavailable
  }

  // 2. Fall back to Bearer token in Authorization header
  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
    };
  }

  // 3. Cryptographically verify JWT signature, algorithm, and claims
  const payload = verifyToken(token) as any;
  if (!payload || !payload.id) {
    return {
      authorized: false,
      status: 401,
      error: "Invalid or expired authentication token",
    };
  }

  const userId = String(payload.id);
  const tokenEmail = payload.email || "";
  const tokenRole = payload.role || "user";

  // 4. Optionally verify against live MongoDB document
  if (options.checkDb) {
    try {
      await connectDB();
      const user = await (User as any).findById(userId).select("-password").lean();

      if (!user) {
        return {
          authorized: false,
          status: 401,
          error: "User not found or account deactivated",
        };
      }

      if (!options.allowUnverifiedEmail && !user.emailVerified) {
        return {
          authorized: false,
          status: 403,
          error: "Email address not verified",
        };
      }

      return {
        authorized: true,
        userId: user._id.toString(),
        email: user.email,
        role: user.role || "user",
        user,
        status: 200,
      };
    } catch (err) {
      console.error("Database session verification error:", err);
      return {
        authorized: false,
        status: 500,
        error: "Internal authentication verification error",
      };
    }
  }

  // Signature and claims verified
  return {
    authorized: true,
    userId,
    email: tokenEmail,
    role: tokenRole,
    status: 200,
  };
}

/**
 * Universal RBAC guard for administrative endpoints.
 * Enforces server-side database verification to guarantee role authenticity.
 */
export async function requireAdminSession(
  request?: Request,
  options: { checkDb?: boolean } = { checkDb: true }
): Promise<SessionAuthResult> {
  const result = await verifySession(request, { checkDb: options.checkDb !== false });

  if (!result.authorized) {
    return result;
  }

  const role = result.role;
  if (role !== "admin" && role !== "moderator") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Admin or Moderator role required",
    };
  }

  return result;
}

/**
 * Helper to prevent IDOR (Insecure Direct Object Reference) vulnerabilities.
 * Asserts that the authenticated user owns the resource or possesses admin privileges.
 */
export function verifyResourceOwnership(
  authResult: SessionAuthResult,
  resourceOwnerId: string | { toString(): string }
): boolean {
  if (!authResult.authorized || !authResult.userId) {
    return false;
  }

  // Admins have universal management authority
  if (authResult.role === "admin") {
    return true;
  }

  const resourceOwnerStr =
    typeof resourceOwnerId === "string"
      ? resourceOwnerId
      : resourceOwnerId.toString();

  return authResult.userId === resourceOwnerStr;
}

