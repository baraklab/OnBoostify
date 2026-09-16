"use server";

import { notifyTelegram } from "@/lib/telegram";

export async function notifySignup(email: string, fullName: string) {
  await notifyTelegram(`🚀 New OnBoostify signup: ${fullName} <${email}>`);
}
