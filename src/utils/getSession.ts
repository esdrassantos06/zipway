import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export async function getSessionFromHeaders(headersList: Headers) {
  return await auth.api.getSession({ headers: headersList });
}
