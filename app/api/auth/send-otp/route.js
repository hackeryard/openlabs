import OTP from "@/app/models/OTP"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import { sendOTPEmail } from "@/app/lib/email"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req) {
  try {
    await connectDB()

    const { email } = await req.json()

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists and is not already verified
    const user = await User.findOne({ email })
    if (user && user.emailVerified) {
      return Response.json(
        { error: "Email already verified" },
        { status: 400 }
      )
    }

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email })

    // Generate new OTP
    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await OTP.create({ email, code, expiresAt })

    // Send OTP email
    await sendOTPEmail(email, code)

    return Response.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Send OTP Error:", error)
    return Response.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    )
  }
}
