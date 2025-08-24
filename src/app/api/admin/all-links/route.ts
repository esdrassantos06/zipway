import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";
import { UserRole } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  const headersList = await headers();

  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden");
  }

  if (!isAllowed) {
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
