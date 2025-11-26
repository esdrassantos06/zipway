import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";

export const DEFAULT_LIMITS = {
  general: 100,
  shorten: 20,
  redirect: 200,
  search: 150,
  admin: 50,
};

export const createRateLimiter = (points: number, duration: number = 60) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "ratelimit",
    points: points,
    duration: duration,
    blockDuration: 0,
  });

  return async (identifier: string): Promise<boolean> => {
    try {
      await rateLimiter.consume(identifier);
      return true;
    } catch (error: any) {
      if (error.remainingPoints !== undefined) {
        return false;
      }
      console.error("Rate limiter error:", error);
      return true;
    }
  };
};

export const getClientIdentifier = (req: Request) => {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "anonymous";
  return ip || "anonymous";
};
