import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "openlabs-production-secret-key-2026";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    },
    SECRET,
    { expiresIn: "1d" }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
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
