import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = getSessionFromHeaders(request.headers);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.search);

  const identifier = getClientIdentifier(request);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const q = searchParams.get("q");

  if (!userId || !q) {
    return NextResponse.json(
      { error: "Params, userId and q are required." },
      { status: 400 },
    );
  }

  try {
    const links = await prisma.link.findMany({
      where: {
        userId: userId,
        OR: [
          { targetUrl: { contains: q, mode: "insensitive" } },
          { shortId: { contains: q, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json(links);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
