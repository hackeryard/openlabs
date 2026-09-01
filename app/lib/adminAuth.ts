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
 * Universal RBAC access verification for all /api/admin routes:
 * 1. Admin & Moderator Roles (role === "admin" | "moderator"): Authorized (200 OK).
 * 2. Regular User (role === "user"): 403 Forbidden.
 * 3. Unauthenticated: 401 Unauthorized.
 */
export function verifyAdminAccess(request?: Request): AdminAuthResult {
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

  // 1. Admin or Moderator role has direct clearance
  if (userRole === "admin" || userRole === "moderator") {
    return {
      authorized: true,
      role: userRole,
      userId: payload?.id,
      status: 200,
    };
  }

  // 2. Regular users (role === "user") attempting admin access: STRICT 403 Forbidden
  if (userRole === "user") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Admin or Moderator role required",
    };
  }

  // 3. Unauthenticated requests
  return {
    authorized: false,
    status: 401,
    error: "Authentication required",
  };
}
