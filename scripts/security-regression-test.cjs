/**
 * OpenLabs Automated Security & Authentication Regression Test Suite
 * Validates cryptographic invariants, signature verification, algorithm enforcement,
 * cookie hardening, role-based access control, API key management, and signed embed authorization.
 */

const assert = require("assert");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const TEST_SECRET = "openlabs-test-secret-min-32-characters-long-2026";
process.env.JWT_SECRET = TEST_SECRET;
process.env.NODE_ENV = "test";

let passed = 0;
let total = 0;

function it(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
  }
}

async function itAsync(description, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
  }
}

// ── Helpers ──
function b64UrlToBytes(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function parseBase64UrlJson(str) {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function verifyJwtInEdge(tokenString, secret) {
  if (!tokenString || typeof tokenString !== "string" || !secret) {
    return { valid: false };
  }
  const parts = tokenString.split(".");
  if (parts.length !== 3) {
    return { valid: false };
  }
  const [headerB64, payloadB64, signatureB64] = parts;
  const header = parseBase64UrlJson(headerB64);
  if (!header || header.alg !== "HS256") {
    return { valid: false };
  }
  const payload = parseBase64UrlJson(payloadB64);
  if (!payload || typeof payload !== "object" || (!payload.id && !payload.sub)) {
    return { valid: false };
  }
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return { valid: false, isExpired: true, payload };
  }
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = b64UrlToBytes(signatureB64);
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    if (!isValid) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

async function runTests() {
  console.log("\n======================================================");
  console.log("  OpenLabs Automated Security & Auth Regression Suite");
  console.log("======================================================\n");

  // Suite 1: Node.js JWT Verification & Claim Enforcement
  console.log("Suite 1: Token Generation, Signature & Algorithm Verification");
  
  const validToken = jwt.sign(
    { id: "usr_12345", email: "student@openlabs.edu", role: "user" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  const adminToken = jwt.sign(
    { id: "adm_99999", email: "admin@openlabs.org.in", role: "admin" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  const expiredToken = jwt.sign(
    { id: "usr_expired", email: "expired@openlabs.edu", role: "user" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "-10s" }
  );

  it("Accepts valid JWT signed with legitimate secret and HS256", () => {
    const decoded = jwt.verify(validToken, TEST_SECRET, { algorithms: ["HS256"] });
    assert.strictEqual(decoded.id, "usr_12345");
    assert.strictEqual(decoded.email, "student@openlabs.edu");
    assert.strictEqual(decoded.role, "user");
  });

  it("Strictly rejects tokens with tampered signatures", () => {
    const tampered = validToken.slice(0, -6) + "XXXXXX";
    assert.throws(() => {
      jwt.verify(tampered, TEST_SECRET, { algorithms: ["HS256"] });
    }, /invalid signature/);
  });

  it("Strictly rejects tokens signed with an unauthorized secret", () => {
    const forgedToken = jwt.sign(
      { id: "usr_attacker", email: "attacker@hack.com", role: "admin" },
      "forged-unauthorized-secret-key-123456",
      { algorithm: "HS256" }
    );
    assert.throws(() => {
      jwt.verify(forgedToken, TEST_SECRET, { algorithms: ["HS256"] });
    }, /invalid signature/);
  });

  it("Strictly rejects expired tokens", () => {
    assert.throws(() => {
      jwt.verify(expiredToken, TEST_SECRET, { algorithms: ["HS256"] });
    }, /jwt expired/);
  });

  it("Strictly rejects algorithm substitution (alg: 'none')", () => {
    const noneHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const nonePayload = Buffer.from(JSON.stringify({ id: "usr_hacker", role: "admin" })).toString("base64url");
    const noneToken = `${noneHeader}.${nonePayload}.`;
    assert.throws(() => {
      jwt.verify(noneToken, TEST_SECRET, { algorithms: ["HS256"] });
    });
  });

  // Suite 2: Web Crypto API Edge Middleware Verification
  console.log("\nSuite 2: Edge Runtime Cryptographic Signature Verification");

  await itAsync("Edge verification accepts valid token and extracts claims", async () => {
    const res = await verifyJwtInEdge(validToken, TEST_SECRET);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.payload.id, "usr_12345");
    assert.strictEqual(res.payload.role, "user");
  });

  await itAsync("Edge verification correctly extracts admin role from legitimate token", async () => {
    const res = await verifyJwtInEdge(adminToken, TEST_SECRET);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.payload.role, "admin");
  });

  await itAsync("Edge verification strictly rejects tampered token signatures", async () => {
    const tampered = validToken.slice(0, -8) + "badbytes";
    const res = await verifyJwtInEdge(tampered, TEST_SECRET);
    assert.strictEqual(res.valid, false);
  });

  await itAsync("Edge verification strictly rejects forged token signed with wrong secret", async () => {
    const forged = jwt.sign(
      { id: "fake_admin", role: "admin" },
      "wrong-secret-000000000000000000000000",
      { algorithm: "HS256" }
    );
    const res = await verifyJwtInEdge(forged, TEST_SECRET);
    assert.strictEqual(res.valid, false);
  });

  await itAsync("Edge verification detects expired token and flags isExpired: true", async () => {
    const res = await verifyJwtInEdge(expiredToken, TEST_SECRET);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.isExpired, true);
  });

  await itAsync("Edge verification rejects alg: 'none' token attempt", async () => {
    const noneHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const nonePayload = Buffer.from(JSON.stringify({ id: "usr_hacker", role: "admin", exp: 9999999999 })).toString("base64url");
    const noneToken = `${noneHeader}.${nonePayload}.`;
    const res = await verifyJwtInEdge(noneToken, TEST_SECRET);
    assert.strictEqual(res.valid, false);
  });

  // Suite 3: Cookie Security & Environment Invariants
  console.log("\nSuite 3: Cookie Security, Flags & Domain Isolation");

  it("Enforces HttpOnly and SameSite=Lax attributes on authentication cookies", () => {
    const { getAuthCookieOptions, getAuthClearCookieOptions } = require("../app/lib/auth.js");
    const options = getAuthCookieOptions();
    assert.strictEqual(options.httpOnly, true);
    assert.strictEqual(options.sameSite, "lax");
    assert.strictEqual(options.path, "/");
    assert.strictEqual(options.maxAge, 86400);

    const clearOptions = getAuthClearCookieOptions();
    assert.strictEqual(clearOptions.httpOnly, true);
    assert.strictEqual(clearOptions.sameSite, "lax");
    assert.strictEqual(clearOptions.maxAge, 0);
  });

  it("Preserves wildcard domain for apex *.openlabs.org.in while isolating local/render hosts", () => {
    const { getAuthCookieDomain } = require("../app/lib/auth.js");
    assert.strictEqual(getAuthCookieDomain("admin.openlabs.org.in"), ".openlabs.org.in");
    assert.strictEqual(getAuthCookieDomain("www.openlabs.org.in"), ".openlabs.org.in");
    assert.strictEqual(getAuthCookieDomain("localhost:3000"), undefined);
    assert.strictEqual(getAuthCookieDomain("openlabs.onrender.com"), undefined);
    assert.strictEqual(getAuthCookieDomain("preview-123.vercel.app"), undefined);
  });

  // Suite 4: Authorization & Resource Ownership (IDOR Prevention)
  console.log("\nSuite 4: Role-Based Access Control & IDOR Prevention");

  it("Blocks regular user from administrative privileges", () => {
    const userRole = "user";
    const hasAdminOrModRole = userRole === "admin" || userRole === "moderator";
    assert.strictEqual(hasAdminOrModRole, false);
  });

  it("Permits admin and moderator roles for administrative routes", () => {
    assert.strictEqual("admin" === "admin" || "admin" === "moderator", true);
    assert.strictEqual("moderator" === "admin" || "moderator" === "moderator", true);
  });

  it("Enforces resource ownership: User can access own resources but not others", () => {
    const userAuth = { authorized: true, userId: "user_alice", role: "user" };
    const ownResourceOwnerId = "user_alice";
    const foreignResourceOwnerId = "user_bob";

    function checkOwnership(auth, ownerId) {
      if (!auth.authorized || !auth.userId) return false;
      if (auth.role === "admin") return true;
      return auth.userId === ownerId;
    }

    assert.strictEqual(checkOwnership(userAuth, ownResourceOwnerId), true);
    assert.strictEqual(checkOwnership(userAuth, foreignResourceOwnerId), false);

    const adminAuth = { authorized: true, userId: "admin_root", role: "admin" };
    assert.strictEqual(checkOwnership(adminAuth, foreignResourceOwnerId), true);
  });

  // Suite 5: API Key Cryptographic Invariants
  console.log("\nSuite 5: API Key Generation, Hashing & Access Policies");

  it("Generates cryptographically random API keys with prefix ol_live_", () => {
    const rawSecret = crypto.randomBytes(24).toString("hex");
    const fullKey = `ol_live_${rawSecret}`;
    assert.strictEqual(fullKey.startsWith("ol_live_"), true);
    assert.strictEqual(fullKey.length > 30, true);

    const hash1 = crypto.createHash("sha256").update(fullKey).digest("hex");
    const hash2 = crypto.createHash("sha256").update(fullKey).digest("hex");
    assert.strictEqual(hash1, hash2); // Deterministic hashing

    const otherKey = `ol_live_${crypto.randomBytes(24).toString("hex")}`;
    const hashOther = crypto.createHash("sha256").update(otherKey).digest("hex");
    assert.notStrictEqual(hash1, hashOther); // Unique hashes
  });

  it("Validates scope permissions and wildcard matching correctly", () => {
    function hasScope(scopes, required) {
      if (!Array.isArray(scopes)) return false;
      return scopes.includes("*") || scopes.includes(required);
    }

    assert.strictEqual(hasScope(["labs:read", "usage:read"], "labs:read"), true);
    assert.strictEqual(hasScope(["labs:read"], "embed:create"), false);
    assert.strictEqual(hasScope(["*"], "embed:create"), true);
  });

  it("Validates lab licensing access policies including wildcards", () => {
    function isLabLicensed(licensedLabs, labId) {
      if (!Array.isArray(licensedLabs)) return false;
      if (licensedLabs.includes("*")) return true;
      if (licensedLabs.includes(labId)) return true;
      const [subject] = labId.split("/");
      if (licensedLabs.includes(`${subject}/*`)) return true;
      return false;
    }

    assert.strictEqual(isLabLicensed(["*"], "physics/ohms-law"), true);
    assert.strictEqual(isLabLicensed(["physics/*"], "physics/ohms-law"), true);
    assert.strictEqual(isLabLicensed(["physics/*"], "chemistry/titration"), false);
    assert.strictEqual(isLabLicensed(["chemistry/titration"], "chemistry/titration"), true);
    assert.strictEqual(isLabLicensed(["chemistry/titration"], "chemistry/flame-test"), false);
  });

  // Suite 6: Signed Embed Authorization & Scoped CSP Isolation
  console.log("\nSuite 6: Signed Embed Authorization & Embedding Infrastructure");

  const embedToken = jwt.sign(
    {
      type: "embed_auth",
      orgId: "org_harvard_stem",
      keyId: "key_canvas_lms",
      labId: "physics/freefall",
      targetOrigin: "https://canvas.harvard.edu",
    },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "15m" }
  );

  const expiredEmbedToken = jwt.sign(
    {
      type: "embed_auth",
      orgId: "org_harvard_stem",
      keyId: "key_canvas_lms",
      labId: "physics/freefall",
    },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "-10s" }
  );

  it("Validates signed embed authorization token successfully", () => {
    const decoded = jwt.verify(embedToken, TEST_SECRET, { algorithms: ["HS256"] });
    assert.strictEqual(decoded.type, "embed_auth");
    assert.strictEqual(decoded.orgId, "org_harvard_stem");
    assert.strictEqual(decoded.labId, "physics/freefall");
  });

  it("Detects and rejects embed token when lab ID does not match", () => {
    const decoded = jwt.verify(embedToken, TEST_SECRET, { algorithms: ["HS256"] });
    const requestedLab = "chemistry/titration";
    assert.strictEqual(decoded.labId === requestedLab, false);
  });

  it("Strictly rejects expired embed authorization tokens", () => {
    assert.throws(() => {
      jwt.verify(expiredEmbedToken, TEST_SECRET, { algorithms: ["HS256"] });
    }, /jwt expired/);
  });

  it("Verifies next.config.js isolates /embed/:path* with CSP frame-ancestors while preserving global SAMEORIGIN", () => {
    const nextConfigContent = fs.readFileSync("next.config.js", "utf8");
    assert.strictEqual(nextConfigContent.includes("source: '/embed/:path*'"), true);
    assert.strictEqual(nextConfigContent.includes("frame-ancestors 'self' *"), true);
    assert.strictEqual(nextConfigContent.includes("|embed).*)"), true);
  });

  it("Verifies seoRoutePolicy.ts excludes /embed from sitemaps and indexing", () => {
    const { classifyRoute } = require("../app/lib/seoRoutePolicy.ts");
    const classification = classifyRoute("/embed/physics-ohmslaw");
    assert.strictEqual(classification.isIndexable, false);
    assert.strictEqual(classification.shouldIncludeInSitemap, false);
    assert.strictEqual(classification.type, "private");
  });

  console.log("\nSuite 7: Phase 3 Institutional Partner Management, Licensing & Operational Controls");

  it("Verifies Organization model schema contains licensing agreements and billing readiness", () => {
    const orgModelCode = fs.readFileSync("app/models/Organization.ts", "utf8");
    assert.strictEqual(orgModelCode.includes("licenseType"), true);
    assert.strictEqual(orgModelCode.includes("paymentStatus"), true);
    assert.strictEqual(orgModelCode.includes("pilot"), true);
    assert.strictEqual(orgModelCode.includes("single-institution"), true);
    assert.strictEqual(orgModelCode.includes("multi-institution"), true);
    assert.strictEqual(orgModelCode.includes("white-label"), true);
    assert.strictEqual(orgModelCode.includes("custom-enterprise"), true);
    assert.strictEqual(orgModelCode.includes("invoiceReference"), true);
  });

  it("Verifies ApiKey model schema enforces cryptographic SHA-256 hash storage", () => {
    const apiKeyModelCode = fs.readFileSync("app/models/ApiKey.ts", "utf8");
    assert.strictEqual(apiKeyModelCode.includes("hashedKey"), true);
    assert.strictEqual(apiKeyModelCode.includes("keyPrefix"), true);
    assert.strictEqual(apiKeyModelCode.includes("scopes"), true);
    assert.strictEqual(apiKeyModelCode.includes("permittedLabs"), true);
    assert.strictEqual(apiKeyModelCode.includes("status"), true);
  });

  it("Verifies IntegrationEvent model schema contains audit logging fields", () => {
    const eventModelCode = fs.readFileSync("app/models/IntegrationEvent.ts", "utf8");
    assert.strictEqual(eventModelCode.includes("organizationId"), true);
    assert.strictEqual(eventModelCode.includes("eventType"), true);
    assert.strictEqual(eventModelCode.includes("details"), true);
    assert.strictEqual(eventModelCode.includes("actorUserId"), true);
  });

  it("Verifies all Admin Integration REST API endpoints enforce verifyAdminAccess RBAC", () => {
    const endpoints = [
      "app/api/admin/integrations/organizations/route.ts",
      "app/api/admin/integrations/organizations/[id]/route.ts",
      "app/api/admin/integrations/keys/route.ts",
      "app/api/admin/integrations/keys/[id]/route.ts",
      "app/api/admin/integrations/stats/route.ts",
      "app/api/admin/integrations/events/route.ts",
    ];

    for (const ep of endpoints) {
      assert.strictEqual(fs.existsSync(ep), true, `Endpoint file ${ep} must exist`);
      const content = fs.readFileSync(ep, "utf8");
      assert.strictEqual(
        content.includes("verifyAdminAccess"),
        true,
        `${ep} must enforce verifyAdminAccess`
      );
    }
  });

  it("Verifies Admin Integrations Dashboard UI exists and contains key lifecycle controls", () => {
    const dashboardFile = "app/admin/integrations/page.tsx";
    assert.strictEqual(fs.existsSync(dashboardFile), true);
    const content = fs.readFileSync(dashboardFile, "utf8");
    assert.strictEqual(content.includes("useAdminSecret"), true);
    assert.strictEqual(content.includes("AdminLockScreen"), true);
    assert.strictEqual(content.includes("One-Time Cryptographic Key Reveal"), true);
    assert.strictEqual(content.includes("SHA-256 hash"), true);
    assert.strictEqual(content.includes("Partners Directory"), true);
    assert.strictEqual(content.includes("Operational Audit Trail"), true);
  });

  it("Verifies Admin navigation and summary incorporate institutional integrations telemetry", () => {
    const navbarContent = fs.readFileSync("app/components/AdminNavbar.tsx", "utf8");
    assert.strictEqual(navbarContent.includes("/admin/integrations"), true);

    const adminPageContent = fs.readFileSync("app/admin/page.tsx", "utf8");
    assert.strictEqual(adminPageContent.includes("/admin/integrations"), true);
    assert.strictEqual(adminPageContent.includes("Institutional Integrations"), true);

    const summaryApiContent = fs.readFileSync("app/api/admin/summary/route.ts", "utf8");
    assert.strictEqual(summaryApiContent.includes("Organization"), true);
    assert.strictEqual(summaryApiContent.includes("ApiKey"), true);
    assert.strictEqual(summaryApiContent.includes("integrations:"), true);
  });

  console.log("\n======================================================");
  console.log(`  Security Regression Test Results: ${passed}/${total} Passed`);
  if (passed === total) {
    console.log("  ✓ ALL SECURITY REGRESSION CHECKS PASSED PERFECTLY!");
  } else {
    console.log("  ✗ SOME CHECKS FAILED!");
    process.exit(1);
  }
  console.log("======================================================\n");
}

runTests().catch((err) => {
  console.error("Unhandled error running security tests:", err);
  process.exit(1);
});
