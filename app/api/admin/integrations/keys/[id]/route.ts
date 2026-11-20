import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import ApiKey from "@/app/models/ApiKey";
import IntegrationEvent from "@/app/models/IntegrationEvent";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    await connectDB();

    const { id } = params;
    const key = await (ApiKey as any).findById(id);
    if (!key) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));

    if (body.status !== undefined) {
      const oldStatus = key.status;
      key.status = body.status;
      if (oldStatus !== body.status) {
        await (IntegrationEvent as any).create({
          organizationId: key.organizationId,
          eventType: body.status === "revoked" ? "key.revoked" : "key.status_changed",
          details: { keyId: key._id, keyPrefix: key.keyPrefix, from: oldStatus, to: body.status },
          actorUserId: auth.userId || null,
        });
      }
    }

    if (body.name !== undefined) {
      key.name = body.name.trim();
    }

    if (Array.isArray(body.scopes)) {
      key.scopes = body.scopes;
    }

    if (Array.isArray(body.permittedLabs)) {
      key.permittedLabs = body.permittedLabs;
    }

    await key.save();

    return NextResponse.json({
      success: true,
      apiKey: {
        _id: key._id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        scopes: key.scopes,
        permittedLabs: key.permittedLabs,
        status: key.status,
        expiresAt: key.expiresAt,
        lastUsedAt: key.lastUsedAt,
        requestCount: key.requestCount,
        updatedAt: key.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to update API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    await connectDB();

    const { id } = params;
    const key = await (ApiKey as any).findById(id);
    if (!key) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    await (ApiKey as any).findByIdAndDelete(id);

    await (IntegrationEvent as any).create({
      organizationId: key.organizationId,
      eventType: "key.deleted",
      details: { keyId: key._id, keyPrefix: key.keyPrefix, name: key.name },
      actorUserId: auth.userId || null,
    });

    return NextResponse.json({
      success: true,
      message: `API Key '${key.name}' (${key.keyPrefix}) permanently deleted`,
    });
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}

