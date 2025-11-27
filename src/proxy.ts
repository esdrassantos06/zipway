import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/profile", "/admin", "/dashboard", "/settings"];
const knownRoutes = ["/", "/auth", "/privacy", "/terms", "/cookies"];

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

  const potentialSlug = pathname.slice(1);

  if (
    !potentialSlug ||
    reservedSlugs.includes(potentialSlug.toLowerCase()) ||
    potentialSlug.includes("/")
  ) {
    return NextResponse.next();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await fetch(
      `${API_BASE_URL}/api/resolve/${potentialSlug}`,
      {
        method: "GET",
        headers: {
          "User-Agent": req.headers.get("user-agent") || "",
        },
        redirect: "manual",
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.target_url) {
        const resolvedStatus =
          typeof data.status === "string"
            ? data.status.toUpperCase()
            : "ACTIVE";

        if (resolvedStatus !== "ACTIVE") {
          return NextResponse.next();
        }

        const redirectResponse = NextResponse.redirect(data.target_url, 302);
        return redirectResponse;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Error resolving slug:", error);
    }
  }

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
