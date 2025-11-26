import { auth } from "@/lib/auth";

export async function getSessionFromRequest(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session;
}

export async function getSessionFromHeaders(headersList: Headers) {
  return await auth.api.getSession({ headers: headersList });
}
