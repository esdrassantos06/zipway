import { NextRequest, NextResponse } from "next/server";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shly.pt";

const rateLimiter = createRateLimiter(DEFAULT_LIMITS.shorten);

export async function POST(req: NextRequest) {
  const [identifier, body] = await Promise.all([
    Promise.resolve(getClientIdentifier(req)),
    Promise.resolve(req.json()),
  ]);

  if (!body || !body.targetUrl) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (body.custom_id) {
    const sanitized = sanitizeAlias(body.custom_id);

    if (isReservedAlias(sanitized)) {
      return NextResponse.json(
        { error: "This alias is reserved by system" },
        { status: 400 },
      );
    }

    const validation = validateAlias(sanitized);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid alias" },
        { status: 400 },
      );
    }

    body.custom_id = sanitized;
  }

  const isRateLimitExceed = await rateLimiter(identifier);

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify({
        target_url: body.targetUrl,
        custom_slug: body.custom_id,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
