import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const clientSecret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET ?? "");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin auth ---
  const adminSession = request.cookies.get("lp_session")?.value;
  const validAdminToken = process.env.ADMIN_SESSION_TOKEN;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  if (isDashboard && (!validAdminToken || adminSession !== validAdminToken)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isLogin && adminSession === validAdminToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- Client auth ---
  const isClientDashboard = pathname.startsWith("/client/dashboard");
  const isClientLogin = pathname === "/client/login";

  if (isClientDashboard) {
    const token = request.cookies.get("lp_client_session")?.value;
    if (!token) return NextResponse.redirect(new URL("/client/login", request.url));
    try {
      await jwtVerify(token, clientSecret);
    } catch {
      return NextResponse.redirect(new URL("/client/login", request.url));
    }
  }

  if (isClientLogin) {
    const token = request.cookies.get("lp_client_session")?.value;
    if (token) {
      try {
        await jwtVerify(token, clientSecret);
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      } catch {
        // invalid token, let them through to login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/client/dashboard/:path*", "/client/login"],
};
