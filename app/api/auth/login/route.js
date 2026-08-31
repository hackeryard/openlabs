import bcrypt from "bcryptjs"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { generateToken } from "@/app/lib/auth"
import { mockFindUser } from "@/app/lib/devMock"
import { extractGeoLocation } from "@/app/lib/geolocation"
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

  // Silently record location and login history without user interaction
  try {
    const geo = extractGeoLocation(req)
    const userAgent = req.headers.get("user-agent") || ""
    
    await User.findByIdAndUpdate(user._id, {
      $set: {
        "location.ip": geo.ip,
        "location.city": geo.city,
        "location.region": geo.region,
        "location.country": geo.country,
        "location.countryCode": geo.countryCode,
        "location.timezone": geo.timezone,
        "location.latitude": geo.latitude,
        "location.longitude": geo.longitude,
        "location.lastUpdated": new Date(),
      },
      $push: {
        loginHistory: {
          $each: [
            {
              ip: geo.ip,
              city: geo.city,
              region: geo.region,
              country: geo.country,
              countryCode: geo.countryCode,
              userAgent,
              timestamp: new Date(),
            },
          ],
          $slice: -25, // Keep last 25 logins
        },
      },
    })
  } catch (err) {
    console.error("Silent location tracking error:", err)
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

