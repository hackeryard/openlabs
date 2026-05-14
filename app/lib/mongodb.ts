import mongoose from "mongoose"
import type { Connection } from "mongoose"

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error("Mongo URI missing")
}

let cached: { conn: Connection | null } = (global as any).mongoose || {
  conn: null,
}
export async function connectDB() {
  if (cached.conn) return cached.conn

  try {
    const mongooseInstance = await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })

    cached.conn = mongooseInstance.connection
      ; (global as any).mongoose = cached

    return cached.conn
  } catch (error: any) {
    console.error("✗ MongoDB Connection Error:", error.message)
    throw error
  }
}