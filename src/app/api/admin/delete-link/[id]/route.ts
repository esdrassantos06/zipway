// app/api/admin/delete-link/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { getSessionFromHeaders } from "@/utils/getSession";
import { UserRole } from "@/generated/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { id } = await params;

  if (!id || id === "undefined" || id.trim() === "") {
    return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
  }

  try {
    let link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      link = await prisma.link.findUnique({
        where: { shortId: id },
      });
    }

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    await prisma.link.delete({
      where: whereClause,
    });

    return NextResponse.json({
      message: "Link deleted successfully",
      id: link.id,
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
