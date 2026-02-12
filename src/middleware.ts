import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "vital_token";

const secret = new TextEncoder().encode(JWT_SECRET);

const protectedPaths = ["/dashboard", "/lawx"];
const authApiPaths = ["/api/auth/me", "/api/me/lawx-sso-token"];

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isProtectedApi(pathname: string): boolean {
  return authApiPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (isProtectedPath(pathname)) {
    if (!token || !(await verifyToken(token))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isProtectedApi(pathname)) {
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/lawx/:path*", "/api/auth/me", "/api/me/lawx-sso-token"],
};
