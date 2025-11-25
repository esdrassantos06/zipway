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
import {
  cacheResults,
  cacheRedirect,
  checkShortIdExists,
} from "@/utils/urlCache";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  7,
);

interface RequestBody {
  targetUrl: string;
  custom_id?: string;
}

async function createLink(
  targetUrl: string,
  userId: string,
  retries = 3,
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const shortId = nanoid();
    try {
      return await prisma.link.create({
        data: {
          id: nanoid(),
          shortId,
          targetUrl,
          userId,
        },
        select: {
          shortId: true,
          targetUrl: true,
          userId: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002" && i < retries - 1) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Failed to generate unique ID");
}

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req);
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.shorten);

  const rateLimitPromise = rateLimiter(identifier);
  const sessionPromise = getSessionFromHeaders(req.headers);
  const bodyPromise = req.json() as Promise<RequestBody>;

  const [isRateLimitExceed, session, body] = await Promise.all([
    rateLimitPromise,
    sessionPromise,
    bodyPromise,
  ]);

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  if (!session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  const { targetUrl, custom_id } = body;

  const trimmedUrl = targetUrl?.trim();
  if (!trimmedUrl || !validator.isURL(trimmedUrl, { require_protocol: true })) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  let newLink;

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

    const exists = await checkShortIdExists(sanitized);
    if (exists) {
      return NextResponse.json(
        { error: "Alias already exists" },
        { status: 400 },
      );
    }

    try {
      newLink = await prisma.link.create({
        data: {
          id: nanoid(),
          shortId: sanitized,
          targetUrl: trimmedUrl,
          userId: session.user.id,
        },
        select: { shortId: true, targetUrl: true, userId: true },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Alias already exists" },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: "Error creating link" },
        { status: 500 },
      );
    }
  } else {
    try {
      newLink = await createLink(trimmedUrl, session.user.id);
    } catch (error) {
      console.error("Error generating short URL:", error);
      return NextResponse.json(
        { error: "Error generating short URL" },
        { status: 500 },
      );
    }
  }

  const responsePayload = {
    id: newLink.shortId,
    target_url: newLink.targetUrl,
    short_url: `${process.env.NEXT_PUBLIC_URL}/${newLink.shortId}`,
    userId: newLink.userId,
  };

  Promise.all([
    cacheResults([{ shortId: newLink.shortId, exists: true }]),
    cacheRedirect(newLink.shortId, newLink.targetUrl, "ACTIVE"),
  ]).catch((err) => console.error("Cache update failed asynchronously", err));

  return NextResponse.json(responsePayload);
}
