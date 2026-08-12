import mongoose from "mongoose";
import type { Connection } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Mongo URI missing in environment variables (.env)");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Don't buffer for 10s if connection fails; fail fast
      serverSelectionTimeoutMS: 5000, // Timeout server selection after 5s instead of 30s
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 resolution to prevent Windows/ISP DNS SRV IPv6 lookup timeouts
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null; // Reset promise on failure so subsequent calls retry
      throw err;
    });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    console.error("✗ MongoDB Connection Error:", error.message || error);
    throw error;
  }
}