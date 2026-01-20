import mongoose from "mongoose"

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 minutes
})

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema)
