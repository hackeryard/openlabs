import { verifyToken } from "@/app/lib/auth"

export async function GET(req) {
  const token = req.cookies.get("auth-token")?.value

  if (!token || !verifyToken(token)) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    })
  }

  return new Response(JSON.stringify({ message: "Authenticated" }), {
    status: 200,
  })
}
