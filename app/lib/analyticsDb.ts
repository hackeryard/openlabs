import PageView from "@/app/models/PageView";
import AnalyticsEvent from "@/app/models/AnalyticsEvent";
import ErrorLog from "@/app/models/ErrorLog";
import User from "@/app/models/User";
import { getFullCountryName } from "@/app/lib/countries";

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
    { $limit: 15 },
  ]);

  // 3. Time Series Graph
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
    { $limit: 25 },
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
    { $limit: 20 },
  ]);

  // 6. UTM Campaigns
  const utmCampaignsPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        $or: [
          { utmSource: { $ne: null } },
          { utmCampaign: { $ne: null } },
        ],
      },
    },
    {
      $group: {
        _id: {
          source: { $ifNull: ["$utmSource", "direct"] },
          medium: { $ifNull: ["$utmMedium", "none"] },
          campaign: { $ifNull: ["$utmCampaign", "none"] },
        },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        avgDuration: { $avg: "$duration" },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 15 },
  ]);

  // 7. Devices, OS, Browsers & Screen Sizes
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
    { $limit: 10 },
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
    { $limit: 10 },
  ]);

  const screensPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, screen: { $ne: "" } } },
    {
      $group: {
        _id: "$screen",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // 8. Countries
  const countriesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$country",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  // 9. Duration Engagement Distribution
  const durationDistributionPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        under10s: { $sum: { $cond: [{ $lt: ["$duration", 10] }, 1, 0] } },
        under30s: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 10] }, { $lt: ["$duration", 30] }] }, 1, 0] } },
        under1m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 30] }, { $lt: ["$duration", 60] }] }, 1, 0] } },
        under3m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 60] }, { $lt: ["$duration", 180] }] }, 1, 0] } },
        under10m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 180] }, { $lt: ["$duration", 600] }] }, 1, 0] } },
        over10m: { $sum: { $cond: [{ $gte: ["$duration", 600] }, 1, 0] } },
      },
    },
  ]);

  // 10. Scroll Depth Distribution
  const scrollDistributionPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        depth25: { $sum: { $cond: [{ $lt: ["$scrollDepth", 25] }, 1, 0] } },
        depth50: { $sum: { $cond: [{ $and: [{ $gte: ["$scrollDepth", 25] }, { $lt: ["$scrollDepth", 50] }] }, 1, 0] } },
        depth75: { $sum: { $cond: [{ $and: [{ $gte: ["$scrollDepth", 50] }, { $lt: ["$scrollDepth", 75] }] }, 1, 0] } },
        depth100: { $sum: { $cond: [{ $gte: ["$scrollDepth", 75] }, 1, 0] } },
      },
    },
  ]);

  // 11. Recent Live Pageviews Feed (Detailed Log)
  const recentPageViewsPromise = (PageView as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar level xp",
    })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  // 12. Custom Learning / Lab Events (Detailed Stream)
  const eventsPromise = (AnalyticsEvent as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar level xp",
    })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  // 13. Error Logs in Timeframe
  const errorsPromise = (ErrorLog as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar",
    })
    .sort({ lastOccurredAt: -1 })
    .limit(60)
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
    utmCampaignsRaw,
    devicesRaw,
    browsersRaw,
    osRaw,
    screensRaw,
    countriesRaw,
    durationDistRaw,
    scrollDistRaw,
    recentPageViews,
    recentEvents,
    recentErrors,
    errorStatsRaw,
  ] = await Promise.all([
    overviewPromise,
    realtimePromise,
    timeseriesPromise,
    topPagesPromise,
    topReferrersPromise,
    utmCampaignsPromise,
    devicesPromise,
    browsersPromise,
    osPromise,
    screensPromise,
    countriesPromise,
    durationDistributionPromise,
    scrollDistributionPromise,
    recentPageViewsPromise,
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

  // UTM Campaigns
  const utmCampaigns = utmCampaignsRaw.map((u: any) => ({
    source: u._id.source,
    medium: u._id.medium,
    campaign: u._id.campaign,
    views: u.views,
    visitors: u.visitors?.length || 0,
    avgDuration: u.avgDuration ? Math.round(u.avgDuration) : 0,
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
    percentage: totalViews > 0 ? parseFloat(((b.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // OS
  const operatingSystems = osRaw.map((o: any) => ({
    os: o._id || "Unknown",
    count: o.count,
    percentage: totalViews > 0 ? parseFloat(((o.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Screens
  const screenResolutions = screensRaw.map((s: any) => ({
    screen: s._id || "Unknown",
    count: s.count,
    percentage: totalViews > 0 ? parseFloat(((s.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Countries - normalize all ISO codes to full names and consolidate duplicates
  const countryCountsMap = new Map<string, number>();
  countriesRaw.forEach((c: any) => {
    const fullName = getFullCountryName(c._id);
    countryCountsMap.set(fullName, (countryCountsMap.get(fullName) || 0) + (c.count || 0));
  });

  const countries = Array.from(countryCountsMap.entries())
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalViews > 0 ? parseFloat(((count / totalViews) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);

  // Format recent pageviews country names
  const formattedPageViews = recentPageViews.map((pv: any) => ({
    ...pv,
    country: getFullCountryName(pv.country),
  }));

  // Duration Distribution
  const rawDur = durationDistRaw[0] || {};
  const durationDistribution = [
    { label: "< 10s", count: rawDur.under10s || 0 },
    { label: "10s – 30s", count: rawDur.under30s || 0 },
    { label: "30s – 1m", count: rawDur.under1m || 0 },
    { label: "1m – 3m", count: rawDur.under3m || 0 },
    { label: "3m – 10m", count: rawDur.under10m || 0 },
    { label: "> 10m", count: rawDur.over10m || 0 },
  ];

  // Scroll Depth Distribution
  const rawScroll = scrollDistRaw[0] || {};
  const scrollDistribution = [
    { label: "0% – 25%", count: rawScroll.depth25 || 0 },
    { label: "25% – 50%", count: rawScroll.depth50 || 0 },
    { label: "50% – 75%", count: rawScroll.depth75 || 0 },
    { label: "75% – 100%", count: rawScroll.depth100 || 0 },
  ];

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
    utmCampaigns,
    devices,
    browsers,
    operatingSystems,
    screenResolutions,
    countries,
    durationDistribution,
    scrollDistribution,
    recentPageViews: formattedPageViews,
    recentEvents,
    recentErrors,
    errorStats,
  };
}
