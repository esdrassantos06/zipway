import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && !PROTECTED_ROUTES.includes(segments[0])) {
    return NextResponse.rewrite(
      new URL(`${process.env.API_BASE_URL}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
