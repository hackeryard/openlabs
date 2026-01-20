import User from "@/app/models/User"
import OTP from "@/app/models/OTP"
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

        // Check if user exists in database
        const user = await User.findOne({ email })
        if (!user) {
            return Response.json(
                { error: "No account found with this email address" },
                { status: 404 }
            )
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return Response.json(
                { error: "Please verify your email first before resetting password" },
                { status: 403 }
            )
        }

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email })

        // Generate new OTP for password reset
        const code = generateOTP()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Save OTP to database
        await OTP.create({ email, code, expiresAt })

        // Send OTP email
        await sendOTPEmail(
            email,
            code,
            "Password Reset Request - Your OTP Code"
        )

        return Response.json(
            { message: "Password reset OTP sent successfully to your email" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Forgot Password Error:", error)
        return Response.json(
            { error: "Failed to process password reset" },
            { status: 500 }
        )
    }
}
