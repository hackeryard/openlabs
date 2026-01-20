import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
