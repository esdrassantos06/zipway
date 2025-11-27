import { NextRequest, NextResponse } from "next/server";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shly.pt";

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req);
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.shorten);
  const isRateLimitExceed = await rateLimiter(identifier);

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();

  try {
    const cookies = req.headers.get("cookie") || "";
    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      body: JSON.stringify({
        target_url: body.targetUrl,
        custom_slug: body.custom_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create short link" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to Go API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
