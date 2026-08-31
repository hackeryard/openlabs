const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config({ path: ".env.local" });

try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

async function showAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const admins = await db.collection("users")
      .find({ role: { $in: ["admin", "moderator"] } })
      .project({
        name: 1,
        email: 1,
        role: 1,
        location: 1,
        xp: 1,
        level: 1,
        createdAt: 1,
        lastActiveDate: 1,
        loginHistory: { $slice: -3 },
      })
      .toArray();

    console.log("=== ADMIN / MODERATOR USERS ===");
    console.log(JSON.stringify(admins, null, 2));

    const totalCount = await db.collection("users").countDocuments();
    const usersWithLocation = await db.collection("users").countDocuments({ "location.country": { $exists: true, $ne: "" } });
    console.log(`\nPlatform Statistics: Total Users: ${totalCount}, Users with Location Tracked: ${usersWithLocation}`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

showAdmins();
