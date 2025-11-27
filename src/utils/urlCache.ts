import { redis } from "./redis";
import { prisma } from "@/lib/prisma";

export const CACHE_CONFIG = {
  TTL: 3600,
  BATCH_SIZE: 10,
  KEY_PREFIX: "url_exists:",
} as const;

const getCacheKey = (shortId: string) => `${CACHE_CONFIG.KEY_PREFIX}${shortId}`;

export const checkShortIdExists = async (shortId: string): Promise<boolean> => {
  const cacheKey = getCacheKey(shortId);

  try {
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return cached === "true";
    }

    const dbExists = await prisma.link.findUnique({
      where: { shortId },
      select: { shortId: true },
    });

    const exists = !!dbExists;

    await redis.setex(cacheKey, CACHE_CONFIG.TTL, exists ? "true" : "false");

    return exists;
  } catch (error) {
    console.error("Error checking shortId existence:", shortId, error);

    try {
      const dbExists = await prisma.link.findUnique({
        where: { shortId },
        select: { shortId: true },
      });
      return !!dbExists;
    } catch (dbError) {
      console.error("Database fallback error:", dbError);
      return false;
    }
  }
};

export const checkShortIdsBatch = async (
  shortIds: string[],
): Promise<{
  existingIds: Set<string>;
  cacheHits: number;
  cacheMisses: number;
  uncachedIds: string[];
}> => {
  const cacheKeys = shortIds.map(getCacheKey);
  let cacheHits = 0;
  let cacheMisses = 0;

  try {
    const cachedResults = await redis.mget(...cacheKeys);

    const uncachedIds: string[] = [];
    const existingIds = new Set<string>();

    shortIds.forEach((id, index) => {
      const cached = cachedResults[index];
      if (cached === null) {
        uncachedIds.push(id);
        cacheMisses++;
      } else {
        cacheHits++;
        if (cached === "true") {
          existingIds.add(id);
        }
      }
    });

    return {
      existingIds,
      cacheHits,
      cacheMisses,
      uncachedIds,
    };
  } catch (error) {
    console.error("Batch cache error:", error);
    return {
      existingIds: new Set(),
      cacheHits: 0,
      cacheMisses: shortIds.length,
      uncachedIds: shortIds,
    };
  }
};

export const cacheResults = async (
  results: Array<{ shortId: string; exists: boolean }>,
): Promise<void> => {
  try {
    const cacheOperations = results.map(({ shortId, exists }) => {
      const cacheKey = getCacheKey(shortId);
      return redis.setex(cacheKey, CACHE_CONFIG.TTL, exists ? "true" : "false");
    });

    await Promise.all(cacheOperations);
  } catch (error) {
    console.error("Error caching results:", error);
  }
};

export const invalidateRedirectCache = async (
  shortId: string,
): Promise<void> => {
  const existsKey = getCacheKey(shortId);

  try {
    await redis.del(existsKey);
  } catch (error) {
    console.error("Error invalidating redirect cache:", shortId, error);
  }
};

export const getCacheStats = async (): Promise<{
  totalKeys: number;
  redirectKeys: number;
  memoryUsage: string;
}> => {
  try {
    const existsKeys = await redis.keys(`${CACHE_CONFIG.KEY_PREFIX}*`);

    return {
      totalKeys: existsKeys.length,
      redirectKeys: 0,
      memoryUsage: "Available via Redis INFO command",
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return {
      totalKeys: 0,
      redirectKeys: 0,
      memoryUsage: "Unknown",
    };
  }
};
