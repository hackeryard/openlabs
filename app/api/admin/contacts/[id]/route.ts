import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Contact from "@/app/models/Contact";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Admin auth
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || (expectedSecret && adminSecret !== expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
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
    // Admin auth
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || (expectedSecret && adminSecret !== expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
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
