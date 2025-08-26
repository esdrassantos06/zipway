import { NextRequest, NextResponse } from "next/server";
import { getCacheStats } from "@/utils/urlCache";
import { getSessionFromHeaders } from "@/utils/getSession";
import { UserRole } from "@/generated/prisma";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export async function GET(req: NextRequest) {
  const session = await getSessionFromHeaders(req.headers);
  const authHeader = req.headers.get("authorization");

  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const hasValidToken = authHeader === `Bearer ${ADMIN_API_TOKEN}`;

  if (!isAdmin && !hasValidToken) {
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
