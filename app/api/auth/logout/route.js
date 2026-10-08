import { serialize } from "cookie"
import { getAuthCookieDomain } from "@/app/lib/auth"

export async function POST(req) {
  const headers = new Headers()
  const domain = getAuthCookieDomain(req)
  headers.append("Content-Type", "application/json")
  headers.append(
    "Set-Cookie",
    serialize("auth-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      domain,
    })
  )
  if (domain) {
    // Also clear host-only cookie if previously set
    headers.append(
      "Set-Cookie",
      serialize("auth-token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      })
    )
  }
  headers.append(
    "Set-Cookie",
    serialize("next-auth.session-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  )
  headers.append(
    "Set-Cookie",
    serialize("__Secure-next-auth.session-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  )

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers,
  })
}
