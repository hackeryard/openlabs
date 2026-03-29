import mongoose from "mongoose"
import type { Connection } from "mongoose"
import { mockConnect } from "./devMock.js"

const isDev = process.env.NODE_ENV === 'development'
const MONGO_URI = process.env.MONGO_URI

if (!isDev && !MONGO_URI) throw new Error("Mongo URI missing")

let cached: { conn: Connection | any } = (global as any).mongoose || { conn: null }


export async function connectDB() {
  if (cached.conn) return cached.conn

  if (isDev) {
    console.log("🔧 Dev mode: Using mock DB")
    cached.conn = await mockConnect()
    ;(global as any).mongoose = cached
    return cached.conn
  }

  try {    
    cached.conn = await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
        
    console.log("✅ MongoDB Connected")
    ;(global as any).mongoose = cached
    return cached.conn
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message)
    throw error
  }
}
