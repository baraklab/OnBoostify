import { cookies } from "next/headers";
import { verifyAccessToken, verifyTemporaryToken } from "./jwt";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  TEMPORARY_TOKEN_COOKIE,
  TEMPORARY_TOKEN_MAX_AGE,
} from "./cookies";
import type { AuthTokens } from "./functions";

const isProd = process.env.NODE_ENV === "production";

const baseCookie = { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" };

/** Called from a Server Action after sign-in/verify/Google/refresh succeeds. */
export async function setSessionCookies(tokens: AuthTokens): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, { ...baseCookie, maxAge: ACCESS_TOKEN_MAX_AGE });
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, { ...baseCookie, maxAge: REFRESH_TOKEN_MAX_AGE });
  store.delete(TEMPORARY_TOKEN_COOKIE);
}

/** Called from a Server Action after sign-up/sign-in returns requiresVerification. */
export async function setTemporaryCookie(temporaryToken: string): Promise<void> {
  const store = await cookies();
  store.set(TEMPORARY_TOKEN_COOKIE, temporaryToken, { ...baseCookie, maxAge: TEMPORARY_TOKEN_MAX_AGE });
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  store.delete(TEMPORARY_TOKEN_COOKIE);
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function getTemporaryTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(TEMPORARY_TOKEN_COOKIE)?.value ?? null;
}

/** Verifies the temporary (pre-verification) token cookie and returns the pending user id. */
export async function getPendingUserId(): Promise<string | null> {
  const token = await getTemporaryTokenCookie();
  return token ? verifyTemporaryToken(token) : null;
}

/**
 * The signed-in user's id (public.users.id, as a string since it's a bigint) for Server
 * Components/Actions/Route Handlers. src/proxy.ts has already refreshed an expired access
 * token by the time a request reaches these, so this only needs a fast local JWT check —
 * no network round trip to auth-user for the common case.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function requireCurrentUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated.");
  return userId;
}
