import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export function getUserFromToken() {
  const token = cookies().get("auth-token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);

  return payload; // { id, email }
}
