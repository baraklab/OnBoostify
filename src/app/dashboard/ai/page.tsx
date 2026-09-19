import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Circle, Sliders } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth/session";
import { aiProviderList } from "@/lib/ai/registry";
import type { AIProviderIdDb } from "@/types/database";

export const metadata: Metadata = { title: "AI" };
export const dynamic = "force-dynamic";

export default async function AIOverviewPage() {
  const supabase = createAdminClient();
  const userId = (await getCurrentUserId())!;

  const [{ data: providers }, { count: profileCount }] = await Promise.all([
    supabase.from("ai_providers").select("provider, is_default, last_test_status").eq("user_id", userId),
    supabase.from("content_profiles").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const configured = new Map((providers ?? []).map((p) => [p.provider as AIProviderIdDb, p]));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI"
        description="Bring your own key. Oyeboost never marks up AI usage."
        action={
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings/ai-providers">
              Manage providers <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {aiProviderList.map((provider) => {
          const state = configured.get(provider.definition.id);
          return (
            <div key={provider.definition.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{provider.definition.name}</p>
                {state ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {state ? (
                  <>
                    <Badge variant={state.last_test_status === "success" ? "success" : "outline"}>
                      {state.last_test_status === "success" ? "Verified" : "Not tested"}
                    </Badge>
                    {state.is_default && <Badge variant="accent">Default</Badge>}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Not connected</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[15px] font-semibold text-foreground">Content profiles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profileCount ?? 0} saved profile{profileCount === 1 ? "" : "s"} controlling tone, audience, and
              brand voice.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/settings/content-preferences">
              <Sliders className="size-3.5" />
              Manage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
