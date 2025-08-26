import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.general);
  const identifier = getClientIdentifier(req);
  const isRateLimitExceed = await rateLimiter(identifier);

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { shortId } = await params;

  if (!shortId || shortId === "undefined" || shortId.trim() === "") {
    return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
  }

  try {
    let link = await prisma.link.findUnique({
      where: { shortId },
    });

    if (!link) {
      link = await prisma.link.findUnique({
        where: { id: shortId },
      });
    }

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ error: "Acess denied" }, { status: 403 });
    }

    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    await prisma.link.delete({
      where: whereClause,
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
