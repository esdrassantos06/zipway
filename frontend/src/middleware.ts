import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "api",
  "backend",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "404",
  "ads.txt"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && !PROTECTED_ROUTES.includes(segments[0])) {
    return NextResponse.rewrite(new URL(`${process.env.NEXT_PUBLIC_API_URL}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
