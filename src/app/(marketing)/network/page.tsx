import Link from "next/link";
import type { Metadata } from "next";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/marketing/section-heading";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/config";
import { getBlockColorForLabel } from "@/lib/block-colors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Network",
  description: `Discover influencers, creators, and communities in the OnBoostify network — ${siteConfig.stats.users} users and ${siteConfig.stats.influencers} influencers ready to amplify launches.`,
  path: "/network",
});

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  influencer: "Influencer",
  creator: "Creator",
  community: "Community",
};

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("network_profiles")
    .select("id, display_name, category, platforms, audience_size, bio")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-eyebrow">Network</p>
          <h1 className="font-heading mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tap into {siteConfig.stats.users} users and {siteConfig.stats.influencers} influencers
            ready to amplify your launch.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            The network is where OnBoostify users, creators, and communities discover each
            other&apos;s launches. It&apos;s early — today it&apos;s a directory. Over time it
            becomes a place to find people to amplify your launch, and launches worth amplifying.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/login?mode=signup">
                Get started for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Apply to be listed</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Directory"
            title="Influencers, creators, and communities"
            description="Visible profiles are opted in by the people and communities listed here."
          />

          <div className="mt-10">
            {profiles && profiles.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile) => {
                  const color = getBlockColorForLabel(profile.category);
                  return (
                  <div key={profile.id} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-[15px] font-semibold text-foreground">
                        {profile.display_name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
                          color.bg,
                          color.fg,
                        )}
                      >
                        {categoryLabels[profile.category]}
                      </span>
                    </div>
                    {profile.bio && (
                      <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
                    )}
                    {profile.audience_size && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        ~{profile.audience_size.toLocaleString()} audience
                      </p>
                    )}
                  </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="The directory is just getting started"
                description="Be one of the first creators or communities listed — apply and we'll review it."
                action={
                  <Button variant="outline" asChild>
                    <Link href="/contact">Apply to be listed</Link>
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
