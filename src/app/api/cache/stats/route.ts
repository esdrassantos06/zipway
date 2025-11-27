import { NextRequest, NextResponse } from "next/server";
import { getCacheStats } from "@/utils/urlCache";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const hasValidToken = authHeader === `Bearer ${ADMIN_API_TOKEN}`;

  if (!hasValidToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getCacheStats();

    return NextResponse.json({
      cache: {
        totalKeys: stats.totalKeys,
        memoryUsage: stats.memoryUsage,
        keyPrefix: "url_exists:",
        ttl: 3600,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get cache stats",
        details: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
