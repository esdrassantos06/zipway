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
  CACHE_CONFIG,
  checkShortIdExists,
  checkShortIdsBatch,
  cacheResults,
} from "@/utils/urlCache";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  7,
);

interface RequestBody {
  targetUrl: string;
  custom_id?: string;
}

const generateUniqueShortId = async (maxRetries = 3): Promise<string> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const generatedIds = Array.from({ length: CACHE_CONFIG.BATCH_SIZE }, () =>
      nanoid(),
    );

    const { existingIds, uncachedIds } = await checkShortIdsBatch(generatedIds);

    // Check database for uncached IDs
    if (uncachedIds.length > 0) {
      const dbResults = await prisma.link.findMany({
        where: { shortId: { in: uncachedIds } },
        select: { shortId: true },
      });

      dbResults.forEach((result) => existingIds.add(result.shortId));

      // Cache results
      const cacheData = uncachedIds.map((id) => ({
        shortId: id,
        exists: existingIds.has(id),
      }));
      await cacheResults(cacheData);
    }

    // Find first available ID
    const availableId = generatedIds.find((id) => !existingIds.has(id));
    if (availableId) return availableId;
  }

  throw new Error("Failed to generate unique short ID after multiple attempts");
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.shorten);
  const identifier = getClientIdentifier(req);
  const isRateLimitExceed = await rateLimiter(identifier);

  if (!isRateLimitExceed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const session = await getSessionFromHeaders(req.headers);
  if (!session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  // Parse request
  const { targetUrl, custom_id } = (await req.json()) as RequestBody;

  if (!validator.isURL(targetUrl)) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  let shortId: string;

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

    shortId = sanitized;
  } else {
    try {
      shortId = await generateUniqueShortId();
    } catch (error) {
      console.error("Error generating unique short ID:", error);
      return NextResponse.json(
        { error: "Error generating short URL" },
        { status: 500 },
      );
    }
  }

  let newLink;
  try {
    newLink = await prisma.link.create({
      data: {
        id: nanoid(),
        shortId,
        targetUrl,
        userId: session.user.id,
      },
      select: {
        shortId: true,
        targetUrl: true,
        userId: true,
      },
    });
  } catch (error) {
    console.error("Error creating link:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Alias already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Error creating short URL" },
      { status: 500 },
    );
  }

  // Cache the newly created URL
  await cacheResults([{ shortId, exists: true }]);

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const short_url = `${baseUrl}/${newLink.shortId}`;

  console.log("URL Shortening Performance:", {
    totalTimeMs: Date.now() - startTime,
    hasCustomId: !!custom_id,
    shortId,
    userId: session.user.id,
  });

  return NextResponse.json({
    id: newLink.shortId,
    target_url: newLink.targetUrl,
    short_url,
    userId: newLink.userId,
  });
}
