"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { networkProfileSchema } from "@/lib/validation/network";
import type { ActionState } from "@/lib/types/action-state";

export async function saveNetworkProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = networkProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    category: formData.get("category"),
    platforms: formData.getAll("platforms"),
    audienceSize: formData.get("audienceSize") || undefined,
    bio: formData.get("bio") ?? "",
    contactUrl: formData.get("contactUrl") ?? "",
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "Not authenticated." };

  const { error } = await supabase.from("network_profiles").upsert(
    {
      user_id: user.id,
      display_name: parsed.data.displayName,
      category: parsed.data.category,
      platforms: parsed.data.platforms,
      audience_size: parsed.data.audienceSize ?? null,
      bio: parsed.data.bio || null,
      contact_url: parsed.data.contactUrl || null,
      is_visible: parsed.data.isVisible ?? false,
    },
    { onConflict: "user_id" },
  );

  if (error) return { status: "error", error: "Could not save your listing." };

  revalidatePath("/dashboard/network");
  return { status: "success" };
}
