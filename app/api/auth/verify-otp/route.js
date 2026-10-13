import OTP from "@/app/models/OTP"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { generateToken, getAuthCookieDomain } from "@/app/lib/auth"
import { resolveGeoLocation } from "@/app/lib/geolocation"
import { serialize } from "cookie"

export async function POST(req) {
  try {
    await connectDB()

    const { email, code } = await req.json()

    if (!email || !code) {
      return Response.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      )
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({ email, code })

    if (!otpRecord) {
      return Response.json(
        { error: "Invalid OTP code" },
        { status: 401 }
      )
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return Response.json(
        { error: "OTP has expired" },
        { status: 401 }
      )
    }

    // Update user to mark email as verified
    const user = await User.findOneAndUpdate(
      { email },
      { emailVerified: true },
      { returnDocument: "after" }
    )

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // If user does not have a valid location yet, resolve and record it
    const hasValidLocation = Boolean(
      user.location?.country &&
      user.location.country !== "Unknown" &&
      user.location.country.trim() !== ""
    );

    if (!hasValidLocation) {
      try {
        const geo = await resolveGeoLocation(req);
        if (geo.country !== "Unknown" || geo.city) {
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
          });
        }
      } catch {}
    }

    // Generate login token
    const token = generateToken(user)

    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id })

    const cookieDomain = getAuthCookieDomain(req);

    return new Response(
      JSON.stringify({
        message: "Email verified successfully",
        user: { id: user._id, email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": serialize("auth-token", token, {
            httpOnly: true,
            path: "/",
            domain: cookieDomain,
            maxAge: 60 * 60 * 24,
          }),
        },
      }
    )
  } catch (error) {
    console.error("Verify OTP Error:", error)
    return Response.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
