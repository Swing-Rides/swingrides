import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isHostLoginPage = pathname.startsWith("/host/login");

  const isAdminRoute = pathname.startsWith("/admin");
  const isHostRoute = pathname.startsWith("/us/host");

  // Check for appropriate session cookie based on route
  const adminSession = request.cookies.get("admin_session")?.value;
  const hostSession = request.cookies.get("host_session")?.value;

  if (isAdminRoute && !isLoginPage && !adminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isHostRoute && !isHostLoginPage && !hostSession) {
    return NextResponse.redirect(new URL("/host/login", request.url));
  }

  if (isHostLoginPage && hostSession) {
    return NextResponse.redirect(new URL("/us/host", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/us/host/:path*"],
};
