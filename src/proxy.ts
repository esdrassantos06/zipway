import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/profile", "/admin", "/dashboard", "/settings"];
const knownRoutes = [
  ...protectedRoutes,
  "/",
  "/auth",
  "/privacy",
  "/terms",
  "/cookies",
];

const reservedSlugs = [
  "api",
  "swagger",
  "admin",
  "dashboard",
  "auth",
  "profile",
  "settings",
  "privacy",
  "terms",
  "cookies",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shly.pt";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (pathname.startsWith("/api") || pathname === "/404") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isKnownRoute = knownRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isKnownRoute) {
    return NextResponse.next();
  }

  // Extract potential slug (remove leading slash)
  const potentialSlug = pathname.slice(1);

  // Skip if it's a reserved slug or contains slashes (not a valid slug)
  if (
    !potentialSlug ||
    reservedSlugs.includes(potentialSlug.toLowerCase()) ||
    potentialSlug.includes("/")
  ) {
    return NextResponse.next();
  }

  // Try to resolve the slug via Go API
  // Using cache and timeout for performance
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const response = await fetch(
      `${API_BASE_URL}/api/resolve/${potentialSlug}`,
      {
        method: "GET",
        headers: {
          "User-Agent": req.headers.get("user-agent") || "",
        },
        redirect: "manual",
        signal: controller.signal,
        // Cache for 1 minute to reduce API calls
        next: { revalidate: 60 },
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.target_url) {
        // Redirect to the target URL with cache headers
        const redirectResponse = NextResponse.redirect(data.target_url, 301);
        // Cache the redirect for 1 minute
        redirectResponse.headers.set(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=300",
        );
        return redirectResponse;
      }
    }
  } catch (error) {
    // If API call fails or times out, continue to next handler
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Error resolving slug:", error);
    }
  }

  // If not found or error, continue to next handler
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - static files
     * - image optimization files
     * - favicon
     * - 404 page
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|404).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
