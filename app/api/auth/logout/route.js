import { serialize } from "cookie"

export async function POST() {
  return new Response(JSON.stringify({ message: "Logged out" }), {
    headers: {
      "Set-Cookie": serialize("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      }),
    },
  })
}
