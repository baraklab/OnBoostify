"use server";

import { redirect } from "next/navigation";
import * as authFn from "@/lib/auth/functions";
import {
  setSessionCookies,
  setTemporaryCookie,
  clearSessionCookies,
  getRefreshTokenCookie,
  getTemporaryTokenCookie,
} from "@/lib/auth/session";

export type AuthResult =
  | { ok: true; requiresVerification: false }
  | { ok: true; requiresVerification: true }
  | { ok: false; error: string };

async function settle(result: authFn.AuthOutcome): Promise<AuthResult> {
  if (!result.ok) return result;
  if (result.requiresVerification) {
    await setTemporaryCookie(result.pending.temporaryToken);
    return { ok: true, requiresVerification: true };
  }
  await setSessionCookies(result.tokens);
  return { ok: true, requiresVerification: false };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  return settle(await authFn.signIn(email, password));
}

export async function signup(name: string, email: string, password: string): Promise<AuthResult> {
  return settle(await authFn.signUp(name, email, password));
}

export async function signInWithGoogle(credential: string): Promise<AuthResult> {
  return settle(await authFn.signInWithGoogle(credential));
}

export async function verifyCode(code: string): Promise<AuthResult> {
  const temporaryToken = await getTemporaryTokenCookie();
  if (!temporaryToken) {
    return { ok: false, error: "Your verification session has expired. Please sign in again." };
  }
  return settle(await authFn.verifyEmail(temporaryToken, code));
}

export async function resendCode(): Promise<{ ok: true } | { ok: false; error: string }> {
  const temporaryToken = await getTemporaryTokenCookie();
  if (!temporaryToken) {
    return { ok: false, error: "Your verification session has expired. Please sign in again." };
  }
  const result = await authFn.resendVerificationCode(temporaryToken);
  if (!result.ok) return result;
  await setTemporaryCookie(result.temporaryToken);
  return { ok: true };
}

export async function requestPasswordReset(email: string) {
  return authFn.requestPasswordReset(email);
}

export async function resetPassword(
  params: { token: string; password: string } | { email: string; code: string; password: string },
) {
  return authFn.resetPassword(params);
}

export async function logout() {
  const refreshToken = await getRefreshTokenCookie();
  if (refreshToken) await authFn.logout(refreshToken);
  await clearSessionCookies();
  redirect("/");
}
