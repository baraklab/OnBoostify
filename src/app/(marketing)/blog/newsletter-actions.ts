"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notifyTelegram } from "@/lib/telegram";
import type { ActionState } from "@/lib/types/action-state";

const emailSchema = z.string().trim().email("Enter a valid email address");

export async function subscribeToNewsletter(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });

  if (error) {
    if (error.code === "23505") {
      return { status: "success" };
    }
    return { status: "error", error: "Could not subscribe right now. Please try again." };
  }

  await notifyTelegram(`📬 New newsletter subscriber: ${parsed.data}`);

  return { status: "success" };
}
