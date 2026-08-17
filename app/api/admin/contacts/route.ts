import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Contact from "@/app/models/Contact";
import User from "@/app/models/User"; // Ensure User model is loaded for populate

export async function GET(request: Request) {
  try {
    // Admin auth
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || (expectedSecret && adminSecret !== expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();
    if (!User) {
      console.warn("User model not loaded");
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const query = searchParams.get("query") || "";
    const sortBy = searchParams.get("sortBy") || "recent";

    // Match filter
    const matchFilter: Record<string, any> = {};
    if (status) {
      matchFilter.status = status;
    }

    if (query) {
      const regex = new RegExp(query, "i");
      matchFilter.$or = [
        { name: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    // Sort order
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === "oldest") {
      sortObj = { createdAt: 1 };
    }

    const contacts = await (Contact as any).find(matchFilter)
      .populate({
        path: "userId",
        select: "name email username avatar xp level",
      })
      .sort(sortObj)
      .limit(100)
      .lean();

    // Aggregate statistics across all contacts
    const statsAgg = await (Contact as any).aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          statusNew: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          statusRead: { $sum: { $cond: [{ $eq: ["$status", "read"] }, 1, 0] } },
          statusReplied: { $sum: { $cond: [{ $eq: ["$status", "replied"] }, 1, 0] } },
          statusArchived: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } },
          emailsSent: { $sum: { $cond: [{ $eq: ["$emailSent", true] }, 1, 0] } },
          emailsFailed: { $sum: { $cond: [{ $eq: ["$emailSent", false] }, 1, 0] } },
        },
      },
    ]);

    const raw = statsAgg[0] || {};
    const stats = {
      total: raw.total || 0,
      statusNew: raw.statusNew || 0,
      statusRead: raw.statusRead || 0,
      statusReplied: raw.statusReplied || 0,
      statusArchived: raw.statusArchived || 0,
      emailsSent: raw.emailsSent || 0,
      emailsFailed: raw.emailsFailed || 0,
    };

    return NextResponse.json({ contacts, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact submissions", details: (error as Error).message },
      { status: 500 }
    );
  }
}
