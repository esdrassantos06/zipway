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

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
