import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import ApiUsage from "@/app/models/ApiUsage";
import Organization from "@/app/models/Organization";

export interface RecordUsageParams {
  organizationId: mongoose.Types.ObjectId | string;
  apiKeyId?: mongoose.Types.ObjectId | string;
  endpoint: string;
  method: string;
  statusCode: number;
  labId?: string | null;
  responseTimeMs?: number;
}

/**
 * Asynchronously logs integration API / Embed requests without blocking the response.
 */
export async function recordApiUsage(params: RecordUsageParams): Promise<void> {
  try {
    await connectDB();
    ApiUsage.create({
      organizationId: new mongoose.Types.ObjectId(params.organizationId as any),
      apiKeyId: params.apiKeyId ? new mongoose.Types.ObjectId(params.apiKeyId as any) : undefined,
      endpoint: params.endpoint,
      method: params.method,
      statusCode: params.statusCode,
      labId: params.labId || null,
      responseTimeMs: params.responseTimeMs || 0,
      timestamp: new Date(),
    }).catch((err) => console.error("Async ApiUsage save error:", err));
  } catch (err) {
    console.error("recordApiUsage error:", err);
  }
}

export interface UsageSummary {
  currentMonthRequests: number;
  monthlyQuota: number;
  quotaPercentageUsed: number;
  isOverQuota: boolean;
  activeLabsAccessed: number;
  errorCount: number;
}

/**
 * Calculates current calendar month consumption for an organization.
 */
export async function getOrganizationUsageSummary(
  organizationId: string
): Promise<UsageSummary> {
  await connectDB();
  const orgObjectId = new mongoose.Types.ObjectId(organizationId);

  const org = await Organization.findById(orgObjectId).select("plan").lean();
  const monthlyQuota = org?.plan?.maxMonthlyRequests || 10000;

  // Start of current UTC month
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const usageStats = await ApiUsage.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        timestamp: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        errors: {
          $sum: {
            $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
          },
        },
        distinctLabs: { $addToSet: "$labId" },
      },
    },
  ]);

  const stats = usageStats[0] || { totalRequests: 0, errors: 0, distinctLabs: [] };
  const currentMonthRequests = stats.totalRequests || 0;
  const quotaPercentageUsed = Math.min(100, Math.round((currentMonthRequests / monthlyQuota) * 100));
  const isOverQuota = currentMonthRequests >= monthlyQuota;
  const activeLabsAccessed = (stats.distinctLabs || []).filter(Boolean).length;

  return {
    currentMonthRequests,
    monthlyQuota,
    quotaPercentageUsed,
    isOverQuota,
    activeLabsAccessed,
    errorCount: stats.errors || 0,
  };
}

