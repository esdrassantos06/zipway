import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.general);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { shortId } = await params;

  if (!shortId || shortId === "undefined" || shortId.trim() === "") {
    return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
  }

  const { status } = await req.json();
  if (!["ACTIVE", "PAUSED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    let link = await prisma.link.findUnique({
      where: { shortId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!link) {
      link = await prisma.link.findUnique({
        where: { id: shortId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    const updated = await prisma.link.update({
      where: whereClause,
      data: { status: status.toUpperCase() as "ACTIVE" | "PAUSED" },
    });

    return NextResponse.json({
      message: "Status updated",
      status: updated.status.toLowerCase(),
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
