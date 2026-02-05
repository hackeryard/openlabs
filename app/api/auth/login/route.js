import bcrypt from "bcryptjs"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { generateToken } from "@/app/lib/auth"
import { serialize } from "cookie"

export async function POST(req) {
  await connectDB()

  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) return Response.json({ error: "Invalid credentials" }, { status: 401 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return Response.json({ error: "Invalid credentials" }, { status: 401 })

  const token = generateToken(user)

  return new Response(JSON.stringify({ message: "Login success" }), {
    headers: {
      "Set-Cookie": serialize("auth-token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
      }),
    },
  })
}
