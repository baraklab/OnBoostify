import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { refreshTokens } from "@/lib/auth/functions";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/cookies";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_PAGES = ["/login"];

const isProd = process.env.NODE_ENV === "production";
const baseCookie = { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" };

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let userId = accessToken ? await verifyAccessToken(accessToken) : null;

  // Access token missing/expired but a refresh token is present — refresh here (in proxy,
  // which can mutate response cookies) rather than in a Server Component, which can't.
  if (!userId && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed) {
      userId = await verifyAccessToken(refreshed.accessToken);
      response = NextResponse.next({ request });
      response.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.accessToken, { ...baseCookie, maxAge: ACCESS_TOKEN_MAX_AGE });
      response.cookies.set(REFRESH_TOKEN_COOKIE, refreshed.refreshToken, { ...baseCookie, maxAge: REFRESH_TOKEN_MAX_AGE });
    } else {
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
    }
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  if (isProtected && !userId) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
