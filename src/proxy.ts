import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValidSession = Boolean(verifySessionToken(sessionCookie));

  // If visiting the login page
  if (pathname === "/admin/login") {
    if (isValidSession) {
      // Already logged in -> redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Not logged in -> permit access to login form
    return NextResponse.next();
  }

  // Protecting all other /admin routes (/admin, /admin/profile, /admin/projects, etc.)
  if (!isValidSession) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
