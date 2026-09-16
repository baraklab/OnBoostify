"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { contentProfileSchema } from "@/lib/validation/settings";
import type { ActionState } from "@/lib/types/action-state";

function parseForm(formData: FormData) {
  return contentProfileSchema.safeParse({
    name: formData.get("name"),
    tone: formData.get("tone"),
    audience: formData.get("audience"),
    brandVoice: formData.get("brandVoice"),
    length: formData.get("length"),
    formality: formData.get("formality"),
    ctaStyle: formData.get("ctaStyle"),
    topicsToAvoid: formData.get("topicsToAvoid"),
    wordsToAvoid: formData.get("wordsToAvoid"),
    personalContext: formData.get("personalContext"),
    defaultHashtags: formData.get("defaultHashtags"),
    isDefault: formData.get("isDefault") === "on",
  });
}

export async function saveContentProfile(
  profileId: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "Not authenticated." };

  const payload = {
    name: parsed.data.name,
    tone: parsed.data.tone,
    audience: parsed.data.audience || "",
    brand_voice: parsed.data.brandVoice || "",
    length: parsed.data.length,
    formality: parsed.data.formality,
    cta_style: parsed.data.ctaStyle || "",
    topics_to_avoid: parsed.data.topicsToAvoid || "",
    words_to_avoid: parsed.data.wordsToAvoid || "",
    personal_context: parsed.data.personalContext || "",
    default_hashtags: parsed.data.defaultHashtags || "",
    is_default: parsed.data.isDefault ?? false,
  };

  if (parsed.data.isDefault) {
    await supabase.from("content_profiles").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = profileId
    ? await supabase.from("content_profiles").update(payload).eq("id", profileId).eq("user_id", user.id)
    : await supabase.from("content_profiles").insert({ ...payload, user_id: user.id });

  if (error) return { status: "error", error: "Could not save this profile." };

  revalidatePath("/dashboard/settings/content-preferences");
  return { status: "success" };
}

export async function deleteContentProfile(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("content_profiles").delete().eq("id", profileId).eq("user_id", user.id);
  revalidatePath("/dashboard/settings/content-preferences");
}

export async function setDefaultContentProfile(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("content_profiles").update({ is_default: false }).eq("user_id", user.id);
  await supabase
    .from("content_profiles")
    .update({ is_default: true })
    .eq("id", profileId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/settings/content-preferences");
}
