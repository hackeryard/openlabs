import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import ErrorLog from "@/app/models/ErrorLog";
import { verifyAdminAccess } from "@/app/lib/adminAuth";

/**
 * GET /api/admin/analytics/errors
 * Fetch or export full error logs with filtering
 */
export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const errorType = searchParams.get("errorType");
    const limit = Math.min(parseInt(searchParams.get("limit") || "500", 10), 1000);

    const filter: Record<string, any> = {};
    if (status && status !== "all") filter.status = status;
    if (errorType && errorType !== "all") filter.errorType = errorType;

    const errors = await (ErrorLog as any)
      .find(filter)
      .sort({ lastOccurredAt: -1, occurrences: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ errors, total: errors.length }, { status: 200 });
  } catch (err: any) {
    console.error("Admin errors list error:", err);
    return NextResponse.json({ error: "Failed to fetch error logs", details: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/analytics/errors
 * Bulk update error statuses (e.g. mark all as resolved or investigating)
 */
export async function PATCH(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const { errorIds, status, filterStatus } = await request.json();

    if (!status || !["new", "investigating", "resolved", "ignored"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'investigating', 'resolved', or 'ignored'" },
        { status: 400 }
      );
    }

    const query: Record<string, any> = {};
    if (Array.isArray(errorIds) && errorIds.length > 0) {
      query._id = { $in: errorIds };
    } else if (filterStatus && filterStatus !== "all") {
      query.status = filterStatus;
    }

    const result = await (ErrorLog as any).updateMany(query, { $set: { status } });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      status,
    });
  } catch (err: any) {
    console.error("Admin errors bulk PATCH error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/analytics/errors
 * Bulk delete / purge error logs (e.g. purge resolved or purge all)
 */
export async function DELETE(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can purge error records" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const purge = searchParams.get("purge") || "resolved"; // 'resolved' | 'all' | 'ignored'

    const query: Record<string, any> = {};
    if (purge === "resolved") {
      query.status = "resolved";
    } else if (purge === "ignored") {
      query.status = "ignored";
    } else if (purge === "resolved_and_ignored") {
      query.status = { $in: ["resolved", "ignored"] };
    } else if (purge === "all") {
      // empty query matches all
    } else {
      return NextResponse.json({ error: "Invalid purge mode" }, { status: 400 });
    }

    const result = await (ErrorLog as any).deleteMany(query);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      purgeMode: purge,
    });
  } catch (err: any) {
    console.error("Admin errors bulk DELETE error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
