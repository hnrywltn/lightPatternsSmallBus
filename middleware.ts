import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("lp_session")?.value;
  const validToken = process.env.ADMIN_SESSION_TOKEN;

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLogin = request.nextUrl.pathname === "/login";

  if (isDashboard && session !== validToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in, redirect away from login
  if (isLogin && session === validToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
