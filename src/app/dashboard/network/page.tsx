import type { Metadata } from "next";
import { Network as NetworkIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ListingForm } from "./listing-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Network" };
export const dynamic = "force-dynamic";

export default async function DashboardNetworkPage() {
  const supabase = createAdminClient();
  const userId = (await getCurrentUserId())!;

  const [{ data: own }, { data: directory }] = await Promise.all([
    supabase
      .from("network_profiles")
      .select("display_name, category, platforms, audience_size, bio, contact_url, is_visible")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("network_profiles")
      .select("id, display_name, category, bio")
      .eq("is_visible", true)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Network"
        description="Get discovered by other OnBoostify users looking to amplify a launch."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-[15px] font-semibold text-foreground">Your listing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill this in and make it visible to appear in the public network directory.
          </p>
          <div className="mt-5">
            <ListingForm
              listing={
                own
                  ? {
                      displayName: own.display_name,
                      category: own.category,
                      platforms: own.platforms,
                      audienceSize: own.audience_size,
                      bio: own.bio ?? "",
                      contactUrl: own.contact_url ?? "",
                      isVisible: own.is_visible,
                    }
                  : null
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-[15px] font-semibold text-foreground">Directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">Recently listed creators and communities.</p>
          <div className="mt-5">
            {directory && directory.length > 0 ? (
              <div className="flex flex-col divide-y divide-border">
                {directory.map((profile) => (
                  <div key={profile.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{profile.display_name}</p>
                      {profile.bio && <p className="mt-0.5 text-xs text-muted-foreground">{profile.bio}</p>}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {profile.category}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={NetworkIcon}
                title="The directory is still small"
                description="Be one of the first to list yourself and get discovered."
                className="border-0 py-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
