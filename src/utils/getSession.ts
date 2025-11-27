import { auth } from "@/lib/auth";

export async function getSessionFromHeaders(headersList: Headers) {
  return await auth.api.getSession({ headers: headersList });
}
