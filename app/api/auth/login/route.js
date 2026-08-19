import bcrypt from "bcryptjs"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { generateToken } from "@/app/lib/auth"
import { mockFindUser } from "@/app/lib/devMock"
import { serialize } from "cookie"

const isDev = process.env.NODE_ENV === 'development'

export async function POST(req) {
  await connectDB()

  const { email, password } = await req.json()

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 })
  }

  let user
  if (isDev && email === "test@test.com") {
    user = await mockFindUser(email)
  } else {
    user = await User.findOne({ email })
  }

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = isDev && email === "test@test.com" 
    ? password === user.password 
    : await bcrypt.compare(password, user.password)

  if (!valid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Enforce Email Verification Requirement
  if (!user.emailVerified) {
    return Response.json(
      {
        error: "Your email address is not verified. Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      },
      { status: 403 }
    )
  }

  const token = generateToken(user)
  const isProd = process.env.NODE_ENV === "production"

  return new Response(JSON.stringify({ message: "Login success", emailVerified: true }), {
    headers: {
      "Set-Cookie": serialize("auth-token", token, {
        httpOnly: true,
        path: "/",
        domain: isProd ? ".openlabs.org.in" : undefined,
        maxAge: 60 * 60 * 24,
      }),
    },
  })
}
