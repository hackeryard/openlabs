/**
 * Fast Bulk Backfill User Locations Script
 */

const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config({ path: ".env.local" });

try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {}

const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGO_URI in environment.");
  process.exit(1);
}

async function backfill() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");
    const pageViewsCollection = db.collection("pageviews");

    console.log("🔍 Aggregating most recent location telemetry by userId...");

    // Find latest pageview with valid country for each user in one fast aggregation query
    const userLocations = await pageViewsCollection
      .aggregate([
        {
          $match: {
            userId: { $ne: null },
            country: { $ne: "Unknown", $exists: true },
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$userId",
            country: { $first: "$country" },
            city: { $first: "$city" },
            region: { $first: "$region" },
            ip: { $first: "$ip" },
            timezone: { $first: "$timezone" },
            lastSeen: { $first: "$createdAt" },
          },
        },
      ])
      .toArray();

    console.log(`📊 Found ${userLocations.length} historical user telemetry records with locations.`);

    if (userLocations.length > 0) {
      const bulkOps = userLocations.map((item) => ({
        updateOne: {
          filter: {
            _id: item._id,
            $or: [
              { "location.country": { $exists: false } },
              { "location.country": "" },
              { "location.country": null },
              { "location.country": "Unknown" },
            ],
          },
          update: {
            $set: {
              location: {
                ip: item.ip || "",
                city: item.city || "",
                region: item.region || "",
                country: item.country,
                countryCode: "",
                timezone: item.timezone || "",
                lastUpdated: item.lastSeen || new Date(),
              },
            },
          },
        },
      }));

      const res = await usersCollection.bulkWrite(bulkOps);
      console.log(`🎉 Backfilled ${res.modifiedCount} existing user records!`);
    } else {
      console.log("ℹ️ No historical pageviews with location found yet.");
    }

    console.log("✅ Backfill process completed. Active users will be updated automatically on their next request.");
  } catch (err) {
    console.error("❌ Backfill error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

backfill();
