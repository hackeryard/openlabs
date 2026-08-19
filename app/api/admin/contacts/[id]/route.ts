import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Contact from "@/app/models/Contact";
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

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'read', 'replied', or 'archived'" },
        { status: 400 }
      );
    }

    const contact = await (Contact as any).findByIdAndUpdate(
      params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!contact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      updated: true,
      contactId: contact._id,
      status: contact.status,
    });
  } catch (err) {
    console.error("Admin contact PATCH error:", err);
    return NextResponse.json(
      { error: "Server error" },
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
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can permanently delete contact submissions" },
        { status: 403 }
      );
    }

    await connectDB();

    const contact = await (Contact as any).findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      deleted: true,
      contactId: params.id,
    });
  } catch (err) {
    console.error("Admin contact DELETE error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
