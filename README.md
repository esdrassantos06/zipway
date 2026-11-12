# Zipway URL Shortener

URL shortener with a Go API and a Next.js frontend. It used to run at shly.pt, which is offline now. Better Auth issues the session in the frontend; the Go service only validates the cookie. Redis sits in front of Postgres so redirects don't pay for a database round trip.

The Go API lives in its own repository: [shly-backend-go](https://github.com/esdrassantos06/shly-backend-go).

**Version:** 2.0.0

## Overview

Signed-in users create short links, optionally picking their own slug, pause or delete them, and follow each link's clicks on a dashboard. Anyone can resolve one. Four pieces:

- **Go Backend API**: built with Fiber v3, organised in Clean Architecture and documented in OpenAPI (Swagger)
- **Next.js Frontend**: Modern React application with server-side rendering
- **Redis Caching**: Redirects are served from Redis before PostgreSQL, and sessions are validated through an in-memory → Redis → PostgreSQL cascade
- **Better Auth**: Session-based authentication

## Architecture

The project follows Clean Architecture principles with clear separation of concerns:

### Backend (Go)

```
backend go/
├── cmd/
│   └── api/
│       └── main.go              # Application entry point
├── internal/
│   ├── adapters/                # External adapters
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/          # HTTP middleware (auth)
│   │   └── repositories/        # Database & cache repositories
│   └── core/                    # Business logic
│       ├── auth/                # Authentication logic
│       ├── domain/              # Domain models
│       ├── ports/               # Interfaces
│       └── services/            # Business services
├── docs/                        # Swagger documentation
└── docker-compose.yml           # Docker configuration
```

### Frontend (Next.js)

```
zipway/
├── prisma/                      # Prisma Schema and migrations
├── src/
│   ├── app/                     # Next.js app directory
│   │   ├── api/                 # API routes (proxy to Go backend)
│   │   │   └── shorten/         # URL shortening endpoint
│   │   ├── dashboard/           # User dashboard
│   │   └── ...                  # Other routes
│   ├── components/              # React components
│   ├── lib/                     # Utility functions
│   ├── utils/                   # General utilities
│   │   ├── redis.ts             # Redis client configuration
│   │   ├── urlCache.ts          # URL caching utilities
│   │   └── rateLimiter.ts       # Rate limiting
│   └── proxy.ts                 # Middleware for URL redirection
└── ...
```

## Technology Stack

### Backend

- **Language:** Go 1.25.4
- **Web Framework:** Fiber v3
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis
- **Authentication:** Better Auth (session validation)
- **Documentation:** Swagger/OpenAPI

### Frontend

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, shadcn/ui
- **ORM:** Prisma
- **Validation:** Zod
- **Cache:** Redis
- **Authentication:** Better Auth

## Features

- **Authentication Required:** All link creation requires valid Better Auth session
- **Custom Slugs:** Users can specify custom slugs for their links
- **Reserved Slugs:** System protects reserved routes (api, swagger, admin, etc.)
- **Redis Caching:** Links stay cached in Redis for 24 hours, so most redirects never reach PostgreSQL
- **User Association:** All links are associated with authenticated users
- **Click Tracking:** Clicks are counted in a background goroutine, so the redirect never waits on the write
- **Pause and Delete:** Users can pause a link (it stops resolving) or delete it from the dashboard
- **Public Resolution:** Public endpoint for link resolution (used by frontend)
- **Client-Side Validation:** Alias validation before API calls (saves 100-150ms for invalid requests)
- **Instant Redirects:** Redis cache-first lookup in the Go API, with a 500ms timeout on the frontend side

## Performance

### Backend (Go API)

- **Session Validation (cache hit):** <5µs (local in-memory cache)
- **Session Validation (cache miss):** ~10-50ms (Redis/PostgreSQL lookup)
- **Link Creation:** 50-120ms total (optimized with local session cache)
- **Redirect (cache hit):** Instant (<1ms)
- **Redirect (cache miss):** 100-150ms (includes database lookup and cache update)

### Frontend (Next.js)

- **Redirect:** One call from `proxy.ts` to the Go API (`/api/resolve/:slug`), capped by a 500ms timeout. Redirect latency is the Go API's (see above) plus one network hop
- **Link Creation:** ~220ms average (includes validation + Go API call)
  - Invalid aliases: ~1-5ms (client-side validation prevents API call)
  - Valid aliases: ~220ms (validation + Go API)

### Performance Optimizations

#### Backend Optimizations

- **Multi-tier caching:** Local in-memory cache → Redis → PostgreSQL
- **Local session cache:** Frequently accessed sessions cached in memory (<5µs access time)
- **Optimized Redis pool:** 50 connections, reduced timeouts for faster responses
- **Prepared statements:** Database queries use prepared statements for better performance

#### Frontend Optimizations

- **Single-hop redirects:** Proxy middleware makes one call to the Go API, which answers from Redis whenever it can
- **Client-side alias validation:** Validates and sanitizes aliases before API calls (saves 100-150ms for invalid requests)
- **Parallel operations:** Rate limit identifier and request body are resolved in parallel
- **Connection pooling:** Redis with auto-pipelining enabled
- **Early returns:** Fast validation checks before expensive operations
- **Reduced timeouts:** 500ms timeout for redirect API calls

## How It Works

### Authentication Flow

1. User logs in via Next.js frontend (Better Auth)
2. Better Auth creates session in PostgreSQL `session` table
3. Frontend sends requests with `__Secure-better-auth.session_token` cookie
4. Backend extracts session token from cookie
5. Backend validates session using multi-tier caching:
   - **First:** Checks local in-memory cache (<5µs for frequent sessions)
   - **Second:** Checks Redis cache with key `session:{sessionID}`
   - **Third:** Checks Redis with full token `{sessionID}` and parses JSON
   - **Fallback:** Queries PostgreSQL `session` table
   - Valid sessions are cached locally (5 min) and in Redis (5 min)
6. `userId` is stored in request context for use in handlers

### Link Creation Flow

1. Client sends POST to `/api/shorten` (Next.js API route)
2. Next.js route validates custom alias client-side (if provided):
   - Sanitizes alias (removes special chars, normalizes)
   - Checks if reserved
   - Validates format (min length, not only numbers, etc.)
   - **Saves 100-150ms for invalid aliases** (no Go API call)
3. Next.js route forwards request to Go API with session cookie
4. Go API auth middleware validates session and extracts `userId`
5. Go service generates slug (or uses custom) and creates link
6. Link saved to PostgreSQL with `userId`
7. URL cached in Redis for fast retrieval
8. Response returns short URL

### Link Resolution Flow (Redirect)

1. User visits `https://domain.com/:slug`
2. Next.js middleware (`proxy.ts`) intercepts request and skips known app routes and reserved slugs
3. Middleware calls Go API `/api/resolve/:slug` (500ms timeout)
4. Go API checks Redis first (key `url{slug}`)
   - **If cache hit:** returns the target URL straight from Redis (<1ms server-side)
   - **If cache miss:** queries PostgreSQL with a prepared statement and caches the link in Redis
5. Paused links are rejected, so the user falls through to the 404 page
6. Go API counts the click in a background goroutine (Redis counter + PostgreSQL `clicks`)
7. Middleware redirects the user to the target URL (302)
8. Cache TTL: 24 hours for redirects (Go API), 1 hour for existence checks (Next.js)

## Setup

### Prerequisites

- Go 1.25.4+ (for backend)
- Node.js 18+ (for frontend)
- Docker & Docker Compose
- Supabase account (for PostgreSQL)
- Redis (local, Supabase, or Upstash)

### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database - Supabase PostgreSQL (use Connection Pooling)
DATABASE_URL=postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Redis - Local or Supabase
REDIS_URL=redis://redis:6379

# API Configuration
BASE_URL=http://localhost:8080
ALLOWED_ORIGIN=http://localhost:3000
SHORT_URL_DOMAIN=http://localhost:3000  # Optional: Custom domain for short URLs
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.shly.pt
NEXT_PUBLIC_URL=http://localhost:3000

# Redis (Upstash or local)
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optional)
GITHUB_CLIENT_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_SECRET=...

# Email (Resend)
RESEND_API_KEY=...

# Admin
ADMIN_EMAILS=admin@example.com
ADMIN_API_TOKEN=...
```

### Running with Docker

#### Backend

```bash
cd backend-go
docker-compose up --build
```

#### Frontend

```bash
docker build -t zipway-frontend .
docker run -d --name zipway-frontend-container -p 3000:3000 --env-file .env zipway-frontend
```

### Running Locally

#### Backend

```bash
cd backend-go
go mod download
go run cmd/api/main.go
```

#### Frontend

```bash
npm install
npm run dev
```

## API Endpoints

### Public Endpoints

#### `GET /` (Backend)

Health check endpoint.

**Response:**

```json
{
  "message": "Zipway URL Shortener API",
  "version": "1.0.0",
  "status": "ok",
  "timestamp": "2025-01-26T21:00:00Z",
  "uptime": "1h30m",
  "swagger": "http://localhost:8080/swagger"
}
```

#### `GET /api/resolve/:slug` (Backend)

Resolve a shortened link (public, no auth required).

**Response (200):**

```json
{
  "target_url": "https://example.com"
}
```

**Response (404):**

```json
{
  "error": "Link not found"
}
```

### Protected Endpoints

#### `POST /api/shorten` (Frontend → Backend)

Create a shortened link (requires authentication).

**Flow:**

1. Client calls Next.js `/api/shorten`
2. Next.js validates alias (if provided) - saves 100-150ms for invalid aliases
3. Next.js forwards to Go API with session cookie
4. Go API validates session and creates link

**Headers:**

```
Content-Type: application/json
Cookie: __Secure-better-auth.session_token=YOUR_TOKEN
```

**Request Body:**

```json
{
  "targetUrl": "https://example.com",
  "custom_id": "my-link" // optional
}
```

**Response (200):**

```json
{
  "short_url": "http://localhost:8080/my-link",
  "details": {
    "id": "uuid",
    "short_id": "my-link",
    "target_url": "https://example.com",
    "user_id": "userIdFromSession",
    "status": "ACTIVE",
    "clicks": 0,
    "created_at": "2025-01-26T21:00:00Z"
  }
}
```

**Error Responses:**

- `400`: Invalid input, reserved slug, or invalid alias format
- `401`: Unauthorized (invalid/expired session)
- `409`: Custom slug already exists
- `429`: Rate limit exceeded
- `500`: Internal server error

## Reserved Slugs

Reserved slugs are blocked in two places:

- **Go API** (`internal/adapters/handlers/http_handler.go`): `api`, `swagger`, `shorten`, `admin`, `health`, `metrics`, `docs`, `static`, `assets`, `favicon.ico`
- **Next.js** (`src/utils/sanitize.ts`): a longer list that also covers every app route (`dashboard`, `auth`, `profile`, `settings`, `privacy`, `terms`...), framework paths (`_next`, `robots.txt`, `sitemap.xml`...), common system names (`www`, `mail`, `webhook`, `oauth`...) and locale codes (`pt`, `en`, `es`, `fr`, `de`). Invalid aliases are rejected here, before the Go API is called

## Database Schema

The schema is managed with Prisma (`prisma/schema.prisma`). Better Auth owns the `user`, `session`, `account` and `verification` tables; the Go API reads `session` to validate cookies.

### Links Table (`urls`)

| Column       | Type                 | Notes                      |
| ------------ | -------------------- | -------------------------- |
| `id`         | `String`             | Primary key (UUID)         |
| `shortId`    | `String`             | Unique slug                |
| `target_url` | `String`             | Destination URL            |
| `userId`     | `String?`            | Owner (Better Auth user)   |
| `clicks`     | `Int`                | Defaults to 0              |
| `status`     | `ACTIVE` \| `PAUSED` | Paused links don't resolve |
| `createdAt`  | `DateTime`           | Defaults to now            |

Indexes on `userId`, `status`, `(userId, status)` and `(userId, createdAt desc)` keep the dashboard queries fast.

## UI Customization

The project uses Tailwind CSS with custom theme variables. To modify the theme:

1. Adjust color variables in `src/app/globals.css`
2. Use Tailwind utility classes for component styling
3. Modify shadcn/ui components in the `src/components/ui` directory

## Development

### Backend

#### Generate Swagger Documentation

```bash
cd backend-go
swag init -g cmd/api/main.go -o docs
```

### Frontend

#### Running Tests

32 Jest tests, run in CI together with ESLint, Prettier and a production build.

```bash
npm test
# or
npm run test:watch
```

### Code Structure Principles

- **Clean Architecture:** Separation of business logic from infrastructure
- **Dependency Injection:** Interfaces for testability
- **Single Responsibility:** Each package has a clear purpose
- **Performance First:** Optimized queries, Redis caching, async operations
- **Client-Side Validation:** Validate early to avoid unnecessary API calls

## Production Considerations

1. **Environment Variables:** Use secure secret management
2. **Database Connection Pooling:** Already configured for Supabase
3. **Redis Persistence:** Configure Redis persistence for production
4. **Rate Limiting:** Implemented on frontend API routes
5. **Monitoring:** Add logging and metrics collection
6. **HTTPS:** Ensure all connections use HTTPS in production
7. **Session Validation:** Optimized with multi-tier caching (local memory → Redis → PostgreSQL)
8. **Cache Strategy:**
   - Redirects: 24 hours TTL (Go API)
   - Existence checks: 1 hour TTL
   - Session cache: 5 minutes (local + Redis)
9. **Error Handling:** Graceful degradation if Redis is unavailable

## Performance Benchmarks

### Redirect Performance

- **Cache Hit (Go API, server-side):** <1ms
- **Cache Miss:** 100-150ms (includes PostgreSQL lookup + cache update)

### Link Creation Performance

- **Invalid Alias:** 1-5ms (client-side validation)
- **Valid Alias:** ~220ms average (validation + Go API)

### Cache Hit Rates

- **Redirects:** ~80-90% (for popular links)
- **Sessions:** ~95%+ (for active users)

## License

MIT, see [LICENSE](LICENSE).

## Author

[Esdras Santos](https://github.com/esdrassantos06)
