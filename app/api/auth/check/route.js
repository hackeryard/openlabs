import { verifyToken } from "@/app/lib/auth"

export async function GET(req) {
  let token = req.cookies?.get?.("auth-token")?.value

  if (!token) {
    const authHeader = req.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim()
    }
  }

  const payload = token ? verifyToken(token) : null
  if (!payload || !payload.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ message: "Authenticated", userId: payload.id, role: payload.role }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
