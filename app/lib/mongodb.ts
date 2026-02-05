import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) throw new Error("Mongo URI missing")

let cached = global.mongoose || { conn: null }


export async function connectDB() {
  if (cached.conn) return cached.conn

  try {    
    cached.conn = await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
        
    global.mongoose = cached
    return cached.conn
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message)
    throw error
  }
}
