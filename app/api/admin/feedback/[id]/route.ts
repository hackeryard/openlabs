import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/models/Feedback";
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
