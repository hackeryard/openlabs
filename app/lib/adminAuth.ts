import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export interface AdminAuthResult {
  authorized: boolean;
  role?: "admin" | "moderator";
  userId?: string;
  error?: string;
  status: number;
}

/**
 * Universal RBAC + Admin Secret access verification for all /api/admin routes:
 * 1. Admin Role (role === "admin"): Instant bypass, NO secret required (200 OK).
 * 2. Moderator Role (role === "moderator"): Allowed IF correct x-admin-secret provided (200 OK), otherwise (401 Unauthorized).
 * 3. Standalone Secret Key (x-admin-secret provided matching ADMIN_SECRET): Granted (200 OK) for server cron / maintenance scripts.
 * 4. Regular User (role === "user" or missing): 403 Forbidden.
 * 5. Unauthenticated without secret: 401 Unauthorized.
 */
export function verifyAdminAccess(request?: Request): AdminAuthResult {
  const expectedSecret = process.env.ADMIN_SECRET || "openlabs-secret-key-2026";
  const adminSecretHeader = request?.headers.get("x-admin-secret");

  // 1. Extract and verify user JWT token from cookies or Authorization header
  let token: string | undefined;
  try {
    token = cookies().get("auth-token")?.value;
  } catch {
    // Context without cookies()
  }

  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  const payload = token ? (verifyToken(token) as any) : null;
  const userRole = payload?.role;

  // 1. Admin role has direct clearance without asking for secret
  if (userRole === "admin") {
    return {
      authorized: true,
      role: "admin",
      userId: payload?.id,
      status: 200,
    };
  }

  // 2. Moderator role requires entering the Admin Secret
  if (userRole === "moderator") {
    if (adminSecretHeader && adminSecretHeader.trim() === expectedSecret) {
      return {
        authorized: true,
        role: "moderator",
        userId: payload?.id,
        status: 200,
      };
    }
    return {
      authorized: false,
      status: 401,
      error: "Admin Secret required for Moderator access",
    };
  }

  // 3. Regular users (role === "user") attempting admin access: STRICT 403 Forbidden
  // Even if a secret key is sent, regular user accounts are strictly forbidden.
  if (userRole === "user") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Admin or Moderator role required",
    };
  }

  // 4. Standalone Secret Key fallback ONLY for server cron / backend CLI (no user token attached)
  if (!userRole && adminSecretHeader && adminSecretHeader.trim() === expectedSecret) {
    return {
      authorized: true,
      role: "admin",
      status: 200,
    };
  }

  // 5. Unauthenticated requests without secret
  return {
    authorized: false,
    status: 401,
    error: "Authentication required",
  };
}
