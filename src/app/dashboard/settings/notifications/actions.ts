"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types/action-state";
import type { NotificationPreferences } from "@/types/database";

export async function updateNotificationPreferences(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "Not authenticated." };

  const preferences: NotificationPreferences = {
    scheduled_post_published: formData.get("scheduled_post_published") === "on",
    workflow_failed: formData.get("workflow_failed") === "on",
    weekly_summary: formData.get("weekly_summary") === "on",
  };

  const { error } = await supabase
    .from("profiles")
    .update({ notification_preferences: preferences })
    .eq("id", user.id);

  if (error) return { status: "error", error: "Could not save preferences." };

  revalidatePath("/dashboard/settings/notifications");
  return { status: "success" };
}
