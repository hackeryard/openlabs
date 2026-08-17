import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/models/Feedback";

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

    if (!status || !["new", "reviewed", "fixed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'reviewed', or 'fixed'" },
        { status: 400 }
      );
    }

    const feedback = await (Feedback as any).findByIdAndUpdate(
      params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      updated: true,
      feedbackId: feedback._id,
      status: feedback.status,
    });
  } catch (err) {
    console.error("Admin feedback PATCH error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
