import OTP from "@/app/models/OTP"
import User from "@/app/models/User"
import { connectDB } from "@/app/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    await connectDB()

    const { email, code, newPassword } = await req.json()

    if (!email || !code || !newPassword) {
      return Response.json(
        { error: "Email, OTP code, and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
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

    // Find user and update password
    const user = await User.findOne({ email })
    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id })

    return Response.json(
      { message: "Password reset successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset Password Error:", error)
    return Response.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
