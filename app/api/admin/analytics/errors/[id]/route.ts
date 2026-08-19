import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import ErrorLog from "@/app/models/ErrorLog";
import { verifyAdminAccess } from "@/app/lib/adminAuth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const { status } = await request.json();

    if (!status || !["new", "investigating", "resolved", "ignored"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'investigating', 'resolved', or 'ignored'" },
        { status: 400 }
      );
    }

    const errorDoc = await (ErrorLog as any).findByIdAndUpdate(
      params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!errorDoc) {
      return NextResponse.json({ error: "Error record not found" }, { status: 404 });
    }

    return NextResponse.json(errorDoc);
  } catch (err) {
    console.error("Admin error PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can permanently delete error logs" },
        { status: 403 }
      );
    }

    await connectDB();

    const deleted = await (ErrorLog as any).findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Error record not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true, errorId: params.id });
  } catch (err) {
    console.error("Admin error DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
