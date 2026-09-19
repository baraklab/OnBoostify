import type { Metadata } from "next";
import { ProviderCard } from "./provider-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth/session";
import { decryptSecret, maskSecret } from "@/lib/crypto";
import { aiProviderList } from "@/lib/ai/registry";
import type { AIProviderIdDb } from "@/types/database";

export const metadata: Metadata = { title: "AI providers" };
export const dynamic = "force-dynamic";

export default async function AIProvidersPage() {
  const supabase = createAdminClient();
  const userId = (await getCurrentUserId())!;

  const { data: rows } = await supabase
    .from("ai_providers")
    .select("id, provider, encrypted_api_key, default_model, is_default, last_test_status")
    .eq("user_id", userId);

  const byProvider = new Map(
    (rows ?? []).map((row) => [
      row.provider as AIProviderIdDb,
      {
        id: row.id,
        defaultModel: row.default_model,
        isDefault: row.is_default,
        lastTestStatus: row.last_test_status,
        maskedKey: maskSecret(decryptSecret(row.encrypted_api_key)),
      },
    ]),
  );

  return (
    <div>
      <h2 className="font-heading text-base font-semibold text-foreground">AI providers</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Bring your own key. Oyeboost never marks up AI usage — you connect OpenAI, Anthropic, or
        OpenRouter directly and pay that provider at their rates.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {aiProviderList.map((provider) => (
          <ProviderCard
            key={provider.definition.id}
            definition={provider.definition}
            configured={byProvider.get(provider.definition.id) ?? null}
          />
        ))}
      </div>
    </div>
  );
}
