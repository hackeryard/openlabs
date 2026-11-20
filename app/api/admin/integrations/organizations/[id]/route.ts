import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import Organization from "@/app/models/Organization";
import ApiKey from "@/app/models/ApiKey";
import ApiUsage from "@/app/models/ApiUsage";
import IntegrationEvent from "@/app/models/IntegrationEvent";

export async function GET(
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
    const org = await (Organization as any).findById(id).lean();
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Fetch keys
    const keys = await (ApiKey as any)
      .find({ organizationId: org._id })
      .select("name keyPrefix scopes permittedLabs status expiresAt lastUsedAt requestCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch recent usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [monthlyRequests, totalRequests, recentUsageLogs] = await Promise.all([
      (ApiUsage as any).countDocuments({
        organizationId: org._id,
        timestamp: { $gte: startOfMonth },
      }),
      (ApiUsage as any).countDocuments({
        organizationId: org._id,
      }),
      (ApiUsage as any)
        .find({ organizationId: org._id })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
    ]);

    // Fetch recent integration audit events
    const recentEvents = await (IntegrationEvent as any)
      .find({ organizationId: org._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      organization: {
        ...org,
        stats: {
          monthlyRequests,
          totalRequests,
          monthlyQuota: org.plan?.maxMonthlyRequests || 10000,
          usagePercent: Math.min(
            100,
            Math.round(
              (monthlyRequests / (org.plan?.maxMonthlyRequests || 10000)) * 100
            )
          ),
        },
      },
      keys,
      recentUsageLogs,
      recentEvents,
    });
  } catch (error) {
    console.error("Failed to fetch organization details:", error);
    return NextResponse.json(
      { error: "Failed to load organization details" },
      { status: 500 }
    );
  }
}

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
    const org = await (Organization as any).findById(id);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Update mutable fields
    if (body.name !== undefined) org.name = body.name.trim();
    if (body.type !== undefined) org.type = body.type;
    if (body.status !== undefined) {
      const oldStatus = org.status;
      org.status = body.status;
      if (oldStatus !== body.status) {
        await (IntegrationEvent as any).create({
          organizationId: org._id,
          eventType: "organization.status_changed",
          details: { from: oldStatus, to: body.status },
          actorUserId: auth.userId || null,
        });
      }
    }
    if (body.contactEmail !== undefined) {
      org.contactEmail = body.contactEmail.toLowerCase().trim();
    }
    if (body.licenseType !== undefined) {
      org.licenseType = body.licenseType;
    }

    // Plan & quotas
    if (body.plan) {
      org.plan = {
        name: body.plan.name || org.plan.name,
        maxMonthlyRequests:
          body.plan.maxMonthlyRequests !== undefined
            ? Number(body.plan.maxMonthlyRequests)
            : org.plan.maxMonthlyRequests,
        requestsPerMinute:
          body.plan.requestsPerMinute !== undefined
            ? Number(body.plan.requestsPerMinute)
            : org.plan.requestsPerMinute,
        maxStudents:
          body.plan.maxStudents !== undefined
            ? Number(body.plan.maxStudents)
            : org.plan.maxStudents,
      };
    }

    // Origins and labs
    if (Array.isArray(body.allowedOrigins)) {
      org.allowedOrigins = body.allowedOrigins
        .map((o: string) => o.trim())
        .filter(Boolean);
    }
    if (Array.isArray(body.licensedLabs)) {
      org.licensedLabs = body.licensedLabs;
    }
    if (Array.isArray(body.licensedSubjects)) {
      org.licensedSubjects = body.licensedSubjects;
    }

    // Validity
    if (body.validUntil !== undefined) {
      org.validUntil = new Date(body.validUntil);
    }

    // Billing
    if (body.billing) {
      org.billing = {
        paymentStatus: body.billing.paymentStatus || org.billing?.paymentStatus || "trial",
        invoiceReference: body.billing.invoiceReference !== undefined ? body.billing.invoiceReference : (org.billing?.invoiceReference || ""),
        billingContact: body.billing.billingContact !== undefined ? body.billing.billingContact : (org.billing?.billingContact || org.contactEmail),
        notes: body.billing.notes !== undefined ? body.billing.notes : (org.billing?.notes || ""),
        renewalDate: body.billing.renewalDate ? new Date(body.billing.renewalDate) : org.billing?.renewalDate,
      };
    }

    await org.save();

    await (IntegrationEvent as any).create({
      organizationId: org._id,
      eventType: "organization.updated",
      details: { updatedFields: Object.keys(body) },
      actorUserId: auth.userId || null,
    });

    return NextResponse.json({
      success: true,
      organization: org,
    });
  } catch (error) {
    console.error("Failed to update organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
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
    const org = await (Organization as any).findById(id);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Revoke all API keys for this org
    await (ApiKey as any).updateMany(
      { organizationId: org._id },
      { status: "revoked" }
    );

    // Remove org document
    await (Organization as any).findByIdAndDelete(id);

    // Record audit event
    await (IntegrationEvent as any).create({
      organizationId: org._id,
      eventType: "organization.deleted",
      details: { name: org.name, slug: org.slug },
      actorUserId: auth.userId || null,
    });

    return NextResponse.json({
      success: true,
      message: `Organization '${org.name}' and its keys were successfully removed`,
    });
  } catch (error) {
    console.error("Failed to delete organization:", error);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}

