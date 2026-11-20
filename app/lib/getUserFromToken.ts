import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export interface UserTokenPayload {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

/**
 * Retrieves and cryptographically validates the user identity from HTTP cookie or Bearer token.
 * Returns null if no token is present, the signature is invalid, expired, or missing claims.
 */
export function getUserFromToken(request?: Request): UserTokenPayload | null {
  let token: string | undefined;

  try {
    token = cookies().get("auth-token")?.value;
  } catch {
    // Context without cookies() accessor
  }

  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  const payload = verifyToken(token) as UserTokenPayload | null;
  return payload;
}
