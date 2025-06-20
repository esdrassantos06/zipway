import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const { shortId } = await params;

  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.redirect);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    const frontendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    return NextResponse.redirect(`${frontendUrl}/rate-limit-exceeded`, 307);
  }

  const url = await prisma.link.findUnique({ where: { shortId } });

  if (!url) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  await prisma.link.update({
    where: { shortId },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(url.targetUrl);
}
