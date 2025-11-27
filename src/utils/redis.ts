import Redis from "ioredis";

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (redisClient && redisClient.status === "ready") {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    enableReadyCheck: true,
    enableOfflineQueue: true,
    connectTimeout: 5000,
    lazyConnect: false,
    enableAutoPipelining: true,
    keepAlive: 30000,
  });

  redisClient.on("error", (err: Error) => {
    console.error("Redis Client Error:", err);
  });

  redisClient.on("connect", () => {});

  return redisClient;
}

const redis = getRedisClient();

export const redisAdapter = {
  get: async (key: string) => {
    return await redis.get(key);
  },
  set: async (key: string, value: string, ttl?: number) => {
    if (ttl) {
      return await redis.setex(key, ttl, value);
    }
    return await redis.set(key, value);
  },
  delete: async (key: string) => {
    return await redis.del(key);
  },
};

export { redis };
