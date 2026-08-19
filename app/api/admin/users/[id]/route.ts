import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { verifyAdminAccess } from "@/app/lib/adminAuth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const user = await (User as any).findById(params.id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details", details: (error as Error).message },
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
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const body = await request.json();
    const { role, emailVerified, profileSetupComplete } = body;

    await connectDB();

    const updateFields: Record<string, any> = {};
    if (role) {
      if (auth.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Only administrators can modify user roles" },
          { status: 403 }
        );
      }
      if (["user", "admin", "moderator"].includes(role)) {
        updateFields.role = role;
      }
    }
    if (typeof emailVerified === "boolean") {
      updateFields.emailVerified = emailVerified;
    }
    if (typeof profileSetupComplete === "boolean") {
      updateFields.profileSetupComplete = profileSetupComplete;
    }

    const updatedUser = await (User as any).findByIdAndUpdate(
      params.id,
      { $set: updateFields },
      { new: true }
    ).select("-password").lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: (error as Error).message },
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
        { error: "Forbidden: Only administrators can permanently delete user accounts" },
        { status: 403 }
      );
    }

    await connectDB();

    const deletedUser = await (User as any).findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully", userId: params.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
