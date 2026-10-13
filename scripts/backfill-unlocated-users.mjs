import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

function isPublicIp(ip) {
  if (!ip) return false;
  const clean = ip.trim();
  if (
    clean === "127.0.0.1" ||
    clean === "::1" ||
    clean === "localhost" ||
    clean.startsWith("10.") ||
    clean.startsWith("192.168.") ||
    clean.startsWith("169.254.") ||
    clean.startsWith("fc00:") ||
    clean.startsWith("fe80:")
  ) {
    return false;
  }
  if (clean.startsWith("172.")) {
    const parts = clean.split(".");
    const second = parseInt(parts[1], 10);
    if (second >= 16 && second <= 31) return false;
  }
  return true;
}

async function backfillUnlocatedUsers() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const usersCollection = db.collection("users");
  const pageviewsCollection = db.collection("pageviews");

  const unlocatedUsers = await usersCollection.find({
    $or: [
      { "location.country": { $exists: false } },
      { "location.country": "" },
      { "location.country": "Unknown" },
      { "location.country": null },
      { location: { $exists: false } }
    ]
  }).project({ _id: 1, email: 1, location: 1 }).toArray();

  console.log(`Found ${unlocatedUsers.length} unlocated users.`);
  const unlocatedIds = unlocatedUsers.map(u => u._id);

  // Batch query all relevant pageviews in one single roundtrip
  const pvs = await pageviewsCollection.find({
    userId: { $in: unlocatedIds },
    $or: [
      { country: { $exists: true, $nin: ["", "Unknown", null] } },
      { ip: { $exists: true, $nin: ["", "127.0.0.1", null] } }
    ]
  }).project({ userId: 1, ip: 1, country: 1, city: 1, region: 1, timezone: 1, createdAt: 1 }).toArray();

  console.log(`Found ${pvs.length} relevant pageview records for unlocated users.`);

  // Map latest valid pv per user
  const userToPvMap = new Map();
  for (const pv of pvs) {
    const uid = String(pv.userId);
    const existing = userToPvMap.get(uid);
    if (!existing || (pv.createdAt && (!existing.createdAt || pv.createdAt > existing.createdAt))) {
      userToPvMap.set(uid, pv);
    }
  }

  let updatedCount = 0;

  for (const user of unlocatedUsers) {
    let bestGeo = null;

    if (user.location?.ip && isPublicIp(user.location.ip)) {
      bestGeo = { ip: user.location.ip };
    }

    const pv = userToPvMap.get(String(user._id));
    if (pv) {
      if (pv.country && pv.country !== "Unknown") {
        bestGeo = {
          ip: pv.ip || bestGeo?.ip || "",
          country: pv.country,
          city: pv.city || "",
          region: pv.region || "",
          timezone: pv.timezone || "",
        };
      } else if (pv.ip && isPublicIp(pv.ip)) {
        bestGeo = { ip: pv.ip };
      }
    }

    // If only IP is known, perform IP lookup
    if (bestGeo && (!bestGeo.country || bestGeo.country === "Unknown") && isPublicIp(bestGeo.ip)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`https://ipwho.is/${encodeURIComponent(bestGeo.ip)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            bestGeo = {
              ip: bestGeo.ip,
              country: data.country || "Unknown",
              countryCode: data.country_code || "",
              region: data.region || "",
              city: data.city || "",
              timezone: data.timezone?.id || "",
              latitude: data.latitude || null,
              longitude: data.longitude || null,
            };
          }
        }
      } catch (err) {}
    }

    if (bestGeo && ((bestGeo.country && bestGeo.country !== "Unknown") || bestGeo.city)) {
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            "location.ip": bestGeo.ip || "",
            "location.city": bestGeo.city || "",
            "location.region": bestGeo.region || "",
            "location.country": bestGeo.country || "",
            "location.countryCode": bestGeo.countryCode || "",
            "location.timezone": bestGeo.timezone || "",
            "location.latitude": bestGeo.latitude || null,
            "location.longitude": bestGeo.longitude || null,
            "location.lastUpdated": new Date(),
          }
        }
      );
      updatedCount++;
      console.log(`[Backfilled] ${user.email} -> ${bestGeo.city ? bestGeo.city + ", " : ""}${bestGeo.country}`);
    }
  }

  console.log(`\nSuccessfully backfilled location for ${updatedCount} users.`);
  await mongoose.disconnect();
}

backfillUnlocatedUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
