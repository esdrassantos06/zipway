import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/utils/redis";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export async function GET(req: NextRequest) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.general);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  const authHeader = req.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${ADMIN_API_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    await prisma.user.findFirst();

    const pong = await redis.ping();

    return NextResponse.json({
      database: "OK",
      redis: pong === "PONG" ? "OK" : "FAIL",
    });
  } catch (error) {
    return NextResponse.json(
      {
        database: "FAIL",
        redis: "FAIL",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
