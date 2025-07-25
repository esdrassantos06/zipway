import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeAlias, validateAlias, reservedPaths } from "@/utils/sanitize";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { customAlphabet } from "nanoid";
import validator from "validator";
import { getSessionFromHeaders } from "@/utils/getSession";
import { revalidatePath } from "next/cache";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  7,
);

interface RequestBody {
  targetUrl: string;
  custom_id?: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.shorten);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { targetUrl, custom_id } = (await req.json()) as RequestBody;

  if (!validator.isURL(targetUrl)) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  let shortId = "";

  if (custom_id) {
    const sanitized = sanitizeAlias(custom_id);
    const validation = validateAlias(sanitized);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (reservedPaths.includes(sanitized)) {
      return NextResponse.json(
        { error: "This alias is reserved by the system" },
        { status: 400 },
      );
    }

    const exists = await prisma.link.findUnique({
      where: { shortId: sanitized },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Alias ​​already exists" },
        { status: 400 },
      );
    }

    shortId = sanitized;
  } else {
    let exists = true;
    while (exists) {
      shortId = nanoid();
      const existingLink = await prisma.link.findUnique({ where: { shortId } });
      exists = !!existingLink;
    }
  }

  if (!shortId) {
    return NextResponse.json(
      { error: "Failed to generate short ID" },
      { status: 500 },
    );
  }

  try {
    const newLink = await prisma.link.create({
      data: {
        id: nanoid(),
        shortId,
        targetUrl,
        userId: session.user.id,
        clicks: 0,
        createdAt: new Date(),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const short_url = `${baseUrl}/${newLink.shortId}`;

    revalidatePath("/dashboard");
    return NextResponse.json({
      id: newLink.shortId,
      target_url: newLink.targetUrl,
      short_url,
      userId: newLink.userId,
    });
  } catch (error) {
    console.error("Error creating URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
