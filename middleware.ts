import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isHostLoginPage = pathname.startsWith("/host/login");

  const isAdminRoute = pathname.startsWith("/admin");
  const isHostRoute = pathname.startsWith("/us/host");

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isHostRoute && !isHostLoginPage && !session) {
    return NextResponse.redirect(new URL("/host/login", request.url));
  }

  if (isHostLoginPage && session) {
    return NextResponse.redirect(new URL("/host", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/us/host/:path*"],
};
