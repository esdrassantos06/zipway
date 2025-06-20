import { NextResponse } from "next/server";
import { getSessionFromHeaders } from "@/utils/getSession";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

export async function GET(req: Request) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.general);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  return NextResponse.json({ role: session.user.role });
}
