import { NextRequest, NextResponse } from "next/server";
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
    const startTime = Date.now();

    const pong = await redis.ping();

    const duration = Date.now() - startTime;

    return NextResponse.json({
      redis: pong === "PONG" ? "OK" : "FAIL",
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        redis: "FAIL",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
