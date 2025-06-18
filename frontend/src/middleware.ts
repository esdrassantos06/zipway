import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// External redirect
const PROTECTED_ROUTES = [
  "api",
  "backend",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "404",
  "ads.txt",
  "profile",
  "auth",
  "admin",
  "dashboard",
];

// Login protection
const protectedRoutes = ["/profile", "/admin", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  const segments = pathname.split("/").filter(Boolean);

  const sessionCookie = getSessionCookie(request);
  const isLoggedIn = !!sessionCookie;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (segments.length === 1 && !PROTECTED_ROUTES.includes(segments[0])) {
    const newUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}${pathname}`,
      request.url,
    );
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|404).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
