import PageView from "@/app/models/PageView";
import AnalyticsEvent from "@/app/models/AnalyticsEvent";
import ErrorLog from "@/app/models/ErrorLog";
import User from "@/app/models/User";

/**
 * Calculates start date based on time range string
 */
function getStartDate(timeRange: string): Date {
  const now = new Date();
  switch (timeRange) {
    case "today": {
      const today = new Date(now);
      today.setUTCHours(0, 0, 0, 0);
      return today;
    }
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "all":
    default:
      return new Date(0); // 1970
  }
}

export async function getAnalyticsDashboardData(timeRange = "7d") {
  const startDate = getStartDate(timeRange);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const matchStage = { createdAt: { $gte: startDate } };

  // 1. High-level Overview Metrics
  const overviewPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalViews: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
        uniqueSessions: { $addToSet: "$sessionId" },
        avgDuration: { $avg: "$duration" },
        avgScrollDepth: { $avg: "$scrollDepth" },
      },
    },
  ]);

  // 2. Real-time active users (< 5m) & live paths
  const realtimePromise = (PageView as any).aggregate([
    { $match: { updatedAt: { $gte: fiveMinutesAgo } } },
    {
      $group: {
        _id: "$pathname",
        activeVisitors: { $addToSet: "$visitorId" },
        totalActive: { $sum: 1 },
      },
    },
    { $sort: { totalActive: -1 } },
    { $limit: 10 },
  ]);

  // 3. Time Series Graph
  // If 24h/today: group by hour, else group by day
  const isHourly = timeRange === "today" || timeRange === "24h";
  const dateFormat = isHourly ? "%Y-%m-%d %H:00" : "%Y-%m-%d";

  const timeseriesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 4. Top Pages / Labs
  const topPagesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$pathname",
        title: { $first: "$title" },
        labId: { $first: "$labId" },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        avgDuration: { $avg: "$duration" },
        avgScrollDepth: { $avg: "$scrollDepth" },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 20 },
  ]);

  // 5. Referrers & Acquisition
  const topReferrersPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$referrerDomain",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  // 6. Devices, OS & Browsers
  const devicesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 },
      },
    },
  ]);

  const browsersPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  const osPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // 7. Countries
  const countriesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$country",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  // 8. Custom Learning / Lab Events
  const eventsPromise = (AnalyticsEvent as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar level xp",
    })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  // 9. Error Logs in Timeframe
  const errorsPromise = (ErrorLog as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar",
    })
    .sort({ lastOccurredAt: -1 })
    .limit(30)
    .lean();

  const errorStatsPromise = (ErrorLog as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalErrors: { $sum: "$occurrences" },
        uniqueIssues: { $sum: 1 },
        statusNew: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
        statusInvestigating: { $sum: { $cond: [{ $eq: ["$status", "investigating"] }, 1, 0] } },
        statusResolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
      },
    },
  ]);

  // Execute all aggregations in parallel
  const [
    overviewRaw,
    realtimeRaw,
    timeseriesRaw,
    topPagesRaw,
    topReferrersRaw,
    devicesRaw,
    browsersRaw,
    osRaw,
    countriesRaw,
    recentEvents,
    recentErrors,
    errorStatsRaw,
  ] = await Promise.all([
    overviewPromise,
    realtimePromise,
    timeseriesPromise,
    topPagesPromise,
    topReferrersPromise,
    devicesPromise,
    browsersPromise,
    osPromise,
    countriesPromise,
    eventsPromise,
    errorsPromise,
    errorStatsPromise,
  ]);

  // Transform Overview
  const rawO = overviewRaw[0] || {};
  const totalViews = rawO.totalViews || 0;
  const uniqueVisitors = rawO.uniqueVisitors?.length || 0;
  const uniqueSessions = rawO.uniqueSessions?.length || 0;
  const avgDuration = rawO.avgDuration ? Math.round(rawO.avgDuration) : 0;
  const avgScrollDepth = rawO.avgScrollDepth ? Math.round(rawO.avgScrollDepth) : 0;

  // Realtime
  let totalActiveUsers = 0;
  const activePaths = realtimeRaw.map((r: any) => {
    const count = r.activeVisitors?.length || 0;
    totalActiveUsers += count;
    return {
      pathname: r._id,
      activeUsers: count,
    };
  });

  // Timeseries
  const timeseries = timeseriesRaw.map((t: any) => ({
    label: t._id,
    views: t.views,
    visitors: t.visitors?.length || 0,
  }));

  // Top Pages
  const topPages = topPagesRaw.map((p: any) => ({
    pathname: p._id,
    title: p.title || p._id,
    labId: p.labId || null,
    views: p.views,
    visitors: p.visitors?.length || 0,
    avgDuration: p.avgDuration ? Math.round(p.avgDuration) : 0,
    avgScrollDepth: p.avgScrollDepth ? Math.round(p.avgScrollDepth) : 0,
  }));

  // Referrers
  const topReferrers = topReferrersRaw.map((ref: any) => ({
    domain: ref._id || "Direct",
    count: ref.count,
    percentage: totalViews > 0 ? parseFloat(((ref.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Device Breakdown
  const devices = devicesRaw.map((d: any) => ({
    device: d._id || "desktop",
    count: d.count,
    percentage: totalViews > 0 ? parseFloat(((d.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Browsers
  const browsers = browsersRaw.map((b: any) => ({
    browser: b._id || "Unknown",
    count: b.count,
  }));

  // OS
  const operatingSystems = osRaw.map((o: any) => ({
    os: o._id || "Unknown",
    count: o.count,
  }));

  // Countries
  const countries = countriesRaw.map((c: any) => ({
    country: c._id || "Unknown",
    count: c.count,
    percentage: totalViews > 0 ? parseFloat(((c.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Error Stats
  const rawErr = errorStatsRaw[0] || {};
  const errorStats = {
    totalErrors: rawErr.totalErrors || 0,
    uniqueIssues: rawErr.uniqueIssues || 0,
    statusNew: rawErr.statusNew || 0,
    statusInvestigating: rawErr.statusInvestigating || 0,
    statusResolved: rawErr.statusResolved || 0,
  };

  return {
    overview: {
      totalViews,
      uniqueVisitors,
      uniqueSessions,
      avgDuration,
      avgScrollDepth,
      activeUsers: totalActiveUsers,
    },
    realtime: {
      totalActiveUsers,
      activePaths,
    },
    timeseries,
    topPages,
    topReferrers,
    devices,
    browsers,
    operatingSystems,
    countries,
    recentEvents,
    recentErrors,
    errorStats,
  };
}
