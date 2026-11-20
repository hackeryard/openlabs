import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import Organization from "@/app/models/Organization";
import ApiKey from "@/app/models/ApiKey";
import IntegrationEvent from "@/app/models/IntegrationEvent";
import { generateApiKeyPair } from "@/app/lib/integrations/apiKeyAuth";

export async function POST(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const {
      organizationId,
      name,
      scopes = ["labs:read", "embed:create", "usage:read"],
      permittedLabs = ["*"],
      expiresInDays,
    } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 }
      );
    }

    const org = await (Organization as any).findById(organizationId);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Generate cryptographic key pair (plaintext raw key + SHA-256 hash + keyPrefix)
    const { rawKey, hashedKey, keyPrefix } = generateApiKeyPair();

    const expiresAt =
      expiresInDays && Number(expiresInDays) > 0
        ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
        : null;

    const apiKeyDoc = await (ApiKey as any).create({
      name: name.trim(),
      keyPrefix,
      hashedKey,
      organizationId: org._id,
      scopes: Array.isArray(scopes) ? scopes : ["labs:read"],
      permittedLabs: Array.isArray(permittedLabs) ? permittedLabs : ["*"],
      status: "active",
      expiresAt,
      createdBy: auth.userId || null,
    });

    // Record audit event
    await (IntegrationEvent as any).create({
      organizationId: org._id,
      eventType: "key.generated",
      details: {
        keyId: apiKeyDoc._id,
        keyName: apiKeyDoc.name,
        keyPrefix,
        scopes: apiKeyDoc.scopes,
      },
      actorUserId: auth.userId || null,
      timestamp: new Date(),
    });

    // Return rawKey ONLY ONCE here. It cannot be recovered later!
    return NextResponse.json(
      {
        success: true,
        key: rawKey,
        apiKey: {
          _id: apiKeyDoc._id,
          name: apiKeyDoc.name,
          keyPrefix: apiKeyDoc.keyPrefix,
          scopes: apiKeyDoc.scopes,
          permittedLabs: apiKeyDoc.permittedLabs,
          status: apiKeyDoc.status,
          expiresAt: apiKeyDoc.expiresAt,
          createdAt: apiKeyDoc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to generate API key:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}
