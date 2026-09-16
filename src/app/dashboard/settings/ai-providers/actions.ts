"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth/session";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { aiProviderSchema } from "@/lib/validation/settings";
import { getAIProvider } from "@/lib/ai/registry";
import type { ActionState } from "@/lib/types/action-state";
import type { AIProviderIdDb } from "@/types/database";

export interface TestConnectionState {
  status: "idle" | "success" | "error";
  error?: string;
}

export async function testAIProviderConnection(
  _prev: TestConnectionState,
  formData: FormData,
): Promise<TestConnectionState> {
  const parsed = aiProviderSchema.safeParse({
    provider: formData.get("provider"),
    apiKey: formData.get("apiKey"),
    defaultModel: formData.get("defaultModel"),
  });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message };
  }

  const provider = getAIProvider(parsed.data.provider);
  const result = await provider.testConnection(parsed.data.apiKey, parsed.data.defaultModel);
  return result.ok ? { status: "success" } : { status: "error", error: result.error };
}

export async function saveAIProvider(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = aiProviderSchema.safeParse({
    provider: formData.get("provider"),
    apiKey: formData.get("apiKey"),
    defaultModel: formData.get("defaultModel"),
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message };
  }

  const userId = await getCurrentUserId();
  if (!userId) return { status: "error", error: "Not authenticated." };
  const supabase = createAdminClient();

  const providerImpl = getAIProvider(parsed.data.provider);
  const test = await providerImpl.testConnection(parsed.data.apiKey, parsed.data.defaultModel);

  if (parsed.data.isDefault) {
    await supabase.from("ai_providers").update({ is_default: false }).eq("user_id", userId);
  }

  const { error } = await supabase.from("ai_providers").upsert(
    {
      user_id: userId,
      provider: parsed.data.provider,
      encrypted_api_key: encryptSecret(parsed.data.apiKey),
      default_model: parsed.data.defaultModel,
      is_default: parsed.data.isDefault ?? false,
      last_tested_at: new Date().toISOString(),
      last_test_status: test.ok ? "success" : "failed",
    },
    { onConflict: "user_id,provider" },
  );

  if (error) return { status: "error", error: "Could not save this provider." };
  if (!test.ok) {
    return { status: "error", error: `Saved, but the connection test failed: ${test.error}` };
  }

  revalidatePath("/dashboard/settings/ai-providers");
  return { status: "success" };
}

export async function deleteAIProvider(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createAdminClient();

  await supabase.from("ai_providers").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/dashboard/settings/ai-providers");
}

export async function setDefaultAIProvider(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createAdminClient();

  await supabase.from("ai_providers").update({ is_default: false }).eq("user_id", userId);
  await supabase.from("ai_providers").update({ is_default: true }).eq("id", id).eq("user_id", userId);
  revalidatePath("/dashboard/settings/ai-providers");
}

export async function testStoredAIProviderConnection(id: string): Promise<TestConnectionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "error", error: "Not authenticated." };
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("ai_providers")
    .select("provider, encrypted_api_key, default_model")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (!data) return { status: "error", error: "Provider not found." };

  const providerImpl = getAIProvider(data.provider);
  const apiKey = decryptSecret(data.encrypted_api_key);
  const result = await providerImpl.testConnection(apiKey, data.default_model);

  await supabase
    .from("ai_providers")
    .update({ last_tested_at: new Date().toISOString(), last_test_status: result.ok ? "success" : "failed" })
    .eq("id", id);

  revalidatePath("/dashboard/settings/ai-providers");
  return result.ok ? { status: "success" } : { status: "error", error: result.error };
}

/** Server-only helper for other server code (content generation) to fetch a usable, decrypted key. */
export async function getDecryptedAIProviderKey(userId: string, providerId: AIProviderIdDb) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("ai_providers")
    .select("encrypted_api_key, default_model")
    .eq("user_id", userId)
    .eq("provider", providerId)
    .single();

  if (!data) return null;
  return { apiKey: decryptSecret(data.encrypted_api_key), model: data.default_model };
}
