import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) throw new Error("Mongo URI missing")

console.log("✓ MONGO_URI configured for MongoDB Atlas (Cloud)")

let cached = global.mongoose || { conn: null }


export async function connectDB() {
  if (cached.conn) return cached.conn

  try {
    console.log("\n📡 Connecting to MongoDB Atlas...")
    
    cached.conn = await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })

    console.log("✓ Connected to MongoDB Atlas successfully")
    console.log("   Database: OpenLabs")
    
    global.mongoose = cached
    return cached.conn
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message)
    throw error
  }
}
