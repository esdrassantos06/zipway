import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { getSessionFromHeaders } from "@/utils/getSession";
import { UserRole } from "@/generated/prisma";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export async function GET(req: NextRequest) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isRateLimitExceed = await rateLimiter(identifier);

  const session = await getSessionFromHeaders(req.headers);
  const authHeader = req.headers.get("authorization");

  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const hasValidToken = authHeader === `Bearer ${ADMIN_API_TOKEN}`;

  if (!isAdmin && !hasValidToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const links = await prisma.link.findMany({
      orderBy: { clicks: "desc" },
      select: {
        id: true,
        shortId: true,
        targetUrl: true,
        clicks: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Error fetching links" },
      { status: 500 },
    );
  }
}
