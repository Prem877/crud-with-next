import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//create middleware for when i have accesskey from supabase then rediect in /dashboard route otherwise redirect /auth/login route
export function middleware(req: NextRequest) {
  const accessKey = req.cookies.get("accessKey");
  const path = req.nextUrl.pathname;
  const isPublicRoute = path === "/auth/login" || path === "/auth/signup";

  if (!accessKey && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/auth/:path*"],
};
