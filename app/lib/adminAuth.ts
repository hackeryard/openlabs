import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { connectDB } from "./mongodb";
import User from "@/app/models/User";

export interface AdminAuthResult {
  authorized: boolean;
  role?: "admin" | "moderator";
  userId?: string;
  email?: string;
  error?: string;
  status: number;
}

/**
 * Universal RBAC access verification for /api/admin routes:
 * 1. Admin & Moderator Roles (role === "admin" | "moderator"): Authorized (200 OK).
 * 2. Regular User (role === "user"): 403 Forbidden.
 * 3. Unauthenticated / Invalid Signature: 401 Unauthorized.
 */
export function verifyAdminAccess(request?: Request): AdminAuthResult {
  let token: string | undefined;
  try {
    token = cookies().get("auth-token")?.value;
  } catch {
    // Context without cookies()
  }

  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // Cryptographically verifies signature, algorithm, and non-expired status
  const payload = token ? (verifyToken(token) as any) : null;
  if (!payload || !payload.id) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const userRole = payload?.role;

  // 1. Admin or Moderator role has verified clearance
  if (userRole === "admin" || userRole === "moderator") {
    return {
      authorized: true,
      role: userRole,
      userId: payload.id,
      email: payload.email,
      status: 200,
    };
  }

  // 2. Regular users attempting admin access: STRICT 403 Forbidden
  if (userRole === "user") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Admin or Moderator role required",
    };
  }

  return {
    authorized: false,
    status: 401,
    error: "Authentication required",
  };
}

/**
 * Enhanced async RBAC verification that confirms the user's role directly against MongoDB.
 * Recommended for high-sensitivity operations (e.g. role modification, deletion, financial/licensing changes).
 */
export async function verifyAdminAccessWithDb(request?: Request): Promise<AdminAuthResult> {
  const basicAuth = verifyAdminAccess(request);
  if (!basicAuth.authorized || !basicAuth.userId) {
    return basicAuth;
  }

  try {
    await connectDB();
    const dbUser = await (User as any).findById(basicAuth.userId).select("role emailVerified").lean();

    if (!dbUser) {
      return {
        authorized: false,
        status: 401,
        error: "User not found or account deactivated",
      };
    }

    if (dbUser.role !== "admin" && dbUser.role !== "moderator") {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: Admin or Moderator privileges revoked",
      };
    }

    return {
      authorized: true,
      role: dbUser.role,
      userId: basicAuth.userId,
      email: basicAuth.email,
      status: 200,
    };
  } catch (err) {
    console.error("Database admin access verification error:", err);
    return {
      authorized: false,
      status: 500,
      error: "Server error verifying admin credentials",
    };
  }
}
