import { serialize } from "cookie"

export async function POST() {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append(
    "Set-Cookie",
    serialize("auth-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  )
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
