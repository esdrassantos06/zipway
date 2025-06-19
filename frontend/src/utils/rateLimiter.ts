import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const DEFAULT_LIMITS = {
  general: 100,
  shorten: 20,
  redirect: 200,
  admin: 10
};

export const createRateLimiter = (limit: number) => {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, '1 m'),
  });

  return async (identifier: string) => {
    const { success } = await ratelimit.limit(identifier);
    return success;
  };
};

export const getClientIdentifier = (req: Request) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'anonymous';
  return ip || 'anonymous';
};