# Cache Optimization for URL Shortening API

## Overview

This document explains the cache optimization implementation for the URL shortening API, which significantly improves performance by reducing database queries and implementing batch operations.

## Architecture

### 1. Cache Layer (Redis)

- **Purpose**: Cache URL existence checks to avoid repeated database queries
- **TTL**: 1 hour (3600 seconds)
- **Key Format**: `url_exists:{shortId}`
- **Value**: `"true"` or `"false"`

### 2. Batch Operations

- **Purpose**: Check multiple generated IDs in a single database query
- **Batch Size**: 10 IDs per batch
- **Strategy**: Generate 10 IDs, check cache first, then database for uncached IDs

## How It Works

### URL Existence Check Flow

```typescript
// 1. Check cache first
const cached = await redis.get(`url_exists:${shortId}`);

// 2. If cache miss, check database
if (cached === null) {
  const exists = await prisma.link.findUnique({ where: { shortId } });
  await redis.setex(`url_exists:${shortId}`, 3600, exists ? "true" : "false");
  return !!exists;
}

// 3. Return cached result
return cached === "true";
```

### Batch ID Generation Flow

```typescript
// 1. Generate batch of IDs
const generatedIds = Array.from({ length: 10 }, () => nanoid());

// 2. Check cache for all IDs
const { existingIds, cacheHits, cacheMisses, uncachedIds } =
  await checkShortIdsBatch(generatedIds);

// 3. Check database only for uncached IDs
if (uncachedIds.length > 0) {
  const dbResults = await prisma.link.findMany({
    where: { shortId: { in: uncachedIds } },
  });

  // 4. Cache results
  await cacheResults(
    uncachedIds.map((id) => ({
      shortId: id,
      exists: dbResults.some((r) => r.shortId === id),
    })),
  );
}

// 5. Find first available ID
const availableId = generatedIds.find((id) => !existingIds.has(id));
```

## Performance Benefits

### Before Optimization

- **Custom ID**: 1 database query per check
- **Auto-generated ID**: Up to 3 database queries (one per attempt)
- **Total**: 1-3 database queries per URL creation

### After Optimization

- **Custom ID**: 0-1 database queries (cached after first check)
- **Auto-generated ID**: 0-1 database queries per batch (10 IDs checked at once)
- **Total**: 0-1 database queries per URL creation

### Cache Hit Rates

- **First request**: Cache miss, database query
- **Subsequent requests**: Cache hit, no database query
- **Expected hit rate**: 80-90% after warm-up period

## Monitoring

### Performance Logs

The API logs performance metrics for each operation:

```json
{
  "cacheHits": 8,
  "cacheMisses": 2,
  "dbQueries": 1,
  "totalIdsChecked": 10,
  "cacheHitRate": 0.8
}
```

### Cache Statistics API

Endpoint: `GET /api/cache/stats`

```json
{
  "cache": {
    "totalKeys": 1500,
    "memoryUsage": "Not available in Upstash Redis",
    "keyPrefix": "url_exists:",
    "ttl": 3600
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Configuration

### Cache Settings

```typescript
export const CACHE_CONFIG = {
  TTL: 3600, // 1 hour in seconds
  BATCH_SIZE: 10, // IDs per batch
  KEY_PREFIX: "url_exists:",
} as const;
```

### Environment Variables

- `UPSTASH_REDIS_REST_URL`: Redis connection URL
- `UPSTASH_REDIS_REST_TOKEN`: Redis authentication token

## Error Handling

### Cache Failures

- **Fallback**: Database queries when cache is unavailable
- **Logging**: All cache errors are logged for monitoring
- **Graceful degradation**: Service continues to work without cache

### Database Failures

- **Retry logic**: Up to 3 attempts for ID generation
- **Error propagation**: Clear error messages for debugging

## Maintenance

### Cache Invalidation

- **Automatic**: TTL-based expiration (1 hour)
- **Manual**: `invalidateCache(shortId)` function available
- **Bulk**: Clear all cache keys with prefix `url_exists:*`

### Monitoring Recommendations

1. Monitor cache hit rates
2. Track database query reduction
3. Monitor Redis memory usage
4. Set up alerts for cache failures

## Future Improvements

1. **Cache Warming**: Pre-populate cache with frequently accessed URLs
2. **Adaptive TTL**: Adjust TTL based on URL popularity
3. **Cache Compression**: Compress cache values for memory efficiency
4. **Multi-region**: Distribute cache across multiple regions
5. **Analytics**: Track URL creation patterns for optimization
