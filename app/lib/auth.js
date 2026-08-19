import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "openlabs-production-secret-key-2026";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    },
    SECRET,
    { expiresIn: "1d" }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
