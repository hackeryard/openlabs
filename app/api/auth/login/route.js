import bcrypt from "bcryptjs"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { generateToken, getAuthCookieOptions } from "@/app/lib/auth"
import { mockFindUser } from "@/app/lib/devMock"
import { extractGeoLocation, resolveGeoLocation } from "@/app/lib/geolocation"
import { serialize } from "cookie"

const isDev = process.env.NODE_ENV === 'development'

export async function POST(req) {
  await connectDB()

  let email = ""
  let password = ""
  try {
    const body = await req.json()
    email = (body.email || "").trim().toLowerCase()
    password = body.password || ""
  } catch {
    return Response.json({ error: "Invalid JSON request body" }, { status: 400 })
  }

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
    const geo = await resolveGeoLocation(req)
    const userAgent = req.headers.get("user-agent") || ""
    
    const updateOps = {
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
    }

    if (geo.country !== "Unknown" || geo.city) {
      updateOps.$set = {
        "location.ip": geo.ip,
        "location.city": geo.city,
        "location.region": geo.region,
        "location.country": geo.country,
        "location.countryCode": geo.countryCode,
        "location.timezone": geo.timezone,
        "location.latitude": geo.latitude,
        "location.longitude": geo.longitude,
        "location.lastUpdated": new Date(),
      }
    }

    await User.findByIdAndUpdate(user._id, updateOps)
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
  const cookieOptions = getAuthCookieOptions(req)

  return new Response(JSON.stringify({ message: "Login success", emailVerified: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": serialize("auth-token", token, cookieOptions),
    },
  })
}
