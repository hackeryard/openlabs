require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in environment variables.");
  process.exit(1);
}

async function migrate() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log(" Connected to MongoDB.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const totalUsers = await usersCollection.countDocuments();
    console.log(`📊 Found ${totalUsers} total user records.`);

    // 1. Update any users missing the role field or having null/empty role
    const result = await usersCollection.updateMany(
      {
        $or: [
          { role: { $exists: false } },
          { role: null },
          { role: "" },
        ],
      },
      {
        $set: { role: "user" },
      }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} users to role: "user".`);

    // Verify role distribution
    const roleStats = await usersCollection.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();

    console.log("📋 Current user role distribution:", roleStats);

  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

migrate();
