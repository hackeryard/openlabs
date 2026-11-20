import { serialize } from "cookie"
import { getAuthClearCookieOptions, getAuthCookieDomain } from "@/app/lib/auth"

export async function POST(req) {
  const headers = new Headers()
  const domain = getAuthCookieDomain(req)
  const isProd = process.env.NODE_ENV === "production"

  headers.append("Content-Type", "application/json")

  // Clear domain-level auth-token cookie
  headers.append(
    "Set-Cookie",
    serialize("auth-token", "", getAuthClearCookieOptions(req))
  )

  // Also clear host-only auth-token cookie if a domain was specified
  if (domain) {
    headers.append(
      "Set-Cookie",
      serialize("auth-token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      })
    )
  }

  // Clear NextAuth session tokens
  headers.append(
    "Set-Cookie",
    serialize("next-auth.session-token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    })
  )
  headers.append(
    "Set-Cookie",
    serialize("__Secure-next-auth.session-token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    })
  )

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers,
  })
}
