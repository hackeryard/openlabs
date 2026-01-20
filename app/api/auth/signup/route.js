import bcrypt from "bcryptjs"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"

export async function POST(req) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hashed })

    return Response.json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Signup API Error:", error)

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
