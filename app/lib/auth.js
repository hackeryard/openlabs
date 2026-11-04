import jwt from "jsonwebtoken";

/**
 * Resolves the JWT secret with strict environment enforcement.
 * In production, fails closed if no secret is configured.
 * In development/test, provides a safe development fallback.
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) {
    return secret;
  }

  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    throw new Error(
      "[SECURITY FATAL] JWT_SECRET or NEXTAUTH_SECRET environment variable is strictly required in production."
    );
  }

  // Safe development fallback only for local offline development / automated testing
  return process.env.DEV_JWT_SECRET || "openlabs-dev-secret-do-not-use-in-production-min-32-chars";
}

/**
 * Generates a signed JWT with explicit HS256 algorithm and required user claims.
 */
export function generateToken(user, options = {}) {
  if (!user || (!user._id && !user.id)) {
    throw new Error("Invalid user object: missing user ID for token generation.");
  }

  const secret = getJwtSecret();
  const userId = String(user._id || user.id);

  return jwt.sign(
    {
      id: userId,
      email: user.email || "",
      role: user.role || "user",
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: options.expiresIn || "1d",
    }
  );
}

/**
 * Verifies JWT signature, expiration, algorithm (strictly HS256), and required claims.
 * Returns null if token is forged, tampered with, expired, or missing claims.
 */
export function verifyToken(token, options = {}) {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      ...options,
    });

    // Validate essential claims
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const userId = payload.id || payload.sub;
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Dynamically resolves the cookie domain.
 * Preserves cross-subdomain SSO (e.g. admin.openlabs.org.in) on .openlabs.org.in,
 * while returning undefined on Render (*.onrender.com), localhost, and preview domains
 * so browsers never reject or drop authentication cookies.
 */
export function getAuthCookieDomain(reqOrHost) {
  if (!reqOrHost) return undefined;
  let host = "";
  if (typeof reqOrHost === "string") {
    host = reqOrHost;
  } else if (reqOrHost.headers) {
    if (typeof reqOrHost.headers.get === "function") {
      host = reqOrHost.headers.get("x-forwarded-host") || reqOrHost.headers.get("host") || "";
    } else {
      host = reqOrHost.headers["x-forwarded-host"] || reqOrHost.headers.host || "";
    }
  } else if (reqOrHost.url) {
    try {
      host = new URL(reqOrHost.url).host;
    } catch {
      host = "";
    }
  }
  const cleanHost = host.split(":")[0].toLowerCase().trim();
  if (cleanHost.endsWith("openlabs.org.in")) {
    return ".openlabs.org.in";
  }
  return undefined;
}

/**
 * Centralized, hardened cookie options for authentication tokens.
 * Enforces httpOnly, sameSite: "lax", and secure in production.
 */
export function getAuthCookieOptions(reqOrHost, maxAge = 60 * 60 * 24) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    domain: getAuthCookieDomain(reqOrHost),
    maxAge,
  };
}

/**
 * Centralized cookie options to immediately clear/invalidate authentication tokens.
 */
export function getAuthClearCookieOptions(reqOrHost) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    domain: getAuthCookieDomain(reqOrHost),
    expires: new Date(0),
    maxAge: 0,
  };
}
