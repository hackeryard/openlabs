import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyAdminAccess } from "@/app/lib/adminAuth";
import Organization from "@/app/models/Organization";
import ApiKey from "@/app/models/ApiKey";
import ApiUsage from "@/app/models/ApiUsage";
import IntegrationEvent from "@/app/models/IntegrationEvent";

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const status = searchParams.get("status")?.trim();
    const plan = searchParams.get("plan")?.trim();
    const licenseType = searchParams.get("licenseType")?.trim();

    const filterObj: Record<string, any> = {};

    if (query) {
      const regex = new RegExp(query, "i");
      filterObj.$or = [
        { name: regex },
        { slug: regex },
        { contactEmail: regex },
      ];
    }

    if (status && ["active", "suspended", "pending"].includes(status)) {
      filterObj.status = status;
    }

    if (plan && ["pilot", "institutional", "enterprise"].includes(plan)) {
      filterObj["plan.name"] = plan;
    }

    if (licenseType) {
      filterObj.licenseType = licenseType;
    }

    const organizations = await (Organization as any)
      .find(filterObj)
      .sort({ createdAt: -1 })
      .lean();

    // Enrich organizations with active key count & current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const enriched = await Promise.all(
      organizations.map(async (org: any) => {
        const [activeKeysCount, totalKeysCount, monthlyRequests] =
          await Promise.all([
            (ApiKey as any).countDocuments({
              organizationId: org._id,
              status: "active",
            }),
            (ApiKey as any).countDocuments({
              organizationId: org._id,
            }),
            (ApiUsage as any).countDocuments({
              organizationId: org._id,
              timestamp: { $gte: startOfMonth },
            }),
          ]);

        return {
          ...org,
          stats: {
            activeKeysCount,
            totalKeysCount,
            monthlyRequests,
            monthlyQuota: org.plan?.maxMonthlyRequests || 10000,
            usagePercent: Math.min(
              100,
              Math.round(
                (monthlyRequests / (org.plan?.maxMonthlyRequests || 10000)) * 100
              )
            ),
          },
        };
      })
    );

    return NextResponse.json({
      organizations: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error("Failed to list organizations:", error);
    return NextResponse.json(
      { error: "Failed to load partner organizations" },
      { status: 500 }
    );
  }
}

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
      name,
      slug: rawSlug,
      type = "school",
      status = "active",
      contactEmail,
      planName = "pilot",
      maxMonthlyRequests,
      requestsPerMinute,
      maxStudents,
      licenseType = "pilot",
      allowedOrigins = [],
      licensedLabs = ["*"],
      licensedSubjects = [],
      validUntil,
      billing = {},
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    if (!contactEmail || typeof contactEmail !== "string") {
      return NextResponse.json(
        { error: "Valid contact email is required" },
        { status: 400 }
      );
    }

    // Normalize slug or derive from name
    const slug = (
      rawSlug ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    )
      .toLowerCase()
      .trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Valid organization slug is required" },
        { status: 400 }
      );
    }

    const existing = await (Organization as any).findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `Organization slug '${slug}' is already taken` },
        { status: 409 }
      );
    }

    // Default plan presets
    const planDefaults: Record<string, { monthly: number; rpm: number; students: number }> = {
      pilot: { monthly: 10000, rpm: 60, students: 100 },
      institutional: { monthly: 100000, rpm: 300, students: 2500 },
      enterprise: { monthly: 1000000, rpm: 1200, students: 25000 },
    };

    const targetPlan = planDefaults[planName] || planDefaults.pilot;

    const newOrg = await (Organization as any).create({
      name: name.trim(),
      slug,
      type,
      status,
      contactEmail: contactEmail.toLowerCase().trim(),
      plan: {
        name: planName,
        maxMonthlyRequests: maxMonthlyRequests || targetPlan.monthly,
        requestsPerMinute: requestsPerMinute || targetPlan.rpm,
        maxStudents: maxStudents || targetPlan.students,
      },
      licenseType,
      allowedOrigins: Array.isArray(allowedOrigins) ? allowedOrigins.map((o: string) => o.trim()).filter(Boolean) : [],
      licensedLabs: Array.isArray(licensedLabs) && licensedLabs.length > 0 ? licensedLabs : ["*"],
      licensedSubjects: Array.isArray(licensedSubjects) ? licensedSubjects : [],
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      billing: {
        paymentStatus: billing.paymentStatus || "trial",
        invoiceReference: billing.invoiceReference || "",
        billingContact: billing.billingContact || contactEmail,
        notes: billing.notes || "",
        renewalDate: billing.renewalDate ? new Date(billing.renewalDate) : undefined,
      },
    });

    // Record audit event
    await (IntegrationEvent as any).create({
      organizationId: newOrg._id,
      eventType: "organization.created",
      details: {
        name: newOrg.name,
        slug: newOrg.slug,
        plan: newOrg.plan.name,
        licenseType: newOrg.licenseType,
      },
      actorUserId: auth.userId || null,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        organization: newOrg,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create organization:", error);
    return NextResponse.json(
      { error: "Failed to create partner organization" },
      { status: 500 }
    );
  }
}

